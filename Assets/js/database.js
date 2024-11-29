// criando database com indexedDB
export class Database {
  constructor() {
    this.dbName = 'testDB';
    this.dbVersion = 1;
    this.db = null;
    this.storeNames = {
      users: "users",
      products: "products",
      orders: "orders"
    };
    this.initDB();
  }

  initDB() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(this.storeNames.users)) {
        const userStore = db.createObjectStore(this.storeNames.users, {
          keyPath: 'id',
          autoIncrement: true
        });
        userStore.createIndex("email", "email", { unique: true });
      }
   }
  }
}
