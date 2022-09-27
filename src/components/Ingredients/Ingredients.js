import React, { useState, useEffect } from "react";

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
    /*End loading data */

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
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />

        {/* Need to add list here! */}
      </section>
    </div>
  );
};

export default Ingredients;
