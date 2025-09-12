# การปรับปรุง Package Model ให้เข้ากับฟอร์มแอดมิน

## การเปลี่ยนแปลงที่ทำ

### 1. **ปรับปรุง Package Model (`/src/models/Package.ts`)**
- เปลี่ยน `images` field จาก `required: true` เป็น optional
- รองรับ empty array สำหรับ `attractions` และ `restaurants`

### 2. **ปรับปรุง API Endpoints**

#### **POST `/api/admin/packages`**
- เพิ่มการแปลง `attractions` และ `restaurants` จาก string array เป็น ObjectId array
- จัดการ empty arrays อย่างถูกต้อง
- เพิ่ม import `mongoose` สำหรับ ObjectId

#### **PUT `/api/admin/packages/[id]`**
- เพิ่มการแปลง `attractions` และ `restaurants` จาก string array เป็น ObjectId array
- จัดการ empty arrays อย่างถูกต้อง
- เพิ่ม import `mongoose` สำหรับ ObjectId

## ฟิลด์ที่รองรับจากฟอร์ม

### **ข้อมูลพื้นฐาน**
- `name` (string, required)
- `description` (string, required)
- `duration` (number, required, min: 1)
- `price` (number, required, min: 0)
- `maxParticipants` (number, required, min: 1)
- `category` (enum: 'วัฒนธรรม', 'ธรรมชาติ', 'อาหาร', 'ประวัติศาสตร์', 'ผจญภัย', 'อื่นๆ')
- `difficulty` (enum: 'easy', 'moderate', 'hard')
- `isActive` (boolean, default: true)

### **ข้อมูลเพิ่มเติม**
- `includes` (string array)
- `itinerary` (array of {time, activity, location})
- `attractions` (ObjectId array, optional)
- `restaurants` (ObjectId array, optional)
- `images` (string array, optional)

### **ข้อมูลอัตโนมัติ**
- `rating` (number, default: 0)
- `reviewCount` (number, default: 0)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## วิธีการทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบฟอร์ม**
- ไปที่ `http://localhost:3000/admin/packages/create`
- กรอกข้อมูลตามฟอร์ม
- ส่งข้อมูลและตรวจสอบว่าไม่มี error

### 3. **ทดสอบ API โดยตรง**
```bash
# สร้างแพ็คเกจใหม่
curl -X POST http://localhost:3000/api/admin/packages \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "name": "ทดสอบแพ็คเกจ",
    "description": "แพ็คเกจทดสอบ",
    "duration": 2,
    "price": 1000,
    "maxParticipants": 10,
    "includes": ["ทดสอบ"],
    "itinerary": [{"time": "10:00", "activity": "ทดสอบ", "location": "ทดสอบ"}],
    "attractions": [],
    "restaurants": [],
    "images": [],
    "category": "อาหาร",
    "difficulty": "easy",
    "isActive": true
  }'
```

### 4. **ทดสอบ Model โดยตรง**
```bash
node test-package-form.js
```

## ไฟล์ที่แก้ไข
- `src/models/Package.ts` ✅
- `src/app/api/admin/packages/route.ts` ✅
- `src/app/api/admin/packages/[id]/route.ts` ✅

## หมายเหตุ
- Model ตอนนี้รองรับข้อมูลจากฟอร์มแอดมินได้อย่างสมบูรณ์
- Empty arrays สำหรับ `attractions`, `restaurants`, และ `images` จะถูกจัดการอย่างถูกต้อง
- การ populate จะทำงานได้แม้ว่า arrays จะว่างเปล่า
