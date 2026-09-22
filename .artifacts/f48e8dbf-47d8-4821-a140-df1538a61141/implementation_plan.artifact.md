# System Validation & UI Architecture Plan

We will implement form validation, success alerts (toasts), and complete the construction of all management and finance pages in the Admin app. We will also ensure that the client app reactively updates when Admin changes occur.

## Proposed Changes

### 1. Reactive Sync & Performance
- **Already Implemented**: Both apps now use a "Single Listener" architecture in `SiteContentService`. When an Admin updates a plan or service, the Client App will automatically receive the update without a page refresh.
- **Verification**: I will add a final check to ensure `shareReplay(1)` is correctly applied to all public data streams.

### 2. Validation & Feedback (Toasts)
#### [MODIFY] [trinayai-admin/src/app/features/admin/admin.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/features/admin/admin.component.ts)
- Add presence checks before saving (e.g., "Title cannot be empty").
- Ensure `messageService.add({ severity: 'success', ... })` is called for every successful operation (Sync Plan, Save Branding, etc.).

#### [MODIFY] [trinayai-web/src/app/features/profile/profile.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/features/profile/profile.component.ts)
- Add validation to the Profile form (Email format, required fields).

### 3. Management Page Construction (`trinayai-admin`)
We will flesh out the placeholder pages to be fully functional. Instead of empty templates, they will now feature a standardized **Data Table + CRUD** interface.

#### [MODIFY] Fleshing out components in `features/manage/`, `features/finance/`, and `features/documents/`
- **Manage**: Implement `Admin`, `Vendors`, `Assets`, `Clients`, and `Subscribers` management using PrimeNG tables.
- **Finance**: Implement `Investment`, `Funds`, `Expenses`, `Salaries`, and `Report` views.
- **Documents**: Implement `Trinayai`, `Directors`, and `Tenders` document management with Firestore upload integration.

### 4. Build & Deployment
- Run a clean production build of both apps.
- Deploy to Firebase.

## Verification Plan
### Manual Verification
- **Validation**: Attempt to save an AI Service without a title and verify the warning toast appears.
- **Success Alert**: Update the site logo in Admin and verify the success toast pops up.
- **Reactive Sync**: Keep both apps open. Change a plan price in Admin and verify it changes instantly on the Main App's "Subscription" page.
- **CRUD Test**: Go to "Manage > Vendors", add a test vendor, and verify it appears in the list.
