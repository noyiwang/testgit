package model

import "time"

type Project struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:200;not null" json:"name"`
	Slug        string    `gorm:"size:200;uniqueIndex;not null" json:"slug"`
	Description string    `gorm:"type:text" json:"description"`
	Logo        string    `gorm:"size:500" json:"logo"`
	Cover       string    `gorm:"size:500" json:"cover"`
	GithubURL   string    `gorm:"size:500" json:"github_url"`
	DemoURL     string    `gorm:"size:500" json:"demo_url"`
	DocsURL     string    `gorm:"size:500" json:"docs_url"`
	Tags        string    `gorm:"size:500" json:"tags"`
	Language    string    `gorm:"size:50" json:"language"`
	Stars       int       `gorm:"default:0" json:"stars"`
	Forks       int       `gorm:"default:0" json:"forks"`
	IsFeatured  bool      `gorm:"default:false" json:"is_featured"`
	Status      int       `gorm:"default:1" json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (Project) TableName() string {
	return "projects"
}
