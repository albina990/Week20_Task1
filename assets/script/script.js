/*
Запрос должен уходить на сервер при нажатии на кнопку (нужно добавить обработчик). В разметке HTML должно быть минимум два поля: в первое нужно выводить результат поиска, если данные пришли и всё хорошо, во втором — ошибку, если что-то пошло не так. (Добейтесь, чтобы ваше приложение выводило понятные пользователю сообщения в случае ошибки, например «Сервер не доступен»). Сообщения должны быть видны поочередно, если результат показан, ошибка должна быть сброшена. И наоборот. Обязательно добавьте обработчик ответа: если ответ успешный, следующий обработчик then получит объект ответа на вход, если с ответом что-то не так, отклоните промис (для этого верните Promise.reject с кодом статуса ответа). Блок catch и finally использовать обязательно.
*/

const select = document.querySelector(".select") //выпадающий список
const button = document.querySelector("button") // кнопка "найти"
const selectedTitle = select.querySelector(".select__title") //заголовок выпадающего списка
const selectLabels = select.querySelectorAll(".select__label") // опции выпадающего списка
const inputIndex = document.getElementById("index") // инпут для ввода номера
const inputsRessource = document.querySelectorAll('input[name = "singleSelect"]') //инпуты опций выпадающнго списка
const preloader = document.querySelector(".preloader") //прелоадер
const resolveOutput = document.querySelector(".output__resolve") //див, в который выводится результат при успешном выполнении
const rejectOutput = document.querySelector(".output__reject")//див, в который выводится ошибка

// Функционал выпадающего списка
// Разворачиват список при клике, если он неактивен и сворачивает, если был активен
selectedTitle.addEventListener("click", () => {
    if ("active" === select.getAttribute("active")) {
        select.removeAttribute("active")
    } else {
        select.setAttribute("active", "active")
    }
})
// активирует опцию и сворачивает список
for (let i = 0; i < selectLabels.length; i++) {
    selectLabels[i].addEventListener("click", (evt) => {
        selectedTitle.textContent = evt.target.textContent
        select.removeAttribute("active")
    })
}

function getInfo(evt) { // функция, которая выполняет запрос к api и выводит результат на странице
    evt.preventDefault()
    preloader.hidden = false 
    for (const ressource of inputsRessource) {
        if (ressource.checked == true) {
            const valueRessource = ressource.value
            const valueIndex = Number(inputIndex.value)
                fetch(`https://swapi.dev/api/${valueRessource}/${valueIndex}/`)
                    .then((response) => response.json())
                    .then((json) => {
                            resolveOutput.hidden = false;
                            resolveOutput.innerHTML = `${json.name}`;
                            preloader.hidden = true
                    }).
                    catch(err => console.log("Неверный номер " + err))
        }
    }
}

button.addEventListener("click", getInfo)
