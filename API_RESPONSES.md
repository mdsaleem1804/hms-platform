# HMS Platform - API Response Examples

## Patient Endpoints

### GET /api/patients
**Description**: List all patients

**Success Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "uhid": "P001",
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "mobile": "9876543210",
      "dateOfBirth": "1985-05-15",
      "gender": "M"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "uhid": "P002",
      "firstName": "Priya",
      "lastName": "Singh",
      "mobile": "9876543211",
      "dateOfBirth": "1990-08-22",
      "gender": "F"
    }
  ],
  "message": "Patients retrieved successfully"
}
```

---

### GET /api/patients/{id}
**Description**: Get patient details

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "uhid": "P001",
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "mobile": "9876543210",
    "dateOfBirth": "1985-05-15",
    "gender": "M"
  },
  "message": "Success"
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "data": null,
  "message": "Patient not found"
}
```

---

### POST /api/patients
**Description**: Create new patient

**Request Body**:
```json
{
  "uhid": "P006",
  "firstName": "Sanjay",
  "lastName": "Verma",
  "mobile": "9876543215",
  "dateOfBirth": "1988-02-14",
  "gender": "M"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "uhid": "P006",
    "firstName": "Sanjay",
    "lastName": "Verma",
    "mobile": "9876543215",
    "dateOfBirth": "1988-02-14",
    "gender": "M"
  },
  "message": "Patient created successfully"
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "data": null,
  "message": "UHID must be unique"
}
```

---

### PUT /api/patients/{id}
**Description**: Update patient information

**Request Body**:
```json
{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "mobile": "9876543220",
  "gender": "M"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "uhid": "P001",
    "firstName": "Rajesh",
    "lastName": "Kumar",
    "mobile": "9876543220",
    "dateOfBirth": "1985-05-15",
    "gender": "M"
  },
  "message": "Patient updated successfully"
}
```

---

### DELETE /api/patients/{id}
**Description**: Delete patient (soft delete)

**Success Response (200)**:
```json
{
  "success": true,
  "data": true,
  "message": "Patient deleted successfully"
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "data": null,
  "message": "Patient not found"
}
```

---

## Appointment Endpoints

### GET /api/appointments
**Description**: List all appointments

**Query Parameters**:
- `status` (optional): Filter by status
- `doctorId` (optional): Filter by doctor
- `patientId` (optional): Filter by patient

**Success Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "appointmentNo": "APT202401001",
      "patientId": "550e8400-e29b-41d4-a716-446655440000",
      "doctorId": "770e8400-e29b-41d4-a716-446655440000",
      "appointmentDate": "2024-01-15",
      "startTime": "09:00:00",
      "endTime": "09:30:00",
      "tokenNumber": 1,
      "status": "Scheduled",
      "visitType": "Consultation"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "appointmentNo": "APT202401002",
      "patientId": "550e8400-e29b-41d4-a716-446655440001",
      "doctorId": "770e8400-e29b-41d4-a716-446655440000",
      "appointmentDate": "2024-01-15",
      "startTime": "09:30:00",
      "endTime": "10:00:00",
      "tokenNumber": 2,
      "status": "Confirmed",
      "visitType": "Consultation"
    }
  ],
  "message": "Appointments retrieved successfully"
}
```

---

### POST /api/appointments
**Description**: Create new appointment

**Request Body**:
```json
{
  "patientId": "550e8400-e29b-41d4-a716-446655440000",
  "doctorId": "770e8400-e29b-41d4-a716-446655440000",
  "appointmentDate": "2024-01-20",
  "startTime": "10:00:00",
  "endTime": "10:30:00",
  "visitType": "Consultation"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440010",
    "appointmentNo": "APT202401010",
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "doctorId": "770e8400-e29b-41d4-a716-446655440000",
    "appointmentDate": "2024-01-20",
    "startTime": "10:00:00",
    "endTime": "10:30:00",
    "tokenNumber": 15,
    "status": "Scheduled",
    "visitType": "Consultation"
  },
  "message": "Appointment created successfully"
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "data": null,
  "message": "Doctor is not available at this time"
}
```

---

### PUT /api/appointments/{id}
**Description**: Reschedule or update appointment

**Request Body**:
```json
{
  "appointmentDate": "2024-01-25",
  "startTime": "14:00:00",
  "endTime": "14:30:00",
  "status": "Confirmed"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440010",
    "appointmentNo": "APT202401010",
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "doctorId": "770e8400-e29b-41d4-a716-446655440000",
    "appointmentDate": "2024-01-25",
    "startTime": "14:00:00",
    "endTime": "14:30:00",
    "tokenNumber": 15,
    "status": "Confirmed",
    "visitType": "Consultation"
  },
  "message": "Appointment updated successfully"
}
```

---

### DELETE /api/appointments/{id}
**Description**: Cancel appointment

**Success Response (200)**:
```json
{
  "success": true,
  "data": true,
  "message": "Appointment deleted successfully"
}
```

---

## Error Response Format

### Validation Error (400)
```json
{
  "success": false,
  "data": null,
  "message": "Invalid input: UHID is required"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "data": null,
  "message": "Unauthorized access"
}
```

### Not Found (404)
```json
{
  "success": false,
  "data": null,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "data": null,
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful request |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server fault |

---

## Response Structure

All API responses follow this structure:

```json
{
  "success": boolean,       // Success indicator
  "data": object|array|null,  // Response data (null on error)
  "message": string         // Human-readable message
}
```

### Guidelines
- `success`: true if operation succeeded, false otherwise
- `data`: Contains response payload or null for errors
- `message`: Describes the operation (error/success details)

---
