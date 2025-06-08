# cubey

Cubey is a speedcubing timer based off cstimer

## Installation
### Clone the github repo
`git clone github.com/sambakker4/cubey`

### Add a .env to the root of the project
```
PLATFORM="dev"
TOKEN_SECRET="{random_string_64_characters_long}"
DB_URL="{url_to_postgres_database}"
```

### Setup Database
Install goose with `go get https://github.com/pressly/goose`
Then run `cd sql/schema && goose postgres {db_url} up`

## Run
Run `go build -o out` to build
Then run `./out` to run
