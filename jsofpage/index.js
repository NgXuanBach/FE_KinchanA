$(document).ready(function () {
    let bearerToken = "Bearer " + localStorage.getItem("token");
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/user/getuserbytoken",
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
                console.log("check response user/getuserbytoken:", response);
            }
        }
    });
})