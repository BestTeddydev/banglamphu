# การอัพเดทหน้า Custom Tour: ฟีเจอร์ครบถ้วน

## ฟีเจอร์ที่เพิ่ม

### **1. ระบบเลือกสถานที่ท่องเที่ยว ร้านอาหาร และเมนูอาหาร**

#### **API Endpoints ใหม่:**
- `src/app/api/attractions/route.ts` - ดึงข้อมูลแหล่งท่องเที่ยว
- `src/app/api/restaurants/route.ts` - ดึงข้อมูลร้านอาหาร  
- `src/app/api/menus/route.ts` - ดึงข้อมูลเมนูอาหาร

#### **การค้นหาและกรอง:**
- ค้นหาด้วยชื่อ คำอธิบาย และตำแหน่ง
- กรองตามหมวดหมู่ (ประวัติศาสตร์ วัฒนธรรม ธรรมชาติ ช้อปปิ้ง บันเทิง)
- กรองตามประเภทอาหาร (ไทย จีน ญี่ปุ่น เกาหลี ตะวันตก ของหวาน)

### **2. ระบบ Tab สำหรับเลือกประเภทสถานที่**

#### **Tab System:**
```typescript
const [activeTab, setActiveTab] = useState<'attractions' | 'restaurants' | 'menus'>('attractions');
```

#### **การแสดงผลตาม Tab:**
- **Tab แหล่งท่องเที่ยว**: แสดงรายการแหล่งท่องเที่ยว พร้อมหมวดหมู่ เวลาเปิด-ปิด
- **Tab ร้านอาหาร**: แสดงรายการร้านอาหาร พร้อมประเภทอาหาร ช่วงราคา
- **Tab เมนูอาหาร**: แสดงรายการเมนู พร้อมราคา ร้านอาหาร ข้อมูลพิเศษ (มังสวิรัติ เผ็ด)

### **3. ระบบ Bookmark**

#### **Bookmark Interface:**
```typescript
interface BookmarkedPlace {
  id: string;
  type: 'attraction' | 'restaurant' | 'menu';
  name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  price?: number;
  category?: string;
  cuisine?: string;
}
```

#### **ฟังก์ชัน Bookmark:**
```typescript
const handleBookmark = (place: BookmarkedPlace) => {
  setBookmarkedPlaces(prev => {
    const exists = prev.find(p => p.id === place.id);
    if (exists) {
      return prev.filter(p => p.id !== place.id);
    } else {
      return [...prev, place];
    }
  });
};
```

#### **การแสดง Bookmarks:**
- แสดงจำนวน bookmarks ในปุ่ม
- แสดงรายการ bookmarks ใน Summary Panel
- สามารถเปิด Google Maps จาก bookmarks
- สามารถลบ bookmarks ได้

### **4. การแสดงแผนที่และตำแหน่ง**

#### **Map Section:**
```typescript
{showMap && selectedPlaces.length > 0 && (
  <div className="mt-8">
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">แผนที่ตำแหน่งสถานที่</h3>
      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-gray-600 mb-2">แผนที่แสดงตำแหน่งสถานที่</p>
          <p className="text-sm text-gray-500">สถานที่ที่เลือกจะแสดงบนแผนที่นี้</p>
          
          <div className="mt-4 space-y-2">
            {selectedPlaces.map((place, index) => (
              <div key={index} className="flex items-center justify-center text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                {place.name}
                {place.coordinates && (
                  <span className="ml-2 text-gray-400">
                    - {place.coordinates.lat}, {place.coordinates.lng}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
```

### **5. การเปิด Google Maps**

#### **ฟังก์ชันเปิด Google Maps:**
```typescript
const openGoogleMaps = (coordinates: { lat: number; lng: number }, name: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
};
```

#### **ปุ่มเปิด Google Maps:**
- แสดงในแต่ละสถานที่ที่มี coordinates
- เปิดในแท็บใหม่
- ใช้ Google Maps API

### **6. Summary Panel ที่อัพเดท**

#### **การแสดงข้อมูลทัวร์:**
```typescript
<div className="space-y-4">
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">สถานที่ที่เลือก ({selectedPlaces.length})</h4>
    <div className="space-y-2">
      {selectedPlaces.map((place, index) => (
        <div key={index} className="flex items-center text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          <span className="text-gray-700">{place.name}</span>
        </div>
      ))}
    </div>
  </div>

  <div className="border-t pt-4">
    <h4 className="font-semibold text-gray-900 mb-2">ข้อมูลทัวร์</h4>
    <div className="space-y-2 text-sm text-gray-600">
      <div>แหล่งท่องเที่ยว: {selectedAttractions.length} แห่ง</div>
      <div>ร้านอาหาร: {selectedRestaurants.length} ร้าน</div>
      <div>เมนูอาหาร: {selectedMenus.length} เมนู</div>
      <div>ระยะเวลาโดยประมาณ: {selectedPlaces.length * 1.5} ชั่วโมง</div>
    </div>
  </div>

  <div className="bg-blue-50 rounded-lg p-4">
    <h4 className="font-semibold text-blue-900 mb-2">คำแนะนำ</h4>
    <ul className="text-sm text-blue-800 space-y-1">
      <li>• เริ่มต้นจากสถานที่ที่อยู่ใกล้กัน</li>
      <li>• วางแผนเวลาให้เหมาะสม</li>
      <li>• เตรียมเงินสดสำหรับค่าใช้จ่าย</li>
      <li>• ตรวจสอบเวลาเปิด-ปิดของสถานที่</li>
    </ul>
  </div>
</div>
```

## วิธีการทดสอบ

### **1. ทดสอบการค้นหาและกรอง**
1. ไปที่หน้า `/tourism/custom-tour`
2. ลองค้นหาด้วยคำค้นหาต่างๆ
3. ลองกรองตามหมวดหมู่และประเภทอาหาร
4. ตรวจสอบว่าผลลัพธ์เปลี่ยนตามการกรอง

### **2. ทดสอบการเลือกสถานที่**
1. สลับระหว่าง Tab ต่างๆ
2. เลือกสถานที่ในแต่ละ Tab
3. ตรวจสอบว่า Summary Panel อัพเดท
4. ตรวจสอบว่าปุ่ม "ดูแผนที่" ทำงาน

### **3. ทดสอบระบบ Bookmark**
1. กดปุ่ม bookmark ในสถานที่ต่างๆ
2. ตรวจสอบว่าปุ่ม bookmark เปลี่ยนสี
3. กดปุ่ม "Bookmarks" เพื่อดูรายการ
4. ลองเปิด Google Maps จาก bookmarks

### **4. ทดสอบการเปิด Google Maps**
1. เลือกสถานที่ที่มี coordinates
2. กดปุ่ม Google Maps
3. ตรวจสอบว่าเปิดในแท็บใหม่
4. ตรวจสอบว่าแสดงตำแหน่งที่ถูกต้อง

### **5. ทดสอบการแสดงแผนที่**
1. เลือกสถานที่หลายแห่ง
2. กดปุ่ม "ดูแผนที่"
3. ตรวจสอบว่าแสดงรายการสถานที่
4. ตรวจสอบว่าแสดง coordinates

## ผลลัพธ์ที่คาดหวัง

### **ฟีเจอร์ที่เพิ่ม:**
- ✅ ระบบเลือกสถานที่ท่องเที่ยว ร้านอาหาร และเมนูอาหาร
- ✅ ระบบค้นหาและกรองข้อมูล
- ✅ ระบบ Tab สำหรับเลือกประเภทสถานที่
- ✅ ระบบ Bookmark
- ✅ การแสดงแผนที่และตำแหน่ง
- ✅ การเปิด Google Maps
- ✅ Summary Panel ที่อัพเดท

### **User Experience:**
- ✅ การค้นหาที่ง่ายและรวดเร็ว
- ✅ การเลือกสถานที่ที่สะดวก
- ✅ การจัดการ bookmarks ที่มีประสิทธิภาพ
- ✅ การเข้าถึง Google Maps ได้ทันที
- ✅ การแสดงข้อมูลที่ครบถ้วนและชัดเจน

## หมายเหตุ

### **สำคัญ:**
- ระบบใช้ API endpoints ใหม่สำหรับดึงข้อมูล
- มีการจัดการ state ที่ซับซ้อนสำหรับหลายประเภทข้อมูล
- ระบบ bookmark ทำงานใน memory เท่านั้น (ไม่เก็บใน database)
- การเปิด Google Maps ใช้ Google Maps API

### **Best Practices:**
- ใช้ TypeScript interfaces สำหรับ type safety
- มี error handling และ loading states
- ใช้ defensive programming สำหรับข้อมูลที่อาจเป็น undefined
- มี responsive design สำหรับทุกขนาดหน้าจอ
- ใช้ consistent UI patterns และ colors
