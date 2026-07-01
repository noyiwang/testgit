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
			Title:       "理解CAP定理：分布式系统的权衡艺术",
			Slug:        "cap-theorem",
			Summary:     "深入探讨一致性、可用性与分区容错性之间的辩证关系，结合实际案例分析分布式架构设计中的核心决策。",
			Content:     "# 理解CAP定理\n\nCAP定理是分布式系统理论的基石...",
			Cover:       "/assets/image_0_yi19x4.jpg",
			Category:    "分布式系统",
			Tags:        "CAP,分布式",
			ReadTime:    12,
			Views:       3200,
			Likes:       156,
			IsFeatured:  true,
			Status:      1,
			PublishedAt: time.Date(2026, 6, 28, 0, 0, 0, 0, time.Local),
		},
		{
			Title:       "Kubernetes Operator 模式实战指南",
			Slug:        "k8s-operator",
			Summary:     "从CRD定义到Controller实现，手把手教你构建生产级别的Kubernetes Operator，自动化管理复杂应用。",
			Content:     "# Kubernetes Operator 模式\n\nOperator 模式是 Kubernetes 扩展的核心...",
			Cover:       "/assets/image_1_yi19x4.jpg",
			Category:    "云原生",
			Tags:        "Kubernetes,Operator",
			ReadTime:    18,
			Views:       4893,
			Likes:       234,
			IsFeatured:  true,
			Status:      1,
			PublishedAt: time.Date(2026, 6, 20, 0, 0, 0, 0, time.Local),
		},
		{
			Title:       "深入理解分布式系统中的共识算法",
			Slug:        "consensus-algorithms",
			Summary:     "从 Paxos 到 Raft，从拜占庭将军问题到 PBFT，系统性地梳理共识算法的演进脉络，剖析工业界实现（如 etcd/raft）的工程优化细节。",
			Content:     "# 共识算法\n\n共识算法是分布式系统的核心...",
			Cover:       "/assets/image_2_yi19x4.jpg",
			Category:    "分布式系统",
			Tags:        "共识算法,Raft,Paxos",
			ReadTime:    25,
			Views:       8432,
			Likes:       421,
			IsFeatured:  true,
			Status:      1,
			PublishedAt: time.Date(2026, 6, 30, 0, 0, 0, 0, time.Local),
		},
		{
			Title:       "Go 并发编程：Goroutine 调度器深度剖析",
			Slug:        "go-goroutine-scheduler",
			Summary:     "追踪Go运行时调度器的GMP模型实现原理，理解工作窃取、抢占式调度等核心机制的内部运作。",
			Content:     "# Goroutine 调度器\n\nGo语言的并发模型基于GMP...",
			Category:    "Go语言",
			Tags:        "Go,并发编程",
			ReadTime:    15,
			Views:       5621,
			Likes:       287,
			IsFeatured:  false,
			Status:      1,
			PublishedAt: time.Date(2026, 6, 12, 0, 0, 0, 0, time.Local),
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
