package repository

import (
	"codewalker/internal/model"

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

	query := r.db.Model(&model.Article{}).Where("status = ?", 1)

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
	if err := query.Order("published_at DESC").Offset(offset).Limit(pageSize).Find(&articles).Error; err != nil {
		return nil, 0, err
	}

	return articles, total, nil
}

func (r *ArticleRepository) GetFeatured(limit int) ([]model.Article, error) {
	var articles []model.Article
	err := r.db.Where("status = ? AND is_featured = ?", 1, true).Order("published_at DESC").Limit(limit).Find(&articles).Error
	return articles, err
}

func (r *ArticleRepository) GetByID(id uint) (*model.Article, error) {
	var article model.Article
	err := r.db.Where("id = ? AND status = ?", id, 1).First(&article).Error
	if err != nil {
		return nil, err
	}

	r.db.Model(&article).Update("views", gorm.Expr("views + ?", 1))
	return &article, nil
}

func (r *ArticleRepository) GetBySlug(slug string) (*model.Article, error) {
	var article model.Article
	err := r.db.Where("slug = ? AND status = ?", slug, 1).First(&article).Error
	if err != nil {
		return nil, err
	}

	r.db.Model(&article).Update("views", gorm.Expr("views + ?", 1))
	return &article, nil
}

func (r *ArticleRepository) GetRelated(id uint, category string, limit int) ([]model.Article, error) {
	var articles []model.Article
	err := r.db.Where("id != ? AND category = ? AND status = ?", id, category, 1).
		Order("published_at DESC").Limit(limit).Find(&articles).Error
	return articles, err
}

func (r *ArticleRepository) IncrementLikes(id uint) error {
	return r.db.Model(&model.Article{}).Where("id = ?", id).Update("likes", gorm.Expr("likes + ?", 1)).Error
}

func (r *ArticleRepository) GetCategories() ([]string, error) {
	var categories []string
	err := r.db.Model(&model.Article{}).Where("status = ?", 1).Distinct("category").Pluck("category", &categories).Error
	return categories, err
}

func (r *ArticleRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.Article{}).Where("status = ?", 1).Count(&count).Error
	return count, err
}

func (r *ArticleRepository) GetTags() ([]map[string]interface{}, error) {
	type TagCount struct {
		Tag   string
		Count int64
	}
	var results []TagCount
	err := r.db.Model(&model.Article{}).
		Select("tags, COUNT(*) as count").
		Where("status = ?", 1).
		Group("tags").
		Find(&results).Error

	tags := make([]map[string]interface{}, 0)
	for _, r := range results {
		tags = append(tags, map[string]interface{}{
			"name":  r.Tag,
			"count": r.Count,
		})
	}
	return tags, err
}
