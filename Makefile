SHELL=/bin/bash

init:
	@docker compose build
	@docker compose run --rm base /works/scripts/clone_datasets.sh

install:
	@docker compose exec base yarn install
	@docker cp base:/works/node_modules/ ./

up:
	@docker compose up

down:
	@docker compose down

exec:
	@docker compose exec base /bin/bash
