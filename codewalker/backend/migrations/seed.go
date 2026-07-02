package main

import (
	"codewalker/internal/config"
	"codewalker/internal/model"
	"fmt"
	"log"
	"time"
)

func main() {
	cfg := config.Load()

	if err := model.InitDB(cfg.GetDSN()); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	articles := []model.Article{
		{
			Title:         "理解CAP定理：分布式系统的权衡艺术",
			Slug:          "cap-theorem",
			Summary:       "深入探讨一致性、可用性与分区容错性之间的辩证关系，结合实际案例分析分布式架构设计中的核心决策。",
			Content:       "# 理解CAP定理\n\nCAP定理是分布式系统理论的基石...",
			Cover:         "/assets/image_0_yi19x4.jpg",
			Category:      "分布式系统",
			Tags:          "CAP,分布式",
			ReadTime:      12,
			WordCount:     3200,
			Views:         3200,
			Likes:         156,
			IsFeatured:    true,
			IsPinned:      true,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 28, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "Kubernetes Operator 模式实战指南",
			Slug:          "k8s-operator",
			Summary:       "从CRD定义到Controller实现，手把手教你构建生产级别的Kubernetes Operator，自动化管理复杂应用。",
			Content:       "# Kubernetes Operator 模式\n\nOperator 模式是 Kubernetes 扩展的核心...",
			Cover:         "/assets/image_1_yi19x4.jpg",
			Category:      "云原生",
			Tags:          "Kubernetes,Operator",
			ReadTime:      18,
			WordCount:     4800,
			Views:         4893,
			Likes:         234,
			IsFeatured:    true,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 20, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "深入理解分布式系统中的共识算法",
			Slug:          "consensus-algorithms",
			Summary:       "从 Paxos 到 Raft，从拜占庭将军问题到 PBFT，系统性地梳理共识算法的演进脉络，剖析工业界实现（如 etcd/raft）的工程优化细节。",
			Content:       "# 共识算法\n\n共识算法是分布式系统的核心...",
			Cover:         "/assets/image_2_yi19x4.jpg",
			Category:      "分布式系统",
			Tags:          "共识算法,Raft,Paxos",
			ReadTime:      25,
			WordCount:     6800,
			Views:         8432,
			Likes:         421,
			IsFeatured:    true,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 30, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "Go 并发编程：Goroutine 调度器深度剖析",
			Slug:          "go-goroutine-scheduler",
			Summary:       "追踪Go运行时调度器的GMP模型实现原理，理解工作窃取、抢占式调度等核心机制的内部运作。",
			Content:       "# Goroutine 调度器\n\nGo语言的并发模型基于GMP...",
			Cover:         "/assets/image_3_yi19x4.jpg",
			Category:      "Go语言",
			Tags:          "Go,并发编程",
			ReadTime:      15,
			WordCount:     4200,
			Views:         5621,
			Likes:         287,
			IsFeatured:    false,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 12, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "Rust 所有权机制与内存安全",
			Slug:          "rust-ownership",
			Summary:       "深入理解Rust的所有权系统、借用检查器和生命周期，掌握零成本抽象的内存安全编程范式。",
			Content:       "# Rust 所有权\n\nRust的核心特性是所有权系统...",
			Cover:         "/assets/image_4_yi19x4.jpg",
			Category:      "Rust",
			Tags:          "Rust,内存安全",
			ReadTime:      14,
			WordCount:     3800,
			Views:         2100,
			Likes:         165,
			IsFeatured:    false,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 8, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "Docker 多阶段构建最佳实践",
			Slug:          "docker-multistage-build",
			Summary:       "通过多阶段构建优化Docker镜像大小，结合Go、React等实际项目场景演示生产级Dockerfile编写技巧。",
			Content:       "# Docker 多阶段构建\n\n多阶段构建是优化镜像大小的关键...",
			Category:      "云原生",
			Tags:          "Docker,DevOps",
			ReadTime:      10,
			WordCount:     2600,
			Views:         1800,
			Likes:         98,
			IsFeatured:    false,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 5, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "TypeScript 5.0 装饰器与类型体操",
			Slug:          "typescript-decorators",
			Summary:       "详解TypeScript 5.0新特性，包括装饰器标准化、const类型参数以及高级类型编程技巧。",
			Content:       "# TypeScript 5.0 新特性\n\n装饰器是TC39标准的一部分...",
			Category:      "前端技术",
			Tags:          "TypeScript,前端",
			ReadTime:      8,
			WordCount:     2100,
			Views:         1500,
			Likes:         87,
			IsFeatured:    false,
			AllowComments: true,
			Status:        model.ArticleStatusPublished,
			PublishedAt:   time.Date(2026, 6, 1, 0, 0, 0, 0, time.Local),
		},
		{
			Title:         "从零搭建CI/CD流水线（草稿）",
			Slug:          "cicd-pipeline-draft",
			Summary:       "基于GitHub Actions和ArgoCD构建完整的持续集成与持续部署流程。",
			Content:       "# CI/CD 流水线\n\n本文正在写作中...",
			Category:      "DevOps",
			Tags:          "CI/CD,GitHub Actions",
			ReadTime:      20,
			WordCount:     800,
			Views:         0,
			Likes:         0,
			IsFeatured:    false,
			AllowComments: true,
			Status:        model.ArticleStatusDraft,
		},
		{
			Title:         "微服务链路追踪入门（草稿）",
			Slug:          "tracing-intro-draft",
			Summary:       "OpenTelemetry与Jaeger实践，构建分布式系统可观测性体系。",
			Content:       "# 链路追踪\n\n可观测性三大支柱...",
			Category:      "微服务",
			Tags:          "链路追踪,OpenTelemetry",
			ReadTime:      16,
			WordCount:     1200,
			Views:         0,
			Likes:         0,
			IsFeatured:    false,
			AllowComments: true,
			Status:        model.ArticleStatusDraft,
		},
	}

	courses := []model.Course{
		{
			Title:         "分布式系统实战：从理论到生产",
			Slug:          "distributed-systems",
			Description:   "系统性学习分布式系统核心概念，从基础理论到工业级实践，涵盖共识算法、服务发现、负载均衡等核心主题。",
			Cover:         "/assets/image_1_yi19x4.jpg",
			Instructor:    "码上行",
			Category:      "分布式系统",
			Level:         "进阶",
			Duration:      "42小时",
			LessonsCount:  86,
			StudentsCount: 2356,
			Rating:        4.9,
			Price:         299,
			IsFree:        false,
			IsHot:         true,
			Status:        1,
		},
		{
			Title:         "Go 语言工程实践入门",
			Slug:          "go-basics",
			Description:   "从零开始学习Go语言，掌握语法特性、并发编程、工程规范，具备独立开发Go项目的能力。",
			Cover:         "/assets/image_2_yi19x4.jpg",
			Instructor:    "码上行",
			Category:      "Go语言",
			Level:         "入门",
			Duration:      "28小时",
			LessonsCount:  64,
			StudentsCount: 3421,
			Rating:        4.8,
			Price:         0,
			IsFree:        true,
			IsHot:         true,
			Status:        1,
		},
	}

	projects := []model.Project{
		{
			Name:        "GoDist",
			Slug:        "godist",
			Description: "轻量级 Go 微服务框架，内置服务发现、负载均衡与熔断降级能力。",
			Cover:       "/assets/image_0_yi19x4.jpg",
			GithubURL:   "https://github.com/codewalker/godist",
			DocsURL:     "https://godist.codewalker.dev",
			Tags:        "Go,gRPC,Raft,etcd",
			Language:    "Go",
			Stars:       2300,
			Forks:       342,
			IsFeatured:  true,
			Status:      1,
		},
		{
			Name:        "KubeView",
			Slug:        "kubeview",
			Description: "Kubernetes 集群可视化管理工具，提供直观的资源拓扑视图与监控告警。",
			Cover:       "/assets/image_1_yi19x4.jpg",
			GithubURL:   "https://github.com/codewalker/kubeview",
			DemoURL:     "https://demo.kubeview.dev",
			DocsURL:     "https://kubeview.codewalker.dev",
			Tags:        "Kubernetes,React,TypeScript",
			Language:    "TypeScript",
			Stars:       1800,
			Forks:       256,
			IsFeatured:  true,
			Status:      1,
		},
	}

	for _, article := range articles {
		result := model.DB.Where("slug = ?", article.Slug).FirstOrCreate(&article)
		if result.Error != nil {
			log.Printf("Failed to seed article %s: %v", article.Title, result.Error)
		} else if result.RowsAffected > 0 {
			log.Printf("Seeded article: %s", article.Title)
		}
	}

	for _, course := range courses {
		result := model.DB.Where("slug = ?", course.Slug).FirstOrCreate(&course)
		if result.Error != nil {
			log.Printf("Failed to seed course %s: %v", course.Title, result.Error)
		} else if result.RowsAffected > 0 {
			log.Printf("Seeded course: %s", course.Title)
		}
	}

	for _, project := range projects {
		result := model.DB.Where("slug = ?", project.Slug).FirstOrCreate(&project)
		if result.Error != nil {
			log.Printf("Failed to seed project %s: %v", project.Name, result.Error)
		} else if result.RowsAffected > 0 {
			log.Printf("Seeded project: %s", project.Name)
		}
	}

	fmt.Println("Seed completed!")
}
