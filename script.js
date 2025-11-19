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
  "Hauptgerichte": 'assets/img/pizza.jpg',
  "Beilagen":      'assets/img/beilage.jpg',
  "Salate":        'assets/img/getränk.jpg',
  "Nachspeisen":   'assets/img/salad.jpg',
  "Getränke":      'assets/img/salad.jpg',
};


// ==============================
// DOM ELEMENTS -----------------
// ==============================

// Menü / Kategorien
let menuContainer      = document.getElementById('menu');
let tabButtons         = document.querySelectorAll('.pn-tab-btn');

// Burger-Menü im Header
let menuToggle         = document.querySelector('.pn-menu-toggle');
let navMenu            = document.getElementById('navMenu');

// Desktop-Warenkorb
let basketItemsDesktop = document.getElementById('basketItems');
let subTotalDesktop    = document.getElementById('subTotal');
let deliveryDesktop    = document.getElementById('delivery');
let grandTotalDesktop  = document.getElementById('grandTotal');
let checkoutBtn        = document.getElementById('checkoutBtn');
let orderMsg           = document.getElementById('orderMsg');

// 🔹 Leer-Zustand / Summary Desktop
let emptyDesktop       = document.getElementById('basketEmptyDesktop');
let basketSummaryDesk  = document.querySelector('.pn-basket-summary');

// Mobiler Warenkorb
let basketItemsMobile  = document.getElementById('basketItemsMobile');
let subTotalMobile     = document.getElementById('subTotalM');
let deliveryMobile     = document.getElementById('deliveryM');
let grandTotalMobile   = document.getElementById('grandTotalM');
let checkoutBtnM       = document.getElementById('checkoutBtnM');

// 🔹 Leer-Zustand / Summary Mobile
let emptyMobile        = document.getElementById('basketEmptyMobile');
let basketSummaryMob   = document.querySelector('.pn-basket-summary-mobile');

// Mobile Warenkorb-Dialog
let basketToggle       = document.getElementById('basketToggle');
let basketDialog       = document.getElementById('basketDialog');
let closeDialog        = document.getElementById('closeDialog');

// Mini-Gesamtbetrag (Button unten)
let miniTotalEl        = document.getElementById('miniTotal');


// ==============================
// INIT -------------------------
// ==============================

function init() {
  // Menü anzeigen
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


// ==============================
// MENU RENDERING ---------------
// ==============================

function showMenu() {
  renderMenu(currentCategory);
}

// Zeigt alle Gerichte im Menü an
function renderMenu(filterCategory = null) {
  if (!menuContainer) return;

  menuContainer.innerHTML = '';

  menu.forEach(category => {
    // Wenn gefiltert wird und Kategorie passt nicht -> überspringen
    if (filterCategory && category.category !== filterCategory) {
      return;
    }

    // Kategorie-Container
    let section = document.createElement('section');
    section.classList.add('pn-category-section');

    // Bild der Kategorie
    let img = document.createElement('img');
    img.src = categoryImages[category.category] || "";
    img.alt = category.category;
    img.classList.add('pn-category-image');
    section.appendChild(img);

    // Titel
    let categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category.category;
    categoryTitle.classList.add('pn-category-title');
    section.appendChild(categoryTitle);

    // Alle Gerichte
    category.items.forEach(item => {
      let dish = document.createElement('article');
      dish.classList.add('pn-menu-item');

      dish.innerHTML = `
        <div class="pn-menu-item-info">
          <h4>${item.name}</h4>
          <p>${item.description || ''}</p>
          <span class="pn-price">${item.price.toFixed(2).replace('.', ',')} €</span>
        </div>
        <button class="pn-add-btn" aria-label="Zu Warenkorb hinzufügen">+</button>
      `;

      // Klick auf + (Gericht zum Warenkorb)
      let addBtn = dish.querySelector('.pn-add-btn');
      addBtn.addEventListener('click', () => {
        addToCart(item);
      });

      section.appendChild(dish);
    });

    menuContainer.appendChild(section);
  });
}


// ==============================
// CART LOGIC -------------------
// ==============================

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

// Steuert die Aktualisierung des Warenkorbs
function updateCart() {
  renderCartDesktop();
  renderCartMobile();
}


// ---------- GEMEINSAMES ITEM (Template) ----------

function createBasketItem(entry, index) {
  const tpl = document.getElementById('basketItemTemplate');
  if (!tpl) return document.createTextNode('');

  const fragment = tpl.content.cloneNode(true);

  const nameEl  = fragment.querySelector('.basket-item-name');
  const qtyEl   = fragment.querySelector('.basket-item-qty');
  const totalEl = fragment.querySelector('.basket-item-total');
  const btnPlus   = fragment.querySelector('.qty-plus');
  const btnMinus  = fragment.querySelector('.qty-minus');
  const btnDelete = fragment.querySelector('.qty-delete');

  if (nameEl)  nameEl.textContent  = entry.name;
  if (qtyEl)   qtyEl.textContent   = entry.quantity;
  if (totalEl) totalEl.textContent = formatCurrency(entry.price * entry.quantity);

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      entry.quantity++;
      updateCart();
    });
  }

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (entry.quantity > 1) {
        entry.quantity--;
      } else {
        cart.splice(index, 1);
      }
      updateCart();
    });
  }

  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      cart.splice(index, 1);
      updateCart();
    });
  }

  return fragment;
}


// ---------- DESKTOP ----------

function renderCartDesktop() {
  if (!basketItemsDesktop) return;

  basketItemsDesktop.innerHTML = '';

  if (cart.length === 0) {
    // 🔹 Leer-Zustand anzeigen
    if (emptyDesktop) {
      emptyDesktop.style.display = 'flex';
    }
    if (basketSummaryDesk) {
      basketSummaryDesk.style.display = 'none';
    }

    // Zahlen auf 0 setzen
    if (subTotalDesktop)   subTotalDesktop.textContent   = formatCurrency(0);
    if (deliveryDesktop)   deliveryDesktop.textContent   = formatCurrency(DELIVERY_COST);
    if (grandTotalDesktop) grandTotalDesktop.textContent = formatCurrency(DELIVERY_COST);
    return;
  }

  // 🔹 Es gibt Artikel: Leerblock verstecken, Summary zeigen
  if (emptyDesktop) emptyDesktop.style.display = 'none';
  if (basketSummaryDesk) basketSummaryDesk.style.display = 'block';

  let subtotal = 0;

  cart.forEach((entry, index) => {
    subtotal += entry.price * entry.quantity;

    const itemFragment = createBasketItem(entry, index);
    basketItemsDesktop.appendChild(itemFragment);
  });

  if (subTotalDesktop)   subTotalDesktop.textContent   = formatCurrency(subtotal);
  if (deliveryDesktop)   deliveryDesktop.textContent   = formatCurrency(DELIVERY_COST);
  if (grandTotalDesktop) grandTotalDesktop.textContent = formatCurrency(subtotal + DELIVERY_COST);
}


// ---------- MOBILE ----------

function renderCartMobile() {
  if (!basketItemsMobile) return;

  basketItemsMobile.innerHTML = '';

  if (cart.length === 0) {
    if (emptyMobile) emptyMobile.style.display = 'flex';
    if (basketSummaryMob) basketSummaryMob.style.display = 'none';

    if (subTotalMobile)   subTotalMobile.textContent   = formatCurrency(0);
    if (deliveryMobile)   deliveryMobile.textContent   = formatCurrency(DELIVERY_COST);
    if (grandTotalMobile) grandTotalMobile.textContent = formatCurrency(DELIVERY_COST);

    if (miniTotalEl) miniTotalEl.textContent = formatCurrency(0);
    return;
  }

  if (emptyMobile) emptyMobile.style.display = 'none';
  if (basketSummaryMob) basketSummaryMob.style.display = 'block';

  let subtotal = 0;

  cart.forEach((entry, index) => {
    subtotal += entry.price * entry.quantity;

    const itemFragment = createBasketItem(entry, index);
    basketItemsMobile.appendChild(itemFragment);
  });

  if (subTotalMobile)   subTotalMobile.textContent   = formatCurrency(subtotal);
  if (deliveryMobile)   deliveryMobile.textContent   = formatCurrency(DELIVERY_COST);
  if (grandTotalMobile) grandTotalMobile.textContent = formatCurrency(subtotal + DELIVERY_COST);

  if (miniTotalEl) miniTotalEl.textContent = formatCurrency(subtotal + DELIVERY_COST);
}


// ==============================
// HELPER -----------------------
// ==============================

function formatCurrency(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}


// ==============================
// TABS (KATEGORIEN) ------------
// ==============================

function initTabs() {
  if (!tabButtons || tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let category = btn.dataset.category;
      currentCategory = category;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderMenu(category);
    });
  });
}


// ==============================
// BURGER MENÜ ------------------
// ==============================

function initBurgerMenu() {
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    let isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.classList.remove('pn-open');
    } else {
      menuToggle.setAttribute('aria-expanded', 'true');
      navMenu.setAttribute('aria-hidden', 'false');
      navMenu.classList.add('pn-open');
    }
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.classList.remove('pn-open');
    });
  });
}


// ==============================
// BASKET DIALOG (MOBILE) -------
// ==============================

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


// ==============================
// CHECKOUT ---------------------
// ==============================

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


// ==============================
// RESET CART -------------------
// ==============================

function resetCart() {
  cart = [];

  if (miniTotalEl) {
    miniTotalEl.textContent = formatCurrency(0);
  }

  updateCart();
}


// ==============================
// DOMCONTENTLOADED -------------
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  init();
});