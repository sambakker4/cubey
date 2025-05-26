package main

import (
	"time"
	"encoding/json"
	"net/http"

	"github.com/sambakker4/cubey/internal/auth"
)

type RefreshReq struct {
	Token string `json:"token"`
}

func (cfg config) Refresh(writer http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	defer req.Body.Close()

	var userInfo RefreshReq
	err := decoder.Decode(&userInfo)
	if err != nil {
		RespondWithError(writer, 400, "error decoding json")
		return
	}

	token, err := cfg.db.GetRefreshToken(req.Context(), userInfo.Token)
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
		token string `json:"token"`
	}

	RespondWithJson(writer, 200, refreshToken{
		token: jwToken,
	})
}
