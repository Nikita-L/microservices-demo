# Docker compose commands
up:
	docker-compose up -d
	sleep 10 && make setup-db-todos-cluster
	docker-compose ps

rebuild:
	docker-compose up --build -d
	docker-compose ps

log-all:
	docker-compose logs -f frontend auth-api todos-api users-api log-message-processor

log-angular-service:
	docker-compose logs -f angular-service

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

exec-db-todos-api-1:
	docker-compose exec todos-api-db-1 mongo

exec-db-todos-api-2:
	docker-compose exec todos-api-db-2 mongo --eval "rs.slaveOk()" --shell

exec-db-todos-api-3:
	docker-compose exec todos-api-db-3 mongo --eval "rs.slaveOk()" --shell

setup-db-todos-cluster:
	docker-compose exec todos-api-db-1 mongo --eval "load('/setupDBCluster.js')" && sleep 20 && docker-compose exec todos-api-db-1 mongo --eval "load('/initDB.js')"

down:
	docker-compose down

ps:
	docker-compose ps


conf_dev:
	cp -f localsettings.yml ../../Orderman/local_settings.yml

chown:
	sudo chown -R ${USER}:${USER} .