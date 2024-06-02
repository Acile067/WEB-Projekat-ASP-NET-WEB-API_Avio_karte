$(function () {
    getReady();
    register();
    fetchKompanije();
    $(document).on('click', "#pretrazibtn", function () {
        fetchKompanije();
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

function register() {
    $(document).on('click', '#dodajkompaniju', function () {
        if (checkAll(['naziv', 'adresa', 'telefon', 'email'])) {
            data = {
                'naziv': $('#naziv').val(),
                'adresa': $('#adresa').val(),
                'telefon': $('#telefon').val(),
                'email': $('#email').val(),
            };

            if (!data.email.match('.+@.+\..*')) {
                alert("Nevalidno unesena email adresa");
                return;
            }
            $.post('/api/aviokompanija', data, function (result) {
                alert("Uspesno dodana aviokompanija " + data.naziv);
                window.location = '/MyPages/dodajIzmeniAviokompaniju.html';
            }).fail(function (xhr, status, err) {
                alert(xhr.responseJSON.Message);
            });
        }
    });
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