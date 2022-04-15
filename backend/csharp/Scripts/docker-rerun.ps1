docker rm --force csharp-app
./Scripts/docker-run.ps1
docker logs csharp-app --follow 