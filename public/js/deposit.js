const depositAmount = document.getElementById("depositAmount")
const invalidDepositAmount = document.getElementById("invalid-depositAmount")
const depositSubmitBtn = document.getElementById("depositSubmitBtn")
const depositAmountRequired = document.getElementById("depositAmountRequired")
const depositForm = document.getElementById("depositForm")

depositAmount.addEventListener('input', () => {
    if (depositAmount.value === "") depositAmountRequired.style.display = 'block'
    else depositAmountRequired.style.display = 'none'
    if (depositAmount.value <= 0) invalidDepositAmount.style.display = 'block'
    else invalidDepositAmount.style.display = 'none'
})

depositSubmitBtn.addEventListener('click', () => {
    if (depositAmount.value === "") depositAmountRequired.style.display = 'block'
    else depositAmountRequired.style.display = 'none'
    if (depositAmount.value > 0) depositForm.submit()
    else depositAmount.focus()
})