class Dashboard {
  constructor(name, description, listeBlocks, idAccount) {
    this.name = name;
    this.description = description;
    this.listeBlocks = listeBlocks;
    this.idAccount = idAccount;
  }

}

class Block {

    constructor(blockId, titre, listeVariables, idDashboard, button) {
		this.blockId = blockId;
		this.titre = titre;
		this.listeVariables = listeVariables;
		this.idDashboard = idDashboard;
		//c'est le bouton qui pourrait permettre de fermer le block dans l'affichage
		this.button = button;
    }

    build(div, mode) {
		const blockId = this.blockId;
		const variableList = this.listeVariables.map(variable => variable.variableId);
		//blockground (div qui contient le block et son entête)
		let blockGround = document.createElement('div');
		if (mode == "dragAndDrop"){
			blockGround.className = "edit-blockGround";
			blockGround.dataset.id = blockId;
		} else {
			blockGround.className = "blockGround";
		}
		div.appendChild(blockGround);

		//entête (qui contient le titre et éventuellement les boutons d'édition ou d'affichage du block)
		let entete = document.createElement('div');
		entete.className= "enteteblock";
		blockGround.appendChild(entete);

		//titre 
		let titreblock = document.createElement('div');
		titreblock.className = "titreblock";
		titreblock.innerHTML = this.titre;
		entete.appendChild(titreblock);

		//block
		let elem = document.createElement('div');
		elem.className = "block";
		elem.id = `block1`;
		blockGround.appendChild(elem);

		if (mode == "editBlock") {
			//Edit Block button
			let editBlockBtn = document.createElement('button');
			editBlockBtn.innerHTML = "Edit Block";
			entete.appendChild(editBlockBtn);
			editBlockBtn.onclick = function() {
				titreblock.setAttribute("contenteditable", "true");
				titreblock.style.border = "2px solid black";
				titreblock.style.borderRadius = "5px";
				let newBlockTitle;
				titreblock.addEventListener('blur', function() {
					newBlockTitle = titreblock.innerHTML;
					axios.put(`http://localhost:3000/block/${blockId}`, {
						title: newBlockTitle,
						variableList: variableList
					})
					.then((res) => {
						console.log("Block editted");
						titreblock.removeAttribute("contenteditable");
  						titreblock.style.border = "none";
					})
					.catch((err) => {
						console.error(err);
					});
				});
			}
			//Delete Block button
			let deleteBlockBtn = document.createElement('button');
			deleteBlockBtn.innerHTML = "Delete Block";
			entete.appendChild(deleteBlockBtn);
			deleteBlockBtn.onclick = function() {
				axios.delete(`http://localhost:3000/block/${blockId}`)
					.then((res) => {
						console.log("Block deleted");
						location.reload();
					})
					.catch((err) => {
						console.error(err);
					});
			}
			//Edit block's variable order button
			let editVariableOrderBtn = document.createElement('button');
			editVariableOrderBtn.innerHTML = "Edit Variable Order";
			entete.appendChild(editVariableOrderBtn);
			editVariableOrderBtn.onclick = function() {
				window.location.href=`editBlock?blockId=${blockId}`;
			}
			for (let i = 0 ; i < this.listeVariables.length ; i++) {
				let variable = this.listeVariables[i];
				variable.build(elem, "editVariable");
			};
		} else {
			for (let i = 0 ; i < this.listeVariables.length ; i++) {
				let variable = this.listeVariables[i];
				variable.build(elem);
			};
		}
		
		

		//TODO ajouter le bouton qui permet d'ouvrir ou fermer le contenu		
    }
};

class Variable {
    constructor(variableId, titre, type, value, blockId) {
		this.variableId = variableId;
      	this.titre = titre;
		this.type = type;
		this.value = value;
		this.blockId = blockId;
    }

    build(div, mode) {
		const variableId = this.variableId;
		const variableType = this.type;
		const variableValue = this.value;
		//conteneur "variable"
		let conteneur = document.createElement('div');
		conteneur.id = "var";
		if (mode == "dragAndDrop") {
			conteneur.className = "edit-variable";
			conteneur.dataset.id = variableId;
		} else {
			conteneur.className = "variable";
		}
		div.appendChild(conteneur);

		//titre de la variable
		let titre = document.createElement('div');
		titre.innerHTML= this.titre;
		titre.className = "titreVar"
		conteneur.appendChild(titre);
		
		//input de la variable (selon le type : zone de texte ou bouton)
		let input;
		if (this.type == "text"){
			input = document.createElement('input');
			input.type = "text";
			input.className = "inputVar";
			input.value = this.value;
      	} 
      	if (this.type=="button") {
			input = document.createElement('label');
			input.className = "switch";
			let input2 = document.createElement('input');
			input2.type = "checkbox";
			let span = document.createElement('span');
			span.className = "slider round";
			input.appendChild(input2);
			input.appendChild(span);

			//onclick action
			input.onclick = buttonClicked(this.titre);
			
			if (this.value == "1"){
				input.checked= true;
			}
      	} else { //TODO si la variable n'a pas de type texte ou button
			input.innerHTML= "<input/>";
			input.className = "inputVar";
      	}
      	conteneur.appendChild(input);
		if (mode == "editVariable") {
			let buttonContainer = document.createElement('div');
			buttonContainer.className = "button-container";
			//Edit variable button
			let editVariableBtn = document.createElement('button');
			editVariableBtn.innerHTML = "Edit Variable";
			buttonContainer.appendChild(editVariableBtn);
			editVariableBtn.onclick = function() {
				titre.setAttribute("contenteditable", "true");
				titre.style.border = "2px solid black";
				titre.style.borderRadius = "5px";
				let newVariableTitle;
				titre.addEventListener('blur', function() {
					timeoutId = setTimeout(() => {
						newVariableTitle = titre.innerHTML;
						axios.put(`http://localhost:3000/variable/${variableId}`, {
							name: newVariableTitle,
							type: variableType,
							value: variableValue
						})
						.then((res) => {
							console.log("Variable edited");
							titre.removeAttribute("contenteditable");
							titre.style.border = "none";
						})
						.catch((err) => {
							console.error(err);
						});
					});
				});
			}
			//Delete Variable button
			let deleteVariableBtn = document.createElement('button');
			deleteVariableBtn.innerHTML = "Delete Variable";
			buttonContainer.appendChild(deleteVariableBtn);
			deleteVariableBtn.onclick = function() {
				axios.delete(`http://localhost:3000/variable/${variableId}`)
					.then((res) => {
						console.log("Variable deleted");
						location.reload();
					})
					.catch((err) => {
						console.error(err);
					});
			}
			div.appendChild(buttonContainer);
		}

    }
}
module.exports = { Block, Variable };
 