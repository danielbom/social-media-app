FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

# Build time
WORKDIR /app

COPY ./SocialMedia.sln ./SocialMedia.sln
COPY ./SocialMedia.Api ./SocialMedia.Api
COPY ./SocialMedia.Data ./SocialMedia.Data
COPY ./SocialMedia.Tests ./SocialMedia.Tests

RUN dotnet publish -c Release SocialMedia.sln

# Run time
FROM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app

COPY --from=build-env /app/SocialMedia.Api/bin/Release/net6.0 ./SocialMedia.Api

ENTRYPOINT ["dotnet", "SocialMedia.Api/SocialMedia.Api.dll"]
