/**
 * represents a task. A taks has a name, belongs to a category,
 * has a status inidicator, and a date as to when the task is due.
 * Each task also has its own ID for identification
 */
export default class Task {
  name: string;
  category: string;

  progress: string;
  dateDue: Date;

  protected id: number;
  static startID: number = 1;

  /**
   * represents a constructor for the task.
   * @param name the name of the task (string) -> required
   * @param category the category the task belongs to (string) -> required
   * @param progress the progression status of the task (string) - defaults to
   *                 not started if not picked -> optional
   * @param dateDue the date the task is due (Date) - defaults to the day it was
   *                created if no option given  -> optional
   * @param id the id of the task (number) - defaults to an automated task if not given one -> optional
   */
  constructor(
    name: string,
    category: string,
    progress: string,
    dateDue?: Date,
    id?: number
  ) {
    this.name = name;
    this.category = category;
    this.progress = progress;
    this.dateDue = dateDue ?? new Date();
    this.id = id ?? Task.startID++;
  }

  /**
   * gets the id of the task.
   * @returns the id of the task (number)
   */
  getID(): number {
    return this.id;
  }
}
