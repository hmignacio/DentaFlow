import { useState, useEffect, useCallback } from "react";
import PatientSideBar from "../components/DashboardSidebar";
import AdminFooter from "../components/AdminFooter";
import logo from "../assets/dentaflow_logo.png";

import "../css/Patient-dashboard.css";
import "../css/Dashboard-modal.css";

const emptyForm = {
  date: "",
  service: "",
  dentist: "",
};

function formatDate(date) {
  if (!date) return "—";

  // Handles MySQL dates returned as either YYYY-MM-DD or ISO strings.
  const datePart = String(date).slice(0, 10);
  const [year, month, day] = datePart.split("-");

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

export default function PatientDashboard() {
  const [username, setUsername] = useState("");

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [dentists, setDentists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);



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

        const [userResponse, appointmentsResponse, servicesResponse, dentistsResponse] =
          await Promise.all([
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

        const [userData, appointmentData, serviceData, dentistData] =
          await Promise.all([
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
        console.error("Dashboard loading error:", err);

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

  

  function openAddModal() {
    setForm({ ...emptyForm });
    setError("");
    setModalOpen(true);
  }

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  

  async function saveAppointment(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/appointments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_date: form.date,
          service_id: Number(form.service),
          dentist_id: Number(form.dentist),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to book appointment.");
      }

      await fetchAppointments();

      setModalOpen(false);
      setForm({ ...emptyForm });

      alert("Appointment request submitted successfully.");
    } catch (err) {
      console.error("Appointment booking error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }


  async function cancelAppointment(event) {
    event.preventDefault();

    if (cancelling || cancelId === null) return;

    try {
      setCancelling(true);
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
        throw new Error(data.message || "Unable to cancel appointment.");
      }

      await fetchAppointments();

      setCancelId(null);

      alert("Appointment cancelled successfully.");
    } catch (err) {
      console.error("Appointment cancellation error:", err);
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  }


  return (
    <>
      <div className="dashboard-layout">
        <PatientSideBar role="patient" />

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
              <p role="alert" style={{ color: "#c0392b", padding: "10px" }}>
                {error}
              </p>
            )}

            {/* Appointment Table */}

            <div className="appointment-pagination">
              <table>
                <thead>
                  <tr>
                    <th>Reference No.</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Dentist</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        Loading appointments...
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>

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
                          ) ? (
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
                          ) : (
                            <span>—</span>
                          )}
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



      {modalOpen && (
        <div className="appointment-modal">
          <div className="main-container-add-appointment">

            <h2>Book an Appointment</h2>

            <form onSubmit={saveAppointment}>
              <p>
                <i>Please confirm your appointment information.</i>
              </p>

              <label htmlFor="patient-appointment-date">
                Appointment Date:
              </label>

              <input
                type="date"
                id="patient-appointment-date"
                name="date"
                min={getTodayManila()}
                value={form.date}
                onChange={updateForm}
                required
              />

              <br />
              <br />

              <div className="form-row">
                <label htmlFor="patient-service">
                  Type of Service:
                </label>

                <select
                  id="patient-service"
                  name="service"
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
                <label htmlFor="patient-dentist">
                  Dentist:
                </label>

                <select
                  id="patient-dentist"
                  name="dentist"
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
                  value={saving ? "Booking..." : "Book Appointment"}
                  disabled={saving}
                />

                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setModalOpen(false)}
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
                The appointment will remain in your records with
                a Cancelled status.
              </p>

              <div className="form-buttons">
                <input
                  type="button"
                  value="Keep Appointment"
                  onClick={() => setCancelId(null)}
                  disabled={cancelling}
                />

                <input
                  type="submit"
                  value={cancelling ? "Cancelling..." : "Yes, Cancel"}
                  disabled={cancelling}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}