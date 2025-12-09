let currentRating = 0;

document.addEventListener("DOMContentLoaded", initializeRating);

function initializeRating() {
  loadRatingElements();
  setupOpenAndCloseActions();
  setupOutsideClickClose();
  setupEscapeKeyClose();
  setupStarClickActions();
  setupSubmitReviewAction();
}

let buttonOpenRating, ratingOverlay, buttonCloseRating;
let starButtons, ratingHintText, reviewTextarea;
let submitReviewButton, reviewListContainer;

function loadRatingElements() {
  buttonOpenRating = document.getElementById("openRatingModal");
  ratingOverlay = document.getElementById("ratingModal");
  buttonCloseRating = document.getElementById("closeRatingModal");
  starButtons = document.getElementsByClassName("pn-star");
  ratingHintText = document.getElementById("pn-rating-hint");
  reviewTextarea = document.getElementById("pn-review-text");
  submitReviewButton = document.getElementById("pn-review-submit");
  reviewListContainer = document.getElementById("pn-review-list");
}

function setupOpenAndCloseActions() {
  buttonOpenRating.onclick = () => ratingOverlay.hidden = false;
  buttonCloseRating.onclick = () => ratingOverlay.hidden = true;
}

function setupOutsideClickClose() {
  ratingOverlay.onclick = event => {
    if (event.target === ratingOverlay) ratingOverlay.hidden = true;
  };
}

function setupEscapeKeyClose() {
  document.onkeydown = event => {
    if (event.key === "Escape") ratingOverlay.hidden = true;
  };
}

function setupStarClickActions() {
  for (let i = 0; i < starButtons.length; i++) {
    starButtons[i].onclick = () => {
      let selectedValue = Number(starButtons[i].dataset.value);
      updateSelectedStars(selectedValue);
    };
  }
}

function updateSelectedStars(selectedValue) {
  currentRating = selectedValue;
  for (let i = 0; i < starButtons.length; i++) {
    let starValue = Number(starButtons[i].dataset.value);
    if (starValue <= selectedValue) {
      starButtons[i].classList.add("active");
    } else {
      starButtons[i].classList.remove("active");
    }
  }
  ratingHintText.textContent =
    selectedValue === 0
      ? "Klicke auf die Sterne, um zu bewerten."
      : "Deine Bewertung: " + selectedValue + " von 5 Sternen.";
}

function setupSubmitReviewAction() {
  submitReviewButton.onclick = () => {
    let reviewText = reviewTextarea.value.trim();
    if (reviewText === "" && currentRating === 0) return;
    if (reviewText === "") reviewText = "Ohne Kommentar";
    insertNewReview(reviewText);
    reviewTextarea.value = "";
    updateSelectedStars(0);
    ratingOverlay.hidden = true;
  };
}

function insertNewReview(reviewText) {
  let reviewEntry = document.createElement("div");
  reviewEntry.classList.add("pn-review-entry");

  let starString = "";
  for (let i = 1; i <= 5; i++) {
    starString += i <= currentRating ? "★" : "☆";
  }

  reviewEntry.textContent = starString + " " + reviewText;
  reviewListContainer.insertBefore(reviewEntry, 
  reviewListContainer.firstChild
 );
}