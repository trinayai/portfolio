# Implementation Plan - Fix Firebase App Hosting Rollout

Fix the failed deployment of the `trinay-apps` backend in Firebase App Hosting. The failure is likely due to dependency conflicts during the cloud build (which requires `--legacy-peer-deps`) and bundle size budget violations.

## Proposed Changes

### Build Configuration

#### [MODIFY] [apphosting.yaml](file:///F:/Trinay-AI/Home/Web_app/apphosting.yaml)
- Add `installConfig` with `installCommand: npm install --legacy-peer-deps`. This ensures that the cloud build environment handles the PrimeNG and Angular dependency conflicts exactly as they were handled locally.

#### [MODIFY] [angular.json](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/angular.json)
- Increase the `initial` bundle size budgets. PrimeNG and Three.js have significantly increased the bundle size, causing the build to fail locally until budgets were adjusted. I will ensure the production configuration has sufficient head-room.
    - `maximumWarning`: 1.5mb
    - `maximumError`: 2.5mb

## Verification Plan

### Manual Verification
- The user needs to trigger a new deployment (e.g., by pushing the changes to the connected repository).
- Monitor the Firebase Console / Cloud Build logs for the new rollout.
- The build should now complete successfully without the `ERRESOLVE` error (handled by legacy-peer-deps) and without the budget error.
