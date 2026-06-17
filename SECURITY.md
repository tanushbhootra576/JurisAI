# Security Policy

## Supported Versions

Currently, only the `main` branch (v1.0.0) is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within JurisAI, please send an e-mail to the security team. All security vulnerabilities will be promptly addressed.

## Implemented Security Measures

During our recent Production Audit, the following safeguards were implemented:

1. **Helmet.js Integration**: Protects against cross-site scripting (XSS), clickjacking, and MIME type sniffing by setting strict HTTP headers.
2. **Express Rate Limiting**: The API (`/api/`) is protected against brute-force attacks and Denial of Service (DoS) by strictly limiting IP requests.
3. **Payload Limitations**: Request bodies are capped at `10kb` to prevent large payload memory-exhaustion attacks.
4. **Input Sanitization**: 
   - NoSQL Injection protection via strict Mongoose Schemas.
   - Vector Database injection prevention by strictly typing the `message` payload as a string.
5. **Cross-Site Scripting (XSS)**: All Markdown rendered by the AI is strictly sanitized on the client using `DOMPurify` before entering the DOM.
6. **Authentication**: Handled securely via Google OAuth 2.0 with JWT tokens utilized for stateless session management.
