
const registerForm = document.querySelector('#registerForm')
registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    axios.post('/api/v1/users/register', {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    email: document.querySelector("#email").value,
    password: document.querySelector("#password").value
    })
    .then(res => {
        alert('user created successfully')
        window.location = '/login.html'
    })
    .catch(error => {
        console.log(error.response)
        alert(error.response.data.error || 'Something went wrong')
    })
})