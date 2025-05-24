package main

import (
	"encoding/json"
	"net/http"
	"time"
	"fmt"

	"github.com/google/uuid"
	"github.com/sambakker4/cubey/internal/auth"
	"github.com/sambakker4/cubey/internal/database"
)

type LoginInfo struct {
	Email    string `json:"email"`
	Password string `json:"password`
}

type LoginUser struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	Token        string    `json:"token"`
	CreatedAt    time.Time `json:"created_at"`
	UpdateAt     time.Time `json:"updated_at"`
	RefreshToken string    `json:"refresh_token"`
}

func (cfg config) LoginUser(writer http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	defer req.Body.Close()

	var userInfo LoginInfo
	err := decoder.Decode(&userInfo)
	if err != nil {
		RespondWithError(writer, 400, "error decoding json")
		return
	}

	user, err := cfg.db.GetUserByEmail(req.Context(), userInfo.Email)
	if err != nil {
		RespondWithError(writer, 500, "error retrieving user from database")
		return
	}

	err = auth.CheckPasswordHash(userInfo.Password, user.HashedPassword)
	if err != nil {
		RespondWithError(writer, 400, "incorrect password")
		return
	}

	token, err := auth.MakeJWT(user.ID, cfg.tokenSecret, time.Minute*15)
	if err != nil {
		fmt.Println(err)
		RespondWithError(writer, 500, "error creating token")
		return
	}

	refreshToken, err := auth.MakeRefreshToken()
	if err != nil {
		RespondWithError(writer, 500, "error creating refresh token")
		return
	}

	err = cfg.db.CreateRefreshToken(req.Context(), database.CreateRefreshTokenParams{
		Token: refreshToken,
		UserID: user.ID,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 60),
	})
	
	if err != nil {
		RespondWithError(writer, 500, "saving refresh token to database")
		return
	}

	RespondWithJson(writer, 200, LoginUser{
		ID: user.ID,
		Email: user.Email,
		Token: token,
		CreatedAt: user.CreatedAt,
		UpdateAt: user.UpdatedAt,
		RefreshToken: refreshToken,
	})
}
