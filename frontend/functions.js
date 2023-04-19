async function loadDashboard(id, mode) {    
    const response = await axios.get(`http://localhost:3000/dashboard/${id}`);
    if (response.data.blockList) {
        const blockListData = response.data.blockList;
        let div = document.getElementById('dashboard');
        blockListData.map(blockData => {
            const block = new Block(blockData.id, blockData.titre, blockData.listeVariables, blockData.idDashboard);
            block.listeVariables = blockData.listeVariables.map(variable => new Variable(variable.id, variable.titre, variable.type, variable.value, variable.blockId));
            if (mode == "edit") {
                block.build(div, "edit");
            } else {
                block.build(div);
            }
        });
        if (mode == "edit") {
            dragAndDrop(id);
        }
    }
}

const buttonClicked = function (titre) {
    //TODO action quand le bouton booléen (toggle button bleu) est cliqué : dans la BDD, changer 0/1
  };

function dragAndDrop(dashboardId) {
    const blocks = document.querySelectorAll('.edit-blockGround');
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
        axios.put(`http://localhost:3000/dashboard/updateBlockOrder/${dashboardId}`, { blockList: blockIds })
        .then((res) => {
            console.log("Block order updated");
        })
        .catch((err) => {
            console.error(err);
        });
    }
}