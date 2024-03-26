$(document).ready(function () {
    var stockTable = $('#stock-table tbody');
    var contentStock = "";
    let bearerToken = "Bearer " + localStorage.getItem("token");
    $.ajax({
        url: "http://localhost:8080/stock",
        type: "GET",
        async: false,
        success: function (res) {
            console.log()
            if (res != null && res != "") {
                listAllStock = res.data;
                listAllStock.map(function (currentItem, index, arr) {
                    contentStock += `<tr>
                    <td> ${currentItem.id} </td>
                    <td> ${currentItem.colorId} </td>
                    <td> ${currentItem.quantity} </td>
                    <td> ${currentItem.productId} </td>
                    <td> ${currentItem.price} </td>
                    <td> ${currentItem.image} </td>
                    <td>
                        <button type="submit" onclick="editRow(this)" class="btn btn-primary mr-2">Edit</button>
                        <button type="submit" stock-id="${currentItem.id}" class="btn btn-primary mr-2 btn-delete">Delete</button>
                        </td>
                </tr>`;
                });
                stockTable.append(contentStock);
            }
        },
        error: function (error) {
            console.error("Error API product ", error);
        }
    });
    $(".btn-delete").click(function () {
        let stockId = $(this).attr("stock-id")
        console.log(stockId);
        let This = $(this)
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/stock/delete?id=" + stockId
        }).done(function (result) {
            if (result.data == true) {
                bootbox.alert("Delete successfully", function () { });
                This.closest("tr").remove();
            } else {
                bootbox.alert("Delete successfully !")
            }
        })
    })
})
$(document).ready(function () {
    $.ajax({
        method: 'GET',
        contentType: "application/json",
        url: "http://localhost:8080/color",
        dataType: 'json',
        async: false,
        success: function (response) {
            var colorSelector = $('#color-selector')
            var row = "";
            listColor = response.data;
            $.each(listColor, function (index, color) {
                row += `<option value="${color.id}">${color.name}</option>`
            });
            colorSelector.append(row);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
    $.ajax({
        method: 'GET',
        contentType: "application/json",
        url: "http://localhost:8080/product",
        dataType: 'json',
        async: false,
        success: function (response) {
            var productSelector = $('#product-selector')
            var row = "";
            listproduct = response.data;
            $.each(listproduct, function (index, product) {
                row += `<option value="${product.id}">${product.name}</option>`
            });
            productSelector.append(row);
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
})
$(".showFormButton").on("click", function () {
    $("#form-display").show();
    $("#stock-list").hide();
    $('#save-btn').click(function (event) {
        var colorId = parseInt($('#color-selector').val());
        var categoryId = parseInt($('#category-selector').val());
        var productId = parseInt($('#product-selector').val());
        var price = $("#price").val();
        var quantity = $("#quantity").val();
        var imageUrl = $("#imageUrl").val();
        var fileInput = document.getElementById("fileInput");
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);
        $.ajax({
            method: 'POST',
            url: "http://localhost:8080/uploadfile",
            data: formData,
            headers: { "Authorization": bearerToken },
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("success " + response);
            },
            error: function (xhr, status, error) {
                console.log("error " + error);
            }
        });
        $.ajax({
            method: 'GET',
            url: "http://localhost:8080/downloadfile/" + encodeURIComponent(imageUrl),
            headers: { "Authorization": bearerToken },
            success: function (response) {
                console.log("success " + response);
            },
            error: function (xhr, status, error) {
                console.log("error " + error);
            }
        });
        $.ajax({
            method: 'POST',
            url: "http://localhost:8080/stock/add",
            // dataType: 'json',
            data: {
                "colorId": colorId,
                "categoryId": categoryId,
                "productId": productId,
                "imageUrl": imageUrl,
                "price": price,
                "quantity": quantity
            },
            // contentType: 'application/json',
            async: false,
            success: function (response) {
                console.log(response.data);
            },
            error: function (xhr, status, error) {
                console.log(error); // Xử lý lỗi nếu có
            }
        });
    })
});
function editRow(button) {
    var row = button.parentNode.parentNode;
    document.getElementById("stockid").value = row.cells[0].textContent;
    var colorId = parseInt(row.cells[1].textContent);
    $(`#color-selector option[value=${colorId}]`).prop("selected", true);
    var productId = parseInt(row.cells[3].textContent);
    $(`#product-selector option[value=${productId}]`).prop("selected", true);
    document.getElementById("quantity").value = row.cells[2].textContent;
    document.getElementById("price").value = row.cells[4].textContent;
    document.getElementById("imageUrl").value = row.cells[5].textContent;
    $("#form-display").show();
    $("#stock-list").hide();
    $('#save-btn').click(function (event) {
        var id = $("#stockid").val();
        var colorId = parseInt($('#color-selector').val());
        var categoryId = parseInt($('#category-selector').val());
        var productId = parseInt($('#product-selector').val());
        var price = $("#price").val();
        var quantity = $("#quantity").val();
        var image = $("#imageUrl").val();
        var fileInput = document.getElementById("fileInput");
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);
        $.ajax({
            method: 'POST',
            url: "http://localhost:8080/uploadfile",
            data: formData,
            headers: { "Authorization": bearerToken },
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("success " + response);
            },
            error: function (xhr, status, error) {
                console.log("error " + error);
            }
        });
        $.ajax({
            method: 'GET',
            url: "http://localhost:8080/downloadfile/" + encodeURIComponent(image),
            headers: { "Authorization": bearerToken },
            success: function (response) {
                console.log("success " + response);
            },
            error: function (xhr, status, error) {
                console.log("error " + error);
            }
        });
        $.ajax({
            method: 'POST',
            url: "http://localhost:8080/stock/update",
            data: {
                "id": id,
                "colorId": colorId,
                "productId": productId,
                "image": image,
                "price": price,
                "quantity": quantity
            },
            async: false,
            success: function (response) {
                console.log(response.data);
            },
            error: function (xhr, status, error) {
                console.log(error); // Xử lý lỗi nếu có
            }
        });
    })
}
$("#closeButton").on("click", function () {
    $("#form")[0].reset();
    $("#form-display").hide();
    $("#stock-list").show();
});