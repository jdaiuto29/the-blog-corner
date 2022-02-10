
function renderProfile(user) {
  document.querySelector('.profileInfo').innerHTML = `
  <div><img onerror='this.src="pictures/no-image.jpeg"' src="${user.profilePicture}" height="200px" width="200px"></div>  
  <form id="submitPicture">
  <span id="uploadProfilePicture">Update Profile Picture:</span>
  <div class="input-group input-group-sm mb-3">
  <input type="file" class="form-control profilePicture" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
  <button class="btn btn-outline-secondary uploadPicture" type="submit" >Upload</button>
</div>
</form>
  <div>Name: ${user.firstName + ' ' + user.lastName}</div>
  <div>Email: ${user.email}</div><br>
  <button type="button" class="btn btn-warning ms-2 me-2 mt-2" data-bs-toggle="modal" data-bs-target="#updateModal">
  Update Profile
</button>

<!-- The Modal -->
<div class="modal" id="updateModal">
  <div class="modal-dialog">
      <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
              <h4 class="modal-title">Update Profile Information</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <!-- Modal body -->

          <div class="modal-body">
              <h5> Update Profile</h5><br>
              <form id="updateForm">
                  <p>
                      <label for="firstName">First Name</label><br>
                      <input type="text" id="firstName" />
                  </p>
                  <p>
                      <label for="lastName">Last Name</label><br>
                      <input type="text" id="lastName" />
                  </p>
                  <p>
                      <label for="email">Email</label><br>
                      <input type="email" id="email" />
                  </p>
                  <p>
                      <label for="password">Password</label><br>
                      <input type="password" id="password" />
                  </p>
                  <button type="submit" class="updateButton">Update</button>
              </form>
          </div>
          <!-- Modal footer -->
          <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div>
      </div>

  </div>
</div>
  <br><br><span style="text-decoration:underline; font-weight:bold; margin-left:10px;">Recent Posts:</span><br><br>
  <div class="userPost"></div>
  
  `
}



const user = JSON.parse(localStorage.getItem('user'))
axios.get(`/api/v1/users/${user.id}/profile`)
  .then(res => {
    renderProfile(res.data)
  })

axios.get('/api/v1/posts')
  .then(res => {
    renderUserPosts(res.data)
  })

function renderUserPosts(posts) {
  const html = posts.map(post => {
    if (user.id == post.UserId) {
      return `
      <div class="${post.id} singlePost">
      <div>${post.text}</div>
      <input type="image" src="pictures/like.jpeg" class="likeButton"  data-blogId="${post.BlogId}" data-postId="${post.id}" width="25" height="25"><span id="like-counter${post.id}">${post.Likes.length}</span>&emsp;
      <input type="image" src="pictures/dislike.jpeg" class="dislikeButton"  data-blogId="${post.BlogId}" data-postId="${post.id}" width="25" height="25"> <span id="dislike-counter${post.id}">${post.Dislikes.length}</span>
      <div>posted in <em><a href="/blog.html?id=${post.Blog.id}">${post.Blog.title}</a></em> @ ${new Date(post.createdAt).toLocaleString()}</div>
      </div>
      `
    }
  }).join('')
  document.querySelector(`.userPost`).innerHTML = html
}

// submit picture
document.addEventListener('click', e => {

  if (e.target.classList.contains("uploadPicture")) {
    const formData = new FormData()
    formData.append('image', document.querySelector('.profilePicture').files[0])
    e.preventDefault()
    axios.post(`api/v1/users/${user.id}/add-profile-picture`, formData)
      .then(res => {
        window.location = "/profile.html"
      })
      .catch(error => {
        alert('something went wrong')
      })
  }
})

document.addEventListener('click', e => {
  if (e.target.classList.contains("likeButton")) {
    axios.patch(`api/v1/blogs/${e.target.dataset.blogid}/posts/${e.target.dataset.postid}/likes`, {
        likes: e.target.value
      }).then(res => {
        alert('you liked this post!')
        axios.get(`api/v1/blogs/${e.target.dataset.blogid}/posts`)
          .then(likes => {
            renderLikes(likes.data, e.target.dataset.postid)
          })
      })
      .catch(error => {
        alert('you liked this post already!')
      })
  }
})


document.addEventListener('click', e => {
  if (e.target.classList.contains("dislikeButton")) {
    axios.post(`api/v1/blogs/${e.target.dataset.blogid}/posts/${e.target.dataset.postid}/dislikes`, {
        dislikes: e.target.value
      }).then(res => {
        alert('you disliked this post!')
        axios.get(`api/v1/blogs/${e.target.dataset.blogid}/posts`)
          .then(dislikes => {
            renderLikes(dislikes.data, e.target.dataset.postid)
          })
      })
      .catch(error => {
        alert('you disliked this post already!')
      })
  }
})

function renderLikes(posts, postId) {
  const post = posts.find(current => {
    return current.id == postId
  })
  document.querySelector(`#like-counter${postId}`).innerHTML = post.Likes.length
  document.querySelector(`#dislike-counter${postId}`).innerHTML = post.Dislikes.length
}

// update profile info
document.addEventListener('click', e => {
  if (e.target.classList.contains("updateButton")) {
    e.preventDefault()
    axios.patch(`/api/v1/users/${user.id}/update-profile`, {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
      })
      .then(res => {
        alert(`Profile successfully updated`)
        location.reload()
      })
      .catch(error => {
        alert(error.response.data.error || 'Something went wrong')
      })
  }
})

function renderBlogs(blogs) {
  const html = blogs.map(blog => {
    return `<li><a href="/blog.html?id=${blog.id}">${blog.title}</a></li>`
  }).join('')
  document.querySelector('#blogs').innerHTML = html
}