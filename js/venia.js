// API
const url = "https://fakestoreapi.com/products";

const productList = document.querySelector(".products-container");
const productCount = document.querySelector(".product-count");
const searchControl = document.querySelector(".search-control");
const categoryList = document.querySelector(".category-list");
const loader = document.querySelector(".loader");
const priceFilter = document.querySelector(".price-filter");
const priceValue = document.querySelector(".price-value");
const loadMoreBtn = document.querySelector(".load-more-btn");

// store all products
let allProducts = [];
let currentProducts = [];
let currentIndex = 0;
const productsPerPage = 5;

const fetchProducts = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    allProducts = await res.json();
    console.log(allProducts);

    const maxPrice = Math.max(...allProducts.map((product) => product.price));
    priceFilter.max = maxPrice + 1;
    priceFilter.value = maxPrice + 1;

    updatePriceValue();

    displayCategories(allProducts);

    // displayProducts(allProducts.slice(0, productsPerPage));
    loadInitialProducts();
    currentIndex = productsPerPage;

    productCount.textContent = `${allProducts.length} products available`;

    if (currentIndex < allProducts.length) {
      loadMoreBtn.style.display = "block";
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const loadInitialProducts = () => {
  const initialProducts = allProducts.slice(0, productsPerPage);
  currentProducts = [...initialProducts]; // Store displayed products
  currentIndex = productsPerPage;
  displayProducts(currentProducts);
};

// fetch all products
const displayProducts = (products) => {
  if (products.length === 0) {
    productList.innerHTML =
      '<div class="emoji-sad"><div class="face"><div class="eyebrow-left"></div> <div class="eyebrow-right"></div><div class="eye-left"></div><div class="eye-right"></div><div class="mouth-sad"></div></div></div>';
    productCount.innerHTML = "0 products found";
    productCount.classList.remove("fill-basket");
    productCount.classList.add("empty-basket");
    return;
  }
  const items = products
    .map((product) => {
      const { id, image, title, price } = product;
      return `
            <div class="product" key="${id}">
                <img src="${image}" class="img-fluid product-img" alt="${title}">
                <div class="product-icons">
                    <a href="product.html?id=${id}" class="product-icon">
                        <i class="fas fa-search"></i>
                    </a>
                    <button class="product-cart-btn product-icon" data-id="${id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-title">${title}</div>
                    <div class="product-price">$${price}</div>
                </div>
            </div>
        `;
    })
    .join("");

  productList.innerHTML = items;
//   productCount.textContent = `${allProducts.length} products found`;
  productCount.classList.remove("empty-basket");
  productCount.classList.add("fill-basket");
};

loadMoreBtn.addEventListener("click", () => {
  loader.style.display = "block";

  setTimeout(() => {
    const nextProducts = allProducts.slice(
      currentIndex,
      currentIndex + productsPerPage
    );
    currentProducts = [...currentProducts, ...nextProducts];
    displayProducts(currentProducts);
    currentIndex += productsPerPage;

    if (currentIndex >= allProducts.length) {
      loadMoreBtn.style.display = "none";
    }

    loader.style.display = "none";
  }, 500);
});

// search product
searchControl.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  loader.style.display = "block";

  const filteredProducts = currentProducts.filter((product) => {
    return product.title.toLowerCase().includes(searchTerm);
  });

  console.log("Filtered Products:", filteredProducts);
  productList.innerHTML = "";
  displayProducts(filteredProducts);
  productCount.innerHTML = `${filteredProducts.length} products found.`
  loader.style.display = "none";
});

// display categories
const displayCategories = (products) => {
  console.log(products);
  const categories = [...new Set(products.map((product) => product.category))];
  categoryList.innerHTML = categories
    .map(
      (category) =>
        `<div class="category" data-category="${category}">${
          category.charAt(0).toUpperCase() + category.slice(1)
        }</div>`
    )
    .join("");

  //  filter products by category
  const categoryElements = document.querySelectorAll(".category");
  categoryElements.forEach((categoryElement) => {
    categoryElement.addEventListener("click", () => {
      const selectedCategory = categoryElement.dataset.category;
      const filteredProducts = allProducts.filter(
        (product) => product.category === selectedCategory
      );
      displayProducts(filteredProducts);
    });
  });
};

//price ranfe filter
const updatePriceValue = () => {
  priceValue.textContent = `$${priceFilter.value}`;
};
const filterByPrice = () => {
  const selectedPrice = parseFloat(priceFilter.value);

  loader.style.display = "block";

  const filteredProducts = currentProducts.filter((product) => {
    return product.price <= selectedPrice;
  });
  productList.innerHTML = "";
  displayProducts(filteredProducts);
    productCount.innerHTML = `${filteredProducts.length} products found.`
  loader.style.display = "none";
};

// Initial label update
updatePriceValue();
priceFilter.addEventListener("input", () => {
  updatePriceValue();
  filterByPrice();
});

document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();

  // console beautification
  console.log("%c VENIA", "color:#5c87ff; margin:auto; font-size:38px;");
  console.log(
    "%c Inspecting? we feel flattered :)",
    "color:orange; margin:auto; font-size:18px;"
  );
  console.log(
    "%c If you find any bug, please don't hesitate to contact us",
    "color:orange; margin:auto; font-size:15px;"
  );
  console.log(
    "%c Thank you for inspecting, enjoy the journey with us ❤️",
    "color:orange; margin:auto; font-size:15px;"
  );
  // console beautification
});
