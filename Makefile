SHELL := /usr/bin/env bash

frontend-prod:
	docker compose -f docker-compose.prod.yml up -d --build

frontend-prod-down:
	docker compose -f docker-compose.prod.yml down

frontend-dev:
	docker compose up -d --build

frontend-dev-down:
	docker compose down

run-project-prod:
	$(MAKE) frontend-prod

upgrade:
	$(MAKE) run-project-prod

down-project-prod:
	$(MAKE) frontend-prod-down

run-project-dev:
	$(MAKE) frontend-dev

down-project-dev:
	$(MAKE) frontend-dev-down