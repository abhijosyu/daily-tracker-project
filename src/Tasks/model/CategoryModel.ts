/**
 * represents a model for the category. A category helps define
 * what type of task a task is.
 */
export default class CategoryModel {
  categoriesMap: Map<string, string> = new Map<string, string>(); // the categories (not in order) but to keep track of everything
  categoriesList: string[][]; // sorted list of the categories from the map

  /**
   * represents the constructor for the category model. there is a
   * default set of categories provided.
   */
  constructor() {
    this.categoriesMap = new Map<string, string>([
      ["Work", "Work"],
      ["Personal", "Personal"],
      ["Health", "Health"],
      ["Education", "Education"],
      ["Finance", "Finance"],
      ["Other", "Other"],
    ]);
    this.categoriesList = [
      ["Work", "Work"],
      ["Personal", "Personal"],
      ["Health", "Health"],
      ["Education", "Education"],
      ["Finance", "Finance"],
      ["Other", "Other"],
    ];
  }

  /**
   * adds a category to the category map.
   * @param key the key of the category
   * @param value the value of the category
   * @throws if there is already a category with that name
   */
  addCategory(key: string, value: string): void {
    if (!this.categoriesMap.has(key)) {
      this.categoriesMap.set(key, value);
      this.categoriesList = [...this.categoriesList, [key, value]];
      console.log(
        "category list in the category model: " + this.categoriesList
      );
    } else {
      throw new Error(`Category ${key} Already Exists.`);
    }
  }

  /**
   * removes a category from the category map.
   * @param cat the category to remove.
   * @throws when there is only one category remaining or if the given category doesnt exist
   */
  deleteCategory(cat: string): void {
    if (this.categoriesMap.has(cat)) {
      if (this.categoriesMap.size > 1) {
        this.categoriesMap.delete(cat);
        this.categoriesList = this.categoriesList.filter(
          ([key, _]) => key !== cat
        );
      } else {
        throw new Error("Cannot Delete All Categories");
      }
    } else {
      throw new Error(`Category With ${cat} Does Not Exist.`);
    }
  }

  /**
   * edits a category's name
   * @param original the original name
   * @param newName the old name
   * @throws if the newname = the original name or if the new name already exists as a different category
   */
  editCategory(original: string, newName: string) {
    if (newName == original || this.categoriesMap.has(newName)) {
      throw new Error(
        "Edits Did Not Change Anything And/Or Name Already Exists"
      );
    } else {
      const newMap = new Map<string, string>();

      for (const [key, value] of this.categoriesMap.entries()) {
        if (key == original) {
          newMap.set(newName, newName);
        } else {
          newMap.set(key, value);
        }
      }
      this.categoriesList = this.categoriesList.map(([key, value]) =>
        key === original ? [newName, newName] : [key, value]
      );
      this.categoriesMap = newMap;
    }
  }

  /**
   * swaps 2 categories positions with eachother based on if
   * the category is going up or down
   * @param category the name of the category to swap
   * @param swapUp boolean to determine whether to swap up or down
   * @throws if the category is set to swap up and its the first category,
   *  or if category is set to swap down and its last category
   */
  swapItems(category: string, swapUp: boolean): void {
    const categories = Array.from(this.categoriesList);
    const index = categories.findIndex(([key]) => key === category);
    if (swapUp) {
      if (index >= 1) {
        [categories[index], categories[index - 1]] = [
          categories[index - 1],
          categories[index],
        ];
      } else {
        throw new Error("Cannot move the category further up");
      }
    } else {
      if (index + 1 < this.categoriesList.length) {
        [categories[index], categories[index + 1]] = [
          categories[index + 1],
          categories[index],
        ];
      } else {
        throw new Error("Cannot move the category further down");
      }
    }
    this.categoriesList = categories;
  }
}
