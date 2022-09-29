import React, {  useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const httpReducer  = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw new Error("Should not be  reached!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState,dispatchHttp] = useReducer(httpReducer, {
     loading: false, 
     error: null 
    });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filterIngredientsHandler = useCallback((filterIngredients) => {
    // setUserIngredients(filterIngredients);
    dispatch({ type: "SET", ingredients: filterIngredients });
  }, []);

  /* fetching data*/
  const addIngredientHandler = (ingredient) => {
    dispatchHttp({type:'SEND'});
    fetch(
      "https://react-hooks-update-889d9-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        dispatchHttp({type:'RESPONSE'});
        return res.json();
      })
      .then((resData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: resData.name, ...ingredient },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: resData.name, ...ingredient },
        });
      });
  };
  /*End feching data */

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({type:'SEND'});
    fetch(
      `https://react-hooks-update-889d9-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        dispatchHttp({type:'RESPONSE'});
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        dispatchHttp({type:'ERROR',errorMessage:"Kuch na kuch to gadbad hee....! "});
        // setError("error.message => Somthing went wrong");
        // setIsLoading(false);
      });
  };

  const clearError = () => {
    dispatchHttp({type:"CLEAR"})
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
