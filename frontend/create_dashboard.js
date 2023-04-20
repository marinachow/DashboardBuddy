const dashboardForm = document.getElementById('dashboard-form');

window.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('dashboard-description');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });
});

// Listen for form submission
dashboardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const dashboardName = document.getElementById('dashboard-name').value;
    const dashboardDescription = document.getElementById('dashboard-description').value;
    axios.post('http://localhost:3000/dashboard/add', { 
        name: dashboardName,
        description: dashboardDescription
    })
    .then((res) => {
        console.log("Dashboard created");
        window.location.href = '/createBlock?dashboardId=' + res.data.dashboardId;
    })
    .catch((err) => {
        console.error(err);
    });
});
