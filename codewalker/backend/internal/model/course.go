package model

import "time"

type Course struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Title         string    `gorm:"size:200;not null" json:"title"`
	Slug          string    `gorm:"size:200;uniqueIndex;not null" json:"slug"`
	Description   string    `gorm:"type:text" json:"description"`
	Cover         string    `gorm:"size:500" json:"cover"`
	Instructor    string    `gorm:"size:100" json:"instructor"`
	Category      string    `gorm:"size:50;index" json:"category"`
	Level         string    `gorm:"size:20" json:"level"`
	Duration      string    `gorm:"size:50" json:"duration"`
	LessonsCount  int       `gorm:"default:0" json:"lessons_count"`
	StudentsCount int       `gorm:"default:0" json:"students_count"`
	Rating        float64   `gorm:"default:0" json:"rating"`
	Price         float64   `gorm:"default:0" json:"price"`
	IsFree        bool      `gorm:"default:false" json:"is_free"`
	IsHot         bool      `gorm:"default:false" json:"is_hot"`
	Status        int       `gorm:"default:1" json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (Course) TableName() string {
	return "courses"
}
