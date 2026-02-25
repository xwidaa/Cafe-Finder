

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}


function getLocation() {
  console.log("getLocation triggered");

  const cache = JSON.parse(localStorage.getItem("cachedLocation") || "{}");
  const now = Date.now();

  if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
    useLocation(cache.lat, cache.lng);
  } else {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        localStorage.setItem(
          "cachedLocation",
          JSON.stringify({ lat, lng, timestamp: now })
        );

        useLocation(lat, lng);
      },
      () => alert("Location access denied or unavailable.")
    );
  }
}



async function useLocation(lat, lng) {
  console.log("Using location:", lat, lng);

  const query = `
    [out:json];
    node
      ["amenity"="cafe"]
      (around:1500,${lat},${lng});
    out;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    });

    const data = await response.json();
    console.log("OSM response:", data);

    if (!data.elements || data.elements.length === 0) {
      alert("No cafes found nearby.");
      return;
    }

    displayCards(data.elements);

  } catch (e) {
    console.error("Error fetching OSM:", e);
    alert("Error fetching cafes.");
  }
}



function displayCards(cafes) {
  const container = document.querySelector(".cards");
  container.innerHTML = "";

  const cache = JSON.parse(localStorage.getItem("cachedLocation") || "{}");
  const userLat = cache.lat;
  const userLng = cache.lng;

  if (!userLat || !userLng) {
    container.innerHTML = `
      <div class="empty-message">
        Location not available 😢
      </div>
    `;
    return;
  }

  
  cafes.sort((a, b) => {
    const distA = getDistance(userLat, userLng, a.lat, a.lon);
    const distB = getDistance(userLat, userLng, b.lat, b.lon);
    return distA - distB;
  });

  cafes.forEach((cafe) => {

    const name = cafe.tags?.name || "Unnamed Cafe";
    const distance = getDistance(userLat, userLng, cafe.lat, cafe.lon);

    const distanceText = distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(2)} km`;

    const cafeData = {
      name: name,
      place_id: cafe.id,
      lat: cafe.lat,
      lon: cafe.lon
    };

    const card = document.createElement("div");
    card.className = "location-card";

    card.innerHTML = `
      <h3>${name}</h3>

      <div class="distance">
        📍 <span>${distanceText} away</span>
      </div>

      <div class="button-group">
        <button class="save-btn">Save 💖</button>

        <a 
          href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${cafe.lat},${cafe.lon}"
          target="_blank"
          class="direction-btn"
        >
          Directions 🗺️
        </a>
      </div>
    `;

    
    card.querySelector(".save-btn").addEventListener("click", () => {
      saveCafe(cafeData);
    });

    container.appendChild(card);
  });
}





function saveCafe(cafe) {
  let saved = JSON.parse(localStorage.getItem("savedCafes") || "[]");

  if (!saved.find((c) => c.place_id === cafe.place_id)) {
    saved.push(cafe);
    localStorage.setItem("savedCafes", JSON.stringify(saved));
    alert(`${cafe.name} saved!`);
  } else {
    alert(`${cafe.name} is already saved.`);
  }
}



function showSaved() {
  const container = document.querySelector(".cards");
  container.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem("savedCafes") || "[]");
  const cache = JSON.parse(localStorage.getItem("cachedLocation") || "{}");
  const userLat = cache.lat;
  const userLng = cache.lng;

  if (saved.length === 0) {
    container.innerHTML = `
      <div class="empty-message">
        No saved cafes yet 😢
      </div>
    `;
    return;
  }

  
  saved.sort((a, b) => {
    const distA = getDistance(userLat, userLng, a.lat, a.lon);
    const distB = getDistance(userLat, userLng, b.lat, b.lon);
    return distA - distB;
  });

  saved.forEach((cafe) => {

    const distance = getDistance(userLat, userLng, cafe.lat, cafe.lon);

    const distanceText = distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(2)} km`;

    const card = document.createElement("div");
    card.className = "location-card";

    card.innerHTML = `
      <h3>${cafe.name}</h3>

      <div class="distance">
        📍 <span>${distanceText} away</span>
      </div>

      <div class="button-group">
        <button class="remove-btn">Remove ❌</button>

        <a 
          href="https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${cafe.lat},${cafe.lon}"
          target="_blank"
          class="direction-btn"
        >
          Directions 🗺️
        </a>
      </div>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeCafe(cafe.place_id);
    });

    container.appendChild(card);
  });
}


function removeCafe(placeId) {
  let saved = JSON.parse(localStorage.getItem("savedCafes") || "[]");
  saved = saved.filter(cafe => cafe.place_id !== placeId);
  localStorage.setItem("savedCafes", JSON.stringify(saved));
  showSaved();
}

