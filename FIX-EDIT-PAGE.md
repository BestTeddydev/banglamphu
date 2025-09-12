# การแก้ไขหน้า admin/packages/:id/edit

## ปัญหาที่พบ
หน้า `admin/packages/:id/edit` ยังใช้ไม่ได้

## การแก้ไขที่ทำ

### 1. **สร้างหน้า Edit (`/src/app/admin/packages/[id]/edit/page.tsx`)**
- สร้างหน้า edit ที่สมบูรณ์สำหรับแพ็คเกจ
- รองรับการแก้ไขข้อมูลทั้งหมดที่ฟอร์ม create รองรับ
- มีการจัดการรูปภาพ (เพิ่ม/ลบ)
- มีการจัดการ includes และ itinerary
- มี error handling และ loading states

### 2. **แก้ไข API Endpoint (`/src/app/api/admin/packages/[id]/route.ts`)**
- เปลี่ยน GET endpoint จาก `requireAdmin` เป็น public
- เพื่อให้หน้า edit สามารถดึงข้อมูลแพ็คเกจได้

## ฟีเจอร์ที่รองรับ

### **การแก้ไขข้อมูลพื้นฐาน**
- ชื่อแพ็คเกจ
- คำอธิบาย
- ระยะเวลา
- ราคา
- จำนวนผู้เข้าร่วมสูงสุด
- หมวดหมู่
- ระดับความยาก
- สถานะการใช้งาน

### **การจัดการรูปภาพ**
- แสดงรูปภาพปัจจุบัน
- อัพโหลดรูปภาพใหม่
- ลบรูปภาพเก่า
- แสดงรูปภาพที่รออัพโหลด

### **การจัดการข้อมูลเพิ่มเติม**
- แก้ไขสิ่งที่รวมในแพ็คเกจ (includes)
- แก้ไขกำหนดการทัวร์ (itinerary)
- เพิ่ม/ลบรายการได้

## วิธีการทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบหน้า Edit**
- ไปที่ `http://localhost:3000/admin/packages`
- คลิก "แก้ไข" ที่แพ็คเกจใดๆ
- ตรวจสอบว่าหน้า edit โหลดได้
- แก้ไขข้อมูลและบันทึก

### 3. **ทดสอบ API โดยตรง**
```bash
# ดึงข้อมูลแพ็คเกจ
curl -X GET http://localhost:3000/api/admin/packages/PACKAGE_ID

# อัพเดทแพ็คเกจ
curl -X PUT http://localhost:3000/api/admin/packages/PACKAGE_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "name": "Updated Package Name",
    "description": "Updated Description",
    "duration": 3,
    "price": 1500,
    "maxParticipants": 20,
    "includes": ["Updated Item"],
    "itinerary": [{"time": "09:00", "activity": "Updated Activity", "location": "Updated Location"}],
    "attractions": [],
    "restaurants": [],
    "images": [],
    "category": "วัฒนธรรม",
    "difficulty": "moderate",
    "isActive": true
  }'
```

### 4. **ทดสอบ Model โดยตรง**
```bash
node test-edit-page.js
```

## ไฟล์ที่สร้าง/แก้ไข
- `src/app/admin/packages/[id]/edit/page.tsx` ✅ (สร้างใหม่)
- `src/app/api/admin/packages/[id]/route.ts` ✅ (แก้ไข GET endpoint)

## หมายเหตุ
- หน้า edit ใช้โครงสร้างเดียวกับหน้า create
- รองรับการแก้ไขข้อมูลทั้งหมดที่ Package model รองรับ
- มีการจัดการ error และ loading states อย่างสมบูรณ์
- รองรับการอัพโหลดรูปภาพใหม่และลบรูปภาพเก่า
