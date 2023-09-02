function generateQrcode() {
    let ticketInfo = localStorage.getItem('seance-data');
    let parsedTickets = JSON.parse(ticketInfo);
    let ticketTitle = document.querySelector('.ticket__title');
    ticketTitle.innerText = parsedTickets.filmName;
    let ticketChairs = document.querySelector('.ticket__chairs');
    ticketChairs.innerText = parsedTickets.takenChairs;
    let ticketHall = document.querySelector('.ticket__hall');
    ticketHall.innerText = parsedTickets.hallName;
    let ticketStart = document.querySelector('.ticket__start');
    ticketStart.innerText = parsedTickets.seanceTime;
    let seanceDate = new Date(+`${parsedTickets.seanceTimeStamp * 1000}`);
    let fulldate = seanceDate.toLocaleString("ru-RU", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    let seanceInfoQr = `На фильм: ${parsedTickets.filmName},Зал: ${parsedTickets.hallName},Ряд/Место: ${parsedTickets.takenChairs},Время: ${fulldate}`
    let qrCode = QRCreator(seanceInfoQr, {
        mode: 4,
        eccl: 0,
        version: -1,
        mask: -1,
        image: "png",
        modsize: 3,
        margin: 4,
    });
    document.querySelector('.ticket__info-qr').append(qrCode.result);
  }
  document.addEventListener("DOMContentLoaded", generateQrcode);
    