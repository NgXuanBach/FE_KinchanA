$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    let bearerToken = "Bearer " + localStorage.getItem("token");
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/userrelationship/getbyusername",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            username: username,
        },
    }).done(function (response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200 && response.data != null) {
                let friendListContent =``;
                response.data.map(function (currentItem, index, arr) {
                    friendListContent+=`<div class="col-lg-3 col-md-6 col-sm-6">
                    <div class="friend-box">
                        <figure>
                            <img src="images/resources/frnd-cover1.jpg" alt="">
                            <span>Followers: ${currentItem.followersNumber}</span>
                        </figure>
                        <div class="frnd-meta">
                            <img src="images/resources/frnd-figure1.jpg" alt="">
                            <div class="frnd-name">
                                <a href="timeline.html?username=${currentItem.username}" title="">${currentItem.name}</a>
                                <span>${currentItem.address}</span>
                            </div>
                            <ul class="frnd-info">
                                <li><span>Friends:</span> ${currentItem.friendsCapacity} </li>
                                <li><span>Photos:</span> 144</li>
                                <li><span>Post:</span> ${currentItem.postsNumber}</li>
                                <li><span>Since:</span>${formatDate(currentItem.joined)}</li>
                            </ul>
                            <a class="send-mesg" href="#" title="">Message</a>
                            <div class="more-opotnz">
                                <i class="fa fa-ellipsis-h"></i>
                                <ul>
                                    <li><a href="#" title="">Block</a></li>
                                    <li><a href="#" title="">UnBlock</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`
                })
                $("#friendsfollowers").text(response.data.length);
                // console.log(friendListContent);
                let friendList = document.getElementById("friendList");
                friendList.innerHTML = friendListContent;
            } else {
                console.log("check response userrelationship/getbyfriendid:", response);
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