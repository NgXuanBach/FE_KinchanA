$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    let bearerToken = "Bearer " + localStorage.getItem("token");
    $('.profile-menu a').click(function (e) {
        const href = $(this).attr('href');
        $(this).attr('href', `${href}?username=${username}`);
    });
    // Lấy element input file
    const fileInput = $('#fileInput');
    fileInput.on('change', function () {
        let This = $(this);
        bootbox.confirm('Are you sure ?',
            function (result) {
                if (result == true) {
                    // Lấy tên file từ element file
                    const fileName = This.val().split('\\').pop();
                    const file = This.prop('files')[0];; // Get the first selected file
                    var formData = new FormData();
                    formData.append("file", file);
                    $.ajax({
                        method: 'POST',
                        url: "http://localhost:8080/uploadfile",
                        data: formData,
                        headers: { "Authorization": bearerToken },
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            console.log("success " + response);
                            $.ajax({
                                method: "POST",
                                url: "http://localhost:8080/user/updateavatar",
                                headers: { Authorization: bearerToken },
                                async: false,
                                data: {
                                    fileName: fileName,
                                    username: username,
                                },
                            }).done(function (response) {
                                if (response.data == true) {
                                    bootbox.alert("Success!", function () {
                                        location.reload();
                                    });
                                } else {
                                    bootbox.alert("Your avatar already exists !!")
                                }
                            })
                        },
                        error: function (xhr, status, error) {
                            console.log("error " + error);
                        }
                    });
                }
            });
    });
    const fileCoverImage = $('#fileCoverImageInput');
    fileCoverImage.on('change', function () {
        let This = $(this);
        bootbox.confirm('Are you sure ?',
            function (result) {
                if (result == true) {
                    // Lấy tên file từ element file
                    const fileName = This.val().split('\\').pop();
                    const file = This.prop('files')[0];; // Get the first selected file
                    var formData = new FormData();
                    formData.append("file", file);
                    $.ajax({
                        method: 'POST',
                        url: "http://localhost:8080/uploadfile",
                        data: formData,
                        headers: { "Authorization": bearerToken },
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            console.log("success " + response);
                            $.ajax({
                                method: "POST",
                                url: "http://localhost:8080/user/updatecoverimage",
                                headers: { Authorization: bearerToken },
                                async: false,
                                data: {
                                    fileName: fileName,
                                    username: username,
                                },
                            }).done(function (response) {
                                if (response.data == true) {
                                    bootbox.alert("Success!", function () {
                                        location.reload();
                                    });
                                } else {
                                    bootbox.alert("Your cover image already exists !!")
                                }
                            })
                        },
                        error: function (xhr, status, error) {
                            console.log("error " + error);
                        }
                    });
                }
            });
    });
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
                $(".country").text(user.address);
                $(".author-name").text(user.name);
                $("#posts").text(user.postsNumber);
                $("#followers").text(user.followersNumber);
                $("#following").text(user.followingNumber);
                var url = "images/Userimages/" + user.avatar;

                $.ajax({
                    url: url,
                    type: 'HEAD',
                    success: function () {
                        $("#avatar").attr("src", "images/Userimages/" + user.avatar);
                    },
                    error: function () {
                        // File không tồn tại
                        // Chuyển sang đường dẫn khác
                        $('#avatar').attr('src', 'images/Userimages/noprofile.jpeg');
                    }
                });
                url = "images/Userimages/" + user.coverImage;
                $.ajax({
                    url: url,
                    type: 'HEAD',
                    success: function () {
                        $("#coverImage").attr("src", "images/Userimages/" + user.coverImage);
                        convertImage($("#coverImage"));
                    },
                    error: function () {
                        // File không tồn tại
                        // Chuyển sang đường dẫn khác
                        $('#coverImage').attr('src', 'images/Userimages/nocover.jpg');
                        convertImage($("#coverImage"));
                    }
                });
            } else {
                console.log("check response user/getuserbytoken:", response);
            }

        }
    });
})
function convertImage(image) {
    image.css({
        maxWidth: 1110,
        maxHeight: 310,
        // objectFit: 'contain'
    });
}