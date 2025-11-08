# Color codes for PowerShell
$Blue = "`e[34m"
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Reset = "`e[0m"

Write-Host "${Blue}═══════════════════════════════════════════════════════════${Reset}"
Write-Host "${Blue}   REST API Performance Benchmark - Complete Startup${Reset}"
Write-Host "${Blue}═══════════════════════════════════════════════════════════${Reset}"

# Check if Docker is running
Write-Host "`n${Yellow}[1/5]${Reset} Checking Docker..."
try {
    docker ps > $null 2>&1
    Write-Host "${Green}✓ Docker is running${Reset}"
} catch {
    Write-Host "${Red}✗ Docker daemon is not running. Please start Docker.${Reset}"
    exit 1
}

# Check if Node.js is installed
Write-Host "`n${Yellow}[2/5]${Reset} Checking Node.js..."
try {
    $nodeVersion = node --version
    Write-Host "${Green}✓ Node.js $nodeVersion is installed${Reset}"
} catch {
    Write-Host "${Red}✗ Node.js is not installed. Please install Node.js 18+${Reset}"
    exit 1
}

# Check if Java is installed
Write-Host "`n${Yellow}[3/5]${Reset} Checking Java..."
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "${Green}✓ Java is installed${Reset}"
} catch {
    Write-Host "${Red}✗ Java is not installed. Please install Java 17+${Reset}"
    exit 1
}

# Check if Maven is installed
Write-Host "`n${Yellow}[4/5]${Reset} Checking Maven..."
try {
    mvn -version > $null 2>&1
    Write-Host "${Green}✓ Maven is installed${Reset}"
} catch {
    Write-Host "${Red}✗ Maven is not installed. Please install Maven 3.8+${Reset}"
    exit 1
}

# Install Node dependencies
Write-Host "`n${Yellow}[5/5]${Reset} Installing Node dependencies..."
if (-Not (Test-Path "node_modules")) {
    npm install
    Write-Host "${Green}✓ Node dependencies installed${Reset}"
} else {
    Write-Host "${Green}✓ Node dependencies already installed${Reset}"
}

Write-Host "`n${Green}═══════════════════════════════════════════════════════════${Reset}"
Write-Host "${Green}   Prerequisites Check Complete!${Reset}"
Write-Host "${Green}═══════════════════════════════════════════════════════════${Reset}"

# Starting services
Write-Host "`n${Blue}Starting services...${Reset}`n"

Write-Host "${Yellow}Starting Docker services (PostgreSQL, APIs, Monitoring)...${Reset}"
docker-compose up -d

Write-Host "`n${Yellow}Waiting for services to be ready (30 seconds)...${Reset}"
Start-Sleep -Seconds 30

Write-Host "`n${Yellow}Checking service status...${Reset}"

$servicesReady = $true

# Check services
if ((curl.exe -s http://localhost:8080/actuator/health 2>$null) -eq $null) {
    Write-Host "${Red}✗ Variant C API is not responding${Reset}"
    $servicesReady = $false
} else {
    Write-Host "${Green}✓ Variant C (Spring MVC) API is running on port 8080${Reset}"
}

if ((curl.exe -s http://localhost:8081/actuator/health 2>$null) -eq $null) {
    Write-Host "${Red}✗ Variant D API is not responding${Reset}"
    $servicesReady = $false
} else {
    Write-Host "${Green}✓ Variant D (Spring Data REST) API is running on port 8081${Reset}"
}

if ($servicesReady) {
    Write-Host "`n${Green}═══════════════════════════════════════════════════════════${Reset}"
    Write-Host "${Green}   All Services Running Successfully!${Reset}"
    Write-Host "${Green}═══════════════════════════════════════════════════════════${Reset}"
    
    Write-Host "`n${Blue}Dashboard starting in 5 seconds...${Reset}"
    Start-Sleep -Seconds 5
    
    Write-Host "`n${Blue}Starting Next.js Dashboard...${Reset}"
    npm run dev
} else {
    Write-Host "`n${Red}═══════════════════════════════════════════════════════════${Reset}"
    Write-Host "${Red}   Some services failed to start!${Reset}"
    Write-Host "${Red}═══════════════════════════════════════════════════════════${Reset}"
    exit 1
}
