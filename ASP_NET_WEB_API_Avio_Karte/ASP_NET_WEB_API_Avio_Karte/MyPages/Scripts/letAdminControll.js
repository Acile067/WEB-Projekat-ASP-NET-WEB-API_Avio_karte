$(function () {
    getReady();
    fetchKompanije();
    $(document).on('click', "#pretrazibtn", function () {
        fetchKompanije();
    });
    fetchLetove();
    $(document).on('click', "#pretraziLetovebtn", function () {
        fetchLetove();
    });
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
        window.location = '/MyPages/index.html';
}

async function fetchKompanije() {
    if (sessionStorage.getItem('token')) {
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
                <td><a href="/MyPages/dodajLet.html?kompanija=${user.Id}">Dodaj</a></td>
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
    let sortOrder = {
        'Naziv': true,  // true for ascending, false for descending
        'Adresa': true,
        'Telefon': true,
        'Email': true
    };
    $(document).on('click', '#aviokompanijeTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTable(column, order);

        // Remove sorting classes from all headers
        $('#aviokompanijeTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTable(column, order) {
    const rows = $('#aviokompanijeTable tbody tr').get();

    rows.sort(function (a, b) {
        const A = getCellValue(a, column);
        const B = getCellValue(b, column);

        if (A < B) {
            return order === 'asc' ? -1 : 1;
        }
        if (A > B) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    $.each(rows, function (index, row) {
        $('#aviokompanijeTable tbody').append(row);
    });
}

function getCellValue(row, column) {

    return $(row).find('td').eq((column === 'Naziv' || column === 'Adresa' || column === 'Telefon' || column === 'Email') ? 1 : 4).text().toUpperCase();
}


async function fetchLetove() {
    if (sessionStorage.getItem('token')) {
        const polaznadestinacija = $('#polaznaPretraga').val();
        const odredistnadestinacija = $('#odredisnaPretraga').val();
        const datumpolaska = $('#datumpolaskaPretraga').val();
        const datumdolaska = $('#datumdolaskaPretraga').val();

        try {
            const response = await $.ajax({
                url: '/api/letovi',
                method: "GET",
                data: { polaznadestinacija: polaznadestinacija, odredistnadestinacija: odredistnadestinacija, datumpolaska: datumpolaska, datumdolaska: datumdolaska }
            });
            populateLetTable(response);
            initializeSortingLet();
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju letova");
        }
    }
}

function populateLetTable(users) {
    const usersTableBody = $('#letoviTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        let statusLetaText;
        switch (user.StatusLeta) {
            case 0:
                statusLetaText = "Aktivan";
                break;
            case 1:
                statusLetaText = "Otkazan";
                break;
            case 2:
                statusLetaText = "Zavrsen";
                break;
            default:
                statusLetaText = "Nepoznato";
        }
        usersTableBody.append(`
            <tr>
                <td>${user.Aviokompanija}</td>
                <td>${user.PolaznaDestinacija}</td>
                <td>${user.OdredistnaDestinacija}</td>
                <td>${user.DatumPolaska}</td>
                <td>${user.VremePolaska}</td>
                <td>${user.DatumDolaska}</td>
                <td>${user.VremeDolaska}</td>
                <td>${user.BrojSlobodnihMesta}</td>
                <td>${user.BrojZauzetihMesta}</td>
                <td>${user.Cena}</td>
                <td>${statusLetaText}</td>
                <td><a href="/MyPages/izmeniLet.html?id=${user.Id}">Izmeni</a></td>
                <td>
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="glyphicon glyphicon-open"></span>
                    <span class="glyphicon glyphicon-edit"></span>
                </td>
            </tr>
        `);
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
        const A = getCellValueLet(a, column);
        const B = getCellValueLet(b, column);

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

function getCellValueLet(row, column) {

    return $(row).find('td').eq((column === 'Kompanija' || column === 'Polazak' || column === 'Odrediste' || column === 'Poletanje' || column === 'VremePoletanja' || column === 'Sletanje' || column === 'VremeSletanja' || column === 'Slobodnih' || column === 'Zauzetih' || column === 'Cena' || column === 'Status') ? 1 : 11).text().toUpperCase();
}