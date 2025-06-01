package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/sambakker4/cubey/internal/auth"
	"github.com/sambakker4/cubey/internal/database"
)

type Time struct {
	Time string `json:"time"`
	Scramble string `json:"scramble"`
}

func (cfg config) GetLastTime(writer http.ResponseWriter, req *http.Request) {
	token, err := auth.GetBearerToken(req.Header)
	if err != nil {
		RespondWithError(writer, 400, "error retrieving token header")
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.tokenSecret)
	if err != nil {
		RespondWithError(writer, 500, "error retrieving user ID from token")
		return
	}

	databaseTime, err := cfg.db.GetMostRecentTime(req.Context(), userID)
	if err != nil {
		RespondWithError(writer, 500, "error retrieving time from database")
		return
	}

	type returnTime struct {
		Time string `json:"time"`
	}

	RespondWithJson(writer, 200, returnTime{Time: databaseTime.Time})
}

func (cfg config) GetTimes(writer http.ResponseWriter, req *http.Request) {
	amountString := req.URL.Query().Get("amount")
	amount, err := strconv.Atoi(amountString)
	if err != nil {
		RespondWithError(writer, 400, "could not convert string to int")
		return
	}

	token, err := auth.GetBearerToken(req.Header)	
	if err != nil {
		RespondWithError(writer, 400, "error retrieving token from header")
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.tokenSecret)
	if err != nil {
		RespondWithError(writer, 500, "error retrieving user ID from token")
		return
	}

	times, err := cfg.db.GetTimes(req.Context(), database.GetTimesParams{UserID: userID, Limit: int32(amount)})
	if err != nil {
		RespondWithError(writer, 500, "error retrieving times from database")
		return
	}

	type Times struct {
		times []string `json:"times"`
	}

	returnTimes := make([]string, 0)
	for _, time := range times {
		returnTimes = append(returnTimes, time.Time)
	}

	RespondWithJson(writer, 200, Times{times: returnTimes})
}

func (cfg config) CreateTime(writer http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)	
	defer req.Body.Close()

	var time Time
	err := decoder.Decode(&time)
	if err != nil {
		RespondWithError(writer, 400, "error decoding json")
		return
	}

	token, err := auth.GetBearerToken(req.Header)
	if err != nil {
		RespondWithError(writer, 400, "error retrieving token from header")
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.tokenSecret)
	if err != nil {
		RespondWithError(writer, 400, "error retrieving user ID from token")
		return
	}

	err = cfg.db.CreateTime(req.Context(), database.CreateTimeParams{
		UserID: userID, 
		Scramble: time.Scramble, 
		Time: time.Time,
	})

	if err != nil {
		RespondWithError(writer, 500, "error creating time")
		return
	}

	writer.WriteHeader(http.StatusNoContent)
}
