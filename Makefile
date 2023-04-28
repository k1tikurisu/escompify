SHELL=/bin/bash

init:
	@docker compose build
	@docker compose run --rm base /works/scripts/clone_datasets.sh
