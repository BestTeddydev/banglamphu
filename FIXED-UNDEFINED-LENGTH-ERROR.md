# การแก้ไขปัญหา: pkg.attractions.length Cannot read properties of undefined (reading 'length')

## ปัญหาที่พบ

### **ปัญหา: pkg.attractions.length Cannot read properties of undefined (reading 'length')**
- เกิด error เมื่อ `pkg.attractions` หรือ `pkg.restaurants` เป็น `undefined`
- ระบบพยายามเข้าถึง `.length` ของ `undefined` ทำให้เกิด error
- ปัญหาเดียวกันเกิดขึ้นกับ `selectedPackageData.includes`

## การแก้ไข

### **1. แก้ไขการแสดงจำนวนแหล่งท่องเที่ยวและร้านอาหาร**

#### **ไฟล์: `src/app/tourism/custom-tour/page.tsx`**

##### **ก่อนแก้ไข:**
```typescript
{pkg.attractions.length} แหล่งท่องเที่ยว
{pkg.restaurants.length} ร้านอาหาร
```

##### **หลังแก้ไข:**
```typescript
{(pkg.attractions && pkg.attractions.length) || 0} แหล่งท่องเที่ยว
{(pkg.restaurants && pkg.restaurants.length) || 0} ร้านอาหาร
```

### **2. แก้ไขการสร้าง selectedPlaces**

#### **ก่อนแก้ไข:**
```typescript
const selectedPlaces = selectedPackageData ? [
  ...selectedPackageData.attractions,
  ...selectedPackageData.restaurants
] : [];
```

#### **หลังแก้ไข:**
```typescript
const selectedPlaces = selectedPackageData ? [
  ...(selectedPackageData.attractions || []),
  ...(selectedPackageData.restaurants || [])
] : [];
```

### **3. แก้ไขการแสดงข้อมูลใน Summary Panel**

#### **ก่อนแก้ไข:**
```typescript
<span className="font-medium">{selectedPackageData.attractions.length} แห่ง</span>
<span className="font-medium">{selectedPackageData.restaurants.length} ร้าน</span>
```

#### **หลังแก้ไข:**
```typescript
<span className="font-medium">{(selectedPackageData.attractions && selectedPackageData.attractions.length) || 0} แห่ง</span>
<span className="font-medium">{(selectedPackageData.restaurants && selectedPackageData.restaurants.length) || 0} ร้าน</span>
```

### **4. แก้ไขการแสดงสิ่งที่รวมในแพ็คเกจ**

#### **ก่อนแก้ไข:**
```typescript
{selectedPackageData.includes.map((item, index) => (
  <li key={index} className="flex items-start">
    <span className="text-green-500 mr-2">•</span>
    <span>{item}</span>
  </li>
))}
```

#### **หลังแก้ไข:**
```typescript
{(selectedPackageData.includes || []).map((item, index) => (
  <li key={index} className="flex items-start">
    <span className="text-green-500 mr-2">•</span>
    <span>{item}</span>
  </li>
))}
```

## วิธีการทดสอบ

### **1. ทดสอบการแสดงจำนวนแหล่งท่องเที่ยวและร้านอาหาร**
1. ไปที่หน้า `/tourism/custom-tour`
2. ตรวจสอบว่าแสดงจำนวนแหล่งท่องเที่ยวและร้านอาหารได้โดยไม่ error
3. ตรวจสอบว่าแสดง "0" เมื่อไม่มีข้อมูล

### **2. ทดสอบการเลือกแพ็คเกจ**
1. เลือกแพ็คเกจทัวร์
2. ตรวจสอบว่า Summary Panel แสดงข้อมูลได้โดยไม่ error
3. ตรวจสอบว่าสถานที่ในแพ็คเกจแสดงได้

### **3. ทดสอบการแสดงสิ่งที่รวมในแพ็คเกจ**
1. เลือกแพ็คเกจทัวร์
2. ตรวจสอบว่าสิ่งที่รวมในแพ็คเกจแสดงได้โดยไม่ error
3. ตรวจสอบว่าแสดงรายการได้แม้ไม่มีข้อมูล

## ผลลัพธ์ที่คาดหวัง

### **ก่อนแก้ไข:**
- ❌ Error: `pkg.attractions.length Cannot read properties of undefined (reading 'length')`
- ❌ หน้าเว็บไม่สามารถโหลดได้
- ❌ ไม่สามารถแสดงข้อมูลแพ็คเกจได้

### **หลังแก้ไข:**
- ✅ ไม่มี error เมื่อ `attractions` หรือ `restaurants` เป็น `undefined`
- ✅ แสดง "0" เมื่อไม่มีข้อมูล
- ✅ หน้าเว็บโหลดได้ปกติ
- ✅ แสดงข้อมูลแพ็คเกจได้อย่างสมบูรณ์

## หมายเหตุ

### **สำคัญ:**
- ใช้ defensive programming เพื่อป้องกัน error
- ตรวจสอบว่า array มีอยู่ก่อนเข้าถึง `.length`
- ใช้ `|| 0` เพื่อแสดงค่าเริ่มต้นเมื่อไม่มีข้อมูล
- ใช้ `|| []` เพื่อแสดง array ว่างเมื่อไม่มีข้อมูล

### **Best Practices:**
- ตรวจสอบ `undefined` และ `null` ก่อนเข้าถึง properties
- ใช้ optional chaining (`?.`) เมื่อเป็นไปได้
- ให้ค่าเริ่มต้นที่เหมาะสมเมื่อไม่มีข้อมูล
- ใช้ defensive programming ในทุกส่วนที่เข้าถึงข้อมูลจาก API
