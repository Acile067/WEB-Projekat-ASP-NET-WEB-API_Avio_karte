$(function () {
    getReady();
    fetchKreirane();
    fetchOdobreneOdbijene();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
        window.location = '/MyPages/index.html';
}

async function fetchKreirane() {
    if (sessionStorage.getItem('token')) {
        try {
            const response = await $.ajax({
                url: '/api/kreiranerecenzije',
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            populateKreirane(response);
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju recenzija");
        }
    }
}


function populateKreirane(users) {
    const usersTableBody = $('#recenzije-sve');
    usersTableBody.empty();
    users.forEach(user => {
        const slika = user.Slika ? `<img src="${user.Slika}" alt="Recenzija slika" style="width: 150px; height: 150px; border-radius: 50%;" class="img-fluid" />` : '';
        usersTableBody.append(`
            <div class="row justify-content-center text-center rounded shadow mb-3 mt-3">
                <div class="row justify-content-center text-center">
                    <div class="col-sm-12 col-md-8 col-lg-12">
                        ${slika}
                    </div>
                </div>
                <div class="row justify-content-center text-center">
                    <p class="fw-bold mb-0 h5">${user.Korisnik}</p>
                </div>
                <div class="row justify-content-center text-center">
                    <p>${user.Aviokompanija}</p>
                </div>
                <div class="row justify-content-center text-center">
                    <h4>${user.Naslov}</h4>
                </div>
                <div class="row justify-content-center text-center">
                    <div class="col-lg-6 col-md-9 col-sm-12">
                        <p>${user.Sadrzaj}</p>
                    </div>
                </div>
                <div class="row justify-content-center text-center">
                    <p>Ocena: ${user.Ocena}</p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-sm-12 col-md-8 col-lg-12">
                    <div class="row justify-content-center">
                        <div class="col-lg-4 col-md-9 col-sm-9 justify-content-center d-flex mt-2">
                            <input type="submit" value="Odobri" data-id="${user.Id}" class="form-control rounded-pill border-black mt-4 fw-bold bg-success odobri-dugme" />
                        </div>
                        <div class="col-lg-4 col-md-9 col-sm-9 justify-content-center d-flex mt-2">
                            <input type="submit" value="Otkazi" data-id="${user.Id}" class="form-control rounded-pill border-black mt-4 fw-bold bg-danger otkazi-dugme" />
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    // Dodavanje event listener-a za dugme "Odobri"
    $('.odobri-dugme').on('click', function () {
        const recenzijaId = $(this).data('id');
        updateStatusRecenzije(recenzijaId, 'Odobrena');
    });

    // Dodavanje event listener-a za dugme "Otkazi"
    $('.otkazi-dugme').on('click', function () {
        const recenzijaId = $(this).data('id');
        updateStatusRecenzije(recenzijaId, 'Odbijena');
    });
}

async function updateStatusRecenzije(recenzijaId, status) {
    if (sessionStorage.getItem('token')) {
        try {
            await $.ajax({
                url: `/api/recenzija/${recenzijaId}/status`,
                method: 'PUT',
                data: JSON.stringify({ status: status }),
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                success: function (data) {
                    alert('Status recenzije je uspešno ažuriran.');
                    fetchKreirane(); // Osvježavanje liste nakon promene statusa
                    fetchOdobreneOdbijene();
                },
                error: function (xhr) {
                    console.error('Greška pri ažuriranju statusa:', xhr.responseText);
                    alert('Došlo je do greške pri ažuriranju statusa.');
                }
            });
        } catch (error) {
            console.error('Greška pri ažuriranju statusa:', error);
            alert('Došlo je do greške pri ažuriranju statusa.');
        }
    }
}



async function fetchOdobreneOdbijene() {
    if (sessionStorage.getItem('token')) {
        try {
            const response = await $.ajax({
                url: '/api/odobreneodbijenerecenzije',
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            populateOdobreneOdbijene(response);
        } catch (error) {
            console.log(error);
            alert("Greška pri učitavanju odobrenih/odbijenih recenzija");
        }
    }
}

function populateOdobreneOdbijene(users) {
    const usersTableBody = $('#recenzije-odbijene-odobrene');
    usersTableBody.empty();

    users.forEach((user, index) => {
        let activeClass = index === 0 ? 'active' : '';
        let textStatus = user.StatusRecenzije === 1 ? '<p class="text-success">Odobrena</p>' : '<p class="text-danger">Odbijena</p>'
        const slika = user.Slika ? `<img src="${user.Slika}" alt="Recenzija slika" style="width: 150px; height: 150px; border-radius: 50%;" class="img-fluid" />` : '';
        usersTableBody.append(`
            <div class="carousel-item ${activeClass}">
                <div class="row justify-content-center text-center rounded mb-3 mt-3">
                    <div class="col-sm-12 col-md-8 col-lg-12">
                        ${slika}
                    </div>
                    <div class="col-12">
                        <p class="fw-bold mb-0 h5">${user.Korisnik}</p>
                        <p>${user.Aviokompanija}</p>
                        <h4>${user.Naslov}</h4>
                        <div class="col-lg-6 col-md-9 col-sm-12 mx-auto">
                            <p>${user.Sadrzaj}</p>
                        </div>
                        <p>Ocena: ${user.Ocena}</p>
                        ${textStatus}
                    </div>
                </div>        
            </div>
        `);
    });
}


