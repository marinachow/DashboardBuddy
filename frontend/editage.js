// Select form elements
const blockForm = document.getElementById('block-form');
const variablesForm = document.getElementById('variables-form');
const numVariablesInput = document.getElementById('block-variables');

// Listen for click on "Add Variables" button
numVariablesInput.addEventListener('change', () => {
    // Get number of variables input value
    const numVariables = parseInt(document.getElementById('block-variables').value);
	variablesForm.innerHTML = '';
    // Create input fields for each variable
    for (let i = 1; i <= numVariables; i++) {
        const inputContainer = document.createElement('div');
        const nameLabel = document.createElement('label');
        const nameInput = document.createElement('input');
        const typeLabel = document.createElement('label');
        const typeSelect = document.createElement('select');
        const valueLabel = document.createElement('label');
        const valueInput = document.createElement('input');
        
        nameLabel.textContent = `Variable ${i} name:`;
        nameInput.type = 'text';
        nameInput.name = `variable-${i}-name`;
        nameInput.required = true;
        
        typeLabel.textContent = `Variable ${i} type:`;
        typeSelect.name = `variable-${i}-type`;
        const option1 = document.createElement('option');
        option1.value = 'button';
        option1.textContent = 'Button';
        typeSelect.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = 'text';
        option2.textContent = 'Text';
        typeSelect.appendChild(option2);
        typeSelect.required = true;
        
        valueLabel.textContent = `Variable ${i} value:`;
        valueInput.type = 'text';
        valueInput.name = `variable-${i}-value`;
        valueInput.required = true;

		inputContainer.appendChild(document.createElement("br"));
        inputContainer.appendChild(nameLabel);
        inputContainer.appendChild(nameInput);
		inputContainer.appendChild(document.createElement("br"));
		inputContainer.appendChild(document.createElement("br"));
		inputContainer.appendChild(typeLabel);
        inputContainer.appendChild(typeSelect);
		inputContainer.appendChild(document.createElement("br"));
		inputContainer.appendChild(document.createElement("br"));
        inputContainer.appendChild(valueLabel);
        inputContainer.appendChild(valueInput);
		inputContainer.appendChild(document.createElement("br"));
		inputContainer.appendChild(document.createElement("br"));
        variablesForm.appendChild(inputContainer);
    }
});

// Listen for form submission
blockForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let dashboardId = window.id;
    // Get form values
    const blockName = document.getElementById('block-name').value;
    const numVariables = parseInt(document.getElementById('block-variables').value);
    let newBlockId;

    try {
        const blockResponse = await axios.post('http://localhost:3000/block/add', {
            title: blockName,
			dashboardId: dashboardId
        });
        console.log('Block added');
        newBlockId = blockResponse.data.blockId;

        await axios.put(`http://localhost:3000/dashboard/addBlock/${dashboardId}`, {
            blockId: newBlockId
        });
        console.log('Block added to dashboard');

        for (let i = 1; i <= numVariables; i++) {
            const variableName = document.getElementsByName(`variable-${i}-name`)[0].value;
            const variableType = document.getElementsByName(`variable-${i}-type`)[0].value;
            const variableValue = document.getElementsByName(`variable-${i}-value`)[0].value;

            const variableResponse = await axios.post('http://localhost:3000/variable/add', {
                name: variableName,
                type: variableType,
                value: variableValue,
                blockId: newBlockId
            });
            console.log('Variable added');
            newVariableId = variableResponse.data.variableId;

            await axios.put(`http://localhost:3000/block/addVariable/${newBlockId}`, {
                variableId: newVariableId
            });
            console.log('Variable added to block');
        }
    } catch (error) {
        console.error(error);
    }
});
