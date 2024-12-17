document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const homeLink = document.getElementById('home-link');
    const searchLink = document.getElementById('search-link');
    const favoritesLink = document.getElementById('favorites-link');




//random ct
const fetchRandomCocktail = async () => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    const cocktail = data.drinks[0];




    document.getElementById('random-cocktail').innerHTML = `
        <h2>${cocktail.strDrink}</h2>
          <button id="fav"  aria-label="favorite"></button>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      

        <a href="#" class="see-more" data-id="${cocktail.idDrink}">See More</a>
    `;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(fav=>fav.idDrink===cocktail.idDrink);
    if(!exists)
    {
        document.getElementById("fav").classList.remove("fav-exist")
        document.getElementById("fav").classList.add("fav")
        
       console.log("this cocktail not exist in favorites")
    }
    else
    {
        console.log(cocktail.strDrink," is already added");
        document.getElementById("fav").classList.add("fav-exist")
        document.getElementById("fav").classList.remove("fav")
        
    }
    document.getElementById("fav").addEventListener('click', (e) => {   
        console.log(e.target.className);
        if(e.target.className=="fav")
        {

            saveToFavorites(cocktail);
            document.getElementById("fav").classList.add("fav-exist") 
            document.getElementById("fav").classList.remove("fav")   
        }
        else
        {
            removeFromFavorites(cocktail)
            document.getElementById("fav").classList.add("fav") 
            document.getElementById("fav").classList.remove("fav-exist")   
       
        }
        
    });

};


//home
    const loadHomePage = () => {
        content.innerHTML = `
            <h1>Welcome to the Cocktail website</h1>
            <div id="random-cocktail">
            </div>
            <button id="new-cocktail-btn">Get New Cocktail</button>
        `;
        fetchRandomCocktail();
        document.getElementById("new-cocktail-btn").addEventListener("click",()=>{
            fetchRandomCocktail();
        })

    };
    


    //search

    //load Categories And Ingredients
    const loadCategoriesAndIngredients = async () => {
        const categoryResponse = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list");
        const ingredientResponse = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list");
        const glassResponse = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list");
       
        
        const categories = await categoryResponse.json();
        const ingredients = await ingredientResponse.json();
        const glass = await glassResponse.json();

        return {
            categories: categories.drinks,
            ingredients: ingredients.drinks,
            glass: glass.drinks
        };
    }


//display search page 
    const renderSearchPage = (categories, ingredients,glass) => {
        const categoryOptions = categories.map(cat => `<option value="${cat.strCategory}">${cat.strCategory}</option>`).join('');
        const ingredientOptions = ingredients.map(ing => `<option value="${ing.strIngredient1}">${ing.strIngredient1}</option>`).join('');
        const glassOptions = glass.map(glas => `<option value="${glas.strGlass}">${glas.strGlass}</option>`).join('');


        content.innerHTML = `
            <h1>Search Cocktails</h1>
            <form id="search-form">
                <input type="text" id="search-input" placeholder="Enter cocktail name">
                <select id="category">
                    <option value=""> category</option>
                    ${categoryOptions}
                </select>
                <select id="ingredient">
                    <option value=""> ingredient</option>
                    ${ingredientOptions}
                </select>
                <select id="glass">
                    <option value=""> Glass type</option>
                    ${glassOptions}
                </select>
                <button type="submit">Search</button>
            </form>
            <ul id="search-results"></ul>
        `;
    };




    const loadSearchPage = async () => {
        const { categories, ingredients , glass} = await loadCategoriesAndIngredients();
        renderSearchPage(categories, ingredients ,glass);
    };




    const displaySearchResults = (drinks, categoryFilter,ingredientFilter,glassFilter) => {

        const resultsContainer = document.getElementById('search-results');
        
        resultsContainer.innerHTML = drinks
            .filter(drink =>
                ( !categoryFilter || drink.strCategory === categoryFilter) &&
            (!ingredientFilter || drink.strIngredient1 ===ingredientFilter)&&
        (!glassFilter||drink.strGlass===glassFilter))
            .map(drink => `
                <div class="cocktail-card">
                    <li>
                        <a href="#" class="see-more" data-id="${drink.idDrink}">${drink.strDrink}</a>
                        <img class="cocktail-img" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">

                        </li>
                      <button id="fav"> Save to favorit</button>
                    

                </div>
            `).join('') || '<li>No results found</li>';
    };

    document.addEventListener('submit', async (e) => {
        if (e.target.id === 'search-form') {
            e.preventDefault();
            document.getElementById('search-results').innerHTML ="";

            const searchInput = document.getElementById('search-input').value;
            const categoryValue = document.getElementById('category').value;
            const ingredientValue = document.getElementById('ingredient').value;
            const glassValue = document.getElementById('glass').value;

            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`);
            const data = await response.json();

            if (data.drinks) {
                displaySearchResults(data.drinks, categoryValue,ingredientValue,glassValue);
              
                
            } else {
                document.getElementById('search-results').innerHTML = '<li>No results found</li>';
            }
        }
    });

  
    //----
    //fav
    const loadFavoritesPage = () => {
        const content = document.getElementById("content"); // Ensure this element exists in your HTML
    
        const favs = JSON.parse(localStorage.getItem("favorites")) || [];
            console.log(favs);
            content.innerHTML = `
            <h1>Your Favorites</h1>
            <ul id="favorites-list"></ul>
        `;
            const favoritesList = document.getElementById("favorites-list");
        favs.forEach((fav) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
            <div class="cocktail-card">
            <p id="fav-name"> ${fav.strDrink}</p>
            <img id="fav-img" src="${fav.strDrinkThumb}"></img>
        <a href="#" class="see-more" data-id="${fav.idDrink}">see more</a>
            </div>
            `;
            favoritesList.appendChild(listItem);
        });
        console.log("There are", favs.length, "favorites.");
    };
    


    homeLink.addEventListener('click', () => loadHomePage());
    searchLink.addEventListener('click', () => loadSearchPage());
    favoritesLink.addEventListener('click', () => loadFavoritesPage());
    loadHomePage(); 
});


//details sidan

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('see-more')) {
        const cocktailId = e.target.getAttribute('data-id');
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`);
        const data = await response.json();
        const cocktail = data.drinks[0];

        document.getElementById('content').innerHTML = `
            <h1>${cocktail.strDrink}</h1>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <p><strong>Category:</strong> ${cocktail.strCategory}</p>
            <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
            <p><strong>Tags:</strong> ${cocktail.strTags || 'None'}</p>
            <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
            <h2>Ingredients:</h2>
            <ul>
                ${Object.keys(cocktail)
                    .filter(key => key.startsWith('strIngredient') && cocktail[key])
                    .map(key => `<li>${cocktail[key]} - ${cocktail[`strMeasure${key.slice(-1)}`] || ''}</li>`)
                    .join('')}
            </ul>
            <button id="back-button">Go Back</button>

        `;
    
        const goToPreviousPage = () => {
            window.location.hash ='#home'
            history.go(-1)
        };

       


        
        // Example button
        document.getElementById('back-button').addEventListener('click', goToPreviousPage);
        
    }

  

});


const removeFromFavorites =(cocktail)=>{

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const cocktailIndex = favorites.findIndex(fav=>fav.idDrink===cocktail.idDrink);
   
    if(cocktailIndex!==-1)
    {
        favorites.splice(cocktailIndex,1);

        localStorage.setItem('favorites', JSON.stringify(favorites));
   
console.log(cocktail.strDrink," has been removed from favs");
    }

    else
    {
        console.log(cocktail.strDrink," is not in favs")
    }
    

}




const saveToFavorites = (cocktail) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(fav=>fav.idDrink===cocktail.idDrink);
    if(!exists)
    {
        console.log("cocktail added")
        favorites.push(cocktail);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
    
    }
    else
    {
        console.log(cocktail.strDrink," is already added");
       
    }
   };

const loadFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites')) || [];
};



//to fix

//if fav already added
//||remove button from 

//prev button 
//|| make content hide and active to every page
// sesrch input is required
// || to improve if user select ingredient or one of selection it gets every matching of cocktails with thats query



//css loader
