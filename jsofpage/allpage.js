$(document).ready(function () {
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
                document.querySelector(".user-img").innerHTML = `
					<h5 id="username">${user.name}</h5>
					<img id = "avatar" src="images/Userimages/${user.avatar}" alt="">
					<div class="user-setting">
						<span class="seting-title">User setting <a href="#" title="">see all</a></span>
						<ul class="log-out">
							<li><a href="about.html?username=${user.username}" title=""><i class="ti-user"></i> view profile</a></li>
							<li><a href="timeline.html?username=${user.username}" title=""><i class="ti-pencil-alt"></i>edit profile</a></li>
							<li><a href="setting.html?username=${user.username}" title=""><i class="ti-settings"></i>account setting</a></li>
							<li><a onclick="logout()" title=""><i class="ti-power-off"></i>log out</a></li>
						</ul>
					</div>
                `
                $("#avatar").css({
                    maxWidth: 45,
                    maxHeight: 45,
                    // objectFit: 'contain'
                });
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
            } else {
                dropMessages.innerHTML = "<span style='padding-left: 100px;' >No one messages here</span>";
                console.log("check response usermessage/getbysender:", response);
            }
        }

    })
    $('.friends-chat > li, .chat-users > li, .drops-menu > li').on('click', function (e) {
        let senderMessageList;
        let recipientMessageList;
        let messageList;
        let friendMessageId = $(this).attr("friend-message-id");
        console.log("friendmessageid ", friendMessageId)
        let messageBox = document.getElementById("message-box");
        var li = $(e.target).closest('li');
        var username = li.find('.user-name').text();
        $('#message-name').text(username);
        $("#message-text").val("");
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
        const chatBoxOpen = localStorage.getItem('chatBoxOpen') === 'true';

        $("#btn-submit").click(function (event) {
            event.preventDefault();

            // Identify the active chatbox based on the clicked button
            const clickedButton = $(this);
            const chatBox = clickedButton.closest('.chat-box'); // Adjust selector if needed

            // Check if the clicked button belongs to an open chatbox
            if (chatBox.hasClass('show')) {
                const messageText = $("#message-text").val();
                console.log(friendMessageId)
                if (messageText != "" && messageText != null) {
                    const currentTime = new Date().toISOString().slice(0, 19);
                    const messageObj = {
                        content: messageText,
                        timestamp: currentTime
                    };
                    $.ajax({
                        method: "POST",
                        url: "http://localhost:8080/usermessage/sendmessage",
                        headers: { Authorization: bearerToken },
                        contentType: "application/json",
                        data: JSON.stringify({
                            messageResponse: messageObj,
                            senderId: userId,
                            recipientId: friendMessageId,
                        }),
                    }).done(function (response) {
                        if (response != "" && response != null) {
                            if (response.statusCode == 200 && response.data == true) {
                                $("#message-text").val("");
                                const parts = currentTime.split('T');
                                const date = parts[0];
                                const time = parts[1];
                                showMessage(messageText, date, time);
                            }
                        }
                    });
                }
            } else {
                // Handle the case where the button isn't associated with an open chatbox (optional)
                console.log("Submit button not associated with an open chatbox");
            }

            // console.log("click send message from chatbox:", chatBox.length ? chatBox.attr('id') : 'none'); // Log the ID of the active chatbox or 'none' if not open
        });
    })
})
function showMessage(message, date, time) {
    $("#message-box").append(
        `<li class="you">
                <div class="chat-thumb"><img
                        src="images/resources/chatlist1.jpg" alt="">
                </div>
                <div class="notification-event">
                    <span class="chat-message-item">
                        ${message}
                    </span>
                    <span class="notification-date"><time
                            datetime="2004-07-24T18:18"
                            class="entry-date updated">${compareDateTime(date) + ' at ' + convertTimeFormat(time)}</time></span>
                </div>
            </li>`);
}
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