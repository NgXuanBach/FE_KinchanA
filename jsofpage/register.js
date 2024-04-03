$(document).ready(function () {
    $('#password').on('input', function () {
        var password = $(this).val();
        // Kiểm tra độ dài mật khẩu
        $('#length').toggleClass('valid', password.length >= 8).toggleClass('invalid', password.length < 8);
        // Kiểm tra kí tự viết hoa
        $('#uppercase').toggleClass('valid', isUpperCase(password)).toggleClass('invalid', !isUpperCase(password));
        // Kiểm tra kí tự đặc biệt
        $('#specialchar').toggleClass('valid', isSpecialCharacter(password)).toggleClass('invalid', !isSpecialCharacter(password));
    });
    // catch event click button submit
    $("#btn-submit").click(function (envent) {
        var isValid = $('#length').hasClass('valid') && $('#uppercase').hasClass('valid') && $('#specialchar').hasClass('valid');
        envent.preventDefault()
        let formIsValue = true
        if (!isValid) {
            formIsValue == false;
        }
        // get all item in form
        let email = $("#email").val()
        let username = $("#username").val()
        let userName = $("#user-name").val()
        let password = $("#password").val()
        let confirmPassword = $("#confirmPass").val()
        let alternateAddressCheckbox = $("#alternateAddressCheckbox").prop("checked")
        // catch exception email
        let emailWarning = $("#email-warning")
        if (email == "") {
            formIsValue = false;
            emailWarning.text("The email is not empty!")
            emailWarning.removeClass("d-none")

        } else if (!isValidEmail(email)) {
            formIsValue = false;
            emailWarning.text("The email is not valid!")
            emailWarning.removeClass("d-none")
        }
        else {
            emailWarning.addClass("d-none")
        }
        // catch exception username
        let usernameWarning = $("#username-warning")
        if (username == "") {
            formIsValue = false;
            usernameWarning.text("The username is not empty!")
            usernameWarning.removeClass("d-none")
        } else if (isSpecialCharacter(username)) {
            // The username must not have special characters.
            formIsValue = false;
            usernameWarning.text("The username must not have special characters.")
            usernameWarning.removeClass("d-none")
        }
        else {
            usernameWarning.addClass("d-none")
        }
        // catch exception user-name
        let userNameWarning = $("#user-name-warning")
        if (userName == "") {
            formIsValue = false;
            userNameWarning.text("The username is not empty!")
            userNameWarning.removeClass("d-none")
        } else if (isSpecialCharacter(userName)) {
            // The username must not have special characters.
            formIsValue = false;
            userNameWarning.text("The username must not have special characters.")
            userNameWarning.removeClass("d-none")
        }
        else {
            userNameWarning.addClass("d-none")
        }

        // catch exception confirm-password
        let confirmPasswordWarning = $("#confirmPass-warning")
        if (confirmPassword != password) {
            formIsValue = false;
            confirmPasswordWarning.text("The confirm password does not match the password.")
            confirmPasswordWarning.removeClass("d-none")
        } else {
            confirmPasswordWarning.addClass("d-none")
        }
        // catch exception checked policy
        alternateAddressCheckboxWarning = $("#alternateAddressCheckbox-warning")
        if (!alternateAddressCheckbox) {
            formIsValue = false;
            alternateAddressCheckboxWarning.text("You must agree to the BOTIQUE's TERMS OF USE and PRIVACY POLICY.")
            alternateAddressCheckboxWarning.removeClass("d-none")
        } else {
            alternateAddressCheckboxWarning.addClass("d-none")
        }

        if (alternateAddressCheckbox == true && formIsValue == true) {
            let submitWarning = $("#submit-warning")
            $.ajax({
                url: 'http://localhost:8080/signup',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(
                    {
                        "name": username,
                        "password": password,
                        "email": email,
                        "username":userName
                    }
                ),
                contentType: 'application/json',
                async: false,
                success: function (response) {
                    if (response != "" && response != "") {
                        if (response.statusCode == 200) {
                            // localStorage.setItem("userInfo", JSON.stringify(response.data.userInfo))
                            localStorage.setItem("token", response.data.token)
                            bootbox.dialog({
                                message: "Register successfully!",
                                closeButton: false
                            });
                            setTimeout(function () {
                                window.location.href = 'login.html';
                            }, 2000);
                        } else if (response.statusCode == 500) {
                            submitWarning.text(response.message)
                            submitWarning.removeClass("d-none")
                        } else {
                            submitWarning.addClass("d-none")
                        }

                    }
                }
            });
        }

    })
})
function isValidEmail(email) {
    // Regex kiểm tra định dạng email
    var emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}
function isSpecialCharacter(char) {
    // Sử dụng biểu thức chính quy để kiểm tra ký tự đặc biệt
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialCharacterRegex.test(char);
}
function isUpperCase(char) {
    // Sử dụng biểu thức chính quy để kiểm tra ký tự đặc biệt
    const upperCase = /[A-Z]/;
    return upperCase.test(char);
}
function isWhitespace(str) {
    return str.indexOf(" ") !== -1;
}

