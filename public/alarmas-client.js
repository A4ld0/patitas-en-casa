// public/js/alarmas-client.js

document.addEventListener('DOMContentLoaded', () => {
  const alarmForm  = document.getElementById('alarmForm');
  const alarmsList = document.getElementById('alarmsList');
  const token      = localStorage.getItem('token');
  const API_URL    = 'http://localhost:3000/api/alarmas';

  // 1) Crear una nueva alarma
  alarmForm.addEventListener('submit', async e => {
    e.preventDefault();
    const tipo   = document.getElementById('tipo').value;
    const sexo   = document.getElementById('sexo').value;
    const edadMax= parseInt(document.getElementById('edad').value, 10);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tipo, sexo, edadMax })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      alarmForm.reset();
      loadAlarms();
    } catch (err) {
      console.error('Error creando alarma:', err);
      alert('Error creando alarma: ' + err.message);
    }
  });

  // 2) Función para cargar y renderizar las alarmas
  async function loadAlarms() {
    try {
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const alarmas = await res.json();
      alarmsList.innerHTML = '';

      if (alarmas.length === 0) {
        alarmsList.innerHTML = '<p class="text-muted">No tienes alarmas creadas.</p>';
        return;
      }

      alarmas.forEach(a => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
          <span>${a.tipo} · ${a.sexo} · ≤ ${a.edadMax} años</span>
          <button class="btn btn-sm btn-outline-danger">Eliminar</button>
        `;
        // (Opcional) manejar eliminación:
        const btnDel = item.querySelector('button');
        btnDel.addEventListener('click', () => deleteAlarm(a._id));
        alarmsList.appendChild(item);
      });
    } catch (err) {
      console.error('No se pudieron cargar las alarmas:', err);
      alarmsList.innerHTML = '<p class="text-danger">Error cargando alarmas.</p>';
    }
  }

  // 3) (Opcional) Eliminar una alarma
  async function deleteAlarm(id) {
    if (!confirm('¿Eliminar esta alarma?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      loadAlarms();
    } catch (err) {
      console.error('Error al eliminar alarma:', err);
      alert('No se pudo eliminar la alarma.');
    }
  }

    document.getElementById('checkMascotasBtn').addEventListener('click', async () => {
    if (!confirm('¿Revisar todas las mascotas y enviar notificaciones?')) return;
    try {
        const res = await fetch('http://localhost:3000/api/alarmas/check', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Revisión completada. Se enviaron correos si había coincidencias.');
    } catch (err) {
        console.error('Error en revisión manual:', err);
        alert('Error al revisar mascotas: ' + err.message);
    }
    });

  // 4) Carga inicial
  loadAlarms();
});
