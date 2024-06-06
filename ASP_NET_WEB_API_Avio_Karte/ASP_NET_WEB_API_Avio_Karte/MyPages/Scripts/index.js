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