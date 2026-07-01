package handler

import (
	"codewalker/internal/repository"
	"codewalker/pkg/response"
	"strconv"

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
	categories, err := h.repo.GetCategories()
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
