const socketClient = io();

// Espera hasta que se cargue completamente la página
window.addEventListener('load', () => {
  socketClient.on('connect', () => {
    console.log('Conectado al servidor de WebSocket');

    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(productForm);
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        thumbnail: formData.get('thumbnail'),
        code: formData.get('code'),
        stock: formData.get('stock'),
        category: formData.get('category'),
      };
      socketClient.emit('createProduct', data);
      productForm.reset();
    });

    // Eliminar producto
    document.getElementById('deleteProductForm').addEventListener('submit', (event) => {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);
      const productId = formData.get('productId'); // Obtener el ID del producto seleccionado

      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => Promise.reject(data.error));
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.message);
          form.reset();

          // Evento para actualizar la lista de productos en tiempo real
          socketClient.emit('productListUpdate');
        })

        .catch((error) => {
          console.error(error);
        });
    });

    // Actualización en tiempo real de la lista de productos
    socketClient.on('productListUpdate', (updatedProducts) => {
      const productList = document.querySelector('ul');
      productList.innerHTML = '';

      const deleteProductSelect = document.querySelector('select[name="productId"]');
      deleteProductSelect.innerHTML = ''; 

      updatedProducts.forEach(product => {
        const productItem = document.createElement('li');
        productItem.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(productItem);

        const option = document.createElement('option');
        option.value = product.id; 
        option.textContent = product.title;
        deleteProductSelect.appendChild(option);
      });
    });
  });
});


