# Cloud API — Detailed Notes (SPPU Exam-Oriented)

---

## 1.1 Introduction: Cloud API, Role in Cloud Computing

### What is an API?
An **Application Programming Interface (API)** is a set of defined rules and protocols that allows one software application to communicate with and request services from another. It defines the **contract** between the requester (client) and the provider (server) — *what* can be asked, *how* it must be asked, and *what* will be returned.

### What is a Cloud API?
A **Cloud API** is an API that is **hosted and delivered through a cloud computing platform**. It exposes the capabilities of cloud services (compute, storage, databases, machine learning, messaging, authentication, etc.) over the internet so that developers and applications can consume them **on demand, programmatically, without managing the underlying infrastructure**.

**Examples**:
- AWS EC2 API (provision virtual servers)
- AWS S3 API (object storage)
- Google Cloud Storage API
- Azure Blob Storage API
- Twilio API (SMS/voice via cloud)
- Stripe API (payments via cloud)

### Cloud API Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐         ┌──────────────────────────┐
│                     │  HTTPS  │                          │  HTTP   │                          │
│   Client / Consumer │ ──────► │     API Gateway          │ ──────► │     Cloud Backend        │
│   (Mobile app, Web  │         │   (Auth, rate limiting,  │         │   (Compute, Storage,     │
│   app, IoT device)  │ ◄────── │    routing, caching)     │ ◄────── │    DB, ML services)      │
│                     │  JSON   │                          │  JSON   │                          │
└─────────────────────┘         └──────────────────────────┘         └──────────────────────────┘
         Client                          Cloud API layer                    Cloud infrastructure
```

### Role of Cloud API in Cloud Computing

| Role | Description | Example |
|------|-------------|---------|
| **Abstraction** | Hides the complexity of underlying infrastructure; consumer sees a simple interface, not servers, VMs, or network details | `s3.putObject()` instead of managing disk clusters |
| **On-demand Access** | Services are provisioned and consumed programmatically whenever needed | Scale compute up/down via API, not manual console |
| **Integration** | Connects cloud services with each other and with on-premise/third-party systems | CRM syncing with cloud data warehouse |
| **Automation & Orchestration** | Enables Infrastructure-as-Code (IaC), CI/CD, and multi-service workflows | Terraform, AWS CloudFormation calling cloud APIs |
| **Pay-per-use Metering** | Enables billing, monitoring, and quotas through API calls | Billing by API request count |
| **Multi-tenancy** | One shared platform serves many consumers with isolated, secure access | SaaS applications exposing per-tenant APIs |
| **Innovation** | Lets third parties build on top of cloud capabilities (ecosystem) | Developers building apps on Stripe/Twilio APIs |
| **Elastic Scalability** | API layer scales automatically to handle load spikes | Auto-scaling API gateways during traffic surges |

### SPPU Exam Tip
> For "Explain the role of Cloud API in cloud computing", draw the **Client → API Gateway → Cloud Services** diagram and list at least **5 roles** (abstraction, on-demand access, integration, automation/orchestration, pay-per-use).

---

## 1.2 Characteristics of Cloud API

| Characteristic | Description |
|----------------|-------------|
| **Scalability & Elasticity** | The API automatically scales up/down with demand (auto-scaling) — handles traffic spikes without manual intervention |
| **On-demand / Self-service** | Consumers can provision and consume services anytime via API without human interaction |
| **Statelessness** | Each request carries all information needed (or state is handled via tokens); server does not store session data between calls |
| **Standard Protocols** | Built on open standards — HTTP/HTTPS, REST, SOAP, GraphQL, OpenAPI, OAuth |
| **Authentication & Authorization** | Secured via API keys, OAuth 2.0, JWT, IAM roles, mTLS |
| **Multi-tenancy** | Single API infrastructure securely serves multiple customers with isolated data and limits |
| **Pay-per-use (Metering)** | Usage is measured per request and billed accordingly; enables quotas and rate limits |
| **SLA-backed (Reliability)** | Providers guarantee availability (e.g., 99.9%) via Service Level Agreements |
| **Discoverability & Documentation** | Auto-generated docs (OpenAPI/Swagger), versioning, and developer portals |
| **Versioned** | APIs evolve over time through versioning (v1, v2) without breaking existing consumers |
| **Monitoring & Analytics** | Usage, latency, error, and cost metrics are observable via dashboards |
| **Global Accessibility** | Available over the internet from anywhere, with edge/regional endpoints |

### SPPU Exam Tip
> "Characteristics of Cloud API" questions are usually 4–5 marks. Answer with a **table** and pick **5–6 characteristics**: scalability, on-demand access, security, statelessness, pay-per-use, multi-tenancy. Add one line on each.

---

## 1.3 Types of Cloud API: RESTful, SOAP, GraphQL, WebSockets

### Comparison Table

| Parameter | REST | SOAP | GraphQL | WebSockets |
|-----------|------|------|---------|------------|
| **Protocol** | HTTP/HTTPS | HTTP(S), SMTP, TCP, JMS | HTTP/HTTPS (single endpoint) | TCP (full-duplex) |
| **Data Format** | JSON, XML | XML (SOAP envelope) | JSON (queries/response) | JSON/binary messages |
| **Contract** | Resource + HTTP methods | WSDL (Web Service Definition Language) | Schema + query language | Message protocol |
| **State** | Stateless | Stateless | Stateless | **Stateful** (persistent connection) |
| **Model** | Request–Response | Request–Response | Request–Response (single POST) | **Bi-directional push** |
| **Operations** | CRUD over resources | Actions defined in WSDL | Query / Mutation / Subscription | Send & receive messages |
| **Best For** | Web & mobile apps, public APIs | Enterprise, banking, government (high security/transactions) | Reducing over/under-fetching, mobile apps, aggregations | Real-time: chat, gaming, live dashboards, notifications |
| **Maturity** | Modern de-facto standard | Legacy/enterprise | Modern (2015) | Modern, long-lived connections |

### RESTful APIs
- **Architecture**: Everything is a **resource** identified by a URI (`/users/123`).
- **Verbs**: Uses HTTP methods — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Stateless**: Each request is self-contained; server keeps no client session.
- **Representations**: JSON/XML returned; client negotiates via `Accept` header.
- **Status codes**: Meaningful HTTP codes (200, 201, 400, 401, 404, 500).
- **Examples**: Twitter API, GitHub API, Stripe API, AWS S3 REST API.

### SOAP APIs
- **Full name**: Simple Object Access Protocol.
- **Format**: Strictly **XML** inside a SOAP envelope (Header + Body + Fault).
- **Contract**: Described by **WSDL** — machine-readable definition of operations.
- **Features**: Built-in **security (WS-Security)**, **reliability**, **transactions**.
- **Transport**: Can run over HTTP, SMTP, TCP, JMS (not only HTTP).
- **Drawbacks**: Verbose XML, heavy overhead, more complex to implement.
- **Examples**: Enterprise systems — banking, payment gateways, legacy ERPs, government systems.

**SOAP Message Structure**
```
<SOAP-ENV:Envelope>
  <SOAP-ENV:Header>  (optional — security, routing)  </SOAP-ENV:Header>
  <SOAP-ENV:Body>    (the actual operation & data)   </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

### GraphQL APIs
- **Model**: A **query language** (Facebook, 2015) where the client specifies **exactly** the fields it needs.
- **Single endpoint**: All operations go to one URL (`POST /graphql`).
- **Operations**: **Query** (read), **Mutation** (write), **Subscription** (real-time events).
- **Advantages**: **No over-fetching / under-fetching** — solves N+1 and chatty-client problems.
- **Tooling**: Introspection — API schema is self-documenting and explorable.
- **Examples**: GitHub GraphQL API, Shopify, Contentful.

**GraphQL Example**
```graphql
query {
  user(id: "42") {
    name
    email          # client asks for only these fields
    posts { title }
  }
}
```

### WebSocket APIs
- **Model**: Full-duplex, **persistent**, bidirectional communication over a single TCP connection.
- **Handshake**: Client sends an HTTP upgrade request → server switches to WebSocket protocol.
- **Real-time push**: Server can push data to client **without the client polling**.
- **Stateless vs Stateful**: Stateful — the connection stays open (unlike REST).
- **Examples**: Live chat, multiplayer gaming, stock tickers, collaborative editing, IoT telemetry.

### "When to Use Which" Decision Flow

```
Need real-time, bidirectional push? ───► Yes ────► WebSockets
                    │
                    ▼ No
Need precise data selection / aggregation
to avoid over-fetching? ───────────────────► Yes ────► GraphQL
                    │
                    ▼ No
Enterprise-grade security, transactions,
strict contracts (banking)? ───────────────► Yes ────► SOAP
                    │
                    ▼ No
Simple CRUD over resources, public APIs,
mobile/web apps? ──────────────────────────► REST
```

### SPPU Exam Tip
> "Compare REST, SOAP, GraphQL and WebSockets" is a favourite question. Start with a **4-column comparison table** (protocol, format, state, use case), then write **2 lines on each type**. Mention: REST = resources + HTTP verbs, SOAP = XML + WSDL, GraphQL = query language, WebSockets = full-duplex.

---

## 1.4 API Lifecycle Management

### Definition
API Lifecycle Management is the process of managing an API from its **planning and design** through **development, testing, deployment, monitoring, versioning**, and finally **deprecation/retirement** — ensuring the API is secure, reliable, and aligned with business needs at every stage.

### Lifecycle Phases

```
        ┌──────────► Plan (Goals, target consumers, SLA)
        │              │
        │              ▼
    Retire /       Design (OpenAPI spec, resources, errors)
    Deprecate         │
        │              ▼
        │            Develop (code, mock, CI/CD)
        │              │
        │              ▼
        │            Test (unit, integration, load, security)
        │              │
        │              ▼
        │          Publish & Deploy (gateway, portal)
        │              │
        │              ▼
        │          Monitor (metrics, logs, alerts)
        │              │
        │              ▼
        └────────── Version & Evolve (v1 → v2, backward compat)
```

| Phase | Key Activities | Tools |
|-------|----------------|-------|
| **1. Plan** | Define purpose, consumers, business goals, SLAs, monetization | Product/roadmap tools, stakeholder meetings |
| **2. Design** | Define resources, HTTP verbs, error codes, security model; write **OpenAPI/Swagger** spec | Swagger Editor, Stoplight, OpenAPI |
| **3. Develop** | Implement endpoints, authentication, mocks first | Node.js/Python/Java, Postman Mock Server |
| **4. Test** | Unit, integration, contract, load, and security testing | Postman, SoapUI, JMeter, OWASP ZAP |
| **5. Publish & Deploy** | Deploy to API gateway, expose via developer portal, document | AWS API Gateway, Azure API Management, Apigee, Kong |
| **6. Monitor** | Track latency, errors, usage, availability; set alerts | Datadog, CloudWatch, Prometheus, New Relic |
| **7. Version & Evolve** | Add v2 while keeping v1; deprecate gradually | Gateway versioning, API policies |
| **8. Retire/Deprecate** | Announce deprecation, migrate consumers, then shut down | Sunset headers, notifications |

### Popular API Management Platforms

| Platform | Vendor | Key Feature |
|----------|--------|-------------|
| **AWS API Gateway** | Amazon | Serverless API hosting, throttling, key management |
| **Azure API Management (APIM)** | Microsoft | Policy-based gateway, developer portal |
| **Apigee** | Google | Enterprise API management, analytics, monetization |
| **Kong** | Kong Inc. | Open-source, plugin-based gateway |
| **Postman** | Postman | Design, test, document, and monitor APIs |

### SPPU Exam Tip
> For "Explain API lifecycle management", draw the **circular/sequential lifecycle diagram**, then describe each phase in **1 line**. Mention at least **2 tools** (e.g., Swagger for design, AWS API Gateway / Apigee for management).

---

## 1.5 Cloud API Request Methods

### HTTP Request Methods

| Method | Purpose | Idempotent | Safe | Example |
|--------|---------|-----------|------|---------|
| **GET** | Retrieve a resource | Yes | Yes | `GET /users/1` |
| **POST** | Create a new resource / trigger action | No | No | `POST /users` |
| **PUT** | Replace an entire resource | Yes | No | `PUT /users/1` |
| **PATCH** | Partially update a resource | No | No | `PATCH /users/1` |
| **DELETE** | Remove a resource | Yes | No | `DELETE /users/1` |
| **HEAD** | Same as GET but returns headers only | Yes | Yes | `HEAD /users/1` |
| **OPTIONS** | Describe communication options (CORS pre-flight) | Yes | Yes | `OPTIONS /users` |

- **Safe** = does not modify the resource (GET, HEAD, OPTIONS).
- **Idempotent** = repeating the call produces the same result (GET, PUT, DELETE, HEAD, OPTIONS).

### Request & Response Structure

```
  REQUEST                                   RESPONSE
┌─────────────────────────────┐    ┌─────────────────────────────┐
│ Request Line                │    │ Status Line                 │
│  GET /users/1 HTTP/1.1      │    │  HTTP/1.1 200 OK            │
├─────────────────────────────┤    ├─────────────────────────────┤
│ Headers                     │    │ Headers                     │
│  Host: api.example.com      │    │  Content-Type: application/ │
│  Authorization: Bearer xyz  │    │   json                      │
│  Accept: application/json   │    │  X-RateLimit-Remaining: 99  │
├─────────────────────────────┤    ├─────────────────────────────┤
│ Body (optional)             │    │ Body                        │
│  {"name": "Alice"}          │    │  {"id":1,"name":"Alice"}    │
└─────────────────────────────┘    └─────────────────────────────┘
```

### HTTP Status Codes

| Code | Class | Meaning | Cloud API Example |
|------|-------|---------|-------------------|
| **200** | 2xx Success | OK | Request succeeded |
| **201** | 2xx Success | Created | Resource created by POST |
| **204** | 2xx Success | No Content | DELETE successful |
| **301/302** | 3xx Redirect | Moved | Endpoint migration |
| **400** | 4xx Client Error | Bad Request | Malformed JSON |
| **401** | 4xx Client Error | Unauthorized | Missing/invalid API key |
| **403** | 4xx Client Error | Forbidden | No permission |
| **404** | 4xx Client Error | Not Found | Resource doesn't exist |
| **409** | 4xx Client Error | Conflict | Duplicate resource |
| **429** | 4xx Client Error | Too Many Requests | **Rate limit exceeded** |
| **500** | 5xx Server Error | Internal Server Error | Backend failure |
| **503** | 5xx Server Error | Service Unavailable | Cloud service overloaded |

### Typical Request–Response Flow in Cloud

```
Client  ── POST /api/v1/orders ──►  API Gateway  ──►  Cloud Service
  │                                     │  (auth check, rate limit,
  │                                     │   route to backend)
  │◄──── 201 Created + order JSON ◄─────┘  ◄───────────┘
```

### SPPU Exam Tip
> For "Explain cloud API request methods", give a **table of HTTP verbs** (GET/POST/PUT/PATCH/DELETE) with purpose + idempotency, plus the **status code table** (200, 201, 400, 401, 404, 429, 500). Draw the request–response structure diagram.

---

## 1.6 Challenges of Cloud API

| Challenge | Description | Mitigation |
|-----------|-------------|------------|
| **Security & Data Privacy** | Unauthorized access, injection attacks, data exposure (the #1 challenge) | OAuth 2.0, JWT, mTLS, WAF, encryption, input validation |
| **Authentication & Authorization** | Managing identities across multi-tenant cloud consumers | IAM, API keys, OAuth scopes, role-based access control |
| **Rate Limiting & Quotas** | Abuse, DDoS, cost explosion from excessive calls | Throttling policies, `429` responses, usage plans |
| **Latency & Performance** | Network overhead, cold starts, backend bottlenecks | Caching, CDN, edge endpoints, auto-scaling |
| **Versioning & Backward Compatibility** | Breaking changes when the API evolves | Semantic versioning (v1/v2), deprecation policies |
| **Multi-tenancy Isolation** | One tenant's heavy usage degrading others; data leaks between tenants | Tenant-scoped resources, per-tenant quotas, isolation |
| **Cost Management** | Pay-per-call billing can balloon with poor design | Quotas, cost monitoring, efficient payloads |
| **Compliance & Governance** | GDPR, DPDP, PCI-DSS, HIPAA, audit requirements | Compliance certifications, logging, data residency |
| **Documentation Drift** | Docs become outdated, leading to misuse and errors | OpenAPI-first design, auto-generated docs |
| **Discoverability** | Consumers can't find or understand the API | Developer portals, API catalogs, versioned docs |
| **Error Handling & Observability** | Poor error messages and lack of tracing slow down debugging | Consistent error format, distributed tracing (OpenTelemetry) |

### SPPU Exam Tip
> "Challenges of Cloud API" is a 5-mark favourite. List **5 challenges** (security, rate limiting, latency, versioning, cost) with **one mitigation each**. Security is almost always the strongest first point.

---

## 1.7 Benefits of Cloud API

| Benefit | Description |
|---------|-------------|
| **Faster Time-to-Market** | Developers consume ready-made cloud capabilities instead of building infrastructure |
| **Scalability** | APIs ride on elastic cloud platforms — handle growth automatically |
| **Cost Efficiency** | Pay-per-use model — no upfront hardware, scale spend with usage |
| **Security & Compliance** | Cloud providers invest heavily in security, encryption, certifications |
| **Integration & Interoperability** | Standard protocols (REST/GraphQL) connect disparate systems easily |
| **Reusability** | One API can be reused across web, mobile, IoT, and partner applications |
| **Automation** | Enables IaC, CI/CD, and automated workflows via programmable interfaces |
| **Innovation & Ecosystem** | Third parties build new products on top of open cloud APIs (platform effect) |
| **Global Reach** | APIs are accessible worldwide via regional/edge endpoints |
| **Monitoring & Analytics** | Built-in observability of usage, latency, and errors |

### Cloud API Value Chain

```
Business Idea
    │
    ▼
Build once on Cloud API  ──► Reuse across platforms (Web, Mobile, IoT, Partners)
    │
    ├──► Scale automatically (elastic, pay-per-use)
    ├──► Secure by default (OAuth, encryption, IAM)
    └──► Monitor & improve (analytics, versioning)
    │
    ▼
Faster delivery + lower cost + larger ecosystem
```

### SPPU Exam Tip
> "Benefits of Cloud API" pairs well with 1.1 and 1.7 — compare **with vs without** cloud APIs: without = buy servers, manage infra, build everything; with = call an endpoint, get a service.

---

## Sample 5-Mark Questions (SPPU Pattern)

1. **Define Cloud API. Explain the role of Cloud API in cloud computing.**
   - *Ans*: Definition, Client→Gateway→Services diagram, 5 roles (abstraction, on-demand, integration, automation, pay-per-use).

2. **List and explain the characteristics of Cloud API.**
   - *Ans*: Table of 6 characteristics — scalability, on-demand, statelessness, security, multi-tenancy, pay-per-use.

3. **Compare RESTful, SOAP, GraphQL, and WebSocket APIs.**
   - *Ans*: Comparison table (protocol, format, state, use case) + 2 lines per type.

4. **Explain the API lifecycle management with a neat diagram.**
   - *Ans*: Lifecycle diagram, 1 line per phase, mention tools (Swagger, AWS API Gateway, Apigee).

5. **Explain various HTTP request methods and status codes used in cloud APIs.**
   - *Ans*: Verbs table (GET/POST/PUT/PATCH/DELETE) + status code table (200/201/400/401/404/429/500).

6. **Discuss the challenges and benefits of Cloud API.**
   - *Ans*: 5 challenges with mitigations, 5 benefits, conclusion.

---

## Summary

- A **Cloud API** exposes cloud services programmatically over the internet, hiding infrastructure complexity.
- Its **role** includes abstraction, on-demand access, integration, automation, pay-per-use, and ecosystem building.
- **Characteristics**: scalable, on-demand, stateless, secure, multi-tenant, metered, versioned.
- **Types**: REST (resources + HTTP verbs), SOAP (XML + WSDL, enterprise), GraphQL (query language, precise data), WebSockets (full-duplex real-time).
- **Lifecycle**: Plan → Design → Develop → Test → Publish → Monitor → Version → Retire.
- **Methods**: GET/POST/PUT/PATCH/DELETE with meaningful status codes.
- **Challenges**: security, rate limiting, latency, versioning, cost. **Benefits**: agility, scalability, cost efficiency, innovation.

---

## Key Terms

| Term | Definition |
|------|------------|
| API | Contract that defines how software components communicate |
| Cloud API | API hosted and delivered via a cloud platform |
| REST | Resource-based API style using HTTP verbs and JSON |
| SOAP | XML-based protocol with WSDL contract, strong for enterprise |
| GraphQL | Query language letting clients request exact fields |
| WebSocket | Persistent full-duplex connection for real-time communication |
| WSDL | Web Service Description Language (SOAP contract) |
| OpenAPI/Swagger | Machine-readable API specification standard |
| API Gateway | Entry point handling auth, routing, rate limiting |
| Idempotent | Operation that gives same result when repeated |
| Safe Method | HTTP method that does not modify a resource |
| Rate Limiting | Restricting the number of API calls per consumer |
| SLA | Service Level Agreement — guaranteed availability |
