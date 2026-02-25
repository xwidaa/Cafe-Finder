# ☕ Cafe Finder

A clean, aesthetic, and functional web application that helps users discover nearby cafes. The app uses real-time geolocation to find coffee shops within a 1.5km radius and calculates the exact distance to each location.

---

## 🌟 Features

* **Real-Time Geolocation:** Detects your current coordinates using the browser's `navigator.geolocation` API.
* **Smart Caching:** Saves your location in `localStorage` for 10 minutes to reduce redundant API calls and improve performance.
* **Live Data:** Fetches up-to-date cafe information directly from OpenStreetMap via the **Overpass API**.
* **Distance Calculation:** Uses the **Haversine Formula** to calculate the distance between you and the cafe in kilometers or meters.
* **Distance Sorting:** Automatically sorts cafes from the nearest to the farthest.
* **Personal Favorites:** Save your favorite cafes to a personalized list that persists even after refreshing the page.
* **Pink Aesthetic Theme:** A modern, soft-pink user interface designed for a pleasant user experience.

## 🛠️ Tech Stack

* **HTML5 & CSS3:** Modern layout with CSS Grid and a custom "Pastel Pink" color palette.
* **Vanilla JavaScript (ES6+):** All logic is written in pure JavaScript, including asynchronous API handling (`async/await`).
* **Overpass API (OpenStreetMap):** Used for querying geographical data.
* **LocalStorage API:** Used for persistent data storage of user location and saved cafes.

## 🚀 Getting Started

### Prerequisites
You only need a modern web browser (Chrome, Firefox, Edge, etc.).

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/xwidaa/cafe-finder.git](https://github.com/xwidaa/cafe-finder.git)
    ```
2.  **Navigate to the folder:**
    ```bash
    cd cafe-finder
    ```
3.  **Launch:**
    Open `index.html` in your browser.

## 📖 How it Works

The app calculates the distance between two points on a sphere using this formula:

a = sin²(Δlat / 2) + cos(lat1) · cos(lat2) · sin²(Δlon / 2)
c = 2 · atan2(√a, √(1 − a))
distance = R · c

(Where $R$ is the Earth's radius, 6371 km).

