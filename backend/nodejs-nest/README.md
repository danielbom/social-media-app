## Get started

### Run application locally

```powershell
# Start mysql with docker
./scripts/docker-run-mysql.ps1

# Run migrations
yarn migration:run

# Populate the database with fake data
python .\scripts\populate-database\main.py

# Initialize in development
yarn start:dev

# Build and initialize in profuction
yarn build
yarn start:prod
```

### Run application with docker

```powershell
docker-compose up
yarn migration:run
```

## TODO

jest-create-mock-instance
https://github.com/asvetliakov/jest-create-mock-instance
https://www.npmjs.com/package/jest-create-mock-instance

