


run:
	docker run -it -p 80:80 --rm -v `pwd`:/var/www/html php:5.6-apache

run2:
	docker build -t my-php-app .
	docker run -it --rm -p 9999:80 my-php-app