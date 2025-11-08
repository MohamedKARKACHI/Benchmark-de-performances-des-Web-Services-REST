#!/bin/bash
# Quick start - assumes Docker and dependencies are already installed

echo "Starting Spring Boot Benchmark Project..."
echo ""

# Start Docker services
docker-compose up -d
docker-compose -f docker-compose-monitoring.yml up -d

echo "Services started. Waiting for PostgreSQL..."
sleep 8

echo ""
echo "Starting Dashboard..."
npm run dev
