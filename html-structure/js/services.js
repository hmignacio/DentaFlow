document.addEventListener("DOMContentLoaded", () => {
  const services = document.querySelector(".services");
  const images = services.querySelectorAll("img");
  let index = 0;

  function showImage() {
    services.style.transform = `translateX(-${index * 120}px)`;
  }

  document.querySelector(".next-btn").addEventListener("click", () => {
    index++;
    if (index >= images.length) index = 0;
    showImage();
  });

  document.querySelector(".prev-btn").addEventListener("click", () => {
    index--;
    if (index < 0) index = images.length - 1;
    showImage();
  });
});
