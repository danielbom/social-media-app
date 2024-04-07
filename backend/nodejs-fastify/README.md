
```bash
# Create mysql container
docker run --rm -d --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=nodejs_fastify -p 3306:3306 -v "$(pwd)/docker/mysql:/var/lib/mysql" mysql:5.7

```