function afficherUsername() {
    axios.get('http://localhost:3000/user')
    .then(response => {
        let username = response.data.username;
        let div = document.getElementById("username");
        let label = document.createElement('label');
        label.textContent = username;
        div.appendChild(label);
    })
    .catch(error => {
        console.error(error);
    });
}

function getDashboardList() {
    axios.get('http://localhost:3000/user/dashboardList')
    .then(response => {
        const dashboardList = response.data.dashboardList;
        const dashboardListElement = document.getElementById('dashboard-list');
        
        dashboardList.forEach(dashboardId => {
            const dashboardListItem = document.createElement('li');
            const dashboardLink = document.createElement('a');
            dashboardLink.textContent = `Dashboard ${dashboardId}`;
            dashboardLink.href = `/myDashboard?dashboardId=${dashboardId}`;
            dashboardListItem.appendChild(dashboardLink);
            let deleteDashboardBtn = document.createElement('button');
            deleteDashboardBtn.innerHTML = "Delete Dashboard";
            deleteDashboardBtn.onclick = function() {
            axios.delete(`http://localhost:3000/dashboard/${dashboardId}`)
                .then((res) => {
                    console.log("Dashboard deleted");
                    location.reload();
                })
                .catch((err) => {
                    console.error(err);
                });
            }
            dashboardListElement.appendChild(dashboardListItem);
            dashboardListElement.appendChild(deleteDashboardBtn);
        });
    })
    .catch(error => {
        console.log(error);
    });
}

function loadDashboard(id, mode) {    
    axios.get(`http://localhost:3000/dashboard/${id}`)
    .then(response => {
        const dashboardData = response.data.dashboard;
        const blockListData = response.data.blockList;
        if (blockListData) {
            let div = document.getElementById('dashboard');
            const dashboard = new Dashboard(dashboardData.id, dashboardData.name, dashboardData.description, blockListData, blockListData.account_id);
            dashboard.build(div, mode);
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
        let div = document.getElementById('blockGround');
        const blockData = response.data.block;
        const block = new Block(blockData.id, blockData.title, blockData.variable_list, blockData.dashboard_id);
        block.listeVariables = blockData.variable_list.map(variable => new Variable(variable.variableId, variable.titre, variable.type, variable.value, variable.blockId));
        block.build(div, mode);
        if (mode == "dragAndDrop") {
            dragAndDrop("block", id);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function editDescription(event) { 
    const description = event.target;
    newDescription = description.innerHTML;
    axios.put(`http://localhost:3000/dashboardDescription/${window.id}`, {
        description: newDescription,
    })
    .then((res) => {
        console.log("Dashboard editted");
        description.removeAttribute("contenteditable");
        description.style.border = "none";
    })
    .catch((err) => {
        console.error(err);
    });
}

function editDashboardName(event) {
    const titre = document.getElementById("dashboard-name");
    titre.setAttribute("contenteditable", "true");
    titre.style.border = "2px solid black";
    titre.style.borderRadius = "5px";
    titre.addEventListener('blur', function() {
        const dashboardName = titre.innerText;
        axios.put(`http://localhost:3000/dashboardName/${window.id}`, {
            name: dashboardName,
        })
        .then((res) => {
            console.log("Dashboard editted");
            titre.removeAttribute("contenteditable");
            titre.style.border = "none";
        })
        .catch((err) => {
            console.error(err);
        });
    });
}

function editBlockName(event) {
    const blockName = event.target;
    const blockId = blockName.parentNode.parentNode.dataset.id;
    newBlockTitle = blockName.innerHTML;
    axios.put(`http://localhost:3000/blockName/${blockId}`, {
        title: newBlockTitle,
    })
    .then((res) => {
        console.log("Block editted");
        blockName.removeAttribute("contenteditable");
        blockName.style.border = "none";
    })
    .catch((err) => {
        console.error(err);
    });
}

function editVariableName(event) {
    const variableName = event.target;
    const variableId = variableName.parentNode.dataset.id;
    let newVariableTitle = variableName.innerHTML;
    axios.put(`http://localhost:3000/variableName/${variableId}`, {
        name: newVariableTitle
    })
    .then((res) => {
        console.log("Variable edited");
        variableName.removeAttribute("contenteditable");
        variableName.style.border = "none";
    })
    .catch((err) => {
        console.error(err);
    });
}

function sliderClicked(event) {
    const variableId = event.target.parentNode.parentNode.dataset.id;
    let variableValue;
    if (event.target.checked) {
        variableValue = 1;
    } else {
        variableValue = 0;
    }
    axios.put(`http://localhost:3000/variableValue/${variableId}`, {
            value: variableValue
        })
        .then((res) => {
            console.log("Variable edited");
        })
        .catch((err) => {
            console.error(err);
        });
}

function editVariableValue(event) {
    const variableValue = event.target.value;
    const variableId = event.target.parentNode.dataset.id;
    axios.put(`http://localhost:3000/variableValue/${variableId}`, {
            value: variableValue
        })
        .then((res) => {
            console.log("Variable edited");
        })
        .catch((err) => {
            console.error(err);
        });
}

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
        // Remove the moved item
        const movedItem = items[start];
        const parent = movedItem.parentElement;
        parent.removeChild(movedItem);

        // Insert the moved item at the target position + 1
        const targetIndex = end < start ? end : end + 1;
        const targetItem = items[targetIndex];
        parent.insertBefore(movedItem, targetItem);

        items = Array.from(document.querySelectorAll(".edit-blockGround"));
        itemIds = Array.from(items, (item) => item.dataset.id);
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
        axios.put(`http://localhost:3000/updateBlockOrder/${id}`, {
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
  