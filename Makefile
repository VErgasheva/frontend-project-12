setup:
	npm ci
	make compile

lint-ui:
	make -C client lint

run-ui:
	make -C client serve

run-api:
	npx start-server -s ./client/dist

deploy-heroku:
	git push heroku main

serve:
	make run-api

dev:
	make run-api & make run-ui

compile:
	rm -rf client/dist
	npm run compile

start:
    npm start