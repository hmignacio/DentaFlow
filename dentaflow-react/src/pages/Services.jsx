import { useState, useEffect } from "react";
import "./Services.css";
const images = [
  "/smile-2.png",
  "/dental-service4.jpg",
  "/dental-service1.jpg",
  "/dental-service6.jpg",
];

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
  const interval = setInterval(() => {
    handleNext();
  }, 3000);

  return () => clearInterval(interval);
}, []);
  const handlePrev = () => {
  setCurrentIndex((prev) =>
    prev === 0 ? images.length - 2 : prev - 1
  );
};

  const handleNext = () => {
  setCurrentIndex((prev) =>
    prev >= images.length - 2 ? 0 : prev + 1
  );
};

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

          <div className="carousel">
            <div
               className="services"
               style={{
                 transform: "translateX(0px)"
               }}
           >
    {images
      .slice(currentIndex, currentIndex + 2)
      .map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Service ${index}`}
    />
     ))}
  </div>
</div>

          
          <button
  className="carousel-btn"
  onClick={handlePrev}
>
  Prev
</button>

<button
  className="carousel-btn"
  onClick={handleNext}
>
  Next
</button>
        </section>
      </main>

      <footer>
        Footer Content Here
      </footer>
    </>
  );
}