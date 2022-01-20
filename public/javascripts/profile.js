function renderProfile(user) {
  document.querySelector('.profileInfo').innerHTML = `
  <div><img onerror='this.src="pictures/no-image.jpeg"' src="${user.profilePicture}" height="100px" width="100px"></div>  
  <form id="submitPicture">
  <input type="file" class="profilePicture"><br><br>
  <div><input type="submit"></div>
</form>
  <div>${user.firstName}</div>
  <div>${user.email}</div>

  `
}

const user = JSON.parse(localStorage.getItem('user'))
axios.get(`/api/v1/users/${user.id}/profile`)
  .then(res => {
    renderProfile(res.data)
  })

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