function logout() {
    window.location.href = "/index.html"
    localStorage.clear();
}
//mặc định tên là username;
var username;
//API get name
let bearerToken = "Bearer " + localStorage.getItem("token");
$(document).ready(function() {
    bearerToken = "Bearer " + localStorage.getItem("token");
    $.ajax({

        method: "GET",
        url: "http://localhost:8080/user/getUser",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            token: localStorage.getItem("token"),
        },
    }).done(function(response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200) {
                username = response.data.name;
            } else {
                console.log("check response user/getId/token:", response);
            }
        }
    });
    //biến để thay tên
    $('.admin-name').text(username);
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/user/getRoleId",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            token: localStorage.getItem("token"),
        },
    }).done(function(response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200) {
                roleId = response.data;
                if (roleId == 2) {
                    window.location.href = "/../../403.html"
                } else if (roleId == 1) {

                } else {
                    window.location.href = "/../../login.html?#"
                }
            } else {
                console.log("check response user/getId/token:", response);
            }
        }
    });
})