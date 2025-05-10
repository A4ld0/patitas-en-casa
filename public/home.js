/*document.addEventListener('DOMContentLoaded', () => {
  const token     = localStorage.getItem('token');
  const loginBtn  = document.querySelector('[data-bs-target="#loginModal"]');
  const perfilBtn = document.getElementById('perfilBtn');
  const badge     = document.getElementById('badge-count');
  //const logoutBtn = document.getElementById('logoutBtn'); // si lo agregas al HTML

  // Mostrar botón de perfil si hay token
  // if (token) {
  //   loginBtn.style.display  = 'none';
  //   perfilBtn.style.display = 'inline-block';
  //   if (logoutBtn) logoutBtn.style.display = 'inline-block';
  // }

  // Badge de alarmas
  const alarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
  if (badge) badge.textContent = alarmas.length;

  // Cargar datos de perfil
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  document.getElementById('editUsername').value = profile.username || '';
  document.getElementById('editPhone').value    = profile.phone    || '';
  document.getElementById('profilePreview').src = profile.photo    || 'https://via.placeholder.com/100';

  // Preview de foto
  document.getElementById('editPhoto')?.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => document.getElementById('profilePreview').src = e.target.result;
      reader.readAsDataURL(file);
    }
  });

  // Guardar perfil
  document.getElementById('profileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const updated = {
      username: document.getElementById('editUsername').value.trim(),
      phone:    document.getElementById('editPhone').value.trim(),
      password: document.getElementById('editPassword').value,
      photo:    document.getElementById('profilePreview').src
    };
    localStorage.setItem('userProfile', JSON.stringify(updated));
    bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
  });

  // // Cerrar sesión
  // logoutBtn?.addEventListener('click', () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('userProfile');
  //   location.reload();
  // });
});

// Registro de usuario
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    nombre: form.nombre.value.trim(),
    apellido: form.apellido.value.trim(),
    email: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    password: form.password.value,
    username: form.username.value.trim(),
    estado: form.estado.value.trim(),
    municipio: form.municipio.value.trim(),
    codigoPostal: form.codigoPostal.value.trim(),
    fechaNacimiento: form.fechaNacimiento.value
  };

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert('¡Registro exitoso!');
      const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      modal.hide();
    } else {
      alert(result.error || 'Error al registrarse');
      console.warn(result);
    }
  } catch (err) {
    alert('Error de conexión al servidor');
    console.error(err);
  }
});

// Inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Por favor, ingresa correo y contraseña.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('¡Inicio de sesión exitoso!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      location.reload();
    } else {
      alert(data.error || 'Credenciales inválidas');
    }
  } catch (err) {
    alert('No se pudo conectar con el servidor.');
    console.error(err);
  }
});*/

document.addEventListener('DOMContentLoaded', () => {
  const token     = localStorage.getItem('token');
  const loginBtn  = document.querySelector('[data-bs-target="#loginModal"]');
  const perfilBtn = document.getElementById('perfilBtn');
  const badge     = document.getElementById('badge-count');
  const logoutBtn = document.getElementById('logoutBtn');

  // Mostrar botón de perfil si hay token
  verificarAutenticacion();

  // Badge de alarmas
  const alarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
  if (badge) badge.textContent = alarmas.length;

  // Cargar datos de perfil
  cargarDatosPerfil();

  // Evento para cerrar sesión
  if (logoutBtn) {
    logoutBtn.addEventListener('click', cerrarSesion);
  }

  // Función para verificar autenticación
  function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Usuario autenticado
      if (loginBtn) loginBtn.style.display = 'none';
      if (perfilBtn) perfilBtn.style.display = 'inline-block';
    } else {
      // Usuario no autenticado
      if (loginBtn) loginBtn.style.display = 'inline-block';
      if (perfilBtn) perfilBtn.style.display = 'none';
    }
  }

  // Cargar datos de perfil
  function cargarDatosPerfil() {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    if (document.getElementById('editUsername')) {
      document.getElementById('editUsername').value = profile.username || '';
    }
    
    if (document.getElementById('editPhone')) {
      document.getElementById('editPhone').value = profile.phone || '';
    }
    
    if (document.getElementById('profilePreview')) {
      document.getElementById('profilePreview').src = profile.photo || 'https://via.placeholder.com/100';
    }

    // Preview de foto
    document.getElementById('editPhoto')?.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('profilePreview').src = e.target.result;
        reader.readAsDataURL(file);
      }
    });
  }

  // Función para cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    location.reload();
  }
});

// Registro de usuario
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    nombre: form.nombre.value.trim(),
    apellido: form.apellido.value.trim(),
    email: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    password: form.password.value,
    username: form.username.value.trim(),
    estado: form.estado.value.trim(),
    municipio: form.municipio.value.trim(),
    codigoPostal: form.codigoPostal.value.trim(),
    fechaNacimiento: form.fechaNacimiento.value
  };

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert('¡Registro exitoso!');
      const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      modal.hide();
    } else {
      alert(result.error || 'Error al registrarse');
      console.warn(result);
    }
  } catch (err) {
    alert('Error de conexión al servidor');
    console.error(err);
  }
});

// Inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Por favor, ingresa correo y contraseña.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('¡Inicio de sesión exitoso!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      location.reload();
    } else {
      alert(data.error || 'Credenciales inválidas');
    }
  } catch (err) {
    alert('No se pudo conectar con el servidor.');
    console.error(err);
  }

});

// Guardar perfil
document.getElementById('profileForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const updated = {
    username: document.getElementById('editUsername').value.trim(),
    phone: document.getElementById('editPhone').value.trim(),
    password: document.getElementById('editPassword').value,
    photo: document.getElementById('profilePreview').src
  };
  localStorage.setItem('userProfile', JSON.stringify(updated));
  bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
});

// Función para cargar el perfil del usuario
async function cargarPerfilUsuario() {
  const token = localStorage.getItem('token');
  
  // Si no hay token, no hay usuario logueado
  if (!token) {
    console.log('No hay usuario logueado');
    return;
  }
  
  try {
    // Obtener los datos del usuario desde la API usando el token
    const response = await fetch('http://localhost:3000/api/usuarios/perfil', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cargar el perfil');
    }
    
    const usuario = await response.json();
    
    // Rellenar los campos del formulario con los datos del usuario
    document.getElementById('profilePreview').src = usuario.imagen || 'https://via.placeholder.com/100';
    document.getElementById('editPhoto').value = usuario.imagen || '';
    document.getElementById('editUsername').value = usuario.username || '';
    // No rellenamos la contraseña por seguridad
    document.getElementById('editPhone').value = usuario.telefono || '';
    
    return usuario;
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    alert(`Error: ${error.message}`);
  }
}

// Función para actualizar el perfil
async function actualizarPerfil(evento) {
  evento.preventDefault();
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para actualizar tu perfil');
    return;
  }
  
  // Recoger los datos del formulario
  const datosActualizados = {
    imagen: document.getElementById('editPhoto').value,
    username: document.getElementById('editUsername').value,
    telefono: document.getElementById('editPhone').value
  };
  
  // Si hay contraseña nueva, la añadimos a los datos
  const nuevaContraseña = document.getElementById('editPassword').value;
  if (nuevaContraseña) {
    datosActualizados.contraseña = nuevaContraseña;
  }
  
  try {
    // Enviar los datos actualizados a la API
    const response = await fetch('http://localhost:3000/api/usuarios/actualizar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datosActualizados)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el perfil');
    }
    
    // Mostrar mensaje de éxito
    alert('¡Perfil actualizado correctamente!');
    
    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    modal.hide();
    
    // Actualizar la interfaz si es necesario (por ejemplo, el nombre de usuario en la barra de navegación)
    actualizarInterfazUsuario();
    
  } catch (error) {
    console.error('Error:', error);
    alert(`Error al actualizar perfil: ${error.message}`);
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  // Eliminar el token del almacenamiento local
  localStorage.removeItem('token');
  
  // Redirigir a la página principal o recargar la página
  window.location.href = '/';
}



// Función para mostrar vista previa de la foto de perfil
function actualizarVistaPrevia() {
  const url = document.getElementById('editPhoto').value;
  if (url) {
    document.getElementById('profilePreview').src = url;
  }
}

// Inicializar los eventos cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Configurar el formulario de perfil
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', actualizarPerfil);
  }
  
  // Configurar el botón de cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', cerrarSesion);
  }
  
  // Configurar la vista previa de la foto de perfil
  const editPhotoInput = document.getElementById('editPhoto');
  if (editPhotoInput) {
    editPhotoInput.addEventListener('input', actualizarVistaPrevia);
  }
  
  // Cargar los datos del perfil cuando se abre el modal
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.addEventListener('show.bs.modal', cargarPerfilUsuario);
  }
});

  
