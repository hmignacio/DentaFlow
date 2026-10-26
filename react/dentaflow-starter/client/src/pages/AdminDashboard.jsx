import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../components/DashboardSidebar";
import AdminFooter from "../components/AdminFooter";
import logo from "../assets/dentaflow_logo.png";

import "../css/Admin-dashboard.css";
import "../css/Dashboard-modal.css";

const emptyForm = {
  date: "",
  email: "",
  service: "",
  dentist: "",
};

function formatDate(date) {
  if (!date) return "—";

  const [year, month, day] = String(date).slice(0, 10).split("-");

  return `${month}/${day}/${year}`;
}

function formatTime(time) {
  if (!time) return "To be assigned";

  const [hours, minutes] = String(time).split(":");
  const hour = Number(hours);

  if (Number.isNaN(hour)) return time;

  const period = hour >= 12 ? "P.M." : "A.M.";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${period}`;
}

function getTodayManila() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default function AdminDashboard() {
  const [username, setUsername] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [dentists, setDentists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [statusAppointment, setStatusAppointment] = useState(null);

  const [form, setForm] = useState({ ...emptyForm });
  const [appointmentTime, setAppointmentTime] = useState("");

  const [saving, setSaving] = useState(false);


  const fetchAppointments = useCallback(async () => {
    const response = await fetch("/api/appointments", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unable to retrieve appointments.");
    }

    const data = await response.json();

    setAppointments(data.appointments || []);
  }, []);



  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          userResponse,
          appointmentsResponse,
          servicesResponse,
          dentistsResponse,
        ] = await Promise.all([
          fetch("/api/auth/me", {
            credentials: "include",
          }),

          fetch("/api/appointments", {
            credentials: "include",
          }),

          fetch("/api/appointments/services", {
            credentials: "include",
          }),

          fetch("/api/appointments/dentists", {
            credentials: "include",
          }),
        ]);

        if (
          !userResponse.ok ||
          !appointmentsResponse.ok ||
          !servicesResponse.ok ||
          !dentistsResponse.ok
        ) {
          throw new Error("Unable to load dashboard information.");
        }

        const [
          userData,
          appointmentData,
          serviceData,
          dentistData,
        ] = await Promise.all([
          userResponse.json(),
          appointmentsResponse.json(),
          servicesResponse.json(),
          dentistsResponse.json(),
        ]);

        if (!active) return;

        setUsername(userData.user.full_name);
        setAppointments(appointmentData.appointments || []);
        setServices(serviceData.services || []);
        setDentists(dentistData.dentists || []);
      } catch (err) {
        console.error("Admin dashboard loading error:", err);

        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);



  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowAppointmentModal(true);
  }

  function openEditModal(appointment) {
    setEditingId(appointment.id);

    setForm({
      date: String(appointment.appointment_date).slice(0, 10),
      email: appointment.patient_email,
      service: String(appointment.service_id),
      dentist: String(appointment.dentist_id),
    });

    setError("");
    setShowAppointmentModal(true);
  }


  async function saveAppointment(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");

      const isEditing = editingId !== null;

      const endpoint = isEditing
        ? `/api/appointments/${editingId}`
        : "/api/appointments";

      const method = isEditing ? "PUT" : "POST";

      const payload = {
        appointment_date: form.date,
        service_id: Number(form.service),
        dentist_id: Number(form.dentist),
      };

      if (!isEditing) {
        payload.patient_email = form.email.trim();
      }

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save appointment."
        );
      }

      await fetchAppointments();

      setShowAppointmentModal(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      alert(
        isEditing
          ? "Appointment updated successfully."
          : "Appointment created successfully."
      );
    } catch (err) {
      console.error("Save appointment error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

 

  async function cancelAppointment(event) {
    event.preventDefault();

    if (saving || cancelId === null) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/appointments/${cancelId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel appointment."
        );
      }

      await fetchAppointments();

      setCancelId(null);

      alert("Appointment cancelled successfully.");
    } catch (err) {
      console.error("Cancel appointment error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }



  async function updateAppointmentStatus(event) {
    event.preventDefault();

    if (!statusAppointment || saving) return;

    try {
      setSaving(true);
      setError("");

      const isPending = statusAppointment.status === "Pending";

      const payload = isPending
        ? {
            status: "Booked",
            appointment_time: appointmentTime,
          }
        : {
            status: "Completed",
          };

      const response = await fetch(
        `/api/appointments/${statusAppointment.id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update appointment status."
        );
      }

      await fetchAppointments();

      setStatusAppointment(null);
      setAppointmentTime("");

      alert(data.message);
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }


  return (
    <>
      <div className="dashboard-layout">
        <AdminSidebar role="admin" />

        <div className="dashboard-content">
          <div className="main-container">

            {/* Welcome Section */}

            <div className="welcome-pane">
              <img src={logo} alt="DentaFlow Logo" />

              <h2>Hello {username || "there"}!</h2>

              <button
                id="add-appointment"
                type="button"
                onClick={openAddModal}
              >
                + Add Appointment
              </button>
            </div>

            {/* Error Message */}

            {error && (
              <p
                role="alert"
                style={{
                  color: "#c0392b",
                  padding: "10px",
                }}
              >
                {error}
              </p>
            )}

            {/* Appointment Table */}

            <div className="appointment-pagination">
              <table>
                <thead>
                  <tr>
                    <th>Reference No.</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Dentist</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        Loading appointments...
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>

                        <td>{appointment.patient_name}</td>

                        <td>
                          {formatDate(appointment.appointment_date)}
                        </td>

                        <td>
                          {formatTime(appointment.appointment_time)}
                        </td>

                        <td>{appointment.service_name}</td>

                        <td>{appointment.dentist_name}</td>

                        <td>{appointment.status}</td>

                        <td>
                          {["Pending", "Booked"].includes(
                            appointment.status
                          ) && (
                            <>
                              <button
                                type="button"
                                className="patient-action-link"
                                onClick={() => openEditModal(appointment)}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="patient-action-link"
                                onClick={() => {
                                  setError("");
                                  setCancelId(appointment.id);
                                }}
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                className="patient-action-link"
                                onClick={() => {
                                  setError("");
                                  setStatusAppointment(appointment);
                                  setAppointmentTime("");
                                }}
                              >
                                {appointment.status === "Pending"
                                  ? "Confirm"
                                  : "Complete"}
                              </button>
                            </>
                          )}

                          {["Cancelled", "Completed"].includes(
                            appointment.status
                          ) && <span>—</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AdminFooter />
        </div>
      </div>



      {showAppointmentModal && (
        <div className="appointment-modal">
          <div className="main-container-add-appointment">

            <h2>
              {editingId !== null
                ? "Edit Appointment"
                : "Book an Appointment"}
            </h2>

            <form onSubmit={saveAppointment}>
              <p>
                <i>
                  {editingId !== null
                    ? "Update the appointment information."
                    : "Enter the registered patient's information."}
                </i>
              </p>

              <label htmlFor="appointment-date">
                Appointment Date:
              </label>

              <br />

              <input
                type="date"
                id="appointment-date"
                name="date"
                min={getTodayManila()}
                value={form.date}
                onChange={updateForm}
                required
              />

              {editingId === null && (
                <>
                  <p className="information-title">
                    Patient Information:
                  </p>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Registered Patient Email *"
                    value={form.email}
                    onChange={updateForm}
                    required
                  />
                </>
              )}

              <div className="form-row">
                <label htmlFor="service">
                  Type of Service:
                </label>

                <select
                  name="service"
                  id="service"
                  value={form.service}
                  onChange={updateForm}
                  required
                >
                  <option value="">Select...</option>

                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.service_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="dentist">
                  Dentist:
                </label>

                <select
                  name="dentist"
                  id="dentist"
                  value={form.dentist}
                  onChange={updateForm}
                  required
                >
                  <option value="">Select...</option>

                  {dentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-buttons">
                <input
                  type="submit"
                  value={
                    saving
                      ? "Saving..."
                      : editingId !== null
                      ? "Save Changes"
                      : "Book Appointment"
                  }
                  disabled={saving}
                />

                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setShowAppointmentModal(false)}
                  disabled={saving}
                />
              </div>
            </form>
          </div>
        </div>
      )}



      {cancelId !== null && (
        <div className="appointment-modal">
          <div className="main-container-add-appointment">

            <h2>Cancel Appointment?</h2>

            <form onSubmit={cancelAppointment}>
              <p>
                Are you sure you want to cancel this appointment?
                The appointment will remain in the database with
                a Cancelled status.
              </p>

              <div className="form-buttons">
                <input
                  type="button"
                  value="Keep Appointment"
                  onClick={() => setCancelId(null)}
                  disabled={saving}
                />

                <input
                  type="submit"
                  value={saving ? "Cancelling..." : "Yes, Cancel"}
                  disabled={saving}
                />
              </div>
            </form>
          </div>
        </div>
      )}



      {statusAppointment !== null && (
        <div className="appointment-modal">
          <div className="main-container-add-appointment">

            <h2>
              {statusAppointment.status === "Pending"
                ? "Confirm Appointment"
                : "Complete Appointment"}
            </h2>

            <form onSubmit={updateAppointmentStatus}>
              <p>
                Patient: <strong>{statusAppointment.patient_name}</strong>
              </p>

              <p>
                Date:{" "}
                <strong>
                  {formatDate(statusAppointment.appointment_date)}
                </strong>
              </p>

              {statusAppointment.status === "Pending" ? (
                <>
                  <label htmlFor="appointment-time">
                    Assign Appointment Time:
                  </label>

                  <input
                    type="time"
                    id="appointment-time"
                    value={appointmentTime}
                    onChange={(event) =>
                      setAppointmentTime(event.target.value)
                    }
                    required
                  />
                </>
              ) : (
                <p>
                  Are you sure you want to mark this appointment
                  as completed?
                </p>
              )}

              <div className="form-buttons">
                <input
                  type="submit"
                  value={
                    saving
                      ? "Processing..."
                      : statusAppointment.status === "Pending"
                      ? "Confirm Appointment"
                      : "Mark as Completed"
                  }
                  disabled={saving}
                />

                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setStatusAppointment(null)}
                  disabled={saving}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}