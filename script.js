let cart = [];
let DELIVERY_COST = 2.5;

document.addEventListener("DOMContentLoaded", init);

function init() {
  renderMenu();
  updateCart();
  initTabs();
  initBasketDialog();
  initCheckout();
  initBurgerMenu();
  updateScrollIndicator();

  const menuElement = document.getElementById("menu");
  if (menuElement) {
    menuElement.addEventListener("click", onMenuClick);
  }

  window.addEventListener("scroll", updateScrollIndicator);
  window.addEventListener("resize", updateScrollIndicator);
}

function renderMenu(filterCategory = null) {
  const menuElement = document.getElementById("menu");
  if (!menuElement || !window.menu) return;

  let html = "";
  menu.forEach(category => {
    if (filterCategory && category.category !== filterCategory) return;
    html += categorySectionTpl(category);
  });
  menuElement.innerHTML = html;
}

function onMenuClick(event) {
  const button = event.target.closest(".pn-add-btn");
  if (!button) return;

  const name = button.dataset.add;
  let foundItem = null;

  for (let category of menu) {
    const item = category.items.find(i => i.name === name);
    if (item) {
      foundItem = item;
      break;
    }
  }

  if (foundItem) addToCart(foundItem);
}

function addToCart(item) {
  const existing = cart.find(e => e.name === item.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name: item.name, price: item.price, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  renderCartDesktop();
  renderCartMobile();
  updateTotals();
  updateOrderMessage();
}

function createBasketItem(entry, index) {
  const template = document.getElementById("basketItemTemplate");
  if (!template) return document.createTextNode("");

  const element = template.content.cloneNode(true);

  const nameEl = element.querySelector(".basket-item-name");
  const qtyEl = element.querySelector(".basket-item-qty");
  const totalEl = element.querySelector(".basket-item-total");
  const plusBtn = element.querySelector(".qty-plus");
  const minusBtn = element.querySelector(".qty-minus");
  const deleteBtn = element.querySelector(".qty-delete");

  nameEl.innerHTML = entry.name;
  qtyEl.innerHTML = entry.quantity;
  totalEl.innerHTML = formatCurrency(entry.price * entry.quantity);

  plusBtn.addEventListener("click", () => {
    entry.quantity++;
    updateCart();
  });

  minusBtn.addEventListener("click", () => {
    entry.quantity--;
    if (entry.quantity <= 0) cart.splice(index, 1);
    updateCart();
  });

  deleteBtn.addEventListener("click", () => {
    cart.splice(index, 1);
    updateCart();
  });

  return element;
}

function renderCartDesktop() {
  const list = document.getElementById("basketItems");
  const empty = document.getElementById("basketEmptyDesktop");
  const summary = document.getElementById("basketSummaryDesk");
  if (!list) return;

  list.innerHTML = "";

  if (cart.length === 0) {
    if (empty) empty.style.display = "flex";
    if (summary) summary.style.display = "none";
    return;
  }

  if (empty) empty.style.display = "none";
  if (summary) summary.style.display = "block";

  cart.forEach((entry, index) => {
    list.appendChild(createBasketItem(entry, index));
  });
}

function renderCartMobile() {
  const list = document.getElementById("basketItemsMobile");
  const empty = document.getElementById("basketEmptyMobile");
  const summary = document.getElementById("basketSummaryMobile");
  if (!list) return;

  list.innerHTML = "";

  if (cart.length === 0) {
    if (empty) empty.style.display = "flex";
    if (summary) summary.style.display = "none";
    return;
  }

  if (empty) empty.style.display = "none";
  if (summary) summary.style.display = "block";

  cart.forEach((entry, index) => {
    list.appendChild(createBasketItem(entry, index));
  });
}

function setDesktopTotals(subtotal) {
  const delivery = subtotal === 0 ? 0 : DELIVERY_COST;
  document.getElementById("subTotal").innerHTML = formatCurrency(subtotal);
  document.getElementById("delivery").innerHTML = formatCurrency(delivery);
  document.getElementById("grandTotal").innerHTML = formatCurrency(subtotal + delivery);
}

function setMobileTotals(subtotal) {
  const delivery = subtotal === 0 ? 0 : DELIVERY_COST;
  const total = subtotal + delivery;

  document.getElementById("subTotalM").innerHTML = formatCurrency(subtotal);
  document.getElementById("deliveryM").innerHTML = formatCurrency(delivery);
  document.getElementById("grandTotalM").innerHTML = formatCurrency(total);
  document.getElementById("miniTotal").innerHTML = formatCurrency(total);
}

function formatCurrency(value) {
  return value.toFixed(2).replace(".", ",") + " €";
}

function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  setDesktopTotals(subtotal);
  setMobileTotals(subtotal);
}

function updateOrderMessage() {
  const msg = document.getElementById("orderMsg");
  if (!msg) return;

  msg.innerHTML = cart.length === 0
    ? "Wähle leckere Gerichte und bestelle dein Menü."
    : "";
}

function initTabs() {
  const buttons = document.querySelectorAll(".pn-tab-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenu(btn.dataset.category);
    });
  });
}

function initBasketDialog() {
  const toggle = document.getElementById("basketToggle");
  const dialog = document.getElementById("basketDialog");
  const close = document.getElementById("closeDialog");

  if (!toggle || !dialog) return;

  toggle.addEventListener("click", () => {
    dialog.removeAttribute("hidden");
    toggle.setAttribute("aria-expanded", "true");
  });

  if (close) {
    close.addEventListener("click", () => {
      dialog.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", "false");
    });
  }
}

function initCheckout() {
  const desktopBtn = document.getElementById("checkoutBtn");
  const mobileBtn = document.getElementById("checkoutBtnM");

  if (desktopBtn) {
    desktopBtn.addEventListener("click", handleCheckout);
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      handleCheckout();
      const dialog = document.getElementById("basketDialog");
      const toggle = document.getElementById("basketToggle");
      if (dialog) dialog.setAttribute("hidden", "");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }
}

function handleCheckout() {
  const msg = document.getElementById("orderMsg");
  if (!msg) return;

  if (cart.length === 0) {
    msg.innerHTML = "Bitte füge zuerst Artikel zum Warenkorb hinzu.";
    return;
  }

  cart = [];
  updateCart();
  msg.innerHTML = "Danke! Deine Bestellung wurde aufgenommen.";
}

function initBurgerMenu() {
  const btn = document.querySelector(".pn-menu-toggle");
  const nav = document.getElementById("navMenu");
  const close = document.getElementById("closeMenu");
  if (!btn || !nav) return;

  function openMenu() {
    btn.setAttribute("aria-expanded", "true");
    nav.setAttribute("aria-hidden", "false");
    nav.classList.add("pn-open");
  }

  function closeMenuFn() {
    btn.setAttribute("aria-expanded", "false");
    nav.setAttribute("aria-hidden", "true");
    nav.classList.remove("pn-open");
  }

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    open ? closeMenuFn() : openMenu();
  });

  if (close) {
    close.addEventListener("click", closeMenuFn);
  }

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenuFn);
  });
}

function updateScrollIndicator() {
  const bar = document.getElementById("scrollIndicatorBar");
  if (!bar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

  const barHeight = 500;
  bar.style.height = barHeight + "px";
  bar.style.top = scrollPercent * (window.innerHeight - barHeight) + "px";
}
// quell scrollIndictor 
 //https://www.w3schools.com/howto/howto_js_scroll_indicator.asp