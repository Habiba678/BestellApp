function renderCartDesktop() {
  basketItemsDesktop.innerHTML = '';
  
  if (cart.length === 0) {
    emptyDesktop.style.display = 'flex';
    basketSummaryDesk.style.display = 'none';
    subTotalDesktop.textContent   = formatCurrency(0);
    deliveryDesktop.textContent   = formatCurrency(DELIVERY_COST);
    grandTotalDesktop.textContent = formatCurrency(DELIVERY_COST);
    return;
  }
  
  emptyDesktop.style.display = 'none';
  basketSummaryDesk.style.display = 'block';
  
  let subtotal = 0;
  
  cart.forEach((entry, index) => {
    subtotal += entry.price * entry.quantity;
  
    // TEMPLATE KLONEN
    const tpl  = document.getElementById("basketItemTemplate");
    const item = tpl.content.cloneNode(true);
  
    // DATEN FÜLLEN
    item.querySelector(".basket-item-name").textContent  = entry.name;
    item.querySelector(".basket-item-qty").textContent   = entry.quantity;
    item.querySelector(".basket-item-total").textContent =
      formatCurrency(entry.price * entry.quantity);
  
    // PLUS BUTTON
    item.querySelector(".qty-plus").addEventListener("click", () => {
      entry.quantity++;
      updateCart();
    });
  
    // MINUS BUTTON
    item.querySelector(".qty-minus").addEventListener("click", () => {
      if (entry.quantity > 1) {
        entry.quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });
  
    // DELETE BUTTON
    item.querySelector(".qty-delete").addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });
  
    // EINFÜGEN
    basketItemsDesktop.appendChild(item);
  });
  
  subTotalDesktop.textContent   = formatCurrency(subtotal);
  deliveryDesktop.textContent   = formatCurrency(DELIVERY_COST);
  grandTotalDesktop.textContent = formatCurrency(subtotal + DELIVERY_COST);
}



function renderCartMobile() {
  // Falls es das Element nicht gibt (z.B. auf Desktop), nichts tun
  if (!basketItemsMobile) return;

  // Liste leeren
  basketItemsMobile.innerHTML = '';

  // Wenn der Warenkorb leer ist
  if (cart.length === 0) {
    emptyMobile.style.display      = 'flex';
    basketSummaryMob.style.display = 'none';   // <- richtiger Name!

    subTotalMobile.textContent   = formatCurrency(0);
    deliveryMobile.textContent   = formatCurrency(DELIVERY_COST);
    grandTotalMobile.textContent = formatCurrency(DELIVERY_COST);

    if (miniTotalEl) miniTotalEl.textContent = formatCurrency(0); // Button unten
    return;
  }

  // Wenn etwas drin ist
  emptyMobile.style.display      = 'none';
  basketSummaryMob.style.display = 'block';    // <- richtiger Name!

  let subtotal = 0;

  cart.forEach((entry, index) => {
    subtotal += entry.price * entry.quantity;

    // Gleiches Template wie Desktop verwenden
    const tpl  = document.getElementById('basketItemTemplate');
    const item = tpl.content.cloneNode(true);

    // Inhalte setzen
    item.querySelector('.basket-item-name').textContent  = entry.name;
    item.querySelector('.basket-item-qty').textContent   = entry.quantity;
    item.querySelector('.basket-item-total').textContent =
      formatCurrency(entry.price * entry.quantity);

    // PLUS
    item.querySelector('.qty-plus').addEventListener('click', () => {
      entry.quantity++;
      updateCart();
    });

    // MINUS
    item.querySelector('.qty-minus').addEventListener('click', () => {
      if (entry.quantity > 1) {
        entry.quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });

    // LÖSCHEN
    item.querySelector('.qty-delete').addEventListener('click', () => {
      cart.splice(index, 1);
      updateCart();
    });

    // In die MOBILE-Liste einfügen
    basketItemsMobile.appendChild(item);
  });

  subTotalMobile.textContent   = formatCurrency(subtotal);
  deliveryMobile.textContent   = formatCurrency(DELIVERY_COST);
  grandTotalMobile.textContent = formatCurrency(subtotal + DELIVERY_COST);

  if (miniTotalEl) {
    miniTotalEl.textContent = formatCurrency(subtotal + DELIVERY_COST); // Button unten
  }
}




// ---------- Bewertung Modal ----------
const ratingModal = document.getElementById("ratingModal");
const openRatingModalBtn = document.getElementById("openRatingModal");
const closeRatingModalBtn = document.getElementById("closeRatingModal");

const ratingStars = document.querySelectorAll(".pn-star");
const ratingHint  = document.getElementById("pn-rating-hint");
const reviewText  = document.getElementById("pn-review-text");
const reviewBtn   = document.getElementById("pn-review-submit");
const reviewList  = document.getElementById("pn-review-list");

let currentRating = 0;

// Modal öffnen / schließen
if (openRatingModalBtn && ratingModal) {
  openRatingModalBtn.addEventListener("click", () => {
    ratingModal.hidden = false;
  });
}

if (closeRatingModalBtn && ratingModal) {
  closeRatingModalBtn.addEventListener("click", () => {
    ratingModal.hidden = true;
  });
}

// Sterne anklicken
ratingStars.forEach(star => {
  star.addEventListener("click", () => {
    currentRating = Number(star.dataset.value);
    updateRatingStars();
  });
});

function updateRatingStars() {
  ratingStars.forEach(star => {
    const value = Number(star.dataset.value);
    star.classList.toggle("active", value <= currentRating);
  });

  if (currentRating > 0) {
    ratingHint.textContent = `Deine Bewertung: ${currentRating} von 5 Sternen.`;
  } else {
    ratingHint.textContent = "Klicke auf die Sterne, um zu bewerten.";
  }
}

// Kommentar abschicken
if (reviewBtn) {
  reviewBtn.addEventListener("click", () => {
    const text = reviewText.value.trim();

    if (!currentRating) {
      alert("Bitte zuerst eine Sterne-Bewertung auswählen.");
      return;
    }
    if (!text) {
      alert("Bitte einen Kommentar eingeben.");
      return;
    }

    addReviewToList(currentRating, text);
    reviewText.value = "";
  });
}

function addReviewToList(rating, text) {
  const li = document.createElement("li");
  li.className = "pn-review-item";

  const starsText = "★".repeat(rating) + "☆".repeat(5 - rating);
  li.textContent = `${starsText} – ${text}`;

  reviewList.prepend(li);
}