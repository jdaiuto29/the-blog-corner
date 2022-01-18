// get id out of URL query parameters
const id = new URLSearchParams(location.search).get('id')

function renderBlogs(blog) {
  document.querySelector('#title').innerHTML = blog.title
}

function renderPosts(posts) {
  const userDetails = posts.map(post => {
    if (!post.UserId) {
      return Promise.resolve(post)
    }
    return axios.get(`/api/v1/users/${post.UserId}/profile`)
      .then(user => {
        return {
          ...post,
          user: user.data

        }

      })
  })
  Promise.all(userDetails)
    .then(posts => {
      console.log(posts)
      const html = posts.map(post => {
          return `<div>
          <div><img src="${post.user.profilePicture}" height="45px" width="45px"></div>
        <div>${post.user.email.substring(0, post.user.email.indexOf('@'))}  (${post.createdAt.replace('T', ' @ ').slice(0,18)})</div>
        <div> ${post.text}</div>
    </div>`
        }).join('')
        //figure out where to put info
      document.querySelector('.blogPosts').innerHTML = html
    })
}

axios.get(`/api/v1/blogs/${id}`)
  .then(res => {
    renderBlogs(res.data)
    console.log(res.data)
  })

axios.get(`/api/v1/blogs/${id}/posts`)
  .then(res => {
    renderPosts(res.data)
  })

//listen for submit events
//NEED LOCATIONS!!
document.querySelector('#postForm').addEventListener('submit', e => {
  e.preventDefault()
    //send data to backend
  axios.post(`/api/v1/blogs/${id}/posts`, {
      text: document.querySelector("#text").value,
      createdAt: document.querySelector(".createdAt").value
    })
    .then(res => {
      // on success display success message
      const reviewToast = document.querySelector('#reviewToast')
      const toast = new bootstrap.Toast(reviewToast)
      toast.show()
        // update page with new reviews
      axios.get(`/api/v1/blogs/${id}/posts`)
        .then(res => {
          renderPosts(res.data)
        })

      //hide review form
      //change location below instead of having reviewForm

    })
    .catch(error => {
      //on error
      console.log(error.response)
        //display error
      alert(error.response.data.error || 'Something went wrong')
    })

})