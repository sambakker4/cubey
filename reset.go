package main

import (
	"net/http"
)

func (cfg config) ResetUsers(writer http.ResponseWriter, req *http.Request) {
	if cfg.platform != "dev" {
		RespondWithError(writer, 401, "not authorized")
		return
	}

	err := cfg.db.ResetUsers(req.Context())	
	if err != nil {
		RespondWithError(writer, 500, "unable to reset users")
		return
	}

	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(205)
	writer.Write([]byte("reset successful"))
}
