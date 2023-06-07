/*
Запрос должен уходить на сервер при нажатии на кнопку (нужно добавить обработчик). В разметке HTML должно быть минимум два поля: в первое нужно выводить результат поиска, если данные пришли и всё хорошо, во втором — ошибку, если что-то пошло не так. (Добейтесь, чтобы ваше приложение выводило понятные пользователю сообщения в случае ошибки, например «Сервер не доступен»). Сообщения должны быть видны поочередно, если результат показан, ошибка должна быть сброшена. И наоборот. Обязательно добавьте обработчик ответа: если ответ успешный, следующий обработчик then получит объект ответа на вход, если с ответом что-то не так, отклоните промис (для этого верните Promise.reject с кодом статуса ответа). Блок catch и finally использовать обязательно.
*/
const select = document.querySelector(".select"); //выпадающий список
const button = document.querySelector("button"); // кнопка "найти"
const selectedTitle = select.querySelector(".select__title"); //заголовок выпадающего списка
const selectLabels = select.querySelectorAll(".select__label"); // опции выпадающего списка
const inputIndex = document.getElementById("index"); // инпут для ввода номера
const inputsResource = document.querySelectorAll('input[name = "singleSelect"]'); //инпуты опций выпадающнго списка
const preloader = document.querySelector(".preloader"); //кружок загрузки
const resolveOutput = document.querySelector(".output__resolve"); //див, в который выводится результат при успешном выполнении
const rejectOutput = document.querySelector(".output__reject"); //див, в который выводится ошибка
const finallyOutput = document.querySelector(".output__more"); //див, в который выводится блок finally

// Функционал выпадающего списка
// Разворачиват список при клике, если он неактивен и сворачивает, если был активен
selectedTitle.addEventListener("click", () => {
    if ("active" === select.getAttribute("active")) {
        select.removeAttribute("active");
    } else {
        select.setAttribute("active", "active");
    }
})
// активирует опцию и сворачивает список
for (let i = 0; i < selectLabels.length; i++) {
    selectLabels[i].addEventListener("click", (evt) => {
        selectedTitle.textContent = evt.target.textContent;
        select.removeAttribute("active");
    })
}

function getInfo(evt) { // функция, которая выполняет запрос к api и выводит результат на странице
    evt.preventDefault();
    preloader.hidden = false; // появление кружка загрузки
    for (const resource of inputsResource) {
        if (resource.checked == true) { // сбор значений выбранных инпутов
            const valueResource = resource.value;
            const valueIndex = parseInt(inputIndex.value);
            resolveOutput.hidden = true;
            rejectOutput.hidden = true;
            finallyOutput.hidden = true;
            let resStatus; // переменная для статуса ответа от сервера
            try {
                if (valueResource == "0") throw new Error("Invalid category"); //выброс ошибки при пустом поле category
                fetch(`https://swapi.dev/api/${valueResource}/${valueIndex}/`)
                    .then((response) => {
                        resStatus = response.status; // статуст ответа на GET запрос
                        return response.json();
                    })
                    .then((json) => {
                        if (json.detail == "Not found") { //выброс ошибки при вводе некорректного индекса
                            return Promise.reject(new Error("Error " + resStatus + ". Invalid number"));
                        }
                        resolveOutput.hidden = false; // активирует окно для отображения информации
                        switch(valueResource){ // формируется контент в зависимости от выбранных опций
                            case "people": 
                                resolveOutput.innerHTML = `<p>Name: ${json.name}</p>
                                <p>Birth year: ${json.birth_year}</p>
                                <p>Gender: ${json.gender}</p>
                                <p>Hair color: ${json.hair_color}</p>
                                <p>Skin color: ${json.skin_color}</p>`;
                                break;
                            case "films":
                                resolveOutput.innerHTML = `<p>Title: ${json.title}</p>
                                <p>Director: ${json.director}</p>
                                <p>Episode: ${json.episode_id}</p>
                                <p>Release date: ${json.release_date}</p>`;
                                break;
                            case "planets":
                                resolveOutput.innerHTML = `<p>Name: ${json.name}</p>
                                <p>Climate: ${json.climate}</p>
                                <p>Diameter: ${json.diameter}</p>
                                <p>Gravity: ${json.gravity}</p>`;
                                break;
                            case "vehicles":
                                resolveOutput.innerHTML = `<p>Name: ${json.name}</p>
                                <p>Model: ${json.model}</p>
                                <p>Max atmosphering speed: ${json.max_atmosphering_speed}</p>
                                <p>Vehicle class: ${json.vehicle_class}</p>`;
                                break;
                        }
                        preloader.hidden = true; // прячет кружок загрузки
                    })
                    .catch((err) => { //ловит ошибку некорректного индекса
                        rejectOutput.hidden = false; // активирует окно ошибок
                        rejectOutput.innerHTML = `${err.message}. Please try another number.`;
                        preloader.hidden = true;
                    })
            } catch (err) { //ловит ошибку некорректной категории
                rejectOutput.hidden = false;
                rejectOutput.innerHTML = `${err.message}. Please choose a category.`;
                preloader.hidden = true;
            } finally { // выполняется в любом случае
                finallyOutput.hidden = false;
                finallyOutput.innerHTML = `<a href="https://en.wikipedia.org/wiki/Star_Wars">Learn more</a>`;
            }
        }
    }
}

button.addEventListener("click", getInfo); // событие на кнопке "search"
