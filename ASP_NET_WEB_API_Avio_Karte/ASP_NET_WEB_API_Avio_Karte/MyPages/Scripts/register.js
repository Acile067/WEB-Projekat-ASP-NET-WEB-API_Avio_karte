$(function () {
    getReady();
    register();
});

function getReady() {
    if (sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';  
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

function checkAll(list) {
    let goodInput = true;
    for (i in list)
        if (!check(list[i]))
            goodInput = false;

    if (!goodInput) alert("Sva polja moraju biti pravilno popunjena!");
    return goodInput;
}

function register() {
    $(document).on('click', '#register', function () {
        if (checkAll(['ime', 'prezime', 'korisnickoime', 'lozinka', 'datumrodjenja', 'pol', 'email'])) {
            data = {
                'ime': $('#ime').val(),
                'prezime': $('#prezime').val(),
                'korisnickoime': $('#korisnickoime').val(),
                'lozinka': $('#lozinka').val(),
                'datumrodjenja': $('#datumrodjenja').val(),
                'pol': $('#pol').val(),
                'email': $('#email').val(),
            };

            if (!data.email.match('.+@.+\..*')) {
                alert("Nevalidno unesena email adresa");
                return;
            }
            $.post('/api/user', data, function (result) {
                alert("Uspesno registrovanje korisnika " + data.korisnickoime);
                window.location = '/MyPages/login.html';
            }).fail(function (xhr, status, err) {
                alert(xhr.responseJSON.Message);
            });
        }
    });
}