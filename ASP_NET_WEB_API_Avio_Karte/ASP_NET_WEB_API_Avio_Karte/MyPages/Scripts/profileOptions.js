$(function () {
    getReady();
    profileOptions();
})

function getReady() {
    if (!localStorage.getItem('token'))
        window.location = '/MyPages/index.html';
}

async function profileOptions() {
    
    if (localStorage.getItem('token')) {
        if (!localStorage.getItem('role')) {
            await $.ajax({
                url: '/api/role/' + localStorage.getItem('token'),
                method: "GET",
                success: function (data, status) { localStorage.setItem('role', data) },
                error: (xhr) => { console.log(xhr.responseText); }
            });
        }
        var role = localStorage.getItem('role');
        if (role === "Administrator") {
            $('#options').append(`<div class="row">
                                    <a href="usersAdminControll.html">Korisnici</a>
                                  </div>
                                  <div class="row">
                                    <a href="dodajIzmeniAviokompaniju.html">Kompanije</a>
                                  </div>
                                  <div class="row">
                                    <a href="letAdminControll.html">Letovi</a>
                                  </div>
                                  <div class="row">
                                    <a href="rezervacijeAdminControl.html">Rezervacije</a>
                                  </div>
                                  <div class="row">
                                    <a href="recenzijeAdminControl.html">Recenzije</a>
                                  </div>
                                `);
        }
        else if (role === "Putnik") {
            $('#options').append(`<div class="row">
                                    <a href="userLetovi.html">Letovi</a>
                                  </div>
                                  <div class="row">
                                    <a href="userRezervacije.html">Rezervacije</a>
                                  </div>
                                  
                                `);
        }
        
    } 
}