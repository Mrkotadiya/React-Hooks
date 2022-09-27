import React, { useState, useEffect,useCallback} from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
    /*loading data */
  useEffect(() => {
  fetch(
    "https://react-hooks-update-889d9-default-rtdb.firebaseio.com/ingredients.json"
  )
    .then((res) => res.json())
    .then((resData) => {
      const loadedIngredients = [];
      for(const key in resData){
        loadedIngredients.push({
          id:key,
          title:resData[key].title,
          amount:resData[key].amount
        });
      }
      setUserIngredients(loadedIngredients);
    }) ;
  },[])
  

  useEffect(()=>{
    console.log('RENDERING INGREDIENTS',userIngredients);
  },[userIngredients])

  const filterIngredientsHandler= useCallback(filterIngredients =>{
    setUserIngredients(filterIngredients);
  },[]);

  /* fetching data*/  
  const addIngredientHandler = (ingredient) => {
    fetch(
      "https://react-hooks-update-889d9-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: resData.name, ...ingredient },
        ]);
      });
  };
    /*End feching data */
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />

        {/* Need to add list here! */}
      </section>
    </div>
  );
};

export default Ingredients;
