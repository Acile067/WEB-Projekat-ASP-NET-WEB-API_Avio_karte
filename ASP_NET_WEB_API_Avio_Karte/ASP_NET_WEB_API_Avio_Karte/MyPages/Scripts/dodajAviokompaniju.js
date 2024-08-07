﻿$(function () {
    getReady();
    register();
    fetchKompanije();
    $(document).on('click', "#pretrazibtn", function () {
        fetchKompanije();
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

function register() {
    let autorizacija = localStorage.getItem('token');
    $(document).on('click', '#dodajkompaniju', function () {
        if (checkAll(['naziv', 'adresa', 'telefon', 'email'])) {
            let data = {
                'naziv': $('#naziv').val(),
                'adresa': $('#adresa').val(),
                'telefon': $('#telefon').val(),
                'email': $('#email').val(),
            };

            if (!data.email.match('.+@.+\..*')) {
                alert("Nevalidno unesena email adresa");
                return;
            }

            $.ajax({
                url: '/api/aviokompanija',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + autorizacija
                },
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    alert("Uspesno dodana aviokompanija " + data.naziv);
                    window.location = '/MyPages/dodajIzmeniAviokompaniju.html';
                },
                error: function (xhr, status, err) {
                    alert(xhr.responseJSON.Message);
                }
            });
        }
    });
}




async function fetchKompanije() {
    if (localStorage.getItem('token')) {
        const naziv = $('#nazivPretraga').val();
        const adresa = $('#adresaPretraga').val();
        const telefon = $('#telefonPretraga').val();
        const email = $('#emailPretraga').val();

        try {
            const response = await $.ajax({
                url: '/api/aviokompanije',
                method: "GET",
                data: { naziv: naziv, adresa: adresa, telefon: telefon, email: email }
            });
            populateUserTable(response);
            initializeSorting();
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju aviokompanija");
        }
    }
}

function populateUserTable(users) {
    const usersTableBody = $('#aviokompanijeTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        usersTableBody.append(`
            <tr>
                <td>${user.Naziv}</td>
                <td>${user.Adresa}</td>
                <td>${user.Email}</td>
                <td>${user.Telefon}</td>
                <td><a href="/MyPages/izmeniAviokompaniju.html?id=${user.Id}">Izmeni</a></td>
                <td>
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="glyphicon glyphicon-open"></span>
                    <span class="glyphicon glyphicon-edit"></span>
                </td>
            </tr>
        `);
    });
}

function initializeSorting() {
    // Održava trenutni redosled sortiranja za svaku kolonu
    let sortOrder = {
        'Naziv': true,   // true for ascending, false for descending
        'Adresa': true,
        'Telefon': true,
        'Email': true
    };

    // Postavlja event listener za klik na zaglavlja kolona
    $(document).on('click', '#aviokompanijeTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];  // Invertuje redosled za sledeći klik

        sortTable(column, order);

        // Uklanja sve klase sortiranja iz zaglavlja
        $('#aviokompanijeTable th.sortable').removeClass('asc desc');

        // Dodaje klasu za trenutni redosled u zaglavlje na koje je kliknuto
        $(this).addClass(order);
    });
}

function sortTable(column, order) {
    const rows = $('#aviokompanijeTable tbody tr').get();

    rows.sort(function (a, b) {
        const A = getCellValue(a, column);
        const B = getCellValue(b, column);

        // Koristi localeCompare za poređenje tekstualnih vrednosti
        if (order === 'asc') {
            return A.localeCompare(B);
        } else {
            return B.localeCompare(A);
        }
    });

    // Dodaje sortirane redove nazad u tbody
    $.each(rows, function (index, row) {
        $('#aviokompanijeTable tbody').append(row);
    });
}

function getCellValue(row, column) {
    const columnIndex = getColumnIndex(column);
    return $(row).find('td').eq(columnIndex).text().trim().toUpperCase();
}

function getColumnIndex(columnName) {
    // Vraća indeks kolone na osnovu njenog imena
    const columns = {
        'Naziv': 0,
        'Adresa': 1,
        'Telefon': 2,
        'Email': 3
    };
    return columns[columnName];
}