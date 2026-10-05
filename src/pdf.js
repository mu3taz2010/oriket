import { jsPDF } from "jspdf";

const company = {
  name: "أوركيت للمقاولات العامة",
  brand: "ORKIT",
  district: "حي الضيافة",
  email: "ضع البريد الإلكتروني هنا",
  phones: "0555334577 - 0500052629"
};

function safeDate(value) {
  if (!value) return "";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("ar-SA-u-ca-gregory", {
    year: "numeric", month: "2-digit", day: "2-digit"
  });
}

function addHeader(doc) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(17, 24, 39);
  doc.rect(0, 0, pageW, 34, "F");
  doc.setTextColor(255,255,255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ORKIT", pageW - 18, 15, { align: "right" });
  doc.setFontSize(9);
  doc.text("أوركيت للمقاولات العامة", pageW - 18, 23, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(company.district + " | " + company.phones, 18, 23);
  doc.setTextColor(31,41,55);
  doc.setDrawColor(209,213,219);
  doc.line(18, 39, pageW-18, 39);
}

function addFooter(doc, pageNo) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(209,213,219);
  doc.line(18, pageH-22, pageW-18, pageH-22);
  doc.setFont("helvetica","normal");
  doc.setFontSize(8);
  doc.setTextColor(107,114,128);
  doc.text(`${company.email} | ${company.phones}`, pageW/2, pageH-14, {align:"center"});
  doc.text(String(pageNo), pageW-18, pageH-14, {align:"right"});
}

function addWrapped(doc, text, x, y, width, size=11, line=6) {
  doc.setFontSize(size);
  doc.setTextColor(31,41,55);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * line;
}

export function createContract(data) {
  const doc = new jsPDF({ unit:"mm", format:"a4" });
  addHeader(doc);
  const pageW = doc.internal.pageSize.getWidth();
  let y = 54;

  doc.setFont("helvetica","bold");
  doc.setFontSize(18);
  doc.setTextColor(17,24,39);
  doc.text("عقد صيانة أنظمة السلامة والوقاية والحماية من الحريق", pageW/2, y, {align:"center"});
  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica","normal");
  doc.text(`رقم العقد: ${data.contractNo}`, pageW-18, y, {align:"right"});
  y += 9;

  const rows = [
    ["اسم العميل / المنشأة", data.clientName],
    ["تاريخ بداية العقد", safeDate(data.startDate)],
    ["مدة العقد", data.durationLabel],
    ["تاريخ نهاية العقد", safeDate(data.endDate)],
    ["رقم الجوال", data.clientPhone || "—"],
    ["موقع المنشأة", data.location || "—"]
  ];

  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setFillColor(247,248,250);
    doc.rect(18, y-5, pageW-36, 10, "F");
    doc.setFont("helvetica","bold");
    doc.text(label, pageW-23, y+1, {align:"right"});
    doc.setFont("helvetica","normal");
    doc.text(String(value), 23, y+1);
    y += 12;
  });

  y += 3;
  doc.setFont("helvetica","bold");
  doc.setFontSize(13);
  doc.text("أولاً: نطاق الصيانة", pageW-18, y, {align:"right"});
  y += 8;
  doc.setFont("helvetica","normal");
  const clauses = [
    "تلتزم أوركيت للمقاولات العامة بتنفيذ أعمال الفحص والصيانة الدورية لأنظمة السلامة والوقاية والحماية من الحريق الموجودة في المنشأة وفق نطاق الأعمال المتفق عليه.",
    "تشمل أعمال الصيانة – بحسب الأنظمة الموجودة بالموقع – الفحص البصري والاختبارات التشغيلية والتنظيف والمعالجة الأولية للأعطال ورفع الملاحظات الفنية.",
    "في حال وجود قطع غيار أو أعمال إضافية غير مشمولة في نطاق الصيانة الأساسية، يتم تقديم عرض أو موافقة مستقلة قبل تنفيذها.",
    "يلتزم العميل بتمكين فريق الصيانة من الوصول إلى الأنظمة والمواقع والمعدات في المواعيد المتفق عليها.",
    "يتم توثيق الملاحظات الجوهرية ورفعها للعميل، ولا يُعد هذا العقد بحد ذاته شهادة اعتماد أو ترخيصاً من أي جهة حكومية.",
    "يخضع هذا العقد للأنظمة والاشتراطات واللوائح المعمول بها في المملكة العربية السعودية."
  ];
  clauses.forEach((c,i) => {
    y = addWrapped(doc, `${i+1}. ${c}`, 23, y, pageW-46, 10, 5.5) + 2;
    if (y > 255) {
      addFooter(doc, 1);
      doc.addPage();
      addHeader(doc);
      y = 54;
    }
  });

  y += 6;
  doc.setFont("helvetica","bold");
  doc.setFontSize(12);
  doc.text("ثانياً: مدة العقد", pageW-18, y, {align:"right"});
  y += 7;
  doc.setFont("helvetica","normal");
  y = addWrapped(doc, `مدة العقد ${data.durationLabel} تبدأ من ${safeDate(data.startDate)} وتنتهي في ${safeDate(data.endDate)}، ما لم يتم الاتفاق كتابياً على خلاف ذلك.`, 23, y, pageW-46, 10, 5.5);

  y += 12;
  doc.setFont("helvetica","bold");
  doc.setFontSize(12);
  doc.text("ثالثاً: التوقيع", pageW-18, y, {align:"right"});
  y += 12;
  doc.setFont("helvetica","normal");
  doc.text("الطرف الأول: أوركيت للمقاولات العامة", pageW-25, y, {align:"right"});
  doc.text("الطرف الثاني: العميل / المنشأة", 25, y, {align:"left"});
  y += 25;
  doc.text("الاسم والتوقيع: ____________________", pageW-25, y, {align:"right"});
  doc.text("الاسم والتوقيع: ____________________", 25, y, {align:"left"});
  y += 10;
  doc.text("الختم: _____________________________", pageW-25, y, {align:"right"});
  doc.text("الختم: _____________________________", 25, y, {align:"left"});

  addFooter(doc, 1);
  doc.save(`ORKIT-Contract-${data.contractNo}.pdf`);
}

export function createSafetyStatement(data) {
  const doc = new jsPDF({unit:"mm", format:"a4"});
  addHeader(doc);
  const pageW = doc.internal.pageSize.getWidth();
  let y = 55;

  doc.setFont("helvetica","bold");
  doc.setFontSize(20);
  doc.text("مشهد سلامة وصيانة", pageW/2, y, {align:"center"});
  y += 15;

  doc.setFontSize(11);
  doc.setFont("helvetica","normal");
  y = addWrapped(doc,
    `تشهد شركة ${company.name} بأن المنشأة الموضحة بياناتها أدناه لديها عقد صيانة ساري مع الشركة ضمن نطاق أنظمة السلامة والوقاية والحماية من الحريق، وذلك حسب بنود العقد ونطاق الأعمال المتفق عليه.`,
    24, y, pageW-48, 11, 6.5
  ) + 10;

  const rows = [
    ["اسم العميل / المنشأة", data.clientName],
    ["رقم العقد", data.contractNo],
    ["تاريخ بداية العقد", safeDate(data.startDate)],
    ["مدة العقد", data.durationLabel],
    ["تاريخ انتهاء العقد", safeDate(data.endDate)],
    ["موقع المنشأة", data.location || "—"]
  ];

  rows.forEach(([label,value])=>{
    doc.setDrawColor(209,213,219);
    doc.rect(24,y-6,pageW-48,12);
    doc.setFont("helvetica","bold");
    doc.text(label,pageW-30,y+1,{align:"right"});
    doc.setFont("helvetica","normal");
    doc.text(String(value),30,y+1);
    y+=13;
  });

  y += 10;
  y = addWrapped(doc,
    "هذا المشهد مستند صادر من الشركة لأغراض التوثيق الداخلي وإثبات وجود عقد صيانة، ولا يُعد بديلاً عن أي شهادة أو تصريح أو اعتماد رسمي صادر من الجهات الحكومية المختصة.",
    24, y, pageW-48, 9.5, 5.5
  ) + 25;

  doc.setFont("helvetica","bold");
  doc.setFontSize(11);
  doc.text("أوركيت للمقاولات العامة", pageW-25, y, {align:"right"});
  y += 8;
  doc.setFont("helvetica","normal");
  doc.text("المعتمد / المسؤول: ____________________", pageW-25, y, {align:"right"});
  y += 8;
  doc.text("التوقيع والختم: ________________________", pageW-25, y, {align:"right"});

  addFooter(doc,1);
  doc.save(`ORKIT-Safety-${data.contractNo}.pdf`);
}