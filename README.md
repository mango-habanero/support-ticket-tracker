# Support Ticket Tracker

## Overview

This repository holds the support ticket tracker, a web application that records support tickets. The tracker has two parts: a frontend that shows the tickets in a web browser, and a backend that stores and serves them.

![The ticket tracker web interface, showing the ticket counts for each status, a filtered and paged table of tickets, and the form that creates a ticket.](docs/screenshot.png)

## Prerequisites

- Docker 23 or later, with Docker Compose version 2 (the `docker compose` command).
- Internet access on the first build, for Docker Hub, Maven Central, the npm registry and Google Fonts.
- Ports 3000 and 8095 free on this computer.

## Run

```bash
docker compose up --build
```

Open http://localhost:3000. The application loads 40 sample tickets on first start. Stop it with `docker compose down`. Delete the stored tickets as well with `docker compose down -v`.

The [backend](backend/README.md) and the [frontend](frontend/README.md) each have a README with instructions to run them alone.

## Decisions and Tradeoffs

### Decisions: choices made between alternatives

1. The assignment names no limits on status changes, so the API allows only three, OPEN to IN_PROGRESS, OPEN to CLOSED and IN_PROGRESS to CLOSED, and refuses every other status change, instead of allowing any change.
2. The assignment names no error format, so the API answers a faulty request with HTTP code 400 and a valid request that the ticket's current status refuses with HTTP code 409, instead of one generic error, so a client knows whether the request or the ticket's status is the problem.
3. The assignment asks for integration tests, so the tests run against a real PostgreSQL database that Docker starts, instead of an in-memory database, which lets the database's own constraints behave as in production.

### Shortcuts: parts simplified on purpose

1. The frontend keeps its own copy of the three permitted status changes from decision 1 and shows only those in its status menu, instead of querying the API for them, so the list exists in two places, and the API still rejects any change that an outdated copy shows.
2. Every test rolls back its database changes when it ends, so no test covers behaviour that appears only after a database commit, such as the lock that makes two updates to one ticket run one after the other.
3. The Docker Compose setup serves local use only, so it stores default passwords in `compose.yaml` and has no proxy server in front of the frontend, which makes it unsafe to expose to the internet.

### With more time: work that closes each shortcut

1. Return the allowed permitted changes with each ticket from the API and remove the interface's copy, which closes shortcut 1.
2. Add a test that commits two simultaneous updates to one ticket, one to CLOSED and one to IN_PROGRESS, and checks that the ticket ends CLOSED, which closes shortcut 2.
3. Run the two images on a virtual machine or a managed container service with passwords set outside the repository, which closes shortcut 3.