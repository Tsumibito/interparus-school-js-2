//const nameInput = $('[ip-name]');
const phoneInput = $('#phone');
var test = [];

/*
async function fetchIpapiJSON() {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

const ipInfoResp = fetchIpapiJSON().then(json);
console.log(ipInfoResp);
*/

const ipInfoRespCC = fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
        console.log('In func: ', data);
        return data;
    });


$(document).ready(function () {

    window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data =>  callback(data.country_code))
                .catch(() => callback("us"));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.min.js" // just for formatting/placeholders etc
    });

    console.log('In doc: ', test);


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

