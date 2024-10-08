const nameInput = $('#First-Name'),
    lastnameInput = $('#Last-Name'),
    emailInput = $('#Email'),
    phoneInput = $('#Phone'),
    messageInput = $('#Message'),
    pageUrl = $(location).attr('href'),
    cleanUrl = pageUrl.split('#')[0].split('?')[0],
    pageForm = $('#Contact-form-ob'),
    formButton = $('[ob_button]'),
    formErrorMsg = $('#form-error-msg'),
    formValidMsg = $('#form-valid-msg'),
    BrandInterest = "Navi.training";

const getThankYouPageUrl = (cleanUrl) => {
    const baseUrl = 'https://www.navi.training';
    const languageSegments = ['ru', 'ua', 'en'];
    const defaultLanguage = 'ru';

    const foundLanguage = languageSegments.find(segment => {
        const regex = new RegExp(`/${segment}(/|$)`);
        return regex.test(cleanUrl);
    });

    const languagePath = foundLanguage ? `/${foundLanguage}/` : `/${defaultLanguage}/`;
    return `${baseUrl}${languagePath}thank-you-main`;
};

const thankYouPageUrl = getThankYouPageUrl(cleanUrl);


function GetProductInterest(pageUrl) {
    const path = new URL(pageUrl).pathname;
    const match = path.match(/\/\w{2}(\/.*)?$/); 
    const key = match && match[1] ? match[1] : '/';  
    return ProductCatalogue[key] || 'None';
};


const ProductCatalogue = {
        "/": "School Main",
        "/inshore-skipper-sail": "Inshore Skipper Sail",
        "/offshore-skipper-sail": "Offshore Skipper Sail",
        "/master-of-yacht-sail": "Master of Yacht Sail", 
        "/inshore-skipper-power": "Inshore Skipper Power",
        "/offshore-skipper-power": "Offshore Skipper Power",
        "/charter": "Charter",
        "/gift-certificates": "Gift Certificates",
        "/mezhdunarodnye-prava-na-yahtu": "Международные права на яхту"
    },
    ProductInterest = GetProductInterest(cleanUrl);


const pageLang = pageUrl.includes('navi.training/ua') ? 'UA':
                        pageUrl.includes('navi.training/ru') ? 'RU' :
                         'EN',
      pageAddInfo = (() => {
        const domainPattern = /(www\.navi\.training)/;
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

    if (params.has(paramName)) {
        const paramValue = params.get(paramName);
        sessionStorage.setItem(paramName, paramValue); // Сохраняем в Session Storage
        return paramValue;
    } else {
        const storageValue = sessionStorage.getItem(paramName);
        return storageValue ? storageValue : 'None';
    }
}

function GetIpInfo(ipInfo, paramName) {
    return ipInfo.hasOwnProperty(paramName) ? ipInfo[paramName] : 'None';
}

function SubmitForm() {
    const date = new Date(),
          formData = {},
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
        formData.customorder_form_message = messageInput.val();
        formData.customorder_brand_interest = BrandInterest;
        formData.customorder_product_interest = ProductInterest;

        const queryString = Object.keys(formData).map(key => key + '=' + encodeURIComponent(formData[key])).join('&');

       dataLayer.push({
         'event': 'clientInfoEvent',
         'clientEmail': formData.clientemail,
         'clientNameFirst': formData.clientnamefirst,
         'clientNameLast': formData.clientnamelast,
         'clientPhone': formData.clientphone,
         'customOrderLeadCountry': formData.customorder_lead_country,
         'customOrderLeadFormLang': formData.customorder_lead_form_lang
       });




            var xhr = new XMLHttpRequest();
            xhr.open('POST', "https://n8n.navi.training/webhook/3faeb9da-f0c7-496f-90de-30788bf4f7a1" , true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.send(queryString);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    console.log(xhr.status);
                }
            }


            formValidMsg.removeClass('hide');

            formButton.attr('go', true);

            setTimeout(function (){   
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

    phoneInput.on("blur countrychange", function() {
        const fullPhoneInput = $('input[name="full_phone"]');
        let fullNumber = phoneInput.intlTelInput("getNumber");
        fullPhoneInput.val(fullNumber);

    });

     formButton.click(function(e) {
      e.preventDefault();
      SubmitForm();
     });

     pageForm.submit(function(e) {
      e.preventDefault();
      SubmitForm();

   });


});

