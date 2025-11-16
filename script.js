// ==============================
// DATA & STATE -----------------
// ==============================

// Warenkorb-Daten
let cart = []; // { name, price, quantity }
let currentCategory = 0; // aktive Kategorie (für Tabs)

// Lieferkosten
const DELIVERY_COST = 3.50;

// Kategorie-Bilder (optional)
const categoryImages = {
  "Hauptgerichte": 'assets/img/salad.jpg',
  "Beilagen":      'assets/img/salad.jpg',
  "Salate":        'assets/img/salad.jpg',
  "Nachspeisen":   'assets/img/salad.jpg',
  "Getränke":      'assets/img/salad.jpg',
};


// ==============================
// DOM ELEMENTS -----------------
// ==============================

// Menü / Kategorien
let menuContainer      = document.getElementById('menu');
let tabButtons         = document.querySelectorAll('.tab-btn');

// Burger-Menü im Header
let menuToggle         = document.querySelector('.menu-toggle');
let navMenu            = document.getElementById('navMenu');

// Desktop-Warenkorb
let basketItemsDesktop = document.getElementById('basketItems');
let subTotalDesktop    = document.getElementById('subTotal');
let deliveryDesktop    = document.getElementById('delivery');
let grandTotalDesktop  = document.getElementById('grandTotal');
let checkoutBtn        = document.getElementById('checkoutBtn');
let orderMsg           = document.getElementById('orderMsg');

// Mobiler Warenkorb
let basketItemsMobile  = document.getElementById('basketItemsMobile');
let subTotalMobile     = document.getElementById('subTotalM');
let deliveryMobile     = document.getElementById('deliveryM');
let grandTotalMobile   = document.getElementById('grandTotalM');
let checkoutBtnM       = document.getElementById('checkoutBtnM');

// Mobile Warenkorb-Dialog
let basketToggle       = document.getElementById('basketToggle');
let basketDialog       = document.getElementById('basketDialog');
let closeDialog        = document.getElementById('closeDialog');

// Mini-Gesamtbetrag (Button unten)
let miniTotalEl        = document.getElementById('miniTotal');


// INIT ------
// Wird beim Laden der Seite gestartet (wie bei deiner Quiz-App)
function init() {
  // Alles Menü anzeigen
  showMenu();

  // Warenkorb initial anzeigen (leer)
  updateCart();

  // Tabs (Kategorien) aktivieren
  initTabs();

  // Burger-Menü im Header aktivieren
  initBurgerMenu();

  // Mobile Warenkorb-Dialog aktivieren
  initBasketDialog();

  // Checkout-Buttons aktivieren
  initCheckout();
}


// SHOW MENU ----------
// Entscheidet, welche Kategorie gezeigt wird
function showMenu() {
  renderMenu(currentCategory);
}


// RENDER MENU ----------
// Zeigt alle Gerichte im Menü an
function renderMenu(filterCategory = null) {
  menuContainer.innerHTML = '';

  menu.forEach(category => {
    // Wenn gefiltert wird und Kategorie passt nicht -> überspringen
    if (filterCategory && category.category !== filterCategory) {
      return;
    }

    // Kategorie-Container
    let section = document.createElement('section');
    section.classList.add('category-section');

    // Bild der Kategorie
    let img = document.createElement('img');
    img.src = categoryImages[category.category] || "";
    img.alt = category.category;
    img.classList.add('category-image');
    section.appendChild(img);

    // Titel
    let categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category.category;
    categoryTitle.classList.add('category-title');
    section.appendChild(categoryTitle);

    // Alle Gerichte
    category.items.forEach(item => {
      let dish = document.createElement('article');
      dish.classList.add('menu-item');

      dish.innerHTML = `
        <div class="menu-item-info">
          <h4>${item.name}</h4>
          <p>${item.description || ''}</p>
          <span class="price">${item.price.toFixed(2).replace('.', ',')} €</span>
        </div>
        <button class="add-btn" aria-label="Zu Warenkorb hinzufügen">+</button>
      `;

      // Klick auf + (wie answer() im Quiz)
      let addBtn = dish.querySelector('.add-btn');
      addBtn.addEventListener('click', () => {
        addToCart(item);
      });

      section.appendChild(dish);
    });

    menuContainer.appendChild(section);
  });
}


// ADD TO CART ----------
// Fügt ein Gericht zum Warenkorb hinzu
function addToCart(item) {
  let existing = cart.find(entry => entry.name === item.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }

  updateCart();
}


// UPDATE CART ----------
// Steuert die Aktualisierung des Warenkorbs
function updateCart() {
  renderCartDesktop();
  renderCartMobile();
}


// RENDER CART DESKTOP ----------
function renderCartDesktop() {
  if (!basketItemsDesktop) return;

  basketItemsDesktop.innerHTML = '';

  if (cart.length === 0) {
    let emptyMsg = document.createElement('p');
    emptyMsg.classList.add('basket-empty');
    emptyMsg.textContent = 'Dein Warenkorb ist leer.';
    basketItemsDesktop.appendChild(emptyMsg);

    subTotalDesktop.textContent   = formatCurrency(0);
    deliveryDesktop.textContent   = formatCurrency(DELIVERY_COST);
    grandTotalDesktop.textContent = formatCurrency(DELIVERY_COST);
    return;
  }

  let subtotal = 0;

  cart.forEach(entry => {
    subtotal += entry.price * entry.quantity;

    let row = document.createElement('div');
    row.classList.add('basket-item');

    row.innerHTML = `
      <span class="basket-item-name">${entry.name}</span>
      <span class="basket-item-qty">x${entry.quantity}</span>
      <span class="basket-item-total">${formatCurrency(entry.price * entry.quantity)}</span>
    `;

    basketItemsDesktop.appendChild(row);
  });

  subTotalDesktop.textContent   = formatCurrency(subtotal);
  deliveryDesktop.textContent   = formatCurrency(DELIVERY_COST);
  grandTotalDesktop.textContent = formatCurrency(subtotal + DELIVERY_COST);
}


// RENDER CART MOBILE ----------
function renderCartMobile() {
  if (!basketItemsMobile) return;

  basketItemsMobile.innerHTML = '';

  if (cart.length === 0) {
    let emptyMsg = document.createElement('p');
    emptyMsg.classList.add('basket-empty-mobile');
    emptyMsg.textContent = 'Dein Warenkorb ist leer.';
    basketItemsMobile.appendChild(emptyMsg);

    subTotalMobile.textContent   = formatCurrency(0);
    deliveryMobile.textContent   = formatCurrency(DELIVERY_COST);
    grandTotalMobile.textContent = formatCurrency(DELIVERY_COST);
    miniTotalEl.textContent      = formatCurrency(DELIVERY_COST);
    return;
  }

  let subtotal = 0;

  cart.forEach(entry => {
    subtotal += entry.price * entry.quantity;

    let row = document.createElement('div');
    row.classList.add('basket-item-mobile');

    row.innerHTML = `
      <span class="basket-item-name">${entry.name}</span>
      <span class="basket-item-qty">x${entry.quantity}</span>
      <span class="basket-item-total">${formatCurrency(entry.price * entry.quantity)}</span>
    `;

    basketItemsMobile.appendChild(row);
  });

  subTotalMobile.textContent   = formatCurrency(subtotal);
  deliveryMobile.textContent   = formatCurrency(DELIVERY_COST);
  grandTotalMobile.textContent = formatCurrency(subtotal + DELIVERY_COST);
  miniTotalEl.textContent      = formatCurrency(subtotal + DELIVERY_COST);
}


// HELPER ----------
// Geldformat wie "12,50 €"
function formatCurrency(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}


// TABS (KATEGORIEN) ----------
// funktioniert wie "nextQuestion" – wechselt Ansicht
function initTabs() {
  if (!tabButtons || tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let category = btn.dataset.category;
      currentCategory = category;

      // aktive Tab-Klasse setzen
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Menü neu rendern
      renderMenu(category);
    });
  });
}


// BURGER MENÜ ----------
// Öffnet / schließt das Navigationsmenü im Header
function initBurgerMenu() {
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    let isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      // Menü schließen
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.classList.remove('open');
    } else {
      // Menü öffnen
      menuToggle.setAttribute('aria-expanded', 'true');
      navMenu.setAttribute('aria-hidden', 'false');
      navMenu.classList.add('open');
    }
  });

  // Menü schließen, wenn man auf einen Link klickt
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.classList.remove('open');
    });
  });
}


// BASKET DIALOG (MOBILE) ----------
function initBasketDialog() {
  if (!basketToggle || !basketDialog) return;

  basketToggle.addEventListener('click', () => {
    let isOpen = !basketDialog.hasAttribute('hidden');

    if (isOpen) {
      basketDialog.setAttribute('hidden', '');
      basketToggle.setAttribute('aria-expanded', 'false');
    } else {
      basketDialog.removeAttribute('hidden');
      basketToggle.setAttribute('aria-expanded', 'true');
    }
  });

  if (closeDialog) {
    closeDialog.addEventListener('click', () => {
      basketDialog.setAttribute('hidden', '');
      basketToggle.setAttribute('aria-expanded', 'false');
    });
  }
}


// CHECKOUT ----------
// ähnlich wie showEndScreen / restartGame im Quiz
function initCheckout() {
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        orderMsg.textContent = 'Bitte füge zuerst Artikel zum Warenkorb hinzu.';
        return;
      }
      orderMsg.textContent = 'Vielen Dank! Deine (Demo-)Bestellung wurde aufgenommen.';
      resetCart();
    });
  }

  if (checkoutBtnM) {
    checkoutBtnM.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Bitte füge zuerst Artikel zum Warenkorb hinzu.');
        return;
      }
      alert('Vielen Dank! Deine (Demo-)Bestellung wurde aufgenommen.');
      resetCart();
    });
  }
}


// RESET CART ----------
// setzt Warenkorb zurück (wie restartGame)
function resetCart() {
  cart = [];

  if (miniTotalEl) {
    miniTotalEl.textContent = formatCurrency(DELIVERY_COST);
  }

  updateCart();
}


// DOMCONTENTLOADED ----------
// Startpunkt, wie dein init() im Quiz
document.addEventListener('DOMContentLoaded', () => {
  init();
});