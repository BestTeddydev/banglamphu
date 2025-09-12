# Google Maps Setup สำหรับ Custom Tour Page

## 📍 ฟีเจอร์ Google Maps

หน้า `/tourism/custom-tour` ตอนนี้มี Google Maps ที่แสดงสถานที่ที่เลือกไว้แล้ว!

### 🎯 ฟีเจอร์ที่เพิ่มเข้ามา:

1. **แผนที่แบบ Interactive**: แสดงสถานที่ที่เลือกบน Google Maps
2. **Markers แยกสี**: 
   - 🔴 แดง = แหล่งท่องเที่ยว
   - 🟢 เขียว = ร้านอาหาร  
   - 🔵 น้ำเงิน = เมนูอาหาร
3. **Info Windows**: คลิกที่ marker เพื่อดูรายละเอียด
4. **Auto-fit**: แผนที่จะปรับขนาดให้แสดงสถานที่ทั้งหมด
5. **Legend**: แสดงความหมายของสีแต่ละประเภท

## 🛠️ การติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install @googlemaps/react-wrapper
```

### 2. ตั้งค่า Google Maps API Key

สร้างไฟล์ `.env.local` ใน root directory:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. รับ Google Maps API Key

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจคใหม่หรือเลือกโปรเจคที่มีอยู่
3. เปิดใช้งาน **Maps JavaScript API**
4. สร้าง API Key ใน **Credentials**
5. จำกัด API Key ให้ใช้ได้เฉพาะ domain ของคุณ

## 🎮 วิธีการใช้งาน

### 1. เลือกสถานที่
- เลือกแหล่งท่องเที่ยว, ร้านอาหาร, หรือเมนูอาหาร
- สถานที่ที่เลือกจะถูกเพิ่มเข้าไปในรายการ

### 2. ดูแผนที่
- กดปุ่ม **"ดูแผนที่"** ใน Summary Panel
- แผนที่จะแสดงสถานที่ที่เลือกทั้งหมด
- คลิกที่ marker เพื่อดูรายละเอียด

### 3. ปิดแผนที่
- กดปุ่ม **X** ที่มุมขวาบนของแผนที่
- หรือกดปุ่ม **"ล้างการเลือก"** เพื่อรีเซ็ตทุกอย่าง

## 🎨 UI Components

### GoogleMap Component
```tsx
<GoogleMap 
  markers={mapMarkers}
  center={{ lat: 13.7563, lng: 100.5018 }}
  zoom={13}
/>
```

### Props:
- `markers`: Array ของ markers ที่จะแสดงบนแผนที่
- `center`: จุดศูนย์กลางของแผนที่ (default: กรุงเทพฯ)
- `zoom`: ระดับการซูม (default: 13)

## 🔧 Technical Details

### Marker Structure:
```typescript
interface MapMarker {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'attraction' | 'restaurant' | 'menu';
}
```

### Auto-detection Logic:
- **Menu**: มี `restaurantId` property
- **Restaurant**: มีทั้ง `category` และ `cuisine`
- **Attraction**: ไม่มีทั้งสองอย่างข้างต้น

## 🚨 Troubleshooting

### ปัญหาที่อาจเกิดขึ้น:

1. **แผนที่ไม่แสดง**:
   - ตรวจสอบ API Key ใน `.env.local`
   - ตรวจสอบว่าเปิดใช้งาน Maps JavaScript API แล้ว

2. **Markers ไม่แสดง**:
   - ตรวจสอบว่า `coordinates` มีค่าถูกต้อง
   - ตรวจสอบว่า `mapMarkers` มีข้อมูล

3. **API Key Error**:
   - ตรวจสอบว่า API Key ถูกต้อง
   - ตรวจสอบการจำกัด domain ของ API Key

## 📱 Responsive Design

แผนที่จะปรับขนาดตามหน้าจอ:
- **Desktop**: แสดงเต็มขนาด
- **Tablet**: ปรับขนาดให้เหมาะสม
- **Mobile**: แสดงแบบเต็มหน้าจอ

## 🎯 Next Steps

ฟีเจอร์ที่สามารถเพิ่มได้ในอนาคต:
- [ ] เส้นทางระหว่างสถานที่
- [ ] ระยะทางและเวลาเดินทาง
- [ ] Street View integration
- [ ] Custom map styles
- [ ] Clustering สำหรับ markers จำนวนมาก

---

**หมายเหตุ**: ต้องมี Google Maps API Key ที่ถูกต้องเพื่อให้แผนที่ทำงานได้
