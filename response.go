package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type returnError struct {
	Error string `json:"error"`
}

func RespondWithError(writer http.ResponseWriter, statusCode int, message string) {
	writer.WriteHeader(statusCode)
	msg, _ := json.Marshal(returnError{
		Error: message,
	})

	writer.Write(msg)
}

func RespondWithJson(writer http.ResponseWriter, statusCode int, payload interface{}) {
	writer.WriteHeader(statusCode)
	load, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error: %v", err)
	}

	writer.Write(load)
}
