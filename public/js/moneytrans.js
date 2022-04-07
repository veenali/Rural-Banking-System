const transferAmount = document.getElementById("transferAmount")
const invalidTransferAmount = document.getElementById("invalid-transferAmount")
const transferSubmitBtn = document.getElementById("transferSubmitBtn")
const transferAmountRequired = document.getElementById("transferAmountRequired")
const email = document.getElementById("email")
const emailRequired = document.getElementById("emailRequired")
const moneytransForm = document.getElementById("moneytransForm")

transferAmount.addEventListener('input', () => {
    if (transferAmount.value === "") transferAmountRequired.style.display = 'block'
    else transferAmountRequired.style.display = 'none'
    if (transferAmount.value <= 0) invalidTransferAmount.style.display = 'block'
    else invalidTransferAmount.style.display = 'none'
})

transferSubmitBtn.addEventListener('click', () => {
    if (email.value === "")
        emailRequired.style.display = 'block'
    else
        emailRequired.style.display = 'none'
    if (transferAmount.value === "")
        transferAmountRequired.style.display = 'block'
    else
        transferAmountRequired.style.display = 'none'
    if (transferAmount.value > 0 && email.value !== "")
        moneytransForm.submit()
    else
        transferAmount.focus()
})