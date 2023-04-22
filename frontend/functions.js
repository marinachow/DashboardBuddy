function loadDashboard(id, mode) {    
    axios.get(`http://localhost:3000/dashboard/${id}`)
    .then(response => {
        const blockListData = response.data.blockList;
        if (blockListData) {
            let div = document.getElementById('dashboard');
            blockListData.map(blockData => {
                const block = new Block(blockData.blockId, blockData.titre, blockData.listeVariables, blockData.idDashboard);
                block.listeVariables = blockData.listeVariables.map(variable => new Variable(variable.variableId, variable.titre, variable.type, variable.value, variable.blockId));
                if (mode == "dragAndDrop") {
                    block.build(div, "dragAndDrop");
                } 
                else if (mode == "editBlock") {
                    block.build(div, "editBlock");
                } else {
                    block.build(div);
                }
            });
            if (mode == "dragAndDrop") {
                dragAndDrop("dashboard", id);
            }
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function loadBlock(id, mode) {    
    axios.get(`http://localhost:3000/block/${id}`)
    .then(response => {
        const variableListData = response.data.block.variable_list;
        if (variableListData) {
            let div = document.getElementById('block');
            variableListData.map(variableData => {
                const variable = new Variable(variableData.variableId, variableData.titre, variableData.type, variableData.value, variableData.blockId);
                if (mode == "dragAndDrop") {
                    variable.build(div, "dragAndDrop");
                } 
                else if (mode == "editBlock") {
                    variable.build(div, "editBlock");
                } else {
                    variable.build(div);
                }
            });
            if (mode == "dragAndDrop") {
                dragAndDrop("block", id);
            }
        }
    })
    .catch(error => {
        console.error(error);
    });
}


const buttonClicked = function (titre) {
    //TODO action quand le bouton booléen (toggle button bleu) est cliqué : dans la BDD, changer 0/1
  };

let itemIds;
function dragAndDrop(mode) {
    let items;
    if (mode == "dashboard") {
        items = document.querySelectorAll(".edit-blockGround");
    } else if (mode == "block") {
        items = document.querySelectorAll(".edit-variable");
    }
    let dragStartIndex;
    let dragEndIndex;
    items.forEach((item, index) => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', () => {
            dragStartIndex = index;
        });
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        item.addEventListener('dragenter', (e) => {
            e.preventDefault();
            item.classList.add('drag-over');
        });
        item.addEventListener('dragleave', () => {
            item.classList.remove('drag-over');
        });
        item.addEventListener('drop', () => {
            dragEndIndex = index;
            updateOrder(dragStartIndex, dragEndIndex);
        });
    });

    function updateOrder(start, end) {
        console.log("start = ", start, " end = ", end)
        // Remove the moved item
        const movedItem = items[start];
        const parent = movedItem.parentElement;
        parent.removeChild(movedItem);

        // Insert the moved item at the target position + 1
        const targetIndex = end < start ? end : end + 1;
        const targetItem = items[targetIndex];
        parent.insertBefore(movedItem, targetItem);

        // Update the items array and itemIds
        items = Array.from(document.querySelectorAll(".edit-blockGround"));
        itemIds = Array.from(items, (item) => item.dataset.id);
        console.log(itemIds);
    }
}

function saveOrder(mode, id) {
    if (!itemIds) {
        if (mode == "dashboard") {
            items = document.querySelectorAll(".edit-blockGround");
        } else if (mode == "block") {
            items = document.querySelectorAll(".variable");
        }
        itemIds = Array.from(items, (item) => item.dataset.id);
    }
    if (mode == "dashboard") {
        axios.put(`http://localhost:3000/dashboard/updateBlockOrder/${id}`, {
            blockList: itemIds,
        })
        .then((res) => {
            console.log("Block order updated");
        })
        .catch((err) => {
            console.error(err);
        })
    } else if (mode == "block") {
        axios.put(`http://localhost:3000/block/updateVariableOrder/${id}`, {
            variableList: itemIds,
        })
        .then((res) => {
            console.log("Variable list updated");
        })
        .catch((err) => {
            console.error(err);
        })
    }
}
  