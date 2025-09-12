# การแก้ไขปัญหา tourDate.date.toISOString is not a function

## ปัญหาที่พบ
```
tourDate.date.toISOString is not a function
```

## สาเหตุ
- `tourDate.date` อาจเป็น string หรือ Date object
- เมื่อเป็น string จะไม่มี method `toISOString()`
- ต้องตรวจสอบ type ก่อนเรียกใช้ method

## การแก้ไขที่ทำ

### 1. **แก้ไขใน `/src/app/api/bookings/route.ts`**
```typescript
// เปลี่ยนจาก
const tourDate = packageData.tourDates.find(td => 
  td.date.toISOString().split('T')[0] === body.tourDate.date
);

// เป็น
const tourDate = packageData.tourDates.find(td => {
  const dateStr = td.date instanceof Date 
    ? td.date.toISOString().split('T')[0]
    : new Date(td.date).toISOString().split('T')[0];
  return dateStr === body.tourDate.date;
});
```

### 2. **แก้ไขใน `/src/app/tourism/packages/[id]/page.tsx`**
```typescript
// เปลี่ยนจาก
{packageData.tourDates.map((tourDate, index) => (
  <option key={index} value={tourDate.date.toISOString().split('T')[0]}>
    {formatDate(tourDate.date)} - {tourDate.startTime} ถึง {tourDate.endTime}
  </option>
))}

// เป็น
{packageData.tourDates.map((tourDate, index) => {
  const dateStr = tourDate.date instanceof Date 
    ? tourDate.date.toISOString().split('T')[0]
    : new Date(tourDate.date).toISOString().split('T')[0];
  return (
    <option key={index} value={dateStr}>
      {formatDate(tourDate.date)} - {tourDate.startTime} ถึง {tourDate.endTime}
    </option>
  );
})}
```

## วิธีการทำงาน

### **Type Checking Pattern**
```typescript
const dateStr = date instanceof Date 
  ? date.toISOString().split('T')[0]  // ถ้าเป็น Date object
  : new Date(date).toISOString().split('T')[0];  // ถ้าเป็น string
```

### **อธิบาย**
1. **ตรวจสอบ type** - ใช้ `instanceof Date` เพื่อตรวจสอบว่าเป็น Date object หรือไม่
2. **ถ้าเป็น Date** - เรียก `toISOString()` โดยตรง
3. **ถ้าเป็น string** - แปลงเป็น Date object ก่อน แล้วค่อยเรียก `toISOString()`
4. **ได้ผลลัพธ์** - string ในรูปแบบ 'YYYY-MM-DD'

## ไฟล์ที่แก้ไข
- `src/app/api/bookings/route.ts` ✅
- `src/app/tourism/packages/[id]/page.tsx` ✅

## วิธีการทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบการจองทัวร์**
- ไปที่ `/tourism/packages`
- เลือกแพ็คเกจ
- คลิก "จองทัวร์"
- เลือกวันที่ทัวร์
- ตรวจสอบว่าไม่มี error

### 3. **ทดสอบ API โดยตรง**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "PACKAGE_ID",
    "userId": "USER_ID",
    "tourDate": {
      "date": "2024-01-01"
    },
    "participants": 1,
    "contactInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "0123456789"
    }
  }'
```

## หมายเหตุ
- การแก้ไขนี้ทำให้ code รองรับทั้ง Date object และ string
- ป้องกัน runtime error เมื่อ data type ไม่ตรงกับที่คาดหวัง
- ใช้ได้กับทุกที่ที่มีการใช้ `toISOString()` กับ date fields
