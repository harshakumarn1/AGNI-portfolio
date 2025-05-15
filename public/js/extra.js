
function createPopup(id) {

   let popupNode = document.querySelector(id)
   const closebtn = document.querySelector(".close-btn")
   
   function openPopup() {
    popupNode.classList.add("active");
   }

   function closePopup() {
    popupNode.classList.remove("active")
   }
   closebtn.addEventListener("click", closePopup)
   return openPopup;
}

const openPopup = document.querySelector('#open-popup')
openPopup.addEventListener("click",createPopup("#popup"))


let swiper = new Swiper(".mySwiper", {
   cssMode: true,
   navigation: {
     nextEl: ".swiper-button-next",
     prevEl: ".swiper-button-prev",
   },
   pagination: {
     el: ".swiper-pagination",
   },
   mousewheel: true,
   keyboard: true,
 });

  let form = document.querySelector("#contactus-form")
  form.addEventListener("submit",(event) => {
   event.preventDefault();
   emailjs.sendForm(
    serviceId,
    templateId,
    "#contactus-form",
   ).then(
    (response) => {
     console.log("Email Sent");
    form.elements[0].value = "";
    form.elements[1].value = "";
    form.elements[2].value = "";
   },
    (error) => {
      console.log('Failed to send email', error)
   })
 })
