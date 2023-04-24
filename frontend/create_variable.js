const variableForm = document.getElementById('variable-form');

// Listen for form submission
variableForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let blockId = window.id;
    // Get form values
    const variableName = document.getElementById('variable-name').value;
    const variableType = document.getElementById('variable-type').value;
    const variableValue = document.getElementById('variable-value').value;
    let newVariableId;

    try {
        const variableResponse = await axios.post('http://localhost:3000/addVariable', {
            name: variableName,
			type: variableType,
            value: variableValue,
            blockId: blockId
        });
        console.log('Variable added');
        newVariableId = variableResponse.data.variableId;

        await axios.put(`http://localhost:3000/block/addVariable/${blockId}`, {
            variableId: newVariableId
        });
        console.log('Variable added to block');
        location.reload();
    } catch (error) {
        console.error(error);
    }
});
