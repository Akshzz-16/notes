# Unit 2: Footprinting and Scanning — Detailed Notes (SPPU Exam-Oriented)

---

## 2.1 Understanding Footprinting & Reconnaissance

### Definition
**Footprinting** (also called **Reconnaissance**) is the **first phase** of ethical hacking. It involves gathering as much information as possible about a target system, network, or organization before launching an actual attack.

### Goal
To create a **complete profile** of the target — including IP addresses, domain names, network topology, operating systems, services, employees, email addresses, and physical locations.

### Types of Reconnaissance

| Type | Direct Contact | Detectable | Examples |
|------|----------------|------------|----------|
| **Passive Reconnaissance** | No — target has no idea information is being gathered | Very low | OSINT, WHOIS, search engines, social media, job postings, public records |
| **Active Reconnaissance** | Yes — involves interacting with the target's systems | High (can be logged) | Ping sweeps, DNS queries, port scans, traceroute |

### Information Collected During Footprinting

| Category | Examples |
|----------|----------|
| **Network Information** | IP ranges, DNS servers, domain names, subdomains |
| **System Information** | OS details, running services, open ports |
| **Organizational Information** | Employee names, email addresses, phone numbers, office locations |
| **Technology Stack** | Web servers, frameworks, CMS, database types |
| **Security Controls** | Firewalls, IDS/IPS, WAF, proxies |

### Footprinting Techniques Summary

| Technique | Type | Tools / Methods |
|-----------|------|----------------|
| WHOIS lookup | Passive | whois command, whois.domaintools.com |
| DNS enumeration | Passive/Active | nslookup, dig, dnsrecon, dnsenum |
| Search engines | Passive | Google dorking, Bing, Shodan |
| Social media | Passive | LinkedIn, Facebook, Twitter |
| Job postings | Passive | Glassdoor, Naukri, job descriptions revealing tech stack |
| Email tracking | Passive | Email headers, Read Receipts (if enabled) |
| Web archives | Passive | Wayback Machine (archive.org) |
| Mirroring websites | Passive | HTTrack, wget |
| Traceroute | Active | tracert (Windows), traceroute (Linux) |
| Ping sweeps | Active | fping, nmap -sn |

### SPPU Exam Tip
> For "Define footprinting and explain passive vs active reconnaissance", draw a **comparison table** with columns: Type, Interaction, Detection Risk, Examples. Mention **at least 3 tools** for each type.

---

## 2.2 Gathering Information using WHOIS, nslookup

### WHOIS

**Definition**: WHOIS is a query/response protocol used to retrieve registration information about domain names, IP address blocks, and autonomous systems.

**Usage**:
```bash
# Linux / Mac
whois example.com

# Windows (download required from Microsoft or use web)
whois.exe example.com
```

**Information Obtained from WHOIS**:
| Field | Description |
|-------|-------------|
| **Domain Name** | The registered domain |
| **Registrar** | Company where domain was registered (GoDaddy, Namecheap, etc.) |
| **Registrant Name** | Owner's name (may be hidden if privacy protection is enabled) |
| **Organization** | Company that owns the domain |
| **Address, City, State, Zip** | Physical address of registrant |
| **Email, Phone** | Contact details |
| **Name Servers (NS)** | DNS servers for the domain |
| **Creation / Expiry Date** | Domain registration timeline |
| **DNSSEC** | Whether DNS Security Extensions are enabled |

**WHOIS Privacy (Whois Guard)**:
- Many registrars offer **WHOIS privacy protection** (masking registrant details).
- In such cases, the registrar's proxy information appears instead.

**Web-based WHOIS Tools**:
- whois.domaintools.com
- whois.icann.org
- www.whois.com

### nslookup

**Definition**: nslookup (Name Server Lookup) is a DNS query tool used to obtain domain name-to-IP mapping, mail server records, and other DNS information.

**Usage Modes**:

| Mode | Description | Example |
|------|-------------|---------|
| **Non-Interactive** | Single query | `nslookup example.com` |
| **Interactive** | Multiple queries in a session | Type `nslookup` then enter commands |

**Common nslookup Queries**:

```bash
# Basic lookup (A record)
nslookup example.com

# Query specific record type
nslookup -type=MX example.com      # Mail exchange records
nslookup -type=NS example.com      # Name server records
nslookup -type=TXT example.com     # TXT records (SPF, DKIM)
nslookup -type=AAAA example.com    # IPv6 address
nslookup -type=CNAME example.com   # Canonical name (aliases)
nslookup -type=SOA example.com     # Start of Authority

# Reverse DNS lookup (IP to domain)
nslookup 8.8.8.8

# Use specific DNS server
nslookup example.com 8.8.8.8
```

**DNS Record Types**:

| Record | Full Name | Purpose |
|--------|-----------|---------|
| **A** | Address | Maps domain to IPv4 address |
| **AAAA** | IPv6 Address | Maps domain to IPv6 address |
| **MX** | Mail Exchange | Mail server(s) for the domain |
| **NS** | Name Server | Authoritative DNS servers |
| **CNAME** | Canonical Name | Alias of one domain to another |
| **TXT** | Text | Arbitrary text (SPF, DKIM, verification) |
| **SOA** | Start of Authority | Primary DNS server, admin email, serial |
| **PTR** | Pointer | Reverse DNS (IP to domain) |

### dig (Alternative to nslookup)

**dig** (Domain Information Groper) is a more powerful DNS tool available on Linux/Mac.

```bash
dig example.com
dig example.com MX
dig example.com ANY
dig -x 8.8.8.8    # Reverse lookup
```

### SPPU Exam Tip
> For "Explain how WHOIS and nslookup are used for footprinting", show **actual command outputs** (or describe what fields they return). Mention that **WHOIS gives registrant details** while **nslookup gives DNS/mapping information**.

---

## 2.3 Using Nmap for Network Scanning

### Introduction
**Nmap** (Network Mapper) is the most widely used **open-source** network scanning tool. It is used to discover hosts, open ports, running services, OS details, and more.

### Nmap Installation
```bash
# Linux (Kali / Ubuntu)
sudo apt install nmap

# Windows
# Download from https://nmap.org/download.html
```

### Nmap Scan Types (Techniques)

| Scan Type | Command | Description | Requires Raw Sockets | Detection Risk |
|-----------|---------|-------------|---------------------|----------------|
| **TCP SYN Scan (Stealth)** | `-sS` | Sends SYN, waits for SYN-ACK; does NOT complete handshake (half-open) | Yes | Low |
| **TCP Connect Scan** | `-sT` | Completes full TCP 3-way handshake | No | High |
| **UDP Scan** | `-sU` | Sends UDP packets to ports | Yes | Medium |
| **FIN Scan** | `-sF` | Sends FIN flag (closed ports reply with RST) | Yes | Very Low |
| **Xmas Scan** | `-sX` | Sends FIN+PSH+URG flags (like a Christmas tree) | Yes | Very Low |
| **NULL Scan** | `-sN` | Sends packet with no flags set | Yes | Very Low |
| **ACK Scan** | `-sA` | Sends ACK flag (maps firewall rules, not open/closed) | Yes | Low |
| **Window Scan** | `-sW` | Similar to ACK but uses window field to determine open/closed | Yes | Low |
| **Ping Sweep** | `-sn` | Host discovery only (no port scan) | No | Low |

### TCP 3-Way Handshake (Important for Understanding Scans)
```
Client → SYN → Server
Client ← SYN-ACK ← Server
Client → ACK → Server    (Connection established)
```

- **SYN Scan** sends SYN, receives SYN-ACK, sends **RST** (never completes handshake).
- **Connect Scan** sends SYN, receives SYN-ACK, sends **ACK** (completes handshake).

### Basic Nmap Commands

```bash
# Scan a single host
nmap 192.168.1.1

# Scan multiple hosts
nmap 192.168.1.1-100
nmap 192.168.1.0/24

# Scan from a file
nmap -iL targets.txt

# Exclude hosts
nmap 192.168.1.0/24 --exclude 192.168.1.10

# Scan specific ports
nmap -p 22,80,443 192.168.1.1
nmap -p 1-1000 192.168.1.1
nmap -p- 192.168.1.1           # All 65535 ports

# Fast scan (100 most common ports)
nmap -F 192.168.1.1

# Host discovery (ping sweep)
nmap -sn 192.168.1.0/24
```

### Nmap Output Formats

| Option | Format | Use Case |
|--------|--------|----------|
| `-oN output.txt` | Normal | Readable log |
| `-oX output.xml` | XML | Import into tools (e.g., Metasploit) |
| `-oG output.gnmap` | Grepable | Parse with grep/awk |
| `-oA basename` | All formats | Normal + XML + Grepable |

### Nmap Timing Templates (Speed)

| Template | Name | Speed | Detection Risk |
|----------|------|-------|----------------|
| `-T0` | Paranoid | Very slow | Very Low |
| `-T1` | Sneaky | Slow | Low |
| `-T2` | Polite | Moderate | Medium |
| `-T3` | Normal | Normal (default) | Medium |
| `-T4` | Aggressive | Fast | High |
| `-T5` | Insane | Very fast | Very High |

### SPPU Exam Tip
> For "Explain Nmap and its scan types", list **at least 5 scan types** with their command flags, and explain the **difference between SYN scan and Connect scan** (half-open vs full handshake).

---

## 2.4 Discovering Open Ports & Services on a Target Machine

### Port States in Nmap

| State | Meaning |
|-------|---------|
| **open** | Application is actively accepting connections on this port |
| **closed** | Port is accessible but no application is listening |
| **filtered** | Firewall or filter is blocking the probe (no response) |
| **unfiltered** | Port is accessible but Nmap cannot determine open/closed (ACK scan) |
| **open\|filtered** | Nmap cannot distinguish open from filtered (UDP, FIN, Xmas, NULL scans) |
| **closed\|filtered** | Nmap cannot distinguish closed from filtered (IP ID idle scan) |

### Port Categories

| Range | Category | Examples |
|-------|----------|----------|
| **0–1023** | Well-Known Ports | HTTP (80), HTTPS (443), SSH (22), FTP (21) |
| **1024–49151** | Registered Ports | MySQL (3306), RDP (3389), Tomcat (8080) |
| **49152–65535** | Dynamic / Private Ports | Ephemeral ports used by clients |

### Service Discovery with Nmap

```bash
# Service version detection (-sV)
nmap -sV 192.168.1.1

# Service detection with intensity (0-9, default 7)
nmap -sV --version-intensity 5 192.168.1.1

# Light version detection (faster)
nmap -sV --version-light 192.168.1.1
```

**What -sV Reveals**:
- Service name (HTTP, SSH, MySQL, etc.)
- Protocol (TCP/UDP)
- Version number (Apache 2.4.41, OpenSSH 8.2p1, etc.)
- Additional info (tunnel, SSL/TLS status)

### Aggressive Scan
```bash
# -A enables: OS detection, version detection, script scanning, traceroute
nmap -A 192.168.1.1
```

### Default Script Scan
```bash
# -sC runs default set of NSE scripts
nmap -sC 192.168.1.1

# Equivalent to --script=default
```

### Understanding Scan Output
```
PORT     STATE    SERVICE    VERSION
22/tcp   open     ssh        OpenSSH 7.6p1 Ubuntu 4ubuntu0.3
80/tcp   open     http       Apache httpd 2.4.29
443/tcp  open     ssl/http   Apache httpd 2.4.29
3306/tcp filtered mysql
```

**Interpretation**:
- Host is likely **Ubuntu Linux** (from SSH version).
- Running **Apache 2.4.29** web server on ports 80 and 443.
- **MySQL** is filtered — firewall blocking port 3306.

### NSE (Nmap Scripting Engine)

Nmap has built-in scripts for vulnerability detection, enumeration, and exploitation.

```bash
# Run a specific script
nmap --script http-enum 192.168.1.1

# Run all vulnerability scripts
nmap --script vuln 192.168.1.1

# Run scripts by category
nmap --script "safe" 192.168.1.1
nmap --script "default or safe" 192.168.1.1
```

**NSE Script Categories**:

| Category | Purpose |
|----------|---------|
| auth | Authentication bypass / credential testing |
| broadcast | Host discovery via broadcast protocols |
| brute | Brute-force attacks |
| default | Default set (safe + informative) |
| discovery | Service/network discovery |
| dos | Denial of Service (use carefully) |
| exploit | Exploitation of vulnerabilities |
| external | External data sources (e.g., whois) |
| fuzzer | Fuzzing input fields |
| intrusive | May crash or disrupt services |
| malware | Malware detection |
| safe | Non-disruptive scripts |
| version | Version detection |
| vuln | Vulnerability detection |

### SPPU Exam Tip
> For "How to discover open ports and services using Nmap", explain **-sS (SYN scan)** for port discovery, **-sV (version detection)** for service identification, and **-sC (default scripts)** for additional enumeration. Show a sample output.

---

## 2.5 Detecting OS and Service Version using Nmap

### OS Detection (-O)

```bash
# Basic OS detection (requires root/admin)
nmap -O 192.168.1.1

# OS detection with version detection
nmap -O -sV 192.168.1.1

# Aggressive OS detection (more probes)
nmap -O --osscan-guess 192.168.1.1
```

**How OS Detection Works**:
- Nmap sends **TCP/IP stack fingerprinting probes**.
- It analyzes how the target's TCP/IP stack responds to unusual packets.
- Different OSes have different stack implementations (TTL values, window sizes, DF flag behavior).
- Nmap compares the responses against its **nmap-os-db** database.

**Sample OS Detection Output**:
```
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.6
Network Distance: 2 hops
```

**OS Detection Accuracy**:
- **Accuracy**: ~90% when target is a single OS.
- **Lower accuracy** when:
  - Firewall is modifying packets.
  - Target uses a custom/rare TCP/IP stack.
  - Load balancers or proxies are in between.
  - Host is behind NAT.

### Service Version Detection (-sV)

```bash
# Basic version detection
nmap -sV 192.168.1.1

# Version detection with verbosity
nmap -sV -v 192.168.1.1

# Light version detection (faster)
nmap -sV --version-light 192.168.1.1

# Heavy version detection (more thorough)
nmap -sV --version-all 192.168.1.1
```

**Sample Version Output**:
```
PORT     STATE SERVICE     VERSION
80/tcp   open  http        Apache httpd 2.4.41 ((Ubuntu))
443/tcp  open  ssl/http    Apache httpd 2.4.41 ((Ubuntu))
3306/tcp open  mysql       MySQL 8.0.25-0ubuntu0.20.04.1
```

**What Version Detection Reveals**:
- Service name and type (http, ssh, mysql)
- Version number (2.4.41, 8.0.25)
- Protocol (SSL/TLS if applicable)
- Additional details in parentheses (OS, hostname, service-specific info)

### Combined Scan Examples

```bash
# Full scan: OS + version + scripts + traceroute
nmap -A 192.168.1.1

# Equivalent to:
nmap -O -sV -sC -traceroute 192.168.1.1

# Quick OS + service detection (T4 for speed)
nmap -T4 -O -sV 192.168.1.1
```

### Bypassing Firewalls with Nmap

```bash
# Fragment packets (harder for firewalls to detect)
nmap -f 192.168.1.1

# Use decoy addresses (hide your real IP)
nmap -D RND:10 192.168.1.1

# Spoof source IP (requires monitoring of responses)
nmap -S 10.0.0.1 192.168.1.1

# Use specific source port (some firewalls allow port 53, 80, 443)
nmap --source-port 53 192.168.1.1

# Randomize scan order
nmap --randomize-hosts 192.168.1.0/24

# Slow scan to avoid IDS detection
nmap -T1 192.168.1.1
```

### SPPU Exam Tip
> For "Explain OS and Service version detection with Nmap", write the **commands (-O and -sV)**, explain **how they work** (TCP/IP fingerprinting for OS, probe-response matching for services), and show **sample outputs**. Compare **-A (aggressive)** vs standalone flags.

---

## 2.6 Footprinting Websites and Servers using Google Dorking

### Definition
**Google Dorking** (also called **Google Hacking**) is the technique of using advanced Google search operators to find sensitive information exposed on websites — such as login pages, exposed files, database dumps, configuration files, and vulnerable applications.

### Google Search Operators

| Operator | Syntax | Purpose | Example |
|----------|--------|---------|---------|
| **intitle:** | `intitle:keyword` | Find pages with keyword in title | `intitle:"index of"` |
| **inurl:** | `inurl:keyword` | Find pages with keyword in URL | `inurl:admin` |
| **intext:** | `intext:keyword` | Find pages containing keyword in body | `intext:"password"` |
| **filetype:** | `filetype:ext` | Search for specific file types | `filetype:pdf` |
| **site:** | `site:domain` | Restrict search to specific domain | `site:example.com` |
| **link:** | `link:url` | Find pages linking to a URL | `link:example.com` |
| **cache:** | `cache:url` | View cached version of a page | `cache:example.com` |
| **related:** | `related:url` | Find similar pages | `related:example.com` |
| **info:** | `info:url` | Get summary info about a page | `info:example.com` |
| **allintitle:** | `allintitle:a b` | All words in title | `allintitle:admin login` |
| **allinurl:** | `allinurl:a b` | All words in URL | `allinurl:admin login` |
| **\*** | `keyword * keyword` | Wildcard (any word) | `"login * password"` |
| **\|** | `word1 \| word2` | OR operator | `"admin \| administrator"` |
| **" "** | `"exact phrase"` | Exact phrase match | `"Welcome to"` |
| **-** | `-keyword` | Exclude keyword | `site:example.com -www` |
| **..** | `start..end` | Number range | `2020..2025` |

### Common Google Dorks for Security Testing

#### Finding Login Pages
```
intitle:"login" site:example.com
inurl:admin intitle:login
intitle:"admin panel"
inurl:wp-admin
```

#### Finding Exposed Files
```
filetype:xml config
filetype:sql "insert into"
filetype:log "password"
filetype:env "DB_PASSWORD"
filetype:bak "password"
filetype:csv "username"
```

#### Finding Directory Listings
```
intitle:"index of" site:example.com
intitle:"index of /" "parent directory"
intitle:"index of" "etc/passwd"
intitle:"index of" "backup"
```

#### Finding Vulnerable Pages
```
inurl:"id=" site:example.com       # SQL injection potential
inurl:"page=" site:example.com     # LFI/RFI potential
inurl:"search=" site:example.com   # XSS potential
intext:"error" "Warning" site:example.com
```

#### Finding Sensitive Information
```
"BEGIN RSA PRIVATE KEY" filetype:key
"-----BEGIN CERTIFICATE-----" filetype:pem
"DB_PASSWORD" filetype:env
"password" filetype:xls
"ssn" filetype:xls
"credit card" filetype:csv
```

#### Finding Network Devices
```
intitle:"web admin" "linksys"
intitle:"router" "admin"
inurl:"cgi-bin" filetype:cgi
intitle:"camera" "live view"
```

#### Finding IoT / Exposed Panels
```
intitle:"webcamXP"
intitle:"webcam 7"
inurl:"view/view.shtml"
intitle:"live view / -axis"
```

### Google Hacking Database (GHDB)
- Maintained by **Exploit-DB** (offensive-security.com).
- Contains thousands of pre-built dorks categorized by type:
  - Footholds (login pages, admin panels)
  - Files containing passwords
  - Sensitive directories
  - Vulnerable servers
  - Error messages
  - Network devices
  - Web server detection

### Defending Against Google Dorking
- Use **robots.txt** to block sensitive directories.
- Implement **proper access controls** (don't rely on security through obscurity).
- **Disable directory listing** on web servers.
- **Remove sensitive metadata** from uploaded documents.
- **Mask error messages** to avoid information leakage.
- Use **Web Application Firewall (WAF)** to block suspicious queries.

### SPPU Exam Tip
> For "What is Google Dorking? Explain with examples", provide the **definition**, list **at least 8 operators** with syntax and examples, and show **3 real-world dorks** (e.g., finding login pages, password files, directory listings).

---

## 2.7 Shodan: Introduction and Basic Queries

### What is Shodan?
**Shodan** is a search engine for **internet-connected devices**. Unlike Google (which indexes web pages), Shodan indexes **banners** returned by devices and services — including webcams, routers, servers, SCADA systems, IoT devices, and industrial control systems.

### How Shodan Works
1. Shodan constantly scans the **entire IPv4 address space**.
2. It connects to various ports and collects **banner information** (service name, version, location, response headers).
3. This data is indexed and made searchable through the Shodan website and API.

### Information Shodan Returns

| Field | Description |
|-------|-------------|
| **IP Address** | Public IP of the device |
| **Port** | Open port that was scanned |
| **Service** | Service running (HTTP, SSH, FTP, etc.) |
| **Banner** | Full banner response (version, server info, etc.) |
| **Location** | Country, city, latitude, longitude |
| **Organization** | ISP or organization owning the IP |
| **ASN** | Autonomous System Number |
| **Hostnames** | DNS hostnames associated with the IP |
| **OS** | Operating system (if detectable) |

### Basic Shodan Search Filters

| Filter | Description | Example |
|--------|-------------|---------|
| **port:** | Filter by port number | `port:22` |
| **country:** | Filter by 2-letter country code | `country:IN` |
| **city:** | Filter by city name | `city:"Mumbai"` |
| **org:** | Filter by organization | `org:"Google"` |
| **hostname:** | Filter by hostname | `hostname:example.com` |
| **os:** | Filter by operating system | `os:Windows` |
| **product:** | Filter by product/service | `product:Apache` |
| **version:** | Filter by version | `version:2.4.41` |
| **before/after:** | Filter by date | `before:2024-01-01` |
| **net:** | Filter by IP range (CIDR) | `net:192.168.1.0/24` |
| **has_screenshot:** | Devices with screenshot available | `has_screenshot:true` |
| **vuln:** | Devices with specific CVE | `vuln:CVE-2021-41773` |

### Sample Shodan Queries

```bash
# Find web servers in India
country:IN port:80 product:Apache

# Find open SSH servers in Mumbai
city:Mumbai port:22

# Find Windows servers (may have other exposed services)
os:Windows port:3389

# Find unsecured webcams
"webcamXP" country:IN
"webcam 7" country:IN

# Find MongoDB databases without authentication
product:MongoDB port:27017

# Find vulnerable Apache servers
"Apache/2.4.49" port:80
vuln:CVE-2021-41773

# Find SCADA / Industrial systems
"SCADA" country:IN
"Modbus" port:502

# Find open FTP servers (potentially anonymous)
port:21 "220" "vsFTPd"

# Find Tesla Powerwall (energy storage systems)
"Tesla Powerwall" port:80

# Find devices with default credentials
"default password" port:23

# Combine filters
port:22 country:IN os:Linux -org:"Amazon" -org:"Google"
```

### Defending Against Shodan
- **Close unnecessary ports** — if it's not needed, don't expose it to the internet.
- **Change default banners** — modify service banners to not reveal version info.
- **Use VPNs or firewalls** — restrict access by IP whitelisting.
- **Change default credentials** — always set strong, unique passwords.
- **Disable unused services** — reduce attack surface.

### Shodan vs Google Dorking

| Aspect | Google Dorking | Shodan |
|--------|---------------|--------|
| **What it searches** | Web page content | Device/service banners |
| **Scope** | Web (HTTP/HTTPS) | All internet protocols (TCP/UDP) |
| **Typical targets** | Websites, files, login pages | Servers, IoT, cameras, routers, SCADA |
| **Information** | Page title, content, file metadata | IP, port, banner, location, organization |
| **Use case** | Finding web vulnerabilities, exposed files | Finding exposed devices, vulnerable services |

### SPPU Exam Tip
> For "Explain Shodan and its use in footprinting", define Shodan, explain **how it differs from Google**, list **5 filters** with examples, and give **2 real-world query examples** (e.g., finding webcams or open SSH servers in India).

---

## 2.8 Case Study: Footprinting & Reconnaissance

### Scenario
A penetration tester has been assigned to perform **external reconnaissance** on a target organization, **ExampleCorp Pvt. Ltd.** (examplecorp.com). The goal is to gather as much information as possible **without triggering any alarms**.

### Phase 1: Passive Reconnaissance

#### Step 1: WHOIS Lookup
```bash
whois examplecorp.com
```
**Findings**:
- Registrar: GoDaddy
- Created: 2015-06-15
- Name Servers: ns1.examplecorp.com, ns2.examplecorp.com
- Registrant: ExampleCorp Pvt. Ltd., Mumbai, Maharashtra
- Email: admin@examplecorp.com (privacy disabled)

#### Step 2: DNS Enumeration with nslookup
```bash
nslookup examplecorp.com
```
**Findings**:
- A record: 203.0.113.50 (public IP)

```bash
nslookup -type=MX examplecorp.com
```
**Findings**:
- Mail handled by mail.examplecorp.com (priority 10)
- Mail handled by backupmail.examplecorp.com (priority 20)

```bash
nslookup -type=NS examplecorp.com
```
**Findings**:
- ns1.examplecorp.com
- ns2.examplecorp.com

```bash
nslookup -type=TXT examplecorp.com
```
**Findings**:
- "v=spf1 include:_spf.google.com ~all" (using Google Workspace for email)

#### Step 3: Subdomain Enumeration
Using theHarvester or Sublist3r:
```bash
theHarvester -d examplecorp.com -l 100 -b google
```
**Findings**:
- mail.examplecorp.com (203.0.113.51)
- www.examplecorp.com (203.0.113.50)
- blog.examplecorp.com (203.0.113.52)
- dev.examplecorp.com (203.0.113.53)
- portal.examplecorp.com (203.0.113.54)

#### Step 4: Google Dorking
```
site:examplecorp.com filetype:pdf
site:examplecorp.com intitle:"index of"
site:examplecorp.com inurl:admin
site:examplecorp.com inurl:backup
```
**Findings**:
- PDFs with employee names and email addresses.
- Cached version of /admin panel (accessible via Wayback Machine).
- Exposed backup directory: https://dev.examplecorp.com/backup/ (index listing enabled).

#### Step 5: Shodan Search
```
org:"ExampleCorp Pvt. Ltd."
port:22 country:IN org:"ExampleCorp"
```
**Findings**:
- 203.0.113.50: OpenSSH 7.6p1 (Ubuntu Linux)
- 203.0.113.51: Apache httpd 2.4.29 (Ubuntu) — port 80, 443
- 203.0.113.53: Apache Tomcat 9.0.31 — port 8080
- 203.0.113.52: WordPress 5.8 — detected from HTTP banner

#### Step 6: Social Media & Job Portals
- **LinkedIn**: Found IT team members (system admin, network engineer, web developer).
- **Naukri/Indeed**: Job postings reveal tech stack — "Experience with AWS, Docker, Kubernetes, Python, Django, PostgreSQL."
- **Glassdoor**: Employee reviews mention "using Jira for project management, Slack for communication."

### Phase 2: Active Reconnaissance

#### Step 7: Ping Sweep
```bash
nmap -sn 203.0.113.48/28
```
**Hosts discovered**:
- 203.0.113.49 (up)
- 203.0.113.50 (up)
- 203.0.113.51 (up)
- 203.0.113.52 (up)
- 203.0.113.53 (up)
- 203.0.113.54 (up)
- 203.0.113.62 (up — possibly gateway)

#### Step 8: Port Scanning
```bash
nmap -sS -sV -O 203.0.113.50-54
```
**Findings**:

| Host | Open Ports (Key) | Services | OS |
|------|-----------------|----------|----|
| 203.0.113.50 | 22, 80, 443 | SSH, Apache HTTP/HTTPS | Ubuntu Linux |
| 203.0.113.51 | 25, 80, 443, 587 | SMTP, Apache, Submission | Ubuntu Linux (Mail server) |
| 203.0.113.52 | 22, 80 | SSH, Apache (WordPress) | Ubuntu Linux |
| 203.0.113.53 | 22, 8080 | SSH, Apache Tomcat | Ubuntu Linux (Dev server) |
| 203.0.113.54 | 443, 8443 | Custom app on HTTPS | Ubuntu Linux (Portal) |

#### Step 9: Banner Grabbing
```bash
nmap -sV --script=banner 203.0.113.50-54
```
**Key findings**:
- WordPress 5.8 on blog.examplecorp.com (known vulnerabilities — CVE-2021-24406, etc.)
- Apache Tomcat 9.0.31 on dev.examplecorp.com (default manager interface accessible?)
- OpenSSH 7.6p1 (version-specific vulnerabilities)

#### Step 10: Vulnerability Scanning
```bash
nmap --script vuln 203.0.113.52
```
**Findings on blog.examplecorp.com**:
- WordPress version identified as 5.8.
- Multiple plugin vulnerabilities (from NSE scripts).
- Directory listing enabled on /wp-content/uploads/.

### Attack Surface Summary

| Asset | IP | Exposure | Risk Level |
|-------|----|----------|------------|
| Web server | 203.0.113.50 | Apache 2.4.29 | Medium |
| Mail server | 203.0.113.51 | SMTP exposed | Medium |
| Blog (WordPress) | 203.0.113.52 | WordPress 5.8 + outdated plugins | High |
| Dev server | 203.0.113.53 | Tomcat 9.0.31 + exposed /backup/ | Critical |
| Portal | 203.0.113.54 | Custom application | Medium |
| Employee info | — | Exposed in PDFs | Low |

### Recommendations
1. Disable directory listing on dev.examplecorp.com.
2. Update WordPress core, themes, and plugins.
3. Remove exposed backup directory or password-protect it.
4. Restrict SSH access (use key-based auth, disable root login).
5. Remove sensitive metadata from public PDFs.
6. Implement WAF and rate-limiting on all public-facing services.

### SPPU Exam Tip
> For "Case study on footprinting and reconnaissance", select a **fictional company** and walk through each **tool and technique** step-by-step. Cover WHOIS → DNS → Subdomain → Google Dorking → Shodan → Nmap scanning → Vulnerability identification. End with a **summary table** and **recommendations**.

---

## Quick Revision Summary

### Footprinting vs Scanning

| Aspect | Footprinting (Reconnaissance) | Scanning |
|--------|-------------------------------|----------|
| **Phase** | Phase 1 of Ethical Hacking | Phase 2 of Ethical Hacking |
| **Goal** | Gather information about target | Identify live hosts, open ports, services |
| **Nature** | Mostly passive | Mostly active |
| **Tools** | WHOIS, nslookup, Google Dorking, Shodan | Nmap, masscan, unicornscan |
| **Risk** | Low (passive) to Medium (active) | Medium to High |

### Common Ports to Memorize (For SPPU)

| Port | Service | Common Vulnerabilities |
|------|---------|----------------------|
| 21 | FTP | Anonymous access, weak credentials |
| 22 | SSH | Weak passwords, outdated versions |
| 23 | Telnet | Unencrypted, default credentials |
| 25 | SMTP | Open relay, spam abuse |
| 53 | DNS | Zone transfer misconfiguration |
| 80 | HTTP | Web app vulnerabilities |
| 110 | POP3 | Unencrypted credentials |
| 143 | IMAP | Weak authentication |
| 443 | HTTPS | SSL/TLS misconfig, web app flaws |
| 445 | SMB | EternalBlue (MS17-010) |
| 1433 | MSSQL | Weak SA password |
| 3306 | MySQL | Weak root password |
| 3389 | RDP | BlueKeep (CVE-2019-0708) |
| 8080 | HTTP-Alt | Tomcat default manager |

### Key Commands Cheatsheet

```
whois example.com              # WHOIS lookup
nslookup example.com           # DNS lookup
dig example.com                # Advanced DNS lookup

nmap -sS 192.168.1.1           # SYN scan
nmap -sT 192.168.1.1           # Connect scan
nmap -sU 192.168.1.1           # UDP scan
nmap -sV 192.168.1.1           # Version detection
nmap -O 192.168.1.1            # OS detection
nmap -A 192.168.1.1            # Aggressive scan
nmap -sn 192.168.1.0/24        # Ping sweep
nmap -p 22,80,443 host         # Port range
nmap --script vuln host        # Vulnerability scan
nmap -sC host                  # Default scripts
nmap -f host                   # Fragment packets
nmap -D RND:10 host            # Decoy scan

intitle:"index of" site:com    # Google dork
port:22 country:IN             # Shodan filter
```

### Sample 5-Mark Questions (SPPU Pattern)

1. **Define footprinting. Differentiate between passive and active reconnaissance.**
2. **Explain WHOIS and nslookup with examples. How are they used for information gathering?**
3. **Explain different Nmap scan types. Compare SYN scan and Connect scan.**
4. **How would you discover open ports and services on a target machine using Nmap?**
5. **Explain OS detection and service version detection using Nmap with commands.**
6. **What is Google Dorking? Explain any 8 search operators with examples.**
7. **Explain how Shodan is used for footprinting. Write 5 filters with queries.**
8. **Write a case study on footprinting and reconnaissance for a target organization.**

---

### Mnemonic for Nmap Scan Types

> **"S**ome **T**eams **U**se **F**ancy **X**-ray **N**etwork **A**nalysis"

| Letter | Scan | Flag |
|--------|------|------|
| **S** | SYN Scan | `-sS` |
| **T** | TCP Connect | `-sT` |
| **U** | UDP Scan | `-sU` |
| **F** | FIN Scan | `-sF` |
| **X** | Xmas Scan | `-sX` |
| **N** | NULL Scan | `-sN` |
| **A** | ACK Scan | `-sA` |

### Mnemonic for Key Shodan Filters

> **"P**eople **C**an **O**ften **H**ave **V**ery **N**ice **P**hones"

| Letter | Filter |
|--------|--------|
| **P** | port |
| **C** | country |
| **O** | org |
| **H** | hostname |
| **V** | version |
| **N** | net |
| **P** | product (second P) |

---

## Real-World Case Studies for Exam

### Case Study 1: How Reconnaissance Enabled the Bangladesh Bank Heist (2016)
**The Incident**: Cybercriminals stole **$81 million** from Bangladesh Bank's account at the Federal Reserve Bank of New York. They attempted to steal $951 million but a typo in a transfer instruction alerted officials. It is one of the largest bank heists in history.

**Role of Footprinting / Reconnaissance**:
| Reconnaissance Technique | How the Attackers Used It |
|--------------------------|---------------------------|
| **Passive Recon (OSINT)** | Studied Bangladesh Bank's employees via LinkedIn, identified who had SWIFT access |
| **Email Footprinting** | Researched the bank's email format (firstname.lastname@bangladeshbank.org) |
| **Job Postings Analysis** | Saw job ads for SWIFT operators — understood the bank's software/hardware stack |
| **Social Media OSINT** | Identified employees who posted about work on Facebook/Twitter |
| **Active Recon (Port Scanning)** | After initial compromise via spear-phishing, scanned internal network for SWIFT servers |

**How Footprinting Enabled the Attack**:
1. Attackers used **passive reconnaissance** to learn Bangladesh Bank's organizational structure, key employees, and technology stack — all without touching a single bank system.
2. They **spear-phished** specific employees identified through OSINT — one click installed malware.
3. The malware performed **internal scanning** (active recon) to find the SWIFT messaging server.
4. Attackers **observed** SWIFT transaction patterns for weeks (maintaining access) to learn the format.
5. They submitted fraudulent transfer requests via SWIFT — five of 35 were successful before detection.

**Ethical Hacking Lesson**: A red team exercise including social engineering would have identified the OSINT exposure. Employee social media policies, security awareness training on phishing, and network segmentation would have prevented or limited the attack.

**Exam Tip**: The Bangladesh Bank heist shows "Why footprinting is the most important phase of ethical hacking" — passive reconnaissance alone enabled this sophisticated attack.

### Case Study 2: How Google Dorking Found Exposed U.S. Government Data
**The Incident**: In 2019, security researchers used **simple Google dorks** to find US government servers publicly exposing sensitive data — classified military manuals, employee PII (names, SSNs), network topology diagrams, VPN configs, and database backups.

**The Dorks Used**:
```
site:.gov filetype:xls "ssn"
site:.mil inurl:"cgi-bin" filetype:cgi
site:.gov intitle:"index of" "backup"
site:.gov inurl:"wp-config.php"
filetype:sql "insert into" site:.gov
site:.gov "password" filetype:csv
```

**Why This Happened**: Directory listing was enabled; backup files were in publicly accessible directories; robots.txt was missing; no authentication on sensitive directories; default credentials on admin panels.

**Exam Tip**: Quote "US govt servers found via Google dorks" to answer "Explain the real-world impact of Google Dorking."

### Case Study 3: Shodan Discovery of Exposed Tesla Systems
**The Incident**: In 2020, researchers used Shodan to find **Tesla's internal systems** exposed — a Kubernetes console (no password), S3 buckets, and internal Jira instances — all accessible from the public internet.

**The Shodan Queries**:
```
org:"Tesla" port:22
"Tesla" port:443 "Kubernetes"
org:"Tesla" "Jira"
org:"Tesla" "S3 bucket"
```

**Findings**: A Kubernetes dashboard without authentication (anyone could deploy containers on Tesla's infrastructure), an S3 bucket listing all Tesla firmware files (could be modified to push malicious firmware to vehicles), and internal communication tools accessible via default credentials.

**Exam Tip**: Tesla's Shodan exposures show that "No organization is immune to basic misconfigurations." Use this for Shodan-based footprinting questions.

### Case Study 4: Nmap Discovery in the Target Breach (2013)
**The Incident**: In the Target breach (110M records), forensic analysis revealed the attackers used **Nmap scans** extensively during post-compromise reconnaissance.

**What the Scans Revealed**: Target's internal network was a **single flat /8** — POS systems, corporate servers, and databases were all on the same subnet. Windows XP systems were still in use. Over 70,000 hosts were discoverable internally. Many systems had SMB (port 445) open with vulnerable versions.

**Ethical Hacking Lesson**: An internal penetration test simulating a post-compromise attacker would have discovered the flat network topology and led to **network segmentation**. An attacker who compromises ONE system should not be able to reach ALL systems.

**Exam Tip**: Use the Target breach's Nmap findings to answer "Why is network segmentation important?" in an exam.
