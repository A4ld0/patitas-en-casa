let paginaActual = 1;
const LIMITE = 4;
let filtrosActuales = {};

// Función auxiliar por si luego el backend admite filtros normalizados
function normalizarTexto(texto) {
  return texto.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, '')
              .toLowerCase();
}

function aplicarFiltros() {
  const campos = {
    tipo: document.getElementById('filterTipo').value,
    raza: document.getElementById('filterRaza').value,
    sexo: document.getElementById('filterSexo').value,
    edad: document.getElementById('filterEdad').value,
    color: document.getElementById('filterColor').value,
    vacunado: document.getElementById('filterVacunado').value.toUpperCase(),
    esterilizado: document.getElementById('filterEsterilizado').value.toUpperCase(),
    estado: document.getElementById('filterEstado').value,
    locacion: document.getElementById('filterLocacion').value
  };

  filtrosActuales = {};
  for (const key in campos) {
    if (campos[key]) {
      filtrosActuales[key] = campos[key];
    }
  }

  cargarMascotas(1);
}

async function cargarMascotas(pagina = 1) {
  const contenedor = document.getElementById('contenedorMascotas');
  contenedor.innerHTML = "<p class='text-white text-center'>Cargando mascotas...</p>";

  try {
    // Construir la URL con filtros y paginación
    let url = `http://localhost:3000/api/mascotas?page=${pagina}&limit=${LIMITE}`;
    Object.keys(filtrosActuales).forEach(key => {
      if (filtrosActuales[key]) {
        url += `&${key}=${encodeURIComponent(filtrosActuales[key])}`;
      }
    });

    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al obtener datos');
    }

    const { data, total } = await res.json();
    paginaActual = pagina;

    contenedor.innerHTML = '';
    if (data.length === 0) {
      contenedor.innerHTML = "<p class='text-white text-center'>No hay mascotas que coincidan con las características seleccionadas.</p>";
      return;
    }

    data.forEach(mascota => {
      const card = `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card text-white">
            <img class="card-img-top" src="${mascota.imagen}" alt="${mascota.nombre}" style="object-fit: cover; height: 200px;" />
            <div class="card-body" style="color: #fffbe7;">
              <div class="row">
                <div class="col-6">
                  <h3><strong>${mascota.nombre}</strong></h3>
                  <p><strong>Tipo:</strong> ${mascota.tipo}</p>
                  <p><strong>Raza:</strong> ${mascota.raza}</p>
                  <p><strong>Edad:</strong> ${mascota.edad} años</p>
                  <p><strong>Sexo:</strong> ${mascota.sexo}</p>
                </div>
                <div class="col-6">
                  <p><strong>Color:</strong> ${mascota.color}</p>
                  <p><strong>Vacunado:</strong> ${mascota.vacunado}</p>
                  <p><strong>Esterilizado:</strong> ${mascota.esterilizado}</p>
                  <p><strong>Estado:</strong> ${mascota.estado}</p>
                  <p><strong>Locación:</strong> ${mascota.locacion}</p>
                </div>
              </div>
              <div class="text-center mt-3">
                <button type="button" class="btn btn-adoptar" data-bs-toggle="modal" data-bs-target="#adopcionModal" data-mascota-id="${mascota._id}">
                  INICIAR PROCESO DE ADOPCIÓN
                </button>
              </div>
            </div>
          </div>
        </div>`;
      contenedor.innerHTML += card;
    });

    generarPaginacion(total, pagina);
  } catch (error) {
    console.error("Error al cargar las mascotas:", error);
    contenedor.innerHTML = "<p class='text-white text-center'>Error al cargar las mascotas.</p>";
  }
}

function generarPaginacion(totalItems, paginaActual) {
  const totalPaginas = Math.ceil(totalItems / LIMITE);
  const paginacion = document.querySelector('.pagination');
  paginacion.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <li class="page-item ${i === parseInt(paginaActual) ? 'active' : ''}">
        <a class="page-link" href="#" onclick="cargarMascotas(${i})">${i}</a>
      </li>`;
  }
}

function limpiarFiltros() {
  document.getElementById('filterTipo').value = '';
  document.getElementById('filterRaza').value = '';
  document.getElementById('filterSexo').value = '';
  document.getElementById('filterEdad').value = '';
  document.getElementById('filterColor').value = '';
  document.getElementById('filterVacunado').value = '';
  document.getElementById('filterEsterilizado').value = '';
  document.getElementById('filterEstado').value = '';
  document.getElementById('filterLocacion').value = '';

  filtrosActuales = {};
  cargarMascotas(1);
}

document.addEventListener('DOMContentLoaded', () => {
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', aplicarFiltros);
  }

  const clearFiltersBtn = document.getElementById('clearFilters');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', limpiarFiltros);
  }

  const logoBtn = document.querySelector('.navbar-brand');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filtrosActuales = {};
      cargarMascotas(1);
    });
  }

  cargarMascotas(paginaActual);
});
