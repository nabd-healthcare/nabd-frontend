/**
 * Mock Data for Doctor Dashboard
 * Used for testing and development purposes
 */

// Mock Patients
export const mockPatients = [
    {
        id: 'p1',
        fullName: 'أحمد محمد علي',
        age: 35,
        gender: 'male',
        phoneNumber: '01012345678',
        email: 'ahmed@example.com',
        address: 'القاهرة، مصر',
        bloodType: 'A+',
        chronicDiseases: ['ارتفاع ضغط الدم'],
        profileImageUrl: null
    },
    {
        id: 'p2',
        fullName: 'سارة محمود حسن',
        age: 28,
        gender: 'female',
        phoneNumber: '01123456789',
        email: 'sara@example.com',
        address: 'الجيزة، مصر',
        bloodType: 'O+',
        chronicDiseases: [],
        profileImageUrl: null
    },
    {
        id: 'p3',
        fullName: 'محمود حسن إبراهيم',
        age: 45,
        gender: 'male',
        phoneNumber: '01234567890',
        email: 'mahmoud@example.com',
        address: 'الإسكندرية، مصر',
        bloodType: 'B-',
        chronicDiseases: ['السكري'],
        profileImageUrl: null
    },
    {
        id: 'p4',
        fullName: 'منى السيد علي',
        age: 52,
        gender: 'female',
        phoneNumber: '01555555555',
        email: 'mona@example.com',
        address: 'المنصورة، مصر',
        bloodType: 'AB+',
        chronicDiseases: ['الربو', 'ارتفاع ضغط الدم'],
        profileImageUrl: null
    },
    {
        id: 'p5',
        fullName: 'خالد عبد الله',
        age: 30,
        gender: 'male',
        phoneNumber: '01098765432',
        email: 'khaled@example.com',
        address: 'طنطا، مصر',
        bloodType: 'O-',
        chronicDiseases: [],
        profileImageUrl: null
    }
];

// Mock Appointments
export const mockAppointments = [
    {
        id: 'apt1',
        patientId: 'p1',
        patientName: 'أحمد محمد علي',
        patientPhoneNumber: '01012345678',
        appointmentDate: new Date().toISOString(),
        appointmentTime: '10:00',
        duration: 30,
        status: 1, // Confirmed
        appointmentType: 'regular',
        notes: 'شكوى من صداع مستمر',
        price: 200
    },
    {
        id: 'apt2',
        patientId: 'p2',
        patientName: 'سارة محمود حسن',
        patientPhoneNumber: '01123456789',
        appointmentDate: new Date().toISOString(),
        appointmentTime: '11:00',
        duration: 30,
        status: 1, // Confirmed
        appointmentType: 'followup',
        notes: 'متابعة نتائج التحاليل',
        price: 100
    },
    {
        id: 'apt3',
        patientId: 'p3',
        patientName: 'محمود حسن إبراهيم',
        patientPhoneNumber: '01234567890',
        appointmentDate: new Date().toISOString(),
        appointmentTime: '12:30',
        duration: 45,
        status: 0, // Pending
        appointmentType: 'regular',
        notes: 'ألم في المعدة',
        price: 250
    },
    {
        id: 'apt4',
        patientId: 'p4',
        patientName: 'منى السيد علي',
        patientPhoneNumber: '01555555555',
        appointmentDate: new Date().toISOString(),
        appointmentTime: '14:00',
        duration: 30,
        status: 3, // InProgress
        appointmentType: 'regular',
        notes: 'ضيق في التنفس',
        price: 200
    },
    {
        id: 'apt5',
        patientId: 'p5',
        patientName: 'خالد عبد الله',
        patientPhoneNumber: '01098765432',
        appointmentDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        appointmentTime: '09:00',
        duration: 30,
        status: 4, // Completed
        appointmentType: 'regular',
        notes: 'فحص دوري',
        price: 150
    }
];

// Mock Stats
export const mockStats = {
    totalPatients: 150,
    todayAppointments: 5,
    pendingAppointments: 2,
    completedAppointments: 120,
    totalRevenue: 50000,
    monthlyRevenue: 12000,
    averageRating: 4.5,
    totalReviews: 87
};

/**
 * Simulate API delay
 * @param {number} ms - Delay in milliseconds
 */
export const simulateApiDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
