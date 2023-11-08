import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";

export const db = low(new FileSync("db.json"));
