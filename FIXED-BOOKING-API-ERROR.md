# การแก้ไขปัญหา MissingSchemaError ใน Admin Bookings API

## ปัญหาที่พบ

### **Error: MissingSchemaError: Schema hasn't been registered for model "Package"**
```
Get bookings error: MissingSchemaError: Schema hasn't been registered for model "Package".
Use mongoose.model(name, schema)
```

### **สาเหตุ**
- API `/api/admin/bookings` ใช้ `populate()` เพื่อดึงข้อมูลจาก model `Package` และ `User`
- แต่ไม่ได้ import model เหล่านี้ในไฟล์ API
- Mongoose ไม่สามารถหา schema ที่ต้องการได้

## การแก้ไข

### **ไฟล์ที่แก้ไข: `src/app/api/admin/bookings/route.ts`**

#### **ก่อนแก้ไข:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth';
```

#### **หลังแก้ไข:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';  // ✅ เพิ่ม
import User from '@/models/User';        // ✅ เพิ่ม
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth';
```

## วิธีการทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบ API โดยตรง**
```bash
# ทดสอบดึงข้อมูลการจองทั้งหมด
curl -X GET http://localhost:3000/api/admin/bookings

# ทดสอบดึงข้อมูลการจองพร้อมกรอง
curl -X GET "http://localhost:3000/api/admin/bookings?status=pending&paymentStatus=paid"
```

### 3. **ทดสอบผ่านหน้าเว็บ**
- ไปที่ `/admin/bookings`
- ตรวจสอบว่าหน้าโหลดได้โดยไม่มี error
- ทดสอบการกรองข้อมูล

### 4. **ทดสอบด้วย Script**
```bash
node test-admin-bookings-api.js
```

## ผลลัพธ์ที่คาดหวัง

### **ก่อนแก้ไข:**
- ❌ Error 500 เมื่อเรียก API
- ❌ หน้า `/admin/bookings` ไม่สามารถโหลดได้
- ❌ Console แสดง MissingSchemaError

### **หลังแก้ไข:**
- ✅ API ทำงานได้ปกติ
- ✅ หน้า `/admin/bookings` โหลดได้
- ✅ สามารถ populate ข้อมูล Package และ User ได้
- ✅ การกรองข้อมูลทำงานได้

## หมายเหตุ

### **สำคัญ:**
- เมื่อใช้ `populate()` ใน Mongoose ต้อง import model ที่เกี่ยวข้องทั้งหมด
- Model ที่ใช้ใน populate ต้องถูก register ใน Mongoose ก่อน
- การ import model จะทำให้ Mongoose รู้จัก schema และสามารถ populate ได้

### **Model ที่เกี่ยวข้อง:**
- `Booking` - model หลัก
- `Package` - ใช้ใน `populate('packageId')`
- `User` - ใช้ใน `populate('userId')`

## การป้องกันปัญหาในอนาคต

### 1. **ตรวจสอบ Import**
- ตรวจสอบว่า import model ทั้งหมดที่ใช้ใน populate
- ใช้ TypeScript เพื่อตรวจสอบ type safety

### 2. **การทดสอบ**
- สร้าง unit test สำหรับ API endpoints
- ทดสอบ populate functionality

### 3. **Documentation**
- บันทึก model dependencies
- อัพเดท API documentation
