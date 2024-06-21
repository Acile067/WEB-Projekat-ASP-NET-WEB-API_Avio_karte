$(function () {
    getReady();
    fetchNeodobrene();
    fetchOdobrene();
    fetchZavrseneOtkazane();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
        window.location = '/MyPages/index.html';
}

async function fetchNeodobrene() {
    if (sessionStorage.getItem('token')) {
        try {
            const response = await $.ajax({
                url: '/api/neodobrene',
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            populateNeodobrene(response);
            initializeSorting();
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju aviokompanija");
        }
    } else {
        alert("Nema tokena za autorizaciju");
    }
}

function populateNeodobrene(users) {
    const usersTableBody = $('#neodobreneTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        usersTableBody.append(`
            <tr>
                <td>${user.Korisnik}</td>
                <td>${user.BrojPutnika}</td>
                <td>${user.UkupnaCena}</td>
                <td>Kreirana</td>
                <td><a href="/MyPages/odobriRezervaciju.html?id=${user.Id}&letid=${user.LetId}">Odobri</a></td>
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
        'Korisnik': true,  // true for ascending, false for descending
        'BrojPutnika': true,
        'UkupnaCena': true,
    };
    $(document).on('click', '#neodobreneTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTable(column, order);

        // Remove sorting classes from all headers
        $('#neodobreneTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTable(column, order) {
    const rows = $('#neodobreneTable tbody tr').get();

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
        $('#neodobreneTable tbody').append(row);
    });
}

function getCellValue(row, column) {

    return $(row).find('td').eq((column === 'Korisnik' || column === 'BrojPutnika' || column === 'UkupnaCena') ? 1 : 3).text().toUpperCase();
}

async function fetchOdobrene() {
    if (sessionStorage.getItem('token')) {
        try {
            const response = await $.ajax({
                url: '/api/odobrene',
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            populateOdobrene(response);
            initializeSorting2();
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju odobrenih");
        }
    } else {
        alert("Nema tokena za autorizaciju");
    }
}


function initializeSorting2() {
    let sortOrder = {
        'Korisnik': true,  // true for ascending, false for descending
        'BrojPutnika': true,
        'UkupnaCena': true,
    };
    $(document).on('click', '#odobreneTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTable2(column, order);

        // Remove sorting classes from all headers
        $('#odobreneTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTable2(column, order) {
    const rows = $('#odobreneTable tbody tr').get();

    rows.sort(function (a, b) {
        const A = getCellValue2(a, column);
        const B = getCellValue2(b, column);

        if (A < B) {
            return order === 'asc' ? -1 : 1;
        }
        if (A > B) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    $.each(rows, function (index, row) {
        $('#odobreneTable tbody').append(row);
    });
}

function getCellValue2(row, column) {

    return $(row).find('td').eq((column === 'Korisnik' || column === 'BrojPutnika' || column === 'UkupnaCena') ? 1 : 3).text().toUpperCase();
}

function populateOdobrene(users) {
    const usersTableBody = $('#odobreneTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        usersTableBody.append(`
            <tr>
                <td>${user.Korisnik}</td>
                <td>${user.BrojPutnika}</td>
                <td>${user.UkupnaCena}</td>
                <td>Odobrena</td>
                <td><a href="/MyPages/otkaziRezervaciju.html?id=${user.Id}&letid=${user.LetId}">Otkazi</a></td>
                <td>
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="glyphicon glyphicon-open"></span>
                    <span class="glyphicon glyphicon-edit"></span>
                </td>
            </tr>
        `);
    });
}


async function fetchZavrseneOtkazane() {
    if (sessionStorage.getItem('token')) {
        try {
            const response = await $.ajax({
                url: '/api/zavrseneotkazane',
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            populateZavrseneOtkazane(response);
            initializeSorting3();
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju završenih/otkazanih");
        }
    } else {
        alert("Nema tokena za autorizaciju");
    }
}


function populateZavrseneOtkazane(users) {
    const usersTableBody = $('#otkazaneZavrseneTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        let statusText;
        if (user.Status === 2) {
            statusText = 'Otkazana';
        } else if (user.Status === 3) {
            statusText = 'Zavrsena';
        }
        usersTableBody.append(`
            <tr>
                <td>${user.Korisnik}</td>
                <td>${user.BrojPutnika}</td>
                <td>${user.UkupnaCena}</td>
                <td>${statusText}</td>
                <td>
                    <span class="glyphicon glyphicon-remove"></span>
                    <span class="glyphicon glyphicon-open"></span>
                    <span class="glyphicon glyphicon-edit"></span>
                </td>
            </tr>
        `);
    });
}

function initializeSorting3() {
    let sortOrder = {
        'Korisnik': true,  // true for ascending, false for descending
        'BrojPutnika': true,
        'UkupnaCena': true,
    };
    $(document).on('click', '#otkazaneZavrseneTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTable3(column, order);

        // Remove sorting classes from all headers
        $('#otkazaneZavrseneTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTable3(column, order) {
    const rows = $('#otkazaneZavrseneTable tbody tr').get();

    rows.sort(function (a, b) {
        const A = getCellValue3(a, column);
        const B = getCellValue3(b, column);

        if (A < B) {
            return order === 'asc' ? -1 : 1;
        }
        if (A > B) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    $.each(rows, function (index, row) {
        $('#otkazaneZavrseneTable tbody').append(row);
    });
}

function getCellValue3(row, column) {

    return $(row).find('td').eq((column === 'Korisnik' || column === 'BrojPutnika' || column === 'UkupnaCena') ? 1 : 3).text().toUpperCase();
}