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
    BrandInterest = "Interparus School";


const GetProductInterest = (pageUrl) => {
    const path = new URL(pageUrl).pathname;
    return ProductCatalogue[path] || 'None';
};
const ProductCatalogue = {
        "/atlantique": "Atlantique",
        "/": "School Main",
        "/inshore-skipper": "Inshore Skipper"
    },
    ProductInterest = GetProductInterest(pageUrl);

const thankYouPageUrl = (() => {
    const domainPattern = /(https?:\/\/[^\/]*interparus-school\.com)/;
    const match = pageUrl.match(domainPattern);
    return match ? `${match[0]}/thank-you` : 'None';
})() || 'None';

const pageLang = pageUrl.includes('www.interparus-school.com') ? 'RU' :
    pageUrl.includes('ua.interparus-school.com') ? 'UA' :
        pageUrl.includes('en.interparus-school.com') ? 'EN' : 'None';

const pageAddInfo = (() => {
    const domainPattern = /(www\.interparus-school\.com|ua\.interparus-school\.com|en\.interparus-school\.com)/;
    const match = pageUrl.match(domainPattern);
    return match ? match[0] : 'None';
})();

let ipInfo,
    NameValidationResult = false,
    LastNameValidationResult = false,
    EmailValidationResult = false,
    PhoneValidationResult = false;

const UrlParams = (pageUrl, paramName) => {
    const params = new URLSearchParams(pageUrl.split('?')[1]);
    return params.has(paramName) ? params.get(paramName) : 'None';
};

const GetIpInfo = (ipInfo, paramName) => ipInfo[paramName] || 'None';

const SubmitForm = () => {
    const apiUrl = "https://hooks.zapier.com/hooks/catch/12700623/bazia5v/";
    const date = new Date();
    let formData = {};

    if (NameValidationResult && LastNameValidationResult && EmailValidationResult && PhoneValidationResult) {
        formData.ordercode = date.valueOf();
        formData.clientnamefirst = nameInput.val();
        formData.clientnamelast =  lastnameInput.val();
        formData.clientemail =  emailInput.val();
        formData.clientphone =  fullPhoneInput.val();
        formData.customorder_source_url =  cleanUrl;
        formData.customorder_ga_code =  "None";
        formData.customorder_lead_IP =  GetIpInfo(ipInfo, 'ip');
        formData.customorder_source_add_info =  pageAddInfo;
        formData.customorder_lead_country =  GetIpInfo(ipInfo, 'country');
        formData.customorder_lead_form_date =  `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        formData.customorder_lead_region =  GetIpInfo(ipInfo, 'region');
        formData.customorder_lead_city =  GetIpInfo(ipInfo, 'city');
        formData.customorder_lead_location =  `Latitude: ${GetIpInfo(ipInfo, 'latitude')}, Longitude: ${GetIpInfo(ipInfo, 'longitude')}`;
        formData.customorder_lead_timezone =  GetIpInfo(ipInfo, 'timezone');
        formData.customorder_lead_provider =  GetIpInfo(ipInfo, 'org');
        formData.customorder_lead_hostname =  GetIpInfo(ipInfo, 'country_calling_code');
        formData.customorder_utm_source =  UrlParams(pageUrl, 'utm_source');
        formData.customorder_utm_medium =  UrlParams(pageUrl, 'utm_medium');
        formData.customorder_utm_campaign =  UrlParams(pageUrl, 'utm_campaign');
        formData.customorder_utm_content =  UrlParams(pageUrl, 'utm_content');
        formData.customorder_utm_term =  UrlParams(pageUrl, 'utm_term');
        formData.customorder_form_name =  nameInput.val();
        formData.customorder_form_lastname =  lastnameInput.val();
        formData.customorder_lead_form_lang =  pageLang;
        formData.customorder_form_message =  '';
        formData.customorder_brand_interest =  BrandInterest;
        formData.customorder_product_interest =  ProductInterest;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error.message);
            });

        formButton.attr('go', true);

        setTimeout(() => {
            window.location.replace(thankYouPageUrl);
        }, 1000);
    } else {
        console.log('Form Submission Error');
        formButton.attr('disabled', true);
        formErrorMsg.addClass('show');
    }
};

$(document).ready(() => {
    // ... (остальной код остается без изменений)
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    return true; // Error message says you already return true
});