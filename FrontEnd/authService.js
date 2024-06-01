
const KeyName = "user";
function login(obj) {
    let str = JSON.stringify(obj);
    console.log(str)
    localStorage.setItem(KeyName, str)
}
function getToken() {
    console.log(KeyName)
    const str = localStorage.getItem(KeyName);
    const user = str ? JSON.parse(str) : null;
    return user
}
function removeToken() {
    localStorage.removeItem(KeyName);
}
function logout() {
    removeToken();
}
function getUser() {
    const str = localStorage.getItem(KeyName);
    const user = str ? JSON.parse(str) : null;
    console.log(user)
    if (user) {
        const { token, name, id } = user;
        return { token, name, id };
    }
    return null;
}

export default {
    login,
    logout,
    getUser,
    getToken
};






