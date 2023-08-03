const nameInput = $('#name');

const ipInfoResp = function() {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        return resp;
    });
};

console.log('ipInfoResp.ip');

$(document).ready(function () {

    console.log(ipInfoResp.ip);

    nameInput.on('change blur', function() {
        const value = nameInput.val();
        console.log(nameInput.val());


        if (value === "") {
            nameInput.removeClass("success");
            nameInput.removeClass("error");
        } else if (/^[a-zA-Z\W]+$/.test(value)) {
            nameInput.addClass("success");
            nameInput.removeClass("error");
        } else if (/^[0-9]+$/.test(value)) {
            nameInput.addClass("error");
            nameInput.removeClass("success");
        } else {
            nameInput.addClass("success");
            nameInput.removeClass("error");
        }
    });



});