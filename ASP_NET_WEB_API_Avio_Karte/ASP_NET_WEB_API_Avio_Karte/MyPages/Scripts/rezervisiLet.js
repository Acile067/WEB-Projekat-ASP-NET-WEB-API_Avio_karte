$(function () {
    getReady();
    loadLet();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/login.html';
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function loadLet() {
    var id = getUrlParameter('id');
    if (id) {
        $.ajax({
            url: '/api/let/' + id,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            success: function (data) {
                var tableRow = `
                    <tr>
                        <td>${data.Aviokompanija}</td>
                        <td>${data.PolaznaDestinacija}</td>
                        <td>${data.OdredistnaDestinacija}</td>
                        <td>${data.DatumPolaska}</td>
                        <td>${data.VremePolaska}</td>
                        <td>${data.DatumDolaska}</td>
                        <td>${data.VremeDolaska}</td>
                        <td>${data.BrojSlobodnihMesta}</td>
                        <td>${data.BrojZauzetihMesta}</td>
                        <td>${data.Cena}</td>
                    </tr>`;
                $('#letoviTable tbody').append(tableRow);
            },
            error: function (error) {
                console.log(error);
                alert('Neuspelo ucitavanje aviokompanija');
            }
        });
    } else {
        alert('Ne postoji ID u URL');
    }
}