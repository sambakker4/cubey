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
}

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DB_URL")
	tokenSecret := os.Getenv("TOKEN_SECRET")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}

	dbQueries := database.New(db)
	cfg := config{
		db:          dbQueries,
		tokenSecret: tokenSecret,
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

	mux.HandleFunc("POST /api/users", cfg.CreateUser)

	fmt.Printf("Serving files on port %v\n", port)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
