// Sidebar Toggle Logic
      const sidebar = document.getElementById('sidebar');
      const toggleBtn = document.getElementById('sidebar-toggle');
      const sidebarNav = document.getElementById('sidebar-nav');

      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('w-20');
        sidebar.classList.toggle('w-64');
        sidebarNav.classList.toggle('items-center');
        sidebarNav.classList.toggle('items-start');
        document.querySelectorAll('.sidebar-label').forEach(label => {
          label.classList.toggle('hidden');
        });
});
