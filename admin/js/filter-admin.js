$(document).ready(function () {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/user/getRoleId",
        headers: { "Authorization": bearerToken },
        async: false,
        data: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            if (response != "" && response != null) {
                if (response.statusCode == 200) {
                    roleId = response.data;
                    if(response.data != 1){
                        window.location.href = "../../../403.html"
                    }
                }
                else if (response.statusCode == 401) {
                    localStorage.setItem("accessLinkContinue",$(location).attr('href'))
                    window.location.href = "../../../login.html"
                }
            }
        });
})