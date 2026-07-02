package model

import "time"

type Subscriber struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Status    int       `gorm:"default:1" json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

func (Subscriber) TableName() string {
	return "subscribers"
}
