# Getting Started

## Setup Environment Variables

Create a `.env` file in the root directory and configure the necessary environment variables. Example:

Required Environment Variables:

Ensure the following environment variables are set before proceeding:

```ini
# DATABASE VAHU
DB_USERNAME="<DB_USERNAME>"
DB_PASSWORD="<DB_PASSWORD>"
DB_NAME="<DB_NAME>"
DB_HOST="<DB_HOST>"
```

Additional database environment variables can be added as needed based on the application requirements.

```ini
# LOGIN DATABASE
DB_LOGIN_USERNAME='<DB_LOGIN_USERNAME>'
DB_LOGIN_PASSWORD='<DB_LOGIN_PASSWORD>'
DB_LOGIN_NAME='<DB_LOGIN_NAME>'
DB_LOGIN_HOST='<DB_LOGIN_HOST>'
DB_LOGIN_PORT='<DB_LOGIN_PORT>'

# LOGIN SUPPORT LAYOUT
LOGIN_VAHU_TOKEN="secret-key"
LOGIN_API_URL="http://localhost:2001"
```

## Database Setup

Run the following commands to set up the database:

```bash
cd src && \
npx sequelize-cli db:drop && \
npx sequelize-cli db:create && \
npx sequelize-cli db:migrate && \
npx sequelize-cli db:seed:all
```

This will:

1. Drop the existing database (if any)
2. Create a new database
3. Apply all migrations
4. Seed the database with initial data

## Start the Application

Once the database is set up, start the application using:

```bash
npm start
```

Your application should now be running successfully.
