# Stage 1: Build the application
FROM amazoncorretto:17 AS build
WORKDIR /app

# Copy the maven wrapper and pom file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline

# Copy the source code and build the application
COPY src ./src
# Fix for Java 17 reflection issues during build
ENV MAVEN_OPTS="--add-opens java.base/java.lang=ALL-UNNAMED"
RUN ./mvnw package -DskipTests

# Stage 2: Run the application
FROM amazoncorretto:17
VOLUME /tmp
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]


# docker build -t craighausner/decitrix-api .
# docker run -p 8080:8080 craighausner/decitrix-api

# Google Container Registry
# docker build -t gcr.io/remas-345102/remas-api .
# docker push gcr.io/remas-345102/remas-api