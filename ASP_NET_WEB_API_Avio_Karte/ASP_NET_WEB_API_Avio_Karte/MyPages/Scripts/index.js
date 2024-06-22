$(function () {
    fetchLetove();
    $(document).on('click', "#pretraziLetovebtn", function () {
        fetchLetove();
    });
});

async function fetchLetove() {
    
    const polaznadestinacija = $('#polaznaPretraga').val();
    const odredistnadestinacija = $('#odredisnaPretraga').val();
    const datumpolaska = $('#datumpolaskaPretraga').val();
    const datumdolaska = $('#datumdolaskaPretraga').val();
    const aviokompanija = $('#kompanijaAvio').val();

    try {
        const response = await $.ajax({
            url: '/api/letovi',
            method: "GET",
            data: { polaznadestinacija: polaznadestinacija, odredistnadestinacija: odredistnadestinacija, datumpolaska: datumpolaska, datumdolaska: datumdolaska, aviokompanija: aviokompanija }
        });
        populateLetTable(response);
        initializeSortingLet();
    } catch (error) {
        console.log(error);
        alert("Greška pri učitavanju letova");
    }
    
}

function populateLetTable(users) {
    const usersTableBody = $('#letoviTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        let statusLetaText = user.StatusLeta;
        if (statusLetaText == 0) {
            usersTableBody.append(`
            <tr>
                <td><a href="/MyPages/aviokompanija.html?id=${user.AviokompanijaId}">${user.Aviokompanija}</a></td>
                <td>${user.PolaznaDestinacija}</td>
                <td>${user.OdredistnaDestinacija}</td>
                <td>${user.DatumPolaska}</td>
                <td>${user.VremePolaska}</td>
                <td>${user.DatumDolaska}</td>
                <td>${user.VremeDolaska}</td>
                <td>${user.BrojSlobodnihMesta}</td>
                <td>${user.BrojZauzetihMesta}</td>
                <td>${user.Cena}</td>
                <td><a href="/MyPages/rezervisiLet.html?id=${user.Id}">Rezervisi</a></td>
                <td>
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="glyphicon glyphicon-open"></span>
                    <span class="glyphicon glyphicon-edit"></span>
                </td>
            </tr>
        `);
        }       
    });
}

function initializeSortingLet() {
    let sortOrder = {
        'Kompanija': true,  // true for ascending, false for descending
        'Polazak': true,
        'Odrediste': true,
        'Poletanje': true,
        'VremePoletanja': true,
        'Sletanje': true,
        'VremeSletanja': true,
        'Slobodnih': true,
        'Zauzetih': true,
        'Cena': true,
        'Status': true
    };
    $(document).on('click', '#letoviTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTableLet(column, order);

        // Remove sorting classes from all headers
        $('#letoviTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTableLet(column, order) {
    const rows = $('#letoviTable tbody tr').get();

    rows.sort(function (a, b) {
        let A, B;
        switch (column) {
            case 'Poletanje':
                A = parseDateTime($(a).find('td').eq(3).text(), $(a).find('td').eq(4).text());
                B = parseDateTime($(b).find('td').eq(3).text(), $(b).find('td').eq(4).text());
                break;
            case 'Sletanje':
                A = parseDateTime($(a).find('td').eq(5).text(), $(a).find('td').eq(6).text());
                B = parseDateTime($(b).find('td').eq(5).text(), $(b).find('td').eq(6).text());
                break;
            case 'VremePoletanja':
                A = parseTime($(a).find('td').eq(4).text());
                B = parseTime($(b).find('td').eq(4).text());
                break;
            case 'VremeSletanja':
                A = parseTime($(a).find('td').eq(6).text());
                B = parseTime($(b).find('td').eq(6).text());
                break;
            case 'Cena':
                A = parseFloat($(a).find('td').eq(9).text());
                B = parseFloat($(b).find('td').eq(9).text());
                break;
            case 'Slobodnih':
                A = parseInt($(a).find('td').eq(7).text(), 10);
                B = parseInt($(b).find('td').eq(7).text(), 10);
                break;
            case 'Zauzetih':
                A = parseInt($(a).find('td').eq(8).text(), 10);
                B = parseInt($(b).find('td').eq(8).text(), 10);
                break;
            default:
                A = $(a).find('td').eq(columnIndex(column)).text().toUpperCase();
                B = $(b).find('td').eq(columnIndex(column)).text().toUpperCase();
                break;
        }

        if (column === 'Kompanija' || column === 'Polazak' || column === 'Odrediste') {
            return A.localeCompare(B) * (order === 'asc' ? 1 : -1);
        }

        if (A < B) {
            return order === 'asc' ? -1 : 1;
        }
        if (A > B) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    $.each(rows, function (index, row) {
        $('#letoviTable tbody').append(row);
    });
}

// Funkcija za parsiranje vremena
function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    return new Date(1970, 0, 1, hours, minutes);
}

// Funkcija za parsiranje datuma i vremena
function parseDateTime(dateStr, timeStr) {
    const [day, month, year] = dateStr.split('/');
    const [hours, minutes] = timeStr.split(':');
    return new Date(year, month - 1, day, hours, minutes);
}

// Funkcija koja vraća indeks kolone na osnovu njenog imena
function columnIndex(columnName) {
    const columns = {
        'Kompanija': 0,
        'Polazak': 1,
        'Odrediste': 2,
        'Poletanje': 3,
        'VremePoletanja': 4,
        'Sletanje': 5,
        'VremeSletanja': 6,
        'Slobodnih': 7,
        'Zauzetih': 8,
        'Cena': 9
    };
    return columns[columnName];
}

function getCellValueLet(row, column) {
    switch (column) {
        case 'Kompanija':
            return $(row).find('td').eq(0).text();
        case 'Polazak':
            return $(row).find('td').eq(1).text();
        case 'Odrediste':
            return $(row).find('td').eq(2).text();
        case 'Poletanje':
            return parseDateTime($(row).find('td').eq(3).text(), $(row).find('td').eq(4).text());
        case 'VremePoletanja':
            return $(row).find('td').eq(4).text();
        case 'Sletanje':
            return parseDateTime($(row).find('td').eq(5).text(), $(row).find('td').eq(6).text());
        case 'VremeSletanja':
            return $(row).find('td').eq(6).text();
        case 'Slobodnih':
            return parseInt($(row).find('td').eq(7).text(), 10);
        case 'Zauzetih':
            return parseInt($(row).find('td').eq(8).text(), 10);
        case 'Cena':
            return parseFloat($(row).find('td').eq(9).text()); // Parsiraj kao decimalan broj
        default:
            return $(row).find('td').eq(0).text();
    }
}


