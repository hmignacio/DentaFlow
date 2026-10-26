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

## Project Documentation

The following materials provide additional information about the
planning, design, development, and testing of DentaFlow:

1.  [Workflow](https://docs.google.com/presentation/d/1ZlHsKPARCGkxJlhQx141fvPQnNqO7aD0dQbcfDJcdI8/edit?usp=drive_link)
2.  [Brainstorming Sheet](https://docs.google.com/document/d/1ZLrymb7TGrvBik5CAFXrqiYawFpd9gYOxjbUchPfPE8/edit?usp=drive_link)
3.  Wireframes:
    -   [Wireframes (PNG)](https://drive.google.com/drive/folders/1vuqtpoB2Eqb1jXO3bV_yszAMA76CVTvb?usp=drive_link)
    -   [Wireframes (Figma)](https://www.figma.com/design/A5nhCPPvbm3r1aFCAeVGxF/Websystem?node-id=13-63&t=Br1GQmAshlkURXlx-1)
4.  [Manual Testing](https://docs.google.com/spreadsheets/d/19qkw-eBdFP2SmRkauLIIMWNErW4TqHH3YpwGmtI0ZwU/edit?usp=sharing)
5.  [AI Use Statement](https://docs.google.com/document/d/1KvUr-C5jZYMKvW5vPVOcPH-bXyM8Pd-IVHGPEZASRtE/edit?usp=sharing)
6.  [Application Development Workflow Worksheet](https://docs.google.com/spreadsheets/d/1OBJYoLtzAZjPOsfg9GOeEIU5mEEhV1UXyGEBaGGGSYQ/edit?usp=sharing)


## Note

DentaFlow is a student project developed for learning and demonstration purposes. Use sample information when testing the application.
