let sBtn = document.querySelector('.searchBtn');
let searchInput = document.querySelector('#searchInput');
let iContainer = document.querySelector('.imgContainer');
let loadMore = document.querySelector('#lMore');
let loader = document.querySelector('#lBtn');

let ACCESS_TOKEN = 'SG-Z1lcXoX_hLyj65sx9fSq8jeaqeRfL1SDaWMqXoys';

let val;
let page = 1;


sBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    val = searchInput.value.trim();
    
    if (val === '') {
        alert('Please enter a keyword to search');
        return;
    }

    resetUI();
    loader.classList.remove('hide');
    loader.classList.add('loader');

    await fetchImages();
    
    loader.classList.remove('loader');
    loader.classList.add('hide');
});

async function fetchImages() {
    try {
        let response = await fetch(`https://api.unsplash.com/search/photos?query=${val}&client_id=${ACCESS_TOKEN}&page=${page}`);
        let result = await response.json();

        if (result.results.length < 1) {
            iContainer.innerHTML = `<h2>Sorry 😩, no images found for '${val}'</h2>`;
            hideLoadMore();
            return;
        }

        displayImages(result.results);
        updateLoadMore(result.results.length);
    } catch (error) {
        console.error("Error fetching images:", error);
        iContainer.innerHTML = `<h2>Something went wrong! Please try again.</h2>`;
    }
}

function displayImages(images) {
    images.forEach((data) => {
        let div = document.createElement('div');
        div.classList.add('imgCard');
        div.innerHTML = `
            <div class="userDetail">
                <img src="${data.user.profile_image.large}" alt="">
                <p>${data.user.name}</p>
            </div>
            <div class="mainImg">
                <img src="${data.urls.regular}" alt="">
            </div>
            <div class="desc">
                <p>${data.alt_description || 'No description available'}</p>
            </div>
            <div class="like">
                <p>❤️ ${data.likes}</p>
                <p><a href="${data.urls.full}" target="_blank">View Full Image</a></p>
            </div>`;
        iContainer.appendChild(div);
    });
}

loadMore.addEventListener('click', async () => {
    page++;
    toggleLoadMoreText(true);
    await fetchImages();
    toggleLoadMoreText(false);
});

function resetUI() {
    iContainer.innerHTML = '';
    page = 1;
    hideLoadMore();
}

function updateLoadMore(resultCount) {
    if (resultCount > 0) {
        loadMore.classList.remove('hide');
        loadMore.classList.add('lMore');
    }
    if (resultCount < 10) {
        loadMore.innerText = `No more images available for '${val}'`;
        loadMore.disabled = true;
    } else {
        loadMore.innerText = 'Load More';
        loadMore.disabled = false;
    }
}

function toggleLoadMoreText(loading) {
    loadMore.innerText = loading ? 'Loading... Please Wait...' : 'Load More';
}

function hideLoadMore() {
    loadMore.classList.add('hide');
    loadMore.classList.remove('lMore');
}
