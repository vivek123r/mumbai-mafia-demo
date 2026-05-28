/**
 * Mumbai Mafia — Map Tab
 * Six themed territories with full-bleed map images, horizontal scroll selector,
 * boss roadmap, and FIGHT buttons that launch directly into the battle arena.
 */
var GameTabs = window.GameTabs || {};

GameTabs.map = function() {

    var areas = [
        {
            id: 'ice', name: 'Frozen Wasteland', desc: 'A merciless tundra ruled by frost giants.',
            img: 'img/mapImage/ice.png', unlocked: true, lvReq: 0,
            enemies: [
                { name: 'Snow Raider', title: 'Tundra Scavenger', lv: 2, baseHp: 1200, baseAtk: 25, reward: 600, xp: 150, img: 'biker', special: { name: 'Permafrost', cd: 4, type: 'concreteBuffet', hits: 3 } },
                { name: 'Glacier Knight', title: 'Frozen Vanguard', lv: 4, baseHp: 2200, baseAtk: 45, reward: 1200, xp: 350, img: 'Brute', special: { name: 'Avalanche', cd: 4, type: 'nitroFuneral', dmgMul: 2.0, rageMul: 1.35 } },
                { name: 'Jotun', title: '❄️ Frost Titan', lv: 8, baseHp: 6000, baseAtk: 80, reward: 5000, xp: 1200, img: 'Undead', special: { name: 'Absolute Zero', cd: 4, type: 'infection', poisonDmg: 55, poisonTurns: 4 }, isBoss: true }
            ]
        },
        {
            id: 'volcano', name: 'Infernal Depths', desc: 'Molten rivers and fire-born demons.',
            img: 'img/mapImage/volcano.png', unlocked: true, lvReq: 3,
            enemies: [
                { name: 'Ember Hound', title: 'Blaze Tracker', lv: 5, baseHp: 2000, baseAtk: 40, reward: 900, xp: 250, img: 'Butcher', special: { name: 'Flame Burst', cd: 3, type: 'nitroFuneral', dmgMul: 1.8, rageMul: 1.25 } },
                { name: 'Magma Lord', title: 'Lava Tyrant', lv: 8, baseHp: 4500, baseAtk: 70, reward: 2500, xp: 600, img: 'Brute', special: { name: 'Eruption', cd: 4, type: 'concreteBuffet', hits: 4 } },
                { name: 'Ifrit', title: '🔥 Inferno Archon', lv: 14, baseHp: 12000, baseAtk: 130, reward: 8000, xp: 2200, img: 'plague', special: { name: 'Hellfire Reign', cd: 4, type: 'infection', poisonDmg: 90, poisonTurns: 5 }, isBoss: true }
            ]
        },
        {
            id: 'poison', name: 'Toxic Swamp', desc: 'Vile marshlands dripping with venom.',
            img: 'img/mapImage/poison.png', unlocked: true, lvReq: 5,
            enemies: [
                { name: 'Bog Crawler', title: 'Marsh Stalker', lv: 7, baseHp: 3000, baseAtk: 55, reward: 1200, xp: 350, img: 'Brute', special: { name: 'Toxic Spit', cd: 3, type: 'infection', poisonDmg: 45, poisonTurns: 3 } },
                { name: 'Swamp Witch', title: 'Venom Mistress', lv: 10, baseHp: 5500, baseAtk: 85, reward: 3000, xp: 800, img: 'plague', special: { name: 'Plague Cloud', cd: 4, type: 'infection', poisonDmg: 75, poisonTurns: 5 } },
                { name: 'Basilisk', title: '☠️ Serpent King', lv: 16, baseHp: 16000, baseAtk: 150, reward: 10000, xp: 2800, img: 'Undead', special: { name: 'Death Venom', cd: 4, type: 'infection', poisonDmg: 130, poisonTurns: 6 }, isBoss: true }
            ]
        },
        {
            id: 'desert', name: 'Scorched Sands', desc: 'Endless dunes hiding ancient warlords.',
            img: 'img/mapImage/desert.png', unlocked: false, lvReq: 8,
            enemies: [
                { name: 'Sand Raider', title: 'Dune Marauder', lv: 9, baseHp: 4000, baseAtk: 65, reward: 1800, xp: 450, img: 'biker', special: { name: 'Sandstorm', cd: 4, type: 'concreteBuffet', hits: 5 } },
                { name: 'Scorpion Knight', title: 'Venom Lancer', lv: 12, baseHp: 7500, baseAtk: 100, reward: 4000, xp: 1000, img: 'Brute', special: { name: 'Stinger', cd: 4, type: 'infection', poisonDmg: 65, poisonTurns: 4 } },
                { name: 'Sultan Rakshas', title: '🏜️ Desert Warlord', lv: 18, baseHp: 20000, baseAtk: 170, reward: 15000, xp: 3500, img: 'cypher', special: { name: 'Mirage Assault', cd: 3, type: 'framePerfect' }, isBoss: true }
            ]
        },
        {
            id: 'sky', name: 'Sky Citadel', desc: 'Floating fortress of the elusive Celestials.',
            img: 'img/mapImage/sky.png', unlocked: false, lvReq: 12,
            enemies: [
                { name: 'Storm Falcon', title: 'Wind Dancer', lv: 13, baseHp: 6000, baseAtk: 85, reward: 2500, xp: 600, img: 'Brute', special: { name: 'Perfect Dodge', cd: 3, type: 'framePerfect' } },
                { name: 'Tempest Lord', title: 'Hurricane Bringer', lv: 16, baseHp: 10000, baseAtk: 120, reward: 6000, xp: 1500, img: 'cypher', special: { name: 'Eye of Storm', cd: 4, type: 'concreteBuffet', hits: 6 } },
                { name: 'Seraphim', title: '👼 Celestial Overlord', lv: 22, baseHp: 28000, baseAtk: 200, reward: 22000, xp: 5000, img: 'Undead', special: { name: 'Divine Judgment', cd: 4, type: 'nitroFuneral', dmgMul: 3.0, rageMul: 1.6 }, isBoss: true }
            ]
        },
        {
            id: 'future', name: 'Neo Mumbai 2099', desc: 'Cyberpunk dystopia ruled by AI overlords.',
            img: 'img/mapImage/future.png', unlocked: false, lvReq: 16,
            enemies: [
                { name: 'Glitch Drone', title: 'Error Protocol', lv: 17, baseHp: 9000, baseAtk: 110, reward: 4000, xp: 1000, img: 'Brute', special: { name: 'System Crash', cd: 4, type: 'riggedOdds', critMul: 2.5, healPct: 0.2 } },
                { name: 'Data Phantom', title: 'Ghost in Machine', lv: 20, baseHp: 15000, baseAtk: 160, reward: 9000, xp: 2200, img: 'plague', special: { name: 'Quantum Strike', cd: 3, type: 'framePerfect' } },
                { name: 'OMEGA.AI', title: '🤖 Digital God', lv: 26, baseHp: 35000, baseAtk: 240, reward: 35000, xp: 8000, img: 'cypher', special: { name: 'Reality Wipe', cd: 4, type: 'infection', poisonDmg: 180, poisonTurns: 6 }, isBoss: true }
            ]
        }
    ];

    var playerLevel = GameApp.playerStats.level;
    function isUnlocked(area) { return playerLevel >= area.lvReq; }

    function areaProgress(area) {
        if (!GameApp.mapProgress[area.id]) GameApp.mapProgress[area.id] = [];
        return GameApp.mapProgress[area.id].length;
    }

    function areaTotal(area) { return area.enemies.length; }

    function isEnemyDefeated(areaId, idx) {
        if (!GameApp.mapProgress[areaId]) return false;
        return GameApp.mapProgress[areaId].indexOf(idx) !== -1;
    }

    function canFight(areaId, idx) {
        if (idx === 0) return !isEnemyDefeated(areaId, 0);
        return isEnemyDefeated(areaId, idx - 1) && !isEnemyDefeated(areaId, idx);
    }

    var html = '<div class="tab-view map-tab">';

    // Horizontal area selector at top
    html += '<div class="map-area-strip" id="map-area-strip">';
    areas.forEach(function(area, idx) {
        var unlocked = isUnlocked(area);
        html += '<div class="map-area-thumb' + (unlocked ? '' : ' map-area-thumb-locked') + '" data-area-idx="' + idx + '" id="map-thumb-' + idx + '">';
        html += '<div class="map-thumb-img" style="background-image:url(' + area.img + ')"></div>';
        html += '<span class="map-thumb-name">' + area.name + '</span>';
        if (!unlocked) html += '<span class="map-thumb-lvreq">🔒 LV ' + area.lvReq + '</span>';
        html += '</div>';
    });
    html += '</div>';

    // Full-bleed area view
    html += '<div class="map-area-view" id="map-area-view">';
    html += '<div class="map-area-bg" id="map-area-bg"></div>';
    html += '<div class="map-area-overlay">';
    html += '<div class="map-area-header">';
    html += '<h2 class="map-area-title" id="map-area-title"></h2>';
    html += '<p class="map-area-desc" id="map-area-desc"></p>';
    html += '</div>';
    html += '<div class="map-roadmap" id="map-roadmap"></div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    return {
        html: html,
        setup: function(el, nav) {

            var areaView = el.querySelector('#map-area-view');
            var areaBg = el.querySelector('#map-area-bg');
            var areaTitle = el.querySelector('#map-area-title');
            var areaDesc = el.querySelector('#map-area-desc');
            var roadmapEl = el.querySelector('#map-roadmap');
            var currentAreaIdx = 0;

            function selectArea(idx) {
                currentAreaIdx = idx;

                el.querySelectorAll('.map-area-thumb').forEach(function(t, i) {
                    t.classList.toggle('map-area-thumb-active', i === idx);
                });

                var area = areas[idx];
                areaBg.style.backgroundImage = 'url(' + area.img + ')';
                areaTitle.textContent = area.name;
                areaDesc.textContent = area.desc;

                var unlocked = isUnlocked(area);
                var defCount = areaProgress(area);
                var total = areaTotal(area);

                var html = '';
                area.enemies.forEach(function(enemy, eIdx) {
                    var defeated = isEnemyDefeated(area.id, eIdx);
                    var fightable = canFight(area.id, eIdx);
                    var isBoss = enemy.isBoss;

                    html += '<div class="map-rnode' + (isBoss ? ' map-rnode-boss' : '') + (defeated ? ' map-rnode-done' : '') + '">';
                    html += '<div class="map-rnode-badge">' + (defeated ? '✓' : (eIdx + 1)) + '</div>';
                    html += '<div class="map-rnode-body">';
                    html += '<span class="map-rnode-name">' + enemy.name + (isBoss ? ' 👑' : '') + '</span>';
                    html += '<span class="map-rnode-title">' + enemy.title + ' — Lv ' + enemy.lv + '</span>';
                    html += '<div class="map-rnode-stats">❤️ ' + enemy.baseHp + ' · ⚔️ ' + enemy.baseAtk + ' · 🏆 ₹' + enemy.reward + '</div>';
                    html += '</div>';

                    if (defeated) {
                        html += '<span class="map-rnode-tag map-rnode-tag-done">DEFEATED</span>';
                    } else if (fightable && unlocked) {
                        html += '<button class="map-fight-btn" data-area="' + area.id + '" data-enemy="' + eIdx + '">FIGHT</button>';
                    } else if (!unlocked) {
                        html += '<span class="map-rnode-tag map-rnode-tag-locked">🔒 LV ' + area.lvReq + '</span>';
                    } else {
                        html += '<span class="map-rnode-tag">🔒 LOCKED</span>';
                    }

                    html += '</div>';
                });

                var pct = total > 0 ? Math.round(defCount / total * 100) : 0;
                html += '<div class="map-progress-bar"><div class="map-progress-fill" style="width:' + pct + '%"></div></div>';
                html += '<div class="map-progress-label">' + defCount + '/' + total + ' defeated · ' + pct + '%</div>';

                roadmapEl.innerHTML = html;

                roadmapEl.querySelectorAll('.map-fight-btn').forEach(function(btn) {
                    btn.onclick = function() {
                        var aId = this.dataset.area;
                        var eIdx = parseInt(this.dataset.enemy);
                        launchFight(aId, eIdx, nav);
                    };
                });
            }

            function launchFight(areaId, enemyIdx, nav) {
                var area = areas.find(function(a) { return a.id === areaId; });
                if (!area) return;
                var enemy = area.enemies[enemyIdx];

                GameApp.pendingBattleEnemy = {
                    mapAreaId: areaId,
                    mapEnemyIdx: enemyIdx,
                    name: enemy.name,
                    title: enemy.title,
                    lv: enemy.lv,
                    baseHp: enemy.baseHp,
                    baseAtk: enemy.baseAtk,
                    reward: enemy.reward,
                    xp: enemy.xp,
                    img: enemy.img,
                    special: enemy.special
                };

                nav('battle');
            }

            // Strip clicks
            el.querySelectorAll('.map-area-thumb').forEach(function(thumb) {
                thumb.onclick = function() {
                    var idx = parseInt(this.dataset.areaIdx);
                    var area = areas[idx];
                    if (!isUnlocked(area)) {
                        Ext.Msg.alert('Locked', 'Reach Level ' + area.lvReq + ' to unlock ' + area.name + '.');
                        return;
                    }
                    selectArea(idx);
                };
            });

            // Init with first unlocked area
            var startIdx = 0;
            for (var i = 0; i < areas.length; i++) {
                if (isUnlocked(areas[i])) { startIdx = i; break; }
            }
            selectArea(startIdx);
        }
    };
};
