.PHONY: help setup build start start-docker stop logs test clean

help:
	@echo "REST Performance Benchmark - Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  setup          - Setup project (first time only)"
	@echo "  build          - Build Spring Boot applications"
	@echo "  start          - Start all services and dashboard"
	@echo "  start-docker   - Start Docker services only"
	@echo "  stop           - Stop all services"
	@echo "  logs           - View service logs"
	@echo "  test           - Test API endpoints"
	@echo "  clean          - Clean Docker volumes and Maven build"
	@echo "  help           - Show this help message"

setup:
	@chmod +x start-project.sh quick-start.sh stop-project.sh logs.sh test-api.sh setup-and-run.sh
	@echo "Setup complete. Run 'make start' to begin"

build:
	@echo "Building Spring Boot applications..."
	@mvn clean package -DskipTests -q
	@echo "Build complete"

start: build
	@./start-project.sh

start-docker:
	@docker-compose up -d
	@docker-compose -f docker-compose-monitoring.yml up -d
	@echo "Docker services started"

stop:
	@./stop-project.sh

logs:
	@./logs.sh

test:
	@./test-api.sh

clean:
	@echo "Cleaning up..."
	@docker-compose down -v
	@docker-compose -f docker-compose-monitoring.yml down -v
	@mvn clean -q
	@echo "Cleanup complete"
