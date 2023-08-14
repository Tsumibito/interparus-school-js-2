const nameInput = $('[ip-name]');
const phoneInput = $('#phone');

console.log('ipInfoResp.ip');
console.log('ipInfoResp.ip-2223');

const ipInfoResp = $.getJSON( "https://ipapi.co/json/", function( json ) {
    console.log( "JSON Data: " + json.ip );
    return json
});

$('#phone').intlTelInput ({
    autoHideDialCode: true,
    separateDialCode: true,
    nationalMode: true,
    initialCountry: "auto",
    // geoIpLookup: ipInfoResp.country_code,
});

$(document).ready(function () {

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