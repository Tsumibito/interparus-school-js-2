const nameInput = $('[ip-name]');

console.log('ipInfoResp.ip');
console.log('ipInfoResp.ip-2223');

const ipInfoResp = $.getJSON('https://ipapi.co/json/', function(data){
    console.log(data)
})


$(document).ready(function () {

    console.log(ipInfoResp);
    console.log(ipInfoResp[0].ip);

    nameInput.on('change blur', function() {
        const value = nameInput.val();
        console.log(nameInput.val());
        console.log(ipInfoResp[0].ip);

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