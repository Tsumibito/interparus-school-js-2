$(document).ready(() => {
    const nameInput = $('[ip-name]'),
          lastnameInput = $('[ip-lastname]'),
          emailInput = $('[ip-email]'),
          phoneInput = $('[ip-phone]'),
          pageUrl = $(location).attr('href'),
          cleanUrl = pageUrl.split('#')[0].split('?')[0],
          pageForm = $('[ob_form_main]'),
          formButton = $('[ob_button]'),
          formErrorMsg = $('#form-error-msg'),
          formValidMsg = $('#form-valid-msg'),
          BrandInterest = "Interparus School";

    const pageUrlT = pageUrl,
          cleanUrlT = cleanUrl,
          thankYouPageUrl = getThankYouPageUrl(cleanUrlT);

    let ipInfo,
        NameValidationResult = false,
        LastNameValidationResult = false,
        EmailValidationResult = false,
        PhoneValidationResult = false;

    function getThankYouPageUrl(cleanUrl) {
        const domainPattern = /(https?:\/\/[^\/]*interparus-school\.com)(\/(en|ua))?/;
        const match = cleanUrl.match(domainPattern);
        if (match) {
            const languageSegment = match[3] || ''; 
            return languageSegment ? `${match[1]}/${languageSegment}/thank-you` : `${match[1]}/thank-you`;
        } else {
            return 'None';
        }
    }

    const ProductCatalogue = {
        "/atlantique": "Atlantique",
        "/": "School Main",
        "/inshore-skipper-sail": "Inshore Skipper Sail",
        "/offshore-skipper-sail": "Offshore Skipper Sail",
        "/master-of-yacht-sail": "Master of Yacht Sail", 
        "/inshore-skipper-power": "Inshore Skipper Sail",
        "/offshore-skipper-power": "Offshore Skipper Power",
        "/charter": "Charter",
        "/gift-certificates": "Gift Certificates",
        "/mezhdunarodnye-prava-na-yahtu": "Международные права на яхту"
    };

    function GetProductInterest(pageUrl) {
        const path = new URL(pageUrl).pathname;
        return ProductCatalogue[path] || 'None';
    };

    const ProductInterest = GetProductInterest(cleanUrl);

    const pageLang = pageUrl.includes('interparus-school.com/ua') ? 'UA' :
                     pageUrl.includes('interparus-school.com/en') ? 'EN' :
                     'RU';
    const pageAddInfo = (() => {
        const domainPattern = /(www\.interparus-school\.com)/;
        const match = pageUrl.match(domainPattern);
        return match ? match[0] : 'None';
    })();

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {   
        document.cookie = name + '=; Max-Age=-99999999;';  
    }

    function UrlParams(pageUrl, paramName) {
        var params = new URLSearchParams(pageUrl.split('?')[1]);
        if (params.has(paramName)) {
            var paramValue = params.get(paramName);
            setCookie(paramName, paramValue, 1);
            return paramValue;
        } else {
            var cookieValue = getCookie(paramName);
            return cookieValue ? cookieValue : 'None';
        }
    }


    function SubmitForm() {
        formButton.prop('disabled', true).text('Отправка...');

        if (NameValidationResult && LastNameValidationResult && EmailValidationResult && PhoneValidationResult) {
            const formData = {
                ordercode: Date.now(),
                clientnamefirst: nameInput.val(),
                clientnamelast: lastnameInput.val(),
                clientemail: emailInput.val(),
                clientphone: phoneInput.intlTelInput("getNumber"),
                customorder_source_url: cleanUrl,
                customorder_ga_code: "None",
                customorder_lead_IP: GetIpInfo(ipInfo, 'ip'),
                customorder_source_add_info: pageAddInfo,
                customorder_lead_country: GetIpInfo(ipInfo, 'country'),
                customorder_lead_form_date: new Date().toISOString().split('T')[0],
                customorder_lead_region: GetIpInfo(ipInfo, 'region'),
                customorder_lead_city: GetIpInfo(ipInfo, 'city'),
                customorder_lead_location: `Latitude: ${GetIpInfo(ipInfo, 'latitude')}, Longitude: ${GetIpInfo(ipInfo, 'longitude')}`,
                customorder_lead_timezone: GetIpInfo(ipInfo, 'timezone'),
                customorder_lead_provider: GetIpInfo(ipInfo, 'org'),
                customorder_lead_hostname: GetIpInfo(ipInfo, 'country_calling_code'),
                customorder_utm_source: UrlParams(pageUrl, 'utm_source'),
                customorder_utm_medium: UrlParams(pageUrl, 'utm_medium'),
                customorder_utm_campaign: UrlParams(pageUrl, 'utm_campaign'),
                customorder_utm_content: UrlParams(pageUrl, 'utm_content'),
                customorder_utm_term: UrlParams(pageUrl, 'utm_term'),
                customorder_form_name: nameInput.val(),
                customorder_form_lastname: lastnameInput.val(),
                customorder_lead_form_lang: pageLang,
                customorder_form_message: '',
                customorder_brand_interest: BrandInterest,
                customorder_product_interest: ProductInterest
            };

            const queryString = $.param(formData);

            dataLayer.push({
                'event': 'clientInfoEvent',
                'clientEmail': formData.clientemail,
                'clientNameFirst': formData.clientnamefirst,
                'clientNameLast': formData.clientnamelast,
                'clientPhone': formData.clientphone,
                'customOrderLeadCountry': formData.customorder_lead_country,
                'customOrderLeadFormLang': formData.customorder_lead_form_lang
            });

            $.ajax({
                type: "POST",
                url: "https://hooks.zapier.com/hooks/catch/12700623/bazia5v/",
                data: queryString,
                success: function(response) {
                    formValidMsg.removeClass('hide');
                    setTimeout(function() {
                        window.location.href = thankYouPageUrl;
                    }, 1000);
                },
                error: function() {
                    formErrorMsg.removeClass('hide');
                    formButton.prop('disabled', false).text('Отправить');
                }
            });
        } else {
            formErrorMsg.removeClass('hide');
            formButton.prop('disabled', false).text('Отправить');
        }
    }

            // Инициализация intlTelInput для поля ввода телефона
        phoneInput.intlTelInput({
            initialCountry: "auto",
            geoIpLookup: function(success, failure) {
                $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "";
                    success(countryCode);
                });
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Путь к utils.js для intlTelInput
        });

        // Валидация полей формы при изменении и потере фокуса
  nameInput.on('change blur', function() {
        const value = nameInput.val();

        if (value === "") {
            nameInput.removeClass("success");
            nameInput.addClass("error");
            $("#name-error-msg").removeClass("hide");
            NameValidationResult = false;
        } else if (/^[a-zA-Z\W]+$/.test(value)) {
            nameInput.addClass("success");
            nameInput.removeClass("error");
            $("#name-error-msg").addClass("hide");
            NameValidationResult = true;
            activateButtonIfAllValid();
        } else if (/^[0-9]+$/.test(value)) {
            nameInput.addClass("error");
            nameInput.removeClass("success");
            $("#name-error-msg").removeClass("hide");
            NameValidationResult = false;
        } else {
            nameInput.addClass("success");
            nameInput.removeClass("error");
            $("#name-error-msg").addClass("hide");
            NameValidationResult = true;
            activateButtonIfAllValid();
        }
    });

    lastnameInput.on('change blur', function() {
        const value = lastnameInput.val();

        if (value === "") {
            lastnameInput.removeClass("success");
            lastnameInput.addClass("error");
            $("#lastname-error-msg").removeClass("hide");
            LastNameValidationResult = false;
        } else if (/^[a-zA-Z\W]+$/.test(value)) {
            lastnameInput.addClass("success");
            lastnameInput.removeClass("error");
            $("#lastname-error-msg").addClass("hide");
            LastNameValidationResult = true;
            activateButtonIfAllValid();
        } else if (/^[0-9]+$/.test(value)) {
            lastnameInput.addClass("error");
            lastnameInput.removeClass("success");
            $("#lastname-error-msg").removeClass("hide");
            LastNameValidationResult = false;
        } else {
            lastnameInput.addClass("success");
            lastnameInput.removeClass("error");
            $("#lastname-error-msg").addClass("hide");
            LastNameValidationResult = true;
            activateButtonIfAllValid();
        }
    });

    emailInput.on('change blur', function() {
        const value = emailInput.val();

        if (value === "") {
            emailInput.addClass("error");
            emailInput.removeClass("success");
            $("#email-error-msg").removeClass("hide");
            EmailValidationResult = false;
        } else if (!/^[^!#$%&~]*[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            emailInput.addClass("error");
            emailInput.removeClass("success");
            $("#email-error-msg").removeClass("hide");
            EmailValidationResult = false;
        } else {
            emailInput.addClass("success");
            emailInput.removeClass("error");
            $("#email-error-msg").addClass("hide");
            EmailValidationResult = true;
            activateButtonIfAllValid();
        }
    });

    phoneInput.on('change blur', function() {
        const value = phoneInput.val();

        if (value === "") {
            phoneInput.addClass("error");
            phoneInput.removeClass("success");
            PhoneValidationResult = false;
            $("#phone-error-msg").removeClass("hide");
            activateButtonIfAllValid();
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(value)) {
            phoneInput.addClass("error");
            phoneInput.removeClass("success");
            $("#phone-error-msg").removeClass("hide");
            PhoneValidationResult = false;
            activateButtonIfAllValid();
        } else {
            phoneInput.addClass("success");
            phoneInput.removeClass("error");
            $("#phone-error-msg").addClass("hide");
            PhoneValidationResult = true;
            activateButtonIfAllValid();
        }
    });

        // Функция для активации кнопки отправки, если все поля прошли валидацию
        function checkFormValidation() {
            if (NameValidationResult && LastNameValidationResult && EmailValidationResult && PhoneValidationResult) {
                formButton.prop('disabled', false);
            } else {
                formButton.prop('disabled', true);
            }
        }

        // Вызов функции проверки валидации при изменении каждого поля
        nameInput.on('input blur', checkFormValidation);
        lastnameInput.on('input blur', checkFormValidation);
        emailInput.on('input blur', checkFormValidation);
        phoneInput.on('blur', checkFormValidation);


    formButton.on('click', function(e) {
        e.preventDefault();
        SubmitForm();
    });

    pageForm.on('submit', function(e) {
        e.preventDefault();
        SubmitForm();
    });
});
