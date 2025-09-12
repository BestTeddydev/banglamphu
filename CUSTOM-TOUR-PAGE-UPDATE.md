# การอัพเดทหน้า Custom Tour: ดึงข้อมูลจากที่แอดมินสร้าง

## ปัญหาที่แก้ไข

### **ปัญหา: หน้า `/tourism/custom-tour` ใช้ข้อมูลแบบ hard-coded**
- หน้า custom-tour เดิมใช้ข้อมูลแหล่งท่องเที่ยวและร้านอาหารแบบ hard-coded
- ไม่ได้ดึงข้อมูลจากที่แอดมินสร้างในระบบ
- ไม่สามารถแสดงแพ็คเกจทัวร์ที่แอดมินสร้างได้

## การแก้ไข

### **1. เปลี่ยนแนวคิดจาก Custom Tour เป็น Package Tour**

#### **ไฟล์: `src/app/tourism/custom-tour/page.tsx`**

##### **เพิ่ม Interface สำหรับ Package**
```typescript
interface Package {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  includes: string[];
  itinerary: {
    time: string;
    activity: string;
    location: string;
  }[];
  attractions: {
    _id: string;
    name: string;
    description: string;
    location: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }[];
  restaurants: {
    _id: string;
    name: string;
    description: string;
    location: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }[];
  images: string[];
  category: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  isActive: boolean;
}
```

##### **เพิ่ม State Management**
```typescript
export default function CustomTourPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
```

##### **เพิ่มฟังก์ชันดึงข้อมูลแพ็คเกจ**
```typescript
const fetchPackages = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('/api/packages', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      setPackages(data.packages || []);
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'ไม่สามารถโหลดข้อมูลได้');
    }
  } catch (error) {
    console.error('Error fetching packages:', error);
    setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
  } finally {
    setLoading(false);
  }
};
```

### **2. แก้ไข UI เพื่อแสดงแพ็คเกจทัวร์**

#### **เปลี่ยน Header**
```typescript
// ก่อนแก้ไข
<h1 className="text-3xl font-bold text-gray-900 mb-4">สร้างทัวร์แบบกำหนดเอง</h1>
<p className="text-gray-600">เลือกแหล่งท่องเที่ยวและร้านอาหารที่คุณสนใจ เพื่อสร้างทัวร์ของคุณเอง</p>

// หลังแก้ไข
<h1 className="text-3xl font-bold text-gray-900 mb-4">แพ็คเกจทัวร์</h1>
<p className="text-gray-600">เลือกแพ็คเกจทัวร์ที่คุณสนใจ เพื่อสร้างประสบการณ์การท่องเที่ยวที่สมบูรณ์แบบ</p>
```

#### **เพิ่ม Loading และ Error States**
```typescript
{loading ? (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
    <p className="text-gray-600">กำลังโหลดแพ็คเกจทัวร์...</p>
  </div>
) : error ? (
  <div className="text-center py-12">
    <div className="text-red-600 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={fetchPackages}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      ลองใหม่
    </button>
  </div>
) : packages.length === 0 ? (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีแพ็คเกจทัวร์</h3>
    <p className="text-gray-600">แอดมินยังไม่ได้สร้างแพ็คเกจทัวร์</p>
  </div>
) : (
  // แสดงรายการแพ็คเกจ
)}
```

#### **แสดงรายการแพ็คเกจทัวร์**
```typescript
<div className="space-y-4">
  {packages.map((pkg) => (
    <div key={pkg._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <img
          src={(pkg.images && pkg.images[0]) || '/placeholder-package.jpg'}
          alt={pkg.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{pkg.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {pkg.duration} ชั่วโมง
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  สูงสุด {pkg.maxParticipants} คน
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {pkg.attractions.length} แหล่งท่องเที่ยว
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  {pkg.restaurants.length} ร้านอาหาร
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ฿{pkg.price.toLocaleString()}
              </div>
              <button
                onClick={() => setSelectedPackage(pkg._id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedPackage === pkg._id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPackage === pkg._id ? 'เลือกแล้ว' : 'เลือกแพ็คเกจ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

### **3. แก้ไข Summary Panel**

#### **แสดงข้อมูลแพ็คเกจที่เลือก**
```typescript
{!selectedPackage ? (
  <div className="text-center py-8">
    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
    <p className="text-gray-500">ยังไม่ได้เลือกแพ็คเกจ</p>
    <p className="text-sm text-gray-400">เลือกแพ็คเกจทัวร์เพื่อดูรายละเอียด</p>
  </div>
) : selectedPackageData ? (
  <div className="space-y-4">
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">{selectedPackageData.name}</h4>
      <p className="text-sm text-gray-600 mb-3">{selectedPackageData.description}</p>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>ระยะเวลา:</span>
          <span className="font-medium">{selectedPackageData.duration} ชั่วโมง</span>
        </div>
        <div className="flex justify-between">
          <span>ราคา:</span>
          <span className="font-medium text-green-600">฿{selectedPackageData.price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>จำนวนคนสูงสุด:</span>
          <span className="font-medium">{selectedPackageData.maxParticipants} คน</span>
        </div>
        <div className="flex justify-between">
          <span>แหล่งท่องเที่ยว:</span>
          <span className="font-medium">{selectedPackageData.attractions.length} แห่ง</span>
        </div>
        <div className="flex justify-between">
          <span>ร้านอาหาร:</span>
          <span className="font-medium">{selectedPackageData.restaurants.length} ร้าน</span>
        </div>
      </div>
    </div>

    <div className="border-t pt-4">
      <h4 className="font-semibold text-gray-900 mb-2">สิ่งที่รวมในแพ็คเกจ</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        {selectedPackageData.includes.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="border-t pt-4">
      <h4 className="font-semibold text-gray-900 mb-2">สถานที่ในแพ็คเกจ</h4>
      <div className="space-y-2">
        {selectedPlaces.map((place, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">{place.name}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-blue-50 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-2">คำแนะนำ</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• เตรียมตัวตามโปรแกรมที่กำหนด</li>
        <li>• มาถึงก่อนเวลาเริ่มต้น</li>
        <li>• เตรียมเงินสดสำหรับค่าใช้จ่ายเพิ่มเติม</li>
        <li>• สวมเสื้อผ้าที่เหมาะสมกับกิจกรรม</li>
      </ul>
    </div>

    <div className="pt-4">
      <Link
        href={`/tourism/packages/${selectedPackage}`}
        className="w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 font-medium transition-colors duration-200 block"
      >
        จองแพ็คเกจนี้
      </Link>
    </div>
  </div>
) : null}
```

### **4. แก้ไข Map Section**

#### **แสดงแผนที่สำหรับแพ็คเกจที่เลือก**
```typescript
{showMap && selectedPackageData && (
  <div className="mt-8">
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">แผนที่ตำแหน่งสถานที่ในแพ็คเกจ</h3>
      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-gray-600 mb-2">แผนที่แสดงตำแหน่งสถานที่</p>
          <p className="text-sm text-gray-500">สถานที่ในแพ็คเกจจะแสดงบนแผนที่นี้</p>
          
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

## วิธีการทดสอบ

### **1. ทดสอบการโหลดข้อมูล**
1. ไปที่หน้า `/tourism/custom-tour`
2. ตรวจสอบว่าแสดง loading state
3. ตรวจสอบว่าโหลดแพ็คเกจทัวร์จากแอดมินได้

### **2. ทดสอบการเลือกแพ็คเกจ**
1. เลือกแพ็คเกจทัวร์
2. ตรวจสอบว่า Summary Panel แสดงข้อมูลแพ็คเกจ
3. ตรวจสอบว่าปุ่ม "จองแพ็คเกจนี้" ทำงาน

### **3. ทดสอบการดูแผนที่**
1. เลือกแพ็คเกจทัวร์
2. กดปุ่ม "ดูแผนที่"
3. ตรวจสอบว่าแสดงสถานที่ในแพ็คเกจ

### **4. ทดสอบ Error Handling**
1. ตรวจสอบว่าแสดง error state เมื่อไม่สามารถโหลดข้อมูลได้
2. ตรวจสอบว่าปุ่ม "ลองใหม่" ทำงาน
3. ตรวจสอบว่าแสดง empty state เมื่อไม่มีแพ็คเกจ

## ผลลัพธ์ที่คาดหวัง

### **ก่อนแก้ไข:**
- ❌ ใช้ข้อมูลแบบ hard-coded
- ❌ ไม่ได้ดึงข้อมูลจากแอดมิน
- ❌ ไม่สามารถแสดงแพ็คเกจทัวร์ได้

### **หลังแก้ไข:**
- ✅ ดึงข้อมูลแพ็คเกจทัวร์จากแอดมิน
- ✅ แสดงรายการแพ็คเกจที่แอดมินสร้าง
- ✅ สามารถเลือกและดูรายละเอียดแพ็คเกจได้
- ✅ มี loading และ error states
- ✅ สามารถจองแพ็คเกจได้
- ✅ แสดงแผนที่สถานที่ในแพ็คเกจ

## หมายเหตุ

### **สำคัญ:**
- หน้า custom-tour ตอนนี้แสดงแพ็คเกจทัวร์ที่แอดมินสร้างแทนที่จะเป็น custom tour
- ใช้ API `/api/packages` เพื่อดึงข้อมูลแพ็คเกจ
- มี error handling และ loading states ที่สมบูรณ์
- สามารถเชื่อมต่อไปยังหน้าจองแพ็คเกจได้

### **Best Practices:**
- ใช้ TypeScript interfaces สำหรับ type safety
- มี loading และ error states ที่ชัดเจน
- แสดงข้อมูลแพ็คเกจอย่างครบถ้วน
- มี UX ที่ดีสำหรับการเลือกแพ็คเกจ
