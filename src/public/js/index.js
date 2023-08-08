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
        })
        .catch((error) => {
          console.error(error); 
        });
    });
  });
});


