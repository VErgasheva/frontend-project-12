install:
	npm ci
	cd frontend && npm ci

lint-frontend:
	make -C frontend lint

start-frontend:
	make -C frontend start

start-backend:
	npx start-server -s ./frontend/dist

deploy:
	git push heroku main

start:
	npx serve -s frontend/dist

develop:
	make start-backend & make start-frontend

build:
	cd frontend && npm ci && npm run build
