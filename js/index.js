const daysWeek = document.querySelectorAll('.page-nav__day');
let currentDate = new Date();
let currentDay = currentDate.getDay();
function setDay(){
   const daysArray = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
   daysWeek.forEach((elem, index) => {
    let dayWeekIndex = (currentDay + index) % 7;
    let dayWeek = daysArray[dayWeekIndex];
    elem.querySelector('.page-nav__day-week').textContent = dayWeek;
    elem.querySelector('.page-nav__day-number').textContent = currentDate.getDate() + index;
    if (index === 0) {
        elem.classList.add('page-nav__day_today', 'page-nav__day_chosen');
      } else {
        elem.classList.remove('pagelem_today', 'page-nav__day_chosen');
      }
    if (dayWeekIndex === 0 || dayWeekIndex === 6) {
      elem.classList.add('page-nav__day_weekend');
    } else {
      elem.classList.remove('page-nav__day_weekend')
    }
})
}
setDay();

sendRequest('POST', 'https://jscp-diplom.netoserver.ru/', 'event=update', function (response) {
  let films = response.films.result;
  let halls = response.halls.result.filter((openhalls) => openhalls.hall_open !== '0');
  let arrSeances = response.seances.result;

  let main = document.querySelector('main');
 
  for (let film of films) {
    let hallSeances;
    halls.forEach(function (hall) {
      let seances = arrSeances.filter((seance) => (seance.seance_filmid == film.film_id) && (seance.seance_hallid == hall.hall_id));
      if (seances.length > 0) {
        hallSeances += `<div class="movie-seances__hall">
         <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
         <ul class="movie-seances__list">
           ${seances.map(seance => `
             <li class="movie-seances__time-block">
               <a class="movie-seances__time" href="hall.html" data-film-name ="${film.film_name}" 
               data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}" 
               data-hall-name="${hall.hall_name}" data-hall-id="${hall.hall_id}" data-seance-id="${seance.seance_id}" 
               data-hall-price-standart="${hall.hall_price_standart}"
               data-hall-price-vip="${hall.hall_price_vip}">${seance.seance_time}</a>
             </li>
           `)}
         </ul>          
       </div>`
      }
    });

    if (hallSeances) {
      main.innerHTML += `<section class="movie">
         <div class="movie__info">
           <div class="movie__poster">
             <img class="movie__poster-image" alt='${film.film_name}' src="${film.film_poster}">
           </div>
           <div class="movie__description">
             <h2 class="movie__title">${film.film_name}</h2>
             <p class="movie__synopsis">${film.film_description}</p>
             <p class="movie__data">
               <span class="movie__data-duration">${film.film_duration}</span>
               <span class="movie__data-origin">${film.film_origin}</span>
             </p>
           </div>
         </div>  
         ${hallSeances}
       </section>`
    }
  }

  let seancesTime = document.querySelectorAll('.movie-seances__time');

  function updateSeances() {
    seancesTime.forEach((time) => {
      let seanceStart = +time.dataset.seanceStart;
      let selectedDay = document.querySelector('.page-nav__day_chosen');
      let selectedDayIndex = Array.from(daysWeek).indexOf(selectedDay);
      let selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate() + selectedDayIndex);
      selectedDate.setHours(0, 0, 0);
      let seanceTime = Math.floor(selectedDate.getTime() / 1000) + seanceStart * 60;
      time.dataset.seanceTimeStamp = seanceTime;
      let todayTime = new Date();
      let currentTime = Math.round(todayTime.getTime() / 1000);
      if (currentTime > seanceTime) {
        time.classList.add("acceptin-button-disabled");
      } else {
        time.classList.remove("acceptin-button-disabled");
      }
    });
  }

  for (let pageNavDay of daysWeek) {
    pageNavDay.addEventListener('click', function (e) {
      e.preventDefault();
      let selectedDay = document.querySelector('.page-nav__day_chosen');
      if (selectedDay) {
        selectedDay.classList.remove('page-nav__day_chosen');
      }
      pageNavDay.classList.add('page-nav__day_chosen');
      updateSeances();
    })
  }
  updateSeances();

  seancesTime.forEach((time) => {
    time.addEventListener('click', function (event) {
      let hallId = event.target.dataset.hallId;
      let selectedHall = halls.find((hall) => hall.hall_id == hallId);
      let selectedSeance = {
        ...event.target.dataset,
        hallConfig: selectedHall.hall_config
      };
      let jsonSeance = JSON.stringify(selectedSeance);
      localStorage.setItem('seance-data', jsonSeance);
    });
  });
});
