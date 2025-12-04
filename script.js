let shoppingCart = [];
let deliveryFee = 2.5;

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  updateShoppingCart();
  initializeTabs();
  initializeMenuClick();
  initializeCartClick();
  initializeCheckout();
  initializeCartDialog();
  initializeScrollIndicator();
  initializeBurgerMenu();
});

function renderMenu(filterCategory) {
  let menuContainer = document.getElementById("menu");
  if (!menuContainer) return;
  let htmlContent = "";
  for (let i = 0; i < menu.length; i++) {
    let categoryItem = menu[i];
    if (filterCategory && categoryItem.category !== filterCategory) continue;
    htmlContent += categorySectionTpl(categoryItem);
  }
  menuContainer.innerHTML = htmlContent;
}

function initializeMenuClick() {
  let menuContainer = document.getElementById("menu");
  if (!menuContainer) return;
  menuContainer.addEventListener("click", (event) => {
    let addButton = event.target.closest(".pn-add-btn");
    if (!addButton) return;
    let selectedDish = findDishByName(addButton.dataset.add);
    if (selectedDish) addItemToCart(selectedDish);
  });
}
function findDishByName(dishName) {
  for (let categoryIndex = 0; categoryIndex < menu.length; categoryIndex++) {
    let category = menu[categoryIndex];
    for (let itemIndex = 0; itemIndex < category.items.length; itemIndex++) {
      let dish = category.items[itemIndex];
      if (dish.name === dishName) return dish;
    }
  }
}

function addItemToCart(dish) {
  for (let cartIndex = 0; cartIndex < shoppingCart.length; cartIndex++) {
    let cartItem = shoppingCart[cartIndex];
    if (cartItem.name === dish.name) {
      cartItem.quantity++;
      updateShoppingCart();
      return;
    }
  }
  shoppingCart.push({ name: dish.name, price: dish.price, quantity: 1 });
  updateShoppingCart();
}


function updateShoppingCart() {
  renderCart("basketItems", "basketEmptyDesktop", "basketSummaryDesk");
  renderCart("basketItemsMobile", "basketEmptyMobile", "basketSummaryMobile");
  updateTotals();
}

function renderCart(listId, emptyId, summaryId) {
  let list = document.getElementById(listId);
  let empty = document.getElementById(emptyId);
  let summary = document.getElementById(summaryId);
  if (!list) return;
  list.innerHTML = "";
  if (shoppingCart.length === 0) {
    if (empty) empty.style.display = "flex";
    if (summary) summary.style.display = "none";
    return;
  }
  if (empty) empty.style.display = "none";
  if (summary) summary.style.display = "block";
  for (let i = 0; i < shoppingCart.length; i++) {
    list.innerHTML += basketRowTpl(shoppingCart[i]);
  }
}

function initializeCartClick() {
  let desktopCart = document.getElementById("basketItems");
  let mobileCart = document.getElementById("basketItemsMobile");
  if (desktopCart) desktopCart.addEventListener("click", handleQuantityChange);
  if (mobileCart) mobileCart.addEventListener("click", handleQuantityChange);
}

function handleQuantityChange(event) {
  let btn = event.target.closest(".qty-btn");
  if (!btn) return;
  let row = btn.closest(".basket-item");
  if (!row) return;
  let nameEl = row.querySelector(".basket-item-name");
  if (!nameEl) return;
  let item = shoppingCart.find(i => i.name === nameEl.textContent);
  if (!item) return;
  if (btn.classList.contains("qty-plus")) item.quantity++;
  if (btn.classList.contains("qty-minus")) item.quantity--;
  if (btn.classList.contains("qty-delete")) item.quantity = 0;
  shoppingCart = shoppingCart.filter(i => i.quantity > 0);
  updateShoppingCart();
}

function updateTotals() {
  let subtotal = 0;
  for (let i = 0; i < shoppingCart.length; i++) subtotal += shoppingCart[i].price * shoppingCart[i].quantity;
  let deliveryCost = subtotal === 0 ? 0 : deliveryFee;
  let totalAmount = subtotal + deliveryCost;
  setText("subTotal", subtotal);
  setText("delivery", deliveryCost);
  setText("grandTotal", totalAmount);
  setText("subTotalM", subtotal);
  setText("deliveryM", deliveryCost);
  setText("grandTotalM", totalAmount);
  setText("miniTotal", totalAmount);
}

function setText(id, value) {
  let el = document.getElementById(id);
  if (el) el.innerHTML = value.toFixed(2).replace(".", ",") + " €";
}

function initializeTabs() {
  let tabs = document.querySelectorAll(".pn-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderMenu(tab.dataset.category);
    });
  });
}

function initializeCheckout() {
  let desktopBtn = document.getElementById("checkoutBtn");
  let mobileBtn = document.getElementById("checkoutBtnM");
  if (desktopBtn) desktopBtn.addEventListener("click", () => checkout(false));
  if (mobileBtn) mobileBtn.addEventListener("click", () => checkout(true));
}

function checkout(isMobile) {
  if (shoppingCart.length === 0) {
    alert("Bitte füge zuerst Artikel zum Warenkorb hinzu.");
    return;
  }
  shoppingCart = [];
  updateShoppingCart();
  showTemporaryOrderMessage("🎉 Deine Bestellung wurde aufgenommen und ist auf dem Weg!", 3500);
  if (isMobile) {
    let dialog = document.getElementById("basketDialog");
    if (dialog) dialog.hidden = false;
  }
}

function showTemporaryOrderMessage(text, duration) {
  let emptyDesktop = document.getElementById("basketEmptyDesktop");
  let emptyMobile = document.getElementById("basketEmptyMobile");
  if (emptyDesktop) {
    emptyDesktop.querySelector("p").textContent = text;
    emptyDesktop.style.display = "flex";
    let btn = emptyDesktop.querySelector("button");
    if (btn) btn.disabled = true;
  }
  if (emptyMobile) {
    emptyMobile.querySelector("p").textContent = text;
    emptyMobile.style.display = "flex";
    let btn = emptyMobile.querySelector("button");
    if (btn) btn.disabled = true;
  }
  setTimeout(() => {
    if (emptyDesktop) {
      emptyDesktop.querySelector("p").textContent = "Wähle leckere Gerichte und bestelle dein Menü.";
      let btn = emptyDesktop.querySelector("button");
      if (btn) btn.disabled = false;
    }
    if (emptyMobile) {
      emptyMobile.querySelector("p").textContent = "Wähle leckere Gerichte und bestelle dein Menü.";
      let btn = emptyMobile.querySelector("button");
      if (btn) btn.disabled = false;
    }
  }, duration);
}

function initializeCartDialog() {
  let toggle = document.getElementById("basketToggle");
  let dialog = document.getElementById("basketDialog");
  let closeBtn = document.getElementById("closeDialog");
  if (!toggle || !dialog) return;
  toggle.addEventListener("click", () => dialog.hidden = false);
  if (closeBtn) closeBtn.addEventListener("click", () => dialog.hidden = true);
}

function initializeBurgerMenu() {
  let menuButton = document.querySelector(".pn-menu-toggle");
  let navigationMenu = document.getElementById("navMenu");
  let closeMenuBtn = document.getElementById("closeMenu");
  if (!menuButton || !navigationMenu || !closeMenuBtn) return;
  menuButton.addEventListener("click", () => {
    if (navigationMenu.classList.contains("pn-open")) navigationMenu.classList.remove("pn-open");
    else navigationMenu.classList.add("pn-open");
  });
  closeMenuBtn.addEventListener("click", () => navigationMenu.classList.remove("pn-open"));
  document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => navigationMenu.classList.remove("pn-open"));
  });
}


function initializeScrollIndicator() {
  let bar = document.getElementById("scrollIndicatorBar");
  if (!bar) return;
  function update() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    let barHeight = 500;
    bar.style.height = barHeight + "px";
    bar.style.top = scrollPercent * (window.innerHeight - barHeight) + "px";
  }
  document.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();
}