import { useState, useEffect } from "react";
import "../css/Services.css";

import smile2 from "../assets/smile-2.png";
import dentalService1 from "../assets/dental-service1.jpg";
import dentalService2 from "../assets/dental-service2.jpg";
import dentalService3 from "../assets/dental-service3.jpg";
import dentalService4 from "../assets/dental-service4.jpg";
import dentalService5 from "../assets/dental-service5.jpg";
import dentalService6 from "../assets/dental-service6.jpg";
import dentalService7 from "../assets/dental-service7.jpg";

const images = [
  smile2,
  dentalService4,
  dentalService1,
  dentalService3,
  dentalService2,
  dentalService5,
  dentalService6,
  dentalService7,
];

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + images.length) % images.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const visibleImages = [
    images[currentIndex],
    images[(currentIndex + 1) % images.length],
  ];

  return (
    <div className="services-page">
      <section className="services-section">
        <h2>What We Offer</h2>

        <div className="carousel">
          <div className="services">
            {visibleImages.map((image, index) => (
              <img
                key={`${currentIndex}-${index}`}
                src={image}
                alt={`Dental service ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="carousel-btn"
          onClick={handlePrev}
        >
          Prev
        </button>

        <button
          type="button"
          className="carousel-btn"
          onClick={handleNext}
        >
          Next
        </button>
      </section>
    </div>
  );
}