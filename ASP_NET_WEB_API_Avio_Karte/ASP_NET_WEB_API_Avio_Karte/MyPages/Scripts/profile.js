$(function () {
    getReady();
    fillBlanks();
    change();
});

function getReady() {
    if (!localStorage.getItem('token'))
        window.location = '/MyPages/index.html';
}

function fillBlanks() {
    let token = localStorage.getItem('token');
    if (token) {
        $.get('/api/user/' + token, function (data, status) {
            if (data) {
                $('#ime').val(data.Ime);
                $('#prezime').val(data.Prezime);
                $('#korisnickoime').val(data.KorisnickoIme);
                $('#email').val(data.Email);
                $('#lozinka').val(data.Lozinka);

                $('#pol').val(data.Pol.toString());
                
                let date = data.DatumRodjenja;
                const splited = date.split("/");
                $('#datumrodjenja').val(`${splited[2]}-${splited[1]}-${splited[0]}`);
            }
        });
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

function checkAll(list) {
    let goodInput = true;
    for (i in list)
        if (!check(list[i]))
            goodInput = false;

    if (!goodInput) alert("Sva polja moraju biti pravilno popunjena!");
    return goodInput;
}
function change() {
    let token = localStorage.getItem('token');
    if (token) {
        $(document).on('click', '#editbtn', function () {
            if (checkAll(['ime', 'prezime', 'korisnickoime', 'email', 'lozinka', 'pol', 'datumrodjenja'])) {
                $.ajax({
                    url: '/api/user/' + token,
                    method: 'PUT',
                    datatype: JSON,
                    data: {
                        'ime': $('#ime').val(),
                        'prezime': $('#prezime').val(),
                        'korisnickoime': $('#korisnickoime').val(),
                        'email': $('#email').val(),
                        'lozinka': $('#lozinka').val(),
                        'pol': parseInt($('#pol').val()),
                        'datumrodjenja': $('#datumrodjenja').val()
                    },
                    success: (result) => { alert("Uspesno izmenjeni podaci"); },
                    error: (xhr, status, err) => { alert(xhr.responseJSON.Message); }
                });
            }
        });
    }
}