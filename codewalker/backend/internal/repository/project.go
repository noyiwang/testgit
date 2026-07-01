package repository

import (
	"codewalker/internal/model"

	"gorm.io/gorm"
)

type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) GetList(page, pageSize int, language string) ([]model.Project, int64, error) {
	var projects []model.Project
	var total int64

	query := r.db.Model(&model.Project{}).Where("status = ?", 1)

	if language != "" && language != "all" {
		query = query.Where("language = ?", language)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Order("is_featured DESC, stars DESC").Offset(offset).Limit(pageSize).Find(&projects).Error; err != nil {
		return nil, 0, err
	}

	return projects, total, nil
}

func (r *ProjectRepository) GetFeatured(limit int) ([]model.Project, error) {
	var projects []model.Project
	err := r.db.Where("status = ? AND is_featured = ?", 1, true).Order("stars DESC").Limit(limit).Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) GetByID(id uint) (*model.Project, error) {
	var project model.Project
	err := r.db.Where("id = ? AND status = ?", id, 1).First(&project).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepository) GetLanguages() ([]string, error) {
	var languages []string
	err := r.db.Model(&model.Project{}).Where("status = ?", 1).Distinct("language").Pluck("language", &languages).Error
	return languages, err
}

func (r *ProjectRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.Project{}).Where("status = ?", 1).Count(&count).Error
	return count, err
}
