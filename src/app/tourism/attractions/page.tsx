import Link from 'next/link';

export default function AttractionsPage() {
  const attractionsData = [
    {
      id: 1,
      name: "วัดบางลำพู",
      description: "วัดเก่าแก่ที่มีประวัติศาสตร์ยาวนานกว่า 200 ปี เป็นศูนย์กลางทางจิตใจของชุมชนบางลำพู",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ถนนบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7563, lng: 100.5018 }
      },
      category: "temple",
      openingHours: { open: "06:00", close: "18:00" },
      admissionFee: 0,
      contactInfo: "02-xxx-xxxx",
      features: ["สถาปัตยกรรมไทย", "พระพุทธรูปเก่าแก่", "สวนสาธารณะ"],
      tags: ["วัด", "ประวัติศาสตร์", "วัฒนธรรม"]
    },
    {
      id: 2,
      name: "ตลาดบางลำพู",
      description: "ตลาดท้องถิ่นที่เต็มไปด้วยอาหารพื้นบ้าน สินค้าท้องถิ่น และวิถีชีวิตของชุมชน",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ถนนตลาดบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7573, lng: 100.5028 }
      },
      category: "market",
      openingHours: { open: "05:00", close: "12:00" },
      admissionFee: 0,
      contactInfo: "02-xxx-xxxx",
      features: ["อาหารพื้นบ้าน", "สินค้าท้องถิ่น", "วิถีชีวิตชุมชน"],
      tags: ["ตลาด", "อาหาร", "วัฒนธรรม"]
    },
    {
      id: 3,
      name: "พิพิธภัณฑ์ชุมชนบางลำพู",
      description: "พิพิธภัณฑ์ที่บอกเล่าเรื่องราวและประวัติศาสตร์ของชุมชนบางลำพู",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ศูนย์วัฒนธรรมบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7583, lng: 100.5038 }
      },
      category: "museum",
      openingHours: { open: "09:00", close: "17:00" },
      admissionFee: 50,
      contactInfo: "02-xxx-xxxx",
      features: ["นิทรรศการประวัติศาสตร์", "ของโบราณ", "กิจกรรมเรียนรู้"],
      tags: ["พิพิธภัณฑ์", "ประวัติศาสตร์", "การศึกษา"]
    },
    {
      id: 4,
      name: "สวนสาธารณะบางลำพู",
      description: "สวนสาธารณะที่ให้บริการพื้นที่พักผ่อนและออกกำลังกายสำหรับชุมชน",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "สวนสาธารณะบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7593, lng: 100.5048 }
      },
      category: "park",
      openingHours: { open: "05:00", close: "21:00" },
      admissionFee: 0,
      contactInfo: "02-xxx-xxxx",
      features: ["พื้นที่ออกกำลังกาย", "สวนดอกไม้", "ลานกิจกรรม"],
      tags: ["สวนสาธารณะ", "ออกกำลังกาย", "ธรรมชาติ"]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'temple': return 'bg-blue-100 text-blue-800';
      case 'museum': return 'bg-purple-100 text-purple-800';
      case 'market': return 'bg-green-100 text-green-800';
      case 'park': return 'bg-orange-100 text-orange-800';
      case 'historical': return 'bg-red-100 text-red-800';
      case 'cultural': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'temple': return 'วัด';
      case 'museum': return 'พิพิธภัณฑ์';
      case 'market': return 'ตลาด';
      case 'park': return 'สวนสาธารณะ';
      case 'historical': return 'สถานที่ประวัติศาสตร์';
      case 'cultural': return 'สถานที่วัฒนธรรม';
      default: return 'อื่นๆ';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/tourism" className="hover:text-green-600">ท่องเที่ยว</Link>
            <span>›</span>
            <span className="text-gray-900">แหล่งท่องเที่ยว</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">แหล่งท่องเที่ยวบางลำพู</h1>
          <p className="text-gray-600">สำรวจสถานที่ท่องเที่ยวที่น่าสนใจในชุมชนบางลำพู</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
              ทั้งหมด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              วัด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              พิพิธภัณฑ์
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ตลาด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              สวนสาธารณะ
            </button>
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractionsData.map((attraction) => (
            <article key={attraction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(attraction.category)}`}>
                    {getCategoryText(attraction.category)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {attraction.admissionFee === 0 ? 'ฟรี' : `฿${attraction.admissionFee}`}
                  </span>
                </div>
                
                <h2 className="text-lg font-semibold mb-3 line-clamp-2">
                  <Link href={`/tourism/attractions/${attraction.id}`} className="hover:text-green-600 transition-colors duration-200">
                    {attraction.name}
                  </Link>
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {attraction.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {attraction.location.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    เปิด {attraction.openingHours.open} - {attraction.openingHours.close}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {attraction.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/tourism/attractions/${attraction.id}`} className="text-green-600 hover:text-green-800 font-medium text-sm">
                    ดูรายละเอียด →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">2</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">3</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
