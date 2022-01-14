console.debug('Script Starting')

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