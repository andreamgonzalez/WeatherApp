/*SEARCH BY USING A CITY NAME (like "athens") OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (like "athens,gr")*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
//API Key used for this demo
const apiKey = "87b681fd969b03b652406fbc9d404971";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;

    //checks if there is already a city
    const listItems = list.querySelectorAll(".ajax-section .city");
    //creates new array from the one above
    const listItemsArray = Array.from(listItems);

    //if array has more than 0 objects create a new array
    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            //verifies if there is a comma in tyhe city search input
            if (inputVal.includes(",")) {
                //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                        .querySelector(".city-name span")
                        .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                //athens
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent
                } ...otherwise be more specific by providing the country code as well 😉`;
            form.reset();
            input.focus();
            return;
        }
    }

    //ajax
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]
                }.svg`;

            const li = document.createElement("li");
            li.classList.add("city");
            const markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
            <img class="city-icon" src="${icon}" alt="${weather[0]["description"]
                    }">
            <figcaption>${weather[0]["description"]}</figcaption>
            </figure>
        `;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Please search for a valid city 😩";
        });

    msg.textContent = "";
    form.reset();
    input.focus();
});