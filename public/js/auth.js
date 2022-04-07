const password = document.getElementById("password")
const email = document.getElementById("email")
const submitBtn = document.getElementById("submitBtn")
const form = document.getElementById("form")

// console.log(password.value);
submitBtn.addEventListener('click', () => {
    const passwordError = document.getElementById("invalid-input")
    const emailRequiredError = document.getElementById("emailRequiredError")
    const passwordRequiredError = document.getElementById("passwordRequiredError")
    let flag = 1
    if (email.value === "") {
        emailRequiredError.style.display = 'block';
        flag = 0
    } else {
        emailRequiredError.style.display = 'none';
    }
    if (password.value === "") {
        passwordRequiredError.style.display = 'block';
        flag = 0
    } else {
        passwordRequiredError.style.display = 'none'
    }
    if (password.value !== "" && password.value.length < 8) {
        passwordError.style.display = 'block'
        password.focus()
        flag = 0
    }
    if (flag) form.submit()
})