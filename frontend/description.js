const textareas = document.querySelectorAll('textarea');

function resizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

textareas.forEach(textarea => {
  textarea.addEventListener('input', () => {
    resizeTextarea(textarea);
  });
  resizeTextarea(textarea);
});
