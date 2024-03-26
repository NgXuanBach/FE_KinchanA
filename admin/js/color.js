$(document).ready(function () {
    let contentColorList = ""
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/color"
    }).done(function (result) {
        let stt = 1;
        $.each(result.data, function (index, currentItem) {
            contentColorList += `<tr>
        <td> ${stt} </td>
        <td> ${currentItem.id} </td>
        <td> ${currentItem.name} </td>
        <td>
          <button type="submit" color-id="${currentItem.id}" class="btn btn-primary mr-2 btn-delete">Delete</button>
        </td>
      </tr>`
            stt++;
        })
        $("#list-color").html(contentColorList)
        $(".btn-delete").click(function () {
            let colorId = $(this).attr("color-id")
            let This = $(this)
            $.ajax({
                method: "GET",
                url: "http://localhost:8080/color/delete?id=" + colorId
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
        let textColorName = $(".text-colorname").val()
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/color/add",
            data: {
                colorName: textColorName
            }
        }).done(function (result) {
            bootbox.alert(result.data, function () {
                location.reload();
            });
        })
    })    
})