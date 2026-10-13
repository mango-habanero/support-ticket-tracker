# Backend

## Overview

This is the backend of the support ticket tracker. The implementation uses Java 21 with Spring Boot, a Java application framework.

## Prerequisites

- JDK (Java Development Kit) 21.
- Docker, to run the database. Any PostgreSQL 17 server works instead.
- A bash or zsh shell. On Windows, use WSL (Windows Subsystem for Linux) or Git Bash.
- Internet access on the first run, for Docker Hub and Maven Central.
- Ports 5432 and 8095 free on this computer.

## Run locally

1. Start a PostgreSQL 17 database in a container.

```bash
   docker run -d --name tt-db -p 5432:5432 \
     -e POSTGRES_DB=lodwar_ticket_tracker \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     postgres:17
```

2. Copy `.env.example` to `.env`, then load it into the shell.

```bash
   cp .env.example .env
   set -a
   source .env
   set +a
```

3. Start the API. The Maven wrapper (`mvnw`) downloads Maven on first use.

```bash
   ./mvnw spring-boot:run
```

4. Check that the API runs. The response reports the status `UP`.

```bash
   curl http://localhost:8095/api/v1/actuator/health
```

Stop the database with `docker rm -f tt-db`.

## Configuration

The API reads five environment variables.

| Variable                     | Default | Effect                                                                                                     |
|------------------------------|---------|------------------------------------------------------------------------------------------------------------|
| `SERVER_PORT`                | `8095`  | Sets the HTTP port.                                                                                        |
| `SPRING_DATASOURCE_URL`      | None    | Sets the address of the database in JDBC (Java Database Connectivity) format.                              |
| `SPRING_DATASOURCE_USERNAME` | None    | Sets the database user.                                                                                    |
| `SPRING_DATASOURCE_PASSWORD` | None    | Sets the database password.                                                                                |
| `SPRING_PROFILES_ACTIVE`     | None    | The value `local` loads 40 sample tickets on first start. Without the variable, the database starts empty. |

The example file holds a local database password. Change it together with the `POSTGRES_PASSWORD` value in the database command.

## Tests

This section assumes that Docker is running. The tests start their own PostgreSQL 17 container.

```bash
./mvnw test
```
