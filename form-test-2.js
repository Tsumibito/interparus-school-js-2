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
      },
      ProductInterest = GetProductInterest(pageUrl);

const thankYouPageUrl = (function() {
            let domainPattern = /(https?:\/\/[^\/]*interparus-school\.com)/;
            let match = pageUrl.match(domainPattern);
            return match ? match[0] + '/thank-you' : 'None';
        });

const pageLang = pageUrl.includes('www.interparus-school.com') ? 'RU' :
                         pageUrl.includes('ua.interparus-school.com') ? 'UA' :
                         pageUrl.includes('en.interparus-school.com') ? 'EN' : 'None',
      pageAddInfo = (function() {
        let domainPattern = /(www\.interparus-school\.com|ua\.interparus-school\.com|en\.interparus-school\.com)/;
        let match = pageUrl.match(domainPattern);
        return match ? match[0] : 'None';
      })();

var ipInfo,
    NameValidationResult = false,
    LastNameValidationResult = false,
    EmailValidationResult = false,
    PhoneValidationResult = false;

function UrlParams(pageUrl, paramName) {
    let params = new URLSearchParams(pageUrl.split('?')[1]);
    return params.has(paramName) ? params.get(paramName) : 'None';
}

function GetIpInfo(ipInfo, paramName) {
    return ipInfo.hasOwnProperty(paramName) ? ipInfo[paramName] : 'None';
}

function GetProductInterest(pageUrl) {
    let path = new URL(pageUrl).pathname;
    console.log(path)
    return ProductCatalogue[path] || 'None';
}
var SubmitForm = function() {
    var api_url = "https://hooks.zapier.com/hooks/catch/12700623/bazia5v/",
        date = new Date();

    var FormData = Object.create(null);
    
    if (NameValidationResult && LastNameValidationResult && EmailValidationResult && PhoneValidationResult ) {
        
        FormData.ordercode = date.valueOf();
        FormData.clientnamefirst = nameInput.val();
        FormData.clientnamelast =  lastnameInput.val();
        FormData.clientemail =  emailInput.val();
        FormData.clientphone =  fullPhoneInput.val();
        FormData.customorder_source_url =  cleanUrl;
        FormData.customorder_ga_code =  "None";
        FormData.customorder_lead_IP =  GetIpInfo(ipInfo, 'ip');
        FormData.customorder_source_add_info =  pageAddInfo;
        FormData.customorder_lead_country =  GetIpInfo(ipInfo, 'country');
        FormData.customorder_lead_form_date =  date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        FormData.customorder_lead_region =  GetIpInfo(ipInfo, 'region');
        FormData.customorder_lead_city =  GetIpInfo(ipInfo, 'city');
        FormData.customorder_lead_location =  'Latitude: ' + GetIpInfo(ipInfo, 'latitude') + ', Longitude: ' + GetIpInfo(ipInfo, 'longitude');
        FormData.customorder_lead_timezone =  GetIpInfo(ipInfo, 'timezone');
        FormData.customorder_lead_provider =  GetIpInfo(ipInfo, 'org');
        FormData.customorder_lead_hostname =  GetIpInfo(ipInfo, 'country_calling_code');

        FormData.customorder_utm_source =  UrlParams(pageUrl, 'utm_source');
        FormData.customorder_utm_medium =  UrlParams(pageUrl, 'utm_medium');
        FormData.customorder_utm_campaign =  UrlParams(pageUrl, 'utm_campaign');
        FormData.customorder_utm_content =  UrlParams(pageUrl, 'utm_content');
        FormData.customorder_utm_term =  UrlParams(pageUrl, 'utm_term');
        FormData.customorder_form_name =  nameInput.val();

        FormData.customorder_form_lastname =  lastnameInput.val();
        FormData.customorder_lead_form_lang =  pageLang;
        FormData.customorder_form_message =  '';
        FormData.customorder_brand_interest =  BrandInterest;
        FormData.customorder_product_interest =  ProductInterest;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', api_url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send(JSON.stringify(FormData));

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) { // Проверка, что запрос завершен
                if (xhr.status === 200) { // Успешный ответ
                    var json = JSON.parse(xhr.responseText);
                    console.log(json);
                } else if (xhr.status === 404) { // Страница не найдена
                    console.error("Ошибка: Страница не найдена.");
                } else if (xhr.status === 500) { // Внутренняя ошибка сервера
                    console.error("Ошибка: Внутренняя ошибка сервера.");
                } else { // Другие ошибки
                    console.error("Ошибка: " + xhr.status + " " + xhr.statusText);
                }
            }
        };

        xhr.onerror = function() {
            console.error("Ошибка сети или другая ошибка.");
        };

        xhr.ontimeout = function() {
            console.error("Ошибка: превышено время ожидания запроса.");
        };

        formButton.attr('go', true);

        setTimeout(function (){
            window.location.replace(thankYouPageUrl);
        }, 1000);

    }  else  {
        console.log('Form Submission Error');
        formButton.attr('disabled', true);
        formErrorMsg.addClass('show');
    }
};
$(document).ready(function () {

    //Initialize intlTelInput
    phoneInput.intlTelInput({
        initialCountry: "auto",
        formatOnDisplay:true,
        nationalMode: false,
        showFlags:false,
        hiddenInput: "full_phone",
        preferredCountries: ["de","fr","ua" ],
        responsiveDropdown: false,
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => {
                    callback(data.country_code)
                    ipInfo = data
                })
                .catch(() => callback("ca"));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.min.js",
    });

    //Validation
    var activateButtonIfAllValid = function() {
        if (NameValidationResult || LastNameValidationResult || EmailValidationResult || PhoneValidationResult) {
            formButton.attr('disabled', false);
            formErrorMsg.addClass('hide');
        }
    };

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
            activateButtonIfAllValid();
        } else if (/^[0-9]+$/.test(value)) {
            nameInput.addClass("error");
            nameInput.removeClass("success");
            NameValidationResult = false;
        } else {
            nameInput.addClass("success");
            nameInput.removeClass("error");
            NameValidationResult = true;
            activateButtonIfAllValid();
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
            activateButtonIfAllValid();
        } else if (/^[0-9]+$/.test(value)) {
            lastnameInput.addClass("error");
            lastnameInput.removeClass("success");
            LastNameValidationResult = false;
        } else {
            lastnameInput.addClass("success");
            lastnameInput.removeClass("error");
            LastNameValidationResult = true;
            activateButtonIfAllValid();
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
            activateButtonIfAllValid();
        }
    });

    phoneInput.on('change blur', function() {
        const value = phoneInput.val();

        if (value === "") {
            phoneInput.addClass("error");
            phoneInput.removeClass("success");
            PhoneValidationResult = false;
            activateButtonIfAllValid();
        } else if (!/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(value)) {
            phoneInput.addClass("error");
            phoneInput.removeClass("success");
            PhoneValidationResult = false;
            activateButtonIfAllValid();
        } else {
            phoneInput.addClass("success");
            phoneInput.removeClass("error");
            PhoneValidationResult = true;
            activateButtonIfAllValid();
        }
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