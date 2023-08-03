const nameInput = $('#name');

console.log('ipInfoResp.ip');
console.log('ipInfoResp.ip-2222');

const ipInfoRespFunc = function() {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        return resp;
    });
};

const ipInfoResp= ipInfoRespFunc;

$(document).ready(function () {

    console.log(ipInfoResp);
    console.log(ipInfoResp.ip);

    nameInput.on('change blur', function() {
        const value = nameInput.val();
        console.log(nameInput.val());
        console.log(ipInfoResp.ip);

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