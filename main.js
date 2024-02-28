// verificar se o email não é vazio e se o email é valido
// se verdadeiro, então habilitar o botão de recuperar senha 
// se falto, então desabilitar o botão de recuperar senha

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    showLoading();
    // Retornando o obj de autenticação do FireBase
    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
        hideLoading();
        window.location.href = "src/home/home.html";
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    })
}

function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário não encontrado";
    }
    return error.message;
}

function register() {
    window.location.href = "src/register/register.html";
}

//Recuperando a senha do usuário
function recoverPassword() {
    showLoading();

    // Verifica se há métodos de login associados ao email
    firebase.auth().fetchSignInMethodsForEmail(form.email().value)
        .then((signInMethods) => {
            if (signInMethods.length === 0) {
                hideLoading();
                alert('Este email não está associado a uma conta.');
                // Adicione o return para interromper a execução aqui
                return;
            } else {
                return firebase.auth().sendPasswordResetEmail(form.email().value);
            }
        })
        .then(() => {
            // Sucesso no envio do email de redefinição de senha
            hideLoading();
            alert('Email enviado com sucesso');
        })
        .catch(error => {
            // Tratamento de outros erros
            hideLoading();
            alert(getErrorMessage(error));
        });
}




function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validaEmail(email);
}

function toggleEmailErrors() {
    const email = form.email().value;

    form.emailRequiredError().style.display = email ? "none" : "block";

    form.emailInvalidError().style.display = validaEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;

    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPassword().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isPasswordValid() {
    const password = form.password().value;
    if (!password) {
        return false;
    }
    return true;
}

const form = {
    email: () => document.getElementById('email'),
    emailInvalidError: () => document.getElementById('email-invalid-error'),
    emailRequiredError: () => document.getElementById('email-required-error'),
    loginButton: () => document.getElementById('login-button'),
    password: () => document.getElementById('password'),
    passwordRequiredError: () => document.getElementById('password-required-error'),
    recoverPassword: () => document.getElementById('recover-password-button')
}