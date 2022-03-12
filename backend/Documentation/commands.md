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
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore.Tools

# https://balta.io/artigos/aspnetcore-3-autenticacao-autorizacao-bearer-jwt
dotnet add SocialMedia.Api package Microsoft.AspNetCore.Authentication
dotnet add SocialMedia.Api package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add SocialMedia.Api package BCrypt.Net-Next
dotnet add SocialMedia.Api package Microsoft.AspNetCore.OData

dotnet new tool-manifest
dotnet tool install JetBrains.ReSharper.GlobalTools
dotnet tool install ReGitLint
dotnet tool restore

dotnet sln add SocialMedia.Api
dotnet sln add SocialMedia.Data

dotnet new tool-manifest -o SocialMedia.Data
cd SocialMedia.Data
dotnet tool install dotnet-ef
dotnet ef migrations add Initial

```