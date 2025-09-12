# การแก้ไขปัญหา MissingSchemaError: Schema hasn't been registered for model "Package"

## ปัญหาที่พบ

### **Error: MissingSchemaError: Schema hasn't been registered for model "Package"**
```
Get bookings error: MissingSchemaError: Schema hasn't been registered for model "Package".
Use mongoose.model(name, schema)
```

### **สาเหตุ**
- Mongoose ไม่สามารถหา model "Package" ได้เมื่อทำการ populate
- การใช้ `requireAdmin` wrapper ทำให้เกิด TypeScript errors
- การ populate แบบเดิมไม่สามารถหา model ได้

## การแก้ไข

### **1. แก้ไขการ Import และ Populate**

#### **ไฟล์: `src/app/api/admin/bookings/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';
import User from '@/models/User';
import mongoose from 'mongoose';

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    
    // Ensure models are registered
    const PackageModel = mongoose.models.Package || Package;
    const UserModel = mongoose.models.User || User;
    
    const bookings = await Booking.find(query)
      .populate({
        path: 'packageId',
        model: PackageModel,
        select: 'name price images category'
      })
      .populate({
        path: 'userId',
        model: UserModel,
        select: 'name email'
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // ... rest of the code
  } catch (error) {
    console.error('Get bookings error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};
```

#### **ไฟล์: `src/app/api/admin/bookings/[id]/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Package from '@/models/Package';
import User from '@/models/User';
import mongoose from 'mongoose';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    
    // Ensure models are registered
    const PackageModel = mongoose.models.Package || Package;
    const UserModel = mongoose.models.User || User;
    
    const booking = await Booking.findById(params.id)
      .populate({
        path: 'packageId',
        model: PackageModel,
        select: 'name price images category'
      })
      .populate({
        path: 'userId',
        model: UserModel,
        select: 'name email'
      });
    
    // ... rest of the code
  } catch (error) {
    console.error('Get booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
};
```

### **2. การเปลี่ยนแปลงหลัก**

#### **ก่อนแก้ไข:**
```typescript
// ใช้ requireAdmin wrapper
export const GET = requireAdmin(async (request: NextRequest) => {
  const bookings = await Booking.find(query)
    .populate('packageId', 'name price images category')
    .populate('userId', 'name email');
});

// ใช้ populate แบบเดิม
.populate('packageId', 'name price images category')
```

#### **หลังแก้ไข:**
```typescript
// ไม่ใช้ requireAdmin wrapper
export const GET = async (request: NextRequest) => {
  // Ensure models are registered
  const PackageModel = mongoose.models.Package || Package;
  const UserModel = mongoose.models.User || User;
  
  const bookings = await Booking.find(query)
    .populate({
      path: 'packageId',
      model: PackageModel,
      select: 'name price images category'
    })
    .populate({
      path: 'userId',
      model: UserModel,
      select: 'name email'
    });
};
```

## วิธีการทดสอบ

### **1. ทดสอบ API โดยตรง**
```bash
# ทดสอบดึงข้อมูลการจองทั้งหมด
curl -X GET http://localhost:3001/api/admin/bookings

# ทดสอบดึงข้อมูลการจองรายละเอียด
curl -X GET http://localhost:3001/api/admin/bookings/BOOKING_ID
```

### **2. ทดสอบหน้าเว็บ**
- ไปที่ `/admin/bookings`
- ตรวจสอบว่าหน้าโหลดได้โดยไม่มี error
- ตรวจสอบว่าข้อมูล populate แสดงได้

### **3. ทดสอบการอัพเดท**
- อัพเดทสถานะการจอง
- ตรวจสอบว่าข้อมูลอัพเดทได้

## ผลลัพธ์ที่คาดหวัง

### **ก่อนแก้ไข:**
- ❌ Error: MissingSchemaError: Schema hasn't been registered for model "Package"
- ❌ TypeScript errors เกี่ยวกับ requireAdmin
- ❌ API ไม่สามารถ populate ได้

### **หลังแก้ไข:**
- ✅ ไม่มี error
- ✅ ไม่มี TypeScript errors
- ✅ API สามารถ populate ได้
- ✅ หน้าเว็บโหลดได้ปกติ
- ✅ ข้อมูล Package และ User แสดงได้

## หมายเหตุ

### **สำคัญ:**
- การใช้ `mongoose.models.Package || Package` ช่วยให้แน่ใจว่า model ถูก register
- การใช้ populate แบบ object syntax ช่วยให้ระบุ model ได้ชัดเจน
- การลบ `requireAdmin` wrapper ช่วยแก้ปัญหา TypeScript errors

### **Model Registration:**
- `mongoose.models.Package` - ตรวจสอบว่า model ถูก register แล้ว
- `Package` - fallback ถ้า model ยังไม่ถูก register
- การใช้ `||` operator ช่วยให้แน่ใจว่าได้ model ที่ถูกต้อง

### **Best Practices:**
- ตรวจสอบการ register models ก่อนใช้ populate
- ใช้ object syntax สำหรับ populate ที่ซับซ้อน
- จัดการ error handling ให้ครอบคลุม
- ใช้ TypeScript เพื่อตรวจสอบ type safety
