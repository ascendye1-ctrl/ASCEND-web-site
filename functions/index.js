const admin = require("firebase-admin"); // استيراد مكتبة التحكم
const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// تفعيل الوصول لقاعدة البيانات باستخدام المتغير الذي وضعته في Render
if (process.env.firebaseServiceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.firebaseServiceAccount))
    });
} else {
    admin.initializeApp();
}

setGlobalOptions({ maxInstances: 10 });

// دالة (Function) تجريبية - هذه المرة ليست تعليقاً بل ستعمل فعلياً
exports.api = onRequest((request, response) => {
    logger.info("تم استدعاء الموقع بنجاح!");
    response.send({
        status: "success",
        message: "مرحباً بك! موقعك المتصل بقاعدة البيانات يعمل الآن."
    });
});