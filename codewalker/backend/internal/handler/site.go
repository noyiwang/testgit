package handler

import (
	"codewalker/internal/model"
	"codewalker/internal/repository"
	"codewalker/pkg/response"

	"github.com/gin-gonic/gin"
)

type SiteHandler struct {
	articleRepo    *repository.ArticleRepository
	courseRepo     *repository.CourseRepository
	projectRepo    *repository.ProjectRepository
	subscriberRepo *repository.SubscriberRepository
}

func NewSiteHandler(
	articleRepo *repository.ArticleRepository,
	courseRepo *repository.CourseRepository,
	projectRepo *repository.ProjectRepository,
	subscriberRepo *repository.SubscriberRepository,
) *SiteHandler {
	return &SiteHandler{
		articleRepo:    articleRepo,
		courseRepo:     courseRepo,
		projectRepo:    projectRepo,
		subscriberRepo: subscriberRepo,
	}
}

func (h *SiteHandler) Stats(c *gin.Context) {
	articleCount, _ := h.articleRepo.Count()
	courseCount, _ := h.courseRepo.Count()
	projectCount, _ := h.projectRepo.Count()
	studentCount, _ := h.courseRepo.SumStudents()
	subscriberCount, _ := h.subscriberRepo.Count()

	stats := model.SiteStats{
		ArticleCount:    articleCount,
		CourseCount:     courseCount,
		ProjectCount:    projectCount,
		StudentCount:    studentCount,
		SubscriberCount: subscriberCount,
	}

	response.Success(c, stats)
}

func (h *SiteHandler) Health(c *gin.Context) {
	response.Success(c, gin.H{
		"status":  "ok",
		"service": "codewalker-api",
	})
}
