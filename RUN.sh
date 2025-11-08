#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   REST API Performance Benchmark - Complete Startup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Check if Docker is running
echo -e "\n${YELLOW}[1/5]${NC} Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! docker ps &> /dev/null; then
    echo -e "${RED}✗ Docker daemon is not running. Please start Docker.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

# Check if Node.js is installed
echo -e "\n${YELLOW}[2/5]${NC} Checking Node.js..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ Node.js/npm is not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) is installed${NC}"

# Check if Java is installed
echo -e "\n${YELLOW}[3/5]${NC} Checking Java..."
if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java is not installed. Please install Java 17+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java $(java -version 2>&1 | head -n 1) is installed${NC}"

# Check if Maven is installed
echo -e "\n${YELLOW}[4/5]${NC} Checking Maven..."
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}✗ Maven is not installed. Please install Maven 3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven $(mvn -version 2>&1 | head -n 1) is installed${NC}"

# Install Node dependencies
echo -e "\n${YELLOW}[5/5]${NC} Installing Node dependencies..."
if [ ! -d "node_modules" ]; then
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✓ Node dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Node dependencies already installed${NC}"
fi

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Prerequisites Check Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Starting services
echo -e "\n${BLUE}Starting services...${NC}\n"

# Start Docker containers
echo -e "${YELLOW}Starting Docker services (PostgreSQL, APIs, Monitoring)...${NC}"
docker-compose up -d

# Wait for services to be ready
echo -e "\n${YELLOW}Waiting for services to be ready (30 seconds)...${NC}"
sleep 30

# Check if services are running
echo -e "\n${YELLOW}Checking service status...${NC}"

services_ready=true

# Check PostgreSQL
if docker exec postgres-benchmark pg_isready -U benchmark_user > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    services_ready=false
fi

# Check Variant C API
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Variant C (Spring MVC) API is running on port 8080${NC}"
else
    echo -e "${RED}✗ Variant C API is not responding${NC}"
    services_ready=false
fi

# Check Variant D API
if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Variant D (Spring Data REST) API is running on port 8081${NC}"
else
    echo -e "${RED}✗ Variant D API is not responding${NC}"
    services_ready=false
fi

# Check Prometheus
if curl -s http://localhost:9090/-/healthy > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Prometheus is running on port 9090${NC}"
else
    echo -e "${RED}✗ Prometheus is not responding${NC}"
    services_ready=false
fi

# Check InfluxDB
if curl -s http://localhost:8086/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ InfluxDB is running on port 8086${NC}"
else
    echo -e "${RED}✗ InfluxDB is not responding${NC}"
    services_ready=false
fi

if [ "$services_ready" = true ]; then
    echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}   All Services Running Successfully!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    
    echo -e "\n${BLUE}Dashboard starting in 5 seconds...${NC}"
    sleep 5
    
    # Start Next.js dashboard
    echo -e "\n${BLUE}Starting Next.js Dashboard...${NC}"
    npm run dev
else
    echo -e "\n${RED}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}   Some services failed to start!${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════════${NC}"
    echo -e "\n${YELLOW}Troubleshooting:${NC}"
    echo -e "1. Check Docker logs: docker-compose logs"
    echo -e "2. Make sure ports 5432, 8080, 8081, 9090, 8086 are available"
    echo -e "3. Check available disk space"
    echo -e "4. Try: docker-compose down && docker-compose up -d"
    exit 1
fi
