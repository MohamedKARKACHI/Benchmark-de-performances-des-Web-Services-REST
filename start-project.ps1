# PowerShell startup script for Windows

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "REST Performance Benchmark - Spring Boot" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Docker found" -ForegroundColor Green

# Check Docker Compose
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker Compose is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Docker Compose found" -ForegroundColor Green

# Check Maven
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Maven is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Maven found" -ForegroundColor Green

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js/npm is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Node.js found" -ForegroundColor Green

Write-Host ""

# Build Spring Boot
Write-Host "Building Spring Boot applications..." -ForegroundColor Yellow
mvn clean package -DskipTests -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Maven build failed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Spring Boot build successful" -ForegroundColor Green

# Start Docker services
Write-Host ""
Write-Host "Starting Docker services..." -ForegroundColor Yellow

# Stop existing containers
docker-compose down 2>$null

# Start new containers
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Docker containers" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Docker services started" -ForegroundColor Green

# Wait for PostgreSQL
Write-Host "Waiting for PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Start monitoring
if (Test-Path "docker-compose-monitoring.yml") {
    Write-Host ""
    Write-Host "Starting monitoring stack..." -ForegroundColor Yellow
    docker-compose -f docker-compose-monitoring.yml up -d
    Write-Host "OK: Monitoring stack started" -ForegroundColor Green
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Frontend dependencies installed" -ForegroundColor Green

# Show access information
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Access your services at:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Web Services:" -ForegroundColor Yellow
Write-Host "  Dashboard UI:        http://localhost:3000" -ForegroundColor White
Write-Host "  Prometheus:          http://localhost:9090" -ForegroundColor White
Write-Host "  Grafana:             http://localhost:3000" -ForegroundColor White
Write-Host "  InfluxDB:            http://localhost:8086" -ForegroundColor White
Write-Host ""

Write-Host "API Endpoints:" -ForegroundColor Yellow
Write-Host "  Variant C (MVC):     http://localhost:8080" -ForegroundColor White
Write-Host "  Variant D (REST):    http://localhost:8081" -ForegroundColor White
Write-Host ""

Write-Host "PostgreSQL:" -ForegroundColor Yellow
Write-Host "  Host: localhost, Port: 5432" -ForegroundColor White
Write-Host "  User: benchmark, Password: benchmark123" -ForegroundColor White
Write-Host ""

Write-Host "Starting Next.js Dashboard..." -ForegroundColor Yellow
Write-Host ""

npm run dev
