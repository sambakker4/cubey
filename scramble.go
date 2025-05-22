package main

import (
	"encoding/json"
	"errors"
	"log"
	"math/rand"
	"net/http"
)

type GetScrambleReq struct {
	Length int    `json:"length"`
	Kind   string `json:"kind"`
}

type GetScrambleReturn struct {
	Scramble string `json:"scramble"`
}

func (cfg config) GetScramble(writer http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	defer req.Body.Close()

	var scrambleReq GetScrambleReq
	err := decoder.Decode(&scrambleReq)

	if err != nil {
		RespondWithError(writer, 400, "error decoding json")
		return
	}

	scramble, err := generateScramble(scrambleReq.Length, scrambleReq.Kind)
	if err != nil {
		log.Printf(err.Error())
		RespondWithError(writer, 500, "error generating scramble")
		return
	}

	type returnVal struct {
		Scramble string `json:"scramble`
	}

	RespondWithJson(writer, 200, returnVal{Scramble: scramble})
}

func generateScramble(length int, kind string) (string, error) {
	scrambleTypes := map[string]func(int) (string, error){
		"3x3": generate3x3,
	}

	scrambleFunc, ok := scrambleTypes[kind]
	if !ok {
		return "", errors.New("kind of scramble not supported")
	}

	scramble, err := scrambleFunc(length)
	if err != nil {
		return "", err
	}

	return scramble, nil
}

func generate3x3(length int) (string, error) {
	if length <= 0 {
		return "", errors.New("length must be <= 0")
	}
	moves := []string{"L", "R", "U", "D", "B", "F"}
	scramble := ""

	for i := 0; i < length; i++ {
		num := rand.Intn(len(moves))
		move := moves[num]
		if i != 0 {
			for string(string(scramble)[0]) == move {
				num = rand.Intn(len(moves))
				move = moves[num]
			}
		}
		scramble += move
	}
	return scramble, nil
}
