// Load API key directly from .env
fetch('.env')
    .then(res => res.text())
    .then(text => {
        const line = text.split('\n').find(l => l.startsWith('NASA_API_KEY='))
        const API_KEY = line.split('=')[1].trim()

        document.getElementById('btn').addEventListener('click', async () => {
            let selectedDate = document.getElementById('date-picker').value 
            let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${selectedDate}`
            document.getElementById('loading').classList.remove('hidden')
            document.getElementById('content').classList.add('hidden')
            document.getElementById('error').classList.add('hidden')

            try{
                let response = await fetch(url)
                let data = await response.json()

                document.getElementById('loading').classList.add('hidden')
                document.getElementById('content').classList.remove('hidden')


                document.getElementById('apod-title').innertext = data.title;
                document.getElementById('media-container').innerHTML = `<img src="${data.url}" alt="${data.title}">`
                document.getElementById('apod-explanation').innerHTML = data.explanation;

            }
            catch(error){
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error').classList.remove('hidden');
                document.getElementById('error-text').innerText = "something went wrong"

            }
        })
    })
