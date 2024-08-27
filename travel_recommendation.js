async function fetchTravelRecommendations(keyword) {
    const keyword = document.getElementById('conditionInput').value.toLowerCase();
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        let recommendations = [];
        
        switch(keyword.toLowerCase()) {
            case 'beach':
                recommendations = data.beaches.slice(0, 2);
                break;
            case 'temple':
                recommendations = data.temples.slice(0, 2);
                break;
            case 'country':
                recommendations = data.countries.slice(0, 2).map(country => ({
                    id: country.id,
                    name: country.name,
                    imageUrl: country.cities[0].imageUrl,
                    description: `${country.name} features cities like ${country.cities.map(city => city.name).join(' and ')}.`
                }));
                break;
            default:
                throw new Error('Invalid keyword. Please use "beach", "temple", or "country".');
        }
        
        return recommendations.map(item => ({
            name: item.name,
            imageUrl: item.imageUrl,
            description: item.description
        }));
    } catch (error) {
        console.error('Error fetching travel recommendations:', error);
        return [];
    }
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    container.innerHTML = ''; // Clear previous results

    if (recommendations.length === 0) {
        container.innerHTML = '<p>No recommendations found. Please try a different keyword.</p>';
        return;
    }

    recommendations.forEach(item => {
        const recommendationDiv = document.createElement('div');
        recommendationDiv.className = 'recommendation';
        recommendationDiv.innerHTML = `
            <h2>${item.name}</h2>
            <img src="${item.imageUrl}" alt="${item.name}">
            <p>${item.description}</p>
        `;
        container.appendChild(recommendationDiv);
    });
}

document.getElementById('btnSearch').addEventListener('click', async () => {
    const keyword = document.getElementById('conditionInput').value.trim();
    if (keyword) {
        const recommendations = await fetchTravelRecommendations(keyword);
        displayRecommendations(recommendations);
    } else {
        alert('Please enter a keyword (beach, temple, or country)');
    }
});

document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('conditionInput').value = '';
    document.getElementById('recommendationsContainer').innerHTML = '';
});