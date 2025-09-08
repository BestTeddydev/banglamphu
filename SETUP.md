# การตั้งค่าระบบ Authentication

## 1. ติดตั้ง Dependencies
```bash
npm install next-auth bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

## 2. สร้างไฟล์ .env.local
สร้างไฟล์ `.env.local` ในโฟลเดอร์ root และเพิ่มตัวแปรต่อไปนี้:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/banglamphu

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

## 3. ตั้งค่า MongoDB
- ติดตั้ง MongoDB บนเครื่องของคุณ
- เริ่มต้น MongoDB service
- สร้าง database ชื่อ `banglamphu`

## 4. สร้างแอดมินคนแรก
1. ไปที่ `http://localhost:3002/setup-admin`
2. กรอกข้อมูลแอดมินคนแรก
3. หลังจากสร้างเสร็จ จะถูกนำไปยังหน้าล็อกอิน

## 5. ทดสอบระบบ
- ล็อกอินด้วยบัญชีแอดมินที่สร้าง
- ทดสอบการเข้าถึงหน้า `/admin`
- ทดสอบการสมัครสมาชิกใหม่
- ทดสอบการล็อกอิน/ออกจากระบบ

## ฟีเจอร์ที่เพิ่มเข้ามา

### 🔐 Authentication System
- ✅ User Registration & Login
- ✅ JWT Token Authentication
- ✅ Password Hashing with bcrypt
- ✅ HTTP-only Cookies
- ✅ Role-based Access Control (Admin/User)

### 🛡️ Route Protection
- ✅ Middleware for Route Protection
- ✅ Admin-only Routes
- ✅ Public Routes
- ✅ Automatic Redirect to Login

### 👤 User Management
- ✅ User Model with Mongoose
- ✅ Admin Role Assignment
- ✅ User Profile Management
- ✅ Last Login Tracking

### 🎨 UI Components
- ✅ Login/Register Pages
- ✅ User Menu in Header
- ✅ Mobile Responsive Design
- ✅ Admin Setup Page

## การใช้งาน

### สำหรับผู้ใช้ทั่วไป:
1. สมัครสมาชิกที่ `/register`
2. ล็อกอินที่ `/login`
3. เข้าถึงเนื้อหาทั่วไปได้

### สำหรับแอดมิน:
1. ล็อกอินด้วยบัญชีแอดมิน
2. เข้าถึงระบบจัดการที่ `/admin`
3. จัดการเนื้อหาและผู้ใช้

## Security Features
- Password hashing with salt
- JWT tokens with expiration
- HTTP-only cookies
- CSRF protection
- Role-based authorization
- Input validation
