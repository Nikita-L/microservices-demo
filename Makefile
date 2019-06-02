# Docker compose commands
up:
	docker-compose up -d
	docker-compose ps

rebuild:
	docker-compose up --build -d
	docker-compose ps

log-frontend:
	docker-compose logs -f frontend

log-auth-api:
	docker-compose logs -f auth-api

log-todos-api:
	docker-compose logs -f todos-api

log-users-api:
	docker-compose logs -f users-api

log-log-message-processor:
	docker-compose logs -f log-message-processor

log-zipkin:
	docker-compose logs -f zipkin

log-redis-queue:
	docker-compose logs -f redis-queue

exec-db-users-api:
	docker-compose exec users-api-db bash

exec-db-todos-api:
	docker-compose exec todos-api-db bash

down:
	docker-compose down

ps:
	docker-compose ps


conf_dev:
	cp -f localsettings.yml ../../Orderman/local_settings.yml

chown:
	sudo chown -R ${USER}:${USER} .