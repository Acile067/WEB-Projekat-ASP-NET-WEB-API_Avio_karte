$(function () {
    getReady();
    loadAviokompanije();
    loadLet();
    $(document).on('click', "#izmenilet", function () {
        if (checkAll(['poletanje', 'vremepolaska', 'sletanje', 'vremesletanja', 'mesta', 'zauzetamesta', 'cena'])) {
            updateLet();
        }
    });

    $(document).on('click', "#obrisilet", function () {
        deleteLet();
    });
});

function getReady() {
    if (!localStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (localStorage.getItem('role') != 'Administrator')
        window.location = '/MyPages/index.html';
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

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function formatDate(dateStr) {
    let parts = dateStr.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function mapStatusLeta(statusCode) {
    switch (statusCode) {
        case 0:
            return 'Aktivan';
        case 1:
            return 'Zavrsen';
        case 2:
            return 'Otkazan';
        default:
            return 'Nepoznat';
    }
}

function loadAviokompanije() {
    $.ajax({
        url: '/api/nazivaviokompanija',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function (data) {
            var aviokompanijaSelect = $('#aviokompanija');
            aviokompanijaSelect.empty();
            data.forEach(function (aviokompanija) {
                aviokompanijaSelect.append(new Option(aviokompanija.Naziv, aviokompanija.Id));
            });
        },
        error: function (error) {
            console.log(error);
            alert('Neuspelo učitavanje aviokompanija');
        }
    });
}


function loadLet() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/let/' + id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (data) {

                let datumPolaska = formatDate(data.DatumPolaska);
                let datumDolaska = formatDate(data.DatumDolaska);

                $('#aviokompanija').val(data.AviokompanijaId);
                $('#status').val(data.StatusLeta);
                $('#status option').each(function () {
                    if ($(this).val() == data.StatusLeta) {
                        $(this).attr("selected", "selected");
                    }
                });
                $('#poletanje').val(datumPolaska);
                $('#vremepolaska').val(data.VremePolaska);
                $('#sletanje').val(datumDolaska);
                $('#vremesletanja').val(data.VremeDolaska);
                $('#mesta').val(data.BrojSlobodnihMesta);
                $('#zauzetamesta').val(data.BrojZauzetihMesta);
                $('#cena').val(data.Cena);
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


function updateLet() {
    var id = getUrlParameter('id');
    if (id) {
        var let = {
            Id: id,
            AviokompanijaId: $('#aviokompanija').val(),
            StatusLeta: $('#status').val(),
            DatumPolaska: $('#poletanje').val(),
            VremePolaska: $('#vremepolaska').val(),
            DatumDolaska: $('#sletanje').val(),
            VremeDolaska: $('#vremesletanja').val(),
            BrojSlobodnihMesta: $('#mesta').val(),
            BrojZauzetihMesta: $('#zauzetamesta').val(),
            Cena: $('#cena').val(),
        };

        $.ajax({
            url: '/api/let/' + id,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(let),
            success: function (data) {
                alert('Let uspešno promenjen');
                window.location = '/MyPages/letAdminControll.html';
            },
            error: function (error) {
                console.log(error);
                alert('Let nije promenjen GRESKA!');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}


function deleteLet() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/let/' + id,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function () {
                alert('Let uspešno obrisan');
                window.location = '/MyPages/letAdminControll.html';
            },
            error: function (error) {
                console.log(error);
                alert('Nisam uspeo da obrišem let GRESKA!');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}
