# การ Deploy บน Vercel

## ขั้นตอนการ Deploy

### 1. เตรียม Environment Variables

สร้างไฟล์ `.env.local` ในโปรเจคและเพิ่มตัวแปรต่อไปนี้:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/banglamphu

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Vercel Blob Storage (สำหรับการอัปโหลดรูปภาพ)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### 2. Deploy บน Vercel

1. **ติดตั้ง Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login เข้า Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy โปรเจค:**
   ```bash
   vercel
   ```

4. **ตั้งค่า Environment Variables ใน Vercel Dashboard:**
   - ไปที่ Vercel Dashboard
   - เลือกโปรเจค
   - ไปที่ Settings > Environment Variables
   - เพิ่มตัวแปรทั้งหมดจาก `.env.local`

### 3. ตั้งค่า MongoDB Atlas

1. สร้าง MongoDB Atlas account
2. สร้าง cluster ใหม่
3. สร้าง database user
4. ตั้งค่า network access (0.0.0.0/0)
5. คัดลอก connection string มาใส่ใน MONGODB_URI

### 4. ตั้งค่า Google Maps API

1. ไปที่ Google Cloud Console
2. สร้าง project ใหม่
3. เปิดใช้งาน Maps JavaScript API
4. สร้าง API key
5. ตั้งค่า restrictions (ถ้าต้องการ)

### 5. ตั้งค่า Vercel Blob Storage

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจคของคุณ
3. ไปที่ Settings > Storage
4. สร้าง Blob Storage ใหม่
5. คัดลอก BLOB_READ_WRITE_TOKEN
6. เพิ่ม token ใน environment variables

### 6. ตรวจสอบการทำงาน

หลังจาก deploy เสร็จแล้ว ให้ตรวจสอบ:

- [ ] หน้าแรกโหลดได้
- [ ] การ login ทำงานได้
- [ ] API endpoints ตอบสนองได้
- [ ] Google Maps แสดงได้
- [ ] การอัปโหลดรูปภาพทำงานได้ (Vercel Blob)
- [ ] การลบรูปภาพทำงานได้

## Troubleshooting

### Build Errors

หากเจอ build errors:

1. **TypeScript Errors:**
   ```bash
   npm run build
   ```

2. **Dynamic Server Usage:**
   - เพิ่ม `export const dynamic = 'force-dynamic';` ใน API routes

3. **Missing Dependencies:**
   ```bash
   npm install
   ```

### Runtime Errors

1. **Database Connection:**
   - ตรวจสอบ MONGODB_URI
   - ตรวจสอบ network access ใน MongoDB Atlas

2. **Authentication:**
   - ตรวจสอบ JWT_SECRET
   - ตรวจสอบ cookies settings

3. **File Uploads:**
   - ตรวจสอบ BLOB_READ_WRITE_TOKEN
   - ตรวจสอบ Vercel Blob Storage settings
   - ตรวจสอบ file size limits

## Performance Optimization

1. **Image Optimization:**
   - ใช้ Next.js Image component
   - ตั้งค่า proper image sizes

2. **API Optimization:**
   - ใช้ caching headers
   - ตั้งค่า proper database indexes

3. **Bundle Size:**
   - ใช้ dynamic imports
   - ลบ unused dependencies

## Security Considerations

1. **Environment Variables:**
   - ไม่ commit secrets ลง git
   - ใช้ strong JWT secrets

2. **API Security:**
   - ใช้ proper authentication
   - ตั้งค่า CORS properly

3. **File Uploads:**
   - ตรวจสอบ file types
   - ตั้งค่า file size limits
