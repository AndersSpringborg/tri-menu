import {
  Allergies,
  FoodType,
  getAllergies,
  getFoodtype,
  getMenuFromMadklubben,
} from "~/server/services/menuService";

test("parses menu", async () => {
  //'Klassiske boller i karry med æbler \n' +
  //         'Kød: Svinekød \n' +
  //         'Allergener: Laktose og gluten',

  const menu = await getMenuFromMadklubben(new Date(2024, 0, 17));
  console.log(menu);
  expect(menu).toContainEqual({
    items: "Klassiske boller i karry med æbler",
    label: FoodType.Pork,
    allergies: [Allergies.Lactose, Allergies.Gluten],
  });
}, 10000);

test("parse allergens", async () => {
  // Arrange
  const menuline = "Allergener: Laktose og gluten";

  // Act
  const sut = getAllergies(menuline);

  // Assert
  expect(sut).toEqual([Allergies.Lactose, Allergies.Gluten]);
});

test("parse allergens with no allergens", async () => {
  // Arrange
  const menuline = "Allergener: ";

  // Act
  const sut = getAllergies(menuline);

  // Assert
  expect(sut).toEqual([]);
});

test("parse food type", async () => {
  // Arrange
  const menuline = "Klassiske boller i karry med æbler";

  // Act
  const sut = getFoodtype(menuline);

  // Assert
  expect(sut).toEqual(FoodType.Unknown);
});

test("parse food type", async () => {
  // Arrange
  const menuline = "Kød: Svinekød \n";

  // Act
  const sut = getFoodtype(menuline);

  // Assert
  expect(sut).toEqual(FoodType.Pork);
});
