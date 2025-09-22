# Docker Setup for Banglamphu Community Website

This guide explains how to run the Banglamphu Community Website using Docker with Nginx as a reverse proxy.

## Architecture

- **Nginx**: Reverse proxy and static file server
- **Next.js**: Main application server
- **MongoDB**: Database server

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 80, 443, and 3000 available

## Quick Start

1. **Clone the repository and navigate to the project directory**

   ```bash
   cd /path/to/banglamphu
   ```

2. **Copy environment variables**

   ```bash
   cp docker/env.example .env.local
   ```

3. **Edit environment variables**

   ```bash
   nano .env.local
   ```

   Update the following variables:

   - `MONGO_ROOT_PASSWORD`: Strong password for MongoDB root user
   - `NEXTAUTH_SECRET`: Random secret key for NextAuth
   - `JWT_SECRET`: Random secret key for JWT tokens

4. **Build and start services**

   ```bash
   docker-compose up -d --build
   ```

5. **Check service status**

   ```bash
   docker-compose ps
   ```

6. **Access the application**
   - Website: http://localhost
   - Admin panel: http://localhost/admin
   - Health check: http://localhost/health

## Services

### MongoDB (Port 27017)

- **Container**: `banglamphu_mongodb`
- **Data persistence**: Volume `mongodb_data`
- **Health check**: MongoDB ping command
- **Initialization**: Custom script creates collections and indexes

### Next.js Application (Port 3000)

- **Container**: `banglamphu_nextjs`
- **Build**: Multi-stage Docker build
- **Health check**: HTTP endpoint `/api/health`
- **Dependencies**: Waits for MongoDB to be healthy

### Nginx (Ports 80, 443)

- **Container**: `banglamphu_nginx`
- **Configuration**: Custom nginx.conf with optimizations
- **Static files**: Serves uploads and Next.js static assets
- **Rate limiting**: API endpoints protected
- **SSL ready**: HTTPS configuration available

## Configuration Files

### Docker Compose (`docker-compose.yml`)

- Service definitions and dependencies
- Volume mounts and networking
- Health checks and restart policies

### Dockerfile

- Multi-stage build for Next.js
- Production optimizations
- Security: Non-root user
- Health check endpoint

### Nginx Configuration

- **Main config**: `docker/nginx/nginx.conf`
- **Server config**: `docker/nginx/conf.d/default.conf`
- **SSL ready**: Uncomment HTTPS section for SSL

### MongoDB Initialization

- **Script**: `docker/mongo-init.js`
- **Collections**: Creates all required collections
- **Indexes**: Performance indexes
- **Validation**: Schema validation rules

## Environment Variables

### Required Variables

```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-strong-password
MONGO_DATABASE=banglamphu
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```

### Optional Variables

```bash
VERCEL_BLOB_STORE_ID=your-blob-store-id
VERCEL_BLOB_READ_WRITE_TOKEN=your-blob-token
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Management Commands

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs
docker-compose logs -f mongodb
docker-compose logs -f nginx
```

### Restart services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart nextjs
```

### Update application

```bash
docker-compose down
docker-compose up -d --build
```

### Database operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup
```

## SSL/HTTPS Setup

1. **Generate SSL certificates**

   ```bash
   mkdir -p docker/nginx/ssl
   # Add your cert.pem and key.pem files
   ```

2. **Uncomment HTTPS section in nginx config**

   ```bash
   nano docker/nginx/conf.d/default.conf
   # Uncomment the HTTPS server block
   ```

3. **Restart nginx**
   ```bash
   docker-compose restart nginx
   ```

## Performance Optimizations

### Nginx Optimizations

- Gzip compression enabled
- Static file caching
- Rate limiting on API endpoints
- Connection keep-alive
- Worker processes auto-scaling

### Next.js Optimizations

- Multi-stage Docker build
- Production mode
- Standalone output
- Static file optimization

### MongoDB Optimizations

- Indexes on frequently queried fields
- Schema validation
- Connection pooling
- Health checks

## Monitoring

### Health Checks

- **Application**: http://localhost/health
- **MongoDB**: Built-in health check
- **Nginx**: Built-in health check

### Logs

```bash
# Application logs
docker-compose logs -f nextjs

# Database logs
docker-compose logs -f mongodb

# Web server logs
docker-compose logs -f nginx
```

### Resource Usage

```bash
# Container resource usage
docker stats

# Service status
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port conflicts**

   ```bash
   # Check port usage
   netstat -tulpn | grep :80
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :27017
   ```

2. **Permission issues**

   ```bash
   # Fix upload directory permissions
   sudo chown -R $USER:$USER public/uploads
   ```

3. **Database connection issues**

   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb

   # Test connection
   docker-compose exec nextjs node -e "console.log(process.env.MONGODB_URI)"
   ```

4. **Build failures**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose up -d --build
   ```

### Debug Mode

```bash
# Run with debug logs
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up
```

## Production Deployment

### Security Considerations

1. Change all default passwords
2. Use strong secrets for JWT and NextAuth
3. Enable HTTPS with valid certificates
4. Configure firewall rules
5. Regular security updates

### Backup Strategy

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec mongodb mongodump --out /backup/$DATE
```

### Scaling

- Use Docker Swarm or Kubernetes for production
- Implement load balancing
- Use external MongoDB cluster
- Configure CDN for static assets

## Support

For issues and questions:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check service health: `docker-compose ps`
4. Review this documentation

## License

This project is licensed under the MIT License.
