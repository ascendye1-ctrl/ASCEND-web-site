const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // هذا السطر يسمح لموقعك بالاتصال بالسيرفر
app.use(express.json());

// الرابط الأساسي
app.get('/', (req, res) => {
  res.send('Backend يعمل بنجاح ✅');
});

// رابط المنتجات الجديد (API المنتجات)
app.get('/products', (req, res) => {
  const products = [
    { id: 1, name: 'ساعة ذكية', price: 150, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'سماعات لاسلكية', price: 80, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'لوحة مفاتيح مضيئة', price: 45, image: 'https://via.placeholder.com/150' }
  ];
  res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});