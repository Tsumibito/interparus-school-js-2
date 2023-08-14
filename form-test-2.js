const nameInput = $('[ip-name]');
const phoneInput = $('#phone');



const ipInfoResp = $.getJSON( "https://ipapi.co/json/", function( json ) {
    console.log( "JSON Data: " + json.ip );
    return json
});




$(document).ready(function () {

    phoneInput.intlTelInput ({
        autoHideDialCode: true,
        separateDialCode: true,
        nationalMode: true,
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("us"));
        }, //ipInfoResp.country_code,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.min.js",
    });




    /*
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

 */
});

