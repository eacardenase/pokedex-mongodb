<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Setup Steps

1. Clone the repo
2. Execute the following command on the terminal

```
yarn install
```

3. Have Nest CLI already installed globally

```
npm i -g @nestjs/cli
```

4. Setup database

```
docker-compose up -d
```

5. Clone **env.template** file and rename it to **.env**

6. Fill env variables on **.env**

7. Run the app on dev mode

```
yarn start:dev
```

8. Setup database with seed

```
http://localhost:3000/api/v2/seed
```

## Stack

- MongoDB
- NestJS

# Notes

Force deploy on Heroku without changes

```
git commit --allow-empty -m "trigger heroku deploy"
git push heroku main
```
