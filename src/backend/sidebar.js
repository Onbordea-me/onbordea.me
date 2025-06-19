// Sidebar Toggle Logic
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const sidebarLabels = document.querySelectorAll('.sidebar-label');

toggleBtn.addEventListener('click', () => {
  if (sidebar.classList.contains('w-20')) {
    sidebar.classList.remove('w-20');
    sidebar.classList.add('w-64');
    sidebarLabels.forEach(label => label.classList.remove('hidden'));
  } else {
    sidebar.classList.remove('w-64');
    sidebar.classList.add('w-20');
    sidebarLabels.forEach(label => label.classList.add('hidden'));
  }
});
