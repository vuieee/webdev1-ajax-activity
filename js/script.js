var actionType = 0;
var selectedRowIndex = 0;

var selectedContact = {
    id: "",
    curEmail: "",
    lname: "",
    fname: "",
    emailAdd: "",
    contactNum: ""
};
var table = document.getElementById("contactTable");

window.onload = function() {
    loadContacts();
};

async function loadContacts() {
    try {
        const response = await fetch('https://contactlist-api.dcism.org/read.php');
        const result = await response.json();

        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            table.deleteRow(1);
        }

        if (result.status === 200 && result.data) {
            const dataObj = result.data;
            
            for (const key in dataObj) {
                const contact = dataObj[key];
                var newRow = table.insertRow(-1);
                
                newRow.dataset.id = contact.id;
                newRow.dataset.email = contact.email;

                newRow.insertCell(0).innerHTML = contact.lastName;
                newRow.insertCell(1).innerHTML = contact.firstName;
                newRow.insertCell(2).innerHTML = contact.email;
                newRow.insertCell(3).innerHTML = contact.number;
                
                var cell5 = newRow.insertCell(4);
                cell5.innerHTML = `
                    <button class="action-btn" onclick="setEditContact(this)">Edit</button>
                    <button class="action-btn" onclick="deleteContact(this)">Delete</button>
                `;
                cell5.style.textAlign = "center";
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function popUpAction(isShow, action = 0){
    actionType = action;
    
    if(isShow === true){
        document.getElementById("modalTitle").innerText = action === 0 ? "Add Contact" : "Edit Contact";
        document.getElementById("btnName").innerText = action === 0 ? "Submit" : "Save Changes";
        
        document.getElementById("lname").value = selectedContact.lname;
        document.getElementById("fname").value = selectedContact.fname;
        document.getElementById("emailAdd").value = selectedContact.emailAdd;
        document.getElementById("contactNum").value = selectedContact.contactNum;
    }
    
    var popUp = document.getElementById("addContactPopup");
    popUp.style.display = isShow === true ? "block" : "none";

    if(!isShow) {
        selectedContact.id = selectedContact.curEmail = selectedContact.lname = selectedContact.fname = selectedContact.emailAdd = selectedContact.contactNum = "";
        document.getElementById("modalForm").reset();
    }
}

function formSubmitted(e){
    e.preventDefault();
    if(actionType === 0){
        addContact(e);
    }
    else{
        editContact();
    }
}

async function addContact(e){ 
    var formData = new FormData();
    formData.append("lname", document.getElementById("lname").value);
    formData.append("fname", document.getElementById("fname").value);
    formData.append("emailAdd", document.getElementById("emailAdd").value);
    formData.append("contactNum", document.getElementById("contactNum").value);

    try {
        const response = await fetch('https://contactlist-api.dcism.org/add.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.status === 200) {
            alert(result.message);
            popUpAction(false, 0); 
            loadContacts();        
        } else if (result.status === 400) {
            alert(result.message); 
        }
    } catch (error) {
        console.error(error);
    }
}

function setEditContact(btn){
    var row = btn.parentNode.parentNode;
    selectedRowIndex = row.rowIndex;

    selectedContact.id = row.dataset.id;
    selectedContact.curEmail = row.dataset.email;
    selectedContact.lname = row.cells[0].innerHTML;
    selectedContact.fname = row.cells[1].innerHTML;
    selectedContact.emailAdd = row.cells[2].innerHTML;
    selectedContact.contactNum = row.cells[3].innerHTML;
    
    popUpAction(true, 1);
}

async function editContact(){
    var formData = new FormData();
    formData.append("id", selectedContact.id);
    formData.append("curEmail", selectedContact.curEmail);
    formData.append("lname", document.getElementById("lname").value);
    formData.append("fname", document.getElementById("fname").value);
    formData.append("emailAdd", document.getElementById("emailAdd").value);
    formData.append("contactNum", document.getElementById("contactNum").value);

    try {
        const response = await fetch('https://contactlist-api.dcism.org/edit.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.status === 200) {
            alert(result.message);
            popUpAction(false, 0);
            loadContacts();
        } else if (result.status === 400) {
            alert(result.message); 
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteContact(btn){
    if(confirm("Are you sure you want to delete this contact?")) {
        var row = btn.parentNode.parentNode;
        var targetId = row.dataset.id;

        var formData = new FormData();
        formData.append("id", targetId);

        try {
            const response = await fetch('https://contactlist-api.dcism.org/delete.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.status === 200) {
                alert(result.message);
                loadContacts(); 
            } else {
                alert("Error: Could not delete contact.");
            }
        } catch (error) {
            console.error(error);
        }
    }
}