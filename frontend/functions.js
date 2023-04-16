const loadDashboard = function (id){
    // TODO récupérer les listes de blocks et de variables depuis la BDD à partir de l'ID du dashboard
    
    if (id == undefined){
        //block1
        let titre1 = "Message d'accueil" ;
        let variable1 = new variable ("Activer le message :","button","0");
        let variable2 = new variable ("Contenu du message","texte", "Bonjour");
        let listeVar = [variable1, variable2];
        let block1 = new block(titre1, listeVar);
        //block2
        let titre2 = "Horaire du standard" ;
        let variable3 = new variable ("Fermeture : ","texte","17h");
        let variable4 = new variable ("Ouverture : ", "texte", "8h");
        let listeVar2 = [variable4, variable3];
        let block2 = new block(titre2, listeVar2);
        
        //Liste des blocks
        let listeblock = [block1, block2];
        return listeblock;
    }
}

//TODO écrire la fonction onclick du bouton qui permet de monter un bloc au-dessus d'un autre dans la page d'édition du dashboard
const moveBlockUp = function (idDash,idblock){
    //récupérer la liste de block du Dash, grâce à idDash
    //repérer la position de idblock et inverser avec son voisin
}

const moveBlockDown = function(idDash,idblock){
    //TODO
}

const buttonClicked = function (titre) {
    //TODO action quand le bouton booléen (toggle button bleu) est cliqué : dans la BDD, changer 0/1
  };

function dragAndDrop() {
    const blocks = document.querySelectorAll('.block');
    let dragStartIndex;
    let dragEndIndex;
    blocks.forEach((block, index) => {
        block.setAttribute('draggable', 'true');
        block.addEventListener('dragstart', () => {
            dragStartIndex = index;
        });
        block.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        block.addEventListener('dragenter', (e) => {
            e.preventDefault();
            block.classList.add('drag-over');
        });
        block.addEventListener('dragleave', () => {
            block.classList.remove('drag-over');
        });
        block.addEventListener('drop', () => {
            dragEndIndex = index;
            swapBlocks(dragStartIndex, dragEndIndex);
        });
    });

    function swapBlocks(start, end) {
        const temp = blocks[start].innerHTML;
        blocks[start].innerHTML = blocks[end].innerHTML;
        blocks[end].innerHTML = temp;
        blocks[start].classList.remove('drag-over');
    }
}