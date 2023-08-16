const nameInput = $('[ip-name]'),
    lastnameInput = $('[ip-lastname]'),
    emailInput = $('[ip-email]'),
    phoneInput = $('#phone'),
    fullPhoneInput = $('input[name="full_phone"]'),
    pageUrl = $(location).attr('href'),
    cleanUrl = pageUrl.split('#')[0].split('?')[0],
    pageForm = $('#ob_form'),
    formButton = $('#ob_button'),
    formErrorMsg = $('#form-error-msg'),
    formValidMsg = $('#form-valid-msg'),
    BrandInterest = "Interparus School",
    ProductCatalogue = {
        "/atlantique": "Atlantique",
        "/": "School Main",
        "/inshore-skipper": "Inshore Skipper"
    };

const thankYouPageUrl = (() => {
    const domainPattern = /(https?:\/\/[^\/]*interparus-school\.com)/;
    const match = pageUrl.match(domainPattern);
    return match ? `${match[0]}/thank-you` : 'None';
})();

const pageLang = pageUrl.includes('www.interparus-school.com') ? 'RU' :
        pageUrl.includes('ua.interparus-school.com') ? 'UA' :
            pageUrl.includes('en.interparus-school.com') ? 'EN' : 'None',
    pageAddInfo = (() => {
        const domainPattern = /(www\.interparus-school\.com|ua\.interparus-school\.com|en\.interparus-school\.com)/;
        const match = pageUrl.match(domainPattern);
        return match ? match[0] : 'None';
    })();

let ipInfo,
    NameValidationResult = false,
    LastNameValidationResult = false,
    EmailValidationResult = false,
    PhoneValidationResult = false;

function UrlParams(pageUrl, paramName) {
    const params = new URLSearchParams(pageUrl.split('?')[1]);
    return params.has(paramName) ? params.get(paramName) : 'None';
}

function GetIpInfo(ipInfo, paramName) {
    return ipInfo.hasOwnProperty(paramName) ? ipInfo[paramName] : 'None';
}

function GetProductInterest(pageUrl) {
    const path = new URL(pageUrl).pathname;
    return ProductCatalogue[path] || 'None';
}

function SubmitForm() {
    const apiUrl = "https://hooks.zapier.com/hooks/catch/12700623/bazia5v/",
        date = new Date();

    const formData = {};

    if (NameValidationResult && LastNameValidationResult && EmailValidationResult && PhoneValidationResult) {
        formData.ordercode = date.valueOf();
        formData.clientnamefirst = nameInput.val();
        formData.clientnamelast = lastnameInput.val();
        formData.clientemail = emailInput.val();
        formData.clientphone = fullPhoneInput.val();
        formData.customorder_source_url = cleanUrl;
        formData.customorder_ga_code = "None";
        formData.customorder_lead_IP = GetIpInfo(ipInfo, 'ip');
        formData.customorder_source_add_info = pageAddInfo;
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
        formData.customorder_form_message = '';
        formData.customorder_brand_interest = BrandInterest;
        formData.customorder_product_interest = ProductInterest;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
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
        console.log('Form Submission Error');
        formButton.attr('disabled', true);
        formErrorMsg.removeClass('hide');
    }
}

$(document).ready(() => {
    //Initialize intlTelInput
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

    //Validation
    const activateButtonIfAllValid = () => {
        if (NameValidationResult || LastNameValidationResult || EmailValidationResult || PhoneValidationResult) {
            formButton.attr('disabled', false);
            formErrorMsg.addClass('hide');
        }
    };

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

    formButton.click(e => {
        e.preventDefault();
        SubmitForm();
    });

    pageForm.submit(e => {
        e.preventDefault();
        SubmitForm();
    });
});


chrome.runtime.onMessage.addEventListener((request, sender, sendResponse) => {
    return true; // Error message says you already return true
});