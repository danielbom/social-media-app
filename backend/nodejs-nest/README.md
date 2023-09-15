## Get started

### Pre-commit

```powershell
# Avoid pre-commit hooks
git commit --no-verify -m "commit message"
```

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

* [jest-create-mock-instance - Github](https://github.com/asvetliakov/jest-create-mock-instance)
* [jest-create-mock-instance - NPM](https://www.npmjs.com/package/jest-create-mock-instance)
* [ [Nestia] 15,000x faster validators and tRPC (SDK) for NestJS](https://dev.to/samchon/nestia-15000x-faster-validators-and-trpc-sdk-for-nestjs-248k)
* [Nestia - Github](https://github.com/samchon/nestia)
* [Typia - Github](https://github.com/samchon/typia)
* [Prisma - Github](https://github.com/prisma/prisma)
