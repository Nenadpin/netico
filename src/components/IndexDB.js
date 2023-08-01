import { openDB } from "idb";

export const openDatabase = (dbName, dbVersion, objectStoreName) => {
  return openDB(dbName, dbVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName, {
          autoIncrement: true,
        });
      }
    },
  });
};

export const addObject = async (
  dbName,
  dbVersion,
  objectStoreName,
  key,
  object
) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  await db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName)
    .add(object, key);
};
export const deleteObject = async (dbName, dbVersion, objectStoreName, key) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  await db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName)
    .delete(key);
};

export const updateObject = async (
  dbName,
  dbVersion,
  objectStoreName,
  key,
  object
) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  await db
    .transaction(objectStoreName, "readwrite")
    .objectStore(objectStoreName)
    .put(object, key);
};

export const getValue = async (dbName, dbVersion, objectStoreName, key) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  const objectStore = db
    .transaction(objectStoreName, "readonly")
    .objectStore(objectStoreName);
  const keyExists = await objectStore.getKey(key);

  if (keyExists !== undefined) {
    return objectStore.get(key);
  } else {
    return null;
  }
};

export const getAllObjects = async (dbName, dbVersion, objectStoreName) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  return db
    .transaction(objectStoreName, "readonly")
    .objectStore(objectStoreName)
    .getAll();
};
