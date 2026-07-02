package handler

import (
	"codewalker/internal/repository"
	"codewalker/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CourseHandler struct {
	repo *repository.CourseRepository
}

func NewCourseHandler(repo *repository.CourseRepository) *CourseHandler {
	return &CourseHandler{repo: repo}
}

func (h *CourseHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	category := c.Query("category")
	isFreeStr := c.Query("is_free")

	var isFree *bool
	if isFreeStr != "" {
		val := isFreeStr == "true" || isFreeStr == "1"
		isFree = &val
	}

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}

	courses, total, err := h.repo.GetList(page, pageSize, category, isFree)
	if err != nil {
		response.InternalError(c, "Failed to fetch courses")
		return
	}

	response.SuccessWithPage(c, courses, total, page, pageSize)
}

func (h *CourseHandler) Hot(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "4"))
	courses, err := h.repo.GetHot(limit)
	if err != nil {
		response.InternalError(c, "Failed to fetch hot courses")
		return
	}
	response.Success(c, courses)
}

func (h *CourseHandler) Detail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid course ID")
		return
	}

	course, err := h.repo.GetByID(uint(id))
	if err != nil {
		response.NotFound(c, "Course not found")
		return
	}
	response.Success(c, course)
}

func (h *CourseHandler) Categories(c *gin.Context) {
	categories, err := h.repo.GetCategories()
	if err != nil {
		response.InternalError(c, "Failed to fetch categories")
		return
	}
	response.Success(c, categories)
}
