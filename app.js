import {productsData} from "./products.js";


const backDrop = document.querySelector(".backdrop")
const modal = document.querySelector(".cart-modal-container")
const cartBtn = document.querySelector(".navbar-cart-btn")
const productsDom = document.querySelector(".products")
const cartProductsContainer = document.querySelector(".cart-products")
const cartCounterDom = document.querySelector(".cart-counter")
const cartTotalPrice = document.querySelector(".cart-total-price")
const cartClearBtn = document.querySelector(".cart-clear-btn")
const modalCloseBtn = document.querySelector(".cart-submit-btn")

// this functions handles showing the modals
cartBtn.addEventListener("click", showModal)

modalCloseBtn.addEventListener("click" , showModal)

// clear the cart
cartClearBtn.addEventListener("click", () => {
    const ui = new Ui()
    const products = new Products()
    Storage.clearCart()
    ui.displayCartProductsCount()
    Storage.calculateCartTotalPrice()
    showModal()
    ui.displayProducts(products.getProducts())
    ui.getAddToCartBtns()
})

function showModal() {
    modal.classList.toggle("show-modal")
    backDrop.classList.toggle("show-modal")
    if (backDrop.classList.contains("show-modal")) {
        document.body.style = `overflow : hidden `
    }else {
        document.body.style =`overflow : auto`
    }
    let cartProducts = Storage.getCartProducts()
    let ui = new Ui()
    Storage.calculateCartTotalPrice()
    ui.displayCartProducts(cartProducts)

}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Products()
    const productsData = products.getProducts()
    const ui = new Ui
    ui.displayProducts(productsData)
    ui.getAddToCartBtns()
    ui.displayCartProductsCount()
    Storage.saveProducts(productsData)
    Storage.calculateCartTotalPrice()
})

//define the Products class
class Products {
    getProducts() {
        return productsData
    }
}

// define a class for ui actions
class Ui {
    displayProducts(productsData) {
        let result = productsData.map(product => {
            return `<div class="product">
                        <div class="product-image-container">
                            <img src=${product.imgUrl} alt=${product.title}>
                        </div>
                        <div class="product-details">
                            <div class="product-description">
                                <p class="price">${product.price}$</p>
                                <p class="name">${product.title}</p>
                            </div>
                            <div class="product-Addition">
                                <button class="product-btn" data-id=${product.id}>Add To cart</button>
                            </div>
                        </div>
                    </div>`
        })

        productsDom.innerHTML = result
    }

    getAddToCartBtns() {
        let addToCartBtns = document.querySelectorAll(".product-btn")
        const buttons = [...addToCartBtns]
        buttons.forEach(btn => {
            const isInCart = Storage.checkInCart(Number(btn.dataset.id))
            if (isInCart) {
                btn.innerText = "in cart"
                btn.disabled = true
            }
            btn.addEventListener("click", (event) => {
                let ui = new Ui()
                let product = new Products()
                btn.innerText = "in cart"
                let savedProducts = product.getProducts()
                let productToAddToCart = savedProducts.find(p => p.id === Number(event.target.dataset.id))
                Storage.saveCartToLS(productToAddToCart)
                ui.displayCartProductsCount()
            })
        })
    }

    displayCartProducts() {
        const ui = new Ui()
        const products = Storage.getCartProducts()
        let result = products.map((product) => {
            return `<div class="cart-product">
                        <div class="cart-product-image">
                            <img src=${product.imgUrl} alt="bed">
                        </div>
                        <div class="cart-product-descriptions">
                            <p class="cart-product-title">${product.title}</p>
                            <p class="cart-product-price">${product.price}</p>
                        </div>
                        <div class="cart-product-actions">
                            <div class="cart-inc-dec">
                                <button class="increase-product-count product-count-btn" data-id=${product.id}>
                                    <i class="fa fa-chevron-up"></i>
                                </button>
                                <p class="cart-items-number">${product.count}</p>
                                <button class="decrease-product-count product-count-btn" data-id=${product.id}>
                                    <i class="fa fa-chevron-down"></i>
                                </button>
                            </div>
                            <div class="cart-delete">
                                <button class="cart-delete-btn product-count-btn" data-id=${product.id}>
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>`
        })
        cartProductsContainer.innerHTML = result
        ui.getIncreaseCartProductBtns()
        ui.getDecreaseCartProductBtns()
        ui.getDeleteCartProductBtn()
    }

    getIncreaseCartProductBtns() {
        let increaseBtns = document.querySelectorAll(".increase-product-count")
        const buttons = [...increaseBtns]
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                Storage.controlCartProductsCount({id: Number(e.target.dataset.id), action: "increase"})
            })
        })

    }

    getDecreaseCartProductBtns() {
        let decreaseBtns = document.querySelectorAll(".decrease-product-count")
        const buttons = [...decreaseBtns]
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                Storage.controlCartProductsCount({id: Number(e.target.dataset.id), action: "decrease"})
            })
        })

    }

    getDeleteCartProductBtn() {
        let deleteBtns = document.querySelectorAll(".cart-delete-btn")
        let buttons = [...deleteBtns]
        buttons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                Storage.deleteProductFromCart(e.target.dataset.id)
            })
        })
    }

    displayCartProductsCount() {
        let cartProducts = Storage.getCartProducts()
        cartCounterDom.innerText = cartProducts.length
    }
}

// a class for saving and data storage actions
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
        let savedProducts = JSON.parse(localStorage.getItem("products"))
    }

    static saveCartToLS(product) {
        let savedCart = JSON.parse(localStorage.getItem("cartProducts")) ?? []
        savedCart.push(product)
        localStorage.setItem("cartProducts", JSON.stringify(savedCart))
    }

    static saveProductsToCart(products) {
        localStorage.setItem("cartProducts", JSON.stringify(products))
    }

    static checkInCart(id) {
        const savedCartProductsInLS = JSON.parse(localStorage.getItem("cartProducts")) ?? []
        return savedCartProductsInLS.find(p => p.id === id)
    }

    static getCartProducts() {
        let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) ?? []
        return cartProducts
    }

    static controlCartProductsCount({id, action}) {
        const cartProducts = this.getCartProducts()
        let editedCountProducts = cartProducts.map(product => {
            if (product.id === id) {
                product.count > 0 && action === "decrease" ? product.count -= 1 : product.count += 1
                return product
            }
            return product
        })
        this.saveProductsToCart(editedCountProducts)
        const ui = new Ui()
        this.calculateCartTotalPrice()
        ui.displayCartProducts()
    }

    static calculateCartTotalPrice() {
        const cartProducts = this.getCartProducts();
        let totalPrice = cartProducts.reduce((acc, cv) => {
            return acc + (Number(cv.price) * Number(cv.count));
        }, 0);
        cartTotalPrice.innerText = `${totalPrice.toFixed(2)} $`;
        return totalPrice;
    }

    static clearCart() {
        let empty = []
        localStorage.setItem("cartProducts", JSON.stringify(empty))
        const ui = new Ui()
        ui.displayCartProducts()
    }

    static deleteProductFromCart(id) {
        id = Number(id)
        const ui = new Ui()
        const products = new Products()
        const savedProductsInCart = JSON.parse(localStorage.getItem("cartProducts"))
        const filteredProducts = savedProductsInCart.filter(product => product.id !== id)
        this.saveProductsToCart(filteredProducts)
        this.calculateCartTotalPrice()
        ui.displayProducts(products.getProducts())
        ui.getAddToCartBtns()
        ui.displayCartProductsCount()
        ui.displayCartProducts()
    }
}

