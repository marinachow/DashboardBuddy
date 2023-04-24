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
    const blockId = blockName.dataset.id;
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
    const variableId = variableName.dataset.id;
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
    const variableId = event.target.dataset.id;
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
    const variableId = event.target.dataset.id;
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

function dragAndDrop(mode) {
    let items;
    if (mode == "dashboard") {
        items = document.querySelectorAll(".edit-blockGround");
    } else if (mode == "block") {
        items = document.querySelectorAll(".edit-variable");
    }
    let dragged;
    items.forEach((item) => {
        item.setAttribute('draggable', 'true');
        item.ondragstart = (e) => {
            dragged = item;
            e.dataTransfer.setData('text/plain', item.innerHTML);
        };
      
        item.ondragover = (e) => {
            e.preventDefault();
        };
      
        item.ondrop = (e) => {
            dragged.innerHTML = item.innerHTML;
            item.innerHTML = e.dataTransfer.getData('text/plain');
            e.dataTransfer.clearData();
        };
    });
}

function saveOrder(mode, id) {
    const itemIds = [];
    if (mode == "dashboard") {
        const enteteBlocks = document.querySelectorAll('.enteteblock');
        for (let i = 0; i < enteteBlocks.length; i++) {
            const dataId = enteteBlocks[i].getAttribute('data-id');
            itemIds.push(dataId);
        }
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
        const titreBlocks = document.querySelectorAll('.titreVar');
        for (let i = 0; i < titreBlocks.length; i++) {
            const dataId = titreBlocks[i].getAttribute('data-id');
            itemIds.push(dataId);
        }
        axios.put(`http://localhost:3000/updateVariableOrder/${id}`, {
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
  