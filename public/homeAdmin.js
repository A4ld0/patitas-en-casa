let paginaActual = 1;
const porPagina = 4;
let adopciones = [];
let mascotaEditandoId = null;


document.addEventListener('DOMContentLoaded', async () => {
  await cargarAdopciones();
  mostrarAdopciones();
  configurarPaginacion();
});

async function cargarAdopciones() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/adopciones', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al cargar adopciones');

    adopciones = data;
  } catch (error) {
    console.error(error);
    alert('Error al obtener las adopciones.');
  }
}

function mostrarAdopciones() {
  const contenedor = document.getElementById('contenedorAdopciones');
  contenedor.innerHTML = '';

  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const paginaAdopciones = adopciones.slice(inicio, fin);

  paginaAdopciones.forEach(adopcion => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';

   tarjeta.innerHTML = `
  <div class="card text-white">
    <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" class="card-img-top" style="height: 200px; object-fit: cover;" />
    <div class="card-body" style="color: #fffbe7;">
      <h5 class="card-title">${adopcion.nombre}</h5>
      <p><strong>Teléfono:</strong> ${adopcion.email}</p>
      <p><strong>Motivo:</strong> ${adopcion.motivo}</p>
      <p><strong>Mascota:</strong> ${adopcion.mascota?.nombre || 'N/A'}</p>
      <div class="text-center mt-3">
        <button class="btn btn-success me-2 aceptar-btn" data-id="${adopcion._id}">Aceptar</button>
        <button class="btn btn-danger rechazar-btn" data-id="${adopcion._id}">Rechazar</button>
      </div>
    </div>
  </div>
`;
    contenedor.appendChild(tarjeta);
  });

 configurarBotonesAccion();
}

function configurarPaginacion() {
  const paginacion = document.getElementById('paginacion');
  paginacion.innerHTML = '';

  const totalPaginas = Math.ceil(adopciones.length / porPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', e => {
      e.preventDefault();
      paginaActual = i;
      mostrarAdopciones();
      configurarPaginacion();
    });
    paginacion.appendChild(li);
  }
}

/*
function configurarBotonEditar() {
  const botones = document.querySelectorAll('.editar-btn');

  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      mascotaEditandoId = btn.dataset.id;

      document.getElementById('nombreMascota').value       = btn.dataset.nombre || '';
      document.getElementById('tipoMascota').value         = btn.dataset.tipo || '';
      document.getElementById('razaMascota').value         = btn.dataset.raza || '';
      document.getElementById('colorMascota').value        = btn.dataset.color || '';
      document.getElementById('edadMascota').value         = btn.dataset.edad || 0;
      document.getElementById('sexoMascota').value         = btn.dataset.sexo || '';
      document.getElementById('vacunadoMascota').value     = btn.dataset.vacunado || '';
      document.getElementById('esterilizadoMascota').value = btn.dataset.esterilizado || '';
      document.getElementById('estadoMascota').value       = btn.dataset.estado || '';
      document.getElementById('ubicacionMascota').value    = btn.dataset.ubicacion || '';
      document.getElementById('imagenURL').value           = btn.dataset.imagen || '';
      document.getElementById('observaciones').value       = btn.dataset.observaciones || '';
    });
  });
}
*/




async function eliminarAdopcionYNotificar(id, estado) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:3000/api/adopciones/${id}?estado=${estado}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.mensaje);
      await cargarAdopciones();
      mostrarAdopciones();
      configurarPaginacion();
    } else {
      alert(data.error || 'Error al eliminar adopción');
    }

  } catch (err) {
    console.error(err);
    alert('Error al conectar con el servidor\n${err.message}');
  }
}


function configurarBotonesAccion() {
  document.querySelectorAll('.aceptar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('¿Deseas aceptar esta adopción?')) {
        eliminarAdopcionYNotificar(id, 'aceptada');
      }
    });
  });

  document.querySelectorAll('.rechazar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('¿Deseas rechazar esta adopción?')) {
        eliminarAdopcionYNotificar(id, 'rechazada');
      }
    });
  });
}

//FUNCIONES PARA EDITAR USUARIO, CARGAR Y CERRAR SESIÓN

document.addEventListener('DOMContentLoaded', () => {
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.addEventListener('show.bs.modal', cargarPerfilUsuario);
  }

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', actualizarPerfil);
  }

  const editPhotoInput = document.getElementById('editPhoto');
  if (editPhotoInput) {
    editPhotoInput.addEventListener('input', actualizarVistaPrevia);
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', cerrarSesion);
  }
});

async function cargarPerfilUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/perfil', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Error al obtener datos del perfil');

    const usuario = await res.json();

    document.getElementById('editUsername').value = usuario.username || '';
    document.getElementById('editPhone').value = usuario.telefono || '';
    document.getElementById('profilePreview').src = usuario.imagen || 'https://via.placeholder.com/100';
    document.getElementById('editPhoto').value = usuario.imagen || '';

  } catch (err) {
    console.error('Error al cargar perfil:', err);
    alert('No se pudo cargar el perfil.');
  }
}

async function actualizarPerfil(e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) return alert('No estás autenticado');

  const datos = {
    username: document.getElementById('editUsername').value.trim(),
    telefono: document.getElementById('editPhone').value.trim(),
    imagen: document.getElementById('editPhoto').value.trim()
  };

  const nuevaPassword = document.getElementById('editPassword')?.value;
  if (nuevaPassword) {
    datos.contraseña = nuevaPassword;
  }

  try {
    const res = await fetch('http://localhost:3000/api/usuarios/actualizar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();
    if (!res.ok) throw new Error(resultado.error || 'Error al actualizar');

    alert('Perfil actualizado correctamente');
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();

  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    alert('Error al actualizar perfil');
  }
}

function actualizarVistaPrevia() {
  const url = document.getElementById('editPhoto').value;
  if (url) {
    document.getElementById('profilePreview').src = url;
  }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userProfile');
  location.reload();
}



