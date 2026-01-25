# REMAS (Real Estate Market Analysis System)

REMAS is a tool for analyzing real estate markets and properties, consisting of a Kotlin Spring Boot API and a React frontend.

## Prerequisites

To run this project locally, you will need:
- **Java 11** or higher (for the API)
- **Node.js** (v14+ recommended) and **npm** (for the Web frontend)
- **Docker** and **Docker Compose** (for the PostgreSQL database)
- **fswatch** (optional, for API auto-recompile on macOS)

---

## Local Setup

Follow these steps to get the application running on your machine.

### 1. Database (Docker)

The application requires a PostgreSQL database. Start it using the provided `docker-compose.yml`:

```bash
docker-compose up -d
```

*Note: The database will be accessible at `localhost:5445`.*

### 2. Backend API (Kotlin / Spring Boot)

1.  **Navigate to the API directory:**
    ```bash
    cd api
    ```
2.  **Run the application:**
    You can use the provided start script:
    ```bash
    ./start.sh
    ```
    *Note: The start script uses `fswatch` to monitor file changes and trigger automatic recompilation and restarts via Spring Boot DevTools.*

    *Or manually via Maven (no auto-recompile):*
    ```bash
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
    ```
3.  **Verify:**
    The API should be running at [http://localhost:8080](http://localhost:8080).
    You can access the Swagger UI documentation at [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

### 3. Frontend Web (React)

1.  **Navigate to the Web directory:**
    ```bash
    cd web
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
4.  **Verify:**
    The web application will automatically open in your browser at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

-   `/api`: Backend service built with Kotlin 1.6 and Spring Boot 2.6.
-   `/web`: Frontend application built with React, TypeScript, and Material-UI.
-   `docker-compose.yml`: Definition for the PostgreSQL database container.