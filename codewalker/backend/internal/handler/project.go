package handler

import (
	"codewalker/internal/repository"
	"codewalker/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	repo *repository.ProjectRepository
}

func NewProjectHandler(repo *repository.ProjectRepository) *ProjectHandler {
	return &ProjectHandler{repo: repo}
}

func (h *ProjectHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	language := c.Query("language")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}

	projects, total, err := h.repo.GetList(page, pageSize, language)
	if err != nil {
		response.InternalError(c, "Failed to fetch projects")
		return
	}

	response.SuccessWithPage(c, projects, total, page, pageSize)
}

func (h *ProjectHandler) Featured(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "3"))
	projects, err := h.repo.GetFeatured(limit)
	if err != nil {
		response.InternalError(c, "Failed to fetch featured projects")
		return
	}
	response.Success(c, projects)
}

func (h *ProjectHandler) Detail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid project ID")
		return
	}

	project, err := h.repo.GetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Project not found")
		return
	}
	response.Success(c, project)
}

func (h *ProjectHandler) Languages(c *gin.Context) {
	languages, err := h.repo.GetLanguages()
	if err != nil {
		response.InternalError(c, "Failed to fetch languages")
		return
	}
	response.Success(c, languages)
}
