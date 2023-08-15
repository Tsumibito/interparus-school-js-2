//const nameInput = $('[ip-name]');
const phoneInput = $('#phone');
var obj = {"country_code":"ca",};


ipInfo()
    fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
            obj = data;
            console.log('In func: ', obj.country_code);
            return obj;
        })
        .catch(failureCallback)


const ipInfoResp = ipInfo();

$(document).ready(function () {

    console.log('In doc: ', window.ipInfoResp);

    phoneInput.intlTelInput({
        initialCountry: "auto",
        formatOnDisplay:true,
        nationalMode: false,
        showFlags:false,
        preferredCountries: ["de","fr","ua" ],
        responsiveDropdown: false,
        geoIpLookup: function(cb){
            cb( ipInfoResp.country_code);
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.min.js",
    });

    //ipInfoResp.resolve().then(() => phoneInput.selectCountry(ipInfoResp.country_code));





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

