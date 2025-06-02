.PHONY: build start

build:
 cd frontend && npm install && npm run build

start:
 node server.js