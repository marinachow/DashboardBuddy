const loadDashboard = function (id){
    // TODO récupérer les listes de blocks et de variables depuis la BDD à partir de l'ID du dashboard
    
    if (id == undefined){
        //block1
        let titre1 = "Message d'accueil" ;
        let variable1 = new variable (0, "Activer le message :","button","0", 0, 0);
        let variable2 = new variable (1, "Contenu du message","texte", "Bonjour", 0, 1);
        let listeVar = [variable1, variable2];
        let block1 = new block(titre1, listeVar);
        //block2
        let titre2 = "Horaire du standard" ;
        let variable3 = new variable (2, "Fermeture : ","texte","17h", 1, 0);
        let variable4 = new variable (3, "Ouverture : ", "texte", "8h", 1, 1);
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
    const blocks = document.querySelectorAll('.blockGround');
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

        // Update block order
        const blockIds = Array.from(blocks, (block) => block.dataset.id);
        const movedBlockId = blockIds.splice(start, 1)[0];
        blockIds.splice(end, 0, movedBlockId);

        // Update block order in database
        axios.put(`http://localhost:3000/dashboard/edit/${dashboardId}`, { blockList: blockIds })
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.error(err);
        });
    }
}