package handler

import (
	"codewalker/internal/repository"
	"codewalker/pkg/response"
	"net/mail"

	"github.com/gin-gonic/gin"
)

type SubscriberHandler struct {
	repo *repository.SubscriberRepository
}

func NewSubscriberHandler(repo *repository.SubscriberRepository) *SubscriberHandler {
	return &SubscriberHandler{repo: repo}
}

func (h *SubscriberHandler) Subscribe(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Email is required")
		return
	}

	if _, err := mail.ParseAddress(req.Email); err != nil {
		response.BadRequest(c, "Invalid email format")
		return
	}

	exists, err := h.repo.Exists(req.Email)
	if err != nil {
		response.InternalError(c, "Failed to check subscription")
		return
	}
	if exists {
		response.BadRequest(c, "Email already subscribed")
		return
	}

	if err := h.repo.Create(req.Email); err != nil {
		response.InternalError(c, "Failed to subscribe")
		return
	}
	response.Success(c, gin.H{"message": "Subscribed successfully"})
}
