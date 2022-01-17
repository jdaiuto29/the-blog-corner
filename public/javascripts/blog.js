// const { render } = require("express/lib/application")


// get id out of URL query parameters
const id = new URLSearchParams(location.search).get('id')

function renderBlogs(blog) {
    document.querySelector('#title').innerHTML = blog.title
}

function renderPosts(posts) {
   let htmlString = '';
    posts.forEach(post => {
        htmlString += `<div> 
        <div>${post.UserId}</div>
        <div> ${post.text}</div>
        <div>${post.createdAt}</div>
        <div class="commentSection"><div id="list-of-comments${post.id}"></div><button type="button" class="commentButton" data-postId="${post.id}">Comment</button></div>
        <form class="comment${post.id} d-none"><p>
        <label for="text">Comment below:</label><br>
        <textarea id="text${post.id}" required></textarea>
        </p>
        <p class="createdAt"></p>
        <button type="submit" id="submitButton" data-postId="${post.id}">Submit Comment</button></form>
        </div>`
        axios.get(`api/v1/blogs/${id}/${post.id}/comment`)
            .then(comments => {
                renderComments(comments.data, post.id);
            })

    })
    document.querySelector('.blogPosts').innerHTML = htmlString;
}


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

        if (e.target.classList.value = 'commentButton') {
            document.querySelector(`.comment${e.target.dataset.postid}`).classList.remove('d-none');
        }
    })
}, 2000);