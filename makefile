ci: remove-unused-images remove-containers build-image run-tests stop-containers

cd: ci deploy

remove-unused-images:
	@echo
	@echo Removing all unused docker images
	@docker rmi $$(docker images -q --filter 'dangling=true') || true
remove-containers:
	@echo
	@echo Removing old docker containers
	@docker rm chat-test || true
	@docker rm chat-tmp || true
	@docker rm chat-selenium-firefox || true
build-image:
	@echo
	@echo Building new docker image
	@rm -rf artifacts || true
	docker build -t chat .
run-tests:
	@echo
	@echo Starting up app container for testing
	docker run -d --name chat-tmp chat
	@echo
	@echo Starting up Selenium standalone server
	docker run -d --name chat-selenium-firefox --link chat-tmp selenium/standalone-firefox
	@echo
	@echo Starting up test harness
	docker run -dit --name chat-test --link chat-selenium-firefox chat bash
	@echo
	@echo Running tests
	@docker exec chat-test npm test || true
	@docker exec chat-test npm run-script e2e || true
	@docker cp chat-test:/usr/src/app/artifacts . || true
stop-containers:
	@echo
	@echo Stopping test containers
	@docker stop chat-test || true
	@docker exec chat-tmp bash -c 'kill $$(pidof gulp)' || true
	@docker stop chat-selenium-firefox || true
deploy:
	@echo
	@echo Deploying app
	@docker exec chat bash -c 'kill $$(pidof gulp)' || true
	@sleep 1
	@docker rm chat || true
	docker run -d --name chat -e VIRTUAL_HOST=chat.livehen.com -e VIRTUAL_PORT=3000 chat
