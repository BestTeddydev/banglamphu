import Link from 'next/link';

export default function RestaurantsPage() {
  const restaurantsData = [
    {
      id: 1,
      name: "ร้านอาหารบ้านบางลำพู",
      description: "ร้านอาหารพื้นบ้านที่เสิร์ฟอาหารไทยแท้ๆ รสชาติดั้งเดิม ใช้วัตถุดิบสดใหม่จากตลาดท้องถิ่น",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ถนนอาหารบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7563, lng: 100.5018 }
      },
      cuisine: ["อาหารไทย", "อาหารพื้นบ้าน"],
      menu: [
        { name: "ข้าวผัดกุ้ง", description: "ข้าวผัดกุ้งสดรสเผ็ด", price: 80, category: "main" },
        { name: "แกงเขียวหวานไก่", description: "แกงเขียวหวานไก่เนื้อนุ่ม", price: 120, category: "main" },
        { name: "ส้มตำไทย", description: "ส้มตำไทยแท้ๆ", price: 60, category: "appetizer" }
      ],
      openingHours: { open: "10:00", close: "22:00" },
      contactInfo: {
        phone: "02-xxx-xxxx",
        email: "info@restaurant.com",
        website: "www.restaurant.com"
      },
      features: ["อาหารพื้นบ้าน", "วัตถุดิบสดใหม่", "ราคาประหยัด"],
      tags: ["อาหารไทย", "พื้นบ้าน", "ประหยัด"]
    },
    {
      id: 2,
      name: "ร้านขนมโบราณบางลำพู",
      description: "ร้านขนมโบราณที่ทำขนมไทยแบบดั้งเดิมด้วยมือ ใช้สูตรโบราณที่สืบทอดกันมา",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ถนนขนมบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7573, lng: 100.5028 }
      },
      cuisine: ["ขนมไทย", "ของหวาน"],
      menu: [
        { name: "ขนมครก", description: "ขนมครกแบบโบราณ", price: 25, category: "dessert" },
        { name: "ขนมถ้วย", description: "ขนมถ้วยน้ำกะทิ", price: 30, category: "dessert" },
        { name: "ชาไทย", description: "ชาไทยเย็น", price: 20, category: "drink" }
      ],
      openingHours: { open: "08:00", close: "18:00" },
      contactInfo: {
        phone: "02-xxx-xxxx",
        email: "sweet@restaurant.com"
      },
      features: ["ขนมโบราณ", "ทำด้วยมือ", "สูตรดั้งเดิม"],
      tags: ["ขนมไทย", "โบราณ", "ของหวาน"]
    },
    {
      id: 3,
      name: "ร้านชาบางลำพู",
      description: "ร้านชาที่เสิร์ฟชาไทยและเครื่องดื่มพื้นบ้าน พร้อมขนมไทยหลากหลายชนิด",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ถนนชาบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7583, lng: 100.5038 }
      },
      cuisine: ["เครื่องดื่ม", "ชาไทย"],
      menu: [
        { name: "ชาไทยเย็น", description: "ชาไทยเย็นหวานหอม", price: 25, category: "drink" },
        { name: "ชาเขียว", description: "ชาเขียวแท้ๆ", price: 30, category: "drink" },
        { name: "ขนมปังปิ้ง", description: "ขนมปังปิ้งทาเนย", price: 15, category: "appetizer" }
      ],
      openingHours: { open: "07:00", close: "20:00" },
      contactInfo: {
        phone: "02-xxx-xxxx",
        email: "tea@restaurant.com"
      },
      features: ["ชาไทยแท้", "บรรยากาศสบาย", "ขนมหลากหลาย"],
      tags: ["ชาไทย", "เครื่องดื่ม", "บรรยากาศ"]
    },
    {
      id: 4,
      name: "ร้านอาหารริมน้ำบางลำพู",
      description: "ร้านอาหารริมน้ำที่เสิร์ฟอาหารทะเลสดใหม่และอาหารไทยพื้นบ้าน พร้อมวิวแม่น้ำที่สวยงาม",
      images: ["/api/placeholder/400/250"],
      location: {
        address: "ริมแม่น้ำบางลำพู กรุงเทพมหานคร",
        coordinates: { lat: 13.7593, lng: 100.5048 }
      },
      cuisine: ["อาหารทะเล", "อาหารไทย"],
      menu: [
        { name: "กุ้งเผา", description: "กุ้งเผาใหญ่สดใหม่", price: 200, category: "main" },
        { name: "ปลากะพงทอด", description: "ปลากะพงทอดกรอบ", price: 180, category: "main" },
        { name: "ต้มยำกุ้ง", description: "ต้มยำกุ้งรสเผ็ด", price: 150, category: "main" }
      ],
      openingHours: { open: "11:00", close: "23:00" },
      contactInfo: {
        phone: "02-xxx-xxxx",
        email: "seafood@restaurant.com",
        website: "www.seafood.com"
      },
      features: ["อาหารทะเลสด", "วิวแม่น้ำ", "บรรยากาศโรแมนติก"],
      tags: ["อาหารทะเล", "ริมน้ำ", "โรแมนติก"]
    }
  ];

  const getCuisineColor = (cuisine: string) => {
    switch (cuisine) {
      case 'อาหารไทย': return 'bg-red-100 text-red-800';
      case 'อาหารพื้นบ้าน': return 'bg-orange-100 text-orange-800';
      case 'ขนมไทย': return 'bg-pink-100 text-pink-800';
      case 'ของหวาน': return 'bg-purple-100 text-purple-800';
      case 'เครื่องดื่ม': return 'bg-blue-100 text-blue-800';
      case 'ชาไทย': return 'bg-green-100 text-green-800';
      case 'อาหารทะเล': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <span className="text-gray-900">ร้านอาหาร</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ร้านอาหารบางลำพู</h1>
          <p className="text-gray-600">ชิมอาหารท้องถิ่นและอาหารพื้นบ้านที่อร่อยในชุมชนบางลำพู</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
              ทั้งหมด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              อาหารไทย
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ขนมไทย
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              เครื่องดื่ม
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              อาหารทะเล
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurantsData.map((restaurant) => (
            <article key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.cuisine.slice(0, 2).map((cuisine) => (
                      <span key={cuisine} className={`px-2 py-1 rounded-full text-xs font-semibold ${getCuisineColor(cuisine)}`}>
                        {cuisine}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    เปิด {restaurant.openingHours.open} - {restaurant.openingHours.close}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">
                  <Link href={`/tourism/restaurants/${restaurant.id}`} className="hover:text-green-600 transition-colors duration-200">
                    {restaurant.name}
                  </Link>
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {restaurant.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {restaurant.location.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {restaurant.contactInfo.phone}
                  </div>
                </div>
                
                {/* Menu Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">เมนูแนะนำ</h4>
                  <div className="space-y-1">
                    {restaurant.menu.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-green-600 font-medium">฿{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/tourism/restaurants/${restaurant.id}`} className="text-green-600 hover:text-green-800 font-medium text-sm">
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
