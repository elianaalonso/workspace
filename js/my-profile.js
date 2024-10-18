// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  // Función para obtener datos de localStorage
  function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  
  // Alternar entre Modo Día y Noche
  const themeSwitch = document.getElementById('themeSwitch');
  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    
    // Guardar preferencia del modo en localStorage
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    saveToLocalStorage('theme', theme);
  });
  
  // Previsualizar la foto de perfil seleccionada
  const profilePicInput = document.getElementById('profilePic');
  const profilePicPreview = document.getElementById('profilePicPreview');
  profilePicInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePicPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo de imagen válido.');
    }
  });
  
  // Mostrar mensaje de error en el formulario
  function showError(input, message) {
    const formControl = input.parentElement;
    const feedback = formControl.querySelector('.invalid-feedback');
    input.classList.add('is-invalid');
    feedback.textContent = message;
  }
  
  // Limpiar el mensaje de error
  function clearError(input) {
    input.classList.remove('is-invalid');
  }
  
  // Validar formulario
  function validateForm() {
    let isValid = true;
    
    const name = document.getElementById('name');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Validar nombre
    if (!name.value.trim()) {
      showError(name, 'El nombre es obligatorio.');
      isValid = false;
    } else {
      clearError(name);
    }
  
    // Validar apellido
    if (!lastName.value.trim()) {
      showError(lastName, 'El apellido es obligatorio.');
      isValid = false;
    } else {
      clearError(lastName);
    }
  
    // Validar email
    if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Por favor, ingresa un correo válido.');
      isValid = false;
    } else {
      clearError(email);
    }
  
    return isValid;
  }
  
  // Guardar datos del perfil en localStorage
  const form = document.getElementById('profileForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {
      const profileData = {
        name: document.getElementById('name').value,
        secondName: document.getElementById('secondName').value,
        lastName: document.getElementById('lastName').value,
        secondLastName: document.getElementById('secondLastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        profilePic: profilePicPreview.src,
      };
  
      saveToLocalStorage('profileData', profileData);
      alert('Cambios guardados exitosamente');
    }
  });
  
  // Cargar el modo guardado y los datos de perfil al cargar la página
  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getFromLocalStorage('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }
  
    const profileData = getFromLocalStorage('profileData');
    if (profileData) {
      document.getElementById('name').value = profileData.name || '';
      document.getElementById('secondName').value = profileData.secondName || '';
      document.getElementById('lastName').value = profileData.lastName || '';
      document.getElementById('secondLastName').value = profileData.secondLastName || '';
      document.getElementById('email').value = profileData.email || '';
      document.getElementById('phone').value = profileData.phone || '';
      profilePicPreview.src = profileData.profilePic || 'img/placeholder.png';
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    // Obtener el email guardado desde localStorage
    const loggedInEmail = localStorage.getItem('loggedInEmail');

    // Si existe un email guardado, precargarlo en el campo de email del perfil
    if (loggedInEmail) {
        document.getElementById('email').value = loggedInEmail;
    }
});
