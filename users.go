package main

import (
	"encoding/json"
	"net/http"

	"github.com/sambakker4/cubey/internal/auth"
	"github.com/sambakker4/cubey/internal/database"
)

type UserReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (cfg config) CreateUser(writer http.ResponseWriter, req *http.Request) {
	writer.Header().Set("Content-Type", "application/json")

	decoder := json.NewDecoder(req.Body)
	var userInfo UserReq
	err := decoder.Decode(userInfo)

	if err != nil {
		RespondWithError(writer, 400, "error decoding json")
		return
	}

	_, err = cfg.db.GetUserByEmail(req.Context(), userInfo.Email)
	if err == nil {
		RespondWithError(writer, 400, "user already exists")
		return
	}

	hashedPassword, err := auth.HashPassword(userInfo.Password)
	if err != nil {
		RespondWithError(writer, 500, "error hashing password")
	}

	user, err := cfg.db.CreateUser(req.Context(), database.CreateUserParams{
		HashedPassword: hashedPassword,
		Email:          userInfo.Email,
	})

	type returnUser struct {
		Email     string `json:"email"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at`
		ID        string `json:"id"`
	}

	RespondWithJson(writer, 201, returnUser{
		Email: user.Email,
		CreatedAt: user.CreatedAt.String(),
		UpdatedAt: user.UpdatedAt.String(),
		ID: user.ID.String(),
	})
}
