// buttons const
const increaseBtns = document.querySelectorAll(".increaseBtn");
const decreaseBtns = document.querySelectorAll(".decreaseBtn");
const quantities = document.querySelectorAll(".quantity");

// Event listener to increase/decrease orders
increaseBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    quantities[index].innerText = parseInt(quantities[index].innerText) + 1;
  });
});
a
decreaseBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (parseInt(quantities[index].innerText) > 0) {
      quantities[index].innerText = parseInt(quantities[index].innerText) - 1;
    }
  });
});

// Function to fetch the burguer object from the burguer routes
const getBurger = async (burgerId) => {
  try {
    const response = await fetch(`/api/burger/${burgerId}`);
    if (!response.ok) {
      throw new Error('Failed to get burger');
    }
    const burger = await response.json();
    return burger;
  } catch (err) {
    console.error(err);
  }
};

// Function to know the total order of burgers into an array
const getBurgersOrdered = () => {
  const burgersOrdered = [];
  quantities.forEach((quantity, index) => {
    const numOrdered = parseInt(quantity.innerText);
    if (numOrdered > 0) {
      const burger = hamburgers[index];
      burgersOrdered.push({ ...burger, quantity: numOrdered, id: index + 1 });
    }
  });
  return burgersOrdered;
};


// Function to update the ingredient stock
const updateStock = async (burgerId, ingredients) => {
  try {
    // Get the burger object by its ID
    const burgerObj = await getBurger(burgerId);

    const response = await fetch(`/api/ingredients/${burgerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredients)
    });
    if (!response.ok) {
      throw new Error('Failed to update ingredients stock');
    }
  } catch (err) {
    console.error(err);
  }
};

submitBtn.addEventListener("click", async () => {
  // Get the burgers ordered array
  const burgersOrdered = getBurgersOrdered();

  // Loop through each burger and update the ingredient stock
  for (const burger of burgersOrdered) {
    // Get the burger object by its ID
    const burgerObj = await getBurger(burger.id);

    // Multiply the quantity by the ingredients amounts to get the total ingredient usage
    const ingredients = {};
    for (const [key, value] of Object.entries(burgerObj.ingredients)) {
      ingredients[key] = value * burger.quantity;
    }

    // Update the ingredient stock for the burger
    await updateStock(burger.id, ingredients);
  }
});