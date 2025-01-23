// IndexedDB 数据库管理
class FoodDatabase {
    constructor() {
        this.dbName = 'FoodRecognitionDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 创建食物识别历史存储
                if (!db.objectStoreNames.contains('history')) {
                    db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
                }
                
                // 创建用户反馈存储
                if (!db.objectStoreNames.contains('feedback')) {
                    db.createObjectStore('feedback', { keyPath: 'id', autoIncrement: true });
                }
                
                // 创建本地食物数据库
                if (!db.objectStoreNames.contains('foodData')) {
                    const foodStore = db.createObjectStore('foodData', { keyPath: 'name' });
                    foodStore.createIndex('category', 'category', { unique: false });
                }
            };
        });
    }

    // 保存识别历史
    async saveHistory(imageData, results) {
        const store = this.db.transaction('history', 'readwrite').objectStore('history');
        await store.add({
            timestamp: Date.now(),
            image: imageData,
            results: results
        });
    }

    // 保存用户反馈
    async saveFeedback(originalResult, userCorrection) {
        const store = this.db.transaction('feedback', 'readwrite').objectStore('feedback');
        await store.add({
            timestamp: Date.now(),
            original: originalResult,
            correction: userCorrection
        });
    }

    // 获取相似案例
    async getSimilarCases(foodName) {
        const store = this.db.transaction('foodData', 'readonly').objectStore('foodData');
        const result = await store.get(foodName);
        return result || null;
    }

    // 更新本地食物数据库
    async updateFoodData(foodData) {
        const store = this.db.transaction('foodData', 'readwrite').objectStore('foodData');
        await store.put(foodData);
    }
}

// 初始化数据库
const foodDB = new FoodDatabase();
foodDB.init().catch(console.error); 