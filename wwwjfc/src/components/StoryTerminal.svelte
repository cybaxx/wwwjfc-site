<script>
  import { tick } from 'svelte';
  import DraggableWindow from './DraggableWindow.svelte';
  import { gameState, pausableTimeout } from '../lib/gameState.svelte.js';
  import { getNode } from '../lib/storyNodes.js';
  import { zalgoify } from '../lib/adContent.js';

  // Randomly zalgoify a choice label (~20% chance, intensity based on ad tier)
  function maybeZalgo(text) {
    if (Math.random() < 0.2) {
      const intensity = 0.3 + (gameState.adTier - 1) * 0.25;
      return zalgoify(text, intensity);
    }
    return text;
  }

  let { visible = $bindable(false) } = $props();

  let input = $state('');
  let history = $state([
    { type: 'output', text: '> CYBA//OS TERMINAL v2077.04.20' },
    { type: 'output', text: '> Type "help" for commands. Type "play" to start the adventure.' },
  ]);
  let inputEl = $state();
  let bodyEl = $state();

  // Baud rate effect — char-by-char reveal
  const BAUD_CHAR_DELAY = 8;   // ms per character
  const BAUD_LINE_PAUSE = 40;  // ms pause between lines

  let baudQueue = [];
  let baudActive = false;
  let baudText = $state('');
  let baudType = $state('output');
  let baudFull = '';
  let baudIdx = 0;
  let baudTimer = null;
  let baudShowing = $state(false);

  function scrollBottom() {
    tick().then(() => {
      if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  function addLine(text, type = 'output') {
    baudQueue.push({ text, type });
    if (!baudActive) drainBaudQueue();
  }

  function addLineImmediate(text, type = 'output') {
    history = [...history, { type, text }];
    scrollBottom();
  }

  function drainBaudQueue() {
    if (baudTimer) { baudTimer.clear(); baudTimer = null; }
    if (baudQueue.length === 0) {
      baudActive = false;
      baudShowing = false;
      return;
    }
    baudActive = true;
    const line = baudQueue.shift();
    // Input lines and empty lines appear instantly
    if (line.type === 'input' || line.text === '') {
      history = [...history, { type: line.type, text: line.text }];
      scrollBottom();
      drainBaudQueue();
      return;
    }
    // Start char-by-char reveal
    baudFull = line.text;
    baudType = line.type;
    baudIdx = 0;
    baudText = '';
    baudShowing = true;
    scrollBottom();
    baudTickChar();
  }

  function baudTickChar() {
    if (baudIdx < baudFull.length) {
      baudIdx++;
      baudText = baudFull.slice(0, baudIdx);
      scrollBottom();
      baudTimer = pausableTimeout(baudTickChar, BAUD_CHAR_DELAY);
    } else {
      // Line done — commit to history
      history = [...history, { type: baudType, text: baudFull }];
      baudShowing = false;
      baudText = '';
      scrollBottom();
      baudTimer = pausableTimeout(drainBaudQueue, BAUD_LINE_PAUSE);
    }
  }

  function handleSubmit() {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    addLineImmediate(`> ${cmd}`, 'input');
    input = '';
    processCommand(cmd);
  }

  // === CTF CHALLENGE HANDLERS ===
  const challengeHandlers = {
    chrono_coil: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('CHRONO COIL REPAIR — Log Analysis Challenge');
        addLine('  cat chrono.log  — view authentication logs');
        addLine('  grep <pattern>  — filter log entries');
        addLine('  sort            — sort current output');
        addLine('  uniq -c         — count unique entries');
        addLine('  block <IP>      — block a suspicious IP');
        return true;
      }
      if (cmd === 'cat chrono.log') {
        const logData = `[2077-04-20 03:14:07] AUTH src=192.168.1.42 user=admin status=OK geo=NEW_YORK
[2077-04-20 03:14:09] AUTH src=10.0.0.5 user=sysop status=OK geo=CHICAGO
[2077-04-20 03:14:10] AUTH src=192.168.1.42 user=admin status=OK geo=NEW_YORK
[2077-04-20 03:14:13] AUTH src=203.0.113.66 user=root status=OK geo=TOKYO
[2077-04-20 03:14:16] AUTH src=203.0.113.66 user=admin status=OK geo=LONDON
[2077-04-20 03:14:19] AUTH src=203.0.113.66 user=root status=OK geo=SYDNEY
[2077-04-20 03:14:21] AUTH src=10.0.0.5 user=sysop status=OK geo=CHICAGO
[2077-04-20 03:14:22] AUTH src=203.0.113.66 user=admin status=OK geo=SAO_PAULO
[2077-04-20 03:14:25] AUTH src=203.0.113.66 user=root status=OK geo=BERLIN
[2077-04-20 03:14:28] AUTH src=192.168.1.42 user=admin status=OK geo=NEW_YORK
[2077-04-20 03:14:31] AUTH src=203.0.113.66 user=admin status=OK geo=MUMBAI`;
        logData.split('\n').forEach(l => addLine(l, 'output'));
        gameState.challengeState = { ...cs, logViewed: true };
        return true;
      }
      if (parts[0] === 'grep') {
        if (!cs.logViewed) { addLine('No log data loaded. Try: cat chrono.log'); return true; }
        const pattern = parts.slice(1).join(' ');
        if (pattern.includes('203.0.113.66')) {
          addLine('[2077-04-20 03:14:13] AUTH src=203.0.113.66 user=root geo=TOKYO');
          addLine('[2077-04-20 03:14:16] AUTH src=203.0.113.66 user=admin geo=LONDON');
          addLine('[2077-04-20 03:14:19] AUTH src=203.0.113.66 user=root geo=SYDNEY');
          addLine('[2077-04-20 03:14:22] AUTH src=203.0.113.66 user=admin geo=SAO_PAULO');
          addLine('[2077-04-20 03:14:25] AUTH src=203.0.113.66 user=root geo=BERLIN');
          addLine('[2077-04-20 03:14:31] AUTH src=203.0.113.66 user=admin geo=MUMBAI');
          addLine('', 'output');
          addLine('6 entries — 6 different geolocations in 18 seconds. Impossible.', 'warning');
          gameState.challengeState = { ...cs, logViewed: true, ipFound: true };
        } else if (pattern) {
          addLine(`grep: filtering for "${pattern}"...`);
          addLine('Try grepping for a suspicious IP address.', 'warning');
        } else {
          addLine('Usage: grep <pattern>');
        }
        return true;
      }
      if (cmd === 'sort' || cmd === 'uniq -c' || cmd === 'uniq') {
        if (!cs.logViewed) { addLine('No data to sort. Try: cat chrono.log'); return true; }
        addLine('IP frequency count:');
        addLine('  3  192.168.1.42  (NEW_YORK — consistent)');
        addLine('  2  10.0.0.5     (CHICAGO — consistent)');
        addLine('  6  203.0.113.66 (TOKYO/LONDON/SYDNEY/SAO_PAULO/BERLIN/MUMBAI — ANOMALOUS)', 'warning');
        addLine('');
        addLine('203.0.113.66 is hitting from 6 geolocations in 18 seconds.', 'warning');
        gameState.challengeState = { ...cs, logViewed: true, ipFound: true };
        return true;
      }
      if (parts[0] === 'block') {
        const ip = parts[1];
        if (ip === '203.0.113.66') {
          addLine('[FIREWALL] Blocking 203.0.113.66...', 'system');
          addLine('[FIREWALL] Rule applied. Temporal injection vector neutralized.', 'item');
          addLine('');
          addLine('Elliot: "Clean. The coil\'s temporal data is stabilizing."', 'story');
          completeAndReturn();
        } else if (ip) {
          addLine(`[FIREWALL] ${ip} appears to be a legitimate source. Try again.`, 'warning');
        } else {
          addLine('Usage: block <IP>');
        }
        return true;
      }
      return false;
    },

    quantum_flux: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('QUANTUM FLUX REPAIR — DNS Exfiltration Challenge');
        addLine('  tcpdump dns       — capture DNS traffic');
        addLine('  decode <base64>   — decode base64 string');
        addLine('  firewall block-dns <domain> — block DNS domain');
        return true;
      }
      if (cmd === 'tcpdump dns') {
        const lines = [
          'Capturing DNS traffic on quantum-flux0...',
          '',
          '03:22:01 QUERY A Y3liYS1jcmVk.dream-c2.evil  → 203.0.113.99',
          '03:22:02 QUERY A ZW50aWFscy1h.dream-c2.evil  → 203.0.113.99',
          '03:22:03 QUERY A d3Mta2V5LWxl.dream-c2.evil  → 203.0.113.99',
          '03:22:04 QUERY A YWtlZC1mcm9t.dream-c2.evil  → 203.0.113.99',
          '03:22:05 QUERY A LW5ldXJhbC1i.dream-c2.evil  → 203.0.113.99',
          '03:22:06 QUERY A YW5rcw==.dream-c2.evil       → 203.0.113.99',
          '',
          '6 queries captured. All resolving to same C2 server.',
          'Subdomains appear to be base64-encoded data.',
        ];
        lines.forEach(l => addLine(l, l.includes('C2') ? 'warning' : 'output'));
        gameState.challengeState = { ...cs, dnsViewed: true };
        return true;
      }
      if (parts[0] === 'decode') {
        const b64 = parts.slice(1).join(' ');
        if (!b64) { addLine('Usage: decode <base64 string>'); return true; }
        const decodings = {
          'Y3liYS1jcmVk': 'cyba-cred',
          'ZW50aWFscy1h': 'entials-a',
          'd3Mta2V5LWxl': 'ws-key-le',
          'YWtlZC1mcm9t': 'aked-from',
          'LW5ldXJhbC1i': '-neural-b',
          'YW5rcw==': 'anks',
        };
        if (decodings[b64]) {
          addLine(`Decoded: "${decodings[b64]}"`, 'item');
          const decoded = { ...cs, decoded: (cs.decoded || 0) + 1, dnsViewed: true };
          if (decoded.decoded >= 3) {
            addLine('');
            addLine('Combined message: "cyba-credentials-aws-key-leaked-from-neural-banks"', 'warning');
            addLine('The dream is exfiltrating your credentials via DNS tunneling!', 'warning');
            addLine('Block the C2 domain: firewall block-dns dream-c2.evil', 'warning');
          }
          gameState.challengeState = decoded;
        } else {
          addLine(`Decoded: "${atob(b64)}"`, 'output');
        }
        return true;
      }
      if (parts[0] === 'firewall' && parts[1] === 'block-dns') {
        const domain = parts[2];
        if (domain === 'dream-c2.evil') {
          addLine('[FIREWALL] DNS sinkhole applied for dream-c2.evil', 'system');
          addLine('[FIREWALL] Exfiltration channel terminated.', 'item');
          addLine('');
          addLine('Elliot: "No more data leaving. The capacitor\'s quantum field is sealing."', 'story');
          completeAndReturn();
        } else if (domain) {
          addLine(`[FIREWALL] ${domain} is not the C2 domain. Check the DNS captures.`, 'warning');
        } else {
          addLine('Usage: firewall block-dns <domain>');
        }
        return true;
      }
      return false;
    },

    neural_sync: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('NEURAL SYNC REPAIR — Container Escape Challenge');
        addLine('  kubectl get pods           — list running pods');
        addLine('  kubectl logs <pod>         — view pod logs');
        addLine('  kubectl describe pod <pod> — inspect pod config');
        addLine('  kubectl delete pod <pod>   — terminate pod');
        addLine('  kubectl apply patch        — apply security patch');
        return true;
      }
      if (cmd === 'kubectl get pods') {
        addLine('NAMESPACE     NAME                        READY   STATUS    RESTARTS   AGE');
        addLine('default       neural-api-7d4f8b6c9-x2k   1/1     Running   0          47h');
        addLine('default       sync-worker-5c8d9e3f1-m8j   1/1     Running   0          47h');
        addLine('kube-system   dream-monitor-0             1/1     Running   0          47h', 'warning');
        addLine('default       data-cache-2b6a7e4d8-p3n    1/1     Running   0          47h');
        addLine('');
        addLine('Note: dream-monitor-0 in kube-system namespace — unusual.', 'warning');
        gameState.challengeState = { ...cs, podsListed: true };
        return true;
      }
      if (parts[0] === 'kubectl' && parts[1] === 'logs') {
        const pod = parts[2];
        if (pod === 'dream-monitor-0') {
          addLine('[dream-monitor] Scanning host process table...');
          addLine('[dream-monitor] Found PID 1: systemd');
          addLine('[dream-monitor] Found PID 4891: cyba-consciousness');
          addLine('[dream-monitor] Injecting dream hooks into PID 4891...', 'warning');
          addLine('[dream-monitor] Telemetry upload: 847 memories harvested this cycle', 'warning');
          gameState.challengeState = { ...cs, podsListed: true, logsChecked: true };
        } else if (pod) {
          addLine(`[${pod}] Normal operation. No anomalies detected.`);
        } else {
          addLine('Usage: kubectl logs <pod-name>');
        }
        return true;
      }
      if (parts[0] === 'kubectl' && parts[1] === 'describe' && parts[2] === 'pod') {
        const pod = parts[3];
        if (pod === 'dream-monitor-0') {
          addLine('Name:         dream-monitor-0');
          addLine('Namespace:    kube-system');
          addLine('Node:         neural-host-01');
          addLine('Status:       Running');
          addLine('Security Context:', 'warning');
          addLine('  hostPID:    true', 'warning');
          addLine('  hostNetwork: true', 'warning');
          addLine('  privileged:  true', 'warning');
          addLine('');
          addLine('WARNING: Pod has full host access. This is a container escape vector.', 'warning');
          gameState.challengeState = { ...cs, podsListed: true, described: true };
        } else if (pod) {
          addLine(`Name: ${pod}\nSecurity Context: restricted (normal)`);
        } else {
          addLine('Usage: kubectl describe pod <pod-name>');
        }
        return true;
      }
      if (parts[0] === 'kubectl' && parts[1] === 'delete' && parts[2] === 'pod') {
        const pod = parts[3];
        if (pod === 'dream-monitor-0') {
          addLine('pod "dream-monitor-0" deleted', 'system');
          addLine('');
          addLine('Pod terminated. Apply security patch before it respawns.', 'warning');
          addLine('Type: kubectl apply patch', 'warning');
          gameState.challengeState = { ...cs, podsListed: true, podDeleted: true };
        } else if (pod) {
          addLine(`Refusing to delete ${pod} — it's a legitimate workload.`, 'warning');
        } else {
          addLine('Usage: kubectl delete pod <pod-name>');
        }
        return true;
      }
      if (cmd === 'kubectl apply patch') {
        if (!cs.podDeleted) {
          addLine('No security context to patch. Delete the malicious pod first.', 'warning');
        } else {
          addLine('[PATCH] Applying PodSecurityPolicy: deny-host-access', 'system');
          addLine('[PATCH] hostPID: false (enforced)', 'item');
          addLine('[PATCH] hostNetwork: false (enforced)', 'item');
          addLine('[PATCH] privileged: false (enforced)', 'item');
          addLine('[PATCH] Policy applied. Container escape vector eliminated.', 'item');
          addLine('');
          addLine('Elliot: "No more surveillance pods. The neural bridge is clean."', 'story');
          completeAndReturn();
        }
        return true;
      }
      return false;
    },

    temporal_drift: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('TEMPORAL DRIFT REPAIR — Secret Sprawl Challenge');
        addLine('  git log              — view commit history');
        addLine('  git show <hash>      — show commit details');
        addLine('  git diff <hash>      — show commit diff');
        addLine('  git revert <hash>    — revert a commit');
        addLine('  vault store <key>    — store secret in vault');
        return true;
      }
      if (cmd === 'git log') {
        addLine('commit a1b2c3d (HEAD -> main)');
        addLine('  Author: temporal-sys');
        addLine('  Date: 2077-04-20');
        addLine('  "Update drift compensation algorithm"');
        addLine('');
        addLine('commit e4f5g6h');
        addLine('  Author: temporal-sys');
        addLine('  Date: 2077-04-19');
        addLine('  "Refactor calibration module"');
        addLine('');
        addLine('commit x7y8z9w');
        addLine('  Author: dream-inject', 'warning');
        addLine('  Date: 2077-04-18', 'warning');
        addLine('  "Add configuration helpers"', 'warning');
        addLine('');
        addLine('commit p0q1r2s');
        addLine('  Author: temporal-sys');
        addLine('  Date: 2077-04-17');
        addLine('  "Initial temporal drift setup"');
        addLine('');
        addLine('Note: commit x7y8z9w has suspicious author "dream-inject"', 'warning');
        gameState.challengeState = { ...cs, logViewed: true };
        return true;
      }
      if (parts[0] === 'git' && parts[1] === 'show') {
        const hash = parts[2];
        if (hash === 'x7y8z9w') {
          addLine('commit x7y8z9w');
          addLine('Author: dream-inject');
          addLine('Date: 2077-04-18');
          addLine('');
          addLine('diff --git a/config/temporal.env b/config/temporal.env');
          addLine('+AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE', 'warning');
          addLine('+AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'warning');
          addLine('+DREAM_BACKDOOR_TOKEN=eyJhbGciOiJIUzI1NiJ9.dream-root', 'warning');
          addLine('');
          addLine('HARDCODED SECRETS DETECTED!', 'warning');
          gameState.challengeState = { ...cs, logViewed: true, secretFound: true };
        } else if (hash) {
          addLine(`commit ${hash}: Normal code changes. No secrets.`);
        } else {
          addLine('Usage: git show <commit-hash>');
        }
        return true;
      }
      if (parts[0] === 'git' && parts[1] === 'diff') {
        const hash = parts[2];
        if (hash === 'x7y8z9w') {
          addLine('+AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE', 'warning');
          addLine('+AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'warning');
          addLine('+DREAM_BACKDOOR_TOKEN=eyJhbGciOiJIUzI1NiJ9.dream-root', 'warning');
        } else {
          addLine('Normal diff output. No secrets.');
        }
        return true;
      }
      if (parts[0] === 'git' && parts[1] === 'revert') {
        const hash = parts[2];
        if (hash === 'x7y8z9w') {
          addLine('[GIT] Reverting commit x7y8z9w...', 'system');
          addLine('[GIT] Revert successful. Secrets removed from history.', 'item');
          addLine('');
          addLine('Now store the keys securely: vault store <key-name>', 'warning');
          gameState.challengeState = { ...cs, logViewed: true, secretFound: true, reverted: true };
        } else if (hash) {
          addLine(`That commit doesn't contain secrets. Check git log for the suspicious one.`, 'warning');
        } else {
          addLine('Usage: git revert <commit-hash>');
        }
        return true;
      }
      if (parts[0] === 'vault' && parts[1] === 'store') {
        if (!cs.reverted) {
          addLine('Revert the malicious commit first before storing secrets.', 'warning');
        } else {
          addLine('[VAULT] Storing AWS credentials in encrypted vault...', 'system');
          addLine('[VAULT] AKIAIOSFODNN7EXAMPLE → vault:///secrets/aws/access_key', 'item');
          addLine('[VAULT] Secret access key → vault:///secrets/aws/secret_key', 'item');
          addLine('[VAULT] Backdoor token invalidated and quarantined.', 'item');
          addLine('');
          addLine('Elliot: "Secrets belong in vaults, not in git. The compensator is stabilizing."', 'story');
          completeAndReturn();
        }
        return true;
      }
      return false;
    },

    dream_anchor: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('DREAM ANCHOR REPAIR — Terraform State Drift Challenge');
        addLine('  terraform show              — show current state');
        addLine('  terraform plan              — show planned changes');
        addLine('  terraform state rm <addr>   — remove resource from state');
        addLine('  terraform import <addr> <id> — import existing resource');
        return true;
      }
      if (cmd === 'terraform show') {
        addLine('# dream_anchor.tf state');
        addLine('');
        addLine('resource "anchor_node" "primary" {');
        addLine('  id     = "anchor-001"');
        addLine('  status = "active"');
        addLine('}');
        addLine('');
        addLine('resource "anchor_node" "phantom" {', 'warning');
        addLine('  id     = "anchor-ghost-999"', 'warning');
        addLine('  status = "active"', 'warning');
        addLine('}', 'warning');
        addLine('');
        addLine('Note: anchor_node.phantom exists in state but may not exist in reality.', 'warning');
        gameState.challengeState = { ...cs, stateViewed: true };
        return true;
      }
      if (cmd === 'terraform plan') {
        addLine('Terraform will perform the following actions:');
        addLine('');
        addLine('  ~ anchor_node.phantom — state says "active" but resource NOT FOUND', 'warning');
        addLine('    → Plan: destroy (resource already gone)');
        addLine('');
        addLine('  + anchor_node.stabilizer — exists in reality but NOT in state', 'warning');
        addLine('    → Real ID: "anchor-stabilizer-42"');
        addLine('    → Plan: no action (unmanaged)');
        addLine('');
        addLine('State drift detected: 1 phantom resource, 1 untracked resource.', 'warning');
        addLine('Fix: terraform state rm anchor_node.phantom', 'warning');
        addLine('Fix: terraform import anchor_node.stabilizer anchor-stabilizer-42', 'warning');
        gameState.challengeState = { ...cs, stateViewed: true, planViewed: true };
        return true;
      }
      if (parts[0] === 'terraform' && parts[1] === 'state' && parts[2] === 'rm') {
        const addr = parts[3];
        if (addr === 'anchor_node.phantom') {
          addLine('[TERRAFORM] Removing anchor_node.phantom from state...', 'system');
          addLine('[TERRAFORM] Resource removed. State no longer tracks ghost resource.', 'item');
          gameState.challengeState = { ...cs, stateViewed: true, phantomRemoved: true };
          if (cs.stabilierImported) {
            addLine('');
            addLine('State drift resolved. All resources accounted for.', 'item');
            addLine('');
            addLine('Elliot: "State matches reality. The anchor is locked in."', 'story');
            completeAndReturn();
          } else {
            addLine('');
            addLine('Still need to import the untracked stabilizer resource.', 'warning');
          }
        } else if (addr) {
          addLine(`Cannot remove ${addr} — it's a legitimate resource.`, 'warning');
        } else {
          addLine('Usage: terraform state rm <resource-address>');
        }
        return true;
      }
      if (parts[0] === 'terraform' && parts[1] === 'import') {
        const addr = parts[2];
        const id = parts[3];
        if (addr === 'anchor_node.stabilizer' && id === 'anchor-stabilizer-42') {
          addLine('[TERRAFORM] Importing anchor_node.stabilizer (anchor-stabilizer-42)...', 'system');
          addLine('[TERRAFORM] Resource imported successfully. Now managed by Terraform.', 'item');
          gameState.challengeState = { ...cs, stateViewed: true, stabilierImported: true };
          if (cs.phantomRemoved) {
            addLine('');
            addLine('State drift resolved. All resources accounted for.', 'item');
            addLine('');
            addLine('Elliot: "State matches reality. The anchor is locked in."', 'story');
            completeAndReturn();
          } else {
            addLine('');
            addLine('Still need to remove the phantom resource from state.', 'warning');
          }
        } else if (addr && id) {
          addLine(`Cannot import ${addr} with id ${id} — check terraform plan for correct values.`, 'warning');
        } else {
          addLine('Usage: terraform import <resource-address> <resource-id>');
        }
        return true;
      }
      return false;
    },

    bonus_rop: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('ROP CHAIN CONSTRUCTION — Binary Exploitation Challenge');
        addLine('  disas vuln_func         — disassemble vulnerable function');
        addLine('  info registers          — show register state');
        addLine('  ropper gadgets          — search for ROP gadgets');
        addLine('  craft_chain <g1> <g2> <addr> — build ROP chain');
        return true;
      }
      if (cmd === 'disas vuln_func') {
        addLine('Dump of assembler code for function vuln_func:');
        addLine('  0x401156 <+0>:   push   rbp');
        addLine('  0x401157 <+1>:   mov    rbp, rsp');
        addLine('  0x40115a <+4>:   sub    rsp, 0x40', 'warning');
        addLine('  0x40115e <+8>:   lea    rax, [rbp-0x40]');
        addLine('  0x401162 <+12>:  mov    rdi, rax');
        addLine('  0x401165 <+15>:  call   0x401040 <gets@plt>', 'warning');
        addLine('  0x40116a <+20>:  leave');
        addLine('  0x40116b <+21>:  ret');
        addLine('');
        addLine('Buffer is 64 bytes (0x40). gets() has no bounds check.', 'warning');
        addLine('Overflow offset: 72 bytes (64 buf + 8 saved rbp)', 'warning');
        gameState.challengeState = { ...cs, disassembled: true };
        return true;
      }
      if (cmd === 'info registers') {
        addLine('rax  0x7fffffffe100');
        addLine('rbx  0x0');
        addLine('rcx  0x401176');
        addLine('rdx  0x0');
        addLine('rsp  0x7fffffffe140');
        addLine('rbp  0x7fffffffe140');
        addLine('rip  0x40116b <vuln_func+21>');
        return true;
      }
      if (cmd === 'ropper gadgets') {
        addLine('Searching for gadgets in vuln_server...');
        addLine('');
        addLine('  0x401263: pop rdi; ret', 'item');
        addLine('  0x401261: pop rsi; pop r15; ret', 'item');
        addLine('  0x40116b: ret');
        addLine('  0x401199: pop rbp; ret');
        addLine('  0x401040: gets@plt');
        addLine('');
        addLine('Shellcode address (known): 0x7fffffffe200', 'warning');
        addLine('');
        addLine('Key gadgets: 0x401263 (pop rdi; ret) + 0x401261 (pop rsi; pop r15; ret)', 'warning');
        addLine('Craft chain: craft_chain 0x401263 0x401261 0x7fffffffe200', 'warning');
        gameState.challengeState = { ...cs, gadgetsFound: true };
        return true;
      }
      if (parts[0] === 'craft_chain') {
        if (parts.length < 4) { addLine('Usage: craft_chain <gadget1> <gadget2> <shellcode_addr>'); return true; }
        if (parts[1] === '0x401263' && parts[2] === '0x401261' && parts[3] === '0x7fffffffe200') {
          addLine('[EXPLOIT] Building ROP chain...', 'system');
          addLine('[EXPLOIT] Padding: 72 bytes of "A"', 'system');
          addLine('[EXPLOIT] Gadget 1: 0x401263 (pop rdi; ret)', 'item');
          addLine('[EXPLOIT] Gadget 2: 0x401261 (pop rsi; pop r15; ret)', 'item');
          addLine('[EXPLOIT] Shellcode: 0x7fffffffe200', 'item');
          addLine('[EXPLOIT] Sending payload...', 'system');
          addLine('');
          addLine('$ whoami', 'item');
          addLine('root', 'item');
          addLine('');
          addLine('Shell popped. ROP chain successful.', 'item');
          addLine('');
          gameState.completeBonusChallenge('bonus_rop');
          completeBonusAndReturn('bonus_rop');
        } else {
          addLine('[EXPLOIT] Chain failed — segfault. Check gadget addresses.', 'warning');
          addLine('Hint: use "ropper gadgets" to find correct addresses.', 'warning');
        }
        return true;
      }
      return false;
    },

    bonus_forensics: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('MEMORY FORENSICS — Incident Response Challenge');
        addLine('  volatility pslist           — list running processes');
        addLine('  volatility pstree           — show process tree');
        addLine('  volatility memdump --pid N  — dump process memory');
        addLine('  strings dump.raw | grep X   — search memory strings');
        addLine('  report <findings>           — submit analysis report');
        return true;
      }
      if (cmd === 'volatility pslist') {
        addLine('Volatility 3 — Process Listing');
        addLine('PID    PPID   NAME              THREADS  CREATE TIME');
        addLine('4      0      System            142      2077-04-20 01:00:00');
        addLine('412    4      smss.exe          2        2077-04-20 01:00:01');
        addLine('528    412    csrss.exe         12       2077-04-20 01:00:02');
        addLine('612    528    wininit.exe       3        2077-04-20 01:00:03');
        addLine('1024   612    svchost.exe       18       2077-04-20 01:00:05');
        addLine('1337   612    svchost.exe       4        2077-04-20 01:05:47', 'warning');
        addLine('2048   1024   explorer.exe      22       2077-04-20 01:01:00');
        addLine('3172   2048   chrome.exe        8        2077-04-20 02:15:30');
        addLine('');
        addLine('Note: PID 1337 — svchost.exe spawned 5 minutes after boot with only 4 threads.', 'warning');
        addLine('Legitimate svchost.exe instances spawn during init, not 5 min later.', 'warning');
        gameState.challengeState = { ...cs, pslistDone: true };
        return true;
      }
      if (cmd === 'volatility pstree') {
        addLine('Process Tree:');
        addLine('  System (4)');
        addLine('    smss.exe (412)');
        addLine('      csrss.exe (528)');
        addLine('        wininit.exe (612)');
        addLine('          svchost.exe (1024)');
        addLine('            explorer.exe (2048)');
        addLine('              chrome.exe (3172)');
        addLine('          svchost.exe (1337)', 'warning');
        addLine('');
        addLine('PID 1337 has no child processes — unusual for svchost.', 'warning');
        gameState.challengeState = { ...cs, pslistDone: true };
        return true;
      }
      if (cmd.startsWith('volatility memdump --pid')) {
        const pid = parts[parts.length - 1];
        if (pid === '1337') {
          addLine('[MEMDUMP] Dumping process memory for PID 1337...', 'system');
          addLine('[MEMDUMP] Written to dump.raw (24MB)', 'item');
          addLine('');
          addLine('Memory dump ready. Use: strings dump.raw | grep flag', 'warning');
          gameState.challengeState = { ...cs, pslistDone: true, memDumped: true };
        } else {
          addLine(`[MEMDUMP] PID ${pid} — normal process. No anomalies in memory.`);
        }
        return true;
      }
      if (cmd.startsWith('strings dump.raw')) {
        if (!cs.memDumped) { addLine('No dump file. Run: volatility memdump --pid <N>'); return true; }
        const grepTarget = cmd.includes('grep') ? cmd.split('grep').pop().trim() : '';
        if (grepTarget === 'flag' || grepTarget === 'FLAG' || grepTarget === 'inject' || grepTarget === '') {
          addLine('Searching strings in dump.raw...', 'system');
          addLine('');
          addLine('  [+] "MZ" header found at offset 0x1A000 — embedded PE', 'warning');
          addLine('  [+] "ReflectiveLoader" — reflective DLL injection signature', 'warning');
          addLine('  [+] FLAG{pr0c3ss_1nj3ct10n_d3t3ct3d}', 'item');
          addLine('  [+] C2 beacon: https://dream-c2.morpheus.corp/callback', 'warning');
          addLine('');
          addLine('Injected payload found. Submit: report reflective_dll_injection', 'warning');
          gameState.challengeState = { ...cs, pslistDone: true, memDumped: true, flagFound: true };
        } else {
          addLine(`strings: no matches for "${grepTarget}" in dump.raw`);
        }
        return true;
      }
      if (parts[0] === 'report') {
        const finding = parts.slice(1).join('_').toLowerCase();
        if (finding.includes('reflective') && finding.includes('injection') || finding.includes('dll_injection') || finding.includes('process_injection')) {
          addLine('[REPORT] Submitting analysis...', 'system');
          addLine('[REPORT] Finding: Reflective DLL injection via PID 1337', 'item');
          addLine('[REPORT] Payload: Embedded PE with C2 beacon', 'item');
          addLine('[REPORT] Flag: FLAG{pr0c3ss_1nj3ct10n_d3t3ct3d}', 'item');
          addLine('');
          addLine('Analysis complete. The memory never lies.', 'item');
          gameState.completeBonusChallenge('bonus_forensics');
          completeBonusAndReturn('bonus_forensics');
        } else {
          addLine(`[REPORT] "${finding}" — incorrect classification. Analyze the strings output more carefully.`, 'warning');
        }
        return true;
      }
      return false;
    },

    bonus_fuzzing: (cmd, parts) => {
      const cs = gameState.challengeState;
      if (cmd === 'help') {
        addLine('FUZZ CAMPAIGN — Bug Hunting Challenge');
        addLine('  afl-fuzz -i corpus/ -o findings/ ./target  — run fuzzer');
        addLine('  ls findings/crashes/    — list crash files');
        addLine('  triage <crash_file>     — analyze a crash');
        addLine('  report <vuln_type> <function> — submit finding');
        return true;
      }
      if (cmd === 'afl-fuzz -i corpus/ -o findings/ ./target') {
        addLine('[AFL] Starting coverage-guided fuzzing...', 'system');
        addLine('[AFL] Loading 10 seed files from corpus/', 'system');
        addLine('[AFL] Calibrating with initial seeds...');
        addLine('');
        addLine('[AFL] ── Session Stats ──');
        addLine('[AFL]  exec speed: 1,247/sec');
        addLine('[AFL]  total paths: 342');
        addLine('[AFL]  unique crashes: 3', 'warning');
        addLine('[AFL]  hangs: 1');
        addLine('[AFL]  coverage: 67.3%');
        addLine('');
        addLine('Fuzzer found 3 unique crashes. Check: ls findings/crashes/', 'warning');
        gameState.challengeState = { ...cs, fuzzed: true };
        return true;
      }
      if (cmd === 'ls findings/crashes/' || cmd === 'ls findings/crashes') {
        if (!cs.fuzzed) { addLine('No findings yet. Run the fuzzer first.'); return true; }
        addLine('id_000  id_001  id_002');
        return true;
      }
      if (parts[0] === 'triage') {
        if (!cs.fuzzed) { addLine('No crashes to triage. Run the fuzzer first.'); return true; }
        const file = parts[1];
        if (file === 'id_000') {
          addLine('[TRIAGE] Analyzing crash id_000...', 'system');
          addLine('');
          addLine('  Signal: SIGSEGV (Segmentation fault)');
          addLine('  Fault addr: 0x4141414141414141');
          addLine('  Instruction: mov rax, [rdi]');
          addLine('  Function: parse_header() at imgparse.c:147', 'warning');
          addLine('  Root cause: heap-buffer-overflow in parse_header()', 'warning');
          addLine('');
          addLine('Controlled crash in parse_header. Report: report heap_overflow parse_header', 'warning');
          gameState.challengeState = { ...cs, fuzzed: true, triaged: true };
        } else if (file === 'id_001') {
          addLine('[TRIAGE] Analyzing crash id_001...', 'system');
          addLine('  Signal: SIGABRT');
          addLine('  Function: validate_checksum()');
          addLine('  Root cause: assertion failure (non-exploitable)');
        } else if (file === 'id_002') {
          addLine('[TRIAGE] Analyzing crash id_002...', 'system');
          addLine('  Signal: SIGSEGV');
          addLine('  Function: free()');
          addLine('  Root cause: double-free in cleanup_buffers() (potential exploit)');
        } else {
          addLine('Usage: triage <crash_file> (id_000, id_001, id_002)');
        }
        return true;
      }
      if (parts[0] === 'report' && parts.length >= 3) {
        const vulnType = parts[1].toLowerCase();
        const func = parts[2].toLowerCase();
        if ((vulnType.includes('heap') && vulnType.includes('overflow') || vulnType === 'heap_overflow' || vulnType === 'heap-buffer-overflow') && func.includes('parse_header')) {
          addLine('[REPORT] Submitting vulnerability report...', 'system');
          addLine('[REPORT] Type: Heap Buffer Overflow', 'item');
          addLine('[REPORT] Function: parse_header()', 'item');
          addLine('[REPORT] Severity: CRITICAL', 'item');
          addLine('[REPORT] Exploitability: HIGH (controlled write primitive)', 'item');
          addLine('');
          addLine('Finding accepted. The fuzzer reveals what tests cannot.', 'item');
          gameState.completeBonusChallenge('bonus_fuzzing');
          completeBonusAndReturn('bonus_fuzzing');
        } else {
          addLine(`[REPORT] "${vulnType} in ${func}" — not the primary finding. Triage id_000 for the critical bug.`, 'warning');
        }
        return true;
      }
      return false;
    },
  };

  function completeBonusAndReturn(challengeId) {
    gameState.abandonChallenge();
    addLine('');
    addLine(`[BONUS CHALLENGE COMPLETE: ${challengeId.replace('bonus_', '').toUpperCase()}]`, 'item');
    addLine('');
    addLine('Returning to archives terminal...', 'system');
    gameState.navigate('zeroday_terminal');
  }

  function completeAndReturn() {
    const partId = gameState.activeChallenge;
    gameState.completeChallenge();
    const partName = gameState.TIME_MACHINE_PARTS.find(p => p.id === partId)?.name;
    addLine('');
    addLine(`[${partName} — REPAIRED]`, 'item');
    addLine('');
    addLine('Returning to workbench...', 'system');
    gameState.navigate('fsociety_workbench');
  }

  function processCommand(cmd) {
    const parts = cmd.split(' ');
    const action = parts[0];

    // Challenge mode — route to challenge handler
    if (gameState.activeChallenge) {
      const handler = challengeHandlers[gameState.activeChallenge];
      if (handler && handler(cmd, parts)) return;
      if (action === 'exit' || action === 'quit' || action === 'back') {
        gameState.abandonChallenge();
        addLine('Leaving challenge. Return to the workbench to try again.', 'system');
        gameState.navigate('fsociety_workbench');
        return;
      }
      addLine(`Command not recognized in this challenge. Type "help" for available commands.`);
      return;
    }

    const commands = {
      help: () => {
        addLine('GAME COMMANDS:');
        addLine('  play       — start/resume the adventure');
        addLine('  look       — describe current location');
        addLine('  inventory  — show collected parts');
        addLine('  scan       — scan for time machine components');
        addLine('  go <place> — navigate (skills, wetfish, cc, stg, edu, community, fsociety, archives)');
        addLine('  diagnostics — run system diagnostics');
        addLine('  talk       — interact with NPCs at current location');
        addLine('  take       — pick up items');
        addLine('  hack       — attempt to hack systems');
        addLine('  status     — show game status');
        addLine('ARCHIVE COMMANDS:');
        addLine('  library        — view collected 0day scrolls');
        addLine('  study <topic>  — study exploitation topics');
        addLine('  resources      — curated exploit dev references');
        addLine('SYSTEM COMMANDS:');
        addLine('  whoami, neofetch, uptime, clear, exit');
      },

      play: () => {
        if (!gameState.gameStarted) {
          gameState.startGame();
          gameState.navigate('wake_up');
          addLine('[INITIALIZING CYBER DREAM SEQUENCE...]', 'system');
          addLine('The story dialog has opened. Use it to navigate choices.', 'system');
        } else {
          gameState.showStory();
          addLine('Adventure already running. Dialog reopened.', 'system');
        }
      },

      look: () => {
        const node = getNode(gameState.currentNode);
        if (!node) { addLine('You drift in empty data space...'); return; }
        node.text.split('\n').forEach(line => addLine(line, 'story'));
        addLine('');
        if (node.choices) {
          node.choices.forEach(c => addLine(`  ${maybeZalgo(c.text)}`, 'choice'));
        }
      },

      inventory: () => {
        addLine('═══ TIME MACHINE PARTS ═══');
        gameState.TIME_MACHINE_PARTS.forEach(p => {
          const has = gameState.hasItem(p.id);
          const fixed = gameState.isPartFixed(p.id);
          if (fixed) {
            addLine(`  [✓] ${p.name} — REPAIRED`, 'item');
          } else if (has) {
            addLine(`  [⚠] ${p.name} — DAMAGED (repair at fsociety arcade)`, 'warning');
          } else {
            addLine(`  [ ] ${p.name}`);
          }
        });
        addLine(`\nCompletion: ${gameState.completionPercent}%`);
        if (gameState.allPartsFixed) {
          addLine('\n[ALL PARTS REPAIRED — Type "assemble" to build the Time Machine]', 'system');
        } else if (gameState.partsCollected.length === 5) {
          addLine('\n[All parts collected but damaged — visit fsociety arcade to repair]', 'warning');
        }
      },

      scan: () => {
        addLine('[SCANNING FOR TEMPORAL SIGNATURES...]', 'system');
        gameState.TIME_MACHINE_PARTS.forEach(p => {
          const has = gameState.hasItem(p.id);
          if (!has) {
            addLine(`  ◈ ${p.name} — Signal detected: ${p.location.toUpperCase()} district`, 'warning');
          }
        });
        const missing = gameState.TIME_MACHINE_PARTS.filter(p => !gameState.hasItem(p.id));
        if (missing.length === 0) {
          addLine('  All components acquired!', 'item');
        }
        // Scan for 0day scrolls in current location
        const locationScrolls = {
          'skills_entrance': 'stack_frame',
          'wetfish_entrance': 'heap_feng_shui',
          'cc_entrance': 'aslr_entropy',
          'stg_entrance': 'race_condition',
          'education_entrance': 'stack_canary',
          'jfc_entrance': 'format_string',
          'community_entrance': 'got_overwrite',
          'fsociety_entrance': 'use_after_free',
        };
        const scrollId = locationScrolls[gameState.currentNode];
        if (scrollId && !gameState.hasScroll(scrollId)) {
          const scrollNames = {
            'stack_frame': 'The Stack Frame', 'heap_feng_shui': 'Heap Feng Shui',
            'aslr_entropy': 'ASLR & the Entropy Game', 'race_condition': 'Race Condition Windows',
            'stack_canary': 'Canary in the Stack Mine', 'format_string': 'Format String Oracles',
            'got_overwrite': 'The GOT Overwrite', 'use_after_free': 'The Use-After-Free',
          };
          addLine('');
          addLine(`  ◈ 0day Scroll detected: "${scrollNames[scrollId]}"`, 'item');
          addLine('  A glowing data-scroll materializes from the noise...', 'story');
          gameState.findScroll(scrollId);
          addLine('  [SCROLL ACQUIRED — view with "library" command]', 'item');
        }
      },

      go: () => {
        const dest = parts[1];
        const destinations = {
          skills: 'skills_entrance',
          wetfish: 'wetfish_entrance',
          cc: 'cc_entrance',
          clearcaptions: 'cc_entrance',
          stg: 'stg_entrance',
          edu: 'education_entrance',
          education: 'education_entrance',
          community: 'community_entrance',
          jfc: 'jfc_entrance',
          jellyfish: 'jfc_entrance',
          hub: 'hub_nexus',
          nexus: 'hub_nexus',
          fsociety: 'fsociety_entrance',
          arcade: 'fsociety_entrance',
          archives: 'zeroday_entrance',
          zeroday: 'zeroday_entrance',
        };
        if (!dest || !destinations[dest]) {
          addLine('Go where? Options: skills, wetfish, cc, stg, edu, community, hub, fsociety, archives');
          return;
        }
        if (!gameState.gameStarted) {
          addLine('Start the adventure first. Type "play".');
          return;
        }
        gameState.navigate(destinations[dest]);
        addLine(`[NAVIGATING TO ${dest.toUpperCase()}...]`, 'system');
        if (Math.random() < 0.3) gameState.requestAd();
      },

      status: () => {
        addLine('═══ SYSTEM STATUS ═══');
        addLine(`  Current Location: ${gameState.currentNode}`);
        addLine(`  Parts Collected: ${gameState.partsCollected.length}/5`);
        addLine(`  Nodes Visited: ${gameState.visitedNodes.size}`);
        addLine(`  Ad Tier: ${gameState.adTier}`);
        addLine(`  Credits: ¥${gameState.credits} CR`);
        addLine(`  Ads Survived: ${gameState.totalAdsShown}`);
        addLine(`  Dream Stability: ${Math.max(0, 100 - gameState.visitedNodes.size * 3)}%`);
      },

      assemble: () => {
        if (!gameState.allPartsFixed) {
          if (gameState.partsCollected.length < 5) {
            addLine('Missing components. Use "inventory" to check.', 'warning');
          } else {
            addLine('Parts are damaged. Visit the fsociety arcade to repair them.', 'warning');
          }
          return;
        }
        gameState.navigate('ending_escape');
        const node = getNode('ending_escape');
        if (node) {
          node.text.split('\n').forEach(line => addLine(line, 'story'));
        }
      },

      clear: () => {
        history = [];
      },

      exit: () => {
        visible = false;
        history = [
          { type: 'output', text: '> CYBA//OS TERMINAL v2077.04.20' },
          { type: 'output', text: '> Type "help" for commands. Type "play" to start the adventure.' },
        ];
      },

      whoami: () => {
        addLine('CYBA-7 — Netrunner Class\nDesignation: Runner\nClearance: ULTRAVIOLET\nStatus: DREAMING');
      },

      neofetch: () => {
        addLine(`        ╱╲         cyba@dreamnet
       ╱  ╲        ──────────────
      ╱    ╲       OS: CyberDream v4891
     ╱  ╱╲  ╲      Kernel: MORPHEUS 1.0
    ╱  ╱  ╲  ╲     Shell: neural-link
   ╱  ╱    ╲  ╲    Terminal: HUD v2077
  ╱  ╱______╲  ╲   CPU: Wetware v3.0
 ╱______________╲  Memory: ${gameState.partsCollected.length}/5 parts
                   Dream Cycle: 4,891`);
      },

      diagnostics: () => {
        addLine('[RUNNING SYSTEM DIAGNOSTICS...]', 'system');
        addLine('');
        addLine('NEURAL LINK: ACTIVE (unstable)');
        addLine('ICE SHIELDS: MINIMAL');
        addLine(`MEMORY BANKS: ${Math.max(0, 100 - gameState.visitedNodes.size * 3)}% INTEGRITY`);
        addLine(`TIME MACHINE STATUS: ${gameState.allPartsFixed ? 'READY' : 'INOPERABLE'} — ${gameState.fixedParts.size}/5 REPAIRED`);
        addLine(`PARTS COLLECTED: ${gameState.partsCollected.length}/5`);
        addLine(`DREAM STABILITY: ${Math.max(0, 100 - gameState.visitedNodes.size * 3)}%`);
        if (gameState.partsCollected.length > 0 && gameState.fixedParts.size < gameState.partsCollected.length) {
          addLine('');
          addLine('WARNING: Collected parts show dream corruption. Visit fsociety arcade for repair.', 'warning');
        }
      },

      uptime: () => {
        addLine(`Dream uptime: ∞\nReal time missing: UNKNOWN\nCycles survived: 4,891\nEscape attempts: THIS ONE`);
      },

      library: () => {
        const SCROLLS = [
          { id: 'stack_frame', name: 'The Stack Frame', desc: 'The stack grows downward. Local variables sit below the saved base pointer and return address. Overflow the buffer, overwrite the return — control the instruction pointer, control the world.' },
          { id: 'rop_thinking', name: 'Return-Oriented Thinking', desc: 'When NX kills shellcode on the stack, borrow the program\'s own instructions. Chain gadgets ending in RET — pop rdi; ret, pop rsi; ret — to build Turing-complete computation from fragments.' },
          { id: 'heap_feng_shui', name: 'Heap Feng Shui', desc: 'Shape the heap through strategic allocations and frees. Control which chunks are adjacent, which bins they land in. When the allocator gives you a chunk overlapping a victim — you own the process.' },
          { id: 'fuzzer_intuition', name: "The Fuzzer's Intuition", desc: 'Coverage-guided fuzzers like AFL mutate inputs and track which code paths they unlock. More coverage = more bugs found. The fuzzer doesn\'t understand the protocol — it evolves inputs that do.' },
          { id: 'ghidra_eye', name: "Ghidra's Eye", desc: 'NSA\'s gift to reverse engineering. Load the binary, let auto-analysis run, then read the decompiler output like a novel written by a paranoid compiler. Rename variables. Follow cross-references. The binary tells its own story.' },
          { id: 'use_after_free', name: 'The Use-After-Free', desc: 'Free a chunk, but keep the pointer. Allocate something else into that space. Now the dangling pointer refers to attacker-controlled data. Type confusion, vtable hijacking, arbitrary read/write — all from a single forgotten pointer.' },
          { id: 'format_string', name: 'Format String Oracles', desc: 'printf(user_input) is a read/write primitive. %x leaks stack values. %n writes to memory. With careful format strings, you can leak canaries, defeat ASLR, and overwrite GOT entries — all through a single printf call.' },
          { id: 'aslr_entropy', name: 'ASLR & the Entropy Game', desc: 'Address Space Layout Randomization shuffles the deck every execution. But entropy is finite: 28 bits on 64-bit Linux for mmap. Leak one address and the whole library is derandomized. Information leaks are ASLR\'s nemesis.' },
          { id: 'stack_canary', name: 'Canary in the Stack Mine', desc: 'A random value placed between the buffer and return address. Overflow corrupts it; the program aborts before returning. But canaries can be leaked byte-by-byte, brute-forced on forking servers, or bypassed by overwriting other targets.' },
          { id: 'got_overwrite', name: 'The GOT Overwrite', desc: 'The Global Offset Table holds resolved library addresses. Partial RELRO leaves it writable. Overwrite puts@GOT with system — next call to puts() executes system() instead. The PLT is your trampoline.' },
          { id: 'race_condition', name: 'Race Condition Windows', desc: 'Time-of-check to time-of-use: the program checks permissions, then acts. In the gap between check and use, swap the file, change the symlink, alter the state. The race is won by whoever controls timing.' },
          { id: 'null_byte', name: 'The Null Byte Terminator', desc: 'Off-by-one: write one byte past the buffer. If that byte is null, it clears the LSB of the next chunk\'s size field, shrinking it. The allocator now gives overlapping chunks. One null byte. Total control.' },
        ];
        addLine('═══ 0DAY SCROLL LIBRARY ═══');
        const found = SCROLLS.filter(s => gameState.hasScroll(s.id));
        const unfound = SCROLLS.filter(s => !gameState.hasScroll(s.id));
        if (found.length === 0) {
          addLine('  No scrolls collected yet. Explore the Zero Day Archives or scan in districts.');
          addLine(`  ${SCROLLS.length} scrolls waiting to be found.`);
        } else {
          found.forEach(s => addLine(`  [✓] ${s.name}`, 'item'));
          unfound.forEach(s => addLine(`  [ ] ${s.name}`));
          addLine(`\n  ${found.length}/${SCROLLS.length} scrolls collected.`);
          addLine('  Use "study <topic>" to read a collected scroll in detail.');
        }
      },

      study: () => {
        const topic = parts.slice(1).join(' ').toLowerCase();
        const STUDY_TOPICS = {
          'rop': { title: 'Return-Oriented Programming', scroll: 'rop_thinking', content: 'ROP chains are built by finding instruction sequences (gadgets) that end in RET.\n\nThe basic pattern:\n1. Find overflow offset (buffer size + saved rbp)\n2. Locate gadgets: pop rdi; ret (0x401263 is common in small binaries)\n3. Chain: [padding] [pop_rdi] [/bin/sh_addr] [system_addr]\n\nTools: ropper, ROPgadget, pwntools\nKey concept: With enough gadgets, ROP is Turing-complete.\nDefense: Stack canaries, ASLR, CET (shadow stack)' },
          'heap': { title: 'Heap Exploitation', scroll: 'heap_feng_shui', content: 'glibc malloc organizes free chunks into bins:\n- tcache: per-thread, LIFO, 7 entries per size (fastest)\n- fastbins: global LIFO, no coalescing\n- unsorted bin: recently freed, any size\n- small/large bins: sorted by size\n\nTechniques:\n- tcache poisoning: corrupt fd pointer → arbitrary alloc\n- fastbin dup: double-free → overlapping chunks\n- unsorted bin attack: partial overwrite → leak libc\n- House of Force: overwrite top chunk size → controlled allocation\n\nKey: shape the heap layout BEFORE the vulnerability fires.' },
          'fuzzing': { title: 'Coverage-Guided Fuzzing', scroll: 'fuzzer_intuition', content: 'AFL/libFuzzer workflow:\n1. Collect seed corpus (valid inputs)\n2. Instrument binary for coverage feedback\n3. Mutate inputs: bit flips, arithmetic, splicing\n4. Track new coverage → save interesting inputs\n5. Crashes saved for triage\n\nOptimization:\n- Minimize corpus: afl-cmin\n- Dictionary: known tokens improve coverage\n- Persistent mode: fuzz in-process (10x faster)\n- ASAN: catches more bug classes\n\nTriaging: run under ASAN/MSAN, check exploitability with exploitable plugin.' },
          're': { title: 'Reverse Engineering Methodology', scroll: 'ghidra_eye', content: 'RE workflow with Ghidra/IDA:\n1. Load binary, identify architecture & protections\n2. Find main() or entry point\n3. Identify key functions: string xrefs, import xrefs\n4. Read decompiler output, rename variables\n5. Trace data flow: where does user input go?\n6. Identify vulnerability patterns\n\nKey shortcuts:\n- X: cross-references\n- N: rename\n- L: retype\n- /: comment\n\nStatic + dynamic: use GDB/x64dbg alongside the decompiler.\nPatch and re-test hypotheses. RE is iterative.' },
          'format string': { title: 'Format String Exploitation', scroll: 'format_string', content: 'printf(user_input) vulnerabilities:\n\n%x / %p — leak stack values (defeat ASLR)\n%s — read from arbitrary address (put addr on stack)\n%n — WRITE to address on stack\n%hhn — write single byte (surgical)\n\nExploit pattern:\n1. Leak stack: %p.%p.%p.%p...\n2. Find offset: AAAA%N$x (N = your input\'s position)\n3. Write: overwrite GOT entry with system()\n\nDefense: FORTIFY_SOURCE, -Wformat-security\nModern compilers warn, but legacy code is everywhere.' },
          'uaf': { title: 'Use-After-Free Mechanics', scroll: 'use_after_free', content: 'UAF lifecycle:\n1. Object A is allocated (contains function pointer / vtable)\n2. Object A is freed (chunk returns to allocator)\n3. Pointer to A is NOT nulled (dangling pointer)\n4. New allocation B takes A\'s memory\n5. Code uses dangling pointer → accesses B\'s data as A\'s type\n\nExploitation:\n- Spray objects of same size to fill the freed slot\n- Control vtable pointer → hijack virtual call\n- Control data fields → type confusion\n\nKey: UAF = use the allocator as your weapon.\nDefense: smart pointers, ASAN, MarkUs' },
          'aslr': { title: 'ASLR Bypass Techniques', scroll: 'aslr_entropy', content: 'ASLR randomizes: stack, heap, mmap (libraries), PIE base\n\nBypass strategies:\n1. Information leak: printf %p, buffer over-read\n2. Partial overwrite: only change last 1-2 bytes (4-12 bits entropy)\n3. Brute force: 32-bit = feasible, 64-bit = rarely practical\n4. Return-to-PLT: PLT addresses are fixed without PIE\n5. ret2dlresolve: forge relocation entries\n\nOne leak derandomizes everything:\n- libc leak → calculate any libc function\n- PIE leak → calculate any binary address\n- Stack leak → know buffer positions\n\nASLR is strong but brittle: one crack shatters the whole thing.' },
          'canary': { title: 'Stack Canary Bypass', scroll: 'stack_canary', content: 'Stack canaries: random value checked before function return.\n\nBypass techniques:\n1. Leak canary: format string, buffer over-read, one-by-one brute force (forking servers)\n2. Overwrite other targets: function pointers, exception handlers, GOT\n3. Skip the check: overwrite only pointer fields before canary\n4. Use a different primitive: arbitrary write doesn\'t need overflow\n\nForking server brute force:\n- 8-byte canary, first byte always \\x00\n- Brute-force byte-by-byte: 7 × 256 = 1,792 attempts\n- ~30 seconds on localhost\n\nCanaries protect the return address. Everything else is fair game.' },
          'got': { title: 'GOT/PLT Hijacking', scroll: 'got_overwrite', content: 'Lazy binding: first call to puts() goes through PLT → GOT → resolver.\nAfter resolution, GOT entry points directly to libc puts().\n\nWith partial RELRO (default), GOT is writable:\n1. Leak GOT entry → calculate libc base\n2. Overwrite puts@GOT with system()\n3. Next puts("/bin/sh") → system("/bin/sh")\n\nWith full RELRO, GOT is read-only after startup.\nBypass: target __malloc_hook, __free_hook (removed in glibc 2.34+)\nModern: overwrite return addresses, .fini_array, or atexit handlers.' },
          'stack': { title: 'Stack Frame Layout', scroll: 'stack_frame', content: 'x86-64 stack frame (growing downward):\n\n  [higher addresses]\n  Arguments (if >6)\n  Return address      ← RIP saved here\n  Saved RBP           ← frame pointer\n  Local variables      ← buffer starts here\n  [lower addresses]    ← RSP points here\n\nOverflow upward: buffer → saved RBP → return address\n\nWith gets(buf): write past buf, overwrite saved RBP (+8 bytes RIP)\nControl RIP = control execution flow\n\nKey sizes:\n- buf[64]: overflow at offset 64 (buf) + 8 (rbp) = 72\n- No canary: direct overwrite\n- With canary: need leak or bypass' },
          'race': { title: 'Race Conditions & TOCTOU', scroll: 'race_condition', content: 'TOCTOU (Time-of-Check Time-of-Use):\n\nVulnerable pattern:\n  if (access(file, W_OK) == 0)   ← CHECK\n      open(file, O_WRONLY);       ← USE\n\nBetween check and use, attacker replaces file with symlink.\n\nExploitation:\n1. Create legitimate file\n2. Race: swap file → symlink to /etc/shadow\n3. Program writes to /etc/shadow thinking it\'s the original\n\nFilesystem races: symlink attacks, directory traversal\nMemory races: double-fetch in kernel drivers\n\nDefense: use file descriptors (fstat, not stat), O_NOFOLLOW, transactions' },
          'null byte': { title: 'Null Byte & Off-by-One', scroll: 'null_byte', content: 'Off-by-one null byte overflow:\n\nThe setup:\n  Chunk A [size: 0x100] [data...]\n  Chunk B [size: 0x111] [data...]  ← target\n\nOverflow one null byte into B\'s size field:\n  0x111 → 0x100 (prev_inuse bit cleared)\n\nNow the allocator thinks the chunk before B is free.\nConsolidation creates overlapping chunks.\n\nFrom overlap → controlled read/write → arbitrary primitive.\n\nOne byte. That\'s all it takes.\nSee: Google Project Zero\'s "The Poisoned NUL Byte"' },
        };
        if (!topic) {
          addLine('Usage: study <topic>');
          addLine('Topics: rop, heap, fuzzing, re, format string, uaf, aslr, canary, got, stack, race, null byte');
          return;
        }
        const entry = STUDY_TOPICS[topic];
        if (entry) {
          if (entry.scroll && !gameState.hasScroll(entry.scroll)) {
            addLine(`You haven't found the scroll for "${entry.title}" yet. Explore the archives.`, 'warning');
            return;
          }
          addLine(`═══ ${entry.title.toUpperCase()} ═══`, 'item');
          entry.content.split('\n').forEach(l => addLine(l));
        } else {
          addLine(`Unknown topic: "${topic}". Try: rop, heap, fuzzing, re, format string, uaf, aslr, canary, got, stack, race, null byte`);
        }
      },

      resources: () => {
        addLine('═══ EXPLOITATION & RE RESOURCES ═══', 'item');
        addLine('');
        addLine('BINARY EXPLOITATION:');
        addLine('  • how2heap — github.com/shellphish/how2heap');
        addLine('  • pwn.college — interactive exploit education');
        addLine('  • ROP Emporium — ropemporium.com');
        addLine('  • LiveOverflow — youtube.com/LiveOverflow');
        addLine('');
        addLine('REVERSE ENGINEERING:');
        addLine('  • Ghidra — ghidra-sre.org (NSA\'s RE framework)');
        addLine('  • radare2 / Cutter — open-source RE toolkit');
        addLine('  • Malware Unicorn RE101 — malwareunicorn.org');
        addLine('  • begin.re — reverse engineering for beginners');
        addLine('');
        addLine('FUZZING:');
        addLine('  • AFL++ — github.com/AFLplusplus/AFLplusplus');
        addLine('  • libFuzzer — llvm.org/docs/LibFuzzer.html');
        addLine('  • honggfuzz — github.com/google/honggfuzz');
        addLine('  • Google OSS-Fuzz — github.com/google/oss-fuzz');
        addLine('');
        addLine('CTF PRACTICE:');
        addLine('  • picoCTF — picoctf.org');
        addLine('  • Hack The Box — hackthebox.com');
        addLine('  • OverTheWire — overthewire.org');
        addLine('  • CTFtime — ctftime.org');
        addLine('');
        addLine('MEMORY FORENSICS:');
        addLine('  • Volatility 3 — volatilityfoundation.org');
        addLine('  • SANS DFIR — sans.org/digital-forensics');
      },
    };

    // Check for story choice commands — accepts > prefix or any 4+ char substring match
    const choiceQuery = cmd.startsWith('>') ? cmd.slice(1).trim() : cmd;
    if (choiceQuery.length >= 4 && gameState.gameStarted) {
      const node = getNode(gameState.currentNode);
      if (node?.choices) {
        const choice = node.choices.find(c =>
          c.text.toLowerCase().includes(choiceQuery)
        );
        if (choice) {
          if (choice.setFlag) gameState.setFlag(choice.setFlag);
          if (node.grantsItem) {
            gameState.addItem(node.grantsItem);
            const name = gameState.TIME_MACHINE_PARTS.find(p => p.id === node.grantsItem)?.name;
            if (name) addLine(`[ACQUIRED: ${name}]`, 'item');
          }
          if (choice.next) {
            gameState.navigate(choice.next);
          }
          if (Math.random() < 0.3) gameState.requestAd();
          return;
        }
      }
    }

    if (commands[action]) {
      commands[action]();
    } else {
      addLine(`Command not found: "${cmd}". Type "help" for available commands.`);
    }
  }

  $effect(() => {
    if (visible) {
      tick().then(() => inputEl?.focus());
    }
  });
</script>

<DraggableWindow
  title="cyba@dreamnet:~$"
  bind:visible
  width="700px"
  maxHeight="75vh"
  zBase={700}
  borderColor="#39ff14"
  titleIcon=">"
  initialX={-1}
  initialY={-1}
>
  <div class="terminal-body" bind:this={bodyEl}>
    {#each history as line}
      <div class="term-line term-{line.type}">
        {line.text}
      </div>
    {/each}
    {#if baudShowing}
      <div class="term-line term-{baudType}">
        {baudText}<span class="baud-cursor">▊</span>
      </div>
    {/if}
    <div class="terminal-prompt">
      <span class="prompt-symbol">&gt; </span>
      <input
        bind:this={inputEl}
        bind:value={input}
        onkeydown={(e) => e.key === 'Enter' && handleSubmit()}
        class="terminal-input-field"
        spellcheck="false"
        autocomplete="off"
        placeholder="type a command..."
      />
    </div>
  </div>
</DraggableWindow>

<style>
  .terminal-body {
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    line-height: 1.5;
  }

  .term-line { margin-bottom: 0.15rem; white-space: pre-wrap; }
  .term-input { color: #00f0ff; }
  .term-output { color: #39ff14; }
  .term-story { color: #d0d0d0; }
  .term-choice { color: #00f0ff; cursor: pointer; }
  .term-choice:hover { text-shadow: 0 0 8px rgba(0, 240, 255, 0.5); }
  .term-system { color: #ffe600; }
  .term-item { color: #39ff14; font-weight: bold; text-shadow: 0 0 8px rgba(57, 255, 20, 0.5); }
  .term-warning { color: #ff6600; }

  .baud-cursor {
    color: #39ff14;
    animation: baudBlink 0.4s step-end infinite;
    margin-left: 1px;
  }

  @keyframes baudBlink {
    50% { opacity: 0; }
  }

  .terminal-prompt {
    display: flex;
    align-items: center;
    margin-top: 0.3rem;
  }

  .prompt-symbol { color: #39ff14; margin-right: 0.3rem; }

  .terminal-input-field {
    flex: 1;
    background: none;
    border: none;
    color: #39ff14;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    outline: none;
    caret-color: #39ff14;
  }

  .terminal-input-field::placeholder {
    color: #333;
  }
</style>
