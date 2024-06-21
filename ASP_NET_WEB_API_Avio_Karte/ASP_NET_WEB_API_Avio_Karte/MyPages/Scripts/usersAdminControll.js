$(function () {
    getReady();
    fetchUsers();
    $(document).on('click', "#pretrazibtn", function () {
        fetchUsers();
    });
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
        window.location = '/MyPages/index.html';
}

async function fetchUsers() {
    if (sessionStorage.getItem('token')) {
        const ime = $('#imePretraga').val();
        const prezime = $('#prezimePretraga').val();
        const datumOd = $('#datumOdPretraga').val();
        const datumDo = $('#datumDoPretraga').val();

        const autorizacija = sessionStorage.getItem('token');

        try {
            const response = await $.ajax({
                url: '/api/users',
                method: "GET",
                data: { ime: ime, prezime: prezime, datumOd: datumOd, datumDo: datumDo, autorizacija: autorizacija }
            });
            populateUserTable(response);
            initializeSorting();
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju korisnika");
        }
    }
}

function populateUserTable(users) {
    const usersTableBody = $('#usersTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        usersTableBody.append(`
            <tr>
                <td>${user.KorisnickoIme}</td>
                <td>${user.Ime}</td>
                <td>${user.Prezime}</td>
                <td>${user.Email}</td>
                <td>${user.DatumRodjenja}</td>
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
        'Ime': true,  // true for ascending, false for descending
        'DatumRodjenja': true
    };
    $(document).on('click', '#usersTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTable(column, order);

        // Remove sorting classes from all headers
        $('#usersTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTable(column, order) {
    const rows = $('#usersTable tbody tr').get();

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
        $('#usersTable tbody').append(row);
    });
}

function getCellValue(row, column) {
    if (column === 'DatumRodjenja') {
        // Convert date string to Date object for proper comparison
        return new Date($(row).find('td').eq(4).text());
    }
    return $(row).find('td').eq(column === 'Ime' ? 1 : 4).text().toUpperCase();
}