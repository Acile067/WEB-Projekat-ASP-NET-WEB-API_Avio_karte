$(function () {
    getReady();
    register();
});
function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
    if (sessionStorage.getItem('role') != 'Administrator')
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

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function register() {
    var kompanijaId = getUrlParameter('kompanija');
    $(document).on('click', '#dodajlet', function () {
        if (checkAll(['polazak', 'odrediste', 'poletanje', 'vremepolaska', 'sletanje', 'vremesletanja', 'mesta', 'cena'])) {
            data = {
                'AviokompanijaId': kompanijaId,
                'polaznadestinacija': $('#polazak').val(),
                'odredistnadestinacija': $('#odrediste').val(),
                'datumpolaska': $('#poletanje').val(),
                'vremepolaska': $('#vremepolaska').val(),
                'datumdolaska': $('#sletanje').val(),
                'vremedolaska': $('#vremesletanja').val(),
                'brojslobodnihmesta': $('#mesta').val(),
                'cena': $('#cena').val(),
            };
            $.post('/api/let', data, function (result) {
                alert("Uspesno dodan let ");
                window.location = '/MyPages/letAdminControll.html';
            }).fail(function (xhr, status, err) {
                alert(xhr.responseJSON.Message);
            });
        }
    });
}