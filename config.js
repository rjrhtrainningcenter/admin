// ========================================================================
// 🔑 SUPABASE CONFIGURATION: พิกัดต่อท่อเข้าฐานข้อมูลหลัก
// ========================================================================
const SUPABASE_URL = "https://cpiwdnbcuotmhtbhuzce.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaXdkbmJjdW90bWh0Ymh1emNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NDY4NTMsImV4cCI6MjA5NjEyMjg1M30.7QU1FwPgIElugv4B6i23tYmmC60LG0wc8896EHTKXUc";

// ========================================================================
// 📡 GOOGLE APPS SCRIPT WEB APP APIS: พิกัดสำหรับยิงไปฝั่ง Automation
// ========================================================================
// URL ของ GAS บัญชีหลัก (คุมระบบสมัครออนไลน์ และระบบสแกนเช็คอิน)
const MAIN_REG_API_URL = "https://script.google.com/macros/s/AKfycbx2jSuFYm7wpCs5zMa3BqmqnUlAju9lipjqrhuV4zpn0oEHtjV6WbPzwjTV8JcqQneF/exec";
const GOOGLE_SHEET_API = MAIN_REG_API_URL; // คุมโฟลว์ดักเผื่อโค้ดเก่าดึงใช้งาน

// URL ของ GAS ฝั่งระบบรันสลักใบประกาศนียบัตร (เดี่ยว/กลุ่ม)
const CERT_BLS_API = "https://script.google.com/macros/s/AKfycbxeH8fwOwWeOh83K5zORNVtq5O1ZnNLZDAB79Ic2wyJWZjWRK9frNkD6_dRs_jl6gNVoA/exec";

// ========================================================================
// ✉️ MULTI-ACCOUNT MAIL GATEWAYS: อาร์เรย์อีเมลแอดมินสำหรับกระจายโควตายิงเมลกลุ่ม
// ========================================================================
const GAS_WEB_APP_URLS = [
    "https://script.google.com/macros/s/AKfycbx6o8_8Q2bA6z1shuNJUqPq10TA9w0GUm5vm__sUjcQDpuudR_Ck7MsXrrnEh6HM1I/exec", // เมลที่ 1 (ตู้หลัก)
    "https://script.google.com/macros/s/AKfycbzlQ1_9qdsN4YpxvsrDBfxflTIdab2cP3zcOrF1lb7Gl6jUaLXsraMrzSl-KojDeo-3/exec", // เมลที่ 2 (สำรอง 1)
    "https://script.google.com/macros/s/AKfycbzd3Gpyhqvcq__hT1EhKGPKMy9wo9bvs2ialJZdc9Q9q-DqhzV9c7z8c6qNBLE6WWmD/exec"  // เมลที่ 3 (สำรอง 2)
];

// ========================================================================
// 🛠️ INITIALIZATION: เปิดระบบ Object ตัวแทนเชื่อมต่อหลังบ้าน
// ========================================================================
let supabaseClient;
if (typeof window !== 'undefined' && window.supabase) {
    // สร้างเซสชันกลางเพื่อให้หน้าเว็บ index, checkin, sessions, certificate, participants ดึงไปใช้ได้ทันที
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
        
        // ดักจับรอยรั่ว: ถ้าเจ้าหน้าที่ไม่ได้ล็อกอิน และแอบพิมพ์ URL ตรง ๆ เพื่อเข้าหน้าอื่นที่ไม่ใช่ index.html
        // ระบบจะดีดสับสวิตช์เด้งหน้าจอกลับมาที่ประตูหน้าด่านแรกทันทีเพื่อความปลอดภัย
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
            window.location.href = "index.html"; // บังคับดีดกลับหน้าแรกแม้คำสั่ง signOut จะติดขัด
        }
    }
}
