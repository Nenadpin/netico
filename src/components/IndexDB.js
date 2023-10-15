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
  const transaction = db.transaction(objectStoreName, "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  await objectStore.add(object, key);
};

export const deleteObject = async (dbName, dbVersion, objectStoreName, key) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  const transaction = db.transaction(objectStoreName, "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  await objectStore.delete(key);
};

export const updateObject = async (
  dbName,
  dbVersion,
  objectStoreName,
  key,
  object
) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  const transaction = db.transaction(objectStoreName, "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  await objectStore.put(object, key);
};

export const getValue = async (dbName, dbVersion, objectStoreName, key) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  const transaction = db.transaction(objectStoreName, "readonly");
  const objectStore = transaction.objectStore(objectStoreName);

  if (objectStore.keyPath !== key) {
    return null;
  }

  return objectStore.get(key);
};

export const getAllObjects = async (dbName, dbVersion, objectStoreName) => {
  const db = await openDatabase(dbName, dbVersion, objectStoreName);
  const transaction = db.transaction(objectStoreName, "readonly");
  const objectStore = transaction.objectStore(objectStoreName);

  return objectStore.getAll();
};
