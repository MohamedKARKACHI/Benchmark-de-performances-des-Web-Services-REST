#!/bin/bash

echo "REST Benchmark - Service Logs"
echo ""
echo "Commands:"
echo "  1. All logs:           docker-compose logs -f"
echo "  2. Variant C (MVC):    docker-compose logs -f variant-c-mvc"
echo "  3. Variant D (REST):   docker-compose logs -f variant-d-rest"
echo "  4. PostgreSQL:         docker-compose logs -f postgres"
echo ""
echo "Select an option (1-4):"
read option

case $option in
  1) docker-compose logs -f ;;
  2) docker-compose logs -f variant-c-mvc ;;
  3) docker-compose logs -f variant-d-rest ;;
  4) docker-compose logs -f postgres ;;
  *) echo "Invalid option" ;;
esac
