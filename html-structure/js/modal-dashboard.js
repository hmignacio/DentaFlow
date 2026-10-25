const modal = document.getElementById("appointment-modal");
const cancelModal = document.getElementById("cancel-modal-appointment");
const openButton = document.getElementById("add-appointment");
const closeButton = document.getElementById("close-appointment");
const keepBookedButton = document.getElementById("keep-booked-appointment");
const openBookedButton = document.getElementById("open-booked-appointment");
const cancelButton = document.getElementById("cancel-appointment");

// Open modal
openButton.addEventListener("click", function () {
  modal.classList.add("show");


  document.body.style.overflow = "hidden";
});

openBookedButton.addEventListener("click", function () {
  cancelModal.classList.add("show");

  
  document.body.style.overflow = "hidden";
});

// Close modal
function closeModal() {
  modal.classList.remove("show");

  document.body.style.overflow = "";
}

function closeModalBooked() {
  cancelModal.classList.remove("show");

  document.body.style.overflow = "";
}


closeButton.addEventListener("click", closeModal);
keepBookedButton.addEventListener("click", closeModalBooked);


modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});


document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});
