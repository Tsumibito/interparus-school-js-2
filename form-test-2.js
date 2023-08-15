const nameInput = $('[ip-name]'),
      lastnameInput = $('[ip-lastname]'),
      phoneInput = $('#phone');

var ipInfo;

var NameValidationResult = false,
    LastNameValidationResult = false,
    EmailValidationResult = false,
    PhoneValidationResult = false,
    MessageValidationResult = false;

$(document).ready(function () {

    phoneInput.intlTelInput({
        initialCountry: "auto",
        formatOnDisplay:true,
        nationalMode: false,
        showFlags:false,
        preferredCountries: ["de","fr","ua" ],
        responsiveDropdown: false,
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => {
                    callback(data.country_code)
                    ipInfo = data
                    console.log(ipInfo);
                })
                .catch(() => callback("ca"));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.min.js",
    });

        nameInput.on('change blur', function() {
            const value = nameInput.val();
            console.log("nameInput: ", ipInfo.country_code);

            if (value === "") {
                nameInput.removeClass("success");
                nameInput.removeClass("error");
                NameValidationResult = false;
            } else if (/^[a-zA-Z\W]+$/.test(value)) {
                nameInput.addClass("success");
                nameInput.removeClass("error");
                NameValidationResult = true;
            } else if (/^[0-9]+$/.test(value)) {
                nameInput.addClass("error");
                nameInput.removeClass("success");
                NameValidationResult = false;
            } else {
                nameInput.addClass("success");
                nameInput.removeClass("error");
                NameValidationResult = true;
            }
        });

        lastnameInput.on('change blur', function() {
            const value = lastnameInput.val();

            if (value === "") {
                lastnameInput.removeClass("success");
                lastnameInput.removeClass("error");
                LastNameValidationResult = false;
            } else if (/^[a-zA-Z\W]+$/.test(value)) {
                lastnameInput.addClass("success");
                lastnameInput.removeClass("error");
                LastNameValidationResult = true;
            } else if (/^[0-9]+$/.test(value)) {
                lastnameInput.addClass("error");
                lastnameInput.removeClass("success");
                LastNameValidationResult = false;
            } else {
                lastnameInput.addClass("success");
                lastnameInput.removeClass("error");
                LastNameValidationResult = true;
            }
        });


});

