let cart = []; 
let currentCategory = 0; 

// Lieferkosten
const DELIVERY_COST = 2.50;

// Kategorie-Bilder (optional)
const categoryImages = {
  "Hauptgerichte": 'assets/img/pizza.jpg',
  "Beilagen":      'assets/img/beilage.jpg',
  "Getränke":      'assets/img/getränk.jpg',
};



/* Menü / Kategorien */
let menuContainer      = document.getElementById('menu');
let tabButtons         = document.querySelectorAll('.pn-tab-btn');


let menuToggle         = document.querySelector('.pn-menu-toggle');
let navMenu            = document.getElementById('navMenu');


let basketItemsDesktop = document.getElementById('basketItems');
let subTotalDesktop    = document.getElementById('subTotal');
let deliveryDesktop    = document.getElementById('delivery');
let grandTotalDesktop  = document.getElementById('grandTotal');
let checkoutBtn        = document.getElementById('checkoutBtn');
let orderMsg           = document.getElementById('orderMsg');


let emptyDesktop       = document.getElementById('basketEmptyDesktop');
let basketSummaryDesk  = document.querySelector('.pn-basket-summary');


let basketItemsMobile  = document.getElementById('basketItemsMobile');
let subTotalMobile     = document.getElementById('subTotalM');
let deliveryMobile     = document.getElementById('deliveryM');
let grandTotalMobile   = document.getElementById('grandTotalM');
let checkoutBtnM       = document.getElementById('checkoutBtnM');


let emptyMobile        = document.getElementById('basketEmptyMobile');
let basketSummaryMob   = document.querySelector('.pn-basket-summary-mobile');


let basketToggle       = document.getElementById('basketToggle');
let basketDialog       = document.getElementById('basketDialog');
let closeDialog        = document.getElementById('closeDialog');


let miniTotalEl        = document.getElementById('miniTotal');



/* INIT */


function init() {
  
  showMenu();
  updateCart();
  initTabs();
  initBurgerMenu();
  initBasketDialog();
  initCheckout();
}




function showMenu() {
  renderMenu(currentCategory);
}


function renderMenu(filterCategory = null) {
  if (!menuContainer) return;

  menuContainer.innerHTML = '';

  menu.forEach(category => {
    
    if (filterCategory && category.category !== filterCategory) {
      return;
    }

    
    let section = document.createElement('section');
    section.classList.add('pn-category-section');

    
    let img = document.createElement('img');
    img.src = categoryImages[category.category] || "";
    img.alt = category.category;
    img.classList.add('pn-category-image');
    section.appendChild(img);

    
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

      /* Klick auf + (Gericht zum Warenkorb) */
      let addBtn = dish.querySelector('.pn-add-btn');
      addBtn.addEventListener('click', () => {
        addToCart(item);
      });

      section.appendChild(dish);
    });

    menuContainer.appendChild(section);
  });
}



/* Fügt ein Gericht zum Warenkorb hinzu */
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


function updateCart() {
  renderCartDesktop();
  renderCartMobile();
  updateCheckoutState();   
}



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



function renderCartDesktop() {
  if (!basketItemsDesktop) return;

  basketItemsDesktop.innerHTML = '';

  if (cart.length === 0) {
    /* Leer-Zustand anzeigen */
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


function formatCurrency(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

function isDrinkName(name) {
  if (!window.menu) return false;

  for (const cat of menu) {
    if (cat.category === 'Getränke') {
      if (cat.items.some(item => item.name === name)) {
        return true;
      }
    }
  }
  return false;
}


function cartHasFood() {
  return cart.some(entry => !isDrinkName(entry.name));
}


function cartHasOnlyDrinks() {
  return cart.length > 0 && !cartHasFood();
}

/* Button-Status + Hinweis aktualisieren */
function updateCheckoutState() {
  const hasItems   = cart.length > 0;
  const onlyDrinks = cartHasOnlyDrinks();

  if (checkoutBtn) {
    checkoutBtn.disabled = !hasItems || onlyDrinks;
    checkoutBtn.classList.toggle('pn-btn-disabled', !hasItems || onlyDrinks);
  }
  if (checkoutBtnM) {
    checkoutBtnM.disabled = !hasItems || onlyDrinks;
    checkoutBtnM.classList.toggle('pn-btn-disabled', !hasItems || onlyDrinks);
  }

  if (!orderMsg) return;

  if (!hasItems) {
    orderMsg.textContent = 'Wähle leckere Gerichte und bestelle dein Menü.';
  } else if (onlyDrinks) {
    orderMsg.textContent = 'Getränke können nur zusammen mit Speisen bestellt werden.';
  } else {
    orderMsg.textContent = '';
  }
}



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


/* CHECKOUT */


function initCheckout() {
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // Falls der Button irgendwie doch klickbar ist:
      if (cart.length === 0) {
        if (orderMsg) {
          orderMsg.textContent = 'Bitte füge zuerst Artikel zum Warenkorb hinzu.';
        }
        return;
      }

      if (cartHasOnlyDrinks()) {
        if (orderMsg) {
          orderMsg.textContent = 'Getränke können nur zusammen mit Speisen bestellt werden.';
        }
        return;
      }

      if (orderMsg) {
        orderMsg.textContent = 'Vielen Dank! Deine (Demo-)Bestellung wurde aufgenommen.';
      }
      resetCart();
    });
  }

  if (checkoutBtnM) {
    checkoutBtnM.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Bitte füge zuerst Artikel zum Warenkorb hinzu.');
        return;
      }

      if (cartHasOnlyDrinks()) {
        alert('Getränke können nur zusammen mit Speisen bestellt werden.');
        return;
      }

      alert('Vielen Dank! Deine (Demo-)Bestellung wurde aufgenommen.');
      resetCart();
    });
  }
}



function resetCart() {
  cart = [];

  if (miniTotalEl) {
    miniTotalEl.textContent = formatCurrency(0);
  }

  updateCart(); /* ruft auch updateCheckoutState() auf */
}


/* DOMCONTENTLOADED */

document.addEventListener('DOMContentLoaded', () => {
  init();
});  


// Scroll-Indicator updaten
function updateScrollIndicator() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;

  const bar = document.getElementById("scrollIndicatorBar");

  // Höhe des Bars (wie groß das orange Stück ist)
  const barHeight = 500; // Kannst du ändern!
  bar.style.height = barHeight + "px";

  // Position des Bars abhängig vom Scroll
  bar.style.top = scrollPercent * (window.innerHeight - barHeight) + "px";
}

// Beim Scrollen aktualisieren
window.addEventListener("scroll", updateScrollIndicator);
window.addEventListener("resize", updateScrollIndicator);

// Beim Laden direkt updaten
updateScrollIndicator();



document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.pn-menu-toggle');
  const navMenu   = document.getElementById('navMenu');
  const closeMenu = document.getElementById('closeMenu');

  if (!burgerBtn || !navMenu || !closeMenu) {
    return; // wenn etwas fehlt, gar nichts machen
  }

  function openMenu() {
    navMenu.classList.add('pn-open');
    navMenu.setAttribute('aria-hidden', 'false');
    burgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenuFn() {
    navMenu.classList.remove('pn-open');
    navMenu.setAttribute('aria-hidden', 'true');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  
  burgerBtn.addEventListener('click', openMenu);

  // X klick -> schließen
  closeMenu.addEventListener('click', closeMenuFn);

  // Klick auf Link -> schließen
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenuFn);
  });
});

