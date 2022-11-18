# Project Summary

This is an API that aims to serve data about news articles. Users can access news topics, articles, and article comments. They can also comment on articles, vote for or against articles that they enjoy, and delete comments.

# Connecting to the databases locally

Create .env.development and .env.test files and put PGDATABASE=<database_name> in each of them with the correct database name

# Hosted Version of this Database

The link to this database is hosted on ElephantSQL is:
<postgres://jvascwza:Z_VDAAsY0d_5tnh1A8UoSzVjqr0ErM-L@lucky.db.elephantsql.com/jvascwza>

# Set Up Instructions

## Cloning this Repository

Use the following command in the command line:

```
git clone https://github.com/amaiaita/NC-news-project.git
```

## Installing Dependencies

This will install the packages needed for this project to run correctly on your machine:

```
npm ci
```

## Environment Variables

You will need to create two .env files in the main directory in order to run this program and connect to the right database for each purpose - one for testing and one for the actual database.

The `.env.development` file should have the following content:

```
PGDATABASE=nc_news
```

THe `.env.testing` file should contain:

```
PGDATABASE = nc_news_test
```

## Seeding the local database

```
npm run setup-dbs
npm run seed
```

## Running Tests

This command uses jest to run the test files in this repository where \_\_\_ is the name of the specific test file you would like to run, excluding it will just run all test files:

```
npm run test ___
```

# Versions of packages required

This project was created using: node version 19.0.0, jest version ^27.5.1 and psql version 14.5. Please use these versions (or newer) to ensure full functionality.
