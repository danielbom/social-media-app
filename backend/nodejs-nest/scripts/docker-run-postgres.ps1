docker run `
    --publish "5432:5432" `
    --detach `
    --env-file .env `
    --name postgres `
    postgres
