import Link from 'next/link';

export default function NewsPage() {
  const newsData = [
    {
      id: 1,
      title: "ประชุมชุมชนประจำเดือนมกราคม 2567",
      content: "การประชุมชุมชนประจำเดือนมกราคม 2567 เพื่อหารือเรื่องการพัฒนาชุมชน การปรับปรุงสาธารณูปโภค และกิจกรรมต่างๆ ที่จะจัดขึ้นในปีนี้",
      author: "คณะกรรมการชุมชน",
      publishedAt: "2024-01-15",
      category: "general",
      imageUrl: "/api/placeholder/400/250",
      views: 156,
      tags: ["ประชุม", "ชุมชน", "การพัฒนา"]
    },
    {
      id: 2,
      title: "งานวันเด็กแห่งชาติประจำปี 2567",
      content: "กิจกรรมวันเด็กแห่งชาติประจำปี 2567 พร้อมของรางวัลและอาหาร กิจกรรมสนุกๆ สำหรับเด็กๆ ในชุมชน",
      author: "ทีมงานกิจกรรม",
      publishedAt: "2024-01-10",
      category: "event",
      imageUrl: "/api/placeholder/400/250",
      views: 203,
      tags: ["วันเด็ก", "กิจกรรม", "เด็ก"]
    },
    {
      id: 3,
      title: "การปรับปรุงถนนในชุมชนบางลำพู",
      content: "แจ้งให้ทราบเรื่องการปรับปรุงถนนในชุมชนบางลำพู เริ่มดำเนินการตั้งแต่วันที่ 20 มกราคม 2567",
      author: "เทศบาล",
      publishedAt: "2024-01-05",
      category: "announcement",
      imageUrl: "/api/placeholder/400/250",
      views: 89,
      tags: ["ถนน", "ปรับปรุง", "สาธารณูปโภค"]
    },
    {
      id: 4,
      title: "กิจกรรมทำความสะอาดชุมชน",
      content: "เชิญชวนสมาชิกชุมชนเข้าร่วมกิจกรรมทำความสะอาดชุมชนในวันเสาร์ที่ 27 มกราคม 2567",
      author: "คณะกรรมการชุมชน",
      publishedAt: "2024-01-20",
      category: "community",
      imageUrl: "/api/placeholder/400/250",
      views: 134,
      tags: ["ทำความสะอาด", "ชุมชน", "สิ่งแวดล้อม"]
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      case 'community': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'general': return 'ข่าวทั่วไป';
      case 'event': return 'กิจกรรม';
      case 'announcement': return 'ประกาศ';
      case 'community': return 'ชุมชน';
      default: return 'อื่นๆ';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ข่าวสารชุมชน</h1>
          <p className="text-gray-600">ติดตามข่าวสารและประกาศต่างๆ ของชุมชนบางลำพู</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              ทั้งหมด
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ข่าวทั่วไป
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              กิจกรรม
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ประกาศ
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              ชุมชน
            </button>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((news) => (
            <article key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(news.category)}`}>
                    {getCategoryText(news.category)}
                  </span>
                  <span className="text-sm text-gray-500">{news.publishedAt}</span>
                </div>
                
                <h2 className="text-lg font-semibold mb-3 line-clamp-2">
                  <Link href={`/news/${news.id}`} className="hover:text-blue-600 transition-colors duration-200">
                    {news.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {news.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>โดย {news.author}</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {news.views}
                    </span>
                    <Link href={`/news/${news.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      อ่านต่อ →
                    </Link>
                  </div>
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
