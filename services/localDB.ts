
import { Product } from '../types';

// --- Types ---
export interface ImageRecord {
  id: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  createdAt: number;
}

export interface CachedData<T> {
  key: string;
  data: T;
  timestamp: number;
}

const DB_NAME = 'AscendHighPerfDB';
const DB_VERSION = 2; // Incremented for new stores
const STORES = {
  IMAGES: 'images',
  PRODUCTS: 'products',
  SYSTEM: 'system_cache'
};

// --- Core DB Connection ---
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store 1: Images (Large Blobs)
      if (!db.objectStoreNames.contains(STORES.IMAGES)) {
        db.createObjectStore(STORES.IMAGES, { keyPath: 'id' });
      }

      // Store 2: Products (Catalog Data) - Optimized for read speed
      if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
        const productStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
        productStore.createIndex('category', 'category', { unique: false });
        productStore.createIndex('slug', 'slug', { unique: true });
      }

      // Store 3: System Cache (Settings, User Prefs)
      if (!db.objectStoreNames.contains(STORES.SYSTEM)) {
        db.createObjectStore(STORES.SYSTEM, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      console.error("Database Error:", (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// --- Image Handling (Blob Storage) ---
export const saveImageToDB = async (file: File | Blob, id: string): Promise<string> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.IMAGES], 'readwrite');
    const store = transaction.objectStore(STORES.IMAGES);
    
    const record: ImageRecord = {
      id,
      blob: file,
      fileName: (file as File).name || 'image.jpg',
      mimeType: file.type,
      createdAt: Date.now()
    };

    const request = store.put(record);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject('Failed to save image');
  });
};

export const getImageFromDB = async (id: string): Promise<string | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.IMAGES], 'readonly');
    const store = transaction.objectStore(STORES.IMAGES);
    const request = store.get(id);

    request.onsuccess = () => {
      const record = request.result as ImageRecord;
      if (record) {
        const url = URL.createObjectURL(record.blob);
        resolve(url);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject('Failed to retrieve image');
  });
};

// --- Product Caching (Catalog Acceleration) ---
export const cacheCatalog = async (products: Product[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PRODUCTS], 'readwrite');
    const store = transaction.objectStore(STORES.PRODUCTS);

    // Bulk Add for Performance
    products.forEach(product => {
      store.put(product);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject('Failed to cache catalog');
  });
};

export const getCachedCatalog = async (): Promise<Product[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PRODUCTS], 'readonly');
    const store = transaction.objectStore(STORES.PRODUCTS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject('Failed to fetch catalog');
  });
};

// --- System Cache (Settings/Preferences) ---
export const setSystemCache = async (key: string, data: any) => {
  const db = await openDB();
  const tx = db.transaction([STORES.SYSTEM], 'readwrite');
  tx.objectStore(STORES.SYSTEM).put({ key, data, timestamp: Date.now() });
};

export const getSystemCache = async (key: string): Promise<any | null> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const request = db.transaction([STORES.SYSTEM], 'readonly').objectStore(STORES.SYSTEM).get(key);
    request.onsuccess = () => resolve(request.result?.data || null);
    request.onerror = () => resolve(null);
  });
};
