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

      if (!db.objectStoreNames.contains(this.storeNames.products)) {
        db.createObjectStore(this.storeNames.products, {
          keyPath: 'id',
          autoIncrement: true
        });
      }

      if (!db.objectStoreNames.contains(this.storeNames.orders)) {
        db.createObjectStore(this.storeNames.orders, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    }
    request.onsucess = (event) => {
      this.db = event.target.result;
      console.log('Banco de dados inicializado com sucesso', this.dbName);
    };

    request.onerror = (event) => {
      console.error('Erro ao inicializar o banco de dados', event.target.error);
    };
  };
}
