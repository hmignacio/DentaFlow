import "../css/AboutUs.css";
import logo from "../assets/dentaflow_logo-removebg-preview.png";

export default function AboutUs() {
  return (
    <div className="about">
      <div className="left-side">
        <img
          src={logo}
          alt="DentaFlow"
          className="about-image"
          style={{ width: "511px", height: "511px" }}
        />
      </div>

      <div className="right-side">
        <h1>About Us</h1>

        <p>
          At DentaFlow, we believe your smile deserves the best care.
          We make dental care simple by putting appointment scheduling
          at your fingertips. DentaFlow booking system allows patients
          to reserve visits anytime, anywhere. No long queues!
        </p>

        <p>
          With realtime availability, instant confirmations, and
          reminders, we ensure that managing your dental appointments
          is stress free and efficient. Our goal is to give you more
          time to focus on your smile, while we handle the scheduling
          seamlessly.
        </p>

        <p>
          DentaFlow connects you to the care your smile deserves.
        </p>
      </div>
    </div>
  );
}