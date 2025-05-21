-- name: CreateUser :one
INSERT INTO users(id, email, created_at, updated_at, hashed_password)
VALUES(
    gen_random_uuid(),
    $1,
    NOW(),
    NOW(),
    $2
)
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;
