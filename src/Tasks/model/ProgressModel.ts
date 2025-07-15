/**
 * represnts tags for the progress of a task.
 */
export default class ProgressModel {
  progressMap: Map<string, string> = new Map<string, string>(); // a map of all of the progress tags.
  progressList: string[][]; // the sorted list of the progress tags

  /**
   * represents a constructor
   * by default there are 5 progression bars
   */
  constructor() {
    this.progressMap = new Map<string, string>([
      ["Not Started", "#791a22"],
      ["Low Progress", "#8d772e"],
      ["Medium Progress", "#183b58"],
      ["High Progress", "#351853"],
      ["Completed", "#0e3f1a"],
    ]);

    this.progressList = [
      ["Not Started", "#791a22"],
      ["Low Progress", "#8d772e"],

      ["Medium Progress", "#183b58"],
      ["High Progress", "#351853"],
      ["Completed", "#0e3f1a"],
    ];
  }

  /**
   * adds a progression tag.
   * @param key  the key of the tag.
   * @param value the value of the tag.
   * @throws if a tag already exists or if theres a tag with the same color
   */
  addProgress(key: string, value: string): void {
    if (!this.progressMap.has(key)) {
      if (!Array.from(this.progressMap.values()).includes(value)) {
        this.progressMap.set(key, value);
        this.progressList = [...this.progressList, [key, value]];
        console.log("progress list in the progressmodel: " + this.progressList);
        console.log(
          "this is the progress map in the progressmodel: " + this.progressList
        );
      } else {
        throw new Error(`Progress Tag With Color ${value} Already Exists.`);
      }
    } else {
      throw new Error(`Progress Tag With Key ${key} Already Exists.`);
    }
  }

  /**
   * deletes a progress tag from the map
   * @param prog the given progress
   * @throws if theres only one progress tag or if the tag doesnt exist
   */
  deleteProgress(prog: string): void {
    if (this.progressMap.has(prog)) {
      console.log(
        "size of the progress map right now: " +
          this.progressMap.size +
          " with the following entries: " +
          Array.from(this.progressMap.entries())
      );
      if (this.progressMap.size > 1 && this.progressList.length > 1) {
        this.progressMap.delete(prog);
        this.progressList = this.progressList.filter(
          ([key, _]) => key !== prog
        );
      } else {
        throw new Error("Cannot delete all progress");
      }
    } else {
      throw new Error(`Progress with ${prog} does not exist.`);
    }
  }

  /**
   * returns the progress tags as an arraylist
   * @returns array list
   */
  getProgressList(): Array<{ key: string; label: string }> {
    return Array.from(this.progressMap.entries()).map(([key, value]) => ({
      key,
      label: value,
    }));
  }

  /**
   * edits a progress tag with the given name and/or color
   * @param original the original name of the progress tag
   * @param newName the new name
   * @param color the new color
   * @throws if no edits were made
   */
  editProgress(original: string, newName: string, color: string): void {
    if (
      (newName == original || this.progressMap.has(newName)) &&
      color == this.progressMap.get(original)
    ) {
      throw new Error(
        "Edit(s) do not change the progress tag or progress tag exists"
      );
    } else {
      const newMap = new Map<string, string>();

      for (const [key, value] of this.progressMap.entries()) {
        if (key == original) {
          newMap.set(newName, color);
        } else {
          newMap.set(key, value);
        }
      }
      this.progressMap = newMap;
      this.progressList = this.progressList.map(([key, val]) =>
        key === original ? [newName, color] : [key, val]
      );
    }
  }

  /**
   * swaps 2 progress positions with eachother based on if
   * the progress is going up or down
   * @param progress the name of the progress to swap
   * @param swapUp boolean to determine whether to swap up or down
   * @throws if the progress is set to swap up and its the first progress,
   *  or if progress is set to swap down and its last prgoress
   */
  swapItems(progress: string, swapUp: boolean): void {
    const progressSorted = Array.from(this.progressList);
    const index = progressSorted.findIndex(([key]) => key === progress);
    if (swapUp) {
      if (index >= 1) {
        [progressSorted[index], progressSorted[index - 1]] = [
          progressSorted[index - 1],
          progressSorted[index],
        ];
      } else {
        throw new Error("Cannot move the progress tag further up");
      }
    } else {
      if (index + 1 < this.progressList.length) {
        [progressSorted[index], progressSorted[index + 1]] = [
          progressSorted[index + 1],
          progressSorted[index],
        ];
      } else {
        throw new Error("Cannot move the progress tag further down");
      }
    }
    this.progressList = progressSorted;
  }
}
