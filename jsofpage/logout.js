$(document).ready(function () {
    $("#btn-login").click(function () {
        var email = $("#email").val();
        var password = $("#password").val();
        console.log("email", email)
        console.log("pass", password)
        let roleId = 0;
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/signin",
            contentType: "application/json", // Thêm dòng này để chỉ định loại nội dung là JSON
            data: JSON.stringify({ // Sử dụng JSON.stringify() để chuyển đổi dữ liệu thành chuỗi JSON
                email: email,
                password: password,
            }),
        }).done(function (result) {
            //khi gọi API thì kết quả sẽ
            // if (result.statusCode == 200) {
            let bearerToken = "Bearer " + result.data;
            // lưu token vào bộ nhớ của browser
            localStorage.setItem("token", result.data);
            window.location.href = "index.html";
            // $.ajax({
            //     method: "GET",
            //     url: "http://localhost:8080/user/getid",
            //     headers: { Authorization: bearerToken },
            //     async: false,
            //     data: {
            //         token: localStorage.getItem("token"),
            //     },
            // }).done(function (response) {
            //     if (response != "" && response != null) {
            //         if (response.statusCode == 200) {
            //             // localStorage.setItem("userId", response.data);
            //         } else {
            //             console.log("check response user/getId/token:", response);
            //         }
            //     }
            // });
            // $.ajax({
            //     method: "GET",
            //     url: "http://localhost:8080/user/getRoleId",
            //     headers: { Authorization: bearerToken },
            //     async: false,
            //     data: {
            //         token: localStorage.getItem("token"),
            //     },
            // }).done(function (response) {
            //     if (response != "" && response != null) {
            //         if (response.statusCode == 200) {
            //             roleId = response.data;
            //         } else {
            //             console.log("check response user/getId/token:", response);
            //         }
            //     }
            // });
            // //"giohang":[{id:1,title:"shirt",price:109,soluong:10}]
            // // chuyển qua trang index
            // let accessLinkContinue = localStorage.getItem("accessLinkContinue");
            // if (
            //     accessLinkContinue != "" &&
            //     accessLinkContinue != null &&
            //     accessLinkContinue != "null"
            // ) {
            //     localStorage.removeItem("accessLinkContinue");
            // } else {
            //     if (roleId == 1) {
            //         accessLinkContinue = "admin/index.html";
            //     }
            //     else {
            //         accessLinkContinue = "index.html"
            //     }
            // }
            // $("#login-warning").addClass("d-none");
            // if (roleId == 1) {
            //     if (!accessLinkContinue.startsWith("admin")) {
            //         window.location.href = "admin/index.html";
            //     } else {
            //         window.location.href = accessLinkContinue;
            //     }
            // }
            // else {
            //     if (accessLinkContinue.startsWith(location.origin + "/admin")) {
            //         window.location.href = "index.html";
            //     } else {
            //         window.location.href = accessLinkContinue;
            //     }
            // }
            // } else {
            //     $("#login-warning").removeClass("d-none");
            // }
        });
    });
})
