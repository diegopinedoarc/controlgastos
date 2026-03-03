// Elementos del HTML
const inputValue = document.querySelector("#valorGasto");
const btnAdd = document.querySelector(".btnAdd");
const listaDeGastos = document.querySelector(".lista-gastos");
const totalGastos = document.querySelector(".total-gastos");
const btnDeleteAll = document.querySelector(".btnDeleteAll");
const inputNombre = document.querySelector("#nombreLista");
const btnAddNombre = document.querySelector(".btnAddNombre");
const btnCerrarLote = document.querySelector(".btnCerrarLote");
const listaLotes = document.querySelector(".lista-lotes");
const nombreLoteActual = document.querySelector(".nombre-lote-actual");
const btnDeleteHistorial = document.querySelector(".btnDeleteHistorial");

let data = JSON.parse(localStorage.getItem("appGastos")) || {
  loteActual: {
    nombre: "",
    gastos: [],
  },
  lotesCerrados: [],
};

let loteActual = data.loteActual;
let lotesCerrados = data.lotesCerrados;

// ---------------------------
const guardarApp = () => {
  localStorage.setItem(
    "appGastos",
    JSON.stringify({
      loteActual,
      lotesCerrados,
    }),
  );
};
btnAddNombre.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();

  if (nombre !== "") {
    loteActual.nombre = nombre;
    guardarApp();
    renderGastos();
    inputNombre.value = "";
  } else {
    alert("Ingresa un nombre válido");
  }
});
// ---------------------------
// Render gastos
const renderGastos = () => {
  listaDeGastos.innerHTML = "";
  let total = 0;
  if (loteActual.nombre) {
    nombreLoteActual.textContent = `Lote actual: ${loteActual.nombre}`;
  } else {
    nombreLoteActual.textContent = "Lote sin nombre";
  }
  loteActual.gastos.forEach((gasto, index) => {
    const li = document.createElement("li");
    li.classList.add("gasto-item");

    const spanMonto = document.createElement("span");
    spanMonto.textContent = `$${gasto}`;

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "X";

    btnDelete.addEventListener("click", () => {
      eliminarGasto(index);
    });

    li.appendChild(spanMonto);
    li.appendChild(btnDelete);
    listaDeGastos.appendChild(li);

    total += gasto;
  });

  totalGastos.textContent = `$${total}`;
};
btnAdd.addEventListener("click", () => {
  const valor = Number(inputValue.value);

  if (valor > 0) {
    loteActual.gastos.push(valor);
    guardarApp();
    renderGastos();
    inputValue.value = "";
  } else {
    alert("Ingresa un número válido");
  }
});
const eliminarGasto = (index) => {
  loteActual.gastos.splice(index, 1);
  guardarApp();
  renderGastos();
};
btnDeleteAll.addEventListener("click", () => {
  if (loteActual.gastos.length === 0) {
    alert("No hay gastos para eliminar");
    return;
  }

  if (
    confirm("¿Seguro que quieres eliminar todos los gastos del lote actual?")
  ) {
    loteActual.gastos = [];
    guardarApp();
    renderGastos();
  }
});
// ---------------------------

btnCerrarLote.addEventListener("click", () => {
  if (!loteActual.nombre) {
    alert("El lote necesita un nombre");
    return;
  }

  if (loteActual.gastos.length === 0) {
    alert("No hay gastos para cerrar");
    return;
  }

  lotesCerrados.push({
    ...loteActual,
    fecha: new Date().toLocaleDateString(),
  });

  // Reiniciar lote actual
  loteActual = {
    nombre: "",
    gastos: [],
  };

  guardarApp();
  renderGastos();
  renderLotesCerrados();

  alert("Lote cerrado correctamente");
});

const renderLotesCerrados = () => {
  listaLotes.innerHTML = "";

  lotesCerrados.forEach((lote) => {
    const li = document.createElement("li");

    const total = lote.gastos.reduce((acc, g) => acc + g, 0);

    li.textContent = `${lote.nombre} | Total: $${total} | ${lote.fecha}`;

    listaLotes.appendChild(li);
  });
};
btnDeleteHistorial.addEventListener("click", () => {
  if (lotesCerrados.length === 0) {
    alert("No hay historial para borrar");
    return;
  }

  if (confirm("¿Seguro que quieres borrar todo el historial?")) {
    lotesCerrados = [];
    guardarApp();
    renderLotesCerrados();
  }
});
// ---------------------------
// Inicializar app
renderGastos();
renderLotesCerrados();
