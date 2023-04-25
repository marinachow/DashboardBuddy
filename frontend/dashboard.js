class Dashboard {
	constructor(dashboardId, name, description, listeBlocks, idAccount) {
		this.dashboardId = dashboardId;
		this.name = name;
		this.description = description;
		this.listeBlocks = listeBlocks;
		this.idAccount = idAccount;
	}

	build(div, mode) {
		let descriptionDiv;
		let descriptionP;
		if (mode == "afficher" || mode == "editDashboard") {
			let headerDiv = document.getElementById("dashboard-name");
			headerDiv.textContent = this.name;
			descriptionDiv = document.getElementById("dashboard-description");
			descriptionP = document.createElement("p");
			descriptionP.textContent = this.description;
			descriptionDiv.appendChild(descriptionP);
		}
		if (mode == "editDashboard") {
			let editDescriptionBtn = document.createElement('button');
			editDescriptionBtn.innerHTML = "Edit Description";
			editDescriptionBtn.onclick = function() {
				descriptionP.setAttribute("contenteditable", "true");
				descriptionP.style.border = "2px solid black";
				descriptionP.style.borderRadius = "5px";
				descriptionP.addEventListener('blur', editDescription);
			}
			descriptionDiv.appendChild(editDescriptionBtn);
		}
		this.listeBlocks.map(blockData => {
			const block = new Block(blockData.blockId, blockData.titre, blockData.listeVariables, blockData.idDashboard);
			block.listeVariables = blockData.listeVariables.map(variable => new Variable(variable.variableId, variable.titre, variable.type, variable.value, variable.blockId));
			block.build(div, mode);
		});
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
		const dashboardId = this.idDashboard;
		//blockground (div qui contient le block et son entête)
		let blockGround = document.createElement('div');
		if (mode == "dragAndDrop"){
			blockGround.className = "edit-blockGround";
		} else {
			blockGround.className = "blockGround";
		}
		blockGround.dataset.id = blockId;
		div.appendChild(blockGround);

		//entête (qui contient le titre et éventuellement les boutons d'édition ou d'affichage du block)
		let entete = document.createElement('div');
		entete.className= "enteteblock";
		entete.dataset.id = blockId;
		blockGround.appendChild(entete);

		//titre 
		let titreblock = document.createElement('div');
		titreblock.className = "titreblock";
		titreblock.innerHTML = this.titre;
		titreblock.dataset.id = blockId;
		entete.appendChild(titreblock);

		//block
		let elem = document.createElement('div');
		elem.className = "block";
		elem.id = `block1`;
		elem.dataset.id = blockId;
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
				titreblock.addEventListener('blur', editBlockName);
			}
			//Delete Block button
			let deleteBlockBtn = document.createElement('button');
			deleteBlockBtn.innerHTML = "Delete Block";
			entete.appendChild(deleteBlockBtn);
			deleteBlockBtn.onclick = function() {
				axios.delete(`${domain}/block/${blockId}`)
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
				window.location.href=`editBlock?blockId=${blockId}&dashboardId=${dashboardId}`;
			}
		}
		for (let i = 0 ; i < this.listeVariables.length ; i++) {
			let variable = this.listeVariables[i];
			variable.build(elem, mode);
		};
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
		//conteneur "variable"
		let conteneur = document.createElement('div');
		conteneur.id = "var";
		if (mode == "dragAndDrop") {
			conteneur.className = "edit-variable";
		} else {
			conteneur.className = "variable";
		}
		conteneur.dataset.id = variableId;
		div.appendChild(conteneur);

		//titre de la variable
		let titre = document.createElement('div');
		titre.innerHTML= this.titre;
		titre.className = "titreVar"
		titre.dataset.id = variableId;
		conteneur.appendChild(titre);
		
		//input de la variable (selon le type : zone de texte ou bouton)
		let input;
		if (this.type == "text"){
			input = document.createElement('input');
			input.type = "text";
			input.className = "inputVar";
			input.value = this.value;
			input.dataset.id = variableId;
			if (mode == "editVariable") {
				input.addEventListener('change', editVariableValue);
			} else {
				input.disabled = true;
			}
      	} 
      	if (this.type=="button") {
			input = document.createElement('label');
			input.className = "switch";
			let input2 = document.createElement('input');
			input2.type = "checkbox";
			let span = document.createElement('span');
			span.className = "slider round";
			input2.checked = (this.value === "1");
			input2.dataset.id = variableId;
			input.appendChild(input2);
			input.appendChild(span);
			if (mode == "editVariable") {
				input.addEventListener('change', sliderClicked);
			} else {
				input2.disabled = true;
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
				titre.addEventListener('blur', editVariableName);
			}
			//Delete Variable button
			let deleteVariableBtn = document.createElement('button');
			deleteVariableBtn.innerHTML = "Delete Variable";
			buttonContainer.appendChild(deleteVariableBtn);
			deleteVariableBtn.onclick = function() {
				axios.delete(`${domain}/variable/${variableId}`)
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
module.exports = { Dashboard, Block, Variable };
 