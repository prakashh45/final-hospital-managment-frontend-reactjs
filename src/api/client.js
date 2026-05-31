/* ============================================
   client.js — AarogyaKendra localStorage API
   ============================================
   All data lives in localStorage. No backend.
   Exports same API shape for compatibility.
   ============================================ */

// ── Generic localStorage CRUD helpers ─────────
function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function findById(key, id) {
  const items = getStore(key);
  return items.find(i => String(i.id) === String(id)) || null;
}

function generateId(prefix = '') {
  return prefix + Date.now() + Math.random().toString(36).slice(2, 6);
}

// Simulate async behavior for compatibility
function resolve(data) {
  return Promise.resolve({ data });
}

// ── Patient APIs ──────────────────────────────
export const patientAPI = {
  getAll: (params) => {
    let items = getStore('hms_patients');
    if (params?.status && params.status !== 'ALL') items = items.filter(i => i.status === params.status);
    return resolve(items);
  },
  search: (query) => {
    const q = (query || '').toLowerCase();
    const items = getStore('hms_patients').filter(p =>
      (p.firstName + ' ' + p.lastName).toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q)
    );
    return resolve(items);
  },
  getById: (id) => resolve(findById('hms_patients', id) || getStore('hms_patients')[0]),
  create: (data) => {
    const items = getStore('hms_patients');
    const newItem = { ...data, id: items.length + 1, createdAt: new Date().toISOString(), status: data.status || 'ACTIVE' };
    items.push(newItem);
    setStore('hms_patients', items);
    return resolve(newItem);
  },
  update: (id, data) => {
    const items = getStore('hms_patients');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_patients', items); }
    return resolve(items[idx] || data);
  },
  patch: (id, data) => patientAPI.update(id, data),
  delete: (id) => {
    const items = getStore('hms_patients').filter(i => String(i.id) !== String(id));
    setStore('hms_patients', items);
    return resolve({ success: true });
  },
  getHistory: (id) => {
    const diagnoses = getStore('hms_diagnoses').filter(d => String(d.patientId) === String(id));
    const vitals = getStore('hms_vitals').filter(v => String(v.patientId) === String(id));
    const prescriptions = getStore('hms_prescriptions').filter(p => String(p.patientId) === String(id));
    return resolve({ diagnoses, vitals, prescriptions });
  },
  getCurrentVitals: (id) => {
    const vitals = getStore('hms_vitals').filter(v => String(v.patientId) === String(id));
    const sorted = vitals.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
    return resolve(sorted[0] || null);
  },
  getDiagnoses: (id) => resolve(getStore('hms_diagnoses').filter(d => String(d.patientId) === String(id))),
  getPrescriptions: (id) => resolve(getStore('hms_prescriptions').filter(p => String(p.patientId) === String(id))),
};

// ── Diagnosis APIs ────────────────────────────
export const diagnosisAPI = {
  getAll: (params) => {
    let items = getStore('hms_diagnoses');
    if (params?.patientId) items = items.filter(i => String(i.patientId) === String(params.patientId));
    if (params?.status) items = items.filter(i => i.status === params.status);
    return resolve(items);
  },
  getByPatient: (patientId) => resolve(getStore('hms_diagnoses').filter(d => String(d.patientId) === String(patientId))),
  getById: (id) => resolve(findById('hms_diagnoses', id) || getStore('hms_diagnoses')[0]),
  create: (data) => {
    const items = getStore('hms_diagnoses');
    const newItem = { ...data, id: generateId('dg'), createdAt: new Date().toISOString() };
    items.push(newItem);
    setStore('hms_diagnoses', items);
    return resolve(newItem);
  },
  update: (id, data) => {
    const items = getStore('hms_diagnoses');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_diagnoses', items); }
    return resolve(items[idx] || data);
  },
  updateStatus: (id, status) => {
    const items = getStore('hms_diagnoses');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx].status = status; setStore('hms_diagnoses', items); }
    return resolve({ success: true });
  },
  delete: (id) => {
    setStore('hms_diagnoses', getStore('hms_diagnoses').filter(i => String(i.id) !== String(id)));
    return resolve({ success: true });
  },
};

// ── Prescription APIs ─────────────────────────
export const prescriptionAPI = {
  getAll: (params) => {
    let items = getStore('hms_prescriptions');
    if (params?.patientId) items = items.filter(i => String(i.patientId) === String(params.patientId));
    if (params?.status) items = items.filter(i => i.status === params.status);
    return resolve(items);
  },
  getByPatient: (patientId) => resolve(getStore('hms_prescriptions').filter(p => String(p.patientId) === String(patientId))),
  getById: (id) => resolve(findById('hms_prescriptions', id) || getStore('hms_prescriptions')[0]),
  create: (data) => {
    const items = getStore('hms_prescriptions');
    const newItem = { ...data, id: generateId('rx'), date: new Date().toISOString() };
    items.push(newItem);
    setStore('hms_prescriptions', items);
    return resolve(newItem);
  },
  update: (id, data) => {
    const items = getStore('hms_prescriptions');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_prescriptions', items); }
    return resolve(items[idx] || data);
  },
  updateStatus: (id, status) => {
    const items = getStore('hms_prescriptions');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx].status = status; setStore('hms_prescriptions', items); }
    return resolve({ success: true });
  },
  delete: (id) => {
    setStore('hms_prescriptions', getStore('hms_prescriptions').filter(i => String(i.id) !== String(id)));
    return resolve({ success: true });
  },
  downloadPdf: () => resolve(new Blob(['PDF'], { type: 'application/pdf' })),
};

// ── Vitals APIs ───────────────────────────────
export const vitalsAPI = {
  create: (data) => {
    const items = getStore('hms_vitals');
    const newItem = { ...data, id: generateId('v'), recordedAt: new Date().toISOString() };
    items.push(newItem);
    setStore('hms_vitals', items);
    return resolve(newItem);
  },
  getByPatient: (patientId) => resolve(getStore('hms_vitals').filter(v => String(v.patientId) === String(patientId))),
  update: (id, data) => {
    const items = getStore('hms_vitals');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_vitals', items); }
    return resolve(items[idx] || data);
  },
};

// ── Queue APIs ────────────────────────────────
export const queueAPI = {
  getAll: () => resolve(getStore('hms_queue')),
  create: (data) => {
    const items = getStore('hms_queue');
    const maxToken = items.reduce((max, i) => Math.max(max, i.tokenNumber || 0), 0);
    const newItem = { ...data, id: generateId('q'), tokenNumber: maxToken + 1, status: 'WAITING', createdAt: new Date().toISOString() };
    items.push(newItem);
    setStore('hms_queue', items);
    return resolve(newItem);
  },
  update: (id, data) => {
    const items = getStore('hms_queue');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_queue', items); }
    return resolve(items[idx] || data);
  },
  delete: (id) => {
    setStore('hms_queue', getStore('hms_queue').filter(i => String(i.id) !== String(id)));
    return resolve({ success: true });
  },
};

// ── Task APIs ─────────────────────────────────
export const taskAPI = {
  getAll: () => resolve(getStore('hms_tasks')),
  create: (data) => {
    const items = getStore('hms_tasks');
    const newItem = { ...data, id: generateId('t'), status: 'PENDING' };
    items.push(newItem);
    setStore('hms_tasks', items);
    return resolve(newItem);
  },
  update: (id, data) => {
    const items = getStore('hms_tasks');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_tasks', items); }
    return resolve(items[idx] || data);
  },
};

// ── Doctor APIs ───────────────────────────────
export const doctorAPI = {
  getDashboard: () => resolve({
    totalPatients: getStore('hms_patients').length,
    criticalCount: getStore('hms_patients').filter(p => p.status === 'CRITICAL').length,
    aiRiskAlerts: 12,
    todayDiagnoses: getStore('hms_diagnoses').length,
    recentPatients: getStore('hms_patients').slice(0, 6),
  }),
};

// ── Nurse APIs ────────────────────────────────
export const nurseAPI = {
  getDashboard: () => resolve({}),
  getWardPatients: () => resolve(getStore('hms_patients')),
  addNote: (data) => resolve(data),
};

// ── Auth APIs (stub for compatibility) ────────
export const authAPI = {
  login: () => resolve({}),
  register: () => resolve({}),
  forgotPassword: () => resolve({ message: 'Reset link sent.' }),
  resetPassword: () => resolve({ message: 'Password reset.' }),
  getMe: () => resolve({}),
  logout: () => resolve({}),
};

// ── AI Prediction (FastAPI / Random Forest) ──
export const aiAPI = {
  predict: async (vitalsData) => {
    const { fever, cough, headache, fatigue } = vitalsData;
    // Format payload for FastAPI
    const payload = {
      fever: fever ? 1 : 0,
      cough: cough ? 1 : 0,
      headache: headache ? 1 : 0,
      fatigue: fatigue ? 1 : 0,
    };
    
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return resolve(data);
    } catch (err) {
      console.warn('FastAPI ml-service not running, using mock fallback:', err);
      const score = payload.fever + payload.cough + payload.headache + payload.fatigue;
      const predictions = [
        { disease: 'Common Cold', confidence: 45 },
        { disease: 'Viral Fever', confidence: 72 },
        { disease: 'Influenza', confidence: 85 },
        { disease: 'Severe Infection', confidence: 92 },
      ];
      const pred = predictions[Math.min(score, predictions.length - 1)];
      return resolve({ predictedDisease: pred.disease, confidence: pred.confidence });
    }
  },
  getRiskSummary: () => resolve({ high: 2, medium: 3, low: 5 }),
};

// ── Appointment APIs ──────────────────────────
export const appointmentAPI = {
  getAll: (params) => {
    let items = getStore('hms_appointments');
    if (params?.patientId) items = items.filter(i => String(i.patientId) === String(params.patientId));
    if (params?.status) items = items.filter(i => i.status === params.status);
    return resolve(items);
  },
  getById: (id) => resolve(findById('hms_appointments', id)),
  create: (data) => {
    const items = getStore('hms_appointments');
    const newItem = { ...data, id: generateId('apt'), createdAt: new Date().toISOString() };
    items.push(newItem);
    setStore('hms_appointments', items);
    return resolve(newItem);
  },
  update: (id, data) => {
    const items = getStore('hms_appointments');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx] = { ...items[idx], ...data }; setStore('hms_appointments', items); }
    return resolve(items[idx] || data);
  },
  cancel: (id) => {
    const items = getStore('hms_appointments');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx].status = 'Cancelled'; setStore('hms_appointments', items); }
    return resolve({ success: true });
  },
};

// ── Lab Report APIs ───────────────────────────
export const labReportAPI = {
  getAll: (params) => {
    let items = getStore('hms_lab_reports');
    if (params?.patientId) items = items.filter(i => String(i.patientId) === String(params.patientId));
    return resolve(items);
  },
  getById: (id) => resolve(findById('hms_lab_reports', id)),
};

// ── Notification APIs ─────────────────────────
export const notificationAPI = {
  getAll: (params) => {
    let items = getStore('hms_notifications');
    if (params?.patientId) items = items.filter(i => String(i.patientId) === String(params.patientId));
    return resolve(items);
  },
  markRead: (id) => {
    const items = getStore('hms_notifications');
    const idx = items.findIndex(i => String(i.id) === String(id));
    if (idx !== -1) { items[idx].read = true; setStore('hms_notifications', items); }
    return resolve({ success: true });
  },
  markAllRead: (patientId) => {
    const items = getStore('hms_notifications');
    items.forEach(i => { if (String(i.patientId) === String(patientId)) i.read = true; });
    setStore('hms_notifications', items);
    return resolve({ success: true });
  },
};

// ── Doctor Data APIs ──────────────────────────
export const doctorDataAPI = {
  getAll: () => resolve(getStore('hms_doctors')),
  getById: (id) => resolve(findById('hms_doctors', id)),
};

export default null;
