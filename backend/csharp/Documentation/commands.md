# Get Started

```bash
# Install tools
dotnet restore

# Create database
cd SocialMedia.Data
dotnet tool restore
dotnet ef database update

# Run
cd SocialMedia.Api
dotnet run
```

# Creation Commands

```bash
# Create solution
dotnet new sln

dotnet new webapi -o SocialMedia.Api
dotnet new classlib -o SocialMedia.Data
dotnet new xunit -o SocialMedia.Tests

# Add Packages to SocialMedia.Data
dotnet add SocialMedia.Data package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add SocialMedia.Data package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore.Sqlite
dotnet add SocialMedia.Data package Pomelo.EntityFrameworkCore.MySql
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore.Design
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore
dotnet add SocialMedia.Data package Microsoft.EntityFrameworkCore.Tools

# Add Packages to SocialMedia.Api
# https://balta.io/artigos/aspnetcore-3-autenticacao-autorizacao-bearer-jwt
dotnet add SocialMedia.Api package Microsoft.AspNetCore.Authentication
dotnet add SocialMedia.Api package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add SocialMedia.Api package BCrypt.Net-Next
dotnet add SocialMedia.Api package Microsoft.AspNetCore.OData
dotnet add SocialMedia.Api package Microsoft.AspNetCore.Mvc.NewtonsoftJson
dotnet add SocialMedia.Api package Swashbuckle.AspNetCore

# Add Packages to SocialMedia.Tests
dotnet add SocialMedia.Tests package Microsoft.AspNetCore.Mvc.Testing

# Add Global Tools
dotnet new tool-manifest
dotnet tool install JetBrains.ReSharper.GlobalTools
dotnet tool install ReGitLint
dotnet tool restore

# Add Projects to Solution
dotnet sln add SocialMedia.Api
dotnet sln add SocialMedia.Data
dotnet sln add SocialMedia.Tests

# Add References to SocialMedia.Api
dotnet add SocialMedia.Api reference SocialMedia.Data

# Add References to SocialMedia.Tests
dotnet add SocialMedia.Tests reference SocialMedia.Api
dotnet add SocialMedia.Tests reference SocialMedia.Data

# Add Tools to SocialMedia.Data
dotnet new tool-manifest -o SocialMedia.Data
cd SocialMedia.Data
dotnet tool install dotnet-ef
dotnet ef migrations add Initial
```
