FROM openjdk:11
VOLUME /tmp
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]


# docker build -t craighausner/decitrix-api .
# docker run -p 8080:8080 craighausner/decitrix-api

# Google Container Registry
# docker build -t gcr.io/remas-345102/remas-api .
# docker push gcr.io/remas-345102/remas-api