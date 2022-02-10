// get id out of URL query parameters
const id = new URLSearchParams(location.search).get('id')

function renderBlogs(blogs) {
    const html = blogs.map(blog => {
        return `<li><a href="/blog.html?id=${blog.id}">${blog.title}</a></li>`
    }).join('')
    document.querySelector('#blogs').innerHTML = html
}

axios.get('/api/v1/blogs')
    .then(res => {
        renderBlogs(res.data)
    })

//trying to make the blog title show up at the top

function renderTitle(blog) {
    const html = `<h4 id="blogTitle">${blog.title}</h4>`
    document.querySelector('#title').innerHTML = html
}
axios.get(`api/v1/blogs/${id}`)
    .then(res => {
        renderTitle(res.data)
    })

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
                axios.get(`api/v1/blogs/${id}/posts/${post.id}/comments`)
                    .then(comments => {
                        renderComments(comments.data, post.id);
                    })
                return `<div class = "singlePost" >
        <div class = "profilePicture" ><img onerror='this.src="pictures/no-image.jpeg"' src="${post.user.profilePicture}" height="45px" width="45px"></div>
        <div class = "titlePost">${post.user.email.substring(0, post.user.email.indexOf('@'))}  (${new Date(post.createdAt).toLocaleString()})</div>
        <div> ${post.text}</div>
        <input type="image" src="pictures/like.jpeg" class="likeButton"  data-postId="${post.id}" width="25" height="25"><span id="like-counter${post.id}">${post.Likes.length}</span>&emsp;
        <input type="image" src="pictures/dislike.jpeg" class="dislikeButton"  data-postId="${post.id}" width="25" height="25"> <span id="dislike-counter${post.id}">${post.Dislikes.length}</span>
        <div class="commentSection"><div id="list-of-comments${post.id}"></form></div><button type="button" class="commentButton" data-postId="${post.id}">Comment</button></div>
        <form class="comment${post.id} d-none "><p>
        <label for="text">Comment below:</label><br>
        <textarea id="text${post.id}" class="w-75" required></textarea>
        </p>
        <p class="createdAt"></p>
        <button type="submit" id="submitButton" data-postId="${post.id}">Submit Comment</button></form>
        </div>
    </div>`
            }).join('')
            document.querySelector('.blogPosts').innerHTML = html
        })
}


function renderComments(comments, postId) {
    const userDetails = comments.map(comment => {
        if (!comment.UserId) {
            return Promise.resolve(comment)
        }
        return axios.get(`/api/v1/users/${comment.UserId}/profile`)
            .then(user => {
                return {
                    ...comment,
                    user: user.data
                }
            })
    })
    Promise.all(userDetails)
        .then(comments => {
            const html = comments.map(comment => {
                console.log(comment)
                return `<div class="${comment.id}">
                <div class = "profilePicture" ><img onerror='this.src="pictures/no-image.jpeg"' src="${comment.user.profilePicture}" height="45px" width="45px"></div>
                <div>${comment.user.email.substring(0, comment.user.email.indexOf('@'))}  (${new Date(comment.createdAt).toLocaleString()})</div>
                <div>${comment.comment}</div>
                <button class="DELETE" data-commentId="${comment.id}" data-postId="${postId}">Delete comment</button></div>
                <br>
                <br>`
            })
                .join('')
            document.querySelector(`#list-of-comments${postId}`).innerHTML = html
        })

}

function renderUserData(userData, commentData) {
  document.querySelector(`.userDataDiv${commentData.id}`).innerHTML = ` comment by: ${userData.email.substring(0, userData.email.indexOf('@'))}`
}

function renderLikes(posts, postId) {
    const post = posts.find(current => {
        return current.id == postId
    })
    document.querySelector(`#like-counter${postId}`).innerHTML = post.Likes.length
    document.querySelector(`#dislike-counter${postId}`).innerHTML = post.Dislikes.length
}


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
    document.getElementById("text").value = "";
})
//used timeout so that form can find 'submitButton' after posts have been rendered
const commentButtonTimeout = setTimeout(() => {
    document.addEventListener('click', e => {
        if (e.target.id == 'submitButton') {
            e.preventDefault();
            axios.post(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/comments`, {
                comment: document.querySelector(`#text${e.target.dataset.postid}`).value
            })
                .then(res => {
                    axios.get(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/comments`)
                        .then(comments => {
                            renderComments(comments.data, e.target.dataset.postid);
                        })
                })
            // document.querySelectorAll(".w-75").value = "";
        }

        if (e.target.classList.value == 'commentButton' && e.target.dataset.postid) {
            document.querySelector(`.comment${e.target.dataset.postid}`).classList.remove('d-none');
        }
        if (e.target.id == 'submitButton' && e.target.dataset.postid) {
            document.querySelector(`.comment${e.target.dataset.postid}`).classList.add('d-none');
        }

    })
}, 2000);



document.addEventListener('click', e => {
    if (e.target.classList.contains("likeButton")) {
        axios.post(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/likes`, {
            likes: e.target.value
        }).then(res => {
            alert('you liked this post!')
            axios.get(`api/v1/blogs/${id}/posts`)
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
        axios.post(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/dislikes`, {
            dislikes: e.target.value
        }).then(res => {
            alert('you disliked this post!')
            axios.get(`api/v1/blogs/${id}/posts`)
                .then(dislikes => {
                    renderLikes(dislikes.data, e.target.dataset.postid)
                })
        })
            .catch(error => {
                alert('you disliked this post already!')
            })
    }
})



//to remove a comment
document.addEventListener("click", e => {
    if (e.target.classList.contains(`DELETE`)) {
        axios.delete(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/comments/${e.target.dataset.commentid}`, {})
            .then(res => {
                axios.get(`api/v1/blogs/${id}/posts/${e.target.dataset.postid}/comments`)
                    .then(comments => {
                        renderComments(comments.data, e.target.dataset.postid);
                    })
            })
    }
})

