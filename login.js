const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    loginError.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
        loginError.textContent = "Correo y Contraseña Incorrectos";
    } else {
        window.location.href = "admin.html";
    }
});