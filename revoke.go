package main

import (
	"net/http"

	"github.com/sambakker4/cubey/internal/auth"
)

func (cfg config) RevokeRefreshToken(writer http.ResponseWriter, req *http.Request) {
	token, err := auth.GetBearerToken(req.Header)	
	if err != nil {
		RespondWithError(writer, 400, "error retrieving token from header")
		return
	}

	err = cfg.db.RevokeRefreshToken(req.Context(), token)
	if err != nil {
		RespondWithError(writer, 500, "error revoking token")
		return
	}

	writer.WriteHeader(http.StatusNoContent)
}
