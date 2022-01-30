// sets defualt Selected Encryption Key list
if(!localStorage.getItem('selectedEncryptKey')) {
    localStorage.setItem('selectedEncryptKey', JSON.stringify({
        keyName: "Key-1",
        company: "Key-1",
        aih_ENI : "encryption-key",
        aih_ENK: "encryption-key",
    }));
};

// sets defualt Encryption keys list
if(!localStorage.getItem('EncryptionKeys')) {
    localStorage.setItem('EncryptionKeys', JSON.stringify([
        {
            keyName: "Key-1",
            company: "Key-1",
            aih_ENI : "encryption-key",
            aih_ENK: "encryption-key",
        },
    ]));
};

// Dark mode Local storage setting
if(localStorage.getItem('nightMode')) { 
    if (localStorage.getItem('nightMode') === 'on') {
        applyDarkModeStylingChanges();
        document.getElementById("mode_switch").checked = true;
    }
} else {
    // sets local storage for dark mode
    localStorage.setItem('nightMode', 'off');
}

// Variables related to encryption keys
var selectedEncryptionKey = JSON.parse(localStorage.getItem('selectedEncryptKey'));
var encryptionKeys = JSON.parse(localStorage.getItem('EncryptionKeys'));


// variable and Aes key declaration
var company= selectedEncryptionKey.company || "key-1";
var aih_ENI= selectedEncryptionKey.aih_ENI || "";
var aih_ENK= selectedEncryptionKey.aih_ENK || "";
var aih_Enc_Key = CryptoJS.enc.Utf8.parse(aih_ENK);


// Sets the Encryption Key list for the settings view
setEncryptionKeysList();


// AesEncrypt function for encrypting the data
AesEncrypt = function (tabNumber) {

    var val = document.getElementById(`plain_text_${tabNumber}`).value;
    var randomNum = "12"
    var result = "";
    if (randomNum != undefined && randomNum != "") {
        aih_Enc_IV = CryptoJS.enc.Utf8.parse((aih_ENI).substring(0, (aih_ENI).length - 2) + randomNum);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(val), aih_Enc_Key,
        {
            keySize: 256 / 8,
            iv: aih_Enc_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        result = encrypted.toString();
    }
    else{
        aih_Enc_IV = CryptoJS.enc.Utf8.parse(aih_ENI);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(val), aih_Enc_Key,
    {
        keySize: 256 / 8,
        iv: aih_Enc_IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    result = encrypted.toString();
    }
    document.getElementById(`cipher_text_${tabNumber}`).value=randomNum+company+"###"+result;
    return result;
};

// AesDecrypt function for decrypting the data in cipher_text
AesDecrypt = function (tabNumber) {

    var val = document.getElementById(`cipher_text_${tabNumber}`).value;
    var result = "";
    var decrypted = "";
    if (val.indexOf("###") > 0) {
        var partner_key = val.substring(0, val.indexOf("###"));
        var iv = (aih_ENI).substring(0, (aih_ENI).length - 2) + partner_key.substring(0, 2);
        aih_Enc_IV = CryptoJS.enc.Utf8.parse(iv);
        var content = val.substring(val.indexOf("###") + 3);
        decrypted = CryptoJS.AES.decrypt(content, aih_Enc_Key,
            {
                keySize: 256 / 8,
                iv: aih_Enc_IV,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
    }
    else {
        aih_Enc_IV = CryptoJS.enc.Utf8.parse(aih_ENI);
        decrypted = CryptoJS.AES.decrypt(val, aih_Enc_Key,
        {
            keySize: 256 / 8,
            iv: aih_Enc_IV,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    }
    
    result = decrypted.toString(CryptoJS.enc.Utf8);
    var jsonResult= JSON.parse(result);
    if(jsonResult["JSONData"]!=null && jsonResult["JSONData"]!= "" && jsonResult["JSONData"] !=undefined){
        document.getElementById(`json_Result_${tabNumber}`).value = JSON.stringify(JSON.parse(jsonResult["JSONData"]), null, 4);
        $(`#collapse_all_${tabNumber}`).removeClass('hide');
        $(`#expand_all_${tabNumber}`).removeClass('hide');
        showJsonView(tabNumber, jsonResult["JSONData"]);
    }
    document.getElementById(`plain_text_${tabNumber}`).value= result;
    return result;
};

function showJsonView(tabNumber, data, collapseAll) {
    let jsonObj = {};
    let jsonViewer = new JSONViewer();
    $(`#json_${tabNumber}`).text('');
    document.querySelector(`#json_${tabNumber}`).appendChild(jsonViewer.getContainer());
    jsonObj = JSON.parse(data);
    if (collapseAll === 'collapse_to_level_1') { 
        jsonViewer.showJSON(jsonObj, null, 1);
    } else {
        jsonViewer.showJSON(jsonObj);
    }
}

function collapseAllOnClick(tabNumber) {
    let data = document.getElementById(`json_Result_${tabNumber}`).value;
    showJsonView(tabNumber, data, 'collapse_to_level_1')
}

function expandAllOnClick(tabNumber) {
    let data = document.getElementById(`json_Result_${tabNumber}`).value;
    showJsonView(tabNumber, data)
}



function clearAll(tabNumber) {
    document.getElementById(`cipher_text_${tabNumber}`).value = '';
    document.getElementById(`plain_text_${tabNumber}`).value = '';
    document.getElementById(`json_Result_${tabNumber}`).value = '';
    $(`#collapse_all_${tabNumber}`).addClass('hide');
    $(`#expand_all_${tabNumber}`).addClass('hide');
    let json_child_element = $(`#json_${tabNumber}`).children();
    if (json_child_element.length > 0) { 
        textView_tab_onClick(tabNumber);
        json_child_element.remove();
        $(`#json_${tabNumber}`).text('No Data');
    }
}


function onCloseTab(tabNumber) {
    let nextTabs = $(`#item-${tabNumber}`).nextAll().not("#add");
    let nav_item_to_delete = $(`#item-${tabNumber}`);
    let tab_content_to_delete = $(`#tab-${tabNumber}`);
    let prevTab = $(`#item-${tabNumber}`).prev();
    let prevTabContent = $(`#tab-${tabNumber}`).prev();

    // changes the Tab Name for the next tabs if any
    if (nextTabs.length) {
        let count =  parseInt($(".nav-link").filter(".active")[0].innerText.split(' ')[1], 10);
        
        $(`#item-${tabNumber}`).nextAll().not("#add").children().html((i, originalText) => {
            let newTextArray = originalText.trim().split(' ');
            let newHTMLText = originalText.replace(newTextArray[1], count.toString());
            count++;
            return newHTMLText;
        });
    }

    // marks prev tab as active
    prevTab.children().addClass('active');
    prevTabContent.addClass('active show');

    // removes the tab and tab content
    nav_item_to_delete.remove();
    tab_content_to_delete.remove();

    let currentTabLength = $('.main_wrapper .nav').children().length;
    currentTabLength === 10 && $("#add").removeClass('disable');
}

function textView_tab_onClick(tabNumber) {
    $(`#text_view_content_${tabNumber}`).removeClass('hide');
    $(`#text_view_content_${tabNumber}`).addClass('show');
    
    $(`#json_view_content_${tabNumber}`).removeClass('show');
    $(`#json_view_content_${tabNumber}`).addClass('hide');

    $(`#json_view_button_${tabNumber}`).removeClass('active');
    $(`#text_view_button_${tabNumber}`).addClass('active');
}

function jsonView_tab_onClick(tabNumber) {
    $(`#text_view_content_${tabNumber}`).removeClass('show');
    $(`#text_view_content_${tabNumber}`).addClass('hide');

    $(`#json_view_content_${tabNumber}`).removeClass('hide');
    $(`#json_view_content_${tabNumber}`).addClass('show');

    $(`#text_view_button_${tabNumber}`).removeClass('active');
    $(`#json_view_button_${tabNumber}`).addClass('active');
}


// copy functionality
function copyToClipBoardFunction(type, tabNumber) {
    let copyTextElement;
    switch (type) {
        case 'encrypt':
            copyTextElement = document.getElementById(`plain_text_${tabNumber}`);
            break;
        case 'decrypt':
            copyTextElement = document.getElementById(`cipher_text_${tabNumber}`);
            break;
        case 'text_view':
            copyTextElement = document.getElementById(`json_Result_${tabNumber}`);
            break;
        default:
            break;
    }
    copyToClipBoard(copyTextElement);
}

function copyToClipBoard(element) {
    var copyText = element;
    copyText.select();
    document.execCommand("copy");
}


function handleDarkMode() {
    let darkMode = localStorage.getItem('nightMode');
    applyDarkModeStylingChanges();
    if (darkMode === 'off') {
        localStorage.setItem('nightMode', 'on');
    }
    if (darkMode === 'on') {
        localStorage.setItem('nightMode', 'off');
    }
};

function applyDarkModeStylingChanges() {
    $('body').toggleClass('bg-dark text-white');
    $('hr').toggleClass('border-color-dark');
    $('.navbar').toggleClass('navbar-light bg-light').toggleClass('navbar-custom-dark text-white');
    $('#Tab_Content').toggleClass('bg-dark text-white');
    $('#add').children().toggleClass('text-white');
    $('.decryption_box').toggleClass('bg-dark text-white');
    $('.encryption_box').toggleClass('bg-dark text-white');
    $('.result_box').toggleClass('bg-dark text-white');
    $('.nav-link').toggleClass('text-white');
    $('.json-view').toggleClass('dark-theme');
    $('.json_view_btn').toggleClass('btn-outline-info').toggleClass('btn-outline-light');
    $('.modal-content').toggleClass('bg-dark text-white');
    $('.modal-content .table').toggleClass('table-dark');
    $('.modal-content .close').toggleClass('text-white');
}


// Setings related logics
function setEncryptionKeysList() {
    $("#encryption_keys_wrapper").empty();
    encryptionKeys.forEach(element => {
        $("#encryption_keys_wrapper").append(createNewRadioInput(element, selectedEncryptionKey.company === element.keyName));
    });
};

function createNewRadioInput(value, seleted = false) {
    if (value) {
        let html = `
            <tr>
                <td>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="encryptionkey"
                            id="${value.keyName}" value="${value.keyName}" ${seleted ? 'checked' : ''} onclick="selectEncryptionKey(value)">
                    </div>
                </td>
                <td>${value.company}</td>
                <td>${value.aih_ENI}</td>
                <td>${value.aih_ENK}</td>
                <td>
                    <button class="btn btn-sm btn-danger" ${seleted ? 'disabled' : ''}
                    onclick="deleteRow('${value.keyName}')">Delete</button>
                </td>
            </tr>
        `;
    
        return html;
    }
    return null;
};

function selectEncryptionKey(value) {
    let selectedKey = encryptionKeys.find((key) => key.keyName === value);
    localStorage.setItem('selectedEncryptKey', JSON.stringify(selectedKey));
    setEncryptionKeyVariables(selectedKey);
    setEncryptionKeysList();
}

function setEncryptionKeyVariables(value) {
    company = value.company;
    aih_ENI = value.aih_ENI;
    aih_ENK = value.aih_ENK;
    aih_Enc_Key = CryptoJS.enc.Utf8.parse(aih_ENK);
    selectedEncryptionKey = value;
}

function newEncryptionTableRow() {
    let darkMode = localStorage.getItem('nightMode');
    let html = `
    <tr id="editable_row">
        <td></td>
        <td><input type="text" placeholder="Company Name" class="form-control ${darkMode === 'on' ? 'bg-dark text-white' : null}" id="conpany_name" aria-describedby="textHelp"></td>
        <td><input type="text" placeholder="AIH ENI" class="form-control ${darkMode === 'on' ? 'bg-dark text-white' : null}" id="aih_eni" aria-describedby="textHelp"></td>
        <td><input type="text" placeholder="AIH ENK" class="form-control ${darkMode === 'on' ? 'bg-dark text-white' : null}" id="aih_enk" aria-describedby="emailHelp"></td>
        <td>
            <button class="btn btn-sm btn-success"
            onclick="addRow()">Add</button>
            <button class="btn btn-sm btn-info ml-1"
            onclick="cancelRow()">Cancel</button>
        </td>
    </tr>
    `;
    return html;
}

function addEditableRow() {
    $("#encryption_keys_wrapper").append(newEncryptionTableRow());
}

function cancelRow() {
    $("#editable_row").remove();
}

function addRow() {
    let companyName = document.getElementById('conpany_name').value;
    let aih_eni = document.getElementById('aih_eni').value;
    let aih_enk = document.getElementById('aih_enk').value;

    
    if (companyName && aih_eni && aih_enk) {
        $("#encryption_keys_wrapper").append(createNewRadioInput(
            {
                keyName: companyName,
                company: companyName,
                aih_ENI : aih_eni,
                aih_ENK: aih_enk,
            }
        ));
        updateLocalStorage('EncryptionKeys', {
            keyName: companyName,
            company: companyName,
            aih_ENI : aih_eni,
            aih_ENK: aih_enk,
        })
        encryptionKeys = JSON.parse(localStorage.getItem('EncryptionKeys'));
    }

    cancelRow();
}

function deleteRow(keyName) {
    let currentData = JSON.parse(localStorage.getItem('EncryptionKeys'));
    let filteredData = currentData.filter((data) => data.keyName !== keyName);
    localStorage.setItem('EncryptionKeys', JSON.stringify(filteredData));
    encryptionKeys = JSON.parse(localStorage.getItem('EncryptionKeys'));
    setEncryptionKeysList();
}

function updateLocalStorage(key, data) {
    let currentData = JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify([...currentData, data]));
};

function onModalClose() {
    $("#editable_row").remove();
}