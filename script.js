let searchResults = [];
let currentBatch = 0; 
const size = 5;
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
          <button id="homefav"  aria-label="favorite"></button>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      

        <a href="#" class="see-more" data-id="${cocktail.idDrink}">See More</a>
    `;
    document.querySelector(".see-more").addEventListener("click",()=>{
        showPage("details-content");
        console.log("clicked ")
                })
console.log(cocktail)
    favHandel(cocktail);

};




//home
    const loadHomePage = () => {
        content.innerHTML = `
            <h1>Random cocktail</h1>
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

    <button id="load-more-btn" style="display: none;">Load More</button>
        `;

        document.getElementById('load-more-btn').addEventListener('click', renderNextBatch);
    
        
    };




    const loadSearchPage = async () => {
        const { categories, ingredients , glass} = await loadCategoriesAndIngredients();
        renderSearchPage(categories, ingredients ,glass);
    };



    const displaySearchResults = (drinks, categoryFilter, ingredientFilter, glassFilter) => {
        const filteredResults = drinks.filter(drink =>
            (!categoryFilter || drink.strCategory === categoryFilter) &&
            (!ingredientFilter || drink.strIngredient1 === ingredientFilter) &&
            (!glassFilter || drink.strGlass === glassFilter)
       
     
        );
     
        searchResults = filteredResults;

    //    searchResults.forEach(c=> favHandel(c))
        console.log(searchResults);
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        console.log(favorites);
        
        const updated = searchResults.map(res=>res.idDrink);
        const favs = favorites.map(fav=>fav.idDrink);
    
        console.log(updated);
        console.log(favs);

       const fav = document.querySelectorAll("#fav");
       fav.forEach(element => {
        element.setAttribute("class","fav")
        
       });


       const f  = document.querySelectorAll("#fav");
       f.forEach(e => e.classList.add("fav"));
       

for(let i=0;i<favs.length;i++)
{

    if(updated[i]==favs[i])
    {

        console.log("found ",searchResults[i]);

        // favHandel(searchResults[i])
    
    }
}

              

                   
        // JSON.parse(localStorage.getItem("favorites")).some(c=> c.idDrink==11129)
    //    console.log(getFavCocktail.some(fav=>fav.idDrink ==11129)); 


   




    
        renderNextBatch();

    }
    
    const renderNextBatch = () => {
        const resultsContainer = document.getElementById('search-results');
    
        
        const nextBatch = searchResults.slice(currentBatch * size, (currentBatch + 1) * size);
    
        resultsContainer.innerHTML += nextBatch.map(drink => `
            <div class="cocktail-card">
                <li>
                <button id="sfav"  aria-label="favorite" data-id="${drink.idDrink}" class=""></button>
                <a href="#" id="see-more" class="see-more" data-id="${drink.idDrink}">${drink.strDrink}</a>
                    <img class="cocktail-img" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                   
                </li>
            </div>
        `).join('');

        let res = JSON.parse(localStorage.getItem("favorites"));
        let fav = document.querySelectorAll("#sfav");
        fav.forEach(f=> {
            f.classList.add("fav");
            
       console.log( f.getAttribute("data-id"));

       for(let i=0;i<res.length;i++)
       {

     

       if(f.getAttribute("data-id")==res[i].idDrink)
       {
        f.classList.remove("fav");
        f.classList.add("fav-exist");
        
       
       }
    }
console.log("handled")
        })

        
        


        // resultsContainer.querySelectorAll(".see-more").addEventListener("click",()=>{
        //     showPage("details-content");
        //     console.log("clicked ")
        //             });
        currentBatch++;
    
        if (currentBatch * size >= searchResults.length) {
            document.getElementById('load-more-btn').style.display = 'none';
        }

        
      window.addEventListener("click",(e)=>{
        console.log(e.target.id);
        console.log("here ",e.target.className);
        if(e.target.id=="see-more")
        {
          
         showPage("details-content");
                    
                    // detailsContent.style.display = "block"
                         console.log("u clicked")  
           
        }
       


    })
  };

  

  
        
    document.addEventListener('submit', async (e) => {
        if (e.target.id === 'search-form') {
            e.preventDefault();
    
            const searchInput = document.getElementById('search-input').value;
            const categoryValue = document.getElementById('category').value;
            const ingredientValue = document.getElementById('ingredient').value;
            const glassValue = document.getElementById('glass').value;
    
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`);
            const data = await response.json();
    
            if (data.drinks) {
                currentBatch = 0; // Reset batch counter
                document.getElementById('search-results').innerHTML = ''; // Clear previous results
                document.getElementById('load-more-btn').style.display = 'block'; // Show the button
    
                displaySearchResults(data.drinks, categoryValue, ingredientValue, glassValue);

            } else {
                document.getElementById('search-results').innerHTML = '<li>No results found</li>';
                document.getElementById('load-more-btn').style.display = 'none';
            }


        }
    });
    

  
    //----
    //fav
    const loadFavoritesPage = () => {
       

       
        const favContent = document.getElementById("fav-content"); 
    
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
            <button id="fav"  aria-label="favorite" class="fav-exist" data-id="${fav.idDrink}"></button>

            <img id="fav-img" src="${fav.strDrinkThumb}"></img>
        <a href="#" id="see-more" class="see-more" data-id="${fav.idDrink}">see more</a>
            </div>
            `;
           

            favoritesList.appendChild(listItem);
            listItem.querySelector(".fav-exist"||"fav").addEventListener("click", (e) => {
                
const cocktailId = e.target.getAttribute("data-id");
if(e.target.className=="fav")
{
    saveToFavorites(fav);
    e.target.classList.add("fav-exist");
    e.target.classList.remove("fav");
    console.log("saved");
    
}
else if(e.target.className=="fav-exist")
{
    removeFromFavorites(cocktailId);
    console.log("removed ");
    e.target.classList.add("fav");
    e.target.classList.remove("fav-exist");
}



              console.log("here the value of the button > ",e.target);

                // removeFromFavorites(cocktailId); 
                // listItem.innerHTML ="";

            })


        });
       
        

        console.log("There are", favs.length, "favorites.");
        

        
      window.addEventListener("click",(e)=>{
        console.log(e.target.id);
        if(e.target.id=="see-more")
        {
          
         showPage("details-content");
                    
           
        }
              
    
    
      })
;    
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
             <button id="fav"  aria-label="favorite" class=""></button>
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

       
        // document.getElementById("back-button").addEventListener("click",()=>{
         
        //             })
         
       
      
        
    }
    if(e.target.id=="back-button")
        {
         
            

            pageHistory.pop();
            const prevPage = pageHistory.pop();
            showPage(prevPage);
        }

    

});


const removeFromFavorites =(cocktailId)=>{

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const cocktailIndex = favorites.findIndex(fav=>fav.idDrink===cocktailId);
   
    if(cocktailIndex!==-1)
    {
        favorites.splice(cocktailIndex,1);

        localStorage.setItem('favorites', JSON.stringify(favorites));
   
console.log(cocktailId," has been removed from favs" );
    }

    else
    {
        console.log(cocktailId," is not in favs")
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
        document.getElementById("homefav").classList.add("fav")
        document.getElementById("homefav").classList.remove("fav-exist")
       
       console.log(cocktail.strDrink ,"    not exist in favorites")


    }
    else
    {
        console.log(cocktail.strDrink," is already added");
        document.getElementById("homefav").classList.add("fav-exist");
        document.getElementById("homefav").classList.remove("fav");
    
    }
    document.getElementById("homefav").addEventListener('click', (e) => {   
        console.log(e.target.className);
        if(e.target.className=="fav")
        {

            saveToFavorites(cocktail);
            document.getElementById("homefav").classList.add("fav-exist") 
            document.getElementById("homefav").classList.remove("fav")   
            console.log(cocktail.strDrink," added to the favorties  class : fav-exists")
        }
        else if(e.target.className=="fav-exist")
        {
            removeFromFavorites(cocktail.idDrink)
            document.getElementById("homefav").classList.add("fav") 
            document.getElementById("homefav").classList.remove("fav-exist") 
            console.log(cocktail.strDrink," removed from the favorties  class : fav")
  
       
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
        for(let i =0;i<pageHistory.length;i++)
            {
                if(pageHistory[i]==pageHistory[i+1])
                    pageHistory.splice(i,1);
                
            }
        console.log("on  content : ",pageID);
    console.log("on  links : ",pageID.id||"not link ..thats details content");
    console.log("page history   ",currentPage);
    
   
    

}    


window.addEventListener("click",e=>{
    
    if(e.target.id=="sfav")
    {
        const cocktailId = e.target.getAttribute("data-id");
        const res = searchResults.filter(c=>c.idDrink == cocktailId);
        if(e.target.classList.contains("fav"))
        {
           
        console.log(searchResults);
        // localStorage.setItem("favorites",JSON.stringify(res));
        saveToFavorites(res[0]);
        e.target.classList.add("fav-exist");
         e.target.classList.remove("fav");
        console.log("saved");
        
            
        }
         else if(e.target.classList.contains("fav-exist"))
        {
           e.target.classList.remove("fav-exist");
         e.target.classList.add("fav")
            console.log(e.target.getAttribute("data-id"));
            removeFromFavorites(e.target.getAttribute("data-id"))
        console.log("removed");
        
        }
    }


   
})
 



//to do 19 dec
//do back button in favorites and do search also
//to fix
// js
//fav in main after go to favorties details then to main 

//(done) if fav already added
//(done) ||remove button from 
//() create fav in details page
//(done) prev button 
// (done) && make content hide and active to every page 


// (done) sesrch input is required


//pagination

// css
//css loader
