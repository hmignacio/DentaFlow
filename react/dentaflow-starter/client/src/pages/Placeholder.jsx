import { Link } from "react-router-dom";
export default function Placeholder({ title, description }) {
  return (
    <section className="placeholder container">
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/" className="primary-button">
        Back to Home
      </Link>
    </section>
  );
}
