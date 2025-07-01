   mapboxgl.accessToken = 'pk.eyJ1Ijoib25ib3JkZWEiLCJhIjoiY21icXM3aDI3MDJvOTJrcHZqenp3bW1wOSJ9.lQcEYdGkOfDzQe4Sl8L3TQ';
    const employees = [
      { name: 'Alice Smith', role: 'Manager', lat: -34.6037, lng: -58.3816 },
      { name: 'Bob Johnson', role: 'Technician', lat: -23.5505, lng: -46.6333 },
      { name: 'Charlie Brown', role: 'Sales', lat: -12.0464, lng: -77.0428 },
    ];

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-47.9292, -15.7801],
      zoom: 4,
    });

    let markers = [];

    function addMarkers(data) {
      markers.forEach(({ marker }) => marker.remove());
      markers = [];
      data.forEach((emp) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
        el.style.width = '30px';
        el.style.height = '40px';
        el.style.backgroundSize = '100%';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([emp.lng, emp.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${emp.name}</strong><br/>Role: ${emp.role}`))
          .addTo(map);

        markers.push({ marker, data: emp });
      });
    }

    addMarkers(employees);

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = employees.filter((emp) => emp.name.toLowerCase().includes(query));
      addMarkers(filtered);
    });