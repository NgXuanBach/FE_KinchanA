$(document).ready(function () {
    let username;
    let bearerToken = "Bearer " + localStorage.getItem("token");
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/user/getuserbytoken",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            token: localStorage.getItem("token"),
        },
    }).done(function (response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200) {
                let user = response.data;
                $("#about-me").text(user.about);
                $("#birth-day").text(formatDate(user.birthDay));
                $("#joined").text(formatDate(user.joined));
                $("#address").text(user.address);
                $("#sex").text(user.gender);
                $("#phone-number").text(user.phoneNumber);
                $("#hobbies").text(user.hobbies);
                $("#job").text(user.job);
            } else {
                console.log("check response user/getuserbytoken:", response);
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/userrelationship/getbyuserid",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            userId: localStorage.getItem("id"),
        },
    }).done(function (response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200 && response.data != null) {
                let friendListContent =``;
                response.data.map(function (currentItem, index, arr) {
                    friendListContent+=`<li>
                    <img src="images/resources/recent1.jpg" alt="">
                    <div class="sugtd-frnd-meta">
                        <a href="#" title="">${currentItem.friend.name}</a>
                        <span>1 mutual friend</span>
                        <ul class="add-remove-frnd">
                            <li class="add-tofrndlist"><a class="send-mesg" href="#" title="Send Message"><i class="fa fa-commenting"></i></a></li>
                            <li class="remove-frnd"><a href="#" title="remove friend"><i class="fa fa-user-times"></i></a></li>
                        </ul>
                    </div>
                </li>`
                })
                // console.log(friendListContent);
                let friendList = document.querySelector(".frndz-list");
                friendList.innerHTML = friendListContent;
            } else {
                console.log("check response user/getuserbytoken:", response);
            }
        }
    });
})
function formatDate(inputDate) {
    const date = new Date(inputDate);

    // Lấy các thông tin ngày tháng từ đối tượng Date
    const year = date.getFullYear();
    const month = date.getMonth(); // Tháng trả về giá trị từ 0 đến 11
    const day = date.getDate();

    // Tạo mảng tên tháng
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Định dạng chuỗi ngày tháng
    const formattedDate = `${months[month]} ${day}, ${year}`;

    // Trả về chuỗi ngày tháng đã định dạng
    return formattedDate;
}