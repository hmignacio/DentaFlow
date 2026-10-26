const express = require("express");
const router = express.Router();

const pool = require("../database/db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// Retrieve appointments
router.get("/", async (req, res) => {
  try {
    const { id, role } = req.session.user;

    let query = `
      SELECT
        a.id,
        a.patient_id,
        a.patient_name,
        a.patient_email,
        a.appointment_date,
        a.appointment_time,
        a.service_id,
        a.dentist_id,
        a.status,
        s.service_name,
        d.full_name AS dentist_name
      FROM appointments a
      JOIN dental_services s ON a.service_id = s.id
      JOIN dentists d ON a.dentist_id = d.id
    `;

    const params = [];

    if (role === "patient") {
      query += " WHERE a.patient_id = ?";
      params.push(id);
    } else if (role !== "admin") {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    query += " ORDER BY a.appointment_date DESC, a.id DESC";

    const [appointments] = await pool.query(query, params);

    return res.json({ appointments });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return res.status(500).json({
      message: "Unable to retrieve appointments.",
    });
  }
});

// Retrieve available services
router.get("/services", async (req, res) => {
  try {
    const [services] = await pool.query(
      "SELECT id, service_name FROM dental_services WHERE is_active = 1"
    );

    return res.json({ services });
  } catch (error) {
    console.error("Fetch services error:", error);
    return res.status(500).json({
      message: "Unable to retrieve services.",
    });
  }
});

// Retrieve available dentists
router.get("/dentists", async (req, res) => {
  try {
    const [dentists] = await pool.query(
      "SELECT id, full_name FROM dentists WHERE is_active = 1"
    );

    return res.json({ dentists });
  } catch (error) {
    console.error("Fetch dentists error:", error);
    return res.status(500).json({
      message: "Unable to retrieve dentists.",
    });
  }
});


// Create an appointment
router.post("/", async (req, res) => {
  try {
    const user = req.session.user;

    if (!["patient", "admin"].includes(user.role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const {
      service_id,
      dentist_id,
      appointment_date,
      patient_email,
    } = req.body;

    // Validate required fields
    if (!service_id || !dentist_id || !appointment_date) {
      return res.status(400).json({
        message: "Service, dentist, and appointment date are required.",
      });
    }

    // Validate date format and ensure it is not in the past
    if (
      typeof appointment_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)
    ) {
      return res.status(400).json({
        message: "Invalid appointment date format.",
      });
    }

    const [year, month, day] = appointment_date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCDate() !== day
    ) {
      return res.status(400).json({
        message: "Invalid appointment date.",
      });
    }

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (appointment_date < today) {
      return res.status(400).json({
        message: "Appointment date cannot be in the past.",
      });
    }

    // Validate service and dentist IDs
    if (
      !Number.isSafeInteger(Number(service_id)) ||
      Number(service_id) <= 0 ||
      !Number.isSafeInteger(Number(dentist_id)) ||
      Number(dentist_id) <= 0
    ) {
      return res.status(400).json({
        message: "Invalid service or dentist.",
      });
    }

    const [services] = await pool.query(
      "SELECT id FROM dental_services WHERE id = ? AND is_active = 1",
      [service_id]
    );

    const [dentists] = await pool.query(
      "SELECT id FROM dentists WHERE id = ? AND is_active = 1",
      [dentist_id]
    );

    if (!services.length || !dentists.length) {
      return res.status(400).json({
        message: "Selected service or dentist is unavailable.",
      });
    }

    let patientId;
    let patientName;
    let patientEmail;

    if (user.role === "patient") {
      // Patients can only create appointments for themselves.
      patientId = user.id;
      patientName = user.full_name;
      patientEmail = user.email;
    } else {
      // Administrators book for an existing patient account.
      if (
        typeof patient_email !== "string" ||
        !patient_email.trim()
      ) {
        return res.status(400).json({
          message: "Patient email is required.",
        });
      }

      const [patients] = await pool.query(
        `SELECT id, full_name, email
         FROM users
         WHERE email = ?
           AND user_role = 'patient'
           AND is_active = 1`,
        [patient_email.trim()]
      );

      if (!patients.length) {
        return res.status(404).json({
          message: "No active patient account found with that email.",
        });
      }

      patientId = patients[0].id;
      patientName = patients[0].full_name;
      patientEmail = patients[0].email;
    }

    // Time is not assigned yet, so the appointment starts as Pending.
    const [result] = await pool.query(
      `INSERT INTO appointments
       (
         patient_id,
         patient_name,
         patient_email,
         service_id,
         dentist_id,
         appointment_date,
         appointment_time,
         status,
         created_by
       )
       VALUES (?, ?, ?, ?, ?, ?, NULL, 'Pending', ?)`,
      [
        patientId,
        patientName,
        patientEmail,
        service_id,
        dentist_id,
        appointment_date,
        user.id,
      ]
    );

    return res.status(201).json({
      message: "Appointment request submitted successfully.",
      appointment: {
        id: result.insertId,
        patient_id: patientId,
        patient_name: patientName,
        patient_email: patientEmail,
        service_id: Number(service_id),
        dentist_id: Number(dentist_id),
        appointment_date,
        appointment_time: null,
        status: "Pending",
      },
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      message: "Unable to create appointment.",
    });
  }
});


// Cancel an appointment
router.patch("/:id/cancel", async (req, res) => {
  try {
    const user = req.session.user;
    const appointmentId = Number(req.params.id);

    if (!Number.isSafeInteger(appointmentId) || appointmentId <= 0) {
      return res.status(400).json({
        message: "Invalid appointment ID.",
      });
    }

    if (!["patient", "admin"].includes(user.role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    // Check appointment existence and ownership
    const [appointments] = await pool.query(
      `SELECT id, patient_id, status
       FROM appointments
       WHERE id = ?`,
      [appointmentId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    const appointment = appointments[0];

    // Patients can only cancel their own appointments
    if (
      user.role === "patient" &&
      Number(appointment.patient_id) !== Number(user.id)
    ) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    // Prevent cancellation of completed/cancelled appointments
    if (["Completed", "Cancelled"].includes(appointment.status)) {
      return res.status(409).json({
        message: "This appointment can no longer be cancelled.",
      });
    }

    // Conditional update protects against concurrent status changes
    const [result] = await pool.query(
      `UPDATE appointments
       SET status = 'Cancelled'
       WHERE id = ?
         AND status IN ('Pending', 'Booked')`,
      [appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({
        message: "Appointment status has changed. Please refresh.",
      });
    }

    return res.json({
      message: "Appointment cancelled successfully.",
      appointment: {
        id: appointmentId,
        status: "Cancelled",
      },
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      message: "Unable to cancel appointment.",
    });
  }
});

// Update / reschedule an appointment
router.put("/:id", async (req, res) => {
  try {
    const user = req.session.user;
    const appointmentId = Number(req.params.id);

    // Validate appointment ID
    if (!Number.isSafeInteger(appointmentId) || appointmentId <= 0) {
      return res.status(400).json({
        message: "Invalid appointment ID.",
      });
    }

    if (!["patient", "admin"].includes(user.role)) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const { service_id, dentist_id, appointment_date } = req.body;

    // Validate required fields
    if (!service_id || !dentist_id || !appointment_date) {
      return res.status(400).json({
        message: "Service, dentist, and appointment date are required.",
      });
    }

    // Validate service and dentist IDs
    const serviceId = Number(service_id);
    const dentistId = Number(dentist_id);

    if (
      !Number.isSafeInteger(serviceId) ||
      serviceId <= 0 ||
      !Number.isSafeInteger(dentistId) ||
      dentistId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid service or dentist.",
      });
    }

    // Validate appointment date
    if (
      typeof appointment_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date)
    ) {
      return res.status(400).json({
        message: "Invalid appointment date format.",
      });
    }

    const [year, month, day] = appointment_date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCDate() !== day
    ) {
      return res.status(400).json({
        message: "Invalid appointment date.",
      });
    }

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (appointment_date < today) {
      return res.status(400).json({
        message: "Appointment date cannot be in the past.",
      });
    }

    // Verify selected service exists and is active
    const [services] = await pool.query(
      `SELECT id
       FROM dental_services
       WHERE id = ? AND is_active = 1`,
      [serviceId]
    );

    if (services.length === 0) {
      return res.status(400).json({
        message: "Selected dental service is unavailable.",
      });
    }

    // Verify selected dentist exists and is active
    const [dentists] = await pool.query(
      `SELECT id
       FROM dentists
       WHERE id = ? AND is_active = 1`,
      [dentistId]
    );

    if (dentists.length === 0) {
      return res.status(400).json({
        message: "Selected dentist is unavailable.",
      });
    }

    // Retrieve appointment and check ownership
    const [appointments] = await pool.query(
      `SELECT id, patient_id, status
       FROM appointments
       WHERE id = ?`,
      [appointmentId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    const appointment = appointments[0];

    // Patients can only edit their own appointments
    if (
      user.role === "patient" &&
      Number(appointment.patient_id) !== Number(user.id)
    ) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    // Completed and cancelled appointments cannot be edited
    if (["Completed", "Cancelled"].includes(appointment.status)) {
      return res.status(409).json({
        message: "This appointment can no longer be edited.",
      });
    }

    // Update appointment
    // Clear the previous time and reset status to Pending
    const [result] = await pool.query(
      `UPDATE appointments
       SET
         service_id = ?,
         dentist_id = ?,
         appointment_date = ?,
         appointment_time = NULL,
         status = 'Pending'
       WHERE id = ?
         AND status IN ('Pending', 'Booked')
         AND (? = 'admin' OR patient_id = ?)`,
      [
        serviceId,
        dentistId,
        appointment_date,
        appointmentId,
        user.role,
        user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({
        message: "Appointment could not be updated. Please refresh.",
      });
    }

    return res.json({
      message: "Appointment updated successfully.",
      appointment: {
        id: appointmentId,
        service_id: serviceId,
        dentist_id: dentistId,
        appointment_date,
        appointment_time: null,
        status: "Pending",
      },
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    return res.status(500).json({
      message: "Unable to update appointment.",
    });
  }
});

// Admin: confirm or complete an appointment
router.patch("/:id/status", async (req, res) => {
  try {
    const user = req.session.user;

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only administrators can update appointment status.",
      });
    }

    const appointmentId = Number(req.params.id);
    const { status, appointment_time } = req.body;

    if (!Number.isSafeInteger(appointmentId) || appointmentId <= 0) {
      return res.status(400).json({
        message: "Invalid appointment ID.",
      });
    }

    if (!["Booked", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid appointment status.",
      });
    }

    const [appointments] = await pool.query(
      `SELECT id, status, appointment_time
       FROM appointments
       WHERE id = ?`,
      [appointmentId]
    );

    if (!appointments.length) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    const appointment = appointments[0];

    if (["Cancelled", "Completed"].includes(appointment.status)) {
      return res.status(409).json({
        message: "This appointment can no longer be modified.",
      });
    }

    if (status === "Booked") {
      if (appointment.status !== "Pending") {
        return res.status(409).json({
          message: "Only pending appointments can be confirmed.",
        });
      }

      if (
        typeof appointment_time !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(appointment_time)
      ) {
        return res.status(400).json({
          message: "Appointment time must use HH:MM format.",
        });
      }

      try {
        const [result] = await pool.query(
          `UPDATE appointments
           SET appointment_time = ?, status = 'Booked'
           WHERE id = ? AND status = 'Pending'`,
          [`${appointment_time}:00`, appointmentId]
        );

        if (!result.affectedRows) {
          return res.status(409).json({
            message: "Appointment status changed. Please refresh.",
          });
        }
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            message: "This dentist is already booked at that time.",
          });
        }

        throw error;
      }
    }

    if (status === "Completed") {
      if (appointment.status !== "Booked") {
        return res.status(409).json({
          message: "Only booked appointments can be completed.",
        });
      }

      const [result] = await pool.query(
        `UPDATE appointments
         SET status = 'Completed'
         WHERE id = ? AND status = 'Booked'`,
        [appointmentId]
      );

      if (!result.affectedRows) {
        return res.status(409).json({
          message: "Appointment status changed. Please refresh.",
        });
      }
    }

    return res.json({
      message: `Appointment marked as ${status}.`,
      appointment: {
        id: appointmentId,
        status,
        ...(status === "Booked" && {
          appointment_time: `${appointment_time}:00`,
        }),
      },
    });
  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      message: "Unable to update appointment status.",
    });
  }
});

module.exports = router;