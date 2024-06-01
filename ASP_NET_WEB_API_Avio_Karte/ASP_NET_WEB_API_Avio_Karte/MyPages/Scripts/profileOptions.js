$(function () {
    getReady();
    profileOptions();
})

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
}

async function profileOptions() {
    
    if (sessionStorage.getItem('token')) {
        if (!sessionStorage.getItem('role')) {
            await $.ajax({
                url: '/api/role/' + sessionStorage.getItem('token'),
                method: "GET",
                success: function (data, status) { sessionStorage.setItem('role', data) },
                error: (xhr) => { console.log(xhr.responseText); }
            });
        }
        var role = sessionStorage.getItem('role');
        if (role === "Administrator") {
            $('#options').append(`<div class="row">
                                    <a href="usersAdminControll.html">Korisnici</a>
                                  </div>
                                  <div class="row">
                                    <a href="dodajIzmeniAviokompaniju.html">Aviokompanije</a>
                                  </div>
                                `);
        }
        else if (role === "Putnik") {
            $('#options').append(`<div class="row">
                                    <a href="userReviews.html">Recenzije</a>
                                  </div>
                                `);
        }
        
    } 
}