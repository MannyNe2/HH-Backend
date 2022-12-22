# Crowdfunding Platform Backend
Back-end for a crowdfunding platform built in partial fulfillment of the requirements for a Bachelor's degree from HiLCoE School of Computer Science and Technology

## Requirements
| Name | Version | Link |
|------|---------|------|
| Docker | 18.02.0 or higher for Docker Compose support | [Official Link](https://docs.docker.com/get-docker/) |
| Docker Compose | 1.27.0 or higher for file format 3.6 support | [Official Link](https://docs.docker.com/compose/install/) |
| Node.js | 8.0.0+ for yarn installation support | [Direct Install](https://nodejs.org/en/) <br /> [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) (Recommended method) |
| Yarn | 1.22.17 or higher as tested but could work with lower versions | [Official Link](https://classic.yarnpkg.com/lang/en/docs/install) |

## Setup and Configuration

### 1. Creating the environment files
After installing the programs/packages listed above, an environment files (`.env`) need to be created for the containers: one in the root folder for the api containers, and another in the `/db` directory for the database. Templates are provided for the required variables. The final project directory should look something like this:

    .
    |-- db
    |   |-- .env
    |   |-- docker-compose.yaml
    |   |__ template.env
    |
    |-- express
    |   |__ ...
    |
    |-- hasura
    |   |__ ...
    |
    |-- .env
    |-- docker-compose.yaml
    |-- package.json
    |-- server.js
    |-- template.env
    |__ ...

### 2. Setting the environment variables

The following environment variables need to be set before the containers can be built

#### 2.1. Database

Database Build File:

- PostgreSQL 12 : `./db/docker-compose.yaml`

Database Environment Files:

- Working : `./db/.env`
- Template : `./db/template.env`

Database Environment Variables:

- `POSTGRES_HOST_PORT` : Port on the host/local machine to map to the port used by postgres instance inside the container (5432 by default).
- `POSTGRES_USER` : Name to use for the default database user.
- `POSTGRES_PASSWORD` : Password to use for POSTGRES_USER.
- `POSTGRES_DB` : Name to use for the database.

#### 2.2. API (Hasura GraphQL Engine and Express)

API Build Files:

- Express : `./express.dockerfile`
- Node.js and Hasura : `./docker-compose.yaml`

API Environment Files:

- Working : `./.env`
- Template : `./template.env`

API Environment Variables:

- `HASURA_GRAPHQL_SERVER_PORT` : Port to use for the Hasura GraphQL API
- `EXPRESS_PORT` : Port to use for the Express service
- `HASURA_GRAPHQL_ADMIN_SECRET` : Secret key for superadmin access to console
- `HASURA_GRAPHQL_JWT_SECRET` : Secret keys used for signing and validating JWTs (JSON Web Token) - [JWTs Reference](https://jwt.io/)
  - **HMAC-SHA based** : HMAC key to use for signing JWTs - [Format Referece](https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt.html#hmac-sha-based)
  - **RSA based** : RSA public key in PEM format - [Format Reference](https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt.html#rsa-based)
- `JWT_SECRET` :
  - **HMAC-SHA based** : The `"key"` section from HASURA_GRAPHQL_JWT_SECRET
  - **RSA based** : The RSA private key generated alongside HASURA_GRAPHQL_SECRET
- `ACTION_SECRET` : Pre-shared key used to ensure that requests are coming from a trusted source
- `POSTGRES_HOST_PORT` : Port to use for the postgres instance. Must be the same as the port set in the [Database](#markdown-header-21-database) section
- `POSTGRES_USER` : Name to use for the default database user. Must be the same as the username set in the [Database](#markdown-header-21-database) section above.
- `POSTGRES_PASSWORD` : Password to use for POSTGRES_USER. Must be the same as the password set in the [Database](#markdown-header-21-database) section above.
- `POSTGRES_DB` : Name to use for the database. Must be the same as the database name set in the [Database](#markdown-header-21-database) section above.

### 3. Setting up the development environment

The following commands must be run in the root project folder. Look through `package.json` to see details.

#### 3.1. Building the containers and starting the services:

```sh
yarn dev
```

#### 3.2. Migrating the database metadata

```sh
yarn migrate
```

#### 3.3. Starting the Hasura console

```sh
yarn console
```

#### 3.4. Inserting seed data into the database

```sh
yarn seed
```