/**
 * Mumbai Mafia - App Controller
 * Login → 5-tab layout (Map, Items, Battle, Crew, Shop) with persistent top bar
 */
(function() {
    'use strict';

    var App = {
        username: null,
        currentScreen: 'login',
        currentTab: 'battle',

        playerStats: {
            name: 'Boss',
            title: 'Don of Dharavi',
            level: 0,
            xp: 0,
            xpToNext: 200,
            hp: 500,
            maxHp: 500,
            energy: 87,
            maxEnergy: 100,
            money: 250
        },

        weapons: [
            { id: 'vex', baseDmg: 180, dmgPerLevel: 65, level: 1, upgradeCost: 1500, unlockLevel: 0 },
            { id: 'inferna', baseDmg: 280, dmgPerLevel: 100, level: 1, upgradeCost: 2000, unlockLevel: 1 },
            { id: 'titan', baseDmg: 210, dmgPerLevel: 70, level: 1, upgradeCost: 1800, unlockLevel: 2 },
            { id: 'phantom', baseDmg: 150, dmgPerLevel: 45, level: 1, upgradeCost: 1200, unlockLevel: 3 },
            { id: 'glitch', baseDmg: 130, dmgPerLevel: 30, level: 1, upgradeCost: 1000, unlockLevel: 5 }
        ],
        selectedWeaponIdx: 0,

        battleActive: false,

        pendingBattleEnemy: null,
        mapProgress: {},

        getWeaponDamage: function() {
            var w = this.weapons[this.selectedWeaponIdx];
            return w.baseDmg + (w.level - 1) * w.dmgPerLevel;
        },

        getWeaponUpgradeCost: function(idx) {
            var w = this.weapons[idx];
            return w.upgradeCost * w.level;
        },

        gainXP: function(amount) {
            var s = this.playerStats;
            s.xp += amount;
            while (s.xp >= s.xpToNext) {
                s.xp -= s.xpToNext;
                s.level++;
                s.xpToNext = Math.round(s.xpToNext * 1.4);
                s.maxHp = Math.round(s.maxHp * 1.15);
                s.hp = s.maxHp;
                s.maxEnergy = Math.min(200, s.maxEnergy + 5);
                s.energy = Math.min(s.maxEnergy, s.energy + 10);
            }
            this.refreshTopBar({ level: s.level, hp: s.hp, maxHp: s.maxHp, energy: s.energy, maxEnergy: s.maxEnergy });
        },

        upgradeWeapon: function(idx) {
            var w = this.weapons[idx];
            var cost = w.upgradeCost * w.level;
            if (this.playerStats.money >= cost) {
                this.playerStats.money -= cost;
                w.level++;
                return true;
            }
            return false;
        },

        tabViews: {},
        activeTabEl: null,

        init: function() {
            var appEl = document.getElementById('app');
            appEl.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;';

            // Login
            this.loginView = Ext.create({ xtype: 'loginview' });
            appEl.appendChild(this.loginView.el);

            // Main game container (everything post-login)
            this.gameView = document.createElement('div');
            this.gameView.className = 'game-container';
            this.gameView.style.cssText = 'display:none;flex-direction:column;height:100%;width:100%;position:absolute;top:0;left:0;';
            appEl.appendChild(this.gameView);

            // Persistent top bar (must be first child so it sits at the top)
            this.buildTopBar();
            this.gameView.appendChild(this.topBar);

            // Content area (where tab content goes)
            this.contentArea = document.createElement('div');
            this.contentArea.className = 'tab-content-area';
            this.contentArea.style.cssText = 'flex:1;overflow:hidden;position:relative;';
            this.gameView.appendChild(this.contentArea);

            // Tab views container (all pre-rendered)
            var tabs = ['map', 'items', 'battle', 'crew', 'shop'];
            var self = this;

            tabs.forEach(function(tabId) {
                var tabEl = document.createElement('div');
                tabEl.className = 'tab-panel';
                tabEl.style.cssText = 'display:none;position:absolute;top:0;left:0;width:100%;height:100%;overflow-y:auto;';
                tabEl.setAttribute('data-tab', tabId);
                self.contentArea.appendChild(tabEl);
                self.tabViews[tabId] = tabEl;
            });

            // Bottom nav
            this.buildBottomNav();
            this.gameView.appendChild(this.navBar);

            // Login callbacks
            this.loginView.onSignIn = function(username) {
                self.username = username;
                self.refreshTopBar({ name: username });
                self.loginView.hide();
                self.gameView.style.display = 'flex';
                self.renderTab('battle');
                self.highlightNav('battle');
                self.startMusic();
            };

            // Kickoff
            this.showScreen('login');
        },

        buildBottomNav: function() {
            this.navBar = document.createElement('div');
            this.navBar.className = 'bottom-nav';

            var tabs = [
                { id: 'map', icon: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z', label: 'Map' },
                { id: 'items', icon: 'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z', label: 'Weapons' },
                { id: 'battle', icon: 'M15 1l-4 4v2h2l4-4-2-2zm-4 8c-1.1 0-2 .9-2 2v1H8v3h1v1c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2h-6zm0 2h6v5h-6v-5zm-6 3H3v2h2v-2z', label: 'Battle' },
                { id: 'crew', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', label: 'Crew' },
                { id: 'shop', icon: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z', label: 'Shop' }
            ];

            var self = this;

            tabs.forEach(function(t) {
                var btn = document.createElement('button');
                btn.className = 'nav-item';
                btn.setAttribute('data-tab', t.id);
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="' + t.icon + '"/></svg><span>' + t.label + '</span>';
                btn.onclick = function() {
                    if (self.battleActive) return;
                    self.renderTab(t.id);
                    self.highlightNav(t.id);
                };
                self.navBar.appendChild(btn);
            });
        },

        renderTab: function(tabId) {
            var el = this.tabViews[tabId];
            if (!el) return;

            // Cleanup previous tab's intervals
            var prevEl = this.tabViews[this.currentTab];
            if (prevEl && prevEl._cleanup) {
                prevEl._cleanup();
                prevEl._cleanup = null;
            }

            // Hide all
            Object.values(this.tabViews).forEach(function(v) { v.style.display = 'none'; });

            // Battle & Crew always re-render
            if (tabId === 'battle' || tabId === 'crew') {
                var reEl = this.tabViews[tabId];
                reEl.removeAttribute('data-rendered');
                if (reEl._cleanup) { reEl._cleanup(); reEl._cleanup = null; }
            }

            // Already rendered?
            if (el.hasAttribute('data-rendered')) {
                el.style.display = 'block';
                this.currentTab = tabId;
                return;
            }

            // Render content
            var content = '';
            var setupFn = null;

            switch (tabId) {
                case 'map':
                    var r = GameTabs.map();
                    content = r.html;
                    setupFn = r.setup;
                    break;
                case 'items':
                    var r2 = GameTabs.items();
                    content = r2.html;
                    setupFn = r2.setup;
                    break;
                case 'battle':
                    var r3 = GameTabs.battle();
                    content = r3.html;
                    setupFn = r3.setup;
                    break;
                case 'crew':
                    var r4 = GameTabs.crew();
                    content = r4.html;
                    setupFn = r4.setup;
                    break;
                case 'shop':
                    var r5 = GameTabs.shop();
                    content = r5.html;
                    setupFn = r5.setup;
                    break;
            }

            el.innerHTML = content;
            el.setAttribute('data-rendered', '1');
            el.style.display = 'block';

            if (setupFn) setupFn(el, this.navigate.bind(this));

            this.currentTab = tabId;
        },

        buildTopBar: function() {
            var s = this.playerStats;
            var enPct = Math.round(s.energy / s.maxEnergy * 100);
            this.topBar = document.createElement('div');
            this.topBar.className = 'top-bar';
            this.topBar.innerHTML =
                '<div class="tb-left">' +
                    '<div class="tb-avatar">' +
                        '<svg viewBox="0 0 100 100" width="28" height="28"><circle cx="50" cy="50" r="48" fill="#1a1a1a" stroke="#d4af37" stroke-width="2"/><circle cx="50" cy="38" r="16" fill="#333"/><ellipse cx="50" cy="78" rx="30" ry="22" fill="#333"/></svg>' +
                        '<span class="tb-lv-badge">' + s.level + '</span>' +
                    '</div>' +
                    '<div class="tb-identity">' +
                        '<span class="tb-name gold" id="tb-pname">' + s.name + '</span>' +
                        '<span class="tb-title" title="' + s.title + '">' + s.title + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="tb-right">' +
                    '<div class="tb-stat tb-energy">⚡ <span class="tb-en-num">' + s.energy + '</span>/' + s.maxEnergy + '<div class="tb-mini-bar tb-en-bar"><div class="tb-mini-fill tb-en-fill" style="width:' + enPct + '%"></div></div></div>' +
                    '<div class="tb-stat tb-money">💰 <span class="tb-mon-num">' + this._fmtMoney(s.money) + '</span></div>' +
                    '<div class="tb-xp-wrap"><span class="tb-xp-label">LV ' + s.level + '</span><div class="tb-mini-bar tb-xp-bar"><div class="tb-mini-fill tb-xp-fill" style="width:' + Math.round(s.xp / s.xpToNext * 100) + '%"></div></div></div>' +
                '</div>';
        },

        refreshTopBar: function(stats) {
            if (!this.topBar) return;
            if (stats.name !== undefined) {
                this.playerStats.name = stats.name;
                var nameEl = this.topBar.querySelector('#tb-pname');
                if (nameEl) nameEl.textContent = stats.name;
            }
            if (stats.hp !== undefined) {
                this.playerStats.hp = stats.hp;
                if (stats.maxHp !== undefined) this.playerStats.maxHp = stats.maxHp;
            }
            if (stats.energy !== undefined) {
                this.playerStats.energy = stats.energy;
                var enEl = this.topBar.querySelector('.tb-en-num');
                if (enEl) enEl.textContent = stats.energy;
                var enFill = this.topBar.querySelector('.tb-en-fill');
                if (enFill) enFill.style.width = Math.round(stats.energy / this.playerStats.maxEnergy * 100) + '%';
                if (stats.maxEnergy !== undefined) this.playerStats.maxEnergy = stats.maxEnergy;
            }
            if (stats.money !== undefined) {
                this.playerStats.money = stats.money;
                var monEl = this.topBar.querySelector('.tb-mon-num');
                if (monEl) monEl.textContent = this._fmtMoney(stats.money);
            }
            if (stats.level !== undefined) {
                this.playerStats.level = stats.level;
                var lvEl = this.topBar.querySelector('.tb-lv-badge');
                if (lvEl) lvEl.textContent = stats.level;
                var xpLabel = this.topBar.querySelector('.tb-xp-label');
                if (xpLabel) xpLabel.textContent = 'LV ' + stats.level;
            }
            var xpFill = this.topBar.querySelector('.tb-xp-fill');
            if (xpFill) xpFill.style.width = Math.round(this.playerStats.xp / this.playerStats.xpToNext * 100) + '%';
        },

        _fmtMoney: function(n) {
            if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
            return String(n);
        },

        highlightNav: function(tabId) {
            var items = this.navBar.querySelectorAll('.nav-item');
            items.forEach(function(i) {
                i.classList.remove('active');
                if (i.getAttribute('data-tab') === tabId) i.classList.add('active');
            });
        },

        navigate: function(tabId) {
            this.renderTab(tabId);
            this.highlightNav(tabId);
        },

        showScreen: function(name) {
            if (name === 'login') {
                this.loginView.show();
                if (this.gameView) this.gameView.style.display = 'none';
            }
        },

        startMusic: function() {
            if (this.bgMusic) return;
            this.bgMusic = new Audio();
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.4;
            this.bgMusic.src = 'audio/normal.mp3';
            this.bgMusic.play().catch(function() {});
        },

        switchMusic: function(track) {
            if (!this.bgMusic) return;
            var src = 'audio/' + track + '.mp3';
            if (this.bgMusic.src.indexOf(src) === -1) {
                this.bgMusic.src = src;
                this.bgMusic.currentTime = 0;
                this.bgMusic.play().catch(function() {});
            }
        }
    };

    window.GameApp = App;

    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        App.init();
    }
})();
