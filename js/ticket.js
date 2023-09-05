function generateQrcode() {
  let parsedTickets = JSON.parse(localStorage.getItem('seance-data'));
  let seanceDate = new Date(+`${parsedTickets.seanceTimeStamp * 1000}`);
  let fulldate = seanceDate.toLocaleString("ru-RU",
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  const ticketInfoWrapper = document.querySelector(".ticket__info-wrapper");
    ticketInfoWrapper.innerHTML = "";
    const textHtml = `
    <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">${parsedTickets.filmName}</span></p>
    <p class="ticket__info">Ряд/Место: <span class="ticket__details ticket__chairs">${parsedTickets.takenChairs}</span></p>
    <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">${parsedTickets.hallName}</span></p>
    <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">${parsedTickets.seanceTime}</span></p>

    <div id="qrcode" class="ticket__info-qr"></div>

    <p class="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
    <p class="ticket__hint">Приятного просмотра!</p>
   `;
    ticketInfoWrapper.insertAdjacentHTML("beforeend", textHtml);
  let qrInfo = `На фильм: ${parsedTickets.filmName}; Зал: ${parsedTickets.hallName}; Ряд/Место: ${parsedTickets.takenChairs}; День,время: ${fulldate}`
  const qrcode = QRCreator(qrInfo, { 
        mode: 4,
        eccl: 0,
        version: -1,
        mask: -1,
        image: "png",
        modsize: 4,
        margin: 2,
   });
   document.getElementById("qrcode").append(qrcode.result); 
}
document.addEventListener("DOMContentLoaded", generateQrcode);