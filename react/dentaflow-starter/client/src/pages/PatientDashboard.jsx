
import { useState } from "react";
import PatientSideBar from "../components/DashboardSidebar";
import AdminFooter from "../components/AdminFooter";
import logo from "../assets/dentaflow_logo.png";

import "../css/Patient-dashboard.css";
import "../css/Dashboard-modal.css";

const initialAppointments = [
  {
    reference: "123456678",
    date: "2026-09-10",
    time: "11:00 A.M.",
    service: "extraction",
    dentist: "hanna",
    status: "Booked",
  },
  {
    reference: "123456679",
    date: "2026-09-12",
    time: "11:00 A.M.",
    service: "root",
    dentist: "tovy",
    status: "Booked",
  },
];

const services = {
  extraction: "Tooth Extraction",
  root: "Root Canal",
  cleaning: "Cleaning",
  restoration: "Tooth Restoration",
};

const dentists = {
  hanna: "Dra. Hanna Ignacio",
  tovy: "Dr. Tovy Allistair",
  kurt: "Dr. Kurt Gozon",
  xyril: "Dra. Xyril Fabellon",
};

const emptyForm = {
  date: "",
  service: "",
  dentist: "",
};

function formatDate(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState(null);
  const [deleteReference, setDeleteReference] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function openAddModal() {
    setEditingReference(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(appointment) {
    setEditingReference(appointment.reference);
    setForm({
      date: appointment.date,
      service: appointment.service,
      dentist: appointment.dentist,
    });
    setModalOpen(true);
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function saveAppointment(event) {
    event.preventDefault();

    if (editingReference !== null) {
      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.reference === editingReference
            ? {
                ...appointment,
                ...form,
              }
            : appointment
        )
      );
    } else {
      const newAppointment = {
        reference: String(Date.now()),
        ...form,
        time: "To be assigned",
        status: "Booked",
      };

      setAppointments((previous) => [...previous, newAppointment]);
    }

    setModalOpen(false);
    setEditingReference(null);
    setForm(emptyForm);
  }

  function deleteAppointment() {
    setAppointments((previous) =>
      previous.filter(
        (appointment) => appointment.reference !== deleteReference
      )
    );

    setDeleteReference(null);
  }

  return (
    <>
      <PatientSideBar />

      <div className="main-container">
        <div className="welcome-pane">
          <img src={logo} alt="DentaFlow Logo" />

          <h2>Hello Username!</h2>

          <button
            id="add-appointment"
            type="button"
            onClick={openAddModal}
          >
            + Add Appointment
          </button>
        </div>

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
              {appointments.map((appointment) => (
                <tr key={appointment.reference}>
                  <td>{appointment.reference}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.time}</td>
                  <td>{services[appointment.service]}</td>
                  <td>{dentists[appointment.dentist]}</td>
                  <td>{appointment.status}</td>

                  <td>
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
                      onClick={() =>
                        setDeleteReference(appointment.reference)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminFooter />
      </div>

      {/* Add / Edit Appointment Modal */}

      {modalOpen && (
        <div className="appointment-modal">
          <div className="main-container-add-appointment">
            <h2>Book an Appointment</h2>

            <form onSubmit={saveAppointment}>
              <p>
                <i>
                  Please confirm your appointment information.
                </i>
              </p>

              <label htmlFor="patient-appointment-date">
                Appointment Date:
              </label>

              <input
                type="date"
                id="patient-appointment-date"
                name="date"
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
                  <option value="extraction">Tooth Extraction</option>
                  <option value="root">Root Canal</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="restoration">Tooth Restoration</option>
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
                  <option value="hanna">Dra. Hanna Ignacio</option>
                  <option value="tovy">Dr. Tovy Allistair</option>
                  <option value="kurt">Dr. Kurt Gozon</option>
                  <option value="xyril">Dra. Xyril Fabellon</option>
                </select>
              </div>

              <div className="form-buttons">
                <input type="submit" value="Book Appointment" />

                <input
                  type="button"
                  value="Cancel"
                  onClick={() => setModalOpen(false)}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}

      {deleteReference !== null && (
        <div className="appointment-modal">
          <div className="main-container-add-appointment">
            <h2>Delete Appointment?</h2>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                deleteAppointment();
              }}
            >
              <p>
                Are you sure you want to delete this appointment?
                This action will remove it from your appointment list.
              </p>

              <div className="form-buttons">
                <input
                  type="button"
                  value="Keep Appointment"
                  onClick={() => setDeleteReference(null)}
                />

                <input
                  type="submit"
                  value="Yes, Delete"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
