# TODO: Make Landing Page Public and Protect Other Routes

- [x] Edit App.js to wrap private routes (/Home, /dashboard and nested, /contest/:id, /contest/:id/submit, /leaderboard) with ProtectedRoute component
- [x] Verify that public routes (/, /login, /auth/success, /login/oauth2/code/github) remain unprotected
- [x] Add logout functionality to clear token and redirect to landing page
- [x] Ensure token expires on logout or server stop
