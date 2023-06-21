
document.addEventListener("DOMContentLoaded", async function () {
    const selectValue = await fillSelectValue();
    const authUser = await getAuthUser();
    document.getElementById("rolesEdit").innerHTML = selectValue;
    document.getElementById("roleDel").innerHTML = selectValue;
    fillHeaderText(authUser);
    await addContentAccordingAuthUserRole(authUser, selectValue);


});
async function fetchRoles(){
    const response = await fetch(`http://localhost:8080/api/roles/management`);
    const roles = await response.json();
    return roles;
}

async function addContentAccordingAuthUserRole(authUser, selectValue){
    const navPanelTab = document.getElementById("nav_panel_tab");
    const tabContent = document.getElementById("v-pills-tabContent");
    const strUserRoles = getUserRole(authUser.userRoles);
    if(strUserRoles.includes("ADMIN")){
        navPanelTab.innerHTML+=`<a class="nav-link active" id="nav_panel_link_admin" data-toggle="pill"
               href="#v-pills-admin" role="tab"
               aria-controls="v-pills-settings" aria-selected="true">Admin</a>`;

        tabContent.innerHTML+=` <div  class="tab-pane fade active show" id="v-pills-admin"
                 role="tabpanel" aria-labelledby="nav_panel_link_admin">
                <h1>Admin panel</h1>
                <ul class="nav nav-tabs" id="adminTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="users-table-tab" data-toggle="tab" href="#users-table"
                           role="tab" aria-controls="users-table" aria-selected="true">Users table</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="new-user-tab" data-toggle="tab" href="#new-user" role="tab"
                           aria-controls="new-user" aria-selected="false">New User</a>
                    </li>

                </ul>
                <div class="tab-content" id="adminTabContent">
                    <div class="tab-pane fade show active" id="users-table" role="tabpanel"
                         aria-labelledby="users-table-tab">
                        <div class="card">
                            <div class="card-header">
                                All users
                            </div>
                            <div class="card-body">
                                <table class="table table-striped">
                                    <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">Age</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Role</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody id="allUsersTable">


                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                    <!--            New user tab content -->
                    <div class="tab-pane fade" id="new-user" role="tabpanel" aria-labelledby="new-user-tab">
                        <div class="card">
                            <div class="card-header">
                                Add new user
                            </div>
                            <div class="card-body" id="new_user_card">

                                <form class="flex-column d-flex justify-content-center align-items-center text-center"
                                      name="newuserform"
                                      onsubmit="event.preventDefault(); addUser();"
                                      >
                                    <div class="form-group col-5">
                                        <label class="font-weight-bold m-0" for="firstNameNew">First Name</label>
                                        <input type="text" class="form-control form-control-sm" name="firstName"
                                               id="firstNameNew">
                                    </div>
                                    <div class="form-group col-5">
                                        <label class="font-weight-bold m-0" for="lastNameNew">Last Name</label>
                                        <input type="text" class="form-control form-control-sm" name="lastName"
                                               id="lastNameNew">
                                    </div>
                                    <div class="form-group col-5">
                                        <label class="font-weight-bold m-0" for="ageNew">Age</label>
                                        <input type="text" class="form-control form-control-sm" name="age" id="ageNew">
                                    </div>
                                    <div class="form-group col-5">
                                        <label class="font-weight-bold m-0" for="emailNew">Email address</label>
                                        <input type="email" class="form-control form-control-sm" name="email"
                                               id="emailNew">
                                    </div>
                                    <div class="form-group col-5">
                                        <label class="font-weight-bold m-0" for="passwordNew">Password</label>
                                        <input type="password" class="form-control form-control-sm" name="password"
                                               id="passwordNew">
                                    </div>
                                    <div class="form-group col-5">
                                        <label class="font-weight-bold m-0" for="rolesNew">Roles</label>
                                        <select size="2" id="rolesNew" class="form-control form-control-sm"
                                                name="userRoles"
                                                style="display: block"
                                                multiple="multiple">
                                          ${selectValue}
                                        </select>
                                    </div>
                                    <button class="btn btn-success m-auto" type="submit"
                                    >Add new user
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>`
        fillAllUsersTable();
    }
    if(strUserRoles.includes("ADMIN") || strUserRoles.includes("USER")){
        navPanelTab.innerHTML+=` <a
                class="nav-link" 
               id="nav_panel_link_user" data-toggle="pill" href="#v-pills-user" role="tab"
               aria-controls="v-pills-settings" aria-selected="false">User</a>`;
        tabContent.innerHTML+=`  <div
                class="tab-pane fade" 
                 id="v-pills-user" role="tabpanel" aria-labelledby="nav_panel_link_user">
                <h1>User information-page</h1>
                <div class="card">
                    <div class="card-header font-weight-bold">
                        About user
                    </div>
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Age</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                            </tr>
                            </thead>
                            <tbody id="authUserTable">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        document.getElementById("authUserTable").innerHTML = createUserRow(authUser, false);
    }
    if(strUserRoles.includes("USER") && !strUserRoles.includes("ADMIN")){
        document.getElementById("nav_panel_link_user").classList.add("active");
        const userTabContent = document.getElementById("v-pills-user");
        userTabContent.classList.add("show");
        userTabContent.classList.add("active");
        userTabContent.classList.remove("fade");
    }

}

async function fillSelectValue(){
    let result = "";
    const roles = await fetchRoles();
    for(let role of roles){
        result+=`   <option name="userRoles"
                            value=${role.id}>
                              ${role.authority}      
                            </option>`;
    }
    return result;
}
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

    const response = await fetch(`http://localhost:8080/api/users/management`, {
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
    const response = await fetch(`http://localhost:8080/api/users/management/${id}`, {
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
    const response = await fetch(`http://localhost:8080/api/users/management/${id}`, {
        method: "DELETE",
    });
    if (response.status == 200) {
        document.getElementById(`all_user_id_${id}`).remove();
        $('#delete_user_modal').modal('hide');
    }
    console.log(response);
}

async function fetchUserData(id) {
    const response = await fetch(`http://localhost:8080/api/users/management/${id}`);
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
    const response = await fetch("http://localhost:8080/api/users/management");
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
