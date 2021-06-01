const search = document.getElementById('search-input')
const submit = document.getElementById('submit')
const shuffle = document.getElementById('shuffle')
const resultsText = document.getElementById('result-heading')
const contentContainer = document.getElementById('content-container')
const single_MealEl = document.getElementById('single-meal')

//Functions

//Get JSON data
async function getJSON(url) {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch(err) {
    console.error(err)
  }
}

//Search meal and fetch from API
async function searchMeal(e) {
  e.preventDefault()
  //Clear single meal
  single_MealEl.innerHTML = ''

  // Get search term
  const term = search.value

  //Check for empty
  if(!term) return;

  const data = await getJSON(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)

  resultsText.innerText = `Search results for '${term}' :`

  if(data.meals === null) {
    resultsText.innerText = `There are no search results for '${term}'`
  } else {
    contentContainer.innerHTML = data.meals.map(meal => `
    <div class="meal">
      <img src = '${meal.strMealThumb}' alt="${meal.strMeal}"/>
      <div class="meal-info" data-mealID="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
      </div>
    </div>
    `).join('')
  }
  //Clear search text
  search.value = ''
}

//Clear DOM elements
function clearDOM() {
resultsText.innerHTML = ''
contentContainer.innerHTML = ''
}

//Get meal by ID
async function getMealById(mealID) {
const data = await getJSON(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
const meal = data.meals[0]

clearDOM()
addMealToDOM(meal)
}

//Get random meal
async function getRandomMeal() {
  const data = await getJSON('https://www.themealdb.com/api/json/v1/1/random.php')
  const meal = data.meals[0]

  clearDOM()
  addMealToDOM(meal)
}


//Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = []

  for(let i = 1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
    break;
    }
  }
  single_MealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
    <img src =${meal.strMealThumb} alt=${meal.strMeal}/>
    <div class ="single-meal-info">
      ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>Origin: ${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
    <h2>Ingredients</h2>
    <ul>
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
    </div>
  </div>
  
  `
}


//Event Listeners
submit.addEventListener('submit', searchMeal)

contentContainer.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if(item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false
    }
  })

  if(!mealInfo) return;

  const mealId = mealInfo.getAttribute('data-mealid')
  getMealById(mealId)
})

shuffle.addEventListener('click', getRandomMeal)

