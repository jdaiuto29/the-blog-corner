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
      document.querySelector('#profileInfo').innerHTML = html
    })
}