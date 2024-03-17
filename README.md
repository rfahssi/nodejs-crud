To create docker image : 

-   docker build -t [IMAGE_NAME] .

To run container : 

-   docker run --name [CONTAINER_NAME] -e DB_HOST=[MYSQL_CONTAINER_NAME] -e DB_USER=root -e DB_PASSWORD=toto -e DB_NAME=test --network [NETWORK_NAME] -p 3000:3000 -d [IMAGE_NAME]
