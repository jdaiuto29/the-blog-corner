const loginForm = document.querySelector('#loginForm')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  axios.post('/api/v1/users/login', {
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value
    })
    .then(res => {
      alert('logged in successfully')
      window.localStorage.setItem('user', JSON.stringify(res.data))
      window.location = '/index.html'
    })
    .catch(error => {
      alert(error.response.data.error || 'something went wrong')
    })
})