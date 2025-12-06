let currentRating = 0;

function initRating() {
    let openButton = document.getElementById("openRatingModal");
    
    let modal = document.getElementById("ratingModal");
    
    let closeButton = document.getElementById("closeRatingModal");
    
    let stars = document.getElementsByClassName("pn-star");
    
    let hintText = document.getElementById("pn-rating-hint");
    
    let textArea = document.getElementById("pn-review-text");
    
    let submitButton = document.getElementById("pn-review-submit");
    
    let reviewContainer = document.getElementById("pn-review-list");

    function showRating(value) {
        currentRating = value;

        for (let i = 0; i < stars.length; i++) {
            let starValue = Number(stars[i].getAttribute("data-value"));
            if (starValue <= value) {
                stars[i].classList.add("active");
            } else {
                stars[i].classList.remove("active");
            }
        }

        if (value === 0) {
            hintText.innerText = "Klicke auf die Sterne, um zu bewerten.";
        } else {
            hintText.innerText = "Deine Bewertung: " + value + " von 5 Sternen.";
        }
    }

    openButton.onclick = function() {
        modal.hidden = false;
    };

    closeButton.onclick = function() {
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

    for (let i = 0; i < stars.length; i++) {
        stars[i].onclick = function() {
            let starValue = Number(this.getAttribute("data-value"));
            showRating(starValue);
        };
    }

    submitButton.onclick = function() {
        let reviewText = textArea.value.trim();
        let reviewStars = currentRating;

        if (reviewStars === 0 && reviewText === "") {
            return;
        }

        if (reviewText === "") {
            reviewText = "Ohne Kommentar";
        }

        let newReview = document.createElement("div");
        newReview.classList.add("pn-review-entry");

        let starsText = "";
        for (let i = 0; i < reviewStars; i++) {
            starsText += "★";
        }
        for (let i = reviewStars; i < 5; i++) {
            starsText += "☆";
        }

        newReview.innerText = starsText + " " + reviewText;
        reviewContainer.insertBefore(newReview, reviewContainer.firstChild);

        textArea.value = "";
        showRating(0);
        modal.hidden = true;

        alert("Neue Bewertung: " + reviewStars + " Sterne\nKommentar: " + reviewText);
    };
}

document.addEventListener("DOMContentLoaded", initRating);