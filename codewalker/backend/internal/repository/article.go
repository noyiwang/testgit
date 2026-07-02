package repository

import (
	"codewalker/internal/model"
	"strings"
	"time"

	"gorm.io/gorm"
)

type ArticleRepository struct {
	db *gorm.DB
}

func NewArticleRepository(db *gorm.DB) *ArticleRepository {
	return &ArticleRepository{db: db}
}

func (r *ArticleRepository) GetList(page, pageSize int, category, keyword string) ([]model.Article, int64, error) {
	var articles []model.Article
	var total int64

	query := r.db.Model(&model.Article{}).Where("status = ?", model.ArticleStatusPublished)

	if category != "" && category != "all" {
		query = query.Where("category = ?", category)
	}

	if keyword != "" {
		query = query.Where("title LIKE ? OR summary LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Order("is_pinned DESC, published_at DESC").Offset(offset).Limit(pageSize).Find(&articles).Error; err != nil {
		return nil, 0, err
	}

	return articles, total, nil
}

type AdminListParams struct {
	Page      int
	PageSize  int
	Status    *int
	Category  string
	Keyword   string
	SortBy    string
	SortOrder string
}

func (r *ArticleRepository) AdminList(params AdminListParams) ([]model.Article, int64, error) {
	var articles []model.Article
	var total int64

	query := r.db.Model(&model.Article{})

	if params.Status != nil {
		query = query.Where("status = ?", *params.Status)
	}

	if params.Category != "" && params.Category != "all" {
		query = query.Where("category = ?", params.Category)
	}

	if params.Keyword != "" {
		query = query.Where("title LIKE ? OR summary LIKE ?", "%"+params.Keyword+"%", "%"+params.Keyword+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	orderClause := "created_at DESC"
	switch params.SortBy {
	case "title":
		orderClause = "title " + normalizeOrder(params.SortOrder)
	case "views":
		orderClause = "views " + normalizeOrder(params.SortOrder)
	case "published_at":
		orderClause = "published_at " + normalizeOrder(params.SortOrder)
	case "updated_at":
		orderClause = "updated_at DESC"
	default:
		orderClause = "created_at DESC"
	}

	offset := (params.Page - 1) * params.PageSize
	if err := query.Order("is_pinned DESC, " + orderClause).Offset(offset).Limit(params.PageSize).Find(&articles).Error; err != nil {
		return nil, 0, err
	}

	return articles, total, nil
}

func normalizeOrder(order string) string {
	if strings.ToLower(order) == "asc" {
		return "ASC"
	}
	return "DESC"
}

func (r *ArticleRepository) GetFeatured(limit int) ([]model.Article, error) {
	var articles []model.Article
	err := r.db.Where("status = ? AND is_featured = ?", model.ArticleStatusPublished, true).
		Order("is_pinned DESC, published_at DESC").Limit(limit).Find(&articles).Error
	return articles, err
}

func (r *ArticleRepository) GetByID(id uint) (*model.Article, error) {
	var article model.Article
	err := r.db.Where("id = ? AND status = ?", id, model.ArticleStatusPublished).First(&article).Error
	if err != nil {
		return nil, err
	}

	r.db.Model(&article).Update("views", gorm.Expr("views + ?", 1))
	return &article, nil
}

func (r *ArticleRepository) AdminGetByID(id uint) (*model.Article, error) {
	var article model.Article
	err := r.db.Where("id = ?", id).First(&article).Error
	if err != nil {
		return nil, err
	}
	return &article, nil
}

func (r *ArticleRepository) GetBySlug(slug string) (*model.Article, error) {
	var article model.Article
	err := r.db.Where("slug = ? AND status = ?", slug, model.ArticleStatusPublished).First(&article).Error
	if err != nil {
		return nil, err
	}

	r.db.Model(&article).Update("views", gorm.Expr("views + ?", 1))
	return &article, nil
}

func (r *ArticleRepository) GetRelated(id uint, category string, limit int) ([]model.Article, error) {
	var articles []model.Article
	err := r.db.Where("id != ? AND category = ? AND status = ?", id, category, model.ArticleStatusPublished).
		Order("published_at DESC").Limit(limit).Find(&articles).Error
	return articles, err
}

func (r *ArticleRepository) IncrementLikes(id uint) error {
	return r.db.Model(&model.Article{}).Where("id = ?", id).Update("likes", gorm.Expr("likes + ?", 1)).Error
}

type CategoryCount struct {
	Name  string `json:"name"`
	Count int64  `json:"count"`
}

func (r *ArticleRepository) GetCategoriesWithCount() ([]CategoryCount, error) {
	var results []CategoryCount
	err := r.db.Model(&model.Article{}).
		Select("category as name, COUNT(*) as count").
		Where("status = ? AND category != ?", model.ArticleStatusPublished, "").
		Group("category").
		Order("count DESC").
		Find(&results).Error
	return results, err
}

func (r *ArticleRepository) GetCategories() ([]string, error) {
	var categories []string
	err := r.db.Model(&model.Article{}).Where("status = ?", model.ArticleStatusPublished).
		Distinct("category").Pluck("category", &categories).Error
	return categories, err
}

func (r *ArticleRepository) AdminGetCategories() ([]string, error) {
	var categories []string
	err := r.db.Model(&model.Article{}).Distinct("category").Pluck("category", &categories).Error
	return categories, err
}

func (r *ArticleRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.Article{}).Where("status = ?", model.ArticleStatusPublished).Count(&count).Error
	return count, err
}

type AdminStats struct {
	TotalArticles   int64 `json:"total_articles"`
	PublishedCount  int64 `json:"published"`
	DraftCount      int64 `json:"draft"`
	ArchivedCount   int64 `json:"archived"`
	MonthlyViews    int64 `json:"monthly_views"`
}

func (r *ArticleRepository) GetAdminStats() (*AdminStats, error) {
	var stats AdminStats

	r.db.Model(&model.Article{}).Count(&stats.TotalArticles)
	r.db.Model(&model.Article{}).Where("status = ?", model.ArticleStatusPublished).Count(&stats.PublishedCount)
	r.db.Model(&model.Article{}).Where("status = ?", model.ArticleStatusDraft).Count(&stats.DraftCount)
	r.db.Model(&model.Article{}).Where("status = ?", model.ArticleStatusArchived).Count(&stats.ArchivedCount)

	firstDayOfMonth := time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Now().Location())
	r.db.Model(&model.Article{}).Where("updated_at >= ?", firstDayOfMonth).
		Select("COALESCE(SUM(views), 0)").Scan(&stats.MonthlyViews)

	return &stats, nil
}

func (r *ArticleRepository) GetTags() ([]map[string]interface{}, error) {
	type TagCount struct {
		Tag   string
		Count int64
	}
	var results []TagCount
	err := r.db.Model(&model.Article{}).
		Select("tags, COUNT(*) as count").
		Where("status = ?", model.ArticleStatusPublished).
		Group("tags").
		Find(&results).Error

	tags := make([]map[string]interface{}, 0)
	for _, r := range results {
		tagList := strings.Split(r.Tag, ",")
		for _, tag := range tagList {
			tag = strings.TrimSpace(tag)
			if tag != "" {
				found := false
				for _, t := range tags {
					if t["name"] == tag {
						t["count"] = t["count"].(int64) + r.Count
						found = true
						break
					}
				}
				if !found {
					tags = append(tags, map[string]interface{}{
						"name":  tag,
						"count": r.Count,
					})
				}
			}
		}
	}
	return tags, err
}

func (r *ArticleRepository) Create(article *model.Article) error {
	return r.db.Create(article).Error
}

func (r *ArticleRepository) Update(article *model.Article) error {
	return r.db.Save(article).Error
}

func (r *ArticleRepository) UpdateStatus(ids []uint, status int) error {
	updates := map[string]interface{}{
		"status": status,
	}
	if status == model.ArticleStatusPublished {
		updates["published_at"] = time.Now()
	}
	return r.db.Model(&model.Article{}).Where("id IN ?", ids).Updates(updates).Error
}

func (r *ArticleRepository) Delete(id uint) error {
	return r.db.Delete(&model.Article{}, id).Error
}

func (r *ArticleRepository) BatchDelete(ids []uint) error {
	return r.db.Where("id IN ?", ids).Delete(&model.Article{}).Error
}

func (r *ArticleRepository) GetRecentDrafts(limit int) ([]model.Article, error) {
	var articles []model.Article
	err := r.db.Where("status = ?", model.ArticleStatusDraft).
		Order("updated_at DESC").Limit(limit).Find(&articles).Error
	return articles, err
}

func (r *ArticleRepository) SlugExists(slug string, excludeID uint) bool {
	var count int64
	query := r.db.Model(&model.Article{}).Where("slug = ?", slug)
	if excludeID > 0 {
		query = query.Where("id != ?", excludeID)
	}
	query.Count(&count)
	return count > 0
}
