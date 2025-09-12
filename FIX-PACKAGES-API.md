# การแก้ไขปัญหา Packages API

## ปัญหาที่พบ
```
MissingSchemaError: Schema hasn't been registered for model "Attraction".
Use mongoose.model(name, schema)
```

## สาเหตุ
API endpoint `/api/admin/packages` พยายาม populate `attractions` และ `restaurants` แต่ไม่ได้ import models เหล่านี้

## การแก้ไข

### 1. แก้ไข `/src/app/api/admin/packages/route.ts`
เพิ่ม import models ที่จำเป็น:
```typescript
import Attraction from '@/models/Attraction';
import Restaurant from '@/models/Restaurant';
```

### 2. แก้ไข `/src/app/api/admin/packages/[id]/route.ts`
เพิ่ม import models ที่จำเป็น:
```typescript
import Attraction from '@/models/Attraction';
import Restaurant from '@/models/Restaurant';
```

## วิธีการทดสอบ

### 1. รันเซิร์ฟเวอร์
```bash
npm run dev
```

### 2. เข้าไปที่หน้า admin packages
- ไปที่ `http://localhost:3000/admin/packages`
- ตรวจสอบว่าไม่มี error ใน console

### 3. ทดสอบ API โดยตรง
```bash
# ตรวจสอบ GET request
curl -X GET http://localhost:3000/api/admin/packages \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN"

# ตรวจสอบ POST request
curl -X POST http://localhost:3000/api/admin/packages \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN" \
  -d '{
    "name": "ทดสอบแพ็คเกจ",
    "description": "แพ็คเกจทดสอบ",
    "duration": 2,
    "price": 1000,
    "maxParticipants": 10,
    "includes": ["ทดสอบ"],
    "itinerary": [{"time": "10:00", "activity": "ทดสอบ", "location": "ทดสอบ"}],
    "attractions": [],
    "restaurants": [],
    "images": [],
    "category": "อาหาร",
    "difficulty": "easy",
    "isActive": true
  }'
```

## ไฟล์ที่แก้ไข
- `src/app/api/admin/packages/route.ts`
- `src/app/api/admin/packages/[id]/route.ts`

## หมายเหตุ
การแก้ไขนี้จะทำให้ API สามารถ populate `attractions` และ `restaurants` ได้โดยไม่มี error
