const fs = require('fs');

const data = 'Este es el contenido del archivo creado.';
fs.writeFile('nuevo-archivo.txt', data, (err) => {
  if (err) {
    console.error('Error al crear el archivo:', err);
  } else {
    console.log('Archivo creado exitosamente.');
  }
});