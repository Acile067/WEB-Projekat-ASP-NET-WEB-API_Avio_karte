$(function () {
    getReady();
    fetchRecenzije();  // Učitavanje svih recenzija pri inicijalizaciji

    // Dodavanje event listener-a za dugme "Pretraži"
    $('#pretraziLetovebtn').on('click', function () {
        let status = $('#status').val();  // Dobijanje izabranog statusa
        fetchRecenzije(status);  // Pozivanje funkcije sa statusom
    });

    // Event listener za dugme "Osveži"
    $('#Osvezi').on('click', function () {
        $('#status').val('');  // Resetovanje izabranog statusa
        fetchRecenzije();  // Ponovno učitavanje svih recenzija
    });
});

function getReady() {
    if (!localStorage.getItem('token'))
        window.location = '/MyPages/index.html';
}

// Modifikacija fetchRecenzije funkcije da prihvati status
async function fetchRecenzije(status = '') {
    var korisnickoime = localStorage.getItem('korisnickoime');
    var token = localStorage.getItem('token');
    console.log('Korisničko ime:', korisnickoime);
    console.log('Token:', token);

    if (!korisnickoime) {
        alert("Korisničko ime nije postavljeno.");
        return;
    }

    if (!token) {
        alert("Token nije postavljen.");
        return;
    }

    try {
        const response = await $.ajax({
            url: '/api/recenzijeinfo/' + encodeURIComponent(korisnickoime),
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token  // Ako je potrebna autorizacija
            },
            data: { status: status }  // Slanje statusa kao parametar
        });

        if (response && Array.isArray(response)) {
            populateRecenzije(response);
            initializeSorting();
        } else {
            alert("Odgovor nije u očekivanom formatu.");
        }
    } catch (error) {
        console.error("Greška pri učitavanju rezervacija:", error);
        if (error.responseText) {
            alert("Greška pri učitavanju rezervacija: " + error.responseText);
        } else {
            alert("Greška pri učitavanju rezervacija: Nepoznata greška");
        }
    }
}


function populateRecenzije(users) {
    const usersTableBody = $('#userRezervacijeTable tbody');
    usersTableBody.empty();
    users.forEach(user => {
        let statusText;
        let recenzijaText = 'Nije Moguce';
        let otkaziText = 'Nije Moguce';
        switch (user.Status) {
            case 1:
                statusText = 'Odobrena';
                otkaziText = `<a href="/MyPages/userOtkaziRezervaciju.html?id=${user.Id}&letid=${user.LetId}">Otkazi</a>`;
                break;
            case 2:
                statusText = 'Otkazana';
                break;
            case 3:
                statusText = 'Zavrsena';
                recenzijaText = `<a href="/MyPages/ostaviRecenziju.html?id=${user.Id}&letid=${user.LetId}">Recenzija</a>`;
                break;
            case 0:
                statusText = 'Kreirana';
                otkaziText = `<a href="/MyPages/userOtkaziRezervaciju.html?id=${user.Id}&letid=${user.LetId}">Otkazi</a>`;
                break;
            default:
                statusText = 'Nepoznat status';
        }
        usersTableBody.append(`
            <tr>
                <td><a href="/MyPages/userLetInfo.html?letid=${user.LetId}">Let</a></td>
                <td>${user.BrojPutnika}</td>
                <td>${user.UkupnaCena}</td>
                <td>${statusText}</td>
                <td>${otkaziText}</td>
                <td>${recenzijaText}</td>
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
        'BrojPutnika': true,  // true for ascending, false for descending
        'UkupnaCena': true,
        'Status': true,
    };

    $(document).on('click', '#userRezervacijeTable th.sortable', function () {
        const column = $(this).data('column');
        const order = sortOrder[column] ? 'asc' : 'desc';
        sortOrder[column] = !sortOrder[column];

        sortTable(column, order);

        // Remove sorting classes from all headers
        $('#userRezervacijeTable th.sortable').removeClass('asc desc');

        // Add sorting class to the clicked header
        $(this).addClass(order);
    });
}

function sortTable(column, order) {
    const rows = $('#userRezervacijeTable tbody tr').get();

    rows.sort(function (a, b) {
        const A = getCellValue(a, column);
        const B = getCellValue(b, column);

        if (typeof A === 'number' && typeof B === 'number') {
            return (order === 'asc' ? A - B : B - A);
        } else {
            // Fallback to string comparison if not numeric
            if (A < B) {
                return order === 'asc' ? -1 : 1;
            }
            if (A > B) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        }
    });

    $.each(rows, function (index, row) {
        $('#userRezervacijeTable tbody').append(row);
    });
}

function getCellValue(row, column) {
    switch (column) {
        case 'BrojPutnika':
            return parseInt($(row).find('td').eq(1).text(), 10);
        case 'UkupnaCena':
            return parseFloat($(row).find('td').eq(2).text());
        case 'Status':
            return $(row).find('td').eq(3).text().toUpperCase();
        default:
            return $(row).find('td').eq(columnIndex(column)).text().toUpperCase();
    }
}

// Funkcija koja vraća indeks kolone na osnovu njenog imena
function columnIndex(columnName) {
    const columns = {
        'BrojPutnika': 1,
        'UkupnaCena': 2,
        'Status': 3
        // Dodaj ostale kolone po potrebi
    };
    return columns[columnName];
}
