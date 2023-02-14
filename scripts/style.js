const selections = document.querySelectorAll('.labelInfo');
var activeItem = document.querySelector(".active");
const selection__Box = document.querySelector('.selection__box');
const info = document.querySelector(".info");
const cards = document.querySelectorAll('.cards');



function onClick(item, index) {
    if (activeItem == item) return;

    selections.forEach((element, number) => {
        element.classList.remove('active');
    })

    const value = item.getElementsByTagName('input').info.value;

    const box = document.querySelector("." + value);
    cards.forEach((element, index_) => {
        if(element.classList.contains('flex')) {
            element.classList.remove('flex');
        }
    });
    box.classList.add('flex');

    activeItem.classList.add('active')
    activeItem = item;
    offsetMenuBorder(activeItem, selection__Box);
}

selections.forEach((selection, index) => {
    selection.addEventListener('click', (e) => onClick(e.currentTarget, index))
})


function offsetMenuBorder(element, menuBorder) {
    const left = Math.floor(element.offsetLeft - info.offsetLeft - (selection__Box.offsetWidth - element.offsetWidth) / 2) + "px";
    selection__Box.style.transform = `translate3d(${left}, 0 , 0)`;
}


window.addEventListener("resize", () => {
    offsetMenuBorder(activeItem, menuBorder);
});