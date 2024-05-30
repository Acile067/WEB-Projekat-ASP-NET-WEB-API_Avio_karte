$(function () {
    navbar();
});


function navbar() {
    if (sessionStorage.getItem('token')) {
        if (!sessionStorage.getItem('role')) {
            $.ajax({
                url: '/api/role/' + sessionStorage.getItem('token'),
                async: false,
                method: "GET",
                success: function (data, status) { sessionStorage.setItem('role', data) },
                error: (xhr) => { console.log(xhr.responseText); }
            });
        }
        var role = sessionStorage.getItem('role');
        if (role === "Administrator") {
            
        }
        else if (role === "Putnik") {
            
        }
        $('nav').append(`<a class="nav-link" href="aviokompanije.html">Aviokompanije</a>
                         <a class="nav-link " href="profile.html">Profil</a>
                         <a class="nav-link cursor-pointer" href="index.html" id="logout">Log out</a>`);
        logout();
    }
    else {
        $('nav').append(`<a class="nav-link" href="aviokompanije.html">Aviokompanije</a>
                         <a class="nav-link" href="register.html">Registracija</a>
                         <a class="nav-link" href="login.html" id="test">Login</a>`);
    }

}

function logout() {
    document.getElementById('logout').addEventListener('mouseover', function () {
        this.style.cursor = 'pointer';
    });

    $(document).on('click', "#logout", function () {
        id = sessionStorage.getItem('token');
        $.ajax({
            method: 'DELETE',
            url: '/api/logout/' + id,
            success: function (result) {
                console.log(result);
                window.location = "/MyPages/index.html";
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('role');
            },
            error: function (result) { console.log(result); }
        });
    });
}