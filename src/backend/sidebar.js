// Sidebar Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarLabels = document.querySelectorAll('.sidebar-label');
  const logo = document.getElementById('logo');

  if (!sidebarToggle || !sidebar || !logo) return;

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('w-20');
    sidebar.classList.toggle('w-64');

    sidebarLabels.forEach(label => {
      label.classList.toggle('hidden');
    });

    if (sidebar.classList.contains('w-64')) {
      logo.style.width = '100px';
      logo.style.height = 'auto';
      logo.src = 'assets/logo-full.png';
    } else {
      logo.style.width = 'auto';
      logo.style.height = 'auto';
      logo.src = 'assets/logo.png';
    }
  });
});
