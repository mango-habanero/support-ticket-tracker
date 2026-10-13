# compile the application, packages the JAR and splits it into layers.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B package -Dmaven.test.skip=true \
    && mv target/*.jar application.jar \
    && java -Djarmode=tools -jar application.jar extract --layers --destination extracted

# run the extracted layers on a JRE with no build tooling, as a non-root user.
FROM eclipse-temurin:21.0.11_10-jre
RUN groupadd --system app && useradd --system --gid app app
WORKDIR /app
COPY --from=build /build/extracted/dependencies/ ./
COPY --from=build /build/extracted/spring-boot-loader/ ./
COPY --from=build /build/extracted/snapshot-dependencies/ ./
COPY --from=build /build/extracted/application/ ./
USER app
EXPOSE 8095
ENTRYPOINT ["java", "-jar", "application.jar"]