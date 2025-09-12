# การแก้ไขปัญหา Cannot read properties of undefined (reading 'toLocaleString')

## ปัญหาที่พบ

### **Error: Cannot read properties of undefined (reading 'toLocaleString')**
```
group.package.price.toLocaleString()
```

### **สาเหตุ**
- API `/api/admin/bookings` มีการ comment out การ populate อีกครั้ง
- Frontend ยังคาดหวังข้อมูล `price` ที่ populate มา
- เมื่อ `price` เป็น `undefined` การเรียก `toLocaleString()` จะเกิด error

## การแก้ไข

### **1. แก้ไข API: `src/app/api/admin/bookings/route.ts`**

#### **เปิดการ populate กลับมา**
```typescript
const bookings = await Booking.find(query)
  .populate('packageId', 'name price images category')
  .populate('userId', 'name email')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);
```

### **2. แก้ไข Frontend Pages**

#### **หน้าแอดมินรายการการจอง: `src/app/admin/bookings/page.tsx`**
```typescript
// ก่อนแก้ไข
<p className="text-green-100">฿{group.package.price.toLocaleString()} ต่อคน</p>
<h2 className="text-xl font-bold">{group.package.name}</h2>
<p className="text-green-100">{group.package.category}</p>

// หลังแก้ไข
<p className="text-green-100">฿{(group.package.price || 0).toLocaleString()} ต่อคน</p>
<h2 className="text-xl font-bold">{group.package.name || 'ไม่ระบุชื่อ'}</h2>
<p className="text-green-100">{group.package.category || 'ไม่ระบุหมวดหมู่'}</p>
```

#### **หน้าแอดมินรายละเอียดการจอง: `src/app/admin/bookings/[id]/page.tsx`**
```typescript
// ก่อนแก้ไข
<span className="text-2xl font-bold text-green-600">
  ฿{booking.packageId.price.toLocaleString()}
</span>
<h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.packageId.name}</h3>
<p className="text-gray-600 mb-2">{booking.packageId.category}</p>

// หลังแก้ไข
<span className="text-2xl font-bold text-green-600">
  ฿{(booking.packageId.price || 0).toLocaleString()}
</span>
<h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.packageId.name || 'ไม่ระบุชื่อ'}</h3>
<p className="text-gray-600 mb-2">{booking.packageId.category || 'ไม่ระบุหมวดหมู่'}</p>
```

#### **หน้าลูกค้ารายละเอียดการจอง: `src/app/tourism/bookings/[id]/page.tsx`**
```typescript
// ก่อนแก้ไข
<span className="text-2xl font-bold text-green-600">
  ฿{booking.packageId.price.toLocaleString()}
</span>
<h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.packageId.name}</h3>
<p className="text-gray-600 mb-2">{booking.packageId.category}</p>

// หลังแก้ไข
<span className="text-2xl font-bold text-green-600">
  ฿{(booking.packageId.price || 0).toLocaleString()}
</span>
<h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.packageId.name || 'ไม่ระบุชื่อ'}</h3>
<p className="text-gray-600 mb-2">{booking.packageId.category || 'ไม่ระบุหมวดหมู่'}</p>
```

## วิธีการป้องกันปัญหาในอนาคต

### **1. ใช้ Nullish Coalescing Operator**
```typescript
// แทนที่จะใช้
price.toLocaleString()

// ใช้
(price || 0).toLocaleString()
```

### **2. ใช้ Optional Chaining**
```typescript
// แทนที่จะใช้
package.name

// ใช้
package.name || 'ไม่ระบุชื่อ'
```

### **3. ตรวจสอบข้อมูลก่อนใช้งาน**
```typescript
// ตรวจสอบว่า price เป็น number
if (typeof price === 'number' && !isNaN(price)) {
  return price.toLocaleString();
} else {
  return '0';
}
```

### **4. ใช้ Default Values**
```typescript
// กำหนดค่าเริ่มต้นสำหรับข้อมูลที่อาจไม่มี
const safePrice = price ?? 0;
const safeName = name ?? 'ไม่ระบุชื่อ';
const safeCategory = category ?? 'ไม่ระบุหมวดหมู่';
```

## การทดสอบ

### **1. ทดสอบ API**
```bash
# ทดสอบดึงข้อมูลการจอง
curl -X GET http://localhost:3001/api/admin/bookings

# ตรวจสอบว่า populate ทำงานได้
# ควรได้ข้อมูล packageId และ userId ที่ populate มา
```

### **2. ทดสอบหน้าเว็บ**
- ไปที่ `/admin/bookings`
- ตรวจสอบว่าหน้าโหลดได้โดยไม่มี error
- ตรวจสอบว่าราคาแสดงได้

### **3. ทดสอบกรณีไม่มีข้อมูล**
- สร้างแพ็คเกจที่ไม่มีราคา
- ตรวจสอบว่าแสดง "฿0" แทนที่จะ error

## ผลลัพธ์ที่คาดหวัง

### **ก่อนแก้ไข:**
- ❌ Error: Cannot read properties of undefined (reading 'toLocaleString')
- ❌ หน้าเว็บไม่สามารถโหลดได้
- ❌ ราคาไม่แสดง

### **หลังแก้ไข:**
- ✅ ไม่มี error
- ✅ หน้าเว็บโหลดได้ปกติ
- ✅ ราคาแสดงได้ (หรือแสดง "฿0" เมื่อไม่มีข้อมูล)
- ✅ ระบบทำงานได้สมบูรณ์

## หมายเหตุ

### **สำคัญ:**
- การ populate ใน Mongoose ต้อง import model ที่เกี่ยวข้อง
- Frontend ต้องจัดการกับกรณีที่ข้อมูลเป็น undefined
- ใช้ defensive programming เพื่อป้องกัน runtime errors

### **Best Practices:**
- ตรวจสอบข้อมูลก่อนใช้งาน
- ใช้ nullish coalescing operator (`??`) และ logical OR (`||`)
- มี fallback values สำหรับข้อมูลที่อาจไม่มี
- ใช้ optional chaining (`?.`) เมื่อเข้าถึง nested properties
