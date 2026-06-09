// ========================================================================
// 🔑 SUPABASE CONFIGURATION: พิกัดต่อท่อเข้าฐานข้อมูลหลัก
// ========================================================================
const SUPABASE_URL = "https://cpiwdnbcuotmhtbhuzce.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaXdkbmJjdW90bWh0Ymh1emNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDY4NTMsImV4cCI6MjA5NjEyMjg1M30.7QU1FwPgIElugv4B6i23tYmmC60LG0wc8896EHTKXUc";

// ========================================================================
// 📡 GOOGLE APPS SCRIPT WEB APP APIS: พิกัดสำหรับยิงไปฝั่ง Automation
// ========================================================================
// 🟢 อัปเดตแก้บั๊ก: สลับมาใช้ลิงก์ Web App แอดมินตัวใหม่ล่าสุด (ที่สลักชื่อไทย, แตกคิว, แยกโฟลเดอร์รุ่น)
const MAIN_REG_API_URL = "https://script.google.com/macros/s/AKfycbwwYjoq7Z5IKNx9R8nG-CKP_2kwzYYgFHcBYycMjQ_6MUj8mgHtAne6pqcgDNUiNKLD/exec";
const GOOGLE_SHEET_API = MAIN_REG_API_URL; 

// ========================================================================
// ✉️ MULTI-ACCOUNT MAIL GATEWAYS: อาร์เรย์อีเมลแอดมินสำหรับกระจายโควตายิงเมลกลุ่ม
// ========================================================================
// 🌟 ล็อกเป้าหมายตู้ยิงเมลใบประกาศ (สำหรับหน้า participants.html) ใช้ 2 บัญชีหลัก-รองของนาย
const GAS_WEB_APP_URLS = [
    "https://script.google.com/macros/s/AKfycbwwYjoq7Z5IKNx9R8nG-CKP_2kwzYYgFHcBYycMjQ_6MUj8mgHtAne6pqcgDNUiNKLD/exec", // 🟢 เมลที่ 1 (ตู้แอดมินหลักล่าสุด)
    "https://script.google.com/macros/s/AKfycbwEqswvbSQ2_dn19ZwbGpmP3zoDmO4nYM2eZuq0xR3E91gdSBYBAEOr8J2QtWOmwcl4/exec"  // 🟡 เมลที่ 2 (ตู้แอดมินสำรอง)
];

// ========================================================================
// 🛠️ INITIALIZATION: เปิดระบบ Object ตัวแทนเชื่อมต่อหลังบ้าน
// ========================================================================
let supabaseClient;
if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error("🚨 วิกฤต: ไม่สามารถสร้าง supabaseClient ได้เนื่องจากไลบรารีหลักยังไม่ถูกโหลดเข้าสู่เบราว์เซอร์");
}

// ========================================================================
// 🔒 SECURITY PROTECTION: ระบบตรวจสอบและคุมสิทธิ์การเข้าถึงหน้าเว็บ (Route Guard)
// ========================================================================
async function checkAuthGuard() {
    if (!supabaseClient) return null;
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
            window.location.href = "index.html";
        }
        return session;
    } catch (e) {
        console.error("Auth Guard ตรวจสอบสิทธิ์ขัดข้อง:", e);
        return null;
    }
}

// ฟังก์ชันสากลประจำปุ่ม Log out
async function handleGlobalLogout() {
    if (supabaseClient) {
        try {
            await supabaseClient.auth.signOut();
            window.location.href = "index.html";
        } catch (e) {
            console.error("Logout Error:", e);
            window.location.href = "index.html"; 
        }
    }
}
