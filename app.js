//variables

const busket = document.querySelector('.busket')
const cartCloseBtn = document.querySelector('.cart__close')
const clearCartBtn = document.querySelector('.clear-btn')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart__items')
const cartTotal = document.querySelector('.cart__total')
const cartContent = document.querySelector('.cart__content')
const productsDOM = document.querySelector('.products__content')
const busketItems = document.querySelector('.busket__items')

let cart = []
//Buttons
let buttonsDOM = []

//getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json')
            let data = await result.json()
            return data
        } catch (error) {
            console.error(error)
        }
    }
}

class singleProduct {
    async getSingleProduct(id) {
        try {
            let products = await fetch('products.json')
            let data = await products.json()
            let product = data.find(item => item.id == id)
            return product  
        } catch (error) {
            console.log(error)
        }
    }
}

//display the products
class UI {
    displayProducts(products) {
        let result = ''
        products.forEach(item => {
            result += `
                <article class="product">
                    <div class="img-container">
                        <img src=${item.image} alt="product" class="product-img"/>
                        <button class="bag-btn" data-id=${item.id}>
                            <i class="fas fa-shopping-cart"></i>
                            add to bag
                        </button>
                    </div>
                    <h3>${item.title}</h3>
                    <h4>$${item.price}</h4>
                </article>
            `
        });
        productsDOM.innerHTML = result
    }
    getBagButtons() {
        const buttons = document.querySelectorAll('.bag-btn')
        buttonsDOM = buttons
        buttons.forEach(button => {
            let id = button.dataset.id
            let inCart = cart.find(item => item.id === id)
            if(inCart) {
                button.innerText = 'in Cart'
                button.disabled = true
            }
            button.addEventListener('click', (e) => {
                //disable the button after adding to the cart
                e.target.innerText = 'in Cart'
                e.target.disabled = true
                this.getProductById(id)
            })
        })
    }
    async getProductById(id) {
        const product = new singleProduct()
        const result = await product.getSingleProduct(id)
        const cartItem = {...result, amount: 1}
        //add product to the cart
        cart = [...cart, cartItem]
        //save the cart in local storage   
        Storage.saveCart(cart)
        //set cart values
        this.setCartValues(cart)
        //display cart item
        this.addCartItem(cartItem) 
        //show the cart after adding product
        this.showCart()
    }
    setCartValues(cart) {
        let tempTotal = 0
        let itemsTotal = 0
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        busketItems.innerHTML = itemsTotal
    }
    addCartItem(item) {
        const div = document.createElement('div')
        div.classList.add('cart__item')
        div.innerHTML = `
            <img src=${item.image} alt="product">
            <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="item__remove">remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item__amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `
        cartContent.appendChild(div)
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }
    setupApp() {
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populateCart(cart)
        busket.addEventListener('click', this.showCart)
        cartCloseBtn.addEventListener('click', this.hideCart)
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item))
    }
}

//Local Storage
class Storage {
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
} 

document.addEventListener('DOMContentLoaded', () => {
    const products = new Products()
    const ui = new UI()

    ui.setupApp()

    products.getProducts().then(products => {
        ui.displayProducts(products)
    }).then(() => {
        ui.getBagButtons()
    })
})