-- name: CreateTime :one
INSERT INTO times(id, created_at, updated_at, scramble, user_id)
VALUES(
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2
)
RETURNING *;

-- name: GetTimes :many
SELECT * FROM times
WHERE user_id = $1
ORDER BY created_at
LIMIT $2;
