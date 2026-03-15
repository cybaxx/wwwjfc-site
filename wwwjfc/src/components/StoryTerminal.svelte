<script>
  import { tick } from 'svelte';
  import DraggableWindow from './DraggableWindow.svelte';
  import { gameState } from '../lib/gameState.svelte.js';
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
    if (baudTimer) { clearTimeout(baudTimer); baudTimer = null; }
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
      baudTimer = setTimeout(baudTickChar, BAUD_CHAR_DELAY);
    } else {
      // Line done — commit to history
      history = [...history, { type: baudType, text: baudFull }];
      baudShowing = false;
      baudText = '';
      scrollBottom();
      baudTimer = setTimeout(drainBaudQueue, BAUD_LINE_PAUSE);
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
  };

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
        addLine('  go <place> — navigate (skills, wetfish, cc, stg, edu, community, fsociety)');
        addLine('  diagnostics — run system diagnostics');
        addLine('  talk       — interact with NPCs at current location');
        addLine('  take       — pick up items');
        addLine('  hack       — attempt to hack systems');
        addLine('  status     — show game status');
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
        };
        if (!dest || !destinations[dest]) {
          addLine('Go where? Options: skills, wetfish, cc, stg, edu, community, hub, fsociety');
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
