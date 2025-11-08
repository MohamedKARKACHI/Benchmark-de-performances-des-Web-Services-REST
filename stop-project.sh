#!/bin/bash

echo "Stopping all services..."

# Stop Docker containers
docker-compose down

# Stop monitoring stack if running
docker-compose -f docker-compose-monitoring.yml down 2>/dev/null

echo "All services stopped"
echo ""
echo "To view logs of stopped containers:"
echo "  docker-compose logs"
echo ""
echo "To clean up volumes:"
echo "  docker volume prune"
