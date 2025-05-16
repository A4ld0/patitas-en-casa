let mascotaSeleccionada = null;

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-mascota-id]')) {
    mascotaSeleccionada = e.target.getAttribute('data-mascota-id');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const token     = localStorage.getItem('token');
  const loginBtn  = document.querySelector('[data-bs-target="#loginModal"]');
  const perfilBtn = document.getElementById('perfilBtn');
  const badge     = document.getElementById('badge-count');
  const logoutBtn = document.getElementById('logoutBtn');

  verificarAutenticacion();

  const alarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
  if (badge) badge.textContent = alarmas.length;

  cargarDatosPerfil();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', cerrarSesion);
  }

  function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (token) {
      loginBtn?.style.setProperty('display', 'none');
      perfilBtn?.style.setProperty('display', 'inline-block');
    } else {
      loginBtn?.style.setProperty('display', 'inline-block');
      perfilBtn?.style.setProperty('display', 'none');
    }
  }

  function cargarDatosPerfil() {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    document.getElementById('editUsername')?.value    = profile.username || '';
    document.getElementById('editPhone')?.value       = profile.phone    || '';
    document.getElementById('profilePreview').src = profile.photo || 'https://via.placeholder.com/100';

    document.getElementById('editPhoto')?.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('profilePreview').src = e.target.result;
        reader.readAsDataURL(file);
      }
    });
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    location.reload();
  }
});

// ——— Registro de usuario ———
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    nombre:        form.nombre.value.trim(),
    apellido:      form.apellido.value.trim(),
    email:         form.email.value.trim(),
    telefono:      form.telefono.value.trim(),
    password:      form.password.value,
    username:      form.username.value.trim(),
    estado:        form.estado.value.trim(),
    municipio:     form.municipio.value.trim(),
    codigoPostal:  form.codigoPostal.value.trim(),
    fechaNacimiento: form.fechaNacimiento.value
  };

  try {
    const res = await fetch('/api/auth/register', {      // <<-- aquí ruta relativa
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      alert('¡Registro exitoso!');
      bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    } else {
      alert(result.error || 'Error al registrarse');
    }
  } catch (err) {
    alert('Error de conexión al servidor');
    console.error(err);
  }
});

// ——— Inicio de sesión ———
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) {
    return alert('Por favor, ingresa correo y contraseña.');
  }

  try {
    const res = await fetch('/api/auth/login', {       // <<-- ruta relativa
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('¡Inicio de sesión exitoso!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      if (data.usuario.rol === 'admin') {
        window.location.href = 'homeAdmin.html';
      } else {
        location.reload();
      }
    } else {
      alert(data.error || 'Credenciales inválidas');
    }
  } catch (err) {
    alert('No se pudo conectar con el servidor.');
    console.error(err);
  }
});

// ——— Carga y actualización de perfil ———
async function cargarPerfilUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch('/api/usuarios/perfil', {   // <<-- relativo
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    const usuario = await res.json();
    document.getElementById('profilePreview').src  = usuario.imagen || 'https://via.placeholder.com/100';
    document.getElementById('editPhoto').value    = usuario.imagen || '';
    document.getElementById('editUsername').value = usuario.username || '';
    document.getElementById('editPhone').value    = usuario.telefono || '';
  } catch (err) {
    console.error('Error al cargar el perfil:', err);
    alert(`Error: ${err.error || err.message}`);
  }
}

async function actualizarPerfil(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) return alert('Debes iniciar sesión para actualizar tu perfil');
  const datos = {
    imagen:   document.getElementById('editPhoto').value.trim(),
    username: document.getElementById('editUsername').value.trim(),
    telefono: document.getElementById('editPhone').value.trim()
  };
  const newPw = document.getElementById('editPassword').value.trim();
  if (newPw) datos.password = newPw;

  try {
    const res = await fetch('/api/usuarios/perfil', { // <<-- relativo
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datos)
    });
    if (!res.ok) throw await res.json();
    alert('¡Perfil actualizado con éxito!');
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    alert(`Error al actualizar perfil: ${err.error || err.message}`);
  }
}

// vincular modal y form de perfil
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('profileForm')?.addEventListener('submit', actualizarPerfil);
  document.getElementById('profileModal')
    ?.addEventListener('show.bs.modal', cargarPerfilUsuario);
  document.getElementById('logoutBtn')?.addEventListener('click', cerrarSesion);
  document.getElementById('editPhoto')?.addEventListener('input', () => {
    const url = document.getElementById('editPhoto').value;
    if (url) document.getElementById('profilePreview').src = url;
  });
});

// ——— Filtrar mascotas ———
async function filtrarMascotas() {
  const campos = ['Tipo','Edad','Sexo','Vacunado','Esterilizado','Estado'];
  const filtros = {};
  campos.forEach(c => {
    const el = document.getElementById('filter'+c);
    if (el?.value.trim()) {
      filtros[c.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')] = el.value.trim();
    }
  });
  const qs  = new URLSearchParams(filtros).toString();
  const url = `/api/mascotas?${qs}`;                  // <<-- relativo
  try {
    const token   = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const res     = await fetch(url, { headers });
    if (!res.ok) return console.error('Error HTTP:', res.status, await res.text());
    const json = await res.json();
    const mascotasArray = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []);
    mostrarMascotas(mascotasArray);
  } catch (err) {
    console.error('Error de red o JS:', err);
  }
}

function mostrarMascotas(arr) {
  const cont = document.getElementById('contenedorMascotas');
  if (!cont) return;
  cont.innerHTML = '';
  arr.forEach(m => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card">
        <img src="${m.imagen}" class="card-img-top" alt="${m.nombre}">
        <div class="card-body">
          <h5 class="card-title">${m.nombre} (${m.tipo})</h5>
          <p class="card-text">
            Raza: ${m.raza}<br>
            Edad: ${m.edad} años<br>
            Sexo: ${m.sexo}<br>
            Color: ${m.color}<br>
            Vacunado: ${m.vacunado}<br>
            Esterilizado: ${m.esterilizado}<br>
            Estado: ${m.estado}<br>
            Locación: ${m.locacion}
          </p>
          <button class="btn btn-delifesti" data-bs-toggle="modal"
                  data-bs-target="#adopcionModal"
                  data-mascota-id="${m._id}">
            Iniciar proceso de adopción
          </button>
        </div>
      </div>`;
    cont.appendChild(card);
  });
}

document.getElementById('applyFilters')?.addEventListener('click', filtrarMascotas);

// ——— Solicitud de adopción ———
document.getElementById('adopcionForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) return alert('Debes iniciar sesión para adoptar.');

  const nombre  = document.getElementById('nombre').value.trim();
  const email   = document.getElementById('emailAdopcion').value.trim();
  const motivo  = document.getElementById('motivo').value.trim();
  if (!mascotaSeleccionada) return alert('No se ha seleccionado una mascota.');

  try {
    const res = await fetch('/api/adopciones', {      // <<-- relativo
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ mascotaId: mascotaSeleccionada, nombre, email, motivo })
    });
    const data = await res.json();
    if (res.ok) {
      alert('¡Solicitud de adopción enviada!');
      document.getElementById('adopcionForm').reset();
      bootstrap.Modal.getInstance(document.getElementById('adopcionModal')).hide();
    } else {
      alert(data.error || 'No se pudo enviar la solicitud');
    }
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    alert('Error al conectar con el servidor.');
  }
});
