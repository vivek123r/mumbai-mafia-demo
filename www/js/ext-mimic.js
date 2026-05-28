/**
 * Lightweight Ext JS mimic - component system for Cordova apps.
 * Supports: Ext.create, xtype, Ext.application, layouts, form panels,
 * card navigation, and the Ext JS component lifecycle pattern.
 */
(function() {
    'use strict';

    var componentRegistry = {};
    var nextId = 0;

    window.Ext = {
        registry: componentRegistry,

        define: function(name, config) {
            componentRegistry[name] = config;
            if (config.xtype) componentRegistry[config.xtype] = config;
            config._name = name;
        },

        create: function(config) {
            var xtype = config.xtype;
            if (typeof xtype === 'string' && componentRegistry[xtype]) {
                var proto = componentRegistry[xtype];
                var inst = Object.create(proto);
                Object.assign(inst, proto, config);
                if (inst.initialize) inst.initialize();
                return inst;
            }
            return config;
        },

        getCmp: function(id) {
            return document.getElementById(id);
        },

        htmlEncode: function(str) {
            var div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        },

        Msg: {
            alert: function(title, message, cb) {
                var overlay = document.createElement('div');
                overlay.className = 'ext-msg-overlay';
                overlay.innerHTML =
                    '<div class="ext-msg-box">' +
                    '<div class="ext-msg-title">' + title + '</div>' +
                    '<div class="ext-msg-body">' + message + '</div>' +
                    '<button class="ext-msg-btn">OK</button>' +
                    '</div>';
                document.body.appendChild(overlay);
                overlay.querySelector('.ext-msg-btn').onclick = function() {
                    document.body.removeChild(overlay);
                    if (cb) cb();
                };
                overlay.onclick = function(e) {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                        if (cb) cb();
                    }
                };
            },

            prompt: function(title, message, cb) {
                var overlay = document.createElement('div');
                overlay.className = 'ext-msg-overlay';
                overlay.innerHTML =
                    '<div class="ext-msg-box">' +
                    '<div class="ext-msg-title">' + title + '</div>' +
                    '<div class="ext-msg-body">' + message + '</div>' +
                    '<input class="ext-msg-input" placeholder="Username">' +
                    '<div class="ext-msg-buttons">' +
                    '<button class="ext-msg-btn ext-msg-cancel">Cancel</button>' +
                    '<button class="ext-msg-btn ext-msg-ok">OK</button>' +
                    '</div></div>';
                document.body.appendChild(overlay);
                var input = overlay.querySelector('.ext-msg-input');
                overlay.querySelector('.ext-msg-ok').onclick = function() {
                    document.body.removeChild(overlay);
                    cb('ok', input.value);
                };
                overlay.querySelector('.ext-msg-cancel').onclick = function() {
                    document.body.removeChild(overlay);
                    cb('cancel');
                };
                overlay.onclick = function(e) {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                        cb('cancel');
                    }
                };
                input.focus();
            }
        },

        application: function(config) {
            var app = {
                views: {},
                controllers: [],
                currentView: null,
                launch: config.launch || function() {},
                navigateTo: function(viewName, data) {
                    var view = app.views[viewName];
                    if (view && view.show) {
                        view.show(data);
                        app.currentView = viewName;
                    }
                }
            };

            document.addEventListener('DOMContentLoaded', function() {
                app.launch.call(app);
            });
            return app;
        }
    };

    // ───────── PANEL ─────────
    Ext.define('Ext.panel', {
        xtype: 'panel',
        layout: 'vbox',
        cls: '',
        items: [],
        hidden: false,
        style: '',

        initialize: function() {
            this.el = document.createElement('div');
            this.el.className = 'ext-panel ' + (this.cls || '');
            this.el.style.cssText = this.style || '';
            if (this.layout === 'vbox') {
                this.el.style.display = 'flex';
                this.el.style.flexDirection = 'column';
            }
            if (this.layout === 'hbox') {
                this.el.style.display = 'flex';
                this.el.style.flexDirection = 'row';
            }
            if (this.hidden) this.el.style.display = 'none';
            this.renderItems();
        },

        renderItems: function() {
            var self = this;
            if (this.items) {
                this.items.forEach(function(item) {
                    var child;
                    if (typeof item === 'string') {
                        child = document.createElement('div');
                        child.innerHTML = item;
                    } else if (item.el) {
                        child = item.el;
                    } else if (item.xtype) {
                        child = Ext.create(item);
                        if (child.el) child = child.el;
                    } else {
                        child = document.createElement('div');
                    }
                    if (child && self.el) self.el.appendChild(child);
                });
            }
        },

        setHtml: function(html) {
            this.el.innerHTML = html;
        },

        show: function() {
            this.el.style.display = 'flex';
            this.hidden = false;
        },

        hide: function() {
            this.el.style.display = 'none';
            this.hidden = true;
        },

        add: function(panel) {
            if (panel.el) this.el.appendChild(panel.el);
        },

        down: function(selector) {
            if (selector && this.el) {
                return { el: this.el.querySelector(selector) };
            }
            return null;
        }
    });

    // ───────── CONTAINER ─────────
    Ext.define('Ext.container', {
        xtype: 'container',
        layout: 'vbox',
        cls: '',
        padding: '0',
        margin: '0',
        style: '',
        flex: 1,

        initialize: function() {
            this.el = document.createElement('div');
            this.el.className = 'ext-container ' + (this.cls || '');
            var s = this.style || '';
            if (this.padding) s += 'padding:' + this.padding + ';';
            if (this.margin) s += 'margin:' + this.margin + ';';
            if (this.flex) s += 'flex:' + this.flex + ';';
            this.el.style.cssText = s;

            if (this.layout === 'vbox') {
                this.el.style.display = 'flex';
                this.el.style.flexDirection = 'column';
            }
            if (this.layout === 'hbox') {
                this.el.style.display = 'flex';
                this.el.style.flexDirection = 'row';
            }

            if (this.html) {
                this.el.innerHTML = this.html;
            }

            if (this.items) {
                var self = this;
                this.items.forEach(function(item) {
                    if (typeof item === 'string') {
                        var div = document.createElement('div');
                        div.innerHTML = item;
                        self.el.appendChild(div);
                    } else if (item.el) {
                        self.el.appendChild(item.el);
                    } else if (item.xtype) {
                        var c = Ext.create(item);
                        if (c && c.el) self.el.appendChild(c.el);
                    }
                });
            }
        },

        setHtml: function(html) {
            this.el.innerHTML = html;
        }
    });

    // ───────── TOOLBAR ─────────
    Ext.define('Ext.toolbar', {
        xtype: 'toolbar',
        docked: 'top',
        cls: '',
        items: [],

        initialize: function() {
            this.el = document.createElement('div');
            this.el.className = 'ext-toolbar ' + (this.cls || '');
            this.el.style.cssText = this.style || '';

            var self = this;
            this.items.forEach(function(item) {
                var child = document.createElement('div');
                if (item.xtype === 'component' && item.html) {
                    child.innerHTML = item.html;
                } else if (item.xtype === 'spacer') {
                    child.className = 'ext-spacer';
                } else if (item.xtype === 'button') {
                    child.innerHTML = '<span>' + (item.text || '') + '</span>';
                    if (item.iconCls) {
                        child.innerHTML = '<span class="' + item.iconCls + '"></span>' + child.innerHTML;
                    }
                    child.className = 'ext-btn';
                    if (item.style) child.style.cssText = item.style;
                    if (item.handler) child.onclick = item.handler;
                }
                self.el.appendChild(child);
            });
        }
    });

    // ───────── FORMPANEL ─────────
    Ext.define('Ext.formpanel', {
        xtype: 'formpanel',
        cls: '',
        items: [],
        style: '',
        width: '',

        initialize: function() {
            this.el = document.createElement('form');
            this.el.className = 'ext-formpanel ' + (this.cls || '');
            this.el.style.cssText = this.style || '';
            this.el.onsubmit = function(e) { e.preventDefault(); };

            var self = this;
            this.items.forEach(function(item) {
                var child;
                if (item.xtype === 'textfield' || item.xtype === 'passwordfield') {
                    child = document.createElement('input');
                    child.type = item.xtype === 'passwordfield' ? 'password' : 'text';
                    child.placeholder = item.placeHolder || '';
                    child.name = item.name || '';
                    child.className = 'ext-field ' + (item.cls || '');
                    if (item.style) child.style.cssText = item.style;
                    if (item.margin) child.style.margin = item.margin;
                } else if (item.xtype === 'button') {
                    child = document.createElement('button');
                    child.textContent = item.text || '';
                    child.type = 'button';
                    child.className = 'ext-btn ' + (item.cls || '');
                    if (item.style) child.style.cssText = item.style;
                    if (item.handler) child.onclick = function() { item.handler(); };
                } else {
                    child = document.createElement('div');
                }
                self.el.appendChild(child);
            });
        },

        getValues: function() {
            var inputs = this.el.querySelectorAll('input');
            var values = {};
            inputs.forEach(function(input) {
                values[input.name] = input.value;
            });
            return values;
        }
    });

    // ───────── CARD LAYOUT / VIEWPORT ─────────
    Ext.define('Ext.viewport', {
        xtype: 'viewport',
        items: [],
        activeItem: 0,

        initialize: function() {
            this.el = document.getElementById('app') || document.body;
            this.el.className = 'ext-viewport';

            var self = this;
            this.items.forEach(function(item, i) {
                var panel = Ext.create(item);
                if (panel && panel.el) {
                    panel.el.style.display = 'none';
                    panel.el.style.position = 'absolute';
                    panel.el.style.top = '0';
                    panel.el.style.left = '0';
                    panel.el.style.width = '100%';
                    panel.el.style.height = '100%';
                    self.el.appendChild(panel.el);
                    self.items[i] = panel;
                }
            });

            if (this.items[this.activeItem] && this.items[this.activeItem].show) {
                this.items[this.activeItem].show();
            }
        },

        setActiveItem: function(index) {
            var self = this;
            this.items.forEach(function(item, i) {
                if (item && item.hide) item.hide();
            });
            if (this.items[index] && this.items[index].show) {
                this.items[index].show();
                this.activeItem = index;
            }
        },

        add: function(panels) {
            var self = this;
            panels.forEach(function(item) {
                var panel = Ext.create(item);
                if (panel && panel.el) {
                    panel.el.style.display = 'none';
                    panel.el.style.position = 'absolute';
                    panel.el.style.top = '0';
                    panel.el.style.left = '0';
                    panel.el.style.width = '100%';
                    panel.el.style.height = '100%';
                    self.el.appendChild(panel.el);
                    self.items.push(panel);
                }
            });
        },

        down: function(selector) {
            return this.items.find(function(item) {
                return item._name && item._name === selector;
            }) || null;
        }
    });

    console.log('[Ext Mimic] Component framework loaded');
})();
