# API Reference

Complete documentation for all BapBapBapBapBap API endpoints.

## 📋 Overview

BapBapBapBapBap provides a RESTful API built on Next.js App Router. All endpoints are located under `/api/` and return JSON responses.

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

### Authentication
- **Admin Endpoints**: Require admin authentication via session cookie
- **Public Endpoints**: No authentication required

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "data": null, 
  "error": "Error message"
}
```

## 🎯 Zone Management

### GET /api/zones
Get all zones with their samples and configuration.

#### Response
```json
{
  "zones": [
    {
      "id": 0,
      "label": "Zone 1",
      "animationKey": "burst",
      "animationCfg": {},
      "isActive": true,
      "samples": [
        {
          "id": "sample_id",
          "zoneId": 0,
          "url": "https://blob-url/audio.mp3",
          "label": "audio.mp3",
          "gainDb": 0,
          "createdAt": "2025-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

#### Zone Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Zone index (0-15) |
| `label` | string | Display name |
| `animationKey` | string | Animation type identifier |
| `animationCfg` | object | Animation parameters |
| `isActive` | boolean | Whether zone responds to taps |
| `samples` | array | Associated audio samples |

---

### GET /api/zones/[id]
Get specific zone details.

#### Parameters
- `id` (path): Zone ID (0-15)

#### Response
```json
{
  "id": 0,
  "label": "Zone 1", 
  "animationKey": "burst",
  "animationCfg": {},
  "isActive": true,
  "samples": [...]
}
```

---

### POST /api/zones/[id]
Update zone configuration.

#### Parameters  
- `id` (path): Zone ID (0-15)

#### Request Body
```json
{
  "animationKey": "ripple",
  "animationCfg": {"speed": 1.5},
  "isActive": true
}
```

#### Response
```json
{
  "success": true,
  "zone": {
    "id": 0,
    "animationKey": "ripple",
    "animationCfg": {"speed": 1.5},
    "isActive": true
  }
}
```

## 🔊 Audio Sample Management

### POST /api/zones/[id]/samples
Upload audio sample to a zone.

#### Parameters
- `id` (path): Zone ID (0-15)

#### Request Body (multipart/form-data)
```
file: Audio file (MP3, WAV, M4A, OGG)
label: Display name (optional)
gainDb: Volume adjustment in dB (optional, default: 0)
```

#### Response
```json
{
  "success": true,
  "sample": {
    "id": "generated_id",
    "zoneId": 0,
    "url": "https://blob-storage/file.mp3",
    "label": "file.mp3",
    "gainDb": 0,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### DELETE /api/samples/[id]
Delete an audio sample.

#### Parameters
- `id` (path): Sample ID

#### Response
```json
{
  "success": true,
  "message": "Sample deleted successfully"
}
```

## 🎨 Animation System

### GET /api/animations
Get list of all available animations.

#### Response
```json
{
  "animations": [
    {
      "key": "burst",
      "name": "Burst",
      "description": "Explosive particle burst from center",
      "schema": {
        "particles": {"type": "number", "default": 20},
        "lifeMs": {"type": "number", "default": 1500}
      }
    }
  ]
}
```

#### Animation Schema Types
- `number`: Numeric parameter
- `boolean`: True/false toggle
- `string`: Text parameter
- `color`: Color value (#hex or rgb)

---

### GET /api/config
Get complete application configuration.

#### Response
```json
{
  "zones": [...],
  "globalScale": 1.0
}
```

Used by main application to load all zones and settings.

## ⚙️ Settings Management

### GET /api/settings
Get global application settings.

#### Response
```json
{
  "id": 1,
  "globalScale": 1.0
}
```

---

### POST /api/settings
Update global settings.

#### Request Body
```json
{
  "globalScale": 2.5
}
```

#### Response
```json
{
  "id": 1,
  "globalScale": 2.5
}
```

## 📁 File Upload

### POST /api/upload-token
Get signed upload URL for Vercel Blob storage.

#### Request Body
```json
{
  "filename": "audio.mp3",
  "contentType": "audio/mpeg"
}
```

#### Response
```json
{
  "uploadUrl": "https://blob.vercel-storage.com/upload-url",
  "token": "upload_token"
}
```

Used internally by file upload components.

## 🛠️ System Management

### POST /api/migrate
Initialize database tables (development only).

#### Response
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

Creates required tables if they don't exist. Used for troubleshooting.

## 📊 Error Responses

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "details": "Zone ID must be between 0 and 15"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Admin authentication required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Zone not found",
  "zoneId": 99
}
```

#### 413 Payload Too Large
```json
{
  "success": false,
  "error": "File too large",
  "maxSize": "10MB"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Database connection failed",
  "code": "DB_CONNECTION_ERROR"
}
```

## 🔍 Query Parameters

### Filtering and Pagination
Most GET endpoints support optional query parameters:

```
GET /api/zones?active=true&animation=burst&limit=5&offset=10
```

#### Common Parameters
- `limit`: Maximum number of results (default: 100)
- `offset`: Skip number of results (default: 0)
- `sort`: Sort field (id, createdAt, label)
- `order`: Sort direction (asc, desc)

### Zone Filtering
- `active`: Filter by active status (true/false)
- `animation`: Filter by animation type
- `hasAudio`: Zones with/without audio samples

### Sample Filtering
- `zone`: Filter by zone ID
- `format`: Filter by file format (mp3, wav, etc.)
- `size`: Filter by file size range

## 📝 Request Examples

### Upload Audio Sample
```javascript
const formData = new FormData();
formData.append('file', audioFile);
formData.append('label', 'My Sound');
formData.append('gainDb', '2.5');

const response = await fetch('/api/zones/0/samples', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

### Update Zone Configuration
```javascript
const response = await fetch('/api/zones/3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    animationKey: 'mandala',
    animationCfg: { layers: 5, speed: 0.8 },
    isActive: true
  })
});
```

### Get Zones with Samples
```javascript
const response = await fetch('/api/zones?active=true');
const data = await response.json();

data.zones.forEach(zone => {
  console.log(`Zone ${zone.id}: ${zone.samples.length} samples`);
});
```

## 🚀 Rate Limiting

### Current Limits
- **Upload endpoints**: 10 requests/minute per IP
- **General API**: 100 requests/minute per IP
- **Admin endpoints**: 50 requests/minute per session

### Headers
Rate limit information is included in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔐 Security Considerations

### Admin Authentication
Admin endpoints require authentication via session cookie:
```javascript
// Must authenticate first via /admin login
const response = await fetch('/api/zones/0', {
  method: 'POST',
  credentials: 'include', // Include session cookie
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});
```

### File Upload Security
- File type validation on server
- Size limits enforced (10MB max)
- Malware scanning (production)
- Signed URLs for secure upload

### CORS Policy
- Same-origin requests allowed
- Admin endpoints: restricted to authenticated sessions
- Public endpoints: limited cross-origin access

## 🧪 Testing the API

### Development Testing
```bash
# Get all zones
curl http://localhost:3000/api/zones

# Get specific zone
curl http://localhost:3000/api/zones/0

# Get animations list
curl http://localhost:3000/api/animations

# Get configuration
curl http://localhost:3000/api/config
```

### Production Testing
Replace `localhost:3000` with your production domain.

### Postman Collection
Import the API endpoints into Postman for easier testing:
1. Create new collection
2. Add requests for each endpoint
3. Set up environment variables for base URL
4. Configure authentication for admin endpoints

---

**Need help with API integration? Check the [troubleshooting guide](./troubleshooting.md) or open a [GitHub issue](https://github.com/MattKilmer/bapbapbapbapbap/issues).** 🛠️