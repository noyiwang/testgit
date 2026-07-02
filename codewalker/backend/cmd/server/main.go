package main

import (
	"codewalker/internal/config"
	"codewalker/internal/model"
	"codewalker/internal/router"
	"fmt"
	"log"
)

func main() {
	cfg := config.Load()

	if err := model.InitDB(cfg.GetDSN()); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	r := router.SetupRouter(model.DB)

	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
