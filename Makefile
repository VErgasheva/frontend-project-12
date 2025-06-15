install:
	cd frontend && npm ci
	make -C frontend build

lint-frontend:
	make -C frontend lint

start-frontend:
	make -C frontend start

start-backend:
	npx serve -s frontend/dist -l 10000

deploy:
	git push heroku main

start:
	make run-server

dev:
	make run-server & make run-ui

compile:
	rm -rf frontend/dist
	npm run build

build:
	make -C frontend build

setup: 
	install build
