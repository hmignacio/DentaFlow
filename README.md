# DentaFlow

**DentaFlow** is a dental appointment scheduling website designed to make booking and managing dental appointments easier for patients and clinic administrators.

## Features

### For Patients
- Create an account and log in.
- Request a dental appointment.
- Choose a preferred date, dental service, and dentist.
- View appointment details and status.
- Cancel an appointment when needed.

### For Administrators
- View appointments from all patients.
- Create and update appointments.
- Confirm appointments and assign appointment times.
- Mark appointments as completed or cancelled.

## Built With

- **React + Vite** – Website interface
- **Node.js + Express** – Application backend
- **MySQL** – Stores accounts and appointments

## How to Run the Project

1. Download or clone this repository.
2. Install **Node.js** and **MySQL** if you haven't already.
3. Create a MySQL database named `dentaflow` and set up the required tables and sample dental services/dentists. Ask the project team for the database setup script if it isn't included in the repository.
4. Configure the backend's database connection and session settings using the project's environment configuration. **Do not upload passwords or secret keys to GitHub.**
5. Open a terminal in the project folder and run:

   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   npm run dev
   ```

6. Open **http://localhost:5173** in your browser.

> The website requires the backend server and MySQL database to be running. The setup may vary depending on the team's latest project configuration.

## Project Folders

```text
dentaflow-starter/
├── client/    # React website
├── server/    # Backend and database connection
└── README.md
```

## How Appointments Work

1. A patient requests an appointment.
2. The request appears as **Pending**.
3. An administrator confirms it and assigns a time (**Booked**).
4. After the visit, the administrator marks it **Completed**.

Appointments can also be **Cancelled** when needed.

## Project Team

- Hanna Mae Ignacio
- Tovy Allistair Tongson
- Kurt Michael Gozon
- Xyril Anne Fabellon

## Note

DentaFlow is a student project developed for learning and demonstration purposes. Use sample information when testing the application.
