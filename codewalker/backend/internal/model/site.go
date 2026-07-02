package model

type SiteStats struct {
	ArticleCount  int64 `json:"article_count"`
	CourseCount   int64 `json:"course_count"`
	ProjectCount  int64 `json:"project_count"`
	StudentCount  int64 `json:"student_count"`
	SubscriberCount int64 `json:"subscriber_count"`
}
