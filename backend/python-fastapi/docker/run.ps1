docker run `
  --detach `
  --rm `
  --interactive `
  --tty `
  --env-file .env `
  --env PYTHON_ENV=production `
  --name api `
  --publish 8000:8000 `
  social-midia-api:latest
