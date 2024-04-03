const bearerToken = "Bearer " + localStorage.getItem("token");
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/user/getuserbyusername",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            username: username,
        },
    }).done(function (response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200) {
                let user = response.data;
                // user.name !=null ? $(".h4 author-name").text(user.name) : $(".h4 author-name").text("Not yet");
                user.about !=null ? $("#about").text(user.about) : $("#about").text("Not yet");
                // $("#about").text(user.about);
                user.job !=null ? $("#job").text(user.job) : $("#job").text("Not yet");
                // $("#job").text(user.job);
                user.hobbies !=null ? $("#hobbies").text(user.hobbies) : $("#hobbies").text("Not yet");
                // $("#hobbies").text(user.hobbies);
                $(".country").text(user.address);
            } else {
                console.log("check response user/getuserbyusername:", response);
            }
        }
    });
})