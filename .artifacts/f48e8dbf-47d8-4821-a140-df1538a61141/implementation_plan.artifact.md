# Style Unification & Navigation Optimization Plan

We will align the Admin Portal's visual language with the main website, unify sidebar behavior across both applications, and refine the mobile experience with precise widths and a clear close interaction.

## Proposed Changes

### 1. Global Style Synchronization
#### [MODIFY] [trinayai-admin/src/styles.scss](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/styles.scss)
- Copy and adapt typography and base styles from the main app.
- Standardize colors and scrollbar appearance (very light, semi-transparent).

### 2. Navigation Consistency (Both Apps)
#### [MODIFY] [trinayai-web/src/app/app.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/app.component.html) & [trinayai-admin/src/app/app.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/app.component.html)
- Set mobile sidebar width to exactly **70vw** for both apps.
- Add an explicit **Close Icon** button in the sidebar header to ensure users can easily return to the page.
- Ensure "Sign In/Up" buttons are present and styled consistently in both headers.

#### [MODIFY] [trinayai-admin/src/app/app.component.scss](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/app.component.scss)
- Fix the `p-panelMenu` background in mobile view: change from the dark grey shown in the screenshot to a **clean light theme** matching the main app.
- Refine the "active-link" highlight to use the light-blue tint.

### 3. Admin Management UI Refinement
#### [MODIFY] [trinayai-admin/src/app/features/admin/admin.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/features/admin/admin.component.html)
- Use **different background tints** for sections (e.g., `bg-blue-50/20` for Subscriptions, `bg-indigo-50/20` for SMTP) to help distinguish them.
- Apply **`shadow-lg`** to management cards for better section depth.

### 4. Build & Deployment
- Run a clean build for both applications.
- Deploy to Firebase Hosting.

## Verification Plan
### Manual Verification
- **Sidebar Width**: Verify on mobile that the menu covers exactly 70% of the screen.
- **Close Action**: Test the close icon in the sidebar and ensure "click-away" works.
- **Visual Sync**: Verify that the Admin Portal's mobile menu is now light-themed and matches the main app's typography.
