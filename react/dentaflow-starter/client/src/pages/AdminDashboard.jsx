
import { useState } from "react";
import AdminSidebar from "../components/DashboardSidebar";
import AdminFooter from "../components/AdminFooter";
import logo from "../assets/dentaflow_logo.png";

import "../css/Admin-dashboard.css";
import "../css/Dashboard-modal.css";

const initialAppointments = [
  {
    reference: "123456678",
    patient: "Juan Dela Cruz",
    date: "09/10/2026",
    time: "11:00 A.M.",
    service: "Tooth Extraction",
    dentist: "Dra. Hanna Ignacio",
    status: "Booked",
  },
];

const emptyForm = {
  date: "",
  firstName: "",
  lastName: "",
  email: "",
  birthdate: "",
  service: "",
  dentist: "",
};

const services = {
  extraction: "Tooth Extraction",
  root: "Root Canal",
  cleaning: "Cleaning",
  restoration: "Tooth Restoration",
};

const dentists = {
  hanna: "Dra. Hanna Ignacio",
  tovy: "Dr. Tovy Tongson",
  kurt: "Dr. Kurt Gozon",
  xyril: "Dra. Xyril Fabellon",
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [cancelReference, setCancelReference] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function bookAppointment(event) {
    event.preventDefault();

    const appointment = {
      reference: String(Date.now()),
      patient: `${form.firstName} ${form.lastName}`,
      date: form.date,
      time: "To be assigned",
      service: services[form.service],
      dentist: dentists[form.dentist],
      status: "Booked",
    };

    setAppointments((previous) => [...previous, appointment]);
    setForm(emptyForm);
    setShowAppointmentModal(false);
  }

  function cancelAppointment(event) {
    event.preventDefault();

    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.reference === cancelReference
          ? { ...appointment, status: "Cancelled" }
          : appointment
      )
    );

    setCancelReference(null);
  }

  return (
    <>
      <AdminSidebar />

      <div className="main-container">
        <div className="welcome-pane">
          <img src={logo} alt="DentaFlow Logo" />

          <h2>Hello Username!</h2>

          <button
            id="add-appointment"
            type="button"
            onClick={() => setShowAppointmentModal(true)}
          >
            + Add Appointment
          </button>
        </div>

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
                <th></th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.reference}>
                  <td>{appointment.reference}</td>
                  <td>{appointment.patient}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.service}</td>
                  <td>{appointment.dentist}</td>
                  <td>{appointment.status}</td>

                  <td>
                    {appointment.status === "Booked" && (
                      <input
                        id="open-booked-appointment"
                        type="button"
                        value="Cancel"
                        onClick={() =>
                          setCancelReference(appointment.reference)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminFooter />
      </div>

      {/* Add Appointment Modal */}

      {showAppointmentModal && (
        <div id="appointment-modal" className="appointment-modal">
          <div className="main-container-add-appointment">
            <h2>Book an Appointment</h2>

            <form onSubmit={bookAppointment}>
              <p>
                <i>
                  Please confirm that you would like to request the
                  following appointment:
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
                value={form.date}
                onChange={updateForm}
                required
              />

              <p className="information-title">
                Patient Information:
              </p>

              <div className="name-row">
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  placeholder="First Name *"
                  value={form.firstName}
                  onChange={updateForm}
                  required
                />

                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  placeholder="Last Name *"
                  value={form.lastName}
                  onChange={updateForm}
                  required
                />
              </div>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={updateForm}
                required
              />

              <input
                type="text"
                id="birthdate"
                name="birthdate"
                placeholder="Date of Birth * eg (mm-dd-yyyy)"
                value={form.birthdate}
                onChange={updateForm}
                required
              />

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
                  <option value="extraction">Tooth Extraction</option>
                  <option value="root">Root Canal</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="restoration">Tooth Restoration</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="dentist">Dentist:</label>

                <select
                  name="dentist"
                  id="dentist"
                  value={form.dentist}
                  onChange={updateForm}
                  required
                >
                  <option value="">Select...</option>
                  <option value="hanna">Dra. Hanna Ignacio</option>
                  <option value="tovy">Dr. Tovy Tongson</option>
                  <option value="kurt">Dr. Kurt Gozon</option>
                  <option value="xyril">Dra. Xyril Fabellon</option>
                </select>
              </div>

              <div className="form-buttons">
                <input
                  type="submit"
                  value="Book Appointment"
                />

                <input
                  id="close-appointment"
                  type="button"
                  value="Cancel"
                  onClick={() => setShowAppointmentModal(false)}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}

      {cancelReference !== null && (
        <div
          id="cancel-modal-appointment"
          className="appointment-modal"
        >
          <div className="main-container-add-appointment">
            <h2>Cancel Appointment?</h2>

            <form onSubmit={cancelAppointment}>
              <p>
                Are you sure you want to cancel your appointment?
                <br />
                <br />
                Once cancelled, your scheduled time slot will
                become available to other patients.
              </p>

              <br />
              <br />

              <div className="form-buttons">
                <input
                  id="keep-booked-appointment"
                  type="button"
                  value="Keep Appointment"
                  onClick={() => setCancelReference(null)}
                />

                <input
                  type="submit"
                  value="Yes, Cancel"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
