# การตั้งค่า Vercel Blob Storage

## ขั้นตอนการตั้งค่า

### 1. สร้าง Blob Storage ใน Vercel
1. ไปที่ Vercel Dashboard
2. เลือกโปรเจคของคุณ
3. ไปที่ Settings > Storage
4. คลิก "Create Database"
5. เลือก "Blob" และตั้งชื่อ
6. คัดลอก BLOB_READ_WRITE_TOKEN

### 2. ตั้งค่า Environment Variable
```env
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### 3. ตรวจสอบการทำงาน
- อัปโหลดรูปภาพได้
- ลบรูปภาพได้
- รูปภาพแสดงได้

## ข้อดีของ Vercel Blob
- ✅ ไม่ต้องตั้งค่า external service
- ✅ ทำงานได้ทันทีบน Vercel
- ✅ มี CDN ในตัว
- ✅ ปลอดภัยและเร็ว
