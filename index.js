// Load API key directly from .env
fetch('.env')
    .then(res => res.text())
    .then(text => {
        const line = text.split('\n').find(l => l.startsWith('NASA_API_KEY='))
        const API_KEY = line.split('=')[1].trim()

        // --- THEME TOGGLE LOGIC ---
        const themeSwitch = document.getElementById('theme-switch');
        const themeLabel = document.getElementById('theme-label');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeSwitch.checked = true;
            themeLabel.innerText = "Light Mode";
        }

        themeSwitch.addEventListener('change', () => {
            if (themeSwitch.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                themeLabel.innerText = "Light Mode";
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                themeLabel.innerText = "Dark Mode";
            }
        });

        // --- SINGLE DATE FETCH LOGIC ---
        document.getElementById('btn').addEventListener('click', async () => {
            let selectedDate = document.getElementById('date-picker').value 
            if (!selectedDate) {
                alert("Please select a date first");
                return;
            }
            let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`
            document.getElementById('loading').classList.remove('hidden')
            document.getElementById('content').classList.add('hidden')
            document.getElementById('error').classList.add('hidden')

            try{
                let response = await fetch(url)
                let data = await response.json()

                if (data.code && data.code !== 200) {
                    throw new Error(data.msg);
                }

                document.getElementById('loading').classList.add('hidden')
                document.getElementById('content').classList.remove('hidden')

                document.getElementById('apod-title').innerText = data.title;
                
                // Better handling for videos vs images
                if (data.media_type === "video") {
                    document.getElementById('media-container').innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
                } else {
                    document.getElementById('media-container').innerHTML = `<img src="${data.url}" alt="${data.title}">`;
                }
                
                document.getElementById('apod-explanation').innerText = data.explanation;

            }
            catch(error){
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error').classList.remove('hidden');
                document.getElementById('error-text').innerText = "Something went wrong loading the image."
            }
        })

        // --- GALLERY LOGIC USING HIGHER ORDER FUNCTIONS ---
        let galleryData = [];

        const galleryContainer = document.getElementById('gallery-container');
        const galleryLoading = document.getElementById('gallery-loading');
        
        const searchInput = document.getElementById('search-input');
        const filterSelect = document.getElementById('filter-select');
        const sortSelect = document.getElementById('sort-select');

        // Render function (uses Array.map and Array.join)
        const renderGallery = (dataArray) => {
            galleryContainer.innerHTML = '';
            
            if (dataArray.length === 0) {
                galleryContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--subtext-color);">No astronomical objects found matching your criteria.</p>`;
                return;
            }

            // Using map to transform the data array into an array of HTML strings
            const cardsHTML = dataArray.map(item => {
                const isVideo = item.media_type === 'video';
                const mediaHTML = isVideo 
                    ? `<iframe class="gallery-media" src="${item.url}" frameborder="0" allowfullscreen loading="lazy"></iframe>`
                    : `<img class="gallery-media" src="${item.url}" alt="${item.title}" loading="lazy">`;
                
                // Track interaction state with localStorage
                const isLiked = localStorage.getItem(`like_${item.date}`) === 'true';
                const likeClass = isLiked ? 'liked' : '';
                const likeIcon = isLiked ? '♥' : '♡';

                return `
                    <div class="gallery-card">
                        ${mediaHTML}
                        <div class="gallery-info">
                            <h3>${item.title}</h3>
                            <p class="date">${item.date}</p>
                            <div class="card-actions">
                                <button class="like-btn ${likeClass}" data-date="${item.date}" aria-label="Like Picture">${likeIcon}</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Join the HTML string array into a single string for injection
            galleryContainer.innerHTML = cardsHTML.join('');

            // Attach event listeners to all like buttons using Array.forEach
            const likeButtons = document.querySelectorAll('.like-btn');
            likeButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const dateId = e.target.getAttribute('data-date');
                    const currentlyLiked = e.target.classList.contains('liked');
                    
                    if (currentlyLiked) {
                        e.target.classList.remove('liked');
                        e.target.innerText = '♡';
                        localStorage.removeItem(`like_${dateId}`);
                    } else {
                        e.target.classList.add('liked');
                        e.target.innerText = '♥';
                        localStorage.setItem(`like_${dateId}`, 'true');
                    }
                });
            });
        };

        // Fetch multiple random APODs for the interactive gallery
        const loadGallery = async () => {
            let galleryUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=12`;
            try {
                let response = await fetch(galleryUrl);
                let data = await response.json();
                
                // If the request was successful, data should be an array
                if (Array.isArray(data)) {
                    // Filter out any anomalous items without a url (Array.filter)
                    galleryData = data.filter(item => item.url);
                    galleryLoading.classList.add('hidden');
                    galleryContainer.classList.remove('hidden');
                    updateGallery(); // Perform initial render
                } else {
                    galleryLoading.innerHTML = '<p id="error-text">Failed to load gallery. You might have exceeded the API rate limit.</p>';
                }
            } catch (err) {
                galleryLoading.innerHTML = '<p id="error-text">Failed to connect to NASA API.</p>';
            }
        };

        // Master update function combining Array filter and sort
        const updateGallery = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filterTerm = filterSelect.value;
            const sortTerm = sortSelect.value;

            // 1. Array.filter for Searching (by keyword)
            let processedData = galleryData.filter(item => {
                const titleMatch = item.title && item.title.toLowerCase().includes(searchTerm);
                const explanationMatch = item.explanation && item.explanation.toLowerCase().includes(searchTerm);
                return titleMatch || explanationMatch;
            });

            // 2. Array.filter for Filtering (by specific criteria)
            processedData = processedData.filter(item => {
                if (filterTerm === 'all') return true;
                return item.media_type === filterTerm;
            });

            // 3. Array.sort for Sorting 
            processedData.sort((a, b) => {
                if (sortTerm === 'date-desc') {
                    return new Date(b.date) - new Date(a.date);
                } else if (sortTerm === 'date-asc') {
                    return new Date(a.date) - new Date(b.date);
                } else if (sortTerm === 'title-asc') {
                    return a.title.localeCompare(b.title);
                } else if (sortTerm === 'title-desc') {
                    return b.title.localeCompare(a.title);
                }
                return 0; // Default order
            });

            // Render the final processed Array
            renderGallery(processedData);
        };

        // Standard Event listeners for interacting with the gallery controls
        searchInput.addEventListener('input', updateGallery);
        filterSelect.addEventListener('change', updateGallery);
        sortSelect.addEventListener('change', updateGallery);

        // Fetch gallery immediately on page load
        loadGallery();
    })
    .catch(err => {
        console.error("Error loading configuration:", err);
        alert("Make sure you have a .env file with NASA_API_KEY=");
    });
