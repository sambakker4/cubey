-- name: CreateTime :exec
INSERT INTO times(id, created_at, updated_at, scramble, user_id, time)
VALUES(
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1,
    $2,
    $3
);

-- name: GetTimes :many
SELECT * FROM times
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2;

-- name: GetMostRecentTime :one
SELECT * FROM times
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 1;
