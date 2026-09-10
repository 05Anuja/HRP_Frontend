# HR Performance Backend API Reference & Schema Documentation

This document describes all MongoDB database schemas, request/response payloads, authentication mechanisms, and API endpoints defined in the HR Performance backend.

---

## 1. Database Schemas (MongoDB)

All schemas are constructed using **Mongoose** and include automatic MongoDB `_id` generation.

### User Schema
- **File Path**: `./models/User.js`
- **Description**: Represents HR team members and Superadmins who use the system.

| Field Name | Type | Constraints / Validators | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | Required | - | The user's full name. |
| `email` | `String` | Required, Unique | - | Unique login email. |
| `password` | `String` | Required | - | BCRYPT hashed password string. |
| `role` | `String` | Enum: `["superadmin", "hr"]` | `"hr"` | Defines user level privileges. |
| `projects` | `[String]` | Enum: `["Talent Corner", "Recruitment Tracking"]` | `[]` | Projects assigned to the user. |
| `createdAt` | `Date` | Generated automatically by `timestamps` | - | Record creation timestamp. |
| `updatedAt` | `Date` | Generated automatically by `timestamps` | - | Record modification timestamp. |

---

### Recruitment Schema
- **File Path**: `./models/Recruitment.js`
- **Description**: Stores candidate tracking records under the "Recruitment Tracking" project.

| Field Name | Type | Constraints / Validators | Description |
| :--- | :--- | :--- | :--- |
| `hrId` | `ObjectId` | Required, References `User` model | The HR user who created/owns this record. |
| `candidateName`| `String` | Required | Candidate's full name. |
| `candidateContact`| `String` | Required | Contact phone number or email of the candidate. |
| `candidateLocation`| `String` | Required | Candidate's home city or region. |
| `disposition` | `String` | Required, Enum: `["Interested/Maybe", "Not Interested", "Call Back", "No Contact"]` | Call/outreach disposition state. |
| `createdAt` | `Date` | Generated automatically by `timestamps` | Record creation timestamp. |
| `updatedAt` | `Date` | Generated automatically by `timestamps` | Record modification timestamp. |

---

### TalentCorner Schema
- **File Path**: `./models/TalentCorner.js`
- **Description**: Stores candidate profiles tracking CV status under the "Talent Corner" project.

| Field Name | Type | Constraints / Validators | Description |
| :--- | :--- | :--- | :--- |
| `hrId` | `ObjectId` | Required, References `User` model | The HR user who created/owns this record. |
| `candidateName`| `String` | Required | Candidate's full name. |
| `candidatePhone`| `String` | Required | Contact telephone number. |
| `candidateLocation`| `String` | Required | Candidate's home location. |
| `candidateDesignation`| `String` | Required | Candidate's targeted job title. |
| `status` | `String` | Required, Enum: `["Resume Sent", "Resume Not Sent"]` | Status of the candidate's CV submission. |
| `createdAt` | `Date` | Generated automatically by `timestamps` | Record creation timestamp. |
| `updatedAt` | `Date` | Generated automatically by `timestamps` | Record modification timestamp. |

---

## 2. Authentication & Authorization Middleware

### Authentication: `authMiddleware`
- **File Path**: `./middleware/authMiddleware.js`
- **Expects Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Behavior**: Extracts the JWT token, verifies it against `process.env.JWT_SECRET`, decodes payload fields (`id`, `role`, etc.), and populates `req.user`. Returns `401 Unauthorized` if token is missing or invalid.

### Authorization: `checkRole(...roles)`
- **File Path**: `./middleware/roleMiddleware.js`
- **Expects**: Must be placed *after* `authMiddleware`.
- **Behavior**: Checks if `req.user.role` matches any of the permitted roles (e.g., `"superadmin"`). Returns `403 Forbidden` if role is unauthorized.

---

## 3. API Endpoints

### 3.1 Authentication Route (`/api/auth`)
- **Route Base File**: `./routes/authRoutes.js`
- **Controller File**: `./contollers/authController.js`

#### 3.1.1 Register User
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "hr",
    "projects": ["Talent Corner"]
  }
  ```
- **Validations**:
  - Checks if user with the same email already exists (returns `400`).
- **Response (201 Created)**:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "hr",
      "projects": ["Talent Corner"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### 3.1.2 Login User
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "username": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Validations**:
  - `username` (or `email`): Required. Checked against user emails.
  - `password`: Required. Verified against the bcrypt hashed password in the database.
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1...",
    "role": "hr",
    "project": ["Talent Corner"],
    "projects": ["Talent Corner"]
  }
  ```

---

### 3.2 User Management Routes (`/api/users`)
- **Route Base File**: `./routes/userRoutes.js`
- **Controller File**: `./contollers/userController.js`
- **Requirement**: All user routes require **Superadmin** authorization (`authMiddleware` + `checkRole("superadmin")`).

#### 3.2.1 Create HR User
- **Method**: `POST`
- **Route**: `/api/users/createHR`
- **Headers**: `Authorization: Bearer <Token>`
- **Request Body**:
  ```json
  {
   "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "mypassword123",
    "projects": ["Talent Corner", "R ecruitment Tracking"]
  }
  ```
- **Validations**:
  - `name`: Must be a non-empty string.
  - `email`: Must be a valid email format. Cannot duplicate existing email.
  - `password`: Must be a string of at least 6 characters.
  - `projects`: If provided, must be an array containing only `"Talent Corner"` or `"Recruitment Tracking"`.
- **Response (201 Created)**:
  ```json
  {
    "message": "HR user created successfully.",
    "user": {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "hr",
      "projects": ["Talent Corner", "Recruitment Tracking"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### 3.2.2 Get All HR Users
- **Method**: `GET`
- **Route**: `/api/users/allHR`
- **Headers**: `Authorization: Bearer <Token>`
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "hr",
      "projects": ["Talent Corner"],
      "createdAt": "..."
    }
  ]
  ```

#### 3.2.3 Update HR User's Project Assignments
- **Method**: `PATCH`
- **Route**: `/api/users/updateProject/:id`
- **Headers**: `Authorization: Bearer <Token>`
- **Request Params**: `id` (The database `_id` of the target HR user)
- **Request Body**:
  ```json
  {
    "projects": ["Recruitment Tracking"]
  }
  ```
- **Validations**:
  - `projects`: Required. Must be an array containing valid project names (`"Talent Corner"`, `"Recruitment Tracking"`).
  - Target user must exist and have the role `"hr"`.
- **Response (200 OK)**:
  ```json
  {
    "message": "HR user projects updated successfully.",
    "user": {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "hr",
      "projects": ["Recruitment Tracking"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### 3.2.4 Delete HR User
- **Method**: `DELETE`
- **Route**: `/api/users/delete/:id`
- **Headers**: `Authorization: Bearer <Token>`
- **Request Params**: `id` (The database `_id` of the target user)
- **Validations**:
  - Superadmin users cannot be deleted (returns `400`).
- **Response (200 OK)**:
  ```json
  {
    "message": "HR user deleted successfully. Associated talent and recruitment records remain intact."
  }
  ```

---

### 3.3 Recruitment Tracking Routes (`/api/recruitment`)
- **Route Base File**: `./routes/recruitmentRoutes.js`
- **Controller File**: `./contollers/recruitmentController.js`

#### 3.3.1 Add Recruitment Record
- **Method**: `POST`
- **Route**: `/api/recruitment/add`
- **Headers**: `Authorization: Bearer <Token>`
- **Authorization Rule**: User must be authenticated. If they are `"hr"`, they must be assigned to the `"Recruitment Tracking"` project.
- **Request Body**:
  ```json
  {
    "candidateName": "Bruce Wayne",
    "candidateContact": "+1-555-0199",
    "candidateLocation": "Gotham City",
    "disposition": "Interested/Maybe"
  }
  ```
- **Validations**:
  - `candidateName`: Required, non-empty string.
  - `candidateContact`: Required, non-empty string.
  - `candidateLocation`: Required, non-empty string.
  - `disposition`: Required. Must be one of: `'Interested/Maybe'`, `'Not Interested'`, `'Call Back'`, `'No Contact'`.
- **Response (201 Created)**:
  ```json
  {
    "message": "Candidate added to Recruitment Tracking successfully.",
    "recruitment": {
      "_id": "...",
      "hrId": "...",
      "candidateName": "Bruce Wayne",
      "candidateContact": "+1-555-0199",
      "candidateLocation": "Gotham City",
      "disposition": "Interested/Maybe",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### 3.3.2 View My Recruitment Records
- **Method**: `GET`
- **Route**: `/api/recruitment/myData`
- **Headers**: `Authorization: Bearer <Token>`
- **Description**: Returns all records matching the logged-in user's `hrId`, sorted by creation date descending. Populates creator user fields.
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "...",
      "hrId": {
        "_id": "...",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "hr",
        "projects": ["Recruitment Tracking"]
      },
      "candidateName": "Bruce Wayne",
      "candidateContact": "+1-555-0199",
      "candidateLocation": "Gotham City",
      "disposition": "Interested/Maybe",
      "createdAt": "..."
    }
  ]
  ```

#### 3.3.3 View All Recruitment Records
- **Method**: `GET`
- **Route**: `/api/recruitment/allData`
- **Headers**: `Authorization: Bearer <Token>`
- **Authorization Rule**: **Superadmin only**.
- **Response (200 OK)**:
  - List of all recruitment tracking entries in the database, with creator HR user details populated.

#### 3.3.4 Update Recruitment Record
- **Method**: `PATCH`
- **Route**: `/api/recruitment/update/:id`
- **Headers**: `Authorization: Bearer <Token>`
- **Request Params**: `id` (The recruitment record database `_id`)
- **Request Body** *(all fields optional)*:
  ```json
  {
    "candidateName": "Bruce Wayne Updated",
    "disposition": "Call Back"
  }
  ```
- **Authorization & Validation Rules**:
  - Superadmin can update any record.
  - HR users can only update their own records and must still be assigned to `"Recruitment Tracking"`.
  - Body validations apply for any field provided.
- **Response (200 OK)**:
  ```json
  {
    "message": "Recruitment record updated successfully.",
    "recruitment": {
      "_id": "...",
      "hrId": {
        "_id": "...",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "candidateName": "Bruce Wayne Updated",
      "candidateContact": "+1-555-0199",
      "candidateLocation": "Gotham City",
      "disposition": "Call Back",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

---

### 3.4 Talent Corner Routes (`/api/talent`)
- **Route Base File**: `./routes/talentRoutes.js`
- **Controller File**: `./contollers/talentController.js`

#### 3.4.1 Add Talent Record
- **Method**: `POST`
- **Route**: `/api/talent/add`
- **Headers**: `Authorization: Bearer <Token>`
- **Authorization Rule**: User must be authenticated. If they are `"hr"`, they must be assigned to the `"Talent Corner"` project.
- **Request Body**:
  ```json
  {
    "candidateName": "Clark Kent",
    "candidatePhone": "+1-555-0144",
    "candidateLocation": "Metropolis",
    "candidateDesignation": "Senior Journalist",
    "status": "Resume Sent"
  }
  ```
- **Validations**:
  - `candidateName`: Required, non-empty string.
  - `candidatePhone`: Required, non-empty string.
  - `candidateLocation`: Required, non-empty string.
  - `candidateDesignation`: Required, non-empty string.
  - `status`: Required. Must be one of: `'Resume Sent'`, `'Resume Not Sent'`.
- **Response (201 Created)**:
  ```json
  {
    "message": "Candidate added to Talent Corner successfully.",
    "talent": {
      "_id": "...",
      "hrId": "...",
      "candidateName": "Clark Kent",
      "candidatePhone": "+1-555-0144",
      "candidateLocation": "Metropolis",
      "candidateDesignation": "Senior Journalist",
      "status": "Resume Sent",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### 3.4.2 View My Talent Records
- **Method**: `GET`
- **Route**: `/api/talent/myData`
- **Headers**: `Authorization: Bearer <Token>`
- **Description**: Returns all records matching the logged-in user's `hrId`, sorted by creation date descending. Populates creator user fields.
- **Response (200 OK)**:
  - List of the caller's talent entries.

#### 3.4.3 View All Talent Records
- **Method**: `GET`
- **Route**: `/api/talent/allData`
- **Headers**: `Authorization: Bearer <Token>`
- **Authorization Rule**: **Superadmin only**.
- **Response (200 OK)**:
  - List of all talent entries in the database, with creator HR user details populated.

#### 3.4.4 Update Talent Record
- **Method**: `PATCH`
- **Route**: `/api/talent/update/:id`
- **Headers**: `Authorization: Bearer <Token>`
- **Request Params**: `id` (The talent record database `_id`)
- **Request Body** *(all fields optional)*:
  ```json
  {
    "candidateName": "Clark Kent Updated",
    "status": "Resume Not Sent"
  }
  ```
- **Authorization & Validation Rules**:
  - Superadmin can update any record.
  - HR users can only update their own records and must still be assigned to `"Talent Corner"`.
  - Body validations apply for any field provided.
- **Response (200 OK)**:
  ```json
  {
    "message": "Talent Corner record updated successfully.",
    "talent": {
      "_id": "...",
      "hrId": {
        "_id": "...",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "candidateName": "Clark Kent Updated",
      "candidatePhone": "+1-555-0144",
      "candidateLocation": "Metropolis",
      "candidateDesignation": "Senior Journalist",
      "status": "Resume Not Sent",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```
