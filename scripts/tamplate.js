function menuItemTpl(item) {
  return `
    <article class="pn-menu-item">
      <div class="pn-menu-item-info">
        <h4>${item.name}</h4>
        <p>${item.description || ""}</p>
        <span class="pn-price">
          ${item.price.toFixed(2).replace(".", ",")} €
        </span>
      </div>
      <button class="pn-add-btn" type="button" data-add="${item.name}">
        +
      </button>
    </article>
  `;
}

function categorySectionTpl(category) {
  return `
    <section class="pn-category-section">

      ${
        category.category === "Hauptgerichte"
          ? `<img src="assets/img/pizza.jpg" alt="Hauptgericht" class="pn-category-image">`
          : ""
      }

      ${
        category.category === "Beilagen"
          ? `<img src="assets/img/beilage.jpg" alt="Beilage" class="pn-category-image">`
          : ""
      }

      ${
        category.category === "Getränke"
          ? `<img src="assets/img/getraenk.jpg" alt="Getränk" class="pn-category-image">`
          : ""
      }

      <h3 class="pn-category-title">${category.category}</h3>

      ${category.items.map(menuItemTpl).join("")}
    </section>
  `;
}

function basketRowTpl(entry) {
  return `
    <div class="basket-item">
      <span class="basket-item-name">${entry.name}</span>

      <div class="basket-item-qty-controls">
        <button class="qty-btn qty-minus">−</button>
        <span class="basket-item-qty">${entry.quantity}</span>
        <button class="qty-btn qty-plus">+</button>
      </div>

      <span class="basket-item-total">
        ${(entry.price * entry.quantity).toFixed(2).replace(".", ",")} €
      </span>

      <button class="qty-btn qty-delete">
        <img src="assets/img/delete-bin-line.svg" alt="Löschen">
      </button>
    </div>
  `;
}