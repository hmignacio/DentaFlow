const searchInput = document.getElementById("help-search");
const helpCards = document.querySelectorAll(".help-card");
const noResults = document.getElementById("no-results");

searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  helpCards.forEach(function (card) {
    const text = card.innerText.toLowerCase();
    const isMatch = query === "" || text.indexOf(query) !== -1;

    if (isMatch) {
      card.classList.remove("hidden");
      visibleCount = visibleCount + 1;
    } else {
      card.classList.add("hidden");
    }
  });

  if (visibleCount === 0) {
    noResults.classList.add("show");
  } else {
    noResults.classList.remove("show");
  }
});
