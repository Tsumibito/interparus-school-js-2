$(document).ready(() => {
    // Проверяем наличие основных элементов
    if ($('#ob_form').length && $('#ob_button').length) {
        const nameInput = $('[ip-name]'),
            lastnameInput = $('[ip-lastname]'),
            emailInput = $('[ip-email]'),
            phoneInput = $('#phone'),
            messageInput = $('[ip-message]'),
            pageUrl = $(location).attr('href'),
            cleanUrl = pageUrl.split('#')[0].split('?')[0],
            pageForm = $('#ob_form'),
            formButton = $('#ob_button'),
            formErrorMsg = $('#form-error-msg'),
            formValidMsg = $('#form-valid-msg'),
            BrandInterest = 'None',
            ProductInterest = 'None';

        const pageLang = (() => {
            if (pageUrl.includes('interparus.com/en/')) return 'EN';
            if (pageUrl.includes('interparus.com/ua/')) return 'UA';
            if (pageUrl.includes('interparus.com/')) return 'RU';
            return 'None';
        })();

        const thankYouPageUrl = (() => {
            const domainPattern = /(https?:\/\/[^\/]*interparus\.com)(\/en|\/ua)?/;
            const match = pageUrl.match(domainPattern);
            if (match) {
                const domain = match[1];
                const langPrefix = match[2] || '';
                return `${domain}${langPrefix}/catalog-request`;
            }
            return 'None';
        })();

        const pageAddInfo = (() => {
            const domainPattern = /(interparus\.com)(\/en|\/ua)?/;
            const match = pageUrl.match(domainPattern);
            if (match) {
                return match[1] + (match[2] || '');
            }
            return 'None';
        })();

        let ipInfo,
            NameValidationResult = false,
            LastNameValidationResult = false,
            EmailValidationResult = false,
            PhoneValidationResult = false;

        function setCookie(name, value, days) {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            document.cookie = name + '=; Max-Age=-99999999;';
        }

        function UrlParams(pageUrl, paramName) {
            const params = new URLSearchParams(pageUrl.split('?')[1]);

            if (params.has(paramName)) {
                const paramValue = params.get(paramName);
                setCookie(paramName, paramValue, 1);
                return paramValue;
            } else {
                const cookieValue = getCookie(paramName);
                return cookieValue ? cookieValue : 'None';
            }
        }

        function GetIpInfo(ipInfo, paramName) {
            return ipInfo.hasOwnProperty(paramName) ? ipInfo[paramName] : 'None';
        }

        function extractPathFromUrl(url) {
            const pattern = /https?:\/\/interparus\.com(?:\/en|\/ua)?\/([^?#]+)/;
            const match = url.match(pattern);
            return match ? match[1] : 'None';
        }

        function SubmitForm() {
            const apiUrl = "https://hooks.zapier.com/hooks/catch/12700623/bw8yjyy/",
                date = new Date();

            const formData = {},
                fullPhoneInput = $('input[name="full_phone"]');

            if (NameValidationResult && LastNameValidationResult && EmailValidationResult && PhoneValidationResult) {
                formData.ordercode = date.valueOf();
                formData.clientnamefirst = nameInput.val();
                formData.clientnamelast = lastnameInput.val();
                formData.clientemail = emailInput.val();
                formData.clientphone = fullPhoneInput.val();
                formData.customorder_source_url = cleanUrl;
                formData.customorder_ga_code = "None";
                formData.customorder_lead_IP = GetIpInfo(ipInfo, 'ip');
                formData.customorder_lead_country = GetIpInfo(ipInfo, 'country');
                formData.customorder_lead_form_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                formData.customorder_lead_region = GetIpInfo(ipInfo, 'region');
                formData.customorder_lead_city = GetIpInfo(ipInfo, 'city');
                formData.customorder_lead_location = `Latitude: ${GetIpInfo(ipInfo, 'latitude')}, Longitude: ${GetIpInfo(ipInfo, 'longitude')}`;
                formData.customorder_lead_timezone = GetIpInfo(ipInfo, 'timezone');
                formData.customorder_lead_provider = GetIpInfo(ipInfo, 'org');
                formData.customorder_lead_hostname = GetIpInfo(ipInfo, 'country_calling_code');
                formData.customorder_utm_source = UrlParams(pageUrl, 'utm_source');
                formData.customorder_utm_medium = UrlParams(pageUrl, 'utm_medium');
                formData.customorder_utm_campaign = UrlParams(pageUrl, 'utm_campaign');
                formData.customorder_utm_content = UrlParams(pageUrl, 'utm_content');
                formData.customorder_utm_term = UrlParams(pageUrl, 'utm_term');
                formData.customorder_form_name = nameInput.val();
                formData.customorder_form_lastname = lastnameInput.val();
                formData.customorder_lead_form_lang = pageLang;
                formData.customorder_form_message = messageInput.val();
                formData.customorder_url_data = extractPathFromUrl(cleanUrl);

                const queryString = Object.keys(formData).map(key => key + '=' + encodeURIComponent(formData[key])).join('&');

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: queryString
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error("Ошибка:", error);
                    });

                formButton.attr('go', true);

                setTimeout(() => {
                    window.location.replace(thankYouPageUrl);
                }, 1000);
            } else {
                console.log('Ошибка при отправке формы');
                formButton.attr('disabled', true);
                formErrorMsg.removeClass('hide');
            }
        }

        phoneInput.intlTelInput({
            initialCountry: "auto",
            formatOnDisplay: true,
            nationalMode: false,
            showFlags: false,
            hiddenInput: "full_phone",
            preferredCountries: ["de", "fr", "ua"],
            responsiveDropdown: false,
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json")
                    .then(res => res.json())
                    .then(data => {
                        callback(data.country_code);
                        ipInfo = data;
                    })
                    .catch(() => callback("ca"));
            },
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.min.js",
        });

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
            }
        });

        phoneInput.on('change blur', function() {
            const value = phoneInput.val();

            if (value === "") {
                phoneInput.addClass("error");
                phoneInput.removeClass("success");
                PhoneValidationResult = false;
                $("#phone-error-msg").removeClass("hide");
            } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(value)) {
                phoneInput.addClass("error");
                phoneInput.removeClass("success");
                $("#phone-error-msg").removeClass("hide");
                PhoneValidationResult = false;
            } else {
                phoneInput.addClass("success");
                phoneInput.removeClass("error");
                $("#phone-error-msg").addClass("hide");
                PhoneValidationResult = true;
            }
        });

        phoneInput.on("blur countrychange", function() {
            const fullPhoneInput = $('input[name="full_phone"]');

            let fullNumber = phoneInput.intlTelInput("getNumber");
            fullPhoneInput.val(fullNumber);
        });

        formButton.click(e => {
            e.preventDefault();
            SubmitForm();
        });

        pageForm.submit(e => {
            e.preventDefault();
            SubmitForm();
        });
    }
});
