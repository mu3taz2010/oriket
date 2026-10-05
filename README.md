# ORKIT Maintenance

نظام ويب عربي لإنشاء عقود صيانة أنظمة السلامة والوقاية والحماية من الحريق لشركة ORKIT.

## المزايا
- إدخال اسم العميل وتاريخ البداية ومدة العقد.
- حساب تاريخ الانتهاء تلقائياً.
- إنشاء عقد PDF.
- إنشاء مشهد سلامة PDF.
- رقم عقد تلقائي بصيغة ORK-YYYY-0001.
- سجل محلي للعقود.
- تصميم متجاوب للجوال والكمبيوتر.
- لا يحتاج قاعدة بيانات في النسخة الأساسية.

## التشغيل محلياً

```bash
npm install
npm run dev
```

ثم افتح العنوان الذي يظهر في الطرفية.

## رفعه إلى GitHub

أنشئ Repository جديد ثم ارفع جميع ملفات المشروع.

إذا كان لديك Git مثبت:

```bash
git init
git add .
git commit -m "Initial ORKIT maintenance app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Vercel

في Vercel اختر مستودع GitHub ثم:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

لا توجد متغيرات بيئية مطلوبة للنسخة الأساسية.

## تعديل بيانات الشركة

بيانات رأس PDF موجودة في:
`src/pdf.js`

عدّل:
- البريد الإلكتروني
- اسم الشركة
- الحي
- أرقام الهاتف

الشعار الافتراضي موجود في:
`public/orkit-logo.svg`

## تنبيه

النص المولد هو نموذج إداري/تجاري. يجب مراجعة بنود العقد النهائية واعتمادها قانونياً، كما أن "مشهد السلامة" الذي ينشئه التطبيق ليس شهادة أو تصريحاً حكومياً من الدفاع المدني.