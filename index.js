const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// 1. إعداد الاتصال الآمن بـ Firebase (عن طريق Render)
const serviceAccount = JSON.parse(process.env.firebaseServiceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors()); 
app.use(express.json());

// الرابط الأساسي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.send('ASCEND Backend is Live and Connected to Firestore! ✅');
});

// 2. رابط المنتجات الحقيقي (يقرأ من قاعدة البيانات مباشرة)
app.get('/api/products', async (req, res) => {
  try {
    // جلب البيانات من مجموعة اسمها products في Firestore
    const snapshot = await db.collection('products').orderBy('id', 'asc').get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // إرسال البيانات للواجهة الأمامية
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "فشل جلب المنتجات من القاعدة" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});