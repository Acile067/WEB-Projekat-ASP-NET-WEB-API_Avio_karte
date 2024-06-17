$(function () {
    getReady();
    loadLet();
    register();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/login.html';
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function loadLet() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/let/' + id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            success: function (data) {
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
                    </tr>`;
                $('#letoviTable tbody').append(tableRow);
            },
            error: function (error) {
                console.log(error);
                alert('Neuspelo ucitavanje aviokompanija');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}

function check(id) {
    let prop = $('#' + id).val();

    if (!prop || prop.trim() === '') {
        $('#' + id).css('border-color', 'red');
        return false;
    }

    let num = Number(prop);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
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
    $(document).on('click', '#rezervisibtn', function () {
        var id = getUrlParameter('id');
        var trenutniKorisnik = sessionStorage.getItem('korisnickoime');
        if (checkAll(['brojKarata'])) {
            data = {
                'brojputnika': $('#brojKarata').val(),
                'letid': id,
                'korisnik': trenutniKorisnik,
            };

            $.post('/api/rezervacija', data, function (result) {
                alert("Uspesno dodana rezervacija ");
                window.location = '/MyPages/index.html';
            }).fail(function (xhr, status, err) {
                alert(xhr.responseJSON.Message);
            });
        }
    });
}