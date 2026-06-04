/**
 * ⚠️ MOCK DATA - TO BE REMOVED WHEN API IS READY
 * 
 * Centralized mock data for Verifier feature
 * Delete this entire file when connecting to real API endpoints
 */

// Application Status Enum
export const APPLICATION_STATUS = {
  PENDING: 0,
  UNDER_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3,
};

// Application Type
export const APPLICATION_TYPE = {
  DOCTOR: 'doctor',
};

// Document Status
export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLARIFICATION_NEEDED: 'clarification_needed',
};

// Mock Doctor Applications
export const mockDoctorApplications = [
  {
    id: '1',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.PENDING,
    applicantName: 'د. أحمد محمد علي',
    email: 'ahmed.mohamed@example.com',
    phoneNumber: '01234567890',
    specialty: 'طب العظام',
    yearsOfExperience: 10,
    profileImageUrl: 'https://i.pravatar.cc/150?img=12',
    submittedAt: '2025-01-15T10:30:00Z',
    documents: [
      {
        id: 'doc1',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc1.pdf',
        notes: '',
      },
      {
        id: 'doc2',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc2.pdf',
        notes: '',
      },
      {
        id: 'doc3',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc3.pdf',
        notes: '',
      },
      {
        id: 'doc4',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc4.pdf',
        notes: '',
      },
      {
        id: 'doc5',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc5.pdf',
        notes: '',
      },
    ],
    generalNotes: '',
  },
  {
    id: '2',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.UNDER_REVIEW,
    applicantName: 'د. فاطمة حسن',
    email: 'fatma.hassan@example.com',
    phoneNumber: '01123456789',
    specialty: 'طب الأطفال',
    yearsOfExperience: 8,
    profileImageUrl: 'https://i.pravatar.cc/150?img=45',
    submittedAt: '2025-01-14T14:20:00Z',
    documents: [
      {
        id: 'doc6',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc6.pdf',
        notes: '',
      },
      {
        id: 'doc7',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.CLARIFICATION_NEEDED,
        fileUrl: 'https://example.com/doc7.pdf',
        notes: 'الصورة غير واضحة، يرجى رفع نسخة أوضح',
      },
      {
        id: 'doc8',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc8.pdf',
        notes: '',
      },
      {
        id: 'doc9',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc9.pdf',
        notes: '',
      },
      {
        id: 'doc10',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc10.pdf',
        notes: '',
      },
    ],
    generalNotes: 'تم طلب توضيح للترخيص الطبي',
  },
  {
    id: '3',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.APPROVED,
    applicantName: 'د. محمود سعيد',
    email: 'mahmoud.saeed@example.com',
    phoneNumber: '01098765432',
    specialty: 'جراحة القلب',
    yearsOfExperience: 15,
    profileImageUrl: 'https://i.pravatar.cc/150?img=33',
    submittedAt: '2025-01-13T09:15:00Z',
    approvedAt: '2025-01-15T11:00:00Z',
    documents: [
      {
        id: 'doc11',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc11.pdf',
        notes: '',
      },
      {
        id: 'doc12',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc12.pdf',
        notes: '',
      },
      {
        id: 'doc13',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc13.pdf',
        notes: '',
      },
      {
        id: 'doc14',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc14.pdf',
        notes: '',
      },
      {
        id: 'doc15',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc15.pdf',
        notes: '',
      },
    ],
    generalNotes: 'جميع المستندات مطابقة',
  },
  {
    id: '4',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.REJECTED,
    applicantName: 'د. سارة أحمد',
    email: 'sara.ahmed@example.com',
    phoneNumber: '01156789012',
    specialty: 'طب الأسنان',
    yearsOfExperience: 5,
    profileImageUrl: 'https://i.pravatar.cc/150?img=47',
    submittedAt: '2025-01-12T16:45:00Z',
    rejectedAt: '2025-01-14T10:30:00Z',
    documents: [
      {
        id: 'doc16',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc16.pdf',
        notes: '',
      },
      {
        id: 'doc17',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.REJECTED,
        fileUrl: 'https://example.com/doc17.pdf',
        notes: 'الترخيص منتهي الصلاحية',
      },
      {
        id: 'doc18',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.REJECTED,
        fileUrl: 'https://example.com/doc18.pdf',
        notes: 'العضوية غير مفعلة',
      },
      {
        id: 'doc19',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc19.pdf',
        notes: '',
      },
      {
        id: 'doc20',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc20.pdf',
        notes: '',
      },
    ],
    generalNotes: 'تم الرفض بسبب انتهاء صلاحية الترخيص وعدم تفعيل العضوية',
  },
];



// Combined mock data
export const mockAllApplications = [
  ...mockDoctorApplications,
];

// Mock stats
export const mockStats = {
  totalPending: mockAllApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
  totalUnderReview: mockAllApplications.filter(app => app.status === APPLICATION_STATUS.UNDER_REVIEW).length,
  totalApprovedToday: mockAllApplications.filter(app =>
    app.status === APPLICATION_STATUS.APPROVED &&
    app.approvedAt &&
    new Date(app.approvedAt).toDateString() === new Date().toDateString()
  ).length,
  totalDoctors: mockDoctorApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
};
