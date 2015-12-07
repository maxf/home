install:
	sudo npm install -g supervisor
	npm install

run: 
	@if test -z "$$SOCKETS_API_URL"; then echo "The SOCKETS_API_URL varable should be set. Exiting"; else echo "SOCKETS_API_URL is set to $(SOCKETS_API_URL)"; supervisor -e 'js,jade' bin/www; fi

