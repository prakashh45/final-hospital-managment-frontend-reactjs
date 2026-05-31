/* ============================================
   seedData.js — AarogyaKendra Demo Data Seed
   ============================================
   Seeds localStorage on first load with rich,
   realistic Indian healthcare demo data.
   ============================================ */

const SEED_KEY = 'hms_data_seeded';

// ── Doctors ───────────────────────────────────
const DOCTORS = [
  { id: 'd1', name: 'Dr. Rajesh Kumar', specialty: 'Cardiology', qualification: 'MBBS, MD - Cardiology', experience: 15, phone: '+91 9876543201', email: 'rajesh.kumar@aarogykendra.in', avatar: 'RK', color: '#22d3ee' },
  { id: 'd2', name: 'Dr. Anita Sharma', specialty: 'General Medicine', qualification: 'MBBS, MD - General Medicine', experience: 12, phone: '+91 9876543202', email: 'anita.sharma@aarogykendra.in', avatar: 'AS', color: '#f59e0b' },
  { id: 'd3', name: 'Dr. Vikram Patel', specialty: 'Dermatology', qualification: 'MBBS, MD - Dermatology', experience: 8, phone: '+91 9876543203', email: 'vikram.patel@aarogykendra.in', avatar: 'VP', color: '#a78bfa' },
  { id: 'd4', name: 'Dr. Neha Mehta', specialty: 'Pulmonology', qualification: 'MBBS, MD - Pulmonology', experience: 10, phone: '+91 9876543204', email: 'neha.mehta@aarogykendra.in', avatar: 'NM', color: '#34d399' },
  { id: 'd5', name: 'Dr. Suresh More', specialty: 'Orthopedics', qualification: 'MBBS, MS - Orthopedics', experience: 18, phone: '+91 9876543205', email: 'suresh.more@aarogykendra.in', avatar: 'SM', color: '#fb923c' },
  { id: 'd6', name: 'Dr. Ravi Desai', specialty: 'Neurology', qualification: 'MBBS, DM - Neurology', experience: 14, phone: '+91 9876543206', email: 'ravi.desai@aarogykendra.in', avatar: 'RD', color: '#f472b6' },
  { id: 'd7', name: 'Dr. Pooja Singh', specialty: 'Gynecology', qualification: 'MBBS, MS - Gynecology', experience: 11, phone: '+91 9876543207', email: 'pooja.singh@aarogykendra.in', avatar: 'PS', color: '#c084fc' },
  { id: 'd8', name: 'Dr. Amit Joshi', specialty: 'Ophthalmology', qualification: 'MBBS, MS - Ophthalmology', experience: 9, phone: '+91 9876543208', email: 'amit.joshi@aarogykendra.in', avatar: 'AJ', color: '#2dd4bf' },
];

// ── Patients ──────────────────────────────────
const PATIENTS = [
  { id: 1, firstName: 'Priya', lastName: 'Patel', gender: 'Female', age: 32, bloodGroup: 'A+', phone: '+91 9876543210', email: 'priya.patel@mail.com', status: 'ACTIVE', address: '42, MG Road, Mumbai', emergencyContact: 'Rahul Patel - +91 9876543220', createdAt: '2025-12-15T10:30:00Z' },
  { id: 2, firstName: 'Rajesh', lastName: 'Kumar', gender: 'Male', age: 54, bloodGroup: 'O+', phone: '+91 9876543211', email: 'rajesh@mail.com', status: 'CRITICAL', address: '15, Nehru Nagar, Delhi', emergencyContact: 'Sunita Kumar - +91 9876543221', createdAt: '2025-11-20T09:00:00Z' },
  { id: 3, firstName: 'Amit', lastName: 'Patel', gender: 'Male', age: 45, bloodGroup: 'B+', phone: '+91 9876543212', email: 'amit@mail.com', status: 'STABLE', address: '78, Laxmi Chowk, Pune', emergencyContact: 'Meena Patel - +91 9876543222', createdAt: '2026-01-10T14:00:00Z' },
  { id: 4, firstName: 'Sunita', lastName: 'Verma', gender: 'Female', age: 62, bloodGroup: 'AB+', phone: '+91 9876543213', email: 'sunita@mail.com', status: 'ACTIVE', address: '23, Shanti Colony, Jaipur', emergencyContact: 'Deepak Verma - +91 9876543223', createdAt: '2026-02-05T11:30:00Z' },
  { id: 5, firstName: 'Vikram', lastName: 'Singh', gender: 'Male', age: 29, bloodGroup: 'O-', phone: '+91 9876543214', email: 'vikram@mail.com', status: 'CRITICAL', address: '56, Rajpur Road, Dehradun', emergencyContact: 'Kavita Singh - +91 9876543224', createdAt: '2026-03-18T08:00:00Z' },
];

// ── Helper: date strings ─────────────────────
function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function daysAgo(days) {
  return daysFromNow(-days);
}

// ── Appointments ──────────────────────────────
const APPOINTMENTS = [
  { id: 'apt1', patientId: 1, doctorId: 'd1', doctorName: 'Dr. Rajesh Kumar', specialty: 'Cardiology', date: daysFromNow(1), time: '3:00 PM', endTime: '3:30 PM', type: 'In-person', location: 'Apollo Hospital', reason: 'Regular Checkup', status: 'Confirmed', notes: 'Annual cardiac screening' },
  { id: 'apt2', patientId: 1, doctorId: 'd2', doctorName: 'Dr. Anita Sharma', specialty: 'General Medicine', date: daysFromNow(3), time: '11:00 AM', endTime: '11:30 AM', type: 'In-person', location: 'City Clinic', reason: 'General Checkup', status: 'Pending', notes: '' },
  { id: 'apt3', patientId: 1, doctorId: 'd3', doctorName: 'Dr. Vikram Patel', specialty: 'Dermatology', date: daysFromNow(5), time: '9:30 AM', endTime: '10:00 AM', type: 'Video Call', location: 'Jubilation Hospital', reason: 'Skin Allergy', status: 'Confirmed', notes: 'Follow-up from last visit' },
  { id: 'apt4', patientId: 1, doctorId: 'd4', doctorName: 'Dr. Neha Mehta', specialty: 'Pulmonology', date: daysFromNow(10), time: '2:00 PM', endTime: '2:30 PM', type: 'In-person', location: 'KEM Hospital', reason: 'Breathing Issues', status: 'Confirmed', notes: '' },
  { id: 'apt5', patientId: 1, doctorId: 'd5', doctorName: 'Dr. Suresh More', specialty: 'Orthopedics', date: daysAgo(20), time: '10:00 AM', endTime: '10:30 AM', type: 'In-person', location: 'Sanas Clinic', reason: 'Knee Pain', status: 'Completed', notes: 'X-ray done. No fracture.' },
  { id: 'apt6', patientId: 1, doctorId: 'd2', doctorName: 'Dr. Anita Sharma', specialty: 'General Medicine', date: daysAgo(45), time: '4:00 PM', endTime: '4:30 PM', type: 'In-person', location: 'City Clinic', reason: 'Fever & Cold', status: 'Completed', notes: 'Prescribed medication. Resolved.' },
  { id: 'apt7', patientId: 1, doctorId: 'd3', doctorName: 'Dr. Vikram Patel', specialty: 'Dermatology', date: daysAgo(30), time: '9:00 AM', endTime: '9:30 AM', type: 'In-person', location: 'Jubilation Hospital', reason: 'Skin Allergy', status: 'Completed', notes: 'Topical cream prescribed.' },
  { id: 'apt8', patientId: 1, doctorId: 'd6', doctorName: 'Dr. Ravi Desai', specialty: 'Neurology', date: daysAgo(10), time: '11:30 AM', endTime: '12:00 PM', type: 'In-person', location: 'AIIMS', reason: 'Headache', status: 'Cancelled', notes: 'Patient requested cancellation.' },
  { id: 'apt9', patientId: 1, doctorId: 'd7', doctorName: 'Dr. Pooja Singh', specialty: 'Gynecology', date: daysAgo(60), time: '10:30 AM', endTime: '11:00 AM', type: 'In-person', location: 'Ruby Hall', reason: 'Routine Checkup', status: 'Completed', notes: 'All reports normal.' },
  { id: 'apt10', patientId: 2, doctorId: 'd1', doctorName: 'Dr. Rajesh Kumar', specialty: 'Cardiology', date: daysFromNow(2), time: '10:00 AM', endTime: '10:30 AM', type: 'In-person', location: 'Apollo Hospital', reason: 'BP Monitoring', status: 'Confirmed', notes: '' },
  { id: 'apt11', patientId: 3, doctorId: 'd5', doctorName: 'Dr. Suresh More', specialty: 'Orthopedics', date: daysFromNow(7), time: '3:30 PM', endTime: '4:00 PM', type: 'In-person', location: 'Sanas Clinic', reason: 'Joint Pain', status: 'Pending', notes: '' },
  { id: 'apt12', patientId: 1, doctorId: 'd1', doctorName: 'Dr. Rajesh Kumar', specialty: 'Cardiology', date: daysAgo(5), time: '2:00 PM', endTime: '2:30 PM', type: 'In-person', location: 'Apollo Hospital', reason: 'ECG Follow-up', status: 'Cancelled', notes: 'Rescheduled by doctor.' },
];

// ── Prescriptions ─────────────────────────────
const PRESCRIPTIONS = [
  {
    id: 'rx1', patientId: 1, doctorId: 'd1', doctorName: 'Dr. Rajesh Kumar', date: daysAgo(30), status: 'ACTIVE',
    medicines: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (morning)', duration: '30 days' },
      { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily (after lunch)', duration: '30 days' },
    ],
    notes: 'Monitor BP twice daily. Reduce salt intake.',
  },
  {
    id: 'rx2', patientId: 1, doctorId: 'd2', doctorName: 'Dr. Anita Sharma', date: daysAgo(45), status: 'COMPLETED',
    medicines: [
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Thrice daily (after meals)', duration: '5 days' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily (night)', duration: '7 days' },
    ],
    notes: 'Take rest. Increase fluid intake.',
  },
  {
    id: 'rx3', patientId: 1, doctorId: 'd3', doctorName: 'Dr. Vikram Patel', date: daysAgo(30), status: 'ACTIVE',
    medicines: [
      { name: 'Betamethasone Cream', dosage: '0.1%', frequency: 'Apply twice daily', duration: '14 days' },
      { name: 'Hydroxyzine', dosage: '25mg', frequency: 'Once at night', duration: '10 days' },
    ],
    notes: 'Avoid sun exposure on affected areas.',
  },
  {
    id: 'rx4', patientId: 2, doctorId: 'd1', doctorName: 'Dr. Rajesh Kumar', date: daysAgo(15), status: 'ACTIVE',
    medicines: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' },
      { name: 'Losartan', dosage: '50mg', frequency: 'Once daily', duration: '90 days' },
    ],
    notes: 'Strict diet control. Fasting sugar check weekly.',
  },
  {
    id: 'rx5', patientId: 3, doctorId: 'd5', doctorName: 'Dr. Suresh More', date: daysAgo(20), status: 'COMPLETED',
    medicines: [
      { name: 'Diclofenac', dosage: '50mg', frequency: 'Twice daily (after meals)', duration: '7 days' },
      { name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily (before breakfast)', duration: '7 days' },
    ],
    notes: 'Apply ice pack on knee. Avoid stairs.',
  },
  {
    id: 'rx6', patientId: 1, doctorId: 'd4', doctorName: 'Dr. Neha Mehta', date: daysAgo(60), status: 'COMPLETED',
    medicines: [
      { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily (night)', duration: '30 days' },
    ],
    notes: 'Avoid dust exposure. Use mask outdoors.',
  },
];

// ── Diagnoses ─────────────────────────────────
const DIAGNOSES = [
  { id: 'dg1', patientId: 1, condition: 'Mild Hypertension', priority: 'MEDIUM', status: 'CONFIRMED', description: 'Slightly elevated BP readings over 3 visits. Started medication.', createdAt: daysAgo(30), doctorName: 'Dr. Rajesh Kumar' },
  { id: 'dg2', patientId: 1, condition: 'Allergic Dermatitis', priority: 'LOW', status: 'CONFIRMED', description: 'Skin rash on forearms. Suspected contact allergy.', createdAt: daysAgo(30), doctorName: 'Dr. Vikram Patel' },
  { id: 'dg3', patientId: 1, condition: 'Viral Fever', priority: 'LOW', status: 'RESOLVED', description: 'Seasonal viral infection. Resolved with medication.', createdAt: daysAgo(45), doctorName: 'Dr. Anita Sharma' },
  { id: 'dg4', patientId: 2, condition: 'Hypertension Grade II', priority: 'HIGH', status: 'CONFIRMED', description: 'Persistent elevated BP. Requires daily monitoring and medication adjustment.', createdAt: daysAgo(15), doctorName: 'Dr. Rajesh Kumar' },
  { id: 'dg5', patientId: 2, condition: 'Type 2 Diabetes', priority: 'HIGH', status: 'PENDING', description: 'Awaiting HbA1c results for confirmation. Fasting glucose 180 mg/dL.', createdAt: daysAgo(10), doctorName: 'Dr. Rajesh Kumar' },
  { id: 'dg6', patientId: 3, condition: 'Osteoarthritis - Right Knee', priority: 'MEDIUM', status: 'CONFIRMED', description: 'Degenerative joint changes. X-ray shows mild narrowing of joint space.', createdAt: daysAgo(20), doctorName: 'Dr. Suresh More' },
  { id: 'dg7', patientId: 5, condition: 'Acute Bronchitis', priority: 'HIGH', status: 'PENDING', description: 'Persistent cough, chest tightness. Chest X-ray pending.', createdAt: daysAgo(3), doctorName: 'Dr. Neha Mehta' },
  { id: 'dg8', patientId: 4, condition: 'Iron Deficiency Anemia', priority: 'MEDIUM', status: 'CONFIRMED', description: 'Hb 9.2 g/dL. Iron supplements prescribed.', createdAt: daysAgo(25), doctorName: 'Dr. Anita Sharma' },
];

// ── Vitals ─────────────────────────────────────
const VITALS = [
  { id: 'v1', patientId: 1, bp: '128/82', sugar: 102, pulse: 76, temperature: 98.4, weight: 62, spo2: 98, recordedAt: daysAgo(1), recordedBy: 'Nurse Kavita' },
  { id: 'v2', patientId: 1, bp: '132/85', sugar: 108, pulse: 78, temperature: 98.6, weight: 62, spo2: 97, recordedAt: daysAgo(7), recordedBy: 'Nurse Kavita' },
  { id: 'v3', patientId: 1, bp: '125/80', sugar: 95, pulse: 72, temperature: 98.2, weight: 61, spo2: 99, recordedAt: daysAgo(14), recordedBy: 'Nurse Priya' },
  { id: 'v4', patientId: 1, bp: '138/88', sugar: 118, pulse: 82, temperature: 98.8, weight: 63, spo2: 97, recordedAt: daysAgo(30), recordedBy: 'Nurse Kavita' },
  { id: 'v5', patientId: 1, bp: '130/84', sugar: 105, pulse: 74, temperature: 98.5, weight: 62, spo2: 98, recordedAt: daysAgo(45), recordedBy: 'Nurse Priya' },
  { id: 'v6', patientId: 2, bp: '155/95', sugar: 210, pulse: 88, temperature: 98.6, weight: 78, spo2: 96, recordedAt: daysAgo(1), recordedBy: 'Nurse Kavita' },
  { id: 'v7', patientId: 2, bp: '160/98', sugar: 225, pulse: 92, temperature: 98.4, weight: 79, spo2: 95, recordedAt: daysAgo(7), recordedBy: 'Nurse Kavita' },
  { id: 'v8', patientId: 2, bp: '148/92', sugar: 195, pulse: 85, temperature: 98.6, weight: 78, spo2: 96, recordedAt: daysAgo(14), recordedBy: 'Nurse Priya' },
  { id: 'v9', patientId: 3, bp: '130/82', sugar: 145, pulse: 80, temperature: 98.4, weight: 85, spo2: 98, recordedAt: daysAgo(5), recordedBy: 'Nurse Kavita' },
  { id: 'v10', patientId: 4, bp: '118/76', sugar: 90, pulse: 70, temperature: 98.2, weight: 55, spo2: 98, recordedAt: daysAgo(3), recordedBy: 'Nurse Priya' },
  { id: 'v11', patientId: 5, bp: '140/90', sugar: 120, pulse: 96, temperature: 100.2, weight: 72, spo2: 94, recordedAt: daysAgo(1), recordedBy: 'Nurse Kavita' },
  { id: 'v12', patientId: 5, bp: '135/88', sugar: 115, pulse: 90, temperature: 99.8, weight: 72, spo2: 95, recordedAt: daysAgo(2), recordedBy: 'Nurse Kavita' },
];

// ── Lab Reports ───────────────────────────────
const LAB_REPORTS = [
  {
    id: 'lab1', patientId: 1, testName: 'Complete Blood Count (CBC)', date: daysAgo(7), status: 'Normal', doctorName: 'Dr. Anita Sharma',
    results: [
      { parameter: 'Hemoglobin', value: '13.2', unit: 'g/dL', range: '12.0 - 16.0', status: 'Normal' },
      { parameter: 'WBC Count', value: '7,200', unit: '/µL', range: '4,500 - 11,000', status: 'Normal' },
      { parameter: 'Platelet Count', value: '2,50,000', unit: '/µL', range: '1,50,000 - 4,00,000', status: 'Normal' },
      { parameter: 'RBC Count', value: '4.8', unit: 'million/µL', range: '4.2 - 5.4', status: 'Normal' },
    ],
  },
  {
    id: 'lab2', patientId: 1, testName: 'Lipid Profile', date: daysAgo(14), status: 'Abnormal', doctorName: 'Dr. Rajesh Kumar',
    results: [
      { parameter: 'Total Cholesterol', value: '228', unit: 'mg/dL', range: '< 200', status: 'High' },
      { parameter: 'LDL', value: '145', unit: 'mg/dL', range: '< 100', status: 'High' },
      { parameter: 'HDL', value: '48', unit: 'mg/dL', range: '> 40', status: 'Normal' },
      { parameter: 'Triglycerides', value: '175', unit: 'mg/dL', range: '< 150', status: 'High' },
    ],
  },
  {
    id: 'lab3', patientId: 1, testName: 'Thyroid Function Test', date: daysAgo(30), status: 'Normal', doctorName: 'Dr. Anita Sharma',
    results: [
      { parameter: 'TSH', value: '3.2', unit: 'mIU/L', range: '0.4 - 4.0', status: 'Normal' },
      { parameter: 'Free T4', value: '1.1', unit: 'ng/dL', range: '0.8 - 1.8', status: 'Normal' },
      { parameter: 'Free T3', value: '3.0', unit: 'pg/mL', range: '2.3 - 4.2', status: 'Normal' },
    ],
  },
  {
    id: 'lab4', patientId: 1, testName: 'HbA1c', date: daysAgo(14), status: 'Normal', doctorName: 'Dr. Rajesh Kumar',
    results: [
      { parameter: 'HbA1c', value: '5.6', unit: '%', range: '< 5.7', status: 'Normal' },
      { parameter: 'Estimated Avg. Glucose', value: '114', unit: 'mg/dL', range: '< 117', status: 'Normal' },
    ],
  },
  {
    id: 'lab5', patientId: 2, testName: 'Kidney Function Test', date: daysAgo(10), status: 'Abnormal', doctorName: 'Dr. Rajesh Kumar',
    results: [
      { parameter: 'Creatinine', value: '1.6', unit: 'mg/dL', range: '0.7 - 1.3', status: 'High' },
      { parameter: 'BUN', value: '28', unit: 'mg/dL', range: '7 - 20', status: 'High' },
      { parameter: 'Uric Acid', value: '7.8', unit: 'mg/dL', range: '3.5 - 7.2', status: 'High' },
    ],
  },
  {
    id: 'lab6', patientId: 1, testName: 'Liver Function Test', date: daysAgo(45), status: 'Normal', doctorName: 'Dr. Anita Sharma',
    results: [
      { parameter: 'SGOT (AST)', value: '28', unit: 'U/L', range: '< 40', status: 'Normal' },
      { parameter: 'SGPT (ALT)', value: '32', unit: 'U/L', range: '< 41', status: 'Normal' },
      { parameter: 'Bilirubin Total', value: '0.8', unit: 'mg/dL', range: '0.1 - 1.2', status: 'Normal' },
      { parameter: 'Albumin', value: '4.2', unit: 'g/dL', range: '3.5 - 5.5', status: 'Normal' },
    ],
  },
];

// ── Notifications ─────────────────────────────
const NOTIFICATIONS = [
  { id: 'n1', patientId: 1, type: 'appointment', title: 'Upcoming Appointment', message: 'Your appointment with Dr. Rajesh Kumar is tomorrow at 3:00 PM.', date: daysAgo(0), read: false, icon: 'calendar' },
  { id: 'n2', patientId: 1, type: 'prescription', title: 'Prescription Updated', message: 'Dr. Vikram Patel has updated your prescription for Allergic Dermatitis.', date: daysAgo(1), read: false, icon: 'pill' },
  { id: 'n3', patientId: 1, type: 'lab', title: 'Lab Results Ready', message: 'Your Lipid Profile report is ready. Some values need attention.', date: daysAgo(2), read: false, icon: 'flask' },
  { id: 'n4', patientId: 1, type: 'appointment', title: 'Appointment Confirmed', message: 'Your appointment with Dr. Anita Sharma on ' + new Date(daysFromNow(3)).toLocaleDateString('en-IN') + ' has been confirmed.', date: daysAgo(2), read: true, icon: 'calendar' },
  { id: 'n5', patientId: 1, type: 'health', title: 'Health Tip', message: 'Your BP readings have been slightly elevated. Remember to reduce salt intake and exercise daily.', date: daysAgo(3), read: true, icon: 'heart' },
  { id: 'n6', patientId: 1, type: 'lab', title: 'Lab Results Ready', message: 'Your Complete Blood Count report is ready. All values are normal.', date: daysAgo(7), read: true, icon: 'flask' },
  { id: 'n7', patientId: 1, type: 'appointment', title: 'Appointment Cancelled', message: 'Your appointment with Dr. Ravi Desai has been cancelled as per your request.', date: daysAgo(10), read: true, icon: 'calendar' },
  { id: 'n8', patientId: 1, type: 'prescription', title: 'Prescription Completed', message: 'Your prescription from Dr. Anita Sharma has been marked as completed.', date: daysAgo(14), read: true, icon: 'pill' },
  { id: 'n9', patientId: 1, type: 'health', title: 'Monthly Health Summary', message: 'Your May health summary is available. Tap to view your vitals trends.', date: daysAgo(15), read: true, icon: 'heart' },
  { id: 'n10', patientId: 1, type: 'system', title: 'Welcome to AarogyaKendra', message: 'Your patient account has been set up. Explore your dashboard to manage your health.', date: daysAgo(180), read: true, icon: 'info' },
];

// ── Queue ─────────────────────────────────────
const QUEUE = [
  { id: 'q1', tokenNumber: 1, patientId: 2, patientName: 'Rajesh Kumar', department: 'Cardiology', status: 'IN_PROGRESS', createdAt: daysAgo(0) },
  { id: 'q2', tokenNumber: 2, patientId: 4, patientName: 'Sunita Verma', department: 'General Medicine', status: 'WAITING', createdAt: daysAgo(0) },
  { id: 'q3', tokenNumber: 3, patientId: 5, patientName: 'Vikram Singh', department: 'Pulmonology', status: 'WAITING', createdAt: daysAgo(0) },
  { id: 'q4', tokenNumber: 4, patientId: 3, patientName: 'Amit Patel', department: 'Orthopedics', status: 'WAITING', createdAt: daysAgo(0) },
  { id: 'q5', tokenNumber: 5, patientId: 1, patientName: 'Priya Patel', department: 'Cardiology', status: 'COMPLETED', createdAt: daysAgo(0) },
];

// ── Tasks ─────────────────────────────────────
const TASKS = [
  { id: 't1', title: 'Record vitals for Ward A patients', assignedTo: 'Nurse Kavita', dueDate: daysFromNow(0), priority: 'HIGH', status: 'IN_PROGRESS' },
  { id: 't2', title: 'Prepare discharge summary - Bed 12', assignedTo: 'Nurse Priya', dueDate: daysFromNow(0), priority: 'MEDIUM', status: 'PENDING' },
  { id: 't3', title: 'Medication round - ICU', assignedTo: 'Nurse Kavita', dueDate: daysFromNow(0), priority: 'HIGH', status: 'PENDING' },
  { id: 't4', title: 'Collect lab samples - Room 201-205', assignedTo: 'Nurse Priya', dueDate: daysFromNow(1), priority: 'MEDIUM', status: 'PENDING' },
  { id: 't5', title: 'Update patient charts - Ward B', assignedTo: 'Nurse Kavita', dueDate: daysFromNow(0), priority: 'LOW', status: 'COMPLETED' },
];

// ── Demo Users ────────────────────────────────
const DEMO_USERS = {
  doctor1: { id: 101, username: 'doctor1', email: 'doctor1@hospital.com', password: 'Doctor@123', role: 'DOCTOR', firstName: 'Rajesh', lastName: 'Kumar' },
  nurse2: { id: 102, username: 'nurse2', email: 'nurse1@hospital.com', password: 'Nurse@123', role: 'NURSE', firstName: 'Kavita', lastName: 'Sharma' },
  patient1: { id: 1, username: 'Priya Patel', email: 'priya.patel@mail.com', role: 'PATIENT', firstName: 'Priya', lastName: 'Patel', patientId: 1, phone: '+91 9876543210', bloodGroup: 'A+', age: 32, gender: 'Female' },
};

// ═══════════════════════════════════════════════
// Seed Function
// ═══════════════════════════════════════════════
export function seedDemoData(force = false) {
  if (!force && localStorage.getItem(SEED_KEY)) return;

  localStorage.setItem('hms_doctors', JSON.stringify(DOCTORS));
  localStorage.setItem('hms_patients', JSON.stringify(PATIENTS));
  localStorage.setItem('hms_appointments', JSON.stringify(APPOINTMENTS));
  localStorage.setItem('hms_prescriptions', JSON.stringify(PRESCRIPTIONS));
  localStorage.setItem('hms_diagnoses', JSON.stringify(DIAGNOSES));
  localStorage.setItem('hms_vitals', JSON.stringify(VITALS));
  localStorage.setItem('hms_lab_reports', JSON.stringify(LAB_REPORTS));
  localStorage.setItem('hms_notifications', JSON.stringify(NOTIFICATIONS));
  localStorage.setItem('hms_queue', JSON.stringify(QUEUE));
  localStorage.setItem('hms_tasks', JSON.stringify(TASKS));
  localStorage.setItem('hms_registered_users', JSON.stringify(DEMO_USERS));

  localStorage.setItem(SEED_KEY, Date.now().toString());
}

// Export data access for reference
export { DOCTORS, PATIENTS, APPOINTMENTS, PRESCRIPTIONS, DIAGNOSES, VITALS, LAB_REPORTS, NOTIFICATIONS, QUEUE, TASKS, DEMO_USERS };
