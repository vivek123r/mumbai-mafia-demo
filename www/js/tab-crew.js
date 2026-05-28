/**
 * Mumbai Mafia — Crew Tab
 * Character showcase with full-art backgrounds and smooth transitions.
 * Tap to switch between crew members. Images preloaded for zero lag.
 */
var GameTabs = window.GameTabs || {};

GameTabs.crew = function() {
    var members = [
        { id: 'vex', name: 'Vex', role: 'Tactical Genius', lv: 5, hp: 800, maxHp: 800, atk: 60, def: 40, desc: 'Deadeye Roulette — 50/50 weak or devastating 4x sniper.', img: 'img/character-WB/vex.png', video: 'video/character/vex_video.mp4', unlockAt: 0 },
        { id: 'inferna', name: 'Inferna', role: 'Flame Wielder', lv: 6, hp: 1200, maxHp: 1200, atk: 85, def: 50, desc: 'Overheat Combo — 3-hit flame strike + burn.', img: 'img/character-WB/raze.png', unlockAt: 1 },
        { id: 'titan', name: 'Titan', role: 'Juggernaut', lv: 7, hp: 1500, maxHp: 1500, atk: 70, def: 80, desc: 'Human Bulldozer — 2.2x slam + enemy DEF debuff.', img: 'img/character-WB/titan.png', unlockAt: 2 },
        { id: 'phantom', name: 'Phantom', role: 'Shadow Operative', lv: 5, hp: 900, maxHp: 900, atk: 95, def: 30, desc: 'Ghost Debt — Stores damage, detonates after 2 turns.', img: 'img/character-WB/phantom.png', unlockAt: 3 },
        { id: 'glitch', name: 'Glitch', role: 'Cyber Runner', lv: 4, hp: 750, maxHp: 750, atk: 55, def: 35, desc: 'Lag Switch — Freezes enemy for 2 turns.', img: 'img/character-WB/glitch.png', unlockAt: 5 }
    ];

    var playerLevel = GameApp.playerStats.level;
    function isActive(m) { return playerLevel >= m.unlockAt; }

    var html = '<div class="tab-view crew-tab">';

    // Character background display
    html += '<div class="crew-showcase" id="crew-showcase">';
    html += '<div class="crew-bg-single" id="crew-bg-single"></div>';
    html += '<video class="crew-video" id="crew-video" muted loop playsinline preload="auto" src="video/character/vex_video.mp4"></video>';
    html += '<div class="crew-bg-gradient"></div>';

    // Stats overlay card
    html += '<div class="crew-stats-card" id="crew-stats-card">';
    html += '<span class="crew-char-name" id="crew-char-name"></span>';
    html += '<span class="crew-char-role" id="crew-char-role"></span>';
    html += '<span class="crew-char-desc" id="crew-char-desc"></span>';
    html += '<div class="crew-char-hp-wrap"><div class="crew-char-hp-bar"><div class="crew-char-hp-fill" id="crew-char-hp-fill"></div></div><span class="crew-char-hp-text" id="crew-char-hp-text"></span></div>';
    html += '<div class="crew-char-stat-row"><span>⚔️ ATK <b id="crew-char-atk"></b></span><span class="crew-stat-div">|</span><span>🛡️ DEF <b id="crew-char-def"></b></span><span class="crew-stat-div">|</span><span>⭐ LV <b id="crew-char-lv"></b></span></div>';
    html += '<button class="crew-deploy-btn" id="crew-deploy-btn">DEPLOY</button>';
    html += '</div>';

    html += '</div>'; // crew-showcase

    // Character selector strip
    html += '<div class="crew-selector" id="crew-selector">';
    members.forEach(function(m, i) {
        var active = isActive(m);
        html += '<div class="crew-chip chip-selectable" data-crew-idx="' + i + '">';
        html += '<div class="crew-chip-img" style="background-image:url(' + m.img + ');background-position:top;background-size:cover;"></div>';
        html += '<span class="crew-chip-name">' + m.name + '</span>';
        if (!active) html += '<span class="crew-chip-lock">🔒 LV ' + m.unlockAt + '</span>';
        html += '</div>';
    });
    html += '</div>';

    html += '</div>'; // tab-view

    return {
        html: html,
        setup: function(el, nav) {
            var bgA = el.querySelector('#crew-bg-single');
            var crewVideo = el.querySelector('#crew-video');
            var currentIdx = 0;
            var transitioning = false;

            var nameEl = el.querySelector('#crew-char-name');
            var roleEl = el.querySelector('#crew-char-role');
            var descEl = el.querySelector('#crew-char-desc');
            var hpFill = el.querySelector('#crew-char-hp-fill');
            var hpText = el.querySelector('#crew-char-hp-text');
            var atkEl = el.querySelector('#crew-char-atk');
            var defEl = el.querySelector('#crew-char-def');
            var lvEl = el.querySelector('#crew-char-lv');
            var deployBtn = el.querySelector('#crew-deploy-btn');

            // Preload all images
            members.forEach(function(m) {
                var img = new Image();
                img.src = m.img;
            });

            function showChar(idx) {
                if (transitioning || idx === currentIdx) return;
                transitioning = true;

                var m = members[idx];

                crewVideo.pause();
                crewVideo.classList.remove('showing');
                crewVideo.style.opacity = '0';
                crewVideo.style.transition = '';

                if (m.video) {
                    bgA.style.opacity = '0';
                    if (crewVideo.src.indexOf(m.video) === -1) {
                        crewVideo.src = m.video;
                        crewVideo.load();
                    }
                    crewVideo.classList.add('showing');
                    crewVideo.style.opacity = '1';
                    crewVideo.play().catch(function() {});
                } else {
                    bgA.style.backgroundImage = 'url(' + m.img + ')';
                    bgA.style.opacity = '1';
                }

                // Update stats
                nameEl.textContent = m.name;
                roleEl.textContent = m.role;
                descEl.textContent = m.desc;
                var hpPct = Math.round(m.hp / m.maxHp * 100);
                hpFill.style.width = hpPct + '%';
                hpText.textContent = m.hp + ' / ' + m.maxHp + ' HP';
                atkEl.textContent = m.atk;
                defEl.textContent = m.def;
                lvEl.textContent = m.lv;

                if (isActive(m)) {
                    deployBtn.textContent = 'DEPLOY';
                    deployBtn.classList.remove('locked-btn');
                } else {
                    deployBtn.textContent = 'LOCKED — Reach LV ' + m.unlockAt;
                    deployBtn.classList.add('locked-btn');
                }

                currentIdx = idx;

                // Highlight chip
                el.querySelectorAll('.crew-chip').forEach(function(c, i) {
                    c.classList.toggle('chip-selected', i === idx);
                });

                setTimeout(function() { transitioning = false; }, 400);
            }

            // Init with Vex — video src in HTML starts buffering immediately
            var first = members[0];
            crewVideo.classList.add('showing');
            crewVideo.addEventListener('canplay', function onReady() {
                crewVideo.style.transition = 'opacity 0.15s ease';
                crewVideo.style.opacity = '1';
                crewVideo.removeEventListener('canplay', onReady);
            }, { once: true });
            crewVideo.play().catch(function() {});
            // Populate initial stats
            nameEl.textContent = first.name;
            roleEl.textContent = first.role;
            descEl.textContent = first.desc;
            var hpPct = Math.round(first.hp / first.maxHp * 100);
            hpFill.style.width = hpPct + '%';
            hpText.textContent = first.hp + ' / ' + first.maxHp + ' HP';
            atkEl.textContent = first.atk;
            defEl.textContent = first.def;
            lvEl.textContent = first.lv;
            if (isActive(first)) {
                deployBtn.textContent = 'DEPLOY';
                deployBtn.classList.remove('locked-btn');
            } else {
                deployBtn.textContent = 'LOCKED — Reach LV ' + first.unlockAt;
                deployBtn.classList.add('locked-btn');
            }

            // Chip clicks
            el.querySelectorAll('.crew-chip').forEach(function(chip) {
                chip.onclick = function() {
                    var idx = parseInt(this.dataset.crewIdx);
                    showChar(idx);
                };
            });

            deployBtn.onclick = function() {
                var m = members[currentIdx];
                if (!isActive(m)) {
                    Ext.Msg.alert('Locked', 'Reach Level ' + m.unlockAt + ' to unlock ' + m.name + '.');
                    return;
                }
                Ext.Msg.alert('DEPLOYED', m.name + ' is now your active fighter!\n\n⚔️ ATK ' + m.atk + ' | 🛡️ DEF ' + m.def);
            };

            el._cleanup = function() {
                crewVideo.pause();
                crewVideo.classList.remove('showing');
                crewVideo.style.opacity = '';
            };
        }
    };
};
