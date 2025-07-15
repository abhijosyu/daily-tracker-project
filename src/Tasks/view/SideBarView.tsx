import React, { useState, useEffect, useRef } from "react";
import "./SideBarView.css";
import SideBarRadioButtons from "../../Component/SidebarRadioButtons";
import CheckboxItem from "../../Component/CheckboxItem";
import AddButton from "../../Component/AddButton";
import EditButton from "../../Component/EditButton";
import SideBarSubmitCancelButton from "../../Component/SideBarSubmitCancelButton";
import SideBarInput from "../../Component/SideBarInput";
import SelectionList from "../../Component/SelectionList";

/**
 * represents the props needed for the side bar
 */
interface SideBarProps {
  onTypeChange?: (categories: string[], progress: string[]) => void;
  onAddType: (category: string, type: number, color: string) => void;
  onDeleteType: (category: string, type: number) => void;
  onEditType: (
    originalItem: string,
    newItem: string,
    type: number,
    color: string
  ) => void;
  selectedCategories: string[];
  modelProgress: Map<string, string>;
  selectedProgress: string[];
  onPauseScreenStatus: () => boolean;
  sortList: string[][];
  onSortTasks: (type: string, ascending: boolean) => void;
  currentSort: string;
  categoriesList: string[][];
  onSwap: (item: string, type: number, swapUp: boolean) => void;
  progressList: string[][];
  currentAscend: boolean;
  isLoading: boolean;
  isMobileOpen: boolean;
}

// the side bar
const SideBar: React.FC<SideBarProps> = ({
  onTypeChange,
  onAddType,
  onDeleteType,
  selectedCategories,
  modelProgress,
  selectedProgress,
  onEditType,
  onPauseScreenStatus,
  sortList,
  onSortTasks,
  currentSort,
  categoriesList,
  progressList,
  onSwap,
  currentAscend,
  isLoading,
  isMobileOpen,
}) => {
  const [sidebarScreen, setSideBarScreen] = useState(1); // category (1) or progress (2)

  const [sortOrFilter, setSortOrFilter] = useState<string>("filter"); // sets the screen to the filter screen
  const [sortSelected, setSortSelected] = useState<boolean>(false); // whether a sort type is selected in sort screen
  const [sortAscending, setSortAscending] = useState<string>("Ascending"); // whether the sort is ascending or descending
  const [sort, setSort] = useState<string>("filter"); // the name of the sort selected

  const [showTextBox, setShowTextBox] = useState(false); // to determine whether or not to show the text box
  const [editOrAdd, setEditOrAdd] = useState<string>(""); // sets whether the user chose to edit or add

  const [newCategory, setNewCategory] = useState(""); // represents the name of the new category
  const [newProgress, setNewProgress] = useState(""); // represents the name of the new progress

  const CategoriesArrayForm = Array.from(categoriesList.map(([key, _]) => key)); // the categories of the model
  const [category, setCategory] = useState<string>(CategoriesArrayForm[0]); // sets the category to the first item of the list
  const [categorySelected, setCategorySelected] = useState<boolean>(false); // sets whether a category was chosen

  const ProgressArrayFrom = Array.from(progressList.map(([key, _]) => key)); // the progress list of the model
  const [progress, setProgress] = useState<string>(progressList[0][0]); // sets the progress to the first item of the list
  const [progressSelected, setProgressSelected] = useState<boolean>(false); // sets whether a progress was chosen

  const [color, setColor] = useState(progressList[0][1]); // sets the color to the first progress tag's color
  const [colorSelected, setColorSelected] = useState<boolean>(false); // sets whether a color was chosen

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // sets the error message to any errors
  const timeOut = useRef<NodeJS.Timeout | null>(null); // keeps track of the timeouts and incoming ones

  // displays an error
  const callError = (error: string) => {
    const TitleCaseError = error
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    setErrorMessage(null); // sets the error message to null

    setTimeout(() => {
      setErrorMessage(TitleCaseError); // sets the error message to the stored one 10 ms later

      if (timeOut.current) {
        clearTimeout(timeOut.current);
      } // resets the timeout if a new error arises

      timeOut.current = setTimeout(() => {
        setErrorMessage(null);
        timeOut.current = null;
      }, 3000); // sets the timer to 3 seconds and then resets the states
    }, 10);
  };

  // makes sure the latest sorted category list is there
  useEffect(() => {
    const newKeys = Array.from(categoriesList.map(([a, _]) => a));
    if (newKeys.length > 0 && !categorySelected && category !== newKeys[0]) {
      setCategory(newKeys[0]);
    }
  }, [CategoriesArrayForm]);

  // makes sure the latest sorted progress list is there
  useEffect(() => {
    const newKeys = Array.from(progressList.map(([a, _]) => a));
    if (newKeys.length > 0 && !progressSelected && progress !== newKeys[0]) {
      setProgress(newKeys[0]);
      setColor(progressList[0][1]);
    }
  }, [ProgressArrayFrom]);

  /**
   * sets the textbox to show if the user hit the add button
   */
  const addButtonClick = () => {
    setShowTextBox(true);
    setEditOrAdd("add");
  };

  /**
   * sets the textbox to show if the user hit the edit button
   */
  const editButtonClick = () => {
    setEditOrAdd("edit");
    setShowTextBox(true);
  };

  // resets the fields of most of the states
  const resetFields = () => {
    setNewCategory("");
    setNewProgress("");
    setShowTextBox(false);
    setCategorySelected(false);
    setProgressSelected(false);
    setColorSelected(false);
    setShowTextBox(false);
    setCategory("");
    setProgress("");
  };

  // shows the add or edit buttons
  const showButtons = () => {
    return (
      <div className="side-bar-buttons">
        <AddButton onClick={addButtonClick}></AddButton>

        <EditButton onClick={editButtonClick}></EditButton>
      </div>
    );
  };

  /**
   * when a checkbox is either checked or unchecked it will remove or add it to the categories/progress
   * @param item the given category/progress thats checked or unchecked
   * @param checked whether the category/progress is checked or unchecked
   * @param type whether the item is a category or progress
   */
  const handleCheckboxChange = (
    item: string,
    checked: boolean,
    type: number
  ) => {
    let updatedCategories: string[];
    let updatedProgress: string[];

    if (type == 1) {
      if (checked) {
        updatedCategories = [...selectedCategories, item]; // adds to the updated category
      } else {
        updatedCategories = selectedCategories.filter((cat) => cat !== item); // removes
      }
      if (onTypeChange) {
        onTypeChange(updatedCategories, selectedProgress); // tells the controller to filter with the given categories
      }
    } else if (type == 2) {
      if (checked) {
        updatedProgress = [...selectedProgress, item]; // adds to the updated category
      } else {
        updatedProgress = selectedProgress.filter((prog) => prog !== item); // removes
      }
      if (onTypeChange) {
        onTypeChange(selectedCategories, updatedProgress); // tells the controller to filter with the given categories
      }
    }

    setCategorySelected(false);
    setProgressSelected(false);
    setProgress(progressList[0][0]);
    setCategory(categoriesList[0][0]);
    setColorSelected(false);
    setColor(progressList[0][1]);
  };

  /**
   * adds a category or progress to the controller with given syntax and resets states
   */
  const submitEntry = (type: number) => {
    const titleCase = (type == 1 ? newCategory : newProgress)
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    onAddType(titleCase, sidebarScreen, color);
    setColor(progressList[0][1]);
    resetFields();
  };

  // submits an edited category/progress to the model
  const submitEditEntry = (screen: number) => {
    if (screen == 1) {
      const Category = categorySelected ? category : CategoriesArrayForm[0];
      const NewCategory = newCategory ? newCategory : Category;
      const NewCategoryTitleCase = NewCategory.split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      onEditType(Category, NewCategoryTitleCase, 1, color);
    } else if (screen == 2) {
      const Progress = progressSelected ? progress : ProgressArrayFrom[0];
      const NewProgress = newProgress ? newProgress : Progress;
      const NewProgressTitleCase = NewProgress.split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

      onEditType(Progress, NewProgressTitleCase, 2, color);
    }
    setColor(progressList[0][1]);
    resetFields();
  };

  /**
   * removes a category from the list
   * @param category the category to remove
   * TODO: add option to remove for progress
   */
  const deleteType = (category: string, type: number) => {
    onDeleteType(category, type);
    setColor(progressList[0][1]);
    resetFields();
  };

  // shows the prompt to edit the category/progress
  const editPrompt = () => {
    return (
      <>
        <div className="side-bar-prompt-container">
          <>{filterListSelection()}</>
          <SideBarInput
            placeholder={
              sidebarScreen == 1 ? "Edit Category" : "Edit Progress (Optional)"
            }
            value={sidebarScreen == 1 ? newCategory : newProgress}
            onChange={
              sidebarScreen == 1
                ? (e) => setNewCategory(e.target.value)
                : (e) => setNewProgress(e.target.value)
            }
          ></SideBarInput>
          {sidebarScreen == 2 ? (
            <div className="side-bar-color">
              <label htmlFor="colorPicker">Edit color:</label>
              <input
                id="colorPicker"
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setColorSelected(true);
                }}
                required
              />
              <p className="side-bar-color">You picked: {color}</p>
            </div>
          ) : null}

          <SideBarSubmitCancelButton
            submitStyle={{
              opacity: newCategory || newProgress || colorSelected ? 1 : 0.5,
            }}
            onSubmitClick={() => {
              if (!onPauseScreenStatus()) {
                if (newCategory || newProgress || colorSelected) {
                  try {
                    submitEditEntry(sidebarScreen);
                  } catch (error: any) {
                    callError(error);
                  }
                } else {
                  callError("Fill Atleast One Of The Slots");
                }
              } else {
                callError("cannot edit now");
              }
            }}
            cancelStyle={{ opacity: 1 }}
            onCancelClick={() => {
              setShowTextBox(false);
              setNewCategory("");
              setNewProgress("");
              setColorSelected(false);
              setColor(progressList[0][1]);
              setProgress(progressList[0][0]);
            }}
          ></SideBarSubmitCancelButton>
        </div>
      </>
    );
  };

  // shows the prompt to add the category/progress
  const addPrompt = () => {
    return (
      <>
        <div className="side-bar-prompt-container">
          <SideBarInput
            placeholder={
              sidebarScreen == 1 ? "Enter new category" : "Enter new progress"
            }
            value={sidebarScreen == 1 ? newCategory : newProgress}
            onChange={
              sidebarScreen == 1
                ? (e) => setNewCategory(e.target.value)
                : (e) => setNewProgress(e.target.value)
            }
          ></SideBarInput>

          {sidebarScreen == 2 ? (
            <>
              <div className="side-bar-color">
                <label htmlFor="colorPicker">Pick a color:</label>
                <input
                  id="colorPicker"
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                  }}
                  required
                />
              </div>
              <p>You picked: {color}</p>
            </>
          ) : null}

          <SideBarSubmitCancelButton
            submitStyle={{
              opacity: newCategory || newProgress ? 1 : 0.5,
            }}
            cancelStyle={{ opacity: 1 }}
            onSubmitClick={() => {
              if (!onPauseScreenStatus()) {
                if (newCategory || newProgress) {
                  try {
                    submitEntry(sidebarScreen);
                  } catch (error: any) {
                    callError(error.message);
                  }
                } else {
                  callError("Fill Required Field");
                }
              } else {
                callError("cannot add now");
              }
            }}
            onCancelClick={() => {
              setShowTextBox(false);
              setNewCategory("");
              setNewProgress("");
              setColorSelected(false);
            }}
          ></SideBarSubmitCancelButton>
        </div>
      </>
    );
  };

  // shows a the category or progress list
  const filterListSelection = () => {
    if (sidebarScreen == 1) {
      return (
        <SelectionList
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCategorySelected(true);
          }}
          stringList={Array.from(categoriesList)}
        ></SelectionList>
      );
    } else if (sidebarScreen == 2) {
      return (
        <SelectionList
          value={progress}
          onChange={(e) => {
            setProgress(e.target.value);
            setProgressSelected(true);
            e.target.value != null
              ? setColor(modelProgress.get(e.target.value) ?? "#ff0000")
              : null;
          }}
          style={{ marginLeft: 8 }}
          stringList={Array.from(progressList)}
        ></SelectionList>
      );
    }
  };

  /** sends the controller the item to swap
   * @param item the name of the controller/progress
   * @param type the type (category or progress)
   * @param up whether to move the cateogry or progress up or down
   */
  const moveType = (item: string, type: number, up: boolean) => {
    onSwap(item, type, up);
    resetFields();
  };

  // submits a sort to the controller with the sort picked and the ascending picked
  const submitSort = () => {
    const type = sortSelected ? sort : "NONE";
    const isAscending = sortAscending == "Ascending" ? true : false;
    // " + with the boolean: " + isAscending
    onSortTasks(type, isAscending);
  };

  // prompts the user to sort by a list with ascending picked
  const sortPrompt = () => {
    return (
      <>
        <p style={{ color: "#471a58", marginLeft: 2 }}>
          <b>Current Sort:</b>{" "}
          {currentSort.charAt(0).toUpperCase() +
            currentSort.substring(1, currentSort.length).toLowerCase() +
            " " +
            (currentAscend ? "↑" : "↓")}{" "}
        </p>
        <div className="side-bar-prompt-container">
          <SelectionList
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setSortSelected(true);
            }}
            stringList={sortList}
          ></SelectionList>
          <select
            value={sortAscending}
            onChange={(e) => {
              setSortAscending(e.target.value);
            }}
          >
            <option key={"Ascending"} value={"Ascending"}>
              Ascending
            </option>
            <option key={"Descending"} value={"Descending"}>
              Descending
            </option>
          </select>
          <SideBarSubmitCancelButton
            submitStyle={{
              opacity: 1,
            }}
            onSubmitClick={() => {
              submitSort();
            }}
            cancelStyle={{ opacity: 1 }}
            onCancelClick={() => {
              setShowTextBox(false);
              setNewCategory("");
              setNewProgress("");
              setColorSelected(false);
              setSortSelected(false);
            }}
          ></SideBarSubmitCancelButton>
        </div>
      </>
    );
  };

  if (isLoading == false) {
    return (
      <div className="mobile-wrapper">
        <div
          className={`sidebar-container ${isMobileOpen ? "open" : "collapsed"}`}
        >
          <h1 className="toggles">
            <SideBarRadioButtons
              value={"filter"}
              isChecked={sortOrFilter == "filter"}
              onClick={() => setSortOrFilter("filter")}
              textName={"Filter"}
              radioName={"filter-sort-type"}
              className={"headerToggle"}
            ></SideBarRadioButtons>
            <SideBarRadioButtons
              value={"sort"}
              isChecked={sortOrFilter == "sort"}
              onClick={() => setSortOrFilter("sort")}
              textName={"Sort"}
              radioName={"filter-sort-type"}
              className={"headerToggle"}
            ></SideBarRadioButtons>
          </h1>
          {/* represents the side bar  */}

          {sortOrFilter == "filter" ? (
            <>
              <div className="toggles">
                <SideBarRadioButtons
                  value={"category"}
                  isChecked={sidebarScreen == 1}
                  onClick={() => setSideBarScreen(1)}
                  textName={"Category"}
                  radioName={"filter-type"}
                  className={"toggleLabel"}
                />
                <SideBarRadioButtons
                  value={"progress"}
                  isChecked={sidebarScreen == 2}
                  onClick={() => setSideBarScreen(2)}
                  textName={"Progress"}
                  radioName={"filter-type"}
                  className={"toggleLabel"}
                />
              </div>

              {sidebarScreen == 1 ? (
                <div className="Categories">
                  {categoriesList &&
                    categoriesList.map(([category]) => (
                      <CheckboxItem
                        id={category}
                        onDeleteClick={() => {
                          if (!onPauseScreenStatus()) {
                            try {
                              deleteType(category, 1);
                            } catch (error: any) {
                              callError(error.message);
                            }
                          } else {
                            callError("cannot delete category tag now");
                          }
                        }}
                        disabled={onPauseScreenStatus()}
                        onCheck={selectedCategories.includes(category)}
                        onChange={(e) =>
                          handleCheckboxChange(category, e.target.checked, 1)
                        }
                        onEditClick={() => {
                          if (!onPauseScreenStatus()) {
                            try {
                              moveType(category, 1, true);
                            } catch (error: any) {
                              callError(error.message);
                            }
                          } else {
                            callError("cannot move category tag now");
                          }
                        }}
                        onDownClick={() => {
                          if (!onPauseScreenStatus()) {
                            try {
                              moveType(category, 1, false);
                            } catch (error: any) {
                              callError(error.message);
                            }
                          } else {
                            callError("cannot move category tag now");
                          }
                        }}
                      />
                    ))}
                </div>
              ) : (
                <div className="Progress">
                  {progressList &&
                    progressList.map(([progress]) => (
                      <CheckboxItem
                        id={progress}
                        onDeleteClick={() => {
                          if (!onPauseScreenStatus()) {
                            try {
                              deleteType(progress, 2);
                            } catch (error: any) {
                              callError(error.message);
                            }
                          } else {
                            callError("cannot delete category tag now");
                          }
                        }}
                        disabled={onPauseScreenStatus()}
                        onCheck={selectedProgress.includes(progress)}
                        style={{ accentColor: modelProgress.get(progress) }}
                        onChange={(e) =>
                          handleCheckboxChange(progress, e.target.checked, 2)
                        }
                        onEditClick={() => {
                          if (!onPauseScreenStatus()) {
                            try {
                              moveType(progress, 2, true);
                            } catch (error: any) {
                              callError(error.message);
                            }
                          } else {
                            callError("cannot move category tag now");
                          }
                        }}
                        onDownClick={() => {
                          if (!onPauseScreenStatus()) {
                            try {
                              moveType(progress, 2, false);
                            } catch (error: any) {
                              callError(error.message);
                            }
                          } else {
                            callError("cannot move category tag now");
                          }
                        }}
                      />
                    ))}
                </div>
              )}

              {!showTextBox ? (
                <>{showButtons()}</>
              ) : editOrAdd === "edit" ? (
                <>{editPrompt()}</>
              ) : (
                <>{addPrompt()}</>
              )}
            </>
          ) : (
            <>{sortPrompt()}</>
          )}
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    );
  }
};

export default SideBar;
