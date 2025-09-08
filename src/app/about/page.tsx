export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">เกี่ยวกับชุมชนบางลำพู</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ชุมชนบางลำพูเป็นชุมชนที่มีประวัติศาสตร์ยาวนานและมีความเข้มแข็งในด้านวัฒนธรรม
          </p>
        </div>

        {/* History Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ประวัติชุมชน</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ชุมชนบางลำพูเป็นชุมชนเก่าแก่ที่มีประวัติศาสตร์ยาวนานกว่า 200 ปี 
                  ตั้งอยู่ในเขตกรุงเทพมหานคร เป็นชุมชนที่มีความหลากหลายทางวัฒนธรรม
                  และมีวิถีชีวิตที่ผสมผสานระหว่างความเป็นไทยดั้งเดิมกับความทันสมัย
                </p>
                <p className="text-gray-700 leading-relaxed">
                  ชุมชนแห่งนี้มีบทบาทสำคัญในการพัฒนากรุงเทพมหานคร 
                  และเป็นศูนย์กลางของกิจกรรมทางสังคมและวัฒนธรรมต่างๆ
                  ที่ช่วยสร้างความเข้มแข็งให้กับชุมชน
                </p>
              </div>
              <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">วิสัยทัศน์</h3>
              <p className="text-gray-700 leading-relaxed">
                เป็นชุมชนที่เข้มแข็ง มีความสามัคคี และพัฒนาอย่างยั่งยืน 
                โดยรักษาวัฒนธรรมและประเพณีดั้งเดิมควบคู่กับการพัฒนาสมัยใหม่
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">พันธกิจ</h3>
              <p className="text-gray-700 leading-relaxed">
                ส่งเสริมการมีส่วนร่วมของสมาชิกชุมชนในการพัฒนาชุมชน 
                รักษาและสืบทอดวัฒนธรรมท้องถิ่น สร้างความเข้มแข็งทางเศรษฐกิจชุมชน
              </p>
            </div>
          </div>
        </section>

        {/* Community Leaders */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">คณะกรรมการชุมชน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">นายสมชาย ใจดี</h3>
                <p className="text-blue-600 font-medium mb-2">ประธานชุมชน</p>
                <p className="text-gray-600 text-sm">
                  มีประสบการณ์ในการบริหารชุมชนมากว่า 10 ปี
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">นางสมศรี รักชุมชน</h3>
                <p className="text-green-600 font-medium mb-2">รองประธานชุมชน</p>
                <p className="text-gray-600 text-sm">
                  ผู้เชี่ยวชาญด้านกิจกรรมชุมชนและวัฒนธรรม
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">นายวิชัย พัฒนาชุมชน</h3>
                <p className="text-purple-600 font-medium mb-2">เลขานุการชุมชน</p>
                <p className="text-gray-600 text-sm">
                  ผู้รับผิดชอบด้านการสื่อสารและข้อมูลข่าวสาร
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Values */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">ค่านิยมชุมชน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ความรัก</h3>
                <p className="text-gray-600 text-sm">รักชุมชน รักเพื่อนบ้าน รักวัฒนธรรม</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ความสามัคคี</h3>
                <p className="text-gray-600 text-sm">ร่วมมือกัน พึ่งพาอาศัยกัน</p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ความซื่อสัตย์</h3>
                <p className="text-gray-600 text-sm">ซื่อสัตย์ต่อชุมชนและเพื่อนบ้าน</p>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">การพัฒนา</h3>
                <p className="text-gray-600 text-sm">พัฒนาชุมชนอย่างต่อเนื่อง</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">ต้องการทราบข้อมูลเพิ่มเติม?</h2>
            <p className="text-blue-100 mb-6">
              ติดต่อเราเพื่อสอบถามข้อมูลเกี่ยวกับชุมชนบางลำพู
            </p>
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              ติดต่อชุมชน
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
