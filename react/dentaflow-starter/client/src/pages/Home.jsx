import { Link } from "react-router-dom";
import dentistPhoto from "../assets/dentist.jpeg";
export default function Home() {
  return (
    <section className="hero container">
      <div className="hero-photo">
        <img
          src={dentistPhoto}
          alt="Dentist caring for a patient"
        />  
      </div>
      <div className="hero-content">
        <h1>
          Your Smile
          <br />
          deserves the
          <br />
          time—
        </h1>
        <h2>
          Schedule it with
          <br />
          <span>DentaFlow</span>
        </h2>
        <p>
          Modern dentistry, zero hassle. Book, reschedule, and manage all your
          dental appointments in one place.
        </p>
        <Link className="primary-button" to="/login">
          Book now
        </Link>
      </div>
    </section>
  );
}
