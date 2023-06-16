document.addEventListener("DOMContentLoaded", async function () {
    document.forms.newuserform.addEventListener("submit", (e) => {
        e.preventDefault();
        addUser();
    });
    fillAllUsersTable();
    const authUser = await getAuthUser();
    fillHeaderText(authUser);
});


function parseSelectValue(select, valueAcceptor) {
    for (let option of select.options) {
        if (option.selected) {
            let userRole = {
                id: option.value,
                authority: option.text
            }
            valueAcceptor.push(userRole);
        }
    }

}

async function getAuthUser() {
    const response = await fetch(`http://localhost:8080/api/users/auth`);
    const authUser = await response.json();
    return authUser;
}

function getUserRole(roles) {
    let result = "";
    for (const role of roles) {
        result += role["authority"].replace('ROLE_', '') + " ";
    }
    return result;
}

function createUserRow(user, withButtons=true) {
    let withoutButtons = `<tr id='all_user_id_${user["id"]}'>
                                        <td>${user["id"]}</td>
                                        <td >${user["firstName"]}</td>
                                        <td >${user["lastName"]}</td>
                                        <td >${user["age"]}</td>
                                        <td >${user["email"]}</td>
                                        <td >${getUserRole(user["userRoles"])}</td>

                                    `;
    if(withButtons){
        withoutButtons +=              `<td>
                                            <button class="btn btn-info"
                                                    onclick="handleEditClick(${user['id']})"
                                                    type="submit"
                                                    data-toggle="modal"
                                                    data-target="#edit_user_modal">Edit
                                            </button>
                                        </td>
                                        <td>
                                            <button class="btn btn-danger"
                                                    onclick="handleDeleteClick(${user['id']})"
                                                    type="submit"

                                                    data-toggle="modal"
                                                    data-target="#delete_user_modal"
                                            >Delete
                                            </button>
                                        </td>`
    }

    return withoutButtons+`</tr>`;
}

async function addUser() {
    const newUserData = new FormData(document.forms.newuserform);
    const jsonUserData = Object.fromEntries(newUserData.entries());

    jsonUserData["userRoles"] = [];
    parseSelectValue(document.getElementById("rolesNew"), jsonUserData["userRoles"]);

    const response = await fetch(`http://localhost:8080/api/users`, {
        method: "POST",
        body: JSON.stringify(jsonUserData),
        headers: {
            "Content-Type": "application/json",
        }
    });

    const toast = document.createElement("div");
    toast.classList.add("alert");
    toast.classList.add("fade");
    toast.classList.add("show");
    toast.setAttribute("role", "alert");
    toast.style.cssText += "position: absolute;top: 1%; right:1%";

    if (response.status == 201) {
        const createdUser = await response.json();
        document.getElementById("allUsersTable").innerHTML += createUserRow(createdUser);
        document.forms.newuserform.reset();
        toast.classList.add("alert-success");
        toast.innerText = `User ${createdUser['firstName'] + " " + createdUser['lastName']} created successfully`;
    } else {
        toast.classList.add("alert-danger");
        toast.innerText = `Wrong user data`;
    }
    document.getElementById("new_user_card").append(toast);
    setTimeout(() => $(".alert").alert('close'), 3500);
}

async function editUser(id) {

    const data = new FormData(document.forms.edituserform);
    const jsonData = Object.fromEntries(data.entries());
    jsonData["userRoles"] = [];
    parseSelectValue(document.getElementById("rolesEdit"), jsonData["userRoles"]);
    console.log(jsonData)
    const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(jsonData),
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.status == 200) {
        const updatedUser = await response.json();
        const authUser = await getAuthUser();
        document.getElementById(`all_user_id_${id}`).innerHTML = createUserRow(updatedUser);
        $('#edit_user_modal').modal('hide');
        if (authUser['id'] == updatedUser['id']) {
            fillHeaderText(authUser, );
            fillAuthUserTable();
        }
    }
}


async function deleteUser(id) {
    const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE",
    });
    if (response.status == 200) {
        document.getElementById(`all_user_id_${id}`).remove();
        $('#delete_user_modal').modal('hide');
    }
    console.log(response);
}

async function fetchUserData(id) {
    const response = await fetch(`http://localhost:8080/api/users/${id}`);
    const jsonData = await response.json();
    return jsonData;
}

function populateForm(form, userData) {
    const idFormGroup = form.firstElementChild;
    idFormGroup.lastElementChild.value = userData["id"];
    const firstNameGroup = idFormGroup.nextElementSibling;
    firstNameGroup.lastElementChild.value = userData["firstName"];
    const lastNameGroup = firstNameGroup.nextElementSibling;
    lastNameGroup.lastElementChild.value = userData["lastName"];
    const ageGroup = lastNameGroup.nextElementSibling;
    ageGroup.lastElementChild.value = userData["age"];
    const emailGroup = ageGroup.nextElementSibling;
    emailGroup.lastElementChild.value = userData["email"];
    const passGroup = emailGroup.nextElementSibling;
    if (passGroup.lastElementChild.name = "password") {
        passGroup.lastElementChild.value = userData["password"];
    }
}

async function handleEditClick(id) {

    const userData = await fetchUserData(id);

    const updateForm = document.getElementById(`update_user_form`);
    populateForm(updateForm, userData);
    const submitButton = updateForm.parentElement.nextElementSibling.lastElementChild;
    const newSubmitButton = submitButton.cloneNode(true)
    submitButton.replaceWith(newSubmitButton);
    newSubmitButton.addEventListener("click", () => {
        editUser(id);
    });
}


async function handleDeleteClick(id) {
    const userData = await fetchUserData(id);
    const deleteForm = document.getElementById(`delete_user_form`);
    populateForm(deleteForm, userData);
    const deleteButton =deleteForm.parentElement.nextElementSibling.lastElementChild;
    const newDeleteButton = deleteButton.cloneNode(true);
    deleteButton.replaceWith(newDeleteButton);
    newDeleteButton.addEventListener("click", () => {
        deleteUser(id);
    });
}


async function fillAllUsersTable() {
    const response = await fetch("http://localhost:8080/api/users");
    const jsonData = await response.json();
    const table = document.getElementById("allUsersTable");
    for (const user of jsonData) {
        table.innerHTML += createUserRow(user);
    }
}

async function fillAuthUserTable() {
    authUser = await getAuthUser();
    const authUserTable = document.getElementById("authUserTable");
    authUserTable.innerHTML = createUserRow(authUser, false);
}
async function fillHeaderText(authUser) {
    document.getElementById("header_text").innerHTML =
        `<span class="font-weight-bold"">
            ${authUser['email']}
            </span>
            <span>
            with roles: ${getUserRole(authUser['userRoles'])}
            </span>`
}
