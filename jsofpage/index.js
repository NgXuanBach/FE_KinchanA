var images = ['3-anhem-nhaphattrien2.jpeg', '3-anhem-nhaphattrien3.jpeg', '3-anhem-nhaphattrien4.jpeg', '3-anhem-nhaphattrien5.jpeg', '3-anhem-nhaphattrien6.jpeg', '3-anhem-nhaphattrien7.jpeg'];
document.addEventListener('DOMContentLoaded', function () {
    var imgPath = getRandomImage();
    document.getElementById('randomImage').src = imgPath;
});
$(document).ready(function () {
    let bearerToken = "Bearer " + localStorage.getItem("token");
    let friendMessageContainer = document.getElementById("friend-message-container");
    let contentFriendMessage = ``
    let userId = localStorage.getItem("id");
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
                            <span class="status f-online"></span> ${currentItem.friend.name}
                        </div>
                    </li>`
                })
                friendMessageContainer.innerHTML = contentFriendMessage;
            } else {
                console.log("check response userrelationship/getbyuserid:", response);
            }
        }
    });
    $('.friends-chat > li, .chat-users > li').on('click', function () {
        let senderMessageList;
        let recipientMessageList;
        let messageList;
        let friendMessageId = $(this).attr("friend-message-id");
        let messageBox = document.getElementById("message-box");
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/user/getuserbyid",
            headers: { Authorization: bearerToken },
            async: false,
            data: {
                id: friendMessageId
            },
        }).done(function (response) {
            if (response != "" && response != null) {
                if (response.statusCode == 200) {
                    $('#message-name').text(response.data.name);
                    $.ajax({
                        method: "GET",
                        url: "http://localhost:8080/usermessage/getbysenderandrecipient",
                        headers: { Authorization: bearerToken },
                        async: false,
                        data: {
                            senderId: userId,
                            recipientId: friendMessageId
                        },
                    }).done(function (response) {
                        if (response != "" && response != null) {
                            if (response.statusCode == 200 && response.data != null) {
                                senderMessageList = JSON.parse(JSON.stringify(response.data.messageResponseList));
                                senderMessageList.forEach(function (obj) {
                                    obj.role = 'you';
                                });
                            }
                        }
                    })
                    $.ajax({
                        method: "GET",
                        url: "http://localhost:8080/usermessage/getbysenderandrecipient",
                        headers: { Authorization: bearerToken },
                        async: false,
                        data: {
                            senderId: friendMessageId,
                            recipientId: userId
                        },
                    }).done(function (response) {
                        if (response != "" && response != null) {
                            if (response.statusCode == 200 && response.data != null) {
                                recipientMessageList = JSON.parse(JSON.stringify(response.data.messageResponseList));
                                recipientMessageList.forEach(function (obj) {
                                    obj.role = 'me';
                                });
                            }
                        }
                    })
                    if (senderMessageList != null && recipientMessageList != null)
                        messageList = senderMessageList.concat(recipientMessageList);
                    if (senderMessageList != null && recipientMessageList == null)
                        messageList = senderMessageList;
                    if (senderMessageList == null && recipientMessageList != null)
                        messageList = recipientMessageList;
                    if (messageList != null && messageList != undefined) {
                        messageList.sort(function (a, b) {
                            return a.timestamp.localeCompare(b.timestamp);
                        });
                        let messageContent = ``;
                        let date;
                        let time;
                        messageList.map(function (currentItem, index, arr) {
                            let parts = currentItem.timestamp.split('T');
                            date = parts[0];
                            time = parts[1];

                            messageContent += `<li class="${currentItem.role}">
                        <div class="chat-thumb"><img
                                src="images/resources/chatlist1.jpg" alt="">
                        </div>
                        <div class="notification-event">
                            <span class="chat-message-item">
                                ${currentItem.content}
                            </span>
                            <span class="notification-date"><time
                                    datetime="2004-07-24T18:18"
                                    class="entry-date updated">${compareDateTime(date) + ' at ' + convertTimeFormat(time)}</time></span>
                        </div>
                    </li>`
                        })
                        messageBox.innerHTML = messageContent
                    } else {
                        messageBox.innerHTML = `<li style = "text-align: center">Have a nice chat</li>`

                    }
                    console.log(messageList);


                } else {
                    console.log("check response user/getuserbyid:", response);
                }
            }
        });
    })
})
function getRandomImage() {
    var randomIndex = Math.floor(Math.random() * images.length);
    return 'images/users/' + images[randomIndex];
}
function compareDateTime(dateString) {
    var today = new Date();
    var currentDate = today.getDate();
    var currentMonth = today.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    var currentYear = today.getFullYear();
    var dateParts = dateString.split('-');
    var year = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10);
    var date = parseInt(dateParts[2], 10);
    if (date === currentDate && month === currentMonth && year === currentYear) {
        return "Today";
    } else {
        return dateString;
    }
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