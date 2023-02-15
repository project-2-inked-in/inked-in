changeNumber();
function changeNumber(){
    let elements= document.getElementsByClassName("grade");
    for (let i=0; i<elements.length; i++) {
        var element = elements[i];
        console.log("this is element",element)
        let length = parseInt(element.innerHTML)+1;
        let x=Array(length).join("*");
        element.innerHTML=x;
    }
}