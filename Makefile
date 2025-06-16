install:
	cd frontend && npm ci

lint-frontend:
	cd frontend && npm run lint

start-frontend:
	cd frontend && npm run start

start-backend:
	npx serve -s frontend/dist -l 10000

deploy:
	git push heroku main

start:
	npx serve -s frontend/dist -l 10000

dev:
	cd frontend && npm run dev

compile:
	rm -rf frontend/dist
	cd frontend && npm run build

build:
	cd frontend && npm run build

setup:
	make install
	make build

run-server:
	npx serve -s frontend/dist -l 10000

run-ui:
	cd frontend && npm run dev

test:
	cd frontend && npm run test:e2e
