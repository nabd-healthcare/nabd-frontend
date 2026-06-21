import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Award } from 'lucide-react';

const doctors = [
    {
        name: "د. أحمد محمود",
        specialty: "أخصائي القلب والأوعية الدموية",
        rating: 4.9,
        reviews: 245,
        location: "القاهرة",
        experience: "15 سنة خبرة",
        image: "https://ui-avatars.com/api/?name=Ahmed+Mahmoud&background=1C8B8F&color=fff&size=200"
    },
    {
        name: "د. سارة عبد الرحمن",
        specialty: "استشاري الأطفال",
        rating: 4.8,
        reviews: 189,
        location: "الإسكندرية",
        experience: "12 سنة خبرة",
        image: "https://ui-avatars.com/api/?name=Sara+Abdelrahman&background=14666A&color=fff&size=200"
    },
    {
        name: "د. محمد حسن",
        specialty: "جراح عظام",
        rating: 4.7,
        reviews: 312,
        location: "الجيزة",
        experience: "18 سنة خبرة",
        image: "https://ui-avatars.com/api/?name=Mohamed+Hassan&background=1F2E3C&color=fff&size=200"
    }
];

const OurDoctors = () => {
    const navigate = useNavigate();
    return (
        <section id="doctors" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-black text-[#1F2E3C] mb-4">
                        أطباؤنا <span className="text-[#1C8B8F]">المميزون</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        نخبة من أفضل الأطباء في مختلف التخصصات الطبية
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doctor, index) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 group">
                            <div className="relative h-48 bg-gradient-to-br from-[#1C8B8F] to-[#14666A] overflow-hidden">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-bold text-sm">{doctor.rating}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#1F2E3C] mb-1">{doctor.name}</h3>
                                <p className="text-[#1C8B8F] font-medium mb-4">{doctor.specialty}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{doctor.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Award className="w-4 h-4" />
                                        <span>{doctor.experience}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">{doctor.reviews} تقييم</span>
                                    <button 
                                        onClick={() => navigate('/register?role=patient')}
                                        className="px-4 py-2 bg-[#1C8B8F] text-white rounded-lg font-bold hover:bg-[#14666A] transition text-sm"
                                    >
                                        احجز الآن
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="px-8 py-4 border-2 border-[#1C8B8F] text-[#1C8B8F] rounded-xl font-bold hover:bg-[#1C8B8F] hover:text-white transition">
                        عرض جميع الأطباء
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OurDoctors;
