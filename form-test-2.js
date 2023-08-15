//const nameInput = $('[ip-name]');
const phoneInput = $('#phone');
const ipInfoResp = async function fetchIpapiJSON() {
    const response = await fetch('https://ipapi.co/json/');
    return await response.json();
};

$(document).ready(function () {

    console.log(ipInfoResp);

    phoneInput.intlTelInput ({
        autoHideDialCode: true,
        separateDialCode: true,
        nationalMode: true,
        initialCountry: "us",
        geoIpLookup: ipInfoResp.country_code,
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

