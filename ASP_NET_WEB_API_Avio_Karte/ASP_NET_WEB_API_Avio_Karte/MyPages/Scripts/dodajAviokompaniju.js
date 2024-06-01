$(function () {
    getReady();
});

function getReady() {
    if (!sessionStorage.getItem('token'))
        window.location = '/MyPages/index.html';
}

