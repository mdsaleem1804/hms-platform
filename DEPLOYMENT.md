# 🚀 HMS Platform Deployment Guide

## Overview
This guide covers the deployment of HMS Platform to production on VPS at **153.75.224.163**. The application uses Docker Compose to orchestrate three main services: Frontend (Next.js), Backend (ASP.NET Core), and Database (PostgreSQL).

---

## Recent Updates & Changes (April 2, 2026)

### 1. **VPS URL Configuration**
All services have been configured to point to the production VPS:
- **Frontend**: http://153.75.224.163:3000
- **Backend API**: http://153.75.224.163:7000
- **API Documentation (Swagger)**: http://153.75.224.163:7000/swagger

### 2. **Security & Authentication**
- **JWT Secret Key**: `JWTSecretKey@2026!LakshmiHospitals#RandomSecure789`
- **Database Password**: Set via environment variables (same as JWT secret)
- **CORS Configuration**: Configured to accept requests from frontend and localhost

### 3. **Database Migration Strategy**
- **Removed**: Manual SQL schema files from deployment
- **Now Using**: Entity Framework Core migrations for database schema management
- **SQL Files**: Renamed with numeric prefixes (01_patients.sql, 02_doctors.sql, etc.) for reference only
- **Database**: PostgreSQL 16 Alpine image with health checks enabled

### 4. **Docker Compose Configuration**
Updated docker-compose.yml includes:
- Service health checks (database readiness)
- Environment variable management
- Network isolation (hms-network bridge)
- Volume persistence for PostgreSQL data
- Proper service dependencies

### 5. **Frontend Dockerfile Updates**
- Removed unnecessary public folder copy line
- Optimized multi-stage build

---

## 📋 Prerequisites

Before deploying, ensure you have:
- Docker and Docker Compose installed
- VPS access (SSH configured)
- PostgreSQL 16 or higher
- .NET 8 SDK (for local development)
- Node.js 18+ (for frontend development)

---

## 🔧 Environment Configuration

### Create `.env` File
Create a `.env` file in the project root with:

```env
# Database & Security
POSTGRES_PASSWORD=JWTSecretKey@2026!LakshmiHospitals#RandomSecure789
JWT_SECRET=JWTSecretKey@2026!LakshmiHospitals#RandomSecure789

# API URL (VPS)
NEXT_PUBLIC_API_URL=http://153.75.224.163:7000
PUBLIC_API_URL=http://153.75.224.163:7000
```

**Important**: Update credentials in production environment. See [.env.example](.env.example) for all available options.

---

## 🚢 Deployment Steps

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd hms-platform
```

### Step 2: Configure Environment
```bash
# Copy and update environment file
cp .env.example .env

# Edit .env with production values
nano .env
```

**Key Variables to Update**:
- `POSTGRES_PASSWORD` - Strong password for PostgreSQL
- `JWT_SECRET` - Secure JWT signing key (minimum 32 characters)
- `NEXT_PUBLIC_API_URL` - VPS backend URL
- `CORS__AllowedOrigins` - Frontend origin for CORS

### Step 3: Build and Start Services
```bash
# Navigate to project directory
cd d:\Clients\hms-platform

# Build and start all services in background
docker compose up --build -d

# Verify all services are running
docker compose ps
```

Expected output:
```
NAME              STATUS          PORTS
hms-frontend      Up (healthy)    0.0.0.0:3000->3000/tcp
hms-backend       Up (healthy)    0.0.0.0:7000->7000/tcp, 0.0.0.0:5000->5000/tcp
hms-database      Up (healthy)    0.0.0.0:5432->5432/tcp
```

### Step 4: Initialize Database
The database is automatically initialized by Entity Framework migrations on first run. Monitor progress:

```bash
# Check backend logs for migration completion
docker compose logs backend

# Look for message: "Application started successfully"
```

### Step 5: Verify Deployment

**Test Frontend**:
```
http://153.75.224.163:3000
```

**Test Backend API**:
```
http://153.75.224.163:7000/swagger
```

**Test Database Connection**:
```bash
docker exec -it hms-database psql -U postgres -d hms_platform -c "SELECT version();"
```

---

## 📊 Docker Compose Services

### Frontend Service
- **Container**: hms-frontend
- **Port**: 3000
- **Image**: Custom Next.js build
- **Environment**: API_URL points to backend
- **Dependencies**: Waits for backend

### Backend Service
- **Container**: hms-backend
- **Ports**: 7000 (HTTPS), 5000 (HTTP)
- **Image**: Custom ASP.NET Core build
- **Environment**: Database connection, JWT settings, CORS config
- **Dependencies**: Waits for database health check

### Database Service
- **Container**: hms-database
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volume**: postgres_data (persistent storage)
- **Health Check**: Enabled (pg_isready)

---

## 🔐 Security Configurations

### CORS Policy
```
Allowed Origins:
- http://localhost:3000
- http://frontend:3000
- http://153.75.224.163:3000
- http://localhost:7000
```

### JWT Authentication
- **Secret Key**: Set via environment variable `JWT_SECRET`
- **Expiration**: 60 minutes (configurable)
- **Token Location**: Authorization header (Bearer scheme)

### Database Security
- **User**: postgres
- **Password**: Environment variable `POSTGRES_PASSWORD`
- **Database**: hms_platform
- **Port**: 5432 (mapped to host, restrict in production)

---

## 📝 Common Operations

### View Service Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f database
```

### Stop Services
```bash
docker compose stop
```

### Restart Services
```bash
docker compose restart backend
docker compose restart frontend
```

### Remove All Services & Data
```bash
# WARNING: This removes all containers and volumes
docker compose down -v
```

### Access Database
```bash
docker exec -it hms-database psql -U postgres -d hms_platform
```

---

## 🛠 Troubleshooting

### Issue: Containers Not Starting
**Solution**: Check logs and ensure ports are not in use
```bash
docker compose logs
docker ps -a  # View stopped containers
```

### Issue: Database Connection Timeout
**Solution**: Verify database health and connection string
```bash
docker compose logs database
docker exec -it hms-database pg_isready -U postgres
```

### Issue: Frontend Cannot Connect to Backend
**Solution**: Check CORS configuration and API URL
```bash
# Verify environment variables
docker compose config | grep -A 5 "NEXT_PUBLIC_API_URL"
docker compose config | grep -A 5 "CORS"
```

### Issue: API Returns 502/503 Errors
**Solution**: Verify backend container is running and healthy
```bash
docker compose logs backend
docker compose ps backend
```

---

## 🔄 Continuous Deployment

### Update Application Code
```bash
# Pull latest changes
git pull origin deployment

# Rebuild containers
docker compose up --build -d

# Verify deployment
docker compose ps
```

### Backup Database
```bash
# Create backup
docker exec hms-database pg_dump -U postgres hms_platform > backup.sql

# Restore from backup
docker exec -i hms-database psql -U postgres hms_platform < backup.sql
```

---

## 📚 Related Documentation

- [Architecture Guide](docs/architecture.md) - System design and layers
- [Skills & Standards](docs/skills.md) - Coding conventions
- [Module Documentation](docs/modules.md) - Feature descriptions
- [API Response Examples](API_RESPONSES.md) - Endpoint documentation
- [Setup Checklist](SETUP_CHECKLIST.md) - Initial setup steps

---

## 📞 Support

For deployment issues:
1. Check logs: `docker compose logs`
2. Verify environment variables: `docker compose config`
3. Test connectivity: `curl http://153.75.224.163:7000/swagger`
4. Review [Troubleshooting](#-troubleshooting) section above

**Last Updated**: April 2, 2026  
**Deployment Status**: Production Ready
