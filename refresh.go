package main

import (
	"time"
	"net/http"

	"github.com/sambakker4/cubey/internal/auth"
)

func (cfg config) Refresh(writer http.ResponseWriter, req *http.Request) {
	tokenString, err := auth.GetBearerToken(req.Header)
	if err != nil {
		RespondWithError(writer, 500, "error retrieving refreshing token from header");
		return
	}

	token, err := cfg.db.GetRefreshToken(req.Context(), tokenString)
	if err != nil {
		RespondWithError(writer, 500, "error retrieving refresh token")
		return
	}

	if token.RevokedAt.Valid {
		RespondWithError(writer, 400, "token was revoked")
		return
	}

	if token.ExpiresAt.Unix() <= time.Now().Unix() {
		RespondWithError(writer, 400, "token has expired")
	}


	jwToken, err := auth.MakeJWT(token.UserID, cfg.tokenSecret, time.Minute * 15)
	if err != nil {
		RespondWithError(writer, 500, "error creating jwt")
		return
	}

	type refreshToken struct {
		Token string `json:"token"`
	}

	RespondWithJson(writer, 200, refreshToken{
		Token: jwToken,
	})
}
