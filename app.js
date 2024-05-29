const backDrop = document.querySelector(".backdrop")
const modal = document.querySelector(".cart-modal-container")
const cartBtn = document.querySelector(".navbar-cart-btn")


// this functions handles showing the modals
cartBtn.addEventListener("click" ,showModal )

function showModal(){
        modal.classList.toggle("show-modal")
        backDrop.classList.toggle("show-modal")
        document.body.style = `overflow : hidden `
}