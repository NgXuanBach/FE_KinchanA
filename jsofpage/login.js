$(document).ready(function () {
    $("#btn-login").click(function (event) {
        event.preventDefault()
        var email = $("#email").val();
        var password = $("#password").val();
        let roleId = 0;
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/signin",
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                password: password,
            }),
        }).done(function (result) {
            //khi gọi API thì kết quả sẽ
            if (result.statusCode == 200) {
                let bearerToken = "Bearer " + result.data;
                localStorage.setItem("token", result.data);
                bootbox.dialog({
                    message: "Login successfully!",
                    closeButton: false
                });
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 2000);

                $("#login-warning").addClass("d-none");

            } else {
                $("#login-warning").removeClass("d-none");
            }
        });
    });
})
