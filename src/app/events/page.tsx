import Link from 'next/link';

export default function EventsPage() {
  const eventsData = [
    {
      id: 1,
      title: "งานบุญประจำปี",
      description: "งานบุญประจำปีของชุมชนบางลำพู พร้อมกิจกรรมต่างๆ และอาหารพื้นบ้าน",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      location: "วัดบางลำพู",
      organizer: "คณะกรรมการชุมชน",
      contactInfo: "02-xxx-xxxx",
      category: "religious",
      maxParticipants: 200,
      currentParticipants: 45,
      registrationRequired: true,
      isActive: true,
      tags: ["บุญ", "ชุมชน", "อาหาร"]
    },
    {
      id: 2,
      title: "ตลาดนัดชุมชน",
      description: "ตลาดนัดชุมชนสำหรับขายสินค้าพื้นบ้านและอาหารท้องถิ่น",
      startDate: "2024-02-25",
      endDate: "2024-02-25",
      location: "ลานชุมชนบางลำพู",
      organizer: "กลุ่มแม่บ้าน",
      contactInfo: "081-xxx-xxxx",
      category: "social",
      maxParticipants: 50,
      currentParticipants: 23,
      registrationRequired: true,
      isActive: true,
      tags: ["ตลาด", "สินค้า", "อาหาร"]
    },
    {
      id: 3,
      title: "กิจกรรมกีฬาชุมชน",
      description: "การแข่งขันกีฬาชุมชนประจำปี เพื่อสร้างความสามัคคีและสุขภาพดี",
      startDate: "2024-03-10",
      endDate: "2024-03-12",
      location: "สนามกีฬาชุมชน",
      organizer: "คณะกรรมการกีฬา",
      contactInfo: "083-xxx-xxxx",
      category: "sports",
      maxParticipants: 100,
      currentParticipants: 67,
      registrationRequired: true,
      isActive: true,
      tags: ["กีฬา", "แข่งขัน", "สุขภาพ"]
    },
    {
      id: 4,
      title: "อบรมความรู้เรื่องการเกษตร",
      description: "การอบรมความรู้เรื่องการเกษตรแบบยั่งยืน สำหรับสมาชิกชุมชน",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      location: "ศูนย์เรียนรู้ชุมชน",
      organizer: "กรมส่งเสริมการเกษตร",
      contactInfo: "02-xxx-xxxx",
      category: "education",
      maxParticipants: 30,
      currentParticipants: 18,
      registrationRequired: true,
      isActive: true,
      tags: ["เกษตร", "อบรม", "ความรู้"]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      case 'religious': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'cultural': return 'วัฒนธรรม';
      case 'sports': return 'กีฬา';
      case 'education': return 'การศึกษา';
      case 'social': return 'สังคม';
      case 'religious': return 'ศาสนา';
      default: return 'อื่นๆ';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">กิจกรรมชุมชน</h1>
          <p className="text-gray-600">เข้าร่วมกิจกรรมต่างๆ ของชุมชนบางลำพู</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              ทั้งหมด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              วัฒนธรรม
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              กีฬา
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              การศึกษา
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              สังคม
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ศาสนา
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventsData.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                    {getCategoryText(event.category)}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(event.startDate)}</span>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">
                  <Link href={`/events/${event.id}`} className="hover:text-blue-600 transition-colors duration-200">
                    {event.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    จัดโดย {event.organizer}
                  </div>
                </div>
                
                {event.registrationRequired && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">ผู้เข้าร่วม</span>
                      <span className="text-gray-900">{event.currentParticipants}/{event.maxParticipants}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {event.contactInfo}
                  </div>
                  <Link 
                    href={`/events/${event.id}`} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    {event.registrationRequired ? 'สมัครเข้าร่วม' : 'ดูรายละเอียด'}
                  </Link>
                </div>
              </div>
            </div>
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
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
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
