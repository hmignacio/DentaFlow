
# DentaFlow – Admin Account and Environment Setup

This guide explains how to set up the DentaFlow database, configure the backend environment, and create an administrator account.

## 1. Requirements

Before starting, make sure you have installed:

- Node.js
- MySQL Server
- MySQL Workbench
- Visual Studio Code

You should also have the DentaFlow project downloaded or cloned from GitHub.

## 2. Database Setup

1. Open **MySQL Workbench**.
2. Connect to your local MySQL server.
3. Find the db_schema.sql in server/database directory
4. copy and execute the sql queries on MySQL Workbench

## 3. Environment Configuration (.env)

1. Open the `server` folder.
2. Create a file named `.env` if it does not already exist.
3. Add the following configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dentaflow

SESSION_SECRET=your_generated_secret
PORT=3000
```

Replace the placeholder values with your actual local configuration.

**Note:** Make sure the environment variable names match those used in `server/database/db.js` and `server/index.js`.

## 4. Generate a Session Secret

DentaFlow uses session authentication to keep users logged in.

Open your terminal and run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value and add it to your `.env` file:

```env
SESSION_SECRET=paste_your_generated_secret_here
```

In `server/index.js`, make sure environment variables are loaded before the session middleware:

```javascript
require("dotenv").config();
```

The session configuration should include:

```javascript
secret: process.env.SESSION_SECRET,
```

Keep the existing session store and cookie settings unchanged.

This prevents the error:

```text
Error: secret option required for sessions
```

## 5. Create an Administrator Account

DentaFlow's public registration page creates patient accounts by default. Administrator access is assigned manually through MySQL.

### Step 1: Register an Account

1. Open the DentaFlow application.
2. Go to the registration page.
3. Register using the intended administrator's name, email address, and password.

The account will initially be registered as a patient.

### Step 2: Open MySQL Workbench

Select the DentaFlow database:

```sql
USE dentaflow;
```

### Step 3: Find the Registered Account

Run:

```sql
SELECT id, full_name, email, user_role
FROM users;
```

Find the account you want to assign as an administrator.

### Step 4: Change the Account Role

Run:

```sql
UPDATE users
SET user_role = 'admin'
WHERE email = 'admin@example.com';
```

Replace `admin@example.com` with the actual registered email address.

Only authorized project administrators should perform this step.

### Step 5: Verify the Administrator Account

Run:

```sql
SELECT id, full_name, email, user_role
FROM users
WHERE email = 'admin@example.com';
```

The `user_role` should now display `admin`.

## 6. Run the Application

Open the DentaFlow project folder in Visual Studio Code.

Install the dependencies if needed:

```bash
npm install
cd client
npm install
cd ../server
npm install
cd ..
```

Start the application from the project root:

```bash
npm run dev
```

Open the application using:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

## 7. Test the Administrator Login

1. Open the DentaFlow login page.
2. Enter the administrator account's email and password.
3. Click **Log In**.

The system should recognize the administrator role and redirect the user to:

```text
http://localhost:5173/admin
```

If the account was already logged in before changing its role, log out and log in again.

## 8. GitHub Security Reminders

Never upload your actual `.env` file to GitHub.

Make sure your `.gitignore` contains:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

You can create a `.env.example` file containing placeholder values for other developers:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dentaflow

SESSION_SECRET=generate_your_own_secret
PORT=3000
```

Each group member should create their own `.env` file using their local MySQL credentials and a securely generated session secret.

If actual credentials were previously uploaded to GitHub, replace them with new credentials.

## 9. Common Issues

| Issue | Solution |
|---|---|
| Session secret error | Check `SESSION_SECRET` in the `.env` file. |
| Database connection failed | Verify the MySQL server and database credentials. |
| Registration returns invalid JSON | Check that the backend is running and the API route is accessible. |
| Admin redirected to Patient Dashboard | Verify the account's `user_role` and log in again. |
| MySQL access denied | Check the username and password in `.env`. |
| Backend connection failed | Make sure both frontend and backend servers are running. |

## 10. Important Reminders

- Public registration is intended for patient accounts only.
- Administrator accounts are assigned through MySQL by authorized project members.
- Passwords should be stored securely as hashes.
- Never share database passwords or session secrets.
- Do not upload `.env` files to GitHub.
- Verify the database connection before testing login and registration.

---

**Project:** DentaFlow – Dental Appointment Scheduling System

**Purpose:** Guide project members in setting up the database, backend environment, and administrator accounts.
