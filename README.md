# 🌌 CosmoCanvas

> A NASA Mission Explorer web app that lets you discover what the universe looked like on any given day, including your birthday! Powered by NASA's Astronomy Picture of the Day (APOD) API.

---

## 🚀 Demo
*(Demo link coming soon)*

## ✨ Features
- **Daily Space Imagery**: Fetch and display real-time NASA APOD data.
- **Time Travel**: Use the interactive Date Picker to view historical images.
- **Detailed Information**: View the image along with its title, date, and an educational explanation.
- **High-Definition Experience**: Toggle between normal and HD resolutions.
- **Immersive Viewing**: Click on any image to open it in a fullscreen modal.
- **Rich Media Support**: Seamlessly handle both image and video content from NASA.
- **Reliable UI**: Built-in loading states and error handling for a smooth user experience.

## 📸 Screenshots
*(Screenshots coming soon)*

## 🛠️ Tech Stack
- **Frontend**: HTML5
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS
- **Data Source**: [NASA Open API](https://api.nasa.gov/)

## ⚙️ Installation & Setup Instructions

To run CosmoCanvas locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CosmoCanvas.git
   cd CosmoCanvas
   ```

2. **Get a NASA API Key:**
   - Head over to [https://api.nasa.gov/](https://api.nasa.gov/) and generate a free API key.

3. **Set up API Key:**
   - Open your JavaScript file (e.g., `script.js`).
   - Add your newly generated API key to the corresponding configuration variable.

4. **Run the application:**
   - Simply open `index.html` in your web browser.
   - Alternatively, use a local server like VS Code's "Live Server" extension for a better development experience.

## 📖 Usage Guide
- **Selecting a Date**: Click the calendar input to pick a date. The app will fetch the APOD for that specific day.
- **Viewing High Resolution**: Click the HD toggle button next to the image to load the high-resolution version.
- **Fullscreen Mode**: Click directly on the image to enter full-screen mode. Press `Esc` or click outside to exit.

## 📡 API Reference
This project relies on the **Astronomy Picture of the Day (APOD)** endpoint from NASA:
- **Endpoint**: `GET https://api.nasa.gov/planetary/apod`
- **Query Parameters used**:
  - `api_key`: Your unique NASA API key (required)
  - `date`: The precise date of the APOD image to retrieve (YYYY-MM-DD)

## 📁 Folder Structure (Basic)

```text
CosmoCanvas/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Future Improvements (Planned)
- [ ] **Favorites System**: Save your favorite space facts and images to `localStorage`.
- [ ] **"Surprise Me" Mode**: Add a random date generator for unexpected space discoveries.
- [ ] **Dark Space Theme**: Introduce a polished, deep-space UI with glowing neon elements.
- [ ] **Enhanced Responsiveness**: Refine the layout further for mobile and tablet perfection.
