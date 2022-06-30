docker run `
    --publish "3306:3306" `
    --detach `
    --env-file .env `
    --name mysql `
    mysql
