var images = ['3-anhem-nhaphattrien.jpeg', '3-anhem-nhaphattrien2.jpeg', '3-anhem-nhaphattrien3.jpeg', '3-anhem-nhaphattrien4.jpeg', '3-anhem-nhaphattrien5.jpeg', '3-anhem-nhaphattrien6.jpeg', '3-anhem-nhaphattrien7.jpeg', '3-anhem-nhaphattrien8.jpeg',];
document.addEventListener('DOMContentLoaded', function () {
    var imgPath = getRandomImage();
    document.getElementById('randomImage').src = imgPath;
});
$(document).ready(function () {

    // let bearerToken = "Bearer " + localStorage.getItem("token");
    // $.ajax({
    //     method: "GET",
    //     url: "http://localhost:8080/user/getuserbytoken",
    //     headers: { Authorization: bearerToken },
    //     async: false,
    //     data: {
    //         token: localStorage.getItem("token"),
    //     },
    // }).done(function (response) {
    //     if (response != "" && response != null) {
    //         if (response.statusCode == 200) {
    //             user = response.data;
    //             $('#username').text(user.name);
    //         } else {
    //             console.log("check response user/getuserbytoken:", response);
    //         }
    //     }
    // });
})
function getRandomImage() {
    var randomIndex = Math.floor(Math.random() * images.length);
    return 'images/users/' + images[randomIndex];
}