let paginaActual = 1;
const LIMITE = 4;
let mascotas = [];
let mascotaEditandoId = null;

document.addEventListener('DOMContentLoaded', () => {
  cargarMascotas(paginaActual);
  document.getElementById('editarMascotaForm')?.addEventListener('submit', actualizarMascota);
  document.getElementById('btnEliminarMascota')?.addEventListener('click', eliminarMascota);
});

async function cargarMascotas(pagina = 1) {
  const contenedor = document.getElementById('contenedorAdopciones');
  contenedor.innerHTML = "<p class='text-white text-center'>Cargando mascotas...</p>";

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/mascotas?page=${pagina}&limit=${LIMITE}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al cargar mascotas');

    mascotas = Array.isArray(json.data) ? json.data : [];
    paginaActual = pagina;

    if (mascotas.length === 0) {
      contenedor.innerHTML = "<p class='text-white text-center'>No hay mascotas disponibles.</p>";
      return;
    }

    renderizarCartas();
    generarPaginacion(json.total, pagina);

  } catch (error) {
    console.error('Error al cargar mascotas:', error);
    contenedor.innerHTML = "<p class='text-white text-center'>Error al cargar mascotas.</p>";
  }
}

function renderizarCartas(lista = mascotas) {
  const contenedor = document.getElementById('contenedorAdopciones');
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = "<p class='text-white text-center'>No se encontraron mascotas con ese nombre.</p>";
    return;
  }

  lista.forEach(mascota => {
    const card = document.createElement('div');
    card.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
    card.innerHTML = `
      <div class="card text-white">
        <img class="card-img-top" src="${mascota.imagen}" alt="${mascota.nombre}" style="object-fit: cover; height: 200px;">
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
            <button
              type="button"
              class="btn btn-adoptar"
              data-bs-toggle="modal"
              data-bs-target="#editarMascotaModal"
              onclick="llenarModalEditar('${mascota._id}')"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function generarPaginacion(totalItems, paginaActual) {
  const totalPaginas = Math.ceil(totalItems / LIMITE);
  const paginacion = document.getElementById('paginacion');
  paginacion.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', e => {
      e.preventDefault();
      cargarMascotas(i);
    });
    paginacion.appendChild(li);
  }
}

function llenarModalEditar(id) {
  const mascota = mascotas.find(m => m._id === id);
  if (!mascota) return;
  mascotaEditandoId = id;
  document.getElementById('nombreMascota').value       = mascota.nombre || '';
  document.getElementById('estadoMascota').value      = mascota.estado || '';
  document.getElementById('tipoMascota').value        = mascota.tipo || '';
  document.getElementById('ubicacionMascota').value   = mascota.locacion || '';
  document.getElementById('razaMascota').value        = mascota.raza || '';
  document.getElementById('vacunadoMascota').value    = mascota.vacunado || '';
  document.getElementById('edadMascota').value        = mascota.edad || '';
  document.getElementById('esterilizadoMascota').value = mascota.esterilizado || '';
  document.getElementById('sexoMascota').value        = mascota.sexo || '';
  document.getElementById('imagenURL').value          = mascota.imagen || '';
  document.getElementById('colorMascota').value       = mascota.color || '';
  document.getElementById('observaciones').value      = mascota.observaciones || '';
}

async function actualizarMascota(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token || !mascotaEditandoId) return;
  const datos = {
    nombre:        document.getElementById('nombreMascota').value.trim(),
    estado:        document.getElementById('estadoMascota').value,
    tipo:          document.getElementById('tipoMascota').value,
    locacion:      document.getElementById('ubicacionMascota').value,
    raza:          document.getElementById('razaMascota').value,
    vacunado:      document.getElementById('vacunadoMascota').value,
    edad:          +document.getElementById('edadMascota').value,
    esterilizado:  document.getElementById('esterilizadoMascota').value,
    sexo:          document.getElementById('sexoMascota').value,
    imagen:        document.getElementById('imagenURL').value,
    color:         document.getElementById('colorMascota').value,
    observaciones: document.getElementById('observaciones').value
  };
  try {
    const res = await fetch(`/api/mascotas/${mascotaEditandoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Mascota actualizada correctamente');
      bootstrap.Modal.getInstance(document.getElementById('editarMascotaModal')).hide();
      await cargarMascotas(paginaActual);
    } else {
      alert(data.error || 'Error al actualizar');
    }
  } catch (err) {
    console.error('Error al actualizar mascota:', err);
    alert('Error al conectar con el servidor');
  }
}

async function eliminarMascota() {
  if (!mascotaEditandoId) return;
  if (!confirm('¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.')) return;
  const token = localStorage.getItem('token');
  if (!token) return alert('No estás autenticado.');
  try {
    const res = await fetch(`/api/mascotas/${mascotaEditandoId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      alert('Mascota eliminada correctamente');
      bootstrap.Modal.getInstance(document.getElementById('editarMascotaModal')).hide();
      await cargarMascotas(paginaActual);
    } else {
      alert(data.error || 'Error al eliminar la mascota');
    }
  } catch (err) {
    console.error('Error al eliminar mascota:', err);
    alert('Error al conectar con el servidor');
  }
}

// Búsqueda local
document.getElementById('inputBusqueda')?.addEventListener('input', async (e) => {
  const texto = e.target.value.trim().toLowerCase();
  if (!texto) {
    return cargarMascotas(paginaActual);
  }
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/mascotas?nombre=${encodeURIComponent(texto)}&limit=1000`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al buscar');
    if (!Array.isArray(json.data)) return;
    mascotas = json.data;
    paginaActual = 1;
    renderizarCartas(mascotas);
    document.getElementById('paginacion').innerHTML = '';
  } catch (err) {
    console.error('Error en búsqueda:', err);
    alert('Error al buscar mascotas.');
  }
});
