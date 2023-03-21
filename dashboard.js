class Dashboard {
  constructor(name, description, listeBlocks, idAccount) {
    this.name = name;
    this.description = description;
    this.listeBlocks = listeBlocks;
    this.idAccount = idAccount;
  }

  getId(){
    //TODO
  }

}

class block {

    constructor(titre, listeVariables, idDashboard, button) {
      this.id = this.getId();
      this.titre = titre;
      this.listeVariables = listeVariables;
      this.idDashboard = idDashboard;
      //c'est le bouton qui pourrait permettre de fermer le block dans l'affichage
      this.button = button;
    }

    getId(){
      //TODO aller chercher dans la BDD l'id du block
        }

    build(div, mode) {
      
      //blockground (div qui contient le block et son entête)
      let blockGround = document.createElement('div');
      blockGround.className = "blockGround";
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

      // boutons d'édition
      if (mode == "edit"){
        const buttonUp = document.createElement('button');
        buttonUp.className = "moveUp";
        //enlever le mode commentaire quand la méthode moveBlockUp est écrite
        //buttonUp.onclick= moveblockUp (this.getDashboardId(), this.getId());
        const buttonDown = document.createElement('button');
        buttonDown.className = "moveUp";
        //enlever le mode commentaire quand la méthode moveBlockDown est écrite
        //buttonDown.onclick= moveblockDown (getDashboardId(this), getId(this));
        entete.appendChild(buttonUp); 
        entete.appendChild(buttonDown);
      }

      //block
      let elem = document.createElement('div');
      elem.className = "block";
      elem.id = `block1`;
      blockGround.appendChild(elem);

      //TODO ajouter le bouton qui permet d'ouvrir ou fermer le contenu

      for (let i = 0 ; i < this.listeVariables.length ; i++) {
        let variable = this.listeVariables[i];
        variable.build(elem);
    };
    }
  };

  class variable {

    constructor(titre, type, value) {
      this.titre = titre;
      this.type = type;
      this.value = value;
    }

    build(div) {
      //conteneur "variable"
      let conteneur = document.createElement('div');
      conteneur.className = "variable";
      conteneur.id = `var1`;
      div.appendChild(conteneur);

      //titre de la variable
      let titre = document.createElement('div');
      titre.innerHTML= this.titre;
      titre.className = "titreVar"
      conteneur.appendChild(titre);
      
      //input de la variable (selon le type : zone de texte ou bouton)
      let input;
      if (this.type == "texte"){
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
      }
      else { //TODO si la variable n'a pas de type texte ou button
        input.innerHTML= "<input/>";
        input.className = "inputVar";
      }

      conteneur.appendChild(input);

    }
  }
  