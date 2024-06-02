﻿$(function () {
    getReady();
    loadAviokompanija();

    $(document).on('click', "#izmenikompaniju", function () {
        if (checkAll(['naziv', 'adresa', 'telefon', 'email'])) {
            updateAviokompanija();
        }       
    });
    $('#obrisikompaniju').click(function () {
        deleteAviokompanija();
    });
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
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

function loadAviokompanija() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/aviokompanija/' + id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                $('#naziv').val(data.Naziv);
                $('#adresa').val(data.Adresa);
                $('#telefon').val(data.Telefon);
                $('#email').val(data.Email);
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

function updateAviokompanija() {
    var id = getUrlParameter('id');
    if (id) {
        var aviokompanija = {
            Id: id,
            Naziv: $('#naziv').val(),
            Adresa: $('#adresa').val(),
            Telefon: $('#telefon').val(),
            Email: $('#email').val()
        };

        $.ajax({
            url: '/api/aviokompanija/' + id,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(aviokompanija),
            success: function (data) {
                alert('Aviokompanija uspesno promenjena');
            },
            error: function (error) {
                console.log(error);
                alert('Aviokompanija nije promenjena GRESKA!');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}


function deleteAviokompanija() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/aviokompanija/' + id,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            success: function () {
                alert('Aviokompanija uspesno obrisana');
                window.location = '/MyPages/dodajIzmeniAviokompaniju.html'; 
            },
            error: function (error) {
                console.log(error);
                alert('Nisam uspeo da obrisem aviokompaniju GRESKA!');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}