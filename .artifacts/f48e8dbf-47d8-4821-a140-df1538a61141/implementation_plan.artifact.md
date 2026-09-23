# Subscription Flow & Profile Loading Fix Plan

We will resolve the "Verifying account" hang and the subscription storage issue by implementing a more robust reactive state machine and fixing the database writing flow.

## Proposed Changes

### 1. Robust Reactive Profile Flow
#### [MODIFY] [trinayai-web/src/app/core/services/profile.service.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/core/services/profile.service.ts)
- **State Handling**: Update `userProfile$` to explicitly wait for Auth initialization before emitting. If no profile exists, it will auto-trigger a merge/create operation to ensure the UI has data to bind to.
- **Merge Logic**: Use `{ merge: true }` in all `setDoc` operations to prevent accidentally overwriting user data.

### 2. Subscription Storage Fix
#### [MODIFY] [trinayai-web/src/app/features/profile/profile.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/features/profile/profile.component.ts)
- **Manual Trigger**: Ensure that clicking "Confirm Upgrade" actually awaits the `addSubscription` service call and refreshes the local state.
- **Redirection**: Fix the `checkQueryParams` logic so it only triggers the upgrade dialog after the profile is fully loaded and stable.

### 3. Profile UI & History Enhancement
#### [MODIFY] [trinayai-web/src/app/features/profile/profile.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/features/profile/profile.component.html)
- **Payment History**: Implement a clean table showing the user's past transactions (already sketched, but ensuring it maps to the DB fields correctly).
- **Subscription Lifecycle**: Add status badges ("Renewing Soon", "Ending [Date]") based on the `expiryDate` field.
- **Management Buttons**: Ensure Upgrade and Cancel actions are fully functional and show success toasts.

### 4. Admin Management Controls
#### [MODIFY] [trinayai-admin/src/app/features/admin/admin.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/features/admin/admin.component.ts)
- **Audit Logs**: Ensure all user subscription changes are logged in the `auditLogs` collection for Admin visibility.
- **User Detail View**: Ensure the Admin can see the same history and status as the user.

### 5. Build & Deployment
- Run a clean build and deploy with updated Firestore rules (to allow the auto-init).

## Verification Plan
### Manual Verification
- **Cold Boot**: Log in as a user; verify the dashboard loads in under 3 seconds.
- **Subscription Test**: Subscribe to a plan; verify the plan appears in "Active Subscriptions" and a record appears in "Billing History".
- **Admin Audit**: Log in as admin; verify the user's subscription action is visible in the logs.
