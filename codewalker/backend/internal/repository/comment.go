package repository

import (
	"codewalker/internal/model"

	"gorm.io/gorm"
)

type CommentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) *CommentRepository {
	return &CommentRepository{db: db}
}

func (r *CommentRepository) GetByArticleID(articleID uint) ([]model.Comment, error) {
	var comments []model.Comment
	err := r.db.Where("article_id = ? AND status = ?", articleID, 1).Order("created_at ASC").Find(&comments).Error
	return comments, err
}

func (r *CommentRepository) Create(comment *model.Comment) error {
	return r.db.Create(comment).Error
}

func (r *CommentRepository) Delete(id uint) error {
	return r.db.Delete(&model.Comment{}, id).Error
}
