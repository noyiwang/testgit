package repository

import (
	"codewalker/internal/model"

	"gorm.io/gorm"
)

type CourseRepository struct {
	db *gorm.DB
}

func NewCourseRepository(db *gorm.DB) *CourseRepository {
	return &CourseRepository{db: db}
}

func (r *CourseRepository) GetList(page, pageSize int, category string, isFree *bool) ([]model.Course, int64, error) {
	var courses []model.Course
	var total int64

	query := r.db.Model(&model.Course{}).Where("status = ?", 1)

	if category != "" && category != "all" {
		query = query.Where("category = ?", category)
	}

	if isFree != nil {
		query = query.Where("is_free = ?", *isFree)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Order("is_hot DESC, created_at DESC").Offset(offset).Limit(pageSize).Find(&courses).Error; err != nil {
		return nil, 0, err
	}

	return courses, total, nil
}

func (r *CourseRepository) GetHot(limit int) ([]model.Course, error) {
	var courses []model.Course
	err := r.db.Where("status = ? AND is_hot = ?", 1, true).Order("students_count DESC").Limit(limit).Find(&courses).Error
	return courses, err
}

func (r *CourseRepository) GetByID(id uint) (*model.Course, error) {
	var course model.Course
	err := r.db.Where("id = ? AND status = ?", id, 1).First(&course).Error
	if err != nil {
		return nil, err
	}
	return &course, nil
}

func (r *CourseRepository) GetCategories() ([]string, error) {
	var categories []string
	err := r.db.Model(&model.Course{}).Where("status = ?", 1).Distinct("category").Pluck("category", &categories).Error
	return categories, err
}

func (r *CourseRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.Course{}).Where("status = ?", 1).Count(&count).Error
	return count, err
}

func (r *CourseRepository) SumStudents() (int64, error) {
	var total struct{ Sum int64 }
	err := r.db.Model(&model.Course{}).Where("status = ?", 1).Select("COALESCE(SUM(students_count), 0) as sum").Scan(&total).Error
	return total.Sum, err
}
