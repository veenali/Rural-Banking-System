const withdrawAmount = document.getElementById("withdrawAmount")
const invalidWithdrawAmount = document.getElementById("invalid-withdrawAmount")
const withdrawSubmitBtn = document.getElementById("withdrawSubmitBtn")
const withdrawAmountRequired = document.getElementById("withdrawAmountRequired")
const withdrawForm = document.getElementById("withdrawForm")

withdrawAmount.addEventListener('input', () => {
    if (withdrawAmount.value === "") withdrawAmountRequired.style.display = 'block'
    else withdrawAmountRequired.style.display = 'none'
    if (withdrawAmount.value <= 0) invalidWithdrawAmount.style.display = 'block'
    else invalidWithdrawAmount.style.display = 'none'
})

withdrawSubmitBtn.addEventListener('click', () => {
    if (withdrawAmount.value === "") withdrawAmountRequired.style.display = 'block'
    else withdrawAmountRequired.style.display = 'none'
    if (withdrawAmount.value > 0) withdrawForm.submit()
    else withdrawAmount.focus()
})