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
                user = response.data;
                $('#username').text(user.name);
                localStorage.setItem("id", user.id);
            } else {
                console.log("check response user/getuserbytoken:", response);
            }
        }
    });
    var userId = localStorage.getItem("id");
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/usermessage/getbysender",
        headers: { Authorization: bearerToken },
        async: false,
        data: {
            senderId: userId
        },
    }).done(function (response) {
        let dropMessages = document.getElementById("drop-messages");
        let messsages = ``;
        if (response != "" && response != null) {
            if (response.statusCode == 200 && response.data != null) {
                response.data.map(function (currentItem, index, arr) {
                    messsages += `<li friend-message-id = ${currentItem.recipient.id}>
                    <a class="show-mesg" href="#" title="">
                        <figure>
                            <img src="images/resources/thumb-1.jpg" alt="">
                            <span class="status f-online"></span>
                        </figure>
                        <div class="mesg-meta">
                            <h6 class="user-name" >${currentItem.recipient.name}</h6>
                            <span><i class="ti-check"></i>${currentItem.messageResponseList[currentItem.messageResponseList.length - 1].content}</span>
                            <i>${timeAgo(currentItem.messageResponseList[currentItem.messageResponseList.length - 1].timestamp)}</i>
                        </div>
                    </a>
                </li>`
                })
                dropMessages.innerHTML = messsages;
            }
        }

    })
    $('.friends-chat > li, .chat-users > li, .drops-menu > li').on('click', function (e) {
        let senderMessageList;
        let recipientMessageList;
        let messageList;
        let friendMessageId = $(this).attr("friend-message-id");
        let messageBox = document.getElementById("message-box");
        var li = $(e.target).closest('li');
        var username = li.find('.user-name').text();
        $('#message-name').text(username);
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
            messageBox.innerHTML = messageContent;
        } else {
            messageBox.innerHTML = `<li style = "text-align: center">Have a nice chat</li>`      
        }
        console.log(messageList);
    })
})
function logout() {
    localStorage.clear();
    window.location.href = "/login.html"
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
function timeAgo(inputTime) {
    const inputDate = new Date(inputTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now - inputDate) / 1000);
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    if (diffInSeconds < minute) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < hour) {
        return `${Math.floor(diffInSeconds / minute)} mins ago`;
    } else if (diffInSeconds < day) {
        return `${Math.floor(diffInSeconds / hour)} hours ago`;
    } else if (diffInSeconds < month) {
        return `${Math.floor(diffInSeconds / day)} days ago`;
    } else if (diffInSeconds < year) {
        return `${Math.floor(diffInSeconds / month)} months ago`;
    } else {
        return `${Math.floor(diffInSeconds / year)} years ago`;
    }
}