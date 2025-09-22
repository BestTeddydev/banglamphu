#!/bin/bash

# Docker Management Scripts for Banglamphu Community Website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to check if environment file exists
check_env() {
    if [ ! -f ".env.local" ]; then
        print_warning "Environment file .env.local not found."
        print_status "Copying from docker/env.example..."
        cp docker/env.example .env.local
        print_warning "Please edit .env.local with your configuration before running again."
        exit 1
    fi
}

# Function to start production environment
start_production() {
    print_status "Starting production environment..."
    check_docker
    check_env
    
    docker-compose up -d --build
    
    print_success "Production environment started!"
    print_status "Website: http://localhost"
    print_status "Admin: http://localhost/admin"
    print_status "Health: http://localhost/health"
}

# Function to start development environment
start_development() {
    print_status "Starting development environment..."
    check_docker
    check_env
    
    docker-compose -f docker-compose.dev.yml up -d --build
    
    print_success "Development environment started!"
    print_status "Website: http://localhost:3000"
    print_status "MongoDB: localhost:27017"
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    
    # Stop production
    docker-compose down 2>/dev/null || true
    
    # Stop development
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    print_success "All services stopped!"
}

# Function to show logs
show_logs() {
    local service=${1:-""}
    
    if [ -n "$service" ]; then
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    else
        print_status "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Function to show status
show_status() {
    print_status "Service Status:"
    echo ""
    docker-compose ps
    echo ""
    
    print_status "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

# Function to backup database
backup_database() {
    local backup_dir="./backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/backup_$timestamp"
    
    print_status "Creating database backup..."
    
    mkdir -p "$backup_dir"
    
    docker-compose exec mongodb mongodump --out "/backup/$timestamp" 2>/dev/null || {
        print_error "Failed to create backup. Make sure MongoDB is running."
        exit 1
    }
    
    docker cp banglamphu_mongodb:/backup/$timestamp "$backup_file"
    
    print_success "Backup created: $backup_file"
}

# Function to restore database
restore_database() {
    local backup_path=$1
    
    if [ -z "$backup_path" ]; then
        print_error "Please provide backup path: $0 restore <backup_path>"
        exit 1
    fi
    
    if [ ! -d "$backup_path" ]; then
        print_error "Backup path does not exist: $backup_path"
        exit 1
    fi
    
    print_warning "This will replace all data in the database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Restoring database from $backup_path..."
        
        docker cp "$backup_path" banglamphu_mongodb:/restore
        docker-compose exec mongodb mongorestore /restore
        
        print_success "Database restored successfully!"
    else
        print_status "Restore cancelled."
    fi
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down --volumes --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans 2>/dev/null || true
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    print_success "Cleanup completed!"
}

# Function to show help
show_help() {
    echo "Docker Management Script for Banglamphu Community Website"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start-prod     Start production environment"
    echo "  start-dev      Start development environment"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  logs [service] Show logs (optionally for specific service)"
    echo "  status         Show service status and resource usage"
    echo "  backup         Create database backup"
    echo "  restore <path> Restore database from backup"
    echo "  cleanup        Clean up Docker resources"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-prod"
    echo "  $0 logs nextjs"
    echo "  $0 backup"
    echo "  $0 restore ./backups/backup_20231201_120000"
}

# Main script logic
case "$1" in
    "start-prod")
        start_production
        ;;
    "start-dev")
        start_development
        ;;
    "stop")
        stop_all
        ;;
    "restart")
        stop_all
        sleep 2
        start_production
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    "backup")
        backup_database
        ;;
    "restore")
        restore_database "$2"
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
