const STATUSES = ["pendiente", "en proceso", "resuelta"];

const requestList = document.getElementById("request-list");
const adminMessage = document.getElementById("admin-message");
const logoutButton = document.getElementById("logout-button");

async function start() {
    const { data } = await db.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }
    loadRequests();
}

async function loadRequests() {
    const { data, error } = await db
    .from ("requests")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        adminMessage.textContent = "No se pudieron cargar las solicitudes";
        return;
    }

    requestList.replaceChildren();

    if (data.length === 0) {
        adminMessage.textContent = "Todavia no hay solicitudes";
        return;
    }

    adminMessage.textContent = "";
    data.forEach(function (request) {
        requestList.appendChild(buildRow(request));
    });
}

function makeCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}

function buildRow(request) {
    const row = document.createElement("tr");

    row.appendChild(makeCell(new Date(request.created_at). toLocaleString("es")));
    row.appendChild(makeCell(request.full_name));
    row.appendChild(makeCell(request.whatsapp));
    row.appendChild(makeCell(request.barrio));
    row.appendChild(makeCell(request.request_type));
    row.appendChild(makeCell(request.description));

    const statusCell = document.createElement("td");
    statusCell.appendChild(buildStatusSelect(request));
    row.appendChild(statusCell);

    const actionCell = document.createElement("td");
    if (request.status === "resuelta") {
        actionCell.appendChild(buildDeleteButton(request));
    }
    row.appendChild(actionCell);

    return row;
}

function buildStatusSelect(request) {
    const select = document.createElement("select");

    STATUSES.forEach(function (status) {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        option.selected = status === request.status;
        select.appendChild(option);
    });

    select.addEventListener("change", function () {
        updateStatus(request.id, select.value, select);
    });

    return select;
}


async function updateStatus(id, newStatus, select) {
    select.disabled = true;

    const { data, error } = await db
        .from("requests")
        .update({ status: newStatus })
        .eq("id", id)
        .select();

    if (error || data.length === 0) {
        console.error(error);
        adminMessage.textContent = "No se pudo actualizar el estado.";
        loadRequests();
        return;
    }

    adminMessage.textContent = "";
    loadRequests();
}

function buildDeleteButton(request) {
    const button = document.createElement("button");
    button.textContent = "🗑️ Borrar";
    button.className = "btn-borrar";

    button.addEventListener("click", function () {
        deleteRequest(request.id, button);
    });

    return button;
}

async function deleteRequest(id, button) {
    const sure = confirm("¿Seguro que quieres borrar esta solicitud? No se puede deshacer.");
    if (!sure) return;

    button.disabled = true;

    const { data, error } = await db
        .from("requests")
        .delete()
        .eq("id", id)
        .select();

    if (error || data.length === 0) {
        console.error(error);
        adminMessage.textContent = "No se pudo borrar la solicitud.";
        button.disabled = false;
        return;
    }

    adminMessage.textContent = "";
    loadRequests();
}


logoutButton.addEventListener("click", async function () {
    await db.auth.signOut();
    window.location.href = "login.html";
});

start();