package model

import "time"

const (
	ArticleStatusDraft     = 0
	ArticleStatusPublished = 1
	ArticleStatusArchived  = 2
)

type Article struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Title          string    `gorm:"size:200;not null" json:"title"`
	Slug           string    `gorm:"size:200;uniqueIndex;not null" json:"slug"`
	Summary        string    `gorm:"type:text" json:"summary"`
	Content        string    `gorm:"type:longtext" json:"content"`
	Cover          string    `gorm:"size:500" json:"cover"`
	Category       string    `gorm:"size:50;index" json:"category"`
	Tags           string    `gorm:"size:500" json:"tags"`
	ReadTime       int       `gorm:"default:0" json:"read_time"`
	Views          int       `gorm:"default:0" json:"views"`
	Likes          int       `gorm:"default:0" json:"likes"`
	IsFeatured     bool      `gorm:"default:false" json:"is_featured"`
	IsPinned       bool      `gorm:"default:false" json:"is_pinned"`
	AllowComments  bool      `gorm:"default:true" json:"allow_comments"`
	Status         int       `gorm:"default:0" json:"status"`
	WordCount      int       `gorm:"default:0" json:"word_count"`
	PublishedAt    time.Time `json:"published_at"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func (Article) TableName() string {
	return "articles"
}

func (a *Article) StatusText() string {
	switch a.Status {
	case ArticleStatusDraft:
		return "草稿"
	case ArticleStatusPublished:
		return "已发布"
	case ArticleStatusArchived:
		return "已归档"
	default:
		return "未知"
	}
}
