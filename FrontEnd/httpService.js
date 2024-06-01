import axios from "axios";
import auth from "./authService";

// const baseURL = "http://localhost:2410";
const baseURL = "https://usernotes.onrender.com";

function get(url) {
    const token = auth.getToken()?.token;
    return axios.get(baseURL + url, {
        headers: { Authorization: token }
    });
}

function post(url, obj) {
    const token = auth.getToken()?.token;
    return axios.post(baseURL + url, obj, {
        headers: { Authorization: token }
    });
}

function put(url, obj) {
    const token = auth.getToken()?.token;
    return axios.put(baseURL + url, obj, {
        headers: { Authorization: token }
    });
}

function deleteReq(url) {
    const token = auth.getToken()?.token;
    return axios.delete(baseURL + url, {
        headers: { Authorization: token }
    });
}

function postReq(url, obj) {
    return axios.post(baseURL + url, obj);
}

export default {
    get,
    post,
    put,
    deleteReq,
    postReq
};
