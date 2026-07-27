# Implementation Plan - Redesign with PrimeNG and 3D UI/UX

Redesign the Trinayai Technologies web application to a premium, modern AI aesthetic using PrimeNG for UI components and Three.js for immersive 3D experiences.

## User Review Required

> [!IMPORTANT]
> - Switching from Angular Material to PrimeNG will involve replacing existing Material components (buttons, etc.) with PrimeNG equivalents.
> - The 3D background will be implemented using Three.js, which may impact performance on low-end devices. I will optimize it for better performance.

## Proposed Changes

### Core Configuration & Dependencies

#### [MODIFY] [package.json](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/package.json)
- Add `primeng`, `primeicons`, `primeflex` to dependencies.

#### [MODIFY] [styles.scss](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/styles.scss)
- Import PrimeNG themes (Lara Dark Blue/Purple).
- Add PrimeIcons and PrimeFlex.
- Custom global styles for the "3D AI" look.

#### [MODIFY] [app.config.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/app.config.ts)
- Provide PrimeNG animations and configuration.

### Services

#### [MODIFY] [three.service.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/core/services/three.service.ts)
- Implement a proper Three.js scene (e.g., abstract floating particles or a glowing neural sphere) to replace the current CSS-based "orb".

### Layout & Components

#### [MODIFY] [app.component.html](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/app.component.html)
- Replace custom nav with PrimeNG `Menubar`.
- Update footer styling.

#### [MODIFY] [app.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/app.component.ts)
- Integrate PrimeNG `MenuItem` model.

### Feature Pages

#### [MODIFY] [home.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/features/home/home.component.ts)
- Redesign the hero section with PrimeNG buttons and cards.
- Enhance the 3D integration with the hero content.

#### [MODIFY] [services.component.ts](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/src/app/features/services/services.component.ts) (and others)
- Apply the new design language using PrimeNG `DataView` or `Card` components.

## Verification Plan

### Automated Tests
- Run `ng build` to ensure no compilation errors.
- Check browser console for Three.js initialization errors.

### Manual Verification
- Verify the PrimeNG menu works and is responsive.
- Verify the 3D background renders correctly and animates.
- Ensure the redesign aligns with the "premium AI" vision for MSMEs.
