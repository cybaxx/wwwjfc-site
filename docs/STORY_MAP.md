# Story Node Map

Visual reference for the complete story graph. Arrows show navigation flow.

## Intro (3 nodes)

```
wake_up ──┬──> hub_nexus
           └──> diagnostics ──> hub_nexus
```

## Hub Nexus (central)

```
hub_nexus ──┬──> skills_entrance     (Black Market)
             ├──> wetfish_entrance    (Wetfish Sector)
             ├──> cc_entrance         (ClearCaptions Tower)
             ├──> stg_entrance        (STG Labs)
             ├──> education_entrance  (Neural Academy)
             ├──> community_entrance  (Resistance Safe House)
             ├──> jfc_entrance        (JFC Rave Venue)
             └──> fsociety_entrance   (fsociety Arcade)
```

## Black Market — Switchblade + Pixel (7 nodes)

```
skills_entrance ──┬──> skills_errand ──> skills_riddle ──┬──> skills_riddle_win ──> skills_challenge [CHRONO COIL]
                   │                                      ├──> skills_riddle_fail_funny ──> skills_riddle / fail_aggro
                   │                                      └──> skills_riddle_fail_aggro ──> skills_riddle / entrance
                   └──> skills_steal ──> skills_errand

skills_challenge ──┬──> hub_nexus
                    ├──> skills_intel ──> hub_nexus
                    └──> skills_negotiate ──┬──> skills_intel
                                            └──> hub_nexus
```

## JFC — Jellyfish Crew (9 nodes)

```
jfc_entrance ──┬──> jfc_rachel ──> jfc_rachel_test ──> jfc_rachel_approve [sets rachel_approved]
                │                                        ├──> wetfish_trust
                │                                        ├──> jfc_shop
                │                                        └──> hub_nexus
                ├──> jfc_shop ──┬──> jfc_buy_stim ──> jfc_shop / rachel / hub
                │                ├──> jfc_buy_dream ──> jfc_shop / rachel / hub
                │                ├──> jfc_buy_shirt ──> jfc_shop / rachel / hub
                │                └──> jfc_rachel / hub
                └──> jfc_info ──> jfc_rachel / jfc_shop / hub
```

## Wetfish Sector — Ghostfishy (8 nodes, gated by Rachel)

```
wetfish_entrance ──┬──> jfc_entrance (go find Rachel)
                    ├──> wetfish_rachel_gate ──> jfc_entrance / hub_nexus
                    └──> wetfish_refuse ──> wetfish_trust / hub_nexus

wetfish_trust [requires rachel_approved] ──┬──> wetfish_trust_pass ──> wetfish_saboteur ──> wetfish_mission [QUANTUM FLUX]
                                            └──> wetfish_trust_fail ──> wetfish_trust_pass / hub

wetfish_mission ──┬──> wetfish_lore ──> wetfish_memory ──> hub_nexus
                   ├──> wetfish_memory ──> hub_nexus
                   └──> hub_nexus
```

## ClearCaptions Tower (8 nodes)

```
cc_entrance ──> cc_lobby ──┬──> cc_social ──┬──> cc_floor13 ──┬──> cc_floor13_help ──> cc_vault_puzzle
                            │                │                  └──> cc_vault_puzzle
                            │                └──> cc_vault_puzzle
                            ├──> cc_exploit ──┬──> cc_floor13
                            │                  └──> cc_vault_puzzle
                            └──> cc_stealth ──┬──> cc_floor13
                                               └──> cc_vault_puzzle

cc_vault_puzzle [NEURAL SYNC] ──> hub_nexus
```

## STG Labs (7 nodes)

```
stg_entrance ──┬──> stg_ghost ──┬──> stg_ghost_free ──┬──> stg_records ──> stg_turrets / stg_sneak
                │                │                      └──> stg_turrets
                │                └──> stg_ghost_harvest ──┬──> stg_records
                │                                          └──> stg_basement_puzzle
                ├──> stg_turrets ──> stg_basement_puzzle
                └──> stg_sneak ──> stg_basement_puzzle

stg_basement_puzzle [TEMPORAL DRIFT] ──> hub_nexus
```

## Neural Academy (6 nodes)

```
education_entrance ──┬──> education_mentor ──> education_gauntlet ──┬──> education_truth [DREAM ANCHOR] ──> education_complete
                      │                                              └──> education_complete
                      └──> education_gauntlet
                           └──> education_challenge [DREAM ANCHOR] ──┬──> education_truth
                                                                      └──> education_complete

education_complete ──> hub_nexus / assembly_check
```

## Community Safe House (4 nodes)

```
community_entrance ──┬──> community_intel ──┬──> community_choice ──> hub_nexus / education
                      │                      ├──> education_entrance
                      │                      └──> hub_nexus
                      └──> community_lore ──> community_intel / hub_nexus
```

## fsociety Arcade — Elliot Holo Ghost (9 nodes)

```
hub_nexus ──> fsociety_entrance ──┬──> fsociety_elliot ──┬──> fsociety_workbench ──┬──> fix_chrono_coil    (CTF: Log Analysis)
                                   │                      │                         ├──> fix_quantum_flux   (CTF: DNS Exfiltration)
                                   │                      │                         ├──> fix_neural_sync    (CTF: Container Escape)
                                   │                      │                         ├──> fix_temporal_drift (CTF: Secret Sprawl)
                                   │                      │                         ├──> fix_dream_anchor   (CTF: Terraform Drift)
                                   │                      │                         └──> assembly_check (all fixed)
                                   │                      ├──> fsociety_lore ──> fsociety_elliot / hub_nexus
                                   │                      └──> hub_nexus
                                   ├──> fsociety_lore
                                   └──> hub_nexus
```

### CTF Challenges (solved in terminal)

| Part | Challenge | Key Commands | Solution |
|---|---|---|---|
| Chrono Coil | Log Analysis | `cat chrono.log`, `grep`, `sort`, `uniq`, `block <IP>` | Block IP 203.0.113.66 (impossible geo jumps) |
| Quantum Flux | DNS Exfiltration | `tcpdump dns`, `decode <b64>`, `firewall block-dns` | Block C2 domain dream-c2.evil |
| Neural Sync | Container Escape | `kubectl get/logs/describe/delete pod`, `kubectl apply patch` | Delete dream-monitor-0, apply security patch |
| Temporal Drift | Secret Sprawl | `git log/show/revert`, `vault store` | Revert commit x7y8z9w, store keys in vault |
| Dream Anchor | TF State Drift | `terraform show/plan/state rm/import` | Remove phantom, import anchor-stabilizer-42 |

## Endgame (5 nodes)

```
assembly_check ──┬──> assembly_memories ──> ending_escape ──> ending_wake ──> ending_reflection ──┬──> wake_up (restart)
                  └──> hub_nexus (not ready)                                                       └──> null (close)
```

**Note:** Assembly requires all 5 parts to be *repaired* at the fsociety arcade (not just collected).

## Five Parts

| Part | Item ID | Granted At | District |
|---|---|---|---|
| Chrono Coil | `chrono_coil` | `skills_challenge` | Black Market |
| Quantum Flux Capacitor | `quantum_flux` | `wetfish_mission` | Wetfish Sector |
| Neural Sync Module | `neural_sync` | `cc_vault_puzzle` | ClearCaptions Tower |
| Temporal Drift Compensator | `temporal_drift` | `stg_basement_puzzle` | STG Labs |
| Dream Anchor | `dream_anchor` | `education_truth` / `education_challenge` | Neural Academy |

## Flags

| Flag | Set By | Used By |
|---|---|---|
| `rachel_approved` | `jfc_rachel_approve` choices | `wetfish_trust` (narrative acknowledgment) |
| `promised_wetfish` | `wetfish_lore` promise choice | Ending flavor |
| `has_intel` | `community_intel` / `community_lore` choices | Available intel |
