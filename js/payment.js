
let chosenData = JSON.parse(localStorage.getItem('seance-data'))
let ticketTitle = document.querySelector('.ticket__title');
ticketTitle.innerText = `${chosenData.filmName}`;
let ticketChairs = document.querySelector('.ticket__chairs');
let ticketHall = document.querySelector('.ticket__hall');
ticketHall.innerText = `${chosenData.hallName}`;
let seanceDate = new Date(+`${chosenData.seanceTimeStamp * 1000}`);
let fulldate = seanceDate.toLocaleString("ru-RU",
    {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
let ticketStart = document.querySelector('.ticket__start');
ticketStart.innerText = `${chosenData.seanceTime}, ${fulldate}`;
let places = chosenData.selectedPlaces;
let takenChairs = places.map(place => `${place.row}/${place.place}`).join(', ');
ticketChairs.innerText = takenChairs;
let price = 0;
for (let place of places) {
    if (place.type === 'standart') {
        price += +chosenData.hallPriceStandart;
    } else if (place.type === 'vip') {
        price += +chosenData.hallPriceVip;
    }
}
let ticketCost = document.querySelector('.ticket__cost');
ticketCost.innerText = `${price}`;
let newHallConfig = chosenData.hallConfig.replace(/selected/g, "taken");
chosenData.hallConfig = newHallConfig;
chosenData.takenChairs = takenChairs;
localStorage.setItem('seance-data', JSON.stringify(chosenData));
document.querySelector(".acceptin-button").addEventListener("click", (event) => {
    event.preventDefault();
    fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body: `event=sale_add&timestamp=${chosenData.seanceTimeStamp}&hallId=${chosenData.hallId}&seanceId=${chosenData.seanceId}&hallConfiguration=${newHallConfig}`,
    });
});