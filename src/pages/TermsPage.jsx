import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, AlertTriangle, CreditCard, Scale, RefreshCw } from 'lucide-react';
import Header from './Landing/components/Header';
import Footer from './Landing/components/Footer';

const sections = [
    {
        icon: <FileText className="w-5 h-5 text-[#0070CD]" />,
        title: 'قبول الشروط والأحكام',
        content: `باستخدامك لمنصة نبض Medical OS، فإنك توافق صراحةً على الالتزام بهذه الشروط والأحكام وجميع السياسات المرتبطة بها. إذا كنت لا توافق على أي من هذه الشروط، يُرجى التوقف عن استخدام المنصة.

تنطبق هذه الشروط على جميع المستخدمين بما في ذلك:
• **المرضى:** الأشخاص الذين يستخدمون المنصة للوصول إلى الرعاية الصحية.
• **الأطباء:** المهنيون الطبيون المعتمدون المسجلون في المنصة.
• **الزوار:** أي شخص يتصفح المنصة دون تسجيل.

تحتفظ منصة نبض بحق تعديل هذه الشروط في أي وقت مع إشعار مسبق للمستخدمين المسجلين.`,
    },
    {
        icon: <Users className="w-5 h-5 text-[#0070CD]" />,
        title: 'حسابات المستخدمين والمسؤوليات',
        content: `عند إنشاء حساب على منصة نبض، أنت مسؤول عن:

• **دقة المعلومات:** تقديم معلومات شخصية وطبية صحيحة وحديثة.
• **أمان الحساب:** الحفاظ على سرية كلمة المرور وعدم مشاركتها مع أي طرف.
• **الإبلاغ الفوري:** إخطارنا فوراً في حال الاشتباه بأي وصول غير مصرح به لحسابك.
• **الاستخدام المشروع:** استخدام المنصة للأغراض الصحية المشروعة فقط.

**للأطباء إضافةً:**
• تقديم وثائق وشهادات طبية صحيحة عند التسجيل.
• الالتزام بالمعايير الأخلاقية والمهنية الطبية.
• عدم تقديم تشخيصات خاطئة أو مضللة للمرضى.`,
    },
    {
        icon: <AlertTriangle className="w-5 h-5 text-[#0070CD]" />,
        title: 'حدود المسؤولية الطبية',
        content: `**تنبيه مهم:** منصة نبض هي أداة مساعدة تقنية ولا تحل محل الرأي الطبي المتخصص.

• المعلومات والاقتراحات المقدمة عبر تقنيات الذكاء الاصطناعي هي اقتراحات استرشادية فقط.
• القرار التشخيصي النهائي يعود دائماً للطبيب المعتمد المشرف.
• لا تتحمل منصة نبض مسؤولية أي قرارات طبية تُتخذ بناءً على المعلومات المعروضة منفردةً.
• في حالات الطوارئ الطبية، اتصل فوراً بالخدمات الطبية الطارئة (123) أو اذهب لأقرب مستشفى.
• المنصة غير مخصصة للحالات الطبية الطارئة أو الحياة أو الموت.`,
    },
    {
        icon: <CreditCard className="w-5 h-5 text-[#0070CD]" />,
        title: 'الاشتراكات والمدفوعات',
        content: `**للمرضى:**
• التسجيل الأساسي وإنشاء الملف الطبي مجاني تماماً.
• خدمات الحجز والتواصل مع الأطباء متاحة وفق الأسعار المعروضة عند الحجز.

**للأطباء والعيادات:**
• متاحة فترة تجريبية مجانية للخدمات المتقدمة.
• الباقات المدفوعة تُجدَّد تلقائياً ما لم يتم إلغاء الاشتراك قبل 48 ساعة من تاريخ التجديد.
• سياسة الاسترداد: يحق للأطباء طلب استرداد كامل خلال 7 أيام من بدء الاشتراك في حال عدم الرضا.
• جميع الأسعار بالجنيه المصري وتشمل ضريبة القيمة المضافة.`,
    },
    {
        icon: <Scale className="w-5 h-5 text-[#0070CD]" />,
        title: 'الملكية الفكرية والمحتوى',
        content: `جميع حقوق الملكية الفكرية لمنصة نبض، بما في ذلك:
• الشعار والهوية البصرية.
• تصميمات الواجهة والكود المصدري.
• خوارزميات الذكاء الاصطناعي والنماذج التحليلية.
• المحتوى التعليمي والطبي المنشور على المنصة.

هي ملك حصري لفريق تطوير منصة نبض ومحمية بموجب قوانين حقوق الملكية الفكرية.

يُحظر نسخ أو توزيع أو تعديل أي محتوى من المنصة دون إذن كتابي مسبق.`,
    },
    {
        icon: <RefreshCw className="w-5 h-5 text-[#0070CD]" />,
        title: 'التعديلات والإنهاء',
        content: `**تعديل الشروط:**
تحتفظ منصة نبض بحق تعديل هذه الشروط في أي وقت. سنُخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني المسجل لديك أو من خلال إشعار بارز على المنصة.

**إنهاء الحساب:**
• يحق لك حذف حسابك في أي وقت من إعدادات الملف الشخصي.
• تحتفظ منصة نبض بالحق في تعليق أو إلغاء الحسابات التي تنتهك هذه الشروط.
• عند إلغاء الحساب، يتم حذف بياناتك الشخصية خلال 30 يوم، مع الاحتفاظ بما يُلزم به القانون.

**القانون الواجب التطبيق:**
تخضع هذه الشروط لقوانين جمهورية مصر العربية، وتختص محاكم القاهرة بالفصل في أي نزاعات.`,
    },
];

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1F2E3C]" dir="rtl">
            <Header />
            <main>

                {/* Hero */}
                <div className="relative bg-gradient-to-br from-[#003B73] via-[#005ba6] to-[#0070CD] pt-36 pb-24 px-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent"></div>

                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-sm">
                                <FileText className="w-4 h-4 text-blue-200" />
                                <span className="text-white/90 text-sm font-bold tracking-wide">الاستخدام المسؤول</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-[1.2]">
                                شروط <span className="text-blue-200">الاستخدام</span>
                            </h1>
                            <p className="text-blue-100/80 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                يُرجى قراءة هذه الشروط بعناية قبل استخدام منصة نبض. استخدامك للمنصة يعني موافقتك الكاملة على هذه الشروط.
                            </p>
                            <p className="text-blue-200/60 text-sm mt-4 font-medium">آخر تحديث: يونيو 2026</p>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,112,205,0.05)] p-7 md:p-8"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-[#F0F7FF] rounded-xl flex items-center justify-center flex-shrink-0">
                                    {section.icon}
                                </div>
                                <h2 className="text-lg md:text-xl font-black text-[#1F2E3C] tracking-tight">{section.title}</h2>
                            </div>
                            <div className="text-slate-500 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line">
                                {section.content}
                            </div>
                        </motion.div>
                    ))}

                </div>

            </main>
            <Footer />
        </div>
    );
};

export default TermsPage;
