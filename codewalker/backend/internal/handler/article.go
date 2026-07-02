package handler

import (
	"codewalker/internal/model"
	"codewalker/internal/repository"
	"codewalker/pkg/response"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
)

type ArticleHandler struct {
	repo *repository.ArticleRepository
}

func NewArticleHandler(repo *repository.ArticleRepository) *ArticleHandler {
	return &ArticleHandler{repo: repo}
}

func (h *ArticleHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	category := c.Query("category")
	keyword := c.Query("keyword")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}

	articles, total, err := h.repo.GetList(page, pageSize, category, keyword)
	if err != nil {
		response.InternalError(c, "Failed to fetch articles")
		return
	}

	response.SuccessWithPage(c, articles, total, page, pageSize)
}

func (h *ArticleHandler) AdminList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	category := c.Query("category")
	keyword := c.Query("keyword")
	statusStr := c.Query("status")
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortOrder := c.DefaultQuery("sort_order", "desc")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	params := repository.AdminListParams{
		Page:      page,
		PageSize:  pageSize,
		Category:  category,
		Keyword:   keyword,
		SortBy:    sortBy,
		SortOrder: sortOrder,
	}

	if statusStr != "" && statusStr != "all" {
		status, err := strconv.Atoi(statusStr)
		if err == nil {
			params.Status = &status
		}
	}

	articles, total, err := h.repo.AdminList(params)
	if err != nil {
		response.InternalError(c, "Failed to fetch articles")
		return
	}

	response.SuccessWithPage(c, articles, total, page, pageSize)
}

func (h *ArticleHandler) AdminStats(c *gin.Context) {
	stats, err := h.repo.GetAdminStats()
	if err != nil {
		response.InternalError(c, "Failed to fetch stats")
		return
	}
	response.Success(c, stats)
}

func (h *ArticleHandler) AdminDrafts(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit < 1 || limit > 20 {
		limit = 5
	}
	articles, err := h.repo.GetRecentDrafts(limit)
	if err != nil {
		response.InternalError(c, "Failed to fetch drafts")
		return
	}
	response.Success(c, articles)
}

func (h *ArticleHandler) Featured(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "3"))
	articles, err := h.repo.GetFeatured(limit)
	if err != nil {
		response.InternalError(c, "Failed to fetch featured articles")
		return
	}
	response.Success(c, articles)
}

func (h *ArticleHandler) Detail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	article, err := h.repo.GetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Article not found")
		return
	}
	response.Success(c, article)
}

func (h *ArticleHandler) AdminDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	article, err := h.repo.AdminGetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Article not found")
		return
	}
	response.Success(c, article)
}

func (h *ArticleHandler) DetailBySlug(c *gin.Context) {
	slug := c.Param("slug")
	article, err := h.repo.GetBySlug(slug)
	if err != nil {
		response.NotFound(c, "Article not found")
		return
	}
	response.Success(c, article)
}

func (h *ArticleHandler) Related(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	category := c.Query("category")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "4"))

	articles, err := h.repo.GetRelated(uint(id), category, limit)
	if err != nil {
		response.InternalError(c, "Failed to fetch related articles")
		return
	}
	response.Success(c, articles)
}

func (h *ArticleHandler) Like(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	if err := h.repo.IncrementLikes(uint(id)); err != nil {
		response.InternalError(c, "Failed to like article")
		return
	}
	response.Success(c, gin.H{"message": "Liked successfully"})
}

func (h *ArticleHandler) Categories(c *gin.Context) {
	categories, err := h.repo.GetCategoriesWithCount()
	if err != nil {
		response.InternalError(c, "Failed to fetch categories")
		return
	}
	response.Success(c, categories)
}

func (h *ArticleHandler) AdminCategories(c *gin.Context) {
	categories, err := h.repo.AdminGetCategories()
	if err != nil {
		response.InternalError(c, "Failed to fetch categories")
		return
	}
	response.Success(c, categories)
}

func (h *ArticleHandler) Tags(c *gin.Context) {
	tags, err := h.repo.GetTags()
	if err != nil {
		response.InternalError(c, "Failed to fetch tags")
		return
	}
	response.Success(c, tags)
}

type ArticleRequest struct {
	Title         string `json:"title"`
	Slug          string `json:"slug"`
	Summary       string `json:"summary"`
	Content       string `json:"content"`
	Cover         string `json:"cover"`
	Category      string `json:"category"`
	Tags          string `json:"tags"`
	IsPinned      bool   `json:"is_pinned"`
	IsFeatured    bool   `json:"is_featured"`
	AllowComments bool   `json:"allow_comments"`
	Status        int    `json:"status"`
}

func generateSlug(title string) string {
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	reg := regexp.MustCompile(`[^a-z0-9\u4e00-\u9fa5-]`)
	slug = reg.ReplaceAllString(slug, "")
	slug = strings.Trim(slug, "-")
	if slug == "" {
		slug = "article-" + strconv.FormatInt(time.Now().Unix(), 10)
	}
	return slug
}

func calculateWordCount(content string) int {
	return utf8.RuneCountInString(strings.ReplaceAll(content, "\n", ""))
}

func calculateReadTime(wordCount int) int {
	if wordCount <= 0 {
		return 1
	}
	return (wordCount / 300) + 1
}

func (h *ArticleHandler) Create(c *gin.Context) {
	var req ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}

	if req.Title == "" {
		response.BadRequest(c, "Title is required")
		return
	}

	slug := req.Slug
	if slug == "" {
		slug = generateSlug(req.Title)
	}

	if h.repo.SlugExists(slug, 0) {
		slug = slug + "-" + strconv.FormatInt(time.Now().Unix(), 10)
	}

	wordCount := calculateWordCount(req.Content)
	readTime := calculateReadTime(wordCount)

	article := &model.Article{
		Title:         req.Title,
		Slug:          slug,
		Summary:       req.Summary,
		Content:       req.Content,
		Cover:         req.Cover,
		Category:      req.Category,
		Tags:          req.Tags,
		IsPinned:      req.IsPinned,
		IsFeatured:    req.IsFeatured,
		AllowComments: req.AllowComments,
		Status:        req.Status,
		WordCount:     wordCount,
		ReadTime:      readTime,
		Views:         0,
		Likes:         0,
	}

	if article.Status == 0 {
		article.Status = model.ArticleStatusDraft
	}

	if article.Status == model.ArticleStatusPublished {
		article.PublishedAt = time.Now()
	}

	if err := h.repo.Create(article); err != nil {
		response.InternalError(c, "Failed to create article")
		return
	}

	response.Success(c, article)
}

func (h *ArticleHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	existing, err := h.repo.AdminGetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Article not found")
		return
	}

	var req ArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}

	if req.Title == "" {
		response.BadRequest(c, "Title is required")
		return
	}

	slug := req.Slug
	if slug == "" {
		slug = generateSlug(req.Title)
	}

	if h.repo.SlugExists(slug, uint(id)) {
		response.BadRequest(c, "Slug already exists")
		return
	}

	wordCount := calculateWordCount(req.Content)
	readTime := calculateReadTime(wordCount)

	existing.Title = req.Title
	existing.Slug = slug
	existing.Summary = req.Summary
	existing.Content = req.Content
	existing.Cover = req.Cover
	existing.Category = req.Category
	existing.Tags = req.Tags
	existing.IsPinned = req.IsPinned
	existing.IsFeatured = req.IsFeatured
	existing.AllowComments = req.AllowComments
	existing.WordCount = wordCount
	existing.ReadTime = readTime

	prevStatus := existing.Status
	existing.Status = req.Status

	if prevStatus != model.ArticleStatusPublished && existing.Status == model.ArticleStatusPublished {
		existing.PublishedAt = time.Now()
	}

	if err := h.repo.Update(existing); err != nil {
		response.InternalError(c, "Failed to update article")
		return
	}

	response.Success(c, existing)
}

type BatchStatusRequest struct {
	IDs    []uint `json:"ids"`
	Status int    `json:"status"`
}

func (h *ArticleHandler) BatchUpdateStatus(c *gin.Context) {
	var req BatchStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if len(req.IDs) == 0 {
		response.BadRequest(c, "No articles selected")
		return
	}

	if err := h.repo.UpdateStatus(req.IDs, req.Status); err != nil {
		response.InternalError(c, "Failed to batch update articles")
		return
	}

	response.Success(c, gin.H{"message": "Updated successfully", "count": len(req.IDs)})
}

type BatchDeleteRequest struct {
	IDs []uint `json:"ids"`
}

func (h *ArticleHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	if err := h.repo.Delete(uint(id)); err != nil {
		response.InternalError(c, "Failed to delete article")
		return
	}

	response.Success(c, gin.H{"message": "Deleted successfully"})
}

func (h *ArticleHandler) BatchDelete(c *gin.Context) {
	var req BatchDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if len(req.IDs) == 0 {
		response.BadRequest(c, "No articles selected")
		return
	}

	if err := h.repo.BatchDelete(req.IDs); err != nil {
		response.InternalError(c, "Failed to batch delete articles")
		return
	}

	response.Success(c, gin.H{"message": "Deleted successfully", "count": len(req.IDs)})
}
