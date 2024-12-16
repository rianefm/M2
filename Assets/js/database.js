// criando database com indexedDB
export class Database {
  constructor() {
    this.dbName = 'HackFoodDb';
    this.dbVersion = 1;
    this.db = null;
    this.storeNames = {
      users: "users",
      products: "products",
      orders: "orders"
    };
    this.dbInitialized = false; // Controle de inicialização
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
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.dbInitialized = true; // Marca como inicializado
      console.log('Banco de dados inicializado com sucesso', this.dbName);
    };

    request.onerror = (event) => {
      console.error('Erro ao inicializar o banco de dados', event.target.error);
    };
  }

  async waitForDB() {
    while (!this.dbInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Aguarda 100ms antes de verificar novamente
    }
  }

  async addItem(storeName, data) {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.add(data);

      request.onsuccess = () => {
        console.log(`Item adicionado na tabela ${storeName}:`, data);
        resolve(request.result); // Retorna o ID do item adicionado
      };

      request.onerror = () => {
        console.error(`Erro ao adicionar item na tabela ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async getAllItems(storeName) {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result); // Retorna todos os itens da tabela
      };

      request.onerror = () => {
        console.error(`Erro ao obter itens da tabela ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async getItemByKey(storeName, key) {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result); // Retorna o item encontrado
      };

      request.onerror = () => {
        console.error(`Erro ao obter item na tabela ${storeName} com chave ${key}:`, request.error);
        reject(request.error);
      };
    });
  }

  async updateItem(storeName, data) {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.put(data);

      request.onsuccess = () => {
        console.log(`Item atualizado na tabela ${storeName}:`, data);
        resolve(request.result); // Retorna o ID do item atualizado
      };

      request.onerror = () => {
        console.error(`Erro ao atualizar item na tabela ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }

  async deleteItem(storeName, key) {
    await this.waitForDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.delete(key);

      request.onsuccess = () => {
        console.log(`Item removido da tabela ${storeName} com chave ${key}`);
        resolve(request.result); // Retorna o ID do item removido
      };

      request.onerror = () => {
        console.error(`Erro ao remover item na tabela ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  }
}
