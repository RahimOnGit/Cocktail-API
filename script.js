document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const searchContent = document.getElementById('search-content');
    const favContent = document.getElementById('fav-content');
    const detailsContent = document.getElementById('details-content');
const pages = document.querySelectorAll(".page")
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
    document.querySelector(".see-more").addEventListener("click",()=>{
        showPage("details-content");
        console.log("clicked ")
                })

    favHandel(cocktail);

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


        searchContent.innerHTML = `
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
                    

                </div>
            `).join('') || '<li>No results found</li>';
      
      
        // resultsContainer.forEach(result=>{
            
        // })
        
     window.addEventListener("click",(e)=>{
        if(e.target.className=="see-more")
        {
            showPage("details-content");
            console.log("clicked in search page");
                  
        }})
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
             data.drinks.forEach(drink => {
                favHandel(drink);
                
             });
                
            } else {
                document.getElementById('search-results').innerHTML = '<li>No results found</li>';
            }
        }
    });

  
    //----
    //fav
    const loadFavoritesPage = () => {
       
       

       
        const favContent = document.getElementById("fav-content"); // Ensure this element exists in your HTML
    
        const favs = JSON.parse(localStorage.getItem("favorites")) || [];
            console.log(favs);
            favContent.innerHTML = `
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
        <a href="#" id="see-more" class="see-more" data-id="${fav.idDrink}">see more</a>
            </div>
            `;
            // document.querySelector(".see-more").addEventListener("click",()=>{
            //     showPage("details-content");
            //     console.log("clicked ")
            //             })
            favoritesList.appendChild(listItem);
        
           

        });
       

        console.log("There are", favs.length, "favorites.");
      window.addEventListener("click",(e)=>{
        console.log(e.target.id)
        if(e.target.id=="see-more")
        {
          
                    showPage("details-content");
                    // detailsContent.style.display = "block"
                         console.log("u clicked")  
                
                
           
        }
      })

        // favs.forEach(fav => {
        //     favHandel(fav);
        // }); 


       
    };
    


    homeLink.addEventListener('click', () => {
        loadHomePage();
         showPage(content);
         content.style.display="block";
                  
        
        });
    searchLink.addEventListener('click', (e) => {
       e.preventDefault()
        loadSearchPage(); 
        showPage(searchContent);
        searchContent.style.display="block";
       
    })
    favoritesLink.addEventListener('click', () => {
    loadFavoritesPage(); 
    showPage(favContent)
    favContent.style.display="block";
   
});
    loadHomePage(); 



});


//details sidan

document.addEventListener('click', async (e) => {
  
  
  
    if (e.target.classList.contains('see-more')) {
        const cocktailId = e.target.getAttribute('data-id');
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`);
        const data = await response.json();
        const cocktail = data.drinks[0];

        document.getElementById('details-content').innerHTML = `
            <h1>${cocktail.strDrink}</h1>
             <button id="fav"  aria-label="favorite"></button>
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
        document.getElementById("back-button").addEventListener("click",()=>{
           pageHistory.pop();
           const prevPage = pageHistory.pop();
           showPage(prevPage);
                    })
         
        favHandel(cocktail);

       

       


        
        // Example button
        
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
        console.log(cocktail.strDrink,"cocktail added")
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


function favHandel(cocktail)
{


const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(fav=>fav.idDrink===cocktail.idDrink);
    if(!exists)
    {
        document.getElementById("fav").classList.remove("fav-exist")
        document.getElementById("fav").classList.add("fav")
        
       console.log(cocktail.strDrink ,"    not exist in favorites")
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

}

let currentPage = "content";
let pageHistory= [currentPage];
function showPage(pageID)
{
    const pages = document.querySelectorAll(".page")
    pages.forEach(page=>{
        page.style.display = page.id ==pageID ? "block" : "none";
       
    })


   
        pageHistory.push(pageID.id||pageID);
        console.log("on  content : ",pageID);
    console.log("on  links : ",pageID.id||"not link ..thats details content");
    console.log("page history   ",currentPage);
    
   
    

}    







//to do 19 dec
//do back button in favorites and do search also
//to fix
// js
//fav in main after go to favorties details then to main 

//(done) if fav already added
//(done) ||remove button from 
//(done) create fav in details page
//(done) prev button 
// (done) && make content hide and active to every page 


// sesrch input is required
// || to improve if user select ingredient or one of selection it gets every matching of cocktails with thats query


// css
//css loader
