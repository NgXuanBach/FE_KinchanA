$(document).ready(function () {
    let bearerToken = "Bearer " + localStorage.getItem("token");
    let friendMessageContainer = document.getElementById("friend-message-container");
    let contentFriendMessage = ``
    let userId = localStorage.getItem("id");
    let userPostList = document.querySelector('.loadMore');
    let postList = ``;
    let parts;
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/post/getall",
    }).done(function (response) {
        if (response.statusCode == 200 && response.data != null) {
            response.data.map(function (currentItem, index, arr) {
                parts = currentItem.date.split('T');
                date = parts[0];
                time = parts[1];
                postList += `<div class="central-meta item">
                <div class="user-post">
                <div class="friend-info">
            <figure>
                <img alt="" src="images/Userimages/${currentItem.avatar}">
            </figure>
            <div class="friend-name">
                <ins><a title="" href="timeline.html?username=${currentItem.username}">${currentItem.authorName}</a></ins>
                <span>published: ${formatDate(date) + ' ' + convertTimeFormat(time)}</span>
            </div>
            <div class="statusDescription">
                <p>
                   ${currentItem.content}
                </p>
            </div>
            <div class="post-meta">
                <figure>
                    <a title="" href="#">
                        <img class="post-image" alt="" src="images/Userimages/${currentItem.postImage}">
                    </a>
                </figure>
                <div class="we-video-info">
                    <ul>
                        <li>
                            <div class="likes heart" title="Like/Dislike">❤
                                <span>${currentItem.likeCapacity}</span>
                            </div>
                        </li>
                        <li>
                            <span class="comment" title="Comments">
                                <i class="fa fa-commenting"></i>
                                <ins>0</ins>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="coment-area">
                <ul class="we-comet">
                    <li>
                        <div class="comet-avatar">
                            <img src="images/resources/nearly3.jpg" alt="">
                        </div>
                        <div class="we-comment">
                            <h5><a href="time-line.html" title="">Jason
                                    borne</a></h5>
                            <p>we are working for the dance and sing songs. this
                                video is very awesome for the youngster. please
                                vote this video and like our channel</p>
                            <div class="inline-itms">
                                <span>1 year ago</span>
                                <a class="we-reply" href="#" title="Reply"><i
                                        class="fa fa-reply"></i></a>
                                <a href="#" title=""><i
                                        class="fa fa-heart"></i><span>20</span></a>
                            </div>
                        </div>

                    </li>
                    <li>
                        <div class="comet-avatar">
                            <img src="images/resources/comet-4.jpg" alt="">
                        </div>
                        <div class="we-comment">
                            <h5><a href="time-line.html" title="">Sophia</a>
                            </h5>
                            <p>we are working for the dance and sing songs. this
                                video is very awesome for the youngster.
                                <i class="em em-smiley"></i>
                            </p>
                            <div class="inline-itms">
                                <span>1 year ago</span>
                                <a class="we-reply" href="#" title="Reply"><i
                                        class="fa fa-reply"></i></a>
                                <a href="#" title=""><i
                                        class="fa fa-heart"></i><span>20</span></a>
                            </div>
                        </div>
                    </li>
                    <li class="post-comment">
                        <div class="comet-avatar">
                            <img src="images/resources/nearly1.jpg" alt="">
                        </div>
                        <div class="post-comt-box">
                            <form method="post">
                                <textarea
                                    placeholder="Post your comment"></textarea>
                                <button type="submit"></button>
                            </form>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </div>
        </div>`
            })
            userPostList.innerHTML = postList;
            // $('.post-image').css("width", "100");
        } else {
            bootbox.alert("Your status wasn't uploaded yet!!")
        }
    });
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/userrelationship/getbyuserid",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            userId: userId,
        },
    }).done(function (response) {
        if (response != "" && response != null) {
            if (response.statusCode == 200) {
                let listUser = response.data;
                listUser.map(function (currentItem, index, arr) {
                    contentFriendMessage += `<li friend-message-id = ${currentItem.friend.id} id="hand">
                        <div class="author-thmb">
                            <figure>
                                <img src="images/resources/side-friend5.jpg">
                            </figure>
                            <span class ="user-name">${currentItem.friend.name}</span>
                        </div>
                    </li>`
                })
                friendMessageContainer.innerHTML = contentFriendMessage;
            } else {
                console.log("check response userrelationship/getbyuserid:", response);
            }
        }
    });
    const fileInput = $('#statusFile');
    let fileName = null;
    let file; // Get the first selected file
    let formData = new FormData();
    formData.append("file", file);
    fileInput.on('change', function () {
        fileName = $(this).val().split('\\').pop();
        file = $(this).prop('files')[0];; // Get the first selected file
        formData.append("file", file);
        $("#fileName").text(fileName);
    })
    $(".post-btn").click(function (e) {
        e.preventDefault();
        let statusContent = $("#statusContent").val();
        if ((statusContent != "" && statusContent != null) || formData.has("file")) {
            // Lấy thời gian hiện tại theo UTC
            var utcNow = new Date();
            // Chuyển đổi sang múi giờ Việt Nam (GMT+7)
            var vnNow = new Date(utcNow.getTime() + (7 * 60 * 60 * 1000));
            // Định dạng thời gian
            var currentTime = vnNow.toISOString().replace(/\.\d+$/, "");
            if (formData.has("file")) {
                $.ajax({
                    method: 'POST',
                    url: "http://localhost:8080/uploadfile",
                    data: formData,
                    headers: { "Authorization": bearerToken },
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        console.log("success uploadfile " + response);
                    },
                    error: function (xhr, status, error) {
                        console.log("error uploadfile " + error);
                    }
                });
            }
            e.preventDefault();
            $.ajax({
                method: "POST",
                url: "http://localhost:8080/post/addpost",
                headers: { Authorization: bearerToken },
                contentType: "application/json",
                data: JSON.stringify({
                    content: statusContent,
                    date: currentTime,
                    userToken: localStorage.getItem("token"),
                    image: fileName
                }),
            }).done(function (response) {
                if (response.statusCode == 200 && response.data == true) {
                    bootbox.dialog({
                        message: "Success!",
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    bootbox.alert("Your status wasn't uploaded yet!!")
                }
            });

        }
    })
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
function convertTimeFormat(timeString) {
    let [hours, minutes] = timeString.split(':');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours.toString();
    hours = hours.startsWith('0') ? hours.substring(1) : hours;
    return `${hours}:${minutes}${ampm}`;
}