FROM maven:3.9.15-eclipse-temurin-25 AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src
RUN mvn -DskipTests clean package

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/target/moeda-estudantil-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "/app/app.jar"]
