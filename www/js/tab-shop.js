/**
 * Mumbai Mafia — Black Market Shop
 * Daily free, flash deals with countdowns, discount badges, premium offers.
 */
var GameTabs = window.GameTabs || {};

GameTabs.shop = function() {
    var balance = 25000;

    var dailyFree = [
        { name: 'Daily Bandages', icon: '🩹', desc: 'Restore 30 HP', original: '₹300', discount: '100%', color: '#2ecc71' },
        { name: 'Energy Drink', icon: '⚡', desc: '+20 Energy', original: '₹400', discount: '100%', color: '#3498db' }
    ];

    var flashDeals = [
        { name: 'Knuckle Duster', icon: '👊', desc: '+25 Attack', price: '₹780', original: '₹1,200', discount: '-35%', timer: 3600, type: 'weapon', color: '#e74c3c' },
        { name: 'Bulletproof Vest', icon: '🦺', desc: '+30 Defense', price: '₹1,750', original: '₹2,500', discount: '-30%', timer: 5400, type: 'armor', color: '#3498db' },
        { name: 'Molotov Bundle', icon: '🍾', desc: 'x3 Molotovs', price: '₹900', original: '₹1,500', discount: '-40%', timer: 7200, type: 'consumable', color: '#e67e22' }
    ];

    var regular = [
        { name: 'Switchblade', icon: '🔪', desc: '+25 Attack, +5 Speed', price: '₹1,500', type: 'weapon', rarity: 'uncommon' },
        { name: 'Gold Chain', icon: '📿', desc: '+20% Money from fights', price: '₹3,200', type: 'accessory', rarity: 'rare' },
        { name: 'Motorcycle', icon: '🏍️', desc: 'Fast travel unlocked', price: '₹8,000', type: 'vehicle', rarity: 'rare' },
        { name: 'Thugs x3', icon: '👥', desc: 'Recruit 3 crew members', price: '₹3,000', type: 'crew', rarity: 'uncommon' },
        { name: 'Lucky Charm', icon: '🍀', desc: '+10% Critical chance', price: '₹1,500', type: 'accessory', rarity: 'rare' },
        { name: 'Brass Knuckles', icon: '👊', desc: '+20 Attack', price: '₹400', type: 'weapon', rarity: 'common' }
    ];

    var premium = [
        { name: 'Royal Protection', icon: '🛡️', desc: '+50 Defense, 7 Days', price: '₹12,000', tag: 'BEST VALUE', tagColor: '#d4af37' },
        { name: 'Legendary Enforcer', icon: '🦍', desc: 'Lv 10 Elite crew member', price: '₹25,000', tag: 'LIMITED', tagColor: '#a855f7' }
    ];

    function fmtTime(sec) {
        var h = Math.floor(sec / 3600);
        var m = Math.floor((sec % 3600) / 60);
        var s = sec % 60;
        return (h > 0 ? h + 'h ' : '') + (m < 10 ? '0' + m : m) + 'm ' + (s < 10 ? '0' + s : s) + 's';
    }

    function fmtPrice(n) {
        if (n >= 1000) return '₹' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
        return '₹' + n;
    }

    var html = '<div class="tab-view shop-tab">';

    // ── Currency header ──
    html += '<div class="shop-currency-bar">' +
        '<span class="shop-balance-label">YOUR CASH</span>' +
        '<span class="shop-balance-value" id="shop-balance">' + fmtPrice(balance) + '</span>' +
        '<div class="shop-currency-gems"><span>💎 240</span></div>' +
        '</div>';

    // ── Daily Free ──
    html += '<div class="shop-section"><div class="shop-section-header">' +
        '<span class="shop-section-icon">🎁</span><span class="shop-section-title">DAILY FREE</span>' +
        '<span class="shop-section-sub" id="daily-timer">Resets in —</span></div>' +
        '<div class="shop-daily-grid">';

    dailyFree.forEach(function(item) {
        html += '<div class="shop-daily-card" style="border-color:' + item.color + '">' +
            '<span class="shop-daily-icon">' + item.icon + '</span>' +
            '<div class="shop-daily-info">' +
            '<span class="shop-daily-name">' + item.name + '</span>' +
            '<span class="shop-daily-desc">' + item.desc + '</span>' +
            '<span class="shop-daily-old">' + item.original + '</span>' +
            '</div>' +
            '<button class="shop-free-btn" data-claimed="0">FREE</button>' +
            '</div>';
    });

    html += '</div></div>';

    // ── Flash Deals ──
    html += '<div class="shop-section"><div class="shop-section-header">' +
        '<span class="shop-section-icon">⚡</span><span class="shop-section-title">FLASH DEALS</span>' +
        '<span class="shop-section-sub flash-label">LIMITED TIME</span></div>' +
        '<div class="shop-flash-grid">';

    flashDeals.forEach(function(item, i) {
        html += '<div class="shop-flash-card">' +
            '<div class="flash-badge" style="background:' + item.color + '">' + item.discount + '</div>' +
            '<div class="flash-img">' + item.icon + '</div>' +
            '<div class="flash-info">' +
            '<span class="flash-name">' + item.name + '</span>' +
            '<span class="flash-desc">' + item.desc + '</span>' +
            '<div class="flash-prices">' +
            '<span class="flash-old">' + item.original + '</span>' +
            '<span class="flash-new">' + item.price + '</span>' +
            '</div>' +
            '<span class="flash-timer" data-timer="' + item.timer + '" id="flash-timer-' + i + '">' + fmtTime(item.timer) + '</span>' +
            '</div>' +
            '<button class="shop-buy-btn flash-buy" data-price="' + item.price + '">BUY</button>' +
            '</div>';
    });

    html += '</div></div>';

    // ── Regular Shop ──
    html += '<div class="shop-section"><div class="shop-section-header">' +
        '<span class="shop-section-icon">🏪</span><span class="shop-section-title">STOCK</span></div>' +
        '<div class="shop-stock-grid">';

    regular.forEach(function(item) {
        html += '<div class="shop-stock-card">' +
            '<span class="stock-icon">' + item.icon + '</span>' +
            '<div class="stock-info">' +
            '<span class="stock-name">' + item.name + '</span>' +
            '<span class="stock-desc">' + item.desc + '</span>' +
            '</div>' +
            '<button class="shop-buy-btn stock-buy" data-price="' + item.price + '">' + item.price + '</button>' +
            '</div>';
    });

    html += '</div></div>';

    // ── Premium ──
    html += '<div class="shop-section shop-premium-section"><div class="shop-section-header premium-header">' +
        '<span class="shop-section-icon">👑</span><span class="shop-section-title">PREMIUM</span></div>' +
        '<div class="shop-premium-grid">';

    premium.forEach(function(item) {
        html += '<div class="shop-premium-card">' +
            '<div class="premium-glow"></div>' +
            '<span class="premium-icon">' + item.icon + '</span>' +
            '<div class="premium-info">' +
            '<span class="premium-name">' + item.name + '</span>' +
            '<span class="premium-desc">' + item.desc + '</span>' +
            '</div>' +
            '<span class="premium-tag" style="color:' + item.tagColor + '">' + item.tag + '</span>' +
            '<button class="shop-buy-btn premium-buy" data-price="' + item.price + '">' + item.price + '</button>' +
            '</div>';
    });

    html += '</div></div>';

    html += '</div>';

    return {
        html: html,
        setup: function(el, nav) {
            // Daily free timer
            var now = new Date();
            var midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            var dailySec = Math.floor((midnight - now) / 1000);

            var dailyTimerEl = el.querySelector('#daily-timer');
            function tickDaily() {
                dailySec--;
                if (dailySec <= 0) dailySec = 86400;
                dailyTimerEl.textContent = 'Resets in ' + fmtTime(dailySec);
            }
            tickDaily();
            var dailyInterval = setInterval(tickDaily, 1000);

            // Free claim buttons
            el.querySelectorAll('.shop-free-btn').forEach(function(btn) {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    if (btn.dataset.claimed === '1') {
                        Ext.Msg.alert('Already Claimed', 'Come back tomorrow for more free items, boss.');
                        return;
                    }
                    btn.textContent = 'CLAIMED ✓';
                    btn.classList.add('claimed');
                    btn.dataset.claimed = '1';
                    Ext.Msg.alert('Claimed!', 'Item added to your inventory.\nCome back tomorrow for more!');
                };
            });

            // Flash deal countdowns
            var flashTimerEls = el.querySelectorAll('.flash-timer');
            var flashIntervals = [];
            flashTimerEls.forEach(function(timerEl) {
                var sec = parseInt(timerEl.dataset.timer) || 3600;
                function tick() {
                    sec--;
                    if (sec <= 0) {
                        sec = 0;
                        timerEl.textContent = 'EXPIRED';
                        timerEl.style.color = '#e74c3c';
                        return;
                    }
                    timerEl.textContent = fmtTime(sec);
                }
                tick();
                flashIntervals.push(setInterval(tick, 1000));
            });

            // Buy buttons
            el.querySelectorAll('.shop-buy-btn').forEach(function(btn) {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    var price = this.dataset.price;
                    var card = this.closest('.shop-flash-card, .shop-stock-card, .shop-premium-card');
                    var nameEl = card ? card.querySelector('.flash-name, .stock-name, .premium-name') : null;
                    var itemName = nameEl ? nameEl.textContent : 'Item';
                    Ext.Msg.alert('Purchase', 'Buy ' + itemName + ' for ' + price + '?\n\nYour balance: ' + fmtPrice(balance));
                };
            });

            // Cleanup intervals when tab is re-rendered (handled by DOM removal)
            el._cleanup = function() {
                clearInterval(dailyInterval);
                flashIntervals.forEach(function(i) { clearInterval(i); });
            };
        }
    };
};
