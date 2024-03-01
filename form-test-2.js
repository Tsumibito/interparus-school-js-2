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

const pageUrlT = $(location).attr('href'),
      cleanUrlT = pageUrlT.split('#')[0].split('?')[0],
      getThankYouPageUrl = (cleanUrlT) => {
          const domainPattern = /(https?:\/\/[^\/]*interparus-school\.com)(\/(en|ua))?/;
          const match = cleanUrlT.match(domainPattern);

          if (match) {
              const languageSegment = match[3] || ''; 
              return languageSegment ? `${match[1]}/${languageSegment}/thank-you` : `${match[1]}/thank-you`;
          } else {
              return 'None';
          }
      },
     thankYouPageUrl = getThankYouPageUrl(cleanUrlT);


function GetProductInterest(pageUrl) {
    const path = new URL(pageUrl).pathname;
    return ProductCatalogue[path] || 'None';
};


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
    

    },
    ProductInterest = GetProductInterest(cleanUrl);

console.log(ProductInterest);

const pageLang = pageUrl.includes('interparus-school.com/ua') ? 'UA':
                        pageUrl.includes('interparus-school.com/en') ? 'EN' :
                         'RU',
    pageAddInfo = (() => {
        const domainPattern = /(www\.interparus-school\.com)/;
        const match = pageUrl.match(domainPattern);
        return match ? match[0] : 'None';
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
        setCookie(paramName, paramValue, 1); // Устанавливаем куки на 24 часа
        return paramValue;
    } else {
        const cookieValue = getCookie(paramName);
        return cookieValue ? cookieValue : 'None';
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
        formData.customorder_form_message = '';
        formData.customorder_brand_interest = BrandInterest;
        formData.customorder_product_interest = ProductInterest;

        const queryString = Object.keys(formData).map(key => key + '=' + encodeURIComponent(formData[key])).join('&');



            var xhr = new XMLHttpRequest();
            xhr.open('POST', "https://hooks.zapier.com/hooks/catch/12700623/bazia5v/", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.send(JSON.stringify(queryString));

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    console.log(xhr.status);
                }
            }


            formValidMsg.removeClass('hide');

            formbutton.attr('go', true);

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

    formButton.click(e => {    
        e.preventDefault();    
        SubmitForm();

    });


});

