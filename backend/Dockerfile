# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /src
COPY ["backend/src/HMS.API/HMS.API.csproj", "HMS.API/"]
COPY ["backend/src/HMS.Application/HMS.Application.csproj", "HMS.Application/"]
COPY ["backend/src/HMS.Domain/HMS.Domain.csproj", "HMS.Domain/"]
COPY ["backend/src/HMS.Infrastructure/HMS.Infrastructure.csproj", "HMS.Infrastructure/"]

RUN dotnet restore "HMS.API/HMS.API.csproj"

COPY backend/src/ .
WORKDIR "/src/HMS.API"
RUN dotnet build "HMS.API.csproj" -c Release -o /app/build
RUN dotnet publish "HMS.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app
COPY --from=builder /app/publish .

EXPOSE 7000 5000
ENTRYPOINT ["dotnet", "HMS.API.dll"]
