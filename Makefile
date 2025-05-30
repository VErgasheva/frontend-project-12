.PHONY: build start

build:
 cd frontend && npm install && npm run build

start:
 npx serve -s ./frontend/dist
