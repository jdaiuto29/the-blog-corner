function renderProfile(user) {
  document.querySelector('.profileInfo').innerHTML = `
  <div><img onerror='this.src="pictures/no-image.jpeg"' src="${user.profilePicture}" height="200px" width="200px"></div>  
  <form id="submitPicture">
  <span id="uploadProfilePicture">Update Profile Picture:</span>
  <div class="input-group input-group-sm mb-3">
  <input type="file" class="form-control profilePicture" id="profilePic" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
  <button class="btn btn-outline-secondary" type="submit" id="profilePic">Upload</button>
</div>
</form>
  <div>Name: ${user.firstName + ' ' + user.lastName}</div>
  <div>Email: ${user.email}</div><br>
</div>
  </div>
  <span style="text-decoration:underline; font-weight:bold;">Recent Posts:</span><br><br>
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
      <input type="image" src="pictures/like.jpeg" class="likeButton"  data-postId="${post.id}" width="25" height="25"><span id="like-counter${post.id}">${post.Likes.length}</span>&emsp;
      <input type="image" src="pictures/dislike.jpeg" class="dislikeButton"  data-postId="${post.id}" width="25" height="25"> <span id="dislike-counter${post.id}">${post.Dislikes.length}</span>
      <div>posted in <em><a href="/blog.html?id=${post.Blog.id}">${post.Blog.title}</a></em> @ ${new Date(post.createdAt).toLocaleString()}</div>
      </div>
      `
    }
  }).join('')
  document.querySelector(`.userPost`).innerHTML = html
}

document.addEventListener('submit', e => {
  e.preventDefault()
  const formData = new FormData()
  formData.append('image', document.querySelector('.profilePicture').files[0])
  axios.post(`api/v1/users/${user.id}/add-profile-picture`, formData)
    .then(res => {
      location.reload()
    })
    .catch(error => {
      alert('something went wrong')
    })
})