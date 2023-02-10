const hamburger = document.querySelector(".ham");  
const ulNavSub = document.querySelector(".nav-sub");  
 hamburger.addEventListener('click', () => {  
   hamburger.classList.toggle("change");
   ulNavSub.classList.toggle("nav-subthis");
 });  
 