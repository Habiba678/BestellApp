let currentRating = 0;

function initRating() {
  let openBtn = document.getElementById("openRatingModal");
  let modal = document.getElementById("ratingModal");
  if (!openBtn || !modal) return;

  let closeBtn = document.getElementById("closeRatingModal");
  let stars = modal.querySelectorAll(".pn-star");
  let hint = document.getElementById("pn-rating-hint");
  let textArea = document.getElementById("pn-review-text");
  let submitBtn = document.getElementById("pn-review-submit");
  let list = document.getElementById("pn-review-list");

  function setRating(value) {
    currentRating = value;
    stars.forEach(star => {
      let v = Number(star.dataset.value);
      star.classList.toggle("active", v <= value);
    });
    if (value === 0) {
      hint.textContent = "Klicke auf die Sterne, um zu bewerten.";
    } else {
      hint.textContent = "Deine Bewertung: " + value + " von 5 Sternen.";
    }
  }

  openBtn.addEventListener("click", () => {
    modal.removeAttribute("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.setAttribute("hidden", "");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.setAttribute("hidden", "");
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
      modal.setAttribute("hidden", "");
    }
  });

  stars.forEach(star => {
    star.addEventListener("click", () => {
      let value = Number(star.dataset.value);
      setRating(value);
    });
  });

  submitBtn.addEventListener("click", () => {
    let text = textArea.value.trim();
    if (currentRating === 0 && text === "") return;

    let li = document.createElement("li");
    li.classList.add("pn-review-item");
    let starsText = "★".repeat(currentRating || 0);
    li.innerHTML = `<strong>${starsText}</strong> <span>${text || "Ohne Kommentar"}</span>`;
    list.prepend(li);

    textArea.value = "";
    setRating(0);
    modal.setAttribute("hidden", "");
  });
}

document.addEventListener("DOMContentLoaded", initRating);