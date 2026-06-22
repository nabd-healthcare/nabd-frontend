import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Bell, Mail } from 'lucide-react';
import Header from './Landing/components/Header';
import Footer from './Landing/components/Footer';

const sections = [
    {
        icon: <Eye className="w-5 h-5 text-[#0070CD]" />,
        title: 'المعلومات التي نجمعها',
        content: `نجمع أنواعاً مختلفة من المعلومات لتقديم خدماتنا الصحية بكفاءة وأمان:

• **البيانات الشخصية:** الاسم، البريد الإلكتروني، رقم الهاتف، وتاريخ الميلاد عند التسجيل.
• **السجلات الطبية:** التاريخ المرضي، نتائج الفحوصات، الوصفات الطبية، والتشخيصات التي يدخلها الأطباء المعتمدون.
• **بيانات الاستخدام:** سجلات الجلسات، عمليات البحث، وأنماط التفاعل مع المنصة لتحسين تجربة المستخدم.
• **البيانات التقنية:** عنوان IP، نوع المتصفح، ونظام التشغيل لأغراض الأمان والتشخيص التقني.`,
    },
    {
        icon: <Database className="w-5 h-5 text-[#0070CD]" />,
        title: 'كيف نستخدم معلوماتك',
        content: `تُستخدم البيانات التي نجمعها حصرياً للأغراض التالية:

• تقديم خدمات الرعاية الصحية وربط المرضى بالأطباء المعتمدين.
• إدارة المواعيد الطبية والسجلات الصحية الإلكترونية.
• تحليل الأعراض وتقديم اقتراحات تشخيصية عبر تقنيات الذكاء الاصطناعي المعتمدة طبياً.
• إرسال إشعارات تتعلق بمواعيدك الطبية وتحديثات منصة نبض.
• تحسين جودة الخدمات المقدمة وتطوير ميزات المنصة.
• الامتثال للمتطلبات القانونية والتنظيمية في مجال الرعاية الصحية.`,
    },
    {
        icon: <Lock className="w-5 h-5 text-[#0070CD]" />,
        title: 'حماية بياناتك وأمانها',
        content: `نلتزم بأعلى معايير الأمان لحماية بياناتك الطبية الحساسة:

• **التشفير الكامل (End-to-End Encryption):** جميع البيانات المنقولة والمخزنة مشفرة بمعايير AES-256.
• **خوادم آمنة:** نستضيف بياناتك على خوادم سحابية معتمدة تلتزم بمعايير ISO 27001 وHIPAA.
• **التحكم في الوصول:** لا يمكن الاطلاع على سجلاتك الطبية إلا من قبلك أو الطبيب المعتمد الذي منحته الإذن صراحةً.
• **المصادقة الثنائية:** نوفر طبقة إضافية من الحماية لحسابك الطبي.
• **مراجعات دورية:** نجري فحوصات أمنية منتظمة للكشف عن أي ثغرات محتملة.`,
    },
    {
        icon: <Shield className="w-5 h-5 text-[#0070CD]" />,
        title: 'مشاركة المعلومات مع أطراف ثالثة',
        content: `لا نبيع بياناتك الشخصية أو الطبية لأي طرف ثالث تحت أي ظرف. قد نشارك معلومات محدودة في الحالات التالية:

• **مزودو الخدمة المعتمدون:** شركاء تقنيون مُلزمون باتفاقيات سرية صارمة لتشغيل البنية التحتية.
• **الجهات القانونية:** عند الضرورة القانونية بموجب أوامر قضائية واضحة.
• **حالات الطوارئ الطبية:** بما يخدم سلامة المريض في الحالات الحرجة فقط.
• **بموافقتك الصريحة:** في أي حالة أخرى تستوجب مشاركة بياناتك.`,
    },
    {
        icon: <Bell className="w-5 h-5 text-[#0070CD]" />,
        title: 'حقوقك كمستخدم',
        content: `تمتلك مجموعة كاملة من الحقوق فيما يتعلق ببياناتك الشخصية والطبية:

• **حق الاطلاع:** طلب نسخة كاملة من بياناتك المخزنة في أي وقت.
• **حق التصحيح:** تعديل أي معلومات شخصية غير دقيقة مباشرة من لوحة التحكم.
• **حق الحذف:** طلب حذف حسابك وجميع بياناتك المرتبطة به.
• **حق الاعتراض:** الاعتراض على معالجة بياناتك لأغراض معينة.
• **حق نقل البيانات:** الحصول على بياناتك بصيغة قابلة للقراءة آلياً.

لممارسة أي من هذه الحقوق، تواصل معنا عبر: support@nabd.com`,
    },
    {
        icon: <Mail className="w-5 h-5 text-[#0070CD]" />,
        title: 'التواصل بشأن الخصوصية',
        content: `إذا كانت لديك أي استفسارات أو مخاوف تتعلق بسياسة الخصوصية أو طريقة معالجة بياناتك، يسعدنا التواصل معك:

• **البريد الإلكتروني:** privacy@nabd.com
• **الدعم العام:** support@nabd.com
• **الهاتف:** 3333 222 111 20+
• **العنوان:** زراعه الزقازيق، جمهورية مصر العربية

نلتزم بالرد على جميع استفسارات الخصوصية خلال 72 ساعة عمل.`,
    },
];

const PrivacyPage = () => {
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
                                <Shield className="w-4 h-4 text-blue-200" />
                                <span className="text-white/90 text-sm font-bold tracking-wide">الشفافية والأمان</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-[1.2]">
                                سياسة <span className="text-blue-200">الخصوصية</span>
                            </h1>
                            <p className="text-blue-100/80 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                نلتزم بحماية خصوصيتك وأمان بياناتك الطبية. تعرّف على كيفية جمع معلوماتك واستخدامها وحمايتها.
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

export default PrivacyPage;
