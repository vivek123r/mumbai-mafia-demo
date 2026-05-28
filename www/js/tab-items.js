/**
 * Mumbai Mafia — Weapons Tab
 * Column list with image + name. Tap to open detail overlay with upgrade system.
 */
var GameTabs = window.GameTabs || {};

GameTabs.items = function() {
    var weapons = [
        { id: 'glitch', name: 'Voltage Striker', type: 'EMP Baton', charName: 'Glitch', rarity: 'Rare', rarityColor: '#81d4fa', speed: 'Fast', range: 'Melee', perk: 'Lag Switch — Freeze enemies for 2 turns', desc: 'A charged baton that delivers 50,000 volts and fries any electronics within a 3-meter radius.', img: 'img/weapons/glitch.png', bgGradient: 'linear-gradient(180deg, #0a1420 0%, #080e18 100%)', glowColor: 'rgba(129, 212, 250, 0.35)' },
        { id: 'titan', name: 'Aegis Crusher', type: 'Shield-Fist', charName: 'Titan', rarity: 'Epic', rarityColor: '#e74c3c', speed: 'Medium', range: 'Melee', perk: 'Human Bulldozer — 2.2x slam + DEF debuff', desc: 'A colossal shield fused with hydraulic pistons. Defense and destruction in one unbreakable package.', img: 'img/weapons/titan.png', bgGradient: 'linear-gradient(180deg, #1e0a0a 0%, #1a0808 100%)', glowColor: 'rgba(231, 76, 60, 0.4)' },
        { id: 'phantom', name: 'Wraith Blades', type: 'Twin Daggers', charName: 'Phantom', rarity: 'Legendary', rarityColor: '#9b59b6', speed: 'Ultra Fast', range: 'Melee', perk: 'Ghost Debt — Mark & detonate stored damage', desc: 'Carbon-fiber blades coated in light-absorbing polymer. They make no sound. They leave no trace.', img: 'img/weapons/phantom.png', bgGradient: 'linear-gradient(180deg, #140a1e 0%, #100818 100%)', glowColor: 'rgba(155, 89, 182, 0.4)' },
        { id: 'vex', name: 'Shadow Protocol', type: 'Smart Pistol', charName: 'Vex', rarity: 'Legendary', rarityColor: '#2ecc71', speed: 'Fast', range: 'Medium', perk: 'Deadeye Roulette — 50/50 weak or 4x headshot', desc: 'A neural-linked sidearm that syncs with Vex\'s tactical HUD. Every shot is calculated. Every kill is data.', img: 'img/weapons/vex.png', bgGradient: 'linear-gradient(180deg, #0a1e14 0%, #081a10 100%)', glowColor: 'rgba(46, 204, 113, 0.4)' },
        { id: 'inferna', name: 'Hellforged Gauntlets', type: 'Heavy Melee', charName: 'Inferna', rarity: 'Legendary', rarityColor: '#e67e22', speed: 'Slow', range: 'Melee', perk: 'Overheat Combo — 3-hit flame combo + burn', desc: 'Molten steel forged in underground foundries. Every punch leaves a trail of fire and ash.', img: 'img/weapons/raze.png', bgGradient: 'linear-gradient(180deg, #1e1008 0%, #1a0e08 100%)', glowColor: 'rgba(230, 126, 34, 0.4)' }
    ];

    var html = '<div class="tab-view weapons-tab">';
    html += '<div class="tab-title-bar"><span class="tab-title">ARMORY</span><span class="tab-subtitle">' + weapons.length + ' weapons</span></div>';

    // List
    html += '<div class="wpn-list">';
    weapons.forEach(function(w, i) {
        var wsp = GameApp.weapons[i];
        html += '<div class="wpn-card" data-wpn-idx="' + i + '" style="border-color:' + w.rarityColor + '">';
        html += '<div class="wpn-card-bg" style="background:' + w.bgGradient + '"></div>';
        html += '<div class="wpn-card-inner">';
        html += '<div class="wpn-card-image-zone"><img class="wpn-card-image" src="' + w.img + '" alt="' + w.name + '"></div>';
        html += '<div class="wpn-card-label"><span class="wpn-card-name">' + w.name + '</span><span class="wpn-card-rarity" style="color:' + w.rarityColor + '">' + w.rarity + ' • Lv <b>' + wsp.level + '</b></span></div>';
        html += '</div></div>';
    });
    html += '</div>';

    // Detail overlay
    html += '<div class="wpn-overlay" id="wpn-overlay" style="display:none">';
    html += '<div class="wpn-overlay-bg" id="wpn-overlay-bg"></div>';
    html += '<button class="wpn-overlay-close" id="wpn-overlay-close">✕</button>';
    html += '<div class="wpn-overlay-scroll">';
    html += '<div class="wpn-overlay-image-zone"><img class="wpn-overlay-image" id="wpn-overlay-image" src=""><div class="wpn-overlay-glow" id="wpn-overlay-glow"></div></div>';
    html += '<div class="wpn-overlay-info">';
    html += '<div class="wpn-overlay-rarity-badge" id="wpn-overlay-rarity-badge"></div>';
    html += '<div class="wpn-overlay-name" id="wpn-overlay-name"></div>';
    html += '<div class="wpn-overlay-type" id="wpn-overlay-type"></div>';
    html += '<div class="wpn-overlay-owner"><span>Wielded by</span> <strong id="wpn-overlay-char-name"></strong></div>';
    html += '<div class="wpn-overlay-pills">';
    html += '<div class="wpn-ov-pill wpn-ov-pill-dmg"><span class="wpn-ov-pill-val" id="wpn-ov-dmg"></span><span class="wpn-ov-pill-label">Damage</span></div>';
    html += '<div class="wpn-ov-pill wpn-ov-pill-spd"><span class="wpn-ov-pill-val" id="wpn-ov-speed"></span><span class="wpn-ov-pill-label">Speed</span></div>';
    html += '<div class="wpn-ov-pill wpn-ov-pill-rng"><span class="wpn-ov-pill-val" id="wpn-ov-range"></span><span class="wpn-ov-pill-label">Range</span></div>';
    html += '</div>';
    html += '<div class="wpn-overlay-level" id="wpn-overlay-level"></div>';
    html += '<button class="wpn-upgrade-btn" id="wpn-upgrade-btn"></button>';
    html += '<div class="wpn-overlay-perk" id="wpn-overlay-perk"></div>';
    html += '<div class="wpn-overlay-desc" id="wpn-overlay-desc"></div>';
    html += '</div></div></div></div>';

    return {
        html: html,
        setup: function(el, nav) {
            var overlay = el.querySelector('#wpn-overlay');
            var overlayBg = el.querySelector('#wpn-overlay-bg');
            var overlayImage = el.querySelector('#wpn-overlay-image');
            var overlayGlow = el.querySelector('#wpn-overlay-glow');
            var overlayName = el.querySelector('#wpn-overlay-name');
            var overlayType = el.querySelector('#wpn-overlay-type');
            var overlayCharName = el.querySelector('#wpn-overlay-char-name');
            var overlayRarityBadge = el.querySelector('#wpn-overlay-rarity-badge');
            var overlayPerk = el.querySelector('#wpn-overlay-perk');
            var overlayDesc = el.querySelector('#wpn-overlay-desc');
            var overlayDmg = el.querySelector('#wpn-ov-dmg');
            var overlaySpeed = el.querySelector('#wpn-ov-speed');
            var overlayRange = el.querySelector('#wpn-ov-range');
            var overlayLevel = el.querySelector('#wpn-overlay-level');
            var upgradeBtn = el.querySelector('#wpn-upgrade-btn');
            var currentOverlayIdx = -1;

            function refreshOverlay() {
                if (currentOverlayIdx < 0) return;
                var w = weapons[currentOverlayIdx];
                var wsp = GameApp.weapons[currentOverlayIdx];
                var dmg = wsp.baseDmg + (wsp.level - 1) * wsp.dmgPerLevel;
                var nextDmg = wsp.baseDmg + wsp.level * wsp.dmgPerLevel;
                var cost = wsp.upgradeCost * wsp.level;

                overlayDmg.textContent = dmg;
                overlayLevel.innerHTML = 'Level <b style="color:#d4af37">' + wsp.level + '</b> → Level <b style="color:#fff">' + (wsp.level + 1) + '</b> &nbsp;|&nbsp; Next: <b style="color:' + w.rarityColor + '">' + nextDmg + ' DMG</b>';

                upgradeBtn.textContent = '⬆ UPGRADE — ₹' + GameApp._fmtMoney(cost);
                if (wsp.level >= 20) {
                    upgradeBtn.textContent = 'MAX LEVEL';
                    upgradeBtn.classList.add('wpn-upgrade-max');
                    upgradeBtn.disabled = true;
                } else {
                    upgradeBtn.classList.remove('wpn-upgrade-max');
                    upgradeBtn.disabled = false;
                }

                // Update list card level
                var card = el.querySelector('.wpn-card[data-wpn-idx="' + currentOverlayIdx + '"]');
                if (card) {
                    var lvEl = card.querySelector('.wpn-card-rarity b');
                    if (lvEl) lvEl.textContent = wsp.level;
                }
            }

            function openDetail(idx) {
                currentOverlayIdx = idx;
                GameApp.selectedWeaponIdx = idx;
                var w = weapons[idx];
                var wsp = GameApp.weapons[idx];
                var dmg = wsp.baseDmg + (wsp.level - 1) * wsp.dmgPerLevel;

                overlayBg.style.background = w.bgGradient;
                overlayGlow.style.boxShadow = '0 0 150px ' + w.glowColor;
                overlayImage.src = w.img;
                overlayName.textContent = w.name;
                overlayType.textContent = w.type;
                overlayCharName.textContent = w.charName;
                overlayRarityBadge.textContent = w.rarity;
                overlayRarityBadge.style.background = w.rarityColor;
                overlayPerk.innerHTML = '⚡ ' + w.perk;
                overlayDesc.textContent = w.desc;
                overlayDmg.textContent = dmg;
                overlaySpeed.textContent = w.speed;
                overlayRange.textContent = w.range;
                overlay.style.display = 'flex';
                refreshOverlay();
            }

            function closeDetail() {
                overlay.style.display = 'none';
                currentOverlayIdx = -1;
            }

            upgradeBtn.onclick = function() {
                if (currentOverlayIdx < 0) return;
                var w = weapons[currentOverlayIdx];
                if (GameApp.upgradeWeapon(currentOverlayIdx)) {
                    GameApp.refreshTopBar({ money: GameApp.playerStats.money });
                    refreshOverlay();
                    Ext.Msg.alert('UPGRADED!', w.name + ' is now Level ' + GameApp.weapons[currentOverlayIdx].level + '!\n\n⚔️ DMG: ' + GameApp.getWeaponDamage());
                } else {
                    var cost = GameApp.weapons[currentOverlayIdx].upgradeCost * GameApp.weapons[currentOverlayIdx].level;
                    Ext.Msg.alert('Not Enough Cash', 'You need ₹' + cost + ' to upgrade.\n\nCurrent balance: ₹' + GameApp._fmtMoney(GameApp.playerStats.money));
                }
            };

            el.querySelector('#wpn-overlay-close').onclick = closeDetail;
            overlayBg.onclick = function(e) { if (e.target === overlayBg) closeDetail(); };

            el.querySelectorAll('.wpn-card').forEach(function(card) {
                card.onclick = function() {
                    var idx = parseInt(this.dataset.wpnIdx);
                    openDetail(idx);
                };
            });
        }
    };
};
