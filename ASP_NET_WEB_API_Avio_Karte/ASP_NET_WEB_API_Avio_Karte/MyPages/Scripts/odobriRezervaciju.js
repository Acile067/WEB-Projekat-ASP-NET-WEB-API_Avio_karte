$(function () {
    getReady();
    loadLet();
    loadRezervacija();
    
    $(document).on('click', "#dugmeOdobri", function () {
        odobriRezervaciju();
    });

    $(document).on('click', "#dugmeOtkazi", function () {
        otkaziRezervaciju();
    });
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
        window.location = '/MyPages/index.html';
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function loadLet() {
    var id = getUrlParameter('letid');
    if (id) {
        $.ajax({
            url: '/api/let/' + id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                let statusText = "";
                if (data.StatusLeta === 0) {
                    statusText = 'Aktivan';
                } else if (data.StatusLeta === 1) {
                    statusText = 'Otkazan';
                }
                else if (data.StatusLeta === 2) {
                    statusText = 'Zavrsen';
                }
                var tableRow = `
                    <tr>
                        <td>${data.Aviokompanija}</td>
                        <td>${data.PolaznaDestinacija}</td>
                        <td>${data.OdredistnaDestinacija}</td>
                        <td>${data.DatumPolaska}</td>
                        <td>${data.VremePolaska}</td>
                        <td>${data.DatumDolaska}</td>
                        <td>${data.VremeDolaska}</td>
                        <td>${data.BrojSlobodnihMesta}</td>
                        <td>${data.BrojZauzetihMesta}</td>
                        <td>${data.Cena}</td>
                        <td>${statusText}</td>
                    </tr>`;
                $('#letoviTable tbody').append(tableRow);
            },
            error: function (error) {
                console.log(error);
                alert('Neuspelo ucitavanje leta');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}

function loadRezervacija() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/neodobrena/' + id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            success: function (data) {
                var tableRow = `
                    <tr>
                        <td>${data.Korisnik}</td>
                        <td>${data.BrojPutnika}</td>
                        <td>${data.UkupnaCena}</td>
                    </tr>`;
                $('#neodobreneTable tbody').append(tableRow);
            },
            error: function (error) {
                console.log(error);
                alert('Neuspelo ucitavanje rezervacije');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}


function odobriRezervaciju() {
    var id = getUrlParameter('id');
    var letid = getUrlParameter('letid');

    // Validacija URL parametara
    if (!id || isNaN(id)) {
        alert('Ne postoji ili je neispravan ID u URL-u');
        return;
    }

    if (!letid || isNaN(letid)) {
        alert('Ne postoji ili je neispravan Let ID u URL-u');
        return;
    }

    // Priprema podataka za slanje
    var rezervacija = {
        Id: parseInt(id, 10),
        LetId: parseInt(letid, 10),
    };

    // Slanje AJAX zahteva
    $.ajax({
        url: '/api/odobrirezervaciju/' + id,
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(rezervacija),
        success: function (data) {
            alert('Rezervacija uspešno odobrena');
            // Osvježavanje ili preusmeravanje stranice po potrebi
            window.location = '/MyPages/rezervacijeAdminControl.html';
        },
        error: function (jqXHR) {
            console.log(jqXHR);
            var errorMessage = 'Došlo je do greške!';
            if (jqXHR.responseJSON && jqXHR.responseJSON.Message) {
                errorMessage = jqXHR.responseJSON.Message;
            }
            alert(errorMessage);
        }
    });
}


function otkaziRezervaciju() {
    var id = getUrlParameter('id');
    var letid = getUrlParameter('letid');

    // Validacija URL parametara
    if (!id || isNaN(id)) {
        alert('Ne postoji ili je neispravan ID u URL-u');
        return;
    }

    if (!letid || isNaN(letid)) {
        alert('Ne postoji ili je neispravan Let ID u URL-u');
        return;
    }

    // Priprema podataka za slanje
    var rezervacija = {
        Id: parseInt(id, 10),
        LetId: parseInt(letid, 10),
    };

    // Slanje AJAX zahteva
    $.ajax({
        url: '/api/otkazirezervaciju/' + id,
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(rezervacija),
        success: function (data) {
            alert('Rezervacija uspešno otkazana');
            // Osvježavanje ili preusmeravanje stranice po potrebi
            window.location = '/MyPages/rezervacijeAdminControl.html';
        },
        error: function (jqXHR) {
            console.log(jqXHR);
            var errorMessage = 'Došlo je do greške!';
            if (jqXHR.responseJSON && jqXHR.responseJSON.Message) {
                errorMessage = jqXHR.responseJSON.Message;
            }
            alert(errorMessage);
        }
    });
}
