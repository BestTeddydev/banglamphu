# การแก้ไขปัญหา MissingSchemaError: Schema hasn't been registered for model "Package"

## ปัญหาที่พบ

### **Error: MissingSchemaError: Schema hasn't been registered for model "Package"**
```
Get bookings error: MissingSchemaError: Schema hasn't been registered for model "Package".
Use mongoose.model(name, schema)
```

### **สาเหตุ**
- Mongoose ไม่สามารถหา model "Package" ได้เมื่อทำการ populate
- อาจเกิดจากการ import models ไม่ถูกต้องหรือ models ไม่ได้ถูก register
- หรือเกิดจากการ restart เซิร์ฟเวอร์ที่ทำให้ models cache หายไป

## การแก้ไข

### **1. ตรวจสอบการ Import Models**

#### **ไฟล์: `src/app/api/admin/bookings/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';  // ✅ ต้อง import
import User from '@/models/User';        // ✅ ต้อง import
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/auth';
```

### **2. ตรวจสอบ Model Definitions**

#### **ไฟล์: `src/models/Package.ts`**
```typescript
export default mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
```

#### **ไฟล์: `src/models/User.ts`**
```typescript
export default mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
```

#### **ไฟล์: `src/models/Booking.ts`**
```typescript
packageId: {
  type: Schema.Types.ObjectId,
  ref: 'Package',  // ✅ ต้องตรงกับ model name
  required: true
},
userId: {
  type: Schema.Types.ObjectId,
  ref: 'User',      // ✅ ต้องตรงกับ model name
  required: true
}
```

### **3. เปิดการ Populate กลับมา**

#### **ไฟล์: `src/app/api/admin/bookings/route.ts`**
```typescript
const bookings = await Booking.find(query)
  .populate('packageId', 'name price images category')
  .populate('userId', 'name email')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
```

## วิธีการทดสอบ

### **1. ทดสอบด้วย Script**
```bash
node test-models-populate.js
```

### **2. ทดสอบ API โดยตรง**
```bash
# ทดสอบดึงข้อมูลการจอง
curl -X GET http://localhost:3001/api/admin/bookings

# ตรวจสอบว่า populate ทำงานได้
# ควรได้ข้อมูล packageId และ userId ที่ populate มา
```

### **3. ทดสอบหน้าเว็บ**
- ไปที่ `/admin/bookings`
- ตรวจสอบว่าหน้าโหลดได้โดยไม่มี error
- ตรวจสอบว่าข้อมูล populate แสดงได้

## การแก้ไขปัญหาเพิ่มเติม

### **1. Restart เซิร์ฟเวอร์**
```bash
# หยุดเซิร์ฟเวอร์
pkill -f "next dev"

# รันเซิร์ฟเวอร์ใหม่
npm run dev
```

### **2. ล้าง Cache**
```bash
# ล้าง Next.js cache
rm -rf .next

# รันเซิร์ฟเวอร์ใหม่
npm run dev
```

### **3. ตรวจสอบ MongoDB Connection**
```bash
# ตรวจสอบว่า MongoDB ทำงานอยู่
mongosh

# ตรวจสอบ collections
show collections
```

## ผลลัพธ์ที่คาดหวัง

### **ก่อนแก้ไข:**
- ❌ Error: MissingSchemaError: Schema hasn't been registered for model "Package"
- ❌ API ไม่สามารถ populate ได้
- ❌ หน้าเว็บไม่สามารถโหลดได้

### **หลังแก้ไข:**
- ✅ ไม่มี error
- ✅ API สามารถ populate ได้
- ✅ หน้าเว็บโหลดได้ปกติ
- ✅ ข้อมูล Package และ User แสดงได้

## หมายเหตุ

### **สำคัญ:**
- เมื่อใช้ `populate()` ใน Mongoose ต้อง import model ที่เกี่ยวข้องทั้งหมด
- Model ที่ใช้ใน populate ต้องถูก register ใน Mongoose ก่อน
- การ import model จะทำให้ Mongoose รู้จัก schema และสามารถ populate ได้

### **Model Dependencies:**
- `Booking` - model หลัก
- `Package` - ใช้ใน `populate('packageId')`
- `User` - ใช้ใน `populate('userId')`

### **Best Practices:**
- ตรวจสอบการ import models ทั้งหมดที่ใช้ใน populate
- ใช้ TypeScript เพื่อตรวจสอบ type safety
- สร้าง unit test สำหรับ API endpoints
- ทดสอบ populate functionality
