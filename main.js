var DB_NAME = 'DB';

var inputDataList = localStorage.getItem(DB_NAME) ? JSON.parse(localStorage.getItem(DB_NAME)) : [];
var inputTypeEle = document.getElementById("inputType");
var inputTypeOptionEle = document.getElementById("inputTypeOption");

function validate() {
    if (inputTypeEle.value === "") {
        alert("Please enter field name.");
        return false;
    }else if (inputTypeOptionEle.value === "") {
        alert("Please select input type.");
        return false;
    }else {
        return true;
    }
}

function addDataList() {
    if(validate()){
        var inputDataObj = {};
        inputDataObj.id = Date.now();
        inputDataObj.label = inputTypeEle.value;
        inputDataObj.inputType = inputTypeOptionEle.value;
        inputDataObj.isEdit = false;
        inputDataObj.value = "";
        inputDataObj.action = "";
        inputDataList.push(inputDataObj);
        generateDynamicTable(inputDataList);
    }
}

function generateDynamicTable(data) {
    localStorage.setItem(DB_NAME, JSON.stringify(data));
    var tableDataLength = data.length;
    if (tableDataLength > -1) {
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.setAttribute("class", "table table-bordered table-hover table-striped");

        // retrieve column header ("id", "label","value" and "action")
        // hiding the two column ("isEdit" and "inputType)
        var col = []; // define an empty array
        for (var i = 0; i < tableDataLength; i++) {
            for (var key in data[i]) {
                if (col.indexOf(key) === -1) {
                    if (key !== "isEdit" && key !== "inputType") {
                        col.push(key);
                    }
                }
            }
        }
        // CREATE TABLE HEAD .
        var tHead = document.createElement("thead");
        // CREATE ROW FOR TABLE HEAD .
        var hRow = document.createElement("tr");
        // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.setAttribute("class","text-capitalize");
            th.innerHTML = col[i];
            hRow.appendChild(th);
        }
        tHead.appendChild(hRow);
        table.appendChild(tHead);

        // CREATE TABLE BODY .
        var tBody = document.createElement("tbody");

        // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
        for (var i = 0; i < tableDataLength; i++) {
            var bRow = document.createElement("tr"); // CREATE ROW FOR EACH RECORD .
            for (var j = 0; j < col.length; j++) {
                var td = document.createElement("td");
                if (col[j] === "value") {
                    if (data[i].isEdit) {
                        var isEditInputBox = document.createElement("input");
                        isEditInputBox.setAttribute("id", "input" + i);
                        isEditInputBox.setAttribute("value", data[i].value);
                        isEditInputBox.setAttribute("class", "form-control");
                        isEditInputBox.setAttribute("type", data[i].inputType)
                        td.innerHTML = '';
                        td.appendChild(isEditInputBox);
                    } else {
                        td.innerHTML = data[i][col[j]];
                    }
                } else {
                    td.innerHTML = data[i][col[j]];
                }

                if (col[j] === "action") {
                    if (data[i].isEdit) {
                        var updateBtnEle = document.createElement("button");
                        updateBtnEle.setAttribute("id", "update-btn");
                        updateBtnEle.setAttribute("type", "button");
                        updateBtnEle.setAttribute("class", "btn btn-warning");
                        updateBtnEle.setAttribute("update-index", i);
                        updateBtnEle.innerHTML = "Update";
                        updateBtnEle.onclick = function (e) {
                            var updateIndex = e.target.getAttribute("update-index");
                            var updateIndex4 = e.target.getAttribute("url-class");
                            data[updateIndex].isEdit = false;
                            data[updateIndex].value = document.getElementById("input" + updateIndex).value;

                            if(inputTypeOptionEle.value === "email"){
                                console.log(data[updateIndex].value);
                                var mailFormat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                                if(data[updateIndex].value.match(mailFormat)){
                                    generateDynamicTable(data);
                                }else{
                                    alert('Invalid email Address !!!');
                                    return false;
                                }
                            }
                            if(inputTypeOptionEle.value === "url"){
                                var urlFormat = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
                                if(data[updateIndex].value.match(urlFormat)){
                                    generateDynamicTable(data);
                                }else{
                                    alert('Invalid web Address !!!');
                                    return false;
                                }
                            }
                            generateDynamicTable(data);
                        };
                        td.appendChild(updateBtnEle);
                    } else {
                        var editBtnEle = document.createElement("button");
                        editBtnEle.setAttribute("id", "edit-btn");
                        editBtnEle.setAttribute("type", "button");
                        editBtnEle.setAttribute("class", "btn btn-primary");
                        editBtnEle.setAttribute("edit-index", i);
                        editBtnEle.innerText = "Edit";
                        editBtnEle.onclick = function (e) {
                            var editIndex = e.target.getAttribute("edit-index");
                            data[editIndex].isEdit = true;
                            generateDynamicTable(data);
                        };
                        td.appendChild(editBtnEle);
                    }
                    if(!data[i].isEdit){
                        var deleteBtnEle = document.createElement("button");
                        deleteBtnEle.setAttribute("delete-index", i);
                        deleteBtnEle.setAttribute("class", "btn btn-danger");
                        deleteBtnEle.innerText = "Delete";
                        deleteBtnEle.onclick = function (e) {
                            var deleteIndex = e.target.getAttribute("delete-index");
                            var confirmBox = confirm("Are you sure want to delete this record?");
                            if(confirmBox){
                                data.splice(deleteIndex, 1);
                                generateDynamicTable(data);
                            }else {
                                return true;
                            }
                        };
                        td.appendChild(deleteBtnEle);
                    }
                }
                bRow.appendChild(td);
            }
            tBody.appendChild(bRow)
        }
        table.appendChild(tBody);
        var divContainer = document.getElementById("table-list");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }

}

function filterSearch() {
   var  inputFilter = document.getElementById("myInput").value;
    if(inputFilter !== ''){
        var inputDataList1 =  inputDataList.filter(function(obj){
            return obj.label === inputFilter || obj.value === inputFilter || obj.id === inputFilter;
        });
        console.log(inputDataList1);
        generateDynamicTable(inputDataList1);
    }else {
        generateDynamicTable(inputDataList);
    }
  }