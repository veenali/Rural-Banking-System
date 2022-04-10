const transferAmount = document.getElementById("transferAmount")
const invalidTransferAmount = document.getElementById("invalid-transferAmount")
const transferSubmitBtn = document.getElementById("transferSubmitBtn")
const transferAmountRequired = document.getElementById("transferAmountRequired")
const receiverEmail = document.getElementById("receiverEmail")
const emailRequired = document.getElementById("emailRequired")
const moneytransForm = document.getElementById("moneytransForm")

transferAmount.addEventListener('input', () => {
    if (transferAmount.value === "") transferAmountRequired.style.display = 'block'
    else transferAmountRequired.style.display = 'none'
    if (transferAmount.value <= 0) invalidTransferAmount.style.display = 'block'
    else invalidTransferAmount.style.display = 'none'
})

transferSubmitBtn.addEventListener('click', () => {
    if (receiverEmail.value === "")
        emailRequired.style.display = 'block'
    else
        emailRequired.style.display = 'none'
    if (transferAmount.value === "")
        transferAmountRequired.style.display = 'block'
    else
        transferAmountRequired.style.display = 'none'
    if (transferAmount.value > 0 && receiverEmail.value !== "")
        moneytransForm.submit()
    else
        transferAmount.focus()
})