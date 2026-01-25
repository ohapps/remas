#!/bin/bash

# Kill all background jobs (app and watcher) when this script exits
trap "kill 0" EXIT

# Fix for Java 16+ reflect / dom4j / classloader issues
export MAVEN_OPTS="--add-opens java.base/java.lang=ALL-UNNAMED"

echo "🚀 Starting REMAS API with Auto-Recompile..."

# 1. Start the Spring Boot app in the background
./mvnw spring-boot:run -Dspring-boot.run.profiles=local &

# 2. Start the File Watcher in the background
# This monitors your Kotlin files and runs 'mvnw compile' when you save.
# Spring Boot DevTools (added to pom.xml) will then see the new classes and restart the app.
if command -v fswatch >/dev/null 2>&1; then
    echo "👀 Watcher started: Monitoring src/main/kotlin for changes..."
    fswatch -o src/main/kotlin | xargs -n1 -I{} ./mvnw compile &
else
    echo "⚠️  fswatch not found! Auto-recompile will not work."
    echo "   Please install it: brew install fswatch"
fi

# Keep the script running
wait
