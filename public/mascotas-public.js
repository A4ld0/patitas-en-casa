let paginaActual = 1;
const LIMITE = 4;

async function cargarMascotas(pagina = 1) {
  const contenedor = document.getElementById('contenedorMascotas');
  contenedor.innerHTML = "<p class='text-white text-center'>Cargando mascotas...</p>";

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      contenedor.innerHTML = "<p class='text-white text-center'>Debes iniciar sesión para ver las mascotas.</p>";
      return;
    }

    const res = await fetch(`/api/mascotas?page=${pagina}&limit=${LIMITE}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al cargar mascotas');
    }

    const { data, total } = await res.json();
    paginaActual = pagina;
    contenedor.innerHTML = '';

    if (data.length === 0) {
      contenedor.innerHTML = "<p class='text-white text-center'>No hay mascotas disponibles.</p>";
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
              <div class="d-flex justify-content-end mt-3">
                <button 
                  type="button"
                  class="btn btn-secondary btn-sm me-2"
                  data-bs-toggle="modal" 
                  data-bs-target="#mensajeModal"
                  data-mascota-id="${mascota._id}"
                >
                  <i class="fas fa-envelope"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-adoptar"
                  data-bs-toggle="modal"
                  data-bs-target="#adopcionModal"
                  data-mascota-id="${mascota._id}"
                >
                  INICIAR PROCESO DE ADOPCIÓN
                </button>
              </div>
            </div>
          </div>
        </div>`;
      contenedor.innerHTML += card;
    });

    // 1) Al abrir modal de mensaje
    const mensajeModal = document.getElementById('mensajeModal');
    mensajeModal?.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const mascotaId = button.getAttribute('data-mascota-id');
      mensajeModal.querySelector('#mensajeMascotaId').value = mascotaId;
    });

    // 2) Al enviar el formulario de mensaje
    document.getElementById('mensajeForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const mascotaId = e.target.mascotaId.value;
      const razones   = e.target.razones.value.trim();
      const destinoEmail = 'sofia.noyola@iteso.mx';

      try {
        const res = await fetch('/api/mensaje-adopcion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mascotaId, razones, destinoEmail })
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Mensaje enviado correctamente 🎉');
        bootstrap.Modal.getInstance(mensajeModal).hide();
        e.target.reset();
      } catch (err) {
        console.error(err);
        alert('Error al enviar el mensaje');
      }
    });

    generarPaginacion(total, pagina);
  } catch (error) {
    console.error("Error al cargar las mascotas:", error);
    contenedor.innerHTML = "<p class='text-white text-center'>Error al cargar las mascotas.</p>";
    alert(`Error: ${error.message}`);
  }
}

function generarPaginacion(totalItems, paginaActual) {
  const totalPaginas = Math.ceil(totalItems / LIMITE);
  const paginacion = document.querySelector('.pagination');
  paginacion.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.innerHTML += `
      <li class="page-item ${i === paginaActual ? 'active' : ''}">
        <a class="page-link" href="#" onclick="cargarMascotas(${i})">${i}</a>
      </li>`;
  }
}

// Subir nueva mascota
document.addEventListener('DOMContentLoaded', () => {
  const formMascota = document.getElementById('subirMascotaForm');
  formMascota?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para subir una mascota');
      bootstrap.Modal.getInstance(document.getElementById('subirMascotaModal')).hide();
      setTimeout(() => {
        new bootstrap.Modal(document.getElementById('loginModal')).show();
      }, 500);
      return;
    }

    const nombre     = document.getElementById('nombreMascota').value.trim();
    const tipo       = document.getElementById('tipoMascota').value.trim();
    const imagen     = document.getElementById('imagenURL').value.trim();
    if (!nombre || !tipo || !imagen) {
      return alert('Por favor, completa los campos obligatorios.');
    }

    const nuevaMascota = {
      nombre,
      tipo,
      raza: document.getElementById('razaMascota').value,
      edad: document.getElementById('edadMascota').value,
      sexo: document.getElementById('sexoMascota').value,
      color: document.getElementById('colorMascota').value,
      vacunado: document.querySelector('input[name="vacunado"]:checked').value,
      esterilizado: document.querySelector('input[name="esterilizado"]:checked').value,
      imagen,
      locacion: document.getElementById('locacion').value,
      estado: "En Adopción",
      fecha: new Date().toLocaleDateString()
    };

    try {
      const res = await fetch('/api/mascotas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevaMascota)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir la mascota');
      bootstrap.Modal.getInstance(document.getElementById('subirMascotaModal')).hide();
      alert('¡Mascota subida exitosamente!');
      cargarMascotas(1);
      formMascota.reset();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al subir mascota: ${error.message}`);
    }
  });

  // Carga inicial
  cargarMascotas(paginaActual);
});
