package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/sambakker4/cubey/internal/database"

	_ "github.com/lib/pq"
)

type config struct {
	db          *database.Queries
	tokenSecret string
	platform    string
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	dbURL := os.Getenv("DB_URL")
	tokenSecret := os.Getenv("TOKEN_SECRET")
	platform := os.Getenv("PLATFORM")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}

	dbQueries := database.New(db)
	cfg := config{
		db:          dbQueries,
		tokenSecret: tokenSecret,
		platform:    platform,
	}

	const port = "8080"
	const filePathRoot = "./app/"
	mux := http.NewServeMux()

	server := http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	handler := http.FileServer(http.Dir(filePathRoot))
	mux.Handle("/", http.StripPrefix("/", handler))
	mux.HandleFunc("PUT /admin/reset", cfg.ResetUsers)

	mux.HandleFunc("POST /api/users", cfg.CreateUser)

	mux.HandleFunc("POST /api/login", cfg.LoginUser)
	mux.HandleFunc("POST /api/refresh", cfg.Refresh)
	mux.HandleFunc("POST /api/revoke", cfg.RevokeRefreshToken)

	mux.HandleFunc("GET /api/times", cfg.GetTimes)
	mux.HandleFunc("POST /api/times", cfg.CreateTime)

	fmt.Printf("Serving files on port %v\n", port)
	err = server.ListenAndServe()

	if err != nil {
		log.Fatal(err)
	}
}
