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
    let category = menu[i];
    if (filterCategory && category.category !== filterCategory) continue;
    htmlContent += categorySectionTpl(category);
  }
  menuContainer.innerHTML = htmlContent;
}

function initializeMenuClick() {
  let menuContainer = document.getElementById("menu");
  if (!menuContainer) return;
  menuContainer.addEventListener("click", event => {
    let btn = event.target.closest(".pn-add-btn");
    if (!btn) return;
    let dish = findDishByName(btn.dataset.add);
    if (dish) addItemToCart(dish);
  });
}

function findDishByName(name) {
  for (let category = 0; category < menu.length; category++) {
    for (let i = 0; i < menu[category].items.length; i++) {
      if (menu[category].items[i].name === name) return menu[category].items[i];
    }
  }
}

function addItemToCart(dish) {
  for (let i = 0; i < shoppingCart.length; i++) {
    if (shoppingCart[i].name === dish.name) {
      shoppingCart[i].quantity++;
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
    if (empty) empty.classList.remove("hidden");
    if (summary) summary.classList.add("hidden");
    return;
  }
  if (empty) empty.classList.add("hidden");
  if (summary) summary.classList.remove("hidden");
  for (let i = 0; i < shoppingCart.length; i++) {
    list.innerHTML += basketRowTpl(shoppingCart[i]);
  }
}

function initializeCartClick() {
  let desktop = document.getElementById("basketItems");
  let mobile = document.getElementById("basketItemsMobile");
  if (desktop) desktop.addEventListener("click", handleQuantityChange);
  if (mobile) mobile.addEventListener("click", handleQuantityChange);
}

function handleQuantityChange(event) {
  let btn = event.target.closest(".qty-btn");
  if (!btn) return;
  let row = btn.closest(".basket-item");
  if (!row) return;
  let nameEl = row.querySelector(".basket-item-name");
  if (!nameEl) return;
  let name = nameEl.textContent;
  let item = shoppingCart.find(i => i.name === name);
  if (!item) return;
  if (btn.classList.contains("qty-plus")) item.quantity++;
  if (btn.classList.contains("qty-minus")) item.quantity--;
  if (btn.classList.contains("qty-delete")) item.quantity = 0;
  shoppingCart = shoppingCart.filter(i => i.quantity > 0);
  updateShoppingCart();
}

function updateTotals() {
  let subtotal = 0;
  for (let i = 0; i < shoppingCart.length; i++) {
    subtotal += shoppingCart[i].price * shoppingCart[i].quantity;
  }

  let delivery = subtotal === 0 ? 0 : deliveryFee;
  let total = subtotal + delivery;

  document.getElementById("subTotal").innerHTML = subtotal.toFixed(2).replace(".", ",") + " €";
  document.getElementById("subTotalM").innerHTML = subtotal.toFixed(2).replace(".", ",") + " €";

  document.getElementById("delivery").innerHTML = delivery.toFixed(2).replace(".", ",") + " €";
  document.getElementById("deliveryM").innerHTML = delivery.toFixed(2).replace(".", ",") + " €";

  document.getElementById("grandTotal").innerHTML = total.toFixed(2).replace(".", ",") + " €";
  document.getElementById("grandTotalM").innerHTML = total.toFixed(2).replace(".", ",") + " €";
  document.getElementById("miniTotal").innerHTML = total.toFixed(2).replace(".", ",") + " €";
}

function setText(id, value) {
  let basket = document.getElementById(id);
  if (!basket) return;
  element.innerHTML = value.toFixed(2).replace(".", ",") + " €";
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
  let desktop = document.getElementById("checkoutBtn");
  let mobile = document.getElementById("checkoutBtnM");
  if (desktop) desktop.addEventListener("click", () => checkout(false));
  if (mobile) mobile.addEventListener("click", () => checkout(true));
}

function checkout(isMobile) {
  if (shoppingCart.length === 0) {
    ["basketEmptyDesktop","basketEmptyMobile"].forEach(id => {
      let base = document.getElementById(id);
      if (!base) return;
      let message = base.querySelector(".basket-message");
      if (message) message.textContent = "Füge zuerst dein Menü hinzu.";
    });
    return;
  }
  shoppingCart = [];
  updateShoppingCart();
  showTemporaryOrderMessage("🎉 Deine Bestellung wurde aufgenommen und ist unterwegs!", 3500);
  if (isMobile) {
    let dialog = document.getElementById("basketDialog");
    if (dialog && dialog.showModal) dialog.showModal();
  }
}

function showTemporaryOrderMessage(text, duration) {
  let targets = ["basketEmptyDesktop", "basketEmptyMobile"];
  targets.forEach(id => {
    let base = document.getElementById(id);
    if (!base) return;
    let message = base.querySelector(".basket-message");
    let btn = base.querySelector("button");
    if (message) message.textContent = text;
    if (btn) btn.disabled = true;
  });
  setTimeout(() => restoreBasketMessage(targets), duration);
}

function restoreBasketMessage(targets) {
  targets.forEach(id => {
    let base = document.getElementById(id);
    if (!base) return;
    let message = base.querySelector(".basket-message");
    let btn = base.querySelector("button");
    if (message) message.textContent = "Füge zuerst dein Menü hinzu.";
    if (btn) btn.disabled = false;
  });
}

function initializeCartDialog() {
  let toggle = document.getElementById("basketToggle");
  let dialog = document.getElementById("basketDialog");
  let close = document.getElementById("closeDialog");
  if (!toggle || !dialog) return;
  if (dialog.showModal) {
    toggle.addEventListener("click", () => dialog.showModal());
    if (close) close.addEventListener("click", () => dialog.close());
  } else {
    toggle.addEventListener("click", () => dialog.removeAttribute("hidden"));
    if (close) close.addEventListener("click", () => dialog.setAttribute("hidden", ""));
  }
}

function initializeBurgerMenu() {
  let btn = document.querySelector(".pn-menu-toggle");
  let nav = document.getElementById("navMenu");
  let close = document.getElementById("closeMenu");
  if (!btn || !nav || !close) return;
  btn.addEventListener("click", () => nav.classList.toggle("pn-open"));
  close.addEventListener("click", () => nav.classList.remove("pn-open"));
  document.querySelectorAll("#navMenu a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("pn-open"));
  });
}

function initializeScrollIndicator() {
  let bar = document.getElementById("scrollIndicatorBar");
  if (!bar) return;

  function update() {
    let scrollPosition = document.documentElement.scrollTop;
    let totalScrollableHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    document.documentElement.style.setProperty("--scroll",
      totalScrollableHeight > 0 ? scrollPosition / totalScrollableHeight : 0
    );
  }

  window.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  update();
}