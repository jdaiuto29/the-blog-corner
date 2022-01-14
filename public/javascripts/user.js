
const user = JSON.parse(window.localStorage.getItem('user'))
//if true
if (user) {
    //find all 'logged-in-only' elements
    const loggedInElements = document.querySelectorAll(".logged-in-only")
    //display elements
    for (const element of loggedInElements) {
        // console.log(element)
        element.classList.remove('d-none')
    }
} else {
    //find all '.logged-out-only' elements
    const loggedOutElements = document.querySelectorAll(".logged-out-only")
    //display them
    for (const element of loggedOutElements){
        element.classList.remove('d-none')
    }
}

//listen to all document events
document.addEventListener('click', e=> {
    //if the click happened on a .log-out button
    if(e.target.classList.contains('logout-button')){
        //tell the back end to logout
        axios.get('/api/v1/users/logout')
        .then(()=> {
            //remove user ifo
            window.localStorage.removeItem('user')
            //and reload the page
            window.location.reload()
        })
    }
})

//double check with html for correct locations