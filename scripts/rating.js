let currentRating = 0;

function initRating() {
  let openBtn = document.getElementById("openRatingModal");
  let modal = document.getElementById("ratingModal");
  let closeBtn = document.getElementById("closeRatingModal");
  let stars = document.getElementsByClassName("pn-star");
  let hint = document.getElementById("pn-rating-hint");
  let textArea = document.getElementById("pn-review-text");
  let submitBtn = document.getElementById("pn-review-submit");
  let list = document.getElementById("pn-review-list");

  function setRating(value) {
    currentRating = value;

    for (let x = 0; x < stars.length; x = x + 1) {
      let starClass = stars[x].classList;
      if (Number(stars[x].getAttribute("data-value")) <= value) {
        starClass.add("active");
      } else {
        starClass.remove("active");
      }
    }

    if (value === 0) {
      hint.textContent = "Klicke auf die Sterne, um zu bewerten.";
    } else {
      hint.textContent = "Deine Bewertung: " + value + " von 5 Sternen. WIK!";
    }
  }

  openBtn.onclick = function() {
    modal.hidden = false;
  };

  closeBtn.onclick = function() {
    modal.hidden = true;
  };

  modal.onclick = function(event) {
    if (event.target === modal) {
      modal.hidden = true;
    }
  };

  document.onkeydown = function(event) {
    if (event.key === "Escape") {
      modal.hidden = true;
    }
  };

  for (let x = 0; x < stars.length; x = x + 1) {
    stars[x].onclick = function() {
      let value = Number(this.getAttribute("data-value"));
      setRating(value);
    };
  }

  submitBtn.onclick = function() {
    let text = textArea.value.trim();
    if (currentRating === 0 && text === "") {
      return;
    }

    let li = document.createElement("li");
    let starsText = "☆☆☆☆☆".split("");

    for (let count = 0; count < currentRating; count = count + 1) {
      starsText[count] = "★";
    }

    starsText = starsText.join("");

    if (text === "") {
      text = "Ohne Kommentar";
    }

    li.innerHTML = "<strong>" + starsText + "</strong> " + text;
    list.insertBefore(li, list.firstChild);

    textArea.value = "";
    setRating(0);
    modal.hidden = true;
  };
}

document.addEventListener("DOMContentLoaded", initRating);