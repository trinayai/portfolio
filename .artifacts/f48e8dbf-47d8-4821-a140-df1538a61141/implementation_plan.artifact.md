# Subscription Page Transformation Plan

We will transform the current "AI Menu" page into a professional "Subscription" page, featuring responsive pricing tiles and dynamic management through the admin portal.

## User Review Required

> [!IMPORTANT]
> - The "AI Menu" navigation item will be renamed to "Subscription".
> - AI Packages will now include pricing, billing cycles, and feature lists.

## Proposed Changes

### 1. Data Model Enhancements
#### [MODIFY] [trinayai-web/src/app/core/models/site-content.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/core/models/site-content.ts) & [trinayai-admin/src/app/core/models/site-content.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/core/models/site-content.ts)
- Add fields to `ContentItem`:
    - `price?: string` (e.g., "₹9,999")
    - `billingCycle?: string` (e.g., "/ month")
    - `features?: string[]` (List of included services)
    - `isPopular?: boolean` (Highlight flag)

### 2. Subscription Page Redesign
#### [MODIFY] [trinayai-web/src/app/features/ai-menu/ai-menu.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/features/ai-menu/ai-menu.component.ts)
- Change component logic and template to render pricing cards.
- Implement responsive grid: 1 column on mobile, 2 on tablet, 3-4 on desktop.
- Style cards with clear price points, feature lists with checkmarks, and primary CTAs.
- Rename internal labels from "AI Menu" to "Subscription Plans".

### 3. Admin Portal Updates
#### [MODIFY] [trinayai-admin/src/app/features/admin/admin.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/features/admin/admin.component.ts)
- Update the "Tools & Services" (AI Items) editor to include fields for Price, Billing Cycle, and a comma-separated list for Features.
- Add a toggle for "Popular/Featured" status.

### 4. Global Navigation Update
#### [MODIFY] [trinayai-web/src/app/app.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/app.component.ts) & [trinayai-admin/src/app/app.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-admin/src/app/app.component.ts)
- Update default `menuItems` to change "AI Menu" to "Subscription".

## Verification Plan

### Automated Tests
- Run `npm run build` for both applications.

### Manual Verification
- **Subscription Page**: Verify tiles are properly sized, show prices/features, and adapt correctly to screen size.
- **Admin Management**: Add/Edit a subscription plan in the admin portal and verify changes reflect on the public site.
- **Navigation**: Confirm the header link correctly says "Subscription".
