<script>
    import { tick } from "svelte";
    import { slide, fly, fade } from "svelte/transition";
    import ThreeScene from "./ThreeScene.svelte";
    import { gameState } from "./lib/gameState.svelte.js";
    import AdManager from "./components/AdManager.svelte";
    import StoryOverlay from "./components/StoryOverlay.svelte";
    import InventoryHUD from "./components/InventoryHUD.svelte";
    import StoryTerminal from "./components/StoryTerminal.svelte";
    import AudioVisualizer from "./components/AudioVisualizer.svelte";

    // Boot sequence
    let bootComplete = $state(false);
    let bootLines = $state([]);
    const bootMessages = [
        "╔═══════════════════════════════════════════════════════════════╗",
        "║                  NEXUS NEURAL ARCHITECTURE v7.3               ║",
        "║              Powered by Braindance Processing Core            ║",
        "╚═══════════════════════════════════════════════════════════════╝",
        "",
        "[    0.000000] Linux version 6.9.420-cyberpunk-x86_64 (root@nexus-01)",
        "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.9.420 root=/dev/mapper/cyber-root ro quiet splash",
        "[    0.000000] KERNEL supported cpus:",
        "[    0.000000]   Intel GenuineIntel",
        "[    0.000000]   AMD AuthenticAMD",
        "[    0.000000]   Hygon HygonGenuine",
        "[    0.000000]   Centaur CentaurHauls",
        "[    0.000000]   zhaoxin   Shanghai",
        '[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: "x87 floating point registers"',
        '[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: "SSE registers"',
        '[    0.000000] x86/fpu: Supporting XSAVE feature 0x004: "AVX registers"',
        "[    0.000000] x86/fpu: xstate_offset[2]:  576, xstate_sizes[2]:  256",
        '[    0.000000] x86/fpu: Enabled xstate features 0x7: "x87 floating point" "SSE" "AVX"',
        "[    0.000000] BIOS-provided physical RAM map:",
        "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009efff] usable",
        "[    0.000000] BIOS-e820: [mem 0x000000000009f000-0x000000000009ffff] reserved",
        "[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved",
        "[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000007ffdefff] usable",
        "[    0.000000] BIOS-e820: [mem 0x000000007ffdf000-0x000000007fffffff] ACPI data",
        "[    0.000000] NX (Execute Disable) protection: active",
        "[    0.000000] SMBIOS 3.3 present.",
        "[    0.000000] DMI: Militech NeuroFrame-7 / Phantom Edition, BIOS v4.20.69 12/31/2076",
        "[    0.000000] tsc: Fast TSC calibration using PIT",
        "[    0.000000] tsc: Detected 5400.00 MHz processor",
        "[    0.010000] last_pfn = 0x80000 max_arch_pfn = 0x400000000",
        "[    0.010000] MTRR default type: write-back",
        "[    0.010000] MTRR fixed ranges enabled:",
        "[    0.010000]   00000-9FFFF write-back",
        "[    0.010000]   A0000-BFFFF uncachable",
        "[    0.010000]   C0000-FFFFF write-protect",
        "[    0.010000] MTRR variable ranges enabled:",
        "[    0.010000]   0 base 00E0000000 mask FFE0000000 uncachable",
        "[    0.010000]   1 disabled",
        "[    0.010000] x86/PAT: Configuration [0-7]: WB  WC  UC- UC  WB  WP  UC- WT",
        "[    0.020000] check: Scanning for low memory corruption every 60 seconds",
        "[    0.020000] Initializing XFRM netlink socket",
        "[    0.030000] NET: Registered protocol family 1",
        "[    0.030000] pci 0000:00:00.0: [8086:0d04] type 00 class 0x060000",
        "[    0.030000] pci 0000:01:00.0: [10de:2684] type 00 class 0x030000",
        "[    0.040000] pci 0000:01:00.0: reg 0x10: [mem 0xf0000000-0xf0ffffff 64bit]",
        "[    0.040000] pci 0000:01:00.0: reg 0x18: [mem 0xe0000000-0xefffffff 64bit pref]",
        "[    0.050000] pci 0000:02:00.0: [168c:003c] type 00 class 0x028000",
        "[    0.050000] pci 0000:02:00.0: reg 0x10: [mem 0xf1000000-0xf1ffffff 64bit]",
        '[    0.060000] audit: type=1130 audit(1704067200.123:1): pid=1 uid=0 auid=4294967295 ses=4294967295 msg="unit=systemd-tmpfiles-setup-dev"',
        "",
        "[    0.150000] EXT4-fs (dm-0): mounted filesystem with ordered data mode. Opts: (null)",
        "[    0.160000] VFS: Mounted root (ext4 filesystem) readonly on device 253:0.",
        "[    0.170000] devtmpfs: mounted",
        "[    0.180000] Freeing initrd memory: 128000K",
        "[    0.200000] random: crng init done",
        "[    0.210000] random: 7 urandom warning(s) missed due to ratelimit",
        "",
        "[    1.234000] systemd[1]: systemd 254.1-1ubuntu1 running in system mode",
        "[    1.235000] systemd[1]: Detected architecture x86-69",
        '[    1.236000] systemd[1]: Set hostname to "nexus-01".',
        "[    1.240000] systemd[1]: Created slice system-getty.slice.",
        "[    1.241000] systemd[1]: Reached target Local File Systems.",
        "[    1.242000] systemd[1]: Reached target Remote File Systems.",
        "[    1.243000] systemd[1]: Condition check resulted in Remount Root being skipped.",
        "",
        '[    2.100000] audit: type=1130 audit(1704067200.456:2): pid=1 uid=0 auid=4294967295 ses=4294967295 msg="unit=systemd-fsck-root"',
        "[    2.101000] EXT4-fs (dm-0): re-mounted. Opts: errors=remount-ro",
        "",
        "[    2.500000] systemd[1]: Starting Network Manager...",
        "[    2.501000] systemd[1]: Starting Cryptography Setup for cyber...",
        "[    2.502000] systemd[1]: Starting Create list of required static device nodes...",
        "[    2.600000] systemd[1]: Reached target Preparation for Local File Systems.",
        "[    2.601000] systemd[1]: Reached target Local File Systems.",
        "[    2.650000] cryptsetup[512]: Setting up encrypted device cyber...",
        "[    2.700000] systemd[1]: Started Cryptography Setup for cyber.",
        "",
        "[    3.000000] nouveau 0000:01:00.0: NVIDIA RTX 4090 (Phantom Edge)",
        "[    3.001000] nouveau 0000:01:00.0: bios: version 94.02.4e.00.8f",
        "[    3.002000] nouveau 0000:01:00.0: fb: 24576 MiB GDDR6X",
        "[    3.010000] nouveau 0000:01:00.0: DRM: VRAM: 24576 MiB",
        "[    3.011000] nouveau 0000:01:00.0: DRM: GART: 512 MiB",
        "[    3.020000] [drm] Initialized nouveau 1.3.1 for 0000:01:00.0 on minor 0",
        "[    3.021000] [drm] kms enabled.",
        "",
        "[    3.500000] EXT4-fs (dm-1): mounted filesystem with ordered data mode. Opts: (null)",
        "[    3.501000] EXT4-fs (dm-2): mounted filesystem with ordered data mode. Opts: (null)",
        "",
        "[    4.000000] systemd[1]: Started Network Manager.",
        "[    4.001000] systemd[1]: Starting Daemon for power management...",
        "[    4.002000] systemd[1]: Starting Login Service...",
        '[    4.100000] audit: type=1130 audit(1704067200.789:3): pid=1 uid=0 auid=4294967295 ses=4294967295 msg="unit=systemd-logind"',
        "[    4.200000] systemd[1]: Started Login Service.",
        "[    4.201000] systemd[1]: Reached target Network is Online.",
        "",
        "[    4.500000] systemd[1]: Starting Braindance Neural Interface Daemon...",
        "[    4.501000] systemd[1]: Starting Quickhack Payload Compiler Service...",
        "[    4.502000] systemd[1]: Starting Netrunner Toolkit Daemon...",
        "[    4.600000] braindance[1234]: Initializing Kiroshi Optical Implant sync...",
        "[    4.601000] braindance[1234]: Sensory input stream calibrated",
        "[    4.602000] braindance[1234]: Cybernetic implant harmonization complete",
        "[    4.700000] quickhack[1235]: Breach Protocol v3.2 loaded",
        "[    4.701000] quickhack[1235]: Quickhack payload compiler online",
        "[    4.800000] netrunner[1236]: Dark ICE shielding active",
        "[    4.801000] netrunner[1236]: Routing through 47 proxy nodes",
        "[    4.802000] netrunner[1236]: NetWatch surveillance beacon disabled",
        "",
        "[    5.000000] systemd[1]: Started Braindance Neural Interface Daemon.",
        "[    5.001000] systemd[1]: Started Quickhack Payload Compiler Service.",
        "[    5.002000] systemd[1]: Started Netrunner Toolkit Daemon.",
        "[    5.100000] systemd[1]: Starting OpenSSH server daemon...",
        "[    5.200000] sshd[1240]: Server listening on 0.0.0.0 port 22.",
        "[    5.201000] sshd[1240]: Server listening on :: port 22.",
        "[    5.300000] systemd[1]: Started OpenSSH server daemon.",
        "",
        "[    5.400000] systemd[1]: Starting Tor anonymity network...",
        "[    5.500000] tor[1250]: Tor v0.4.8.0 running on Linux with Libevent 2.1.12-stable",
        "[    5.501000] tor[1250]: Tor can't help you if you use it wrong!",
        "[    5.600000] tor[1250]: Starting Tor v0.4.8.0",
        "[    5.700000] tor[1250]: Bootstrapped 5%: Connecting to directory server",
        "[    5.800000] tor[1250]: Bootstrapped 10%: Finishing handshake with directory server",
        "[    5.900000] tor[1250]: Bootstrapped 15%: Establishing an encrypted directory connection",
        "[    6.000000] tor[1250]: Bootstrapped 90%: Establishing a Tor circuit",
        "[    6.100000] tor[1250]: Bootstrapped 100%: Done",
        "[    6.200000] systemd[1]: Started Tor anonymity network.",
        "",
        "[    6.300000] systemd[1]: Starting I2P Anonymous Network Router...",
        "[    6.400000] i2p[1260]: I2P 2.7.0 starting",
        "[    6.500000] i2p[1260]: Listening on 127.0.0.1:7656 for I2P clients",
        "[    6.600000] systemd[1]: Started I2P Anonymous Network Router.",
        "",
        "[    6.700000] systemd[1]: Starting WireGuard VPN Interface Setup...",
        "[    6.800000] wireguard: WireGuard 1.0.20230706 loaded.",
        "[    6.801000] wireguard: Copyright (C) 2015-2023 Jason A. Donenfeld",
        "[    6.900000] systemd[1]: Started WireGuard VPN Interface Setup.",
        "",
        "[    7.000000] systemd[1]: Starting SELinux Policy Loader...",
        "[    7.100000] audit: type=1403 audit(1704067200.987:4): policy loaded auid=4294967295 ses=4294967295",
        "[    7.200000] systemd[1]: Started SELinux Policy Loader.",
        "",
        "[    7.300000] systemd[1]: Starting AppArmor Profile Loader Service...",
        "[    7.400000] apparmor: AppArmor sha1 policy hashing enabled",
        "[    7.500000] systemd[1]: Started AppArmor Profile Loader Service.",
        "",
        "[    7.600000] systemd[1]: Starting Firewall Service (Militech-grade)...",
        "[    7.700000] nf_conntrack: version 0.5.0",
        "[    7.701000] nf_conntrack: hashsize=65536 hash buckets=32768, 4 hash chains per bucket",
        "[    7.800000] nf_tables: version 1.0.4",
        "[    7.801000] nf_tables: nf_conntrack support enabled",
        "[    7.900000] systemd[1]: Started Firewall Service (Militech-grade).",
        "",
        "[    8.000000] systemd[1]: Starting MongoDB Document Database...",
        "[    8.100000] mongod[1280]: 2076-12-31T23:00:00.123+00:00 I CONTROL  [initandlisten] MongoDB starting",
        "[    8.200000] mongod[1280]: 2076-12-31T23:00:00.456+00:00 I CONTROL  [initandlisten] db version v7.0.0",
        "[    8.300000] mongod[1280]: 2076-12-31T23:00:00.789+00:00 I CONTROL  [initandlisten] waiting for connections on port 27017",
        "[    8.400000] systemd[1]: Started MongoDB Document Database.",
        "",
        "[    8.500000] systemd[1]: Reached target Multi-User System.",
        "[    8.501000] systemd[1]: Reached target Graphical Interface.",
        "[    8.600000] systemd[1]: Started User Manager for UID 1000.",
        "[    8.700000] systemd[1]: Started Session c1 of user netrunner.",
        "",
        '[    8.800000] audit: type=1100 audit(1704067201.234:5): pid=1 uid=0 auid=4294967295 ses=4294967295 msg="system-sleep"',
        "",
        "╔═══════════════════════════════════════════════════════════════╗",
        "║                                                               ║",
        "║         WELCOME, NETRUNNER. READY FOR THE GUTTER.           ║",
        "║                                                               ║",
        '║  "The street finds its own uses for things." - William Gibson║',
        "║                                                               ║",
        "╚═══════════════════════════════════════════════════════════════╝",
        "",
        "nexus-01 login: ",
    ];

    // Active nav section tracking
    let activeSection = $state("");
    let observers = [];

    // Click-to-copy tooltip
    let copiedField = $state("");
    let copiedTimeout;

    // Glitch effect
    let glitchActive = $state(true);

    // Collapsible experience cards
    let expandedCards = $state({
        wetfish: true,
        clearcaptions: true,
        stg: true,
    });

    // Game terminal (replaces old terminal easter egg)
    let storyTerminalOpen = $state(false);
    let storyDialogOpen = $state(false);
    // Terminal easter egg (legacy — now opens story terminal)
    let terminalOpen = $state(false);
    let terminalInput = $state("");
    let terminalHistory = $state([
        {
            type: "output",
            text: '> SYSTEM INITIALIZED. Type "help" for commands.',
        },
    ]);
    let konamiBuffer = [];
    const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "KeyB",
        "KeyA",
    ];
    let terminalInputEl = $state();
    let terminalBodyEl = $state();

    // Boot loading bar
    let loadingBarActive = $state(false);
    let loadingBarPercent = $state(0);
    let bootLinesEl = $state();

    // Mouse glow
    let mouseX = $state(0);
    let mouseY = $state(0);
    let mainEl;

    // Interference
    let interferenceActive = $state(false);

    // Text scramble
    const scrambleChars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

    function scrambleText(el) {
        const original = el.dataset.text || el.textContent;
        el.dataset.text = original;
        const len = original.length;
        let iteration = 0;
        const interval = setInterval(() => {
            el.textContent = original
                .split("")
                .map((char, i) => {
                    if (i < iteration) return original[i];
                    return scrambleChars[
                        Math.floor(Math.random() * scrambleChars.length)
                    ];
                })
                .join("");
            iteration += 1;
            if (iteration > len) {
                clearInterval(interval);
                el.textContent = original;
            }
        }, 30);
    }

    function handleKonami(e) {
        konamiBuffer.push(e.code);
        if (konamiBuffer.length > konamiCode.length) konamiBuffer.shift();
        if (
            konamiBuffer.length === konamiCode.length &&
            konamiBuffer.every((k, i) => k === konamiCode[i])
        ) {
            storyTerminalOpen = true;
            konamiBuffer = [];
        }
    }

    // Matrix rain for terminal
    let matrixInterval;
    function startMatrixRain() {
        let lines = 0;
        matrixInterval = setInterval(() => {
            const line = Array.from(
                { length: 60 },
                () =>
                    scrambleChars[
                        Math.floor(Math.random() * scrambleChars.length)
                    ],
            ).join("");
            terminalHistory = [
                ...terminalHistory,
                { type: "matrix", text: line },
            ];
            lines++;
            if (lines > 100) {
                clearInterval(matrixInterval);
                terminalHistory = [
                    ...terminalHistory,
                    { type: "output", text: "\n[MATRIX FEED TERMINATED]" },
                ];
            }
            tick().then(() => {
                if (terminalBodyEl)
                    terminalBodyEl.scrollTop = terminalBodyEl.scrollHeight;
            });
        }, 80);
    }

    // Fake hack sequence
    let hackInterval;
    function startHackSequence() {
        const hackSteps = [
            "[*] Initializing Nexus Penetration Framework v7.3...",
            "[+] Framework loaded successfully",
            "",
            "[*] Target: 192.168.1.100 (Militech Server Farm)",
            "[*] Starting reconnaissance phase...",
            "",
            "[*] Running nmap aggressive scan...",
            "[+] Nmap 7.93 ( https://nmap.org )",
            "[*] Scanning 192.168.1.100 for open ports...",
            "[*] Host is up (0.0042s latency).",
            "",
            "[+] PORT      STATE    SERVICE      VERSION",
            "[+] 22/tcp    open     ssh          OpenSSH 8.9p1 Ubuntu",
            "[+] 25/tcp    open     smtp         Postfix smtpd",
            "[+] 53/tcp    open     domain       ISC BIND 9.18.0",
            "[+] 80/tcp    open     http         Apache httpd 2.4.56",
            "[+] 110/tcp   open     pop3         Dovecot pop3d",
            "[+] 143/tcp   open     imap         Dovecot imapd",
            "[+] 443/tcp   open     https        Apache httpd 2.4.56",
            "[+] 3306/tcp  open     mysql        MySQL 8.0.32-0ubuntu0.22.04.1",
            "[+] 5432/tcp  open     postgresql   PostgreSQL 14.7",
            "[+] 6379/tcp  open     redis        Redis 7.0.9",
            "[+] 8080/tcp  open     http-proxy   Nginx 1.18.0",
            "[+] 9200/tcp  open     elasticsearch Elasticsearch 8.5.0",
            "[+] 27017/tcp open     mongodb      MongoDB 5.0.14",
            "[+] 50000/tcp open     unknown      Braindance Interface Service",
            "",
            "[*] Running service enumeration...",
            "[+] Found 47 open ports total",
            "[!] Multiple critical services detected",
            "",
            "[*] Running vulnerability scan with nessus...",
            "[+] Scanning for known CVEs...",
            "[!] CVE-2024-3156 - Apache RCE - CRITICAL",
            "[!] CVE-2024-1086 - Linux Kernel LPE - CRITICAL",
            "[!] CVE-2023-44487 - HTTP/2 DoS - HIGH",
            "[!] CVE-2023-21835 - MySQL Auth Bypass - HIGH",
            "[!] CVE-2023-32315 - PostgreSQL RCE - HIGH",
            "[!] CVE-2023-28432 - Redis ACL Bypass - MEDIUM",
            "",
            "[*] Running metasploit automated exploitation...",
            "[*] Loading exploit modules...",
            "[+] exploit/linux/http/apache_cve_2024_3156 loaded",
            "[+] exploit/linux/local/kernel_cve_2024_1086 loaded",
            "[+] exploit/linux/mysql/mysql_auth_bypass loaded",
            "[*] Attempting exploit chain...",
            "",
            "[*] Running sqlmap for database enumeration...",
            "[*] Target URL: http://192.168.1.100/login.php",
            "[+] Testing connection to the target URL",
            "[+] Heuristic (basic) test shows that GET parameter 'id' might be vulnerable to SQL injection attacks",
            "[+] Heuristic (XPath injection) test shows that GET parameter 'id' might be vulnerable to XPath injection attacks",
            "[*] Testing 'AND boolean-based blind - WHERE or HAVING clause'",
            "[+] GET parameter 'id' appears to be vulnerable to SQL injection attacks",
            "[*] Fetching database names",
            "[+] Available databases:",
            "[+]   - information_schema",
            "[+]   - mysql",
            "[+]   - performance_schema",
            "[+]   - militech_secure",
            "[+]   - braindance_vault",
            "[+]   - personnel_dossier",
            "",
            "[*] Dumping table: personnel_dossier.users",
            "[+] 1247 entries found",
            "[+] admin | $2y$10$9xK8m2pL9qR3vN5tY7zX1uJ4wB6cD2eF5gH8iK1lM3nO5pQ7rS9t",
            "[+] root | $2y$10$4mK2p9qL7sR3vN5tY7zX1uJ4wB6cD2eF5gH8iK1lM3nO5pQ7rS9t",
            "[+] netrunner | $2y$10$7xK8m2pL9qR3vN5tY7zX1uJ4wB6cD2eF5gH8iK1lM3nO5pQ7rS9t",
            "",
            "[*] Running john the ripper for password cracking...",
            "[+] Loaded 1247 password hashes with bcrypt",
            "[+] Will run 8 OpenMP threads",
            "[+] Press Ctrl-C to abort; almost any other key for status",
            "[+] admin:Nexus2077!",
            "[+] root:CyberPunk.Edgerunner#",
            "[+] netrunner:DarkNet.Protocol*",
            "",
            "[*] Attempting SSH brute force with hydra...",
            "[+] Hydra v9.4 (c) 2023 by van Hauser/THC & David Maciejak",
            "[+] Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2076-12-31 23:00:00",
            "[+] [22][ssh] host: 192.168.1.100   login: admin   password: Nexus2077!",
            "[+] [22][ssh] Valid credentials found!",
            "",
            "[*] Establishing SSH shell...",
            "[+] Connected to 192.168.1.100:22",
            "[+] SSH banner: OpenSSH_8.9p1 Ubuntu",
            "[+] User: admin",
            "",
            "[*] Running post-exploitation enumeration...",
            "[+] Checking system information...",
            "[+] Kernel: Linux 6.9.420-cyberpunk #1 SMP x86_64",
            "[+] Hostname: militech-nexus-01",
            "[+] Current user: admin (uid=1000)",
            "[+] Sudo privileges: YES",
            "",
            "[*] Attempting privilege escalation (CVE-2024-1086)...",
            "[+] Compiling kernel exploit...",
            "[+] Exploit compiled successfully",
            "[+] Running exploit...",
            "[+] Shell upgraded to root!",
            "",
            "[*] Running post-root enumeration...",
            "[+] Current user: root (uid=0)",
            "[+] System uptime: 47 days, 3 hours, 22 minutes",
            "[+] Checking for additional backdoors...",
            "[+] Found 23 existing rootkits (Diamorphine, Reptile, Suterusu)",
            "[+] Installing additional persistence mechanisms...",
            "",
            "[*] Dumping system secrets...",
            "[+] /root/.ssh/id_rsa extracted",
            "[+] /etc/shadow dumped",
            "[+] Database credentials found in /var/www/html/config.php",
            "[+] API keys found in environment variables",
            "[+] Braindance encryption keys located in /dev/cyber/secrets",
            "",
            "[*] Running mimikatz for credential harvesting...",
            "[+] Dumping LSASS memory...",
            "[+] Extracting cached credentials...",
            "[+] Found 156 cached passwords",
            "[+] Dumping Kerberos tickets...",
            "",
            "[*] Lateral movement - scanning for other systems...",
            "[+] Found 347 systems on internal network",
            "[+] Pivoting through compromised host...",
            "[+] Scanning 10.0.0.0/8 subnet...",
            "[+] Found domain controller: dc01.militech.corp",
            "[+] Found backup server: backup.militech.corp",
            "[+] Found braindance vault: vault.militech.corp",
            "",
            "[*] Running responder for LLMNR/NBNS poisoning...",
            "[+] Responder 3.1.4 listening...",
            "[+] [+] Captured NTLMv2 hash from user: corporate_admin",
            "[+] [+] Hash: corporate_admin::MILITECH:aaaaaaaaaaaaaaaa:bbbbbbbbbbbbbbbb...",
            "",
            "[*] Running bloodhound for AD enumeration...",
            "[+] Collecting Active Directory data...",
            "[+] Found 2847 users",
            "[+] Found 156 groups",
            "[+] Found 89 computers",
            "[+] Found 12 high-value targets",
            "[+] Generating attack path visualization...",
            "",
            "[*] Data exfiltration phase...",
            "[+] Compressing sensitive files...",
            "[+] /etc/shadow ... 2.3 MB",
            "[+] /var/www/html/database_backups/ ... 47.2 GB",
            "[+] /root/.ssh/ ... 1.2 MB",
            "[+] /dev/cyber/braindance_vault/ ... 156.8 GB",
            "[+] Total: 204.5 GB",
            "[+] Encrypting with AES-256...",
            "[+] Uploading to C2 server via Tor...",
            "[+] 100% complete",
            "",
            "[*] Covering tracks...",
            "[+] Clearing bash history...",
            "[+] Clearing syslog entries...",
            "[+] Clearing auth.log entries...",
            "[+] Removing temporary files...",
            "[+] Disabling auditd...",
            "[+] Removing exploit artifacts...",
            "[+] Wiping logs from /var/log/*",
            "",
            "[+] ========================================",
            "[+] Exploitation successful!",
            "[+] ========================================",
            "",
            "[+] System fully compromised",
            "[+] Root access maintained",
            "[+] Persistence established",
            "[+] Data exfiltrated",
            "[+] Logs cleaned",
            "",
            "[*] Summary Report:",
            "[+] Initial access: HTTP exploit (CVE-2024-3156)",
            "[+] Privilege escalation: Kernel exploit (CVE-2024-1086)",
            "[+] Lateral movement: Active Directory compromise",
            "[+] Data stolen: 204.5 GB",
            "[+] Systems compromised: 348",
            "[+] Time to full compromise: 8 minutes 43 seconds",
            "[+] Detection risk: MINIMAL",
            "",
            "██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗ ",
            "██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗",
            "███████║███████║██║     █████╔╝ █████╗  ██║  ██║",
            "██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██║  ██║",
            "██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██████╔╝",
            "╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝ ",
            "",
            "root@militech-nexus-01:~# ",
        ];

        let i = 0;
        hackInterval = setInterval(() => {
            if (i < hackSteps.length) {
                terminalHistory = [
                    ...terminalHistory,
                    { type: "hack", text: hackSteps[i] },
                ];
                i++;
                tick().then(() => {
                    if (terminalBodyEl)
                        terminalBodyEl.scrollTop = terminalBodyEl.scrollHeight;
                });
            } else {
                clearInterval(hackInterval);
            }
        }, 200);
    }

    function handleTerminalSubmit() {
        const cmd = terminalInput.trim().toLowerCase();
        terminalHistory = [
            ...terminalHistory,
            { type: "input", text: `> ${cmd}` },
        ];
        terminalInput = "";

        if (cmd === "clear") {
            terminalHistory = [];
            return;
        }
        if (cmd === "exit") {
            terminalOpen = false;
            clearInterval(matrixInterval);
            clearInterval(hackInterval);
            terminalHistory = [
                {
                    type: "output",
                    text: '> SYSTEM INITIALIZED. Type "help" for commands.',
                },
            ];
            return;
        }
        if (cmd === "matrix") {
            startMatrixRain();
            return;
        }
        if (cmd === "hack") {
            startHackSequence();
            return;
        }

        const responses = {
            help: "Available commands: help, whoami, skills, uptime, neofetch, matrix, hack, sudo, clear, exit",
            whoami: "Cybabun1 — Sr. DevSecOps Engineer / DevOps Architect\nSite Reliability Engineer. Cyberpunk enthusiast. Infrastructure hacker.\nClearance Level: ULTRAVIOLET",
            skills: "╔══════════════════════════════════════╗\n║  SKILL MATRIX — THREAT ASSESSMENT   ║\n╠══════════════════════════════════════╣\n║  Kubernetes     ████████████░░  85%  ║\n║  Terraform      █████████████░  92%  ║\n║  AWS            ████████████░░  88%  ║\n║  Docker         █████████████░  95%  ║\n║  Prometheus     ███████████░░░  80%  ║\n║  Python         ████████████░░  85%  ║\n║  Go             ██████████░░░░  72%  ║\n║  Bash           █████████████░  95%  ║\n╠══════════════════════════════════════╣\n║  [THREAT LEVEL: MAXIMUM]             ║\n╚══════════════════════════════════════╝",
            uptime: `System uptime: ${Math.floor((Date.now() - new Date("2010-01-01").getTime()) / 86400000)} days\nCareer runtime: 15+ years\nIncidents resolved: ∞\nCoffee consumed: [OVERFLOW ERROR]`,
            neofetch: `        ╱╲         eva@mainframe\n       ╱  ╲        ──────────────\n      ╱    ╲       OS: CyberOS 2077 x86_64\n     ╱  ╱╲  ╲      Kernel: 6.6.6-hardened\n    ╱  ╱  ╲  ╲     Shell: zsh 5.9\n   ╱  ╱    ╲  ╲    Terminal: neural-link\n  ╱  ╱______╲  ╲   CPU: Wetware v3.0\n ╱______________╲  Memory: 32GB ECC\n                   Disk: ∞ (cloud-native)\n                   Uptime: 15 years`,
            sudo: "Nice try. You are not in the sudoers file.\nThis incident will be reported.",
        };

        const response =
            responses[cmd] ||
            `Command not found: "${cmd}". Type "help" for available commands.`;
        terminalHistory = [
            ...terminalHistory,
            { type: "output", text: response },
        ];
        tick().then(() => {
            if (terminalBodyEl)
                terminalBodyEl.scrollTop = terminalBodyEl.scrollHeight;
        });
    }

    async function copyToClipboard(text, field) {
        try {
            await navigator.clipboard.writeText(text);
            copiedField = field;
            clearTimeout(copiedTimeout);
            copiedTimeout = setTimeout(() => {
                copiedField = "";
            }, 1500);
        } catch {
            // Fallback: do nothing
        }
    }

    function toggleCard(card) {
        expandedCards[card] = !expandedCards[card];
        expandedCards = expandedCards;
    }

    function navigateStory(nodeId) {
        if (gameState.gameStarted) {
            gameState.navigate(nodeId);
        }
    }

    function handleMouseMove(e) {
        if (!mainEl) return;
        const rect = mainEl.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    $effect(() => {
        // Boot sequence
        let bootIdx = 0;
        const bootInterval = setInterval(() => {
            if (bootIdx < bootMessages.length) {
                bootLines = [...bootLines, bootMessages[bootIdx]];
                bootIdx++;
                tick().then(() => {
                    if (bootLinesEl)
                        bootLinesEl.scrollTop = bootLinesEl.scrollHeight;
                });
            } else {
                clearInterval(bootInterval);
                // Start loading bar
                loadingBarActive = true;
                let pct = 0;
                const loadInterval = setInterval(() => {
                    pct += Math.floor(Math.random() * 8) + 3;
                    if (pct >= 100) {
                        pct = 100;
                        loadingBarPercent = pct;
                        clearInterval(loadInterval);
                        setTimeout(() => {
                            bootComplete = true;
                            // Auto-start the game after boot
                            gameState.startGame();
                        }, 400);
                    } else {
                        loadingBarPercent = pct;
                    }
                }, 80);
            }
        }, 120);

        // Stop glitch after 2s
        setTimeout(() => {
            glitchActive = false;
        }, 2000);

        // Random interference glitch
        const interferenceInterval = setInterval(() => {
            if (Math.random() > 0.92) {
                interferenceActive = true;
                setTimeout(
                    () => {
                        interferenceActive = false;
                    },
                    100 + Math.random() * 150,
                );
            }
        }, 3000);

        // Scroll-triggered fade-in + text scramble
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting &&
                        !entry.target.classList.contains("visible")
                    ) {
                        entry.target.classList.add("visible");
                        // Scramble h2 text
                        const h2 = entry.target.querySelector("h2");
                        if (h2) {
                            // Get just the text node content (skip the ::before pseudo)
                            scrambleText(h2);
                        }
                        // Stagger skill tags
                        const tags = entry.target.querySelectorAll(".tag");
                        tags.forEach((tag, i) => {
                            tag.style.transitionDelay = `${i * 40}ms`;
                            tag.classList.add("tag-visible");
                        });
                    }
                });
            },
            { threshold: 0.1 },
        );

        // Active nav tracking
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeSection = entry.target.id;
                    }
                });
            },
            { threshold: 0.3 },
        );

        // Wait for DOM + boot
        setTimeout(() => {
            document.querySelectorAll("section, header").forEach((el) => {
                fadeObserver.observe(el);
            });
            document.querySelectorAll("section[id]").forEach((el) => {
                navObserver.observe(el);
            });
        }, 100);

        observers = [fadeObserver, navObserver];

        // Backtick opens story terminal
        function handleBacktick(e) {
            if (e.key === "`" && !storyTerminalOpen && bootComplete) {
                e.preventDefault();
                storyTerminalOpen = true;
            }
        }

        // Konami code listener
        window.addEventListener("keydown", handleKonami);
        window.addEventListener("keydown", handleBacktick);

        return () => {
            observers.forEach((o) => o.disconnect());
            window.removeEventListener("keydown", handleKonami);
            window.removeEventListener("keydown", handleBacktick);
            clearTimeout(copiedTimeout);
            clearInterval(interferenceInterval);
            clearInterval(matrixInterval);
            clearInterval(hackInterval);
        };
    });
</script>

<ThreeScene />
<AudioVisualizer {bootComplete} />

<!-- Game Components -->
<AdManager />
<div
    class="story-backdrop"
    class:active={storyDialogOpen || storyTerminalOpen}
></div>
<StoryOverlay bind:dialogOpen={storyDialogOpen} />
<InventoryHUD />
<StoryTerminal bind:visible={storyTerminalOpen} />

<!-- Boot Sequence Overlay -->
{#if !bootComplete}
    <div class="boot-overlay" transition:fade={{ duration: 400 }}>
        <div class="boot-screen">
            <div class="boot-header">
                <span class="boot-logo">CYBA//OS</span>
                <span class="boot-version">v2077.04.20</span>
            </div>
            <div class="boot-lines" bind:this={bootLinesEl}>
                {#each bootLines as line, i}
                    <div
                        class="boot-line"
                        class:boot-ok={line.includes("OK") ||
                            line.includes("PASS") ||
                            line.includes("ONLINE") ||
                            line.includes("ARMED") ||
                            line.includes("LINKED") ||
                            line.includes("nominal")}
                        class:boot-cmd={line.startsWith(">")}
                    >
                        {line}
                    </div>
                {/each}
                {#if loadingBarActive}
                    <div class="boot-loading-bar">
                        <span class="loading-label"
                            >LOADING NEURAL INTERFACE</span
                        >
                        <div class="loading-track">
                            [{"\u2588".repeat(
                                Math.floor(loadingBarPercent / 5),
                            )}{"░".repeat(
                                20 - Math.floor(loadingBarPercent / 5),
                            )}] {loadingBarPercent}%
                        </div>
                    </div>
                {:else}
                    <span class="boot-cursor">_</span>
                {/if}
            </div>
        </div>
    </div>
{/if}

<main
    bind:this={mainEl}
    onmousemove={handleMouseMove}
    class:interference={interferenceActive}
    style="--mouse-x: {mouseX}px; --mouse-y: {mouseY}px;"
>
    <!-- Mouse glow effect -->
    <div class="mouse-glow"></div>

    <!-- Sticky Nav -->
    <nav class="cyber-nav" aria-label="Main navigation">
        <a href="#summary" class:active={activeSection === "summary"}>Summary</a
        >
        <a href="#core-skills" class:active={activeSection === "core-skills"}
            >Skills</a
        >
        <a
            href="#professional-experience"
            class:active={activeSection === "professional-experience"}
            >Experience</a
        >
        <a
            href="#community-projects"
            class:active={activeSection === "community-projects"}>Projects</a
        >
        <a
            href="#education-certifications"
            class:active={activeSection === "education-certifications"}>Certs</a
        >
    </nav>

    <!-- Header Section -->
    <header class="fade-section">
        <div class="hud-frame neon-flicker">
            <span class="hud-corner tl"></span>
            <span class="hud-corner tr"></span>
            <span class="hud-corner bl"></span>
            <span class="hud-corner br"></span>
            <p class="terminal-prefix">&gt; accessing personnel file...</p>
            <h1 class:glitch={glitchActive}>網兔</h1>
            <p class="title-line">
                <strong>Sr. DevSecOps Engineer / DevOps Architect</strong>
            </p>
            <div class="status-indicator">
                <span class="status-dot"></span>
                <span>Open to opportunities</span>
            </div>
            <div class="contact-bar">
                <span>Denver, Colorado</span>
                <span class="separator">|</span>
                <span
                    class="copyable"
                    onclick={() => copyToClipboard("1-970-355-0730", "phone")}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        copyToClipboard("1-970-355-0730", "phone")}
                >
                    1-800-1337
                    {#if copiedField === "phone"}<span class="copied-tooltip"
                            >Copied!</span
                        >{/if}
                </span>
                <span class="separator">|</span>
                <span
                    class="copyable"
                    onclick={() =>
                        copyToClipboard("eva.evergreene@proton.me", "email")}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        copyToClipboard("eva.evergreene@proton.me", "email")}
                >
                    eva.evergreene@proton.me
                    {#if copiedField === "email"}<span class="copied-tooltip"
                            >Copied!</span
                        >{/if}
                </span>
                <span class="separator">|</span>
                <a
                    href="https://github.com/Cybaxx"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="GitHub profile"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                        ><path
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                        /></svg
                    >
                    GitHub
                </a>
                <span class="separator">|</span>
                <a
                    href="https://soundcloud.com/cybabun1"
                    target="_blank"
                    rel="noopener"
                    class="social-link"
                    aria-label="SoundCloud profile"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                        ><path
                            d="M1.5 13V8.5h1V13h-1zm2-5.5V13h1V7.5h-1zM5.5 6v7h1V6h-1zm2-1v8h1V5h-1zm2 1.5V13h1V6.5h-1zM11.5 4v9h1V4h-1zm2 1v8h1V5h-1z"
                        /></svg
                    >
                    SoundCloud
                </a>
            </div>
            <button class="download-btn" onclick={() => window.print()}>
                <span class="btn-bracket">[</span> DOWNLOAD DOSSIER
                <span class="btn-bracket">]</span>
            </button>
        </div>
    </header>

    <!-- Summary Section -->
    <section id="summary" class="fade-section">
        <h2>Summary 摘要</h2>
        <p>
            Site Reliability Engineer with 15+ years of experience in
            <strong>Linux systems engineering</strong>, large-scale
            <strong>cloud infrastructure</strong>,
            <strong>observability design</strong>, and
            <strong>DevSecOps automation</strong>. Proven record stabilizing
            distributed systems, improving reliability metrics, leading cloud
            migrations, and building secure CI/CD + Kubernetes platforms for
            high-volume microservices. Strong focus on operational excellence,
            incident response, performance tuning, fault tolerance, and
            repeatable automation.
        </p>
        <hr />
    </section>

    <!-- Core Skills Section -->
    <section id="core-skills" class="fade-section">
        <h2>
            Core Skills 核心技能{#if gameState.gameStarted}<button
                    class="jack-in-btn"
                    onclick={() => navigateStory("skills_entrance")}
                    >[JACK IN]</button
                >{/if}
        </h2>

        <div class="skill-group">
            <h4 class="skill-category">Systems &amp; SRE</h4>
            <div class="skill-tags">
                <span class="tag tag-infra">Reliability Engineering</span>
                <span class="tag tag-infra">Incident Response</span>
                <span class="tag tag-infra">Chaos Engineering</span>
                <span class="tag tag-infra">SLO/SLA/SLI Design</span>
                <span class="tag tag-infra">On-Call Ops</span>
                <span class="tag tag-infra">Performance Tuning</span>
                <span class="tag tag-infra">High Availability</span>
            </div>
        </div>

        <div class="skill-group">
            <h4 class="skill-category">Infrastructure</h4>
            <div class="skill-tags">
                <span class="tag tag-infra">Kubernetes</span>
                <span class="tag tag-infra">Docker</span>
                <span class="tag tag-infra">Terraform</span>
                <span class="tag tag-infra">Helm</span>
                <span class="tag tag-infra">Traefik</span>
                <span class="tag tag-infra">NGINX</span>
                <span class="tag tag-infra">Linux (Debian/Ubuntu)</span>
                <span class="tag tag-infra">Proxmox</span>
            </div>
        </div>

        <div class="skill-group">
            <h4 class="skill-category">Cloud</h4>
            <div class="skill-tags">
                <span class="tag tag-cloud">AWS EKS</span>
                <span class="tag tag-cloud">EC2</span>
                <span class="tag tag-cloud">S3</span>
                <span class="tag tag-cloud">CloudFront</span>
                <span class="tag tag-cloud">RDS</span>
                <span class="tag tag-cloud">ElastiCache</span>
                <span class="tag tag-cloud">IAM</span>
                <span class="tag tag-cloud">WAF</span>
                <span class="tag tag-cloud">Vultr Cloud</span>
                <span class="tag tag-cloud">Cloudflare</span>
            </div>
        </div>

        <div class="skill-group">
            <h4 class="skill-category">Observability</h4>
            <div class="skill-tags">
                <span class="tag tag-infra">Prometheus</span>
                <span class="tag tag-infra">Grafana</span>
                <span class="tag tag-infra">Loki</span>
                <span class="tag tag-infra">Tempo</span>
                <span class="tag tag-infra">OpenTelemetry</span>
                <span class="tag tag-infra">Alertmanager</span>
                <span class="tag tag-infra">Node Exporter</span>
                <span class="tag tag-infra">DataDog</span>
            </div>
        </div>

        <div class="skill-group">
            <h4 class="skill-category">CI/CD</h4>
            <div class="skill-tags">
                <span class="tag tag-infra">GitHub Actions</span>
                <span class="tag tag-infra">GitLab CI</span>
                <span class="tag tag-infra">CircleCI</span>
                <span class="tag tag-infra">BitBucket Pipelines</span>
            </div>
        </div>

        <div class="skill-group">
            <h4 class="skill-category">Security</h4>
            <div class="skill-tags">
                <span class="tag tag-security">SOC2/ISO27001</span>
                <span class="tag tag-security">IAM/Least Privilege</span>
                <span class="tag tag-security">WAF Tuning</span>
                <span class="tag tag-security">Zero Trust</span>
                <span class="tag tag-security">IaC Security (tfsec)</span>
                <span class="tag tag-security">Drata</span>
            </div>
        </div>

        <div class="skill-group">
            <h4 class="skill-category">Languages</h4>
            <div class="skill-tags">
                <span class="tag tag-lang">Bash</span>
                <span class="tag tag-lang">Python</span>
                <span class="tag tag-lang">Go</span>
                <span class="tag tag-lang">YAML</span>
                <span class="tag tag-lang">JSON</span>
            </div>
        </div>

        <hr />
    </section>

    <!-- Professional Experience Section -->
    <section id="professional-experience" class="fade-section">
        <h2>
            Professional Experience 工作經歷{#if gameState.gameStarted}<button
                    class="jack-in-btn"
                    onclick={() => navigateStory("wetfish_entrance")}
                    >[JACK IN]</button
                >{/if}
        </h2>

        <!-- Wetfish -->
        <div class="experience-card">
            <div
                class="card-header"
                onclick={() => toggleCard("wetfish")}
                onkeydown={(e) => e.key === "Enter" && toggleCard("wetfish")}
                role="button"
                tabindex="0"
                aria-expanded={expandedCards.wetfish}
            >
                <h3>
                    Wetfish Limited LLC &mdash; Operations Administrator &amp;
                    SRE
                </h3>
                <span class="chevron" class:expanded={expandedCards.wetfish}
                    >&#9662;</span
                >
            </div>
            {#if expandedCards.wetfish}
                <div class="card-body" transition:slide={{ duration: 200 }}>
                    <p>
                        <strong>2022 &ndash; Present</strong> | Salt Lake City,
                        UT<br />
                        Lead SRE and infrastructure owner for Wetfish's production
                        services, overseeing all operational, reliability, and automation
                        responsibilities across multi-cloud Linux systems and high-traffic
                        community platforms.
                    </p>
                    <h4>Key SRE Responsibilities</h4>
                    <ul>
                        <li>
                            Designed and maintained a containerized service mesh
                            using Traefik, Docker, Watchtower, and GitHub
                            Actions&ndash;based CI/CD.
                        </li>
                        <li>
                            Built and operated <strong>FishVision</strong>, a
                            custom observability stack using Prometheus, Loki,
                            Tempo, OpenTelemetry, and Grafana for
                            logs/traces/metrics.
                        </li>
                        <li>
                            Maintain and harden multi-node infrastructure hosted
                            on Vultr, including web services, networking,
                            DNS/Anycast, and security baselines.
                        </li>
                        <li>
                            Operate real-time communication infrastructure
                            (Matrix Synapse, IRC Inspircd) with HA, monitoring,
                            and anti-abuse controls.
                        </li>
                        <li>
                            Automated deployments and cluster configuration
                            using GitHub Actions, Terraform modules, Docker
                            Compose stacks, and CLI automation.
                        </li>
                        <li>
                            Improved service reliability through on-call
                            incident response, performance tuning, and reducing
                            alert noise.
                        </li>
                        <li>
                            Led migration of legacy systems into standardized
                            container-first infrastructure following SRE best
                            practices.
                        </li>
                    </ul>
                    <h4>Impact</h4>
                    <ul>
                        <li>
                            Reduced downtime across services by &gt;45% through
                            improved alerting, TLS automation, and
                            infrastructure hardening.
                        </li>
                        <li>
                            Accelerated deployments from hours to minutes using
                            automated GitHub Actions workflows.
                        </li>
                        <li>
                            Improved system visibility with a unified
                            observability pipeline across all community
                            services.
                        </li>
                    </ul>
                </div>
            {/if}
        </div>

        <!-- ClearCaptions -->
        <div class="experience-card">
            <div
                class="card-header"
                onclick={() => toggleCard("clearcaptions")}
                onkeydown={(e) =>
                    e.key === "Enter" && toggleCard("clearcaptions")}
                role="button"
                tabindex="0"
                aria-expanded={expandedCards.clearcaptions}
            >
                <h3>
                    ClearCaptions &mdash; Sr. Lead DevOps &amp; Microservice
                    Platform Engineer
                </h3>
                <span
                    class="chevron"
                    class:expanded={expandedCards.clearcaptions}>&#9662;</span
                >
            </div>
            {#if expandedCards.clearcaptions}
                <div class="card-body" transition:slide={{ duration: 200 }}>
                    <p>
                        <strong>2022 &ndash; Present</strong> | Salt Lake City,
                        UT<br />
                        Lead architect for microservice infrastructure supporting
                        real-time captioning services powering nationwide telecommunications
                        accessibility systems.
                    </p>
                    <h4>SRE/DevOps Responsibilities</h4>
                    <ul>
                        <li>
                            Architect and operate multi-region AWS microservices
                            with Kubernetes, Terraform, and secure CI/CD
                            pipelines.
                        </li>
                        <li>
                            Designed observability stack integrating
                            OpenTelemetry + Prometheus + Tempo for distributed
                            traces and system metrics.
                        </li>
                        <li>
                            Improved production uptime and fault resilience
                            through HA design, DR/Failover modeling, and
                            advanced IAM segmentation.
                        </li>
                        <li>
                            Led SOC2 / NIST CSF compliance engineering for
                            production services.
                        </li>
                        <li>
                            Created internal platform tooling to standardize
                            microservice deployment, runtime configuration, and
                            developer experience.
                        </li>
                    </ul>
                </div>
            {/if}
        </div>

        <!-- STG -->
        <div class="experience-card">
            <div
                class="card-header"
                onclick={() => toggleCard("stg")}
                onkeydown={(e) => e.key === "Enter" && toggleCard("stg")}
                role="button"
                tabindex="0"
                aria-expanded={expandedCards.stg}
            >
                <h3>
                    Software Technology Group (STG) &mdash; DevOps/SRE
                    Consultant
                </h3>
                <span class="chevron" class:expanded={expandedCards.stg}
                    >&#9662;</span
                >
            </div>
            {#if expandedCards.stg}
                <div class="card-body" transition:slide={{ duration: 200 }}>
                    <p>
                        <strong>2020 &ndash; 2022</strong> | Salt Lake City, UT<br
                        />
                        Full-time consultant delivering infrastructure, security,
                        CI/CD, and SRE modernization for mid-enterprise clients.
                    </p>

                    <h4>GlassBoard Technology &mdash; DevOps + Cloud SRE</h4>
                    <ul>
                        <li>
                            Implemented SOC2 readiness using Drata, IAM baseline
                            policies, and audit automation.
                        </li>
                        <li>
                            Built secure AWS infrastructure with Terraform and
                            EKS. Implemented SSO, secrets governance, and
                            deployment automation.
                        </li>
                    </ul>

                    <h4>SwellCX &mdash; Platform Engineering &amp; SRE</h4>
                    <ul>
                        <li>
                            Built automated CI/CD pipelines in GitLab including
                            IaC security (tfsec, trivy).
                        </li>
                        <li>
                            Designed Kubernetes deployment architecture with
                            secrets governance and GitOps workflows.
                        </li>
                        <li>
                            Improved on-call visibility with Prometheus/Grafana
                            dashboards and alerting.
                        </li>
                    </ul>

                    <h4>
                        LiveAuctioneers &mdash; Cloud Security &amp; Reliability
                        Engineering
                    </h4>
                    <ul>
                        <li>
                            Hardened AWS post-incident environment with
                            least-privilege IAM, WAF tuning, and network
                            segmentation.
                        </li>
                        <li>
                            Rebuilt Terraform modules, standardizing
                            environments and improving reproducibility.
                        </li>
                        <li>
                            Implemented CircleCI pipelines including automated
                            security scanning and deployment safety checks.
                        </li>
                    </ul>
                </div>
            {/if}
        </div>
        <hr />
    </section>

    <!-- Additional Experience -->
    <section id="additional-experience" class="fade-section">
        <h2>Additional Experience 其他經驗</h2>
        <ul>
            <li>
                <strong>DevSecOps Consultant (Freelance)</strong> &mdash; 2015&ndash;2020:
                AWS infrastructure builds, containerization, compliance engineering,
                and SRE support for startups and mid-size clients.
            </li>
            <li>
                <strong>Linux Systems Administrator</strong> &mdash; 2010&ndash;2015:
                Managed data center Linux fleets, HA web stacks, networking, monitoring,
                and incident response.
            </li>
        </ul>
        <hr />
    </section>

    <!-- Community & Projects -->
    <section id="community-projects" class="fade-section">
        <h2>
            Community &amp; Projects 社區計畫 {#if gameState.gameStarted}<button
                    class="jack-in-btn"
                    onclick={() => navigateStory("community_entrance")}
                    >[JACK IN]</button
                >{/if}
        </h2>
        <ul>
            <li>
                <strong>SETEC Messenger</strong> &ndash; secure communications platform
            </li>
            <li>
                <strong>FishVision</strong> &ndash; observability and alerting
            </li>
            <li>
                <strong>WetFish Web-Services</strong> &ndash; automation and ops tooling
            </li>
            <li>Contributor: DC801 / 801LABS, DEF CON volunteer</li>
            <li>Maintainer of multiple FOSS and infrastructure projects</li>
        </ul>
        <hr />
    </section>

    <!-- Education & Certifications -->
    <section id="education-certifications" class="fade-section">
        <h2>
            Education &amp; Certifications 教育證書 {#if gameState.gameStarted}<button
                    class="jack-in-btn"
                    onclick={() => navigateStory("education_entrance")}
                    >[JACK IN]</button
                >{/if}
        </h2>
        <ul>
            <li>Salt Lake Community College &mdash; Computer Science</li>
            <li>CompTIA A+/Net+/Security+ (expired)</li>
            <li><strong>AWS Solutions Architect &ndash; Associate</strong></li>
            <li><strong>LPIC-2</strong></li>
            <li><strong>LPIC-3 Security</strong></li>
            <li>
                <strong
                    >Linux Professional Institute DevOps Tools Engineer</strong
                >
            </li>
        </ul>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
        <span>built with svelte + three.js</span>
        <span class="footer-hint"
            >// try the konami code — or press ` to open the terminal</span
        >
    </footer>
</main>

<!-- Terminal Easter Egg -->
{#if terminalOpen}
    <div
        class="terminal-overlay"
        transition:fade={{ duration: 150 }}
        onclick={(e) => {
            if (e.target === e.currentTarget) terminalOpen = false;
        }}
        onkeydown={(e) => e.key === "Escape" && (terminalOpen = false)}
        role="dialog"
        tabindex="-1"
        aria-label="Terminal"
    >
        <div class="terminal-window" transition:fly={{ y: 20, duration: 200 }}>
            <div class="terminal-titlebar">
                <span class="terminal-title-text">
                    <span class="terminal-dot red"></span>
                    <span class="terminal-dot yellow"></span>
                    <span class="terminal-dot green"></span>
                    cyba@mainframe:~$
                </span>
                <button
                    class="terminal-close"
                    onclick={() => {
                        terminalOpen = false;
                    }}>&times;</button
                >
            </div>
            <div class="terminal-body" bind:this={terminalBodyEl}>
                {#each terminalHistory as line}
                    <div
                        class={line.type === "input"
                            ? "term-input"
                            : line.type === "matrix"
                              ? "term-matrix"
                              : line.type === "hack"
                                ? "term-hack"
                                : "term-output"}
                    >
                        {line.text}
                    </div>
                {/each}
                <div class="terminal-prompt">
                    <span class="prompt-symbol">&gt; </span>
                    <input
                        bind:this={terminalInputEl}
                        bind:value={terminalInput}
                        onkeydown={(e) =>
                            e.key === "Enter" && handleTerminalSubmit()}
                        class="terminal-input-field"
                        spellcheck="false"
                        autocomplete="off"
                    />
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    /* === CYBERPUNK THEME === */

    :global(body) {
        background: transparent;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* --- Story/Terminal Backdrop --- */
    .story-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        z-index: 699;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
    }

    .story-backdrop.active {
        opacity: 1;
    }

    /* --- Boot Sequence --- */
    .boot-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: #000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10vh;
    }

    .boot-screen {
        width: 700px;
        max-width: 90vw;
        font-family: "Share Tech Mono", monospace;
    }

    .boot-header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #39ff14;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
    }

    .boot-logo {
        color: #00f0ff;
        font-family: "Orbitron", sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    }

    .boot-version {
        color: #555;
        font-size: 0.8rem;
    }

    .boot-lines {
        font-size: 0.85rem;
        line-height: 1.6;
        max-height: 80vh;
        overflow-y: auto;
    }

    .boot-loading-bar {
        margin-top: 1rem;
        color: #39ff14;
    }

    .loading-label {
        display: block;
        color: #00f0ff;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
        letter-spacing: 2px;
    }

    .loading-track {
        font-size: 0.9rem;
        letter-spacing: 0;
    }

    .boot-line {
        color: #888;
        animation: bootFadeIn 0.1s ease-out;
    }

    .boot-line.boot-ok {
        color: #39ff14;
    }

    .boot-line.boot-cmd {
        color: #00f0ff;
        font-weight: bold;
        margin-top: 0.3rem;
    }

    @keyframes bootFadeIn {
        from {
            opacity: 0;
            transform: translateX(-5px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .boot-cursor {
        color: #39ff14;
        animation: bootBlink 0.5s step-end infinite;
    }

    @keyframes bootBlink {
        50% {
            opacity: 0;
        }
    }

    /* --- Main Container --- */
    main {
        max-width: 860px;
        margin: 4rem auto 2rem;
        padding: 2.5rem 3rem;
        font-family: "Share Tech Mono", monospace;
        line-height: 1.8;
        letter-spacing: 0.3px;
        position: relative;
        z-index: 1;
        color: #e0e0e0;
        background: linear-gradient(
            135deg,
            rgba(10, 15, 25, 0.35),
            rgba(5, 10, 20, 0.4)
        );
        border: 1px solid rgba(0, 240, 255, 0.2);
        border-radius: 2px;
        box-shadow:
            0 0 30px rgba(0, 240, 255, 0.08),
            inset 0 0 60px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        animation: borderGlow 6s ease-in-out infinite;
        overflow: hidden;
    }

    /* Interference / glitch */
    main.interference {
        animation: interferenceFlash 0.15s linear;
    }

    @keyframes interferenceFlash {
        0% {
            filter: none;
        }
        25% {
            filter: hue-rotate(90deg) saturate(2) brightness(1.2);
            transform: translateX(2px);
        }
        50% {
            filter: hue-rotate(-45deg) brightness(0.8);
            transform: translateX(-1px) skewX(0.5deg);
        }
        75% {
            filter: saturate(3) brightness(1.3);
            transform: translateX(1px);
        }
        100% {
            filter: none;
            transform: translateX(0);
        }
    }

    /* Mouse glow */
    .mouse-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 0;
        background: radial-gradient(
            350px circle at var(--mouse-x) var(--mouse-y),
            rgba(0, 240, 255, 0.06),
            transparent 60%
        );
        transition: background 0.1s ease;
    }

    @keyframes borderGlow {
        0%,
        100% {
            border-color: rgba(0, 240, 255, 0.2);
            box-shadow:
                0 0 30px rgba(0, 240, 255, 0.08),
                inset 0 0 60px rgba(0, 0, 0, 0.3);
        }
        50% {
            border-color: rgba(0, 240, 255, 0.45);
            box-shadow:
                0 0 40px rgba(0, 240, 255, 0.15),
                0 0 80px rgba(0, 240, 255, 0.05),
                inset 0 0 60px rgba(0, 0, 0, 0.3);
        }
    }

    /* Scanline overlay */
    main::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 240, 255, 0.012) 2px,
            rgba(0, 240, 255, 0.012) 4px
        );
        pointer-events: none;
        z-index: 0;
        border-radius: 2px;
    }

    /* --- Scroll Fade-In --- */
    :global(.fade-section) {
        opacity: 0;
        transform: translateY(20px);
        transition:
            opacity 0.6s ease-out,
            transform 0.6s ease-out;
    }

    :global(.fade-section.visible) {
        opacity: 1;
        transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
        :global(.fade-section) {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }

    /* --- Staggered Skill Tags --- */

    /* --- Neon Flicker --- */
    .neon-flicker {
        animation: neonFlicker 8s ease-in-out infinite;
    }

    @keyframes neonFlicker {
        0%,
        100% {
            border-color: rgba(0, 240, 255, 0.25);
        }
        4% {
            border-color: rgba(0, 240, 255, 0.6);
        }
        4.5% {
            border-color: rgba(0, 240, 255, 0.1);
        }
        5% {
            border-color: rgba(0, 240, 255, 0.55);
        }
        5.5% {
            border-color: rgba(0, 240, 255, 0.25);
        }
        50% {
            border-color: rgba(0, 240, 255, 0.25);
        }
        54% {
            border-color: rgba(0, 240, 255, 0.5);
        }
        54.3% {
            border-color: rgba(0, 240, 255, 0.15);
        }
        54.8% {
            border-color: rgba(0, 240, 255, 0.45);
        }
        55% {
            border-color: rgba(0, 240, 255, 0.25);
        }
    }

    /* --- Sticky Nav --- */
    .cyber-nav {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        padding: 0.8rem 1rem;
        background: rgba(10, 15, 25, 0.5);
        border-top: 1px solid transparent;
        border-bottom: 1px solid rgba(0, 240, 255, 0.2);
        border-image: linear-gradient(
                90deg,
                transparent,
                #00f0ff,
                #ff00aa,
                #00f0ff,
                transparent
            )
            1;
        border-image-slice: 1;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        margin: -2.5rem -3rem 2.5rem -3rem;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
    }

    .cyber-nav a {
        color: #8892a0;
        text-decoration: none;
        transition:
            color 0.2s,
            text-shadow 0.2s,
            border-color 0.2s;
        font-family: "Orbitron", sans-serif;
        font-size: 0.7rem;
        padding-bottom: 4px;
        border-bottom: 2px solid transparent;
    }

    .cyber-nav a:hover {
        color: #00f0ff;
        text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
        text-decoration: none;
        border-bottom-color: #00f0ff;
        box-shadow: 0 2px 8px rgba(0, 240, 255, 0.3);
    }

    .cyber-nav a.active {
        color: #00f0ff;
        border-bottom-color: #00f0ff;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
        box-shadow: 0 2px 12px rgba(0, 240, 255, 0.4);
    }

    /* --- Header / HUD Frame --- */
    header {
        text-align: center;
        margin-bottom: 2.5rem;
        padding: 0;
        position: relative;
    }

    header,
    section {
        background: transparent;
    }

    .hud-frame {
        position: relative;
        border: 1px solid rgba(0, 240, 255, 0.25);
        padding: 2.5rem;
    }

    .hud-corner {
        position: absolute;
        width: 16px;
        height: 16px;
        border-color: #00f0ff;
        border-style: solid;
    }
    .hud-corner.tl {
        top: -1px;
        left: -1px;
        border-width: 2px 0 0 2px;
    }
    .hud-corner.tr {
        top: -1px;
        right: -1px;
        border-width: 2px 2px 0 0;
    }
    .hud-corner.bl {
        bottom: -1px;
        left: -1px;
        border-width: 0 0 2px 2px;
    }
    .hud-corner.br {
        bottom: -1px;
        right: -1px;
        border-width: 0 2px 2px 0;
    }

    .terminal-prefix {
        font-size: 0.8rem;
        color: #39ff14;
        margin-bottom: 0.5rem;
        font-family: "Share Tech Mono", monospace;
        overflow: hidden;
        white-space: nowrap;
        border-right: 2px solid #39ff14;
        width: 0;
        display: inline-block;
        animation:
            typing 1.5s steps(30) 0.5s forwards,
            blink 0.7s step-end infinite;
    }

    @keyframes typing {
        to {
            width: 16em;
        }
    }

    @keyframes blink {
        50% {
            border-color: transparent;
        }
    }

    /* --- Glitch Effect --- */
    h1 {
        font-family: "Orbitron", sans-serif;
        font-size: 2.8rem;
        font-weight: 900;
        color: #00f0ff;
        text-shadow:
            0 0 20px rgba(0, 240, 255, 0.5),
            0 0 40px rgba(0, 240, 255, 0.2);
        margin: 0.5rem 0;
        letter-spacing: 3px;
        text-transform: uppercase;
        position: relative;
    }

    h1.glitch::before,
    h1.glitch::after {
        content: "Cybabun1";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
    }

    h1.glitch::before {
        color: #ff00aa;
        animation: glitchTop 0.3s linear infinite;
        clip-path: inset(0 0 60% 0);
    }

    h1.glitch::after {
        color: #39ff14;
        animation: glitchBottom 0.4s linear infinite;
        clip-path: inset(60% 0 0 0);
    }

    @keyframes glitchTop {
        0% {
            transform: translate(0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(2px, -1px);
        }
        60% {
            transform: translate(-1px, 1px);
        }
        80% {
            transform: translate(1px, -2px);
        }
        100% {
            transform: translate(0);
        }
    }

    @keyframes glitchBottom {
        0% {
            transform: translate(0);
        }
        25% {
            transform: translate(2px, 1px);
        }
        50% {
            transform: translate(-2px, -1px);
        }
        75% {
            transform: translate(1px, 2px);
        }
        100% {
            transform: translate(0);
        }
    }

    /* --- Status Indicator --- */
    .status-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: #39ff14;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        background: #39ff14;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 2s ease-in-out infinite;
        box-shadow: 0 0 6px #39ff14;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            box-shadow: 0 0 6px #39ff14;
        }
        50% {
            opacity: 0.5;
            box-shadow:
                0 0 12px #39ff14,
                0 0 20px rgba(57, 255, 20, 0.3);
        }
    }

    .title-line strong {
        color: #ff00aa;
        font-size: 1.1rem;
        letter-spacing: 1px;
    }

    .contact-bar {
        margin-top: 1rem;
        font-size: 0.85rem;
        color: #ff00aa;
    }

    .contact-bar .separator {
        margin: 0 0.5rem;
        color: rgba(0, 240, 255, 0.4);
    }

    .contact-bar a {
        color: #00f0ff;
        border-bottom: 1px solid transparent;
        transition:
            border-color 0.3s,
            text-shadow 0.3s;
    }

    .contact-bar a:hover {
        border-bottom-color: #00f0ff;
        text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
        text-decoration: none;
    }

    /* --- Click-to-Copy --- */
    .copyable {
        cursor: pointer;
        position: relative;
        color: #ff00aa;
        transition:
            color 0.2s,
            text-shadow 0.2s;
    }

    .copyable:hover {
        color: #00f0ff;
        text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
    }

    .copied-tooltip {
        position: absolute;
        top: -1.8rem;
        left: 50%;
        transform: translateX(-50%);
        background: #39ff14;
        color: #0a0a0f;
        padding: 0.15rem 0.5rem;
        border-radius: 3px;
        font-size: 0.7rem;
        white-space: nowrap;
        pointer-events: none;
        animation: tooltipFade 1.5s ease-out forwards;
    }

    @keyframes tooltipFade {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        70% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
    }

    /* --- Download Button --- */
    .download-btn {
        margin-top: 1.2rem;
        padding: 0.6rem 1.5rem;
        background: transparent;
        border: 1px solid #00f0ff;
        color: #00f0ff;
        font-family: "Orbitron", sans-serif;
        font-size: 0.75rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
        position: relative;
        overflow: hidden;
    }

    .download-btn::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 240, 255, 0.15),
            transparent
        );
        transition: left 0.5s ease;
    }

    .download-btn:hover::before {
        left: 100%;
    }

    .download-btn:hover {
        background: rgba(0, 240, 255, 0.1);
        box-shadow:
            0 0 20px rgba(0, 240, 255, 0.3),
            inset 0 0 20px rgba(0, 240, 255, 0.05);
        text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
    }

    .btn-bracket {
        color: #ff00aa;
        font-weight: bold;
    }

    .social-link {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        vertical-align: middle;
    }

    .social-link svg {
        vertical-align: middle;
    }

    /* --- Section Headers --- */
    h2 {
        font-family: "Orbitron", sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #00f0ff;
        text-transform: uppercase;
        letter-spacing: 2px;
        border-bottom: 1px solid rgba(0, 240, 255, 0.3);
        padding-bottom: 0.6rem;
        margin-bottom: 1.2rem;
        position: relative;
        animation: glowPulse 3s ease-in-out infinite;
    }

    h2::before {
        content: "// ";
        color: #39ff14;
        font-family: "Share Tech Mono", monospace;
        font-size: 1rem;
    }

    @keyframes glowPulse {
        0%,
        100% {
            text-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
        }
        50% {
            text-shadow:
                0 0 15px rgba(0, 240, 255, 0.6),
                0 0 30px rgba(0, 240, 255, 0.2);
        }
    }

    h3 {
        font-family: "Share Tech Mono", monospace;
        color: #ff00aa;
        font-size: 1.2rem;
        margin-top: 0;
        padding-left: 0.8rem;
        border-left: 3px solid #ff00aa;
        flex: 1;
    }

    h4 {
        color: #ffe600;
        font-family: "Share Tech Mono", monospace;
        font-size: 1rem;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }

    /* --- Dividers --- */
    hr {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00f0ff, transparent);
        margin: 2.5rem 0;
        opacity: 0.4;
    }

    /* --- Sections --- */
    section {
        margin-bottom: 3rem;
        padding-left: 0.5rem;
        border-left: 2px solid transparent;
        transition: border-color 0.4s ease;
    }

    section:hover {
        border-left-color: rgba(0, 240, 255, 0.3);
    }

    /* --- Experience Cards --- */
    .experience-card {
        border: 1px solid rgba(0, 240, 255, 0.12);
        border-radius: 3px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        background: rgba(0, 240, 255, 0.02);
        transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
    }

    .experience-card:hover {
        transform: translateY(-2px);
        border-color: rgba(0, 240, 255, 0.3);
        box-shadow: 0 4px 20px rgba(0, 240, 255, 0.08);
    }

    .card-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

    .card-header:focus-visible {
        outline: 2px solid #00f0ff;
        outline-offset: 2px;
    }

    .chevron {
        color: #00f0ff;
        font-size: 1rem;
        transition: transform 0.2s ease;
        margin-left: 0.5rem;
        flex-shrink: 0;
    }

    .chevron.expanded {
        transform: rotate(180deg);
    }

    .card-body {
        padding-top: 0.5rem;
    }

    /* --- Typography --- */
    p {
        margin: 0.5rem 0;
    }

    strong {
        color: #00f0ff;
    }

    /* --- Links --- */
    a {
        color: #00f0ff;
        text-decoration: none;
        transition: all 0.2s;
    }

    a:hover {
        color: #fff;
        text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
        text-decoration: none;
    }

    /* --- Skill Tags --- */
    .skill-group {
        margin-bottom: 1.2rem;
    }

    .skill-category {
        margin-bottom: 0.5rem;
    }

    .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tag-infra {
        color: #00f0ff;
        border: 1px solid rgba(0, 240, 255, 0.35);
        background: rgba(0, 240, 255, 0.04);
    }
    .tag-infra:hover {
        background: rgba(0, 240, 255, 0.15);
        border-color: #00f0ff;
        box-shadow:
            0 0 10px rgba(0, 240, 255, 0.3),
            inset 0 0 10px rgba(0, 240, 255, 0.05);
        color: #ffffff;
        transform: translateY(-1px) scale(1);
    }

    .tag-security {
        color: #ff00aa;
        border: 1px solid rgba(255, 0, 170, 0.35);
        background: rgba(255, 0, 170, 0.04);
    }
    .tag-security:hover {
        background: rgba(255, 0, 170, 0.15);
        border-color: #ff00aa;
        box-shadow:
            0 0 10px rgba(255, 0, 170, 0.3),
            inset 0 0 10px rgba(255, 0, 170, 0.05);
        color: #ffffff;
        transform: translateY(-1px) scale(1);
    }

    .tag-lang {
        color: #39ff14;
        border: 1px solid rgba(57, 255, 20, 0.35);
        background: rgba(57, 255, 20, 0.04);
    }
    .tag-lang:hover {
        background: rgba(57, 255, 20, 0.15);
        border-color: #39ff14;
        box-shadow:
            0 0 10px rgba(57, 255, 20, 0.3),
            inset 0 0 10px rgba(57, 255, 20, 0.05);
        color: #ffffff;
        transform: translateY(-1px) scale(1);
    }

    .tag-cloud {
        color: #ffe600;
        border: 1px solid rgba(255, 230, 0, 0.35);
        background: rgba(255, 230, 0, 0.04);
    }
    .tag-cloud:hover {
        background: rgba(255, 230, 0, 0.15);
        border-color: #ffe600;
        box-shadow:
            0 0 10px rgba(255, 230, 0, 0.3),
            inset 0 0 10px rgba(255, 230, 0, 0.05);
        color: #ffffff;
        transform: translateY(-1px) scale(1);
    }

    /* Ensure tags get proper base styles */
    .tag {
        display: inline-block;
        padding: 0.3rem 0.8rem;
        font-size: 0.8rem;
        border-radius: 2px;
        cursor: default;
    }

    /* --- Lists --- */
    ul {
        list-style: none;
        padding-left: 0;
    }

    li {
        margin-bottom: 0.6rem;
        padding-left: 1.2rem;
        position: relative;
        line-height: 1.6;
    }

    li::before {
        content: ">";
        position: absolute;
        left: 0;
        color: #39ff14;
        font-weight: bold;
    }

    /* --- Footer --- */
    .site-footer {
        text-align: center;
        padding: 2rem 0 0.5rem;
        margin-top: 2rem;
        border-top: 1px solid rgba(0, 240, 255, 0.1);
        font-size: 0.7rem;
        color: #555;
        letter-spacing: 1px;
        text-transform: lowercase;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
    }

    .footer-hint {
        color: #333;
        font-size: 0.6rem;
        letter-spacing: 0.5px;
        transition: color 0.3s;
    }

    .footer-hint:hover {
        color: #ff00aa;
    }

    /* --- Terminal Easter Egg --- */
    .terminal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .terminal-window {
        width: 650px;
        max-width: 90vw;
        max-height: 75vh;
        background: #0a0a0f;
        border: 1px solid #39ff14;
        border-radius: 6px;
        box-shadow:
            0 0 30px rgba(57, 255, 20, 0.2),
            0 0 60px rgba(57, 255, 20, 0.1),
            0 0 100px rgba(57, 255, 20, 0.05);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .terminal-titlebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 1rem;
        background: rgba(57, 255, 20, 0.08);
        border-bottom: 1px solid rgba(57, 255, 20, 0.2);
        font-family: "Share Tech Mono", monospace;
        font-size: 0.8rem;
        color: #39ff14;
    }

    .terminal-title-text {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .terminal-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
    }

    .terminal-dot.red {
        background: #ff5f56;
    }
    .terminal-dot.yellow {
        background: #ffbd2e;
    }
    .terminal-dot.green {
        background: #27c93f;
    }

    .terminal-close {
        background: none;
        border: none;
        color: #39ff14;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 0.3rem;
        transition: color 0.2s;
    }

    .terminal-close:hover {
        color: #ff00aa;
    }

    .terminal-body {
        padding: 1rem;
        overflow-y: auto;
        flex: 1;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.82rem;
        color: #39ff14;
        line-height: 1.4;
    }

    .term-input {
        color: #00f0ff;
        margin-bottom: 0.2rem;
        white-space: pre-wrap;
    }

    .term-output {
        color: #39ff14;
        margin-bottom: 0.2rem;
        white-space: pre-wrap;
    }

    .term-matrix {
        color: #003300;
        margin-bottom: 0;
        white-space: pre;
        font-size: 0.7rem;
        line-height: 1.1;
        animation: matrixGlow 0.3s ease-out;
    }

    @keyframes matrixGlow {
        from {
            color: #39ff14;
            text-shadow: 0 0 5px #39ff14;
        }
        to {
            color: #003300;
            text-shadow: none;
        }
    }

    .term-hack {
        color: #ff00aa;
        margin-bottom: 0.15rem;
        white-space: pre-wrap;
    }

    .terminal-prompt {
        display: flex;
        align-items: center;
        margin-top: 0.3rem;
    }

    .prompt-symbol {
        color: #39ff14;
        margin-right: 0.3rem;
    }

    .terminal-input-field {
        flex: 1;
        background: none;
        border: none;
        color: #39ff14;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.82rem;
        outline: none;
        caret-color: #39ff14;
    }

    /* --- Jack In Button --- */
    .jack-in-btn {
        background: transparent;
        border: 1px solid #ff00aa;
        color: #ff00aa;
        font-family: "Share Tech Mono", monospace;
        font-size: 0.6rem;
        padding: 0.15rem 0.5rem;
        cursor: pointer;
        letter-spacing: 1px;
        margin-left: 0.5rem;
        transition: all 0.3s;
        vertical-align: middle;
        animation: jackInPulse 2s ease-in-out infinite;
    }

    .jack-in-btn:hover {
        background: rgba(255, 0, 170, 0.15);
        box-shadow: 0 0 12px rgba(255, 0, 170, 0.4);
        text-shadow: 0 0 6px rgba(255, 0, 170, 0.6);
    }

    @keyframes jackInPulse {
        0%,
        100% {
            border-color: rgba(255, 0, 170, 0.5);
        }
        50% {
            border-color: rgba(255, 0, 170, 1);
        }
    }

    /* --- Responsive --- */
    @media (max-width: 600px) {
        main {
            margin-top: 1rem;
            padding: 1rem 1.2rem;
            background: linear-gradient(
                135deg,
                rgba(5, 8, 15, 0.88),
                rgba(3, 5, 12, 0.92)
            );
        }

        h1 {
            font-size: 1.8rem;
            letter-spacing: 1px;
        }

        h2 {
            font-size: 1.2rem;
        }

        h3 {
            font-size: 1rem;
        }

        .cyber-nav {
            gap: 0.8rem;
            flex-wrap: wrap;
            margin: -1rem -1.2rem 1.5rem -1.2rem;
        }

        .cyber-nav a {
            font-size: 0.6rem;
        }

        .hud-frame {
            padding: 1rem;
        }

        .tag {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
        }

        .contact-bar span,
        .contact-bar a {
            display: inline;
            font-size: 0.75rem;
        }

        .experience-card {
            padding: 1rem;
        }

        .mouse-glow {
            display: none;
        }
    }
</style>
