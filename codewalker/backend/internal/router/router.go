package router

import (
	"codewalker/internal/handler"
	"codewalker/internal/middleware"
	"codewalker/internal/repository"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS())

	r.Static("/uploads", "./uploads")

	api := r.Group("/api/v1")
	{
		siteHandler := initSiteHandler(db)
		articleHandler := initArticleHandler(db)
		courseHandler := initCourseHandler(db)
		projectHandler := initProjectHandler(db)
		commentHandler := initCommentHandler(db)
		subscriberHandler := initSubscriberHandler(db)

		api.GET("/health", siteHandler.Health)
		api.GET("/stats", siteHandler.Stats)

		articles := api.Group("/articles")
		{
			articles.GET("", articleHandler.List)
			articles.GET("/featured", articleHandler.Featured)
			articles.GET("/categories", articleHandler.Categories)
			articles.GET("/tags", articleHandler.Tags)
			articles.GET("/:id", articleHandler.Detail)
			articles.GET("/slug/:slug", articleHandler.DetailBySlug)
			articles.GET("/:id/related", articleHandler.Related)
			articles.POST("/:id/like", articleHandler.Like)
		}

		courses := api.Group("/courses")
		{
			courses.GET("", courseHandler.List)
			courses.GET("/hot", courseHandler.Hot)
			courses.GET("/categories", courseHandler.Categories)
			courses.GET("/:id", courseHandler.Detail)
		}

		projects := api.Group("/projects")
		{
			projects.GET("", projectHandler.List)
			projects.GET("/featured", projectHandler.Featured)
			projects.GET("/languages", projectHandler.Languages)
			projects.GET("/:id", projectHandler.Detail)
		}

		comments := api.Group("/comments")
		{
			comments.GET("/article/:article_id", commentHandler.ListByArticle)
			comments.POST("", commentHandler.Create)
		}

		subscribers := api.Group("/subscribers")
		{
			subscribers.POST("", subscriberHandler.Subscribe)
		}
	}

	return r
}

func initSiteHandler(db *gorm.DB) *handler.SiteHandler {
	return handler.NewSiteHandler(
		initArticleRepo(db),
		initCourseRepo(db),
		initProjectRepo(db),
		initSubscriberRepo(db),
	)
}

func initArticleHandler(db *gorm.DB) *handler.ArticleHandler {
	return handler.NewArticleHandler(initArticleRepo(db))
}

func initCourseHandler(db *gorm.DB) *handler.CourseHandler {
	return handler.NewCourseHandler(initCourseRepo(db))
}

func initProjectHandler(db *gorm.DB) *handler.ProjectHandler {
	return handler.NewProjectHandler(initProjectRepo(db))
}

func initCommentHandler(db *gorm.DB) *handler.CommentHandler {
	return handler.NewCommentHandler(initCommentRepo(db))
}

func initSubscriberHandler(db *gorm.DB) *handler.SubscriberHandler {
	return handler.NewSubscriberHandler(initSubscriberRepo(db))
}

func initArticleRepo(db *gorm.DB) *repository.ArticleRepository {
	return repository.NewArticleRepository(db)
}

func initCourseRepo(db *gorm.DB) *repository.CourseRepository {
	return repository.NewCourseRepository(db)
}

func initProjectRepo(db *gorm.DB) *repository.ProjectRepository {
	return repository.NewProjectRepository(db)
}

func initCommentRepo(db *gorm.DB) *repository.CommentRepository {
	return repository.NewCommentRepository(db)
}

func initSubscriberRepo(db *gorm.DB) *repository.SubscriberRepository {
	return repository.NewSubscriberRepository(db)
}
