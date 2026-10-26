const form = document.getElementById("request-form");
const message = document.getElementById("form-message");
const submitButton = document.getElementById("boton-request");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    message.textContent = "";
    submitButton.disabled = true;

    const newRequest = {
        full_name: form.elements["full_name"].value.trim(),
        whatsapp: form.elements["whatsapp"].value.trim(),
        barrio: form.elements["barrio"].value,
        request_type: form.elements["request_type"].value.trim(),
        description: form.elements["description"].value.trim()
    };

    const { error } = await db.from("requests").insert(newRequest);

    if (error) {
        console.error(error);
        message.textContent = "No se pudo enviar la Solicitud";
    } else {
        alert("¡Solicitud enviada! Los administradores la revisarán pronto.");
        message.textContent = "Solicitud enviada Los administradores la revisaran pronto";
        form.reset();
    }

    submitButton.disabled = false;
})