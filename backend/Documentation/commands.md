```bash
# Create solution
dotnet new sln

dotnet new webapi -o SocialMedia.Api
dotnet new classlib -o SocialMedia.Data

dotnet add SocialMedia.Data package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add SocialMedia.Data package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore.Sqlite
dotnet add SocialMedia.Data package Pomelo.EntityFrameworkCore.MySql
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore.Design

dotnet ef migrations add Initial

dotnet new tool-manifest
dotnet tool install JetBrains.ReSharper.GlobalTools
dotnet tool install ReGitLint
dotnet tool restore

dotnet sln add SocialMedia.Api
dotnet sln add SocialMedia.Data
```