package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/sambakker4/cubey/internal/auth"
	"github.com/sambakker4/cubey/internal/database"
)

type Time struct {
	Time string `json:"time"`
	Scramble string `json:"scramble"`
}

func (cfg config) GetTimes(writer http.ResponseWriter, req *http.Request) {
	token, err := auth.GetBearerToken(req.Header)	
	if err != nil {
		log.Print(err)
		RespondWithError(writer, 400, "error retrieving token from header")
		return
	}

	userID, err := auth.ValidateJWT(token, cfg.tokenSecret)
	if err != nil {
		log.Print(err)
		RespondWithError(writer, 500, "error retrieving user ID from token")
		return
	}

	amountString := req.URL.Query().Get("amount")
	if amountString == "" {
		GetTime(cfg, writer, req, userID)
		return
	}

	amount, err := strconv.Atoi(amountString)
	if err != nil {
		log.Print(err)
		RespondWithError(writer, 400, "could not convert string to int")
		return
	}

	times, err := cfg.db.GetTimes(req.Context(), database.GetTimesParams{UserID: userID, Limit: int32(amount)})
	if err != nil {
		log.Print(err)
		RespondWithError(writer, 500, "error retrieving times from database")
		return
	}
	type timeObj struct{
		Time string `json:"time"`
		Number int32 `json:"number"`
	}

	type Times struct {
		TimeObj []timeObj `json:"time_obj"`
	}

	var returnTimes Times
	returnTimes.TimeObj = make([]timeObj, 0)
	for _, time := range times {
		returnTimes.TimeObj = append(returnTimes.TimeObj, timeObj{Time: time.Time, Number: time.Number})
	}

	RespondWithJson(writer, 200, returnTimes)
}

func GetTime(cfg config, writer http.ResponseWriter, req *http.Request, userID uuid.UUID) {
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

	lastNumber, err := cfg.db.GetMostRecentTime(req.Context(), userID)
	if err != nil {
		RespondWithError(writer, 500, "error getting most recent time")	
		return
	}

	err = cfg.db.CreateTime(req.Context(), database.CreateTimeParams{
		UserID: userID, 
		Scramble: time.Scramble, 
		Time: time.Time,
		Number: lastNumber.Number,
	})

	if err != nil {
		RespondWithError(writer, 500, "error creating time")
		return
	}

	writer.WriteHeader(http.StatusNoContent)
}
