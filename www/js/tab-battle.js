/**
 * Mumbai Mafia — Battle Tab
 * Flow: Choose Enemy → Choose Fighter → Battle Arena
 * Complex abilities: Ghost Debt, Lag Switch, Deadeye Roulette, Overheat Combo, Human Bulldozer
 * Bosses: Frame Perfect counter, Infection poison, Nitro Rage, Fresh Meat, Rigged Odds, Concrete Buffet
 */
var GameTabs = window.GameTabs || {};

GameTabs.battle = function() {

    var chars = [
        { id: 'vex', name: 'Vex', title: 'Shadow Operative', unlockAt: 0, img: 'vex',
          special: { name: 'Deadeye Roulette', desc: '50% weak shot / 50% 4x sniper', cd: 3, type: 'deadeye', weakMul: 0.5, critMul: 4 } },
        { id: 'inferna', name: 'Inferna', title: 'Flame Wielder', unlockAt: 1, img: 'raze',
          special: { name: 'Overheat Combo', desc: '3-hit flame combo, 3-turn burn', cd: 4, type: 'overheat', dmgMul: 1.2, hits: 3 } },
        { id: 'titan', name: 'Titan', title: 'Heavy Infantry', unlockAt: 2, img: 'titan',
          special: { name: 'Human Bulldozer', desc: '2.2x + -30% enemy DEF', cd: 4, type: 'bulldozer', dmgMul: 2.2 } },
        { id: 'phantom', name: 'Phantom', title: 'Stealth Assassin', unlockAt: 3, img: 'phantom',
          special: { name: 'Ghost Debt', desc: 'Marks enemy, explodes in 2 turns', cd: 4, type: 'ghostDebt' } },
        { id: 'glitch', name: 'Glitch', title: 'Cyber Runner', unlockAt: 5, img: 'glitch',
          special: { name: 'Lag Switch', desc: 'Enemy skips 2 turns', cd: 5, type: 'lagSwitch' } }
    ];


    var enemies = [
        { name: 'Street Brute', title: 'Concrete Crusher', lv: 1, baseHp: 1500, baseAtk: 30, reward: 500, xp: 150, img: 'biker',
          special: { name: 'Concrete Buffet', desc: '3 heavy smash attacks @ 1x', cd: 3, type: 'concreteBuffet', hits: 3 } },
        { name: 'Butcher', title: 'Meat Cleaver', lv: 3, baseHp: 3000, baseAtk: 55, reward: 1000, xp: 400, img: 'Butcher',
          special: { name: 'Fresh Meat', desc: 'Extra damage vs enemies below 50% HP', cd: 3, type: 'freshMeat', dmgMul: 2.5 } },
        { name: 'Cyber Samurai', title: 'Digital Ronin', lv: 5, baseHp: 6000, baseAtk: 80, reward: 2000, xp: 800, img: 'Brute',
          special: { name: 'Frame Perfect', desc: 'Dodges next attack + counterattacks', cd: 3, type: 'framePerfect' } },
        { name: 'Casino Tycoon', title: 'High-Roller Don', lv: 7, baseHp: 10000, baseAtk: 110, reward: 4000, xp: 1500, img: 'cypher',
          special: { name: 'Rigged Odds', desc: '50% 3x crit OR self heal 25%', cd: 3, type: 'riggedOdds', critMul: 3, healPct: 0.25 } },
        { name: 'Infernal Rider', title: 'Hell\'s Biker', lv: 9, baseHp: 16000, baseAtk: 145, reward: 8000, xp: 2500, img: 'Undead',
          special: { name: 'Nitro Funeral', desc: 'Massive fire atk + self rage boost', cd: 4, type: 'nitroFuneral', dmgMul: 2.5, rageMul: 1.5 } },
        { name: 'Plague Assassin', title: 'Toxic Phantom', lv: 12, baseHp: 25000, baseAtk: 185, reward: 15000, xp: 4000, img: 'plague',
          special: { name: 'Infection Lottery', desc: '4-turn deadly poison', cd: 4, type: 'infection', poisonDmg: 100, poisonTurns: 4 } }
    ];

    function charImg(id) { return 'img/character-WB/' + id + '.png'; }
    function enemyImg(id) { return 'img/character-WB/' + id + '.png'; }
    function isUnlocked(ch) { return GameApp.playerStats.level >= ch.unlockAt; }

    var battle = null;
    var chosenEnemy = null;
    var chosenCharIdx = 0;
    var triggerEnemyTurn = null;
    var tauntTimer = null;

    // Battle state modifiers
    var playerSpecialCD = 0;
    var enemySpecialCD = 0;
    var enemyDefDown = 0;       // turns remaining for enemy DEF debuff
    var enemyBurn = 0;          // turns of burn damage on enemy
    var playerPoison = 0;       // turns of poison on player
    var playerPoisonDmg = 0;    // poison damage per tick
    var ghostDebtStored = 0;    // damage stored for Ghost Debt
    var ghostDebtTimer = 0;     // turns until Ghost Debt explodes
    var enemyRage = 0;          // rage boost multiplier (1 = normal)
    var enemyRageTurns = 0;     // turns remaining on rage
    var enemyDodging = false;   // Frame Perfect dodge active
    var enemyLagStun = 0;       // turns enemy skips from Lag Switch
    var battleBandages = 5;     // per-battle bandage count

    function startBattle() {
        var scale = 1 + (GameApp.playerStats.level - 1) * 0.15;
        var maxHp = Math.round(chosenEnemy.baseHp * scale);
        battleBandages = 5;
        playerSpecialCD = 0;
        enemySpecialCD = 0;
        enemyDefDown = 0;
        enemyBurn = 0;
        playerPoison = 0;
        playerPoisonDmg = 0;
        ghostDebtStored = 0;
        ghostDebtTimer = 0;
        enemyRage = 1;
        enemyRageTurns = 0;
        enemyDodging = false;
        enemyLagStun = 0;
        battle = {
            enemy: {
                name: chosenEnemy.name, title: chosenEnemy.title, lv: chosenEnemy.lv,
                atk: Math.round(chosenEnemy.baseAtk * scale), reward: Math.round(chosenEnemy.reward * scale),
                img: enemyImg(chosenEnemy.img)
            },
            enemyHp: maxHp, enemyMaxHp: maxHp,
            playerHp: GameApp.playerStats.hp, playerMaxHp: GameApp.playerStats.maxHp,
            result: null, turn: 0, log: []
        };
    }

    function playerSpec() { return chars[chosenCharIdx].special; }
    function enemySpec() { return chosenEnemy.special; }
    function playerName() { return chars[chosenCharIdx].name; }

    var html = '<div class="tab-view battle-tab">';
    html += '<div class="battle-bg-layer"></div>';
    html += '<div class="tab-title-bar"><span class="tab-title">BATTLE</span><span class="tab-subtitle" id="battle-subtitle">Choose your opponent</span></div>';

    // ── Enemy Select ──
    html += '<div class="bt-screen" id="bt-screen-enemy">';
    html += '<div class="bt-enemy-grid">';
    enemies.forEach(function(en, i) {
        var scale = 1 + (GameApp.playerStats.level || 0) * 0.15;
        var scaledHp = Math.round(en.baseHp * scale);
        html += '<div class="bt-enemy-opt" data-enemy-idx="' + i + '">';
        html += '<img class="bt-enemy-opt-img" src="' + enemyImg(en.img) + '" alt="' + en.name + '">';
        html += '<div class="bt-enemy-opt-body"><span class="bt-enemy-opt-name">' + en.name + '</span><span class="bt-enemy-opt-title">' + en.title + '</span>';
        html += '<div class="bt-enemy-opt-stats"><span>❤️ ' + scaledHp + '</span><span>⚔️ ' + en.baseAtk + '</span><span>⭐ Lv ' + en.lv + '</span></div></div>';
        html += '</div>';
    });
    html += '</div></div>';

    // ── Hero Select ──
    html += '<div class="bt-screen" id="bt-screen-char" style="display:none">';
    html += '<div class="bt-char-grid">';
    chars.forEach(function(ch, i) {
        var unlocked = isUnlocked(ch);
        html += '<div class="bt-char-card' + (unlocked ? ' bt-char-unlocked' : ' bt-char-locked') + '" data-char-idx="' + i + '">';
        html += '<div class="bt-char-card-img-zone"><img class="bt-char-card-img" src="' + charImg(ch.img) + '" alt="' + ch.name + '">';
        if (!unlocked) html += '<div class="bt-lock-overlay">🔒</div>';
        html += '</div>';
        html += '<div class="bt-char-card-name">' + ch.name + '</div>';
        html += '<div class="bt-char-card-title">' + ch.title + '</div>';
        if (!unlocked) html += '<div class="bt-char-card-req">Unlock at Level ' + ch.unlockAt + '</div>';
        html += '</div>';
    });
    html += '</div></div>';

    // ── Battle Arena ──
    html += '<div class="bt-screen" id="bt-screen-arena" style="display:none">';
    html += '<div class="bt-arena">';

    html += '<div class="bt-side bt-side-player">';
    html += '<div class="bt-side-hp-zone"><div class="bt-side-hp-bar"><div class="bt-side-hp-fill bt-side-hp-fill-player" id="bt-player-hp-fill"></div></div><span class="bt-side-hp-text" id="bt-player-hp-text"></span></div>';
    html += '<div class="bt-side-img-wrap"><img class="bt-side-img" id="bt-player-img" src=""></div>';
    html += '<div class="bt-side-info"><span class="bt-side-name" id="bt-player-name"></span><span class="bt-side-lv" id="bt-player-lv"></span></div>';
    html += '<div class="bt-status-row" id="bt-player-status"></div>';
    html += '</div>';

    html += '<div class="bt-vs-col"><span>VS</span></div>';

    html += '<div class="bt-side bt-side-enemy">';
    html += '<div class="bt-side-hp-zone"><div class="bt-side-hp-bar"><div class="bt-side-hp-fill bt-side-hp-fill-enemy" id="bt-enemy-hp-fill"></div></div><span class="bt-side-hp-text" id="bt-enemy-hp-text"></span></div>';
    html += '<div class="bt-side-img-wrap"><img class="bt-side-img" id="bt-enemy-img" src=""></div>';
    html += '<div class="bt-side-info"><span class="bt-side-name" id="bt-enemy-name"></span><span class="bt-side-lv bt-side-lv-enemy" id="bt-enemy-lv-badge"></span></div>';
    html += '<div class="bt-status-row" id="bt-enemy-status"></div>';
    html += '</div>';

    html += '</div>';

    html += '<div class="bt-taunt" id="bt-taunt" style="display:none"></div>';

    html += '<div class="bt-actions">';
    html += '<div class="bt-action-row"><button class="bt-btn bt-atk" id="bt-attack">⚔️ ATTACK</button><button class="bt-btn bt-spec" id="bt-special"><span id="bt-spec-label">⚡ SPECIAL</span></button></div>';
    html += '<div class="bt-action-row"><button class="bt-btn bt-heal" id="bt-heal">🩹 BANDAGE (<span id="bt-bandage-count">0</span>)</button><button class="bt-btn bt-flee" id="bt-flee">🏃 FLEE</button></div>';
    html += '</div>';

    html += '<div class="bt-log" id="bt-log"></div>';
    html += '</div>';

    // ── Result overlay ──
    html += '<div class="bt-result-overlay" id="bt-result" style="display:none">';
    html += '<div class="bt-result-box"><span class="bt-result-icon" id="bt-result-icon"></span><div class="bt-result-title" id="bt-result-title"></div><div class="bt-result-reward" id="bt-result-reward"></div><button class="bt-result-btn" id="bt-result-btn">CONTINUE</button></div>';
    html += '</div>';

    html += '</div>';

    return {
        html: html,
        setup: function(el, nav) {
            var screenChar = el.querySelector('#bt-screen-char');
            var screenEnemy = el.querySelector('#bt-screen-enemy');
            var screenArena = el.querySelector('#bt-screen-arena');
            var resultOverlay = el.querySelector('#bt-result');
            var logEl = el.querySelector('#bt-log');
            var subtitleEl = el.querySelector('#battle-subtitle');
            var tauntEl = el.querySelector('#bt-taunt');
            var specBtn = el.querySelector('#bt-special');
            var specLabel = el.querySelector('#bt-spec-label');
            var playerStatusEl = el.querySelector('#bt-player-status');
            var enemyStatusEl = el.querySelector('#bt-enemy-status');

            function showScreen(name) {
                screenChar.style.display = 'none'; screenEnemy.style.display = 'none';
                screenArena.style.display = 'none'; resultOverlay.style.display = 'none';
                if (name === 'enemy') { screenEnemy.style.display = 'block'; subtitleEl.textContent = 'Choose your opponent'; }
                else if (name === 'char') { screenChar.style.display = 'block'; subtitleEl.textContent = 'Select your fighter'; }
                else if (name === 'arena') { screenArena.style.display = 'flex'; subtitleEl.textContent = chosenEnemy.name + ' vs ' + playerName(); }
            }

            function cancelEnemyTurn() {
                if (triggerEnemyTurn) { clearTimeout(triggerEnemyTurn); triggerEnemyTurn = null; }
            }

            function showTaunt(text) {
                if (tauntTimer) clearTimeout(tauntTimer);
                tauntEl.textContent = text;
                tauntEl.style.display = 'block';
                tauntTimer = setTimeout(function() { tauntEl.style.display = 'none'; }, 2500);
            }

            function addLog(msg, cls) {
                battle.turn++;
                var div = document.createElement('div');
                div.className = 'bt-log-entry' + (cls ? ' ' + cls : '');
                div.innerHTML = '<span class="bt-log-turn">T' + battle.turn + '</span> ' + msg;
                logEl.insertBefore(div, logEl.firstChild);
            }

            function animateHit(target) {
                var charImg = target === 'enemy' ? el.querySelector('#bt-enemy-img') : el.querySelector('#bt-player-img');
                if (charImg) { charImg.classList.add('bt-shake'); setTimeout(function() { charImg.classList.remove('bt-shake'); }, 400); }
                var hpFill = target === 'enemy' ? el.querySelector('#bt-enemy-hp-fill') : el.querySelector('#bt-player-hp-fill');
                if (hpFill) { hpFill.classList.add('bt-flash'); setTimeout(function() { hpFill.classList.remove('bt-flash'); }, 300); }
            }

            function refreshBattleUI() {
                if (!battle || battle.result) return;
                var eHpPct = Math.max(0, Math.round(battle.enemyHp / battle.enemyMaxHp * 100));
                var pHpPct = Math.max(0, Math.round(battle.playerHp / battle.playerMaxHp * 100));
                el.querySelector('#bt-enemy-hp-fill').style.width = eHpPct + '%';
                el.querySelector('#bt-enemy-hp-text').textContent = battle.enemyHp + ' / ' + battle.enemyMaxHp;
                el.querySelector('#bt-player-hp-fill').style.width = pHpPct + '%';
                el.querySelector('#bt-player-hp-text').textContent = battle.playerHp + ' / ' + battle.playerMaxHp;

                // Status chips
                var pStatus = [];
                var eStatus = [];
                if (playerPoison > 0) pStatus.push('<span class="bt-chip bt-chip-poison">☠️ Poison ' + playerPoison + 't</span>');
                if (enemyBurn > 0) eStatus.push('<span class="bt-chip bt-chip-burn">🔥 Burn ' + enemyBurn + 't</span>');
                if (enemyDefDown > 0) eStatus.push('<span class="bt-chip bt-chip-debuff">🛡️-30% ' + enemyDefDown + 't</span>');
                if (ghostDebtTimer > 0) eStatus.push('<span class="bt-chip bt-chip-debt">💀 Debt ' + ghostDebtTimer + 't</span>');
                if (enemyDodging) eStatus.push('<span class="bt-chip bt-chip-dodge">⚡ Dodging</span>');
                if (enemyRageTurns > 0) eStatus.push('<span class="bt-chip bt-chip-rage">💢 Rage ' + enemyRageTurns + 't</span>');
                if (enemyLagStun > 0) eStatus.push('<span class="bt-chip bt-chip-stun">⏸️ Stun ' + enemyLagStun + 't</span>');

                playerStatusEl.innerHTML = pStatus.join('');
                enemyStatusEl.innerHTML = eStatus.join('');

                // Special cooldown
                if (playerSpecialCD > 0) {
                    specLabel.textContent = '⏳ SPECIAL (' + playerSpecialCD + ')';
                    specBtn.classList.add('bt-spec-cd');
                } else {
                    specLabel.textContent = '⚡ ' + playerSpec().name;
                    specBtn.classList.remove('bt-spec-cd');
                }

                if (battle.enemyHp <= 0) endBattle('win');
                else if (battle.playerHp <= 0) endBattle('lose');
            }

            function applyPoisonTick() {
                if (playerPoison <= 0) return;
                var dmg = playerPoisonDmg;
                battle.playerHp -= dmg;
                var hpFill = el.querySelector('#bt-player-hp-fill');
                if (hpFill) { hpFill.classList.add('bt-heal-flash'); hpFill.style.filter = 'hue-rotate(-40deg)'; setTimeout(function() { hpFill.style.filter = ''; }, 300); }
                addLog('<span style="color:#9b59b6;">☠️ Poison tick — ' + dmg + ' dmg</span>');
                playerPoison--;
                if (playerPoison <= 0) addLog('<span style="color:#2ecc71;">Poison faded!</span>');
                refreshBattleUI();
            }

            function applyBurnTick() {
                if (enemyBurn <= 0) return;
                var dmg = Math.round(battle.enemyMaxHp * 0.05);
                battle.enemyHp -= dmg;
                animateHit('enemy');
                addLog('<span style="color:#e67e22;">🔥 Burn tick — ' + dmg + ' dmg</span>');
                enemyBurn--;
                if (enemyBurn <= 0) addLog('<span style="color:#888;">Burn faded!</span>');
                refreshBattleUI();
            }

            // ═══════ PLAYER ACTIONS ═══════

            function playerAttack() {
                if (!battle || battle.result) return;
                cancelEnemyTurn();
                var dmg = GameApp.getWeaponDamage();
                var variance = Math.floor(Math.random() * 21) - 10;
                dmg = Math.max(1, dmg + variance);
                var crit = Math.random() < 0.12;
                if (crit) dmg = Math.floor(dmg * 1.8);
                // Ghost Debt: store 80% of this hit's damage
                if (ghostDebtTimer > 0) {
                    var stored = Math.round(dmg * 0.8);
                    ghostDebtStored += stored;
                    addLog(playerName() + ' strikes — <span style="color:#e74c3c;">' + dmg + ' dmg</span>' + (crit ? ' 💥 CRIT!' : '') + ' <span style="color:#9b59b6;">(+' + stored + ' to Debt)</span>');
                } else {
                    if (enemyDodging) {
                        addLog('<span style="color:#3498db;">Frame Perfect! ' + battle.enemy.name + ' dodges!</span>');
                        enemyDodging = false;
                        battle.playerHp -= Math.round(GameApp.getWeaponDamage() * 0.6);
                        animateHit('player');
                        addLog('<span style="color:#3498db;">⚔️ Counter! ' + Math.round(GameApp.getWeaponDamage() * 0.6) + ' dmg</span>');
                        goNext();
                        return;
                    }
                    addLog(playerName() + ' attacks — <span style="color:#e74c3c;">' + dmg + ' dmg</span>' + (crit ? ' 💥 CRIT!' : ''));
                }
                applyDmgToEnemy(dmg);
                goNext();
            }

            function playerSpecial() {
                if (!battle || battle.result) return;
                if (playerSpecialCD > 0) { Ext.Msg.alert('On Cooldown', 'Special ready in ' + playerSpecialCD + ' turns.'); return; }
                cancelEnemyTurn();

                var sp = playerSpec();
                showTaunt(sp.name.toUpperCase() + '!');
                var bonus = '';

                if (sp.type === 'lagSwitch') {
                    enemyLagStun = 2;
                    addLog('<span style="color:#d4af37;">⚡ LAG SWITCH</span> — <span style="color:#9b59b6;">Enemy frozen for 2 turns!</span>', 'bt-log-spec');
                }
                else if (sp.type === 'bulldozer') {
                    var dmg = Math.round(GameApp.getWeaponDamage() * sp.dmgMul);
                    enemyDefDown = 3;
                    bonus = ' <span style="color:#e67e22;">🛡️ DEF -30% (3 turns)</span>';
                    applyDmgToEnemy(dmg);
                    addLog('<span style="color:#d4af37;">⚡ HUMAN BULLDOZER</span> — <span style="color:#e74c3c;">' + dmg + ' dmg</span>' + bonus, 'bt-log-spec');
                }
                else if (sp.type === 'ghostDebt') {
                    ghostDebtStored = 0;
                    ghostDebtTimer = 2;
                    addLog('<span style="color:#d4af37;">⚡ GHOST DEBT</span> — <span style="color:#9b59b6;">Enemy marked! Damage stored for 2 turns...</span>', 'bt-log-spec');
                }
                else if (sp.type === 'deadeye') {
                    var weak = Math.random() < 0.5;
                    var baseDmg = GameApp.getWeaponDamage();
                    var dmg;
                    if (weak) {
                        dmg = Math.round(baseDmg * sp.weakMul);
                        addLog('<span style="color:#d4af37;">⚡ DEADEYE ROULETTE</span> — <span style="color:#888;">Weak shot...</span> <span style="color:#e74c3c;">' + dmg + ' dmg</span>', 'bt-log-spec');
                    } else {
                        dmg = Math.round(baseDmg * sp.critMul);
                        addLog('<span style="color:#d4af37;">⚡ DEADEYE ROULETTE</span> — <span style="color:#e74c3c;">💀 HEADSHOT! ' + sp.critMul + 'x!</span> <span style="color:#e74c3c;">' + dmg + ' dmg</span>', 'bt-log-spec');
                    }
                    applyDmgToEnemy(dmg);
                }
                else if (sp.type === 'overheat') {
                    var totalDmg = 0;
                    for (var h = 0; h < sp.hits; h++) {
                        var hDmg = Math.round(GameApp.getWeaponDamage() * sp.dmgMul);
                        totalDmg += hDmg;
                    }
                    enemyBurn = 3;
                    bonus = ' <span style="color:#e67e22;">🔥 BURN 3 turns</span>';
                    applyDmgToEnemy(totalDmg);
                    addLog('<span style="color:#d4af37;">⚡ OVERHEAT COMBO</span> — ' + sp.hits + ' hits! <span style="color:#e74c3c;">' + totalDmg + ' dmg</span>' + bonus, 'bt-log-spec');
                }

                playerSpecialCD = sp.cd;
                goNext();
            }

            function applyDmgToEnemy(dmg) {
                if (enemyDefDown > 0) dmg = Math.round(dmg * 1.30);
                battle.enemyHp -= dmg;
                animateHit('enemy');
            }

            function playerHeal() {
                if (!battle || battle.result) return;
                if (battleBandages <= 0) { Ext.Msg.alert('No Bandages', 'Out of bandages!'); return; }
                cancelEnemyTurn();
                battleBandages--;
                var heal = 150;
                battle.playerHp = Math.min(battle.playerMaxHp, battle.playerHp + heal);
                el.querySelector('#bt-bandage-count').textContent = battleBandages;
                var hpFill = el.querySelector('#bt-player-hp-fill');
                if (hpFill) { hpFill.classList.add('bt-heal-flash'); setTimeout(function() { hpFill.classList.remove('bt-heal-flash'); }, 300); }
                addLog('Used bandage — <span style="color:#2ecc71;">+150 HP</span>');
                goNext();
            }

            function playerFlee() {
                if (!battle || battle.result) return;
                cancelEnemyTurn();
                if (Math.random() < 0.5) {
                    battle.result = 'fled';
                    addLog('Escaped — <span style="color:#888;">fight avoided</span>.');
                    showResult('fled');
                } else {
                    addLog('Failed to flee — <span style="color:#e74c3c;">enemy takes advantage!</span>');
                    enemyAction();
                }
            }

            function goNext() {
                // Tick Ghost Debt
                if (ghostDebtTimer > 0) {
                    ghostDebtTimer--;
                    if (ghostDebtTimer === 0) {
                        applyDmgToEnemy(ghostDebtStored);
                        addLog('<span style="color:#9b59b6;">💀 GHOST DEBT DETONATES!</span> — <span style="color:#e74c3c;">' + ghostDebtStored + ' stored dmg unleashed!</span>', 'bt-log-spec');
                        ghostDebtStored = 0;
                    }
                }

                // Tick effects
                applyPoisonTick();
                applyBurnTick();

                // Tick def down
                if (enemyDefDown > 0) { enemyDefDown--; if (enemyDefDown === 0) addLog('<span style="color:#888;">Enemy DEF restored.</span>'); }

                // Tick enemy rage
                if (enemyRageTurns > 0) { enemyRageTurns--; if (enemyRageTurns === 0) { enemyRage = 1; addLog('<span style="color:#888;">Enemy rage subsided.</span>'); } }

                // Tick lag stun
                if (enemyLagStun > 0) enemyLagStun--;

                // Tick cooldowns
                if (playerSpecialCD > 0) playerSpecialCD--;
                if (enemySpecialCD > 0) enemySpecialCD--;

                refreshBattleUI();
                if (!battle.result) scheduleEnemy();
            }

            // ═══════ ENEMY AI ═══════

            function scheduleEnemy() {
                triggerEnemyTurn = setTimeout(function() { enemyAction(); }, 500);
            }

            function enemyAction() {
                if (!battle || battle.result) return;

                // Lag Switch stun
                if (enemyLagStun > 0) {
                    addLog('<span style="color:#9b59b6;">' + battle.enemy.name + ' frozen by Lag Switch!</span>');
                    enemyLagStun--;
                    goNextEnemy();
                    return;
                }

                var esp = enemySpec();

                if (enemySpecialCD === 0 && Math.random() < 0.85) {
                    showTaunt(esp.name.toUpperCase() + '!');
                    var baseDmg = battle.enemy.atk * enemyRage;
                    var dmg, bonus = '';

                    switch (esp.type) {
                        case 'concreteBuffet':
                            dmg = 0;
                            for (var h = 0; h < esp.hits; h++) {
                                var hDmg = Math.max(1, Math.round(baseDmg + Math.floor(Math.random() * 11) - 5));
                                dmg += hDmg;
                            }
                            bonus = ' <span style="color:#f39c12;">(' + esp.hits + ' smashes!)</span>';
                            break;
                        case 'freshMeat':
                            var eHpPct = battle.playerHp / battle.playerMaxHp;
                            var mul = eHpPct < 0.5 ? esp.dmgMul : 1.0;
                            dmg = Math.round(baseDmg * mul);
                            if (mul > 1) bonus = ' <span style="color:#e74c3c;">💀 Below 50%! Extra damage!</span>';
                            break;
                        case 'framePerfect':
                            enemyDodging = true;
                            addLog('<span style="color:#d4af37;">' + battle.enemy.name + ': ⚡ FRAME PERFECT</span> — <span style="color:#3498db;">Will dodge next attack + counter!</span>', 'bt-log-spec');
                            enemySpecialCD = esp.cd;
                            goNextEnemy();
                            return;
                        case 'riggedOdds':
                            if (Math.random() < 0.5) {
                                dmg = Math.round(baseDmg * esp.critMul);
                                bonus = ' <span style="color:#e74c3c;">🎰 JACKPOT! ' + esp.critMul + 'x!</span>';
                            } else {
                                var heal = Math.round(battle.enemyMaxHp * esp.healPct);
                                battle.enemyHp = Math.min(battle.enemyMaxHp, battle.enemyHp + heal);
                                dmg = Math.round(baseDmg * 0.5);
                                bonus = ' <span style="color:#2ecc71;">Self-heals +' + heal + ' HP</span>';
                            }
                            break;
                        case 'nitroFuneral':
                            dmg = Math.round(baseDmg * esp.dmgMul);
                            enemyRage = esp.rageMul;
                            enemyRageTurns = 3;
                            bonus = ' <span style="color:#e67e22;">💢 Rage +40% (3 turns)</span>';
                            break;
                        case 'infection':
                            playerPoison = esp.poisonTurns;
                            playerPoisonDmg = Math.round(esp.poisonDmg * (1 + (GameApp.playerStats.level - 1) * 0.1));
                            dmg = Math.round(baseDmg);
                            bonus = ' <span style="color:#9b59b6;">☠️ Poison ' + esp.poisonTurns + ' turns — ' + playerPoisonDmg + '/turn!</span>';
                            break;
                        default:
                            dmg = Math.round(baseDmg + Math.floor(Math.random() * 11) - 5);
                    }

                    dmg = Math.max(1, dmg);
                    battle.playerHp -= dmg;
                    animateHit('player');
                    addLog('<span style="color:#e74c3c;">' + battle.enemy.name + ' uses ⚡ ' + esp.name.toUpperCase() + '</span> — <span style="color:#e74c3c;">' + dmg + ' dmg</span>' + bonus, 'bt-log-spec');
                    enemySpecialCD = esp.cd;
                } else {
                    var dmg = Math.round(battle.enemy.atk * enemyRage + Math.floor(Math.random() * 11) - 5);
                    dmg = Math.max(1, dmg);
                    battle.playerHp -= dmg;
                    animateHit('player');
                    addLog(battle.enemy.name + ' strikes — <span style="color:#e74c3c;">' + dmg + ' dmg</span>');
                }

                goNextEnemy();
            }

            function goNextEnemy() {
                if (enemySpecialCD > 0) enemySpecialCD--;
                if (enemyDefDown > 0) enemyDefDown--;
                if (enemyRageTurns > 0) { enemyRageTurns--; if (enemyRageTurns === 0) enemyRage = 1; }
                if (enemyBurn > 0) { enemyBurn--; if (enemyBurn === 0) addLog('<span style="color:#888;">Enemy burn faded.</span>'); }
                if (ghostDebtTimer > 0) {
                    ghostDebtTimer--;
                    if (ghostDebtTimer === 0) {
                        applyDmgToEnemy(ghostDebtStored);
                        addLog('<span style="color:#9b59b6;">💀 GHOST DEBT DETONATES!</span> — <span style="color:#e74c3c;">' + ghostDebtStored + ' stored dmg!</span>', 'bt-log-spec');
                        ghostDebtStored = 0;
                    }
                }
                refreshBattleUI();
                if (battle.enemyHp <= 0) { endBattle('win'); return; }
                if (battle.playerHp <= 0) { endBattle('lose'); return; }
            }

            function endBattle(result) {
                cancelEnemyTurn();
                if (tauntTimer) clearTimeout(tauntTimer);
                tauntEl.style.display = 'none';
                battle.result = result;
                if (result === 'win') {
                    GameApp.playerStats.hp = GameApp.playerStats.maxHp;
                    GameApp.playerStats.money += battle.enemy.reward;
                    GameApp.gainXP(chosenEnemy.xp);
                    battle.xpEarned = chosenEnemy.xp;
                } else {
                    battle.xpEarned = 0;
                    GameApp.playerStats.hp = battle.playerHp;
                }
                GameApp.refreshTopBar({ hp: GameApp.playerStats.hp, money: GameApp.playerStats.money });
                GameApp.switchMusic('normal');

                if (result === 'win' && chosenEnemy._mapAreaId !== undefined) {
                    var aid = chosenEnemy._mapAreaId;
                    var eid = chosenEnemy._mapEnemyIdx;
                    if (!GameApp.mapProgress[aid]) GameApp.mapProgress[aid] = [];
                    if (GameApp.mapProgress[aid].indexOf(eid) === -1) GameApp.mapProgress[aid].push(eid);
                }

                showResult(result);
            }

            function showResult(result) {
                resultOverlay.style.display = 'flex';
                if (result === 'win') {
                    el.querySelector('#bt-result-icon').textContent = '🏆';
                    el.querySelector('#bt-result-title').textContent = 'VICTORY';
                    el.querySelector('#bt-result-reward').innerHTML = '<div style="color:#d4af37;font-size:20px;font-weight:800">+₹' + battle.enemy.reward + '</div><div style="color:#2ecc71;font-size:14px;font-weight:600;margin-top:2px">+' + (battle.xpEarned || chosenEnemy.xp) + ' XP</div><div style="color:#888;font-size:12px;margin-top:4px">' + battle.enemy.name + ' defeated</div>';
                } else if (result === 'lose') {
                    el.querySelector('#bt-result-icon').textContent = '💀';
                    el.querySelector('#bt-result-title').textContent = 'DEFEATED';
                    el.querySelector('#bt-result-reward').innerHTML = '<div style="color:#e74c3c;font-size:13px">Knocked out by ' + battle.enemy.name + '</div><div style="color:#888;font-size:12px;margin-top:4px">HP fully restored</div>';
                    GameApp.playerStats.hp = GameApp.playerStats.maxHp;
                    GameApp.refreshTopBar({ hp: GameApp.playerStats.hp });
                } else {
                    el.querySelector('#bt-result-icon').textContent = '🏃';
                    el.querySelector('#bt-result-title').textContent = 'FLED';
                    el.querySelector('#bt-result-reward').innerHTML = '<div style="color:#888;font-size:13px">You escaped</div>';
                }
            }

            function launchArena() {
                cancelEnemyTurn();
                if (tauntTimer) clearTimeout(tauntTimer);
                GameApp.battleActive = true;
                var ch = chars[chosenCharIdx];
                startBattle();
                el.querySelector('#bt-enemy-img').src = battle.enemy.img;
                el.querySelector('#bt-enemy-name').textContent = battle.enemy.name;
                el.querySelector('#bt-enemy-lv-badge').textContent = 'Lv ' + battle.enemy.lv;
                el.querySelector('#bt-player-img').src = charImg(ch.img);
                el.querySelector('#bt-player-name').textContent = ch.name;
                el.querySelector('#bt-player-lv').textContent = 'Lv ' + GameApp.playerStats.level;
                el.querySelector('#bt-bandage-count').textContent = battleBandages;
                el.querySelector('#bt-enemy-hp-fill').style.background = 'linear-gradient(90deg,#e74c3c,#c0392b)';
                el.querySelector('#bt-player-hp-fill').style.background = 'linear-gradient(90deg,#2ecc71,#27ae60)';
                tauntEl.style.display = 'none';
                playerStatusEl.innerHTML = '';
                enemyStatusEl.innerHTML = '';
                logEl.innerHTML = '';
                showScreen('arena');
                refreshBattleUI();
                GameApp.switchMusic('battle');
            }

            function resetFlow() {
                cancelEnemyTurn();
                if (tauntTimer) clearTimeout(tauntTimer);
                tauntEl.style.display = 'none';
                battle = null;
                chosenEnemy = null;
                chosenCharIdx = 0;
                GameApp.battleActive = false;
                GameApp.switchMusic('normal');
                showScreen('enemy');
            }

            // ── Wire ──
            el.querySelectorAll('.bt-enemy-opt').forEach(function(opt) {
                opt.onclick = function() {
                    chosenEnemy = enemies[parseInt(this.dataset.enemyIdx)];
                    subtitleEl.textContent = 'Fight ' + chosenEnemy.name + ' — pick hero';
                    showScreen('char');
                };
            });

            el.querySelectorAll('.bt-char-unlocked').forEach(function(card) {
                card.onclick = function() {
                    chosenCharIdx = parseInt(this.dataset.charIdx);
                    GameApp.selectedWeaponIdx = chosenCharIdx;
                    launchArena();
                };
            });
            el.querySelectorAll('.bt-char-locked').forEach(function(card) {
                card.onclick = function() {
                    var ch = chars[parseInt(this.dataset.charIdx)];
                    Ext.Msg.alert('Locked', '"' + ch.name + '" unlocks at Level ' + ch.unlockAt + '.\n\nYour level: ' + GameApp.playerStats.level);
                };
            });

            el.querySelector('#bt-attack').onclick = playerAttack;
            el.querySelector('#bt-special').onclick = playerSpecial;
            el.querySelector('#bt-heal').onclick = playerHeal;
            el.querySelector('#bt-flee').onclick = playerFlee;
            el.querySelector('#bt-result-btn').onclick = resetFlow;
            resultOverlay.onclick = function(e) { if (e.target === resultOverlay) resetFlow(); };

            // Auto-launch from map tab
            if (GameApp.pendingBattleEnemy) {
                var pe = GameApp.pendingBattleEnemy;
                chosenEnemy = {
                    name: pe.name, title: pe.title, lv: pe.lv,
                    baseHp: pe.baseHp, baseAtk: pe.baseAtk,
                    reward: pe.reward, xp: pe.xp,
                    img: pe.img, special: pe.special,
                    _mapAreaId: pe.mapAreaId, _mapEnemyIdx: pe.mapEnemyIdx
                };
                GameApp.pendingBattleEnemy = null;
                chosenCharIdx = GameApp.selectedWeaponIdx >= 0 ? GameApp.selectedWeaponIdx : 0;
                launchArena();
            }

            showScreen('enemy');
        }
    };
};
