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
	make start-backend

develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/dist
	cd frontend && npm ci
	cd frontend && npm run build
