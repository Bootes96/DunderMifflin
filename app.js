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
        cart = [...cart, cartItem]   
        console.log(cart)
    }
}

//Local Storage
class Storage {

} 

document.addEventListener('DOMContentLoaded', () => {
    const products = new Products()
    const ui = new UI()

    products.getProducts().then(products => {
        ui.displayProducts(products)
    }).then(() => {
        ui.getBagButtons()
    })
})