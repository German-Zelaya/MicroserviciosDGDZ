// Variables globales
let currentTaskId = null;
let isEditing = false;

// URLs de la API
const API_BASE_URL = '/api/tasks';

// Elementos del DOM
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const tituloInput = document.getElementById('titulo');
const descripcionInput = document.getElementById('descripcion');
const estadoSelect = document.getElementById('estado');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

const filterEstado = document.getElementById('filter-estado');
const sortOrden = document.getElementById('sort-orden');
const refreshBtn = document.getElementById('refresh-btn');

const loadingDiv = document.getElementById('loading');
const tasksContainer = document.getElementById('tasks-container');
const noTasksDiv = document.getElementById('no-tasks');
const totalTasksSpan = document.getElementById('total-tasks');

const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulario
    taskForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    
    // Filtros
    filterEstado.addEventListener('change', loadTasks);
    sortOrden.addEventListener('change', loadTasks);
    refreshBtn.addEventListener('click', loadTasks);
    
    // Modal de eliminación
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    
    // Cerrar modal al hacer click fuera
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });
}

// Cargar tareas desde la API
async function loadTasks() {
    try {
        showLoading();
        
        const estado = filterEstado.value;
        const orden = sortOrden.value;
        
        let url = API_BASE_URL;
        const params = new URLSearchParams();
        
        if (estado !== 'todos') {
            params.append('estado', estado);
        }
        
        if (orden !== 'recientes') {
            params.append('orden', orden);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            displayTasks(result.data);
            updateStats(result.data);
        } else {
            showError('Error al cargar tareas: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión al cargar tareas');
    } finally {
        hideLoading();
    }
}

// Mostrar tareas en el DOM
function displayTasks(tasks) {
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        noTasksDiv.style.display = 'block';
        return;
    }
    
    noTasksDiv.style.display = 'none';
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksContainer.appendChild(taskCard);
    });
}

// Crear tarjeta de tarea
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.estado.replace(' ', '-')}`;
    
    const fechaCreacion = new Date(task.fechaCreacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const estadoEmoji = {
        'pendiente': '📝',
        'en progreso': '🔄',
        'completado': '✅'
    };
    
    card.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${escapeHtml(task.titulo)}</h3>
            <span class="task-status ${task.estado.replace(' ', '-')}">
                ${estadoEmoji[task.estado]} ${task.estado}
            </span>
        </div>
        
        <p class="task-description">${escapeHtml(task.descripcion)}</p>
        
        <div class="task-meta">
            <span>📅 Creado: ${fechaCreacion}</span>
            <span>ID: ${task._id.slice(-6)}</span>
        </div>
        
        <div class="task-actions">
            <button class="edit" onclick="editTask('${task._id}')">
                ✏️ Editar
            </button>
            <button class="danger" onclick="showDeleteModal('${task._id}')">
                🗑️ Eliminar
            </button>
        </div>
    `;
    
    return card;
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        titulo: tituloInput.value.trim(),
        descripcion: descripcionInput.value.trim(),
        estado: estadoSelect.value
    };
    
    // Validaciones básicas
    if (!formData.titulo || !formData.descripcion) {
        showError('Título y descripción son obligatorios');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = '💾 Guardando...';
        
        let response;
        
        if (isEditing && currentTaskId) {
            // Actualizar tarea existente
            response = await fetch(`${API_BASE_URL}/${currentTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Crear nueva tarea
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(result.message);
            resetForm();
            loadTasks();
        } else {
            showError(result.message);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión al guardar la tarea');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditing ? '💾 Actualizar Tarea' : '💾 Crear Tarea';
    }
}

// Editar tarea
async function editTask(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${taskId}`);
        const result = await response.json();
        
        if (result.success) {
            const task = result.data;
            
            // Llenar el formulario con los datos de la tarea
            taskIdInput.value = task._id;
            tituloInput.value = task.titulo;
            descripcionInput.value = task.descripcion;
            estadoSelect.value = task.estado;
            
            // Cambiar a modo edición
            isEditing = true;
            currentTaskId = taskId;
            formTitle.textContent = '✏️ Editar Tarea';
            submitBtn.textContent = '💾 Actualizar Tarea';
            cancelBtn.style.display = 'inline-block';
            
            // Hacer scroll al formulario
            document.querySelector('.task-form-section').scrollIntoView({
                behavior: 'smooth'
            });
            
        } else {
            showError('Error al cargar la tarea: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión al cargar la tarea');
    }
}

// Mostrar modal de confirmación de eliminación
function showDeleteModal(taskId) {
    currentTaskId = taskId;
    deleteModal.style.display = 'flex';
}

// Ocultar modal de eliminación
function hideDeleteModal() {
    deleteModal.style.display = 'none';
    currentTaskId = null;
}

// Confirmar eliminación
async function confirmDelete() {
    if (!currentTaskId) return;
    
    try {
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = '🗑️ Eliminando...';
        
        const response = await fetch(`${API_BASE_URL}/${currentTaskId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Tarea eliminada exitosamente');
            loadTasks();
        } else {
            showError('Error al eliminar: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('Error de conexión al eliminar la tarea');
    } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = '🗑️ Eliminar';
        hideDeleteModal();
    }
}

// Resetear formulario
function resetForm() {
    taskForm.reset();
    taskIdInput.value = '';
    currentTaskId = null;
    isEditing = false;
    formTitle.textContent = '✏️ Nueva Tarea';
    submitBtn.textContent = '💾 Crear Tarea';
    cancelBtn.style.display = 'none';
}

// Actualizar estadísticas
function updateStats(tasks) {
    const total = tasks.length;
    const pendientes = tasks.filter(t => t.estado === 'pendiente').length;
    const enProgreso = tasks.filter(t => t.estado === 'en progreso').length;
    const completadas = tasks.filter(t => t.estado === 'completado').length;
    
    totalTasksSpan.textContent = `${total} tareas (${pendientes} pendientes, ${enProgreso} en progreso, ${completadas} completadas)`;
}

// Mostrar/ocultar indicador de carga
function showLoading() {
    loadingDiv.style.display = 'block';
    tasksContainer.style.display = 'none';
    noTasksDiv.style.display = 'none';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    tasksContainer.style.display = 'block';
}

// Mostrar mensajes de éxito y error
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('style[data-notifications]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notifications', 'true');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                animation: slideIn 0.3s ease-out;
            }
            
            .notification.success {
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #fc8181 0%, #e53e3e 100%);
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}