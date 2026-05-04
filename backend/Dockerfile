FROM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /app
COPY todo-api/pom.xml .
COPY todo-api/src ./src
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:24-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]