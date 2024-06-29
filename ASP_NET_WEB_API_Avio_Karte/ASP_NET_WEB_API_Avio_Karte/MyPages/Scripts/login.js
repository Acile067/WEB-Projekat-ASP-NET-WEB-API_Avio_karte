$(function () {
    getReady();
    login();
});

function getReady() {
    if (localStorage.getItem('token')) {
        localStorage.clear();
        window.location = '/MyPages/index.html';
    }
}

function check(id) {
    let prop = $('#' + id).val();
    if (!prop || prop.trim() === '') {
        $('#' + id).css('border-color', 'red');
        return false;
    }
    $('#' + id).css('border-color', 'black');
    return true;
}

function login() {
    $('#loginbtn').on('click', function () {
        if (!check('korisnickoime') || !check('lozinka')) {
            alert('Sva polja moraju biti popunjena!');
            return;
        }

        let data = { 'korisnickoime': $('#korisnickoime').val(), 'lozinka': $('#lozinka').val() };
        $.post('/api/login', data, function (result) {
            localStorage.clear();
            localStorage.setItem('token', result);
            localStorage.setItem('korisnickoime', $('#korisnickoime').val());
            window.location = '/MyPages/index.html';
        }).fail(function (xhr, status, err) {
            alert("Lose uneti podaci");
        });
    });
}