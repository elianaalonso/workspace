// Función para guardar datos en localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  // Función para obtener datos de localStorage
  function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  
  
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
  