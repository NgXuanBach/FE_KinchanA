// Bách
$(document).ready(function () {
    let contentColorList = ""
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/category"
    }).done(function (result) {
        let stt = 1;
        $.each(result.data, function (index, currentItem) {
            contentColorList += `<tr>
      <td> ${stt} </td>
      <td> ${currentItem.id} </td>
      <td> ${currentItem.name} </td>
      <td>
        <button type="submit" category-id="${currentItem.id}" class="btn btn-primary mr-2 btn-delete">Delete</button>
      </td>
    </tr>`
            stt++;
        })
        $("#list-category").html(contentColorList)
        $(".btn-delete").click(function () {
            let categoryID = $(this).attr("category-id")
            let This = $(this)
            $.ajax({
                method: "GET",
                url: "http://localhost:8080/category/delete?id=" + categoryID
            }).done(function (result) {
                if (result.data == true) {
                    bootbox.alert("Delete successfully", function () {
                    });
                    This.closest("tr").remove();
                }
                else {
                    bootbox.alert("Delete successfully !")
                }
            })
        })
    })
    $(".btn-create").click(function () {
        let textcatename = $("#CategoryName").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/category/add",
            data: {
                catename: textcatename
            }
        }).done(function (result) {
            bootbox.alert(result.data, function () {
                location.reload();
            });
        })
    })
})