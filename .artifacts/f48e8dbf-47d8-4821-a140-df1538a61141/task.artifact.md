# Subscription Flow & Profile Loading Fix Tasks

- [ ] **Reactive Service Fixes (`trinayai-web`)**
    - [ ] Refactor `ProfileService` (Auto-init missing profiles, secure merge logic)
    - [ ] Update `addSubscription` to properly await and log audit events
- [ ] **Public UI Enhancement (`trinayai-web`)**
    - [ ] Update `ProfileComponent` (Async upgrade logic, redirect stability)
    - [ ] Finalize `profile.component.html` (Billing history, lifecycle badges, toasts)
- [ ] **Admin Oversight (`trinayai-admin`)**
    - [ ] Ensure `UserManageComponent` displays accurate subscription history and logs
- [ ] **Verification & Deployment**
    - [ ] Clean build both apps
    - [ ] Firebase deployment
