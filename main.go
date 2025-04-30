package main

import (
	"net/http"
	"fmt"
	"log"
)

func main() {
	const port = "8080"
	const filePathRoot = "./app/"
	mux := http.NewServeMux()

	server := http.Server{
		Addr: ":" + port,
		Handler: mux,
	}

	handler := http.FileServer(http.Dir(filePathRoot))
	mux.Handle("/", http.StripPrefix("/", handler))

	fmt.Printf("Serving files on port %v at %v\n", port, filePathRoot)
	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}
