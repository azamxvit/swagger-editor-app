## Pull Request: Swagger Editor App

### Deployed App
[Demo Link](https://swagger-editor-app-smoky.vercel.app)

### YouTube Video
[Video Link]()

## Description
Swagger/OpenAPI Editor with REST client capabilities, authentication, request history & analytics.

## Score Self-Check

### Feature 1: App Header (60)
- [ ] Non-authenticated users see Sign In and Sign Up buttons (15)
- [ ] Authenticated users see History and Sign Out buttons (10)
- [ ] Navigation link to About page in header and footer (10)
- [ ] Expired/invalid token redirects from private routes to Main page (10)
- [ ] Sign In / Sign Up buttons redirect to respective forms (15)

### Feature 2: Sign In / Sign Up (50)
- [ ] Auth buttons present everywhere they should be (10)
- [ ] Client-side validation (email, password strength) (20)
- [ ] Successful login redirects to Main page (10)
- [ ] Already logged in users redirected from auth routes (10)

### Feature 3: Swagger Editor (120)
- [ ] JSON and YAML format support (25)
- [ ] Auto-detection of input format (20)
- [ ] Format switching JSON ↔ YAML (20)
- [ ] Schema validation with error indication (15)
- [ ] Authenticated users can save/restore schemas (10)
- [ ] Viewer populates when schema is valid (10)
- [ ] Responsive split view by orientation (20)

### Feature 4: Swagger Viewer (120)
- [ ] Endpoint list organized by path/method (20)
- [ ] Endpoint details with all parameter types (25)
- [ ] Request schema and examples (20)
- [ ] Response schema, examples, status codes (25)
- [ ] Try-It-Out functionality (20)
- [ ] Generate cURL with copy-to-clipboard (10)

### Feature 5: History and Analytics (70)
- [ ] SSR history with empty state message and links (15)
- [ ] Requests sorted by timestamp (10)
- [ ] Analytics: duration, status, timestamp, method, sizes, errors, URL (45)

### Feature 6: About Page (25)
- [ ] Public route (5)
- [ ] RS School course information (5)
- [ ] Team members with roles and GitHub links (10)
- [ ] Consistent design (5)

### Feature 7: General Requirements (55)
- [ ] At least 2 languages with i18n toggler (30)
- [ ] Sticky header with animation (10)
- [ ] User-friendly error display (10)
- [ ] Private routes protected with 401 (5)

### Feature 8: YouTube Video (50)
- [ ] 5-7 minute video linked in PR (50)

## Test Plan
- [ ] Sign up with valid credentials
- [ ] Sign in / sign out flow
- [ ] Paste OpenAPI schema (JSON and YAML)
- [ ] Toggle format between JSON and YAML
- [ ] Execute API request via Try-It-Out
- [ ] Generate and copy cURL command
- [ ] View request history (authenticated)
- [ ] Switch language EN/RU
- [ ] Visit About page
