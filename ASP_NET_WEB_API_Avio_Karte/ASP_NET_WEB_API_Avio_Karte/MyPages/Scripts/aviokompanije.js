$(function () {
    fetchKompanije();
});

async function fetchKompanije() {
    try {
        const response = await $.ajax({
            url: '/api/aviokompanije',  // API endpoint koji vraća podatke o aviokompanijama
            method: "GET",
        });
        populateUserTable(response);
    } catch (error) {
        console.log(error);
        alert("Greška pri učitavanju aviokompanija");
    }
}

function populateUserTable(users) {
    const usersTableBody = $('#kompanije-sve-recenzije');
    usersTableBody.empty();

    users.forEach((user, index) => {
        // Prvo dodajemo informacije o aviokompaniji
        usersTableBody.append(`
            <div class="row mb-4">
                <h1>${user.Naziv}</h1>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <p><b>Adresa:</b> ${user.Adresa}</p>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <p><b>Telefon:</b> ${user.Telefon}</p>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <p><b>Email:</b> ${user.Email}</p>
                </div>
            </div>
            <div id="carousel-${index}" class="carousel carousel-dark slide shadow rounded mb-5" data-bs-ride="carousel">
                <div class="carousel-inner" id="recenzije-${index}">
                    <!-- Recenzije će biti ubačene ovde -->
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `);

        const recenzijeBody = $(`#recenzije-${index}`);
        let recenzijeCount = 0;

        user.Recenzije.forEach((recenzija, recIndex) => {
            if (recenzija.StatusRecenzije === 1) {
                const activeClass = recenzijeCount === 0 ? 'active' : '';
                const slika = recenzija.Slika ? `<img src="${recenzija.Slika}" alt="Recenzija slika" style="width: 150px; height: 150px; border-radius: 50%;" class="img-fluid" />` : '';

                recenzijeBody.append(`
                    <div class="carousel-item ${activeClass}">
                        <div class="row justify-content-center text-center rounded mb-3 mt-3">
                            <div class="col-sm-12 col-md-8 col-lg-12">
                                ${slika}
                            </div>
                            <div class="col-12">
                                <p class="fw-bold mb-0 h5">${recenzija.Korisnik}</p>
                                <p>${recenzija.Aviokompanija}</p>
                                <h4>${recenzija.Naslov}</h4>
                                <div class="col-lg-6 col-md-9 col-sm-12 mx-auto">
                                    <p>${recenzija.Sadrzaj}</p>
                                </div>
                                <p>Ocena: ${recenzija.Ocena}</p>
                            </div>
                        </div>        
                    </div>
                `);

                recenzijeCount++;
            }
        });

        // Ako nema odobrenih recenzija, dodajemo poruku
        if (recenzijeCount === 0) {
            recenzijeBody.append(`
                <div class="carousel-item active">
                    <div class="row justify-content-center text-center rounded mb-3 mt-3">
                        <div class="col-12">
                            <p class="text-muted">Nema recenzija za ovu aviokompaniju.</p>
                        </div>
                    </div>        
                </div>
            `);
        }
    });
}
