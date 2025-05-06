/**
 * Patitas en Casa - JavaScript principal
 * Este archivo contiene todas las funciones necesarias para la página home.html
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de elementos
    initializeUI();
    setupEventListeners();
    loadUserProfile();
    updateNotificationBadge();
  
    // Verificar estado de autenticación
    checkAuthStatus();
  });
  
  /**
   * Inicializa elementos de UI y establece estados iniciales
   */
  function initializeUI() {
    // Referencias a elementos DOM principales
    const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
    const perfilBtn = document.getElementById('perfilBtn');
    
    // Inicializar tooltips y popovers de Bootstrap si son usados
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Precargar datos en modales si es necesario
    preloadModals();
  }
  
  /**
   * Configura los manejadores de eventos para los formularios
   */
  function setupEventListeners() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Formulario de adopción
    const adopcionForm = document.getElementById('adopcionForm');
    if (adopcionForm) {
      adopcionForm.addEventListener('submit', handleAdopcionRequest);
    }
    
    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Formulario para subir mascota
    const subirMascotaForm = document.getElementById('subirMascotaForm');
    if (subirMascotaForm) {
      subirMascotaForm.addEventListener('submit', handlePetUpload);
    }
    
    // Para la vista previa de foto de perfil
    const photoInput = document.getElementById('editPhoto');
    if (photoInput) {
      photoInput.addEventListener('change', handlePhotoPreview);
    }
    
    // Para botones de filtro de mascotas
    setupFilterButtons();
  }
  
  /**
   * Verifica si el usuario está autenticado y actualiza la UI en consecuencia
   */
  function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
    const perfilBtn = document.getElementById('perfilBtn');
    
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
  
  /**
   * Precarga información en los modales
   */
  function preloadModals() {
    // Precargar datos del perfil de usuario
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const editUsername = document.getElementById('editUsername');
    const editPhone = document.getElementById('editPhone');
    const profilePreview = document.getElementById('profilePreview');
    
    if (editUsername) editUsername.value = profile.username || '';
    if (editPhone) editPhone.value = profile.phone || '';
    if (profilePreview) profilePreview.src = profile.photo || 'https://via.placeholder.com/100';
  }
  
  /**
   * Actualiza el badge de notificaciones
   */
  function updateNotificationBadge() {
    const alarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
    const badge = document.getElementById('badge-count');
    
    if (badge) {
      badge.textContent = alarmas.length;
      
      // Opcionalmente ocultar el badge si no hay alarmas
      if (alarmas.length === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'block';
      }
    }
  }
  
  /**
   * Carga el perfil del usuario desde localStorage
   */
  function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    // Aquí puedes personalizar la interfaz con datos del usuario
    if (profile.username) {
      // Por ejemplo, mostrar un saludo personalizado
      const usernameDisplay = document.createElement('span');
      usernameDisplay.classList.add('username-display', 'ms-2');
      usernameDisplay.textContent = `Hola, ${profile.username}`;
      
      const perfilBtn = document.getElementById('perfilBtn');
      if (perfilBtn && perfilBtn.parentNode) {
        perfilBtn.parentNode.insertBefore(usernameDisplay, perfilBtn);
      }
    }
  }
  
  /**
   * Configura los botones de filtro para las mascotas
   */
  function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        filterPets(filter);
      });
    });
  }
  
  /**
   * Filtra las mascotas por tipo
   * @param {string} filterType - Tipo de mascota a filtrar
   */
  function filterPets(filterType) {
    const petCards = document.querySelectorAll('.card');
    
    petCards.forEach(card => {
      const petType = card.querySelector('[data-pet-type]')?.getAttribute('data-pet-type');
      
      if (filterType === 'all' || !filterType || petType === filterType) {
        card.closest('.col-lg-3').style.display = 'block';
      } else {
        card.closest('.col-lg-3').style.display = 'none';
      }
    });
  }
  
  /**
   * Maneja el envío del formulario de inicio de sesión
   * @param {Event} e - Evento del formulario
   */
  function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulación de autenticación (reemplazar con llamada a API real)
    if (email && password) {
      // Usuario autenticado con éxito (simulado)
      localStorage.setItem('token', 'simulated-jwt-token');
      
      // Guardar información básica del usuario
      const userProfile = {
        username: email.split('@')[0],
        email: email,
        photo: 'https://via.placeholder.com/100'
      };
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Cerrar modal
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) {
        loginModal.hide();
      }
      
      // Actualizar UI
      checkAuthStatus();
      
      // Mostrar mensaje de éxito
      showAlert('success', 'Has iniciado sesión correctamente');
    } else {
      // Error de validación
      showAlert('danger', 'Por favor completa todos los campos');
    }
  }
  
  /**
   * Maneja el envío del formulario de registro
   * @param {Event} e - Evento del formulario
   */
  function handleRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const nombre = form.querySelector('[name="nombre"]').value;
    const apellido = form.querySelector('[name="apellido"]').value;
    const email = form.querySelector('[name="email"]').value;
    const password = form.querySelector('[name="password"]').value;
    const confirmPassword = form.querySelector('[name="confirm_password"]').value;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      showAlert('danger', 'Las contraseñas no coinciden');
      return;
    }
    
    // Simulación de registro (reemplazar con llamada a API real)
    if (nombre && apellido && email && password) {
      // Usuario registrado con éxito (simulado)
      localStorage.setItem('token', 'simulated-jwt-token');
      
      // Guardar información básica del usuario
      const userProfile = {
        username: form.querySelector('[name="username"]').value || email.split('@')[0],
        email: email,
        nombre: nombre,
        apellido: apellido,
        phone: form.querySelector('[name="telefono"]').value,
        photo: 'https://via.placeholder.com/100'
      };
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Cerrar modal
      const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      if (registerModal) {
        registerModal.hide();
      }
      
      // Actualizar UI
      checkAuthStatus();
      
      // Mostrar mensaje de éxito
      showAlert('success', 'Te has registrado correctamente');
    } else {
      // Error de validación
      showAlert('danger', 'Por favor completa todos los campos obligatorios');
    }
  }
  
  /**
   * Maneja el envío del formulario de adopción
   * @param {Event} e - Evento del formulario
   */
  function handleAdopcionRequest(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const motivo = document.getElementById('motivo').value;
    
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      showAlert('warning', 'Debes iniciar sesión para enviar una solicitud de adopción');
      
      // Cerrar modal de adopción
      const adopcionModal = bootstrap.Modal.getInstance(document.getElementById('adopcionModal'));
      if (adopcionModal) {
        adopcionModal.hide();
      }
      
      // Abrir modal de login
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        new bootstrap.Modal(loginModal).show();
      }
      
      return;
    }
    
    // Procesar la solicitud de adopción (simulado)
    if (nombre && telefono && motivo) {
      // Guardar solicitud en el historial
      const solicitudes = JSON.parse(localStorage.getItem('solicitudesAdopcion') || '[]');
      
      // Obtener información de la mascota (esto dependería de cómo estás identificando qué mascota se está adoptando)
      const mascotaId = e.target.getAttribute('data-mascota-id') || 'desconocido';
      const mascotaNombre = e.target.getAttribute('data-mascota-nombre') || 'Mascota';
      
      // Agregar nueva solicitud
      solicitudes.push({
        id: Date.now().toString(),
        mascotaId: mascotaId,
        mascotaNombre: mascotaNombre,
        fecha: new Date().toLocaleDateString(),
        estado: 'Pendiente'
      });
      
      // Guardar en localStorage
      localStorage.setItem('solicitudesAdopcion', JSON.stringify(solicitudes));
      
      // Agregar notificación
      const alarmas = JSON.parse(localStorage.getItem('alarmas') || '[]');
      alarmas.push({
        id: Date.now().toString(),
        titulo: 'Solicitud enviada',
        mensaje: `Tu solicitud para adoptar a ${mascotaNombre} ha sido recibida y está en proceso de revisión.`,
        fecha: new Date().toISOString(),
        leida: false
      });
      localStorage.setItem('alarmas', JSON.stringify(alarmas));
      
      // Actualizar badge
      updateNotificationBadge();
      
      // Cerrar modal
      const adopcionModal = bootstrap.Modal.getInstance(document.getElementById('adopcionModal'));
      if (adopcionModal) {
        adopcionModal.hide();
      }
      
      // Mostrar mensaje de éxito
      showAlert('success', 'Tu solicitud de adopción ha sido enviada correctamente');
    } else {
      // Error de validación
      showAlert('danger', 'Por favor completa todos los campos');
    }
  }
  
  /**
   * Maneja la actualización del perfil de usuario
   * @param {Event} e - Evento del formulario
   */
  function handleProfileUpdate(e) {
    e.preventDefault();
    
    const username = document.getElementById('editUsername').value;
    const phone = document.getElementById('editPhone').value;
    const password = document.getElementById('editPassword').value;
    const photoSrc = document.getElementById('profilePreview').src;
    
    // Obtener perfil actual
    const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    // Actualizar perfil
    const updatedProfile = {
      ...currentProfile,
      username: username || currentProfile.username,
      phone: phone || currentProfile.phone,
      photo: photoSrc || currentProfile.photo
    };
    
    // Si se proporciona una nueva contraseña, actualizarla
    if (password) {
      updatedProfile.password = password;
    }
    
    // Guardar en localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Cerrar modal
    const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (profileModal) {
      profileModal.hide();
    }
    
    // Actualizar UI
    loadUserProfile();
    
    // Mostrar mensaje de éxito
    showAlert('success', 'Tu perfil ha sido actualizado correctamente');
  }
  
  /**
   * Maneja la subida de una nueva mascota
   * @param {Event} e - Evento del formulario
   */
  function handlePetUpload(e) {
    e.preventDefault();
    
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      showAlert('warning', 'Debes iniciar sesión para publicar una mascota');
      
      // Cerrar modal
      const subirMascotaModal = bootstrap.Modal.getInstance(document.getElementById('subirMascotaModal'));
      if (subirMascotaModal) {
        subirMascotaModal.hide();
      }
      
      // Abrir modal de login
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        new bootstrap.Modal(loginModal).show();
      }
      
      return;
    }
    
    // Recoger datos del formulario
    const nombreMascota = document.getElementById('nombreMascota').value;
    const tipoMascota = document.getElementById('tipoMascota').value;
    const razaMascota = document.getElementById('razaMascota').value;
    const edadMascota = document.getElementById('edadMascota').value;
    const sexoMascota = document.getElementById('sexoMascota').value;
    const colorMascota = document.getElementById('colorMascota').value;
    const imagenURL = document.getElementById('imagenURL').value;
    const observaciones = document.getElementById('observaciones').value;
    
    // Obtener valor de radio buttons
    const vacunado = document.querySelector('input[name="vacunado"]:checked')?.value || 'NO';
    const esterilizado = document.querySelector('input[name="esterilizado"]:checked')?.value || 'NO';
    
    // Validar campos requeridos
    if (!nombreMascota || !tipoMascota || !razaMascota || !edadMascota || !sexoMascota || !colorMascota || !imagenURL) {
      showAlert('danger', 'Por favor completa todos los campos obligatorios');
      return;
    }
    
    // Crear objeto de mascota
    const mascota = {
      id: Date.now().toString(),
      nombre: nombreMascota,
      tipo: tipoMascota,
      raza: razaMascota,
      edad: edadMascota,
      sexo: sexoMascota,
      color: colorMascota,
      vacunado: vacunado,
      esterilizado: esterilizado,
      imagen: imagenURL,
      observaciones: observaciones,
      estado: 'En adopción',
      fecha: new Date().toISOString()
    };
    
    // Guardar en localStorage
    const mascotas = JSON.parse(localStorage.getItem('mascotas') || '[]');
    mascotas.push(mascota);
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
    
    // Cerrar modal
    const subirMascotaModal = bootstrap.Modal.getInstance(document.getElementById('subirMascotaModal'));
    if (subirMascotaModal) {
      subirMascotaModal.hide();
    }
    
    // Mostrar mensaje de éxito
    showAlert('success', 'Tu mascota ha sido publicada correctamente');
    
    // Opcional: recargar la página para mostrar la nueva mascota
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
  
  /**
   * Muestra una vista previa de la foto seleccionada
   * @param {Event} e - Evento de cambio de input
   */
  function handlePhotoPreview(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('profilePreview').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * Muestra un mensaje de alerta en la página
   * @param {string} type - Tipo de alerta (success, danger, warning, info)
   * @param {string} message - Mensaje a mostrar
   */
  function showAlert(type, message) {
    // Crear elemento de alerta
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertEl.style.zIndex = '1050';
    alertEl.role = 'alert';
    alertEl.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Añadir al DOM
    document.body.appendChild(alertEl);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alertEl);
      bsAlert.close();
    }, 3000);
  }
  
  /**
   * Carga las mascotas desde localStorage y las muestra en la página
   */
  function loadAndDisplayPets() {
    const mascotas = JSON.parse(localStorage.getItem('mascotas') || '[]');
    const petsContainer = document.querySelector('main .row');
    
    if (petsContainer && mascotas.length > 0) {
      // Limpiar contenedor
      petsContainer.innerHTML = '';
      
      // Agregar cada mascota
      mascotas.forEach(mascota => {
        const cardHtml = `
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card text-white">
              <img
                class="card-img-top"
                src="${mascota.imagen}"
                alt="${mascota.nombre}"
                style="object-fit: cover; height: 200px;"
              />
              <div class="card-body" style="color: #fffbe7;">
                <div class="row">
                  <div class="col-6">
                    <h3><strong>${mascota.nombre}</strong></h3>
                    <p><strong>Tipo:</strong> <span data-pet-type="${mascota.tipo}">${mascota.tipo}</span></p>
                    <p><strong>Raza:</strong> ${mascota.raza}</p>
                    <p><strong>Edad:</strong> ${mascota.edad} años</p>
                    <p><strong>Sexo:</strong> ${mascota.sexo}</p>
                  </div>
                  <div class="col-6">
                    <p><strong>Color:</strong> ${mascota.color}</p>
                    <p><strong>Vacunado:</strong> ${mascota.vacunado}</p>
                    <p><strong>Esterilizado:</strong> ${mascota.esterilizado}</p>
                    <p><strong>Estado:</strong> ${mascota.estado}</p>
                    <p><strong>Locación:</strong> ${mascota.locacion || 'No especificada'}</p>
                  </div>
                </div>
                <div class="text-center mt-3">
                  <button
                    type="button"
                    class="btn btn-adoptar"
                    data-bs-toggle="modal"
                    data-bs-target="#adopcionModal"
                    data-mascota-id="${mascota.id}"
                    data-mascota-nombre="${mascota.nombre}"
                  >
                    INICIAR PROCESO DE ADOPCIÓN
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        
        petsContainer.innerHTML += cardHtml;
      });
    } else if (petsContainer && mascotas.length === 0) {
      // Si no hay mascotas personalizadas, no hacemos nada para mantener las de ejemplo
    }
  }
  
  /**
   * Carga el historial de adopciones desde localStorage
   */
  function loadAdoptionHistory() {
    const solicitudes = JSON.parse(localStorage.getItem('solicitudesAdopcion') || '[]');
    const historialTable = document.querySelector('#historialModal .table tbody');
    
    if (historialTable) {
      // Limpiar tabla
      historialTable.innerHTML = '';
      
      // Si no hay solicitudes, mostrar mensaje
      if (solicitudes.length === 0) {
        historialTable.innerHTML = `
          <tr>
            <td colspan="4" class="text-center">No hay solicitudes de adopción en tu historial</td>
          </tr>
        `;
        return;
      }
      
      // Agregar cada solicitud
      solicitudes.forEach(solicitud => {
        const rowHtml = `
          <tr>
            <td>${solicitud.mascotaNombre}</td>
            <td>${solicitud.mascotaId}</td>
            <td>${solicitud.id}</td>
            <td>${solicitud.fecha}</td>
          </tr>
        `;
        
        historialTable.innerHTML += rowHtml;
      });
    }
  }
  
  // Llamar a funciones adicionales cuando se carga el documento
  document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayPets();
    
    // Cargar historial cuando se abre el modal
    const historialModal = document.getElementById('historialModal');
    if (historialModal) {
      historialModal.addEventListener('show.bs.modal', loadAdoptionHistory);
    }
    
    // Establecer datos de mascota cuando se abre el modal de adopción
    const adopcionModal = document.getElementById('adopcionModal');
    if (adopcionModal) {
      adopcionModal.addEventListener('show.bs.modal', function (event) {
        // Obtener el botón que activó el modal
        const button = event.relatedTarget;
        
        // Extraer información de atributos data-*
        const mascotaId = button.getAttribute('data-mascota-id');
        const mascotaNombre = button.getAttribute('data-mascota-nombre');
        
        // Establecer título del modal
        const modalTitle = adopcionModal.querySelector('.modal-title');
        if (modalTitle && mascotaNombre) {
          modalTitle.textContent = `Adoptar a ${mascotaNombre}`;
        }
        
        // Establecer atributos en el formulario
        const form = adopcionModal.querySelector('form');
        if (form) {
          form.setAttribute('data-mascota-id', mascotaId);
          form.setAttribute('data-mascota-nombre', mascotaNombre);
        }
      });
    }
  });