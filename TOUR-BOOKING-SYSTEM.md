# ระบบจองทัวร์และการชำระเงิน

## ฟีเจอร์ที่เพิ่มเข้ามา

### 1. **การจัดการวันที่ทัวร์**
- แอดมินสามารถตั้งค่าวันที่จัดทัวร์ได้
- ระบุเวลาเริ่มและเวลาจบ
- กำหนดจำนวนที่ว่างสำหรับแต่ละวัน

### 2. **ระบบจองทัวร์สำหรับนักท่องเที่ยว**
- ดูรายการแพ็คเกจทัวร์
- ดูรายละเอียดแพ็คเกจ
- จองทัวร์พร้อมกรอกข้อมูลติดต่อ
- อัพโหลดสลิปโอนเงิน

### 3. **ระบบจัดการการจองสำหรับแอดมิน**
- ดูรายการการจองทั้งหมด
- ตรวจสอบสลิปโอนเงิน
- อัพเดทสถานะการจอง
- อัพเดทสถานะการชำระเงิน

## ไฟล์ที่สร้าง/แก้ไข

### **Models**
- `src/models/Package.ts` - เพิ่มฟิลด์ `tourDates`
- `src/models/Booking.ts` - สร้างใหม่สำหรับการจองทัวร์

### **API Endpoints**
- `src/app/api/packages/route.ts` - API สาธารณะสำหรับแพ็คเกจ
- `src/app/api/packages/[id]/route.ts` - API รายละเอียดแพ็คเกจ
- `src/app/api/bookings/route.ts` - API การจองทัวร์
- `src/app/api/bookings/[id]/route.ts` - API จัดการการจอง
- `src/app/api/bookings/[id]/payment/route.ts` - API อัพโหลดสลิป
- `src/app/api/admin/bookings/route.ts` - API จัดการการจองสำหรับแอดมิน
- `src/app/api/admin/bookings/[id]/route.ts` - API อัพเดทการจองสำหรับแอดมิน

### **Pages**
- `src/app/tourism/packages/page.tsx` - หน้าแสดงแพ็คเกจทัวร์
- `src/app/tourism/packages/[id]/page.tsx` - หน้ารายละเอียดและจองทัวร์
- `src/app/admin/bookings/page.tsx` - หน้าจัดการการจองสำหรับแอดมิน
- `src/app/admin/packages/create/page.tsx` - เพิ่มการจัดการวันที่ทัวร์

## วิธีการใช้งาน

### **สำหรับแอดมิน**

#### 1. **สร้างแพ็คเกจทัวร์**
- ไปที่ `/admin/packages/create`
- กรอกข้อมูลพื้นฐาน
- เพิ่มวันที่จัดทัวร์
- กำหนดจำนวนที่ว่าง

#### 2. **จัดการการจอง**
- ไปที่ `/admin/bookings`
- ดูรายการการจองทั้งหมด
- ตรวจสอบสลิปโอนเงิน
- อัพเดทสถานะการจองและชำระเงิน

### **สำหรับนักท่องเที่ยว**

#### 1. **ดูแพ็คเกจทัวร์**
- ไปที่ `/tourism/packages`
- ค้นหาและกรองแพ็คเกจ
- ดูรายละเอียดแพ็คเกจ

#### 2. **จองทัวร์**
- เลือกวันที่ทัวร์
- ระบุจำนวนคน
- กรอกข้อมูลติดต่อ
- อัพโหลดสลิปโอนเงิน

## ฟิลด์ข้อมูล

### **Package Model**
```typescript
interface IPackage {
  // ... existing fields
  tourDates: {
    date: Date;
    startTime: string;
    endTime: string;
    availableSlots: number;
  }[];
}
```

### **Booking Model**
```typescript
interface IBooking {
  packageId: ObjectId;
  userId: ObjectId;
  tourDate: {
    date: Date;
    startTime: string;
    endTime: string;
  };
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash';
  paymentSlip?: string;
  paymentDate?: Date;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    emergencyContact?: string;
    specialRequests?: string;
  };
  notes?: string;
  adminNotes?: string;
}
```

## การทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบการสร้างแพ็คเกจ**
- ไปที่ `/admin/packages/create`
- เพิ่มวันที่ทัวร์
- บันทึกแพ็คเกจ

### 3. **ทดสอบการจองทัวร์**
- ไปที่ `/tourism/packages`
- เลือกแพ็คเกจ
- จองทัวร์

### 4. **ทดสอบการจัดการการจอง**
- ไปที่ `/admin/bookings`
- ตรวจสอบการจอง
- อัพเดทสถานะ

## หมายเหตุ
- ระบบรองรับการจองแบบ real-time
- มีการตรวจสอบจำนวนที่ว่างอัตโนมัติ
- รองรับการอัพโหลดสลิปโอนเงิน
- มีระบบแจ้งเตือนสถานะการจอง
