#!/bin/bash

# HMS Platform - Development Commands

## Frontend Commands
# npm run dev          - Start development server
# npm run build        - Build for production
# npm run start        - Start production server
# npm run lint         - Run ESLint
# npm run type-check   - TypeScript type checking

## Backend Commands
# dotnet build         - Build solution
# dotnet run           - Run API
# dotnet test          - Run tests
# dotnet ef migrations add <Name> - Add migration
# dotnet ef database update - Apply migrations

## Database Commands
# psql -U postgres                                    - Connect to PostgreSQL
# psql -U postgres -d hms_platform -f schema.sql    - Run SQL file
# pg_dump -U postgres hms_platform > backup.sql     - Backup database

## Docker Commands
# docker-compose up --build      - Start all services
# docker-compose down            - Stop all services
# docker-compose logs -f         - View logs
# docker-compose ps              - View running containers

## Git Workflow
# git checkout -b feature/[name]   - Create feature branch
# git add .                        - Stage changes
# git commit -m "message"          - Commit changes
# git push origin feature/[name]   - Push to remote
# git pull origin main             - Pull latest from main
