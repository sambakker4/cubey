package auth

import (
	"github.com/google/uuid"
	"net/http"
	"github.com/golang-jwt/jwt/v5"
	"strings"
	"errors"
	"time"
)

type CustomClaims struct{
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func MakeJWT(id uuid.UUID, tokenSecret string, expiresIn time.Duration) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer: "cubey",
		IssuedAt: jwt.NewNumericDate(time.Now().UTC()),
		ExpiresAt: jwt.NewNumericDate(time.Now().UTC().Add(expiresIn)),
		Subject: id.String(),
	})	

	tokenString, err := token.SignedString([]byte(tokenSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ValidateJWT(tokenString, tokenSecret string) (uuid.UUID, error) {
	claims := &CustomClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims,
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("not expected signing method")
			}
			return []byte(tokenSecret), nil
		},
	)

	if err != nil {
		return uuid.Nil, err
	}

	if !token.Valid {
		return uuid.Nil, errors.New("Invalid token")
	}

	userID, err := uuid.Parse(claims.RegisteredClaims.Subject)
	if err != nil {
		return uuid.Nil, err
	}

	return userID, nil
}

func GetBearerToken(header http.Header) (string, error) {
	authInfo := header.Get("Authorization")

	if authInfo == "" {
		return "", errors.New("No bearer token provided")
	}

	token, ok := strings.CutPrefix(authInfo, "Bearer ")
	if !ok {
		return "", errors.New("Header not in, Bearer <token>, format")
	}

	return token, nil
}
