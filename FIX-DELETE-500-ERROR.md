# การแก้ไขปัญหา DELETE Package Error 500

## ปัญหาที่พบ
```
DELETE /api/admin/packages/68c39ea9749d2a8cd5eae698 500 in 160ms
```

## การแก้ไขที่ทำ

### 1. **เพิ่ม Debug Logging ใน DELETE Endpoint**
- เพิ่ม console.log เพื่อติดตามการทำงาน
- เพิ่มการตรวจสอบ package ก่อนลบ
- เพิ่มการแสดงรายละเอียด error

```typescript
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    console.log('Attempting to delete package with ID:', params.id);
    await connectDB();
    
    // ตรวจสอบว่า package มีอยู่หรือไม่ก่อนลบ
    const existingPackage = await Package.findById(params.id);
    if (!existingPackage) {
      console.log('Package not found:', params.id);
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    
    console.log('Package found, proceeding with deletion:', existingPackage.name);
    
    const packageData = await Package.findByIdAndDelete(params.id);
    
    if (!packageData) {
      console.log('Package deletion failed');
      return NextResponse.json(
        { error: 'Failed to delete package' },
        { status: 500 }
      );
    }
    
    console.log('Package deleted successfully:', packageData.name);
    return NextResponse.json({
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
};
```

## วิธีการทดสอบ

### 1. **รันเซิร์ฟเวอร์**
```bash
npm run dev
```

### 2. **ทดสอบการลบ Package ผ่าน UI**
- ไปที่ `/admin/packages`
- คลิก "ลบ" ที่แพ็คเกจใดๆ
- ตรวจสอบ console log ใน terminal

### 3. **ทดสอบ API โดยตรง**
```bash
curl -X DELETE http://localhost:3000/api/admin/packages/PACKAGE_ID
```

### 4. **ทดสอบ Model โดยตรง**
```bash
node test-delete-package-api.js
```

## การตรวจสอบ Error

### **ดู Console Logs**
เมื่อเกิด error 500 จะเห็น logs ดังนี้:
```
Attempting to delete package with ID: 68c39ea9749d2a8cd5eae698
Package found, proceeding with deletion: [Package Name]
Delete package error: [Error Details]
Error details: {
  message: [Error Message],
  stack: [Error Stack],
  name: [Error Name]
}
```

### **สาเหตุที่เป็นไปได้**
1. **Database Connection Error** - ไม่สามารถเชื่อมต่อ MongoDB
2. **Schema Validation Error** - ข้อมูลไม่ตรงกับ schema
3. **Permission Error** - ไม่มีสิทธิ์ลบข้อมูล
4. **Reference Error** - มีการอ้างอิงจาก collection อื่น

## ไฟล์ที่แก้ไข
- `src/app/api/admin/packages/[id]/route.ts` ✅ (เพิ่ม debug logging)

## หมายเหตุ
- Debug logging จะช่วยระบุสาเหตุของ error 500
- ควรตรวจสอบ console logs เมื่อเกิด error
- หากยังมีปัญหา ควรตรวจสอบ database connection และ schema
