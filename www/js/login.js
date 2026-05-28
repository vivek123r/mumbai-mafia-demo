/**
 * Mumbai Mafia - Login Screen
 * Dark cinematic theme inspired by the original game
 */
Ext.define('LoginView', {
    xtype: 'loginview',
    layout: 'vbox',
    cls: 'login-screen',

    initialize: function() {
        this.el = document.createElement('div');
        this.el.className = 'ext-panel login-screen';
        this.el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;top:0;left:0;width:100%;height:100%;';

        this.el.innerHTML =
            '<div class="login-bg"></div>' +
            '<div class="login-logo">' +
            '<svg class="login-emblem" viewBox="0 0 80 80" width="80" height="80">' +
            '<circle cx="40" cy="40" r="38" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.6"/>' +
            '<circle cx="40" cy="40" r="30" fill="none" stroke="#d4af37" stroke-width="1" opacity="0.3"/>' +
            '<text x="40" y="48" text-anchor="middle" fill="#d4af37" font-size="36">☠️</text>' +
            '</svg>' +
            '<div class="login-title">Mumbai Mafia</div>' +
            '<div class="login-subtitle">BUILD YOUR EMPIRE</div>' +
            '</div>' +

            '<form class="login-form" onsubmit="return false;">' +
            '<div class="mafia-input-wrap">' +
            '<svg class="input-icon" viewBox="0 0 24 24" width="18" height="18"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" fill="#555"/></svg>' +
            '<input type="text" name="username" class="mafia-input" placeholder="Username" required>' +
            '</div>' +
            '<div class="mafia-input-wrap">' +
            '<svg class="input-icon" viewBox="0 0 24 24" width="18" height="18"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" fill="#555"/></svg>' +
            '<input type="password" name="password" class="mafia-input" placeholder="Password" required>' +
            '</div>' +
            '<button type="submit" class="mafia-btn mafia-btn-primary">' +
            '<span>SIGN IN</span>' +
            '<svg class="btn-arrow" viewBox="0 0 24 24" width="18" height="18"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="#fff"/></svg>' +
            '</button>' +
            '</form>' +

            '<div class="login-footer">v1.0 &bull; Dharavi Streets</div>';

        var self = this;

        this.el.querySelector('.mafia-btn-primary').onclick = function(e) {
            e.preventDefault();
            var username = self.el.querySelector('input[name="username"]').value.trim();
            var password = self.el.querySelector('input[name="password"]').value.trim();
            if (username && password) {
                var btn = self.el.querySelector('.mafia-btn-primary');
                btn.classList.add('loading');
                setTimeout(function() {
                    btn.classList.remove('loading');
                    if (self.onSignIn) self.onSignIn(username);
                }, 600);
            } else {
                Ext.Msg.alert('Mumbai Mafia', 'Enter your credentials, boss.');
            }
        };

        this.hidden = false;
    },

    show: function() {
        this.el.style.display = 'flex';
        this.hidden = false;
    },

    hide: function() {
        this.el.style.display = 'none';
        this.hidden = true;
    }
});
