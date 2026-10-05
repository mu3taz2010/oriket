import React, { useEffect, useMemo, useState } from "react";
import { FileText, ShieldCheck, History, Plus, Trash2, Download, Settings, Phone, Mail, MapPin, Printer } from "lucide-react";
import { createContract, createSafetyStatement } from "./pdf";

const KEY = "orkit_contracts_v1";

const durations = [
  {months: 1, label:"شهر واحد"},
  {months: 3, label:"3 أشهر"},
  {months: 6, label:"6 أشهر"},
  {months: 12, label:"سنة واحدة"},
  {months: 24, label:"سنتان"},
  {months: 36, label:"3 سنوات"}
];

function pad(n){ return String(n).padStart(2,"0"); }
function today(){
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function addMonths(dateString, months){
  const d = new Date(dateString + "T00:00:00");
  d.setMonth(d.getMonth()+Number(months));
  d.setDate(d.getDate()-1);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function fmt(v){
  if(!v) return "—";
  return new Date(v+"T00:00:00").toLocaleDateString("ar-SA-u-ca-gregory");
}
function nextNo(items){
  const y = new Date().getFullYear();
  return `ORK-${y}-${String(items.length+1).padStart(4,"0")}`;
}

export function App(){
  const [tab,setTab] = useState("new");
  const [contracts,setContracts] = useState(()=>{
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  const [form,setForm] = useState({
    clientName:"",
    startDate:today(),
    months:12,
    clientPhone:"",
    location:"",
    email:""
  });

  useEffect(()=>localStorage.setItem(KEY,JSON.stringify(contracts)),[contracts]);

  const duration = durations.find(x=>x.months===Number(form.months)) || durations[3];
  const endDate = useMemo(()=>addMonths(form.startDate,form.months),[form.startDate,form.months]);

  function change(k,v){ setForm(f=>({...f,[k]:v})); }

  function create(type){
    if(!form.clientName.trim()) return alert("يرجى إدخال اسم العميل أو المنشأة.");
    const item = {
      id: crypto.randomUUID(),
      contractNo: nextNo(contracts),
      clientName:form.clientName.trim(),
      startDate:form.startDate,
      endDate,
      months:Number(form.months),
      durationLabel:duration.label,
      clientPhone:form.clientPhone,
      location:form.location,
      email:form.email,
      createdAt:new Date().toISOString()
    };
    setContracts([item,...contracts]);
    if(type==="contract") createContract(item); else createSafetyStatement(item);
  }

  function open(item,type){
    if(type==="contract") createContract(item); else createSafetyStatement(item);
  }

  function remove(id){
    if(confirm("حذف هذا السجل من الجهاز؟")) setContracts(contracts.filter(x=>x.id!==id));
  }

  return <div className="app">
    <header className="topbar">
      <div className="brand">
        <img src="/orkit-logo.svg" alt="ORKIT"/>
        <div><b>نظام عقود الصيانة</b><span>إدارة عقود السلامة والدفاع المدني</span></div>
      </div>
      <div className="header-contact"><Phone size={16}/> 0555334577 - 0500052629</div>
    </header>

    <main className="container">
      <div className="hero">
        <div>
          <div className="eyebrow">ORKIT MAINTENANCE</div>
          <h1>أنشئ عقد الصيانة خلال ثوانٍ</h1>
          <p>أدخل بيانات العميل والمدة والتاريخ، وسيقوم النظام بحساب تاريخ الانتهاء وإنشاء المستند مباشرة بصيغة PDF.</p>
        </div>
        <div className="hero-icon"><ShieldCheck size={42}/></div>
      </div>

      <nav className="tabs">
        <button className={tab==="new"?"active":""} onClick={()=>setTab("new")}><Plus size={18}/> عقد جديد</button>
        <button className={tab==="history"?"active":""} onClick={()=>setTab("history")}><History size={18}/> السجل ({contracts.length})</button>
        <button className={tab==="settings"?"active":""} onClick={()=>setTab("settings")}><Settings size={18}/> بيانات الشركة</button>
      </nav>

      {tab==="new" && <section className="card">
        <div className="section-title"><FileText/><div><h2>بيانات العقد</h2><p>الحقول الأساسية المطلوبة لإنشاء المستند.</p></div></div>
        <div className="grid">
          <label className="field wide"><span>اسم العميل / المنشأة *</span><input value={form.clientName} onChange={e=>change("clientName",e.target.value)} placeholder="مثال: مؤسسة ABC للمقاولات"/></label>
          <label className="field"><span>تاريخ بداية العقد *</span><input type="date" value={form.startDate} onChange={e=>change("startDate",e.target.value)}/></label>
          <label className="field"><span>مدة العقد *</span><select value={form.months} onChange={e=>change("months",e.target.value)}>{durations.map(d=><option key={d.months} value={d.months}>{d.label}</option>)}</select></label>
          <label className="field"><span>رقم جوال العميل</span><input value={form.clientPhone} onChange={e=>change("clientPhone",e.target.value)} placeholder="05xxxxxxxx"/></label>
          <label className="field"><span>موقع المنشأة</span><input value={form.location} onChange={e=>change("location",e.target.value)} placeholder="المدينة - الحي - العنوان"/></label>
          <label className="field wide"><span>البريد الإلكتروني للعميل</span><input type="email" value={form.email} onChange={e=>change("email",e.target.value)} placeholder="customer@example.com"/></label>
        </div>

        <div className="preview">
          <div><span>بداية العقد</span><b>{fmt(form.startDate)}</b></div>
          <div><span>المدة</span><b>{duration.label}</b></div>
          <div><span>النهاية المحسوبة</span><b>{fmt(endDate)}</b></div>
        </div>

        <div className="actions">
          <button className="primary" onClick={()=>create("contract")}><Download size={18}/> إنشاء عقد PDF</button>
          <button className="secondary" onClick={()=>create("safety")}><ShieldCheck size={18}/> إنشاء مشهد سلامة PDF</button>
        </div>
        <p className="note">يتم حفظ سجل العقود على هذا الجهاز فقط في هذه النسخة. لا يتم إرسال بيانات العملاء إلى خادم خارجي.</p>
      </section>}

      {tab==="history" && <section className="card">
        <div className="section-title"><History/><div><h2>العقود السابقة</h2><p>السجلات التي تم إنشاؤها من هذا المتصفح.</p></div></div>
        {contracts.length===0 ? <div className="empty"><FileText size={40}/><h3>لا توجد عقود بعد</h3><p>أنشئ أول عقد من تبويب «عقد جديد».</p></div> :
          <div className="list">{contracts.map(c=><article className="contract-row" key={c.id}>
            <div className="contract-main"><div className="number">{c.contractNo}</div><h3>{c.clientName}</h3><p>{fmt(c.startDate)} → {fmt(c.endDate)} · {c.durationLabel}</p></div>
            <div className="row-actions">
              <button onClick={()=>open(c,"contract")} title="عقد"><FileText size={17}/></button>
              <button onClick={()=>open(c,"safety")} title="مشهد"><ShieldCheck size={17}/></button>
              <button className="danger" onClick={()=>remove(c.id)} title="حذف"><Trash2 size={17}/></button>
            </div>
          </article>)}</div>
        }
      </section>}

      {tab==="settings" && <section className="card">
        <div className="section-title"><Settings/><div><h2>بيانات ورق ORKIT الرسمي</h2><p>هذه البيانات تظهر في رأس وتذييل ملفات PDF.</p></div></div>
        <div className="company-box">
          <img src="/orkit-logo.svg" alt="ORKIT"/>
          <div><b>ORKIT - أوركيت للمقاولات العامة</b><span><MapPin size={15}/> حي الضيافة</span><span><Phone size={15}/> 0555334577 - 0500052629</span><span><Mail size={15}/> ضع البريد الإلكتروني هنا</span></div>
        </div>
        <div className="alert">لتغيير البريد الإلكتروني أو الشعار أو نصوص العقد بشكل دائم، عدّل القيم في <b>src/pdf.js</b> ثم ارفع التعديل إلى GitHub.</div>
      </section>}
    </main>

    <footer>© {new Date().getFullYear()} ORKIT — نظام إدارة عقود الصيانة</footer>
  </div>
}