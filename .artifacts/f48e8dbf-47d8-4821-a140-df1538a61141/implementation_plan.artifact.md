# Multi-Site Deployment Plan

We will configure Firebase to support two separate hosting sites: one for the main application and one for the admin portal.

## Proposed Changes

### 1. Firebase Configuration
#### [MODIFY] [firebase.json](file:///F:/Trinay-AI/Home/Web_app/firebase.json)
- Update the `hosting` configuration from a single object to an array of objects.
- Associate the `trinay-ai` site with the `trinayai-web` build output.
- Associate the `trinay-ai-admin` site with the `trinayai-admin` build output.

### 2. Deployment
- Run `firebase deploy --only hosting` to update both sites.

## Verification Plan
### Manual Verification
- Visit `https://trinay-ai.web.app` and verify the main site loads.
- Visit `https://trinay-ai-admin.web.app` and verify the admin portal loads.
