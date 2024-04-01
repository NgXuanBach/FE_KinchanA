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

})