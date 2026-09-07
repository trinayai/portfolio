# UI Refinement and Bug Fix Plan

We will update the branding, fix the header duplication issue, and resolve font decoding errors in both the main app and admin portal.

## User Review Required

> [!IMPORTANT]
> - The header will be changed from dark/transparent to solid white with black text.
> - The application logo will be switched to `Trinay-AI-Logo.jpeg`.

## Proposed Changes

### 1. Branding & Header Updates
#### [MODIFY] [trinayai-web/src/app/app.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/app.component.html) & [trinayai-admin/src/app/app.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/app.component.html)
- Change the logo source to `assets/logo/Trinay-AI-Logo.jpeg`.
- Remove the fallback "T" icon as we'll use the fixed asset.
- Update header classes for a white background.

#### [MODIFY] [trinayai-web/src/styles.scss](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/styles.scss) & [trinayai-admin/src/styles.scss](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/styles.scss)
- Set header background to white.
- Set menu text and brand name colors to black.
- Ensure PrimeNG menu buttons and active links are visible against a white background.

### 2. Fix Header Duplication (Hydration Issue)
The "two menu texts" issue seen on load is likely due to Angular's Client Hydration rendering a second copy of the header before it can replace the SSR-rendered one, or a mismatch in the DOM structure.
- We will ensure `provideClientHydration()` is configured correctly.
- We will add `ngSkipHydration` to the header element if the duplication persists.

### 3. Resolve Font Decoding Errors
The `Inter` font error (`OTS parsing error`) indicates a corrupt or missing font file.
- We will check if `Inter` is being imported via a CSS file (likely from a library like PrimeNG or a CDN).
- We will explicitly provide a reliable font import or remove the problematic reference if it's not needed.

### 4. Deployment
- Synchronize all lock files.
- Build both apps locally to verify.
- Deploy to Firebase.

## Verification Plan
### Manual Verification
- Check both apps at their URLs:
    - [Main Website](https://trinay-apps--trinay-ai.us-east4.hosted.app)
    - [Admin Portal](https://trinayai-admin--trinay-ai.us-east4.hosted.app)
- Verify the header is white with black text and the correct logo.
- Confirm only one menu is visible on load.
- Check browser console to ensure font errors are resolved.
