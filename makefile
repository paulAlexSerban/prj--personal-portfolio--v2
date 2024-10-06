# Variables for script paths
DOCKER_IMAGE_SCRIPTS := ./tools/docker-image-scripts
DEVELOP_COMPOSE_SCRIPTS := ./tools/develop-compose-scripts

# ------------------------------------------------------------- #
# (compose): Next.js SSG Personal Portfolio
# ------------------------------------------------------------- #

# Core build 
core_build:
	@bash $(DOCKER_IMAGE_SCRIPTS)/core.bash build

# Clean 
clean-all:
	@echo "Cleaning up..."
	@docker system prune -f
	@echo "Cleaned up!"