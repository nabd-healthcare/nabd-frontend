import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "ما هو منصة نبض؟",
        answer: "نبض هو نظام رعاية صحية ذكي يربط المرضى بالأطباء ويستخدم الذكاء الاصطناعي التوليدي والتحليلي لدعم التشخيص الطبي وتحسين جودة الرعاية الصحية وتقليل الأخطاء الطبية."
    },
    {
        question: "هل البيانات الطبية والروشتات آمنة؟",
        answer: "نعم، نستخدم أعلى معايير التشفير (End-to-End Encryption) لحماية بياناتك الطبية. جميع المعلومات محمية في خوادم سحابية آمنة ولا يمكن الوصول إليها إلا من قبلك ومن قبل الأطباء المصرح لهم فقط."
    },
    {
        question: "كيف يعمل الذكاء الاصطناعي في نبض؟",
        answer: "يستخدم نبض نماذج لغوية وتحليلية متقدمة (LLMs) لتحليل الأعراض، العلامات الحيوية، والتاريخ الطبي، ويقدم تنبيهات للتفاعلات الدوائية واقتراحات تشخيصية للأطباء، مما يساعد في تحسين دقة التشخيص بنسبة تزيد عن 95%."
    },
    {
        question: "هل يمكنني استخدام نبض مجاناً؟",
        answer: "نعم، بالنسبة للمرضى التسجيل وإنشاء الملف الطبي الموحد مجاني تماماً. بالنسبة للأطباء والعيادات، هناك فترات تجريبية مجانية للخدمات المتقدمة والإدارة الذكية للعيادات."
    },
    {
        question: "كيف أحجز موعد مع طبيب؟",
        answer: "من خلال التطبيق أو الموقع، يمكنك تصفح الأطباء حسب التخصص والموقع الجغرافي أو التقييم، واختيار الموعد المتاح، وتأكيد الحجز فوراً بخطوة واحدة دون الحاجة للانتظار الطويل."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0); // Open the first one by default

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-32 bg-[#F8FAFC] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0070CD]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-[#0070CD] font-black text-xs uppercase tracking-widest mb-4 block">استفسارات</span>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#1F2E3C] mb-6 tracking-tight">
                        الأسئلة <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0070CD] to-[#3399FF]">الشائعة</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        كل ما تود معرفته عن منصة نبض وكيفية تحقيق أقصى استفادة من خدماتنا الصحية.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                key={index} 
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#0070CD]/30 shadow-[0_15px_30px_-15px_rgba(0,112,205,0.2)] scale-[1.02] relative z-10' : 'border-slate-100 hover:border-[#0070CD]/10 shadow-sm hover:shadow-md'}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-6 flex justify-between items-center text-right group focus:outline-none"
                                >
                                    <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-[#0070CD]' : 'text-[#1F2E3C] group-hover:text-[#0070CD]'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#0070CD]/10 text-[#0070CD]' : 'bg-slate-50 text-slate-400 group-hover:bg-[#0070CD]/5 group-hover:text-[#0070CD]'}`}>
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        >
                                            <div className="px-6 pb-6 pt-2 text-slate-600 leading-loose font-medium text-[15px] border-t border-slate-50">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <p className="text-slate-500 font-medium">
                        لم تجد إجابة لسؤالك؟ <a href="#contact" className="text-[#0070CD] font-bold hover:underline underline-offset-4">تواصل مع الدعم الفني</a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
