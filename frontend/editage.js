// Obtener la tabla de bloques
const blockTable = document.querySelector('#block-table');

// Cargar bloques existentes al cargar la página
window.addEventListener('load', () => {
	loadBlocks();
});

// Agregar evento al formulario de agregar bloque
const blockForm = document.querySelector('#block-form');
blockForm.addEventListener('submit', (event) => {
	event.preventDefault();
	addBlock();
});

