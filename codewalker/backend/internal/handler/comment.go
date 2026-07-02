package handler

import (
	"codewalker/internal/model"
	"codewalker/internal/repository"
	"codewalker/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CommentHandler struct {
	repo *repository.CommentRepository
}

func NewCommentHandler(repo *repository.CommentRepository) *CommentHandler {
	return &CommentHandler{repo: repo}
}

func (h *CommentHandler) ListByArticle(c *gin.Context) {
	articleIDStr := c.Param("article_id")
	articleID, err := strconv.ParseUint(articleIDStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid article ID")
		return
	}

	comments, err := h.repo.GetByArticleID(uint(articleID))
	if err != nil {
		response.InternalError(c, "Failed to fetch comments")
		return
	}
	response.Success(c, comments)
}

func (h *CommentHandler) Create(c *gin.Context) {
	var req struct {
		ArticleID uint   `json:"article_id" binding:"required"`
		Nickname  string `json:"nickname" binding:"required,max=50"`
		Email     string `json:"email" binding:"required,email,max=100"`
		Website   string `json:"website" binding:"omitempty,max=200"`
		Content   string `json:"content" binding:"required"`
		ParentID  *uint  `json:"parent_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	comment := &model.Comment{
		ArticleID: req.ArticleID,
		Nickname:  req.Nickname,
		Email:     req.Email,
		Website:   req.Website,
		Content:   req.Content,
		ParentID:  req.ParentID,
	}

	if err := h.repo.Create(comment); err != nil {
		response.InternalError(c, "Failed to create comment")
		return
	}
	response.Success(c, comment)
}
