$(document).ready(function() {
    var productTable = $('#product-table tbody');
    var contentProduct = "";
    let bearerToken = "Bearer " + localStorage.getItem("token");
    $.ajax({
        url: "http://localhost:8080/product",
        type: "GET",
        async: false,
        success: function(res) {
            if (res != null && res != "") {
                listAllProduct = res.data;
                listAllProduct.map(function(currentItem, index, arr) {
                    contentProduct += `<tr>
                    <td class="productId">${currentItem.id}</td>
                    <td>${currentItem.name}</td>
                    <td>${currentItem.categoryId}</td>
                    <td>${currentItem.image}</td>
                    <td>${currentItem.soldQuantity}</td>
                    <td style="overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;"> ${currentItem.description} </td>
                    <td>
                        <button type="submit" onclick="editRow(this)" class="btn btn-primary mr-2 edit-btn">Edit</button>
                        <button type="submit" class="btn btn-primary mr-2 delete-btn">Delete</button>
                    </td>
                </tr>`;
                });
                productTable.append(contentProduct);
            }
            $("#form")[0].reset();
        },
        error: function(error) {
            console.error("Error API product ", error);
        }
    });
    $.ajax({
        method: 'GET',
        contentType: "application/json",
        url: "http://localhost:8080/category",
        dataType: 'json',
        async: false,
        success: function(response) {
            var categorySelector = $('#category-selector')
            var row = "";
            listCategory = response.data;
            $.each(listCategory, function(index, category) {
                row += `<option value="${category.id}">${category.name}</option>`
            });
            categorySelector.append(row);
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
    $("button.edit-btn").on("click", function() {
        $("#form-display").show();
        $("#product-list").hide();
        $('#save-btn').click(function(event) {
            // event.preventDefault();
            var name = $('input#name').val();
            var soldQuantity = $('#sold-quantity').val();
            var categoryId = parseInt($('#category-selector').val());
            var description = $("#description").val();
            var filename = $('#image-name').val();
            var id = $("#productId").val();
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
                success: function(response) {
                    console.log("success " + response);
                },
                error: function(xhr, status, error) {
                    console.log("error " + error);
                }
            });
            $.ajax({
                method: 'GET',
                url: "http://localhost:8080/downloadfile/" + encodeURIComponent(filename),
                headers: { "Authorization": bearerToken },
                success: function(response) {
                    console.log("success " + response);
                },
                error: function(xhr, status, error) {
                    console.log("error " + error);
                }
            });
            $.ajax({
                method: 'POST',
                url: "http://localhost:8080/product/add",
                data: {
                    id: id,
                    name: name,
                    soldQuantity: soldQuantity,
                    categoryId: categoryId,
                    image: filename,
                    desc: description
                },
                async: false,
                success: function(response) {
                    console.log(response.data);
                },
                error: function(xhr, status, error) {
                    console.log(error); // Xử lý lỗi nếu có
                }
            });
        })
    });
    $("button.delete-btn").on("click", function() {
        var row = $(this).parent().parent();
        var id = $(row).find('td.productId').text();
        row.remove();
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/product/delete',
            data: {
                id: id,
            },
            success: function(response) {
                alert("xóa dữ liệu thành công");
            },
            error: function(xhr, status, error) {
                console.error(error);
                alert("xóa dữ liệu thất bại")
            }
        });
    })
    $(".showFormButton").on("click", function() {
        $("#form-display").show();
        $("#product-list").hide();
        $("#sold-quantity-group").addClass("d-none");
        $('#save-btn').click(function(event) {
            // event.preventDefault();
            var name = $('input#name').val();
            console.log(name);
            var soldQuantity = 0;
            var categoryId = parseInt($('#category-selector').val());
            var description = $("#description").val();
            var filename = $('#image-name').val();
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
                success: function(response) {
                    console.log("success " + response);
                },
                error: function(xhr, status, error) {
                    console.log("error " + error);
                }
            });
            $.ajax({
                method: 'GET',
                url: "http://localhost:8080/downloadfile/" + encodeURIComponent(filename),
                headers: { "Authorization": bearerToken },
                success: function(response) {
                    console.log("success " + response);
                },
                error: function(xhr, status, error) {
                    console.log("error " + error);
                }
            });
            $.ajax({
                method: 'POST',
                url: "http://localhost:8080/product/add",
                data: {
                    name: name,
                    soldQuantity: soldQuantity,
                    categoryId: categoryId,
                    image: filename,
                    desc: description
                },
                async: false,
                success: function(response) {
                    console.log(response.data);
                },
                error: function(xhr, status, error) {
                    console.log("error " + error);
                }
            });
        })
    });
    $("#closeButton").on("click", function() {
        $("#form")[0].reset();
        $("#form-display").hide();
        $("#product-list").show();
    });
})
function editRow(button) {
    //show thẻ sold-quantity ra
    document.getElementById("sold-quantity-group").classList.remove("d-none");
    var row = button.parentNode.parentNode; // Lấy hàng chứa nút "Edit"
    document.getElementById("productId").value = row.cells[0].textContent;
    document.getElementById("name").value = row.cells[1].textContent;
    var categoryId = parseInt(row.cells[2].textContent);
    document.getElementById("image-name").value = row.cells[3].textContent;
    document.getElementById("sold-quantity").value = row.cells[4].textContent;
    var optionCategory = $("#category-selector").find("option[value='" + categoryId + "']");
    $(optionCategory).prop("selected", true)
    document.getElementById("description").value = row.cells[5].textContent;
}