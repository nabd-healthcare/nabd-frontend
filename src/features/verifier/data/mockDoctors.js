
// Realistic Mock Doctors Data
export const MOCK_DOCTORS = [
    {
        id: "mock-d1",
        fullName: "د. أحمد المنشاوي",
        applicantName: "أحمد محمد المنشاوي",
        specialty: "جراحة القلب والصدر",
        medicalSpecialtyName: "جراحة القلب والصدر",
        yearsOfExperience: 18,
        email: "ahmed.menshawy@example.com",
        phoneNumber: "+201004859632",
        profileImageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
        verificationStatus: 5, // PENDING
        statusName: "مرسل",
        submissionDate: "2024-03-24T10:30:00Z",
        documents: [
            { id: "doc1", type: 0, typeName: "بطاقة الرقم القومي", documentUrl: "https://placehold.co/600x400/png?text=National+ID", status: 0 },
            { id: "doc2", type: 1, typeName: "كارنيه النقابة", documentUrl: "https://placehold.co/600x400/png?text=Syndicate+Card", status: 0 },
            { id: "doc3", type: 4, typeName: "شهادة التخصص", documentUrl: "https://placehold.co/600x400/png?text=Specialty+Cert", status: 0 },
            { id: "doc4", type: 7, typeName: "بحث منشور - دورية القلب", documentUrl: "https://placehold.co/600x400/png?text=Research+Paper", status: 0 }
        ],
        generalNotes: ""
    },
    {
        id: "mock-d2",
        fullName: "د. سارة عبد الرحمن",
        applicantName: "سارة كمال عبد الرحمن",
        specialty: "طب الأطفال",
        medicalSpecialtyName: "طب الأطفال وحديثي الولادة",
        yearsOfExperience: 9,
        email: "sara.k.abdulrahman@example.com",
        phoneNumber: "+201225874136",
        profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
        verificationStatus: 5, // PENDING
        statusName: "مرسل",
        submissionDate: "2024-03-23T14:15:00Z",
        documents: [
            { id: "doc5", type: 0, typeName: "بطاقة الرقم القومي", documentUrl: "https://placehold.co/600x400/png?text=National+ID", status: 0 },
            { id: "doc6", type: 3, typeName: "شهادة التخرج", documentUrl: "https://placehold.co/600x400/png?text=Graduation+Cert", status: 0 },
            { id: "doc7", type: 6, typeName: "جائزة التميز الطبي", documentUrl: "https://placehold.co/600x400/png?text=Award", status: 0 }
        ],
        generalNotes: ""
    },
    {
        id: "mock-d3",
        fullName: "د. محمد الفايد",
        applicantName: "محمد حسن الفايد",
        specialty: "الباطنة العامة",
        medicalSpecialtyName: "الباطنة والجهاز الهضمي",
        yearsOfExperience: 22,
        email: "m.elfayed@example.com",
        phoneNumber: "+201112345678",
        profileImageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop",
        verificationStatus: 5, // PENDING
        statusName: "مرسل",
        submissionDate: "2024-03-24T09:00:00Z",
        documents: [],
        generalNotes: ""
    },
    {
        id: "mock-d4",
        fullName: "د. نورهان السيد",
        applicantName: "نورهان علي السيد",
        specialty: "الجلدية والتجميل",
        medicalSpecialtyName: "الجلدية والتجميل",
        yearsOfExperience: 6,
        email: "nourhan.ali@example.com",
        phoneNumber: "+201098765432",
        profileImageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1887&auto=format&fit=crop",
        verificationStatus: 5, // PENDING
        statusName: "مرسل",
        submissionDate: "2024-03-22T16:45:00Z",
        documents: [],
        generalNotes: "تحتاج إلى مراجعة دقيقة لترخيص الليزر"
    },
    {
        id: "mock-d5",
        fullName: "د. خالد العطار",
        applicantName: "خالد محمود العطار",
        specialty: "جراحة العظام",
        medicalSpecialtyName: "جراحة العظام والمفاصل",
        yearsOfExperience: 14,
        email: "khaled.attar@example.com",
        phoneNumber: "+201555123456",
        profileImageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop",
        verificationStatus: 5, // PENDING
        statusName: "مرسل",
        submissionDate: "2024-03-21T11:20:00Z",
        documents: [],
        generalNotes: ""
    },
    {
        id: "mock-d6",
        fullName: "د. وائل الصديق",
        applicantName: "وائل محمد الصديق",
        specialty: "طب وجراحة عيون",
        medicalSpecialtyName: "طب وجراحة العيون",
        yearsOfExperience: 11,
        email: "wael.saddiq@example.com",
        phoneNumber: "+201002233445",
        profileImageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1889&auto=format&fit=crop",
        verificationStatus: 1, // UNDER_REVIEW
        statusName: "تحت المراجعة",
        submissionDate: "2024-03-20T09:15:00Z",
        documents: [],
        generalNotes: "جاري التحقق من شهادة البورد"
    },
    {
        id: "mock-d7",
        fullName: "د. رانيا يوسف",
        applicantName: "رانيا كمال يوسف",
        specialty: "نساء وتوليد",
        medicalSpecialtyName: "أمراض النساء والتوليد",
        yearsOfExperience: 15,
        email: "rania.youssef@example.com",
        phoneNumber: "+201229988776",
        profileImageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=2052&auto=format&fit=crop",
        verificationStatus: 1, // UNDER_REVIEW
        statusName: "تحت المراجعة",
        submissionDate: "2024-03-19T13:40:00Z",
        documents: [],
        generalNotes: ""
    }
];
