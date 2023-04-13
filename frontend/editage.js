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
});

const ajout = () => {
	// Obtener el formulario y el contenedor de bloques
const blockForm = document.getElementById('block-form');
const blockContainer = document.createElement('div');
blockContainer.id = 'block-container';
document.querySelector('main').appendChild(blockContainer);
const numVariables = document.getElementById('block-variables').value;
const blockList = document.createElement('ul');


// Agregar un nuevo bloque al formulario
blockForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const blockName = document.getElementById('block-name').value;

// Crear el nuevo bloque y agregarlo al contenedor
const newBlock = document.createElement('div');
newBlock.classList.add('block');
const blockTitle = document.createElement('h3');
blockTitle.textContent = blockName;
newBlock.appendChild(blockTitle);
newBlock.appendChild(blockList);
blockContainer.appendChild(newBlock);
});

// Crear un campo de texto para cada variable
console.log("here" + numVariables);
for (let i = 0; i < numVariables; i++) {
	console.log("in here");
  const listItem = document.createElement('li');
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'text';
  listItem.appendChild(label);
  listItem.appendChild(input);
  blockList.appendChild(listItem);
}

}
