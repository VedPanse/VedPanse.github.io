const blogTabButtons = document.querySelectorAll('.blogs-tab-btn');
const blogTabContents = document.querySelectorAll('.blogs-tab-content');

blogTabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-tab');

    // Toggle active state on buttons
    blogTabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Show/hide content panels
    blogTabContents.forEach(content => {
      if (content.id === targetId) {
        content.style.display = 'block';
      } else {
        content.style.display = 'none';
      }
    });
  });
});
