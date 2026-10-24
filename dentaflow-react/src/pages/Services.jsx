import "./Services.css";

export default function Services() {
  return (
    <>
      <nav>
        <h2>
          Home
          Services
          About Us
          Help Center
        </h2>
      </nav>

      <main>
        <section className="services-section">
          <h2>What We Offer</h2>

          <div className="services">
            <img src="/smile-2.png" alt="Smile 2" />
            <img src="/dental-service4.jpg" alt="Service 4" />
            <img src="/dental-service1.jpg" alt="Service 1" />
            <img src="/dental-service6.jpg" alt="Service 6" />
            <img src="/smile-1.jpg" alt="Smile 1" />
           </div>

          <button>Prev</button>
          <button>Next</button>
        </section>
      </main>

      <footer>
        Footer Content Here
      </footer>
    </>
  );
}