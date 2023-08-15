const nameInput = $('[ip-name]'),
      lastnameInput = $('[ip-lastname]'),
      emailInput = $('[ip-email]'),
      phoneInput = $('#phone');

var ipInfo;

var NameValidationResult = false,
    LastNameValidationResult = false,
    EmailValidationResult = false,
    PhoneValidationResult = false;

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
                nameInput.addClass("error");
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
                lastnameInput.addClass("error");
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
    
        emailInput.on('change blur', function() {
            const value = emailInput.val();

            if (value === "") {
                emailInput.addClass("error");
                emailInput.removeClass("success");
                EmailValidationResult = false;
            } else if (!/^[^!#$%&~]*[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                emailInput.addClass("error");
                emailInput.removeClass("success");
                EmailValidationResult = false;
            } else {
                emailInput.addClass("success");
                emailInput.removeClass("error");
                EmailValidationResult = true;
            }
        });

        phoneInput.on('change blur', function() {
            const value = phoneInput.val();

            if (value === "") {
                phoneInput.addClass("error");
                phoneInput.removeClass("success");
                PhoneValidationResult = false;
            } else if (!/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(value)) {
                phoneInput.addClass("error");
                phoneInput.removeClass("success");
                PhoneValidationResult = false;
            } else {
                phoneInput.addClass("success");
                phoneInput.removeClass("error");
                PhoneValidationResult = true;
            }
        });
});

