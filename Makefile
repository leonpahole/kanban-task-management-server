up:
	docker compose --env-file .env.development up -d 

down:
	docker compose --env-file .env.development down -v
