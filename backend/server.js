const path = require("path");
const express = require("express");
const pool = require("./db");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { requireAuth, requireRole } = require("./middleware/auth");
require("dotenv").config();

const cors = require("cors");
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
const PORT = process.env.PORT || 3000;
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    createDatabaseTable: false,
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data"
        }
    }
});

app.use(express.json());
app.use(session({
    name: "dentaflow.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.get("/api/auth/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "You are not logged in."
        });
    }

    return res.status(200).json({
        user: req.session.user
    });
});
app.get("/test-db", async (req, res) => {
try {
    const [rows] = await pool.query("SELECT DATABASE () AS database_name");

    res.json({
        message: "Connected to MySQL Dentaflow Database Successfully",
        database: rows[0].database_name,
    });
} catch (error) {
    console.error("Error connecting to the Dentaflow database:", error.message);
    res.status(500).json({
        message: "Failed connecting to the Dentaflow database."
    });
}

});

app.get("/api/patient/dashboard", requireAuth, requireRole("patient"), (req, res) => {
    res.json({
        message: "Welcome to the patient dashboard!",
        user: req.session.user
    });
});

app.get("/api/admin/dashboard", requireAuth, requireRole("admin"), (req, res) => {
    res.json({
        message: "Welcome to the admin dashboard!",
        user: req.session.user
    });
});

app.listen(PORT, () => {
    console.log(`Dentaflow backend running at http://localhost:${PORT}`);
});