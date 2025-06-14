setup:
	npm ci
	make compile
	make -C frontend install

lint-ui:
	make -C frontend lint

run-ui:
	make -C frontend start

run-server:
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