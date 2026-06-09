// ========================================================================
// 🔑 SUPABASE CONFIGURATION: พิกัดต่อท่อเข้าฐานข้อมูลหลัก
// ========================================================================
const SUPABASE_URL = "https://cpiwdnbcuotmhtbhuzce.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaXdkbmJjdW90bWh0Ymh1emNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDY4NTMsImV4cCI6MjA5NjEyMjg1M30.7QU1FwPgIElugv4B6i23tYmmC60LG0wc8896EHTKXUc";

// ========================================================================
// 📡 GOOGLE APPS SCRIPT WEB APP APIS: พิกัดสำหรับยิงไปฝั่ง Automation
// ========================================================================
// URL ของ GAS บัญชีหลักตัวล่าสุดของนาย (คุมระบบสมัครออนไลน์ และระบบสแกนเช็คอิน)
const MAIN_REG_API_URL = "https://script.google.com/macros/s/AKfycbw-U9InsFm7MlEWzlaeNIhfYlJuiqVF3uSPNJcrJgpNtZp54805YOiW9pJ-B6EDXQ0/exec";
const GOOGLE_SHEET_API = MAIN_REG_API_URL; 

// ✂️ เอาฟังก์ชัน CERT_BLS_API ออกชั่วคราวตามสั่ง เพื่อป้องกันระบบแอร์ล็อกซ้อนบั๊กครับนาย

// ========================================================================
// ✉️ MULTI-ACCOUNT MAIL GATEWAYS: อาร์เรย์อีเมลแอดมินสำหรับกระจายโควตายิงเมลกลุ่ม
// ========================================================================
// 🌟 เคลียร์เหลือ 2 ตัวเน้นๆ: ตู้หลักของนาย ผนึกกำลังร่วมกับตู้สำรองตัวใหม่ล่าสุดเพียงตู้เดียวเท่านั้นครับ
const GAS_WEB_APP_URLS = [
    "https://script.google.com/macros/s/AKfycbw-U9InsFm7MlEWzlaeNIhfYlJuiqVF3uSPNJcrJgpNtZp54805YOiW9pJ-B6EDXQ0/exec", // 🟢 เมลที่ 1 (ตู้หลักล่าสุด)
    "https://script.google.com/macros/s/AKfycbwEqswvbSQ2_dn19ZwbGpmP3zoDmO4nYM2eZuq0xR3E91gdSBYBAEOr8J2QtWOmwcl4/exec"  // 🟡 เมลที่ 2 (ตู้สำรองใหม่ตัวเดียวที่นายส่งมาให้)
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
