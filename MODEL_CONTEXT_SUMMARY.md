# Aurora HMS Dashboard - Model Handoff Summary

Generated on: 2026-05-28

## 1. Project Purpose
Aurora HMS Dashboard is a role-based healthcare frontend for three roles:
- Doctor
- Nurse
- Patient

Main capabilities:
- Authentication (login/register/forgot/reset)
- Patient management
- Diagnoses
- Prescriptions
- Vitals
- Queue and task workflows
- Billing and invoices

## 2. Tech Stack
- React 19
- Vite 6
- React Router DOM 7
- Tailwind CSS v4
- Axios
- Motion (`motion/react`)
- Lucide React icons
- jsPDF + jspdf-autotable (PDF exports)

## 3. Run and Build
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

Environment variable used:
- `VITE_API_BASE_URL`

## 4. High-Level Architecture
- Entry point: `src/main.jsx`
  - Wraps app with `BrowserRouter` and `AuthProvider`.
- Routing: `src/App.jsx`
  - Public auth routes + protected routes with role checks.
- Auth/session state: `src/context/AuthContext.jsx`
  - Uses `hms_token` and `hms_user` in `localStorage`.
  - Restores session via `/auth/me`.
- API layer: `src/api/client.js`
  - Single Axios client with auth interceptor and 401 handling.
  - Feature API modules exported: `authAPI`, `patientAPI`, `diagnosisAPI`, `prescriptionAPI`, `vitalsAPI`, `queueAPI`, `taskAPI`, `billingAPI`, etc.
- Layout:
  - `src/components/layout/DashboardLayout.jsx`
  - `src/components/layout/Sidebar.jsx`
  - `src/components/layout/Topbar.jsx`
- Reusable UI kit:
  - `src/components/ui/*` (`Button`, `Card`, `Input`, `Table`, `Badge`, `Loader`, `Modal`, `ErrorMessage`, `EmptyState`)

## 5. Route Coverage (Current)
Public:
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

Protected dashboards:
- `/doctor/dashboard`
- `/nurse/dashboard`
- `/my/dashboard`

Protected modules:
- Patients: `/patients`, `/patients/new`, `/patients/:id`, `/patients/:id/edit`, `/patients/:id/history`
- Diagnoses: `/diagnoses`, `/diagnoses/new`, `/diagnoses/:id`, `/diagnoses/:id/edit`
- Prescriptions: `/prescriptions`, `/prescriptions/new`, `/prescriptions/:id`, `/prescriptions/:id/edit`
- Vitals: `/vitals`, `/vitals/new`, `/vitals/:id/edit`
- Queue: `/queue`
- Tasks: `/tasks`
- Billing: `/billing`, `/billing/invoices/new`, `/billing/invoices/:id`

## 6. Feature Notes by Domain
- Patients:
  - List/search/filter, create/update/delete, detail, history, summary PDF export.
- Diagnoses:
  - CRUD + status update.
- Prescriptions:
  - CRUD, medicine line items, PDF generation/export.
- Vitals:
  - Record/edit vitals and list by patient or ward context.
- Billing:
  - Search patients, create invoice + items, invoice detail, send invoice, PDF download.
- Dashboards:
  - Doctor and nurse dashboard cards/timelines.
  - Patient self-service dashboard (read-only views + prescription PDF download).

## 7. Known Issues / Risks To Hand Off
1. `InvoiceForm` calls `billingAPI.downloadInvoicePdf(...)`, but API client exposes `billingAPI.downloadPdf(...)`.
2. `Topbar` links to `/profile` and `/settings`, but no such routes exist in `App.jsx`.
3. `NAV_ITEMS` for patient includes `/my/records`, `/my/diagnoses`, `/my/prescriptions`, `/my/vitals`, but these routes are not implemented.
4. `useApiOnMount` in `src/hooks/useApi.js` triggers fetch via `useState(() => fetchData())` instead of `useEffect`.
5. Billing item shape mismatch risk:
   - Invoice form sends `itemName`.
   - Invoice detail renders `item.description`.
6. Some flows are placeholder behavior (`alert(...)`) in queue/tasks and error handling.
7. No test suite or lint scripts are currently defined in `package.json`.

## 8. API Compatibility Behavior Already Implemented
- `patientAPI.update` includes PUT/PATCH fallback logic and singular/plural endpoint fallback.
- `patientAPI.getCurrentVitals` falls back from `/patients/:id/vitals/current` to listing vitals and picking latest.
- `patientAPI.getDiagnoses` and `patientAPI.getPrescriptions` include fallback endpoint variants.

## 9. Suggested Next-Model Priority Tasks
1. Fix billing API naming mismatch and invoice item field mapping.
2. Add missing routes or remove dead links (`/profile`, `/settings`, patient nav dead routes).
3. Fix `useApiOnMount` to use `useEffect`.
4. Replace placeholder alerts with proper UI flows/modals.
5. Add lint + test setup.

## 10. Ready-To-Paste Prompt For Next Model
Use this as your first message to the next model:

"Continue this React/Vite healthcare dashboard project using MODEL_CONTEXT_SUMMARY.md as source of truth. First, fix the high-priority issues listed in section 9, starting with billing API mismatches and dead routes. Keep role-based routing intact and do not remove existing features."

