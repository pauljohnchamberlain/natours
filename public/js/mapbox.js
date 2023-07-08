/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicGF1bGpvaG5jaGFtYmVybGFpbiIsImEiOiJjbGhlY3N1aWYxam94M2NvNzZuZW41ZXNsIn0.l91U8VqxX61gkriC_8VuGg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pauljohnchamberlain/clhfg9180002k01pvfi7n0sgp',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
