setup:
	npm ci
	make compile

lint-ui:
	make -C frontend lint

run-ui:
	make -C frontend start

run-server: compile
	npx start-server -s ./frontend/dist

deploy:
	git push heroku main

start:
	make run-server

dev:
	make run-server & make run-ui

compile:
	rm -rf frontend/dist
	cd frontend && npm run build