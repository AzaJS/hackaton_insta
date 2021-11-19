const API = "http://localhost:8000/instagram";

//связывание с html
let addPost = $("#add-post");
let search = $("#search-bar");
let postList = $("#post");
let photo = $("#add-photo");
let description = $("#add-description");
let profile = $("#add-profile");
let btnCreate = $("#btn-create-post");
let paginate = $("#paginate");
let photoprofile = $('#add-photoprofile')

//edit
let editProfile = $("#edit-profile");
let editPhoto = $("#edit-photo");
let editDescr = $("#edit-description");
let editPhotoprofile = $('#edit-photoprofile')
let btnSaveEdit = $("#btn-save-edit");
let editId = $("#edit-id");

let page = 1;
let limit = 2;

function getPost() {
  fetch(`${API}?q=${search.val()}&_page=${page}&_limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      postList.empty();
      data.forEach((item) => {
        //   console.log(item)
        postList.append(`
          <div id=${item.id} class="card m-3" style="width: 18rem;">
                <div style="height: 35px" class="card-header d-flex justify-content-between align-items-center">
                     <div style="
                     width: 30px;
                     height: 30px;
                     border-radius: 50%;
                     background-image: url(${item.photoprofile});
                     background-size: cover;"></div>
                     <strong>${item.profile}</strong>
                     <img src="img./delete.png" style="height: 20px; cursor: pointer" id="btn-delete"/>
                </div>
                <div class="card">
                    <div>
                        <img src=${item.photo} class="card-img-top"/>
                    </div>
                    </div>
                    <div class="d-flex justify-content-between">
                            <div>
                            <img style="height: 20px; margin-left: 5px" src="img./like.PNG"/>
                            <img style="height: 20px; margin-left: 5px" src="img./comment.PNG"/>
                            </div>
                            <div>
                            <img id="btn-edit" data-bs-toggle="modal"
                            data-bs-target="#exampleModal1" src="img./edit.png" style="height: 20px; cursor: pointer"/>
                            </div>
                        
                        </div>
                        <div>
                        <strong>${item.profile}</strong>
                        ${item.description}
                        </div>
                
        </div>`);
      });
      paginate.html(`
        <div>
        <button class="btn btn-dark" id="btn-prev" ${
          page == 1 ? "disabled" : ""
        }>Previous</button>
        <strong>${page}</strong>
        <button class="btn btn-dark" id="btn-next" ${
          data.length < limit ? "disabled" : ""
        }>Next</button>
        </div>
        `);
    });
}
getPost();

//pagination
$("body").on("click", "#btn-prev", function () {
  // console.log('prev clicked');
  page -= 1;
  getPost();
});
$("body").on("click", "#btn-next", function () {
  // console.log('next clicked');
  page += 1;
  getPost();
});

//deleting
$("body").on("click", "#btn-delete", function (e) {
  let id = e.target.parentNode.parentNode.id;
  fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  }).then(() => getPost());
});

btnCreate.on("click", function (e) {
  let newPost = {
    profile: profile.val(),
    photo: photo.val(),
    photoprofile: photoprofile.val(),
    description: description.val(),
  };
  console.log("clicked");
  fetch(API, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  }).then(() => {
    console.log("POST ADDED"), getPost();
  });
});

$("body").on("click", "#btn-edit", function (e) {
  let id = e.target.parentNode.parentNode.parentNode.id;
  fetch(`${API}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      editProfile.val(data.profile);
      editPhoto.val(data.photo);
      editDescr.val(data.description);
      editPhotoprofile.val(data.photoprofile)
      editId.val(data.id);
    });
});

btnSaveEdit.on("click", function () {
  let editedPost = {
    profile: editProfile.val(),
    photo: editPhoto.val(),
    photoprofile: editPhotoprofile.val(),
    description: editDescr.val(),
  };
  
  fetch(`${API}/${editId.val()}`, {
    method: "PATCH", 
    body: JSON.stringify(editedPost),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    }, 
  }).then(() => getPost());
});

//search
search.on("input", function () {
  getPost();
});
