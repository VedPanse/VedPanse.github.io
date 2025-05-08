const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // ✅ If already active, do nothing
    if (button.classList.contains('active')) return;

    const targetId = button.getAttribute('data-tab');

    // Toggle active class on buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Toggle visible content
    tabContents.forEach(content => {
      content.style.display = content.id === targetId ? 'flex' : 'none';
    });
  });
});
