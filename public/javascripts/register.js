const registerForm = document.querySelector('#registerForm')
registerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  axios.post('/api/v1/users/register', {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      email: document.querySelector("#registerEmail").value,
      password: document.querySelector("#registerPassword").value
    })
    .then(res => {
      alert(`User created successfully! Please Login!`)
      window.location = '/index.html'
    })
    .catch(error => {
      alert(error.response.data.error || 'Something went wrong')
    })
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