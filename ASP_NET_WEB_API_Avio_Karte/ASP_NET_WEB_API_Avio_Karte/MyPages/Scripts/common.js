$(function () {
    navbar();
});


async function navbar() {
    $('ul').empty();
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
            
        }
        else if (role === "Putnik") {
            
        }
        $('ul').append(`<li class="nav-item">
                            <a class="nav-link " href="index.html">Početna</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="aviokompanije.html">Aviokompanije</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="profile.html">Profil</a>
                        </li>
                        <li class="nav-item">
                            <a id="logout" class="nav-link cursor-pointer" href="index.html">Log out</a>
                        </li>
                         `);
        logout();
    } else {
        $('ul').append(`<li class="nav-item">
                            <a class="nav-link " href="index.html">Početna</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="aviokompanije.html">Aviokompanije</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="register.html">Registracija</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="login.html">Login</a>
                        </li>
                         `);
    }
}

function clearSessionAndRedirect() {
    console.log('Clearing session storage');
    sessionStorage.clear();
    console.log('Redirecting to index.html');
    window.location = "/MyPages/index.html";
}

function logout() {
    $(document).on('click', "#logout", async function () {
        let id = sessionStorage.getItem('token');
        console.log('Starting logout for token:', id); // Dodato za logovanje
        try {
            await $.ajax({
                method: 'DELETE',
                url: '/api/logout/' + id
            });
            console.log('Logout successful, clearing session...'); // Dodato za logovanje
            clearSessionAndRedirect();
        } catch (error) {
            console.log(error);
            alert("greška");
        }
    });
}