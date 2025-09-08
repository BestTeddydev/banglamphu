# เว็บไซต์ชุมชนบางลำพู (Banglamphu Community Website)

เว็บไซต์ชุมชนบางลำพูที่สร้างด้วย Next.js, TypeScript, Tailwind CSS และ MongoDB สำหรับการจัดการข่าวสาร กิจกรรม และการติดต่อของชุมชน

## คุณสมบัติหลัก

### สำหรับนักท่องเที่ยว
- 🏠 **หน้าแรก**: แสดงข้อมูลชุมชนและข่าวสารล่าสุด
- 📰 **ข่าวสาร**: จัดการข่าวสารและประกาศต่างๆ ของชุมชน
- 🎉 **กิจกรรม**: แสดงกิจกรรมชุมชนและการสมัครเข้าร่วม
- 🗺️ **ท่องเที่ยว**: สำรวจแหล่งท่องเที่ยวและร้านอาหารในชุมชน
- 🏛️ **แหล่งท่องเที่ยว**: ดูรายละเอียดสถานที่ท่องเที่ยวพร้อมรูปภาพ
- 🍽️ **ร้านอาหาร**: ชมร้านอาหารพร้อมเมนู เวลาเปิด-ปิด และข้อมูลติดต่อ
- 📦 **แพ็คเกจทัวร์**: เลือกและจองแพ็คเกจทัวร์ที่จัดสรรไว้
- 💳 **ระบบชำระเงิน**: ชำระเงินผ่าน QR Code และอัพโหลดสลิป
- 📋 **แบบประเมิน**: กรอกแบบประเมินหลังทำกิจกรรมเสร็จ

### สำหรับเจ้าหน้าที่
- 🔧 **ระบบจัดการ**: จัดการข้อมูลแหล่งท่องเที่ยว ร้านอาหาร และแพ็คเกจทัวร์
- ➕ **เพิ่มข้อมูล**: สร้างข้อมูลแหล่งท่องเที่ยวและร้านอาหารใหม่
- 📊 **จัดการการจอง**: ดูและจัดการการจองทัวร์
- 📝 **สร้างแบบประเมิน**: สร้างแบบประเมินให้นักท่องเที่ยวกรอก
- 📈 **รายงาน**: ดูรายงานและสถิติต่างๆ

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## การติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd banglamphu
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. ตั้งค่า environment variables:
```bash
cp .env.local.example .env.local
```

แก้ไขไฟล์ `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/banglamphu-community
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

4. เริ่ม MongoDB server (ถ้าใช้ local MongoDB):
```bash
mongod
```

5. รัน development server:
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## โครงสร้างโปรเจค

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── news/          # ข่าวสาร API
│   │   ├── events/        # กิจกรรม API
│   │   └── contact/       # ติดต่อ API
│   ├── news/              # หน้าข่าวสาร
│   ├── events/            # หน้ากิจกรรม
│   ├── contact/           # หน้าติดต่อ
│   ├── about/             # หน้าเกี่ยวกับชุมชน
│   ├── layout.tsx         # Layout หลัก
│   └── page.tsx           # หน้าแรก
├── components/            # React Components
│   ├── Header.tsx         # Header component
│   └── Footer.tsx         # Footer component
├── lib/                   # Utility functions
│   └── mongodb.ts         # MongoDB connection
└── models/                # Database Models
    ├── News.ts            # ข่าวสาร model
    ├── Event.ts           # กิจกรรม model
    └── Contact.ts         # ติดต่อ model
```

## API Endpoints

### ข่าวสาร
- `GET /api/news` - ดึงรายการข่าวสาร
- `POST /api/news` - สร้างข่าวสารใหม่

### กิจกรรม
- `GET /api/events` - ดึงรายการกิจกรรม
- `POST /api/events` - สร้างกิจกรรมใหม่

### ติดต่อ
- `GET /api/contact` - ดึงรายการข้อความติดต่อ
- `POST /api/contact` - ส่งข้อความติดต่อใหม่

### แหล่งท่องเที่ยว
- `GET /api/attractions` - ดึงรายการแหล่งท่องเที่ยว
- `POST /api/attractions` - สร้างแหล่งท่องเที่ยวใหม่

### ร้านอาหาร
- `GET /api/restaurants` - ดึงรายการร้านอาหาร
- `POST /api/restaurants` - สร้างร้านอาหารใหม่

### แพ็คเกจทัวร์
- `GET /api/packages` - ดึงรายการแพ็คเกจทัวร์
- `POST /api/packages` - สร้างแพ็คเกจทัวร์ใหม่

### การจอง
- `GET /api/bookings` - ดึงรายการการจอง
- `POST /api/bookings` - สร้างการจองใหม่

## การใช้งาน

### การเพิ่มข่าวสาร
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "หัวข้อข่าว",
    "content": "เนื้อหาข่าว",
    "author": "ผู้เขียน",
    "category": "general"
  }'
```

### การเพิ่มกิจกรรม
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ชื่อกิจกรรม",
    "description": "รายละเอียดกิจกรรม",
    "startDate": "2024-02-20",
    "endDate": "2024-02-20",
    "location": "สถานที่จัดกิจกรรม",
    "organizer": "ผู้จัด"
  }'
```

## การ Deploy

### Vercel (แนะนำ)
1. Push โค้ดไปยัง GitHub
2. เชื่อมต่อกับ Vercel
3. ตั้งค่า environment variables ใน Vercel
4. Deploy อัตโนมัติ

### Docker
```bash
docker build -t banglamphu-community .
docker run -p 3000:3000 banglamphu-community
```

## การพัฒนาต่อ

- เพิ่มระบบ Authentication
- เพิ่มระบบ Admin Panel
- เพิ่มระบบ Upload รูปภาพ
- เพิ่มระบบ Notification
- เพิ่มระบบ Search

## License

MIT License

## ติดต่อ

หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อผ่าน GitHub Issues
