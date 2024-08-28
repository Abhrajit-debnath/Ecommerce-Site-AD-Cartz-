let search = document.querySelector('.search-icon');
let search_box = document.querySelector('.search-box');
let list = document.querySelector('.product-list');
let counterdiv = document.querySelector('.counter');
let banner = document.querySelector('.banner');
let sidebar = document.querySelector('.sidebar');
let cart = document.querySelector('.product-cart');
let cart_icon = document.querySelector('.cart');
let amountTag = document.querySelector('.amount-tag');
let counter = 0;
const conversionRate = 83;
let products = [];

// Toggle search box
search.addEventListener('click', () => {
  search.style.display = 'none';
  search_box.style.display = 'block';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    search.style.display = 'block';
    search_box.style.display = 'none';
  }
});

// Fetch products and render them
const url = 'https://fakestoreapi.com/products/';
async function fetchproducts() {
  try {
    const response = await fetch(url);
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.log('error occured ');
  }
}

fetchproducts();

// Function to display products
function displayProducts(products) {
  list.innerHTML = products.map((product) => {
    const amountInUSD = product.price;
    const formattedPrice = (amountInUSD * conversionRate).toFixed(0);

    return `
      <div class="product">
        <span class="material-symbols-outlined cart-add">
          add_shopping_cart
        </span>
        <div class="img">
          <img src="${product.image}" alt="${product.id}" />
        </div>
        <h3>${product.title}</h3>
        <p>Rs ${formattedPrice}</p>
      </div>
    `;
  });

  addCartListeners();
}
/// Adding cart Functionality
function addCartListeners() {
  const cartAddButtons = document.querySelectorAll('.cart-add');
  cartAddButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      let product = e.target.closest('.product');
      let productCopy = product.cloneNode(true);
      let cartAddButtonInCopy = productCopy.querySelector('.cart-add');
      let titleElement = productCopy.querySelector('h3');
      let title = titleElement.innerHTML;
      const maxLength = 30;

      // Display the total amount

      if (title.length > maxLength) {
        title = title.substring(0, maxLength) + '...';
        titleElement.innerHTML = title;
      }

      if (cartAddButtonInCopy) {
        cartAddButtonInCopy.remove();
      }
      cart.append(productCopy);

      counterdiv.style.display = 'block';
      counter++;
      counterdiv.innerHTML = `${counter}`;

      updateTotalAmount();
    });
  });
}

function updateTotalAmount() {
  let allProductsInCart = cart.querySelectorAll('.product');
  let totalAmount = 0;
  allProductsInCart.forEach((product) => {
    let priceText = product.querySelector('p').innerHTML;
    let price = parseFloat(priceText.replace('Rs ', '').replace(/,/g, ''));
    totalAmount += price;
  });

  amountTag.textContent = `Total: Rs ${totalAmount.toFixed(0)}`;
}
// Search functionality
search_box.addEventListener('input', (e) => {
  const searchText = e.target.value.toLowerCase();
  if (searchText === '') {
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchText)
  );
  if (filteredProducts.length > 0) {
    displayProducts(filteredProducts);
  } else {
    list.innerHTML = '<p class="error-msg">No products found.</p>';
  }
});
document.addEventListener('DOMContentLoaded', () => {
  cart_icon.addEventListener('click', () => {
    if (sidebar.style.display === 'none' || sidebar.style.display === '') {
      sidebar.style.display = 'block';
    } else {
      sidebar.style.display = 'none';
    }

    const emptyMessage = cart.querySelector('.empty-cart-msg');
    if (cart.querySelector('.product') == null) {
      if (!emptyMessage) {
        const emptyMessage = document.createElement('h2');
        emptyMessage.innerText = 'Your cart is empty';
        emptyMessage.classList.add('empty-cart-msg');
        cart.appendChild(emptyMessage);
      }
    } else {
      if (emptyMessage) {
        emptyMessage.remove();
      }
    }
  });
});
