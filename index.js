const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// 1. إعداد الاتصال بـ Firebase
// أضفنا محاولة (try-catch) للتأكد من أن متغير البيئة سليم ولا يسبب انهيار السيرفر
try {
  if (!process.env.firebaseServiceAccount) {
    throw new Error("Missing firebaseServiceAccount environment variable");
  }
  const serviceAccount = JSON.parse(process.env.firebaseServiceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized ✅");
} catch (error) {
  console.error("Firebase Initialization Error ❌:", error.message);
}

const db = admin.firestore();
const app = express();

// 2. إعدادات CORS (تعديل للأمان)
// بدلاً من فتح السيرفر للجميع، نحدد المواقع المسموح لها فقط
app.use(cors({
  origin: [
    'https://ascend-web-site.pages.dev', // رابط موقعك على Cloudflare
    'http://localhost:5173'              // للعمل محلياً أثناء التطوير
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// الرابط الأساسي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.send('ASCEND Backend is Live and Connected to Firestore! ✅');
});

// 2. رابط المنتجات (تحسينات الأداء)
app.get('/api/products', async (req, res) => {
  try {
    // استخدمنا limit لضمان عدم تحميل كمية بيانات ضخمة فجأة
    const snapshot = await db.collection('products').orderBy('id', 'asc').limit(50).get();
    
    if (snapshot.empty) {
      return res.status(200).json([]); // إرجاع مصفوفة فارغة إذا لم توجد منتجات
    }

    const products = snapshot.docs.map(doc => ({
      // استخدام id الوثيقة كـ id احتياطي إذا لم يوجد id في البيانات
      id: doc.id, 
      ...doc.data()
    }));
    
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات من Firestore" });
  }
});

// إعداد المنفذ (Port)
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});