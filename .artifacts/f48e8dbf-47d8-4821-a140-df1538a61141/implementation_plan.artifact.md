# Implementation Plan - Fix Firebase App Hosting Build Failure (Iteration 4)

Resolve the persistent build failure in Firebase App Hosting. The previous rollout failed because `npm ci` detected missing `@firebase/*` dependencies in the lock file and potentially used an incompatible Node.js version.

## Proposed Changes

### Dependency & Environment Fixes

#### [MODIFY] [trinayai-web/package.json](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/package.json)
- Added explicit dependencies for internal Firebase packages: `@firebase/app`, `@firebase/component`, `@firebase/logger`, `@firebase/util`, and `@firebase/app-types`. listing these explicitly ensures they are included in the lock file during local generation.
- Set `engines.node` to `^20.0.0` to ensure Cloud Build uses a modern, stable version compatible with Angular 17.

#### [MODIFY] [trinayai-web/package-lock.json](file:///F:/Trinay-AI/Home/Web_app/trinayai-web/package-lock.json)
- Regenerated to include the explicit firebase dependencies. This should eliminate the `npm error Missing: @firebase/app... from lock file` error during the cloud build's `npm ci` step.

## Verification Plan

### Manual Verification
- **Commit and Push**: The user must commit both `package.json` and `package-lock.json` in the `trinayai-web` directory.
- **Rollout Check**: Trigger a new deployment. The build should now complete as the lock file is fully synchronized with all required dependencies.
