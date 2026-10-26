const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/db");
const router = express.Router();

router.post("/register-patient", async (req, res) => {
    try {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password) {
        return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    if (typeof full_name !== "string" ||
        full_name.trim().length < 2 ||
        full_name.trim().length > 100) {
        return res.status(400).json({ message: "Full name should be between 2 and 100 characters" });
    }

        if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return res.status(400).json({
            message: "Please enter a valid email address"
        });
    }


    if (typeof password !== "string" ||
        password.length < 8 ||
        password.length > 50) {
        return res.status(400).json({ message: "Password should be between 8 and 50 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [normalizedEmail]
    );
    if (existingUsers.length > 0) {
        return res.status(409).json({ message: "An account using this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

await pool.execute(
    "INSERT INTO users (full_name, email, password_hash, user_role) VALUES (?, ?, ?, 'patient')",
    [full_name.trim(), normalizedEmail, passwordHash]
);

return res.status(201).json({ message: "Patient account registered successfully." });

    } catch (error) {
        console.error("Error on registration:", error.message);
        
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "An account using this email already exists" });
        }
        return res.status(500).json({ message: "Unable to create your account in this moment." });
    }

});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }
        const normalizedEmail = email.trim().toLowerCase();

        const [users] = await pool.execute(
            `SELECT id, full_name, email, password_hash,
                    user_role, is_active
             FROM users
             WHERE email = ?`,
            [normalizedEmail]
        );

        if (users.length === 0 || !users[0].is_active) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = users[0];
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }
        req.session.regenerate((error) => {
    if (error) {
        console.error("Session regeneration error:", error.message);

        return res.status(500).json({
            message: "Unable to complete login right now."
        });
    }

    req.session.user = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.user_role
    };

    req.session.save((error) => {
        if (error) {
            console.error("Session save error:", error.message);

            return res.status(500).json({
                message: "Unable to complete login right now."
            });
        }

        return res.status(200).json({
            message: "Login successful.",
            user: req.session.user
            });
        });
    });


    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Unable to log in right now."
        });
    }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Unable to log out.",
      });
    }

    res.clearCookie("dentaflow.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully.",
    });
  });
});



module.exports = router;