$(document).ready(function() {
    $("#add").click(function(){
        let currentLength = $('.main_wrapper .nav').children().length;
        let darkMode = localStorage.getItem('nightMode');
        let isJsonViewVisible = JSON.parse(localStorage.getItem('isJsonViewVisible'));
        let maxTabNumber = 11;
        if(currentLength < maxTabNumber) {
            let randomNum = Math.floor(Math.random() * 1001) + Math.floor(Math.random() * 101);
            let nav_item = `
                <li id="item-${randomNum}" class="nav-item" role="presentation">
                    <a class="nav-link active ${darkMode === 'on' ? 'text-white' : null}" id="tab-no-${randomNum}" data-toggle="tab" href="#tab-${randomNum}" role="tab" aria-controls="tab-${randomNum}" aria-selected="false">
                        Tab ${currentLength} &nbsp; <span class="close_icon" onclick="onCloseTab(${randomNum})" aria-hidden="true">&times;</span>
                    </a>
                </li>
            `;
            $(".main_wrapper .nav-link").filter(".active").removeClass('active')
            $(this).before(nav_item);

            let tab_content = `
                <div class="tab-pane fade active show" id="tab-${randomNum}" role="tabpanel" aria-labelledby="tab-no-${randomNum}">
                    <div class="row p-2">
                        <div class="col-sm-4">
                            <div id="e-d-box_${randomNum}" class="${isJsonViewVisible ? 'd-none' : 'd-block'}">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group shadow-sm">
                                            <textarea id="cipher_text_${randomNum}" class="form-control decryption_box ${darkMode === 'on' ? 'bg-dark text-white' : null}" id="exampleFormControlTextarea${randomNum}" rows="12" placeholder="Decryption"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 d-flex justify-content-between">
                                        <button class="btn btn-sm btn-info shadow-sm" onclick="AesDecrypt(${randomNum})">Decrypt</button>
                                    </div>
                                </div>
                                <hr class="${darkMode === 'on' ? 'border-color-dark' : null}" />
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group shadow-sm">
                                            <textarea id="plain_text_${randomNum}" class="form-control encryption_box ${darkMode === 'on' ? 'bg-dark text-white' : null}" id="exampleFormControlTextarea${randomNum}" rows="12" placeholder="Encryption"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 d-flex justify-content-between">
                                        <button class="btn btn-sm btn-info shadow-sm" onclick="AesEncrypt(${randomNum})">Encrypt</button>
                                    </div>
                                </div>
                            </div>
                            <div class="row ${isJsonViewVisible ? 'd-block' : 'd-none'}" id="data_to_json_view_${randomNum}">
                                <div class="col-sm-12">
                                    <div>
                                        <div class="d-flex justify-content-between w-100">
                                            <div class="w-100">
                                                <div class="form-group shadow-sm">
                                                    <textarea id="data_text_${randomNum}" class="form-control encryption_box ${darkMode === 'on' ? 'bg-dark text-white' : null}"
                                                        placeholder="Enter your data here"></textarea>
                                                </div>
                                                <button class="btn btn-sm btn-info shadow-sm mb-2"
                                                    onclick="showJsonDataView(${randomNum})">Evaluate</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="${darkMode === 'on' ? 'border-color-dark' : null}" />
                            <div class="row">
                                <div class="col-sm-12 d-flex justify-content-end">
                                    <button class="btn btn-sm btn-info shadow-sm" onclick="clearAll(${randomNum})">Clear All</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-8 right-side">
                            <div class="tab">
                                <button class="tablinks ${isJsonViewVisible ? 'd-none' : 'active'}" id="text_view_button_${randomNum}" onclick="textView_tab_onClick(${randomNum})">Text View</button>
                                <button class="tablinks ${isJsonViewVisible ? 'active' : ''}" id="json_view_button_${randomNum}" onclick="jsonView_tab_onClick(${randomNum})">JSON View</button>
                            </div>
                            <div id="text_view_content_${randomNum}" class="tabcontent text_view ${isJsonViewVisible ? 'hide' : 'show'} shadow-sm">
                                <div class="form-group">
                                    <textarea id="json_Result_${randomNum}" class="form-control result_box ${darkMode === 'on' ? 'bg-dark text-white' : null}" id="exampleFormControlTextarea${randomNum}" rows="30" placeholder="Result" readonly></textarea>
                                </div>
                                <span class="copy_btn" data-title="Copy to Clipboard" onclick="copyToClipBoardFunction('text_view',${randomNum})">
                                    <img src="./images/copy-to-clipboard.png" height="24" width="24" />
                                </span>
                            </div>
                            <div id="json_view_content_${randomNum}" class="tabcontent ${isJsonViewVisible ? 'show' : 'hide'} shadow-sm">
                                    <div class="form-group">
                                        <button id="collapse_all_${randomNum}" class="json_view_btn btn btn-sm ${darkMode === 'on' ? 'btn-outline-light' : 'btn-outline-info'} hide" onclick="collapseAllOnClick(${randomNum})">Collapse All</button>
                                        <button id="expand_all_${randomNum}" class="json_view_btn btn btn-sm ${darkMode === 'on' ? 'btn-outline-light' : 'btn-outline-info'} hide" onclick="expandAllOnClick(${randomNum})">Expand All</button>
                                    </div>
                                <div id="json_${randomNum}" class="json-view light-theme ${darkMode === 'on' ? 'dark-theme' : null}">No Data</div>
                            </div>
                        </div>
                    </div>
                </div>    
            `;
            $(".main_wrapper .tab-pane").filter(".active").removeClass('active show');
            $("#Tab_Content").append(tab_content);
            currentLength === 10 && $("#add").addClass('disable');
        }
    });
});