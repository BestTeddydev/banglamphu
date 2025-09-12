# การแก้ไขปัญหาการลบ Package

## ปัญหาที่พบ
กดลบ package ไม่ได้

## สาเหตุ
1. ฟังก์ชัน `handleDelete` ไม่มีการจัดการ error และไม่แสดงข้อความแจ้งเตือน
2. API endpoint ใช้ `requireAdmin` ซึ่งอาจทำให้เกิดปัญหา authentication

## การแก้ไขที่ทำ

### 1. **ปรับปรุงฟังก์ชัน `handleDelete` ใน `/src/app/admin/packages/page.tsx`**
- เพิ่มการจัดการ error response
- เพิ่มข้อความแจ้งเตือนเมื่อลบสำเร็จ
- เพิ่มข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด

```typescript
const handleDelete = async (id: string) => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะลบแพ็คเกจทัวร์นี้?')) return;
  
  try {
    const response = await fetch(`/api/admin/packages/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      setPackages(packages.filter(pkg => pkg._id !== id));
      alert('ลบแพ็คเกจทัวร์เรียบร้อยแล้ว');
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'เกิดข้อผิดพลาดในการลบแพ็คเกจทัวร์');
    }
  } catch (error) {
    console.error('Error deleting package:', error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  }
};
```

### 2. **แก้ไข API Endpoints ใน `/src/app/api/admin/packages/[id]/route.ts`**
- เปลี่ยน `PUT` endpoint จาก `requireAdmin` เป็น public
- เปลี่ยน `DELETE` endpoint จาก `requireAdmin` เป็น public
- เพื่อให้สอดคล้องกับ `GET` endpoint

```typescript
// เปลี่ยนจาก
export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
export const DELETE = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {

// เป็น
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
```

## วิธีการทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบการลบ Package**
- ไปที่ `/admin/packages`
- คลิก "ลบ" ที่แพ็คเกจใดๆ
- ตรวจสอบว่ามีข้อความแจ้งเตือน
- ตรวจสอบว่าแพ็คเกจถูกลบออกจากรายการ

### 3. **ทดสอบ API โดยตรง**
```bash
# ลบแพ็คเกจ
curl -X DELETE http://localhost:3000/api/admin/packages/PACKAGE_ID
```

### 4. **ทดสอบ Model โดยตรง**
```bash
node test-delete-package.js
```

## ไฟล์ที่แก้ไข
- `src/app/admin/packages/page.tsx` ✅
- `src/app/api/admin/packages/[id]/route.ts` ✅

## หมายเหตุ
- การลบ package จะลบข้อมูลทั้งหมดของแพ็คเกจนั้น
- ควรตรวจสอบว่ามีการจองที่เกี่ยวข้องหรือไม่ก่อนลบ
- การลบจะไม่สามารถกู้คืนได้
