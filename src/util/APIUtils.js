import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('X-Auth-Token', localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllToDoLists() {
    return request({
        url: API_BASE_URL + "/todolist/list",
        method: 'GET'
    });
}

export function getAllToDoItems(todoListId){
    return request({
        url: API_BASE_URL + "/todoitem/list?todoListId=" + todoListId,
        method: 'GET'
    });
}
export function logout() {
    localStorage.removeItem(ACCESS_TOKEN);
}
export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/register",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkusernameavailability?username=" + username,
        method: 'GET'
    });
}

export function createToDoList(createRequest){
    return request({
        url: API_BASE_URL + "/todolist/create",
        method: 'POST',
        body: JSON.stringify(createRequest)
    });
}
export function createToDoItem(createRequest){
    return request({
        url: API_BASE_URL + "/todoitem/create",
        method: 'POST',
        body: JSON.stringify(createRequest)
    });
}
export function createDependency(createRequest){
    return request({
        url: API_BASE_URL + "/dependency/create",
        method: 'POST',
        body: JSON.stringify(createRequest)
    });
}
export function deleteToDoList(id){
    return request({
        url: API_BASE_URL + "/todolist/delete?id=" + id,
        method: 'GET'
    });
}
export function deleteToDoItem(id){
    return request({
        url: API_BASE_URL + "/todoitem/delete?id=" + id,
        method: 'GET'
    });
}
export function completeToDoItem(id){
    return request({
        url: API_BASE_URL + "/todoitem/complete?id=" + id,
        method: 'GET'
    });
}
export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}


export function Authenticate(){
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return false;
    }
    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    }).then(response => {
        return true;
    }).catch(error => {
        return false;
    });
}


