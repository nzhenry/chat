ci: remove-unused-images remove-containers build-image startup-app run-tests stop-containers

cd: ci deploy

remove-unused-images:
	@docker rmi $$(docker images -q) || true
remove-containers:
	@docker rm chat-test || true
	@docker rm chat-tmp || true
	@docker rm chat-selenium-server || true
build-image:
	@docker build -t chat .
startup-app:
	@docker run -d	--name chat-tmp chat
run-tests:
	@docker run -d --name chat-selenium-server --link chat-tmp selenium/standalone-firefox
	@docker run -dit --name chat-test --link chat-selenium-server chat bash
	@docker exec chat-test npm test || true
	@docker exec chat-test bash -c 'cat test_reports/*.xml' > test_report.xml
stop-containers:
	@docker stop chat-test || true
	@docker exec chat-tmp bash -c 'kill $$(pidof gulp)' || true
	@docker stop chat-selenium-server || true
deploy:
	@docker exec chat bash -c 'kill $$(pidof gulp)' || true
	@docker rm chat || true
	@docker run -d --name chat -e VIRTUAL_HOST=chat.livehen.com -e VIRTUAL_PORT=3000 chat
