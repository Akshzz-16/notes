# Ethical Hacking — Detailed Notes (SPPU Exam-Oriented)

---

## 1.1 Definition and Overview of Ethical Hacking

### Definition
Ethical hacking is the **authorized, legal, and legitimate** attempt to bypass a system's security mechanisms to identify potential vulnerabilities and weaknesses. It is performed by **security professionals (white-hat hackers)** with the **explicit written permission** of the system owner.

### Key Characteristics
- **Legal & Authorized**: Written contract (Scope of Work, Rules of Engagement) must be signed.
- **Systematic Process**: Follows a structured methodology (5 phases).
- **Non-Destructive**: Findings are documented and reported, not exploited maliciously.
- **Improves Security Posture**: Helps organizations identify and remediate weaknesses before attackers exploit them.

### Scope of Ethical Hacking
- Network infrastructure (routers, switches, firewalls)
- Web applications & APIs
- Wireless networks
- Mobile applications
- Cloud infrastructure
- Social engineering (phishing simulations)
- Physical security (access controls)

### Why Organizations Need Ethical Hacking
- Proactive defense before real attackers strike
- Compliance requirements (PCI-DSS, HIPAA, ISO 27001)
- Regulatory mandates (RBI, SEBI guidelines in India)
- Protecting customer data & brand reputation
- Third-party risk assessment (vendor security evaluation)

---

## 1.2 History of Ethical Hacking

### Timeline Overview

| Era | Milestones |
|-----|-----------|
| **1960s–1970s** | **Phone Phreaking**: John Draper ("Captain Crunch") discovered a toy whistle (from Cap'n Crunch cereal) produced a 2600 Hz tone that could trick telephone switches into allowing free long-distance calls. This was the **earliest form of hacking**. |
| **1980s** | **Rise of Computer Hacking** |
| | **1983**: Kevin Poulsen (a.k.a. "Dark Dante") hacked ARPANET. |
| | **1986**: The **Computer Fraud and Abuse Act (CFAA)** was passed in the US — the first major anti-hacking law. |
| | **1988**: **Robert T. Morris Jr.** released the **Morris Worm**, the first internet worm, causing widespread damage. This led to the creation of **CERT/CC** (Computer Emergency Response Team Coordination Center). |
| **1990s** | **Formalization of Ethical Hacking** |
| | **1995**: **Dan Farmer & Wietse Venema** released **SATAN** (Security Administrator Tool for Analyzing Networks) — the first automated vulnerability scanning tool. |
| | **1999**: The term **"ethical hacking"** was coined by IBM executive **John Patrick**. |
| | **2000**: **EC-Council** launched the **Certified Ethical Hacker (CEH)** certification. |
| **2000s–Present** | **Modern Era** |
| | Bug bounty platforms (HackerOne 2012, Bugcrowd 2012) |
| | Metasploit Framework (open-source exploitation tool) |
| | Advanced persistent threats (APTs), ransomware, nation-state cyber warfare |
| | AI/ML in cybersecurity (both defense and offense) |

### Key Cases That Shaped Ethical Hacking
- **Kevin Mitnick** (1995): Most famous black-hat hacker; after arrest, became a security consultant.
- **Gary McKinnon** (2002): Hacked US military systems; extradition battle highlighted need for ethical hackers.
- **Edward Snowden** (2013): NSA contractor leaked classified info; raised debates on insider threats.

### SPPU Exam Tip
> If asked "Trace the evolution of ethical hacking", structure your answer era-wise with **one technique, one person, and one law/tool per era**.

---

## 1.3 Types of Hackers (Black Hat, White Hat, Grey Hat)

### Detailed Comparison Table

| Parameter | Black Hat | White Hat | Grey Hat |
|-----------|-----------|-----------|----------|
| **Permission** | No | Yes (written) | No |
| **Legality** | Illegal | Legal | Illegal (but not malicious) |
| **Intent** | Personal gain, damage, data theft, disruption | Improve security, protect assets | Curiosity, recognition, sometimes reward |
| **Methodology** | Exploit vulnerabilities stealthily | Follow structured pen-testing methodology | Hack first, inform later |
| **Disclosure** | No disclosure (sold on dark web) | Detailed confidential report | May disclose publicly (responsible or full) |
| **Example Case** | Kevin Mitnick (pre-arrest) | CEH-certified professionals | Adrian Lamo (hacked NY Times, then told them) |

### Other Important Hacker Categories (for SPPU)

| Type | Description | Example |
|------|-------------|---------|
| **Script Kiddie** | Inexperienced hacker using pre-made tools/scripts with little understanding of underlying concepts. | Downloading LOIC to DDoS a website |
| **Hacktivist** | Hacker driven by political, social, or ideological motives. | **Anonymous** (OpIndia, OpIsrael) |
| **State-Sponsored** | Hacker employed by a nation-state for espionage, sabotage, or cyber warfare. | **APT groups** (APT28/Fancy Bear — Russia, Lazarus Group — North Korea) |
| **Insider Threat** | Employee/contractor who uses their authorized access maliciously, either intentionally or accidentally. | Edward Snowden (NSA) |
| **Suicide Hacker** | Hacker who does not care about getting caught; may work without regard for consequences. | Rare — associated with hacktivism |
| **Cyber Terrorist** | Uses hacking to cause fear, panic, or physical disruption. | Attack on power grids, water systems |

### SPPU Exam Tip
> For "Compare types of hackers", always draw a **table** with columns: Type, Permission, Legality, Intent, Example. Mention at least **5 categories** (Black, White, Grey, Script Kiddie, Hacktivist, State-Sponsored).

---

## 1.4 Importance of Ethical Hacking (Red Team, Blue Team)

### Red Team (Offensive Security)

**Role**: Simulate real-world attacks to identify vulnerabilities before actual attackers do.

**Activities**:
- Network penetration testing
- Web application security testing
- Social engineering campaigns (phishing, vishing, tailgating)
- Physical security assessments
- Wireless security testing

**Common Tools**:
- **Metasploit** — Exploitation framework
- **Nmap** — Network discovery & port scanning
- **Burp Suite** — Web proxy & scanner
- **Cobalt Strike** — Adversary simulation
- **Kali Linux** — Pen-testing OS

**Output**: Red team report detailing vulnerabilities found, exploitation paths, and risk ratings.

### Blue Team (Defensive Security)

**Role**: Defend against attacks, monitor systems, detect and respond to incidents.

**Activities**:
- Security monitoring (SIEM — Splunk, ELK Stack)
- Incident response (containment, eradication, recovery)
- Vulnerability management (patching, hardening)
- Threat intelligence (IOC collection, threat hunting)
- Security awareness training

**Common Tools**:
- **SIEM**: Splunk, IBM QRadar, ELK Stack
- **IDS/IPS**: Snort, Suricata
- **EDR**: CrowdStrike, Microsoft Defender, SentinelOne
- **Firewalls**: Palo Alto, Fortinet, pfSense
- **Honeypots**: To lure attackers and study their behavior

### Purple Team (Integration)

- Collaboration between Red and Blue teams.
- Red team shares attack techniques; Blue team improves detection rules.
- Goal: **Continuous improvement** of security posture.

### Detection Types

| Type | Description | Analogy |
|------|-------------|---------|
| **Signature-Based** | Matches known attack patterns (IOCs, hash signatures) | Like a wanted poster |
| **Anomaly-Based** | Detects deviations from baseline behavior | Like noticing someone walking differently |
| **Heuristic-Based** | Uses rules of thumb to detect suspicious activity | Like profiling behavior |
| **Behavioral-Based** | Analyzes patterns of behavior over time | Like habit tracking |

### SPPU Exam Tip
> For "Explain Red Team vs Blue Team with tools and techniques", draw two columns: one for Red, one for Blue. List at least **3 activities and 3 tools per team**.

---

## 1.5 Cybersecurity vs Ethical Hacking

### Detailed Comparison

| Aspect | Cybersecurity | Ethical Hacking |
|--------|---------------|-----------------|
| **Definition** | Practice of protecting systems, networks, and data from digital attacks | Subset of cybersecurity — authorized probing to find vulnerabilities |
| **Scope** | Broad — covers strategy, policy, compliance, risk management, defense, incident response, forensics, disaster recovery | Narrow — focused on offensive testing and vulnerability identification |
| **Primary Goal** | **CIA Triad**: Confidentiality, Integrity, Availability of data | Identify exploitable weaknesses before attackers do |
| **Approach** | **Defensive** — build walls, monitor, detect, respond | **Offensive** — attempt to breach the walls |
| **Roles** | SOC Analyst, CISO, Security Engineer, Forensics Analyst, GRC Specialist, Security Architect | Penetration Tester, Red Teamer, Vulnerability Assessor, Bug Bounty Hunter |
| **Certifications** | CISSP, CISM, CompTIA Security+, CISA, ISO 27001 Lead Auditor | CEH, OSCP, GPEN, OSWE, eCPPT |
| **Methodology** | Risk assessment → Policy → Implementation → Monitoring → Improvement | Recon → Scan → Exploit → Maintain → Cover Tracks |
| **When Used** | 24/7 continuous operations | Periodically (quarterly pen tests, annual red team exercises) |
| **Tools** | Firewalls, SIEM, EDR, DLP, IAM, Encryption | Metasploit, Burp Suite, Nmap, John the Ripper, Hydra |

### CIA Triad (Foundation of Cybersecurity)

| Element | Description | Example |
|---------|-------------|---------|
| **Confidentiality** | Data accessible only to authorized users | Encryption, access controls |
| **Integrity** | Data is accurate and not tampered with | Hashing, digital signatures |
| **Availability** | Systems and data are accessible when needed | Redundancy, DDoS protection, backups |

### Additional Security Principles
- **AAA** (Authentication, Authorization, Accounting)
- **Non-Repudiation** — Cannot deny an action (digital signatures, logs)
- **Defense in Depth** — Multiple layers of security
- **Least Privilege** — Minimum access necessary

### SPPU Exam Tip
> For "Distinguish between Cybersecurity and Ethical Hacking", use a **table format**. Include at least **8 points of comparison**. Start with the relationship: *"Ethical hacking is a subset of cybersecurity. Cybersecurity is the umbrella; ethical hacking is one of the tools under it."*

---

## 1.6 Phases of Ethical Hacking (5 Phases — Detailed)

```
Phase 1: Reconnaissance
    ↓
Phase 2: Scanning & Enumeration
    ↓
Phase 3: Gaining Access
    ↓
Phase 4: Maintaining Access
    ↓
Phase 5: Covering Tracks
```

### Phase 1: Reconnaissance (Footprinting)

**Goal**: Gather as much information as possible about the target.

**Types**:

| Type | Interaction | Risk | Examples |
|------|-------------|------|----------|
| **Passive Recon** | No direct contact with target | Low/None | OSINT, Google dorking, WHOIS, Shodan, social media, job postings, Google Maps (physical locations) |
| **Active Recon** | Direct interaction with target | High (detectable) | Ping sweeps, DNS queries, traceroute, port scans (stealth or full) |

**Tools**: WHOIS, nslookup, theHarvester, Maltego, Recon-ng, Google dorking (intitle:, inurl:, filetype:), Shodan, Censys

### Phase 2: Scanning & Enumeration

**Goal**: Identify live hosts, open ports, running services, OS details, and potential entry points.

**Sub-Phases**:

| Step | Activity | Tools |
|------|----------|-------|
| **Port Scanning** | TCP/UDP port scan to find open ports | Nmap (SYN scan, TCP connect, etc.) |
| **Service Detection** | Identify service versions on open ports | Nmap -sV |
| **OS Fingerprinting** | Determine OS (Windows, Linux, macOS) | Nmap -O, p0f |
| **Vulnerability Scanning** | Automated scan for known CVEs | Nessus, OpenVAS, Qualys |
| **Enumeration** | Extract detailed info from services | User lists (enum4linux), shares (SMB), DNS records (dnsenum), SNMP (snmpwalk), web directories (Gobuster, dirb) |

**Common Ports to Remember**:

| Port | Service |
|------|---------|
| 21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS |
| 80 | HTTP |
| 110 | POP3 |
| 143 | IMAP |
| 443 | HTTPS |
| 445 | SMB |
| 1433 | MSSQL |
| 3306 | MySQL |
| 3389 | RDP |
| 8080 | HTTP-Alt |

### Phase 3: Gaining Access

**Goal**: Exploit identified vulnerabilities to gain a foothold (initial access).

**Common Exploitation Techniques**:

| Technique | Description | Example |
|-----------|-------------|---------|
| **Password Attacks** | Guessing, brute-force, dictionary attacks, credential stuffing | Hydra, John the Ripper, Hashcat |
| **SQL Injection** | Injecting SQL queries through input fields to manipulate database | ' OR 1=1 -- |
| **Cross-Site Scripting (XSS)** | Injecting malicious scripts into web pages viewed by others | Stored, Reflected, DOM-based |
| **Buffer Overflow** | Overwriting memory buffers to execute arbitrary code | Classic stack overflow |
| **Phishing / Social Engineering** | Tricking users into revealing credentials or running malware | Spear phishing, vishing, whaling |
| **Session Hijacking** | Stealing session tokens to impersonate users | Cookie theft, session fixation |
| **Man-in-the-Middle (MITM)** | Intercepting communication between two parties | ARP spoofing, DNS spoofing |
| **File Inclusion** | Including remote/local files via vulnerable parameters | LFI/RFI (file upload, directory traversal) |
| **Command Injection** | Executing OS commands through vulnerable application inputs | ; cat /etc/passwd |

**Privilege Escalation**:

| Type | Description |
|------|-------------|
| **Vertical** | User → Administrator/Root (escalating to higher privilege) |
| **Horizontal** | User A → User B (same privilege level, different account) |

### Phase 4: Maintaining Access

**Goal**: Ensure persistent access to the compromised system.

**Techniques**:

| Technique | Description |
|-----------|-------------|
| **Backdoors** | Implant code that allows re-entry (e.g., netcat listener, custom reverse shell) |
| **Rootkits** | Kernel-level tools that hide attacker presence (e.g., modify system calls) |
| **Trojans / RATs** | Remote Access Trojans (e.g., njRAT, DarkComet) |
| **Cron Jobs / Scheduled Tasks** | Schedule re-execution of malicious payloads |
| **Registry Run Keys** | Windows: add entry to `HKLM\Software\Microsoft\Windows\CurrentVersion\Run` |
| **SSH Keys** | Add attacker's public key to `authorized_keys` |
| **Web Shells** | Upload malicious script (e.g., c99.php) to web server for remote execution |

**Lateral Movement**: Moving from the compromised host to other hosts in the network.

- Pass-the-Hash (PtH)
- Pass-the-Ticket (Kerberos)
- PsExec, WMI, WinRM
- SMB shares

### Phase 5: Covering Tracks

**Goal**: Remove evidence of the intrusion to avoid detection and forensic analysis.

**Techniques**:

| Technique | Description |
|-----------|-------------|
| **Log Deletion** | Clear event logs (`wevtutil cl` on Windows, `rm -rf /var/log/*` on Linux) |
| **Log Alteration** | Modify specific log entries (not just delete) |
| **Timestomp** | Modify file timestamps (creation, modification, access) |
| **Hiding Tools** | Rename files, use hidden directories, NTFS alternate data streams (ADS) |
| **Process Hiding** | Rootkits that hide processes from task manager / ps |
| **Tunneling / Encryption** | Encrypt C2 traffic to avoid signature detection |

> **Important for SPPU**: In ethical hacking, this phase is **simulated** — in a real penetration test, covering tracks is usually not performed destructively; instead, the tester documents what they would cover.

---

## Additional Topics for SPPU Exams

### Penetration Testing Types

| Type | Description | Known/Not Known |
|------|-------------|-----------------|
| **Black Box** | No prior knowledge of the target; simulates external attacker | Zero knowledge |
| **White Box** | Full knowledge given (architecture diagrams, credentials, source code) | Full knowledge |
| **Grey Box** | Partial knowledge (e.g., user-level credentials provided) | Partial knowledge |

### Bug Bounty Programs

- Organizations invite ethical hackers to find vulnerabilities and reward them financially.
- Platforms: **HackerOne**, **Bugcrowd**, **Synack**.
- **Responsible Disclosure**: Report to vendor first; wait for fix before public disclosure.
- India's **CERT-In** provides guidelines for vulnerability disclosure.

### Laws Relevant to Ethical Hacking (India Focus)

| Law | Jurisdiction | Key Provisions |
|-----|-------------|----------------|
| **IT Act 2000 (India)** | India | Section 43 — unauthorized access, data theft, damage |
| | | Section 66 — computer-related offenses (hacking with dishonest intent) |
| | | Section 70 — protection of critical infrastructure (protected systems) |
| **CFAA (US)** | United States | Computer Fraud and Abuse Act — prohibits unauthorized access |
| **GDPR (EU)** | European Union | Data breach notification, data protection requirements |
| **Computer Misuse Act 1990** | United Kingdom | Unauthorized access, modification, intent to commit further offenses |

### Key Terms Glossary

| Term | Definition |
|------|------------|
| **Vulnerability** | A weakness in a system that could be exploited |
| **Threat** | A potential danger (actor or event) that could exploit a vulnerability |
| **Risk** | Likelihood × Impact of a threat exploiting a vulnerability |
| **Exploit** | Code or technique that takes advantage of a vulnerability |
| **Payload** | The malicious code delivered by an exploit |
| **Attack Vector** | The path or method used to breach security |
| **Attack Surface** | Total set of vulnerabilities across an organization |
| **Zero-Day** | A vulnerability unknown to the vendor — no patch available |
| **CVE** | Common Vulnerabilities and Exposures (standard identifier for known vulnerabilities) |
| **CWE** | Common Weakness Enumeration (type/category of weakness) |
| **CVSS** | Common Vulnerability Scoring System (0–10 severity rating) |

### Sample 5-Mark Questions (SPPU Pattern)

1. **Define ethical hacking. Explain the need for ethical hacking in today's world.**
   - *Ans*: Definition, 3 key characteristics, 3 reasons (proactive defense, compliance, data protection)

2. **Differentiate between Black Hat, White Hat, and Grey Hat hackers.**
   - *Ans*: Table with columns: Type, Permission, Legality, Intent, Example

3. **Explain the role of Red Team and Blue Team in cybersecurity.**
   - *Ans*: Define each, list 3 activities each, mention Purple Team integration

4. **Write a note on the history of ethical hacking.**
   - *Ans*: Era-wise: Phreaking → Morris Worm → SATAN → CEH → Modern bug bounties

5. **Describe the 5 phases of ethical hacking in detail.**
   - *Ans*: Name all 5, explain each phase with goal, activities, tools, examples

6. **Distinguish between Cybersecurity and Ethical Hacking.**
   - *Ans*: Table with 8+ points, mention that ethical hacking is a subset

7. **What is reconnaissance? Explain passive and active reconnaissance with examples.**
   - *Ans*: Definition, table comparing passive vs active, 3 tools each

8. **Explain the different types of penetration testing.**
   - *Ans*: Black Box, White Box, Grey Box — compare knowledge level, time, cost

### Quick Revision Mnemonic

**5 Phases of Ethical Hacking** → **R**econnaissance, **S**canning, **G**aining, **M**aintaining, **C**overing

> **Mnemonic**: "**R**aju **S**ir **G**ave **M**e **C**hocolate"

**CIA Triad** → **C**onfidentiality, **I**ntegrity, **A**vailability

> **Mnemonic**: "**C**IA **I**s **A**lways important"

**Types of Hackers** → **B**lack, **W**hite, **G**rey, **S**cript K, **H**acktivist, **S**tate

> **Mnemonic**: "**B**ig **W**hite **G**hosts **S**hould **H**ave **S**ecurity"
