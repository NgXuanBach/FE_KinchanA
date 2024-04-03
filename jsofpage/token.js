export const getBearerToken = function(){
    return "Bearer "+localStorage.getItem("token")
 }
 export const getToken = function(){
    return localStorage.getItem("token")
 }