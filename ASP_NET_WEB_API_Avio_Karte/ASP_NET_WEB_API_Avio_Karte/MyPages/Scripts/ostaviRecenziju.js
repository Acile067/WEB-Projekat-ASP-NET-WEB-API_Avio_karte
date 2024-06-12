$(function () {
    getReady();
    loadLet();
    loadAviokompanija();
    register();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
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

function loadAviokompanija() {
    var letid = getUrlParameter('letid');
    if (letid) {
        $.ajax({
            url: '/api/aviokompanijaLetId/' + letid,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            success: function (data) {

                var tableRow = `
                    <tr>
                        <td>${data.Naziv}</td>
                        <td>${data.Adresa}</td>
                        <td>${data.Email}</td>
                        <td>${data.Telefon}</td>
                    </tr>`;
                $('#aviokompanijeTable tbody').append(tableRow);
            },
            error: function (error) {
                console.log(error);
                alert('Neuspelo ucitavanje aviokompanija');
            }
        });
    } else {
        alert('Ne postoji LetID u URL');
    }
}

function check(id) {
    let prop = $('#' + id).val();
    if (!prop || prop.trim() === '') {
        $('#' + id).css('border-color', 'red');
        return false;
    }
    $('#' + id).css('border-color', 'black');
    return true;
}

function checkAll(list) {
    let goodInput = true;
    for (i in list)
        if (!check(list[i]))
            goodInput = false;

    if (!goodInput) alert("Sva polja moraju biti pravilno popunjena!");
    return goodInput;
}

function register() {
    $(document).on('click', '#postaviRecenziju', function () {
        let korisnik = sessionStorage.getItem('korisnickoime');
        let letid = getUrlParameter('letid');

        if (checkAll(['naslov', 'sadrzaj'])) {
            let formData = new FormData();
            formData.append('naslov', $('#naslov').val());
            formData.append('sadrzaj', $('#sadrzaj').val());
            formData.append('ocena', $('#ocena').val());
            formData.append('korisnik', korisnik);
            formData.append('letid', letid);

            // Proverite da li je fajl izabran
            let slikaInput = $('#slika')[0];
            if (slikaInput.files.length > 0) {
                formData.append('slika', slikaInput.files[0]);
            }

            $.ajax({
                url: '/api/recenzija',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    alert("Uspesno dodana recenzija " + $('#naslov').val());
                    window.location = '/MyPages/userRezervacije.html';
                },
                error: function (xhr) {
                    alert(xhr.responseJSON.Message);
                }
            });
        }
    });
}