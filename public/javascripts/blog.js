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
      const html = posts.map(post => {

          axios.get(`api/v1/blogs/${id}/${post.id}/comment`)
            .then(comments => {
              renderComments(comments.data, post.id);
            })

          return `<div>
        <div><img onerror='this.src="pictures/no-image.jpeg"' src="${post.user.profilePicture}" height="45px" width="45px"></div>
      <div>${post.user.email.substring(0, post.user.email.indexOf('@'))}  (${post.createdAt.replace('T', ' @ ').slice(0,18)})</div>
      <div> ${post.text}</div>
      <input type="image" src="pictures/like.jpeg" class="likeButton" data-postId="${post.id}" width="25" height="25"> ${post.Likes.length}&emsp;
      <input type="image" src="pictures/dislike.jpeg" class="dislikeButton" data-postId="${post.id}" width="25" height="25"> ${post.Dislikes.length}
      
      <div class="commentSection"><div id="list-of-comments${post.id}"></form></div><button type="button" class="commentButton" data-postId="${post.id}">Comment</button></div>
      <form class="comment${post.id} d-none"><p>
      <label for="text">Comment below:</label><br>
      <textarea id="text${post.id}" required></textarea>
      </p>
      <p class="createdAt"></p>
      <button type="submit" id="submitButton" data-postId="${post.id}">Submit Comment</button></form>
      </div>
  </div>`
        }).join('')
        //figure out where to put info
      document.querySelector('.blogPosts').innerHTML = html
    })
}

axios.get(`/api/v1/blogs/${id}`)
  .then(res => {
    renderBlogs(res.data)
  })

function renderComments(comments, postId) {
  const html = comments.map(comment => {
    return `<div>
        <div>${comment.comment}</div>
        <div>${comment.UserId}</div>
        <div>${comment.createdAt}</div>`
  }).join('')
  document.querySelector(`#list-of-comments${postId}`).innerHTML = html
}

axios.get(`/api/v1/blogs/${id}`)
  .then(res => {
    renderBlogs(res.data)
  })

axios.get(`/api/v1/blogs/${id}/posts`)
  .then(res => {
    renderPosts(res.data)
  })

//listen for submit events
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
          // update page with new post
        axios.get(`/api/v1/blogs/${id}/posts`)
          .then(res => {
            renderPosts(res.data)
          })


      })
      .catch(error => {
        //on error
        console.log(error.response)
          //display error
        alert(error.response.data.error || 'Something went wrong')
      })

  })
  //used timeout so that form can find 'submitButton' after posts have been rendered
const commentButtonTimeout = setTimeout(() => {
  document.addEventListener('click', e => {
    if (e.target.id == 'submitButton') {
      e.preventDefault();
      axios.post(`api/v1/blogs/${id}/${e.target.dataset.postid}/comment`, {
          comment: document.querySelector(`#text${e.target.dataset.postid}`).value
        })
        .then(res => {
          axios.get(`api/v1/blogs/${id}/${e.target.dataset.postid}/comment`)
            .then(comments => {
              renderComments(comments.data, e.target.dataset.postid);
            })
        })
    }

    if (e.target.classList.value = 'commentButton' && e.target.dataset.postid) {
      document.querySelector(`.comment${e.target.dataset.postid}`).classList.remove('d-none');
    }
  })
}, 2000);

document.addEventListener('click', e => {
  if (e.target.classList.contains("likeButton")) {
    axios.post(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/likes`, {

      likes: e.target.value

    })
  }
})

document.addEventListener('click', e => {
  if (e.target.classList.contains("dislikeButton")) {
    axios.post(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/dislikes`, {
      likes: e.target.value

    })
  }
})