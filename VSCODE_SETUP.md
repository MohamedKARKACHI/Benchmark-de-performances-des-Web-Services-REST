# Running the Project in VS Code

## Step 1: Open Project in VS Code

### Option A: From Terminal
\`\`\`bash
cd Benchmark-de-performances-des-Web-Services-REST
code .
\`\`\`

### Option B: From VS Code GUI
1. Open VS Code
2. Click **File** → **Open Folder**
3. Select your project folder
4. Click **Open**

---

## Step 2: Install Required VS Code Extensions

These extensions are essential for working with Spring Boot and Next.js:

### Java Development
1. Click **Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
2. Search and install:
   - **Extension Pack for Java** (Microsoft)
     - Includes: Language Support for Java, Debugger for Java, Test Runner, Maven for Java, Project Manager for Java, Visual Studio IntelliCode
   - **Spring Boot Extension Pack** (Pivotal)
     - Includes: Spring Boot Tools, Spring Initializr, Concourse CI Pipeline Editor
   - **Lombok Annotations Support for VS Code** (GaelicGamer)

### Node.js & Next.js
3. Continue searching and install:
   - **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
   - **Prettier - Code formatter** (esbenp.prettier-vscode)
   - **ESLint** (dbaeumer.vscode-eslint)
   - **Thunder Client** (rangav.vscode-thunder-client) - For API testing

### Database & Tools
4. Also install:
   - **REST Client** (humao.rest-client) - Test APIs directly in VS Code
   - **YAML** (redhat.vscode-yaml)
   - **Docker** (ms-azuretools.vscode-docker)

### Recommended (Optional)
   - **Peacock** (johnpapa.peacock) - Color code workspace tabs
   - **Markdown Preview Enhanced** (shd101wyy.markdown-preview-enhanced)

---

## Step 3: Setup Java Environment

### Install JDK 17

**macOS**
\`\`\`bash
# Using Homebrew
brew install openjdk@17

# Set JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc
\`\`\`

**Ubuntu/Debian**
\`\`\`bash
sudo apt update
sudo apt install openjdk-17-jdk
\`\`\`

**Windows (Chocolatey)**
\`\`\`powershell
choco install openjdk17
\`\`\`

### Verify Installation
\`\`\`bash
java -version
# Should show: openjdk version "17.x.x"
\`\`\`

### In VS Code:
1. Press **Ctrl+Shift+P** (or **Cmd+Shift+P** on Mac)
2. Type: **Java: Configure Runtime**
3. Select Java 17 as default runtime

---

## Step 4: Configure VS Code Settings

Create/update `.vscode/settings.json` in project root:

\`\`\`json
{
  // Java Configuration
  "java.home": "/path/to/java17",
  "java.jdt.ls.vmargs": "-Xmx4g",
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-17",
      "path": "/path/to/java17",
      "default": true
    }
  ],

  // Maven Configuration
  "maven.executable.preferMavenWrapper": true,
  "maven.view": "flat",

  // Node.js Configuration
  "node.debug.settings": {
    "skipFiles": ["<node_internals>/**"]
  },

  // Editor Configuration
  "[java]": {
    "editor.defaultFormatter": "redhat.java",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // Docker
  "docker.showDebugOutput": true
}
\`\`\`

---

## Step 5: Create VS Code Task Configuration

Create `.vscode/tasks.json`:

\`\`\`json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build Variant C (Spring MVC)",
      "type": "shell",
      "command": "mvn",
      "args": [
        "-f",
        "variant-c-mvc/pom.xml",
        "clean",
        "package",
        "-DskipTests"
      ],
      "group": {
        "kind": "build",
        "isDefault": false
      },
      "problemMatcher": ["$java"],
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared"
      }
    },
    {
      "label": "Build Variant D (Spring Data REST)",
      "type": "shell",
      "command": "mvn",
      "args": [
        "-f",
        "variant-d-rest/pom.xml",
        "clean",
        "package",
        "-DskipTests"
      ],
      "group": {
        "kind": "build",
        "isDefault": false
      },
      "problemMatcher": ["$java"]
    },
    {
      "label": "Run Docker Services",
      "type": "shell",
      "command": "docker-compose",
      "args": ["up", "-d"],
      "presentation": {
        "echo": true,
        "reveal": "always"
      }
    },
    {
      "label": "Stop Docker Services",
      "type": "shell",
      "command": "docker-compose",
      "args": ["down"]
    },
    {
      "label": "Install npm dependencies",
      "type": "shell",
      "command": "npm",
      "args": ["install"],
      "presentation": {
        "echo": true,
        "reveal": "always"
      }
    }
  ]
}
\`\`\`

Run tasks with: **Terminal** → **Run Task** → Select task

---

## Step 6: Create Debug Configurations

Create `.vscode/launch.json`:

\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Variant C (Spring MVC)",
      "type": "java",
      "name": "Spring Boot App",
      "request": "launch",
      "cwd": "${workspaceFolder}/variant-c-mvc",
      "mainClass": "com.benchmark.RestControllerApp",
      "projectName": "variant-c-mvc",
      "args": "",
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Debug Variant D (Spring Data REST)",
      "type": "java",
      "name": "Spring Boot App",
      "request": "launch",
      "cwd": "${workspaceFolder}/variant-d-rest",
      "mainClass": "com.benchmark.DataRestApp",
      "projectName": "variant-d-rest",
      "args": "",
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Dashboard (Next.js)",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
\`\`\`

Debug by pressing **F5** or **Run** → **Start Debugging**

---

## Step 7: Run Services in VS Code

### Method 1: Using Built-in Terminal (Recommended)

1. Open Terminal: **Terminal** → **New Terminal** (or Ctrl+`)
2. Create multiple terminals:

**Terminal 1 - Start Docker Services**
\`\`\`bash
docker-compose up -d
docker-compose -f docker-compose-monitoring.yml up -d
\`\`\`

**Terminal 2 - Run Variant C (Spring MVC)**
\`\`\`bash
cd variant-c-mvc
mvn spring-boot:run
\`\`\`

**Terminal 3 - Run Variant D (Spring Data REST)**
\`\`\`bash
cd variant-d-rest
mvn spring-boot:run
\`\`\`

**Terminal 4 - Run Next.js Dashboard**
\`\`\`bash
npm install
npm run dev
\`\`\`

To create multiple terminals, click the **+** icon in the terminal tab.

### Method 2: Using Debug Configurations

1. Open Run and Debug: **Ctrl+Shift+D**
2. Select configuration from dropdown:
   - "Debug Variant C (Spring MVC)" → Press **F5**
   - "Debug Variant D (Spring Data REST)" → Press **F5**
   - "Debug Dashboard (Next.js)" → Press **F5**

### Method 3: Using Tasks

1. Press **Ctrl+Shift+P** → **Tasks: Run Task**
2. Select:
   - "Build Variant C (Spring MVC)"
   - "Build Variant D (Spring Data REST)"
   - "Run Docker Services"

---

## Step 8: Monitor Services

### View All Running Containers
\`\`\`bash
docker ps
\`\`\`

### View Logs in VS Code

1. **Terminal Tab**: See real-time logs in terminal
2. **Docker Extension**:
   - Click Docker icon in sidebar
   - Expand "Containers" → Right-click → "View Logs"

### Test APIs from VS Code

Create file `test-api.rest` in project root:

\`\`\`rest
### Get Categories (Variant C)
GET http://localhost:8080/categories?page=0&size=10

### Get Items (Variant D)
GET http://localhost:8081/items?page=0&size=10

### Create Category
POST http://localhost:8080/categories
Content-Type: application/json

{
  "code": "CAT001",
  "name": "Electronics"
}

### Filter Items by Category
GET http://localhost:8080/items?categoryId=1&page=0&size=10

### Get Prometheus Metrics
GET http://localhost:9090/api/v1/query?query=http_requests_total
\`\`\`

To use: Click **Send Request** above each request

---

## Step 9: Complete Startup Workflow

### Quick 4-Step Startup:

**Step 1: Terminal 1 - Docker**
\`\`\`bash
docker-compose up -d
docker-compose -f docker-compose-monitoring.yml up -d
sleep 10  # Wait for services to start
\`\`\`

**Step 2: Terminal 2 - Variant C**
\`\`\`bash
cd variant-c-mvc && mvn spring-boot:run
\`\`\`

**Step 3: Terminal 3 - Variant D**
\`\`\`bash
cd variant-d-rest && mvn spring-boot:run
\`\`\`

**Step 4: Terminal 4 - Dashboard**
\`\`\`bash
npm install && npm run dev
\`\`\`

Then open:
- Dashboard: http://localhost:3000
- Variant C: http://localhost:8080/categories
- Variant D: http://localhost:8081/categories
- Prometheus: http://localhost:9090

---

## Step 10: Useful VS Code Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Terminal | Ctrl+` |
| New Terminal | Ctrl+Shift+` |
| Run Task | Ctrl+Shift+P → Tasks: Run Task |
| Debug | F5 |
| Stop Debug | Shift+F5 |
| Step Over | F10 |
| Step Into | F11 |
| Breakpoint | F9 |
| Command Palette | Ctrl+Shift+P |
| Go to File | Ctrl+P |
| Find | Ctrl+F |
| Replace | Ctrl+H |
| Format Code | Shift+Alt+F |

---

## Troubleshooting in VS Code

### Java Extension Issues

1. **Java Language Server not starting**
   - Open Command Palette: **Ctrl+Shift+P**
   - Type: **Java: Clean Language Server Workspace**
   - Restart VS Code

2. **Maven not found**
   - Open `.vscode/settings.json`
   - Add: `"maven.executable.preferMavenWrapper": true`

3. **Classpath issues**
   - Right-click `pom.xml` → **Run** → **Maven clean**
   - Then **Maven install**

### Node/npm Issues

1. **npm not found**
   - Check Node installation: `node -v`
   - Restart VS Code terminal

2. **Port already in use**
   - Kill process: `lsof -i :3000 | grep node | awk '{print $2}' | xargs kill -9`

### Docker Issues

1. **Docker daemon not running**
   - macOS: Open Docker Desktop from Applications
   - Linux: `sudo systemctl start docker`
   - Windows: Launch Docker Desktop

2. **Permission denied**
   - macOS/Linux: `sudo usermod -aG docker $USER`
   - Log out and log back in

---

## Project File Navigation

Use **Ctrl+P** to quickly open files:

\`\`\`
# Dashboard
components/dashboard.tsx
app/page.tsx

# Spring Boot - Variant C
variant-c-mvc/src/main/java/com/benchmark/controller/CategoryController.java

# Spring Boot - Variant D
variant-d-rest/src/main/java/com/benchmark/repository/CategoryRepository.java

# Configuration
docker-compose.yml
pom.xml

# API Tests
test-api.rest
\`\`\`

---

## Environment Variables

Create `.env` file in project root:

\`\`\`
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/benchmark
DATABASE_USER=benchmark_user
DATABASE_PASSWORD=secure_password

# API Endpoints
NEXT_PUBLIC_VARIANT_C_URL=http://localhost:8080
NEXT_PUBLIC_VARIANT_D_URL=http://localhost:8081
NEXT_PUBLIC_PROMETHEUS_URL=http://localhost:9090

# Monitoring
PROMETHEUS_PORT=8090
GRAFANA_ADMIN_PASSWORD=admin

# Java Settings
JAVA_OPTS=-Xms1g -Xmx4g
\`\`\`

---

## Tips & Best Practices

1. **Use .vscode/launch.json** for debugging instead of running from terminal
2. **Keep terminals open** for monitoring logs in real-time
3. **Use breakpoints** to debug Spring Boot applications
4. **Use REST Client extension** to test APIs without leaving VS Code
5. **Check Docker extension** for visual container management
6. **Use Maven Explorer** to manage dependencies and run tasks
7. **Enable autosave** in VS Code settings for quick saves

---

## Summary - Full Workflow

1. Open VS Code
2. Install extensions (Java Pack, Spring Boot Pack)
3. Create debug configurations (.vscode/launch.json)
4. Create task configuration (.vscode/tasks.json)
5. Open 4 terminals
6. Start Docker services (Terminal 1)
7. Start Spring Boot services (Terminals 2 & 3)
8. Start Next.js Dashboard (Terminal 4)
9. Open http://localhost:3000 in browser
10. Monitor logs and test APIs from VS Code

---

Everything is ready! Your REST API benchmark project runs smoothly in VS Code with full debugging support.
