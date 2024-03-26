$(document).ready(function () {
  let contentUser = `<thead>
    <tr>
      <th> ID </th>
      <th> UserName </th>
      <th> admin </th>
      <th> user</th>
      <th> Confirm</th>
    </tr>
  </thead><tbody>
  `;
  $.ajax({
    method: "GET",
    url: "http://localhost:8080/user/getall"
  }).done(function (result) {
    if (result != null && result != "") {
      listUser = result.data;
      $.each(listUser, function (index, currentItem) {
        if (parseInt(currentItem.roleId) == 1) {
          contentUser += `
                       <tr>
                        <td> ${currentItem.id} </td>
                        <td>
                          ${currentItem.name}
                        </td>
                        <td>
                          <label class="form-check-label">
                            <input type="radio" value="1" name="userid${currentItem.id}" checked> </label>
                        </td>
                        <td>
                          <label class="form-check-label">
                            <input type="radio" value="2" name="userid${currentItem.id}"></label>
                        </td>
                        <td>
                          <button class="btn btn-facebook btn-save" user-id="${currentItem.id}">Save</button>
                        </td>
                      </tr>`
        } else {
          contentUser += `
                        <tr>
                          <td> ${currentItem.id} </td>
                          <td>
                          ${currentItem.name}
                          </td>
                          <td>
                            <label class="form-check-label">
                              <input type="radio" value="1" name="userid${currentItem.id}"></label>
                          </td>
                          <td>
                            <label class="form-check-label">
                              <input type="radio" value="2" name="userid${currentItem.id}" checked></label>
                          </td>
                          <td>    
                            <button class="btn btn-facebook btn-save" user-id="${currentItem.id}">Save</button>
                          </td>
                        </tr>`
        }
      });
      contentUser += `</tbody>`
      $("#user-table").html(contentUser)
      $(".btn-save").click(function () {
        let This = $(this)
        bootbox.confirm('Are you sure ?',
          function (result) {
            if (result == true) {
              let userId = This.attr("user-id")
              let temp = "input[name='userid" + userId + "']:checked"
              let roleId = $(temp).val();
              $(this).delay(700).queue(function () {
                $.ajax({
                  method: "POST",
                  url: "http://localhost:8080/user/updaterole",
                  data: {
                    userId: userId,
                    roleId: roleId
                  }
                }).done(function (result) {
                  if (result.data == false) {
                    bootbox.alert("You have not changed role yet !")
                  } else {
                    bootbox.alert("Success!", function () {
                      location.reload();
                    });
                  }
                });
                $(this).dequeue();
              });
            }
          });
      })
    }
  });
})
