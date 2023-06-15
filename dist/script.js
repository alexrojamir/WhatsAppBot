// Variables globales
const form = document.getElementById('form');
const itemsContainer = document.getElementById('items-container');

// Obtener todos los registros al cargar la página
window.addEventListener('DOMContentLoaded', getItems);

// Enviar el formulario para crear o actualizar un registro
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = form.dataset.itemId;
  const producto = document.getElementById('producto').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = document.getElementById('precio').value;

  if (id) {
    // Actualizar un registro existente
    updateItem(id, producto, descripcion, precio);
  } else {
    // Crear un nuevo registro
    createItem(producto, descripcion, precio);
  }

  form.reset();
});

// Crear un nuevo registro
function createItem(producto, descripcion, precio) {
  fetch('http://18.211.23.8/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ producto, descripcion, precio }),
  })
    .then((res) => res.json())
    .then((data) => {
      displayItem(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Obtener todos los registros
function getItems() {
  fetch('http://18.211.23.8/')
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        displayItem(item);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// Mostrar un registro en la interfaz
function displayItem(item) {
  const itemElement = document.createElement('div');
  itemElement.classList.add('item');
  itemElement.innerHTML = `
    <div>
      <h3 style="text-transform: uppercase;">${item.producto}</h3>
      <p>${item.descripcion}</p>
      <p>Precio: S/ ${item.precio}</p>
    </div>
    <div>
      <button class="btn btn-secondary" onclick="editItem('${item._id}')">Editar</button>
      <button class="btn btn-danger" onclick="deleteItem('${item._id}')">Eliminar</button>
    </div>
  `;

  itemsContainer.appendChild(itemElement);
}

// Editar un registro
function editItem(id) {
  fetch(`http://18.211.23.8/${id}`)
    .then((res) => res.json())
    .then((data) => {
      form.dataset.itemId = data._id;
      document.getElementById('producto').value = data.producto;
      document.getElementById('descripcion').value = data.descripcion;
      document.getElementById('precio').value = data.precio;
    })
    .catch((error) => {
      console.error(error);
    });
}

// Actualizar un registro existente
function updateItem(id, producto, descripcion, precio) {
  fetch(`http://18.211.23.8/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ producto, descripcion, precio }),
  })
    .then((res) => res.json())
    .then((data) => {
      const updatedItem = document.querySelector(`[data-item-id="${data._id}"]`);
      updatedItem.querySelector('h3').textContent = data.producto;
      updatedItem.querySelector('p:first-child').textContent = data.descripcion;
      updatedItem.querySelector('p:last-child').textContent = `Precio: ${data.precio}`;
      delete form.dataset.itemId;
    })
    .catch((error) => {
      console.error(error);
    });
}

// Eliminar un registro
function deleteItem(id) {
  fetch(`http://18.211.23.8/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      const deletedItem = document.querySelector(`[data-item-id="${id}"]`);
      deletedItem.remove();
    })
    .catch((error) => {
      displayItem(data);
      console.error(error);
    });
}
