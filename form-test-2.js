//const nameInput = $('[ip-name]');
const phoneInput = $('#phone');

const ipInfoResp = fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
        console.log('In func: ', data);
        return data;
    });


$(document).ready(function () {

    phoneInput.intlTelInput({
        initialCountry: "auto",
        geoIpLookup: callback => {
           ipInfoResp.country_code;
        },
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

