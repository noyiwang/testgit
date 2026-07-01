package repository

import (
	"codewalker/internal/model"

	"gorm.io/gorm"
)

type SubscriberRepository struct {
	db *gorm.DB
}

func NewSubscriberRepository(db *gorm.DB) *SubscriberRepository {
	return &SubscriberRepository{db: db}
}

func (r *SubscriberRepository) Create(email string) error {
	subscriber := model.Subscriber{Email: email}
	return r.db.Create(&subscriber).Error
}

func (r *SubscriberRepository) Exists(email string) (bool, error) {
	var count int64
	err := r.db.Model(&model.Subscriber{}).Where("email = ?", email).Count(&count).Error
	return count > 0, err
}

func (r *SubscriberRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.Subscriber{}).Where("status = ?", 1).Count(&count).Error
	return count, err
}

func (r *SubscriberRepository) Unsubscribe(email string) error {
	return r.db.Model(&model.Subscriber{}).Where("email = ?", email).Update("status", 0).Error
}
