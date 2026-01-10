export const cacheCatalog = async (data: any) => localStorage.setItem('ascend_cache', JSON.stringify(data));
export const getCachedCatalog = async () => JSON.parse(localStorage.getItem('ascend_cache') || '[]');
export const setSystemCache = async (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));
export const getSystemCache = async (key: string) => JSON.parse(localStorage.getItem(key) || 'null');