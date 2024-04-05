$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    let bearerToken = "Bearer " + localStorage.getItem("token");
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
            if (response.statusCode == 200 && response.data != null) {
                let user = response.data;
                let friendListContent = `<li>
                    <span>about</span>
                    <p>${user.about} </p>
                </li>
                <li>
                    <span>Address</span>
                    <p>${user.address}</p>
                </li>
                <li>
                    <span>Hobbies</span>
                    <p>${user.hobbies}</p>
                </li>`
                let friendList = document.querySelector(".short-profile");
                friendList.innerHTML = friendListContent;
                let imageStock = document.querySelector(".merged5");
                if (user.imageStock != null && user.imageStoc != '') {
                    let imageStockList = JSON.parse(user.imageStock);
                    $('#imagesCapacity').text(imageStockList.length);
                    let contentImageStock = ``;
                    imageStockList.map(function (currentItem, index, arr) {
                        contentImageStock += `<div class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                    <div class="item-box">
                        <a class="strip" href="images/Userimages/${currentItem.image}" title=""
                            data-strip-group="mygroup"
                            data-strip-group-options="loop: false">
                            <img src="images/Userimages/${currentItem.image}" alt="" style="
                            height: 155px;
                        "></a>
                        <div class="over-photo">
                            <a href="#" title=""><i class="fa fa-heart"></i> 15</a>
                            <span>${timeAgo(currentItem.timestamp)}</span>
                        </div>
                    </div>
                </div>`
                    })
                    imageStock.innerHTML = contentImageStock;
                } else {
                    $('#imagesCapacity').text(0);
                    imageStock.innerHTML = `<div style="
                    padding-left: 300px;
                ">THERE AREN'T IMAGES</div>`;
                }
            } else {
                console.log("check response /user/getuserbyusername:", response);
            }
        }
    });
})
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