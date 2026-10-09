import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FileSignature, 
  Users, 
  Cpu, 
  BarChart3, 
  Settings, 
  Plus, 
  Download, 
  Search, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  ChevronRight, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Eye, 
  Trash2, 
  FileSpreadsheet, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  Calendar, 
  RefreshCw, 
  Layers, 
  Menu,
  Check,
  Zap,
  HelpCircle,
  Bell,
  Scan,
  Camera,
  FileCheck2,
  CheckLine,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

const INITIAL_INVOICES = [
  {
    id: "Q-2026-0891",
    supplier: "AZ-TEX Mühəndislik QSC",
    voen: "1401298451",
    date: "2026-10-04",
    contractNo: "MQ-2026-012",
    amount: 14850.00,
    vat: 2673.00,
    status: "mismatch", // ok, warning, mismatch
    statusText: "Mümkün uyğunsuzluq",
    confidence: 98,
    scannedViaAI: true,
    itemCount: 3,
    items: [
      { name: "Sənaye kabeli 4x16mm²", qty: 250, invPrice: 42.00, conPrice: 35.00, unit: "metr", clause: "Bənd 3.1: Elektrik malları üçün xüsusi tarifi" },
      { name: "Qoruyucu avtomat 63A", qty: 40, invPrice: 85.00, conPrice: 85.00, unit: "ədəd", clause: "Bənd 3.2: Standart elektrik cihazı" },
      { name: "Paylayıcı qutu Metal", qty: 10, invPrice: 95.00, conPrice: 95.00, unit: "ədəd", clause: "Bənd 3.3: Metal korpuslar" }
    ],
    discrepancyTotal: 1750.00,
    notes: "Qaimədə kabelin bir metri 42 AZN yazılıb, lakin müqavilədə sabit qiymət 35 AZN təsbit edilib."
  },
  {
    id: "Q-2026-0890",
    supplier: "Baku Tech Solutions MMC",
    voen: "1700983211",
    date: "2026-10-03",
    contractNo: "MQ-2026-004",
    amount: 8200.00,
    vat: 1476.00,
    status: "ok",
    statusText: "Tam uyğundur",
    confidence: 99,
    scannedViaAI: true,
    itemCount: 2,
    items: [
      { name: "Dell Latitude Lisenziyalı Laptop", qty: 4, invPrice: 1800.00, conPrice: 1800.00, unit: "ədəd", clause: "Bənd 2.1: İT avadanlıqlar" },
      { name: "Type-C Docking Station", qty: 4, invPrice: 250.00, conPrice: 250.00, unit: "ədəd", clause: "Bənd 2.4: Aksessuarlar" }
    ],
    discrepancyTotal: 0,
    notes: "Müqavilə şərtlərinə tam uyğundur."
  },
  {
    id: "Q-2026-0889",
    supplier: "Xəzər Logistika və Təchizat MMC",
    voen: "1900445121",
    date: "2026-10-01",
    contractNo: "MQ-2025-089",
    amount: 23400.00,
    vat: 4212.00,
    status: "warning",
    statusText: "Əlavə yoxlama lazımdır",
    confidence: 94,
    scannedViaAI: true,
    itemCount: 2,
    items: [
      { name: "Konteyner Daşınması (Daxili)", qty: 6, invPrice: 3200.00, conPrice: 3000.00, unit: "reys", clause: "Bənd 5.1: Şəhərdaxili daşınma" },
      { name: "Anbar saxlama xidməti", qty: 30, invPrice: 140.00, conPrice: 140.00, unit: "gün", clause: "Bənd 5.3: Günlük saxlama" }
    ],
    discrepancyTotal: 1200.00,
    notes: "Nəqliyyat xərclərində mövsümi indeksasiya tətbiq olunub, xüsusi təsdiq tələb olunur."
  }
];

const INITIAL_CONTRACTS = [
  {
    id: "MQ-2026-012",
    supplier: "AZ-TEX Mühəndislik QSC",
    voen: "1401298451",
    startDate: "2026-01-10",
    endDate: "2026-12-31",
    totalBudget: 150000.00,
    usedBudget: 62050.00,
    status: "Aktiv",
    confidence: 97,
    scannedViaAI: true,
    items: [
      { name: "Sənaye kabeli 4x16mm²", agreedPrice: 35.00, unit: "metr" },
      { name: "Qoruyucu avtomat 63A", agreedPrice: 85.00, unit: "ədəd" },
      { name: "Paylayıcı qutu Metal", agreedPrice: 95.00, unit: "ədəd" },
      { name: "Transformator yağlı 400kVA", agreedPrice: 10300.00, unit: "ədəd" }
    ]
  },
  {
    id: "MQ-2026-004",
    supplier: "Baku Tech Solutions MMC",
    voen: "1700983211",
    startDate: "2026-02-01",
    endDate: "2027-02-01",
    totalBudget: 80000.00,
    usedBudget: 24500.00,
    status: "Aktiv",
    confidence: 99,
    scannedViaAI: true,
    items: [
      { name: "Dell Latitude Lisenziyalı Laptop", agreedPrice: 1800.00, unit: "ədəd" },
      { name: "Type-C Docking Station", agreedPrice: 250.00, unit: "ədəd" },
      { name: "27-inch 4K Monitor", agreedPrice: 650.00, unit: "ədəd" }
    ]
  },
  {
    id: "MQ-2025-089",
    supplier: "Xəzər Logistika və Təchizat MMC",
    voen: "1900445121",
    startDate: "2025-11-01",
    endDate: "2026-11-01",
    totalBudget: 200000.00,
    usedBudget: 142000.00,
    status: "Yenilənməlidir",
    confidence: 95,
    scannedViaAI: true,
    items: [
      { name: "Konteyner Daşınması (Daxili)", agreedPrice: 3000.00, unit: "reys" },
      { name: "Anbar saxlama xidməti", agreedPrice: 140.00, unit: "gün" }
    ]
  }
];

const INITIAL_SUPPLIERS = [
  {
    name: "AZ-TEX Mühəndislik QSC",
    voen: "1401298451",
    contactPerson: "Elşən Məmmədov",
    phone: "+994 50 211 44 55",
    email: "office@aztex.az",
    totalInvoices: 18,
    totalSpent: 62050.00,
    discrepancyCount: 3,
    riskScore: "Yüksək",
    priceHistory: [
      { month: "May", price: 35 },
      { month: "İyun", price: 36 },
      { month: "İyul", price: 38 },
      { month: "Avq", price: 40 },
      { month: "Sen", price: 42 }
    ]
  },
  {
    name: "Baku Tech Solutions MMC",
    voen: "1700983211",
    contactPerson: "Leyla Nəsirova",
    phone: "+994 12 498 77 11",
    email: "sales@bakutech.az",
    totalInvoices: 12,
    totalSpent: 24500.00,
    discrepancyCount: 0,
    riskScore: "Aşağı",
    priceHistory: [
      { month: "May", price: 1800 },
      { month: "İyun", price: 1800 },
      { month: "İyul", price: 1800 },
      { month: "Avq", price: 1800 },
      { month: "Sen", price: 1800 }
    ]
  },
  {
    name: "Xəzər Logistika və Təchizat MMC",
    voen: "1900445121",
    contactPerson: "Rəşad Əliyev",
    phone: "+994 55 330 90 00",
    email: "info@khazar-logistics.az",
    totalInvoices: 24,
    totalSpent: 142000.00,
    discrepancyCount: 2,
    riskScore: "Orta",
    priceHistory: [
      { month: "May", price: 2900 },
      { month: "İyun", price: 3000 },
      { month: "İyul", price: 3000 },
      { month: "Avq", price: 3100 },
      { month: "Sen", price: 3200 }
    ]
  }
];

const MONTHLY_SPEND_DATA = [
  { month: "May", spend: 32000, expected: 30000, discrepancy: 2000 },
  { month: "İyun", spend: 45000, expected: 44000, discrepancy: 1000 },
  { month: "İyul", spend: 38000, expected: 37500, discrepancy: 500 },
  { month: "Avq", spend: 52000, expected: 49000, discrepancy: 3000 },
  { month: "Sen", spend: 48000, expected: 46000, discrepancy: 2000 },
  { month: "Okt", spend: 50850, expected: 47000, discrepancy: 3850 }
];

const SUPPLIER_PIE_DATA = [
  { name: "Xəzər Logistika", value: 142000, color: "#6366F1" },
  { name: "AZ-TEX Mühəndislik", value: 62050, color: "#0EA5E9" },
  { name: "Baku Tech", value: 24500, color: "#10B981" }
];

// PRESET MOCK IMAGE BASE64 DATA FOR TESTING OCR WITHOUT FILE UPLOAD
const SAMPLE_INVOICE_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'><rect width='600' height='750' fill='%23FFFFFF'/><rect x='20' y='20' width='560' height='710' rx='8' stroke='%23CBD5E1' stroke-width='2' stroke-dasharray='4 4'/><text x='40' y='60' font-family='sans-serif' font-size='22' font-weight='bold' fill='%231E293B'>CVP E-QAİMƏ FAKTURA %23Q-2026-9921</text><text x='40' y='90' font-family='sans-serif' font-size='12' fill='%2364748B'>Təchizatçı: AZ-TEX Mühəndislik QSC | VÖEN: 1401298451</text><text x='40' y='110' font-family='sans-serif' font-size='12' fill='%2364748B'>Tarix: 08.10.2026 | Müqavilə ref: MQ-2026-012</text><line x1='40' y1='130' x2='560' y2='130' stroke='%23E2E8F0' stroke-width='2'/><rect x='40' y='150' width='520' height='30' fill='%23F1F5F9'/><text x='50' y='170' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23334155'>Məhsul / Xidmət Adı</text><text x='280' y='170' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23334155'>Miqdar</text><text x='380' y='170' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23334155'>Qiymət</text><text x='480' y='170' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23334155'>Məbləğ</text><text x='50' y='210' font-family='sans-serif' font-size='12' fill='%230F172A'>1. Sənaye kabeli 4x16mm²</text><text x='280' y='210' font-family='sans-serif' font-size='12' fill='%230F172A'>300 metr</text><text x='380' y='210' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23DC2626'>42.00 AZN</text><text x='480' y='210' font-family='sans-serif' font-size='12' fill='%230F172A'>12,600.00 AZN</text><text x='50' y='250' font-family='sans-serif' font-size='12' fill='%230F172A'>2. Qoruyucu avtomat 63A</text><text x='280' y='250' font-family='sans-serif' font-size='12' fill='%230F172A'>20 ədəd</text><text x='380' y='250' font-family='sans-serif' font-size='12' fill='%230F172A'>85.00 AZN</text><text x='480' y='250' font-family='sans-serif' font-size='12' fill='%230F172A'>1,700.00 AZN</text><line x1='40' y1='300' x2='560' y2='300' stroke='%23E2E8F0' stroke-width='2'/><text x='380' y='330' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23334155'>Cəmi:</text><text x='480' y='330' font-family='sans-serif' font-size='13' font-weight='bold' fill='%230F172A'>14,300.00 AZN</text><text x='380' y='355' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23334155'>ƏDV (18%):</text><text x='480' y='355' font-family='sans-serif' font-size='13' fill='%230F172A'>2,574.00 AZN</text><text x='380' y='385' font-family='sans-serif' font-size='15' font-weight='bold' fill='%234F46E5'>YEKUN:</text><text x='480' y='385' font-family='sans-serif' font-size='15' font-weight='bold' fill='%234F46E5'>16,874.00 AZN</text><rect x='40' y='430' width='520' height='80' rx='6' fill='%23FEF2F2' stroke='%23FCA5A5'/><text x='60' y='460' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23991B1B'>[AI Skaner Yoxlaması]:</text><text x='60' y='480' font-family='sans-serif' font-size='11' fill='%23B91C1C'>Kabel qiyməti müqavilədə 35 AZN/m təsbit edildiyi halda 42 AZN/m yazılmışdır (+2,100 AZN fərq).</text></svg>";

const SAMPLE_CONTRACT_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750' fill='none'><rect width='600' height='750' fill='%23FFFFFF'/><rect x='20' y='20' width='560' height='710' rx='8' stroke='%23CBD5E1' stroke-width='2'/><text x='180' y='70' font-family='sans-serif' font-size='20' font-weight='bold' fill='%231E293B'>SATIN ALMA MÜQAVİLƏSİ</text><text x='210' y='95' font-family='sans-serif' font-size='14' font-weight='bold' fill='%234F46E5'>№ MQ-2026-099</text><text x='40' y='140' font-family='sans-serif' font-size='12' fill='%23334155'>Bakı şəhəri</text><text x='420' y='140' font-family='sans-serif' font-size='12' fill='%23334155'>Tarix: 01 oktyabr 2026</text><text x='40' y='180' font-family='sans-serif' font-size='12' font-weight='bold' fill='%230F172A'>Tərəflər:</text><text x='40' y='205' font-family='sans-serif' font-size='11' fill='%23334155'>Tərəf 1 (Sifarişçi): UcotAI MMC | VÖEN: 9900112233</text><text x='40' y='225' font-family='sans-serif' font-size='11' fill='%23334155'>Tərəf 2 (İcraçı): Baku Tech Solutions MMC | VÖEN: 1700983211</text><line x1='40' y1='250' x2='560' y2='250' stroke='%23E2E8F0' stroke-width='2'/><text x='40' y='280' font-family='sans-serif' font-size='13' font-weight='bold' fill='%230F172A'>Bənd 1. Müqavilənin Mövzusu və Qiymətlər:</text><text x='40' y='310' font-family='sans-serif' font-size='11' fill='%23334155'>1.1. 27-inch 4K Peşəkar Monitor - Sabit vahid qiyməti: 650.00 AZN (ƏDV daxil)</text><text x='40' y='330' font-family='sans-serif' font-size='11' fill='%23334155'>1.2. Mexaniki Klaviatura RGB - Sabit vahid qiyməti: 120.00 AZN (ƏDV daxil)</text><text x='40' y='350' font-family='sans-serif' font-size='11' fill='%23334155'>1.3. Ergonomik Ofis Oturacağı - Sabit vahid qiyməti: 380.00 AZN (ƏDV daxil)</text><text x='40' y='390' font-family='sans-serif' font-size='13' font-weight='bold' fill='%230F172A'>Bənd 2. Müddət və Cərimələr:</text><text x='40' y='415' font-family='sans-serif' font-size='11' fill='%23334155'>2.1. Müqavilə 01.10.2026 tarixindən 01.10.2027 tarixinədək quvvədədir.</text><text x='40' y='435' font-family='sans-serif' font-size='11' fill='%23334155'>2.2. Razılaşdırılmış qiymətdən yüksək hesablanmış qaimələr dərhal imtina edilir.</text><text x='40' y='470' font-family='sans-serif' font-size='12' font-weight='bold' fill='%230F172A'>Ümumi Maksimum Büdcə Limiti: 95,000.00 AZN</text></svg>";

export default function App() {
  const [activeTab, setActiveTab] = useState('icmal');
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  
  // UI State Controls
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals & Drawers
  const [isUploadInvoiceModalOpen, setIsUploadInvoiceModalOpen] = useState(false);
  const [isUploadContractModalOpen, setIsUploadContractModalOpen] = useState(false);
  const [activeInvoiceDetail, setActiveInvoiceDetail] = useState(null);
  const [activeSupplierDetail, setActiveSupplierDetail] = useState(null);
  
  // AI OCR Scanner State for Invoices
  const [invScanFile, setInvScanFile] = useState(null);
  const [invScanPreview, setInvScanPreview] = useState(null);
  const [isInvScanning, setIsInvScanning] = useState(false);
  const [invScanStep, setInvScanStep] = useState('');
  const [extractedInvoiceData, setExtractedInvoiceData] = useState(null);

  // AI OCR Scanner State for Contracts
  const [conScanFile, setConScanFile] = useState(null);
  const [conScanPreview, setConScanPreview] = useState(null);
  const [isConScanning, setIsConScanning] = useState(false);
  const [conScanStep, setConScanStep] = useState('');
  const [extractedContractData, setExtractedContractData] = useState(null);

  // AI Cross-Audit Scan Simulator State
  const [isAuditScanning, setIsAuditScanning] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [scanNotification, setScanNotification] = useState(null);

  const stats = useMemo(() => {
    const totalCount = invoices.length;
    const okCount = invoices.filter(i => i.status === 'ok').length;
    const mismatchCount = invoices.filter(i => i.status === 'mismatch' || i.status === 'warning').length;
    const supplierCount = suppliers.length;
    const totalDiscrepancyAmount = invoices.reduce((acc, curr) => acc + (curr.discrepancyTotal || 0), 0);

    return {
      totalCount,
      okCount,
      mismatchCount,
      supplierCount,
      totalDiscrepancyAmount
    };
  }, [invoices, suppliers]);

  // Function calling Gemini API for true Vision OCR analysis if API key available or fallback
  const processImageWithGeminiAPI = async (imageBase64, type = "invoice") => {
    const apiKey = ""; // Canvas runtime automatically supplies key if configured
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const rawBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    let promptText = "";
    if (type === "invoice") {
      promptText = `You are a professional accountant AI. Analyze this invoice photo/document carefully.
Extract the following JSON strictly with no markdown tags:
{
  "id": "Q-2026-9921",
  "supplier": "Supplier Name",
  "voen": "Supplier Tax ID Number (10 digits)",
  "date": "YYYY-MM-DD",
  "contractNo": "MQ-2026-012",
  "amount": 14300.00,
  "vat": 2574.00,
  "items": [
    { "name": "Item Name", "qty": 300, "invPrice": 42.00, "unit": "metr" }
  ]
}`;
    } else {
      promptText = `You are a legal contract AI auditor. Analyze this contract document image.
Extract the following JSON strictly with no markdown tags:
{
  "id": "MQ-2026-099",
  "supplier": "Baku Tech Solutions MMC",
  "voen": "1700983211",
  "startDate": "2026-10-01",
  "endDate": "2027-10-01",
  "totalBudget": 95000.00,
  "items": [
    { "name": "27-inch 4K Peşəkar Monitor", "agreedPrice": 650.00, "unit": "ədəd" }
  ]
}`;
    }

    try {
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: rawBase64
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("API Call Failed");
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        // Clean JSON string
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
      }
    } catch (err) {
      console.log("Using intelligent vision parsing fallback demo...");
    }
    return null; // Trigger intelligent fallback
  };

  const handleInvoiceImageScan = async (imageSrc) => {
    setIsInvScanning(true);
    setInvScanStep('Sənəd şəkli yüklənir...');
    
    await new Promise(r => setTimeout(r, 600));
    setInvScanStep('AI Görünüş modeli şəkil konturlarını çıxarır (OCR)...');
    
    await new Promise(r => setTimeout(r, 800));
    setInvScanStep('Təchizatçı adı və VÖEN identifikasiya edilir...');
    
    await new Promise(r => setTimeout(r, 800));
    setInvScanStep('Məhsul cədvəli və ƏDV faizləri təhlil olunur...');

    let apiExtracted = await processImageWithGeminiAPI(imageSrc, "invoice");

    if (!apiExtracted) {
      // Mock Fallback structured result for realistic demo
      apiExtracted = {
        id: `Q-2026-${Math.floor(8000 + Math.random() * 1900)}`,
        supplier: "AZ-TEX Mühəndislik QSC",
        voen: "1401298451",
        date: new Date().toISOString().slice(0, 10),
        contractNo: "MQ-2026-012",
        amount: 14300.00,
        vat: 2574.00,
        items: [
          { name: "Sənaye kabeli 4x16mm²", qty: 300, invPrice: 42.00, unit: "metr" },
          { name: "Qoruyucu avtomat 63A", qty: 20, invPrice: 85.00, unit: "ədəd" }
        ]
      };
    }

    setExtractedInvoiceData({
      ...apiExtracted,
      confidence: 98.4
    });

    setIsInvScanning(false);
    setInvScanStep('');
  };

  const handleContractImageScan = async (imageSrc) => {
    setIsConScanning(true);
    setConScanStep('Müqavilə skanı oxunur...');
    
    await new Promise(r => setTimeout(r, 600));
    setConScanStep('Hüquqi tərəflər və VÖEN müəyyənləşdirilir...');
    
    await new Promise(r => setTimeout(r, 800));
    setConScanStep('Vahid qiymət maddələri və büdcə limiti çıxarılır...');

    let apiExtracted = await processImageWithGeminiAPI(imageSrc, "contract");

    if (!apiExtracted) {
      // Mock Fallback structured contract result
      apiExtracted = {
        id: `MQ-2026-0${Math.floor(50 + Math.random() * 40)}`,
        supplier: "Baku Tech Solutions MMC",
        voen: "1700983211",
        startDate: "2026-10-01",
        endDate: "2027-10-01",
        totalBudget: 95000.00,
        items: [
          { name: "27-inch 4K Peşəkar Monitor", agreedPrice: 650.00, unit: "ədəd" },
          { name: "Mexaniki Klaviatura RGB", agreedPrice: 120.00, unit: "ədəd" },
          { name: "Ergonomik Ofis Oturacağı", agreedPrice: 380.00, unit: "ədəd" }
        ]
      };
    }

    setExtractedContractData({
      ...apiExtracted,
      confidence: 97.8
    });

    setIsConScanning(false);
    setConScanStep('');
  };

  const handleSaveExtractedInvoice = () => {
    if (!extractedInvoiceData) return;

    // Cross reference with contracts to calculate real discrepancy
    const matchingContract = contracts.find(c => c.voen === extractedInvoiceData.voen || c.id === extractedInvoiceData.contractNo);
    
    let discrepancyTotal = 0;
    const processedItems = extractedInvoiceData.items.map(item => {
      let conPrice = item.invPrice;
      let clause = "Standart bazar qiyməti";
      
      if (matchingContract) {
        const matchedItem = matchingContract.items.find(ci => ci.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(ci.name.toLowerCase()));
        if (matchedItem) {
          conPrice = matchedItem.agreedPrice;
          clause = `Müqavilə ${matchingContract.id} üzrə təsdiqlənmiş tarif`;
        }
      }

      const diff = (item.invPrice - conPrice) * item.qty;
      if (diff > 0) discrepancyTotal += diff;

      return {
        ...item,
        conPrice,
        clause
      };
    });

    const status = discrepancyTotal > 0 ? 'mismatch' : 'ok';
    const statusText = discrepancyTotal > 0 ? 'Mümkün uyğunsuzluq' : 'Tam uyğundur';

    const newInvRecord = {
      ...extractedInvoiceData,
      status,
      statusText,
      scannedViaAI: true,
      items: processedItems,
      discrepancyTotal,
      notes: discrepancyTotal > 0 
        ? `Süni İntellekt Tərəfindən Aşkar Edilib: Müqavilə qiymətindən ${discrepancyTotal.toFixed(2)} AZN artıq xərc hesablanıb.` 
        : "Süni İntellekt Şəkili Tam Analiz Etmişdir. Müqavilə şərtlərinə 100% uyğundur."
    };

    setInvoices([newInvRecord, ...invoices]);
    
    // Close modal & notify
    setIsUploadInvoiceModalOpen(false);
    setInvScanFile(null);
    setInvScanPreview(null);
    setExtractedInvoiceData(null);

    setScanNotification({
      title: "Qaimə AI Şəkil Skanı Tamamlandı!",
      message: `${newInvRecord.id} nömrəli qaimə uğurla çıxarıldı və ${discrepancyTotal > 0 ? `${discrepancyTotal.toFixed(2)} AZN fərq tapıldı` : 'müqaviləyə uyğun tapıldı'}.`,
      type: discrepancyTotal > 0 ? "warning" : "success"
    });
    setTimeout(() => setScanNotification(null), 6000);
  };

  const handleSaveExtractedContract = () => {
    if (!extractedContractData) return;

    const newConRecord = {
      ...extractedContractData,
      usedBudget: 0,
      status: "Aktiv",
      scannedViaAI: true
    };

    setContracts([newConRecord, ...contracts]);

    setIsUploadContractModalOpen(false);
    setConScanFile(null);
    setConScanPreview(null);
    setExtractedContractData(null);

    setScanNotification({
      title: "Müqavilə AI Şəkil Skanı Tamamlandı!",
      message: `${newConRecord.id} nömrəli müqavilə və ${newConRecord.items.length} vahid qiymət maddəsi bazaya əlavə edildi.`,
      type: "success"
    });
    setTimeout(() => setScanNotification(null), 6000);
  };

  const handleTriggerAIScan = () => {
    setIsAuditScanning(true);
    setAuditProgress(15);
    
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setAuditProgress(100);
      setIsAuditScanning(false);
      
      setScanNotification({
        title: "AI Çarpaz Audit Tamamlandı!",
        message: `${invoices.length} qaimə və ${contracts.length} müqavilə skan edildi. ${stats.mismatchCount} qiymət kənarlaşması müəyyən olundu.`,
        type: "success"
      });

      setTimeout(() => setScanNotification(null), 5000);
    }, 2000);
  };

  const handleExportExcel = () => {
    const invoicesToExport = selectedInvoices.length > 0 
      ? invoices.filter(inv => selectedInvoices.includes(inv.id))
      : invoices;

    if (typeof window !== 'undefined') {
      if (!window.XLSX) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
        script.onload = () => processExcelExport(invoicesToExport);
        document.body.appendChild(script);
      } else {
        processExcelExport(invoicesToExport);
      }
    }
  };

  const processExcelExport = (data) => {
    try {
      const exportRows = [];
      data.forEach(inv => {
        inv.items.forEach(item => {
          exportRows.push({
            "Qaimə №": inv.id,
            "Təchizatçı": inv.supplier,
            "VÖEN": inv.voen,
            "Müqavilə №": inv.contractNo,
            "Tarix": inv.date,
            "Məhsul / Xidmət": item.name,
            "Miqdar": item.qty,
            "Ölçü Vahidi": item.unit,
            "Qaimə Qiyməti (AZN)": item.invPrice,
            "Müqavilə Qiyməti (AZN)": item.conPrice,
            "Fərq (AZN)": ((item.invPrice - item.conPrice) * item.qty).toFixed(2),
            "Status": inv.statusText,
            "AI OCR Dəqiqlik": `${inv.confidence || 98}%`,
            "Əsaslandırma / Bənd": item.clause || "Məlumat yoxdur"
          });
        });
      });

      const worksheet = window.XLSX.utils.json_to_sheet(exportRows);
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, worksheet, "Qaimə_AI_Analiz");
      window.XLSX.writeFile(workbook, `UcotAI_Qaimeler_Hesabat_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (err) {
      alert("Excel faylı yaradılarkən xəta baş verdi.");
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inv.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inv.voen.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row antialiased">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">Ucot<span className="text-indigo-600">AI</span></span>
            <span className="text-[10px] block font-medium text-slate-500 uppercase tracking-wider">Ağıllı Mühasibatlıq</span>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 transform transition-transform duration-200 ease-in-out flex flex-col
        md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* BRAND LOGO */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-sky-500 text-white p-2.5 rounded-2xl shadow-indigo-200 shadow-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1">
                Ucot<span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-xs font-semibold text-slate-400">AI Skaner & Audit</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DEMO TAG BADGE */}
        <div className="mx-4 mt-4 px-3 py-2 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span className="text-xs font-semibold text-indigo-900">OCR & Vision Modeli Aktiv</span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="p-4 space-y-1.5 flex-1">
          {[
            { id: 'icmal', label: 'İcmal', icon: LayoutDashboard },
            { id: 'qaimeler', label: 'Qaimələr', icon: FileText, badge: invoices.length },
            { id: 'muqavileler', label: 'Müqavilələr', icon: FileSignature, badge: contracts.length },
            { id: 'ai-analiz', label: 'AI Analizi', icon: Sparkles, highlight: true },
            { id: 'techizatcilar', label: 'Təchizatçılar', icon: Users, badge: suppliers.length },
            { id: 'hesabatlar', label: 'Hesabatlar', icon: BarChart3 },
            { id: 'parametrler', label: 'Parametrlər', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : item.highlight 
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100/70 border border-amber-200/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded">
                    Yeni
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER / PROFILE */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              FA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Finans Departament</p>
              <p className="text-[11px] text-slate-500 truncate">admin@ucot.az</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {activeTab === 'icmal' && 'İcmal İdarəetmə Paneli'}
              {activeTab === 'qaimeler' && 'Qaimələrin İdarə Olunması & AI OCR'}
              {activeTab === 'muqavileler' && 'Müqavilələr Reyestri & AI Skan'}
              {activeTab === 'ai-analiz' && 'AI Uyğunsuzluq Auditi'}
              {activeTab === 'techizatcilar' && 'Təchizatçılar Portalı'}
              {activeTab === 'hesabatlar' && 'Maliyyə & Şəffaflıq Hesabatları'}
              {activeTab === 'parametrler' && 'Sistem Parametrləri'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Qaimə və müqavilə şəkillərindən avtomatik məlumat çıxarılıb müqayisə olunur.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerAIScan}
              disabled={isAuditScanning}
              className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAuditScanning ? 'animate-spin' : ''}`} />
              <span>{isAuditScanning ? 'Çarpaz Audit...' : 'AI Çarpaz Audit'}</span>
            </button>

            <button
              onClick={() => setIsUploadInvoiceModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Scan className="w-4 h-4 text-amber-300" />
              <span>Qaimə Şəkli Skan Et</span>
            </button>
          </div>
        </header>

        {/* NOTIFICATION TOAST BANNER */}
        {scanNotification && (
          <div className="m-6 mb-0 p-4 bg-indigo-900 text-white rounded-2xl shadow-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-700 rounded-xl">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{scanNotification.title}</h4>
                <p className="text-xs text-indigo-200 mt-0.5">{scanNotification.message}</p>
              </div>
            </div>
            <button onClick={() => setScanNotification(null)} className="p-1 hover:bg-indigo-800 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCAN PROGRESS BAR */}
        {isAuditScanning && (
          <div className="px-6 pt-4">
            <div className="bg-white border border-indigo-100 p-4 rounded-2xl shadow-sm space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  Süni İntellekt müqavilə bəndləri ilə qaimələri çarpaz yoxlayır...
                </span>
                <span className="text-indigo-600 font-bold">{auditProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${auditProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENTS */}
        <div className="p-6 space-y-6">

          {/* ==================== 1. ICMAL (DASHBOARD) ==================== */}
          {activeTab === 'icmal' && (
            <div className="space-y-6">
              
              {/* AI OCR BANNER PROMO */}
              <div className="p-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shrink-0">
                    <Scan className="w-8 h-8 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Əllə Məlumat Daxil Etməyə Ehtiyac Yoxdur!</h3>
                    <p className="text-xs text-indigo-100 mt-1">
                      Qaimə və müqavilələrin <b>şəkillərini və ya PDF skanlarını</b> yükləyin. Süni İntellekt (Gemini Vision) VÖEN, məhsul qiymətlərini və ƏDV-ni avtomatik olaraq cədvələ çevirir.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsUploadInvoiceModalOpen(true)}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" /> Qaimə Skan Et
                  </button>
                  <button
                    onClick={() => setIsUploadContractModalOpen(true)}
                    className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-colors"
                  >
                    Müqavilə Skan Et
                  </button>
                </div>
              </div>

              {/* STAT CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Ümumi qaimələr</span>
                    <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">{stats.totalCount}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Cari ay üçün daxil olan</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Yoxlanılmış</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">{stats.okCount}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center">
                      {(stats.okCount / stats.totalCount * 100).toFixed(0)}% tam uyğun
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Şərtlərə 100% cavab verən</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-shadow bg-gradient-to-b from-rose-50/30 to-transparent">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Uyğunsuz Qaimə</span>
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-rose-900">{stats.mismatchCount}</span>
                    <span className="text-xs font-bold text-rose-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Diqqət
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600/80 mt-2 font-medium">Kənarlaşma aşkar olunub</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Təchizatçılar</span>
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">{stats.supplierCount}</span>
                    <span className="text-xs font-bold text-slate-500">Aktiv müqavilə</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">VÖEN üzrə qeydiyyatlı</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md">
                  <div className="flex items-center justify-between text-indigo-200 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Maliyyə Fərqi</span>
                    <div className="p-2 bg-indigo-800/80 text-amber-300 rounded-xl">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {stats.totalDiscrepancyAmount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-indigo-300">AZN</span>
                  </div>
                  <p className="text-[11px] text-indigo-200/80 mt-2 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI İqtisadi Qənaət Potensialı
                  </p>
                </div>

              </div>

              {/* CHARTS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Aylıq Xərclər və AI Fərq Dinamikası</h3>
                      <p className="text-xs text-slate-500">Faktiki xərc vs Müqavilə üzrə gözlənilən xərc (AZN)</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">2026-cı il</span>
                  </div>

                  <div className="h-72 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MONTHLY_SPEND_DATA}>
                        <defs>
                          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748B'}} />
                        <YAxis tick={{fontSize: 12, fill: '#64748B'}} width={60} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                          formatter={(val) => [`${val.toLocaleString()} AZN`, '']}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="spend" name="Faktiki Xərc" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpend)" />
                        <Area type="monotone" dataKey="expected" name="Müqavilə Qiyməti" stroke="#0EA5E9" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorExpected)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* PIE CHART - SUPPLIERS BREAKDOWN */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Təchizatçılar üzrə Alış Həcmi</h3>
                    <p className="text-xs text-slate-500">Ümumi büdcə paylanması</p>
                  </div>

                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={SUPPLIER_PIE_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {SUPPLIER_PIE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                          formatter={(val) => [`${val.toLocaleString()} AZN`, 'Məbləğ']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {SUPPLIER_PIE_DATA.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                          <span className="text-slate-700 font-medium truncate max-w-[120px]">{s.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{s.value.toLocaleString()} AZN</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RECENT ACTIVITY TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Son Skan Edilmiş Qaimələr</h3>
                    <p className="text-xs text-slate-500">AI OCR ilə oxunmuş sənədlər</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('qaimeler')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    Bütün qaimələr <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Qaimə №</th>
                        <th className="py-3 px-4">Təchizatçı</th>
                        <th className="py-3 px-4">Tarix</th>
                        <th className="py-3 px-4">Məbləğ (AZN)</th>
                        <th className="py-3 px-4">AI Dəqiqlik</th>
                        <th className="py-3 px-4">AI Audit Statusu</th>
                        <th className="py-3 px-4 text-right">Əməliyyat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {invoices.slice(0, 4).map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-indigo-600 flex items-center gap-1.5">
                            {inv.scannedViaAI && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                            {inv.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{inv.supplier}</div>
                            <div className="text-[10px] text-slate-400">VÖEN: {inv.voen}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {inv.amount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} AZN
                          </td>
                          <td className="py-3.5 px-4 font-bold text-indigo-700">
                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md">
                              {inv.confidence || 98}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              inv.status === 'ok' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : inv.status === 'warning'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {inv.status === 'ok' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {inv.status === 'warning' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                              {inv.status === 'mismatch' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                              {inv.statusText}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button 
                              onClick={() => setActiveInvoiceDetail(inv)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Bax
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== 2. QAİMƏLƏR (INVOICES & AI SCAN) ==================== */}
          {activeTab === 'qaimeler' && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Qaimə №, təchizatçı adı və ya VÖEN ilə axtarış..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-2 bg-slate-50 p-1 border border-slate-200 rounded-xl text-xs">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${statusFilter === 'all' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-600'}`}
                    >
                      Bütünü ({invoices.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('ok')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${statusFilter === 'ok' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                    >
                      Uyğun
                    </button>
                    <button
                      onClick={() => setStatusFilter('mismatch')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${statusFilter === 'mismatch' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                    >
                      Uyğunsuzluq
                    </button>
                  </div>

                  <button
                    onClick={() => setIsUploadInvoiceModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Şəkillə Qaimə Skan Et</span>
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Excel-ə köçür</span>
                  </button>
                </div>
              </div>

              {/* QAİMƏLƏR TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedInvoices(filteredInvoices.map(i => i.id));
                              } else {
                                setSelectedInvoices([]);
                              }
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        <th className="py-3 px-4">Qaimə №</th>
                        <th className="py-3 px-4">Təchizatçı & VÖEN</th>
                        <th className="py-3 px-4">Müqavilə Kodu</th>
                        <th className="py-3 px-4">Tarix</th>
                        <th className="py-3 px-4">Məbləğ (AZN)</th>
                        <th className="py-3 px-4">AI Skan</th>
                        <th className="py-3 px-4">AI Audit Statusu</th>
                        <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="py-8 text-center text-slate-400">
                            Axtarışa uyğun qaimə tapılmadı.
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((inv) => {
                          const isSelected = selectedInvoices.includes(inv.id);
                          return (
                            <tr key={inv.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                              <td className="py-3.5 px-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      setSelectedInvoices(selectedInvoices.filter(id => id !== inv.id));
                                    } else {
                                      setSelectedInvoices([...selectedInvoices, inv.id]);
                                    }
                                  }}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              </td>
                              <td className="py-3.5 px-4 font-bold text-indigo-600 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                {inv.id}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900">{inv.supplier}</div>
                                <div className="text-[10px] text-slate-400">VÖEN: {inv.voen}</div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-600">{inv.contractNo}</td>
                              <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                              <td className="py-3.5 px-4 font-black text-slate-900">
                                {inv.amount.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} AZN
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-[10px] flex items-center gap-1 w-max">
                                  <CheckCircle2 className="w-3 h-3" /> {inv.confidence || 98}% OCR
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  inv.status === 'ok' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : inv.status === 'warning'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {inv.status === 'ok' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                  {inv.status === 'warning' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                                  {inv.status === 'mismatch' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                                  {inv.statusText}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1">
                                <button
                                  onClick={() => setActiveInvoiceDetail(inv)}
                                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Detallı Bax"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setInvoices(invoices.filter(i => i.id !== inv.id))}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================== 3. MÜQAVİLƏLƏR (CONTRACTS & AI SCAN) ==================== */}
          {activeTab === 'muqavileler' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <h3 className="font-bold text-slate-900">Aktiv Müqavilələr Reyestri</h3>
                  <p className="text-xs text-slate-500">Müqavilə şəkillərindən avtomatik təsbit olunan qiymət siyahısı.</p>
                </div>
                <button
                  onClick={() => setIsUploadContractModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>Müqavilə Şəkli Skan Et</span>
                </button>
              </div>

              {/* CONTRACT CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contracts.map((con) => (
                  <div key={con.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
                    
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-mono">
                            {con.id}
                          </span>
                          {con.scannedViaAI && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" /> AI OCR Skan
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1.5">{con.supplier}</h4>
                        <p className="text-xs text-slate-400">VÖEN: {con.voen}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        con.status === 'Aktiv' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {con.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Müddət:</span>
                        <span className="font-semibold text-slate-700">{con.startDate} — {con.endDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Ümumi Büdcə Limit:</span>
                        <span className="font-bold text-slate-900">{con.totalBudget.toLocaleString()} AZN</span>
                      </div>
                    </div>

                    {/* ITEMS PRICE TABLE IN CONTRACT */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Razılaşdırılmış Qiymət Siyahısı ({con.items.length} məhsul)
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {con.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200/60">
                            <span className="font-medium text-slate-800">{it.name}</span>
                            <span className="font-black text-indigo-600">{it.agreedPrice} AZN / {it.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================== 4. AI ANALİZİ ==================== */}
          {activeTab === 'ai-analiz' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">AI Çarpaz Müqayisə və Qiymət Auditi Modulu</h3>
                    <p className="text-xs text-indigo-200">UcotAI qaimə şəkildən oxuduğu qiyməti rəsmi müqavilə şərtləri ilə avtomatik tutuşdurur.</p>
                  </div>
                </div>
              </div>

              {/* DETAILED DISCREPANCY CARDS */}
              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div key={inv.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`p-2 rounded-xl ${
                          inv.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : inv.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {inv.status === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            {inv.supplier}
                            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">[{inv.id}]</span>
                          </h4>
                          <p className="text-xs text-slate-400">Müqavilə: {inv.contractNo} | Tarix: {inv.date}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Qiymət Kənarlaşması</span>
                        <span className={`text-base font-black ${inv.discrepancyTotal > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {inv.discrepancyTotal > 0 ? `+${inv.discrepancyTotal.toLocaleString()} AZN` : '0.00 AZN (Tam dəqiq)'}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Məhsul / Xidmət</th>
                            <th className="py-2.5 px-3">Miqdar</th>
                            <th className="py-2.5 px-3">Qaimə Qiyməti</th>
                            <th className="py-2.5 px-3">Müqavilə Şərti</th>
                            <th className="py-2.5 px-3">Fərq</th>
                            <th className="py-2.5 px-3">Müqavilə Bəndi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {inv.items.map((item, idx) => {
                            const diff = (item.invPrice - item.conPrice) * item.qty;
                            const isDiscrepant = item.invPrice > item.conPrice;
                            return (
                              <tr key={idx} className={isDiscrepant ? 'bg-rose-50/40' : ''}>
                                <td className="py-3 px-3 font-semibold text-slate-800">{item.name}</td>
                                <td className="py-3 px-3 text-slate-600">{item.qty} {item.unit}</td>
                                <td className={`py-3 px-3 font-bold ${isDiscrepant ? 'text-rose-600' : 'text-slate-900'}`}>
                                  {item.invPrice.toFixed(2)} AZN
                                </td>
                                <td className="py-3 px-3 font-bold text-emerald-700">{item.conPrice.toFixed(2)} AZN</td>
                                <td className="py-3 px-3">
                                  {diff > 0 ? (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold rounded-md text-[11px]">
                                      +{diff.toFixed(2)} AZN
                                    </span>
                                  ) : (
                                    <span className="text-emerald-600 font-bold">Uyğundur</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-slate-500 italic">{item.clause || "Məlumat yoxdur"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {inv.notes && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start space-x-2 text-xs text-slate-700">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-indigo-900 block">UcotAI Şərhi və Tövsiyəsi:</span>
                          <span>{inv.notes}</span>
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================== 5. TƏCHİZATÇILAR ==================== */}
          {activeTab === 'techizatcilar' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((sup) => (
                  <div key={sup.voen} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        sup.riskScore === 'Yüksək' ? 'bg-rose-100 text-rose-800' : sup.riskScore === 'Orta' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Risk: {sup.riskScore}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{sup.name}</h4>
                      <p className="text-xs text-slate-400">VÖEN: {sup.voen}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Məsul Şəxs:</span>
                        <span className="font-semibold text-slate-800">{sup.contactPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ümumi Alış:</span>
                        <span className="font-bold text-slate-900">{sup.totalSpent.toLocaleString()} AZN</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Xəta Sayı:</span>
                        <span className={`font-bold ${sup.discrepancyCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {sup.discrepancyCount} uyğunsuzluq
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveSupplierDetail(sup)}
                      className="w-full py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Təchizatçı Profilinə Bax
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================== 6. HESABATLAR ==================== */}
          {activeTab === 'hesabatlar' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Rüblük və İllik Mühasibat Hesabatı</h3>
                    <p className="text-xs text-slate-500">Müqavilə kənarlaşmaları və büdcəyə qənaət balansı</p>
                  </div>
                  <button onClick={handleExportExcel} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl">
                    <Download className="w-4 h-4" />
                    <span>Hesabatı Endir (.XLSX)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-xs text-slate-400 block font-medium">Toplam Skan Olunan Qaimə</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">142 ədəd</span>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">98.2% Vision Dəqiqlik dərəcəsi</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-xs text-slate-400 block font-medium">Aşkar edilən Süni Qiymət Artımı</span>
                    <span className="text-xl font-black text-rose-600 mt-1 block">14 qaimədə</span>
                    <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Cəmi: 3,850.50 AZN artıq xərc</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-xs text-slate-400 block font-medium">UcotAI Tərəfindən Qorunan Büdcə</span>
                    <span className="text-xl font-black text-indigo-600 mt-1 block">3,850.50 AZN</span>
                    <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">100% Qeri qaytarılma tələbi</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 7. PARAMETRLƏR ==================== */}
          {activeTab === 'parametrler' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs max-w-3xl space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">UcotAI Analiz & OCR Parametrləri</h3>
                <p className="text-xs text-slate-500">Süni intellekt görsellik və həssaslıq parametrləri.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
                  <label className="font-bold text-slate-800 block">Məbləğ Həssaslığı Həddi (AZN)</label>
                  <p className="text-slate-500">Müqavilədən neçə AZN-dən çox kənarlaşma olduqda xəbərdarlıq bayrağı qoyulsun?</p>
                  <input type="number" defaultValue="5" className="px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold w-32" />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
                  <label className="font-bold text-slate-800 block">Gemini Vision OCR Avto-Tamamlama</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                    <span className="text-slate-700">Şəkillərdən VÖEN və cədvəl sətirlərini avtomatik struktura sal</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert("Parametrlər yadda saxlanıldı.")}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Yadda Saxla
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==================== MODALS & DRAWERS WITH REAL PHOTO OCR ==================== */}

      {/* 1. QAİMƏ PHOTO OCR SCANNER MODAL */}
      {isUploadInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-scale-up my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Qaimə Şəkli Skaner (AI OCR)</h3>
                  <p className="text-xs text-slate-400">Şəkil və ya skan edilmiş PDF yükləyin, AI bütün məlumatları çıxaracaq</p>
                </div>
              </div>
              <button onClick={() => {
                setIsUploadInvoiceModalOpen(false);
                setInvScanPreview(null);
                setExtractedInvoiceData(null);
              }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRESET SAMPLE TEST BUTTON */}
            {!invScanPreview && !extractedInvoiceData && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Şəkiliniz yoxdur? Hazır nümunə qaimə şəkli ilə AI-ni yoxlayın:</span>
                </div>
                <button
                  onClick={() => {
                    setInvScanPreview(SAMPLE_INVOICE_IMAGE);
                    handleInvoiceImageScan(SAMPLE_INVOICE_IMAGE);
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-xl transition-colors shrink-0"
                >
                  Nümunə Şəkillə Test Et
                </button>
              </div>
            )}

            {/* FILE UPLOAD DROPZONE */}
            {!invScanPreview && (
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 rounded-2xl p-8 text-center space-y-3 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  id="inv-file-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setInvScanPreview(reader.result);
                        handleInvoiceImageScan(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="inv-file-input" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Qaimə şəklinizi buraya yükləyin</p>
                  <p className="text-slate-400 text-xs">JPG, PNG, WEBP (və ya kamera şəkli)</p>
                </label>
              </div>
            )}

            {/* SCANNING PROGRESS OVERLAY */}
            {isInvScanning && (
              <div className="p-6 bg-indigo-950 text-white rounded-2xl text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-amber-300 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-amber-300">Süni İntellekt Şəkli Təhlil Edir...</h4>
                  <p className="text-xs text-indigo-200 mt-1">{invScanStep}</p>
                </div>
              </div>
            )}

            {/* PREVIEW & EXTRACTED DATA REVIEW PANEL */}
            {invScanPreview && !isInvScanning && extractedInvoiceData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* LEFT: IMAGE PREVIEW */}
                <div className="bg-slate-900 rounded-2xl p-3 flex flex-col justify-between space-y-2 overflow-hidden border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Skan Edilən Sənəd Vizualı
                  </span>
                  <div className="max-h-64 overflow-hidden rounded-xl border border-slate-700 bg-black flex items-center justify-center">
                    <img src={invScanPreview} alt="Scanned Invoice" className="object-contain max-h-64 w-full" />
                  </div>
                  <button
                    onClick={() => {
                      setInvScanPreview(null);
                      setExtractedInvoiceData(null);
                    }}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 text-center py-1"
                  >
                    Başqa şəkil seç
                  </button>
                </div>

                {/* RIGHT: EXTRACTED FORM REVIEW */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" /> Çıxarılmış Məlumatlar
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                      {extractedInvoiceData.confidence}% AI Dəqiqlik
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Qaimə №</label>
                      <input
                        type="text"
                        value={extractedInvoiceData.id}
                        onChange={(e) => setExtractedInvoiceData({...extractedInvoiceData, id: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Təchizatçı</label>
                        <input
                          type="text"
                          value={extractedInvoiceData.supplier}
                          onChange={(e) => setExtractedInvoiceData({...extractedInvoiceData, supplier: e.target.value})}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase">VÖEN</label>
                        <input
                          type="text"
                          value={extractedInvoiceData.voen}
                          onChange={(e) => setExtractedInvoiceData({...extractedInvoiceData, voen: e.target.value})}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Məbləğ (AZN)</label>
                        <input
                          type="number"
                          value={extractedInvoiceData.amount}
                          onChange={(e) => setExtractedInvoiceData({...extractedInvoiceData, amount: parseFloat(e.target.value) || 0})}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase">ƏDV (AZN)</label>
                        <input
                          type="number"
                          value={extractedInvoiceData.vat}
                          onChange={(e) => setExtractedInvoiceData({...extractedInvoiceData, vat: parseFloat(e.target.value) || 0})}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                        />
                      </div>
                    </div>

                    {/* EXTRACTED ITEMS PREVIEW */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Oxunmuş Məhsullar ({extractedInvoiceData.items.length}):</span>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {extractedInvoiceData.items.map((it, idx) => (
                          <div key={idx} className="p-1.5 bg-white border border-slate-200 rounded-lg flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-800">{it.name}</span>
                            <span className="font-bold text-rose-600">{it.qty} x {it.invPrice} AZN</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ACTION BUTTONS */}
            {extractedInvoiceData && !isInvScanning && (
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleSaveExtractedInvoice}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Sistemə Əlavə Et & AI Yoxla
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. MÜQAVİLƏ PHOTO OCR SCANNER MODAL */}
      {isUploadContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-scale-up my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Müqavilə Şəkli Skaner (AI Legal OCR)</h3>
                  <p className="text-xs text-slate-400">Rəsmi müqavilə şəkillərindən qiymət maddələri avtomatik tanınır</p>
                </div>
              </div>
              <button onClick={() => {
                setIsUploadContractModalOpen(false);
                setConScanPreview(null);
                setExtractedContractData(null);
              }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRESET SAMPLE TEST BUTTON */}
            {!conScanPreview && !extractedContractData && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Hazır müqavilə nümunəsi ilə test etmək istəyirsiniz?</span>
                </div>
                <button
                  onClick={() => {
                    setConScanPreview(SAMPLE_CONTRACT_IMAGE);
                    handleContractImageScan(SAMPLE_CONTRACT_IMAGE);
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-xl transition-colors shrink-0"
                >
                  Nümunə Şəkillə Test Et
                </button>
              </div>
            )}

            {/* FILE UPLOAD DROPZONE */}
            {!conScanPreview && (
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 rounded-2xl p-8 text-center space-y-3 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  id="con-file-input"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setConScanPreview(reader.result);
                        handleContractImageScan(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="con-file-input" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Müqavilə Səhifəsi Skanını Yükləyin</p>
                  <p className="text-slate-400 text-xs">JPG, PNG, WEBP (bəndlər və qiymət cədvəli)</p>
                </label>
              </div>
            )}

            {/* SCANNING PROGRESS OVERLAY */}
            {isConScanning && (
              <div className="p-6 bg-indigo-950 text-white rounded-2xl text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-amber-300 animate-spin mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-amber-300">Süni İntellekt Müqavilə Bəndlərini Oxuyur...</h4>
                  <p className="text-xs text-indigo-200 mt-1">{conScanStep}</p>
                </div>
              </div>
            )}

            {/* PREVIEW & EXTRACTED CONTRACT DATA REVIEW */}
            {conScanPreview && !isConScanning && extractedContractData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* IMAGE PREVIEW */}
                <div className="bg-slate-900 rounded-2xl p-3 flex flex-col justify-between space-y-2 overflow-hidden border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Skan Edilən Müqavilə Vizualı
                  </span>
                  <div className="max-h-64 overflow-hidden rounded-xl border border-slate-700 bg-black flex items-center justify-center">
                    <img src={conScanPreview} alt="Scanned Contract" className="object-contain max-h-64 w-full" />
                  </div>
                  <button
                    onClick={() => {
                      setConScanPreview(null);
                      setExtractedContractData(null);
                    }}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 text-center py-1"
                  >
                    Başqa şəkil seç
                  </button>
                </div>

                {/* EXTRACTED FORM REVIEW */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" /> Çıxarılmış Müqavilə Bəndləri
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px]">
                      {extractedContractData.confidence}% Legal OCR
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Müqavilə Kodu №</label>
                      <input
                        type="text"
                        value={extractedContractData.id}
                        onChange={(e) => setExtractedContractData({...extractedContractData, id: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Təchizatçı</label>
                        <input
                          type="text"
                          value={extractedContractData.supplier}
                          onChange={(e) => setExtractedContractData({...extractedContractData, supplier: e.target.value})}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase">VÖEN</label>
                        <input
                          type="text"
                          value={extractedContractData.voen}
                          onChange={(e) => setExtractedContractData({...extractedContractData, voen: e.target.value})}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Ümumi Büdcə Limiti (AZN)</label>
                      <input
                        type="number"
                        value={extractedContractData.totalBudget}
                        onChange={(e) => setExtractedContractData({...extractedContractData, totalBudget: parseFloat(e.target.value) || 0})}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-indigo-600"
                      />
                    </div>

                    {/* AGREED ITEMS */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Razılaşdırılmış Sabit Qiymətlər:</span>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {extractedContractData.items.map((it, idx) => (
                          <div key={idx} className="p-1.5 bg-white border border-slate-200 rounded-lg flex justify-between text-[11px]">
                            <span className="font-semibold text-slate-800">{it.name}</span>
                            <span className="font-bold text-indigo-600">{it.agreedPrice} AZN / {it.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ACTION BUTTONS */}
            {extractedContractData && !isConScanning && (
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadContractModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={handleSaveExtractedContract}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Müqaviləni Yadda Saxla
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* DETAIL DRAWER FOR INVOICE */}
      {activeInvoiceDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-mono">
                  {activeInvoiceDetail.id}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">{activeInvoiceDetail.supplier}</h3>
              </div>
              <button onClick={() => setActiveInvoiceDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block">VÖEN:</span>
                <span className="font-bold text-slate-800">{activeInvoiceDetail.voen}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Müqavilə №:</span>
                <span className="font-bold text-slate-800">{activeInvoiceDetail.contractNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Qaimə Tarixi:</span>
                <span className="font-bold text-slate-800">{activeInvoiceDetail.date}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Skan Edilmiş Qaimə Sətirləri</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Ad</th>
                      <th className="py-2 px-3">Miqdar</th>
                      <th className="py-2 px-3">Qaimə Qiymət</th>
                      <th className="py-2 px-3">Müqavilə Qiymət</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoiceDetail.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium text-slate-800">{item.name}</td>
                        <td className="py-2 px-3 text-slate-600">{item.qty} {item.unit}</td>
                        <td className="py-2 px-3 font-bold text-rose-600">{item.invPrice} AZN</td>
                        <td className="py-2 px-3 font-bold text-emerald-600">{item.conPrice} AZN</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400 block">Ümumi Yoxlanılan Məbləğ:</span>
                <span className="text-lg font-black text-slate-900">{activeInvoiceDetail.amount.toLocaleString()} AZN</span>
              </div>
              <button
                onClick={() => setActiveInvoiceDetail(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Bağla
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUPPLIER DETAIL DRAWER */}
      {activeSupplierDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{activeSupplierDetail.name}</h3>
                <p className="text-xs text-slate-400">VÖEN: {activeSupplierDetail.voen}</p>
              </div>
              <button onClick={() => setActiveSupplierDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Məsul Şəxs:</span>
                  <span className="font-bold text-slate-800">{activeSupplierDetail.contactPerson}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Telefon:</span>
                  <span className="font-bold text-slate-800">{activeSupplierDetail.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email:</span>
                  <span className="font-bold text-slate-800">{activeSupplierDetail.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sifariş Həcmi:</span>
                  <span className="font-bold text-indigo-600">{activeSupplierDetail.totalSpent.toLocaleString()} AZN</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Qiymət Tarixçəsi Dinamikası</span>
                <div className="h-36 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeSupplierDetail.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{fontSize: 10}} />
                      <YAxis tick={{fontSize: 10}} />
                      <Bar dataKey="price" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveSupplierDetail(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}