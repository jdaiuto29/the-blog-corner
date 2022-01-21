// const post = require("../../models/post")

console.debug('Script Starting')

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

///trying to put posts on the homepage

//first attempt
// function renderPosts(posts) {
//     const html = posts.map(post => {
//             return ` 
//             <div> ${post.text}</div>`
//     }).join('')
//     document.querySelector('#putPosts').innerHTML = html
//     }

// axios.get(`/api/v1/blogs/${id}`)
//         .then(res => {
//             renderPosts(res.data)
//         })

//second attempt
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
                return `<div class = "singlePost" >
                <h4 id="blogTitle">${post.Blog.title}</h4>
            <div class = "profilePicture" ><img onerror='this.src="pictures/no-image.jpeg"' src="${post.User.profilePicture}" height="45px" width="45px"></div>
            <div class = "titlePost">${post.user.email.substring(0, post.user.email.indexOf('@'))}  (${new Date(post.createdAt).toLocaleString()})</div>
            <div> ${post.text}</div>
            <input type="image" src="pictures/like.jpeg" class="likeButton" data-postId="${post.id}" width="25" height="25"> ${post.Likes.length}&emsp;
            <input type="image" src="pictures/dislike.jpeg" class="dislikeButton" data-postId="${post.id}" width="25" height="25"> ${post.Dislikes.length}
        </div>`
            }).join('')
            //figure out where to put info
            document.querySelector('.blogPosts').innerHTML = html
        })
    }

    axios.get('/api/v1/posts')
        .then(res => {
            renderPosts(res.data)
        })

