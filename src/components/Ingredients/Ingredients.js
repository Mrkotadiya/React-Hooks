import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    fetch(
      "https://react-hooks-update-889d9-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => {
      return res.json();
    }).then(resData=>{
      setUserIngredients((prevIngredients) => [
        ...prevIngredients,
        { id:resData.name, ...ingredient },
      ]);
    });
  };

  // https://react-hooks-update-889d9-default-rtdb.firebaseio.com

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
