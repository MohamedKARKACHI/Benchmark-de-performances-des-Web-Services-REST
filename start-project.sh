#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  REST Performance Benchmark - Spring Boot Startup Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print colored messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo -e "\n${YELLOW}Checking Prerequisites...${NC}"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_status "Docker is installed"
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_status "Docker Compose is installed"
    
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed"
        exit 1
    fi
    print_status "Maven is installed ($(mvn -v | head -1))"
    
    if ! command -v npm &> /dev/null; then
        print_error "Node.js/npm is not installed"
        exit 1
    fi
    print_status "Node.js is installed ($(node -v))"
    
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed"
        exit 1
    fi
    print_status "Java is installed ($(java -version 2>&1 | head -1))"
}

# Build Spring Boot applications
build_spring_boot() {
    echo -e "\n${YELLOW}Building Spring Boot Applications...${NC}"
    
    if [ ! -f "pom.xml" ]; then
        print_error "pom.xml not found in current directory"
        exit 1
    fi
    
    print_info "Building Maven project (this may take 2-3 minutes)..."
    mvn clean package -DskipTests -q
    
    if [ $? -eq 0 ]; then
        print_status "Spring Boot applications built successfully"
    else
        print_error "Maven build failed"
        exit 1
    fi
}

# Start Docker services
start_docker_services() {
    echo -e "\n${YELLOW}Starting Docker Services...${NC}"
    
    # Check if containers are already running
    if docker-compose ps | grep -q "Up"; then
        print_warning "Some containers are already running. Stopping them first..."
        docker-compose down
    fi
    
    print_info "Starting PostgreSQL, Spring Boot APIs, and Monitoring Stack..."
    docker-compose up -d
    
    if [ $? -ne 0 ]; then
        print_error "Failed to start Docker containers"
        exit 1
    fi
    
    print_status "Docker services started"
    
    # Wait for PostgreSQL to be ready
    print_info "Waiting for PostgreSQL to be ready..."
    sleep 5
    for i in {1..30}; do
        if docker exec benchmark-postgres-1 pg_isready -U benchmark > /dev/null 2>&1; then
            print_status "PostgreSQL is ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "PostgreSQL did not start in time"
            exit 1
        fi
        sleep 1
    done
}

# Start monitoring stack
start_monitoring() {
    echo -e "\n${YELLOW}Starting Monitoring Stack...${NC}"
    
    if [ -f "docker-compose-monitoring.yml" ]; then
        docker-compose -f docker-compose-monitoring.yml up -d
        if [ $? -eq 0 ]; then
            print_status "Monitoring stack started (Prometheus, Grafana, InfluxDB)"
        else
            print_warning "Failed to start monitoring stack (optional)"
        fi
    else
        print_warning "docker-compose-monitoring.yml not found, skipping monitoring setup"
    fi
}

# Install frontend dependencies
install_frontend() {
    echo -e "\n${YELLOW}Installing Frontend Dependencies...${NC}"
    
    print_info "Running npm install..."
    npm install -q
    
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed"
    else
        print_error "npm install failed"
        exit 1
    fi
}

# Display access information
show_access_info() {
    echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🚀 Startup Complete! Access your services at:               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${BLUE}Web Services:${NC}"
    echo -e "  • Dashboard UI:              ${YELLOW}http://localhost:3000${NC}"
    echo -e "  • Prometheus Metrics:        ${YELLOW}http://localhost:9090${NC}"
    echo -e "  • Grafana Dashboards:        ${YELLOW}http://localhost:3000${NC} (admin/admin)"
    echo -e "  • InfluxDB:                  ${YELLOW}http://localhost:8086${NC}"
    
    echo -e "\n${BLUE}API Endpoints:${NC}"
    echo -e "  • Variant C (Spring MVC):    ${YELLOW}http://localhost:8080${NC}"
    echo -e "    - GET http://localhost:8080/categories"
    echo -e "    - GET http://localhost:8080/items"
    echo -e ""
    echo -e "  • Variant D (Spring REST):   ${YELLOW}http://localhost:8081${NC}"
    echo -e "    - GET http://localhost:8081/categories"
    echo -e "    - GET http://localhost:8081/items"
    
    echo -e "\n${BLUE}PostgreSQL Database:${NC}"
    echo -e "  • Host: localhost"
    echo -e "  • Port: 5432"
    echo -e "  • Database: benchmark_db"
    echo -e "  • User: benchmark"
    echo -e "  • Password: benchmark123"
    
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo -e "  1. Wait 10-15 seconds for all services to be fully ready"
    echo -e "  2. Open Dashboard: ${YELLOW}http://localhost:3000${NC}"
    echo -e "  3. Run load tests from the dashboard UI"
    echo -e "  4. Monitor metrics in Prometheus/Grafana"
    
    echo -e "\n${BLUE}Docker Commands:${NC}"
    echo -e "  • View logs:        ${YELLOW}docker-compose logs -f${NC}"
    echo -e "  • Stop services:    ${YELLOW}docker-compose down${NC}"
    echo -e "  • View API logs:    ${YELLOW}docker-compose logs -f variant-c-mvc${NC}"
    
    echo -e "\n${YELLOW}Note:${NC} Next.js Dashboard will start in another terminal window"
    echo ""
}

# Main execution
main() {
    check_prerequisites
    build_spring_boot
    start_docker_services
    start_monitoring
    install_frontend
    show_access_info
    
    echo -e "\n${BLUE}Starting Next.js Dashboard...${NC}\n"
    npm run dev
}

main
