! function(t, e) {
    "use strict";
    if ("IntersectionObserver" in t && "IntersectionObserverEntry" in t && "intersectionRatio" in t.IntersectionObserverEntry.prototype) "isIntersecting" in t.IntersectionObserverEntry.prototype || Object.defineProperty(t.IntersectionObserverEntry.prototype, "isIntersecting", {
        get: function() {
            return this.intersectionRatio > 0
        }
    });
    else {
        var n = [];
        o.prototype.THROTTLE_TIMEOUT = 100, o.prototype.POLL_INTERVAL = null, o.prototype.USE_MUTATION_OBSERVER = !0, o.prototype.observe = function(t) {
            if (!this._observationTargets.some(function(e) {
                    return e.element == t
                })) {
                if (!t || 1 != t.nodeType) throw new Error("target must be an Element");
                this._registerInstance(), this._observationTargets.push({
                    element: t,
                    entry: null
                }), this._monitorIntersections(), this._checkForIntersections()
            }
        }, o.prototype.unobserve = function(t) {
            this._observationTargets = this._observationTargets.filter(function(e) {
                return e.element != t
            }), this._observationTargets.length || (this._unmonitorIntersections(), this._unregisterInstance())
        }, o.prototype.disconnect = function() {
            this._observationTargets = [], this._unmonitorIntersections(), this._unregisterInstance()
        }, o.prototype.takeRecords = function() {
            var t = this._queuedEntries.slice();
            return this._queuedEntries = [], t
        }, o.prototype._initThresholds = function(t) {
            var e = t || [0];
            return Array.isArray(e) || (e = [e]), e.sort().filter(function(t, e, n) {
                if ("number" != typeof t || isNaN(t) || t < 0 || t > 1) throw new Error("threshold must be a number between 0 and 1 inclusively");
                return t !== n[e - 1]
            })
        }, o.prototype._parseRootMargin = function(t) {
            var e = (t || "0px").split(/\s+/).map(function(t) {
                var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                if (!e) throw new Error("rootMargin must be specified in pixels or percent");
                return {
                    value: parseFloat(e[1]),
                    unit: e[2]
                }
            });
            return e[1] = e[1] || e[0], e[2] = e[2] || e[0], e[3] = e[3] || e[1], e
        }, o.prototype._monitorIntersections = function() {
            this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL) : (s(t, "resize", this._checkForIntersections, !0), s(e, "scroll", this._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in t && (this._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(e, {
                attributes: !0,
                childList: !0,
                characterData: !0,
                subtree: !0
            }))))
        }, o.prototype._unmonitorIntersections = function() {
            this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this._monitoringInterval), this._monitoringInterval = null, r(t, "resize", this._checkForIntersections, !0), r(e, "scroll", this._checkForIntersections, !0), this._domObserver && (this._domObserver.disconnect(), this._domObserver = null))
        }, o.prototype._checkForIntersections = function() {
            var e = this._rootIsInDom(),
                n = e ? this._getRootRect() : {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: 0,
                    height: 0
                };
            this._observationTargets.forEach(function(o) {
                var s = o.element,
                    r = a(s),
                    l = this._rootContainsTarget(s),
                    c = o.entry,
                    d = e && l && this._computeTargetAndRootIntersection(s, n),
                    u = o.entry = new i({
                        time: t.performance && performance.now && performance.now(),
                        target: s,
                        boundingClientRect: r,
                        rootBounds: n,
                        intersectionRect: d
                    });
                c ? e && l ? this._hasCrossedThreshold(c, u) && this._queuedEntries.push(u) : c && c.isIntersecting && this._queuedEntries.push(u) : this._queuedEntries.push(u)
            }, this), this._queuedEntries.length && this._callback(this.takeRecords(), this)
        }, o.prototype._computeTargetAndRootIntersection = function(n, i) {
            if ("none" != t.getComputedStyle(n).display) {
                for (var o, s, r, l, d, u, p, m, h = a(n), v = c(n), f = !1; !f;) {
                    var g = null,
                        b = 1 == v.nodeType ? t.getComputedStyle(v) : {};
                    if ("none" == b.display) return;
                    if (v == this.root || v == e ? (f = !0, g = i) : v != e.body && v != e.documentElement && "visible" != b.overflow && (g = a(v)), g && (o = g, s = h, void 0, void 0, void 0, void 0, void 0, void 0, r = Math.max(o.top, s.top), l = Math.min(o.bottom, s.bottom), d = Math.max(o.left, s.left), u = Math.min(o.right, s.right), m = l - r, !(h = (p = u - d) >= 0 && m >= 0 && {
                            top: r,
                            bottom: l,
                            left: d,
                            right: u,
                            width: p,
                            height: m
                        }))) break;
                    v = c(v)
                }
                return h
            }
        }, o.prototype._getRootRect = function() {
            var t;
            if (this.root) t = a(this.root);
            else {
                var n = e.documentElement,
                    i = e.body;
                t = {
                    top: 0,
                    left: 0,
                    right: n.clientWidth || i.clientWidth,
                    width: n.clientWidth || i.clientWidth,
                    bottom: n.clientHeight || i.clientHeight,
                    height: n.clientHeight || i.clientHeight
                }
            }
            return this._expandRectByRootMargin(t)
        }, o.prototype._expandRectByRootMargin = function(t) {
            var e = this._rootMarginValues.map(function(e, n) {
                    return "px" == e.unit ? e.value : e.value * (n % 2 ? t.width : t.height) / 100
                }),
                n = {
                    top: t.top - e[0],
                    right: t.right + e[1],
                    bottom: t.bottom + e[2],
                    left: t.left - e[3]
                };
            return n.width = n.right - n.left, n.height = n.bottom - n.top, n
        }, o.prototype._hasCrossedThreshold = function(t, e) {
            var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
                i = e.isIntersecting ? e.intersectionRatio || 0 : -1;
            if (n !== i)
                for (var o = 0; o < this.thresholds.length; o++) {
                    var s = this.thresholds[o];
                    if (s == n || s == i || s < n != s < i) return !0
                }
        }, o.prototype._rootIsInDom = function() {
            return !this.root || l(e, this.root)
        }, o.prototype._rootContainsTarget = function(t) {
            return l(this.root || e, t)
        }, o.prototype._registerInstance = function() {
            n.indexOf(this) < 0 && n.push(this)
        }, o.prototype._unregisterInstance = function() {
            var t = n.indexOf(this); - 1 != t && n.splice(t, 1)
        }, t.IntersectionObserver = o, t.IntersectionObserverEntry = i
    }

    function i(t) {
        this.time = t.time, this.target = t.target, this.rootBounds = t.rootBounds, this.boundingClientRect = t.boundingClientRect, this.intersectionRect = t.intersectionRect || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }, this.isIntersecting = !!t.intersectionRect;
        var e = this.boundingClientRect,
            n = e.width * e.height,
            i = this.intersectionRect,
            o = i.width * i.height;
        this.intersectionRatio = n ? Number((o / n).toFixed(4)) : this.isIntersecting ? 1 : 0
    }

    function o(t, e) {
        var n, i, o, s = e || {};
        if ("function" != typeof t) throw new Error("callback must be a function");
        if (s.root && 1 != s.root.nodeType) throw new Error("root must be an Element");
        this._checkForIntersections = (n = this._checkForIntersections.bind(this), i = this.THROTTLE_TIMEOUT, o = null, function() {
            o || (o = setTimeout(function() {
                n(), o = null
            }, i))
        }), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(s.rootMargin), this.thresholds = this._initThresholds(s.threshold), this.root = s.root || null, this.rootMargin = this._rootMarginValues.map(function(t) {
            return t.value + t.unit
        }).join(" ")
    }

    function s(t, e, n, i) {
        "function" == typeof t.addEventListener ? t.addEventListener(e, n, i || !1) : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n)
    }

    function r(t, e, n, i) {
        "function" == typeof t.removeEventListener ? t.removeEventListener(e, n, i || !1) : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, n)
    }

    function a(t) {
        var e;
        try {
            e = t.getBoundingClientRect()
        } catch (t) {}
        return e ? (e.width && e.height || (e = {
            top: e.top,
            right: e.right,
            bottom: e.bottom,
            left: e.left,
            width: e.right - e.left,
            height: e.bottom - e.top
        }), e) : {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }
    }

    function l(t, e) {
        for (var n = e; n;) {
            if (n == t) return !0;
            n = c(n)
        }
        return !1
    }

    function c(t) {
        var e = t.parentNode;
        return e && 11 == e.nodeType && e.host ? e.host : e && e.assignedSlot ? e.assignedSlot.parentNode : e
    }
}(window, document),
function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.axios = e() : t.axios = e()
}(this, function() {
    return function(t) {
        function e(i) {
            if (n[i]) return n[i].exports;
            var o = n[i] = {
                exports: {},
                id: i,
                loaded: !1
            };
            return t[i].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
        }
        var n = {};
        return e.m = t, e.c = n, e.p = "", e(0)
    }([function(t, e, n) {
        t.exports = n(1)
    }, function(t, e, n) {
        "use strict";

        function i(t) {
            var e = new r(t),
                n = s(r.prototype.request, e);
            return o.extend(n, r.prototype, e), o.extend(n, e), n
        }
        var o = n(2),
            s = n(3),
            r = n(5),
            a = n(6),
            l = i(a);
        l.Axios = r, l.create = function(t) {
            return i(o.merge(a, t))
        }, l.Cancel = n(23), l.CancelToken = n(24), l.isCancel = n(20), l.all = function(t) {
            return Promise.all(t)
        }, l.spread = n(25), t.exports = l, t.exports.default = l
    }, function(t, e, n) {
        "use strict";

        function i(t) {
            return "[object Array]" === c.call(t)
        }

        function o(t) {
            return null !== t && "object" == typeof t
        }

        function s(t) {
            return "[object Function]" === c.call(t)
        }

        function r(t, e) {
            if (null !== t && void 0 !== t)
                if ("object" != typeof t && (t = [t]), i(t))
                    for (var n = 0, o = t.length; n < o; n++) e.call(null, t[n], n, t);
                else
                    for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && e.call(null, t[s], s, t)
        }
        var a = n(3),
            l = n(4),
            c = Object.prototype.toString;
        t.exports = {
            isArray: i,
            isArrayBuffer: function(t) {
                return "[object ArrayBuffer]" === c.call(t)
            },
            isBuffer: l,
            isFormData: function(t) {
                return "undefined" != typeof FormData && t instanceof FormData
            },
            isArrayBufferView: function(t) {
                return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(t) : t && t.buffer && t.buffer instanceof ArrayBuffer
            },
            isString: function(t) {
                return "string" == typeof t
            },
            isNumber: function(t) {
                return "number" == typeof t
            },
            isObject: o,
            isUndefined: function(t) {
                return void 0 === t
            },
            isDate: function(t) {
                return "[object Date]" === c.call(t)
            },
            isFile: function(t) {
                return "[object File]" === c.call(t)
            },
            isBlob: function(t) {
                return "[object Blob]" === c.call(t)
            },
            isFunction: s,
            isStream: function(t) {
                return o(t) && s(t.pipe)
            },
            isURLSearchParams: function(t) {
                return "undefined" != typeof URLSearchParams && t instanceof URLSearchParams
            },
            isStandardBrowserEnv: function() {
                return ("undefined" == typeof navigator || "ReactNative" !== navigator.product) && "undefined" != typeof window && "undefined" != typeof document
            },
            forEach: r,
            merge: function t() {
                function e(e, i) {
                    "object" == typeof n[i] && "object" == typeof e ? n[i] = t(n[i], e) : n[i] = e
                }
                for (var n = {}, i = 0, o = arguments.length; i < o; i++) r(arguments[i], e);
                return n
            },
            extend: function(t, e, n) {
                return r(e, function(e, i) {
                    t[i] = n && "function" == typeof e ? a(e, n) : e
                }), t
            },
            trim: function(t) {
                return t.replace(/^\s*/, "").replace(/\s*$/, "")
            }
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t, e) {
            return function() {
                for (var n = new Array(arguments.length), i = 0; i < n.length; i++) n[i] = arguments[i];
                return t.apply(e, n)
            }
        }
    }, function(t, e) {
        function n(t) {
            return !!t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
        }
        t.exports = function(t) {
            return null != t && (n(t) || function(t) {
                return "function" == typeof t.readFloatLE && "function" == typeof t.slice && n(t.slice(0, 0))
            }(t) || !!t._isBuffer)
        }
    }, function(t, e, n) {
        "use strict";

        function i(t) {
            this.defaults = t, this.interceptors = {
                request: new r,
                response: new r
            }
        }
        var o = n(6),
            s = n(2),
            r = n(17),
            a = n(18);
        i.prototype.request = function(t) {
            "string" == typeof t && (t = s.merge({
                url: arguments[0]
            }, arguments[1])), (t = s.merge(o, {
                method: "get"
            }, this.defaults, t)).method = t.method.toLowerCase();
            var e = [a, void 0],
                n = Promise.resolve(t);
            for (this.interceptors.request.forEach(function(t) {
                    e.unshift(t.fulfilled, t.rejected)
                }), this.interceptors.response.forEach(function(t) {
                    e.push(t.fulfilled, t.rejected)
                }); e.length;) n = n.then(e.shift(), e.shift());
            return n
        }, s.forEach(["delete", "get", "head", "options"], function(t) {
            i.prototype[t] = function(e, n) {
                return this.request(s.merge(n || {}, {
                    method: t,
                    url: e
                }))
            }
        }), s.forEach(["post", "put", "patch"], function(t) {
            i.prototype[t] = function(e, n, i) {
                return this.request(s.merge(i || {}, {
                    method: t,
                    url: e,
                    data: n
                }))
            }
        }), t.exports = i
    }, function(t, e, n) {
        "use strict";

        function i(t, e) {
            !o.isUndefined(t) && o.isUndefined(t["Content-Type"]) && (t["Content-Type"] = e)
        }
        var o = n(2),
            s = n(7),
            r = {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            a = {
                adapter: function() {
                    var t;
                    return "undefined" != typeof XMLHttpRequest ? t = n(8) : "undefined" != typeof process && (t = n(8)), t
                }(),
                transformRequest: [function(t, e) {
                    return s(e, "Content-Type"), o.isFormData(t) || o.isArrayBuffer(t) || o.isBuffer(t) || o.isStream(t) || o.isFile(t) || o.isBlob(t) ? t : o.isArrayBufferView(t) ? t.buffer : o.isURLSearchParams(t) ? (i(e, "application/x-www-form-urlencoded;charset=utf-8"), t.toString()) : o.isObject(t) ? (i(e, "application/json;charset=utf-8"), JSON.stringify(t)) : t
                }],
                transformResponse: [function(t) {
                    if ("string" == typeof t) try {
                        t = JSON.parse(t)
                    } catch (t) {}
                    return t
                }],
                timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                validateStatus: function(t) {
                    return t >= 200 && t < 300
                },
                headers: {
                    common: {
                        Accept: "application/json, text/plain, */*"
                    }
                }
            };
        o.forEach(["delete", "get", "head"], function(t) {
            a.headers[t] = {}
        }), o.forEach(["post", "put", "patch"], function(t) {
            a.headers[t] = o.merge(r)
        }), t.exports = a
    }, function(t, e, n) {
        "use strict";
        var i = n(2);
        t.exports = function(t, e) {
            i.forEach(t, function(n, i) {
                i !== e && i.toUpperCase() === e.toUpperCase() && (t[e] = n, delete t[i])
            })
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(2),
            o = n(9),
            s = n(12),
            r = n(13),
            a = n(14),
            l = n(10),
            c = "undefined" != typeof window && window.btoa && window.btoa.bind(window) || n(15);
        t.exports = function(t) {
            return new Promise(function(e, d) {
                var u = t.data,
                    p = t.headers;
                i.isFormData(u) && delete p["Content-Type"];
                var m = new XMLHttpRequest,
                    h = "onreadystatechange",
                    v = !1;
                if ("undefined" == typeof window || !window.XDomainRequest || "withCredentials" in m || a(t.url) || (m = new window.XDomainRequest, h = "onload", v = !0, m.onprogress = function() {}, m.ontimeout = function() {}), t.auth) {
                    var f = t.auth.username || "",
                        g = t.auth.password || "";
                    p.Authorization = "Basic " + c(f + ":" + g)
                }
                if (m.open(t.method.toUpperCase(), s(t.url, t.params, t.paramsSerializer), !0), m.timeout = t.timeout, m[h] = function() {
                        if (m && (4 === m.readyState || v) && (0 !== m.status || m.responseURL && 0 === m.responseURL.indexOf("file:"))) {
                            var n = "getAllResponseHeaders" in m ? r(m.getAllResponseHeaders()) : null,
                                i = {
                                    data: t.responseType && "text" !== t.responseType ? m.response : m.responseText,
                                    status: 1223 === m.status ? 204 : m.status,
                                    statusText: 1223 === m.status ? "No Content" : m.statusText,
                                    headers: n,
                                    config: t,
                                    request: m
                                };
                            o(e, d, i), m = null
                        }
                    }, m.onerror = function() {
                        d(l("Network Error", t, null, m)), m = null
                    }, m.ontimeout = function() {
                        d(l("timeout of " + t.timeout + "ms exceeded", t, "ECONNABORTED", m)), m = null
                    }, i.isStandardBrowserEnv()) {
                    var b = n(16),
                        y = (t.withCredentials || a(t.url)) && t.xsrfCookieName ? b.read(t.xsrfCookieName) : void 0;
                    y && (p[t.xsrfHeaderName] = y)
                }
                if ("setRequestHeader" in m && i.forEach(p, function(t, e) {
                        void 0 === u && "content-type" === e.toLowerCase() ? delete p[e] : m.setRequestHeader(e, t)
                    }), t.withCredentials && (m.withCredentials = !0), t.responseType) try {
                    m.responseType = t.responseType
                } catch (e) {
                    if ("json" !== t.responseType) throw e
                }
                "function" == typeof t.onDownloadProgress && m.addEventListener("progress", t.onDownloadProgress), "function" == typeof t.onUploadProgress && m.upload && m.upload.addEventListener("progress", t.onUploadProgress), t.cancelToken && t.cancelToken.promise.then(function(t) {
                    m && (m.abort(), d(t), m = null)
                }), void 0 === u && (u = null), m.send(u)
            })
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(10);
        t.exports = function(t, e, n) {
            var o = n.config.validateStatus;
            n.status && o && !o(n.status) ? e(i("Request failed with status code " + n.status, n.config, null, n.request, n)) : t(n)
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(11);
        t.exports = function(t, e, n, o, s) {
            var r = new Error(t);
            return i(r, e, n, o, s)
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t, e, n, i, o) {
            return t.config = e, n && (t.code = n), t.request = i, t.response = o, t
        }
    }, function(t, e, n) {
        "use strict";

        function i(t) {
            return encodeURIComponent(t).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
        }
        var o = n(2);
        t.exports = function(t, e, n) {
            if (!e) return t;
            var s;
            if (n) s = n(e);
            else if (o.isURLSearchParams(e)) s = e.toString();
            else {
                var r = [];
                o.forEach(e, function(t, e) {
                    null !== t && void 0 !== t && (o.isArray(t) ? e += "[]" : t = [t], o.forEach(t, function(t) {
                        o.isDate(t) ? t = t.toISOString() : o.isObject(t) && (t = JSON.stringify(t)), r.push(i(e) + "=" + i(t))
                    }))
                }), s = r.join("&")
            }
            return s && (t += (-1 === t.indexOf("?") ? "?" : "&") + s), t
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(2),
            o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
        t.exports = function(t) {
            var e, n, s, r = {};
            return t ? (i.forEach(t.split("\n"), function(t) {
                if (s = t.indexOf(":"), e = i.trim(t.substr(0, s)).toLowerCase(), n = i.trim(t.substr(s + 1)), e) {
                    if (r[e] && o.indexOf(e) >= 0) return;
                    r[e] = "set-cookie" === e ? (r[e] ? r[e] : []).concat([n]) : r[e] ? r[e] + ", " + n : n
                }
            }), r) : r
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(2);
        t.exports = i.isStandardBrowserEnv() ? function() {
            function t(t) {
                var e = t;
                return n && (o.setAttribute("href", e), e = o.href), o.setAttribute("href", e), {
                    href: o.href,
                    protocol: o.protocol ? o.protocol.replace(/:$/, "") : "",
                    host: o.host,
                    search: o.search ? o.search.replace(/^\?/, "") : "",
                    hash: o.hash ? o.hash.replace(/^#/, "") : "",
                    hostname: o.hostname,
                    port: o.port,
                    pathname: "/" === o.pathname.charAt(0) ? o.pathname : "/" + o.pathname
                }
            }
            var e, n = /(msie|trident)/i.test(navigator.userAgent),
                o = document.createElement("a");
            return e = t(window.location.href),
                function(n) {
                    var o = i.isString(n) ? t(n) : n;
                    return o.protocol === e.protocol && o.host === e.host
                }
        }() : function() {
            return !0
        }
    }, function(t, e) {
        "use strict";

        function n() {
            this.message = "String contains an invalid character"
        }
        var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        n.prototype = new Error, n.prototype.code = 5, n.prototype.name = "InvalidCharacterError", t.exports = function(t) {
            for (var e, o, s = String(t), r = "", a = 0, l = i; s.charAt(0 | a) || (l = "=", a % 1); r += l.charAt(63 & e >> 8 - a % 1 * 8)) {
                if ((o = s.charCodeAt(a += .75)) > 255) throw new n;
                e = e << 8 | o
            }
            return r
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(2);
        t.exports = i.isStandardBrowserEnv() ? {
            write: function(t, e, n, o, s, r) {
                var a = [];
                a.push(t + "=" + encodeURIComponent(e)), i.isNumber(n) && a.push("expires=" + new Date(n).toGMTString()), i.isString(o) && a.push("path=" + o), i.isString(s) && a.push("domain=" + s), !0 === r && a.push("secure"), document.cookie = a.join("; ")
            },
            read: function(t) {
                var e = document.cookie.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
                return e ? decodeURIComponent(e[3]) : null
            },
            remove: function(t) {
                this.write(t, "", Date.now() - 864e5)
            }
        } : {
            write: function() {},
            read: function() {
                return null
            },
            remove: function() {}
        }
    }, function(t, e, n) {
        "use strict";

        function i() {
            this.handlers = []
        }
        var o = n(2);
        i.prototype.use = function(t, e) {
            return this.handlers.push({
                fulfilled: t,
                rejected: e
            }), this.handlers.length - 1
        }, i.prototype.eject = function(t) {
            this.handlers[t] && (this.handlers[t] = null)
        }, i.prototype.forEach = function(t) {
            o.forEach(this.handlers, function(e) {
                null !== e && t(e)
            })
        }, t.exports = i
    }, function(t, e, n) {
        "use strict";

        function i(t) {
            t.cancelToken && t.cancelToken.throwIfRequested()
        }
        var o = n(2),
            s = n(19),
            r = n(20),
            a = n(6),
            l = n(21),
            c = n(22);
        t.exports = function(t) {
            return i(t), t.baseURL && !l(t.url) && (t.url = c(t.baseURL, t.url)), t.headers = t.headers || {}, t.data = s(t.data, t.headers, t.transformRequest), t.headers = o.merge(t.headers.common || {}, t.headers[t.method] || {}, t.headers || {}), o.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(e) {
                delete t.headers[e]
            }), (t.adapter || a.adapter)(t).then(function(e) {
                return i(t), e.data = s(e.data, e.headers, t.transformResponse), e
            }, function(e) {
                return r(e) || (i(t), e && e.response && (e.response.data = s(e.response.data, e.response.headers, t.transformResponse))), Promise.reject(e)
            })
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(2);
        t.exports = function(t, e, n) {
            return i.forEach(n, function(n) {
                t = n(t, e)
            }), t
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t) {
            return !(!t || !t.__CANCEL__)
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t) {
            return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(t)
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t, e) {
            return e ? t.replace(/\/+$/, "") + "/" + e.replace(/^\/+/, "") : t
        }
    }, function(t, e) {
        "use strict";

        function n(t) {
            this.message = t
        }
        n.prototype.toString = function() {
            return "Cancel" + (this.message ? ": " + this.message : "")
        }, n.prototype.__CANCEL__ = !0, t.exports = n
    }, function(t, e, n) {
        "use strict";

        function i(t) {
            if ("function" != typeof t) throw new TypeError("executor must be a function.");
            var e;
            this.promise = new Promise(function(t) {
                e = t
            });
            var n = this;
            t(function(t) {
                n.reason || (n.reason = new o(t), e(n.reason))
            })
        }
        var o = n(23);
        i.prototype.throwIfRequested = function() {
            if (this.reason) throw this.reason
        }, i.source = function() {
            var t;
            return {
                token: new i(function(e) {
                    t = e
                }),
                cancel: t
            }
        }, t.exports = i
    }, function(t, e) {
        "use strict";
        t.exports = function(t) {
            return function(e) {
                return t.apply(null, e)
            }
        }
    }])
}),
function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).Vue = e()
}(this, function() {
    "use strict";
    var t = Object.freeze({});

    function e(t) {
        return null == t
    }

    function n(t) {
        return null != t
    }

    function i(t) {
        return !0 === t
    }

    function o(t) {
        return "string" == typeof t || "number" == typeof t || "symbol" == typeof t || "boolean" == typeof t
    }

    function s(t) {
        return null !== t && "object" == typeof t
    }
    var r = Object.prototype.toString;

    function a(t) {
        return "[object Object]" === r.call(t)
    }

    function l(t) {
        var e = parseFloat(String(t));
        return e >= 0 && Math.floor(e) === e && isFinite(t)
    }

    function c(t) {
        return n(t) && "function" == typeof t.then && "function" == typeof t.catch
    }

    function d(t) {
        return null == t ? "" : Array.isArray(t) || a(t) && t.toString === r ? JSON.stringify(t, null, 2) : String(t)
    }

    function u(t) {
        var e = parseFloat(t);
        return isNaN(e) ? t : e
    }

    function p(t, e) {
        for (var n = Object.create(null), i = t.split(","), o = 0; o < i.length; o++) n[i[o]] = !0;
        return e ? function(t) {
            return n[t.toLowerCase()]
        } : function(t) {
            return n[t]
        }
    }
    var m = p("slot,component", !0),
        h = p("key,ref,slot,slot-scope,is");

    function v(t, e) {
        if (t.length) {
            var n = t.indexOf(e);
            if (n > -1) return t.splice(n, 1)
        }
    }
    var f = Object.prototype.hasOwnProperty;

    function g(t, e) {
        return f.call(t, e)
    }

    function b(t) {
        var e = Object.create(null);
        return function(n) {
            return e[n] || (e[n] = t(n))
        }
    }
    var y = /-(\w)/g,
        C = b(function(t) {
            return t.replace(y, function(t, e) {
                return e ? e.toUpperCase() : ""
            })
        }),
        S = b(function(t) {
            return t.charAt(0).toUpperCase() + t.slice(1)
        }),
        w = /\B([A-Z])/g,
        k = b(function(t) {
            return t.replace(w, "-$1").toLowerCase()
        }),
        x = Function.prototype.bind ? function(t, e) {
            return t.bind(e)
        } : function(t, e) {
            function n(n) {
                var i = arguments.length;
                return i ? i > 1 ? t.apply(e, arguments) : t.call(e, n) : t.call(e)
            }
            return n._length = t.length, n
        };

    function T(t, e) {
        e = e || 0;
        for (var n = t.length - e, i = new Array(n); n--;) i[n] = t[n + e];
        return i
    }

    function P(t, e) {
        for (var n in e) t[n] = e[n];
        return t
    }

    function I(t) {
        for (var e = {}, n = 0; n < t.length; n++) t[n] && P(e, t[n]);
        return e
    }

    function E(t, e, n) {}
    var A = function(t, e, n) {
            return !1
        },
        F = function(t) {
            return t
        };

    function L(t, e) {
        if (t === e) return !0;
        var n = s(t),
            i = s(e);
        if (!n || !i) return !n && !i && String(t) === String(e);
        try {
            var o = Array.isArray(t),
                r = Array.isArray(e);
            if (o && r) return t.length === e.length && t.every(function(t, n) {
                return L(t, e[n])
            });
            if (t instanceof Date && e instanceof Date) return t.getTime() === e.getTime();
            if (o || r) return !1;
            var a = Object.keys(t),
                l = Object.keys(e);
            return a.length === l.length && a.every(function(n) {
                return L(t[n], e[n])
            })
        } catch (t) {
            return !1
        }
    }

    function G(t, e) {
        for (var n = 0; n < t.length; n++)
            if (L(t[n], e)) return n;
        return -1
    }

    function N(t) {
        var e = !1;
        return function() {
            e || (e = !0, t.apply(this, arguments))
        }
    }
    var O = "data-server-rendered",
        D = ["component", "directive", "filter"],
        _ = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated", "errorCaptured", "serverPrefetch"],
        B = {
            optionMergeStrategies: Object.create(null),
            silent: !1,
            productionTip: !1,
            devtools: !1,
            performance: !1,
            errorHandler: null,
            warnHandler: null,
            ignoredElements: [],
            keyCodes: Object.create(null),
            isReservedTag: A,
            isReservedAttr: A,
            isUnknownElement: A,
            getTagNamespace: E,
            parsePlatformTagName: F,
            mustUseProp: A,
            async: !0,
            _lifecycleHooks: _
        },
        V = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

    function $(t, e, n, i) {
        Object.defineProperty(t, e, {
            value: n,
            enumerable: !!i,
            writable: !0,
            configurable: !0
        })
    }
    var M, W = new RegExp("[^" + V.source + ".$_\\d]"),
        R = "__proto__" in {},
        j = "undefined" != typeof window,
        q = "undefined" != typeof WXEnvironment && !!WXEnvironment.platform,
        H = q && WXEnvironment.platform.toLowerCase(),
        U = j && window.navigator.userAgent.toLowerCase(),
        z = U && /msie|trident/.test(U),
        Q = U && U.indexOf("msie 9.0") > 0,
        K = U && U.indexOf("edge/") > 0,
        Y = (U && U.indexOf("android"), U && /iphone|ipad|ipod|ios/.test(U) || "ios" === H),
        X = (U && /chrome\/\d+/.test(U), U && /phantomjs/.test(U), U && U.match(/firefox\/(\d+)/)),
        Z = {}.watch,
        J = !1;
    if (j) try {
        var tt = {};
        Object.defineProperty(tt, "passive", {
            get: function() {
                J = !0
            }
        }), window.addEventListener("test-passive", null, tt)
    } catch (t) {}
    var et = function() {
            return void 0 === M && (M = !j && !q && "undefined" != typeof global && global.process && "server" === global.process.env.VUE_ENV), M
        },
        nt = j && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    function it(t) {
        return "function" == typeof t && /native code/.test(t.toString())
    }
    var ot, st = "undefined" != typeof Symbol && it(Symbol) && "undefined" != typeof Reflect && it(Reflect.ownKeys);
    ot = "undefined" != typeof Set && it(Set) ? Set : function() {
        function t() {
            this.set = Object.create(null)
        }
        return t.prototype.has = function(t) {
            return !0 === this.set[t]
        }, t.prototype.add = function(t) {
            this.set[t] = !0
        }, t.prototype.clear = function() {
            this.set = Object.create(null)
        }, t
    }();
    var rt = E,
        at = 0,
        lt = function() {
            this.id = at++, this.subs = []
        };
    lt.prototype.addSub = function(t) {
        this.subs.push(t)
    }, lt.prototype.removeSub = function(t) {
        v(this.subs, t)
    }, lt.prototype.depend = function() {
        lt.target && lt.target.addDep(this)
    }, lt.prototype.notify = function() {
        for (var t = this.subs.slice(), e = 0, n = t.length; e < n; e++) t[e].update()
    }, lt.target = null;
    var ct = [];

    function dt(t) {
        ct.push(t), lt.target = t
    }

    function ut() {
        ct.pop(), lt.target = ct[ct.length - 1]
    }
    var pt = function(t, e, n, i, o, s, r, a) {
            this.tag = t, this.data = e, this.children = n, this.text = i, this.elm = o, this.ns = void 0, this.context = s, this.fnContext = void 0, this.fnOptions = void 0, this.fnScopeId = void 0, this.key = e && e.key, this.componentOptions = r, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1, this.asyncFactory = a, this.asyncMeta = void 0, this.isAsyncPlaceholder = !1
        },
        mt = {
            child: {
                configurable: !0
            }
        };
    mt.child.get = function() {
        return this.componentInstance
    }, Object.defineProperties(pt.prototype, mt);
    var ht = function(t) {
        void 0 === t && (t = "");
        var e = new pt;
        return e.text = t, e.isComment = !0, e
    };

    function vt(t) {
        return new pt(void 0, void 0, void 0, String(t))
    }

    function ft(t) {
        var e = new pt(t.tag, t.data, t.children && t.children.slice(), t.text, t.elm, t.context, t.componentOptions, t.asyncFactory);
        return e.ns = t.ns, e.isStatic = t.isStatic, e.key = t.key, e.isComment = t.isComment, e.fnContext = t.fnContext, e.fnOptions = t.fnOptions, e.fnScopeId = t.fnScopeId, e.asyncMeta = t.asyncMeta, e.isCloned = !0, e
    }
    var gt = Array.prototype,
        bt = Object.create(gt);
    ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function(t) {
        var e = gt[t];
        $(bt, t, function() {
            for (var n = [], i = arguments.length; i--;) n[i] = arguments[i];
            var o, s = e.apply(this, n),
                r = this.__ob__;
            switch (t) {
                case "push":
                case "unshift":
                    o = n;
                    break;
                case "splice":
                    o = n.slice(2)
            }
            return o && r.observeArray(o), r.dep.notify(), s
        })
    });
    var yt = Object.getOwnPropertyNames(bt),
        Ct = !0;

    function St(t) {
        Ct = t
    }
    var wt = function(t) {
        var e;
        this.value = t, this.dep = new lt, this.vmCount = 0, $(t, "__ob__", this), Array.isArray(t) ? (R ? (e = bt, t.__proto__ = e) : function(t, e, n) {
            for (var i = 0, o = n.length; i < o; i++) {
                var s = n[i];
                $(t, s, e[s])
            }
        }(t, bt, yt), this.observeArray(t)) : this.walk(t)
    };

    function kt(t, e) {
        var n;
        if (s(t) && !(t instanceof pt)) return g(t, "__ob__") && t.__ob__ instanceof wt ? n = t.__ob__ : Ct && !et() && (Array.isArray(t) || a(t)) && Object.isExtensible(t) && !t._isVue && (n = new wt(t)), e && n && n.vmCount++, n
    }

    function xt(t, e, n, i, o) {
        var s = new lt,
            r = Object.getOwnPropertyDescriptor(t, e);
        if (!r || !1 !== r.configurable) {
            var a = r && r.get,
                l = r && r.set;
            a && !l || 2 !== arguments.length || (n = t[e]);
            var c = !o && kt(n);
            Object.defineProperty(t, e, {
                enumerable: !0,
                configurable: !0,
                get: function() {
                    var e = a ? a.call(t) : n;
                    return lt.target && (s.depend(), c && (c.dep.depend(), Array.isArray(e) && function t(e) {
                        for (var n = void 0, i = 0, o = e.length; i < o; i++)(n = e[i]) && n.__ob__ && n.__ob__.dep.depend(), Array.isArray(n) && t(n)
                    }(e))), e
                },
                set: function(e) {
                    var i = a ? a.call(t) : n;
                    e === i || e != e && i != i || a && !l || (l ? l.call(t, e) : n = e, c = !o && kt(e), s.notify())
                }
            })
        }
    }

    function Tt(t, e, n) {
        if (Array.isArray(t) && l(e)) return t.length = Math.max(t.length, e), t.splice(e, 1, n), n;
        if (e in t && !(e in Object.prototype)) return t[e] = n, n;
        var i = t.__ob__;
        return t._isVue || i && i.vmCount ? n : i ? (xt(i.value, e, n), i.dep.notify(), n) : (t[e] = n, n)
    }

    function Pt(t, e) {
        if (Array.isArray(t) && l(e)) t.splice(e, 1);
        else {
            var n = t.__ob__;
            t._isVue || n && n.vmCount || g(t, e) && (delete t[e], n && n.dep.notify())
        }
    }
    wt.prototype.walk = function(t) {
        for (var e = Object.keys(t), n = 0; n < e.length; n++) xt(t, e[n])
    }, wt.prototype.observeArray = function(t) {
        for (var e = 0, n = t.length; e < n; e++) kt(t[e])
    };
    var It = B.optionMergeStrategies;

    function Et(t, e) {
        if (!e) return t;
        for (var n, i, o, s = st ? Reflect.ownKeys(e) : Object.keys(e), r = 0; r < s.length; r++) "__ob__" !== (n = s[r]) && (i = t[n], o = e[n], g(t, n) ? i !== o && a(i) && a(o) && Et(i, o) : Tt(t, n, o));
        return t
    }

    function At(t, e, n) {
        return n ? function() {
            var i = "function" == typeof e ? e.call(n, n) : e,
                o = "function" == typeof t ? t.call(n, n) : t;
            return i ? Et(i, o) : o
        } : e ? t ? function() {
            return Et("function" == typeof e ? e.call(this, this) : e, "function" == typeof t ? t.call(this, this) : t)
        } : e : t
    }

    function Ft(t, e) {
        var n = e ? t ? t.concat(e) : Array.isArray(e) ? e : [e] : t;
        return n ? function(t) {
            for (var e = [], n = 0; n < t.length; n++) - 1 === e.indexOf(t[n]) && e.push(t[n]);
            return e
        }(n) : n
    }

    function Lt(t, e, n, i) {
        var o = Object.create(t || null);
        return e ? P(o, e) : o
    }
    It.data = function(t, e, n) {
        return n ? At(t, e, n) : e && "function" != typeof e ? t : At(t, e)
    }, _.forEach(function(t) {
        It[t] = Ft
    }), D.forEach(function(t) {
        It[t + "s"] = Lt
    }), It.watch = function(t, e, n, i) {
        if (t === Z && (t = void 0), e === Z && (e = void 0), !e) return Object.create(t || null);
        if (!t) return e;
        var o = {};
        for (var s in P(o, t), e) {
            var r = o[s],
                a = e[s];
            r && !Array.isArray(r) && (r = [r]), o[s] = r ? r.concat(a) : Array.isArray(a) ? a : [a]
        }
        return o
    }, It.props = It.methods = It.inject = It.computed = function(t, e, n, i) {
        if (!t) return e;
        var o = Object.create(null);
        return P(o, t), e && P(o, e), o
    }, It.provide = At;
    var Gt = function(t, e) {
        return void 0 === e ? t : e
    };

    function Nt(t, e, n) {
        if ("function" == typeof e && (e = e.options), function(t, e) {
                var n = t.props;
                if (n) {
                    var i, o, s = {};
                    if (Array.isArray(n))
                        for (i = n.length; i--;) "string" == typeof(o = n[i]) && (s[C(o)] = {
                            type: null
                        });
                    else if (a(n))
                        for (var r in n) o = n[r], s[C(r)] = a(o) ? o : {
                            type: o
                        };
                    t.props = s
                }
            }(e), function(t, e) {
                var n = t.inject;
                if (n) {
                    var i = t.inject = {};
                    if (Array.isArray(n))
                        for (var o = 0; o < n.length; o++) i[n[o]] = {
                            from: n[o]
                        };
                    else if (a(n))
                        for (var s in n) {
                            var r = n[s];
                            i[s] = a(r) ? P({
                                from: s
                            }, r) : {
                                from: r
                            }
                        }
                }
            }(e), function(t) {
                var e = t.directives;
                if (e)
                    for (var n in e) {
                        var i = e[n];
                        "function" == typeof i && (e[n] = {
                            bind: i,
                            update: i
                        })
                    }
            }(e), !e._base && (e.extends && (t = Nt(t, e.extends, n)), e.mixins))
            for (var i = 0, o = e.mixins.length; i < o; i++) t = Nt(t, e.mixins[i], n);
        var s, r = {};
        for (s in t) l(s);
        for (s in e) g(t, s) || l(s);

        function l(i) {
            var o = It[i] || Gt;
            r[i] = o(t[i], e[i], n, i)
        }
        return r
    }

    function Ot(t, e, n, i) {
        if ("string" == typeof n) {
            var o = t[e];
            if (g(o, n)) return o[n];
            var s = C(n);
            if (g(o, s)) return o[s];
            var r = S(s);
            return g(o, r) ? o[r] : o[n] || o[s] || o[r]
        }
    }

    function Dt(t, e, n, i) {
        var o = e[t],
            s = !g(n, t),
            r = n[t],
            a = Vt(Boolean, o.type);
        if (a > -1)
            if (s && !g(o, "default")) r = !1;
            else if ("" === r || r === k(t)) {
            var l = Vt(String, o.type);
            (l < 0 || a < l) && (r = !0)
        }
        if (void 0 === r) {
            r = function(t, e, n) {
                if (g(e, "default")) {
                    var i = e.default;
                    return t && t.$options.propsData && void 0 === t.$options.propsData[n] && void 0 !== t._props[n] ? t._props[n] : "function" == typeof i && "Function" !== _t(e.type) ? i.call(t) : i
                }
            }(i, o, t);
            var c = Ct;
            St(!0), kt(r), St(c)
        }
        return r
    }

    function _t(t) {
        var e = t && t.toString().match(/^\s*function (\w+)/);
        return e ? e[1] : ""
    }

    function Bt(t, e) {
        return _t(t) === _t(e)
    }

    function Vt(t, e) {
        if (!Array.isArray(e)) return Bt(e, t) ? 0 : -1;
        for (var n = 0, i = e.length; n < i; n++)
            if (Bt(e[n], t)) return n;
        return -1
    }

    function $t(t, e, n) {
        dt();
        try {
            if (e)
                for (var i = e; i = i.$parent;) {
                    var o = i.$options.errorCaptured;
                    if (o)
                        for (var s = 0; s < o.length; s++) try {
                            if (!1 === o[s].call(i, t, e, n)) return
                        } catch (t) {
                            Wt(t, i, "errorCaptured hook")
                        }
                }
            Wt(t, e, n)
        } finally {
            ut()
        }
    }

    function Mt(t, e, n, i, o) {
        var s;
        try {
            (s = n ? t.apply(e, n) : t.call(e)) && !s._isVue && c(s) && !s._handled && (s.catch(function(t) {
                return $t(t, i, o + " (Promise/async)")
            }), s._handled = !0)
        } catch (t) {
            $t(t, i, o)
        }
        return s
    }

    function Wt(t, e, n) {
        if (B.errorHandler) try {
            return B.errorHandler.call(null, t, e, n)
        } catch (e) {
            e !== t && Rt(e, null, "config.errorHandler")
        }
        Rt(t, e, n)
    }

    function Rt(t, e, n) {
        if (!j && !q || "undefined" == typeof console) throw t;
        console.error(t)
    }
    var jt, qt = !1,
        Ht = [],
        Ut = !1;

    function zt() {
        Ut = !1;
        var t = Ht.slice(0);
        Ht.length = 0;
        for (var e = 0; e < t.length; e++) t[e]()
    }
    if ("undefined" != typeof Promise && it(Promise)) {
        var Qt = Promise.resolve();
        jt = function() {
            Qt.then(zt), Y && setTimeout(E)
        }, qt = !0
    } else if (z || "undefined" == typeof MutationObserver || !it(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) jt = "undefined" != typeof setImmediate && it(setImmediate) ? function() {
        setImmediate(zt)
    } : function() {
        setTimeout(zt, 0)
    };
    else {
        var Kt = 1,
            Yt = new MutationObserver(zt),
            Xt = document.createTextNode(String(Kt));
        Yt.observe(Xt, {
            characterData: !0
        }), jt = function() {
            Kt = (Kt + 1) % 2, Xt.data = String(Kt)
        }, qt = !0
    }

    function Zt(t, e) {
        var n;
        if (Ht.push(function() {
                if (t) try {
                    t.call(e)
                } catch (t) {
                    $t(t, e, "nextTick")
                } else n && n(e)
            }), Ut || (Ut = !0, jt()), !t && "undefined" != typeof Promise) return new Promise(function(t) {
            n = t
        })
    }
    var Jt = new ot;

    function te(t) {
        ! function t(e, n) {
            var i, o, r = Array.isArray(e);
            if (!(!r && !s(e) || Object.isFrozen(e) || e instanceof pt)) {
                if (e.__ob__) {
                    var a = e.__ob__.dep.id;
                    if (n.has(a)) return;
                    n.add(a)
                }
                if (r)
                    for (i = e.length; i--;) t(e[i], n);
                else
                    for (i = (o = Object.keys(e)).length; i--;) t(e[o[i]], n)
            }
        }(t, Jt), Jt.clear()
    }
    var ee = b(function(t) {
        var e = "&" === t.charAt(0),
            n = "~" === (t = e ? t.slice(1) : t).charAt(0),
            i = "!" === (t = n ? t.slice(1) : t).charAt(0);
        return {
            name: t = i ? t.slice(1) : t,
            once: n,
            capture: i,
            passive: e
        }
    });

    function ne(t, e) {
        function n() {
            var t = arguments,
                i = n.fns;
            if (!Array.isArray(i)) return Mt(i, null, arguments, e, "v-on handler");
            for (var o = i.slice(), s = 0; s < o.length; s++) Mt(o[s], null, t, e, "v-on handler")
        }
        return n.fns = t, n
    }

    function ie(t, n, o, s, r, a) {
        var l, c, d, u;
        for (l in t) c = t[l], d = n[l], u = ee(l), e(c) || (e(d) ? (e(c.fns) && (c = t[l] = ne(c, a)), i(u.once) && (c = t[l] = r(u.name, c, u.capture)), o(u.name, c, u.capture, u.passive, u.params)) : c !== d && (d.fns = c, t[l] = d));
        for (l in n) e(t[l]) && s((u = ee(l)).name, n[l], u.capture)
    }

    function oe(t, o, s) {
        var r;
        t instanceof pt && (t = t.data.hook || (t.data.hook = {}));
        var a = t[o];

        function l() {
            s.apply(this, arguments), v(r.fns, l)
        }
        e(a) ? r = ne([l]) : n(a.fns) && i(a.merged) ? (r = a).fns.push(l) : r = ne([a, l]), r.merged = !0, t[o] = r
    }

    function se(t, e, i, o, s) {
        if (n(e)) {
            if (g(e, i)) return t[i] = e[i], s || delete e[i], !0;
            if (g(e, o)) return t[i] = e[o], s || delete e[o], !0
        }
        return !1
    }

    function re(t) {
        return o(t) ? [vt(t)] : Array.isArray(t) ? function t(s, r) {
            var a, l, c, d, u = [];
            for (a = 0; a < s.length; a++) e(l = s[a]) || "boolean" == typeof l || (d = u[c = u.length - 1], Array.isArray(l) ? l.length > 0 && (ae((l = t(l, (r || "") + "_" + a))[0]) && ae(d) && (u[c] = vt(d.text + l[0].text), l.shift()), u.push.apply(u, l)) : o(l) ? ae(d) ? u[c] = vt(d.text + l) : "" !== l && u.push(vt(l)) : ae(l) && ae(d) ? u[c] = vt(d.text + l.text) : (i(s._isVList) && n(l.tag) && e(l.key) && n(r) && (l.key = "__vlist" + r + "_" + a + "__"), u.push(l)));
            return u
        }(t) : void 0
    }

    function ae(t) {
        return n(t) && n(t.text) && !1 === t.isComment
    }

    function le(t, e) {
        if (t) {
            for (var n = Object.create(null), i = st ? Reflect.ownKeys(t) : Object.keys(t), o = 0; o < i.length; o++) {
                var s = i[o];
                if ("__ob__" !== s) {
                    for (var r = t[s].from, a = e; a;) {
                        if (a._provided && g(a._provided, r)) {
                            n[s] = a._provided[r];
                            break
                        }
                        a = a.$parent
                    }
                    if (!a && "default" in t[s]) {
                        var l = t[s].default;
                        n[s] = "function" == typeof l ? l.call(e) : l
                    }
                }
            }
            return n
        }
    }

    function ce(t, e) {
        if (!t || !t.length) return {};
        for (var n = {}, i = 0, o = t.length; i < o; i++) {
            var s = t[i],
                r = s.data;
            if (r && r.attrs && r.attrs.slot && delete r.attrs.slot, s.context !== e && s.fnContext !== e || !r || null == r.slot)(n.default || (n.default = [])).push(s);
            else {
                var a = r.slot,
                    l = n[a] || (n[a] = []);
                "template" === s.tag ? l.push.apply(l, s.children || []) : l.push(s)
            }
        }
        for (var c in n) n[c].every(de) && delete n[c];
        return n
    }

    function de(t) {
        return t.isComment && !t.asyncFactory || " " === t.text
    }

    function ue(e, n, i) {
        var o, s = Object.keys(n).length > 0,
            r = e ? !!e.$stable : !s,
            a = e && e.$key;
        if (e) {
            if (e._normalized) return e._normalized;
            if (r && i && i !== t && a === i.$key && !s && !i.$hasNormal) return i;
            for (var l in o = {}, e) e[l] && "$" !== l[0] && (o[l] = pe(n, l, e[l]))
        } else o = {};
        for (var c in n) c in o || (o[c] = me(n, c));
        return e && Object.isExtensible(e) && (e._normalized = o), $(o, "$stable", r), $(o, "$key", a), $(o, "$hasNormal", s), o
    }

    function pe(t, e, n) {
        var i = function() {
            var t = arguments.length ? n.apply(null, arguments) : n({});
            return (t = t && "object" == typeof t && !Array.isArray(t) ? [t] : re(t)) && (0 === t.length || 1 === t.length && t[0].isComment) ? void 0 : t
        };
        return n.proxy && Object.defineProperty(t, e, {
            get: i,
            enumerable: !0,
            configurable: !0
        }), i
    }

    function me(t, e) {
        return function() {
            return t[e]
        }
    }

    function he(t, e) {
        var i, o, r, a, l;
        if (Array.isArray(t) || "string" == typeof t)
            for (i = new Array(t.length), o = 0, r = t.length; o < r; o++) i[o] = e(t[o], o);
        else if ("number" == typeof t)
            for (i = new Array(t), o = 0; o < t; o++) i[o] = e(o + 1, o);
        else if (s(t))
            if (st && t[Symbol.iterator]) {
                i = [];
                for (var c = t[Symbol.iterator](), d = c.next(); !d.done;) i.push(e(d.value, i.length)), d = c.next()
            } else
                for (a = Object.keys(t), i = new Array(a.length), o = 0, r = a.length; o < r; o++) l = a[o], i[o] = e(t[l], l, o);
        return n(i) || (i = []), i._isVList = !0, i
    }

    function ve(t, e, n, i) {
        var o, s = this.$scopedSlots[t];
        s ? (n = n || {}, i && (n = P(P({}, i), n)), o = s(n) || e) : o = this.$slots[t] || e;
        var r = n && n.slot;
        return r ? this.$createElement("template", {
            slot: r
        }, o) : o
    }

    function fe(t) {
        return Ot(this.$options, "filters", t) || F
    }

    function ge(t, e) {
        return Array.isArray(t) ? -1 === t.indexOf(e) : t !== e
    }

    function be(t, e, n, i, o) {
        var s = B.keyCodes[e] || n;
        return o && i && !B.keyCodes[e] ? ge(o, i) : s ? ge(s, t) : i ? k(i) !== e : void 0
    }

    function ye(t, e, n, i, o) {
        if (n && s(n)) {
            var r;
            Array.isArray(n) && (n = I(n));
            var a = function(s) {
                if ("class" === s || "style" === s || h(s)) r = t;
                else {
                    var a = t.attrs && t.attrs.type;
                    r = i || B.mustUseProp(e, a, s) ? t.domProps || (t.domProps = {}) : t.attrs || (t.attrs = {})
                }
                var l = C(s),
                    c = k(s);
                l in r || c in r || (r[s] = n[s], o && ((t.on || (t.on = {}))["update:" + s] = function(t) {
                    n[s] = t
                }))
            };
            for (var l in n) a(l)
        }
        return t
    }

    function Ce(t, e) {
        var n = this._staticTrees || (this._staticTrees = []),
            i = n[t];
        return i && !e ? i : (we(i = n[t] = this.$options.staticRenderFns[t].call(this._renderProxy, null, this), "__static__" + t, !1), i)
    }

    function Se(t, e, n) {
        return we(t, "__once__" + e + (n ? "_" + n : ""), !0), t
    }

    function we(t, e, n) {
        if (Array.isArray(t))
            for (var i = 0; i < t.length; i++) t[i] && "string" != typeof t[i] && ke(t[i], e + "_" + i, n);
        else ke(t, e, n)
    }

    function ke(t, e, n) {
        t.isStatic = !0, t.key = e, t.isOnce = n
    }

    function xe(t, e) {
        if (e && a(e)) {
            var n = t.on = t.on ? P({}, t.on) : {};
            for (var i in e) {
                var o = n[i],
                    s = e[i];
                n[i] = o ? [].concat(o, s) : s
            }
        }
        return t
    }

    function Te(t, e, n, i) {
        e = e || {
            $stable: !n
        };
        for (var o = 0; o < t.length; o++) {
            var s = t[o];
            Array.isArray(s) ? Te(s, e, n) : s && (s.proxy && (s.fn.proxy = !0), e[s.key] = s.fn)
        }
        return i && (e.$key = i), e
    }

    function Pe(t, e) {
        for (var n = 0; n < e.length; n += 2) {
            var i = e[n];
            "string" == typeof i && i && (t[e[n]] = e[n + 1])
        }
        return t
    }

    function Ie(t, e) {
        return "string" == typeof t ? e + t : t
    }

    function Ee(t) {
        t._o = Se, t._n = u, t._s = d, t._l = he, t._t = ve, t._q = L, t._i = G, t._m = Ce, t._f = fe, t._k = be, t._b = ye, t._v = vt, t._e = ht, t._u = Te, t._g = xe, t._d = Pe, t._p = Ie
    }

    function Ae(e, n, o, s, r) {
        var a, l = this,
            c = r.options;
        g(s, "_uid") ? (a = Object.create(s))._original = s : (a = s, s = s._original);
        var d = i(c._compiled),
            u = !d;
        this.data = e, this.props = n, this.children = o, this.parent = s, this.listeners = e.on || t, this.injections = le(c.inject, s), this.slots = function() {
            return l.$slots || ue(e.scopedSlots, l.$slots = ce(o, s)), l.$slots
        }, Object.defineProperty(this, "scopedSlots", {
            enumerable: !0,
            get: function() {
                return ue(e.scopedSlots, this.slots())
            }
        }), d && (this.$options = c, this.$slots = this.slots(), this.$scopedSlots = ue(e.scopedSlots, this.$slots)), c._scopeId ? this._c = function(t, e, n, i) {
            var o = Ve(a, t, e, n, i, u);
            return o && !Array.isArray(o) && (o.fnScopeId = c._scopeId, o.fnContext = s), o
        } : this._c = function(t, e, n, i) {
            return Ve(a, t, e, n, i, u)
        }
    }

    function Fe(t, e, n, i, o) {
        var s = ft(t);
        return s.fnContext = n, s.fnOptions = i, e.slot && ((s.data || (s.data = {})).slot = e.slot), s
    }

    function Le(t, e) {
        for (var n in e) t[C(n)] = e[n]
    }
    Ee(Ae.prototype);
    var Ge = {
            init: function(t, e) {
                if (t.componentInstance && !t.componentInstance._isDestroyed && t.data.keepAlive) {
                    var i = t;
                    Ge.prepatch(i, i)
                } else(t.componentInstance = function(t, e) {
                    var i = {
                            _isComponent: !0,
                            _parentVnode: t,
                            parent: Qe
                        },
                        o = t.data.inlineTemplate;
                    return n(o) && (i.render = o.render, i.staticRenderFns = o.staticRenderFns), new t.componentOptions.Ctor(i)
                }(t)).$mount(e ? t.elm : void 0, e)
            },
            prepatch: function(e, n) {
                var i = n.componentOptions;
                ! function(e, n, i, o, s) {
                    var r = o.data.scopedSlots,
                        a = e.$scopedSlots,
                        l = !!(r && !r.$stable || a !== t && !a.$stable || r && e.$scopedSlots.$key !== r.$key),
                        c = !!(s || e.$options._renderChildren || l);
                    if (e.$options._parentVnode = o, e.$vnode = o, e._vnode && (e._vnode.parent = o), e.$options._renderChildren = s, e.$attrs = o.data.attrs || t, e.$listeners = i || t, n && e.$options.props) {
                        St(!1);
                        for (var d = e._props, u = e.$options._propKeys || [], p = 0; p < u.length; p++) {
                            var m = u[p],
                                h = e.$options.props;
                            d[m] = Dt(m, h, n, e)
                        }
                        St(!0), e.$options.propsData = n
                    }
                    i = i || t;
                    var v = e.$options._parentListeners;
                    e.$options._parentListeners = i, ze(e, i, v), c && (e.$slots = ce(s, o.context), e.$forceUpdate())
                }(n.componentInstance = e.componentInstance, i.propsData, i.listeners, n, i.children)
            },
            insert: function(t) {
                var e, n = t.context,
                    i = t.componentInstance;
                i._isMounted || (i._isMounted = !0, Ze(i, "mounted")), t.data.keepAlive && (n._isMounted ? ((e = i)._inactive = !1, tn.push(e)) : Xe(i, !0))
            },
            destroy: function(t) {
                var e = t.componentInstance;
                e._isDestroyed || (t.data.keepAlive ? function t(e, n) {
                    if (!(n && (e._directInactive = !0, Ye(e)) || e._inactive)) {
                        e._inactive = !0;
                        for (var i = 0; i < e.$children.length; i++) t(e.$children[i]);
                        Ze(e, "deactivated")
                    }
                }(e, !0) : e.$destroy())
            }
        },
        Ne = Object.keys(Ge);

    function Oe(o, r, a, l, d) {
        if (!e(o)) {
            var u = a.$options._base;
            if (s(o) && (o = u.extend(o)), "function" == typeof o) {
                var p;
                if (e(o.cid) && void 0 === (o = function(t, o) {
                        if (i(t.error) && n(t.errorComp)) return t.errorComp;
                        if (n(t.resolved)) return t.resolved;
                        var r = Me;
                        if (r && n(t.owners) && -1 === t.owners.indexOf(r) && t.owners.push(r), i(t.loading) && n(t.loadingComp)) return t.loadingComp;
                        if (r && !n(t.owners)) {
                            var a = t.owners = [r],
                                l = !0,
                                d = null,
                                u = null;
                            r.$on("hook:destroyed", function() {
                                return v(a, r)
                            });
                            var p = function(t) {
                                    for (var e = 0, n = a.length; e < n; e++) a[e].$forceUpdate();
                                    t && (a.length = 0, null !== d && (clearTimeout(d), d = null), null !== u && (clearTimeout(u), u = null))
                                },
                                m = N(function(e) {
                                    t.resolved = We(e, o), l ? a.length = 0 : p(!0)
                                }),
                                h = N(function(e) {
                                    n(t.errorComp) && (t.error = !0, p(!0))
                                }),
                                f = t(m, h);
                            return s(f) && (c(f) ? e(t.resolved) && f.then(m, h) : c(f.component) && (f.component.then(m, h), n(f.error) && (t.errorComp = We(f.error, o)), n(f.loading) && (t.loadingComp = We(f.loading, o), 0 === f.delay ? t.loading = !0 : d = setTimeout(function() {
                                d = null, e(t.resolved) && e(t.error) && (t.loading = !0, p(!1))
                            }, f.delay || 200)), n(f.timeout) && (u = setTimeout(function() {
                                u = null, e(t.resolved) && h(null)
                            }, f.timeout)))), l = !1, t.loading ? t.loadingComp : t.resolved
                        }
                    }(p = o, u))) return function(t, e, n, i, o) {
                    var s = ht();
                    return s.asyncFactory = t, s.asyncMeta = {
                        data: e,
                        context: n,
                        children: i,
                        tag: o
                    }, s
                }(p, r, a, l, d);
                r = r || {}, Cn(o), n(r.model) && function(t, e) {
                    var i = t.model && t.model.prop || "value",
                        o = t.model && t.model.event || "input";
                    (e.attrs || (e.attrs = {}))[i] = e.model.value;
                    var s = e.on || (e.on = {}),
                        r = s[o],
                        a = e.model.callback;
                    n(r) ? (Array.isArray(r) ? -1 === r.indexOf(a) : r !== a) && (s[o] = [a].concat(r)) : s[o] = a
                }(o.options, r);
                var m = function(t, i, o) {
                    var s = i.options.props;
                    if (!e(s)) {
                        var r = {},
                            a = t.attrs,
                            l = t.props;
                        if (n(a) || n(l))
                            for (var c in s) {
                                var d = k(c);
                                se(r, l, c, d, !0) || se(r, a, c, d, !1)
                            }
                        return r
                    }
                }(r, o);
                if (i(o.options.functional)) return function(e, i, o, s, r) {
                    var a = e.options,
                        l = {},
                        c = a.props;
                    if (n(c))
                        for (var d in c) l[d] = Dt(d, c, i || t);
                    else n(o.attrs) && Le(l, o.attrs), n(o.props) && Le(l, o.props);
                    var u = new Ae(o, l, r, s, e),
                        p = a.render.call(null, u._c, u);
                    if (p instanceof pt) return Fe(p, o, u.parent, a);
                    if (Array.isArray(p)) {
                        for (var m = re(p) || [], h = new Array(m.length), v = 0; v < m.length; v++) h[v] = Fe(m[v], o, u.parent, a);
                        return h
                    }
                }(o, m, r, a, l);
                var h = r.on;
                if (r.on = r.nativeOn, i(o.options.abstract)) {
                    var f = r.slot;
                    r = {}, f && (r.slot = f)
                }! function(t) {
                    for (var e = t.hook || (t.hook = {}), n = 0; n < Ne.length; n++) {
                        var i = Ne[n],
                            o = e[i],
                            s = Ge[i];
                        o === s || o && o._merged || (e[i] = o ? De(s, o) : s)
                    }
                }(r);
                var g = o.options.name || d;
                return new pt("vue-component-" + o.cid + (g ? "-" + g : ""), r, void 0, void 0, void 0, a, {
                    Ctor: o,
                    propsData: m,
                    listeners: h,
                    tag: d,
                    children: l
                }, p)
            }
        }
    }

    function De(t, e) {
        var n = function(n, i) {
            t(n, i), e(n, i)
        };
        return n._merged = !0, n
    }
    var _e = 1,
        Be = 2;

    function Ve(t, r, a, l, c, d) {
        return (Array.isArray(a) || o(a)) && (c = l, l = a, a = void 0), i(d) && (c = Be),
            function(t, o, r, a, l) {
                if (n(r) && n(r.__ob__)) return ht();
                if (n(r) && n(r.is) && (o = r.is), !o) return ht();
                var c, d, u;
                (Array.isArray(a) && "function" == typeof a[0] && ((r = r || {}).scopedSlots = {
                    default: a[0]
                }, a.length = 0), l === Be ? a = re(a) : l === _e && (a = function(t) {
                    for (var e = 0; e < t.length; e++)
                        if (Array.isArray(t[e])) return Array.prototype.concat.apply([], t);
                    return t
                }(a)), "string" == typeof o) ? (d = t.$vnode && t.$vnode.ns || B.getTagNamespace(o), c = B.isReservedTag(o) ? new pt(B.parsePlatformTagName(o), r, a, void 0, void 0, t) : r && r.pre || !n(u = Ot(t.$options, "components", o)) ? new pt(o, r, a, void 0, void 0, t) : Oe(u, r, t, a, o)) : c = Oe(o, r, t, a);
                return Array.isArray(c) ? c : n(c) ? (n(d) && function t(o, s, r) {
                    if (o.ns = s, "foreignObject" === o.tag && (s = void 0, r = !0), n(o.children))
                        for (var a = 0, l = o.children.length; a < l; a++) {
                            var c = o.children[a];
                            n(c.tag) && (e(c.ns) || i(r) && "svg" !== c.tag) && t(c, s, r)
                        }
                }(c, d), n(r) && function(t) {
                    s(t.style) && te(t.style), s(t.class) && te(t.class)
                }(r), c) : ht()
            }(t, r, a, l, c)
    }
    var $e, Me = null;

    function We(t, e) {
        return (t.__esModule || st && "Module" === t[Symbol.toStringTag]) && (t = t.default), s(t) ? e.extend(t) : t
    }

    function Re(t) {
        return t.isComment && t.asyncFactory
    }

    function je(t) {
        if (Array.isArray(t))
            for (var e = 0; e < t.length; e++) {
                var i = t[e];
                if (n(i) && (n(i.componentOptions) || Re(i))) return i
            }
    }

    function qe(t, e) {
        $e.$on(t, e)
    }

    function He(t, e) {
        $e.$off(t, e)
    }

    function Ue(t, e) {
        var n = $e;
        return function i() {
            null !== e.apply(null, arguments) && n.$off(t, i)
        }
    }

    function ze(t, e, n) {
        $e = t, ie(e, n || {}, qe, He, Ue, t), $e = void 0
    }
    var Qe = null;

    function Ke(t) {
        var e = Qe;
        return Qe = t,
            function() {
                Qe = e
            }
    }

    function Ye(t) {
        for (; t && (t = t.$parent);)
            if (t._inactive) return !0;
        return !1
    }

    function Xe(t, e) {
        if (e) {
            if (t._directInactive = !1, Ye(t)) return
        } else if (t._directInactive) return;
        if (t._inactive || null === t._inactive) {
            t._inactive = !1;
            for (var n = 0; n < t.$children.length; n++) Xe(t.$children[n]);
            Ze(t, "activated")
        }
    }

    function Ze(t, e) {
        dt();
        var n = t.$options[e],
            i = e + " hook";
        if (n)
            for (var o = 0, s = n.length; o < s; o++) Mt(n[o], t, null, t, i);
        t._hasHookEvent && t.$emit("hook:" + e), ut()
    }
    var Je = [],
        tn = [],
        en = {},
        nn = !1,
        on = !1,
        sn = 0,
        rn = 0,
        an = Date.now;
    if (j && !z) {
        var ln = window.performance;
        ln && "function" == typeof ln.now && an() > document.createEvent("Event").timeStamp && (an = function() {
            return ln.now()
        })
    }

    function cn() {
        var t, e;
        for (rn = an(), on = !0, Je.sort(function(t, e) {
                return t.id - e.id
            }), sn = 0; sn < Je.length; sn++)(t = Je[sn]).before && t.before(), e = t.id, en[e] = null, t.run();
        var n = tn.slice(),
            i = Je.slice();
        sn = Je.length = tn.length = 0, en = {}, nn = on = !1,
            function(t) {
                for (var e = 0; e < t.length; e++) t[e]._inactive = !0, Xe(t[e], !0)
            }(n),
            function(t) {
                for (var e = t.length; e--;) {
                    var n = t[e],
                        i = n.vm;
                    i._watcher === n && i._isMounted && !i._isDestroyed && Ze(i, "updated")
                }
            }(i), nt && B.devtools && nt.emit("flush")
    }
    var dn = 0,
        un = function(t, e, n, i, o) {
            this.vm = t, o && (t._watcher = this), t._watchers.push(this), i ? (this.deep = !!i.deep, this.user = !!i.user, this.lazy = !!i.lazy, this.sync = !!i.sync, this.before = i.before) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = n, this.id = ++dn, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new ot, this.newDepIds = new ot, this.expression = "", "function" == typeof e ? this.getter = e : (this.getter = function(t) {
                if (!W.test(t)) {
                    var e = t.split(".");
                    return function(t) {
                        for (var n = 0; n < e.length; n++) {
                            if (!t) return;
                            t = t[e[n]]
                        }
                        return t
                    }
                }
            }(e), this.getter || (this.getter = E)), this.value = this.lazy ? void 0 : this.get()
        };
    un.prototype.get = function() {
        var t;
        dt(this);
        var e = this.vm;
        try {
            t = this.getter.call(e, e)
        } catch (t) {
            if (!this.user) throw t;
            $t(t, e, 'getter for watcher "' + this.expression + '"')
        } finally {
            this.deep && te(t), ut(), this.cleanupDeps()
        }
        return t
    }, un.prototype.addDep = function(t) {
        var e = t.id;
        this.newDepIds.has(e) || (this.newDepIds.add(e), this.newDeps.push(t), this.depIds.has(e) || t.addSub(this))
    }, un.prototype.cleanupDeps = function() {
        for (var t = this.deps.length; t--;) {
            var e = this.deps[t];
            this.newDepIds.has(e.id) || e.removeSub(this)
        }
        var n = this.depIds;
        this.depIds = this.newDepIds, this.newDepIds = n, this.newDepIds.clear(), n = this.deps, this.deps = this.newDeps, this.newDeps = n, this.newDeps.length = 0
    }, un.prototype.update = function() {
        this.lazy ? this.dirty = !0 : this.sync ? this.run() : function(t) {
            var e = t.id;
            if (null == en[e]) {
                if (en[e] = !0, on) {
                    for (var n = Je.length - 1; n > sn && Je[n].id > t.id;) n--;
                    Je.splice(n + 1, 0, t)
                } else Je.push(t);
                nn || (nn = !0, Zt(cn))
            }
        }(this)
    }, un.prototype.run = function() {
        if (this.active) {
            var t = this.get();
            if (t !== this.value || s(t) || this.deep) {
                var e = this.value;
                if (this.value = t, this.user) try {
                    this.cb.call(this.vm, t, e)
                } catch (t) {
                    $t(t, this.vm, 'callback for watcher "' + this.expression + '"')
                } else this.cb.call(this.vm, t, e)
            }
        }
    }, un.prototype.evaluate = function() {
        this.value = this.get(), this.dirty = !1
    }, un.prototype.depend = function() {
        for (var t = this.deps.length; t--;) this.deps[t].depend()
    }, un.prototype.teardown = function() {
        if (this.active) {
            this.vm._isBeingDestroyed || v(this.vm._watchers, this);
            for (var t = this.deps.length; t--;) this.deps[t].removeSub(this);
            this.active = !1
        }
    };
    var pn = {
        enumerable: !0,
        configurable: !0,
        get: E,
        set: E
    };

    function mn(t, e, n) {
        pn.get = function() {
            return this[e][n]
        }, pn.set = function(t) {
            this[e][n] = t
        }, Object.defineProperty(t, n, pn)
    }
    var hn = {
        lazy: !0
    };

    function vn(t, e, n) {
        var i = !et();
        "function" == typeof n ? (pn.get = i ? fn(e) : gn(n), pn.set = E) : (pn.get = n.get ? i && !1 !== n.cache ? fn(e) : gn(n.get) : E, pn.set = n.set || E), Object.defineProperty(t, e, pn)
    }

    function fn(t) {
        return function() {
            var e = this._computedWatchers && this._computedWatchers[t];
            if (e) return e.dirty && e.evaluate(), lt.target && e.depend(), e.value
        }
    }

    function gn(t) {
        return function() {
            return t.call(this, this)
        }
    }

    function bn(t, e, n, i) {
        return a(n) && (i = n, n = n.handler), "string" == typeof n && (n = t[n]), t.$watch(e, n, i)
    }
    var yn = 0;

    function Cn(t) {
        var e = t.options;
        if (t.super) {
            var n = Cn(t.super);
            if (n !== t.superOptions) {
                t.superOptions = n;
                var i = function(t) {
                    var e, n = t.options,
                        i = t.sealedOptions;
                    for (var o in n) n[o] !== i[o] && (e || (e = {}), e[o] = n[o]);
                    return e
                }(t);
                i && P(t.extendOptions, i), (e = t.options = Nt(n, t.extendOptions)).name && (e.components[e.name] = t)
            }
        }
        return e
    }

    function Sn(t) {
        this._init(t)
    }

    function wn(t) {
        return t && (t.Ctor.options.name || t.tag)
    }

    function kn(t, e) {
        return Array.isArray(t) ? t.indexOf(e) > -1 : "string" == typeof t ? t.split(",").indexOf(e) > -1 : (n = t, "[object RegExp]" === r.call(n) && t.test(e));
        var n
    }

    function xn(t, e) {
        var n = t.cache,
            i = t.keys,
            o = t._vnode;
        for (var s in n) {
            var r = n[s];
            if (r) {
                var a = wn(r.componentOptions);
                a && !e(a) && Tn(n, s, i, o)
            }
        }
    }

    function Tn(t, e, n, i) {
        var o = t[e];
        !o || i && o.tag === i.tag || o.componentInstance.$destroy(), t[e] = null, v(n, e)
    }
    Sn.prototype._init = function(e) {
            var n = this;
            n._uid = yn++, n._isVue = !0, e && e._isComponent ? function(t, e) {
                    var n = t.$options = Object.create(t.constructor.options),
                        i = e._parentVnode;
                    n.parent = e.parent, n._parentVnode = i;
                    var o = i.componentOptions;
                    n.propsData = o.propsData, n._parentListeners = o.listeners, n._renderChildren = o.children, n._componentTag = o.tag, e.render && (n.render = e.render, n.staticRenderFns = e.staticRenderFns)
                }(n, e) : n.$options = Nt(Cn(n.constructor), e || {}, n), n._renderProxy = n, n._self = n,
                function(t) {
                    var e = t.$options,
                        n = e.parent;
                    if (n && !e.abstract) {
                        for (; n.$options.abstract && n.$parent;) n = n.$parent;
                        n.$children.push(t)
                    }
                    t.$parent = n, t.$root = n ? n.$root : t, t.$children = [], t.$refs = {}, t._watcher = null, t._inactive = null, t._directInactive = !1, t._isMounted = !1, t._isDestroyed = !1, t._isBeingDestroyed = !1
                }(n),
                function(t) {
                    t._events = Object.create(null), t._hasHookEvent = !1;
                    var e = t.$options._parentListeners;
                    e && ze(t, e)
                }(n),
                function(e) {
                    e._vnode = null, e._staticTrees = null;
                    var n = e.$options,
                        i = e.$vnode = n._parentVnode,
                        o = i && i.context;
                    e.$slots = ce(n._renderChildren, o), e.$scopedSlots = t, e._c = function(t, n, i, o) {
                        return Ve(e, t, n, i, o, !1)
                    }, e.$createElement = function(t, n, i, o) {
                        return Ve(e, t, n, i, o, !0)
                    };
                    var s = i && i.data;
                    xt(e, "$attrs", s && s.attrs || t, null, !0), xt(e, "$listeners", n._parentListeners || t, null, !0)
                }(n), Ze(n, "beforeCreate"),
                function(t) {
                    var e = le(t.$options.inject, t);
                    e && (St(!1), Object.keys(e).forEach(function(n) {
                        xt(t, n, e[n])
                    }), St(!0))
                }(n),
                function(t) {
                    t._watchers = [];
                    var e = t.$options;
                    e.props && function(t, e) {
                        var n = t.$options.propsData || {},
                            i = t._props = {},
                            o = t.$options._propKeys = [];
                        t.$parent && St(!1);
                        var s = function(s) {
                            o.push(s);
                            var r = Dt(s, e, n, t);
                            xt(i, s, r), s in t || mn(t, "_props", s)
                        };
                        for (var r in e) s(r);
                        St(!0)
                    }(t, e.props), e.methods && function(t, e) {
                        for (var n in t.$options.props, e) t[n] = "function" != typeof e[n] ? E : x(e[n], t)
                    }(t, e.methods), e.data ? function(t) {
                        var e = t.$options.data;
                        a(e = t._data = "function" == typeof e ? function(t, e) {
                            dt();
                            try {
                                return t.call(e, e)
                            } catch (t) {
                                return $t(t, e, "data()"), {}
                            } finally {
                                ut()
                            }
                        }(e, t) : e || {}) || (e = {});
                        for (var n, i = Object.keys(e), o = t.$options.props, s = (t.$options.methods, i.length); s--;) {
                            var r = i[s];
                            o && g(o, r) || 36 !== (n = (r + "").charCodeAt(0)) && 95 !== n && mn(t, "_data", r)
                        }
                        kt(e, !0)
                    }(t) : kt(t._data = {}, !0), e.computed && function(t, e) {
                        var n = t._computedWatchers = Object.create(null),
                            i = et();
                        for (var o in e) {
                            var s = e[o],
                                r = "function" == typeof s ? s : s.get;
                            i || (n[o] = new un(t, r || E, E, hn)), o in t || vn(t, o, s)
                        }
                    }(t, e.computed), e.watch && e.watch !== Z && function(t, e) {
                        for (var n in e) {
                            var i = e[n];
                            if (Array.isArray(i))
                                for (var o = 0; o < i.length; o++) bn(t, n, i[o]);
                            else bn(t, n, i)
                        }
                    }(t, e.watch)
                }(n),
                function(t) {
                    var e = t.$options.provide;
                    e && (t._provided = "function" == typeof e ? e.call(t) : e)
                }(n), Ze(n, "created"), n.$options.el && n.$mount(n.$options.el)
        },
        function(t) {
            Object.defineProperty(t.prototype, "$data", {
                get: function() {
                    return this._data
                }
            }), Object.defineProperty(t.prototype, "$props", {
                get: function() {
                    return this._props
                }
            }), t.prototype.$set = Tt, t.prototype.$delete = Pt, t.prototype.$watch = function(t, e, n) {
                if (a(e)) return bn(this, t, e, n);
                (n = n || {}).user = !0;
                var i = new un(this, t, e, n);
                if (n.immediate) try {
                    e.call(this, i.value)
                } catch (t) {
                    $t(t, this, 'callback for immediate watcher "' + i.expression + '"')
                }
                return function() {
                    i.teardown()
                }
            }
        }(Sn),
        function(t) {
            var e = /^hook:/;
            t.prototype.$on = function(t, n) {
                var i = this;
                if (Array.isArray(t))
                    for (var o = 0, s = t.length; o < s; o++) i.$on(t[o], n);
                else(i._events[t] || (i._events[t] = [])).push(n), e.test(t) && (i._hasHookEvent = !0);
                return i
            }, t.prototype.$once = function(t, e) {
                var n = this;

                function i() {
                    n.$off(t, i), e.apply(n, arguments)
                }
                return i.fn = e, n.$on(t, i), n
            }, t.prototype.$off = function(t, e) {
                var n = this;
                if (!arguments.length) return n._events = Object.create(null), n;
                if (Array.isArray(t)) {
                    for (var i = 0, o = t.length; i < o; i++) n.$off(t[i], e);
                    return n
                }
                var s, r = n._events[t];
                if (!r) return n;
                if (!e) return n._events[t] = null, n;
                for (var a = r.length; a--;)
                    if ((s = r[a]) === e || s.fn === e) {
                        r.splice(a, 1);
                        break
                    } return n
            }, t.prototype.$emit = function(t) {
                var e = this._events[t];
                if (e) {
                    e = e.length > 1 ? T(e) : e;
                    for (var n = T(arguments, 1), i = 'event handler for "' + t + '"', o = 0, s = e.length; o < s; o++) Mt(e[o], this, n, this, i)
                }
                return this
            }
        }(Sn),
        function(t) {
            t.prototype._update = function(t, e) {
                var n = this,
                    i = n.$el,
                    o = n._vnode,
                    s = Ke(n);
                n._vnode = t, n.$el = o ? n.__patch__(o, t) : n.__patch__(n.$el, t, e, !1), s(), i && (i.__vue__ = null), n.$el && (n.$el.__vue__ = n), n.$vnode && n.$parent && n.$vnode === n.$parent._vnode && (n.$parent.$el = n.$el)
            }, t.prototype.$forceUpdate = function() {
                this._watcher && this._watcher.update()
            }, t.prototype.$destroy = function() {
                var t = this;
                if (!t._isBeingDestroyed) {
                    Ze(t, "beforeDestroy"), t._isBeingDestroyed = !0;
                    var e = t.$parent;
                    !e || e._isBeingDestroyed || t.$options.abstract || v(e.$children, t), t._watcher && t._watcher.teardown();
                    for (var n = t._watchers.length; n--;) t._watchers[n].teardown();
                    t._data.__ob__ && t._data.__ob__.vmCount--, t._isDestroyed = !0, t.__patch__(t._vnode, null), Ze(t, "destroyed"), t.$off(), t.$el && (t.$el.__vue__ = null), t.$vnode && (t.$vnode.parent = null)
                }
            }
        }(Sn),
        function(t) {
            Ee(t.prototype), t.prototype.$nextTick = function(t) {
                return Zt(t, this)
            }, t.prototype._render = function() {
                var t, e = this,
                    n = e.$options,
                    i = n.render,
                    o = n._parentVnode;
                o && (e.$scopedSlots = ue(o.data.scopedSlots, e.$slots, e.$scopedSlots)), e.$vnode = o;
                try {
                    Me = e, t = i.call(e._renderProxy, e.$createElement)
                } catch (n) {
                    $t(n, e, "render"), t = e._vnode
                } finally {
                    Me = null
                }
                return Array.isArray(t) && 1 === t.length && (t = t[0]), t instanceof pt || (t = ht()), t.parent = o, t
            }
        }(Sn);
    var Pn = [String, RegExp, Array],
        In = {
            KeepAlive: {
                name: "keep-alive",
                abstract: !0,
                props: {
                    include: Pn,
                    exclude: Pn,
                    max: [String, Number]
                },
                created: function() {
                    this.cache = Object.create(null), this.keys = []
                },
                destroyed: function() {
                    for (var t in this.cache) Tn(this.cache, t, this.keys)
                },
                mounted: function() {
                    var t = this;
                    this.$watch("include", function(e) {
                        xn(t, function(t) {
                            return kn(e, t)
                        })
                    }), this.$watch("exclude", function(e) {
                        xn(t, function(t) {
                            return !kn(e, t)
                        })
                    })
                },
                render: function() {
                    var t = this.$slots.default,
                        e = je(t),
                        n = e && e.componentOptions;
                    if (n) {
                        var i = wn(n),
                            o = this.include,
                            s = this.exclude;
                        if (o && (!i || !kn(o, i)) || s && i && kn(s, i)) return e;
                        var r = this.cache,
                            a = this.keys,
                            l = null == e.key ? n.Ctor.cid + (n.tag ? "::" + n.tag : "") : e.key;
                        r[l] ? (e.componentInstance = r[l].componentInstance, v(a, l), a.push(l)) : (r[l] = e, a.push(l), this.max && a.length > parseInt(this.max) && Tn(r, a[0], a, this._vnode)), e.data.keepAlive = !0
                    }
                    return e || t && t[0]
                }
            }
        };
    ! function(t) {
        var e = {
            get: function() {
                return B
            }
        };
        Object.defineProperty(t, "config", e), t.util = {
                warn: rt,
                extend: P,
                mergeOptions: Nt,
                defineReactive: xt
            }, t.set = Tt, t.delete = Pt, t.nextTick = Zt, t.observable = function(t) {
                return kt(t), t
            }, t.options = Object.create(null), D.forEach(function(e) {
                t.options[e + "s"] = Object.create(null)
            }), t.options._base = t, P(t.options.components, In),
            function(t) {
                t.use = function(t) {
                    var e = this._installedPlugins || (this._installedPlugins = []);
                    if (e.indexOf(t) > -1) return this;
                    var n = T(arguments, 1);
                    return n.unshift(this), "function" == typeof t.install ? t.install.apply(t, n) : "function" == typeof t && t.apply(null, n), e.push(t), this
                }
            }(t),
            function(t) {
                t.mixin = function(t) {
                    return this.options = Nt(this.options, t), this
                }
            }(t),
            function(t) {
                t.cid = 0;
                var e = 1;
                t.extend = function(t) {
                    t = t || {};
                    var n = this,
                        i = n.cid,
                        o = t._Ctor || (t._Ctor = {});
                    if (o[i]) return o[i];
                    var s = t.name || n.options.name,
                        r = function(t) {
                            this._init(t)
                        };
                    return (r.prototype = Object.create(n.prototype)).constructor = r, r.cid = e++, r.options = Nt(n.options, t), r.super = n, r.options.props && function(t) {
                        var e = t.options.props;
                        for (var n in e) mn(t.prototype, "_props", n)
                    }(r), r.options.computed && function(t) {
                        var e = t.options.computed;
                        for (var n in e) vn(t.prototype, n, e[n])
                    }(r), r.extend = n.extend, r.mixin = n.mixin, r.use = n.use, D.forEach(function(t) {
                        r[t] = n[t]
                    }), s && (r.options.components[s] = r), r.superOptions = n.options, r.extendOptions = t, r.sealedOptions = P({}, r.options), o[i] = r, r
                }
            }(t),
            function(t) {
                D.forEach(function(e) {
                    t[e] = function(t, n) {
                        return n ? ("component" === e && a(n) && (n.name = n.name || t, n = this.options._base.extend(n)), "directive" === e && "function" == typeof n && (n = {
                            bind: n,
                            update: n
                        }), this.options[e + "s"][t] = n, n) : this.options[e + "s"][t]
                    }
                })
            }(t)
    }(Sn), Object.defineProperty(Sn.prototype, "$isServer", {
        get: et
    }), Object.defineProperty(Sn.prototype, "$ssrContext", {
        get: function() {
            return this.$vnode && this.$vnode.ssrContext
        }
    }), Object.defineProperty(Sn, "FunctionalRenderContext", {
        value: Ae
    }), Sn.version = "2.6.10";
    var En = p("style,class"),
        An = p("input,textarea,option,select,progress"),
        Fn = function(t, e, n) {
            return "value" === n && An(t) && "button" !== e || "selected" === n && "option" === t || "checked" === n && "input" === t || "muted" === n && "video" === t
        },
        Ln = p("contenteditable,draggable,spellcheck"),
        Gn = p("events,caret,typing,plaintext-only"),
        Nn = function(t, e) {
            return Vn(e) || "false" === e ? "false" : "contenteditable" === t && Gn(e) ? e : "true"
        },
        On = p("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
        Dn = "http://www.w3.org/1999/xlink",
        _n = function(t) {
            return ":" === t.charAt(5) && "xlink" === t.slice(0, 5)
        },
        Bn = function(t) {
            return _n(t) ? t.slice(6, t.length) : ""
        },
        Vn = function(t) {
            return null == t || !1 === t
        };

    function $n(t, e) {
        return {
            staticClass: Mn(t.staticClass, e.staticClass),
            class: n(t.class) ? [t.class, e.class] : e.class
        }
    }

    function Mn(t, e) {
        return t ? e ? t + " " + e : t : e || ""
    }

    function Wn(t) {
        return Array.isArray(t) ? function(t) {
            for (var e, i = "", o = 0, s = t.length; o < s; o++) n(e = Wn(t[o])) && "" !== e && (i && (i += " "), i += e);
            return i
        }(t) : s(t) ? function(t) {
            var e = "";
            for (var n in t) t[n] && (e && (e += " "), e += n);
            return e
        }(t) : "string" == typeof t ? t : ""
    }
    var Rn = {
            svg: "http://www.w3.org/2000/svg",
            math: "http://www.w3.org/1998/Math/MathML"
        },
        jn = p("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),
        qn = p("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
        Hn = function(t) {
            return jn(t) || qn(t)
        };

    function Un(t) {
        return qn(t) ? "svg" : "math" === t ? "math" : void 0
    }
    var zn = Object.create(null),
        Qn = p("text,number,password,search,email,tel,url");

    function Kn(t) {
        return "string" == typeof t ? document.querySelector(t) || document.createElement("div") : t
    }
    var Yn = Object.freeze({
            createElement: function(t, e) {
                var n = document.createElement(t);
                return "select" !== t ? n : (e.data && e.data.attrs && void 0 !== e.data.attrs.multiple && n.setAttribute("multiple", "multiple"), n)
            },
            createElementNS: function(t, e) {
                return document.createElementNS(Rn[t], e)
            },
            createTextNode: function(t) {
                return document.createTextNode(t)
            },
            createComment: function(t) {
                return document.createComment(t)
            },
            insertBefore: function(t, e, n) {
                t.insertBefore(e, n)
            },
            removeChild: function(t, e) {
                t.removeChild(e)
            },
            appendChild: function(t, e) {
                t.appendChild(e)
            },
            parentNode: function(t) {
                return t.parentNode
            },
            nextSibling: function(t) {
                return t.nextSibling
            },
            tagName: function(t) {
                return t.tagName
            },
            setTextContent: function(t, e) {
                t.textContent = e
            },
            setStyleScope: function(t, e) {
                t.setAttribute(e, "")
            }
        }),
        Xn = {
            create: function(t, e) {
                Zn(e)
            },
            update: function(t, e) {
                t.data.ref !== e.data.ref && (Zn(t, !0), Zn(e))
            },
            destroy: function(t) {
                Zn(t, !0)
            }
        };

    function Zn(t, e) {
        var i = t.data.ref;
        if (n(i)) {
            var o = t.context,
                s = t.componentInstance || t.elm,
                r = o.$refs;
            e ? Array.isArray(r[i]) ? v(r[i], s) : r[i] === s && (r[i] = void 0) : t.data.refInFor ? Array.isArray(r[i]) ? r[i].indexOf(s) < 0 && r[i].push(s) : r[i] = [s] : r[i] = s
        }
    }
    var Jn = new pt("", {}, []),
        ti = ["create", "activate", "update", "remove", "destroy"];

    function ei(t, o) {
        return t.key === o.key && (t.tag === o.tag && t.isComment === o.isComment && n(t.data) === n(o.data) && function(t, e) {
            if ("input" !== t.tag) return !0;
            var i, o = n(i = t.data) && n(i = i.attrs) && i.type,
                s = n(i = e.data) && n(i = i.attrs) && i.type;
            return o === s || Qn(o) && Qn(s)
        }(t, o) || i(t.isAsyncPlaceholder) && t.asyncFactory === o.asyncFactory && e(o.asyncFactory.error))
    }

    function ni(t, e, i) {
        var o, s, r = {};
        for (o = e; o <= i; ++o) n(s = t[o].key) && (r[s] = o);
        return r
    }
    var ii = {
        create: oi,
        update: oi,
        destroy: function(t) {
            oi(t, Jn)
        }
    };

    function oi(t, e) {
        (t.data.directives || e.data.directives) && function(t, e) {
            var n, i, o, s = t === Jn,
                r = e === Jn,
                a = ri(t.data.directives, t.context),
                l = ri(e.data.directives, e.context),
                c = [],
                d = [];
            for (n in l) i = a[n], o = l[n], i ? (o.oldValue = i.value, o.oldArg = i.arg, li(o, "update", e, t), o.def && o.def.componentUpdated && d.push(o)) : (li(o, "bind", e, t), o.def && o.def.inserted && c.push(o));
            if (c.length) {
                var u = function() {
                    for (var n = 0; n < c.length; n++) li(c[n], "inserted", e, t)
                };
                s ? oe(e, "insert", u) : u()
            }
            if (d.length && oe(e, "postpatch", function() {
                    for (var n = 0; n < d.length; n++) li(d[n], "componentUpdated", e, t)
                }), !s)
                for (n in a) l[n] || li(a[n], "unbind", t, t, r)
        }(t, e)
    }
    var si = Object.create(null);

    function ri(t, e) {
        var n, i, o = Object.create(null);
        if (!t) return o;
        for (n = 0; n < t.length; n++)(i = t[n]).modifiers || (i.modifiers = si), o[ai(i)] = i, i.def = Ot(e.$options, "directives", i.name);
        return o
    }

    function ai(t) {
        return t.rawName || t.name + "." + Object.keys(t.modifiers || {}).join(".")
    }

    function li(t, e, n, i, o) {
        var s = t.def && t.def[e];
        if (s) try {
            s(n.elm, t, n, i, o)
        } catch (i) {
            $t(i, n.context, "directive " + t.name + " " + e + " hook")
        }
    }
    var ci = [Xn, ii];

    function di(t, i) {
        var o = i.componentOptions;
        if (!(n(o) && !1 === o.Ctor.options.inheritAttrs || e(t.data.attrs) && e(i.data.attrs))) {
            var s, r, a = i.elm,
                l = t.data.attrs || {},
                c = i.data.attrs || {};
            for (s in n(c.__ob__) && (c = i.data.attrs = P({}, c)), c) r = c[s], l[s] !== r && ui(a, s, r);
            for (s in (z || K) && c.value !== l.value && ui(a, "value", c.value), l) e(c[s]) && (_n(s) ? a.removeAttributeNS(Dn, Bn(s)) : Ln(s) || a.removeAttribute(s))
        }
    }

    function ui(t, e, n) {
        t.tagName.indexOf("-") > -1 ? pi(t, e, n) : On(e) ? Vn(n) ? t.removeAttribute(e) : (n = "allowfullscreen" === e && "EMBED" === t.tagName ? "true" : e, t.setAttribute(e, n)) : Ln(e) ? t.setAttribute(e, Nn(e, n)) : _n(e) ? Vn(n) ? t.removeAttributeNS(Dn, Bn(e)) : t.setAttributeNS(Dn, e, n) : pi(t, e, n)
    }

    function pi(t, e, n) {
        if (Vn(n)) t.removeAttribute(e);
        else {
            if (z && !Q && "TEXTAREA" === t.tagName && "placeholder" === e && "" !== n && !t.__ieph) {
                var i = function(e) {
                    e.stopImmediatePropagation(), t.removeEventListener("input", i)
                };
                t.addEventListener("input", i), t.__ieph = !0
            }
            t.setAttribute(e, n)
        }
    }
    var mi = {
        create: di,
        update: di
    };

    function hi(t, i) {
        var o = i.elm,
            s = i.data,
            r = t.data;
        if (!(e(s.staticClass) && e(s.class) && (e(r) || e(r.staticClass) && e(r.class)))) {
            var a = function(t) {
                    for (var e = t.data, i = t, o = t; n(o.componentInstance);)(o = o.componentInstance._vnode) && o.data && (e = $n(o.data, e));
                    for (; n(i = i.parent);) i && i.data && (e = $n(e, i.data));
                    return function(t, e) {
                        return n(t) || n(e) ? Mn(t, Wn(e)) : ""
                    }(e.staticClass, e.class)
                }(i),
                l = o._transitionClasses;
            n(l) && (a = Mn(a, Wn(l))), a !== o._prevClass && (o.setAttribute("class", a), o._prevClass = a)
        }
    }
    var vi, fi, gi, bi, yi, Ci, Si = {
            create: hi,
            update: hi
        },
        wi = /[\w).+\-_$\]]/;

    function ki(t) {
        var e, n, i, o, s, r = !1,
            a = !1,
            l = !1,
            c = !1,
            d = 0,
            u = 0,
            p = 0,
            m = 0;
        for (i = 0; i < t.length; i++)
            if (n = e, e = t.charCodeAt(i), r) 39 === e && 92 !== n && (r = !1);
            else if (a) 34 === e && 92 !== n && (a = !1);
        else if (l) 96 === e && 92 !== n && (l = !1);
        else if (c) 47 === e && 92 !== n && (c = !1);
        else if (124 !== e || 124 === t.charCodeAt(i + 1) || 124 === t.charCodeAt(i - 1) || d || u || p) {
            switch (e) {
                case 34:
                    a = !0;
                    break;
                case 39:
                    r = !0;
                    break;
                case 96:
                    l = !0;
                    break;
                case 40:
                    p++;
                    break;
                case 41:
                    p--;
                    break;
                case 91:
                    u++;
                    break;
                case 93:
                    u--;
                    break;
                case 123:
                    d++;
                    break;
                case 125:
                    d--
            }
            if (47 === e) {
                for (var h = i - 1, v = void 0; h >= 0 && " " === (v = t.charAt(h)); h--);
                v && wi.test(v) || (c = !0)
            }
        } else void 0 === o ? (m = i + 1, o = t.slice(0, i).trim()) : f();

        function f() {
            (s || (s = [])).push(t.slice(m, i).trim()), m = i + 1
        }
        if (void 0 === o ? o = t.slice(0, i).trim() : 0 !== m && f(), s)
            for (i = 0; i < s.length; i++) o = xi(o, s[i]);
        return o
    }

    function xi(t, e) {
        var n = e.indexOf("(");
        if (n < 0) return '_f("' + e + '")(' + t + ")";
        var i = e.slice(0, n),
            o = e.slice(n + 1);
        return '_f("' + i + '")(' + t + (")" !== o ? "," + o : o)
    }

    function Ti(t, e) {
        console.error("[Vue compiler]: " + t)
    }

    function Pi(t, e) {
        return t ? t.map(function(t) {
            return t[e]
        }).filter(function(t) {
            return t
        }) : []
    }

    function Ii(t, e, n, i, o) {
        (t.props || (t.props = [])).push(_i({
            name: e,
            value: n,
            dynamic: o
        }, i)), t.plain = !1
    }

    function Ei(t, e, n, i, o) {
        (o ? t.dynamicAttrs || (t.dynamicAttrs = []) : t.attrs || (t.attrs = [])).push(_i({
            name: e,
            value: n,
            dynamic: o
        }, i)), t.plain = !1
    }

    function Ai(t, e, n, i) {
        t.attrsMap[e] = n, t.attrsList.push(_i({
            name: e,
            value: n
        }, i))
    }

    function Fi(t, e, n, i, o, s, r, a) {
        (t.directives || (t.directives = [])).push(_i({
            name: e,
            rawName: n,
            value: i,
            arg: o,
            isDynamicArg: s,
            modifiers: r
        }, a)), t.plain = !1
    }

    function Li(t, e, n) {
        return n ? "_p(" + e + ',"' + t + '")' : t + e
    }

    function Gi(e, n, i, o, s, r, a, l) {
        var c;
        (o = o || t).right ? l ? n = "(" + n + ")==='click'?'contextmenu':(" + n + ")" : "click" === n && (n = "contextmenu", delete o.right) : o.middle && (l ? n = "(" + n + ")==='click'?'mouseup':(" + n + ")" : "click" === n && (n = "mouseup")), o.capture && (delete o.capture, n = Li("!", n, l)), o.once && (delete o.once, n = Li("~", n, l)), o.passive && (delete o.passive, n = Li("&", n, l)), o.native ? (delete o.native, c = e.nativeEvents || (e.nativeEvents = {})) : c = e.events || (e.events = {});
        var d = _i({
            value: i.trim(),
            dynamic: l
        }, a);
        o !== t && (d.modifiers = o);
        var u = c[n];
        Array.isArray(u) ? s ? u.unshift(d) : u.push(d) : c[n] = u ? s ? [d, u] : [u, d] : d, e.plain = !1
    }

    function Ni(t, e, n) {
        var i = Oi(t, ":" + e) || Oi(t, "v-bind:" + e);
        if (null != i) return ki(i);
        if (!1 !== n) {
            var o = Oi(t, e);
            if (null != o) return JSON.stringify(o)
        }
    }

    function Oi(t, e, n) {
        var i;
        if (null != (i = t.attrsMap[e]))
            for (var o = t.attrsList, s = 0, r = o.length; s < r; s++)
                if (o[s].name === e) {
                    o.splice(s, 1);
                    break
                } return n && delete t.attrsMap[e], i
    }

    function Di(t, e) {
        for (var n = t.attrsList, i = 0, o = n.length; i < o; i++) {
            var s = n[i];
            if (e.test(s.name)) return n.splice(i, 1), s
        }
    }

    function _i(t, e) {
        return e && (null != e.start && (t.start = e.start), null != e.end && (t.end = e.end)), t
    }

    function Bi(t, e, n) {
        var i = n || {},
            o = i.number,
            s = "$$v";
        i.trim && (s = "(typeof $$v === 'string'? $$v.trim(): $$v)"), o && (s = "_n(" + s + ")");
        var r = Vi(e, s);
        t.model = {
            value: "(" + e + ")",
            expression: JSON.stringify(e),
            callback: "function ($$v) {" + r + "}"
        }
    }

    function Vi(t, e) {
        var n = function(t) {
            if (t = t.trim(), vi = t.length, t.indexOf("[") < 0 || t.lastIndexOf("]") < vi - 1) return (bi = t.lastIndexOf(".")) > -1 ? {
                exp: t.slice(0, bi),
                key: '"' + t.slice(bi + 1) + '"'
            } : {
                exp: t,
                key: null
            };
            for (fi = t, bi = yi = Ci = 0; !Mi();) Wi(gi = $i()) ? ji(gi) : 91 === gi && Ri(gi);
            return {
                exp: t.slice(0, yi),
                key: t.slice(yi + 1, Ci)
            }
        }(t);
        return null === n.key ? t + "=" + e : "$set(" + n.exp + ", " + n.key + ", " + e + ")"
    }

    function $i() {
        return fi.charCodeAt(++bi)
    }

    function Mi() {
        return bi >= vi
    }

    function Wi(t) {
        return 34 === t || 39 === t
    }

    function Ri(t) {
        var e = 1;
        for (yi = bi; !Mi();)
            if (Wi(t = $i())) ji(t);
            else if (91 === t && e++, 93 === t && e--, 0 === e) {
            Ci = bi;
            break
        }
    }

    function ji(t) {
        for (var e = t; !Mi() && (t = $i()) !== e;);
    }
    var qi, Hi = "__r",
        Ui = "__c";

    function zi(t, e, n) {
        var i = qi;
        return function o() {
            null !== e.apply(null, arguments) && Yi(t, o, n, i)
        }
    }
    var Qi = qt && !(X && Number(X[1]) <= 53);

    function Ki(t, e, n, i) {
        if (Qi) {
            var o = rn,
                s = e;
            e = s._wrapper = function(t) {
                if (t.target === t.currentTarget || t.timeStamp >= o || t.timeStamp <= 0 || t.target.ownerDocument !== document) return s.apply(this, arguments)
            }
        }
        qi.addEventListener(t, e, J ? {
            capture: n,
            passive: i
        } : n)
    }

    function Yi(t, e, n, i) {
        (i || qi).removeEventListener(t, e._wrapper || e, n)
    }

    function Xi(t, i) {
        if (!e(t.data.on) || !e(i.data.on)) {
            var o = i.data.on || {},
                s = t.data.on || {};
            qi = i.elm,
                function(t) {
                    if (n(t[Hi])) {
                        var e = z ? "change" : "input";
                        t[e] = [].concat(t[Hi], t[e] || []), delete t[Hi]
                    }
                    n(t[Ui]) && (t.change = [].concat(t[Ui], t.change || []), delete t[Ui])
                }(o), ie(o, s, Ki, Yi, zi, i.context), qi = void 0
        }
    }
    var Zi, Ji = {
        create: Xi,
        update: Xi
    };

    function to(t, i) {
        if (!e(t.data.domProps) || !e(i.data.domProps)) {
            var o, s, r = i.elm,
                a = t.data.domProps || {},
                l = i.data.domProps || {};
            for (o in n(l.__ob__) && (l = i.data.domProps = P({}, l)), a) o in l || (r[o] = "");
            for (o in l) {
                if (s = l[o], "textContent" === o || "innerHTML" === o) {
                    if (i.children && (i.children.length = 0), s === a[o]) continue;
                    1 === r.childNodes.length && r.removeChild(r.childNodes[0])
                }
                if ("value" === o && "PROGRESS" !== r.tagName) {
                    r._value = s;
                    var c = e(s) ? "" : String(s);
                    eo(r, c) && (r.value = c)
                } else if ("innerHTML" === o && qn(r.tagName) && e(r.innerHTML)) {
                    (Zi = Zi || document.createElement("div")).innerHTML = "<svg>" + s + "</svg>";
                    for (var d = Zi.firstChild; r.firstChild;) r.removeChild(r.firstChild);
                    for (; d.firstChild;) r.appendChild(d.firstChild)
                } else if (s !== a[o]) try {
                    r[o] = s
                } catch (t) {}
            }
        }
    }

    function eo(t, e) {
        return !t.composing && ("OPTION" === t.tagName || function(t, e) {
            var n = !0;
            try {
                n = document.activeElement !== t
            } catch (t) {}
            return n && t.value !== e
        }(t, e) || function(t, e) {
            var i = t.value,
                o = t._vModifiers;
            if (n(o)) {
                if (o.number) return u(i) !== u(e);
                if (o.trim) return i.trim() !== e.trim()
            }
            return i !== e
        }(t, e))
    }
    var no = {
            create: to,
            update: to
        },
        io = b(function(t) {
            var e = {},
                n = /:(.+)/;
            return t.split(/;(?![^(]*\))/g).forEach(function(t) {
                if (t) {
                    var i = t.split(n);
                    i.length > 1 && (e[i[0].trim()] = i[1].trim())
                }
            }), e
        });

    function oo(t) {
        var e = so(t.style);
        return t.staticStyle ? P(t.staticStyle, e) : e
    }

    function so(t) {
        return Array.isArray(t) ? I(t) : "string" == typeof t ? io(t) : t
    }
    var ro, ao = /^--/,
        lo = /\s*!important$/,
        co = function(t, e, n) {
            if (ao.test(e)) t.style.setProperty(e, n);
            else if (lo.test(n)) t.style.setProperty(k(e), n.replace(lo, ""), "important");
            else {
                var i = po(e);
                if (Array.isArray(n))
                    for (var o = 0, s = n.length; o < s; o++) t.style[i] = n[o];
                else t.style[i] = n
            }
        },
        uo = ["Webkit", "Moz", "ms"],
        po = b(function(t) {
            if (ro = ro || document.createElement("div").style, "filter" !== (t = C(t)) && t in ro) return t;
            for (var e = t.charAt(0).toUpperCase() + t.slice(1), n = 0; n < uo.length; n++) {
                var i = uo[n] + e;
                if (i in ro) return i
            }
        });

    function mo(t, i) {
        var o = i.data,
            s = t.data;
        if (!(e(o.staticStyle) && e(o.style) && e(s.staticStyle) && e(s.style))) {
            var r, a, l = i.elm,
                c = s.staticStyle,
                d = s.normalizedStyle || s.style || {},
                u = c || d,
                p = so(i.data.style) || {};
            i.data.normalizedStyle = n(p.__ob__) ? P({}, p) : p;
            var m = function(t, e) {
                for (var n, i = {}, o = t; o.componentInstance;)(o = o.componentInstance._vnode) && o.data && (n = oo(o.data)) && P(i, n);
                (n = oo(t.data)) && P(i, n);
                for (var s = t; s = s.parent;) s.data && (n = oo(s.data)) && P(i, n);
                return i
            }(i);
            for (a in u) e(m[a]) && co(l, a, "");
            for (a in m)(r = m[a]) !== u[a] && co(l, a, null == r ? "" : r)
        }
    }
    var ho = {
            create: mo,
            update: mo
        },
        vo = /\s+/;

    function fo(t, e) {
        if (e && (e = e.trim()))
            if (t.classList) e.indexOf(" ") > -1 ? e.split(vo).forEach(function(e) {
                return t.classList.add(e)
            }) : t.classList.add(e);
            else {
                var n = " " + (t.getAttribute("class") || "") + " ";
                n.indexOf(" " + e + " ") < 0 && t.setAttribute("class", (n + e).trim())
            }
    }

    function go(t, e) {
        if (e && (e = e.trim()))
            if (t.classList) e.indexOf(" ") > -1 ? e.split(vo).forEach(function(e) {
                return t.classList.remove(e)
            }) : t.classList.remove(e), t.classList.length || t.removeAttribute("class");
            else {
                for (var n = " " + (t.getAttribute("class") || "") + " ", i = " " + e + " "; n.indexOf(i) >= 0;) n = n.replace(i, " ");
                (n = n.trim()) ? t.setAttribute("class", n): t.removeAttribute("class")
            }
    }

    function bo(t) {
        if (t) {
            if ("object" == typeof t) {
                var e = {};
                return !1 !== t.css && P(e, yo(t.name || "v")), P(e, t), e
            }
            return "string" == typeof t ? yo(t) : void 0
        }
    }
    var yo = b(function(t) {
            return {
                enterClass: t + "-enter",
                enterToClass: t + "-enter-to",
                enterActiveClass: t + "-enter-active",
                leaveClass: t + "-leave",
                leaveToClass: t + "-leave-to",
                leaveActiveClass: t + "-leave-active"
            }
        }),
        Co = j && !Q,
        So = "transition",
        wo = "animation",
        ko = "transition",
        xo = "transitionend",
        To = "animation",
        Po = "animationend";
    Co && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (ko = "WebkitTransition", xo = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (To = "WebkitAnimation", Po = "webkitAnimationEnd"));
    var Io = j ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : function(t) {
        return t()
    };

    function Eo(t) {
        Io(function() {
            Io(t)
        })
    }

    function Ao(t, e) {
        var n = t._transitionClasses || (t._transitionClasses = []);
        n.indexOf(e) < 0 && (n.push(e), fo(t, e))
    }

    function Fo(t, e) {
        t._transitionClasses && v(t._transitionClasses, e), go(t, e)
    }

    function Lo(t, e, n) {
        var i = No(t, e),
            o = i.type,
            s = i.timeout,
            r = i.propCount;
        if (!o) return n();
        var a = o === So ? xo : Po,
            l = 0,
            c = function() {
                t.removeEventListener(a, d), n()
            },
            d = function(e) {
                e.target === t && ++l >= r && c()
            };
        setTimeout(function() {
            l < r && c()
        }, s + 1), t.addEventListener(a, d)
    }
    var Go = /\b(transform|all)(,|$)/;

    function No(t, e) {
        var n, i = window.getComputedStyle(t),
            o = (i[ko + "Delay"] || "").split(", "),
            s = (i[ko + "Duration"] || "").split(", "),
            r = Oo(o, s),
            a = (i[To + "Delay"] || "").split(", "),
            l = (i[To + "Duration"] || "").split(", "),
            c = Oo(a, l),
            d = 0,
            u = 0;
        return e === So ? r > 0 && (n = So, d = r, u = s.length) : e === wo ? c > 0 && (n = wo, d = c, u = l.length) : u = (n = (d = Math.max(r, c)) > 0 ? r > c ? So : wo : null) ? n === So ? s.length : l.length : 0, {
            type: n,
            timeout: d,
            propCount: u,
            hasTransform: n === So && Go.test(i[ko + "Property"])
        }
    }

    function Oo(t, e) {
        for (; t.length < e.length;) t = t.concat(t);
        return Math.max.apply(null, e.map(function(e, n) {
            return Do(e) + Do(t[n])
        }))
    }

    function Do(t) {
        return 1e3 * Number(t.slice(0, -1).replace(",", "."))
    }

    function _o(t, i) {
        var o = t.elm;
        n(o._leaveCb) && (o._leaveCb.cancelled = !0, o._leaveCb());
        var r = bo(t.data.transition);
        if (!e(r) && !n(o._enterCb) && 1 === o.nodeType) {
            for (var a = r.css, l = r.type, c = r.enterClass, d = r.enterToClass, p = r.enterActiveClass, m = r.appearClass, h = r.appearToClass, v = r.appearActiveClass, f = r.beforeEnter, g = r.enter, b = r.afterEnter, y = r.enterCancelled, C = r.beforeAppear, S = r.appear, w = r.afterAppear, k = r.appearCancelled, x = r.duration, T = Qe, P = Qe.$vnode; P && P.parent;) T = P.context, P = P.parent;
            var I = !T._isMounted || !t.isRootInsert;
            if (!I || S || "" === S) {
                var E = I && m ? m : c,
                    A = I && v ? v : p,
                    F = I && h ? h : d,
                    L = I && C || f,
                    G = I && "function" == typeof S ? S : g,
                    O = I && w || b,
                    D = I && k || y,
                    _ = u(s(x) ? x.enter : x),
                    B = !1 !== a && !Q,
                    V = $o(G),
                    $ = o._enterCb = N(function() {
                        B && (Fo(o, F), Fo(o, A)), $.cancelled ? (B && Fo(o, E), D && D(o)) : O && O(o), o._enterCb = null
                    });
                t.data.show || oe(t, "insert", function() {
                    var e = o.parentNode,
                        n = e && e._pending && e._pending[t.key];
                    n && n.tag === t.tag && n.elm._leaveCb && n.elm._leaveCb(), G && G(o, $)
                }), L && L(o), B && (Ao(o, E), Ao(o, A), Eo(function() {
                    Fo(o, E), $.cancelled || (Ao(o, F), V || (Vo(_) ? setTimeout($, _) : Lo(o, l, $)))
                })), t.data.show && (i && i(), G && G(o, $)), B || V || $()
            }
        }
    }

    function Bo(t, i) {
        var o = t.elm;
        n(o._enterCb) && (o._enterCb.cancelled = !0, o._enterCb());
        var r = bo(t.data.transition);
        if (e(r) || 1 !== o.nodeType) return i();
        if (!n(o._leaveCb)) {
            var a = r.css,
                l = r.type,
                c = r.leaveClass,
                d = r.leaveToClass,
                p = r.leaveActiveClass,
                m = r.beforeLeave,
                h = r.leave,
                v = r.afterLeave,
                f = r.leaveCancelled,
                g = r.delayLeave,
                b = r.duration,
                y = !1 !== a && !Q,
                C = $o(h),
                S = u(s(b) ? b.leave : b),
                w = o._leaveCb = N(function() {
                    o.parentNode && o.parentNode._pending && (o.parentNode._pending[t.key] = null), y && (Fo(o, d), Fo(o, p)), w.cancelled ? (y && Fo(o, c), f && f(o)) : (i(), v && v(o)), o._leaveCb = null
                });
            g ? g(k) : k()
        }

        function k() {
            w.cancelled || (!t.data.show && o.parentNode && ((o.parentNode._pending || (o.parentNode._pending = {}))[t.key] = t), m && m(o), y && (Ao(o, c), Ao(o, p), Eo(function() {
                Fo(o, c), w.cancelled || (Ao(o, d), C || (Vo(S) ? setTimeout(w, S) : Lo(o, l, w)))
            })), h && h(o, w), y || C || w())
        }
    }

    function Vo(t) {
        return "number" == typeof t && !isNaN(t)
    }

    function $o(t) {
        if (e(t)) return !1;
        var i = t.fns;
        return n(i) ? $o(Array.isArray(i) ? i[0] : i) : (t._length || t.length) > 1
    }

    function Mo(t, e) {
        !0 !== e.data.show && _o(e)
    }
    var Wo = function(t) {
        var s, r, a = {},
            l = t.modules,
            c = t.nodeOps;
        for (s = 0; s < ti.length; ++s)
            for (a[ti[s]] = [], r = 0; r < l.length; ++r) n(l[r][ti[s]]) && a[ti[s]].push(l[r][ti[s]]);

        function d(t) {
            var e = c.parentNode(t);
            n(e) && c.removeChild(e, t)
        }

        function u(t, e, o, s, r, l, d) {
            if (n(t.elm) && n(l) && (t = l[d] = ft(t)), t.isRootInsert = !r, ! function(t, e, o, s) {
                    var r = t.data;
                    if (n(r)) {
                        var l = n(t.componentInstance) && r.keepAlive;
                        if (n(r = r.hook) && n(r = r.init) && r(t, !1), n(t.componentInstance)) return m(t, e), h(o, t.elm, s), i(l) && function(t, e, i, o) {
                            for (var s, r = t; r.componentInstance;)
                                if (n(s = (r = r.componentInstance._vnode).data) && n(s = s.transition)) {
                                    for (s = 0; s < a.activate.length; ++s) a.activate[s](Jn, r);
                                    e.push(r);
                                    break
                                } h(i, t.elm, o)
                        }(t, e, o, s), !0
                    }
                }(t, e, o, s)) {
                var u = t.data,
                    p = t.children,
                    f = t.tag;
                n(f) ? (t.elm = t.ns ? c.createElementNS(t.ns, f) : c.createElement(f, t), b(t), v(t, p, e), n(u) && g(t, e), h(o, t.elm, s)) : i(t.isComment) ? (t.elm = c.createComment(t.text), h(o, t.elm, s)) : (t.elm = c.createTextNode(t.text), h(o, t.elm, s))
            }
        }

        function m(t, e) {
            n(t.data.pendingInsert) && (e.push.apply(e, t.data.pendingInsert), t.data.pendingInsert = null), t.elm = t.componentInstance.$el, f(t) ? (g(t, e), b(t)) : (Zn(t), e.push(t))
        }

        function h(t, e, i) {
            n(t) && (n(i) ? c.parentNode(i) === t && c.insertBefore(t, e, i) : c.appendChild(t, e))
        }

        function v(t, e, n) {
            if (Array.isArray(e))
                for (var i = 0; i < e.length; ++i) u(e[i], n, t.elm, null, !0, e, i);
            else o(t.text) && c.appendChild(t.elm, c.createTextNode(String(t.text)))
        }

        function f(t) {
            for (; t.componentInstance;) t = t.componentInstance._vnode;
            return n(t.tag)
        }

        function g(t, e) {
            for (var i = 0; i < a.create.length; ++i) a.create[i](Jn, t);
            n(s = t.data.hook) && (n(s.create) && s.create(Jn, t), n(s.insert) && e.push(t))
        }

        function b(t) {
            var e;
            if (n(e = t.fnScopeId)) c.setStyleScope(t.elm, e);
            else
                for (var i = t; i;) n(e = i.context) && n(e = e.$options._scopeId) && c.setStyleScope(t.elm, e), i = i.parent;
            n(e = Qe) && e !== t.context && e !== t.fnContext && n(e = e.$options._scopeId) && c.setStyleScope(t.elm, e)
        }

        function y(t, e, n, i, o, s) {
            for (; i <= o; ++i) u(n[i], s, t, e, !1, n, i)
        }

        function C(t) {
            var e, i, o = t.data;
            if (n(o))
                for (n(e = o.hook) && n(e = e.destroy) && e(t), e = 0; e < a.destroy.length; ++e) a.destroy[e](t);
            if (n(e = t.children))
                for (i = 0; i < t.children.length; ++i) C(t.children[i])
        }

        function S(t, e, i, o) {
            for (; i <= o; ++i) {
                var s = e[i];
                n(s) && (n(s.tag) ? (w(s), C(s)) : d(s.elm))
            }
        }

        function w(t, e) {
            if (n(e) || n(t.data)) {
                var i, o = a.remove.length + 1;
                for (n(e) ? e.listeners += o : e = function(t, e) {
                        function n() {
                            0 == --n.listeners && d(t)
                        }
                        return n.listeners = e, n
                    }(t.elm, o), n(i = t.componentInstance) && n(i = i._vnode) && n(i.data) && w(i, e), i = 0; i < a.remove.length; ++i) a.remove[i](t, e);
                n(i = t.data.hook) && n(i = i.remove) ? i(t, e) : e()
            } else d(t.elm)
        }

        function k(t, e, i, o) {
            for (var s = i; s < o; s++) {
                var r = e[s];
                if (n(r) && ei(t, r)) return s
            }
        }

        function x(t, o, s, r, l, d) {
            if (t !== o) {
                n(o.elm) && n(r) && (o = r[l] = ft(o));
                var p = o.elm = t.elm;
                if (i(t.isAsyncPlaceholder)) n(o.asyncFactory.resolved) ? I(t.elm, o, s) : o.isAsyncPlaceholder = !0;
                else if (i(o.isStatic) && i(t.isStatic) && o.key === t.key && (i(o.isCloned) || i(o.isOnce))) o.componentInstance = t.componentInstance;
                else {
                    var m, h = o.data;
                    n(h) && n(m = h.hook) && n(m = m.prepatch) && m(t, o);
                    var v = t.children,
                        g = o.children;
                    if (n(h) && f(o)) {
                        for (m = 0; m < a.update.length; ++m) a.update[m](t, o);
                        n(m = h.hook) && n(m = m.update) && m(t, o)
                    }
                    e(o.text) ? n(v) && n(g) ? v !== g && function(t, i, o, s, r) {
                        for (var a, l, d, p = 0, m = 0, h = i.length - 1, v = i[0], f = i[h], g = o.length - 1, b = o[0], C = o[g], w = !r; p <= h && m <= g;) e(v) ? v = i[++p] : e(f) ? f = i[--h] : ei(v, b) ? (x(v, b, s, o, m), v = i[++p], b = o[++m]) : ei(f, C) ? (x(f, C, s, o, g), f = i[--h], C = o[--g]) : ei(v, C) ? (x(v, C, s, o, g), w && c.insertBefore(t, v.elm, c.nextSibling(f.elm)), v = i[++p], C = o[--g]) : ei(f, b) ? (x(f, b, s, o, m), w && c.insertBefore(t, f.elm, v.elm), f = i[--h], b = o[++m]) : (e(a) && (a = ni(i, p, h)), e(l = n(b.key) ? a[b.key] : k(b, i, p, h)) ? u(b, s, t, v.elm, !1, o, m) : ei(d = i[l], b) ? (x(d, b, s, o, m), i[l] = void 0, w && c.insertBefore(t, d.elm, v.elm)) : u(b, s, t, v.elm, !1, o, m), b = o[++m]);
                        p > h ? y(t, e(o[g + 1]) ? null : o[g + 1].elm, o, m, g, s) : m > g && S(0, i, p, h)
                    }(p, v, g, s, d) : n(g) ? (n(t.text) && c.setTextContent(p, ""), y(p, null, g, 0, g.length - 1, s)) : n(v) ? S(0, v, 0, v.length - 1) : n(t.text) && c.setTextContent(p, "") : t.text !== o.text && c.setTextContent(p, o.text), n(h) && n(m = h.hook) && n(m = m.postpatch) && m(t, o)
                }
            }
        }

        function T(t, e, o) {
            if (i(o) && n(t.parent)) t.parent.data.pendingInsert = e;
            else
                for (var s = 0; s < e.length; ++s) e[s].data.hook.insert(e[s])
        }
        var P = p("attrs,class,staticClass,staticStyle,key");

        function I(t, e, o, s) {
            var r, a = e.tag,
                l = e.data,
                c = e.children;
            if (s = s || l && l.pre, e.elm = t, i(e.isComment) && n(e.asyncFactory)) return e.isAsyncPlaceholder = !0, !0;
            if (n(l) && (n(r = l.hook) && n(r = r.init) && r(e, !0), n(r = e.componentInstance))) return m(e, o), !0;
            if (n(a)) {
                if (n(c))
                    if (t.hasChildNodes())
                        if (n(r = l) && n(r = r.domProps) && n(r = r.innerHTML)) {
                            if (r !== t.innerHTML) return !1
                        } else {
                            for (var d = !0, u = t.firstChild, p = 0; p < c.length; p++) {
                                if (!u || !I(u, c[p], o, s)) {
                                    d = !1;
                                    break
                                }
                                u = u.nextSibling
                            }
                            if (!d || u) return !1
                        }
                else v(e, c, o);
                if (n(l)) {
                    var h = !1;
                    for (var f in l)
                        if (!P(f)) {
                            h = !0, g(e, o);
                            break
                        }! h && l.class && te(l.class)
                }
            } else t.data !== e.text && (t.data = e.text);
            return !0
        }
        return function(t, o, s, r) {
            if (!e(o)) {
                var l, d = !1,
                    p = [];
                if (e(t)) d = !0, u(o, p);
                else {
                    var m = n(t.nodeType);
                    if (!m && ei(t, o)) x(t, o, p, null, null, r);
                    else {
                        if (m) {
                            if (1 === t.nodeType && t.hasAttribute(O) && (t.removeAttribute(O), s = !0), i(s) && I(t, o, p)) return T(o, p, !0), t;
                            l = t, t = new pt(c.tagName(l).toLowerCase(), {}, [], void 0, l)
                        }
                        var h = t.elm,
                            v = c.parentNode(h);
                        if (u(o, p, h._leaveCb ? null : v, c.nextSibling(h)), n(o.parent))
                            for (var g = o.parent, b = f(o); g;) {
                                for (var y = 0; y < a.destroy.length; ++y) a.destroy[y](g);
                                if (g.elm = o.elm, b) {
                                    for (var w = 0; w < a.create.length; ++w) a.create[w](Jn, g);
                                    var k = g.data.hook.insert;
                                    if (k.merged)
                                        for (var P = 1; P < k.fns.length; P++) k.fns[P]()
                                } else Zn(g);
                                g = g.parent
                            }
                        n(v) ? S(0, [t], 0, 0) : n(t.tag) && C(t)
                    }
                }
                return T(o, p, d), o.elm
            }
            n(t) && C(t)
        }
    }({
        nodeOps: Yn,
        modules: [mi, Si, Ji, no, ho, j ? {
            create: Mo,
            activate: Mo,
            remove: function(t, e) {
                !0 !== t.data.show ? Bo(t, e) : e()
            }
        } : {}].concat(ci)
    });
    Q && document.addEventListener("selectionchange", function() {
        var t = document.activeElement;
        t && t.vmodel && Ko(t, "input")
    });
    var Ro = {
        inserted: function(t, e, n, i) {
            "select" === n.tag ? (i.elm && !i.elm._vOptions ? oe(n, "postpatch", function() {
                Ro.componentUpdated(t, e, n)
            }) : jo(t, e, n.context), t._vOptions = [].map.call(t.options, Uo)) : ("textarea" === n.tag || Qn(t.type)) && (t._vModifiers = e.modifiers, e.modifiers.lazy || (t.addEventListener("compositionstart", zo), t.addEventListener("compositionend", Qo), t.addEventListener("change", Qo), Q && (t.vmodel = !0)))
        },
        componentUpdated: function(t, e, n) {
            if ("select" === n.tag) {
                jo(t, e, n.context);
                var i = t._vOptions,
                    o = t._vOptions = [].map.call(t.options, Uo);
                o.some(function(t, e) {
                    return !L(t, i[e])
                }) && (t.multiple ? e.value.some(function(t) {
                    return Ho(t, o)
                }) : e.value !== e.oldValue && Ho(e.value, o)) && Ko(t, "change")
            }
        }
    };

    function jo(t, e, n) {
        qo(t, e, n), (z || K) && setTimeout(function() {
            qo(t, e, n)
        }, 0)
    }

    function qo(t, e, n) {
        var i = e.value,
            o = t.multiple;
        if (!o || Array.isArray(i)) {
            for (var s, r, a = 0, l = t.options.length; a < l; a++)
                if (r = t.options[a], o) s = G(i, Uo(r)) > -1, r.selected !== s && (r.selected = s);
                else if (L(Uo(r), i)) return void(t.selectedIndex !== a && (t.selectedIndex = a));
            o || (t.selectedIndex = -1)
        }
    }

    function Ho(t, e) {
        return e.every(function(e) {
            return !L(e, t)
        })
    }

    function Uo(t) {
        return "_value" in t ? t._value : t.value
    }

    function zo(t) {
        t.target.composing = !0
    }

    function Qo(t) {
        t.target.composing && (t.target.composing = !1, Ko(t.target, "input"))
    }

    function Ko(t, e) {
        var n = document.createEvent("HTMLEvents");
        n.initEvent(e, !0, !0), t.dispatchEvent(n)
    }

    function Yo(t) {
        return !t.componentInstance || t.data && t.data.transition ? t : Yo(t.componentInstance._vnode)
    }
    var Xo = {
            model: Ro,
            show: {
                bind: function(t, e, n) {
                    var i = e.value,
                        o = (n = Yo(n)).data && n.data.transition,
                        s = t.__vOriginalDisplay = "none" === t.style.display ? "" : t.style.display;
                    i && o ? (n.data.show = !0, _o(n, function() {
                        t.style.display = s
                    })) : t.style.display = i ? s : "none"
                },
                update: function(t, e, n) {
                    var i = e.value;
                    !i != !e.oldValue && ((n = Yo(n)).data && n.data.transition ? (n.data.show = !0, i ? _o(n, function() {
                        t.style.display = t.__vOriginalDisplay
                    }) : Bo(n, function() {
                        t.style.display = "none"
                    })) : t.style.display = i ? t.__vOriginalDisplay : "none")
                },
                unbind: function(t, e, n, i, o) {
                    o || (t.style.display = t.__vOriginalDisplay)
                }
            }
        },
        Zo = {
            name: String,
            appear: Boolean,
            css: Boolean,
            mode: String,
            type: String,
            enterClass: String,
            leaveClass: String,
            enterToClass: String,
            leaveToClass: String,
            enterActiveClass: String,
            leaveActiveClass: String,
            appearClass: String,
            appearActiveClass: String,
            appearToClass: String,
            duration: [Number, String, Object]
        };

    function Jo(t) {
        var e = t && t.componentOptions;
        return e && e.Ctor.options.abstract ? Jo(je(e.children)) : t
    }

    function ts(t) {
        var e = {},
            n = t.$options;
        for (var i in n.propsData) e[i] = t[i];
        var o = n._parentListeners;
        for (var s in o) e[C(s)] = o[s];
        return e
    }

    function es(t, e) {
        if (/\d-keep-alive$/.test(e.tag)) return t("keep-alive", {
            props: e.componentOptions.propsData
        })
    }
    var ns = function(t) {
            return t.tag || Re(t)
        },
        is = function(t) {
            return "show" === t.name
        },
        os = {
            name: "transition",
            props: Zo,
            abstract: !0,
            render: function(t) {
                var e = this,
                    n = this.$slots.default;
                if (n && (n = n.filter(ns)).length) {
                    var i = this.mode,
                        s = n[0];
                    if (function(t) {
                            for (; t = t.parent;)
                                if (t.data.transition) return !0
                        }(this.$vnode)) return s;
                    var r = Jo(s);
                    if (!r) return s;
                    if (this._leaving) return es(t, s);
                    var a = "__transition-" + this._uid + "-";
                    r.key = null == r.key ? r.isComment ? a + "comment" : a + r.tag : o(r.key) ? 0 === String(r.key).indexOf(a) ? r.key : a + r.key : r.key;
                    var l = (r.data || (r.data = {})).transition = ts(this),
                        c = this._vnode,
                        d = Jo(c);
                    if (r.data.directives && r.data.directives.some(is) && (r.data.show = !0), d && d.data && ! function(t, e) {
                            return e.key === t.key && e.tag === t.tag
                        }(r, d) && !Re(d) && (!d.componentInstance || !d.componentInstance._vnode.isComment)) {
                        var u = d.data.transition = P({}, l);
                        if ("out-in" === i) return this._leaving = !0, oe(u, "afterLeave", function() {
                            e._leaving = !1, e.$forceUpdate()
                        }), es(t, s);
                        if ("in-out" === i) {
                            if (Re(r)) return c;
                            var p, m = function() {
                                p()
                            };
                            oe(l, "afterEnter", m), oe(l, "enterCancelled", m), oe(u, "delayLeave", function(t) {
                                p = t
                            })
                        }
                    }
                    return s
                }
            }
        },
        ss = P({
            tag: String,
            moveClass: String
        }, Zo);

    function rs(t) {
        t.elm._moveCb && t.elm._moveCb(), t.elm._enterCb && t.elm._enterCb()
    }

    function as(t) {
        t.data.newPos = t.elm.getBoundingClientRect()
    }

    function ls(t) {
        var e = t.data.pos,
            n = t.data.newPos,
            i = e.left - n.left,
            o = e.top - n.top;
        if (i || o) {
            t.data.moved = !0;
            var s = t.elm.style;
            s.transform = s.WebkitTransform = "translate(" + i + "px," + o + "px)", s.transitionDuration = "0s"
        }
    }
    delete ss.mode;
    var cs = {
        Transition: os,
        TransitionGroup: {
            props: ss,
            beforeMount: function() {
                var t = this,
                    e = this._update;
                this._update = function(n, i) {
                    var o = Ke(t);
                    t.__patch__(t._vnode, t.kept, !1, !0), t._vnode = t.kept, o(), e.call(t, n, i)
                }
            },
            render: function(t) {
                for (var e = this.tag || this.$vnode.data.tag || "span", n = Object.create(null), i = this.prevChildren = this.children, o = this.$slots.default || [], s = this.children = [], r = ts(this), a = 0; a < o.length; a++) {
                    var l = o[a];
                    l.tag && null != l.key && 0 !== String(l.key).indexOf("__vlist") && (s.push(l), n[l.key] = l, (l.data || (l.data = {})).transition = r)
                }
                if (i) {
                    for (var c = [], d = [], u = 0; u < i.length; u++) {
                        var p = i[u];
                        p.data.transition = r, p.data.pos = p.elm.getBoundingClientRect(), n[p.key] ? c.push(p) : d.push(p)
                    }
                    this.kept = t(e, null, c), this.removed = d
                }
                return t(e, null, s)
            },
            updated: function() {
                var t = this.prevChildren,
                    e = this.moveClass || (this.name || "v") + "-move";
                t.length && this.hasMove(t[0].elm, e) && (t.forEach(rs), t.forEach(as), t.forEach(ls), this._reflow = document.body.offsetHeight, t.forEach(function(t) {
                    if (t.data.moved) {
                        var n = t.elm,
                            i = n.style;
                        Ao(n, e), i.transform = i.WebkitTransform = i.transitionDuration = "", n.addEventListener(xo, n._moveCb = function t(i) {
                            i && i.target !== n || i && !/transform$/.test(i.propertyName) || (n.removeEventListener(xo, t), n._moveCb = null, Fo(n, e))
                        })
                    }
                }))
            },
            methods: {
                hasMove: function(t, e) {
                    if (!Co) return !1;
                    if (this._hasMove) return this._hasMove;
                    var n = t.cloneNode();
                    t._transitionClasses && t._transitionClasses.forEach(function(t) {
                        go(n, t)
                    }), fo(n, e), n.style.display = "none", this.$el.appendChild(n);
                    var i = No(n);
                    return this.$el.removeChild(n), this._hasMove = i.hasTransform
                }
            }
        }
    };
    Sn.config.mustUseProp = Fn, Sn.config.isReservedTag = Hn, Sn.config.isReservedAttr = En, Sn.config.getTagNamespace = Un, Sn.config.isUnknownElement = function(t) {
        if (!j) return !0;
        if (Hn(t)) return !1;
        if (t = t.toLowerCase(), null != zn[t]) return zn[t];
        var e = document.createElement(t);
        return t.indexOf("-") > -1 ? zn[t] = e.constructor === window.HTMLUnknownElement || e.constructor === window.HTMLElement : zn[t] = /HTMLUnknownElement/.test(e.toString())
    }, P(Sn.options.directives, Xo), P(Sn.options.components, cs), Sn.prototype.__patch__ = j ? Wo : E, Sn.prototype.$mount = function(t, e) {
        return function(t, e, n) {
            return t.$el = e, t.$options.render || (t.$options.render = ht), Ze(t, "beforeMount"), new un(t, function() {
                t._update(t._render(), n)
            }, E, {
                before: function() {
                    t._isMounted && !t._isDestroyed && Ze(t, "beforeUpdate")
                }
            }, !0), n = !1, null == t.$vnode && (t._isMounted = !0, Ze(t, "mounted")), t
        }(this, t = t && j ? Kn(t) : void 0, e)
    }, j && setTimeout(function() {
        B.devtools && nt && nt.emit("init", Sn)
    }, 0);
    var ds, us = /\{\{((?:.|\r?\n)+?)\}\}/g,
        ps = /[-.*+?^${}()|[\]\/\\]/g,
        ms = b(function(t) {
            var e = t[0].replace(ps, "\\$&"),
                n = t[1].replace(ps, "\\$&");
            return new RegExp(e + "((?:.|\\n)+?)" + n, "g")
        }),
        hs = {
            staticKeys: ["staticClass"],
            transformNode: function(t, e) {
                e.warn;
                var n = Oi(t, "class");
                n && (t.staticClass = JSON.stringify(n));
                var i = Ni(t, "class", !1);
                i && (t.classBinding = i)
            },
            genData: function(t) {
                var e = "";
                return t.staticClass && (e += "staticClass:" + t.staticClass + ","), t.classBinding && (e += "class:" + t.classBinding + ","), e
            }
        },
        vs = {
            staticKeys: ["staticStyle"],
            transformNode: function(t, e) {
                e.warn;
                var n = Oi(t, "style");
                n && (t.staticStyle = JSON.stringify(io(n)));
                var i = Ni(t, "style", !1);
                i && (t.styleBinding = i)
            },
            genData: function(t) {
                var e = "";
                return t.staticStyle && (e += "staticStyle:" + t.staticStyle + ","), t.styleBinding && (e += "style:(" + t.styleBinding + "),"), e
            }
        },
        fs = p("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),
        gs = p("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),
        bs = p("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),
        ys = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
        Cs = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
        Ss = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + V.source + "]*",
        ws = "((?:" + Ss + "\\:)?" + Ss + ")",
        ks = new RegExp("^<" + ws),
        xs = /^\s*(\/?)>/,
        Ts = new RegExp("^<\\/" + ws + "[^>]*>"),
        Ps = /^<!DOCTYPE [^>]+>/i,
        Is = /^<!\--/,
        Es = /^<!\[/,
        As = p("script,style,textarea", !0),
        Fs = {},
        Ls = {
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&amp;": "&",
            "&#10;": "\n",
            "&#9;": "\t",
            "&#39;": "'"
        },
        Gs = /&(?:lt|gt|quot|amp|#39);/g,
        Ns = /&(?:lt|gt|quot|amp|#39|#10|#9);/g,
        Os = p("pre,textarea", !0),
        Ds = function(t, e) {
            return t && Os(t) && "\n" === e[0]
        };

    function _s(t, e) {
        var n = e ? Ns : Gs;
        return t.replace(n, function(t) {
            return Ls[t]
        })
    }
    var Bs, Vs, $s, Ms, Ws, Rs, js, qs, Hs = /^@|^v-on:/,
        Us = /^v-|^@|^:/,
        zs = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
        Qs = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
        Ks = /^\(|\)$/g,
        Ys = /^\[.*\]$/,
        Xs = /:(.*)$/,
        Zs = /^:|^\.|^v-bind:/,
        Js = /\.[^.\]]+(?=[^\]]*$)/g,
        tr = /^v-slot(:|$)|^#/,
        er = /[\r\n]/,
        nr = /\s+/g,
        ir = b(function(t) {
            return (ds = ds || document.createElement("div")).innerHTML = t, ds.textContent
        }),
        or = "_empty_";

    function sr(t, e, n) {
        return {
            type: 1,
            tag: t,
            attrsList: e,
            attrsMap: function(t) {
                for (var e = {}, n = 0, i = t.length; n < i; n++) e[t[n].name] = t[n].value;
                return e
            }(e),
            rawAttrsMap: {},
            parent: n,
            children: []
        }
    }

    function rr(t, e) {
        var n, i;
        (i = Ni(n = t, "key")) && (n.key = i), t.plain = !t.key && !t.scopedSlots && !t.attrsList.length,
            function(t) {
                var e = Ni(t, "ref");
                e && (t.ref = e, t.refInFor = function(t) {
                    for (var e = t; e;) {
                        if (void 0 !== e.for) return !0;
                        e = e.parent
                    }
                    return !1
                }(t))
            }(t),
            function(t) {
                var e;
                "template" === t.tag ? (e = Oi(t, "scope"), t.slotScope = e || Oi(t, "slot-scope")) : (e = Oi(t, "slot-scope")) && (t.slotScope = e);
                var n = Ni(t, "slot");
                if (n && (t.slotTarget = '""' === n ? '"default"' : n, t.slotTargetDynamic = !(!t.attrsMap[":slot"] && !t.attrsMap["v-bind:slot"]), "template" === t.tag || t.slotScope || Ei(t, "slot", n, function(t, e) {
                        return t.rawAttrsMap[":" + e] || t.rawAttrsMap["v-bind:" + e] || t.rawAttrsMap[e]
                    }(t, "slot"))), "template" === t.tag) {
                    var i = Di(t, tr);
                    if (i) {
                        var o = cr(i),
                            s = o.name,
                            r = o.dynamic;
                        t.slotTarget = s, t.slotTargetDynamic = r, t.slotScope = i.value || or
                    }
                } else {
                    var a = Di(t, tr);
                    if (a) {
                        var l = t.scopedSlots || (t.scopedSlots = {}),
                            c = cr(a),
                            d = c.name,
                            u = c.dynamic,
                            p = l[d] = sr("template", [], t);
                        p.slotTarget = d, p.slotTargetDynamic = u, p.children = t.children.filter(function(t) {
                            if (!t.slotScope) return t.parent = p, !0
                        }), p.slotScope = a.value || or, t.children = [], t.plain = !1
                    }
                }
            }(t),
            function(t) {
                "slot" === t.tag && (t.slotName = Ni(t, "name"))
            }(t),
            function(t) {
                var e;
                (e = Ni(t, "is")) && (t.component = e), null != Oi(t, "inline-template") && (t.inlineTemplate = !0)
            }(t);
        for (var o = 0; o < $s.length; o++) t = $s[o](t, e) || t;
        return function(t) {
            var e, n, i, o, s, r, a, l, c = t.attrsList;
            for (e = 0, n = c.length; e < n; e++)
                if (i = o = c[e].name, s = c[e].value, Us.test(i))
                    if (t.hasBindings = !0, (r = dr(i.replace(Us, ""))) && (i = i.replace(Js, "")), Zs.test(i)) i = i.replace(Zs, ""), s = ki(s), (l = Ys.test(i)) && (i = i.slice(1, -1)), r && (r.prop && !l && "innerHtml" === (i = C(i)) && (i = "innerHTML"), r.camel && !l && (i = C(i)), r.sync && (a = Vi(s, "$event"), l ? Gi(t, '"update:"+(' + i + ")", a, null, !1, 0, c[e], !0) : (Gi(t, "update:" + C(i), a, null, !1, 0, c[e]), k(i) !== C(i) && Gi(t, "update:" + k(i), a, null, !1, 0, c[e])))), r && r.prop || !t.component && js(t.tag, t.attrsMap.type, i) ? Ii(t, i, s, c[e], l) : Ei(t, i, s, c[e], l);
                    else if (Hs.test(i)) i = i.replace(Hs, ""), (l = Ys.test(i)) && (i = i.slice(1, -1)), Gi(t, i, s, r, !1, 0, c[e], l);
            else {
                var d = (i = i.replace(Us, "")).match(Xs),
                    u = d && d[1];
                l = !1, u && (i = i.slice(0, -(u.length + 1)), Ys.test(u) && (u = u.slice(1, -1), l = !0)), Fi(t, i, o, s, u, l, r, c[e])
            } else Ei(t, i, JSON.stringify(s), c[e]), !t.component && "muted" === i && js(t.tag, t.attrsMap.type, i) && Ii(t, i, "true", c[e])
        }(t), t
    }

    function ar(t) {
        var e;
        if (e = Oi(t, "v-for")) {
            var n = function(t) {
                var e = t.match(zs);
                if (e) {
                    var n = {};
                    n.for = e[2].trim();
                    var i = e[1].trim().replace(Ks, ""),
                        o = i.match(Qs);
                    return o ? (n.alias = i.replace(Qs, "").trim(), n.iterator1 = o[1].trim(), o[2] && (n.iterator2 = o[2].trim())) : n.alias = i, n
                }
            }(e);
            n && P(t, n)
        }
    }

    function lr(t, e) {
        t.ifConditions || (t.ifConditions = []), t.ifConditions.push(e)
    }

    function cr(t) {
        var e = t.name.replace(tr, "");
        return e || "#" !== t.name[0] && (e = "default"), Ys.test(e) ? {
            name: e.slice(1, -1),
            dynamic: !0
        } : {
            name: '"' + e + '"',
            dynamic: !1
        }
    }

    function dr(t) {
        var e = t.match(Js);
        if (e) {
            var n = {};
            return e.forEach(function(t) {
                n[t.slice(1)] = !0
            }), n
        }
    }
    var ur = /^xmlns:NS\d+/,
        pr = /^NS\d+:/;

    function mr(t) {
        return sr(t.tag, t.attrsList.slice(), t.parent)
    }
    var hr, vr, fr = [hs, vs, {
            preTransformNode: function(t, e) {
                if ("input" === t.tag) {
                    var n, i = t.attrsMap;
                    if (!i["v-model"]) return;
                    if ((i[":type"] || i["v-bind:type"]) && (n = Ni(t, "type")), i.type || n || !i["v-bind"] || (n = "(" + i["v-bind"] + ").type"), n) {
                        var o = Oi(t, "v-if", !0),
                            s = o ? "&&(" + o + ")" : "",
                            r = null != Oi(t, "v-else", !0),
                            a = Oi(t, "v-else-if", !0),
                            l = mr(t);
                        ar(l), Ai(l, "type", "checkbox"), rr(l, e), l.processed = !0, l.if = "(" + n + ")==='checkbox'" + s, lr(l, {
                            exp: l.if,
                            block: l
                        });
                        var c = mr(t);
                        Oi(c, "v-for", !0), Ai(c, "type", "radio"), rr(c, e), lr(l, {
                            exp: "(" + n + ")==='radio'" + s,
                            block: c
                        });
                        var d = mr(t);
                        return Oi(d, "v-for", !0), Ai(d, ":type", n), rr(d, e), lr(l, {
                            exp: o,
                            block: d
                        }), r ? l.else = !0 : a && (l.elseif = a), l
                    }
                }
            }
        }],
        gr = {
            expectHTML: !0,
            modules: fr,
            directives: {
                model: function(t, e, n) {
                    var i = e.value,
                        o = e.modifiers,
                        s = t.tag,
                        r = t.attrsMap.type;
                    if (t.component) return Bi(t, i, o), !1;
                    if ("select" === s) ! function(t, e, n) {
                        var i = 'var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return ' + (o && o.number ? "_n(val)" : "val") + "});";
                        Gi(t, "change", i = i + " " + Vi(e, "$event.target.multiple ? $$selectedVal : $$selectedVal[0]"), null, !0)
                    }(t, i);
                    else if ("input" === s && "checkbox" === r) ! function(t, e, n) {
                        var i = n && n.number,
                            o = Ni(t, "value") || "null",
                            s = Ni(t, "true-value") || "true",
                            r = Ni(t, "false-value") || "false";
                        Ii(t, "checked", "Array.isArray(" + e + ")?_i(" + e + "," + o + ")>-1" + ("true" === s ? ":(" + e + ")" : ":_q(" + e + "," + s + ")")), Gi(t, "change", "var $$a=" + e + ",$$el=$event.target,$$c=$$el.checked?(" + s + "):(" + r + ");if(Array.isArray($$a)){var $$v=" + (i ? "_n(" + o + ")" : o) + ",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(" + Vi(e, "$$a.concat([$$v])") + ")}else{$$i>-1&&(" + Vi(e, "$$a.slice(0,$$i).concat($$a.slice($$i+1))") + ")}}else{" + Vi(e, "$$c") + "}", null, !0)
                    }(t, i, o);
                    else if ("input" === s && "radio" === r) ! function(t, e, n) {
                        var i = n && n.number,
                            o = Ni(t, "value") || "null";
                        Ii(t, "checked", "_q(" + e + "," + (o = i ? "_n(" + o + ")" : o) + ")"), Gi(t, "change", Vi(e, o), null, !0)
                    }(t, i, o);
                    else if ("input" === s || "textarea" === s) ! function(t, e, n) {
                        var i = t.attrsMap.type,
                            o = n || {},
                            s = o.lazy,
                            r = o.number,
                            a = o.trim,
                            l = !s && "range" !== i,
                            c = s ? "change" : "range" === i ? Hi : "input",
                            d = "$event.target.value";
                        a && (d = "$event.target.value.trim()"), r && (d = "_n(" + d + ")");
                        var u = Vi(e, d);
                        l && (u = "if($event.target.composing)return;" + u), Ii(t, "value", "(" + e + ")"), Gi(t, c, u, null, !0), (a || r) && Gi(t, "blur", "$forceUpdate()")
                    }(t, i, o);
                    else if (!B.isReservedTag(s)) return Bi(t, i, o), !1;
                    return !0
                },
                text: function(t, e) {
                    e.value && Ii(t, "textContent", "_s(" + e.value + ")", e)
                },
                html: function(t, e) {
                    e.value && Ii(t, "innerHTML", "_s(" + e.value + ")", e)
                }
            },
            isPreTag: function(t) {
                return "pre" === t
            },
            isUnaryTag: fs,
            mustUseProp: Fn,
            canBeLeftOpenTag: gs,
            isReservedTag: Hn,
            getTagNamespace: Un,
            staticKeys: fr.reduce(function(t, e) {
                return t.concat(e.staticKeys || [])
            }, []).join(",")
        },
        br = b(function(t) {
            return p("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap" + (t ? "," + t : ""))
        });
    var yr = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*(?:[\w$]+)?\s*\(/,
        Cr = /\([^)]*?\);*$/,
        Sr = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,
        wr = {
            esc: 27,
            tab: 9,
            enter: 13,
            space: 32,
            up: 38,
            left: 37,
            right: 39,
            down: 40,
            delete: [8, 46]
        },
        kr = {
            esc: ["Esc", "Escape"],
            tab: "Tab",
            enter: "Enter",
            space: [" ", "Spacebar"],
            up: ["Up", "ArrowUp"],
            left: ["Left", "ArrowLeft"],
            right: ["Right", "ArrowRight"],
            down: ["Down", "ArrowDown"],
            delete: ["Backspace", "Delete", "Del"]
        },
        xr = function(t) {
            return "if(" + t + ")return null;"
        },
        Tr = {
            stop: "$event.stopPropagation();",
            prevent: "$event.preventDefault();",
            self: xr("$event.target !== $event.currentTarget"),
            ctrl: xr("!$event.ctrlKey"),
            shift: xr("!$event.shiftKey"),
            alt: xr("!$event.altKey"),
            meta: xr("!$event.metaKey"),
            left: xr("'button' in $event && $event.button !== 0"),
            middle: xr("'button' in $event && $event.button !== 1"),
            right: xr("'button' in $event && $event.button !== 2")
        };

    function Pr(t, e) {
        var n = e ? "nativeOn:" : "on:",
            i = "",
            o = "";
        for (var s in t) {
            var r = Ir(t[s]);
            t[s] && t[s].dynamic ? o += s + "," + r + "," : i += '"' + s + '":' + r + ","
        }
        return i = "{" + i.slice(0, -1) + "}", o ? n + "_d(" + i + ",[" + o.slice(0, -1) + "])" : n + i
    }

    function Ir(t) {
        if (!t) return "function(){}";
        if (Array.isArray(t)) return "[" + t.map(function(t) {
            return Ir(t)
        }).join(",") + "]";
        var e = Sr.test(t.value),
            n = yr.test(t.value),
            i = Sr.test(t.value.replace(Cr, ""));
        if (t.modifiers) {
            var o = "",
                s = "",
                r = [];
            for (var a in t.modifiers)
                if (Tr[a]) s += Tr[a], wr[a] && r.push(a);
                else if ("exact" === a) {
                var l = t.modifiers;
                s += xr(["ctrl", "shift", "alt", "meta"].filter(function(t) {
                    return !l[t]
                }).map(function(t) {
                    return "$event." + t + "Key"
                }).join("||"))
            } else r.push(a);
            return r.length && (o += "if(!$event.type.indexOf('key')&&" + r.map(Er).join("&&") + ")return null;"), s && (o += s), "function($event){" + o + (e ? "return " + t.value + "($event)" : n ? "return (" + t.value + ")($event)" : i ? "return " + t.value : t.value) + "}"
        }
        return e || n ? t.value : "function($event){" + (i ? "return " + t.value : t.value) + "}"
    }

    function Er(t) {
        var e = parseInt(t, 10);
        if (e) return "$event.keyCode!==" + e;
        var n = wr[t],
            i = kr[t];
        return "_k($event.keyCode," + JSON.stringify(t) + "," + JSON.stringify(n) + ",$event.key," + JSON.stringify(i) + ")"
    }
    var Ar = {
            on: function(t, e) {
                t.wrapListeners = function(t) {
                    return "_g(" + t + "," + e.value + ")"
                }
            },
            bind: function(t, e) {
                t.wrapData = function(n) {
                    return "_b(" + n + ",'" + t.tag + "'," + e.value + "," + (e.modifiers && e.modifiers.prop ? "true" : "false") + (e.modifiers && e.modifiers.sync ? ",true" : "") + ")"
                }
            },
            cloak: E
        },
        Fr = function(t) {
            this.options = t, this.warn = t.warn || Ti, this.transforms = Pi(t.modules, "transformCode"), this.dataGenFns = Pi(t.modules, "genData"), this.directives = P(P({}, Ar), t.directives);
            var e = t.isReservedTag || A;
            this.maybeComponent = function(t) {
                return !!t.component || !e(t.tag)
            }, this.onceId = 0, this.staticRenderFns = [], this.pre = !1
        };

    function Lr(t, e) {
        var n = new Fr(e);
        return {
            render: "with(this){return " + (t ? Gr(t, n) : '_c("div")') + "}",
            staticRenderFns: n.staticRenderFns
        }
    }

    function Gr(t, e) {
        if (t.parent && (t.pre = t.pre || t.parent.pre), t.staticRoot && !t.staticProcessed) return Nr(t, e);
        if (t.once && !t.onceProcessed) return Or(t, e);
        if (t.for && !t.forProcessed) return _r(t, e);
        if (t.if && !t.ifProcessed) return Dr(t, e);
        if ("template" !== t.tag || t.slotTarget || e.pre) {
            if ("slot" === t.tag) return function(t, e) {
                var n = t.slotName || '"default"',
                    i = Mr(t, e),
                    o = "_t(" + n + (i ? "," + i : ""),
                    s = t.attrs || t.dynamicAttrs ? jr((t.attrs || []).concat(t.dynamicAttrs || []).map(function(t) {
                        return {
                            name: C(t.name),
                            value: t.value,
                            dynamic: t.dynamic
                        }
                    })) : null,
                    r = t.attrsMap["v-bind"];
                return !s && !r || i || (o += ",null"), s && (o += "," + s), r && (o += (s ? "" : ",null") + "," + r), o + ")"
            }(t, e);
            var n;
            if (t.component) n = function(t, e, n) {
                var i = e.inlineTemplate ? null : Mr(e, n, !0);
                return "_c(" + t + "," + Br(e, n) + (i ? "," + i : "") + ")"
            }(t.component, t, e);
            else {
                var i;
                (!t.plain || t.pre && e.maybeComponent(t)) && (i = Br(t, e));
                var o = t.inlineTemplate ? null : Mr(t, e, !0);
                n = "_c('" + t.tag + "'" + (i ? "," + i : "") + (o ? "," + o : "") + ")"
            }
            for (var s = 0; s < e.transforms.length; s++) n = e.transforms[s](t, n);
            return n
        }
        return Mr(t, e) || "void 0"
    }

    function Nr(t, e) {
        t.staticProcessed = !0;
        var n = e.pre;
        return t.pre && (e.pre = t.pre), e.staticRenderFns.push("with(this){return " + Gr(t, e) + "}"), e.pre = n, "_m(" + (e.staticRenderFns.length - 1) + (t.staticInFor ? ",true" : "") + ")"
    }

    function Or(t, e) {
        if (t.onceProcessed = !0, t.if && !t.ifProcessed) return Dr(t, e);
        if (t.staticInFor) {
            for (var n = "", i = t.parent; i;) {
                if (i.for) {
                    n = i.key;
                    break
                }
                i = i.parent
            }
            return n ? "_o(" + Gr(t, e) + "," + e.onceId++ + "," + n + ")" : Gr(t, e)
        }
        return Nr(t, e)
    }

    function Dr(t, e, n, i) {
        return t.ifProcessed = !0,
            function t(e, n, i, o) {
                if (!e.length) return o || "_e()";
                var s = e.shift();
                return s.exp ? "(" + s.exp + ")?" + r(s.block) + ":" + t(e, n, i, o) : "" + r(s.block);

                function r(t) {
                    return i ? i(t, n) : t.once ? Or(t, n) : Gr(t, n)
                }
            }(t.ifConditions.slice(), e, n, i)
    }

    function _r(t, e, n, i) {
        var o = t.for,
            s = t.alias,
            r = t.iterator1 ? "," + t.iterator1 : "",
            a = t.iterator2 ? "," + t.iterator2 : "";
        return t.forProcessed = !0, (i || "_l") + "((" + o + "),function(" + s + r + a + "){return " + (n || Gr)(t, e) + "})"
    }

    function Br(t, e) {
        var n = "{",
            i = function(t, e) {
                var n = t.directives;
                if (n) {
                    var i, o, s, r, a = "directives:[",
                        l = !1;
                    for (i = 0, o = n.length; i < o; i++) {
                        s = n[i], r = !0;
                        var c = e.directives[s.name];
                        c && (r = !!c(t, s, e.warn)), r && (l = !0, a += '{name:"' + s.name + '",rawName:"' + s.rawName + '"' + (s.value ? ",value:(" + s.value + "),expression:" + JSON.stringify(s.value) : "") + (s.arg ? ",arg:" + (s.isDynamicArg ? s.arg : '"' + s.arg + '"') : "") + (s.modifiers ? ",modifiers:" + JSON.stringify(s.modifiers) : "") + "},")
                    }
                    return l ? a.slice(0, -1) + "]" : void 0
                }
            }(t, e);
        i && (n += i + ","), t.key && (n += "key:" + t.key + ","), t.ref && (n += "ref:" + t.ref + ","), t.refInFor && (n += "refInFor:true,"), t.pre && (n += "pre:true,"), t.component && (n += 'tag:"' + t.tag + '",');
        for (var o = 0; o < e.dataGenFns.length; o++) n += e.dataGenFns[o](t);
        if (t.attrs && (n += "attrs:" + jr(t.attrs) + ","), t.props && (n += "domProps:" + jr(t.props) + ","), t.events && (n += Pr(t.events, !1) + ","), t.nativeEvents && (n += Pr(t.nativeEvents, !0) + ","), t.slotTarget && !t.slotScope && (n += "slot:" + t.slotTarget + ","), t.scopedSlots && (n += function(t, e, n) {
                var i = t.for || Object.keys(e).some(function(t) {
                        var n = e[t];
                        return n.slotTargetDynamic || n.if || n.for || Vr(n)
                    }),
                    o = !!t.if;
                if (!i)
                    for (var s = t.parent; s;) {
                        if (s.slotScope && s.slotScope !== or || s.for) {
                            i = !0;
                            break
                        }
                        s.if && (o = !0), s = s.parent
                    }
                var r = Object.keys(e).map(function(t) {
                    return $r(e[t], n)
                }).join(",");
                return "scopedSlots:_u([" + r + "]" + (i ? ",null,true" : "") + (!i && o ? ",null,false," + function(t) {
                    for (var e = 5381, n = t.length; n;) e = 33 * e ^ t.charCodeAt(--n);
                    return e >>> 0
                }(r) : "") + ")"
            }(t, t.scopedSlots, e) + ","), t.model && (n += "model:{value:" + t.model.value + ",callback:" + t.model.callback + ",expression:" + t.model.expression + "},"), t.inlineTemplate) {
            var s = function(t, e) {
                var n = t.children[0];
                if (n && 1 === n.type) {
                    var i = Lr(n, e.options);
                    return "inlineTemplate:{render:function(){" + i.render + "},staticRenderFns:[" + i.staticRenderFns.map(function(t) {
                        return "function(){" + t + "}"
                    }).join(",") + "]}"
                }
            }(t, e);
            s && (n += s + ",")
        }
        return n = n.replace(/,$/, "") + "}", t.dynamicAttrs && (n = "_b(" + n + ',"' + t.tag + '",' + jr(t.dynamicAttrs) + ")"), t.wrapData && (n = t.wrapData(n)), t.wrapListeners && (n = t.wrapListeners(n)), n
    }

    function Vr(t) {
        return 1 === t.type && ("slot" === t.tag || t.children.some(Vr))
    }

    function $r(t, e) {
        var n = t.attrsMap["slot-scope"];
        if (t.if && !t.ifProcessed && !n) return Dr(t, e, $r, "null");
        if (t.for && !t.forProcessed) return _r(t, e, $r);
        var i = t.slotScope === or ? "" : String(t.slotScope),
            o = "function(" + i + "){return " + ("template" === t.tag ? t.if && n ? "(" + t.if+")?" + (Mr(t, e) || "undefined") + ":undefined" : Mr(t, e) || "undefined" : Gr(t, e)) + "}",
            s = i ? "" : ",proxy:true";
        return "{key:" + (t.slotTarget || '"default"') + ",fn:" + o + s + "}"
    }

    function Mr(t, e, n, i, o) {
        var s = t.children;
        if (s.length) {
            var r = s[0];
            if (1 === s.length && r.for && "template" !== r.tag && "slot" !== r.tag) {
                var a = n ? e.maybeComponent(r) ? ",1" : ",0" : "";
                return "" + (i || Gr)(r, e) + a
            }
            var l = n ? function(t, e) {
                    for (var n = 0, i = 0; i < t.length; i++) {
                        var o = t[i];
                        if (1 === o.type) {
                            if (Wr(o) || o.ifConditions && o.ifConditions.some(function(t) {
                                    return Wr(t.block)
                                })) {
                                n = 2;
                                break
                            }(e(o) || o.ifConditions && o.ifConditions.some(function(t) {
                                return e(t.block)
                            })) && (n = 1)
                        }
                    }
                    return n
                }(s, e.maybeComponent) : 0,
                c = o || Rr;
            return "[" + s.map(function(t) {
                return c(t, e)
            }).join(",") + "]" + (l ? "," + l : "")
        }
    }

    function Wr(t) {
        return void 0 !== t.for || "template" === t.tag || "slot" === t.tag
    }

    function Rr(t, e) {
        return 1 === t.type ? Gr(t, e) : 3 === t.type && t.isComment ? (i = t, "_e(" + JSON.stringify(i.text) + ")") : "_v(" + (2 === (n = t).type ? n.expression : qr(JSON.stringify(n.text))) + ")";
        var n, i
    }

    function jr(t) {
        for (var e = "", n = "", i = 0; i < t.length; i++) {
            var o = t[i],
                s = qr(o.value);
            o.dynamic ? n += o.name + "," + s + "," : e += '"' + o.name + '":' + s + ","
        }
        return e = "{" + e.slice(0, -1) + "}", n ? "_d(" + e + ",[" + n.slice(0, -1) + "])" : e
    }

    function qr(t) {
        return t.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
    }

    function Hr(t, e) {
        try {
            return new Function(t)
        } catch (n) {
            return e.push({
                err: n,
                code: t
            }), E
        }
    }
    new RegExp("\\b" + "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b") + "\\b");
    var Ur, zr, Qr = (Ur = function(t, e) {
            var n = function(t, e) {
                Bs = e.warn || Ti, Rs = e.isPreTag || A, js = e.mustUseProp || A, qs = e.getTagNamespace || A, e.isReservedTag, $s = Pi(e.modules, "transformNode"), Ms = Pi(e.modules, "preTransformNode"), Ws = Pi(e.modules, "postTransformNode"), Vs = e.delimiters;
                var n, i, o = [],
                    s = !1 !== e.preserveWhitespace,
                    r = e.whitespace,
                    a = !1,
                    l = !1;

                function c(t) {
                    if (d(t), a || t.processed || (t = rr(t, e)), o.length || t === n || n.if && (t.elseif || t.else) && lr(n, {
                            exp: t.elseif,
                            block: t
                        }), i && !t.forbidden)
                        if (t.elseif || t.else) r = t, (c = function(t) {
                            for (var e = t.length; e--;) {
                                if (1 === t[e].type) return t[e];
                                t.pop()
                            }
                        }(i.children)) && c.if && lr(c, {
                            exp: r.elseif,
                            block: r
                        });
                        else {
                            if (t.slotScope) {
                                var s = t.slotTarget || '"default"';
                                (i.scopedSlots || (i.scopedSlots = {}))[s] = t
                            }
                            i.children.push(t), t.parent = i
                        } var r, c;
                    t.children = t.children.filter(function(t) {
                        return !t.slotScope
                    }), d(t), t.pre && (a = !1), Rs(t.tag) && (l = !1);
                    for (var u = 0; u < Ws.length; u++) Ws[u](t, e)
                }

                function d(t) {
                    if (!l)
                        for (var e;
                            (e = t.children[t.children.length - 1]) && 3 === e.type && " " === e.text;) t.children.pop()
                }
                return function(t, e) {
                    for (var n, i, o = [], s = e.expectHTML, r = e.isUnaryTag || A, a = e.canBeLeftOpenTag || A, l = 0; t;) {
                        if (n = t, i && As(i)) {
                            var c = 0,
                                d = i.toLowerCase(),
                                u = Fs[d] || (Fs[d] = new RegExp("([\\s\\S]*?)(</" + d + "[^>]*>)", "i")),
                                p = t.replace(u, function(t, n, i) {
                                    return c = i.length, As(d) || "noscript" === d || (n = n.replace(/<!\--([\s\S]*?)-->/g, "$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1")), Ds(d, n) && (n = n.slice(1)), e.chars && e.chars(n), ""
                                });
                            l += t.length - p.length, t = p, P(d, l - c, l)
                        } else {
                            var m = t.indexOf("<");
                            if (0 === m) {
                                if (Is.test(t)) {
                                    var h = t.indexOf("--\x3e");
                                    if (h >= 0) {
                                        e.shouldKeepComment && e.comment(t.substring(4, h), l, l + h + 3), k(h + 3);
                                        continue
                                    }
                                }
                                if (Es.test(t)) {
                                    var v = t.indexOf("]>");
                                    if (v >= 0) {
                                        k(v + 2);
                                        continue
                                    }
                                }
                                var f = t.match(Ps);
                                if (f) {
                                    k(f[0].length);
                                    continue
                                }
                                var g = t.match(Ts);
                                if (g) {
                                    var b = l;
                                    k(g[0].length), P(g[1], b, l);
                                    continue
                                }
                                var y = x();
                                if (y) {
                                    T(y), Ds(y.tagName, t) && k(1);
                                    continue
                                }
                            }
                            var C = void 0,
                                S = void 0,
                                w = void 0;
                            if (m >= 0) {
                                for (S = t.slice(m); !(Ts.test(S) || ks.test(S) || Is.test(S) || Es.test(S) || (w = S.indexOf("<", 1)) < 0);) m += w, S = t.slice(m);
                                C = t.substring(0, m)
                            }
                            m < 0 && (C = t), C && k(C.length), e.chars && C && e.chars(C, l - C.length, l)
                        }
                        if (t === n) {
                            e.chars && e.chars(t);
                            break
                        }
                    }

                    function k(e) {
                        l += e, t = t.substring(e)
                    }

                    function x() {
                        var e = t.match(ks);
                        if (e) {
                            var n, i, o = {
                                tagName: e[1],
                                attrs: [],
                                start: l
                            };
                            for (k(e[0].length); !(n = t.match(xs)) && (i = t.match(Cs) || t.match(ys));) i.start = l, k(i[0].length), i.end = l, o.attrs.push(i);
                            if (n) return o.unarySlash = n[1], k(n[0].length), o.end = l, o
                        }
                    }

                    function T(t) {
                        var n = t.tagName,
                            l = t.unarySlash;
                        s && ("p" === i && bs(n) && P(i), a(n) && i === n && P(n));
                        for (var c = r(n) || !!l, d = t.attrs.length, u = new Array(d), p = 0; p < d; p++) {
                            var m = t.attrs[p],
                                h = m[3] || m[4] || m[5] || "",
                                v = "a" === n && "href" === m[1] ? e.shouldDecodeNewlinesForHref : e.shouldDecodeNewlines;
                            u[p] = {
                                name: m[1],
                                value: _s(h, v)
                            }
                        }
                        c || (o.push({
                            tag: n,
                            lowerCasedTag: n.toLowerCase(),
                            attrs: u,
                            start: t.start,
                            end: t.end
                        }), i = n), e.start && e.start(n, u, c, t.start, t.end)
                    }

                    function P(t, n, s) {
                        var r, a;
                        if (null == n && (n = l), null == s && (s = l), t)
                            for (a = t.toLowerCase(), r = o.length - 1; r >= 0 && o[r].lowerCasedTag !== a; r--);
                        else r = 0;
                        if (r >= 0) {
                            for (var c = o.length - 1; c >= r; c--) e.end && e.end(o[c].tag, n, s);
                            o.length = r, i = r && o[r - 1].tag
                        } else "br" === a ? e.start && e.start(t, [], !0, n, s) : "p" === a && (e.start && e.start(t, [], !1, n, s), e.end && e.end(t, n, s))
                    }
                    P()
                }(t, {
                    warn: Bs,
                    expectHTML: e.expectHTML,
                    isUnaryTag: e.isUnaryTag,
                    canBeLeftOpenTag: e.canBeLeftOpenTag,
                    shouldDecodeNewlines: e.shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref: e.shouldDecodeNewlinesForHref,
                    shouldKeepComment: e.comments,
                    outputSourceRange: e.outputSourceRange,
                    start: function(t, s, r, d, u) {
                        var p = i && i.ns || qs(t);
                        z && "svg" === p && (s = function(t) {
                            for (var e = [], n = 0; n < t.length; n++) {
                                var i = t[n];
                                ur.test(i.name) || (i.name = i.name.replace(pr, ""), e.push(i))
                            }
                            return e
                        }(s));
                        var m, h = sr(t, s, i);
                        p && (h.ns = p), "style" !== (m = h).tag && ("script" !== m.tag || m.attrsMap.type && "text/javascript" !== m.attrsMap.type) || et() || (h.forbidden = !0);
                        for (var v = 0; v < Ms.length; v++) h = Ms[v](h, e) || h;
                        a || (function(t) {
                            null != Oi(t, "v-pre") && (t.pre = !0)
                        }(h), h.pre && (a = !0)), Rs(h.tag) && (l = !0), a ? function(t) {
                            var e = t.attrsList,
                                n = e.length;
                            if (n)
                                for (var i = t.attrs = new Array(n), o = 0; o < n; o++) i[o] = {
                                    name: e[o].name,
                                    value: JSON.stringify(e[o].value)
                                }, null != e[o].start && (i[o].start = e[o].start, i[o].end = e[o].end);
                            else t.pre || (t.plain = !0)
                        }(h) : h.processed || (ar(h), function(t) {
                            var e = Oi(t, "v-if");
                            if (e) t.if = e, lr(t, {
                                exp: e,
                                block: t
                            });
                            else {
                                null != Oi(t, "v-else") && (t.else = !0);
                                var n = Oi(t, "v-else-if");
                                n && (t.elseif = n)
                            }
                        }(h), function(t) {
                            null != Oi(t, "v-once") && (t.once = !0)
                        }(h)), n || (n = h), r ? c(h) : (i = h, o.push(h))
                    },
                    end: function(t, e, n) {
                        var s = o[o.length - 1];
                        o.length -= 1, i = o[o.length - 1], c(s)
                    },
                    chars: function(t, e, n) {
                        if (i && (!z || "textarea" !== i.tag || i.attrsMap.placeholder !== t)) {
                            var o, c, d, u = i.children;
                            (t = l || t.trim() ? "script" === (o = i).tag || "style" === o.tag ? t : ir(t) : u.length ? r ? "condense" === r && er.test(t) ? "" : " " : s ? " " : "" : "") && (l || "condense" !== r || (t = t.replace(nr, " ")), !a && " " !== t && (c = function(t, e) {
                                var n = Vs ? ms(Vs) : us;
                                if (n.test(t)) {
                                    for (var i, o, s, r = [], a = [], l = n.lastIndex = 0; i = n.exec(t);) {
                                        (o = i.index) > l && (a.push(s = t.slice(l, o)), r.push(JSON.stringify(s)));
                                        var c = ki(i[1].trim());
                                        r.push("_s(" + c + ")"), a.push({
                                            "@binding": c
                                        }), l = o + i[0].length
                                    }
                                    return l < t.length && (a.push(s = t.slice(l)), r.push(JSON.stringify(s))), {
                                        expression: r.join("+"),
                                        tokens: a
                                    }
                                }
                            }(t)) ? d = {
                                type: 2,
                                expression: c.expression,
                                tokens: c.tokens,
                                text: t
                            } : " " === t && u.length && " " === u[u.length - 1].text || (d = {
                                type: 3,
                                text: t
                            }), d && u.push(d))
                        }
                    },
                    comment: function(t, e, n) {
                        if (i) {
                            var o = {
                                type: 3,
                                text: t,
                                isComment: !0
                            };
                            i.children.push(o)
                        }
                    }
                }), n
            }(t.trim(), e);
            !1 !== e.optimize && function(t, e) {
                t && (hr = br(e.staticKeys || ""), vr = e.isReservedTag || A, function t(e) {
                    if (e.static = function(t) {
                            return 2 !== t.type && (3 === t.type || !(!t.pre && (t.hasBindings || t.if || t.for || m(t.tag) || !vr(t.tag) || function(t) {
                                for (; t.parent;) {
                                    if ("template" !== (t = t.parent).tag) return !1;
                                    if (t.for) return !0
                                }
                                return !1
                            }(t) || !Object.keys(t).every(hr))))
                        }(e), 1 === e.type) {
                        if (!vr(e.tag) && "slot" !== e.tag && null == e.attrsMap["inline-template"]) return;
                        for (var n = 0, i = e.children.length; n < i; n++) {
                            var o = e.children[n];
                            t(o), o.static || (e.static = !1)
                        }
                        if (e.ifConditions)
                            for (var s = 1, r = e.ifConditions.length; s < r; s++) {
                                var a = e.ifConditions[s].block;
                                t(a), a.static || (e.static = !1)
                            }
                    }
                }(t), function t(e, n) {
                    if (1 === e.type) {
                        if ((e.static || e.once) && (e.staticInFor = n), e.static && e.children.length && (1 !== e.children.length || 3 !== e.children[0].type)) return void(e.staticRoot = !0);
                        if (e.staticRoot = !1, e.children)
                            for (var i = 0, o = e.children.length; i < o; i++) t(e.children[i], n || !!e.for);
                        if (e.ifConditions)
                            for (var s = 1, r = e.ifConditions.length; s < r; s++) t(e.ifConditions[s].block, n)
                    }
                }(t, !1))
            }(n, e);
            var i = Lr(n, e);
            return {
                ast: n,
                render: i.render,
                staticRenderFns: i.staticRenderFns
            }
        }, function(t) {
            function e(e, n) {
                var i = Object.create(t),
                    o = [],
                    s = [];
                if (n)
                    for (var r in n.modules && (i.modules = (t.modules || []).concat(n.modules)), n.directives && (i.directives = P(Object.create(t.directives || null), n.directives)), n) "modules" !== r && "directives" !== r && (i[r] = n[r]);
                i.warn = function(t, e, n) {
                    (n ? s : o).push(t)
                };
                var a = Ur(e.trim(), i);
                return a.errors = o, a.tips = s, a
            }
            return {
                compile: e,
                compileToFunctions: function(t) {
                    var e = Object.create(null);
                    return function(n, i, o) {
                        (i = P({}, i)).warn, delete i.warn;
                        var s = i.delimiters ? String(i.delimiters) + n : n;
                        if (e[s]) return e[s];
                        var r = t(n, i),
                            a = {},
                            l = [];
                        return a.render = Hr(r.render, l), a.staticRenderFns = r.staticRenderFns.map(function(t) {
                            return Hr(t, l)
                        }), e[s] = a
                    }
                }(e)
            }
        })(gr),
        Kr = (Qr.compile, Qr.compileToFunctions);

    function Yr(t) {
        return (zr = zr || document.createElement("div")).innerHTML = t ? '<a href="\n"/>' : '<div a="\n"/>', zr.innerHTML.indexOf("&#10;") > 0
    }
    var Xr = !!j && Yr(!1),
        Zr = !!j && Yr(!0),
        Jr = b(function(t) {
            var e = Kn(t);
            return e && e.innerHTML
        }),
        ta = Sn.prototype.$mount;
    return Sn.prototype.$mount = function(t, e) {
        if ((t = t && Kn(t)) === document.body || t === document.documentElement) return this;
        var n = this.$options;
        if (!n.render) {
            var i = n.template;
            if (i)
                if ("string" == typeof i) "#" === i.charAt(0) && (i = Jr(i));
                else {
                    if (!i.nodeType) return this;
                    i = i.innerHTML
                }
            else t && (i = function(t) {
                if (t.outerHTML) return t.outerHTML;
                var e = document.createElement("div");
                return e.appendChild(t.cloneNode(!0)), e.innerHTML
            }(t));
            if (i) {
                var o = Kr(i, {
                        outputSourceRange: !1,
                        shouldDecodeNewlines: Xr,
                        shouldDecodeNewlinesForHref: Zr,
                        delimiters: n.delimiters,
                        comments: n.comments
                    }, this),
                    s = o.render,
                    r = o.staticRenderFns;
                n.render = s, n.staticRenderFns = r
            }
        }
        return ta.call(this, t, e)
    }, Sn.compile = Kr, Sn
}),
function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.VueRouter = e()
}(this, function() {
    "use strict";

    function t(t) {
        return Object.prototype.toString.call(t).indexOf("Error") > -1
    }

    function e(t, e, i) {
        void 0 === e && (e = {});
        var o, s = i || n;
        try {
            o = s(t || "")
        } catch (t) {
            o = {}
        }
        for (var r in e) o[r] = e[r];
        return o
    }

    function n(t) {
        var e = {};
        return (t = t.trim().replace(/^(\?|#|&)/, "")) ? (t.split("&").forEach(function(t) {
            var n = t.replace(/\+/g, " ").split("="),
                i = rt(n.shift()),
                o = n.length > 0 ? rt(n.join("=")) : null;
            void 0 === e[i] ? e[i] = o : Array.isArray(e[i]) ? e[i].push(o) : e[i] = [e[i], o]
        }), e) : e
    }

    function i(t) {
        var e = t ? Object.keys(t).map(function(e) {
            var n = t[e];
            if (void 0 === n) return "";
            if (null === n) return st(e);
            if (Array.isArray(n)) {
                var i = [];
                return n.forEach(function(t) {
                    void 0 !== t && (null === t ? i.push(st(e)) : i.push(st(e) + "=" + st(t)))
                }), i.join("&")
            }
            return st(e) + "=" + st(n)
        }).filter(function(t) {
            return t.length > 0
        }).join("&") : null;
        return e ? "?" + e : ""
    }

    function o(t, e, n, i) {
        var o = i && i.options.stringifyQuery,
            a = e.query || {};
        try {
            a = s(a)
        } catch (t) {}
        var l = {
            name: e.name || t && t.name,
            meta: t && t.meta || {},
            path: e.path || "/",
            hash: e.hash || "",
            query: a,
            params: e.params || {},
            fullPath: r(e, o),
            matched: t ? function(t) {
                for (var e = []; t;) e.unshift(t), t = t.parent;
                return e
            }(t) : []
        };
        return n && (l.redirectedFrom = r(n, o)), Object.freeze(l)
    }

    function s(t) {
        if (Array.isArray(t)) return t.map(s);
        if (t && "object" == typeof t) {
            var e = {};
            for (var n in t) e[n] = s(t[n]);
            return e
        }
        return t
    }

    function r(t, e) {
        var n = t.path,
            o = t.query;
        void 0 === o && (o = {});
        var s = t.hash;
        return void 0 === s && (s = ""), (n || "/") + (e || i)(o) + s
    }

    function a(t, e) {
        return e === lt ? t === e : !!e && (t.path && e.path ? t.path.replace(at, "") === e.path.replace(at, "") && t.hash === e.hash && l(t.query, e.query) : !(!t.name || !e.name) && t.name === e.name && t.hash === e.hash && l(t.query, e.query) && l(t.params, e.params))
    }

    function l(t, e) {
        if (void 0 === t && (t = {}), void 0 === e && (e = {}), !t || !e) return t === e;
        var n = Object.keys(t),
            i = Object.keys(e);
        return n.length === i.length && n.every(function(n) {
            var i = t[n],
                o = e[n];
            return "object" == typeof i && "object" == typeof o ? l(i, o) : String(i) === String(o)
        })
    }

    function c(t) {
        if (!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey || t.defaultPrevented || void 0 !== t.button && 0 !== t.button)) {
            if (t.currentTarget && t.currentTarget.getAttribute) {
                var e = t.currentTarget.getAttribute("target");
                if (/\b_blank\b/i.test(e)) return
            }
            return t.preventDefault && t.preventDefault(), !0
        }
    }

    function d(t, e, n) {
        var i = t.charAt(0);
        if ("/" === i) return t;
        if ("?" === i || "#" === i) return e + t;
        var o = e.split("/");
        n && o[o.length - 1] || o.pop();
        for (var s = t.replace(/^\//, "").split("/"), r = 0; r < s.length; r++) {
            var a = s[r];
            ".." === a ? o.pop() : "." !== a && o.push(a)
        }
        return "" !== o[0] && o.unshift(""), o.join("/")
    }

    function u(t) {
        return t.replace(/\/\//g, "/")
    }

    function p(t, e) {
        for (var n, i = [], o = 0, s = 0, r = "", a = e && e.delimiter || "/"; null != (n = bt.exec(t));) {
            var l = n[0],
                c = n[1],
                d = n.index;
            if (r += t.slice(s, d), s = d + l.length, c) r += c[1];
            else {
                var u = t[s],
                    p = n[2],
                    m = n[3],
                    h = n[4],
                    v = n[5],
                    b = n[6],
                    y = n[7];
                r && (i.push(r), r = "");
                var C = null != p && null != u && u !== p,
                    S = "+" === b || "*" === b,
                    w = "?" === b || "*" === b,
                    k = n[2] || a,
                    x = h || v;
                i.push({
                    name: m || o++,
                    prefix: p || "",
                    delimiter: k,
                    optional: w,
                    repeat: S,
                    partial: C,
                    asterisk: !!y,
                    pattern: x ? g(x) : y ? ".*" : "[^" + f(k) + "]+?"
                })
            }
        }
        return s < t.length && (r += t.substr(s)), r && i.push(r), i
    }

    function m(t) {
        return encodeURI(t).replace(/[\/?#]/g, function(t) {
            return "%" + t.charCodeAt(0).toString(16).toUpperCase()
        })
    }

    function h(t) {
        return encodeURI(t).replace(/[?#]/g, function(t) {
            return "%" + t.charCodeAt(0).toString(16).toUpperCase()
        })
    }

    function v(t) {
        for (var e = new Array(t.length), n = 0; n < t.length; n++) "object" == typeof t[n] && (e[n] = new RegExp("^(?:" + t[n].pattern + ")$"));
        return function(n, i) {
            for (var o = "", s = n || {}, r = (i || {}).pretty ? m : encodeURIComponent, a = 0; a < t.length; a++) {
                var l = t[a];
                if ("string" != typeof l) {
                    var c, d = s[l.name];
                    if (null == d) {
                        if (l.optional) {
                            l.partial && (o += l.prefix);
                            continue
                        }
                        throw new TypeError('Expected "' + l.name + '" to be defined')
                    }
                    if (mt(d)) {
                        if (!l.repeat) throw new TypeError('Expected "' + l.name + '" to not repeat, but received `' + JSON.stringify(d) + "`");
                        if (0 === d.length) {
                            if (l.optional) continue;
                            throw new TypeError('Expected "' + l.name + '" to not be empty')
                        }
                        for (var u = 0; u < d.length; u++) {
                            if (c = r(d[u]), !e[a].test(c)) throw new TypeError('Expected all "' + l.name + '" to match "' + l.pattern + '", but received `' + JSON.stringify(c) + "`");
                            o += (0 === u ? l.prefix : l.delimiter) + c
                        }
                    } else {
                        if (c = l.asterisk ? h(d) : r(d), !e[a].test(c)) throw new TypeError('Expected "' + l.name + '" to match "' + l.pattern + '", but received "' + c + '"');
                        o += l.prefix + c
                    }
                } else o += l
            }
            return o
        }
    }

    function f(t) {
        return t.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1")
    }

    function g(t) {
        return t.replace(/([=!:$\/()])/g, "\\$1")
    }

    function b(t, e) {
        return t.keys = e, t
    }

    function y(t) {
        return t.sensitive ? "" : "i"
    }

    function C(t, e, n) {
        mt(e) || (n = e || n, e = []);
        for (var i = (n = n || {}).strict, o = !1 !== n.end, s = "", r = 0; r < t.length; r++) {
            var a = t[r];
            if ("string" == typeof a) s += f(a);
            else {
                var l = f(a.prefix),
                    c = "(?:" + a.pattern + ")";
                e.push(a), a.repeat && (c += "(?:" + l + c + ")*"), s += c = a.optional ? a.partial ? l + "(" + c + ")?" : "(?:" + l + "(" + c + "))?" : l + "(" + c + ")"
            }
        }
        var d = f(n.delimiter || "/"),
            u = s.slice(-d.length) === d;
        return i || (s = (u ? s.slice(0, -d.length) : s) + "(?:" + d + "(?=$))?"), s += o ? "$" : i && u ? "" : "(?=" + d + "|$)", b(new RegExp("^" + s, y(n)), e)
    }

    function S(t, e, n) {
        return mt(e) || (n = e || n, e = []), n = n || {}, t instanceof RegExp ? function(t, e) {
            var n = t.source.match(/\((?!\?)/g);
            if (n)
                for (var i = 0; i < n.length; i++) e.push({
                    name: i,
                    prefix: null,
                    delimiter: null,
                    optional: !1,
                    repeat: !1,
                    partial: !1,
                    asterisk: !1,
                    pattern: null
                });
            return b(t, e)
        }(t, e) : mt(t) ? function(t, e, n) {
            for (var i = [], o = 0; o < t.length; o++) i.push(S(t[o], e, n).source);
            return b(new RegExp("(?:" + i.join("|") + ")", y(n)), e)
        }(t, e, n) : function(t, e, n) {
            return C(p(t, n), e, n)
        }(t, e, n)
    }

    function w(t, e, n) {
        try {
            return (yt[t] || (yt[t] = ht.compile(t)))(e || {}, {
                pretty: !0
            })
        } catch (t) {
            return ""
        }
    }

    function k(t, e, n, i) {
        var o = e || [],
            s = n || Object.create(null),
            r = i || Object.create(null);
        t.forEach(function(t) {
            ! function t(e, n, i, o, s, r) {
                var a = o.path,
                    l = o.name,
                    c = o.pathToRegexpOptions || {},
                    d = function(t, e, n) {
                        return n || (t = t.replace(/\/$/, "")), "/" === t[0] ? t : null == e ? t : u(e.path + "/" + t)
                    }(a, s, c.strict);
                "boolean" == typeof o.caseSensitive && (c.sensitive = o.caseSensitive);
                var p = {
                    path: d,
                    regex: function(t, e) {
                        return ht(t, [], e)
                    }(d, c),
                    components: o.components || {
                        default: o.component
                    },
                    instances: {},
                    name: l,
                    parent: s,
                    matchAs: r,
                    redirect: o.redirect,
                    beforeEnter: o.beforeEnter,
                    meta: o.meta || {},
                    props: null == o.props ? {} : o.components ? o.props : {
                        default: o.props
                    }
                };
                o.children && o.children.forEach(function(o) {
                    var s = r ? u(r + "/" + o.path) : void 0;
                    t(e, n, i, o, p, s)
                }), void 0 !== o.alias && (Array.isArray(o.alias) ? o.alias : [o.alias]).forEach(function(r) {
                    var a = {
                        path: r,
                        children: o.children
                    };
                    t(e, n, i, a, s, p.path || "/")
                }), n[p.path] || (e.push(p.path), n[p.path] = p), l && (i[l] || (i[l] = p))
            }(o, s, r, t)
        });
        for (var a = 0, l = o.length; a < l; a++) "*" === o[a] && (o.push(o.splice(a, 1)[0]), l--, a--);
        return {
            pathList: o,
            pathMap: s,
            nameMap: r
        }
    }

    function x(t, n, i, o) {
        var s = "string" == typeof t ? {
            path: t
        } : t;
        if (s.name || s._normalized) return s;
        if (!s.path && s.params && n) {
            (s = T({}, s))._normalized = !0;
            var r = T(T({}, n.params), s.params);
            if (n.name) s.name = n.name, s.params = r;
            else if (n.matched.length) {
                var a = n.matched[n.matched.length - 1].path;
                s.path = w(a, r, n.path)
            }
            return s
        }
        var l = function(t) {
                var e = "",
                    n = "",
                    i = t.indexOf("#");
                i >= 0 && (e = t.slice(i), t = t.slice(0, i));
                var o = t.indexOf("?");
                return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), {
                    path: t,
                    query: n,
                    hash: e
                }
            }(s.path || ""),
            c = n && n.path || "/",
            u = l.path ? d(l.path, c, i || s.append) : c,
            p = e(l.query, s.query, o && o.options.parseQuery),
            m = s.hash || l.hash;
        return m && "#" !== m.charAt(0) && (m = "#" + m), {
            _normalized: !0,
            path: u,
            query: p,
            hash: m
        }
    }

    function T(t, e) {
        for (var n in e) t[n] = e[n];
        return t
    }

    function P(t, e) {
        function n(t, n, i) {
            var o = x(t, n, !1, e),
                s = o.name;
            if (s) {
                var a = u[s];
                if (!a) return r(null, o);
                var d = a.regex.keys.filter(function(t) {
                    return !t.optional
                }).map(function(t) {
                    return t.name
                });
                if ("object" != typeof o.params && (o.params = {}), n && "object" == typeof n.params)
                    for (var p in n.params) !(p in o.params) && d.indexOf(p) > -1 && (o.params[p] = n.params[p]);
                if (a) return o.path = w(a.path, o.params), r(a, o, i)
            } else if (o.path) {
                o.params = {};
                for (var m = 0; m < l.length; m++) {
                    var h = l[m],
                        v = c[h];
                    if (I(v.regex, o.path, o.params)) return r(v, o, i)
                }
            }
            return r(null, o)
        }

        function i(t, i) {
            var s = t.redirect,
                a = "function" == typeof s ? s(o(t, i, null, e)) : s;
            if ("string" == typeof a && (a = {
                    path: a
                }), !a || "object" != typeof a) return r(null, i);
            var l = a,
                c = l.name,
                u = l.path,
                p = i.query,
                m = i.hash,
                h = i.params;
            if (p = l.hasOwnProperty("query") ? l.query : p, m = l.hasOwnProperty("hash") ? l.hash : m, h = l.hasOwnProperty("params") ? l.params : h, c) return n({
                _normalized: !0,
                name: c,
                query: p,
                hash: m,
                params: h
            }, void 0, i);
            if (u) {
                var v = function(t, e) {
                    return d(t, e.parent ? e.parent.path : "/", !0)
                }(u, t);
                return n({
                    _normalized: !0,
                    path: w(v, h),
                    query: p,
                    hash: m
                }, void 0, i)
            }
            return r(null, i)
        }

        function s(t, e, i) {
            var o = n({
                _normalized: !0,
                path: w(i, e.params)
            });
            if (o) {
                var s = o.matched,
                    a = s[s.length - 1];
                return e.params = o.params, r(a, e)
            }
            return r(null, e)
        }

        function r(t, n, r) {
            return t && t.redirect ? i(t, r || n) : t && t.matchAs ? s(0, n, t.matchAs) : o(t, n, r, e)
        }
        var a = k(t),
            l = a.pathList,
            c = a.pathMap,
            u = a.nameMap;
        return {
            match: n,
            addRoutes: function(t) {
                k(t, l, c, u)
            }
        }
    }

    function I(t, e, n) {
        var i = e.match(t);
        if (!i) return !1;
        if (!n) return !0;
        for (var o = 1, s = i.length; o < s; ++o) {
            var r = t.keys[o - 1],
                a = "string" == typeof i[o] ? decodeURIComponent(i[o]) : i[o];
            r && (n[r.name] = a)
        }
        return !0
    }

    function E() {
        window.history.replaceState({
            key: _()
        }, ""), window.addEventListener("popstate", function(t) {
            F(), t.state && t.state.key && function(t) {
                kt = t
            }(t.state.key)
        })
    }

    function A(t, e, n, i) {
        if (t.app) {
            var o = t.options.scrollBehavior;
            o && t.app.$nextTick(function() {
                var t = function() {
                        var t = _();
                        if (t) return Ct[t]
                    }(),
                    s = o(e, n, i ? t : null);
                s && ("function" == typeof s.then ? s.then(function(e) {
                    O(e, t)
                }).catch(function(t) {}) : O(s, t))
            })
        }
    }

    function F() {
        var t = _();
        t && (Ct[t] = {
            x: window.pageXOffset,
            y: window.pageYOffset
        })
    }

    function L(t) {
        return N(t.x) || N(t.y)
    }

    function G(t) {
        return {
            x: N(t.x) ? t.x : window.pageXOffset,
            y: N(t.y) ? t.y : window.pageYOffset
        }
    }

    function N(t) {
        return "number" == typeof t
    }

    function O(t, e) {
        var n = "object" == typeof t;
        if (n && "string" == typeof t.selector) {
            var i = document.querySelector(t.selector);
            if (i) {
                var o = t.offset && "object" == typeof t.offset ? t.offset : {};
                e = function(t, e) {
                    var n = document.documentElement.getBoundingClientRect(),
                        i = t.getBoundingClientRect();
                    return {
                        x: i.left - n.left - e.x,
                        y: i.top - n.top - e.y
                    }
                }(i, o = function(t) {
                    return {
                        x: N(t.x) ? t.x : 0,
                        y: N(t.y) ? t.y : 0
                    }
                }(o))
            } else L(t) && (e = G(t))
        } else n && L(t) && (e = G(t));
        e && window.scrollTo(e.x, e.y)
    }

    function D() {
        return wt.now().toFixed(3)
    }

    function _() {
        return kt
    }

    function B(t, e) {
        F();
        var n = window.history;
        try {
            e ? n.replaceState({
                key: kt
            }, "", t) : (kt = D(), n.pushState({
                key: kt
            }, "", t))
        } catch (n) {
            window.location[e ? "replace" : "assign"](t)
        }
    }

    function V(t) {
        B(t, !0)
    }

    function $(t, e, n) {
        var i = function(o) {
            o >= t.length ? n() : t[o] ? e(t[o], function() {
                i(o + 1)
            }) : i(o + 1)
        };
        i(0)
    }

    function M(e) {
        return function(n, i, o) {
            var s = !1,
                r = 0,
                a = null;
            W(e, function(e, n, i, l) {
                if ("function" == typeof e && void 0 === e.cid) {
                    s = !0, r++;
                    var c, d = j(function(t) {
                            (function(t) {
                                return t.__esModule || xt && "Module" === t[Symbol.toStringTag]
                            })(t) && (t = t.default), e.resolved = "function" == typeof t ? t : tt.extend(t), i.components[l] = t, --r <= 0 && o()
                        }),
                        u = j(function(e) {
                            var n = "Failed to resolve async component " + l + ": " + e;
                            a || (a = t(e) ? e : new Error(n), o(a))
                        });
                    try {
                        c = e(d, u)
                    } catch (e) {
                        u(e)
                    }
                    if (c)
                        if ("function" == typeof c.then) c.then(d, u);
                        else {
                            var p = c.component;
                            p && "function" == typeof p.then && p.then(d, u)
                        }
                }
            }), s || o()
        }
    }

    function W(t, e) {
        return R(t.map(function(t) {
            return Object.keys(t.components).map(function(n) {
                return e(t.components[n], t.instances[n], t, n)
            })
        }))
    }

    function R(t) {
        return Array.prototype.concat.apply([], t)
    }

    function j(t) {
        var e = !1;
        return function() {
            for (var n = [], i = arguments.length; i--;) n[i] = arguments[i];
            if (!e) return e = !0, t.apply(this, n)
        }
    }

    function q(t, e, n, i) {
        var o = W(t, function(t, i, o, s) {
            var r = function(t, e) {
                return "function" != typeof t && (t = tt.extend(t)), t.options[e]
            }(t, e);
            if (r) return Array.isArray(r) ? r.map(function(t) {
                return n(t, i, o, s)
            }) : n(r, i, o, s)
        });
        return R(i ? o.reverse() : o)
    }

    function H(t, e) {
        if (e) return function() {
            return t.apply(e, arguments)
        }
    }

    function U(t, e, n) {
        return q(t, "beforeRouteEnter", function(t, i, o, s) {
            return function(t, e, n, i, o) {
                return function(s, r, a) {
                    return t(s, r, function(t) {
                        a(t), "function" == typeof t && i.push(function() {
                            ! function t(e, n, i, o) {
                                n[i] ? e(n[i]) : o() && setTimeout(function() {
                                    t(e, n, i, o)
                                }, 16)
                            }(t, e.instances, n, o)
                        })
                    })
                }
            }(t, o, s, e, n)
        })
    }

    function z(t) {
        var e = window.location.pathname;
        return t && 0 === e.indexOf(t) && (e = e.slice(t.length)), (e || "/") + window.location.search + window.location.hash
    }

    function Q() {
        var t = K();
        return "/" === t.charAt(0) || (Z("/" + t), !1)
    }

    function K() {
        var t = window.location.href,
            e = t.indexOf("#");
        return -1 === e ? "" : t.slice(e + 1)
    }

    function Y(t) {
        var e = window.location.href,
            n = e.indexOf("#");
        return (n >= 0 ? e.slice(0, n) : e) + "#" + t
    }

    function X(t) {
        St ? B(Y(t)) : window.location.hash = t
    }

    function Z(t) {
        St ? V(Y(t)) : window.location.replace(Y(t))
    }

    function J(t, e) {
        return t.push(e),
            function() {
                var n = t.indexOf(e);
                n > -1 && t.splice(n, 1)
            }
    }
    var tt, et = {
            name: "router-view",
            functional: !0,
            props: {
                name: {
                    type: String,
                    default: "default"
                }
            },
            render: function(t, e) {
                var n = e.props,
                    i = e.children,
                    o = e.parent,
                    s = e.data;
                s.routerView = !0;
                for (var r = o.$createElement, a = n.name, l = o.$route, c = o._routerViewCache || (o._routerViewCache = {}), d = 0, u = !1; o && o._routerRoot !== o;) o.$vnode && o.$vnode.data.routerView && d++, o._inactive && (u = !0), o = o.$parent;
                if (s.routerViewDepth = d, u) return r(c[a], s, i);
                var p = l.matched[d];
                if (!p) return c[a] = null, r();
                var m = c[a] = p.components[a];
                s.registerRouteInstance = function(t, e) {
                    var n = p.instances[a];
                    (e && n !== t || !e && n === t) && (p.instances[a] = e)
                }, (s.hook || (s.hook = {})).prepatch = function(t, e) {
                    p.instances[a] = e.componentInstance
                };
                var h = s.props = function(t, e) {
                    switch (typeof e) {
                        case "undefined":
                            return;
                        case "object":
                            return e;
                        case "function":
                            return e(t);
                        case "boolean":
                            return e ? t.params : void 0
                    }
                }(l, p.props && p.props[a]);
                if (h) {
                    h = s.props = function(t, e) {
                        for (var n in e) t[n] = e[n];
                        return t
                    }({}, h);
                    var v = s.attrs = s.attrs || {};
                    for (var f in h) m.props && f in m.props || (v[f] = h[f], delete h[f])
                }
                return r(m, s, i)
            }
        },
        nt = /[!'()*]/g,
        it = function(t) {
            return "%" + t.charCodeAt(0).toString(16)
        },
        ot = /%2C/g,
        st = function(t) {
            return encodeURIComponent(t).replace(nt, it).replace(ot, ",")
        },
        rt = decodeURIComponent,
        at = /\/?$/,
        lt = o(null, {
            path: "/"
        }),
        ct = [String, Object],
        dt = [String, Array],
        ut = {
            name: "router-link",
            props: {
                to: {
                    type: ct,
                    required: !0
                },
                tag: {
                    type: String,
                    default: "a"
                },
                exact: Boolean,
                append: Boolean,
                replace: Boolean,
                activeClass: String,
                exactActiveClass: String,
                event: {
                    type: dt,
                    default: "click"
                }
            },
            render: function(t) {
                var e = this,
                    n = this.$router,
                    i = this.$route,
                    s = n.resolve(this.to, i, this.append),
                    r = s.location,
                    l = s.route,
                    d = s.href,
                    u = {},
                    p = n.options.linkActiveClass,
                    m = n.options.linkExactActiveClass,
                    h = null == p ? "router-link-active" : p,
                    v = null == m ? "router-link-exact-active" : m,
                    f = null == this.activeClass ? h : this.activeClass,
                    g = null == this.exactActiveClass ? v : this.exactActiveClass,
                    b = r.path ? o(null, r, null, n) : l;
                u[g] = a(i, b), u[f] = this.exact ? u[g] : function(t, e) {
                    return 0 === t.path.replace(at, "/").indexOf(e.path.replace(at, "/")) && (!e.hash || t.hash === e.hash) && function(t, e) {
                        for (var n in e)
                            if (!(n in t)) return !1;
                        return !0
                    }(t.query, e.query)
                }(i, b);
                var y = function(t) {
                        c(t) && (e.replace ? n.replace(r) : n.push(r))
                    },
                    C = {
                        click: c
                    };
                Array.isArray(this.event) ? this.event.forEach(function(t) {
                    C[t] = y
                }) : C[this.event] = y;
                var S = {
                    class: u
                };
                if ("a" === this.tag) S.on = C, S.attrs = {
                    href: d
                };
                else {
                    var w = function t(e) {
                        if (e)
                            for (var n, i = 0; i < e.length; i++) {
                                if ("a" === (n = e[i]).tag) return n;
                                if (n.children && (n = t(n.children))) return n
                            }
                    }(this.$slots.default);
                    if (w) {
                        w.isStatic = !1;
                        var k = tt.util.extend;
                        (w.data = k({}, w.data)).on = C, (w.data.attrs = k({}, w.data.attrs)).href = d
                    } else S.on = C
                }
                return t(this.tag, S, this.$slots.default)
            }
        },
        pt = "undefined" != typeof window,
        mt = Array.isArray || function(t) {
            return "[object Array]" == Object.prototype.toString.call(t)
        },
        ht = S,
        vt = p,
        ft = v,
        gt = C,
        bt = new RegExp(["(\\\\.)", "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"), "g");
    ht.parse = vt, ht.compile = function(t, e) {
        return v(p(t, e))
    }, ht.tokensToFunction = ft, ht.tokensToRegExp = gt;
    var yt = Object.create(null),
        Ct = Object.create(null),
        St = pt && function() {
            var t = window.navigator.userAgent;
            return (-1 === t.indexOf("Android 2.") && -1 === t.indexOf("Android 4.0") || -1 === t.indexOf("Mobile Safari") || -1 !== t.indexOf("Chrome") || -1 !== t.indexOf("Windows Phone")) && window.history && "pushState" in window.history
        }(),
        wt = pt && window.performance && window.performance.now ? window.performance : Date,
        kt = D(),
        xt = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag,
        Tt = function(t, e) {
            this.router = t, this.base = function(t) {
                if (!t)
                    if (pt) {
                        var e = document.querySelector("base");
                        t = (t = e && e.getAttribute("href") || "/").replace(/^https?:\/\/[^\/]+/, "")
                    } else t = "/";
                return "/" !== t.charAt(0) && (t = "/" + t), t.replace(/\/$/, "")
            }(e), this.current = lt, this.pending = null, this.ready = !1, this.readyCbs = [], this.readyErrorCbs = [], this.errorCbs = []
        };
    Tt.prototype.listen = function(t) {
        this.cb = t
    }, Tt.prototype.onReady = function(t, e) {
        this.ready ? t() : (this.readyCbs.push(t), e && this.readyErrorCbs.push(e))
    }, Tt.prototype.onError = function(t) {
        this.errorCbs.push(t)
    }, Tt.prototype.transitionTo = function(t, e, n) {
        var i = this,
            o = this.router.match(t, this.current);
        this.confirmTransition(o, function() {
            i.updateRoute(o), e && e(o), i.ensureURL(), i.ready || (i.ready = !0, i.readyCbs.forEach(function(t) {
                t(o)
            }))
        }, function(t) {
            n && n(t), t && !i.ready && (i.ready = !0, i.readyErrorCbs.forEach(function(e) {
                e(t)
            }))
        })
    }, Tt.prototype.confirmTransition = function(e, n, i) {
        var o = this,
            s = this.current,
            r = function(e) {
                t(e) && (o.errorCbs.length ? o.errorCbs.forEach(function(t) {
                    t(e)
                }) : console.error(e)), i && i(e)
            };
        if (a(e, s) && e.matched.length === s.matched.length) return this.ensureURL(), r();
        var l = function(t, e) {
                var n, i = Math.max(t.length, e.length);
                for (n = 0; n < i && t[n] === e[n]; n++);
                return {
                    updated: e.slice(0, n),
                    activated: e.slice(n),
                    deactivated: t.slice(n)
                }
            }(this.current.matched, e.matched),
            c = l.updated,
            d = l.deactivated,
            u = l.activated,
            p = [].concat(function(t) {
                return q(t, "beforeRouteLeave", H, !0)
            }(d), this.router.beforeHooks, function(t) {
                return q(t, "beforeRouteUpdate", H)
            }(c), u.map(function(t) {
                return t.beforeEnter
            }), M(u));
        this.pending = e;
        var m = function(n, i) {
            if (o.pending !== e) return r();
            try {
                n(e, s, function(e) {
                    !1 === e || t(e) ? (o.ensureURL(!0), r(e)) : "string" == typeof e || "object" == typeof e && ("string" == typeof e.path || "string" == typeof e.name) ? (r(), "object" == typeof e && e.replace ? o.replace(e) : o.push(e)) : i(e)
                })
            } catch (n) {
                r(n)
            }
        };
        $(p, m, function() {
            var t = [];
            $(U(u, t, function() {
                return o.current === e
            }).concat(o.router.resolveHooks), m, function() {
                if (o.pending !== e) return r();
                o.pending = null, n(e), o.router.app && o.router.app.$nextTick(function() {
                    t.forEach(function(t) {
                        t()
                    })
                })
            })
        })
    }, Tt.prototype.updateRoute = function(t) {
        var e = this.current;
        this.current = t, this.cb && this.cb(t), this.router.afterHooks.forEach(function(n) {
            n && n(t, e)
        })
    };
    var Pt = function(t) {
            function e(e, n) {
                var i = this;
                t.call(this, e, n);
                var o = e.options.scrollBehavior;
                o && E();
                var s = z(this.base);
                window.addEventListener("popstate", function(t) {
                    var n = i.current,
                        r = z(i.base);
                    i.current === lt && r === s || i.transitionTo(r, function(t) {
                        o && A(e, t, n, !0)
                    })
                })
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.go = function(t) {
                window.history.go(t)
            }, e.prototype.push = function(t, e, n) {
                var i = this,
                    o = this.current;
                this.transitionTo(t, function(t) {
                    B(u(i.base + t.fullPath)), A(i.router, t, o, !1), e && e(t)
                }, n)
            }, e.prototype.replace = function(t, e, n) {
                var i = this,
                    o = this.current;
                this.transitionTo(t, function(t) {
                    V(u(i.base + t.fullPath)), A(i.router, t, o, !1), e && e(t)
                }, n)
            }, e.prototype.ensureURL = function(t) {
                if (z(this.base) !== this.current.fullPath) {
                    var e = u(this.base + this.current.fullPath);
                    t ? B(e) : V(e)
                }
            }, e.prototype.getCurrentLocation = function() {
                return z(this.base)
            }, e
        }(Tt),
        It = function(t) {
            function e(e, n, i) {
                t.call(this, e, n), i && function(t) {
                    var e = z(t);
                    if (!/^\/#/.test(e)) return window.location.replace(u(t + "/#" + e)), !0
                }(this.base) || Q()
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.setupListeners = function() {
                var t = this,
                    e = this.router.options.scrollBehavior,
                    n = St && e;
                n && E(), window.addEventListener(St ? "popstate" : "hashchange", function() {
                    var e = t.current;
                    Q() && t.transitionTo(K(), function(i) {
                        n && A(t.router, i, e, !0), St || Z(i.fullPath)
                    })
                })
            }, e.prototype.push = function(t, e, n) {
                var i = this,
                    o = this.current;
                this.transitionTo(t, function(t) {
                    X(t.fullPath), A(i.router, t, o, !1), e && e(t)
                }, n)
            }, e.prototype.replace = function(t, e, n) {
                var i = this,
                    o = this.current;
                this.transitionTo(t, function(t) {
                    Z(t.fullPath), A(i.router, t, o, !1), e && e(t)
                }, n)
            }, e.prototype.go = function(t) {
                window.history.go(t)
            }, e.prototype.ensureURL = function(t) {
                var e = this.current.fullPath;
                K() !== e && (t ? X(e) : Z(e))
            }, e.prototype.getCurrentLocation = function() {
                return K()
            }, e
        }(Tt),
        Et = function(t) {
            function e(e, n) {
                t.call(this, e, n), this.stack = [], this.index = -1
            }
            return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.push = function(t, e, n) {
                var i = this;
                this.transitionTo(t, function(t) {
                    i.stack = i.stack.slice(0, i.index + 1).concat(t), i.index++, e && e(t)
                }, n)
            }, e.prototype.replace = function(t, e, n) {
                var i = this;
                this.transitionTo(t, function(t) {
                    i.stack = i.stack.slice(0, i.index).concat(t), e && e(t)
                }, n)
            }, e.prototype.go = function(t) {
                var e = this,
                    n = this.index + t;
                if (!(n < 0 || n >= this.stack.length)) {
                    var i = this.stack[n];
                    this.confirmTransition(i, function() {
                        e.index = n, e.updateRoute(i)
                    })
                }
            }, e.prototype.getCurrentLocation = function() {
                var t = this.stack[this.stack.length - 1];
                return t ? t.fullPath : "/"
            }, e.prototype.ensureURL = function() {}, e
        }(Tt),
        At = function(t) {
            void 0 === t && (t = {}), this.app = null, this.apps = [], this.options = t, this.beforeHooks = [], this.resolveHooks = [], this.afterHooks = [], this.matcher = P(t.routes || [], this);
            var e = t.mode || "hash";
            switch (this.fallback = "history" === e && !St && !1 !== t.fallback, this.fallback && (e = "hash"), pt || (e = "abstract"), this.mode = e, e) {
                case "history":
                    this.history = new Pt(this, t.base);
                    break;
                case "hash":
                    this.history = new It(this, t.base, this.fallback);
                    break;
                case "abstract":
                    this.history = new Et(this, t.base)
            }
        },
        Ft = {
            currentRoute: {
                configurable: !0
            }
        };
    return At.prototype.match = function(t, e, n) {
        return this.matcher.match(t, e, n)
    }, Ft.currentRoute.get = function() {
        return this.history && this.history.current
    }, At.prototype.init = function(t) {
        var e = this;
        if (this.apps.push(t), !this.app) {
            this.app = t;
            var n = this.history;
            if (n instanceof Pt) n.transitionTo(n.getCurrentLocation());
            else if (n instanceof It) {
                var i = function() {
                    n.setupListeners()
                };
                n.transitionTo(n.getCurrentLocation(), i, i)
            }
            n.listen(function(t) {
                e.apps.forEach(function(e) {
                    e._route = t
                })
            })
        }
    }, At.prototype.beforeEach = function(t) {
        return J(this.beforeHooks, t)
    }, At.prototype.beforeResolve = function(t) {
        return J(this.resolveHooks, t)
    }, At.prototype.afterEach = function(t) {
        return J(this.afterHooks, t)
    }, At.prototype.onReady = function(t, e) {
        this.history.onReady(t, e)
    }, At.prototype.onError = function(t) {
        this.history.onError(t)
    }, At.prototype.push = function(t, e, n) {
        this.history.push(t, e, n)
    }, At.prototype.replace = function(t, e, n) {
        this.history.replace(t, e, n)
    }, At.prototype.go = function(t) {
        this.history.go(t)
    }, At.prototype.back = function() {
        this.go(-1)
    }, At.prototype.forward = function() {
        this.go(1)
    }, At.prototype.getMatchedComponents = function(t) {
        var e = t ? t.matched ? t : this.resolve(t).route : this.currentRoute;
        return e ? [].concat.apply([], e.matched.map(function(t) {
            return Object.keys(t.components).map(function(e) {
                return t.components[e]
            })
        })) : []
    }, At.prototype.resolve = function(t, e, n) {
        var i = x(t, e || this.history.current, n, this),
            o = this.match(i, e),
            s = o.redirectedFrom || o.fullPath;
        return {
            location: i,
            route: o,
            href: function(t, e, n) {
                var i = "hash" === n ? "#" + e : e;
                return t ? u(t + "/" + i) : i
            }(this.history.base, s, this.mode),
            normalizedTo: i,
            resolved: o
        }
    }, At.prototype.addRoutes = function(t) {
        this.matcher.addRoutes(t), this.history.current !== lt && this.history.transitionTo(this.history.getCurrentLocation())
    }, Object.defineProperties(At.prototype, Ft), At.install = function t(e) {
        if (!t.installed || tt !== e) {
            t.installed = !0, tt = e;
            var n = function(t) {
                    return void 0 !== t
                },
                i = function(t, e) {
                    var i = t.$options._parentVnode;
                    n(i) && n(i = i.data) && n(i = i.registerRouteInstance) && i(t, e)
                };
            e.mixin({
                beforeCreate: function() {
                    n(this.$options.router) ? (this._routerRoot = this, this._router = this.$options.router, this._router.init(this), e.util.defineReactive(this, "_route", this._router.history.current)) : this._routerRoot = this.$parent && this.$parent._routerRoot || this, i(this, this)
                },
                destroyed: function() {
                    i(this)
                }
            }), Object.defineProperty(e.prototype, "$router", {
                get: function() {
                    return this._routerRoot._router
                }
            }), Object.defineProperty(e.prototype, "$route", {
                get: function() {
                    return this._routerRoot._route
                }
            }), e.component("router-view", et), e.component("router-link", ut);
            var o = e.config.optionMergeStrategies;
            o.beforeRouteEnter = o.beforeRouteLeave = o.beforeRouteUpdate = o.created
        }
    }, At.version = "3.0.1", pt && window.Vue && window.Vue.use(At), At
}), (resource = resource || {}).frontCurrencies = {
    AED: {
        name: "United Arab Emirates Dirham",
        symbol: "د.إ",
        abbreviation: "AED",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    AUD: {
        name: "Australian Dollar",
        symbol: "A$",
        abbreviation: "AUD",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    BGN: {
        name: "Bulgarian Lev",
        symbol: "Лв",
        abbreviation: "BGN",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 1,
        separator: "."
    },
    BRL: {
        name: "Brazilian Real",
        symbol: "R$",
        abbreviation: "BRL",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    CAD: {
        name: "Canadian Dollar",
        symbol: "C$",
        abbreviation: "CAD",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    CHF: {
        name: "Swiss Franc",
        symbol: "fr.",
        abbreviation: "CHF",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: ","
    },
    CLP: {
        name: "Chilean Peso",
        symbol: "$",
        abbreviation: "CLP",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    },
    COP: {
        name: "Colombian Peso",
        symbol: "$",
        abbreviation: "COP",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    },
    CRC: {
        name: "Costa Rican Colon",
        symbol: "₡",
        abbreviation: "CRC",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    },
    CVE: {
        name: "Cape Verde Escudo",
        symbol: "$",
        abbreviation: "CVE",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    },
    CZK: {
        name: "Czech Koruna",
        symbol: "Kč",
        abbreviation: "CZK",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: ","
    },
    DKK: {
        name: "krone",
        symbol: "kr",
        abbreviation: "DKK",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    DZD: {
        name: "Algerian Dinar",
        symbol: "دج",
        abbreviation: "DZD",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    EGP: {
        name: "Egyptian Pound",
        symbol: "£",
        abbreviation: "EGP",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    EUR: {
        name: "Euro",
        symbol: "€",
        abbreviation: "EURO",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    GBP: {
        name: "British Pound",
        symbol: "£",
        abbreviation: "GBP",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    HKD: {
        name: "Hong Kong Dollar",
        symbol: "HK$",
        abbreviation: "HKD",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    },
    IDR: {
        name: " Indonesian Rupiah",
        symbol: "Rp",
        abbreviation: "IDR",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    INR: {
        name: "Indian Rupee",
        symbol: "₹",
        abbreviation: "INR",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    ISK: {
        name: "Icelandic Króna",
        symbol: "kr",
        abbreviation: "ISK",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: ","
    },
    JMD: {
        name: "Jamaican Dollar",
        symbol: "$",
        abbreviation: "JMD",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    JPY: {
        name: "Japanese Yen",
        symbol: "¥",
        abbreviation: "JPY",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    KES: {
        name: "Kenyan Shilling",
        symbol: "KSh",
        abbreviation: "KES",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    KRW: {
        name: "Korean Won",
        symbol: "₩",
        abbreviation: "KRW",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    MAD: {
        name: "Moroccan Dirham",
        symbol: "DH",
        abbreviation: "MAD",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    MDL: {
        name: "Moldovan Leu",
        symbol: "MDL",
        abbreviation: "MDL",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    MNT: {
        name: "Mongolian Tugrik",
        symbol: "₮",
        abbreviation: "MNT",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: ","
    },
    MXN: {
        name: "Mexican Peso",
        symbol: "Mex$",
        abbreviation: "MXN",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    MYR: {
        name: "Malaysian Ringgit",
        symbol: "RM",
        abbreviation: "MYR",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    NGN: {
        name: "Nigerian Naira",
        symbol: "₦",
        abbreviation: "NGN",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    NOK: {
        name: "Norwegian Krone",
        symbol: "kr",
        abbreviation: "NOK",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: ","
    },
    NZD: {
        name: "New Zealand Dollar",
        symbol: "$",
        abbreviation: "NZD",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    PEN: {
        name: "Peruvian Sol",
        symbol: "S/",
        abbreviation: "PEN",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    PHP: {
        name: "Philippine Peso",
        symbol: "₱",
        abbreviation: "PHP",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    PLN: {
        name: "Polish Zloty",
        symbol: "zł",
        abbreviation: "PLN",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    RSD: {
        name: "Serbian Dinar",
        symbol: "Дин.",
        abbreviation: "RSD",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 2,
        separator: ","
    },
    RUB: {
        name: "Russian Ruble",
        symbol: "₽",
        abbreviation: "RUB",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    SAR: {
        name: "Saudi Riyal",
        symbol: "﷼",
        abbreviation: "SAR",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    SEK: {
        name: "kronor",
        symbol: "kr",
        abbreviation: "SEK",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: ","
    },
    SGD: {
        name: "Singapore Dollar",
        symbol: "S$",
        abbreviation: "SGD",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 1,
        separator: "."
    },
    THB: {
        name: "Thai Baht",
        symbol: "฿",
        abbreviation: "THB",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    TRY: {
        name: "Turkish Lira",
        symbol: "₺",
        abbreviation: "TRY",
        symbolPosition: "after",
        spaceDivider: " ",
        decimalPlaces: 0,
        separator: "."
    },
    TTD: {
        name: "Trinidad/Tobago Dollar",
        abbreviation: "TTD",
        symbol: "$",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 1,
        separator: "."
    },
    TWD: {
        name: "New Taiwan Dollar",
        abbreviation: "TWD",
        symbol: "元",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    },
    USD: {
        name: "US Dollar",
        abbreviation: "USD",
        symbol: "$",
        symbolPosition: "before",
        spaceDivider: "",
        decimalPlaces: 2,
        separator: "."
    },
    UYU: {
        name: "Peso Uruguayo",
        abbreviation: "UYU",
        symbol: "$",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 2,
        separator: ","
    },
    VND: {
        name: "Vietnamese dong",
        symbol: "₫",
        abbreviation: "VND",
        symbolPosition: "after",
        spaceDivider: "",
        decimalPlaces: 0,
        separator: "."
    },
    ZAR: {
        name: "Rand",
        abbreviation: "ZAR",
        symbol: "R",
        symbolPosition: "before",
        spaceDivider: " ",
        decimalPlaces: 1,
        separator: "."
    }
}, Vue.filter("thumb", function(t, e, n, i) {
    return t ? e ? n ? t : (e = utils.miscFront.adjustThumbForScreen(e, i), t.replace(/\/(?=[^\/]*$)/, "/" + e + "-")) : t : ""
}), Vue.filter("notime", function(t) {
    return -1 === t.indexOf(" ") ? t : t.substr(0, t.indexOf(" "))
}), Vue.filter("datetostring", function(t) {
    return utils.environment.getLocalFormattedDate(t)
}), Vue.filter("ellipse", function(t, e) {
    let n = t.slice(0, e);
    return n.length < t.length && (n += "..."), n
}), Vue.filter("round", function(t, e) {
    return utils.miscFront.roundForCurrency(t, e)
}), Vue.filter("mandatory", function(t, e) {
    return e && (t += " *"), t
}), Vue.filter("currency", function(t, e) {
    return (t = utils.miscFront.roundForCurrency(t, e)) && (t = (new Intl.NumberFormat).format(t)), resource.frontCurrencies[e] ? "before" === resource.frontCurrencies[e].symbolPosition ? resource.frontCurrencies[e].symbol + resource.frontCurrencies[e].spaceDivider + t : t + resource.frontCurrencies[e].spaceDivider + resource.frontCurrencies[e].symbol : t + " " + e
}), Vue.filter("cdnFile", function(t) {
    return window.useCdn ? "https://d2z18g6bj3mwjn.cloudfront.net" + t : t
}), Vue.filter("linkToObject", function(t) {
    let e = "";
    return e = t && t.BookingGuid && !t.AlternativeGuid ? "Booking Guid: " + t.BookingGuid : t && t.BookingGuid && t.AlternativeGuid ? "Booking Guid: " + t.BookingGuid + ", Alternative Guid: " + t.AlternativeGuid : t && t.Content ? lang.state.common.Scheduling : t && !t.url && t.target ? lang.state.common.WhatDoYouWantToLinkTo : t
}), Vue.filter("minutesToTime", function(t) {
    const e = Math.floor(t / 60),
        n = t % 60,
        i = new Date;
    return i.setHours(e), i.setMinutes(n), i.toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: "en-US" === navigator.language
    })
});
var lazyThumb = {
    methods: {
        lazyThumb: function(t, e, n, i) {
            return t ? e ? n ? t : (e = utils.miscFront.adjustThumbForScreen(e, i), t.replace(/\/(?=[^\/]*$)/, "/" + e + "-")) : t : ""
        }
    }
};
Vue.component("pb-img", {
    props: ["src", "thumbType", "source", "imageSize"],
    mixins: [lazyThumb],
    template: window.pb.isAdmin ? '<img v-bind:src="src | thumb(thumbType,source,imageSize)" :key="src">' : '<img class="lazy-img" v-lazy="lazyThumb(src,thumbType,source,imageSize)" :key="src">'
}), Vue.component("pb-video", {
    props: ["element", "alt"],
    data: function() {
        return {
            isPlay: !1,
            embedResponsivePaddingBottom: 0,
            iFrameSrc: ""
        }
    },
    methods: {
        doPlay: function() {
            if (!this.element.Content.IFrameSrc) return;
            this.iFrameSrc = this.element.Content.IFrameSrc, this.iFrameSrc += "?autoplay=1", this.iFrameSrc += "&playsinline=1", "1" == this.element.Settings["iframe-hide-controls"] && (this.iFrameSrc += "&title=0&byline=0&portrait=0&sidedock=0&controls=0&modestbranding=1&autohide=1&showinfo=0"), "1" == this.element.Settings["iframe-mute"] && (this.iFrameSrc += "&background=1&muted=1"), "1" == this.element.Settings["iframe-loop"] && (this.iFrameSrc += "&loop=1"), "1" == this.element.Settings["iframe-auto-play"] && (this.iFrameSrc += "&muted=1");
            let t = this.element.Content.IFrameHeight / this.element.Content.IFrameWidth;
            this.embedResponsivePaddingBottom = utils.miscFront.mathRound2(100 * t), this.isPlay = !0
        }
    },
    created: function() {
        "1" == this.element.Settings["iframe-auto-play"] && this.doPlay()
    },
    template: '<div class="pbVideo" v-bind:class="{isPlaying : isPlay}" v-bind:style="{\'padding-top\' : embedResponsivePaddingBottom +\'%\'}"><pb-img v-if="!isPlay" height="auto" width="100%" v-bind:src="element.Content.Src" v-bind:thumb-type="element.Settings[\'thumb-type\']" v-bind:alt="alt" v-bind:class="[element.Settings[\'animation\'],element.Settings[\'hover-transition\']]" v-bind:source="element.Content.Source"></pb-img><div v-if="!isPlay" class="playIcon ficon-playback-play" v-on:click="doPlay"></div> <iframe v-if="isPlay" v-bind:width="element.Content.IFrameWidth" v-bind:height="element.Content.IFrameHeight" v-bind:src="iFrameSrc" frameborder="0" allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
}), Vue.component("pb-bgvideo", {
    props: ["element"],
    data: function() {
        return {
            isPlay: !1,
            embedResponsivePaddingBottom: 0,
            iFrameSrc: "",
            wrapperHeight: 0,
            wrapperWidth: 0
        }
    },
    methods: {
        doPlay: function() {
            this.element.Content.IFrameSrc && (this.iFrameSrc = this.element.Content.IFrameSrc + "?autoplay=1", this.iFrameSrc += "&playsinline=1", "1" == this.element.Settings["iframe-hide-controls"] && (this.iFrameSrc += "&title=0&byline=0&portrait=0&sidedock=0&controls=0&modestbranding=1&autohide=1&showinfo=0"), "1" == this.element.Settings["iframe-mute"] && (this.iFrameSrc += "&background=1&muted=1"), "1" == this.element.Settings["iframe-loop"] && (this.iFrameSrc += "&loop=1"), "1" === this.element.Settings["iframe-cover"] && this.resizeVideo(), "1" == this.element.Settings["iframe-auto-play"] && (this.iFrameSrc += "&muted=1"), this.isPlay = !0)
        },
        resizeVideo: function() {
            if ("1" === this.element.Settings["iframe-cover"]) {
                let t, e, n = this.element.Content.IFrameWidth / this.element.Content.IFrameHeight,
                    i = this.$refs.wrapper,
                    o = 0,
                    s = 0;
                n > i.clientWidth / i.clientHeight ? s = -1 * ((e = (t = i.clientHeight) * n) - i.clientWidth) / 2 : o = -1 * ((t = (e = i.clientWidth) / n) - i.clientHeight) / 2;
                let r = document.getElementById("iframe-" + this.element.Guid);
                r.style.height = t + "px", r.style.width = e + "px", r.style.marginLeft = s + "px", r.style.marginTop = o + "px"
            }
        }
    },
    mounted: function() {
        "1" == this.element.Settings["iframe-auto-play"] && this.doPlay(), window.addEventListener("resize", this.resizeVideo)
    },
    destroyed() {
        window.removeEventListener("resize", this.resizeVideo)
    },
    template: '<div class="pbVideo" v-bind:class="{isPlaying : isPlay}" v-bind:style="{\'padding-top\' : embedResponsivePaddingBottom +\'%\'}" ref="wrapper"><pb-bgimg class="theBgImgDiv" v-if="!isPlay" height="auto" width="100%" v-bind:style="element.Style" v-bind:src="element.Content.Src"></pb-bgimg><div v-if="!isPlay" class="playIcon" v-on:click="doPlay"><i class="fa-solid fa-play"></i></div> <iframe v-show="isPlay" v-bind:id="\'iframe-\'+element.Guid" v-bind:width="wrapperWidth" v-bind:height="wrapperHeight" v-bind:src="iFrameSrc" frameborder="0" allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
}), Vue.component("pb-lazyimg", {
    props: ["src", "thumbType", "source", "imageSize"],
    mixins: [lazyThumb],
    template: '<img class="lazy-img" v-lazy="lazyThumb(src,thumbType,source,imageSize)" :key="src">'
}), Vue.component("pb-bgimg", {
    props: ["src"],
    template: window.pb.isAdmin ? "<div v-bind:style=\"{backgroundImage : 'url('+src+')'}\"></div>" : '<div class="lazy-img" v-lazy:background-image="src"></div>'
}), Vue.component("pb-blogpostitems", {
    props: ["post", "thumbType", "incDesc"],
    methods: {
        playVideo: function(t, e) {
            if (e) {
                let n = document.getElementById("imgWrapper-" + t);
                n.className += " playingVideo";
                let i = "auto",
                    o = "auto";
                n.innerHTML = utils.miscFront.makeIFrame(e, o, i, 0, 1, 0)
            }
        }
    },
    template: '<div v-if="post.Items && post.Items.length > 0" class="postItems pbEdit" data-type="BlogPost" v-bind:id="post.Guid + \'BlogPostItems\'" v-bind:class="[post.Settings[\'figcap-position\'],post.Settings[\'hover-transition\'],post.Settings[\'shadows\'],post.Settings[\'rounded\'],post.Settings[\'borders\']]"><figure v-for="item in post.Items" :key="item.Guid" class="Item" v-bind:class="post.Settings[\'items-animation\']"><span class="imgWrapper" v-on:click="playVideo(item.Guid,item.Content.IFrameSrc)" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc"><span class="playIcon ficon-playback-play"></span><pb-lazyimg v-bind:alt="post.Title" v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width" v-bind:thumb-type="thumbType" v-bind:source="item.Content.Source"></pb-lazyimg></span><figcaption class="aFigcaption" v-if="item.Content.FigCaptions && item.Content.FigCaptions.length > 0 && item.Content.FigCaptions[0].Content"><span class="BlogFigureTitle" data-type="BlogFigureTitle" v-if="item.Content.FigCaptions[0]">{{item.Content.FigCaptions[0].Content}}</span><span class="BlogFigureSubTitle" data-type="BlogFigureSubTitle" v-if="item.Content.FigCaptions[1]">{{item.Content.FigCaptions[1].Content}}</span><span class="BlogFigureText" data-type="BlogFigureText" v-if="item.Content.FigCaptions[2] && incDesc == 1" v-html="item.Content.FigCaptions[2].Content"></span></figcaption></figure></div>'
}), Vue.component("pb-blogtags", {
    props: ["post", "blog"],
    template: '<div class="pbEdit BlogTags" data-type="BlogTags" v-bind:id="post.Guid +\'BlogTags\'" v-if="post.Tags && post.Tags.length > 0"><router-link v-bind:to="\'/\'+blog.Url">Blog</router-link><span class="ficon-angle-right"></span><router-link v-for="tag in post.Tags" :key="tag.Guid" v-bind:to="\'/\'+blog.Url+\'?tag=\'+tag.Url" >{{tag.Title}}</router-link></div>'
}), Vue.component("pb-blogshare", {
    data: function() {
        return {
            blogSettings: site.state.BlogSettings
        }
    },
    methods: {
        getShareLink: function(t) {
            return "twitter" === t ? utils.miscFront.shareLink.twitter("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.BlogSettings.Url + "/" + this.post.Url, "Checkout this post!") : "facebook" === t ? utils.miscFront.shareLink.facebook("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.BlogSettings.Url + "/" + this.post.Url) : "linkedin" === t ? utils.miscFront.shareLink.linkedIn("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.BlogSettings.Url + "/" + this.post.Url) : "pinterest" === t ? utils.miscFront.shareLink.pinterest("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.BlogSettings.Url + "/" + this.post.Url) : void 0
        }
    },
    props: ["post"],
    template: '<div class="pbEdit BlogShare" data-type="BlogShare"  v-bind:id="post.Guid +\'BlogShare\'"><div class="icon" v-for="icon in blogSettings.ShareButtons" :key="icon.Guid"><a v-bind:href="getShareLink(icon.Type)" target="_blank"><span v-if="blogSettings.Settings[\'icon-type\'] === \'titles\'">{{icon.Title}}</span>' + "<span v-if=\"blogSettings.Settings['icon-type'] !== 'titles'\" class=\"smIcon\" v-bind:class=\"'smi-' + blogSettings.Settings['icon-type'] +'-'+ icon.Type\"></span></a></div></div>"
}), Vue.component("pb-blogcomment", {
    data: function() {
        return {
            blogCount: 0
        }
    },
    props: ["post"],
    methods: {
        openComments: function() {
            postComment.actions.openCommentPopup(this.post)
        },
        toggleLike: function() {
            this._fetchLocalStorage() ? (frontApi.postToggleLike(this.post.Guid, 0).then(t => {
                this.post.NrOfLikes--
            }), this._deleteLocalStorage()) : (frontApi.postToggleLike(this.post.Guid, 1).then(t => {
                this.post.NrOfLikes++
            }), this._updateLocalStorage())
        },
        navClick: function(t) {
            let e = site.state.BlogSettings.Url ? site.state.BlogSettings.Url : "blog",
                n = this._getPostByRelationToCurrentPost(t);
            n && router.push("/" + e + "/" + n.Url)
        },
        _getBlogUrl: function() {
            for (var t = 0; t < pages.state.pages.length; t++) {
                var e = pages.state.pages[t];
                if (e.Sections)
                    for (var n = 0; n < e.Sections.length; n++) {
                        var i = e.Sections[n];
                        if (i.ElementsFixed && i.ElementsFixed.Items1 && "sectionnews-view" === i.ElementsFixed.Items1.View) return e.Url
                    }
            }
            return !1
        },
        _getPostByRelationToCurrentPost: function(t) {
            for (var e = 0; e < posts.state.posts.length; e++)
                if (posts.state.posts[e].Guid === this.post.Guid) return "next" === t ? posts.state.posts[e + 1] : posts.state.posts[e - 1];
            return !1
        },
        navBlog: function() {
            let t = this._getBlogUrl(),
                e = t || "/";
            this.$router.push({
                path: e
            })
        },
        countBlog: function() {
            if (void 0 !== window.blogPageCount) return window.blogPageCount;
            for (var t = 0, e = 0; e < pages.state.pages.length; e++) {
                var n = pages.state.pages[e];
                if (n.Sections)
                    for (var i = 0; i < n.Sections.length; i++) {
                        var o = n.Sections[i];
                        if (o.ElementsFixed && o.ElementsFixed.Items1 && "sectionnews-view" === o.ElementsFixed.Items1.View && (t++, window.blogPageCount = t, t > 1)) return window.blogPageCount
                    }
            }
            return window.blogPageCount = t
        },
        _updateLocalStorage: function() {
            localStorage.setItem("like" + this.post.Guid, 1)
        },
        _fetchLocalStorage: function() {
            return localStorage.getItem("like" + this.post.Guid)
        },
        _deleteLocalStorage: function() {
            localStorage.removeItem("like" + this.post.Guid)
        }
    },
    created() {
        this.blogCount = this.countBlog()
    },
    template: '<div class="pbEdit BlogCommentIcon"  data-type="BlogCommentIcon"  v-bind:id="post.Guid +\'BlogCommentIcon\'"><div class="blogNav"><span v-on:click="navClick(\'back\')" class="ficon-arrow-67"></span><span v-if="blogCount === 1" v-on:click="navBlog" class="ficon-list-1"></span><span v-on:click="navClick(\'next\')" class="ficon-arrow-68"></span></div><span class="ficon-bubble-comment-streamline-talk commentIcon" v-on:click="openComments"></span> <span class="nr">{{post.Comments ? post.Comments.length : \'\'}}</span> <span class="ficon-like-love-streamline commentIcon iconLike" v-on:click="toggleLike"></span> <span class="nrOfLikes">{{post.NrOfLikes ? post.NrOfLikes : \'\'}}</span></div>'
}), Vue.component("pb-productitems", {
    props: ["product", "thumbType"],
    methods: {
        playVideo: function(t, e) {
            if (e) {
                let n = document.getElementById("imgWrapper-" + t);
                n.className += " playingVideo";
                let i = "auto",
                    o = "auto";
                n.innerHTML = utils.miscFront.makeIFrame(e, o, i, 0, 1, 0)
            }
        },
        imgClick: function(t, e) {
            e ? this.playVideo(t, e) : (console.log(t), this.$emit("clicked", t))
        }
    },
    template: '<div v-if="product.Items && product.Items.length > 0" class="productItems pbEdit" data-type="Product" v-bind:id="product.Guid + \'ProductItems\'" v-bind:class="[product.Settings[\'figcap-position\'],product.Settings[\'hover-transition\'],product.Settings[\'shadows\'],product.Settings[\'rounded\'],product.Settings[\'borders\']]"><figure v-for="item in product.Items" :id="\'item-\'+item.Guid" v-bind:data-id="item.Guid" :key="item.Guid" class="Item"  v-bind:class="product.Settings[\'items-animation\']" v-bind:iheight="item.Content.Height" v-bind:iwidth="item.Content.Width"><span class="imgWrapper" v-on:click="imgClick(item.Guid,item.Content.IFrameSrc)" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc"><span class="playIcon ficon-playback-play"></span><pb-lazyimg v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width" v-bind:thumb-type="thumbType" v-bind:source="item.Content.Source" v-bind:alt="item.Content.Alt"></pb-lazyimg></span><figcaption class="aFigcaption" v-if="item.Content.FigCaptions && item.Content.FigCaptions.length > 0 && item.Content.FigCaptions[0].Content"><span class="ProductFigureTitle" v-if="item.Content.FigCaptions[0]">{{item.Content.FigCaptions[0].Content}}</span><span class="ProductFigureSubTitle" v-if="item.Content.FigCaptions[1]">{{item.Content.FigCaptions[1].Content}}</span></figcaption></figure></div>'
}), Vue.component("pb-postteaser", {
    props: ["post", "thumbType", "blog", "imageSize"],
    data: function() {
        return {
            trans: translations.state
        }
    },
    computed: {
        cutTextContent: function() {
            return this.post.TextContent && this.post.TextContent.length > 255 ? this.post.TextContent.substring(0, 255).replace(/<[^>]*>?/gm, "") + "..." : this.post.TextContent
        }
    },
    template: '<figure class="Item" v-bind:id="\'item-\'+post.Guid" v-bind:data-id="post.Guid"  v-if="post.Items[0]" v-bind:iheight="post.Items[0] ? post.Items[0].Content.Height : 0" v-bind:iwidth="post.Items[0] ? post.Items[0].Content.Width : 0"><router-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url" class="imgWrapper" v-bind:id="\'imgWrapper-\'+post.Guid"><pb-img v-bind:alt="post.Title" v-bind:thumb-type="thumbType" v-bind:image-size="imageSize" v-if="post.Items.length > 0" v-bind:id="\'img-\'+post.Guid" v-bind:src="post.Items[0].Content.Src" v-bind:height="post.Items[0].Content.Height" v-bind:width="post.Items[0].Content.Width"  v-bind:source="post.Items[0].Content.Source"></pb-img></router-link><figcaption class="aFigcaption"><span class="CaptionTitle"><router-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url">{{post.Title}}</router-link></span><span class="CaptionSubTitle">{{post.PostDate  | datetostring }}</span><div class="CaptionText" v-html="cutTextContent"></div><div class="CaptionButton"><pb-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url">{{trans.ReadMore}}</pb-link></div></figcaption></figure>'
}), Vue.component("pb-productteaser", {
    props: ["product", "thumbType", "store", "imageSize"],
    data: function() {
        return {
            trans: translations.state
        }
    },
    computed: {
        finalPrice: function() {
            let t = this.product.Price;
            return this.product.Discount && (t *= 1 - this.product.Discount / 100, t = utils.miscFront.mathRound2(t)), t
        }
    },
    template: '<figure class="Item" v-bind:id="\'item-\'+product.Guid" v-bind:data-id="product.Guid" v-bind:iheight="product.Items[0] ? product.Items[0].Content.Height : 0" v-bind:iwidth="product.Items[0] ? product.Items[0].Content.Width : 0" v-bind:class="{soldOut : product.Inventory.DoTrack === 1 && product.Inventory.Inventory < 1}"><router-link v-bind:to="\'/\'+store.Url+\'/\'+product.Url" class="imgWrapper" v-bind:id="\'imgWrapper-\'+product.Guid"><pb-img v-bind:alt="product.Title" v-bind:thumb-type="thumbType"  v-bind:image-size="imageSize" v-if="product.Items.length > 0" v-bind:id="\'img-\'+product.Guid" v-bind:src="product.Items[0].Content.Src" v-bind:height="product.Items[0].Content.Height" v-bind:width="product.Items[0].Content.Width" v-bind:source="product.Items[0].Content.Source"></pb-img></router-link><router-link v-bind:to="\'/\'+store.Url+\'/\'+product.Url" class="aFigcaption"><span class="storeFigureTitlesWrapper"><span class="CaptionTitle">{{product.Title}}</span><span class="CaptionSubTitle " v-if="product.SubTitle">{{product.SubTitle}}</span></span><span class="CaptionPrice"><span class="priceAndCurrency">{{finalPrice | currency(store.Currency) }}</span><span class="discount" v-if="product.Discount"> ({{product.Discount}}% Off)</span><span class="soldOut" v-if="product.Inventory.DoTrack === 1 && product.Inventory.Inventory < 1">{{trans.SoldOut}}</span></span></router-link></figure>'
}), Vue.component("pb-productdetails", {
    props: ["product"],
    data: function() {
        return {
            storeSettings: site.state.StoreSettings,
            showVariants: !1,
            trans: translations.state,
            activeVariant: !1,
            checkoutStore: checkoutStore,
            variantTitle: translations.state.ChooseAVariant
        }
    },
    methods: {
        changeVariant: function(t) {
            this.storeSettings.Settings["variants-format"] && "VariantsFormatBox" !== this.storeSettings.Settings["variants-format"] ? "VariantsFormatOneLine" === this.storeSettings.Settings["variants-format"] && (this.activeVariant = t, this.variantTitle = translations.state.ChooseAVariant) : (this.activeVariant = t, this.variantTitle = t.Title)
        },
        closeVariants: function(t) {
            this.showVariants = !1, t.stopPropagation(), t.preventDefault()
        },
        addToCart: function() {
            this.product.Variants && this.product.Variants.length > 0 && !this.activeVariant ? frontApp.alert(this.trans.PleaseSelectOneVariant) : 1 === this.product.Inventory.DoTrack && this.activeVariant.Inventory < 1 ? this.soldOut() : utils.miscFront.isProductSoldOut(this.product, this.activeVariant) ? this.soldOut() : (checkoutStore.actions.addToCart(this.product, this.activeVariant), checkoutStore.state.showAddedToCart = !0)
        },
        soldOut: function() {
            frontApp.alert(this.trans.SoldOutMessage)
        },
        getShareLink: function(t) {
            return "twitter" === t ? utils.miscFront.shareLink.twitter("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.StoreSettings.Url + "/" + this.product.Url, this.trans.CheckoutThis) : "facebook" === t ? utils.miscFront.shareLink.facebook("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.StoreSettings.Url + "/" + this.product.Url) : "linkedin" === t ? utils.miscFront.shareLink.linkedIn("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.StoreSettings.Url + "/" + this.product.Url) : "pinterest" === t ? utils.miscFront.shareLink.pinterest("https://" + site.state._wwwPrefix + site.state.Url + "/" + site.state.StoreSettings.Url + "/" + this.product.Url) : void 0
        }
    },
    computed: {
        finalPrice: function() {
            let t = this.product.Price;
            return this.activeVariant && (t = this.activeVariant.Price), this.product.Discount && (t *= 1 - this.product.Discount / 100, t = utils.miscFront.mathRound2(t)), t
        },
        variantStyle: function() {
            return void 0 === this.storeSettings.Settings["variants-format"] || "VariantsFormatBox" === this.storeSettings.Settings["variants-format"] ? "" : "VariantsFormatOneLine" === this.storeSettings.Settings["variants-format"] ? "VariantsFormatOneLine" : void 0
        }
    },
    watch: {
        "item.Src": function(t, e) {
            this.item.Src = t
        }
    },
    template: '<div class="productDetails"><h1 class="pbEdit ProductHeader" data-type="ProductHeader" v-bind:id="product.Guid +\'ProductHeader\'">{{product.Title}}</h1><h1 class="pbEdit ProductSubHeader" data-type="ProductSubHeader" v-if="product.SubTitle" v-bind:id="product.Guid +\'ProductSubHeader\'">{{product.SubTitle}}</h1><h1 class="pbEdit ProductPrice" data-type="ProductPrice" v-bind:id="product.Guid +\'ProductPrice\'">{{finalPrice | currency(storeSettings.Currency)}} <span class="discount" v-if="product.Discount > 0">({{product.Discount}}% {{trans.Off}})</span> </h1><div class="pbEdit ProductButton" data-type="ProductButton"  v-bind:id="product.Guid +\'ProductButton\'" v-on:click="addToCart" v-if="product.Inventory.DoTrack !== 1 || product.Inventory.Inventory > 0"><a>{{trans.AddToCart}}</a></div><div class="pbEdit ProductButton" data-type="ProductButton"  v-bind:id="product.Guid +\'ProductButton\'" v-on:click="soldOut" v-if="product.Inventory.DoTrack === 1 && product.Inventory.Inventory < 1"><a>{{trans.SoldOut}}</a></div><div v-if="product.Variants && product.Variants.length > 0" class="ProductVariants pbEdit" data-type="ProductVariants" v-bind:id="product.Guid +\'ProductVariants\'" v-bind:class="[{active: showVariants}, variantStyle]" v-on:click="showVariants = !this.showVariants">{{variantTitle}}<ul><li v-for="item in product.Variants" :key="item.Guid" v-bind:class="{active: activeVariant.Guid === item.Guid}" v-on:click="changeVariant(item)"><span class="vImage" v-if="item.Src"><pb-img height="100%" width="100%" v-bind:src="item.Src"></pb-img></span><span class="vTitle">{{item.Title}}</span><span class="vPrice">{{item.Price | currency(storeSettings.Currency) }} </span><span class="vSoldOut" v-if="product.Inventory.DoTrack === 1 && item.Inventory < 1">{{trans.SoldOut}}</span></li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeVariants"></div></div> <div class="pbEdit ProductText LongText" data-type="ProductText" v-html="product.TextContent"  v-bind:id="product.Guid +\'ProductText\'"></div><div class="pbEdit ProductShare" data-type="ProductShare"  v-bind:id="product.Guid +\'ProductShare\'" v-if="storeSettings.Settings[\'hide-share\'] != 1"><div class="icon" v-for="icon in storeSettings.ShareButtons" :key="icon.Guid"><a v-bind:href="getShareLink(icon.Type)" target="_blank"><span v-if="storeSettings.Settings[\'icon-type\'] === \'titles\'">{{icon.Title}}</span>' + "<span v-if=\"storeSettings.Settings['icon-type'] !== 'titles'\" class=\"smIcon\" v-bind:class=\"'smi-' + storeSettings.Settings['icon-type'] +'-'+ icon.Type\"></span></a></div></div></div>"
}), Vue.component("pb-postcomment", {
    data: function() {
        return {
            postComment: postComment.state,
            post: null,
            trans: translations.state,
            newComment: {
                Name: "",
                Email: "",
                Text: "",
                Date: "",
                PostGuid: "",
                Guid: ""
            },
            hasErrors: !1,
            showReCaptcha: !1,
            bgColor: {}
        }
    },
    methods: {
        close: function() {
            postComment.actions.closeCommentPopup()
        },
        addNewComment: function() {
            let t = this;
            t.newComment.Name && t.newComment.Text && t.newComment.Email ? (this.showReCaptcha = !0, frontApp.confirm(this.trans.AreYouSure, function() {
                utils.miscFront.renderCaptchaAndGetToken().then(e => {
                    t.hasErrors = !1, (!t.post.Comments || t.post.Comments.length < 1) && (t.post.Comments = []), t.newComment.Email = t.newComment.Email.trim().toLowerCase(), t.newComment.SiteId = site.state.Id, t.newComment.Guid = utils.miscFront.generateGuid(), t.newComment.PostGuid = t.post.Guid, t.newComment.Date = (new Date).toISOString().slice(0, 10), t.post.Comments.push(t.newComment), frontApi.addNewBlogPostComment(t.newComment, e).then(e => {
                        t.newComment = {
                            Name: "",
                            Email: "",
                            Text: "",
                            Date: "",
                            PostGuid: "",
                            Guid: ""
                        }, t.showReCaptcha = !1
                    })
                })
            })) : (t.hasErrors = !0, frontApp.alert(this.trans.NoFieldsCanBeEmpty))
        }
    },
    created: function() {
        this.post = this.postComment.currentPost, site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        })
    },
    template: '<div class="commentPopup" v-if="postComment.isShown"><div class="commentPopupBg" v-on:click="close"></div><div class="cgContent" v-bind:style="bgColor"><h1 class="Header">{{post.Title}}</h1><div class="cgInputs Form" v-bind:class="{hasErrors : hasErrors}"><div class="inputWrapper"><textarea v-model="newComment.Text" v-bind:class="{error : !newComment.Text}" placeholder=" " ></textarea><label>{{trans.YourComment}}</label></div><div class="inputWrapper"><input type="text" v-model="newComment.Name" v-bind:class="{error : !newComment.Name}" placeholder=" "><label>{{trans.YourName}}</label></div><div class="inputWrapper"><input type="text" v-model="newComment.Email" v-bind:class="{error : !newComment.Email}" placeholder=" "><label>{{trans.YourEmail}}  - {{trans.WillNotBePublic}}</label></div><div class="Button" v-on:click="addNewComment"><span>{{trans.Comment}}</span></div><div v-if="showReCaptcha" id="recaptchaHolder"></div></div><div class="comments" v-if="post.Comments"><div v-for="comment in post.Comments" v-bind:key="comment.Guid" class="comment"><div class="nameAndDate"><span class="name">{{comment.Name}}</span><span class="date">{{comment.Date}}</span></div><p class="commentText">{{comment.Text}}</p></div></div></div></div>'
}), Vue.component("pb-sectionlightbox", {
    props: ["sectionGuid", "itemGuid"],
    data: function() {
        return {
            currentState: pages.state.current.page.Guid ? pages.state.current : products.state.current,
            object: null,
            items: [],
            activeIdx: 0,
            itemsLength: 0,
            showFigCap: !1,
            lbAnimation: "fade-in",
            lbIFrameHideControls: 0,
            lbIFrameMute: 0,
            lbIFrameAutoPlay: 0,
            lbCover: "",
            lbFigcapPosition: "",
            lbHideShare: !1
        }
    },
    methods: {
        _adjustImgForScreen: function(t) {
            if (!t.Content.Src) return "";
            let e = "";
            return t.Content.Source || (e = utils.miscFront.adjustThumbForScreen("")), e ? t.Content.Src.replace(/\/(?=[^\/]*$)/, "/" + e + "-") : t.Content.Src
        },
        navClick: function(t) {
            let e;
            ! function(t) {
                let e = document.getElementById("activeLbVideo-" + t);
                e && (e.contentWindow.postMessage('{"method":"pause"}', "*"), e.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', "*"))
            }(this.items[this.activeIdx].Guid);
            "back" === t ? (this.activeIdx--, this.activeIdx < 0 && (this.activeIdx = this.items.length - 1)) : (this.activeIdx++, this.activeIdx > this.items.length - 1 && (this.activeIdx = 0)), e = this.items[this.activeIdx], document.getElementById("lb-img-" + e.Guid) && (document.getElementById("lb-img-" + e.Guid).src = this._adjustImgForScreen(e)), this.preloadNeighbors(), this.showFigCap = !1
        },
        playVideo: function(t) {
            let e = this.items[this.activeIdx];
            e.Content.IFrameSrc && (document.getElementById("lb-ImgWrapper-" + e.Guid).innerHTML = utils.miscFront.makeIFrame(e.Content.IFrameSrc, e.Content.IFrameWidth, e.Content.IFrameHeight, this.lbIFrameHideControls, this.lbIFrameAutoPlay, this.lbIFrameMute, "activeLbVideo-" + e.Guid), t.stopPropagation())
        },
        close: function() {
            this.currentState.showLightbox = !1, utils.miscFront.isHostInReferrerIsExternal() ? router.push({
                path: this.currentState.url
            }) : router.go(-1)
        },
        preloadNeighbors: function() {
            let t;
            this.activeIdx > 0 && (t = this._adjustImgForScreen(this.items[this.activeIdx - 1]), utils.miscFront.preloadImg(t)), this.activeIdx < this.itemsLength - 1 && (t = this._adjustImgForScreen(this.items[this.activeIdx + 1]), utils.miscFront.preloadImg(t))
        },
        getShareLink: function(t) {
            if ("twitter" === t) return utils.miscFront.shareLink.twitter("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + this.items[this.activeIdx].Guid, "Great image!");
            if ("facebook" === t) return utils.miscFront.shareLink.facebook("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + this.items[this.activeIdx].Guid);
            if ("linkedin" === t) return utils.miscFront.shareLink.linkedIn("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + this.items[this.activeIdx].Guid);
            if ("pinterest" === t) {
                let t, e = this.items[this.activeIdx];
                if (e) return t = e.Content.Src, utils.miscFront.shareLink.pinterest("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + this.items[this.activeIdx].Guid, t);
                console.log("no item")
            }
        },
        onMobileClick: function(t) {
            if (utils.environment.wWidth() < 1e3) {
                let e = t.target,
                    n = e.getBoundingClientRect();
                t.clientX - n.left < e.offsetWidth / 2 ? this.navClick("back") : this.navClick("forward")
            }
        }
    },
    created: function() {
        products.state.current.product && products.state.current.product.Guid ? this.object = products.state.current.product : pwdPages.state.current.page && pwdPages.state.current.page.Guid ? this.object = pwdPages.state.current.page : this.object = pages.state.current.page;
        let t = utils.arrayHelper.findItemByGuid(this.object.Sections, this.sectionGuid);
        t && t.ElementsFixed.Items1 ? (this.items = t.ElementsFixed.Items1.Content, this.lbAnimation = t.ElementsFixed.Items1.Settings["lb-animation"] ? t.ElementsFixed.Items1.Settings["lb-animation"] : "fade-in", this.lbCover = t.ElementsFixed.Items1.Settings["lb-item-fit"] ? t.ElementsFixed.Items1.Settings["lb-item-fit"] : "contain", this.lbFigcapPosition = t.ElementsFixed.Items1.Settings["lb-figcap-position"] ? t.ElementsFixed.Items1.Settings["lb-figcap-position"] : "lbbottom1", this.lbIFrameHideControls = t.ElementsFixed.Items1.Settings["iframe-hide-controls"] ? t.ElementsFixed.Items1.Settings["iframe-hide-controls"] : "0", this.lbIFrameMute = t.ElementsFixed.Items1.Settings["iframe-mute"] ? t.ElementsFixed.Items1.Settings["iframe-mute"] : "0", this.lbHeight = t.ElementsFixed.Items1.Settings["lb-height"] ? t.ElementsFixed.Items1.Settings["lb-height"] : "90%", this.lbHideShare = t.ElementsFixed.Items1.Settings["lb-hide-share"] ? t.ElementsFixed.Items1.Settings["lb-hide-share"] : "", this.lbIFrameAutoPlay = "1", utils.environment.wWidth() < 1e3 && (this.lbIFrameHideControls = "0", "lbbottom2" === this.lbFigcapPosition || (this.lbFigcapPosition = "lbcover1")), !this.items || this.items.length < 1 ? this.currentState.showLightbox = !1 : this.itemsLength = this.items.length) : this.currentState.showLightbox = !1
    },
    mounted() {
        this.activeIdx = utils.arrayHelper.findIndex(this.items, "Guid", this.itemGuid), this.activeIdx || 0 === this.activeIdx ? (document.getElementById("lb-img-" + this.items[this.activeIdx].Guid).src = this._adjustImgForScreen(this.items[this.activeIdx]), this.lbIFrameAutoPlay && this.playVideo(), this.preloadNeighbors()) : this.currentState.showLightbox = !1;
        let t = this;
        document.onkeydown = function(e) {
            37 === e.keyCode ? t.navClick("back") : "Escape" === e.key ? t.close() : 39 === e.keyCode && t.navClick("forward")
        }
    },
    destroyed() {
        document.onkeydown = null
    },
    template: '<div class="pbLightbox" v-bind:class="lbCover"><span class="closeX" v-on:click="close"></span><div class="lightboxInner inViewPoint"  v-bind:class="lbFigcapPosition" v-bind:style="{\'height\': lbHeight}"><span class="arrowContainer" v-on:click="navClick(\'back\')"><span class="arrow leftArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="navClick(\'forward\')"><span class="arrow rightArr"></span></span><figure v-for="(item, index) in items" :key="item.Guid" class="lb-Item" v-bind:class="[lbAnimation, item.Content.IFrameSrc ? \'gotVideo\' : \'\' ]" v-bind:id="\'lb-\'+item.Guid" v-show="index === activeIdx"><span class="imgWrapper" v-bind:id="\'lb-ImgWrapper-\'+item.Guid" v-on:click="onMobileClick"><span class="playIcon ficon-playback-play" v-on:click="playVideo"></span><img v-bind:id="\'lb-img-\'+item.Guid" v-bind:data-src="item.Content.Src" v-bind:alt="item.Content.Alt" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width" ></span><figcaption class="lbFigcaption" v-if="item.Content.FigCaptions[2] && item.Content.FigCaptions[2].Content"><span v-on:click="showFigCap = !showFigCap" class="captionIcon ficon-doc-text-inv" v-if="lbFigcapPosition ===\'lbcover1\'" v-bind:class="{captionIconOpen : showFigCap}"></span><div v-if="showFigCap || lbFigcapPosition!==\'lbcover1\'" class="figCapCoverWrapper"><div class="figCapCenter CaptionText LongText" v-html="item.Content.FigCaptions[2].Content"></div></div></figcaption></figure></div></div>'
}), Vue.component("pb-sectionlightboxvertical", {
    props: ["sectionGuid", "itemGuid"],
    data: function() {
        return {
            currentState: pages.state.current.page.Guid ? pages.state.current : products.state.current,
            object: null,
            items: [],
            activeIdx: 0,
            itemsLength: 0,
            showFigCap: !1,
            lbAnimation: "fade-in",
            lbIFrameHideControls: 0,
            lbIFrameMute: 0,
            lbIFrameAutoPlay: 0,
            lbCover: "",
            lbFigcapPosition: "",
            lbHideShare: !1
        }
    },
    methods: {
        playVideo: function(t) {
            t.Content.IFrameSrc && (document.getElementById("lb-ImgWrapper-" + t.Guid).innerHTML = utils.miscFront.makeIFrame(t.Content.IFrameSrc, t.Content.IFrameWidth, t.Content.IFrameHeight, this.lbIFrameHideControls, this.lbIFrameAutoPlay, this.lbIFrameMute, "activeLbVideo-" + t.Guid))
        },
        close: function() {
            this.currentState.showLightbox = !1, router.push({
                path: this.currentState.url
            })
        },
        getShareLink: function(t, e) {
            return "twitter" === t ? utils.miscFront.shareLink.twitter("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + e.Guid, "Great image!") : "facebook" === t ? utils.miscFront.shareLink.facebook("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + e.Guid) : "linkedin" === t ? utils.miscFront.shareLink.linkedIn("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + e.Guid) : "pinterest" === t ? utils.miscFront.shareLink.pinterest("https://" + site.state._wwwPrefix + site.state.Url + "/" + this.object.Url + "?s=" + this.sectionGuid + "%26i=" + e.Guid) : void 0
        }
    },
    created: function() {
        products.state.current.product && products.state.current.product.Guid ? this.object = products.state.current.product : pwdPages.state.current.page && pwdPages.state.current.page.Guid ? this.object = pwdPages.state.current.page : this.object = pages.state.current.page;
        let t = utils.arrayHelper.findItemByGuid(this.object.Sections, this.sectionGuid);
        t && t.ElementsFixed.Items1 ? (this.items = t.ElementsFixed.Items1.Content, this.lbAnimation = t.ElementsFixed.Items1.Settings["lb-animation"] ? t.ElementsFixed.Items1.Settings["lb-animation"] : "fade-in", this.lbCover = t.ElementsFixed.Items1.Settings["lb-item-fit"] ? t.ElementsFixed.Items1.Settings["lb-item-fit"] : "contain", this.lbFigcapPosition = t.ElementsFixed.Items1.Settings["lb-figcap-position"] ? t.ElementsFixed.Items1.Settings["lb-figcap-position"] : "lbbottom1", this.lbIFrameHideControls = t.ElementsFixed.Items1.Settings["iframe-hide-controls"] ? t.ElementsFixed.Items1.Settings["iframe-hide-controls"] : "0", this.lbIFrameMute = t.ElementsFixed.Items1.Settings["iframe-mute"] ? t.ElementsFixed.Items1.Settings["iframe-mute"] : "0", this.lbIFrameAutoPlay = "1", this.lbHideShare = t.ElementsFixed.Items1.Settings["lb-hide-share"] ? t.ElementsFixed.Items1.Settings["lb-hide-share"] : "", utils.environment.wWidth() < 1e3 && (this.lbFigcapPosition = "lbcover1"), !this.items || this.items.length < 1 ? this.currentState.showLightbox = !1 : this.itemsLength = this.items.length) : this.currentState.showLightbox = !1
    },
    mounted() {
        if (this.activeIdx = utils.arrayHelper.findIndex(this.items, "Guid", this.itemGuid), this.activeIdx || 0 === this.activeIdx) {
            (function(t) {
                let e = document.getElementById("lb-" + t.items[t.activeIdx].Guid);
                e && (document.getElementById("pbLightbox").scrollTop = e.offsetTop)
            })(this);
            this.lbIFrameAutoPlay && this.playVideo(this.items[this.activeIdx])
        } else this.currentState.showLightbox = !1;
        let t = this;
        document.onkeydown = function(e) {
            "Escape" === e.key && t.close()
        }
    },
    destroyed() {
        document.onkeydown = null
    },
    template: '<div class="pbLightbox verticalLightbox" id="pbLightbox" v-bind:class="lbCover"><span class="closeX" v-on:click="close"></span><div class="lightboxInner inViewPoint"  v-bind:class="lbFigcapPosition"><figure v-for="(item, index) in items" :key="item.Guid" class="lb-Item" v-bind:class="[lbAnimation, item.Content.IFrameSrc ? \'gotVideo\' : \'\' ]"  v-bind:id="\'lb-\'+item.Guid"><div class="lbShare" v-if="!lbHideShare"><a v-bind:href="getShareLink(\'facebook\',item)" target="_blank" class="smi-square-facebook"></a><a v-bind:href="getShareLink(\'twitter\',item)" target="_blank" class="smi-square-twitter"></a><a v-bind:href="getShareLink(\'linkedin\',item)" target="_blank" class="smi-square-linkedin"></a><a v-bind:href="getShareLink(\'pinterest\',item)" target="_blank" class="smi-square-pinterest"></a> </div><span class="imgWrapper" v-bind:id="\'lb-ImgWrapper-\'+item.Guid" ><span class="playIcon ficon-playback-play" v-on:click="playVideo(item)"></span><pb-img v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:alt="item.Content.Alt" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width" thumb-type="" v-bind:source="item.Content.Source"></pb-img></span><figcaption class="lbFigcaption" v-if="item.Content.FigCaptions[2] && item.Content.FigCaptions[2].Content"><span v-on:click="showFigCap = !showFigCap" class="captionIcon ficon-text-wrapping-2" v-if="lbFigcapPosition ===\'lbcover1\'" v-bind:class="{captionIconOpen : showFigCap}"></span><div v-if="showFigCap || lbFigcapPosition!==\'lbcover1\'" class="figCapCoverWrapper"><div class="figCapCenter CaptionText LongText" v-html="item.Content.FigCaptions[2].Content"></div></div></figcaption></figure></div></div>'
}), Vue.component("pb-misclightbox", {
    props: ["openingItemGuid", "items"],
    data: function() {
        return {
            lightboxActiveIdx: !1
        }
    },
    methods: {
        _openLightbox: function() {
            if (this.lightboxActiveIdx = utils.arrayHelper.findIndex(this.items, "Guid", this.openingItemGuid), this.lightboxActiveIdx || 0 === this.lightboxActiveIdx) {
                this.lightboxItemsLength = this.items.length;
                let t = this;
                frontApp.$nextTick(function() {
                    document.getElementById("lb-img-" + t.items[t.lightboxActiveIdx].Guid).src = t._lightboxAdjustImgForScreen(t.items[t.lightboxActiveIdx]), t.lightboxPreloadNeighbors()
                })
            } else this.closeLightbox();
            let t = this;
            document.onkeydown = function(e) {
                37 === e.keyCode ? t.lightboxNavClick("back") : 39 === e.keyCode ? t.lightboxNavClick("forward") : "Escape" === e.key && t.closeLightbox()
            }
        },
        closeLightbox() {
            this.$emit("close")
        },
        _lightboxAdjustImgForScreen: function(t) {
            if (!t.Content.Src) return "";
            let e = "";
            return t.Content.Source || (e = utils.miscFront.adjustThumbForScreen("")), e ? t.Content.Src.replace(/\/(?=[^\/]*$)/, "/" + e + "-") : t.Content.Src
        },
        lightboxNavClick: function(t) {
            let e;
            ! function(t) {
                let e = document.getElementById("activeLbVideo-" + t);
                e && (e.contentWindow.postMessage('{"method":"pause"}', "*"), e.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', "*"))
            }(this.items[this.lightboxActiveIdx].Guid);
            "back" === t ? (this.lightboxActiveIdx--, this.lightboxActiveIdx < 0 && (this.lightboxActiveIdx = 0)) : (this.lightboxActiveIdx++, this.lightboxActiveIdx > this.items.length - 1 && (this.lightboxActiveIdx = this.items.length - 1)), e = this.items[this.lightboxActiveIdx], document.getElementById("lb-img-" + e.Guid) && (document.getElementById("lb-img-" + e.Guid).src = this._lightboxAdjustImgForScreen(e)), this.lightboxPreloadNeighbors(), this.showFigCap = !1
        },
        lightboxPreloadNeighbors: function() {
            let t;
            this.lightboxActiveIdx > 0 && (t = this._lightboxAdjustImgForScreen(this.items[this.lightboxActiveIdx - 1]), utils.miscFront.preloadImg(t)), this.lightboxActiveIdx < this.lightboxItemsLength - 1 && (t = this._lightboxAdjustImgForScreen(this.items[this.lightboxActiveIdx + 1]), utils.miscFront.preloadImg(t))
        },
        playVideo: function(t) {
            let e = this.items[this.lightboxActiveIdx];
            e.Content.IFrameSrc && (document.getElementById("lb-ImgWrapper-" + e.Guid).innerHTML = utils.miscFront.makeIFrame(e.Content.IFrameSrc, e.Content.IFrameWidth, e.Content.IFrameHeight, this.lbIFrameHideControls, this.lbIFrameAutoPlay, this.lbIFrameMute, "activeLbVideo-" + e.Guid), t.stopPropagation())
        },
        onMobileClick: function(t) {
            if (utils.environment.wWidth() < 1e3) {
                let e = t.target,
                    n = e.getBoundingClientRect();
                t.clientX - n.left < e.offsetWidth / 2 ? this.lightboxNavClick("back") : this.lightboxNavClick("forward")
            }
        }
    },
    created: function() {
        this._openLightbox()
    },
    mounted() {},
    destroyed() {
        document.onkeydown = null
    },
    template: '<div class="pbLightbox"><span class="closeX" v-on:click="closeLightbox"></span><div class="lightboxInner inViewPoint lbbottom1"><span class="arrowContainer" v-on:click="lightboxNavClick(\'back\')" v-if="lightboxActiveIdx > 0"><span class="arrow leftArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="lightboxNavClick(\'forward\')" v-if="lightboxActiveIdx < (lightboxItemsLength-1)"><span class="arrow rightArr"></span></span><figure v-for="(item, index) in items" :key="item.Guid" class="lb-Item fade-in" v-bind:class="item.Content.IFrameSrc ? \'gotVideo\' : \'\'" v-bind:id="\'lb-\'+item.Guid" v-show="index === lightboxActiveIdx"><span class="imgWrapper" v-bind:id="\'lb-ImgWrapper-\'+item.Guid" v-on:click="onMobileClick"><span class="playIcon ficon-playback-play" v-on:click="playVideo"></span><img v-bind:id="\'lb-img-\'+item.Guid" v-bind:data-src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width" ></span><figcaption class="lbFigcaption" v-if="item.Content.FigCaptions[2]"><div class="figCapCoverWrapper"><div class="figCapCenter"><span class="CaptionText" v-html="item.Content.FigCaptions[2].Content"></span></div></div></figcaption></figure></div></div>'
}), Vue.component("pb-checkout", {
    data: function() {
        return {
            checkout: checkoutStore.state,
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            nav: {
                showCart: !0,
                showCheckout: !1,
                showThanks: !1,
                showTerms: !1
            },
            paymentOption: "",
            bgColor: "#ffffff"
        }
    },
    methods: {
        closeAll: function() {
            this.navCloseAll(), this.checkout.showCheckout = !1, this.checkout.straitToCheckout = !1
        },
        navCloseAll: function() {
            this.nav.showCart = !1, this.nav.showCheckout = !1, this.nav.showThanks = !1
        },
        openCart: function() {
            this.navCloseAll(), this.nav.showCart = !0
        },
        openCheckout: function() {
            this.navCloseAll(), this.nav.showCheckout = !0
        },
        openThankYou: function(t) {
            this.navCloseAll(), this.paymentOption = t, this.nav.showThanks = !0
        }
    },
    created: function() {
        site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        }, site.state.GlobalClasses.Page.color ? this.bgColor.borderColor = utils.miscFront.convertToRGBA(site.state.GlobalClasses.Page.color) : this.bgColor.borderColor = utils.miscFront.convertToRGBA("#000000")), this.checkout.straitToCheckout && (this.nav.showCart = !1, this.nav.showCheckout = !0)
    },
    template: '<div class="pbCheckoutContainer"><checkout-cart v-bind:bg-color="bgColor" v-if="nav.showCart" v-on:close="closeAll" v-on:open-checkout="openCheckout"></checkout-cart><checkout-checkout v-bind:bg-color="bgColor" v-if="nav.showCheckout" v-on:close="closeAll" v-on:go-to-cart="openCart" v-on:open-thank-you="openThankYou" v-on:view-terms="nav.showTerms = true"></checkout-checkout><checkout-terms v-bind:bg-color="bgColor" v-if="nav.showTerms" v-on:close="nav.showTerms = false"></checkout-terms><checkout-thanks v-bind:bg-color="bgColor" v-if="nav.showThanks" v-on:close="closeAll" v-bind:payment-option="paymentOption"></checkout-thanks></div>'
}), Vue.component("checkout-cart", {
    data: function() {
        return {
            checkout: checkoutStore.state,
            storeSettings: site.state.StoreSettings,
            trans: translations.state
        }
    },
    computed: {
        subTotalBeforeDiscount: function() {
            let t = 0;
            return this.checkout.cart.products.forEach(function(e) {
                t += e.Price * e.Quantity
            }), t
        }
    },
    props: ["bgColor"],
    methods: {
        close: function() {
            this.$emit("close")
        },
        openCheckout: function() {
            this.$emit("open-checkout")
        },
        removeProduct: function(t) {
            frontApp.confirm(this.trans.AreYouSureRemoveFromCart, function() {
                checkoutStore.actions.removeProduct(t)
            })
        },
        updateQuantity: function(t) {
            t.TrackInventory && parseInt(t.Quantity) > t.Inventory ? (t.Quantity = t.Inventory, frontApp.alert(this.trans.SoldOutMessage)) : parseInt(t.Quantity) > t.Seats - t.BookedSeats ? (t.Quantity = t.Seats - t.BookedSeats, frontApp.alert(this.trans.BookedOutMessage)) : checkoutStore.actions.updateQuantity(t)
        }
    },
    template: '<div class="pbCheckoutWrapper"><div class="pbCheckoutBg" v-on:click="close"></div><div class="cart pbCheckout" v-bind:style="bgColor"><span class="closeX" v-on:click="close"></span><h1 class="Header">{{trans.YourCart}}</h1><div class="productsWrapper"><article v-for="(product, index) in checkout.cart.products" :key="product.CartGuid"><div class="one"><span class="cartImageWrapper"><img v-if="product.Src" v-bind:src="product.Src | thumb(\'w400\')"></span><span class="titleWrapper"><span class="title">{{product.Title}} <span class="discount" v-if="product.Discount">({{product.Discount}}% {{trans.Off}})</span> </span><span class="variation" v-if="product.VariantGuid">{{product.VariantTitle}}</span></span></div><div class="two nrAndPriceWrapper"><input type="number" v-model="product.Quantity" v-on:change="updateQuantity(product)"><span class="ficon-ios-close-outline" v-on:click="removeProduct(product)"></span><span class="price">{{product.Price * product.Quantity | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span></div></article></div><div class="totalPriceWrapper"><div class="priceRow"><span>{{trans.Subtotal}}</span><span>{{subTotalBeforeDiscount  | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span></div></div><div class="buttonRow rightIsBtn" v-if="checkout.cart.products.length > 0"><div class="Button" v-on:click="openCheckout"><span>{{trans.ProceedToCheckout}}</span></div></div></div></div>'
}), Vue.component("checkout-checkout", {
    data: function() {
        return {
            checkout: checkoutStore.state,
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            countriesList: resource.countries,
            usStatesList: resource.usSates,
            customer: {
                name: "",
                address: "",
                zip: "",
                city: "",
                phone: "",
                state: "",
                message: "",
                country: {
                    Name: "",
                    Code: ""
                },
                usState: {
                    Name: "",
                    Code: ""
                },
                email: "",
                shippingIsSame: "yes",
                selfPickUp: "no",
                subscribeToNews: !1,
                shipping: {
                    name: "",
                    address: "",
                    zip: "",
                    city: "",
                    phone: "",
                    state: "",
                    country: {
                        Name: "",
                        Code: ""
                    },
                    usState: {
                        Name: "",
                        Code: ""
                    }
                }
            },
            defaultCountry: {
                Name: "",
                Code: ""
            },
            defaultState: {
                Name: "",
                Code: ""
            },
            discountCode: "",
            discountCodeApplied: !1,
            paymentOption: "stripe",
            hasPhysical: !1,
            prices: {
                subtotalBeforeDiscount: 0,
                discount: {
                    totalValue: 0,
                    isFreeShipping: !1,
                    code: {
                        value: 0,
                        text: ""
                    },
                    nrOfItems: {
                        value: 0,
                        text: ""
                    },
                    orderLimit: {
                        value: 0,
                        text: 0
                    }
                },
                subtotalAfterDiscount: 0,
                shippingCost: 0,
                shippingNeedVat: site.state.StoreSettings.Taxes.ShippingNeedsVat,
                taxPercent: 0
            },
            showPaymentWindow: !1,
            discountList: []
        }
    },
    props: ["bgColor"],
    computed: {
        subtotalAfterDiscount: function() {
            let t = this.prices.subtotalBeforeDiscount - this.prices.discount.totalValue;
            return t < 0 && (t = 0), t
        },
        taxCost: function() {
            if (0 == this.storeSettings.Taxes.Method) return 0;
            {
                let t, e, n = 0;
                if (this.checkout.cart.products.forEach(function(t) {
                        t.ExcludeTax && (n += t.Price * t.Quantity)
                    }), this.prices.shippingNeedVat) {
                    return t = this.subtotalAfterDiscount + this.prices.shippingCost - n, (e = .01 * this.prices.taxPercent * t) < 0 && (e = 0), e
                }
                return t = this.subtotalAfterDiscount - n, (e = .01 * this.prices.taxPercent * t) < 0 && (e = 0), e
            }
        },
        totalPrice: function() {
            let t = this.prices.shippingCost;
            return (this.prices.discount.isFreeShipping || "yes" == this.customer.selfPickUp) && (t = 0), this.subtotalAfterDiscount + this.taxCost + t
        }
    },
    methods: {
        validateRegion: function() {
            let t = !1,
                e = !1,
                n = "no" !== this.customer.shippingIsSame ? this.customer.country.Code : this.customer.shipping.country.Code,
                i = "no" !== this.customer.shippingIsSame ? this.customer.usState : this.customer.shipping.usState,
                o = this.customer.country.Code,
                s = this.customer.usState;
            return 0 == this.storeSettings.Taxes.Method ? t = !0 : this.storeSettings.Taxes.Zones.forEach(function(e) {
                "WORLD" === e.Country.Code ? 1 != e.DisableToOther && (t = !0) : e.Country.Code === o && ("US" !== e.Country.Code ? t = !0 : !e.UsStates.includes(s.Code) || "ALL" === e.UsStates && "ALL" === s ? "ALL" === e.UsStates && (t = !0) : t = !0)
            }), 0 == this.storeSettings.Shipping.Method ? e = !0 : this.storeSettings.Shipping.Zones.forEach(function(t) {
                "WORLD" === t.Country.Code ? 1 != t.DisableToOther && (e = !0) : t.Country.Code === n && ("US" !== t.Country.Code ? e = !0 : !t.UsStates.includes(i.Code) || "ALL" === t.UsStates && "ALL" === i ? "ALL" === t.UsStates && (e = !0) : e = !0)
            }), !(!e || !t)
        },
        regionIsChanged: function(t) {
            if (this.validateRegion() || !0 === t) this.priceCalc().initShippingOnRegionChange(), this.priceCalc().initTaxPercentOnRegionChange();
            else {
                let t = this.customer.usState && this.customer.usState.Code ? this.customer.usState.Code : this.customer.state,
                    e = "<div class='alertHeader'>" + this.trans.CheckoutNotAvailable + ": " + this.customer.country.Name + " / " + t + "</div>";
                e += this.trans.ChooseAnotherCountry, frontApp.alert(e)
            }
        },
        getShippingCountry: function() {
            return "no" !== this.customer.shippingIsSame ? this.customer.country.Name : this.customer.shipping.country.Name
        },
        goToCart: function() {
            this.$emit("go-to-cart")
        },
        close: function() {
            this.$emit("close")
        },
        checkDiscountCode: function() {
            let t = this,
                e = !1;
            this.storeSettings.Discounts.forEach(function(n) {
                "discount-code" === n.discount.rule && n.discount.code === t.discountCode && function(t) {
                    let e = new Date,
                        n = new Date(t.StartDate),
                        i = t.EndDate ? new Date(t.EndDate) : new Date("2222-01-01");
                    return e >= n && e <= i
                }(n) && (e = !0, t.priceCalc().onDiscountCodeLoaded(n), frontApp.alert(t.trans.DiscountApplied))
            }), e || frontApp.alert(this.trans.DiscountCodeWasNotValid)
        },
        priceCalc: function() {
            return {
                initSubtotalBeforeDiscount: t => {
                    let e = 0;
                    this.checkout.cart.products.forEach(function(t) {
                        e += t.Price * t.Quantity
                    }), this.prices.subtotalBeforeDiscount = e
                },
                initDiscountOnLoad: () => {
                    if (this.storeSettings.Discounts.length < 1);
                    else {
                        let t = this;
                        this.storeSettings.Discounts.forEach(function(e) {
                            if (e.discount && "number-of-items" === e.discount.rule)(function() {
                                let n = 0;
                                if (t.checkout.cart.products && t.checkout.cart.products.length && (n = t.checkout.cart.products.length), e.discount.items <= n) {
                                    if ("free-shipping" === e.discount.type) t.prices.shippingCost = 0, t.prices.discount.isFreeShipping = !0, t.prices.discount.nrOfItems.text = t.trans.Discount + ": " + e.Title + " (" + t.trans.FreeShipping + ")";
                                    else if ("fixed-amount" === e.discount.type) t.prices.discount.nrOfItems.value = parseFloat(e.discount.amount), t.prices.discount.nrOfItems.text = t.trans.Discount + ": " + e.Title + " (" + t.trans.FixedAmount + ")";
                                    else if ("percentage" === e.discount.type) t.prices.discount.nrOfItems.value = t.prices.subtotalBeforeDiscount * parseFloat(e.discount.percentage) / 100, t.prices.discount.nrOfItems.text = t.trans.Discount + ": " + e.Title + " (" + e.discount.percentage + " % off)";
                                    else if ("cheapest-free" === e.discount.type) {
                                        let n;
                                        t.checkout.cart.products.forEach(function(t) {
                                            n = void 0 === n ? parseFloat(t.Price) : n > parseFloat(t.Price) ? parseFloat(t.Price) : n
                                        }), t.prices.discount.nrOfItems.value = parseFloat(n), t.prices.discount.nrOfItems.text = t.trans.Discount + ": " + e.Title + " (" + t.trans.CheapestItemFree + ")"
                                    }
                                    t.prices.discount.nrOfItems.value && t.discountList.push({
                                        value: t.prices.discount.nrOfItems.value,
                                        type: t.prices.discount.nrOfItems.text
                                    })
                                }
                            })();
                            if (e.discount && "orders-above" === e.discount.rule)(function() {
                                if (e.discount.limit <= t.prices.subtotalBeforeDiscount) {
                                    if ("free-shipping" === e.discount.type) t.prices.discount.isFreeShipping = !0, this.prices.shippingCost = 0, t.prices.discount.orderLimit.text = t.trans.Discount + ": " + e.Title + " (" + t.trans.FreeShipping + ")";
                                    else if ("fixed-amount" === e.discount.type) t.prices.discount.orderLimit.value = parseFloat(e.discount.amount), t.prices.discount.orderLimit.text = t.trans.Discount + ": " + e.Title + " (" + t.trans.FixedAmount + ")";
                                    else if ("percentage" === e.discount.type) t.prices.discount.orderLimit.value = t.prices.subtotalBeforeDiscount * parseFloat(e.discount.percentage) / 100, t.prices.discount.orderLimit.text = t.trans.Discount + ": " + e.Title + " (" + e.discount.percentage + " % off)";
                                    else if ("cheapest-free" === e.discount.type) {
                                        let n;
                                        t.checkout.cart.products.forEach(function(t) {
                                            n = void 0 === n ? parseFloat(t.Price) : n > parseFloat(t.Price) ? parseFloat(t.Price) : n
                                        }), t.prices.discount.orderLimit.value = parseFloat(n), t.prices.discount.orderLimit.text = t.trans.Discount + ": " + e.Title + " (" + t.trans.CheapestItemFree + ")"
                                    }
                                    t.prices.discount.orderLimit.value && t.discountList.push({
                                        value: t.prices.discount.orderLimit.value,
                                        type: t.prices.discount.orderLimit.text
                                    })
                                }
                            })()
                        }), this.prices.discount.totalValue = t.prices.discount.nrOfItems.value + this.prices.discount.orderLimit.value
                    }
                },
                onDiscountCodeLoaded: t => {
                    if ("free-shipping" === t.discount.type) this.prices.discount.isFreeShipping = !0, this.prices.shippingCost = 0, this.prices.discount.code.text = this.trans.Discount + ": " + t.Title + " (" + this.trans.FreeShipping + ")";
                    else if ("fixed-amount" === t.discount.type) this.prices.discount.code.value = parseFloat(t.discount.amount), this.prices.discount.code.text = this.trans.Discount + ": " + t.Title + " (" + this.trans.FixedAmount + ")";
                    else if ("percentage" === t.discount.type) this.prices.discount.code.value = this.prices.subtotalBeforeDiscount * parseFloat(t.discount.percentage) / 100, this.prices.discount.code.text = this.trans.Discount + ": " + t.Title + " (" + t.discount.percentage + " % off)";
                    else if ("cheapest-free" === t.discount.type) {
                        let e;
                        this.checkout.cart.products.forEach(function(t) {
                            e = void 0 === e ? parseFloat(t.Price) : e > parseFloat(t.Price) ? parseFloat(t.Price) : e
                        }), this.prices.discount.code.value = parseFloat(e), this.prices.discount.code.text = this.trans.Discount + ": " + t.Title + " (" + this.trans.CheapestItemFree + ")"
                    }
                    this.prices.discount.code.value && this.discountList.push({
                        value: this.prices.discount.code.value,
                        type: this.prices.discount.code.text
                    }), this.prices.discount.totalValue = this.prices.discount.code.value + this.prices.discount.nrOfItems.value + this.prices.discount.orderLimit.value
                },
                initShippingOnRegionChange: () => {
                    if (0 == this.storeSettings.Shipping.Method) this.prices.shippingCost = 0;
                    else if (this.prices.discount.isFreeShipping) this.prices.shippingCost = 0;
                    else if ("yes" == this.customer.selfPickUp) this.prices.shippingCost = 0;
                    else {
                        let t = 0,
                            e = 0;
                        if (this.checkout.cart.products.forEach(function(e) {
                                t += e.Weight * e.Quantity
                            }), 0 === t) e = 0;
                        else if (this.storeSettings.Shipping.Zones && 0 !== this.storeSettings.Shipping.Zones.length) {
                            let n, i, o, s = "no" !== this.customer.shippingIsSame ? this.customer.country.Code : this.customer.shipping.country.Code,
                                r = "no" !== this.customer.shippingIsSame ? this.customer.usState : this.customer.shipping.usState,
                                a = !1;
                            if (this.storeSettings.Shipping.Zones.forEach(function(t) {
                                    "WORLD" === t.Country.Code ? i = t : t.Country.Code === s && ("US" !== t.Country.Code ? n = t : !t.UsStates.includes(r.Code) || "ALL" === t.UsStates && "ALL" === r ? "ALL" === t.UsStates && !1 === a && (n = t) : (n = t, a = !0))
                                }), n && n.WeightRates && n.WeightRates.length > 0 ? o = n.WeightRates : 1 != i.DisableToOther && i.WeightRates && i.WeightRates.length > 0 && (o = i.WeightRates), o) {
                                let n;
                                o.forEach(function(e) {
                                    t >= e.Min && t <= e.Max && (n = e.Price)
                                }), e = n || 0
                            } else e = 0
                        } else e = 0;
                        (e = parseFloat(e)) || (e = 0), this.prices.shippingCost = e
                    }
                },
                initTaxPercentOnRegionChange: () => {
                    let t = this;
                    this.prices.taxPercent = function() {
                        if (0 == t.storeSettings.Taxes.Method) return 0;
                        let e = 0;
                        if (t.storeSettings.Taxes.Zones && 0 !== t.storeSettings.Taxes.Zones.length) {
                            let n, i, o = t.customer.country.Code,
                                s = t.customer.usState,
                                r = !1;
                            t.storeSettings.Taxes.Zones.forEach(function(t) {
                                "WORLD" === t.Country.Code ? i = t : t.Country.Code === o && ("US" !== t.Country.Code ? n = t : !t.UsStates.includes(s.Code) || "ALL" === t.UsStates && "ALL" === s ? "ALL" === t.UsStates && !1 === r && (n = t) : (n = t, r = !0))
                            }), e = n && n.TaxPercent ? n.TaxPercent : i && 1 != i.DisableToOther && i.TaxPercent ? i.TaxPercent : 0
                        } else e = 0;
                        return e
                    }()
                }
            }
        },
        checkForPhysical: function() {
            let t = this;
            this.checkout.cart.products.forEach(function(e) {
                e.IsPhysical && (t.hasPhysical = !0)
            })
        },
        changeShipping: function() {
            "yes" === this.customer.shippingIsSame ? this.customer.shippingIsSame = "no" : this.customer.shippingIsSame = "yes"
        },
        changeSelfPickUp: function() {
            "yes" == this.customer.selfPickUp ? (this.customer.selfPickUp = "no", this.priceCalc().initShippingOnRegionChange()) : (this.customer.selfPickUp = "yes", this.priceCalc().initShippingOnRegionChange())
        },
        openPaymentWindow: function() {
            let t = this,
                e = function() {
                    let e = "";
                    return t.customer.name && t.customer.address && t.customer.zip && t.customer.city && t.customer.country.Code && t.customer.email && ("US" === t.customer.country.Code && t.customer.usState.Code || "US" !== t.customer.country.Code && t.customer.state) || (e += t.trans.NoFieldsCanBeEmpty), "no" === t.customer.shippingIsSame && (t.customer.shipping.name && t.customer.shipping.address && t.customer.shipping.zip && t.customer.shipping.city && t.customer.shipping.country.Code && ("US" === t.customer.country.Code && t.customer.usState.Code || "US" !== t.customer.country.Code && t.customer.state) || (e += "<br/>" + t.trans.ShippingAddress + ": " + t.trans.NoFieldsCanBeEmpty)), t.customer.email = t.customer.email.trim().toLowerCase(), utils.miscFront.validateEmail(t.customer.email) || (e += "<br/>" + t.trans.EmailNotValid), e
                }(),
                n = this.validateRegion();
            if (e) frontApp.alert(e);
            else if (n) "invoice" === this.paymentOption ? this.completeInvoicePayment() : "onLocation" === this.paymentOption ? this.completeOnLocationPayment() : this.showPaymentWindow = !0;
            else {
                let t = this.customer.usState && this.customer.usState.Code ? this.customer.usState.Code : this.customer.state,
                    e = "<div class='alertHeader'>" + this.trans.CheckoutNotAvailable + ": " + this.customer.country.Name + " / " + t + "</div>";
                e += this.trans.ChooseAnotherCountry, frontApp.alert(e)
            }
        },
        completeInvoicePayment: function() {
            frontApi.checkoutCompleteInvoice(this.customer, this.checkout.cart.nrInCart, this.checkout.cart.products, this.subtotalAfterDiscount, this.prices.shippingCost, this.prices.taxPercent, this.taxCost, this.totalPrice, this.storeSettings.Currency, this.storeSettings.Taxes.ShippingNeedsVat, this.discountList).then(t => {
                "error-price" === t ? frontApp.alert(lang.state.common.PleaseContactUsToCheckInventory) : this.onOrderCompleted(t)
            })
        },
        completeOnLocationPayment: function() {
            frontApi.checkoutOnLocation(this.customer, this.checkout.cart.nrInCart, this.checkout.cart.products, this.subtotalAfterDiscount, this.prices.shippingCost, this.prices.taxPercent, this.taxCost, this.totalPrice, this.storeSettings.Currency, this.storeSettings.Taxes.ShippingNeedsVat, this.discountList).then(t => {
                "error-price" === t ? frontApp.alert(lang.state.common.PleaseContactUsToCheckInventory) : this.onOrderCompleted(t)
            })
        },
        onCardPaymentSuccess: function(t) {
            this.showPaymentWindow = !1, this.onOrderCompleted(t)
        },
        onOrderCompleted(t) {
            this.$emit("open-thank-you", this.paymentOption), checkoutStore.actions.clearCart(), this.reportToGoogle(t), this.reportToMeta(t)
        },
        reportToGoogle: function(t) {
            router.push({
                query: {
                    purchase: "complete",
                    transaction_id: t,
                    currency: this.storeSettings.Currency,
                    value: this.totalPrice
                }
            });
            let e = this,
                n = function() {
                    console.log("purchase reported")
                };
            site.state.GoogleAnalyticsId && !window.pb.isAdmin && gtag("event", "purchase", {
                value: e.totalPrice,
                currency: e.storeSettings.Currency,
                transaction_id: t,
                event_callback: n
            })
        },
        reportToMeta: function(t) {
            let e = this;
            site.state.PixelEventManagerId && !window.pb.isAdmin && fbq("track", "Purchase", {
                value: e.totalPrice,
                currency: e.storeSettings.Currency,
                content_ids: [t],
                content_type: "product"
            })
        }
    },
    created: function() {
        this.checkForPhysical(), this.priceCalc().initSubtotalBeforeDiscount(), this.priceCalc().initDiscountOnLoad(), frontApi.getCountryCode().then(t => {
            t && t.Country && t.Country.Code && 2 === t.Country.Code.length ? this.customer.country = t.Country : 1 == this.storeSettings.Settings["hide-country"] && (this.storeSettings.Settings["hide-country"] = 0);
            let e = this;
            frontApp.$nextTick(function() {
                e.regionIsChanged(!0)
            })
        }), this.storeSettings.Payment.AcceptCreditCard ? this.paymentOption = "stripe" : this.storeSettings.Payment.EnablePayPal ? this.paymentOption = "paypal" : this.paymentOption = "invoice", 1 == this.storeSettings.Settings["hide-phone"] && (this.customer.phone = "-"), 1 == this.storeSettings.Settings["hide-address"] && (this.customer.address = "-"), 1 == this.storeSettings.Settings["hide-zip"] && (this.customer.zip = "-"), 1 == this.storeSettings.Settings["hide-city"] && (this.customer.city = "-"), 1 == this.storeSettings.Settings["hide-state"] && (this.customer.state = "-", this.customer.usState.Code = "-")
    },
    template: '\n\t<div class="pbCheckoutWrapper">\n\t\t<checkout-paymentwindow \n\t\t\tv-if="showPaymentWindow" \n\t\t\tv-on:close="showPaymentWindow = false" \n\t\t\tv-bind:bg-color="bgColor" \n\t\t\tv-bind:payment-option="paymentOption" \n\t\t\tv-bind:customer="customer" \n\t\t\tv-bind:subtotal-after-discount="subtotalAfterDiscount"\n\t\t\tv-bind:shipping-cost="prices.shippingCost"\n\t\t\tv-bind:tax-percent="prices.taxPercent"\n\t\t\tv-bind:tax-cost="taxCost"\n\t\t\tv-bind:total-price="totalPrice"\n\t\t\tv-bind:discount-list="discountList"\n\t\t\tv-on:payment-success="onCardPaymentSuccess"\n\t\t></checkout-paymentwindow>\n\t\t<div class="pbCheckoutBg" v-on:click="close"></div>\n\t\t<div class="checkout pbCheckout" v-bind:style="bgColor">\n\t\t\t<span class="closeX" v-on:click="close"></span>\n\t\t\t<span class="arrow leftArr" v-on:click="goToCart" v-if="!checkout.straitToCheckout"></span>\n\t\t\t<h1 class="Header">{{trans.Checkout}}</h1>\n\t\t\t<div class="columns">\n\t\t\t\t<div class="left Form">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<div class="groupWrapper">\n\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t<input id="chName" type="text" v-model="customer.name" placeholder=" ">\n\t\t\t\t\t\t\t\t<label for="chName">{{trans.YourName}}</label>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="InputTwoText emailAndPhone">\n\t\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t\t<input id="chEmail" type="text" v-model="customer.email" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label for="chEmail">{{trans.YourEmail}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="storeSettings.Settings[\'hide-phone\'] != 1" >\n\t\t\t\t\t\t\t\t\t<input id="chPhone" type="text" v-model="customer.phone" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label for="chPhone">{{trans.YourPhone}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="InputTwoText newsAndMessage" v-if="storeSettings.Settings[\'hide-message\'] != 1 || storeSettings.Settings[\'hide-news\'] != 1">\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="storeSettings.Settings[\'hide-message\'] != 1">\n\t\t\t\t\t\t\t\t\t<textarea id="chMessage"  type="text" v-model="customer.message" placeholder=" "></textarea>\n\t\t\t\t\t\t\t\t\t<label for="chMessage">{{trans.YourMessage}}</label>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div v-if="storeSettings.Settings[\'hide-news\'] != 1" class="checkboxWrapper subscribeToNews" >\n\t\t\t\t\t\t\t\t\t<div class="fakeCheckBox" v-on:click="customer.subscribeToNews = !customer.subscribeToNews" v-bind:class="{selected : customer.subscribeToNews }">\n\t\t\t\t\t\t\t\t\t\t<span class="ficon-check checkIcon"></span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="expWrapper">{{trans.SubscribeToNews}}</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class="groupWrapper" v-if="storeSettings.Settings[\'hide-address\'] !=1 || storeSettings.Settings[\'hide-zip\'] != 1  || storeSettings.Settings[\'hide-city\'] != 1 || storeSettings.Settings[\'hide-country\'] != 1 || storeSettings.Settings[\'hide-state\'] != 1">\n\t\t\t\t\t\t\t<div class="inputWrapper" v-if="storeSettings.Settings[\'hide-address\'] != 1">\n\t\t\t\t\t\t\t\t<input id="chAddress" type="text" v-model="customer.address" placeholder=" ">\n\t\t\t\t\t\t\t\t<label for="chAddress">{{trans.YourAddress}}</label>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="InputTwoText" v-if="storeSettings.Settings[\'hide-zip\'] != 1 || storeSettings.Settings[\'hide-city\'] != 1">\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="storeSettings.Settings[\'hide-zip\'] != 1">\n\t\t\t\t\t\t\t\t\t<input id="chZip" type="text" v-model="customer.zip" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label for="chZip">{{trans.YourZip}}</label>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="storeSettings.Settings[\'hide-city\'] != 1" >\n\t\t\t\t\t\t\t\t\t<input id="chCity" type="text" v-model="customer.city" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label for="chCity">{{trans.YourCity}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="InputTwoText" v-if="storeSettings.Settings[\'hide-country\'] != 1 || storeSettings.Settings[\'hide-state\'] != 1">\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="storeSettings.Settings[\'hide-country\'] != 1" >\n\t\t\t\t\t\t\t\t\t<select id="chCountry" v-model="customer.country" v-on:change="regionIsChanged" required>\n\t\t\t\t\t\t\t\t\t\t<option v-bind:value="defaultCountry">{{trans.YourCountry}}</option>\n\t\t\t\t\t\t\t\t\t\t<option v-for="country in countriesList" v-bind:value="country">{{country.Name}}</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t<label for="chCountry">{{trans.YourCountry}}</label>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="customer.country.Code !== \'US\' && storeSettings.Settings[\'hide-state\'] != 1" >\n\t\t\t\t\t\t\t\t\t<input id="chState" type="text" v-model="customer.state" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label for="chState">{{trans.YourState}}</label>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="customer.country.Code === \'US\' && storeSettings.Settings[\'hide-state\'] != 1" >\n\t\t\t\t\t\t\t\t\t<select id="chUsState" v-model="customer.usState" v-on:change="regionIsChanged" required>\n\t\t\t\t\t\t\t\t\t<option v-bind:value="defaultState">{{trans.YourState}}</option>\n\t\t\t\t\t\t\t\t\t<option v-for="state in usStatesList" v-bind:value="state">{{state.Name}}</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t<label for="chUsState">{{trans.YourState}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="checkboxWrapper"  v-if="storeSettings.Settings[\'hide-shipping\'] != 1 && hasPhysical">\n\t\t\t\t\t\t\t\t<div class="fakeCheckBox" v-on:click="changeShipping" v-bind:class="{selected : customer.shippingIsSame === \'yes\' }">\n\t\t\t\t\t\t\t\t\t<span class="ficon-check checkIcon"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="expWrapper">{{trans.ShipToThisAddress}}</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="checkboxWrapper"  v-if="storeSettings.Settings[\'self-pickup\'] == 1 && hasPhysical">\n\t\t\t\t\t\t\t\t<div class="fakeCheckBox" v-on:click="changeSelfPickUp" v-bind:class="{selected : customer.selfPickUp == \'yes\' }">\n\t\t\t\t\t\t\t\t\t<span class="ficon-check checkIcon"></span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="expWrapper">{{trans.CustomerSelfPickup}}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div v-if="customer.shippingIsSame === \'no\'" class="groupWrapper shipping">\n\t\t\t\t\t\t\t<h3 class="Header middleHeader">{{trans.ShippingAddress}}</h3>\n\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t<input type="text" v-model="customer.shipping.name" placeholder=" ">\n\t\t\t\t\t\t\t\t<label>{{trans.Name}}</label>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t<input type="text" v-model="customer.shipping.phone" placeholder=" ">\n\t\t\t\t\t\t\t\t<label>{{trans.Phone}}</label>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t<input type="text" v-model="customer.shipping.address" placeholder=" ">\n\t\t\t\t\t\t\t\t<label>{{trans.Address}}</label>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="InputTwoText">\n\t\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t\t<input type="text" v-model="customer.shipping.zip" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label>{{trans.Zip}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t\t<input type="text" v-model="customer.shipping.city" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label>{{trans.City}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div class="InputTwoText">\n\t\t\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t\t\t<select v-model="customer.shipping.country" v-on:change="regionIsChanged" required>\n\t\t\t\t\t\t\t\t\t\t<option v-bind:value="defaultCountry">{{trans.Country}}</option>\n\t\t\t\t\t\t\t\t\t\t<option v-for="country in countriesList" v-bind:value="country">{{country.Name}}</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t<label>{{trans.Country}}</label>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="customer.shipping.country.Code !== \'US\'">\n\t\t\t\t\t\t\t\t\t<input type="text" v-model="customer.shipping.state" placeholder=" ">\n\t\t\t\t\t\t\t\t\t<label>{{trans.State}}</label>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t<div class="inputWrapper" v-if="customer.shipping.country.Code === \'US\'" >\n\t\t\t\t\t\t\t\t\t<select v-model="customer.shipping.usState" v-on:change="regionIsChanged" required>\n\t\t\t\t\t\t\t\t\t\t<option v-bind:value="defaultState">{{trans.State}}</option>\n\t\t\t\t\t\t\t\t\t\t<option v-for="state in usStatesList" v-bind:value="state">{{state.Name}}</option>\n\t\t\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t\t\t\t<label>{{trans.State}}</label>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class="right">\n\t\t\t\t\t<div class="groupWrapper">\n\t\t\t\t\t\t<div class="productsWrapper">\n\t\t\t\t\t\t\t\x3c!-- Products --\x3e\n\t\t\t\t\t\t\t<article v-for="(product, index) in checkout.cart.products" :key="product.CartGuid">\n\t\t\t\t\t\t\t\t<div class="one">\n\t\t\t\t\t\t\t\t\t<span class="cartImageWrapper"><img v-if="product.Src" v-bind:src="product.Src | thumb(\'w400\')"></span>\n\t\t\t\t\t\t\t\t\t<span class="titleWrapper">\n\t\t\t\t\t\t\t\t\t\t<span class="title">{{product.Title}} \n\t\t\t\t\t\t\t\t\t\t\t<span class="discount" v-if="product.Discount">({{product.Discount}}% {{trans.Off}})</span>\n\t\t\t\t\t\t\t\t\t\t\t<span v-if="product.ExcludeTax" class="exludedFromTax"> - {{trans.ExcludedFromTax}}</span>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t<span class="variation" v-if="product.VariantGuid">{{product.VariantTitle}}</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t<span class="quantityWrapper" v-if="product.Quantity > 1">\n\t\t\t\t\t\t\t\t\t\t<span class="quantity">x {{product.Quantity}}</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="two nrAndPriceWrapper">\n\t\t\t\t\t\t\t\t\t<span class="price">{{product.Price * product.Quantity | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</article>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\x3c!-- Subtotal, Vat, Total --\x3e\n\t\t\t\t\t\t<div class="totalPriceWrapper">\n\t\t\t\t\t\t\t<div class="priceRow" v-if="prices.discount.code.value">\n\t\t\t\t\t\t\t\t<span>{{prices.discount.code.text}}</span>\n\t\t\t\t\t\t\t\t<span>-{{prices.discount.code.value | round(storeSettings.Currency) }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="priceRow" v-if="prices.discount.nrOfItems.value">\n\t\t\t\t\t\t\t\t<span>{{prices.discount.nrOfItems.text}}</span>\n\t\t\t\t\t\t\t\t<span>-{{prices.discount.nrOfItems.value | round(storeSettings.Currency) }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="priceRow" v-if="prices.discount.orderLimit.value">\n\t\t\t\t\t\t\t\t<span>{{prices.discount.orderLimit.text}}</span>\n\t\t\t\t\t\t\t\t<span>-{{prices.discount.orderLimit.value | round(storeSettings.Currency) }}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="priceRow subTotal">\n\t\t\t\t\t\t\t\t<span>{{trans.Subtotal}}</span>\n\t\t\t\t\t\t\t\t<span>{{subtotalAfterDiscount  | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div v-if="!prices.shippingNeedVat">\n\t\t\t\t\t\t\t\t<div class="priceRow">\n\t\t\t\t\t\t\t\t\t<span>{{trans.Taxes}} (<span v-if="prices.taxPercent">{{prices.taxPercent | round(storeSettings.Currency)}}%, </span>{{getShippingCountry()}})</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Taxes.Method == 0" class="shippingAddedLater">-</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Taxes.Method != 0" >{{taxCost  | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="priceRow" v-if="hasPhysical"><span>{{trans.Shipping}} ({{getShippingCountry()}}) </span>\n\t\t\t\t\t\t\t\t\t<span v-if="prices.discount.isFreeShipping" class="shippingAddedLater">{{trans.FreeShipping}}</span>\n\t\t\t\t\t\t\t\t\t<span v-if="!prices.discount.isFreeShipping && customer.selfPickUp ==\'yes\'" class="shippingAddedLater">{{trans.CheckoutSelfPickup}}</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Shipping.Method == 0 && !prices.discount.isFreeShipping && customer.selfPickUp ==\'no\'" class="shippingAddedLater">-</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Shipping.Method != 0 && !prices.discount.isFreeShipping && customer.selfPickUp ==\'no\'" >{{prices.shippingCost  | round(storeSettings.Currency)}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="priceRow">\n\t\t\t\t\t\t\t\t\t<span>{{trans.Total}}</span>\n\t\t\t\t\t\t\t\t\t<span>{{totalPrice  | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<div v-if="prices.shippingNeedVat">\n\t\t\t\t\t\t\t\t<div class="priceRow" v-if="hasPhysical">\n\t\t\t\t\t\t\t\t\t<span>{{trans.Shipping}} ({{getShippingCountry()}}) </span>\n\t\t\t\t\t\t\t\t\t<span v-if="prices.discount.isFreeShipping" class="shippingAddedLater">{{trans.FreeShipping}}</span>\n\t\t\t\t\t\t\t\t\t<span v-if="!prices.discount.isFreeShipping && customer.selfPickUp ==\'yes\'" class="shippingAddedLater">{{trans.CheckoutSelfPickup}}</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Shipping.Method == 0 && !prices.discount.isFreeShipping && customer.selfPickUp ==\'no\'" class="shippingAddedLater">-</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Shipping.Method != 0 && !prices.discount.isFreeShipping && customer.selfPickUp ==\'no\'" >{{prices.shippingCost  | round(storeSettings.Currency)}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="priceRow">\n\t\t\t\t\t\t\t\t\t<span>{{trans.Taxes}} (<span v-if="prices.taxPercent">{{prices.taxPercent | round(storeSettings.Currency)}}%, </span>{{getShippingCountry()}})</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Taxes.Method == 0" class="shippingAddedLater">-</span>\n\t\t\t\t\t\t\t\t\t<span v-if="storeSettings.Taxes.Method != 0" >{{taxCost  | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="priceRow">\n\t\t\t\t\t\t\t\t\t<span>{{trans.Total}}</span>\n\t\t\t\t\t\t\t\t\t<span>{{totalPrice  | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="discountCodeWrapper Form groupWrapper" v-if="storeSettings.Discounts.length > 0">\n\t\t\t\t\t\t<div class="inputWrapper">\n\t\t\t\t\t\t\t<input type="text" v-model="discountCode" placeholder=" ">\n\t\t\t\t\t\t\t<label>{{trans.DiscountCode}}</label>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="Button" v-on:click="checkDiscountCode()">\n\t\t\t\t\t\t\t<span>{{trans.Submit}}</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t\x3c!-- Payment method selections --\x3e\n\t\t\t\t\t<div class="paymentOptionsWrapper" v-if="storeSettings.Payment.Method == 1">\n\t\t\t\t\t\t<h3 class="Header middleHeader">{{trans.HowWouldYouLikeToPay}}</h3>\n\t\t\t\t\t\t<div class="paymentOption" v-if="storeSettings.Payment.AcceptCreditCard" v-bind:class="{selected : paymentOption === \'stripe\' }" v-on:click="paymentOption = \'stripe\'">\n\t\t\t\t\t\t\t<div class="fakeCheckBox" ><span class="ficon-check checkIcon"></span></div>\n\t\t\t\t\t\t\t<div class="expWrapper">\n\t\t\t\t\t\t\t\t{{trans.WithCard}}\n\t\t\t\t\t\t\t\t<span class="ficon-credit-card"></span> \n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="paymentOption" v-if="storeSettings.Payment.EnablePayPal" v-bind:class="{selected : paymentOption === \'paypal\' }" v-on:click="paymentOption = \'paypal\'">\n\t\t\t\t\t\t\t<div class="fakeCheckBox" ><span class="ficon-check checkIcon"></span></div>\n\t\t\t\t\t\t\t<div class="expWrapper">\n\t\t\t\t\t\t\t\t{{trans.WithPayPal}}\n\t\t\t\t\t\t\t\t<span class="ficon-paypal"></span> \n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class="paymentOption" v-if="storeSettings.Payment.EnableInvoice" v-bind:class="{selected : paymentOption === \'invoice\' }" v-on:click="paymentOption = \'invoice\'">\n\t\t\t\t\t\t\t<div class="fakeCheckBox" >\n\t\t\t\t\t\t\t\t<span class="ficon-check checkIcon"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="expWrapper">\n\t\t\t\t\t\t\t\t{{trans.WithInvoice}}\n\t\t\t\t\t\t\t\t<span class="ficon-file"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class="paymentOption" v-if="storeSettings.Payment.EnableOnLocation" v-bind:class="{selected : paymentOption === \'onLocation\' }" v-on:click="paymentOption = \'onLocation\'">\n\t\t\t\t\t\t\t<div class="fakeCheckBox" >\n\t\t\t\t\t\t\t\t<span class="ficon-check checkIcon"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="expWrapper">\n\t\t\t\t\t\t\t\t{{trans.PayOnLocation}}\n\t\t\t\t\t\t\t\t<span class="ficon-map-marker"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class="buttonRow">\n\t\t\t\t\t\t\t<div class="Button" v-if="paymentOption !== \'invoice\' && paymentOption !== \'onLocation\'" v-on:click="openPaymentWindow"><span>{{trans.PayNow}}</span></div>\n\t\t\t\t\t\t\t<div class="Button" v-if="paymentOption === \'invoice\' || paymentOption === \'onLocation\'" v-on:click="openPaymentWindow"><span>{{trans.CompleteOrder}}</span></div>\n\t\t\t\t\t\t\t<div class="acceptTermLink" v-on:click="$emit(\'view-terms\')">{{trans.AcceptByClick}} <span class="termsLink">{{trans.TermsAndPrivacy}}</span></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t'
}), Vue.component("checkout-terms", {
    data: function() {
        return {
            trans: translations.state,
            storeSettings: site.state.StoreSettings
        }
    },
    props: ["bgColor"],
    methods: {
        close: function() {
            this.$emit("close")
        }
    },
    template: '<div class="pbCheckoutWrapper termsAndPoliciesPopup"><div class="pbCheckoutBg" v-on:click="close"></div><div class="pbCheckout" v-bind:style="bgColor"><span class="closeX" v-on:click="close"></span><h1 class="Header">{{trans.ReturnPolicy}}</h1><div class="LongText returnPolicy" v-html="storeSettings.ReturnPolicy"></div><h1 class="Header termsHead">{{trans.TermsAndPrivacy}}</h1><div class="LongText termsAndCond" v-html="storeSettings.TermsAndConditions"></div></div></div>'
}), Vue.component("checkout-thanks", {
    data: function() {
        return {
            trans: translations.state,
            storeSettings: site.state.StoreSettings
        }
    },
    props: ["bgColor", "paymentOption"],
    methods: {
        close: function() {
            this.$emit("close")
        }
    },
    template: '<div class="pbCheckoutWrapper thanksPopup"><div class="pbCheckoutBg" v-on:click="close"></div><div class="pbCheckout" v-bind:style="bgColor"><span class="closeX" v-on:click="close"></span><div><div v-if="!storeSettings.ThankYouMessage"><h1 class="Header">{{trans.ThankYou}}</h1><p class="thanksText" v-html="trans.ThankYouForMakingOrder"></p><p class="thanksText" v-if="paymentOption === \'invoice\'" v-html="storeSettings.Payment.InvoiceMessage"></p></div><div v-if="storeSettings.ThankYouMessage"><p class="thanksText" v-html="storeSettings.ThankYouMessage"></p><p class="thanksText invoiceThanks" v-if="paymentOption === \'invoice\'" v-html="storeSettings.Payment.InvoiceMessage"></p></div><div class="buttonRow"><div class="Button" v-on:click="close"><span>{{trans.Done}}</span></div></div></div></div></div>'
}), Vue.component("checkout-paymentwindow", {
    data: function() {
        return {
            trans: translations.state,
            storeSettings: site.state.StoreSettings,
            checkout: checkoutStore.state,
            cardBillingDetails: null,
            cardPaymentDetails: null,
            isLoaded: !1,
            orderId: ""
        }
    },
    props: ["bgColor", "paymentOption", "customer", "subtotalAfterDiscount", "shippingCost", "taxPercent", "taxCost", "totalPrice", "discountList"],
    methods: {
        close: function() {
            this.$emit("close")
        },
        onPaymentSuccess: function() {
            this.$emit("payment-success", this.orderId)
        },
        cardCallback: function(t, e) {
            t && 200 === t.status ? t.response && t.response.receipt_url && (this.receipt = t.response.receipt_url, this.onPaymentSuccess()) : (console.log(e), e.message && frontApp.alert(e.message))
        },
        onStripePaymentLoading: function() {
            console.log("Loading")
        }
    },
    created: function() {
        frontApi.checkoutPreCreditCard(this.customer, this.checkout.cart.nrInCart, this.checkout.cart.products, this.subtotalAfterDiscount, this.shippingCost, this.taxPercent, this.taxCost, this.totalPrice, this.storeSettings.Currency, this.storeSettings.Taxes.ShippingNeedsVat, this.discountList).then(t => {
            if ("error-price" === t) frontApp.alert(lang.state.common.PleaseContactUsToCheckInventory), this.close();
            else if ("error-timeslot" === t) frontApp.alert(lang.state.common.PleaseSelectDeliveryTimeSlot), this.close();
            else {
                this.orderId = t;
                let e = site.state.Id;
                "stripe" === this.paymentOption ? (this.cardPaymentDetails = new Payment({
                    Amount: this.totalPrice,
                    Currency: this.storeSettings.Currency,
                    OrderId: t,
                    SiteId: e.toString()
                }), this.cardBillingDetails = new Billing({
                    Name: this.customer.name,
                    Address: {
                        Line1: this.customer.address,
                        City: this.customer.city,
                        Phone: this.customer.phone,
                        CountryCode: this.customer.country.Code,
                        PostCode: this.customer.zip,
                        State: this.customer.state
                    },
                    Email: this.customer.email,
                    Phone: ""
                })) : "paypal" === this.paymentOption && (this.cardPaymentDetails = new PayPalPayment({
                    Amount: this.totalPrice,
                    Currency: this.storeSettings.Currency,
                    OrderId: t,
                    SiteId: e.toString(),
                    ShopName: site.state.Url,
                    PayPalEmail: this.storeSettings.Payment.PayPalEmail
                }), this.cardBillingDetails = new PayPalBilling({
                    Name: this.customer.name,
                    Address: {
                        Line1: this.customer.address,
                        City: this.customer.city,
                        Phone: this.customer.phone,
                        PostCode: this.customer.zip,
                        State: this.customer.state
                    },
                    Email: this.customer.email
                }));
                let n = this;
                frontApp.$nextTick(function() {
                    n.isLoaded = !0
                })
            }
        })
    },
    template: '<div class="pbCheckoutWrapper paymentWindow"><div class="pbCheckoutBg" v-on:click="close"></div><div class="pbCheckout" v-bind:style="bgColor"><span class="closeX" v-on:click="close"></span><div v-if="paymentOption === \'paypal\' && isLoaded"><h1 class="Header">{{trans.PayWithPayPal}}</h1><div class="payPalExp">{{trans.PayWithPayPalExp}}</div><div><paypal-client-payment :billing-details="cardBillingDetails" :payment-details="cardPaymentDetails" v-on:callback="cardCallback" is-live="true" api-url="/pb4/externalapi/paypalcallbackapi/paymentcallback"></paypal-client-payment></div></div><div v-if="paymentOption === \'stripe\' && isLoaded"><h1 class="Header">{{trans.PayWithCard}}</h1><div><stripe-client-payment :billing-details="cardBillingDetails" :payment-details="cardPaymentDetails" :callback="cardCallback" api-url="/pb4/frontapi/clientfrontstripeapi/pay" :button-text="trans.CompletePayment" @stripepaymentloading="onStripePaymentLoading" ></stripe-client-payment></div></div></div></div>'
}), Vue.component("added-to-cart-popup", {
    data: function() {
        return {
            trans: translations.state,
            checkout: checkoutStore.state,
            product: {},
            bgColor: {
                "background-color": "#fff"
            }
        }
    },
    methods: {
        close: function() {
            this.checkout.showAddedToCart = !1
        },
        goToCheckout: function() {
            this.checkout.showCheckout = !0, this.close()
        }
    },
    created: function() {
        this.product = this.checkout.lastAddedProduct, site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        }, site.state.GlobalClasses.Page.color ? this.bgColor["border-color"] = utils.miscFront.convertToRGBA(site.state.GlobalClasses.Page.color) : this.bgColor["border-color"] = utils.miscFront.convertToRGBA("#000000"))
    },
    template: '<div class="addedToCartWrapper"><div class="addedToCartBg" v-on:click="close"></div><div class="addedToCartContent" v-bind:style="bgColor"><div class="product"><span class="cartImageWrapper"><img v-if="product.Src" v-bind:src="product.Src | thumb(\'w400\')"></span><span class="titleWrapper"><span class="title">{{product.Title}}</span><span class="variation" v-if="product.VariantGuid">{{product.VariantTitle}}</span></span></div><div class="message"><p>{{trans.ItemAddedToCart}}</p></div><div class="buttons"><div class="Button" v-on:click="close"><span>{{trans.ContinueShopping}}</span></div><div class="Button" v-on:click="goToCheckout"><span>{{trans.GoToCheckout}}</span></div></div></div></div>'
}), Vue.component("pb-link", {
    props: ["to", "ex-target"],
    data: function() {
        return {
            tag: "router-link",
            target: "",
            rel: "",
            link: "",
            linkedObject: null
        }
    },
    created: function() {
        this.link = this.to, this.link.BookingGuid ? (this.tag = "pb-link-booking", this.linkedObject = this.to, this.link = void 0, this.target = void 0) : this.link.Content ? (this.tag = "pb-link-scheduling", this.linkedObject = this.to, this.link = void 0, this.target = void 0) : "/" === this.link.charAt(0) && !this.link.includes("#") || "?" === this.link.charAt(0) || (this.link.includes("#video") ? this.tag = "pb-link-thumbvideo" : this.link.includes("#") && !(this.link.indexOf("://") > 0 || 0 === this.link.indexOf("//")) ? this.tag = "pb-link-scrolltoid" : "scrolltotop" === this.link ? this.tag = "pb-link-scrolltotop" : this.link ? (this.tag = "a", this.target = this.exTarget ? this.exTarget : "_blank") : this.tag = "pb-link-empty")
    },
    template: '\n\t\t<component v-bind:is="tag" v-bind:to="link" v-bind:href="link" v-bind:target="target" v-bind:linkedObject="linkedObject"><slot></slot></component>\n\t'
}), Vue.component("pb-link-scrolltotop", {
    methods: {
        scrollToTop: function() {
            window.pb.isAdmin ? document.getElementById("frontApp").scrollTo({
                top: 0,
                behavior: "smooth"
            }) : window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    },
    template: '<span class="scrollToTop hasLink" v-on:click="scrollToTop"><slot></slot></span>'
}), Vue.component("pb-link-scrolltoid", {
    props: ["to"],
    methods: {
        scrollToId: function() {
            let t, e, n = 0,
                i = this.to.split("#");
            if (i.length > 1) {
                e = i[0];
                let o = function() {
                    t = i[1];
                    let e = document.getElementById(t);
                    e && (n = e.offsetTop, window.pb.isAdmin ? document.getElementById("frontApp").scrollTo({
                        top: n,
                        behavior: "smooth"
                    }) : window.scrollTo({
                        top: n,
                        behavior: "smooth"
                    }))
                };
                pages.state.current.page.Url || products.state.current.product.Url || posts.state.current.post.Url ? "/" === e && pages.state.current.page.IsStartPage ? (o(), this.$hiddenMenu = Math.floor(1001 * Math.random())) : e !== pages.state.current.page.Url ? router.push(e, function() {
                    setTimeout(function() {
                        o()
                    }, 100)
                }) : (o(), this.$hiddenMenu = Math.floor(1001 * Math.random())) : pwdPages.state.current.page.Url && o()
            }
        }
    },
    template: '<span class="scrollToId hasLink" v-bind:to="to" v-on:click="scrollToId"><slot></slot></span>'
}), Vue.component("pb-link-thumbvideo", {
    props: ["to"],
    methods: {
        playVideo: function() {
            let t = this.to.replace("#video=", ""),
                e = document.getElementById("imgWrapper-" + t);
            if (e.classList.contains("gotVideo")) {
                e.className += " playingVideo";
                let t = e.dataset.iframesrc,
                    n = "auto",
                    i = "auto",
                    o = utils.environment.wWidth();
                if (o < 1e3 && e.dataset.iframeheight && e.dataset.iframewidth) {
                    n = (o - 40) / (e.dataset.iframewidth / e.dataset.iframeheight), i = o + 40, e.style.setProperty("height", n + "px", "important")
                }
                e.innerHTML = utils.miscFront.makeIFrame(t, i, n, 0, 1, 0)
            }
        }
    },
    template: '<span class="playVideo" v-on:click="playVideo"><slot></slot></span>'
}), Vue.component("pb-link-empty", {
    props: ["to"],
    template: window.pb.isAdmin ? '<router-link v-bind:to="to" class="emptyLink"><slot></slot></router-link>' : '<span class="emptyLink"><slot></slot></span>'
}), Vue.component("pb-link-booking", {
    data: function() {
        return {
            trans: translations.state,
            checkoutStore: checkoutStore,
            bookingPopUpStore: bookingPopUpStore,
            bookings: [],
            booking: null,
            bookingsFetched: !1
        }
    },
    props: ["linkedObject"],
    methods: {
        getBookings: function() {
            if (this.bookingsFetched) return new Promise(t => {
                t(window.bookings)
            });
            {
                let t = this;
                return new Promise(e => {
                    frontApi.getBookings(this).then(n => {
                        t.bookings = n, t.bookingsFetched = !0, window.bookings = n, e(n)
                    })
                })
            }
        },
        addToCart: function() {
            !this.linkedObject.LinkSpecificAlternative && this.booking.Alternatives.length > 0 ? bookingPopUpStore.actions.showBookingPopup(this.booking, this.linkedObject.StraitToCheckout) : this.booking.BookedSeats >= this.booking.Seats || utils.miscFront.isBookingSoldOut(this.booking) ? this.soldOut() : this.linkedObject.StraitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, null), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, null), checkoutStore.state.showAddedToCart = !0)
        },
        addToCartSpecificAlternative: function() {
            !this.linkedAlternative || this.linkedAlternative.BookedSeats >= this.linkedAlternative.Seats || utils.miscFront.isBookingSoldOut(this.booking, this.linkedAlternative) ? this.soldOut() : this.linkedObject.StraitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, this.linkedAlternative), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, this.linkedAlternative), checkoutStore.state.showAddedToCart = !0)
        },
        soldOut: function() {
            frontApp.alert(this.trans.BookedOutMessage)
        },
        bookAlternative: function(t) {
            this.linkedObject.StraitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, t), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, t), checkoutStore.state.showAddedToCart = !0)
        }
    },
    computed: {
        linkedAlternative: function() {
            return this.booking && this.linkedObject.AlternativeGuid ? utils.arrayHelper.findItemByGuid(this.booking.Alternatives, this.linkedObject.AlternativeGuid) : null
        }
    },
    created: function() {
        window.bookings ? (this.bookings = window.bookings, this.bookingsFetched = !0, this.booking = utils.arrayHelper.findItemByGuid(window.bookings, this.linkedObject.BookingGuid)) : this.getBookings().then(t => {
            this.bookings = t, this.booking = utils.arrayHelper.findItemByGuid(window.bookings, this.linkedObject.BookingGuid)
        })
    },
    template: '\n\t\t\t\t<span v-if="booking && linkedObject.BookingGuid && !linkedObject.LinkSpecificAlternative" class="bookingLink hasLink" v-on:click="addToCart"><slot></slot></span>\n\n\t\t\t\t<span v-else-if="booking && linkedObject.BookingGuid && (linkedObject.LinkSpecificAlternative && linkedObject.AlternativeGuid)" class="bookingLink hasLink" v-on:click="addToCartSpecificAlternative"><slot></slot></span>\n\n\t\t\t\t<span v-else-if="!booking && linkedObject.BookingGuid || (linkedObject.LinkSpecificAlternative && !linkedObject.AlternativeGuid)" class="bookingLink hasLink" v-on:click="soldOut"><slot></slot></span>\n\t'
}), Vue.component("pb-link-scheduling", {
    props: ["linkedObject"],
    methods: {
        openScheduling: async function(t) {
            schedulingStore.state.front.element = this.linkedObject, 1 === this.linkedObject.Content.useConnected && (schedulingStore.state.front.selectedService = this.linkedObject.Content.connectedService, schedulingStore.state.front.selectedPersonnel = this.linkedObject.Content.connectedPersonnel), schedulingStore.state.front.showPopup = !0
        }
    },
    template: '<span class="scrollToId hasLink" v-bind:linkedObject="linkedObject" v-on:click="openScheduling()"><slot></slot></span>'
}), Vue.component("front-alert-popup", {
    data: function() {
        return {
            trans: translations.state,
            bgColor: {}
        }
    },
    props: ["message"],
    methods: {
        close: function() {
            this.$emit("close")
        }
    },
    created: function() {
        site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        }, site.state.GlobalClasses.Page.color ? this.bgColor["border-color"] = utils.miscFront.convertToRGBA(site.state.GlobalClasses.Page.color) : this.bgColor["border-color"] = utils.miscFront.convertToRGBA("#000000"))
    },
    template: '<div class="frontMessagePopup"><div class="frontMessagePopupBg" v-on:click="close"></div><div class="frontMessageContent" v-bind:style="bgColor"><div class="message"><div v-html="message"></div></div><div class="btnWrapper"><div class="Button" v-on:click="close"><span v-bind:style="bgColor">{{trans.Ok}}</span></div></div></div></div>'
}), Vue.component("front-confirm-popup", {
    props: ["message", "confirm"],
    data: function() {
        return {
            trans: translations.state,
            bgColor: {}
        }
    },
    methods: {
        close: function() {
            this.$emit("close")
        },
        doConfirm: function() {
            this.confirm(), this.close()
        }
    },
    created: function() {
        site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        })
    },
    template: '<div class="frontMessagePopup"><div class="frontMessagePopupBg" v-on:click="close"></div><div class="frontMessageContent" v-bind:style="bgColor"><div class="message"><div v-html="message"></div></div><div class="btnWrapper"><div class="Button marginRight" v-on:click="close"><span v-bind:style="bgColor">{{trans.No}}</span></div><div class="Button" v-on:click="doConfirm"><span v-bind:style="bgColor">{{trans.Yes}}</span></div></div></div></div>'
}), Vue.component("portfoliobox-link", {
    data: function() {
        return {
            site: site.state,
            isVisible: !0
        }
    },
    methods: {
        doClick: function() {
            adminApp.upgradeAlert("Upgrade to PRO PLUS to remove this Portfoliobox link.")
        },
        shouldItShow: function(t) {
            this.isVisible = "/" === t
        }
    },
    watch: {
        "$route.path": "shouldItShow"
    },
    created: function() {
        this.shouldItShow(this.$route.path)
    },
    template: window.pb.isAdmin ? '' : ''
}), Vue.component("cookie-message", {
    data: function() {
        return {
            site: site.state,
            showMessage: !0,
            trans: translations.state
        }
    },
    methods: {
        doAccept: function() {
            localStorage.setItem("cookieMessageAccepted", "accepted"), this.showMessage = !1
        },
        leaveWebsite: function() {
            window.location.href = "https://www.google.com"
        },
        allowNecessary: function() {
            site.state.GoogleAnalyticsId && (window["ga-disable-" + site.state.GoogleAnalyticsId] = !0), this.doAccept()
        }
    },
    created: function() {
        "accepted" === localStorage.getItem("cookieMessageAccepted") && (this.showMessage = !1)
    },
    template: '<div class="cookieMessage"  v-if="showMessage"><div class="message LongText" v-html="site.CookieMessage"></div><div class="optionsWrapper"><span class="allow" v-on:click="doAccept">{{trans.Allow}}</span><span class="necessary" v-on:click="allowNecessary">{{trans.AllowNecessary}}</span><span class="leave" v-on:click="leaveWebsite">{{trans.LeaveWebsite}}</span></div></div>'
}), Vue.component("music-player", {
    data: function() {
        return {
            site: site.state,
            showMessage: !0,
            iFrameSrc: ""
        }
    },
    methods: {
        close: function() {
            this.site._showMusicPlayer = !1
        },
        doPlay: function() {
            this.iFrameSrc = this.site._musicPlayerTrack.IFrameSrc, this.iFrameSrc += "?autoplay=1", this.iFrameSrc += "&playsinline=1", this.iFrameSrc += "&title=0&byline=0&portrait=0&sidedock=0&controls=0&modestbranding=1&autohide=1&showinfo=0"
        }
    },
    mounted: function() {
        this.doPlay()
    },
    template: '<div class="musicPlayer"><span class="closeX" v-on:click="close"></span><div class="iframeWrapper"><iframe v-bind:width="site._musicPlayerTrack.IFrameWidth" v-bind:height="site._musicPlayerTrack.IFrameHeight" v-bind:src="iFrameSrc" frameborder="0" allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="trackInfo LongText">{{site._musicPlayerTrack.Title}}</div></div>'
}), Vue.component("pb-bookingselect", {
    data: function() {
        return {
            storeSettings: site.state.StoreSettings,
            bookingPopUpStore: bookingPopUpStore,
            trans: translations.state,
            showMobileActionsGuid: "",
            bgColor: {},
            booking: bookingPopUpStore.state.booking,
            straitToCheckout: bookingPopUpStore.state.straitToCheckout,
            currentSelection: null
        }
    },
    methods: {
        close: function() {
            this.currentSelection = null, bookingPopUpStore.state.booking = null, bookingPopUpStore.state.straitToCheckout = !1, bookingPopUpStore.state.showBookingPopup = !1
        },
        selectAlternative: function(t) {
            this.currentSelection = t, this.bookAlternative()
        },
        bookAlternative: function() {
            this.currentSelection && this.currentSelection.BookedSeats < this.currentSelection.Seats && !utils.miscFront.isBookingSoldOut(this.booking, this.currentSelection) ? (bookingPopUpStore.state.straitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, this.currentSelection), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, this.currentSelection), checkoutStore.state.showAddedToCart = !0), this.close()) : frontApp.alert(this.trans.BookedOutMessage)
        }
    },
    created: function() {
        site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        }, site.state.GlobalClasses.Page.color ? this.bgColor["border-color"] = utils.miscFront.convertToRGBA(site.state.GlobalClasses.Page.color) : this.bgColor["border-color"] = utils.miscFront.convertToRGBA("#000000"))
    },
    template: '\n\t\t<div class="bookingPopup">\n\t\t\t<div class="bookingPopupBg" v-on:click="close"></div>\n\t\t\t<div class="cgContent" v-bind:style="bgColor" >\n\t\t\t\t<h3 class="Header3">{{trans.SelectAlternative}}</h3>\n\t\t\t\t\n\t\t\t\t<ul v-if="booking && booking.Alternatives && booking.Alternatives.length > 0">\n\t\t\t\t\t<li v-for="alternative in booking.Alternatives" :key="alternative.Guid" @click="selectAlternative(alternative)">\n\t\t\t\t\t\t<span class="left">\n\t\t\t\t\t\t\t<span class="title">{{alternative.Title}}</span>\n\t\t\t\t\t\t\t<span class="description" v-html="alternative.Description"></span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class="right">{{alternative.Price | currency(storeSettings.Currency)}}</span>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t'
}), Vue.component("scheduling-popup-main-view", {
    data: function() {
        return {
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            checkoutStore: checkoutStore,
            show: {
                services: !1,
                calendar: !1
            },
            schedulingStore: schedulingStore,
            element: schedulingStore.state.front.element,
            useConnected: !1,
            bgColor: "#ffffff",
            ulBg: {
                "background-color": "rgba(255,255,255,1)"
            }
        }
    },
    methods: {
        close: function() {
            schedulingStore.state.front.activeWindow = 0, schedulingStore.state.front.showPopup = !1, this.$emit("close")
        },
        goForward: function() {
            if (this.useConnected && 1 === schedulingStore.state.front.activeWindow && schedulingStore.state.front.skip.personnel) return schedulingStore.state.front.activeWindow += 2;
            schedulingStore.state.front.activeWindow++
        },
        goBack: function() {
            if (this.useConnected) {
                if (2 === schedulingStore.state.front.activeWindow && schedulingStore.state.front.skip.services) return this.close();
                if (3 === schedulingStore.state.front.activeWindow && schedulingStore.state.front.skip.all) return this.close();
                if (3 === schedulingStore.state.front.activeWindow && schedulingStore.state.front.skip.personnel) return schedulingStore.state.front.activeWindow -= 2
            }
            schedulingStore.state.front.activeWindow--
        },
        handleConnectedProcess: async function() {
            try {
                this.element.Content.connectedService && this.element.Content.connectedPersonnel ? await this.handleBothConnected() : this.element.Content.connectedService ? await this.handleServiceConnected() : this.element.Content.connectedPersonnel ? await this.handlePersonnelConnected() : this.defaultToServiceSelection()
            } catch (t) {
                this.handleError(t)
            }
        },
        handleBothConnected: async function() {
            const [t, e] = await this.fetchConnectedServiceAndPersonnel();
            this.setStoreWithServiceAndPersonnel(t, e), this.skipAllSteps(), this.setActiveWindow(3)
        },
        handleServiceConnected: async function() {
            const t = await this.fetchConnectedService();
            this.setStoreWithService(t), this.skipServicesStep(), this.setActiveWindow(2)
        },
        handlePersonnelConnected: async function() {
            const t = await this.fetchConnectedPersonnel();
            this.setStoreWithPersonnel(t), this.skipPersonnelStep(), this.setActiveWindow(1)
        },
        fetchConnectedService: async function() {
            return await schedulingStore.actions.fetchOneService(this.element.Content.connectedService.Guid)
        },
        fetchConnectedPersonnel: async function() {
            return await schedulingStore.actions.fetchOnePersonnel(this.element.Content.connectedPersonnel.Guid)
        },
        fetchConnectedServiceAndPersonnel: async function() {
            return await Promise.all([this.fetchConnectedService(), this.fetchConnectedPersonnel()])
        },
        setStoreWithService: function(t) {
            this.schedulingStore.state.front.selectedService = t
        },
        setStoreWithPersonnel: function(t) {
            this.schedulingStore.state.front.selectedPersonnel = t
        },
        setStoreWithServiceAndPersonnel: function(t, e) {
            this.setStoreWithService(t), this.setStoreWithPersonnel(e)
        },
        skipAllSteps: function() {
            for (let t in this.schedulingStore.state.front.skip) this.schedulingStore.state.front.skip.hasOwnProperty(t) && (this.schedulingStore.state.front.skip[t] = !0)
        },
        skipServicesStep: function() {
            this.schedulingStore.state.front.skip.services = !0
        },
        skipPersonnelStep: function() {
            this.schedulingStore.state.front.skip.personnel = !0
        },
        setActiveWindow: function(t) {
            this.schedulingStore.state.front.activeWindow = t
        },
        handleError: function(t) {
            this.schedulingStore.state.front.activeWindow = 1, this.useConnected = !1, console.error(t.message)
        },
        defaultToServiceSelection: function() {
            this.setActiveWindow(1)
        },
        initializeData: async function() {
            await schedulingStore.actions.init(), this.element = schedulingStore.state.front.element, 1 === this.element.Content.useConnected && this.element.Content.connectedService || this.element.Content.connectedPersonnel ? this.useConnected = !0 : this.useConnected = !1, await this.handleConnectedProcess()
        },
        setBackgroundStyles: function() {
            site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
                "background-color": site.state.GlobalClasses.Page["background-color"]
            }, site.state.GlobalClasses.Page.color ? this.bgColor.borderColor = utils.miscFront.convertToRGBA(site.state.GlobalClasses.Page.color) : this.bgColor.borderColor = utils.miscFront.convertToRGBA("#000000"))
        }
    },
    created: async function() {
        await this.initializeData(), this.setBackgroundStyles()
    },
    template: '\n\t\t<div class="schedulingWrapper0" v-if="schedulingStore.state.front.activeWindow !== 0">\n\t\t\t<scheduling-popup-service-view \n\t\t\t\tv-if="schedulingStore.state.front.activeWindow === 1" \n\t\t\t\tv-on:close="close()"\n\t\t\t\tv-on:goBack="goBack()" \n\t\t\t\tv-on:goForward="goForward()" \n\n\t\t\t\t:bg-color="bgColor"\n\t\t\t></scheduling-popup-service-view>\n\n\t\t\t<scheduling-popup-personnel-view \n\t\t\t\tv-if="schedulingStore.state.front.activeWindow === 2" \n\t\t\t\tv-on:close="close()"\n\t\t\t\tv-on:goBack="goBack()" \n\t\t\t\tv-on:goForward="goForward()" \n\n\t\t\t\t:bg-color="bgColor"\n\t\t\t></scheduling-popup-personnel-view>\n\n\t\t\t<scheduling-popup-calendar-view \n\t\t\t\tv-if="schedulingStore.state.front.activeWindow === 3" \n\t\t\t\tv-on:close="close()"\n\t\t\t\tv-on:goBack="goBack()" \n\t\t\t\tv-on:goForward="goForward()"\n\n\t\t\t\t:elementContentImageSrc="element && element.Content.ImgSrc"\n\t\t\t\t:straitToCheckout="element && element.Content.StraitToCheckout"\n\n\t\t\t\t:bg-color="bgColor"\n\t\t\t></scheduling-popup-calendar-view>\n\t\t</div>\n\t\t\t'
}), Vue.component("scheduling-popup-service-view", {
    data: function() {
        return {
            trans: translations.state,
            services: [],
            selectedService: null
        }
    },
    props: ["bgColor"],
    methods: {
        close: function() {
            this.$emit("close")
        },
        goForward: function() {
            this.$emit("goForward")
        },
        selectService: function(t) {
            schedulingStore.state.front.selectedService = t, schedulingStore.state.front.skip.personnel || (schedulingStore.state.front.selectedPersonnel = null), schedulingStore.state.front.selectedDate = null, schedulingStore.state.front.selectedTime = null, this.selectedService = t, this.goForward()
        }
    },
    created: async function() {
        this.selectedService = schedulingStore.state.front.selectedService, schedulingStore.state.initilized || await schedulingStore.actions.init();
        let t = schedulingStore.state.items.services;
        return this.services = t.filter(t => t.AttachedPersonnel && t.AttachedPersonnel.length > 0), t && 0 !== t.length ? this.services && 0 !== this.services.length ? void 0 : (frontApp.alert("There are no personnel available at the moment"), this.close()) : (frontApp.alert("There are no services available at the moment"), this.close())
    },
    template: '\n\t<div class="schedulingWrapper1">\n\t\t<div class="schedulingPopupBg" v-on:click="close"></div>\n\t\t<div class="schedulingContent" v-bind:style="bgColor">\n\x3c!--\t\t\t<span v-on:click="close" class="goBack arrow leftArr"></span>--\x3e\n\t\t\t\n\t\t\t<h3 class="Header3">{{trans.SchedulingServiceHeading}}</h3>\n\n\t\t\t<ul class="scheduleList">\n\t\t\t\t<li :class="{active: selectedService && selectedService.Guid === item.Guid}" v-for="item in services" :key="item.Guid" v-on:click="selectService(item)">\n\t\t\t\t\t<span class="left">\n\t\t\t\t\t\t<span class="title">{{item.Title}}</span>\n\t\t\t\t\t\t<span class="description">{{item.Subtitle}}</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="right">{{item.Duration}} {{trans.Minutes}}</span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n\t\t\t'
}), Vue.component("scheduling-popup-personnel-view", {
    data: function() {
        return {
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            personnel: [],
            selectedPersonnel: null,
            defaultIconSrc: "/pb4/_output/admin/_img/dummy3/scheduling/user-icon.svg"
        }
    },
    props: ["bgColor"],
    methods: {
        close: function() {
            this.$emit("close")
        },
        goBack: function() {
            this.$emit("goBack")
        },
        goForward: function() {
            this.$emit("goForward")
        },
        selectPersonnel: function(t) {
            const e = schedulingStore.actions.getPersonnelPrice(t),
                n = {
                    ...t,
                    Price: e
                };
            this.selectedPersonnel = n, schedulingStore.state.front.selectedPersonnel = n, schedulingStore.state.front.selectedDate = null, schedulingStore.state.front.selectedTime = null, this.goForward()
        },
        getPersonnelPrice: function(t) {
            return schedulingStore.actions.getPersonnelPrice(t)
        }
    },
    created: function() {
        this.selectedService = schedulingStore.state.front.selectedService, this.selectedPersonnel = schedulingStore.state.front.selectedPersonnel;
        let t = schedulingStore.state.items.personnels;
        t && 0 !== t.length || (this.selectedPersonnel = schedulingStore.state.front.selectedPersonnel = null, frontApp.alert("No personnel found")), this.personnel = t.filter(t => this.selectedService.AttachedPersonnel.find(e => e.PersonnelGuid === t.Guid))
    },
    template: '\n\t<div class="schedulingWrapper1">\n\t\t<div class="schedulingPopupBg" v-on:click="close"></div>\n\t\t<div class="schedulingContent" v-bind:style="bgColor">\n\t\t\t<span v-on:click="goBack" class="goBack arrow leftArr"></span>\n\t\t\t\n\t\t\t<h3 class="Header3">{{trans.SchedulingPersonnelHeading}}</h3>\n\n\t\t\t<ul class="scheduleList personalUl">\n\t\t\t\t<li :class="{active: selectedPersonnel && selectedPersonnel.Guid === item.Guid}" v-for="item in personnel" :key="item.Guid" v-on:click="selectPersonnel(item)">\n\t\t\t\t\t<span class="left">\n\t\t\t\t\t\t<span class="imageWrapper">\n\t\t\t\t\t\t\t<img v-if="item.Image && item.Image[0] && item.Image[0].src" v-bind:src="item.Image[0].src | thumb(\'w400\')">\t\t\t\n\t\t\t\t\t\t\t<img v-if="!item.Image" :src="defaultIconSrc">\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t<span class="title">{{item.Name}}</span>\n\t\t\t\t\t\t\t<span class="description">{{item.Subtitle}}</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t\t<span class="right">\n\t\t\t\t\t\t{{getPersonnelPrice(item) | currency(storeSettings.Currency)}}\n\t\t\t\t\t</span>\n\t\t\t\t</li>\n\t\t\t</ul>\n\n\t\t</div>\n\t</div>\n\t\t\t'
}), Vue.component("scheduling-popup-calendar-view", {
    data: function() {
        return {
            trans: translations.state,
            selectedPersonnel: null,
            selectedService: null,
            selectedDate: null,
            selectedTime: null,
            workinghours: [],
            bookedTimeslots: [],
            currentWorkingHours: null,
            allDisplayedDates: [],
            totalDaysToDisplay: 30
        }
    },
    props: ["bgColor", "straitToCheckout"],
    methods: {
        close: function() {
            this.$emit("close")
        },
        addToCart: function() {
            const t = ` ${this.selectedDate.fullDate} (${this.minutesToTime(this.selectedTime.startTime)} - ${this.minutesToTime(this.selectedTime.endTime)})`,
                e = this.selectedService.Image && this.selectedService.Image.length > 0 ? this.selectedService.Image[0].src : "",
                n = this.selectedPersonnel && this.selectedService.Price ? schedulingStore.actions.getPersonnelPrice(this.selectedPersonnel) : 0;
            let i = {
                ProductType: "scheduling",
                Guid: utils.miscFront.generateGuid(),
                Scheduling: {
                    TimeFrom: this.selectedTime.startTime,
                    TimeTo: this.selectedTime.endTime,
                    Date: this.selectedDate.fullDate,
                    ServiceGuid: this.selectedService.Guid,
                    PersonnelGuid: this.selectedPersonnel.Guid
                },
                CartGuid: this.selectedService.Guid,
                Title: this.selectedService.Title + t,
                Url: "",
                Price: n,
                Src: e,
                ExcludeTax: !(!this.selectedService.ExcludeTax || 1 !== this.selectedService.ExcludeTax),
                Weight: 0,
                IsPhysical: 0,
                Quantity: 1,
                TrackInventory: 0,
                Inventory: null,
                VariantGuid: this.selectedService.Guid + this.selectedPersonnel.Guid,
                VariantTitle: this.selectedPersonnel.Name
            };
            this.straitToCheckout ? (checkoutStore.actions.addToCart(i), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addToCart(i), checkoutStore.state.showAddedToCart = !0), schedulingStore.actions.resetFrontState(), this.close()
        },
        selectNewDate: async function(t) {
            this.selectedDate = schedulingStore.state.front.selectedDate = t, this.selectedTime = schedulingStore.state.front.selectedTime = null, this.currentWorkingHours = this.updateTimeslots(t.apps)
        },
        selectNewTime: function(t) {
            if (!t.booked && this.selectedTime !== t) {
                if (!t || this.selectedTime && this.selectedTime === t) return this.selectedTime = schedulingStore.state.front.selectedTime = null;
                this.selectedTime = t, schedulingStore.state.front.selectedTime = t
            }
        },
        updateTimeslots: function(t) {
            if (!t) return [];
            const e = [];
            return t.forEach(t => {
                const {
                    StartTime: n,
                    EndTime: i
                } = t;
                let o = n;
                const s = this.selectedService.Duration;
                if (s && 0 !== s)
                    for (; o + s <= i;) {
                        let t = this.isBookedByTime(o, o + s);
                        t ? (e.push({
                            startTime: t.TimeFrom,
                            endTime: t.TimeTo,
                            booked: !0
                        }), o = t.TimeTo) : (e.push({
                            startTime: o,
                            endTime: o + s
                        }), o += s)
                    } else e.push({
                        startTime: n,
                        endTime: i
                    })
            }), e
        },
        isBookedByTime: function(t, e) {
            const n = this.bookedTimeslots.filter(t => t.PersonnelGuid === this.selectedPersonnel.Guid && t.Date === this.selectedDate.fullDate);
            for (let i of n)
                if (t >= i.TimeFrom && t < i.TimeTo || e > i.TimeFrom && e <= i.TimeTo || t <= i.TimeFrom && e >= i.TimeTo) return i;
            return null
        },
        getWorkingHoursForDate(t) {
            if (!this.workinghours) return null;
            const e = this.workinghours.filter(e => e.Date === t.fullDate);
            return e.length > 0 ? e : null
        },
        minutesToTime: function(t) {
            const e = Math.floor(t / 60),
                n = t % 60,
                i = new Date;
            return i.setHours(e), i.setMinutes(n), i.toLocaleTimeString(navigator.language, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: "en-US" === navigator.language
            })
        },
        getCurrentDetails: function(t) {
            return {
                dayOfWeek: [this.trans.Sunday, this.trans.Monday, this.trans.Tuesday, this.trans.Wednesday, this.trans.Thursday, this.trans.Friday, this.trans.Saturday][t.getDay()],
                currentDate: t.getDate(),
                currentMonth: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][t.getMonth()]
            }
        },
        getDaysInMonth: function(t, e) {
            return new Date(t, e + 1, 0).getDate()
        },
        getMonthDetails: function(t, e = 0) {
            let n = new Date(t);
            n.setDate(1), n.setMonth(n.getMonth() + e);
            const i = this.getDaysInMonth(n.getFullYear(), n.getMonth()),
                o = [this.trans.Sunday, this.trans.Monday, this.trans.Tuesday, this.trans.Wednesday, this.trans.Thursday, this.trans.Friday, this.trans.Saturday],
                s = [];
            for (let e = 1; e <= i; e++) {
                const i = new Date(t.getFullYear(), n.getMonth(), e),
                    a = o[i.getDay()];
                s.push({
                    dateNumber: e,
                    dayOfWeek: a,
                    month: t.getMonth(),
                    year: t.getFullYear(),
                    fullDate: (r = i, `${r.getFullYear()}-${(r.getMonth()+1).toString().padStart(2,"0")}-${r.getDate().toString().padStart(2,"0")}`)
                })
            }
            var r;
            return s
        },
        goBack: function() {
            this.$emit("goBack")
        },
        goForward: function() {
            this.$emit("goForward")
        },
        scrollBack: function() {
            const t = document.getElementById("dateScrollWrapper"),
                e = .9 * t.offsetWidth,
                n = t.scrollLeft - e;
            t.scrollTo({
                left: n,
                behavior: "smooth"
            })
        },
        scrollForward: function() {
            const t = document.getElementById("dateScrollWrapper"),
                e = .9 * t.offsetWidth,
                n = t.scrollLeft + e;
            t.scrollTo({
                left: n,
                behavior: "smooth"
            })
        }
    },
    created: async function() {
        this.allDisplayedDates = [], this.selectedService = schedulingStore.state.front.selectedService, this.selectedPersonnel = schedulingStore.state.front.selectedPersonnel;
        const t = new Date;
        this.date = this.getCurrentDetails(t);
        const e = this.getMonthDetails(t),
            n = this.getMonthDetails(t, 1),
            i = e.length - this.date.currentDate;
        e.splice(0, e.length - i - 1);
        const o = this.totalDaysToDisplay - e.length,
            s = [...e, ...n.slice(0, o)];
        this.workinghours = await schedulingStore.actions.fetchWorkingHoursForDateRange(s[0].fullDate, s[s.length - 1].fullDate), this.bookedTimeslots = await schedulingStore.actions.fetchBookedTimeslots(), s.forEach(t => {
            t.apps = this.getWorkingHoursForDate(t), t.booked = !1
        }), this.allDisplayedDates = s, this.selectNewDate(this.allDisplayedDates[0])
    },
    template: '\n\t<div class="schedulingWrapper1">\n\t\t<div class="schedulingPopupBg" v-on:click="close"></div>\n\t\t<div class="schedulingContent schedulingCalendar" v-bind:style="bgColor">\n\t\t\n\t\t\t<span v-on:click="goBack" class="goBack arrow leftArr"></span>\n\n\t\t\t<h3 class="Header3">{{trans.SchedulingCalendarHeading}}</h3>\n\t\t\t\n\t\t\t<div class="dateListWrapper">\n\t\t\t\t<span v-on:click="scrollBack" class="arrow leftArr"></span></span>\n\t\t\t\t\n\t\t\t\t<div class="dateScrollWrapper" id="dateScrollWrapper">\n\t\t\t\t\t<ul class="dateList">\n\t\t\t\t\t\t<li v-for="item in allDisplayedDates" :class="[{ \'selected\': selectedDate === item }, { \'empty\': !item.apps }]" v-on:click="selectNewDate(item)" :data-date-number="item.dateNumber">\n\t\t\t\t\t\t\t<span class="day">{{item.dayOfWeek}}</span>\n\t\t\t\t\t\t\t<span class="number">{{item.dateNumber}}</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\t\n\t\t\t\t\n\t\t\t\t<span v-on:click="scrollForward" class="arrow rightArr"></span></span>\n\t\t\t</div> \n\t\t\t\n\n\t\t\t<div class="timeSlotsWrapper">\n\t\t\t\n\t\t\t\t<ul class="timeSlots" v-if="currentWorkingHours && currentWorkingHours.length > 0">\n\t\t\t\t\t<li v-for="item in currentWorkingHours" :class="[{ \'inactive\': item.booked === true }, { \'selected\': selectedTime === item }]" v-on:click="selectNewTime(item)">\n\t\t\t\t\t\t<span>{{minutesToTime(item.startTime)}} - {{minutesToTime(item.endTime)}}</span>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t\n\t\t\t\t<span class="noTimeslot" v-if="!currentWorkingHours || currentWorkingHours.length < 1">{{trans.SchedulingNoTimeslotAvailable}}</span>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="confirmButtonWrapper" v-if="selectedTime">\n\t\t\t\t<div class="button" v-bind:style="bgColor" v-on:click="addToCart">{{trans.Confirm}}</div>\n\t\t\t</div>\n\t\t\t\n\t\t</div>\n\t</div>\n\t'
}), Vue.component("logo-view", {
    data: function() {
        return {
            isMobile: !1
        }
    },
    props: ["element"],
    created: function() {
        this.isMobile = utils.environment.wWidth() < 1e3
    },
    template: '<h1 class="Logo pbEdit" v-bind:class="[element.Settings[\'animation\'],element.Content.Src ? \'isImgLogo\' : \'\']"  data-type="Logo" v-bind:id="element.Guid" v-bind:style="element.Style" ><pb-link v-if="!element.Content.Src && !(isMobile && element.Content.SrcMobile)" v-bind:to="element.Content.Link ? element.Content.Link : \'\'" v-bind:ex-target="element.Content.Target">{{element.Content.Text}}</pb-link><pb-link v-if="element.Content.Src && !(isMobile && element.Content.SrcMobile)" v-bind:to="element.Content.Link ? element.Content.Link : \'\'" v-bind:ex-target="element.Content.Target" class="imgLogo"><img v-bind:style="{\'max-height\':element.Content.ImageHeight}" v-bind:src="element.Content.Src | thumb(\'w1000\',element.Content.Source)" v-bind:alt="element.Content.Text"></pb-link><pb-link v-if="isMobile && element.Content.SrcMobile" v-bind:to="element.Content.Link ? element.Content.Link : \'\'" v-bind:ex-target="element.Content.Target" class="imgLogo"><img v-bind:style="{\'max-height\':element.Content.ImageHeightMobile}" v-bind:src="element.Content.SrcMobile | thumb(\'w1000\',element.Content.SourceMobile)" v-bind:alt="element.Content.Text"></pb-link></h1>'
}), Vue.component("mainmenulinks-view", {
    data: function() {
        return {
            menu: site.state.MainMenu
        }
    },
    created: function() {
        if (this.menu.Links && this.menu.Links.length > 0) {
            const t = {
                Name: "",
                svgElement: "",
                svgBase64: ""
            };
            this.menu.Links.map((e, n) => {
                e.svgBase64 && !e.svgElement ? Vue.set(e, "svgElement", this.decodeSvg(e.svgBase64)) : e.svgBase64 || e.svgElement || e.Name || Object.keys(t).forEach(n => {
                    Vue.set(e, n, t[n])
                })
            })
        }
    },
    methods: {
        decodeSvg: function(t) {
            return decodeURIComponent(atob(t))
        }
    },
    watch: {
        "menu.Links": {
            deep: !0,
            handler: function(t, e) {
                t.forEach((t, n) => {
                    e.includes(t) || !t.svgBase64 || t.svgElement || Vue.set(t, "svgElement", this.decodeSvg(t.svgBase64))
                })
            }
        }
    },
    props: ["element"],
    template: "<div class=\"MainMenuLinks pbEdit\" v-bind:class=\"[element.Settings && element.Settings['animation'] ? element.Settings['animation'] : '', element.Settings && element.Settings['underline-style'] ? ['underlineBottom', element.Settings['underline-style']] : '']\" data-type=\"MainMenuLinks\" v-bind:id=element.Guid v-bind:style=element.Style>" + '<div v-for="item in menu.Links" :key="item.Guid" class="linkWrapper"><div class="iconLinksWrapper" v-if="item.svgElement"><pb-link v-bind:to="item.Link" v-if="item.Title" v-bind:ex-target="item.Target" v-bind:id="item.Guid"><span class="linkSpan">{{item.Title}}</span></pb-link><pb-link class="icon" v-bind:to="item.Link" v-bind:ex-target="item.Target" v-bind:style="{ \'margin-right\': item.Title ? \'0.3em\' : \'\' }">\n\t\t\t\t\t\t\t\t<span class="iconWrapper" v-html="item.svgElement"></span>\n\t\t\t\t\t\t\t</pb-link></div><pb-link v-bind:to="item.Link" v-if="item.Title && !item.svgElement" v-bind:ex-target="item.Target" v-bind:id="item.Guid" ><span class="linkSpan">{{item.Title}}</span></pb-link><div class="sublinks" v-if="item.Sublinks"><pb-link v-for="sub in item.Sublinks" :key="sub.Guid" v-bind:to="sub.Link" v-bind:ex-target="sub.Target" v-bind:id="sub.Guid">{{sub.Title}}</pb-link></div></div></div>'
}), Vue.component("columns-view", {
    props: ["element"],
    template: '<div class="Columns pbEdit" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  data-type="Columns" v-bind:id=element.Guid v-bind:style=element.Style><column-view v-for="column in element.Columns" :key="column.Guid" v-bind:column="column"></column-view></div>'
}), Vue.component("column-view", {
    props: ["column"],
    template: '<div class="Column pbEdit pbSortable" data-type="Column" v-bind:id=column.Guid v-bind:style=column.Style><component v-for="element in column.Elements" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div>'
}), Vue.component("header-view", {
    props: ["element"],
    template: '<h1 class="Header pbEdit" data-type="Header" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  v-bind:id="element.Guid" v-bind:style="element.Style">{{element.Content}}</h1>'
}), Vue.component("header2-view", {
    props: ["element"],
    template: "<h2 class=\"Header2 pbEdit\" data-type=\"Header2\" v-bind:class=\"element.Settings && element.Settings['animation'] ? element.Settings['animation'] : ''\"  v-bind:id=element.Guid v-bind:style=element.Style>{{element.Content}}</h2>"
}), Vue.component("header3-view", {
    props: ["element"],
    template: "<h3 class=\"Header3 pbEdit\" data-type=\"Header3\" v-bind:class=\"element.Settings && element.Settings['animation'] ? element.Settings['animation'] : ''\"  v-bind:id=element.Guid v-bind:style=element.Style>{{element.Content}}</h3>"
}), Vue.component("shorttext-view", {
    props: ["element"],
    template: "<div class=\"ShortText pbEdit\" v-bind:class=\"element.Settings && element.Settings['animation'] ? element.Settings['animation'] : ''\"  data-type=\"ShortText\" v-bind:id=element.Guid v-bind:style=element.Style>{{element.Content}}</div>"
}), Vue.component("longtext-view", {
    props: ["element"],
    template: '<div class="LongText pbEdit" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  data-type="LongText" v-bind:id=element.Guid v-bind:style=element.Style v-html="element.Content"></div>'
}), Vue.component("singleimage-view", {
    data: function() {
        return {
            alt: site.state.Title
        }
    },
    props: ["element"],
    template: '<div class="SingleImage pbEdit" data-type="SingleImage" v-bind:id="element.Guid" v-bind:style="element.Style" v-bind:class="[element.Settings[\'shadows\'],element.Settings[\'round\'],element.Settings[\'rounded\'],element.Settings[\'borders\'],element.Settings[\'animation\']]"><pb-img v-if="!element.Content.IFrameSrc" height="auto" width="100%" v-bind:style="element.Style" v-bind:src="element.Content.Src" v-bind:thumb-type="element.Settings[\'thumb-type\']" v-bind:alt="alt" v-bind:class="[element.Settings[\'hover-transition\']]" v-bind:source="element.Content.Source" data-test></pb-img><pb-video v-if="element.Content.IFrameSrc" v-bind:element="element" v-bind:alt="alt"></pb-video></div> '
}), Vue.component("linkimage-view", {
    data: function() {
        return {
            alt: site.state.Title
        }
    },
    props: ["element"],
    template: '<div class="LinkImage pbEdit" data-type="LinkImage" v-bind:id="element.Guid" v-bind:style="element.Style" v-bind:class="[element.Settings[\'shadows\'],element.Settings[\'rounded\'],element.Settings[\'borders\'],element.Settings[\'animation\']]"><pb-link class="iconWrapper" v-bind:to="element.Content.Link" v-bind:ex-target="element.Content.Target"><pb-img height="auto" width="100%" v-bind:src="element.Content.Src" v-bind:thumb-type="element.Settings[\'thumb-type\']" v-bind:alt="alt" v-bind:class="[element.Settings[\'hover-transition\']]" v-bind:source="element.Content.Source"></pb-img></pb-link></div> '
}), Vue.component("icon-view", {
    data: function() {
        return {
            alt: this.element.Content.Name,
            fillColor: "#ff0000",
            svgContent: null
        }
    },
    created: function() {
        this.fillColor = this.element.Style.color || "#000000", this.fetchSvg()
    },
    methods: {
        async fetchSvg() {
            try {
                if (!this.element.Content.Name) return;
                const t = await fetch("/pb4/_output/front/_css/fontawesome-icons/svgs/" + this.element.Content.Name + ".svg");
                if (!t.ok) throw new Error(`HTTP error! Status: ${t.status}`);
                const e = (await t.text()).replace(/<path/g, `<path fill="${this.fillColor}"`);
                this.svgContent = `data:image/svg+xml;base64,${btoa(e)}`
            } catch (t) {
                console.error("Error fetching SVG:", t)
            }
        }
    },
    watch: {
        "element.Content.Name": function(t, e) {
            this.fetchSvg()
        },
        "element.Style.color": function(t, e) {
            this.fillColor = t, this.fetchSvg()
        }
    },
    props: ["element"],
    template: '\n    <div class="Icon pbEdit" data-type="Icon" v-bind:id="element.Guid" v-bind:style="element.Style" v-bind:class="element.Settings[\'animation\']">\n      <pb-link class="imgWrapper" v-if="element.Content.Name" v-bind:to="element.Content.Link" v-bind:ex-target="element.Content.Target">\n        <object type="image/svg+xml" :data="svgContent" width="100%" height="auto" v-bind:class="[element.Settings[\'hover-transition\']]"></object>\n      </pb-link>\n    </div>\n  '
}), Vue.component("singleimagebg-view", {
    props: ["element"],
    template: '<div class="SingleImageBg pbEdit" v-bind:class="[element.Settings[\'animation\']]" data-type="SingleImageBg" v-bind:id="element.Guid" v-bind:style="element.Style"><div class="bgOverlay" v-if="element.Settings[\'bg-overlay\']" v-bind:style="\'background-color:\'+element.Settings[\'bg-overlay\']"></div><pb-bgimg class="theBgImgDiv" v-bind:class="[element.Settings[\'hover-transition\'], element.Settings[\'rounded\']]" v-if="!element.Content.IFrameSrc" height="auto" width="100%" v-bind:src="element.Content.Src"></pb-bgimg><pb-bgvideo v-if="element.Content.IFrameSrc" v-bind:element="element"></pb-bgvideo></div>'
}), Vue.component("gallery-view", {
    props: ["element", "viewType", "incDesc", "incButton", "thumbType", "sectionGuid", "allowLinkInDesc"],
    template: '<div class="Gallery pbEdit" v-bind:class="[element.Settings[\'figcap-position\'],element.Settings[\'shadows\'],element.Settings[\'rounded\'],element.Settings[\'borders\'],element.Settings[\'hover-transition\'],element.Settings[\'class\']]" v-bind:data-type="viewType" v-bind:id="element.Guid" v-bind:style="element.Style"><item-view v-for="item in element.Content" :key="item.Guid" v-bind:element="item" v-bind:class="element.Settings[\'animation\']" v-bind:inc-desc="incDesc" v-bind:inc-button="incButton" v-bind:allow-link-in-desc="allowLinkInDesc" v-bind:thumb-type="thumbType" v-bind:image-size="element.Settings[\'item-size\']" v-bind:view-type="viewType" v-bind:section-guid="sectionGuid" v-bind:lightbox="element.Settings[\'lb-lightbox\'] ? element.Settings[\'lb-lightbox\'] : \'\'" v-bind:lightbox-template="element.Settings[\'lb-template\']" v-bind:iframe-thumb-play="element.Settings[\'iframe-thumb-play\'] ? element.Settings[\'iframe-thumb-play\'] : \'\'"></item-view></div>'
}), Vue.component("slideshow-view", {
    props: ["element", "viewType"],
    data: function() {
        return {
            activeIdx: 0,
            itemsLength: 0,
            intervalFunction: null
        }
    },
    created: function() {
        this.activeIdx = 0, this.element.Settings["start-random"] && this.element.Content && this.element.Content.length > 0 && (this.activeIdx = Math.floor(Math.random() * this.element.Content.length))
    },
    mounted() {
        let t = this.element;
        if (!t.Content || t.Content.length < 1) return;
        this.itemsLength = t.Content.length, document.getElementById("img-" + t.Content[this.activeIdx].Guid).src = this._adjustImgForScreen(t.Content[this.activeIdx]), t.Content.forEach(function(t) {
            utils.miscFront.preloadImg(t.Content.Src)
        });
        let e = this,
            n = this.element.Settings["slide-speed"] ? 1e3 * this.element.Settings["slide-speed"] : 4e3;
        this.element.Settings["auto-slide"] && (this.intervalFunction = setInterval(function() {
            e.navClick("forward")
        }, n)), document.onkeydown = function(t) {
            37 === t.keyCode ? e.navClick("back") : 39 === t.keyCode && e.navClick("forward")
        }
    },
    destroyed() {
        document.onkeydown = null, clearInterval(this.intervalFunction)
    },
    methods: {
        _adjustImgForScreen: function(t) {
            if (!t.Content.Src) return "";
            let e = "";
            return t.Content.Source || (e = utils.miscFront.adjustThumbForScreen("")), e ? t.Content.Src.replace(/\/(?=[^\/]*$)/, "/" + e + "-") : t.Content.Src
        },
        navClick: function(t) {
            let e, n = this.element;
            !n.Content || n.Content.length < 1 || ("back" === t ? (this.activeIdx--, this.activeIdx < 0 && (this.activeIdx = n.Content.length - 1)) : (this.activeIdx++, this.activeIdx > n.Content.length - 1 && (this.activeIdx = 0)), e = n.Content[this.activeIdx], document.getElementById("img-" + e.Guid).src = this._adjustImgForScreen(e))
        },
        onMobileClick: function(t) {
            if (utils.environment.wWidth() < 1e3) {
                let e = t.target,
                    n = e.getBoundingClientRect();
                t.clientX - n.left < e.offsetWidth / 2 ? this.navClick("back") : this.navClick("forward")
            }
        },
        playVideo: function(t) {
            let e = this.element.Content[this.activeIdx];
            e.Content.IFrameSrc && (document.getElementById("sl-ImgWrapper-" + e.Guid).innerHTML = utils.miscFront.makeIFrame(e.Content.IFrameSrc, e.Content.IFrameWidth, e.Content.IFrameHeight, this.element.Settings["iframe-hide-controls"], 1, this.element.Settings["iframe-mute"]), t.stopPropagation())
        }
    },
    template: '<div class="Slideshow pbEdit" v-bind:class="[element.Settings[\'item-fit\'],element.Settings[\'figcap-position\'],element.Settings[\'hover-transition\'],element.Settings[\'class\'],element.Settings[\'auto-slide\']]" data-type="Slideshow" v-bind:id="element.Guid" v-bind:style="element.Style"><span class="arrowContainer" v-on:click="navClick(\'back\')"><span class="arrow leftArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="navClick(\'forward\')"><span class="arrow rightArr"></span></span><figure v-for="(item, index) in element.Content" :key="item.Guid" class="Item" v-bind:class="[element.Settings[\'animation\'], item.Content.IFrameSrc ? \'gotVideo\' : \'\' ]"  v-bind:id="item.Guid" v-bind:style="item.Style" v-show="index === activeIdx"><a class="imgWrapper" v-bind:id="\'sl-ImgWrapper-\'+item.Guid" v-on:click="onMobileClick"><span class="playIcon ficon-playback-play" v-on:click="playVideo"></span><img v-bind:id="\'img-\'+item.Guid" v-bind:data-src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width" ></a><figcaption class="aFigcaption" v-if="item.Content.FigCaptions && item.Content.FigCaptions[0].Content"><component v-bind:is="figCap.View" v-for="figCap in item.Content.FigCaptions" :key="figCap.Guid" v-bind:element="figCap"></component></figcaption></figure></div>'
}), Vue.component("item-view", {
    props: ["element", "animation", "incDesc", "incButton", "thumbType", "viewType", "lightbox", "lightboxTemplate", "sectionGuid", "iframeThumbPlay", "imageSize", "allowLinkInDesc"],
    computed: {
        itemLink: function() {
            if (this.element.Content.IFrameSrc && 1 == this.iframeThumbPlay) return "#video=" + this.element.Guid;
            if (this.element.Content.Link) return this.element.Content.Link;
            if (this.lightbox && "none" !== this.lightbox) {
                let t = "?s=" + this.sectionGuid + "&i=" + this.element.Guid;
                return "vertical" === this.lightboxTemplate && (t += "&t=vertical"), t
            }
            return ""
        }
    },
    template: '<figure class="Item" v-bind:class="animation" data-type="Item" v-bind:id="\'item-\'+element.Guid" v-bind:data-id="element.Guid" v-bind:style="element.Style"><pb-link v-if="element.Content.Src" v-bind:to="itemLink" v-bind:ex-target="element.Content.Target"  class="imgWrapper" v-bind:class="{gotVideo : element.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+element.Guid" v-bind:data-iframesrc="element.Content.IFrameSrc" v-bind:data-iframeheight="element.Content.IFrameHeight" v-bind:data-iframewidth="element.Content.IFrameWidth"><span class="playIcon ficon-playback-play"></span><pb-lazyimg    v-if="viewType === \'Gallery\'" v-bind:alt="element.Content.Alt" v-bind:id="\'img-\'+element.Guid" v-bind:src="element.Content.Src" v-bind:height="element.Content.Height" v-bind:width="element.Content.Width" v-bind:thumb-type="thumbType" v-bind:image-size="imageSize" v-bind:source="element.Content.Source"></pb-lazyimg><pb-img        v-if="viewType !== \'Gallery\'" v-bind:alt="element.Content.Alt" v-bind:id="\'img-\'+element.Guid" v-bind:src="element.Content.Src" v-bind:height="element.Content.Height" v-bind:width="element.Content.Width" v-bind:thumb-type="thumbType" v-bind:image-size="imageSize" v-bind:source="element.Content.Source"></pb-img></pb-link><pb-link v-if="!element.Content.Src" v-bind:to="itemLink" v-bind:ex-target="element.Content.Target" class="imgWrapper" v-bind:id="\'imgWrapper-\'+element.Guid"><pb-img v-bind:id="\'img-\'+element.Guid" src="/pb4/_output/admin/_img/dummy3/mixed/transparent.png" height="1000" width="1000" v-bind:thumb-type="thumbType" source="1"></pb-img></pb-link><pb-link class="aFigcaption" v-bind:to="element.Content.Link || itemLink" v-bind:ex-target="element.Content.Target"  v-if="element.Content.FigCaptions && element.Content.FigCaptions[0] && element.Content.FigCaptions[0].Content && !allowLinkInDesc"><component v-bind:is="figCap.View" v-for="figCap in element.Content.FigCaptions" :key="figCap.Guid" v-bind:element="figCap" v-bind:link="element.Content.Link" v-bind:target="element.Content.Target" v-bind:inc-desc="incDesc" v-bind:inc-button="incButton"></component></pb-link><span class="aFigcaption" v-if="element.Content.FigCaptions && element.Content.FigCaptions[0] && element.Content.FigCaptions[0].Content && allowLinkInDesc"><component v-bind:is="figCap.View" v-for="figCap in element.Content.FigCaptions" :key="figCap.Guid" v-bind:element="figCap" v-bind:link="element.Content.Link" v-bind:target="element.Content.Target" v-bind:inc-desc="incDesc" v-bind:inc-button="incButton"></component></span></figure>'
}), Vue.component("captiontitle-view", {
    props: ["element"],
    template: '<span class="CaptionTitle" data-type="CaptionTitle" v-bind:id="element.Guid" v-bind:style="element.Style">{{element.Content}}</span>'
}), Vue.component("captionsubtitle-view", {
    props: ["element"],
    template: "<span class=\"CaptionSubTitle\" v-bind:class=\"element.Settings && element.Settings['animation'] ? element.Settings['animation'] : ''\" data-type=\"CaptionSubTitle\" v-bind:id=element.Guid v-bind:style=element.Style>{{element.Content}}</span>"
}), Vue.component("captiontext-view", {
    props: ["element", "incDesc"],
    template: '<div v-if="incDesc === \'yes\'" class="CaptionText" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  data-type="CaptionText" v-bind:id="element.Guid" v-bind:style="element.Style" v-html="element.Content"></div>'
}), Vue.component("captionbutton-view", {
    props: ["element", "link", "incButton", "target"],
    template: '<div v-if="element.Content && incButton === \'yes\'" class="CaptionButton" data-type="CaptionButton" v-bind:id="element.Guid" v-bind:style="element.Style"><pb-link v-bind:ex-target="target" v-bind:to="link || \'\'" >{{element.Content}}</pb-link></div>'
}), Vue.component("border-view", {
    props: ["element"],
    template: "<div class=\"Border pbEdit\" v-bind:class=\"element.Settings && element.Settings['animation'] ? element.Settings['animation'] : ''\" data-type=\"Border\" v-bind:id=element.Guid v-bind:style=element.Style></div>"
}), Vue.component("button-view", {
    props: ["element"],
    methods: {
        mouseO: function() {
            site.state.ChildLinks[this.element.Guid] && site.state.ChildLinks[this.element.Guid]["a:hover"] && site.state.ChildLinks[this.element.Guid]["a:hover"].color && (this.$el.style.borderColor = site.state.ChildLinks[this.element.Guid]["a:hover"].color)
        },
        mouseL: function() {
            this.$el.style.borderColor = "currentColor"
        }
    },
    mounted: function() {
        site.state.ChildLinks && site.state.ChildLinks[this.element.Guid] && site.state.ChildLinks[this.element.Guid]["a:hover"] && site.state.ChildLinks[this.element.Guid]["a:hover"].color && (this.$el.addEventListener("mouseover", this.mouseO), this.$el.addEventListener("mouseleave", this.mouseL))
    },
    destroyed: function() {
        document.removeEventListener("mouseover", this.mouseO), document.removeEventListener("mouseleave", this.mouseL)
    },
    template: "\n\t\t<div class=\"Button pbEdit\" v-bind:class=\"element.Settings && element.Settings['animation'] ? element.Settings['animation'] : ''\" data-type=\"Button\" v-bind:id=\"element.Guid\" v-bind:style=\"element.Style\" v-if=\"element.Content.Title\">\n\t\t\t<pb-link v-bind:to=\"element.Content.Link\" v-bind:ex-target=\"element.Content.Target\" v-bind:style=\"{'padding-top': element.Style['padding-top'], 'padding-bottom': element.Style['padding-bottom'], 'padding-left': element.Style['padding-left'], 'padding-right': element.Style['padding-right']}\">{{element.Content.Title}}</pb-link>\n\t\t</div>\n\t"
}), Vue.component("link-view", {
    props: ["element"],
    template: "<span class=\"Link pbEdit\" v-bind:class=\"[element.Settings && element.Settings['animation'] ? element.Settings['animation'] : '', element.Settings && element.Settings['underline-style'] ? ['underlineBottom', element.Settings['underline-style']] : '']\"  data-type=\"Link\" v-bind:id=element.Guid v-bind:style=\"element.Style\"><pb-link v-bind:to=\"element.Content.Link\" v-bind:ex-target=\"element.Content.Target\"><span class=\"linkSpan\">{{element.Content.Title}}</span></pb-link></span>"
}), Vue.component("links-view", {
    props: ["element"],
    template: "<div class=\"Links pbEdit\" v-bind:class=\"[element.Settings && element.Settings['animation'] ? element.Settings['animation'] : '', element.Style['flex-direction'] && element.Style['flex-direction'] === 'column' ? 'isFlexColumn' : '', element.Settings && element.Settings['underline-style'] ? ['underlineBottom', element.Settings['underline-style']] : '']\"  data-type=\"Links\" v-bind:id=element.Guid v-bind:style=element.Style>" + '<pb-link v-for="item in element.Content" :key="item.Guid" v-bind:to="item.Link" v-bind:ex-target="item.Target" v-bind:id=item.Guid v-bind:style="item.Style" ><span class="linkSpan">{{item.Title}}</span></pb-link></div>'
}), Vue.component("music-view", {
    props: ["element"],
    data: function() {
        return {
            site: site.state,
            showMessage: !0
        }
    },
    methods: {
        openPlayer: function(t) {
            this.site._showMusicPlayer = !1, this.site._musicPlayerTrack = {};
            let e = this;
            frontApp.$nextTick(function() {
                e.site._showMusicPlayer = !0, e.site._musicPlayerTrack = t
            })
        }
    },
    template: '<div class="Music pbEdit" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  data-type="Music" v-bind:id="element.Guid" v-bind:style="element.Style"><div v-for="item in element.Content" :key="item.Guid" class="track" v-on:click="openPlayer(item)"><div class="coverAndArtist"><div class="trackImageWrapper"><pb-img v-bind:height="item.Height " v-bind:width="item.Width" v-bind:src="item.Src" alt="" source="1"></pb-img><span class="playIcon ficon-playback-play"></span></div><span class="artist">{{item.Artist}}</span></div><div class="titleAndLength cell"><span class="title">{{item.Title}}</span><span class="length">{{item.Length}}</span></div></div></div>'
}), Vue.component("form-view", {
    props: ["element"],
    template: "<form class=\"pbEdit Form\" v-bind:class=\"[element.Settings && element.Settings['animation'] ? element.Settings['animation'] : '',element.Settings && element.Settings['form-btn-position'] ? element.Settings['form-btn-position'] : '',element.Settings && element.Settings['form-style'] ? element.Settings['form-style'] : '']\"  data-type=\"Form\" v-bind:id=\"element.Guid\" v-bind:style=\"element.Style\">" + '<component v-bind:is="input.View" v-for="input in element.Content" :key="input.Guid" v-bind:element="input" v-bind:form="element"></component></form>'
}), Vue.component("inputtext-view", {
    props: ["element"],
    template: '<div class="inputWrapper" v-bind:style="element.Style" v-bind:id="\'inputWrapper\'+element.Guid"><input type="text" v-model="element.Content.Answer" placeholder=" " class="InputText" data-type="InputText" v-bind:id="element.Guid"><label v-bind:for="element.Guid">{{element.Content.Title | mandatory(element.Content.Mandatory)}}</label></div>'
}), Vue.component("inputcheckbox-view", {
    props: ["element"],
    template: '<label class="InputCheckbox" data-type="InputCheckbox" v-bind:id="element.Guid" v-bind:style="element.Style"><input type="checkbox" v-model="element.Content.Answer" ><span class="title" v-html="element.Content.Title"></span></label>'
}), Vue.component("inputemail-view", {
    props: ["element"],
    template: '<div class="inputWrapper" v-bind:style="element.Style" v-bind:id="\'inputWrapper\'+element.Guid"><input type="email" v-model="element.Content.Answer" placeholder=" " class="InputEmail" data-type="InputEmail" v-bind:id="element.Guid"><label v-bind:for="element.Guid">{{element.Content.Title | mandatory(element.Content.Mandatory)}}</label></div>'
}), Vue.component("inputtextarea-view", {
    props: ["element"],
    template: '<div class="inputWrapper" v-bind:style="element.Style" v-bind:id="\'inputWrapper\'+element.Guid"><textarea class="InputTextArea" placeholder=" " data-type="InputText" v-bind:id="element.Guid" v-model="element.Content.Answer"></textarea><label v-bind:for="element.Guid">{{element.Content.Title | mandatory(element.Content.Mandatory)}}</label></div>'
}), Vue.component("inputselect-view", {
    props: ["element"],
    template: '<div class="inputWrapper" v-bind:style="element.Style" v-bind:id="\'inputWrapper\'+element.Guid"><select required class="InputSelect" v-bind:id="element.Guid" v-model="element.Content.Answer"><option value=""></option><option v-for="option in element.Content.Options" :key="option.Guid" v-bind:value="option.Title">{{option.Title}}</option></select><label v-bind:for="element.Guid">{{element.Content.Title | mandatory(element.Content.Mandatory)}}</label></div>'
}), Vue.component("inputoptions-view", {
    props: ["element"],
    data: function() {
        return {
            selectedOptions: []
        }
    },
    methods: {
        toggleOption: function(t) {
            this.selectedOptions.includes(t.Title) ? utils.arrayHelper.deleteElement(this.selectedOptions, t.Title) : this.selectedOptions.push(t.Title), this.element.Content.Answer = this.selectedOptions
        }
    },
    template: '<div class="InputOptions" v-bind:id="element.Guid" v-bind:style="element.Style"><div class="optionsTitle">{{element.Content.Title | mandatory(element.Content.Mandatory)}}</div><ul><li v-for="option in element.Content.Options" :key="option.Guid" v-bind:value="option.Title" v-on:click="toggleOption(option)" v-bind:class="{selected : selectedOptions.includes(option.Title)}">{{option.Title}}</li></ul></div>'
}), Vue.component("inputtwotext-view", {
    props: ["element"],
    methods: {
        changeAnswer: function() {
            let t = this.element.Content.Texts[0].Title + ": " + this.element.Content.Texts[0].Value;
            t += ", " + this.element.Content.Texts[1].Title + ": " + this.element.Content.Texts[1].Value, this.element.Content.Answer = t
        }
    },
    template: '<div class="InputTwoText" v-bind:id="element.Guid" v-bind:style="element.Style"><div class="inputWrapper" v-for="text in element.Content.Texts" :key="text.Guid"><input v-bind:id="text.Guid" type="text" v-on:change="changeAnswer" v-model="text.Value" placeholder=" "><label v-bind:for="text.Guid">{{text.Title | mandatory(element.Content.Mandatory)}}</label></div></div>'
}), Vue.component("inputbutton-view", {
    props: ["element", "form"],
    data: function() {
        return {
            showReCaptcha: !1,
            trans: translations.state
        }
    },
    methods: {
        submitForm: function() {
            if (this.form.Content && this.form.Content.length > 1) {
                let t = {},
                    e = 0,
                    n = !1;
                if (this.form.Content.forEach(function(i) {
                        i.Content && i.Content.Answer && (t[i.Content.Title] = i.Content.Answer), i.Content && "inputemail-view" === i.View && !utils.miscFront.validateEmail(i.Content.Answer) && e++, i.Content.Mandatory && !i.Content.Answer ? n = !0 : i.Content.Mandatory && "inputtwotext-view" === i.View && (i.Content.Texts[0].Value && i.Content.Texts[1].Value || (n = !0))
                    }), Object.keys(t).length < 1) frontApp.alert(this.trans.NoFieldsCanBeEmpty);
                else if (n) frontApp.alert(this.trans.MandatoryFieldsAreEmpty);
                else if (e) frontApp.alert(this.trans.EmailNotValid);
                else {
                    let e = this;
                    this.showReCaptcha = !0, frontApp.confirm(e.trans.AreYouSure, function() {
                        utils.miscFront.renderCaptchaAndGetToken().then(n => {
                            frontApi.submitForm(pages.state.current.url, t, n).then(t => {
                                e.form.Content.forEach(function(t) {
                                    t.Content && t.Content.Answer && (Array.isArray(t.Content.Answer) ? t.Content.Answer = [] : t.Content.Answer = "", t.Content.Texts && (t.Content.Texts[0] && (t.Content.Texts[0].Value = ""), t.Content.Texts[1] && (t.Content.Texts[1].Value = "")))
                                }), e.showReCaptcha = !1, frontApp.alert(e.trans.ThankYou)
                            })
                        })
                    })
                }
            }
        }
    },
    template: '<div class="Button" v-bind:style="element.Style"><a v-on:click="submitForm()">{{element.Content.Title}}</a><div v-if="showReCaptcha" id="recaptchaHolder"></div></div>'
}), Vue.component("cvlist-view", {
    props: ["element"],
    template: '<div class="CvList pbEdit" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  data-type="CvList" v-bind:id=element.Guid v-bind:style=element.Style><article v-for="item in element.Content" :key="item.Guid"><div class="top"><h5 class="title">{{item.Title}}</h5><div class="date">{{item.Date}}</div></div><div class="desc" v-if="item.Description" v-html="item.Description"></div></article></div>'
}), Vue.component("generallist-view", {
    props: ["element"],
    data: function() {
        return {
            trans: translations.state,
            isOpenGuid: !1
        }
    },
    methods: {
        toggleOpen: function(t) {
            this.isOpenGuid === t ? this.isOpenGuid = !1 : this.isOpenGuid = t
        }
    },
    template: '<div class="GeneralList pbEdit" v-bind:class="[element.Settings[\'animation\'],element.Settings[\'list-type\']]"  data-type="GeneralList" v-bind:id="element.Guid" v-bind:style="element.Style"><article v-for="item in element.Content" :key="item.Guid" v-bind:class="{open : item.Guid === isOpenGuid}"><div class="top"><h5 class="title" v-on:click="toggleOpen(item.Guid)"><span class="dropDownIcon plus ficon-add-1"></span><span class="dropDownIcon minus ficon-minus-1"></span>{{item.Title}}</h5><div class="date" v-if="item.Subtitle">{{item.Subtitle}}</div></div><div class="bottom"><div class="desc" v-if="item.Description" v-html="item.Description"></div><span class="LongText"><pb-link v-if="item.Link" v-bind:to="item.Link" v-bind:ex-target="element.Target">{{trans.ReadMore}}</pb-link></span></div></article></div>'
}), Vue.component("calendarlist-view", {
    props: ["element"],
    data: function() {
        return {
            trans: translations.state,
            isOpenGuid: !1
        }
    },
    methods: {
        toggleOpen: function(t) {
            this.isOpenGuid === t ? this.isOpenGuid = !1 : this.isOpenGuid = t
        }
    },
    template: '<div class="CalendarList pbEdit" v-bind:class="[element.Settings[\'animation\'],element.Settings[\'list-type\']]" data-type="CalendarList" v-bind:id="element.Guid" v-bind:style="element.Style"><article v-for="item in element.Content" :key="item.Guid" v-bind:class="{open : item.Guid === isOpenGuid}"><div class="top"><h5 class="title" v-on:click="toggleOpen(item.Guid)"><span class="dropDownIcon plus ficon-add-1"></span><span class="dropDownIcon minus ficon-minus-1"></span>{{item.Title}}</h5><div class="date"  v-if="item.Date">{{item.Date}}</div></div><div class="bottom"><div class="desc" v-if="item.Description" v-html="item.Description"></div><span class="LongText"><pb-link v-if="item.Link" v-bind:to="item.Link" v-bind:ex-target="element.Target">{{trans.ReadMore}}</pb-link></span></div></article></div>'
}), Vue.component("skills-view", {
    props: ["element"],
    template: '<div class="Skills pbEdit" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'"  data-type="Skills" v-bind:id=element.Guid v-bind:style=element.Style><article v-for="skill in element.Content" :key="skill.Guid"><h5 class="title">{{skill.Title}}</h5><div class="bar" v-bind:style="{\'background-color\' : element.Settings[\'bar-background-color\'] }"><div class="level" v-bind:style="{ width: skill.Level + \'%\' , \'background-color\' : element.Settings[\'bar-color\'] }"></div></div></article></div>'
}), Vue.component("socialmedia-view", {
    props: ["element"],
    data: function() {
        return {
            trans: translations.state
        }
    },
    methods: {
        getShareLink: function(t) {
            if ("share" !== this.element.Settings["icon-behaviour"]) return t.Link;
            {
                let e = "https://" + site.state._wwwPrefix + site.state.Url + pages.state.current.page.Url;
                return "/" === pages.state.current.url && (e = "https://" + site.state._wwwPrefix + site.state.Url), "twitter" === t.Type ? utils.miscFront.shareLink.twitter(e, this.trans.CheckoutThis) : "facebook" === t.Type ? utils.miscFront.shareLink.facebook(e) : "linkedin" === t.Type ? utils.miscFront.shareLink.linkedIn(e) : "pinterest" === t.Type ? utils.miscFront.shareLink.pinterest(e) : t.Link
            }
        }
    },
    template: "<div class=\"pbEdit SocialMedia\" v-bind:class=\"[element.Settings['animation'],element.Settings['icon-type'], element.Style['flex-direction'] && element.Style['flex-direction'] === 'column' ? 'isFlexColumn' : '']\"  data-type=\"SocialMedia\" v-bind:id=\"element.Guid\" v-bind:style=\"element.Style\"><div class=\"icon\" v-for=\"icon in element.Content\" :key=\"icon.Guid\" v-if=\"element.Settings['icon-behaviour'] !== 'share' || (element.Settings['icon-behaviour']=== 'share' && (icon.Type !== 'instagram' || icon.Type !== 'other' || icon.Type !== 'youtube' ))\"><a v-bind:href=\"getShareLink(icon)\" target=\"_blank\"><span v-if=\"element.Settings['icon-type'] === 'titles'\">{{icon.Title}}</span><span v-if=\"element.Settings['icon-type'] !== 'titles'\" class=\"smIcon\" v-bind:class=\"'smi-' + element.Settings['icon-type'] +'-'+ icon.Type\"></span></a></div></div>"
}), Vue.component("sectionprod-view", {
    props: ["element", "thumbType", "viewClass"],
    data: function() {
        return {
            products: products.state.products,
            site: site.state,
            searchCategory: "",
            trans: translations.state,
            productCategories: productCategories.state,
            sortBy: "",
            currentlyOpenFakeSel: "",
            search: ""
        }
    },
    methods: {
        openFakeSelect: function(t) {
            this.currentlyOpenFakeSel = t
        },
        closeFakeSel: function(t) {
            this.currentlyOpenFakeSel = "", t && t.stopPropagation()
        },
        changeOrderBy: function(t, e) {
            t.stopPropagation(), this.sortBy = e, this.closeFakeSel(), router.push({
                query: {
                    category: this.searchCategory,
                    sort: this.sortBy,
                    search: this.search
                }
            })
        },
        changeCategory: function(t, e) {
            t.stopPropagation(), this.searchCategory = e.Url, this.closeFakeSel(), router.push({
                query: {
                    category: e.Url,
                    sort: this.sortBy,
                    search: this.search
                }
            })
        },
        searchDone: function() {
            router.push({
                query: {
                    category: this.searchCategory,
                    sort: this.sortBy,
                    search: this.search
                }
            })
        },
        resetOrderBy(t) {
            t.stopPropagation(), this.sortBy = "reset", this.closeFakeSel(), router.push({
                query: {
                    sort: ""
                }
            })
        }
    },
    computed: {
        selectedProducts() {
            return this.products.filter(t => {
                if ("category" !== this.element.Content.SelectItemsBy || !this.element.Content.FromCategory) return "discount" !== this.element.Content.SelectItemsBy || t.Discount > 0;
                if (t.Categories && Array.isArray(t.Categories)) {
                    return !!utils.arrayHelper.findItem(t.Categories, "Url", this.element.Content.FromCategory)
                }
            }).slice(0, this.element.Content.NrOfItems)
        },
        filteredAndOrderedProducts() {
            if (this.element.Content.Filter) {
                if ("filter-searchsortcat" === this.element.Content.Filter) {
                    let t = function(t, e) {
                            if (e) return t.sortBy ? "date" === t.sortBy ? e.sort(function(t, e) {
                                return t.ReleaseDate > e.ReleaseDate ? -1 : t.ReleaseDate < e.ReleaseDate ? 1 : 0
                            }) : "price" === t.sortBy ? e.sort((t, e) => t.Price - e.Price) : "reset" === t.sortBy ? e.sort((t, e) => t.Idx - e.Idx) : "title" === t.sortBy ? e.sort(function(t, e) {
                                return t.Title < e.Title ? -1 : t.Title > e.Title ? 1 : 0
                            }) : void 0 : e
                        },
                        e = this.selectedProducts.filter(t => {
                            let e = !1,
                                n = !1;
                            return this.search ? (e = t.Title.toLowerCase().indexOf(this.search.toLowerCase()) > -1, t.SubTitle && (e = e || t.SubTitle.toLowerCase().indexOf(this.search.toLowerCase()) > -1), t.TextContent && (e = e || t.TextContent.toLowerCase().indexOf(this.search.toLowerCase()) > -1)) : e = !0, n = !this.searchCategory || !(!t.Categories || t.Categories.length < 1) && utils.arrayHelper.findItem(t.Categories, "Url", this.searchCategory), !(!e || !n)
                        });
                    return e = t(this, e)
                }
                if ("filter-catcloud" === this.element.Content.Filter) {
                    return this.selectedProducts.filter(t => {
                        let e = !1;
                        return e = !this.searchCategory || !(!t.Categories || t.Categories.length < 1) && utils.arrayHelper.findItem(t.Categories, "Url", this.searchCategory)
                    })
                }
                return this.selectedProducts
            }
            return this.selectedProducts
        }
    },
    created: function() {
        this.element.Content.Filter && (this.searchCategory = this.$route.query.category, this.sortBy = this.$route.query.sort, this.search = this.$route.query.search)
    },
    watch: {
        $route(t, e) {
            let n = !1;
            if (e.query.category !== t.query.category && (this.searchCategory = t.query.category, n = !0), e.query.sort !== t.query.sort && (this.sortBy = t.query.sort, n = !0), e.query.search !== t.query.search && (this.search = t.query.search, n = !0), n) {
                let t = this;
                frontApp.$nextTick(function() {
                    t.$parent.runScript()
                })
            }
        }
    },
    template: '<div class="SectionProd pbEdit" v-bind:style="element.Style" data-type="SectionProd" v-bind:id="element.Guid"><div v-if="element.Content.Filter" class="searchFilter" v-bind:class="element.Content.Filter"><input type="text" v-model="search" v-bind:placeholder="trans.Search" v-on:keyup="searchDone" class="searchField"><div class="fakeSelect categories" v-bind:class="{active: currentlyOpenFakeSel === \'categories\'}" v-on:click="openFakeSelect(\'categories\')"><div class="catHeader">{{trans.Categories}}</div><ul><li v-bind:class="{active: !searchCategory}" v-on:click="changeCategory($event,\'\')">{{trans.TheAll}}</li><li v-for="cat in productCategories" :key="cat.Guid" v-bind:class="{active: searchCategory === cat.Url}" v-on:click="changeCategory($event, cat)">{{cat.Title}}</li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeFakeSel"></div></div> <div class="fakeSelect sortBy" v-bind:class="{active: currentlyOpenFakeSel === \'sortBy\'}" v-on:click="openFakeSelect(\'sortBy\')"><div class="catHeader">{{trans.SortBy}}</div><ul class="toRight"><li v-bind:class="{active: !sortBy}" v-on:click="resetOrderBy">{{trans.Home}}</li><li v-bind:class="{active: sortBy === \'date\'}" v-on:click="changeOrderBy($event,\'date\')">{{trans.Latest}}</li><li v-bind:class="{active: sortBy === \'price\'}" v-on:click="changeOrderBy($event, \'price\')">{{trans.Price}}</li><li v-bind:class="{active: sortBy === \'title\'}" v-on:click="changeOrderBy($event, \'title\')">{{trans.Title}}</li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeFakeSel"></div></div></div><div v-bind:class="[viewClass, element.Settings[\'figcap-position\'],element.Settings[\'shadows\'],element.Settings[\'rounded\'],element.Settings[\'borders\'],element.Settings[\'hover-transition\'],element.Settings[\'class\']]" ><pb-productteaser v-for="product in filteredAndOrderedProducts" :key="product.Guid" v-bind:product="product" v-bind:store="site.StoreSettings" v-bind:thumb-type="thumbType"  v-bind:image-size="element.Settings[\'item-size\']" v-bind:class="element.Settings[\'animation\']"></pb-productteaser></div></div>'
}), Vue.component("sectionnews-view", {
    props: ["element", "viewClass", "thumbType"],
    data: function() {
        return {
            posts: posts.state.posts,
            site: site.state,
            searchCategory: "",
            trans: translations.state,
            blogCategories: blogCategories.state,
            currentlyOpenFakeSel: "",
            search: ""
        }
    },
    methods: {
        openFakeSelect: function(t) {
            this.currentlyOpenFakeSel = t
        },
        closeFakeSel: function(t) {
            this.currentlyOpenFakeSel = "", t.stopPropagation()
        },
        changeCategory: function(t, e) {
            t.stopPropagation(), this.currentlyOpenFakeSel = "", this.searchCategory = e.Url, router.push({
                query: {
                    category: this.searchCategory,
                    search: this.search
                }
            })
        },
        searchDone: function() {
            router.push({
                query: {
                    category: this.searchCategory,
                    search: this.search
                }
            })
        }
    },
    computed: {
        selectedPosts() {
            return this.posts.filter(t => {
                if ("category" !== this.element.Content.SelectItemsBy || !this.element.Content.FromCategory) return !0;
                if (t.Categories && Array.isArray(t.Categories)) {
                    return !!utils.arrayHelper.findItem(t.Categories, "Url", this.element.Content.FromCategory)
                }
            }).slice(0, this.element.Content.NrOfItems)
        },
        filteredAndOrderedPosts() {
            if (this.element.Content.Filter) {
                if ("filter-searchsortcat" === this.element.Content.Filter) {
                    return this.selectedPosts.filter(t => {
                        let e = !1,
                            n = !1;
                        return e = !this.search || t.Title.toLowerCase().indexOf(this.search.toLowerCase()) > -1, n = !this.searchCategory || !(!t.Categories || t.Categories.length < 1) && utils.arrayHelper.findItem(t.Categories, "Url", this.searchCategory), !(!e || !n)
                    })
                }
                if ("filter-catcloud" === this.element.Content.Filter) {
                    return this.selectedPosts.filter(t => {
                        let e = !1;
                        return e = !this.searchCategory || !(!t.Categories || t.Categories.length < 1) && utils.arrayHelper.findItem(t.Categories, "Url", this.searchCategory)
                    })
                }
                return this.selectedPosts
            }
            return this.selectedPosts
        }
    },
    created: function() {
        this.element.Content.Filter && (this.searchCategory = this.$route.query.category, this.search = this.$route.query.search)
    },
    watch: {
        $route(t, e) {
            let n = !1;
            if (e.query.category !== t.query.category && (this.searchCategory = t.query.category, n = !0), e.query.search !== t.query.search && (this.search = t.query.search, n = !0), n) {
                let t = this;
                frontApp.$nextTick(function() {
                    t.$parent.runScript()
                })
            }
        }
    },
    template: '<div class="SectionNews pbEdit" v-bind:style="element.Style" data-type="SectionNews" v-bind:id="element.Guid"><div v-if="element.Content.Filter" class="searchFilter" v-bind:class="element.Content.Filter"><input type="text" v-model="search" v-bind:placeholder="trans.Search" v-on:keyup="searchDone" class="searchField"><div class="fakeSelect categories" v-bind:class="{active: currentlyOpenFakeSel === \'categories\'}" v-on:click="openFakeSelect(\'categories\')"><div class="catHeader">{{trans.Categories}}</div><ul><li v-bind:class="{active: !searchCategory}" v-on:click="changeCategory($event, \'\')">All</li><li v-for="cat in blogCategories" :key="cat.Guid" v-bind:class="{active: searchCategory === cat.Url}" v-on:click="changeCategory($event, cat)">{{cat.Title}}</li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeFakeSel"></div></div> </div><div v-bind:class="[viewClass, element.Settings[\'figcap-position\'],element.Settings[\'shadows\'],element.Settings[\'rounded\'],element.Settings[\'borders\'],element.Settings[\'hover-transition\'],element.Settings[\'class\']]" ><pb-postteaser v-for="post in filteredAndOrderedPosts" :key="post.Guid" v-bind:post="post" v-bind:blog="site.BlogSettings" v-bind:thumb-type="thumbType" v-bind:image-size="element.Settings[\'item-size\']" v-bind:class="element.Settings[\'animation\']"></pb-postteaser></div></div>'
}), Vue.component("googlecalendar-view", {
    props: ["element"],
    computed: {
        iframeSrc: function() {
            let t = "";
            return this.element.Content && (t = "https://calendar.google.com/calendar/embed?src=" + this.element.Content), t
        }
    },
    template: '<div class="GoogleCalendar pbEdit" data-type="GoogleCalendar" v-bind:class="[ element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.Content" v-bind:src="iframeSrc"></iframe></div>'
}), Vue.component("googlemap-view", {
    props: ["element"],
    template: '<div class="GoogleMap pbEdit" data-type="GoogleMap" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']" v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.Content" v-bind:src="element.Content" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe></div>'
}), Vue.component("resurva-view", {
    props: ["element"],
    template: '<div class="Resurva pbEdit" data-type="Resurva" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']" v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.Content" v-bind:src="element.Content" name="resurva-frame" frameborder="0" width="450" height="450" style="max-width:100%"></iframe></div>'
}), Vue.component("kuula-view", {
    props: ["element"],
    computed: {
        iframeSrc: function() {
            let t = "";
            return t = "https://kuula.co/share/" + this.element.Content + "?fs=1&vr=0&sd=1&thumbs=1&chromeless=0&logo=0"
        }
    },
    template: '<div class="Kuula pbEdit" data-type="Kuula" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']"   v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.Content" v-bind:src="iframeSrc" frameborder="0" allowfullscreen="true" allow="vr,gyroscope,accelerometer,fullscreen" scrolling="no"></iframe></div>'
}), Vue.component("typeform-view", {
    props: ["element"],
    computed: {
        urlSrc: function() {
            let t = "";
            return t = "https://form.typeform.com/to/" + this.element.Content + "?typeform-medium=embed-snippet"
        }
    },
    mounted() {
        let t = document.createElement("script");
        t.setAttribute("src", "https://embed.typeform.com/embed.js"), t.defer = !0, document.head.appendChild(t)
    },
    template: '<div class="Typeform pbEdit" data-type="Typeform" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']"   v-bind:id="element.Guid" v-bind:style="element.Style"><div class="typeform-widget" v-bind:style="element.Style" :data-url="urlSrc"></div></div>'
}), Vue.component("calendly-view", {
    props: ["element"],
    computed: {
        urlSrc: function() {
            let t = "";
            return t = "https://calendly.com/" + this.element.Content
        }
    },
    mounted() {
        let t = document.createElement("script");
        t.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js"), t.async = !1, document.head.appendChild(t)
    },
    template: '<div class="Calendly pbEdit" data-type="Calendly" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']"   v-bind:id="element.Guid" v-bind:style="element.Style"><div class="calendly-inline-widget" v-bind:style="element.Style" :data-url="urlSrc"></div></div>'
}), Vue.component("speakerdeck-view", {
    props: ["element"],
    template: '<div class="SpeakerDeck pbEdit" data-type="SpeakerDeck" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content.Url ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.Content.Url" v-bind:src="element.Content.IFrame.Src" frameborder="0" allowtransparency="true" allowfullscreen="allowfullscreen" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe></div>'
}), Vue.component("pdf-view", {
    data: function() {
        return {
            isMobile: utils.environment.widthConst < 1e3
        }
    },
    props: ["element"],
    computed: {
        objectSrc: function() {
            return this.element.Content ? this.element.Content.HasToolbar ? this.element.Content.Src : this.element.Content.Src + "#toolbar=0" : ""
        }
    },
    template: '<div class="PDF pbEdit" data-type="PDF" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content.Src ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><object v-if="element.Content.Src" v-bind:data="objectSrc" type="application/pdf"><embed v-if="element.Content.Src" v-bind:src="objectSrc" type="application/pdf"/></object><a v-if="element.Content.Src && isMobile" v-bind:href="element.Content.Src" target="_blank" class="mobileLink"><span class="ficon-log-out"></span></a></div>'
}), Vue.component("googleslides-view", {
    props: ["element"],
    template: '<div class="GoogleSlides pbEdit" data-type="GoogleSlides" v-bind:class="[ element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.Content ? \'noEmbedContent\' : \'\']" v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.Content" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" v-bind:src="element.Content"></iframe></div>'
}), Vue.component("buymeacoffee-view", {
    props: ["element"],
    template: "<div class=\"BuyMeACoffee pbEdit\" data-type=\"BuyMeACoffee\" v-bind:class=\"[ element.Settings && element.Settings['animation'] ? element.Settings['animation'] : '', !element.ButtonID ? 'noEmbedContent' : '']\"  v-bind:id=\"element.Guid\" v-bind:style=\"element.Style\"><div v-if=\"element.ButtonID\"><a :href=\"'https://www.buymeacoffee.com/'+element.ButtonID\" target=\"_blank\"><img :src=\"'https://img.buymeacoffee.com/button-api/?text='+encodeURI(element.Text)+'&emoji=&slug='+element.ButtonID+'&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff'\"></a></div></div>"
}), Vue.component("picktime-view", {
    props: ["element"],
    template: '<div class="PickTime pbEdit" data-type="PickTime" v-bind:class="[ element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.ButtonID ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><div v-if="element.ButtonID"><a :href="\'https://www.picktime.com/\'+element.ButtonID" class="ptbkbtn" target="_blank" style="float:none;" :title="element.Text"><img border="none" src="https://www.picktime.com/bookingPage/img/picktime-book-online.png" :alt="element.Text"/></a></div></div>'
}), Vue.component("paypaldonate-view", {
    props: ["element"],
    template: '<div class="PayPalDonate pbEdit" data-type="PayPalDonate" v-bind:class="[ element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.ButtonID ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><div v-if="element.ButtonID"><form target="_blank" action="https://www.paypal.com/donate" method="post"><input type="hidden" name="hosted_button_id" :value="element.ButtonID" /><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" :title="element.Text" :alt="element.Text" /></form></div></div>'
}), Vue.component("sketchfab-view", {
    props: ["element"],
    template: '<div class="SketchFab pbEdit" data-type="SketchFab" v-bind:class="[ element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.ButtonID ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><iframe v-if="element.ButtonID" :title="element.Text" :src="\'https://sketchfab.com/models/\' + element.ButtonID + \'/embed\'"></iframe></div>'
}), Vue.component("shapespark-view", {
    props: ["element"],
    template: "<div class=\"ShapeSpark pbEdit\" data-type=\"ShapeSpark\" v-bind:class=\"[ element.Settings && element.Settings['animation'] ? element.Settings['animation'] : '', !(element.ButtonID && element.Text) ? 'noEmbedContent' : '']\"  v-bind:id=\"element.Guid\" v-bind:style=\"element.Style\"><iframe v-if=\"element.ButtonID && element.Text\" :src=\"'https://' + element.ButtonID + '.shapespark.com/' + element.Text + '/'\"></iframe></div>"
}), Vue.component("elfsight-view", {
    props: ["element"],
    mounted() {
        let t = document.createElement("script");
        t.setAttribute("src", "https://apps.elfsight.com/p/platform.js"), t.defer = !0, document.head.appendChild(t)
    },
    template: '<div class="Elfsight pbEdit" data-type="Elfsight" v-bind:class="[ element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', !element.ButtonID ? \'noEmbedContent\' : \'\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><div v-if="element.ButtonID"><div :class="element.ButtonID"></div></div></div>'
}), Vue.component("prodaddtocart-view", {
    props: ["element"],
    data: function() {
        return {
            products: products.state.products,
            ulBg: {
                "background-color": "rgba(255,255,255,1)"
            },
            storeSettings: site.state.StoreSettings,
            showVariants: !1,
            trans: translations.state,
            activeVariant: !1,
            checkoutStore: checkoutStore,
            variantTitle: translations.state.ChooseAVariant
        }
    },
    methods: {
        changeVariant: function(t) {
            this.activeVariant = t, this.variantTitle = t.Title
        },
        closeVariants: function(t) {
            this.showVariants = !1, t.stopPropagation(), t.preventDefault()
        },
        addToCart: function() {
            this.product.Variants && this.product.Variants.length > 0 && !this.activeVariant ? frontApp.alert(this.trans.PleaseSelectOneVariant) : 1 === this.product.Inventory.DoTrack && this.activeVariant.Inventory < 1 ? this.soldOut() : utils.miscFront.isProductSoldOut(this.product, this.activeVariant) ? this.soldOut() : (checkoutStore.actions.addToCart(this.product, this.activeVariant), checkoutStore.state.showAddedToCart = !0)
        },
        soldOut: function() {
            frontApp.alert(this.trans.SoldOutMessage)
        },
        doShowVariants: function() {
            this.showVariants = !this.showVariants, this.showVariants && site.state.GlobalClasses.Page["background-color"] && (this.ulBg = {
                "background-color": site.state.GlobalClasses.Page["background-color"]
            })
        }
    },
    computed: {
        product: function() {
            return this.products && this.element.Content ? utils.arrayHelper.findItemByGuid(this.products, this.element.Content) : null
        }
    },
    template: '<div class="ProdAddToCart pbEdit" data-type="ProdAddToCart" v-bind:class="element.Settings[\'animation\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><div v-if="product"><div class="ProductButton" v-on:click="addToCart" v-if="product.Inventory.DoTrack !== 1 || product.Inventory.Inventory > 0"><a>{{trans.AddToCart}}</a></div><div class="ProductButton" v-on:click="soldOut" v-if="product.Inventory.DoTrack === 1 && product.Inventory.Inventory < 1"><a>{{trans.SoldOut}}</a></div><div v-if="product.Variants && product.Variants.length > 0" class="patcProductVariants ProductVariants" v-bind:class="{active: showVariants}" v-on:click="doShowVariants()">{{variantTitle}}<ul v-bind:style="ulBg"><li v-for="item in product.Variants" :key="item.Guid" v-bind:class="{active: activeVariant.Guid === item.Guid}" v-on:click="changeVariant(item)"><span class="vTitle">{{item.Title}}</span><span class="vPrice">{{item.Price | currency(storeSettings.Currency) }} </span><span class="vSoldOut" v-if="product.Inventory.DoTrack === 1 && item.Inventory < 1">{{trans.SoldOut}}</span></li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeVariants"></div></div> </div><div v-if="!product"><div class="ProductButton" v-on:click="soldOut"><a>{{trans.AddToCart}}</a></div></div></div>'
}), Vue.component("prodaddtocart2-view", {
    props: ["element"],
    data: function() {
        return {
            products: products.state.products,
            ulBg: {
                "background-color": "rgba(255,255,255,1)"
            },
            storeSettings: site.state.StoreSettings,
            showVariants: !1,
            trans: translations.state,
            activeVariant: !1,
            checkoutStore: checkoutStore,
            variantTitle: translations.state.ChooseAVariant
        }
    },
    methods: {
        changeVariant: function(t) {
            this.activeVariant = t, this.variantTitle = t.Title
        },
        closeVariants: function(t) {
            this.showVariants = !1, t.stopPropagation(), t.preventDefault()
        },
        addToCart: function() {
            this.product.Variants && this.product.Variants.length > 0 && !this.activeVariant ? frontApp.alert(this.trans.PleaseSelectOneVariant) : 1 === this.product.Inventory.DoTrack && this.activeVariant.Inventory < 1 ? this.soldOut() : utils.miscFront.isProductSoldOut(this.product, this.activeVariant) ? this.soldOut() : this.element.Content.StraitToCheckout ? (checkoutStore.actions.addToCart(this.product, this.activeVariant), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addToCart(this.product, this.activeVariant), checkoutStore.state.showAddedToCart = !0)
        },
        soldOut: function() {
            frontApp.alert(this.trans.SoldOutMessage)
        },
        doShowVariants: function() {
            this.showVariants = !this.showVariants, this.showVariants && site.state.GlobalClasses.Page["background-color"] && (this.ulBg = {
                "background-color": site.state.GlobalClasses.Page["background-color"]
            })
        }
    },
    computed: {
        product: function() {
            return this.products && this.element.Content.ProductGuid ? utils.arrayHelper.findItemByGuid(this.products, this.element.Content.ProductGuid) : null
        },
        addToCartText: function() {
            return this.products && this.element.Content.Title ? this.element.Content.Title : translations.state.AddToCart
        }
    },
    template: '<div class="ProdAddToCart2 pbEdit" data-type="ProdAddToCart2" v-bind:class="element.Settings[\'animation\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><div v-if="product"><div class="ProductButton" v-on:click="addToCart" v-if="product.Inventory.DoTrack !== 1 || product.Inventory.Inventory > 0"><a>{{addToCartText}}</a></div><div class="ProductButton" v-on:click="soldOut" v-if="product.Inventory.DoTrack === 1 && product.Inventory.Inventory < 1"><a>{{trans.SoldOut}}</a></div><div v-if="product.Variants && product.Variants.length > 0" class="patcProductVariants ProductVariants" v-bind:class="{active: showVariants}" v-on:click="doShowVariants()">{{variantTitle}}<ul v-bind:style="ulBg"><li v-for="item in product.Variants" :key="item.Guid" v-bind:class="{active: activeVariant.Guid === item.Guid}" v-on:click="changeVariant(item)"><span class="vTitle">{{item.Title}}</span><span class="vPrice">{{item.Price | currency(storeSettings.Currency) }} </span><span class="vSoldOut" v-if="product.Inventory.DoTrack === 1 && item.Inventory < 1">{{trans.SoldOut}}</span></li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeVariants"></div></div> </div><div v-if="!product"><div class="ProductButton" v-on:click="soldOut"><a>{{addToCartText}}</a></div></div></div>'
}), Vue.component("digitalassetaddtocart-view", {
    props: ["element"],
    data: function() {
        return {
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            checkoutStore: checkoutStore
        }
    },
    methods: {
        addToCart: function() {
            let t = {
                ProductType: "asset",
                Guid: this.element.Content.AssetGuid,
                AssetGuid: this.element.Content.AssetGuid,
                CartGuid: this.element.Content.AssetGuid,
                Title: this.element.Content.AssetTitle,
                Url: "",
                Price: this.element.Content.Price,
                Src: this.element.Content.ImgSrc,
                ExcludeTax: this.element.Content.ExcludeTax,
                Weight: 0,
                IsPhysical: 0,
                Quantity: 1,
                TrackInventory: 0,
                Inventory: null
            };
            this.element.Content.StraitToCheckout ? (checkoutStore.actions.addToCart(t), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addToCart(t), checkoutStore.state.showAddedToCart = !0)
        }
    },
    computed: {
        addToCartText: function() {
            return this.element.Content.Title ? this.element.Content.Title : translations.state.AddToCart
        }
    },
    template: '<div class="DigitalAssetAddToCart pbEdit" data-type="DigitalAssetAddToCart" v-bind:class="element.Settings[\'animation\']"  v-bind:id="element.Guid" v-bind:style="element.Style"><div v-if="element.Content.AssetGuid"><div class="ProductButton" v-on:click="addToCart"><a>{{addToCartText}}</a></div></div><div v-if="!element.Content.AssetGuid"><div class="ProductButton"><a>{{addToCartText}}</a></div></div></div>'
}), Vue.component("emailsubscriptionbutton-view", {
    props: ["element"],
    data: function() {
        return {
            showReCaptcha: !1,
            trans: translations.state,
            bgColor: {},
            showPopup: !1,
            newSub: {
                email: "",
                name: ""
            },
            hasErrors: !1,
            emailError: !1
        }
    },
    computed: {
        topStyle: function() {
            return this.element.Style["align-self"] ? {
                "align-self": this.element.Style["align-self"]
            } : null
        }
    },
    methods: {
        submitForm: function() {
            let t = this;
            if (t.newSub.name && t.newSub.email)
                if (utils.miscFront.validateEmail(t.newSub.email)) {
                    let t = this;
                    this.showReCaptcha = !0, frontApp.confirm(t.trans.AreYouSure, function() {
                        utils.miscFront.renderCaptchaAndGetToken().then(e => {
                            frontApi.submitEmailAddress(pages.state.current.url, t.newSub.name, t.newSub.email, e).then(e => {
                                t.showReCaptcha = !1, t.hasErrors = !1, t.emailError = !1, t.newSub.name = "", t.newSub.email = "", "already-exists" === e ? (frontApp.alert(t.trans.ThisAddressIsAlreadySubscribed + "<br/><br/>" + t.trans.ThankYou), t.showPopup = !1) : (frontApp.alert(t.trans.ThankYou + "<br><br>" + t.trans.AConfirmationEmailWasSent), t.showPopup = !1)
                            })
                        })
                    })
                } else t.hasErrors = !0, t.emailError = !0, frontApp.alert(t.trans.EmailNotValid);
            else t.hasErrors = !0, frontApp.alert(t.trans.NoFieldsCanBeEmpty)
        },
        openPopup: function() {
            this.showPopup = !0
        }
    },
    created: function() {
        site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        })
    },
    template: '<div class="EmailSubscriptionButton pbEdit" data-type="EmailSubscriptionButton" v-bind:id="element.Guid" v-bind:style="topStyle"><div class="Button" v-bind:class="element.Settings[\'animation\']" v-bind:style="element.Style"><a v-on:click="openPopup()">{{element.Content.Title}}</a></div><div class="frontMessagePopup emailSub" v-if="showPopup"><div class="frontMessagePopupBg" v-on:click="showPopup = false"></div><div class="frontMessageContent" v-bind:style="bgColor"><h3 class="Header3">{{element.Content.Title}}</h3><div class="message" v-html="element.Content.Description"></div><div class="Form" v-bind:class="{hasErrors : hasErrors}"><div class="inputWrapper"><input type="text" v-model="newSub.name" v-bind:class="{error : !newSub.name}" placeholder=" "><label>{{trans.YourName}}</label></div><div class="inputWrapper"><input type="text" v-model="newSub.email" v-bind:class="{error : !newSub.email || emailError}" placeholder=" "><label>{{trans.YourEmail}}</label></div></div><div class="btnWrapper"><div class="Button" v-on:click="submitForm"><span>{{trans.Submit}}</span></div></div><div v-if="showReCaptcha" id="recaptchaHolder"></div></div></div></div>'
}), Vue.component("iconlinks-view", {
    data: function() {
        return {
            fillColor: "#ff0000",
            svgContent: null,
            svgSources: []
        }
    },
    created: function() {
        this.fillColor = this.element.Style.color || "#ff0000", this.svgSources = this.getSVG()
    },
    methods: {
        async getSVG() {
            const t = [];
            for (let e = 0; e < this.element.Content.length; e++) try {
                if (!this.element.Content[e].Name) {
                    t.push(null);
                    continue
                }
                const n = await fetch("/pb4/_output/front/_css/fontawesome-icons/svgs/" + this.element.Content[e].Name + ".svg");
                if (!n.ok) throw new Error(`HTTP error! Status: ${n.status}`);
                const i = (await n.text()).replace(/<path/g, `<path fill="${this.fillColor}"`),
                    o = `data:image/svg+xml;base64,${btoa(i)}`;
                t.push(o)
            } catch (t) {
                console.error("Error fetching SVG:", t)
            }
            return this.svgSources = t, t
        }
    },
    watch: {
        "element.Style.color": function(t, e) {
            this.fillColor = t, this.getSVG().then(t => {
                this.svgSources = t
            })
        },
        "element.Content": {
            deep: !0,
            handler: function(t, e) {
                this.getSVG().then(t => {
                    this.svgSources = t
                })
            }
        }
    },
    props: ["element"],
    template: '\n\t<div class="IconLinks pbEdit" v-bind:class="[element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\', element.Settings[\'iconlinks-position\'] ? element.Settings[\'iconlinks-position\'] : \'\', element.Style[\'flex-direction\'] && element.Style[\'flex-direction\'] === \'column\' ? \'isFlexColumn\': \'\', element.Settings && element.Settings[\'underline-style\'] ? [\'underlineBottom\', element.Settings[\'underline-style\']] : \'\']"  data-type="IconLinks" v-bind:id=element.Guid v-bind:style=element.Style>\n\t\t<div class="iconLinksWrapper" v-for="(item, index) in element.Content" :key="item.Guid">\t\n\t\t\t<pb-link class="linkWrapper" :key="item.Guid" v-bind:to="item.Link" v-bind:ex-target="item.Target" v-bind:id=item.Guid v-bind:style="item.Style">\n\t\t\t\t<span class="iconWrapper">\n\t\t\t\t\t<pb-link class="icon" v-if="item.Name" v-bind:to="item.Link" v-bind:ex-target="item.Target">\n\t\t\t\t\t\t<object type="image/svg+xml" :data="svgSources[index]" width="100%" height="auto"></object>\n\t\t\t\t\t</pb-link>\n\t\t\t\t</span>\n\t\t\t\t<pb-link class="link" :key="item.Guid" v-bind:to="item.Link" v-bind:ex-target="item.Target" v-bind:style="item.Style"><span class="linkSpan">{{item.Title}}</span></pb-link>\n\t\t\t</pb-link>\n\t\t\t<span class="description" v-html="item.Description" v-if="item.Description" :key="item.Guid">{{item.Description}}</span>\n\t\t</div>\n\t</div>\n\t'
}), Vue.component("bookingaddtocart-view", {
    props: ["element"],
    data: function() {
        return {
            bookings: [],
            bookingsFetched: !1,
            booking: null,
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            checkoutStore: checkoutStore,
            bookingPopUpStore: bookingPopUpStore
        }
    },
    methods: {
        addToCart: function() {
            !this.element.Content.LinkSpecificAlternative && this.booking.Alternatives.length > 0 ? bookingPopUpStore.actions.showBookingPopup(this.booking, this.element.Content.StraitToCheckout) : this.booking.BookedSeats >= this.booking.Seats || utils.miscFront.isBookingSoldOut(this.booking) ? this.soldOut() : this.element.Content.StraitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, null), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, null), checkoutStore.state.showAddedToCart = !0)
        },
        addToCartSpecificAlternative: function() {
            !this.linkedAlternative || this.linkedAlternative.BookedSeats >= this.linkedAlternative.Seats || utils.miscFront.isBookingSoldOut(this.booking, this.linkedAlternative) ? this.soldOut() : this.element.Content.StraitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, this.linkedAlternative), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, this.linkedAlternative), checkoutStore.state.showAddedToCart = !0)
        },
        soldOut: function() {
            frontApp.alert(this.trans.BookedOutMessage)
        },
        bookAlternative: function(t) {
            this.element.Content.StraitToCheckout ? (checkoutStore.actions.addBookingToCart(this.booking, t), checkoutStore.state.straitToCheckout = !0, checkoutStore.state.showCheckout = !0) : (checkoutStore.actions.addBookingToCart(this.booking, t), checkoutStore.state.showAddedToCart = !0)
        },
        getBookings: function() {
            if (this.bookingsFetched) return new Promise(t => {
                t(window.bookings)
            });
            {
                let t = this;
                return new Promise(e => {
                    frontApi.getBookings(this).then(n => {
                        t.bookings = n, t.bookingsFetched = !0, window.bookings = n, e(n)
                    })
                })
            }
        }
    },
    computed: {
        linkedAlternative: function() {
            return this.booking && this.element.Content.AlternativeGuid ? utils.arrayHelper.findItemByGuid(this.booking.Alternatives, this.element.Content.AlternativeGuid) : null
        },
        addToCartText: function() {
            return this.element.Content.Title ? this.element.Content.Title : translations.state.BookNow
        }
    },
    created: function() {
        window.bookings ? (this.bookings = window.bookings, this.bookingsFetched = !0, this.booking = utils.arrayHelper.findItemByGuid(window.bookings, this.element.Content.BookingGuid)) : this.getBookings().then(t => {
            this.bookings = t, this.booking = utils.arrayHelper.findItemByGuid(window.bookings, this.element.Content.BookingGuid)
        })
    },
    template: '  <div class="BookingAddToCart pbEdit" data-type="BookingAddToCart" v-bind:class="element.Settings && element.Settings[\'animation\'] ? element.Settings[\'animation\'] : \'\'" v-bind:style="element.Style"  v-bind:id="element.Guid">\n\t\t\t\t\t<div v-if="booking && element.Content.BookingGuid && (element.Content.LinkSpecificAlternative && element.Content.AlternativeGuid)">\n\t\t\t\t\t\t<div class="BookingButton" v-on:click="addToCartSpecificAlternative" v-if="linkedAlternative && linkedAlternative.BookedSeats < linkedAlternative.Seats"><a>{{addToCartText}}</a></div>\n\t\t\t\t\t\t<div class="BookingButton" v-on:click="soldOut" v-if="!linkedAlternative || linkedAlternative.BookedSeats >= linkedAlternative.Seats"><a>{{trans.SoldOut}}</a></div>\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div v-if="booking && element.Content.BookingGuid && !element.Content.LinkSpecificAlternative">\n\t\t\t\t\t\t<div class="BookingButton" v-on:click="addToCart"><a>{{addToCartText}}</a></div>\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div v-if="!booking || !element.Content.BookingGuid || (element.Content.LinkSpecificAlternative && !element.Content.AlternativeGuid)">\n\t\t\t\t\t\t<div class="BookingButton" v-on:click="soldOut"><a>{{trans.SoldOut}}</a></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t'
}), Vue.component("schedulingaddtocart-view", {
    props: ["element"],
    data: function() {
        return {
            storeSettings: site.state.StoreSettings,
            trans: translations.state,
            checkoutStore: checkoutStore,
            bgColor: "#ffffff",
            ulBg: {
                "background-color": "rgba(255,255,255,1)"
            }
        }
    },
    methods: {
        displayPopup: function() {
            this.element && (schedulingStore.state.front.element = this.element), schedulingStore.state.front.showPopup = !0
        }
    },
    computed: {
        addToCartText: function() {
            return this.element.Content.Title ? this.element.Content.Title : translations.state.AddToCart
        }
    },
    created: function() {
        site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
            "background-color": site.state.GlobalClasses.Page["background-color"]
        })
    },
    template: '\n\t<div class="SchedulingAddToCart pbEdit" data-type="SchedulingAddToCart" v-bind:class="element.Settings[\'animation\']"  v-bind:id="element.Guid" v-bind:style="element.Style"> \n\t\t<div> \n\t\t\t<div class="ProductButton" v-on:click="displayPopup">\n\t\t\t\t<a>{{addToCartText}}</a>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t\t\t'
}), Vue.component("goldenratio-post", {
    props: ["post", "blog"],
    data: function() {
        return {
            showLightbox: !1,
            lightboxOpenGuid: ""
        }
    },
    methods: {
        openLightbox: function(t) {
            this.lightboxOpenGuid = t, this.showLightbox = !0
        }
    },
    template: '<article><div class="reverseOrderWrapper"><div class="reverseTop"><h1 class="pbEdit BlogHeader" data-type="BlogHeader" v-bind:id="post.Guid +\'BlogHeader\'"><router-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url">{{post.Title}}</router-link></h1><div class="pbEdit BlogDate" data-type="BlogDate" v-bind:id="post.Guid +\'BlogDate\'">{{post.PostDate | datetostring}}</div><div class="pbEdit BlogText LongText" data-type="BlogText" v-bind:id="post.Guid +\'BlogText\'" v-html="post.TextContent"></div></div><div v-if="post.Items && post.Items.length > 0" class="sameRatio pbEdit postItems blogPost Gallery" data-type="BlogPost" v-bind:id="post.Guid + \'BlogPostItems\'" v-bind:class="[post.Settings[\'figcap-position\'],post.Settings[\'hover-transition\'],post.Settings[\'shadows\'],post.Settings[\'rounded\'],post.Settings[\'borders\']]"><figure v-for="item in post.Items" :key="item.Guid" class="Item" v-bind:class="post.Settings[\'items-animation\']"><span class="imgWrapper" v-on:click="openLightbox(item.Guid)" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid"><span class="playIcon ficon-playback-play"></span><pb-lazyimg v-bind:alt="post.Title" v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-lazyimg></span><figcaption class="aFigcaption" v-if="item.Content.FigCaptions && item.Content.FigCaptions.length > 0"><span class="BlogFigureTitle" data-type="BlogFigureTitle" v-if="item.Content.FigCaptions[0]">{{item.Content.FigCaptions[0].Content}}</span><span class="BlogFigureSubTitle" data-type="BlogFigureSubTitle" v-if="item.Content.FigCaptions[1]">{{item.Content.FigCaptions[1].Content}}</span></figcaption></figure></div></div><pb-blogshare v-bind:post="post"></pb-blogshare><pb-blogcomment v-bind:post="post" v-if="blog.DisableComments !== 1 && post.DisableComments !== 1"></pb-blogcomment><pb-misclightbox v-if="showLightbox" v-on:close="showLightbox = false" v-bind:opening-item-guid="lightboxOpenGuid" v-bind:items="post.Items"></pb-misclightbox></article>'
}), Vue.component("horizontal-post", {
    props: ["post", "blog"],
    methods: {
        scrollClick: function(t) {
            let e = this.$refs.items.$el,
                n = .8 * e.clientWidth;
            "back" === t ? $(e).animate({
                scrollLeft: "-=" + n
            }, 400) : $(e).animate({
                scrollLeft: "+=" + n
            }, 400)
        },
        openComments: function() {
            postComment.actions.openCommentPopup(this.post)
        }
    },
    template: '<article><div class="reverseOrderWrapper"><div class="reverseTop"><h1 class="pbEdit BlogHeader" data-type="BlogHeader" v-bind:id="post.Guid +\'BlogHeader\'"><router-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url">{{post.Title}}</router-link></h1><div class="pbEdit BlogDate" data-type="BlogDate" v-bind:id="post.Guid +\'BlogDate\'">{{post.PostDate | datetostring}}</div><div class="pbEdit BlogText LongText" data-type="BlogText" v-bind:id="post.Guid +\'BlogText\'" v-html="post.TextContent"></div></div><div class="horizontal" v-if="post.Items && post.Items.length > 0"><span class="arrowContainer" v-on:click="scrollClick(\'back\')" v-if="post.Items.length > 1"><span class="arrow leftArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="scrollClick(\'forward\')" v-if="post.Items.length > 1"><span class="arrow rightArr"></span></span><pb-blogpostitems v-bind:post="post" class="Gallery galleryWithResponsiveVideo" ref="items" thumb-type="h800"></pb-blogpostitems></div></div><pb-blogshare v-bind:post="post"></pb-blogshare><pb-blogcomment v-bind:post="post" v-if="blog.DisableComments !== 1 && post.DisableComments !== 1"></pb-blogcomment></article>'
}), Vue.component("vertical-post", {
    props: ["post", "blog"],
    methods: {
        openComments: function() {
            postComment.actions.openCommentPopup(this.post)
        }
    },
    template: '<article><div class="reverseOrderWrapper"><div class="reverseTop"><h1 class="pbEdit BlogHeader" data-type="BlogHeader" v-bind:id="post.Guid +\'BlogHeader\'"><router-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url">{{post.Title}}</router-link></h1><div class="BlogDate pbEdit" data-type="BlogDate" v-bind:id="post.Guid +\'BlogDate\'">{{post.PostDate | datetostring}}</div><div class="pbEdit BlogText LongText" data-type="BlogText" v-bind:id="post.Guid +\'BlogText\'" v-html="post.TextContent"></div></div><pb-blogpostitems v-bind:post="post" class="vertical blogPost Gallery galleryWithResponsiveVideo"  inc-desc="1"></pb-blogpostitems></div><pb-blogshare v-bind:post="post"></pb-blogshare><pb-blogcomment v-bind:post="post" v-if="blog.DisableComments !== 1 && post.DisableComments !== 1"></pb-blogcomment></article>'
}), Vue.component("vertical-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.verticalScript(this, this.product)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<article><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><pb-productitems ref="items" v-bind:product="product" class="vertical Gallery galleryWithResponsiveVideo" ></pb-productitems></div></article>'
}), Vue.component("horizontal-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        scrollClick: function(t) {
            let e = this.$refs.items.$el,
                n = .8 * e.clientWidth;
            "back" === t ? $(e).animate({
                scrollLeft: "-=" + n
            }, 400) : $(e).animate({
                scrollLeft: "+=" + n
            }, 400)
        },
        runScript: function() {
            utils.templates.horizontalScript(this.product)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<article><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><div class="horizontal" v-if="product.Items && product.Items.length > 0"><span class="arrowContainer" v-on:click="scrollClick(\'back\')" v-if="product.Items.length > 1"><span class="arrow rightArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="scrollClick(\'forward\')" v-if="product.Items.length > 1"><span class="arrow leftArr"></span></span><pb-productitems v-bind:product="product" class="Gallery galleryWithResponsiveVideo" thumb-type="h800" ref="items"></pb-productitems></div></div></article>'
}), Vue.component("sidebyside-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            largeItem: {},
            largeIframe: "",
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        openItem: function(t) {
            this.largeItem = t, this.playVideo(t.Guid, t.Content.IFrameSrc)
        },
        playVideo: function(t, e) {
            this.largeIframe = e ? utils.miscFront.makeIFrame(e, "auto", "auto", 0, 0, 0) : ""
        },
        runScript: function() {
            utils.templates.productSideBySide(this, this.product)
        },
        setLargeItemStart: function() {
            this.largeItem = this.product.Items[0]
        }
    },
    created: function() {
        this.setLargeItemStart()
    },
    watch: {
        $route: "setLargeItemStart"
    },
    mounted: function() {
        this.runScript(), this.largeItem && this.playVideo(this.largeItem.Guid, this.largeItem.Content.IFrameSrc)
    },
    template: '<article class="sideBySide"><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><div class="productImagesWrapper" id="sideBySideImageWrapper"><figure class="largeImage" v-if="largeItem" v-bind:class="[product.Settings[\'items-animation\'],product.Settings[\'shadows\'],product.Settings[\'rounded\'],product.Settings[\'borders\']]"><span class="imgWrapper" v-bind:class="{gotVideo : largeItem.Content.IFrameSrc}"><pb-img v-if="!largeIframe" v-bind:alt="product.Title" v-bind:id="\'img-\'+largeItem.Guid" v-bind:src="largeItem.Content.Src" v-bind:height="largeItem.Content.Height" v-bind:width="largeItem.Content.Width"  v-bind:source="largeItem.Content.Source"></pb-img><div class="iframeWrapper" v-if="largeIframe" v-html="largeIframe"></div></span><figcaption class="aFigcaption" v-if="largeItem.Content.FigCaptions && largeItem.Content.FigCaptions[2] && largeItem.Content.FigCaptions[2].Content"><span class="ProductFigureSubTitle" v-if="largeItem.Content.FigCaptions[2]">{{largeItem.Content.FigCaptions[2].Content}}</span></figcaption></figure><div v-if="product.Items && product.Items.length > 1" class="productItems pbEdit Gallery" data-type="Product" v-bind:id="product.Guid + \'ProductItems\'" v-bind:class="[product.Settings[\'figcap-position\'],product.Settings[\'hover-transition\'],product.Settings[\'shadows\'],product.Settings[\'rounded\'],product.Settings[\'borders\']]"><figure v-for="item in product.Items" :key="item.Guid" class="Item"  v-bind:class="product.Settings[\'items-animation\']"><span class="imgWrapper" v-on:click="openItem(item)" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:data-iframesrc="item.Content.IFrameSrc" v-bind:id="\'imgWrapper-\'+largeItem.Guid" ><span class="playIcon ficon-playback-play"></span><pb-lazyimg v-bind:alt="product.Title" v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-lazyimg></span><figcaption class="aFigcaption" v-if="item.Content.FigCaptions && item.Content.FigCaptions.length > 0 && item.Content.FigCaptions[0].Content"><span class="ProductFigureTitle" v-if="item.Content.FigCaptions[0]">{{item.Content.FigCaptions[0].Content}}</span><span class="ProductFigureSubTitle" v-if="item.Content.FigCaptions[1]">{{item.Content.FigCaptions[1].Content}}</span></figcaption></figure></div></div></div></article>'
}), Vue.component("dynamicgrid-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            showLightbox: !1,
            lightboxOpenGuid: "",
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right", "figcap-position"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.dynamicGrid(this, this.product)
        },
        openLightbox: function(t) {
            this.lightboxOpenGuid = t, this.showLightbox = !0
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<article><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><pb-productitems ref="items" v-bind:product="product" class="dynamicGrid Gallery galleryWithResponsiveVideo"  v-on:clicked="openLightbox"></pb-productitems></div><pb-misclightbox v-if="showLightbox" v-on:close="showLightbox = false" v-bind:opening-item-guid="lightboxOpenGuid" v-bind:items="product.Items"></pb-misclightbox></article>'
}), Vue.component("goldenratio-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            showLightbox: !1,
            lightboxOpenGuid: "",
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right", "figcap-position"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1.618, this.product)
        },
        openLightbox: function(t) {
            this.lightboxOpenGuid = t, this.showLightbox = !0
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<article><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><pb-productitems ref="items" v-bind:product="product" class="sameRatio Gallery galleryWithResponsiveVideo"  v-on:clicked="openLightbox"></pb-productitems></div><pb-misclightbox v-if="showLightbox" v-on:close="showLightbox = false" v-bind:opening-item-guid="lightboxOpenGuid" v-bind:items="product.Items"></pb-misclightbox></article>'
}), Vue.component("squareratio-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            showLightbox: !1,
            lightboxOpenGuid: "",
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right", "figcap-position"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1, this.product)
        },
        openLightbox: function(t) {
            this.lightboxOpenGuid = t, this.showLightbox = !0
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<article><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><pb-productitems ref="items" v-bind:product="product" class="sameRatio square Gallery galleryWithResponsiveVideo"  v-on:clicked="openLightbox"></pb-productitems></div><pb-misclightbox v-if="showLightbox" v-on:close="showLightbox = false" v-bind:opening-item-guid="lightboxOpenGuid" v-bind:items="product.Items"></pb-misclightbox></article>'
}), Vue.component("portraitratio-product-temp", {
    props: ["product", "store"],
    data: function() {
        return {
            showLightbox: !1,
            lightboxOpenGuid: "",
            runScriptOnChange: {
                elements: ["Product"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right", "figcap-position"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, .75, this.product)
        },
        openLightbox: function(t) {
            this.lightboxOpenGuid = t, this.showLightbox = !0
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<article><div class="reverseOrderWrapper"><pb-productdetails v-bind:product="product"></pb-productdetails><pb-productitems ref="items" v-bind:product="product" class="sameRatio portraits Gallery galleryWithResponsiveVideo"  v-on:clicked="openLightbox"></pb-productitems></div><pb-misclightbox v-if="showLightbox" v-on:close="showLightbox = false" v-bind:opening-item-guid="lightboxOpenGuid" v-bind:items="product.Items"></pb-misclightbox></article>'
}), Vue.component("twocolumns-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit twoColumns" v-bind:class="[section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\', section.Settings && section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']" data-type="Section" v-bind:style=section.Style><div class="left pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="right pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("twocolumnsandtop-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit twoColumnsAndTop" v-bind:class="[section.Settings[\'animation\'], section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="wrapperTop"><component v-for="element in section.ElementsFixed" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="colWrapper"><div class="left pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></div></section>'
}), Vue.component("twocolumns-right-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit twoColumns" v-bind:class="[section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\', section.Settings && section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']" data-type="Section" v-bind:style=section.Style><div class="left pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("threecolumns-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit threeColumns" v-bind:class="[section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\', section.Settings && section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']" data-type="Section" v-bind:style="section.Style"><div class="left pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="center"><component v-bind:element="section.ElementsFixed[\'CenteredElement1\']" v-bind:is="section.ElementsFixed[\'CenteredElement1\'].View"></component></div><div class="right pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("threecolumns2-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit threeColumns" v-bind:class="[section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\', section.Settings && section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']" data-type="Section" v-bind:style="section.Style"><div class="left"><component v-bind:element="section.ElementsFixed[\'SingleImageBg1\']" v-bind:is="section.ElementsFixed[\'SingleImageBg1\'].View"></component></div><div class="middle pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("blank-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit pbElements pbSortable" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]"  data-type="Section" v-bind:style="section.Style" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></section>'
}), Vue.component("goldenratio-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1.618, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: "<section v-bind:id=\"section.Guid\" class=\"Section pbEdit\" v-bind:data-bgimg=\"(section.Style['background-image'] && section.Style['background-image'].length > 10) ? 'yes' : ''\" v-bind:class=\"section.Settings && section.Settings['animation'] ? section.Settings['animation'] : ''\" data-type=\"Section\" v-bind:style=section.Style>" + '<div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\'&& section.ViewType !== \'SectionNews\'" class="sameRatio" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="sameRatio Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="sameRatio Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("portraitratio-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, .75, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: "<section v-bind:id=\"section.Guid\" class=\"Section pbEdit\" v-bind:data-bgimg=\"(section.Style['background-image'] && section.Style['background-image'].length > 10) ? 'yes' : ''\"  v-bind:class=\"section.Settings && section.Settings['animation'] ? section.Settings['animation'] : ''\" data-type=\"Section\" v-bind:style=section.Style>" + '<div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\' " class="sameRatio portraits" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="sameRatio portraits Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="sameRatio portraits Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("squareratio-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: "<section v-bind:id=\"section.Guid\" class=\"Section pbEdit\" v-bind:data-bgimg=\"(section.Style['background-image'] && section.Style['background-image'].length > 10) ? 'yes' : ''\" v-bind:class=\"section.Settings && section.Settings['animation'] ? section.Settings['animation'] : ''\" data-type=\"Section\" v-bind:style=section.Style>" + '<div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" class="sameRatio square" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="sameRatio square Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="sameRatio square Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("evenrows-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.evenRows(this, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit evenRowsSection" data-type="Section" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\'" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\'" class="evenRows" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items" thumb-type="h400" v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="evenRows Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" thumb-type="h400"></sectionprod-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("cv1-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit cv1" data-type="Section" v-bind:class="section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\'" v-bind:style=section.Style><div class="wrapper"><div class="left pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></div> </section>'
}), Vue.component("cv2-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit cv2" data-type="Section" v-bind:class="section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\'" v-bind:style=section.Style><div class="wrapperTop"><singleimage-view v-bind:element="section.ElementsFixed[\'SingleImage1\']"></singleimage-view><header-view v-bind:element="section.ElementsFixed[\'Header1\']"></header-view><shorttext-view v-bind:element="section.ElementsFixed[\'ShortText1\']"></shorttext-view><longtext-view v-bind:element="section.ElementsFixed[\'LongText1\']"></longtext-view></div><div class="wrapper"><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="left pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></div> </section>'
}), Vue.component("cover-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit coverTemp" v-bind:class="[section.Settings[\'animation\'], section.Settings[\'class\']]"  data-type="Section" v-bind:style=section.Style><singleimagebg-view v-bind:element="section.ElementsFixed[\'SingleImageBg1\']"></singleimagebg-view><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("imagetop-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit imageTop" v-bind:class="[section.Settings[\'animation\'], section.Settings && section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']"  data-type="Section" v-bind:style=section.Style><singleimagebg-view v-bind:element="section.ElementsFixed[\'SingleImageBg1\']"></singleimagebg-view><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("imagetop2-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit imageTop2" v-bind:class="section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\'"  data-type="Section" v-bind:style=section.Style><singleimagebg-view v-bind:element="section.ElementsFixed[\'SingleImageBg1\']"></singleimagebg-view><div class="bottomCols"><div class="right pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="left pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></div></section>'
}), Vue.component("halfscreen-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit halfScreen" v-bind:class="[section.Settings[\'animation\'], section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']"  data-type="Section" v-bind:style=section.Style><component class="halfFigure" v-bind:element="section.ElementsFixed[\'SingleImageBg1\']" v-bind:is="section.ElementsFixed[\'SingleImageBg1\'].View" ></component><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("alignbottom-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "Logos"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            let t, e = this.section.ElementsFixed.Items1,
                n = function(t) {
                    let e;
                    return e = "1" === t.Settings["item-size"] ? 11 : "2" === t.Settings["item-size"] ? 13 : "3" === t.Settings["item-size"] ? 15 : "4" === t.Settings["item-size"] ? 17 : "5" === t.Settings["item-size"] ? 19 : 15
                }(e),
                i = function(t) {
                    return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
                }(e);
            t = e.Content && Array.isArray(e.Content) ? e.Content : document.getElementById(e.Guid).getElementsByClassName("Item");
            for (let e of t) {
                let t;
                t = e.Content ? e.Guid : e.dataset.id;
                let o = document.getElementById("item-" + t);
                o.style.width = n + "vw", o.style.marginLeft = i + "vw", o.style.marginRight = i + "vw", o.style.marginBottom = 1 * i + "vw"
            }
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\'" class="alignBottom" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"   v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="alignBottom Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("aligncenter-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Logos", "SectionProd"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            let t = this.section.ElementsFixed.Items1,
                e = function(t) {
                    let e;
                    return e = "1" === t.Settings["item-size"] ? 6 : "2" === t.Settings["item-size"] ? 5 : "3" === t.Settings["item-size"] ? 4 : "4" === t.Settings["item-size"] ? 3 : "5" === t.Settings["item-size"] ? 2 : 4
                }(t),
                n = function(t) {
                    return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
                }(t),
                i = document.getElementById(t.Guid);
            i.style.gridGap = n + "vw", i.style.gridTemplateColumns = "repeat(" + e + ", 1fr)"
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view  v-if="section.ViewType !== \'SectionProd\'" class="alignCenter" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="alignCenter Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("puzzle-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            let t, e = this.section.ElementsFixed.Items1,
                n = function(t) {
                    return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
                }(e),
                i = function(t) {
                    let e;
                    return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
                }(e);
            "sectionnews-view" === e.View || "sectionprod-view" === e.View ? (t = document.getElementById(e.Guid).getElementsByClassName("Gallery")) && (t = t[0]) : t = document.getElementById(e.Guid), t.style.width = i + "%", t.style.gap = n + "vw"
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\'" class="puzzle" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items" thumb-type="h400" v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="puzzle Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" thumb-type="h400"></sectionprod-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("random-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            let t = this.section.ElementsFixed.Items1,
                e = function(t) {
                    return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
                }(t),
                n = function(t) {
                    let e;
                    return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
                }(t),
                i = document.getElementById(t.Guid);
            i.style.width = n + "%", i.style.gridGap = e + "vw"
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" class="random" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="random Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="random Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("horizontal-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        scrollClick: function(t) {
            let e = this.$refs.items.$el,
                n = .8 * e.clientWidth;
            "back" === t ? $(e).animate({
                scrollLeft: "-=" + n
            }, 400) : $(e).animate({
                scrollLeft: "+=" + n
            }, 400)
        },
        runScript: function() {
            utils.templates.horizontalScript(this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div class="horizontal"><span class="arrowContainer" v-on:click="scrollClick(\'back\')" v-if="section.ElementsFixed[\'Items1\'].Content.length > 1"><span class="arrow leftArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="scrollClick(\'forward\')" v-if="section.ElementsFixed[\'Items1\'].Content.length > 1"><span class="arrow rightArr"></span></span><gallery-view class="galleryWithResponsiveVideo" v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items" thumb-type="h800" v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="galleryWithResponsiveVideo Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" thumb-type="h800"></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="galleryWithResponsiveVideo Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("horizontalfocus-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            },
            activeGuid: "",
            didScroll: !0,
            containerWidth: 0,
            scrollWidth: 0,
            contentArray: [],
            positionsArray: {},
            firstItem: {},
            secondItem: {},
            lastItem: {},
            activeDomItem: null,
            element: null,
            domElement: null,
            scrollIntervall: !1
        }
    },
    methods: {
        onScroll: function() {
            if (this.didScroll) {
                let t = this.domElement,
                    e = t.scrollLeft + this.containerWidth / 2,
                    n = !1;
                if (t.scrollLeft < 50) n = this.firstItem;
                else if (this.firstItem.pos.right < e && e < this.secondItem.pos.left) n = this.firstItem;
                else if (t.scrollLeft >= this.scrollWidth - this.containerWidth - 100) n = this.lastItem;
                else
                    for (let t in this.positionsArray)
                        if (this.positionsArray[t].left < e && this.positionsArray[t].right > e) {
                            n = {
                                id: t,
                                pos: this.positionsArray[t]
                            };
                            break
                        } if (n) {
                    this.activeDomItem = document.getElementById("item-" + n.id);
                    let t = this.domElement.getElementsByClassName("active");
                    if (t && t.length > 0)
                        for (let e of t) e.id !== "item-" + n.id && e.classList.remove("active");
                    this.activeDomItem.classList.add("active")
                }
            }
            this.didScroll = !1
        },
        onResize: function() {
            this.getContainerWidth(), utils.environment.wWidth() < 1e3 && (this.domElement.removeEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.getContainerWidth), clearInterval(this.scrollIntervall), this.domElement.classList.add("wasStopped"))
        },
        getContainerWidth: function() {
            this.containerWidth = this.domElement.offsetWidth, this.scrollWidth = this.domElement.scrollWidth
        },
        init: function() {
            this.element.Content && Array.isArray(this.element.Content) ? this.contentArray = this.element.Content : this.contentArray = this.domElement.getElementsByClassName("Item");
            let t = 0;
            for (let e of this.contentArray) {
                let n, i, o;
                e.Content ? (n = e.Guid, i = {
                    left: (o = document.getElementById("item-" + n)).offsetLeft,
                    right: o.offsetLeft + o.offsetWidth
                }) : (n = e.dataset.id, i = {
                    left: e.offsetLeft,
                    right: e.offsetLeft + e.offsetWidth
                }), this.positionsArray[n] = i, 0 === t ? this.firstItem = {
                    id: n,
                    pos: i
                } : 1 === t ? this.secondItem = {
                    id: n,
                    pos: i
                } : t === this.contentArray.length - 1 && (this.lastItem = {
                    id: n,
                    pos: i
                }), t++
            }
            this.firstItem.id && (this.activeDomItem = document.getElementById("item-" + this.firstItem.id), this.activeDomItem && this.activeDomItem.classList.add("active"));
            let e = this;
            this.scrollIntervall = setInterval(function() {
                e.didScroll = !0
            }, 500)
        },
        runScript: function() {
            utils.templates.horizontalScript(this.section.ElementsFixed.Items1)
        }
    },
    created: function() {
        this.element = this.section.ElementsFixed.Items1
    },
    mounted() {
        this.runScript(), this.element.Content && Array.isArray(this.element.Content) ? this.domElement = document.getElementById(this.element.Guid) : this.domElement = document.getElementById(this.element.Guid).getElementsByClassName("Gallery")[0], utils.environment.wWidth() < 1e3 || (this.getContainerWidth(), this.init(), this.domElement.addEventListener("scroll", this.onScroll), window.addEventListener("resize", this.onResize))
    },
    destroyed() {
        this.domElement.removeEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.onResize), clearInterval(this.scrollIntervall)
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div class="horizontal horizontalFocus"><gallery-view class="galleryWithResponsiveVideo" v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items" thumb-type="h800" v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="galleryWithResponsiveVideo Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" thumb-type="h800"></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="galleryWithResponsiveVideo Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("vertical-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.verticalScript(this, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view  v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" class="vertical galleryWithResponsiveVideo" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="vertical galleryWithResponsiveVideo Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="vertical galleryWithResponsiveVideo Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("vertical2-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.verticalScript(this, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view  v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" class="vertical galleryWithResponsiveVideo" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid" inc-desc="yes"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="vertical galleryWithResponsiveVideo Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="vertical galleryWithResponsiveVideo Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("slideshow1-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><slideshow-view v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"></slideshow-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("slideshow2-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><slideshow-view v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"></slideshow-view><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("slideshowfullscreen-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><slideshow-view v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"></slideshow-view></section>'
}), Vue.component("zigzag-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionNews"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.verticalAndLists(this)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionNews\'" class="zigzag" v-bind:element="section.ElementsFixed[\'Items1\']"  v-bind:view-type="section.ViewType" ref="items" inc-desc="yes" inc-button="yes" allow-link-in-desc="yes" v-bind:section-guid="section.Guid"></gallery-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="zigzag Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("boxes-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1,
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Testimonials"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.boxesScript(this, this.section.ElementsFixed.Items1)
        },
        itemLink: function(t) {
            if (t.Content.IFrameSrc && 1 == this.items.Settings["iframe-thumb-play"]) return "#video=" + t.Guid;
            if (t.Content.Link) return t.Content.Link;
            if (this.items.Settings["lb-lightbox"] && "none" !== this.items.Settings["lb-lightbox"]) {
                let e = "?s=" + this.section.Guid + "&i=" + t.Guid;
                return "vertical" === this.items.Settings["lb-template"] && (e += "&t=vertical"), e
            }
            return ""
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div ref="items" class="Gallery boxes pbEdit" v-bind:data-type="section.ViewType" v-bind:class="[items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\']]" v-bind:id="items.Guid" v-bind:style="items.Style" v-bind:section-guid="section.Guid"><figure class="Item" data-type="Item" v-for="item in items.Content" :key="item.Guid" v-bind:class="items.Settings[\'animation\']" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid" v-bind:style="item.Style"><div class="top"><pb-link v-if="item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target"   class="imgWrapper" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc"><span class="playIcon ficon-playback-play"></span><pb-img v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-img></pb-link><pb-link v-if="!item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid"><pb-img v-bind:id="\'img-\'+item.Guid" src="/pb4/_output/admin/_img/dummy3/mixed/transparent.png" height="1000" width="1000"  source="1"></pb-img></pb-link><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="CaptionTitle" v-if="item.Content.FigCaptions[0]" v-bind:id="item.Content.FigCaptions[0].Guid" >{{item.Content.FigCaptions[0].Content}}</pb-link><span class="CaptionSubTitle" v-if="item.Content.FigCaptions[1]" v-bind:id="item.Content.FigCaptions[1].Guid">{{item.Content.FigCaptions[1].Content}}</span></div><div class="CaptionText middle" v-if="item.Content.FigCaptions[2]" v-bind:id="item.Content.FigCaptions[2].Guid" v-html="item.Content.FigCaptions[2].Content"></div><div v-if="item.Content.FigCaptions[3] && item.Content.FigCaptions[3].Content" class="CaptionButton bottom" v-bind:id="item.Content.FigCaptions[2].Guid" v-bind:style="item.Content.FigCaptions[3].Style"><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target">{{item.Content.FigCaptions[3].Content}}</pb-link></div></figure></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("skewed-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1,
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Testimonials"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.verticalAndLists(this)
        },
        itemLink: function(t) {
            if (t.Content.IFrameSrc && 1 == this.items.Settings["iframe-thumb-play"]) return "#video=" + t.Guid;
            if (t.Content.Link) return t.Content.Link;
            if (this.items.Settings["lb-lightbox"] && "none" !== this.items.Settings["lb-lightbox"]) {
                let e = "?s=" + this.section.Guid + "&i=" + t.Guid;
                return "vertical" === this.items.Settings["lb-template"] && (e += "&t=vertical"), e
            }
            return ""
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div ref="items" class="Gallery pbEdit" v-bind:data-type="section.ViewType" v-bind:class="[items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\'],items.Settings[\'hover-transition\']]" v-bind:id="items.Guid" v-bind:style="items.Style" v-bind:section-guid="section.Guid"><figure class="Item" data-type="Item" v-for="item in items.Content" :key="item.Guid" v-bind:class="items.Settings[\'animation\']" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid"  v-bind:style="item.Style"><div class="top"><pb-link v-if="item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc"><span class="playIcon ficon-playback-play"></span><pb-img v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-img></pb-link><pb-link v-if="!item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid"><pb-img v-bind:id="\'img-\'+item.Guid" src="/pb4/_output/admin/_img/dummy3/mixed/transparent.png" height="1000" width="1000"  source="1"></pb-img></pb-link><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target"  class="CaptionTitle" v-if="item.Content.FigCaptions[0]" v-bind:id="item.Content.FigCaptions[0].Guid" >{{item.Content.FigCaptions[0].Content}}</pb-link><span class="CaptionSubTitle" v-if="item.Content.FigCaptions[1]" v-bind:id="item.Content.FigCaptions[1].Guid">{{item.Content.FigCaptions[1].Content}}</span></div><div class="CaptionText middle" v-if="item.Content.FigCaptions[2]" v-bind:id="item.Content.FigCaptions[2].Guid" v-html="item.Content.FigCaptions[2].Content"></div><div v-if="item.Content.FigCaptions[3] && item.Content.FigCaptions[3].Content" class="CaptionButton bottom" v-bind:id="item.Content.FigCaptions[2].Guid" v-bind:style="item.Content.FigCaptions[3].Style"><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target">{{item.Content.FigCaptions[3].Content}}</pb-link></div></figure></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("circleratio-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'"  v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view class="sameRatio square circleRatio" v-bind:element="section.ElementsFixed[\'Items1\']"  v-bind:view-type="section.ViewType" ref="items" v-bind:section-guid="section.Guid"></gallery-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("sidetoside-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionNews"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.verticalAndLists(this)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionNews\'" class="sideToSide" v-bind:element="section.ElementsFixed[\'Items1\']"  v-bind:view-type="section.ViewType" ref="items" inc-desc="yes" allow-link-in-desc="yes" inc-button="yes" v-bind:section-guid="section.Guid"></gallery-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="sideToSide Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("servicesgrid-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1,
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Testimonials"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.boxesScript(this, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div ref="items" class="Gallery serviceGrid pbEdit" data-type="Service" v-bind:class="[items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\']]" v-bind:id="items.Guid" v-bind:style="items.Style"><figure class="Item" data-type="Item" v-for="item in items.Content" :key="item.Guid" v-bind:class="items.Settings[\'animation\']" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid"  v-bind:style="item.Style"><pb-link v-bind:to="item.Content.Link || \'\'" v-bind:ex-target="item.Content.Target" class="CaptionTitle" v-if="item.Content.FigCaptions[0]" v-bind:id="item.Content.FigCaptions[0].Guid" >{{item.Content.FigCaptions[0].Content}}</pb-link><span class="CaptionSubTitle" v-if="item.Content.FigCaptions[1]" v-bind:id="item.Content.FigCaptions[1].Guid">{{item.Content.FigCaptions[1].Content}}</span><div class="CaptionText" v-if="item.Content.FigCaptions[2]" v-bind:id="item.Content.FigCaptions[2].Guid" v-html="item.Content.FigCaptions[2].Content"></div><div v-if="item.Content.FigCaptions[3] && item.Content.FigCaptions[3].Content" class="CaptionButton" v-bind:id="item.Content.FigCaptions[3].Guid" v-bind:style="item.Content.FigCaptions[3].Style"><pb-link v-bind:to="item.Content.Link || \'\'" v-bind:ex-target="item.Content.Target">{{item.Content.FigCaptions[3].Content}}</pb-link></div></figure></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("parallax-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1
        }
    },
    methods: {
        playVideo: function(t) {
            t.Content.IFrameSrc && (document.getElementById("imgWrapper-" + t.Guid).innerHTML = utils.miscFront.makeIFrame(t.Content.IFrameSrc, t.Content.IFrameWidth, t.Content.IFrameHeight, this.section.ElementsFixed.Items1.Settings["iframe-hide-controls"], 1, this.section.ElementsFixed.Items1.Settings["iframe-mute"]))
        }
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div class="Gallery parallax pbEdit" v-bind:class="[items.Settings[\'item-fit\'],items.Settings[\'figcap-position\'],items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\'],items.Settings[\'hover-transition\'],items.Settings[\'class\']]" v-bind:data-type="section.ViewType" v-bind:id="items.Guid" v-bind:style="items.Style"><figure v-for="item in items.Content" :key="item.Guid" class="Item" v-bind:class="[ items.Settings[\'animation\'] ,{gotVideo : item.Content.IFrameSrc}]" data-type="Item" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid" v-bind:style="item.Style" ><a v-if="!item.Content.Link" class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid" v-on:click="playVideo(item)"><span class="playIcon ficon-playback-play"></span><pb-bgimg class="divImg" v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"></pb-bgimg></a><pb-link v-if="item.Content.Link" v-bind:to="item.Content.Link" v-bind:ex-target="item.Content.Target"  class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframeheight="item.Content.IFrameHeight" v-bind:data-iframewidth="item.Content.IFrameWidth"><pb-bgimg class="divImg" v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"></pb-bgimg></pb-link><pb-link v-if="item.Content.FigCaptions[0].Content || item.Content.FigCaptions[1].Content" class="aFigcaption" v-bind:to="item.Content.Link ? item.Content.Link : \'\'" v-bind:ex-target="item.Content.Target ? item.Content.Target : \'\'" ><component v-bind:is="figCap.View" v-for="figCap in item.Content.FigCaptions" :key="figCap.Guid" v-bind:element="figCap"></component></pb-link></figure></div></section>'
}), Vue.component("dynamicgrid-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "SectionNews", "Logos"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right", "figcap-position"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.dynamicGrid(this, this.section.ElementsFixed.Items1)
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit dynamicGridWrapper" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" class="dynamicGrid" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="dynamicGrid Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="dynamicGrid Gallery sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("twoone-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos", "SectionNews"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            let t = this.section.ElementsFixed.Items1;
            if (t && t.Settings && t.Settings["twoone-style"]) return utils.templates.twoOneScript(this, 0);
            utils.templates.twoOneScript(this, 1)
        },
        onResize: function() {
            this.runScript()
        }
    },
    watch: {
        "section.ElementsFixed.Items1.Settings": {
            deep: !0,
            handler: function(t, e) {
                this.runScript()
            }
        }
    },
    mounted() {
        this.runScript(), "left" === site.state.MainMenu.MenuType && window.addEventListener("resize", this.onResize)
    },
    destroyed() {
        "left" === site.state.MainMenu.MenuType && window.removeEventListener("resize", this.onResize)
    },
    template: "<section v-bind:id=\"section.Guid\" class=\"Section pbEdit\" data-type=\"Section\" v-bind:data-bgimg=\"(section.Style['background-image'] && section.Style['background-image'].length > 10) ? 'yes' : ''\" v-bind:class=\"section.Settings && section.Settings['animation'] ? section.Settings['animation'] : ''\" v-bind:style=section.Style>" + '<div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\' && section.ViewType !== \'SectionNews\'" class="twoOne galleryWithResponsiveVideo" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="twoOne Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><sectionnews-view v-if="section.ViewType === \'SectionNews\'" view-class="twoOne Gallery galleryWithResponsiveVideo sectionNewsTemp" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items"  v-bind:section-guid="section.Guid"></sectionnews-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("threeone-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "SectionProd", "Logos"],
                properties: ["item-size", "item-margin", "max-width", "padding-left", "padding-right"]
            }
        }
    },
    methods: {
        runScript: function() {
            let t = this.section.ElementsFixed.Items1;
            if (t && t.Settings && t.Settings["twoone-style"]) return utils.templates.threeOneScript(this, 0);
            utils.templates.threeOneScript(this, 1)
        }
    },
    watch: {
        "section.ElementsFixed.Items1.Settings": {
            deep: !0,
            handler: function(t, e) {
                this.runScript()
            }
        }
    },
    mounted() {
        this.runScript()
    },
    template: "<section v-bind:id=\"section.Guid\" class=\"Section pbEdit\" v-bind:data-bgimg=\"(section.Style['background-image'] && section.Style['background-image'].length > 10) ? 'yes' : ''\" data-type=\"Section\" v-bind:class=\"section.Settings && section.Settings['animation'] ? section.Settings['animation'] : ''\" v-bind:style=section.Style>" + '<div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><gallery-view v-if="section.ViewType !== \'SectionProd\'" class="twoOne" v-bind:element="section.ElementsFixed[\'Items1\']" v-bind:view-type="section.ViewType" ref="items"  v-bind:section-guid="section.Guid"></gallery-view><sectionprod-view v-if="section.ViewType === \'SectionProd\'" view-class="twoOne Gallery" v-bind:element="section.ElementsFixed[\'Items1\']" ref="items" ></sectionprod-view><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("fullposts-temp", {
    props: ["section"],
    data: function() {
        return {
            runScriptOnChange: {
                elements: ["Section", "SectionNews"],
                properties: ["item-size", "item-margin"]
            },
            searchCategory: "",
            trans: translations.state,
            blogCategories: blogCategories.state,
            currentlyOpenFakeSel: "",
            search: "",
            posts: posts.state.posts,
            blog: site.state.BlogSettings,
            postComment: postComment.state
        }
    },
    computed: {
        selectedPosts() {
            return this.posts.filter(t => {
                if ("category" !== this.section.ElementsFixed.Items1.Content.SelectItemsBy || !this.section.ElementsFixed.Items1.Content.FromCategory) return !0;
                if (t.Categories && Array.isArray(t.Categories)) {
                    return !!utils.arrayHelper.findItem(t.Categories, "Url", this.section.ElementsFixed.Items1.Content.FromCategory)
                }
            }).slice(0, this.section.ElementsFixed.Items1.Content.NrOfItems)
        },
        filteredAndOrderedPosts() {
            if (this.section.ElementsFixed.Items1.Content.Filter) {
                if ("filter-searchsortcat" === this.section.ElementsFixed.Items1.Content.Filter) {
                    return this.selectedPosts.filter(t => {
                        let e = !1,
                            n = !1;
                        return e = !this.search || t.Title.toLowerCase().indexOf(this.search.toLowerCase()) > -1, n = !this.searchCategory || !(!t.Categories || t.Categories.length < 1) && utils.arrayHelper.findItem(t.Categories, "Url", this.searchCategory), !(!e || !n)
                    })
                }
                if ("filter-catcloud" === this.section.ElementsFixed.Items1.Content.Filter) {
                    return this.selectedPosts.filter(t => {
                        let e = !1;
                        return e = !this.searchCategory || !(!t.Categories || t.Categories.length < 1) && utils.arrayHelper.findItem(t.Categories, "Url", this.searchCategory)
                    })
                }
                return this.selectedPosts
            }
            return this.selectedPosts
        }
    },
    methods: {
        runScript: function() {
            let t = this.section.ElementsFixed.Items1,
                e = (function(t) {
                    (t.Settings || t.Settings["item-margin"]) && parseFloat(t.Settings["item-margin"])
                }(t), function(t) {
                    let e;
                    return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
                }(t));
            document.getElementById(t.Guid).style.width = e + "%"
        },
        openFakeSelect: function(t) {
            this.currentlyOpenFakeSel = t
        },
        closeFakeSel: function(t) {
            this.currentlyOpenFakeSel = "", t.stopPropagation()
        },
        changeCategory: function(t) {
            this.searchCategory = t.Url;
            let e = this;
            frontApp.$nextTick(function() {
                e.$parent.runScript()
            })
        },
        searchDone: function() {
            let t = this;
            frontApp.$nextTick(function() {
                t.$parent.runScript()
            })
        },
        openComments: function() {
            postComment.actions.openCommentPopup(this.post)
        },
        scrollClick: function(t, e) {
            let n;
            for (let t of e.target.parentNode.children) t.classList.contains("horizontalImagesInBlog") && (n = t);
            if (n) {
                let e = .8 * n.clientWidth;
                "back" === t ? $(n).animate({
                    scrollLeft: "-=" + e
                }, 400) : $(n).animate({
                    scrollLeft: "+=" + e
                }, 400)
            } else console.log("Could not find el")
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style=section.Style><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div class="SectionNews pbEdit fullPosts" v-bind:style="section.ElementsFixed[\'Items1\'].Style" data-type="SectionNews" v-bind:id="section.ElementsFixed[\'Items1\'].Guid"><div v-if="section.ElementsFixed[\'Items1\'].Content.Filter" class="searchFilter" v-bind:class="section.ElementsFixed[\'Items1\'].Content.Filter"><input type="text" v-model="search" v-bind:placeholder="trans.Search" v-on:keyup="searchDone" class="searchField"><div class="fakeSelect categories" v-bind:class="{active: currentlyOpenFakeSel === \'categories\'}" v-on:click="openFakeSelect(\'categories\')"><div class="catHeader">{{trans.Categories}}</div><ul><li v-bind:class="{active: !searchCategory}" v-on:click="changeCategory(\'\')">All</li><li v-for="cat in blogCategories" :key="cat.Guid" v-bind:class="{active: searchCategory === cat.Url}" v-on:click="changeCategory(cat)">{{cat.Title}}</li></ul><span class="ficon-angle-down"></span><span class="ficon-angle-up"></span><div class="fakeBg" v-on:click="closeFakeSel"></div></div> </div><article :key="post.Guid" v-for="post in filteredAndOrderedPosts" class="BlogPostInSection"><h1 class="CaptionTitle"><router-link v-bind:to="\'/\'+blog.Url+\'/\'+post.Url">{{post.Title}}</router-link></h1><div class="CaptionSubTitle">{{post.PostDate | datetostring}}</div><div class="CaptionText" v-html="post.TextContent"></div><pb-blogpostitems v-if="post.View === \'vertical-post\' && post.Items && post.Items.length > 0" v-bind:post="post" class="vertical blogPost Gallery galleryWithResponsiveVideo"  inc-desc="1" v-bind:class="post.View"></pb-blogpostitems><div v-if="post.View === \'goldenratio-post\' && post.Items && post.Items.length > 0" class="sameRatio inBlogPost pbEdit postItems blogPost Gallery" data-type="BlogPost" v-bind:id="post.Guid + \'BlogPostItems\'" v-bind:class="[post.Settings[\'figcap-position\'],post.Settings[\'hover-transition\'],post.Settings[\'shadows\'],post.Settings[\'rounded\'],post.Settings[\'borders\']]"><figure v-for="item in post.Items" :key="item.Guid" class="Item" v-bind:class="post.Settings[\'items-animation\']"><span class="imgWrapper" v-on:click="openLightbox(item.Guid)" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid"><span class="playIcon ficon-playback-play"></span><pb-lazyimg v-bind:alt="post.Title" v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-lazyimg></span><figcaption class="aFigcaption" v-if="item.Content.FigCaptions && item.Content.FigCaptions.length > 0"><span class="BlogFigureTitle" data-type="BlogFigureTitle" v-if="item.Content.FigCaptions[0]">{{item.Content.FigCaptions[0].Content}}</span><span class="BlogFigureSubTitle" data-type="BlogFigureSubTitle" v-if="item.Content.FigCaptions[1]">{{item.Content.FigCaptions[1].Content}}</span></figcaption></figure></div><div class="horizontal" v-if="post.View === \'horizontal-post\' && post.Items && post.Items.length > 0"><span class="arrowContainer" v-on:click="scrollClick(\'back\',$event)" v-if="post.Items.length > 1"><span class="arrow leftArr"></span></span><span class="arrowContainer rightArrCon" v-on:click="scrollClick(\'forward\',$event)" v-if="post.Items.length > 1"><span class="arrow rightArr"></span></span><pb-blogpostitems v-bind:post="post" class="Gallery galleryWithResponsiveVideo horizontalImagesInBlog" thumb-type="h800"></pb-blogpostitems></div><pb-blogshare v-bind:post="post"></pb-blogshare><pb-blogcomment v-bind:post="post" v-if="blog.DisableComments !== 1 && post.DisableComments !== 1"></pb-blogcomment></article></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><pb-postcomment v-if="postComment.isShown"></pb-postcomment></section>'
}), Vue.component("boxessameratio-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1,
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Testimonials"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1, this.section.ElementsFixed.Items1)
        },
        itemLink: function(t) {
            if (t.Content.IFrameSrc && 1 == this.items.Settings["iframe-thumb-play"]) return "#video=" + t.Guid;
            if (t.Content.Link) return t.Content.Link;
            if (this.items.Settings["lb-lightbox"] && "none" !== this.items.Settings["lb-lightbox"]) {
                let e = "?s=" + this.section.Guid + "&i=" + t.Guid;
                return "vertical" === this.items.Settings["lb-template"] && (e += "&t=vertical"), e
            }
            return ""
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div ref="items" class="Gallery boxes pbEdit" v-bind:data-type="section.ViewType" v-bind:class="[items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\']]" v-bind:id="items.Guid" v-bind:style="items.Style" v-bind:section-guid="section.Guid"><figure class="Item" data-type="Item" v-for="item in items.Content" :key="item.Guid" v-bind:class="items.Settings[\'animation\']" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid" v-bind:style="item.Style"><div class="top"><pb-link v-if="item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target"   class="imgWrapper" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc"><span class="playIcon ficon-playback-play"></span><pb-img v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-img></pb-link><pb-link v-if="!item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid"><pb-img v-bind:id="\'img-\'+item.Guid" src="/pb4/_output/admin/_img/dummy3/mixed/transparent.png" height="1000" width="1000"  source="1"></pb-img></pb-link><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="CaptionTitle" v-if="item.Content.FigCaptions[0]" v-bind:id="item.Content.FigCaptions[0].Guid" >{{item.Content.FigCaptions[0].Content}}</pb-link><span class="CaptionSubTitle" v-if="item.Content.FigCaptions[1]" v-bind:id="item.Content.FigCaptions[1].Guid">{{item.Content.FigCaptions[1].Content}}</span></div><div class="CaptionText middle" v-if="item.Content.FigCaptions[2]" v-bind:id="item.Content.FigCaptions[2].Guid" v-html="item.Content.FigCaptions[2].Content"></div><div v-if="item.Content.FigCaptions[3] && item.Content.FigCaptions[3].Content" class="CaptionButton bottom" v-bind:id="item.Content.FigCaptions[2].Guid" v-bind:style="item.Content.FigCaptions[3].Style"><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target">{{item.Content.FigCaptions[3].Content}}</pb-link></div></figure></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("boxesreversedsameratio-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1,
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Testimonials"],
                properties: ["item-margin", "item-size"]
            }
        }
    },
    methods: {
        runScript: function() {
            utils.templates.sameRatioScript(this, 1, this.section.ElementsFixed.Items1)
        },
        itemLink: function(t) {
            if (t.Content.IFrameSrc && 1 == this.items.Settings["iframe-thumb-play"]) return "#video=" + t.Guid;
            if (t.Content.Link) return t.Content.Link;
            if (this.items.Settings["lb-lightbox"] && "none" !== this.items.Settings["lb-lightbox"]) {
                let e = "?s=" + this.section.Guid + "&i=" + t.Guid;
                return "vertical" === this.items.Settings["lb-template"] && (e += "&t=vertical"), e
            }
            return ""
        }
    },
    mounted() {
        this.runScript()
    },
    template: '<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style"><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div ref="items" class="Gallery boxes pbEdit" v-bind:data-type="section.ViewType" v-bind:class="[items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\']]" v-bind:id="items.Guid" v-bind:style="items.Style" v-bind:section-guid="section.Guid"><figure class="Item" data-type="Item" v-for="item in items.Content" :key="item.Guid" v-bind:class="items.Settings[\'animation\']" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid" v-bind:style="item.Style"><div class="top"><pb-link v-if="item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target"   class="imgWrapper" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc"><span class="playIcon ficon-playback-play"></span><pb-img v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-img></pb-link><pb-link v-if="!item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid"><pb-img v-bind:id="\'img-\'+item.Guid" src="/pb4/_output/admin/_img/dummy3/mixed/transparent.png" height="1000" width="1000"  source="1"></pb-img></pb-link><div class="CaptionText" v-if="item.Content.FigCaptions[2]" v-bind:id="item.Content.FigCaptions[2].Guid" v-html="item.Content.FigCaptions[2].Content"></div></div><div class="middle"><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="CaptionTitle" v-if="item.Content.FigCaptions[0]" v-bind:id="item.Content.FigCaptions[0].Guid" >{{item.Content.FigCaptions[0].Content}}</pb-link><span class="CaptionSubTitle" v-if="item.Content.FigCaptions[1]" v-bind:id="item.Content.FigCaptions[1].Guid">{{item.Content.FigCaptions[1].Content}}</span></div><div v-if="item.Content.FigCaptions[3] && item.Content.FigCaptions[3].Content" class="CaptionButton bottom" v-bind:id="item.Content.FigCaptions[2].Guid" v-bind:style="item.Content.FigCaptions[3].Style"><pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target">{{item.Content.FigCaptions[3].Content}}</pb-link></div></figure></div><div class="pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("covertwocolumns-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit coverTwoColumns" v-bind:class="[section.Settings && section.Settings[\'animation\'] ? section.Settings[\'animation\'] : \'\', section.Settings && section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']" data-type="Section" v-bind:style=section.Style><singleimagebg-view v-bind:element="section.ElementsFixed[\'SingleImageBg1\']"></singleimagebg-view><div class="left pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid"  v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("twocolsleftbgimg-temp", {
    props: ["section"],
    template: '<section v-bind:id="section.Guid" class="Section pbEdit twoColsLeftBgImg" v-bind:class="[section.Settings[\'animation\'], section.Settings[\'class\'] ? section.Settings[\'class\'] : \'\']"  data-type="Section" v-bind:style=section.Style><div class="left"><component class="halfFigure" v-bind:element="section.ElementsFixed[\'SingleImageBg1\']" v-bind:is="section.ElementsFixed[\'SingleImageBg1\'].View" ></component><div class="pbElements pbSortable" data-elements-position="top"><component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></div><div class="right pbElements pbSortable" data-elements-position="bottom"><component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div></section>'
}), Vue.component("carousel-temp", {
    props: ["section"],
    data: function() {
        return {
            items: this.section.ElementsFixed.Items1,
            runScriptOnChange: {
                elements: ["Gallery", "Section", "Service", "Team", "LinkPage", "Testimonials"],
                properties: ["item-size"]
            },
            activeIndex: 0,
            x: {
                start: 0,
                end: 0
            },
            y: {
                start: 0,
                end: 0
            },
            time: {
                start: 0,
                end: 0
            },
            direction: 1,
            isTouch: !1
        }
    },
    methods: {
        runScript: function() {
            utils.templates.carouselScript(this, this.section.ElementsFixed.Items1)
        },
        itemLink: function(t) {
            if (t.Content.IFrameSrc && 1 == this.items.Settings["iframe-thumb-play"]) return "#video=" + t.Guid;
            if (t.Content.Link) return t.Content.Link;
            if (this.items.Settings["lb-lightbox"] && "none" !== this.items.Settings["lb-lightbox"]) {
                let e = "?s=" + this.section.Guid + "&i=" + t.Guid;
                return "vertical" === this.items.Settings["lb-template"] && (e += "&t=vertical"), e
            }
            return ""
        },
        changeIndex: function(t) {
            this.activeIndex = t
        },
        goNext() {
            this.activeIndex === this.items.Content.length - 1 ? this.activeIndex = 0 : this.activeIndex++
        },
        goBack() {
            0 === this.activeIndex ? this.activeIndex = this.items.Content.length - 1 : this.activeIndex--
        },
        onTouchDown(t) {
            this.isTouch = !0, this.time.start = Date.now(), this.x.start = t.touches ? t.touches[0].clientX : t.clientX, this.y.start = t.touches ? t.touches[0].clientY : t.clientY
        },
        onTouchMove(t) {
            if (!this.isTouch) return;
            const e = t.touches ? t.touches[0].clientX : t.clientX,
                n = (t.touches ? t.touches[0].clientY : t.clientY) - this.y.start,
                i = e - this.x.start;
            Math.abs(i) > Math.abs(n) && (t.preventDefault(), this.direction = i < 0 ? -1 : 1)
        },
        onTouchUp(t) {
            if (!this.isTouch) return;
            this.isTouch = !1;
            const e = t.changedTouches ? t.changedTouches[0].clientX : t.clientX,
                n = t.changedTouches ? t.changedTouches[0].clientY : t.clientY;
            this.y.end = n, this.x.end = e, this.time.end = Date.now();
            const i = Math.abs(this.y.end - this.y.start);
            this.time.end - this.time.start < 5e3 && this.time.end - this.time.start > 90 && i < 50 && (t.preventDefault(), this.resetValues(), 1 === this.direction ? this.goBack() : this.goNext())
        },
        resetValues() {
            this.x.end = this.x.start = 0, this.y.end = this.y.start = 0, this.time.end = this.time.start = 0
        }
    },
    mounted() {
        this.runScript(), this.$refs.section.addEventListener("touchstart", this.onTouchDown), this.$refs.section.addEventListener("touchmove", this.onTouchMove), this.$refs.section.addEventListener("touchend", this.onTouchUp)
    },
    beforeDestroy() {
        this.$refs.section.removeEventListener("touchstart", this.onTouchDown), this.$refs.section.removeEventListener("touchmove", this.onTouchMove), this.$refs.section.removeEventListener("touchend", this.onTouchUp)
    },
    watch: {
        "items.Content.length": function(t, e) {
            this.activeIndex >= t && this.changeIndex(t - 1)
        }
    },
    template: '\n\t\t\t\t<section v-bind:id="section.Guid" class="Section pbEdit" v-bind:data-bgimg="(section.Style[\'background-image\'] && section.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[section.Settings[\'animation\'],section.Settings[\'class\']]" data-type="Section" v-bind:style="section.Style" ref="section">\n\t\t\t\t\t<div class="pbElements pbSortable" data-elements-position="top">\n\t\t\t\t\t\t<component v-for="element in section.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div ref="items" class="Gallery carousel pbEdit" v-bind:data-type="section.ViewType" v-bind:class="[items.Settings[\'shadows\'],items.Settings[\'rounded\'],items.Settings[\'borders\'],items.Settings[\'hover-transition\']]" v-bind:id="items.Guid" v-bind:style="items.Style" v-bind:section-guid="section.Guid">\n\t\t\t\t\t\t<figure ref="item" class="Item" data-type="Item" v-for="(item, index) in items.Content" :key="item.Guid" v-bind:class="[items.Settings[\'animation\'], index === activeIndex ? \'activeItem\' : \'\']" v-bind:id="\'item-\'+item.Guid" v-bind:data-id="item.Guid" v-bind:style="item.Style">\n\t\t\t\t\t\t\t<div class="box">\n\t\t\t\t\t\t\t\t<div class="CaptionText" v-if="item.Content.FigCaptions[2]" v-bind:id="item.Content.FigCaptions[2].Guid" v-html="item.Content.FigCaptions[2].Content"></div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<pb-link v-if="item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:class="{gotVideo : item.Content.IFrameSrc}" v-bind:id="\'imgWrapper-\'+item.Guid" v-bind:data-iframesrc="item.Content.IFrameSrc">\n\t\t\t\t\t\t\t\t\t<span class="playIcon ficon-playback-play"></span>\n\t\t\t\t\t\t\t\t\t<pb-img v-bind:id="\'img-\'+item.Guid" v-bind:src="item.Content.Src" v-bind:height="item.Content.Height" v-bind:width="item.Content.Width"  v-bind:source="item.Content.Source"></pb-img>\n\t\t\t\t\t\t\t\t</pb-link>\n\t\t\t\t\t\t\t\t<pb-link v-if="!item.Content.Src" v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="imgWrapper" v-bind:id="\'imgWrapper-\'+item.Guid">\n\t\t\t\t\t\t\t\t\t<pb-img v-bind:id="\'img-\'+item.Guid" src="/pb4/_output/admin/_img/dummy3/mixed/transparent.png" height="1000" width="1000"  source="1"></pb-img>\n\t\t\t\t\t\t\t\t</pb-link>\n\t\t\t\t\t\t\t\t<pb-link v-bind:to="itemLink(item)" v-bind:ex-target="item.Content.Target" class="CaptionTitle" v-if="item.Content.FigCaptions[0]" v-bind:id="item.Content.FigCaptions[0].Guid">{{item.Content.FigCaptions[0].Content}}</pb-link>\n\t\t\t\t\t\t\t\t<span class="CaptionSubTitle" v-if="item.Content.FigCaptions[1]" v-bind:id="item.Content.FigCaptions[1].Guid">{{item.Content.FigCaptions[1].Content}}</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t<div class="carouselControls" v-if="items.Content.length > 1">\n\t\t\t\t\t\t\t<span v-for="(item,index) in items.Content" class="carouselDot" @click="changeIndex(index)" v-bind:class="{active: index === activeIndex}"></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="pbElements pbSortable" data-elements-position="bottom">\n\t\t\t\t\t\t<component v-for="element in section.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component>\n\t\t\t\t\t</div>\n\t\t\t\t</section>\n\t\t\t\t'
}), Vue.component("menu1-menu", {
    props: ["mainMenu"],
    data: function() {
        return {
            hamburgerOpenClass: "",
            secondMenuOpenClass: "",
            siteState: site.state,
            trans: translations.state,
            checkout: checkoutStore.state
        }
    },
    methods: {
        hamburgerClick: function() {
            this.hamburgerOpenClass = "" === this.hamburgerOpenClass ? "open" : "", this.secondMenuOpenClass = "" === this.secondMenuOpenClass ? "open" : ""
        },
        newRoute() {
            this.hamburgerOpenClass = "", this.secondMenuOpenClass = ""
        }
    },
    watch: {
        $route: "newRoute",
        $hiddenMenu() {
            this.newRoute()
        }
    },
    template: '<div class="navWrapper" v-bind:class="[mainMenu.Settings[\'position-class\']]"><div class="StoreCartRow pbEdit" data-type="StoreCartRow" id="StoreCartRow"  v-if="checkout.cart.nrInCart > 0 || siteState.StoreSettings.Settings[\'show-cart\']"><span class="yourCartText" v-on:click="checkout.showCheckout = true">{{trans.YourCart}}</span><span class="StoreCartIcon" v-on:click="checkout.showCheckout = true"><span class="ficon-bag"></span><span class="bagNr" v-if="checkout.cart.nrInCart > 0 ">{{checkout.cart.nrInCart}}</span></span></div><nav class="MainMenu pbEdit inViewPoint" data-type="MainMenu" id="MainMenuId" v-bind:style="mainMenu.Style" v-bind:data-bgimg="(mainMenu.Style[\'background-image\'] &&  mainMenu.Style[\'background-image\'].length > 10) ? \'yes\' : \'\'" v-bind:class="[mainMenu.Settings[\'class\'],secondMenuOpenClass,mainMenu.Settings[\'mobile-menu-icon-position\']]"><div class="pbMenu pbSortable pbElements first" data-elements-position="top"><component v-for="element in mainMenu.ElementsTop" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div class="pbMenu pbSortable pbElements second" data-elements-position="bottom" v-bind:class="[secondMenuOpenClass,mainMenu.Settings[\'hidden-menu-style\'],mainMenu.Settings[\'left-menu-style\']]"><component v-for="element in mainMenu.ElementsBottom" :key="element.Guid" v-bind:is="element.View" v-bind:element="element"></component></div><div class="hamburger" v-on:click="hamburgerClick()" v-bind:class="[hamburgerOpenClass,mainMenu.Settings[\'hamburger-style\']]" v-if="mainMenu.ElementsBottom.length > 1 || mainMenu.Links.length > 0"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div></div></nav></div>'
});
const SiteFooter = Vue.component("site-footer", {
    data: function() {
        return {
            siteState: site.state
        }
    },
    updated() {
        this.trackViewPoint()
    },
    mounted() {
        this.trackViewPoint()
    },
    methods: {
        trackViewPoint: function() {
            utils.miscFront.trackViewPoint(".sectionWrapper")
        }
    },
    template: '<div class="routerViewWrapper SiteFooter"><div class="sectionWrapper mainContentMenuAdjusted" v-for="section in siteState.Sections" :key="section.Guid"><component v-bind:is="section.View" v-bind:section="section"></component></div></div>'
});
Vue.component("startup-wizard", {
    data: function() {
        return {
            step: 0,
            lang: lang.state,
            stepClass: "step1",
            widthClass: " popXSmall2",
            logoText: "",
            nrOfGalleries: 0,
            fonts: [{
                wizardTitle: lang.state.common.SansSerif,
                title: "Montserrat",
                family: "'Montserrat',sans-serif",
                type: "google",
                languages: "cyrillic",
                category: "sans-serif"
            }, {
                wizardTitle: lang.state.common.Serif,
                title: "Cormorant",
                family: "'Cormorant',serif",
                type: "google",
                languages: "cyrillic",
                category: "serif"
            }],
            colors: [{
                "background-color": "#ffffff",
                color: "#000000",
                title: lang.state.common.White
            }, {
                "background-color": "#000000",
                color: "#FFFFFF",
                title: lang.state.common.Black
            }],
            styles: [{
                title: lang.state.common.Minimalistic,
                type: "minimalistic",
                id: 1
            }, {
                title: lang.state.common.Medium,
                type: "balanced",
                id: 2
            }, {
                title: lang.state.common.Large,
                type: "large",
                id: 3
            }],
            selectedColor: null,
            selectedFont: null
        }
    },
    methods: {
        done: function() {
            this.$emit("done")
        },
        next: function() {
            this.step++, this.stepClass = "step" + this.step
        },
        setFont: function() {
            "Montserrat" === this.selectedFont.title ? resource.fontcombos.methods.setCombo("montserrat") : resource.fontcombos.methods.setCombo("cormorant")
        },
        chooseFont: function(t) {
            this.selectedFont = t, this.step++, this.stepClass = "step" + this.step
        },
        setColor: function() {
            "#000000" === this.selectedColor.color ? resource.colorcombos.methods.setCombo("whiteblue") : resource.colorcombos.methods.setCombo("blackpurple")
        },
        chooseColor: function(t) {
            this.selectedColor = t, this.step++, this.stepClass = "step" + this.step
        },
        chooseStyle: function(t) {
            utils.environment.wWidth() < 1e3 ? gui.state.dialogs.mobileTapAndHoldMessage = !0 : gui.state.dialogs.learnPopup = !0, account.state.TemplateSettings ? account.state.TemplateSettings["template-size"] = t.id : account.state.TemplateSettings = {
                "template-size": t.id
            }, account.state.TemplateSettings["default-animation"] = resource.templateSettings.methods.getInitialAnimation(), account.state.TemplateSettings["default-hover"] = resource.templateSettings.methods.getInitialHover(), Account.Update("TemplateSettings", account.state.TemplateSettings), this.setFont(), this.setColor(), this.done()
        },
        nextLogo: function() {
            if (this.logoText) {
                this.logoText = this.logoText.trim(),
                    function(t) {
                        let e = $("#MAINMENULOGO");
                        if (e.length) {
                            let n = new ClickPoint(e),
                                i = new E_Query(n);
                            i.selectOne().Content.Text = t, ElementInterface.Update(i)
                        }
                    }(this.logoText), site.state.Title = this.logoText, Site.Update("Title", site.state.Title), this.next()
            } else adminApp.alert(lang.state.common.NeedToEnterTextForLogo)
        }
    },
    created: function() {
        site.state.Title && (this.step = 1, this.stepClass = "step" + this.step)
    },
    mounted: function() {
        let t = document.createElement("link");
        t.rel = "stylesheet", t.type = "text/css";
        t.href = "https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Cormorant:300,400,700", document.getElementsByTagName("head")[0].appendChild(t)
    },
    template: '\n<div class="popWrapper startupWizard">\n    <div class="popBg"></div>\n    <div class="popContent popMoveable" v-bind:class="[stepClass,widthClass]">\n        <div v-if="step === 0">\n            <h1 class="aHead editorHeadNoBorder">{{lang.common.EnterTextForLogo}}</h1>\n            <div class="popWhiteBox popCenter question">\n                <input type="text" placeholder="John Doe" v-model="logoText">\n                <div class="btnWrapper btnWrapperBg marginTopSmall">\n                \t<div class="btn" v-on:click="nextLogo">{{lang.common.Next}}</div>\n                </div>\t\n            </div>\n        </div>\n        <div v-if="step === 1">\n            <h1 class="aHead editorHeadNoBorder">{{lang.common.ChooseAFont}}</h1>\n            <div class="popWhiteBox popCenter question">\n                <article v-for="font in fonts" :key="font.title" v-bind:style="{\'font-family\' : font.family}" v-on:click="chooseFont(font)">{{font.wizardTitle}}</article>\n            </div>\n        </div>\n        <div v-if="step === 2">\n            <h1 class="aHead editorHeadNoBorder">{{lang.common.ChooseBackground}}</h1>\n            <div class="popWhiteBox popCenter question colorList">\n                <article v-for="color in colors" :key="color.type" v-bind:style="{\'background-color\' : color[\'background-color\'],\'color\' : color[\'color\']}" v-on:click="chooseColor(color)">{{color.title}}</article>\n            </div>\n        </div>\n        <div v-if="step === 3">\n            <h1 class="aHead editorHeadNoBorder">{{lang.common.ChooseStyle}}</h1>\n            <div class="popWhiteBox popCenter question">\n                <article v-for="style in styles" :key="style.title" v-on:click="chooseStyle(style)">{{style.title}}</article>\n            </div>\n        </div>\n    </div>\n</div>\n'
});
const fourOFourPage = Vue.component("fourofour-page", {
        data: function() {
            return {
                pagesState: pages.state,
                siteState: site.state,
                lang: {},
                noPages: !1,
                showStartExp: !1
            }
        },
        created: function() {
            this.$emit("hidemenu", !1), this.$emit("hidefooter", !1), window.pb.isAdmin && (this.lang = lang.state, 0 === this.pagesState.pages.length && (this.noPages = !0, this.showStartExp = !0))
        },
        template: '<div class="fourOFour"><div class="fourOFourFront"><h1 class="Header">404. The page did not exist</h1></div><div v-if="showStartExp" class="adminApp"><startup-wizard v-on:done="showStartExp = false"></startup-wizard></div><div v-if="noPages" class="adminApp"><div class="noPagesBlocker"><div v-if="!showStartExp"><img v-bind:src="\'/pb4/_output/admin/_img/icons/macmobile-icon.png\' | cdnFile" alt=""><h1 class="aHead">{{lang.common.AddYourContentToGetStarted}}</h1><h3 class="aHead">{{lang.common.Click}}: <strong>{{lang.common.ManagePages}}</strong> > <strong>{{lang.common.CreateNewPage}}</strong></h3></div></div></div></div>'
    }),
    digitalAssetPage = Vue.component("digitalasset-page", {
        data: function() {
            return {
                siteState: site.state,
                trans: translations.state,
                fileIsReadable: !1,
                asset: null,
                linkEndDate: null,
                link: ""
            }
        },
        methods: {
            fetchAsset() {
                this.$route.params && this.$route.params.guid && this.$route.params.time && this.$route.params.hash ? frontApi.getDigitalAsset(this.$route.params.guid, this.$route.params.time, this.$route.params.hash).then(t => {
                    t.asset && t.asset.Guid ? (this.asset = t.asset, this.link = t.link, this.fileIsReadable = !0) : (console.log(t), this.fileIsReadable = !1)
                }) : this.$router.push({
                    path: "/404"
                })
            }
        },
        watch: {
            $route: "fetchAsset"
        },
        created: function() {
            this.$emit("hidemenu", !1), this.$emit("hidefooter", !1), this.fetchAsset()
        },
        template: '\n\t\t<div class="digitalAssetPage">\n\t\t\t<div class="fileInfo" v-if="fileIsReadable">\n\t\t\t\t<h1 class="Header">{{ trans.Download }}: {{ asset.Title }}</h1>\n\t\t\t\t<p class="desc LongText" v-html="asset.Description"></p>\n\t\t\t\t<div class="fileName LongText">{{ asset.FileName }}</div>\n\t\t\t\t<div class="Button"><a v-bind:href="link" target="_blank">{{ trans.Download }}</a></div>\n\t\t\t</div>\n\t\t\t<div class="fileInfo" v-if="!fileIsReadable">\n\t\t\t\t<h1 class="Header">{{ trans.Download }}</h1>\n\t\t\t\t<div class="desc LongText">{{ trans.ThisFileIsNotAvailable }}</div>\n\t\t\t</div>\n\t\t</div>\n\t'
    }),
    blogPostPage = Vue.component("blogpost-page", {
        data: function() {
            return {
                postsState: posts.state,
                site: site.state,
                post: null,
                postComment: postComment.state
            }
        },
        created() {
            this.$emit("hidemenu", !1), this.$emit("hidefooter", !1), this.fetchPost()
        },
        updated() {
            this.trackViewPoint()
        },
        mounted() {
            this.trackViewPoint()
        },
        watch: {
            $route: "fetchPost"
        },
        methods: {
            fetchPost() {
                this.$route.params && this.$route.params.url ? (this.post = posts.actions.getCurrentPost(this.$route.params.url), this.post || this.$router.push({
                    path: "404"
                })) : this.$router.push({
                    path: "/404"
                })
            },
            trackViewPoint: function() {
                utils.miscFront.trackViewPoint(".mainContentMenuAdjusted")
            }
        },
        template: '<div class="mainContentMenuAdjusted"><component v-bind:is="post.View" v-bind:post="post" v-bind:blog="site.BlogSettings" class="pbEdit BlogPost" data-type="BlogPost" v-bind:id="post.Guid" v-bind:class="[post.Settings ? post.Settings[\'reverse-order\'] : \'\']"></component><pb-postcomment v-if="postComment.isShown"></pb-postcomment></div>'
    }),
    sectionPage = Vue.component("section-page", {
        data: function() {
            return {
                pagesState: pages.state,
                currentPage: null,
                siteState: site.state,
                lightbox: {
                    sectionGuid: "",
                    itemGuid: "",
                    template: ""
                }
            }
        },
        created() {
            this.fetchPage()
        },
        updated() {
            this.trackViewPoint()
        },
        mounted() {
            this.trackViewPoint()
        },
        watch: {
            $route: "fetchPage"
        },
        methods: {
            fetchPage() {
                this.pagesState.current.url = this.$route.path, this.$route.query.s && this.$route.query.i ? (this.lightbox.sectionGuid = this.$route.query.s, this.lightbox.itemGuid = this.$route.query.i, this.lightbox.template = "pb-sectionlightbox", "vertical" === this.$route.query.t && (this.lightbox.template = "pb-sectionlightboxvertical"), this.pagesState.current.showLightbox = !0) : (this.lightbox.sectionGuid = "", this.lightbox.itemGuid = "", this.pagesState.current.showLightbox = !1);
                let t = pages.actions.getCurrentPage(this.pagesState.current.url);
                t ? (this.currentPage = t, this.$emit("hidemenu", t.HideMenu), this.$emit("hidefooter", t.HideFooter)) : this.$router.push({
                    path: "404"
                })
            },
            trackViewPoint: function() {
                utils.miscFront.trackViewPoint(".sectionWrapper")
            }
        },
        template: '<div class="routerViewWrapper" v-if="currentPage"><div class="sectionWrapper mainContentMenuAdjusted" v-for="section in currentPage.Sections" :key="section.Guid"><component v-bind:is="section.View" v-bind:section="section"></component></div><component v-bind:is="lightbox.template" v-if="pagesState.current.showLightbox" v-bind:section-guid="lightbox.sectionGuid" v-bind:item-guid="lightbox.itemGuid"></component></div>'
    }),
    pwdSectionPage = Vue.component("pwdsection-page", {
        data: function() {
            return {
                pwdPagesState: pwdPages.state,
                currentPwdPage: null,
                siteState: site.state,
                showLogin: !1,
                lightbox: {
                    sectionGuid: "",
                    itemGuid: "",
                    template: ""
                },
                trans: translations.state,
                name: "",
                password: ""
            }
        },
        created() {
            this.$emit("hidefooter", !0), this.fetchPage()
        },
        updated() {
            this.trackViewPoint()
        },
        mounted() {
            this.trackViewPoint()
        },
        watch: {
            $route: "fetchPage"
        },
        methods: {
            fetchPage() {
                if (this.$route.params && this.$route.params.url) {
                    this.pwdPagesState.current.url = this.$route.params.url;
                    let t = this;
                    pwdPages.actions.getCurrentPage(this.$route.params.url, function(e) {
                        e && e.Guid ? (t.currentPwdPage = e, t.$route.query.s && t.$route.query.i ? (t.lightbox.sectionGuid = t.$route.query.s, t.lightbox.itemGuid = t.$route.query.i, t.lightbox.template = "pb-sectionlightbox", "vertical" === t.$route.query.t && (t.lightbox.template = "pb-sectionlightboxvertical"), t.pwdPagesState.current.showLightbox = !0) : (t.lightbox.sectionGuid = "", t.lightbox.itemGuid = "", t.pwdPagesState.current.showLightbox = !1), t.$emit("hidemenu", e.HideMenu), t.siteState.HasFooter && t.$emit("hidefooter", !1)) : "not-logged-in" === e ? t.showLogin = !0 : "no-page" === e && (console.log("404"), t.$router.push({
                            path: "/404"
                        }))
                    })
                } else this.$router.push({
                    path: "/404"
                })
            },
            doLogin() {
                frontApi.pwdPageLogin(this.$route.params.url, this.password, this.name).then(t => {
                    "wrong-password" === t ? frontApp.alert("<div class='alertHeader'>" + this.trans.WrongPassword + "</div>") : t && t.Url === this.$route.params.url ? (pwdPages.state.pages.push(t), this.fetchPage(), frontApp.alert("<div class='alertHeader'>" + this.trans.Welcome + " " + this.name + "</div>"), this.showLogin = !1, this.siteState.HasFooter && this.$emit("hidefooter", !1)) : console.log(t)
                })
            },
            doLogout: function() {
                frontApi.pwdPageLogout(this.$route.params.url).then(t => {
                    window.location = "/"
                })
            },
            trackViewPoint: function() {
                utils.miscFront.trackViewPoint(".sectionWrapper")
            }
        },
        template: '<div class="pwdPageWrapper"><div class="routerViewWrapper" v-if="currentPwdPage && !showLogin"><div class="sectionWrapper mainContentMenuAdjusted PwdPageSections" v-for="section in currentPwdPage.Sections" :key="section.Guid"><component v-bind:is="section.View" v-bind:section="section"></component></div><component v-bind:is="lightbox.template" v-if="pwdPagesState.current.showLightbox" v-bind:section-guid="lightbox.sectionGuid" v-bind:item-guid="lightbox.itemGuid"></component></div><div class="pwdLogin commentPopup" v-if="showLogin"><div class="bg"></div><div class="cgContent"><h1 class="Header">{{$route.params.url}}</h1><div class="cgInputs Form"><div class="inputWrapper"><input type="text" v-model="name" placeholder=" "><label>{{trans.YourName}}</label></div><div class="inputWrapper"><input type="password" v-model="password" placeholder=" "><label>{{trans.Password}}</label></div><div class="Button" v-on:click="doLogin"><span>{{trans.Login}}</span></div></div></div></div><div class="pwdLogout" v-if="!showLogin"><span class="ficon-log-out" v-on:click="doLogout"></span></div></div>'
    }),
    productPage = Vue.component("product-page", {
        data: function() {
            return {
                productsState: products.state,
                site: site.state,
                lightbox: {
                    sectionGuid: "",
                    itemGuid: "",
                    template: ""
                },
                product: null
            }
        },
        created() {
            this.$emit("hidemenu", !1), this.$emit("hidefooter", !1), this.fetchProduct()
        },
        updated() {
            this.trackViewPoint()
        },
        mounted() {
            this.trackViewPoint()
        },
        watch: {
            $route: "fetchProduct"
        },
        methods: {
            fetchProduct() {
                this.$route.params && this.$route.params.url ? (this.product = products.actions.getCurrentProduct(this.$route.params.url), this.$route.query.s && this.$route.query.i ? (this.lightbox.sectionGuid = this.$route.query.s, this.lightbox.itemGuid = this.$route.query.i, this.lightbox.template = "pb-sectionlightbox", "vertical" === this.$route.query.t && (this.lightbox.template = "pb-sectionlightboxvertical"), this.productsState.current.showLightbox = !0) : (this.lightbox.sectionGuid = "", this.lightbox.itemGuid = "", this.productsState.current.showLightbox = !1), this.product || this.$router.push({
                    path: "404"
                })) : this.$router.push({
                    path: "404"
                })
            },
            trackViewPoint: function() {
                utils.miscFront.trackViewPoint(".routerViewWrapper")
            }
        },
        template: '<div class="routerViewWrapper"><div class="productPage"><component v-bind:is="product.View" v-bind:class="product.Settings[\'reverse-order\']" v-bind:product="product" v-bind:store="site.StoreSettings" class="pbEdit Product mainContentMenuAdjusted" data-type="Product" v-bind:id="product.Guid"></component></div><div class="sectionWrapper mainContentMenuAdjusted ProductSections" v-bind:data-guid="product.Guid" v-for="section in product.Sections" :key="section.Guid"><component v-bind:is="section.View" v-bind:section="section"></component></div><component v-bind:is="lightbox.template" v-if="productsState.current.showLightbox" v-bind:section-guid="lightbox.sectionGuid" v-bind:item-guid="lightbox.itemGuid"></component></div>'
    }),
    qrCodePage = Vue.component("qrcode-page", {
        data: function() {
            return {
                productsState: products.state,
                storeSettings: site.state.StoreSettings,
                siteState: site.state,
                trans: translations.state,
                qrCode: {},
                cartProducts: {
                    products: [],
                    bookings: [],
                    scheduling: []
                },
                items: {},
                bgColor: {
                    backgroundColor: "rgb(0,0,0,0.03)"
                }
            }
        },
        methods: {
            async fetchQrCode() {
                if (this.$route.params && this.$route.params.guid) {
                    const t = await frontApi.getQrCode(this.$route.params.guid);
                    if (!t) throw new Error("QR Code not found");
                    return t
                }
                this.$router.push({
                    path: "/404"
                })
            },
            generateQrCode() {
                this.$refs.qrcodeEl.innerHTML = "";
                const t = `https://${this.siteState._wwwPrefix}${this.siteState.Url}/qrcode/${this.$route.params.guid}?addtocart=1`;
                new QRCode(this.$refs.qrcodeEl, {
                    text: t,
                    width: 192,
                    height: 192
                })
            },
            addQrCode() {
                gui.state.dialogs.qrcodes.manage = !0
            },
            guidsToProducts(t) {
                if (!t && 0 === t.length) return;
                const e = [];
                return t.forEach(t => {
                    let n = null,
                        i = null,
                        o = t.Type;
                    if ("products" === o) {
                        if (!(n = this.items.products.find(e => e.Guid === t.PrimaryGuid))) return;
                        i = n.Variants.find(e => e.Guid === t.AlternativeGuid)
                    }
                    if ("bookings" === o) {
                        if (!(n = this.allItems.find(e => e.Guid === t.PrimaryGuid))) return;
                        i = n.Alternatives.find(e => e.Guid === t.AlternativeGuid)
                    }
                    if ("scheduling" === o) {
                        if (!(n = this.items.scheduling.find(e => e.Guid === t.PrimaryGuid))) return;
                        if (n.ProductType = "scheduling", !(i = this.items.personnels.find(e => e.Guid === t.AlternativeGuid))) return
                    }
                    e.push({
                        product: n,
                        alternative: i,
                        type: o
                    })
                }), e
            },
            productToTitle: function(t) {
                const {
                    type: e,
                    product: n,
                    alternative: i
                } = t;
                return n.Title
            },
            productToAlternative: function(t) {
                const {
                    type: e,
                    product: n,
                    alternative: i
                } = t;
                if (i) switch (e) {
                    case "products":
                    case "bookings":
                        return i.Title;
                    case "scheduling":
                        return i.Name
                }
            },
            productToImage(t) {
                const {
                    type: e,
                    product: n,
                    alternative: i
                } = t;
                switch (e) {
                    case "products":
                        if (n && n.Items && n.Items.length > 0) return n.Items[0].Content.Src;
                        break;
                    case "scheduling":
                        if (n && n.Image && n.Image.length > 0) return n.Image[0].src;
                        break;
                    case "bookings":
                        if (n && n.Items && n.Items.Src) return n.Items.Src
                }
                return ""
            },
            productToPrice(t) {
                const {
                    type: e,
                    product: n,
                    alternative: i
                } = t;
                return "scheduling" === e ? schedulingStore.actions.getPersonnelPrice(i, n) : i && i.Price ? i.Price : n.Price
            },
            constructSchedulingProduct: function(t) {
                const e = this.calculatePostDateTo(t.product.Duration);
                let n = {
                    fullDate: (i = new Date, `${i.getFullYear()}-${(i.getMonth()+1).toString().padStart(2,"0")}-${i.getDate().toString().padStart(2,"0")}`),
                    TimeFrom: this.timeToMinutes(e.from),
                    TimeTo: this.timeToMinutes(e.to)
                };
                var i;
                const o = ` ${n.fullDate} (${e.from} - ${e.to})`,
                    s = t.product.Image && t.product.Image.length > 0 ? t.product.Image[0].src : "",
                    r = schedulingStore.actions.getPersonnelPrice(t.alternative);
                return {
                    ProductType: "scheduling",
                    Guid: utils.miscFront.generateGuid(),
                    Scheduling: {
                        TimeFrom: n.TimeFrom,
                        TimeTo: n.TimeTo,
                        Date: n.fullDate,
                        ServiceGuid: t.product.Guid,
                        PersonnelGuid: t.alternative.Guid
                    },
                    CartGuid: t.product.Guid,
                    Title: t.product.Title + o,
                    Url: "",
                    Price: r,
                    Src: s,
                    ExcludeTax: !(!t.product.ExcludeTax || 1 !== t.product.ExcludeTax),
                    Weight: 0,
                    IsPhysical: 0,
                    Quantity: 1,
                    TrackInventory: 0,
                    Inventory: null,
                    VariantGuid: t.product.Guid + t.alternative.Guid,
                    VariantTitle: t.alternative.Name
                }
            },
            calculatePostDateTo: function(t) {
                const e = new Date,
                    n = 60 * t * 1e3,
                    i = new Date(e),
                    o = new Date(i.getTime() - n);
                return o.setSeconds(0), i.setSeconds(0), {
                    from: o.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    to: i.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }
            },
            timeToMinutes: function(t) {
                let e = t.endsWith("PM"),
                    [n, i] = t.split(/[:\s]/).map(Number);
                return (e && 12 !== n || !e && 12 === n) && (n = (n + 12) % 24), 60 * n + i
            },
            minutesToTime: function(t) {
                const e = Math.floor(t / 60),
                    n = t % 60,
                    i = new Date;
                return i.setHours(e), i.setMinutes(n), i.toLocaleTimeString(navigator.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: "en-US" === navigator.language
                })
            },
            addProductsToCart(t) {
                t && 0 !== t.length && (checkoutStore.actions.clearCart(), t.forEach(t => {
                    if ("bookings" === t.type) checkoutStore.actions.addBookingToCart(t.product, t.alternative);
                    else if ("scheduling" === t.type) {
                        schedulingStore.state.front.selectedService = t.product, schedulingStore.state.front.selectedPersonnel = t.alternative;
                        let e = this.constructSchedulingProduct(t);
                        checkoutStore.actions.addToCart(e)
                    } else "products" === t.type && checkoutStore.actions.addToCart(t.product, t.alternative)
                }), checkoutStore.state.showCheckout = !0)
            },
            applyColors() {
                site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && (this.bgColor = {
                    "background-color": site.state.GlobalClasses.Page["background-color"]
                }, site.state.GlobalClasses.Page.color ? this.bgColor.backgroundColor = utils.miscFront.convertToRGBA(site.state.GlobalClasses.Page.color, .03) : this.bgColor.backgroundColor = utils.miscFront.convertToRGBA("#000000", .03))
            },
            doPrintQrCode() {
                if (site.state.Url && 2 === site.state.IsPublished) {
                    let t = window.open("https://" + this.siteState._wwwPrefix + this.siteState.Url + "/qrcode/" + this.qrCode.Guid + "?toprint=1", "_blank", "height=1200,width=1200");
                    t.focus(), t.print()
                } else frontApp.alert("You need to publish your site to view it in print mode.")
            },
            reload() {
                this.qrCode = qrCodesStore.state.items.qrcodes.find(t => t.Guid === this.$route.params.guid), this.cartProducts = this.guidsToProducts(this.qrCode.Products), this.generateQrCode()
            }
        },
        watch: {
            $route: "reload",
            "qrCode.Products": {
                deep: !0,
                handler() {
                    this.qrCode && (this.cartProducts = this.guidsToProducts(this.qrCode.Products))
                }
            }
        },
        computed: {
            allItems: function() {
                let t = [];
                for (let e in this.items) t = t.concat(this.items[e]);
                return t
            }
        },
        created: async function() {
            this.$emit("hidemenu", !1), this.$emit("hidefooter", !1), await schedulingStore.actions.init(), await bookingStore.actions.initAndGetBookings(), await qrCodesStore.actions.init(), this.items = {
                products: products.state.products,
                scheduling: schedulingStore.state.items.services,
                personnels: schedulingStore.state.items.personnels,
                bookings: bookingStore.state.bookings
            }, this.qrCode = qrCodesStore.state.items.qrcodes.find(t => t.Guid === this.$route.params.guid), this.qrCode && (this.cartProducts = this.guidsToProducts(this.qrCode.Products), this.$route.query && 1 == this.$route.query.addtocart && this.addProductsToCart(this.cartProducts))
        },
        mounted() {
            this.applyColors(), qrCodesStore.actions.loadScript(() => {
                this.generateQrCode()
            })
        },
        template: '\n\t\t<div class=\'QrCode pbEdit\' data-type="QrCode" v-bind:id="qrCode.Guid">\n\t\t\n\t\t\t<h1 class=\'Header\'>{{qrCode.Title}}</h1>\n\t\t\t\n\t\t\t<div class=\'QrCodeImageWrapper\' v-bind:style=\'bgColor\'>\n\t\t\t\t<div id="qrcode" ref="qrcodeEl"></div>\n\t\t\t</div>\n\t\t\n\t\t\t<div class="productsWrapper" v-if="qrCode && cartProducts && cartProducts.length > 0">\n\t\t\t\t<article v-for="product in cartProducts" :key="product.Guid">\n\t\t\t\t\t<div class="one">\n\t\t\t\t\t\t<span class="imageWrapper">\n\t\t\t\t\t\t\t<img :src="productToImage(product)" v-if="productToImage(product)">\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class="titleWrapper">\n\t\t\t\t\t\t\t<span class="title">{{productToTitle(product)}}</span>\n\t\t\t\t\t\t\t<span class="variation">{{productToAlternative(product)}}</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="two nrAndPriceWrapper">\n\t\t\t\t\t\t<span class="price">{{productToPrice(product) | round(storeSettings.Currency)}} {{storeSettings.Currency}}</span>\n\t\t\t\t\t</div>\n\t\t\t\t</article>\n\t\t\t</div>\n\t\t</div>\n\t'
    }),
    invoicePage = Vue.component("invoice-page", {
        data: function() {
            return {
                siteState: site.state,
                trans: translations.state,
                invoice: {},
                paymentMethod: "",
                printInvoice: !1,
                siteUrl: site.state.Url,
                invoiceUrl: ""
            }
        },
        methods: {
            async fetchInvoice() {
                this.$route.params && this.$route.params.guid ? (this.invoice = await invoiceStore.actions.initAndGetInvoiceFront(this.$route.params.guid), this.invoice || this.$router.push({
                    path: "/404"
                })) : this.$router.push({
                    path: "/404"
                })
            },
            doPrintInvoice() {
                if (site.state.Url && 2 === site.state.IsPublished) {
                    let t = window.open("https://" + this.siteState._wwwPrefix + this.invoiceUrl + "?toprint=1", "_blank", "height=1200,width=1200");
                    t.focus(), t.print()
                } else frontApp.alert("You need to publish your site to view it in print mode.")
            }
        },
        computed: {
            netPrice() {
                let t = 0;
                if (this.invoice && this.invoice.Products && this.invoice.Products.length > 0) {
                    for (let e = 0; e < this.invoice.Products.length; e++) t += (this.invoice.Products[e].Price - this.invoice.Products[e].Discount) * this.invoice.Products[e].Quantity;
                    return t + " " + this.invoice.Currency
                }
            },
            vat() {
                let t = 0;
                if (this.invoice && this.invoice.Products && this.invoice.Products.length > 0) {
                    for (let e = 0; e < this.invoice.Products.length; e++) t += (this.invoice.Products[e].Price - this.invoice.Products[e].Discount) * this.invoice.Products[e].Quantity * (this.invoice.Products[e].VAT / 100);
                    return t + " " + this.invoice.Currency
                }
            },
            totalPrice() {
                let t = 0;
                if (this.invoice && this.invoice.Products && this.invoice.Products.length > 0) {
                    for (let e = 0; e < this.invoice.Products.length; e++) t += (this.invoice.Products[e].Price - this.invoice.Products[e].Discount) * this.invoice.Products[e].Quantity * (1 + this.invoice.Products[e].VAT / 100);
                    return t + " " + this.invoice.Currency
                }
            },
            invoiceWarning() {
                return this.invoice && !this.invoice.InvoiceStatus ? translations.state.InvoiceEditMode : this.invoice && 2 == this.invoice.InvoiceStatus ? translations.state.InvoiceAlreadyPaid : this.invoice && this.invoice.InvoiceStatus >= 3 ? translations.state.InvoiceIsCanceled : ""
            }
        },
        watch: {
            $route: "fetchInvoice"
        },
        created: async function() {
            this.$route.query ? this.$route.query && 1 == this.$route.query.toprint && (this.$emit("hidemenu", !0), this.$emit("hidefooter", !0), this.printInvoice = !0) : (this.$emit("hidemenu", !1), this.$emit("hidefooter", !1)), await this.fetchInvoice(), this.siteUrl ? this.invoiceUrl = this.siteUrl + "/invoice/" + this.invoice.Guid : this.invoiceUrl = "", this.invoice && this.invoice.EnableStripe ? this.paymentMethod = "Stripe" : this.invoice && !this.invoice.EnableStripe && this.invoice.EnablePayPal ? this.paymentMethod = "PayPal" : this.paymentMethod = ""
        },
        template: '\n\t\t<div class="invoicePage Invoice pbEdit" v-bind:class="{\'print\' : printInvoice}" v-bind:id="invoice.Guid" data-type="Invoice">\n\t\t\t<div v-if="invoice.InvoiceStatus != 1" class="editWarning"><h3>{{invoiceWarning}}</h3></div>\n\t\t\t<div class="invoiceWrapper">\n\t\t\t\t<div class="infoWrapper marginBottom">\n\t\t\t\t\t<div class="left">\n\t\t\t\t\t\t<h1>{{trans.Invoice}}</h1>\n\t\t\t\t\t\t<p>{{invoice.InvoiceDate}}</p>\n\t\t\t\t\t\t<p># {{invoice.SequentialId}}</p>\n\t\t\t\t\t\t<p>Id: {{invoice.Guid}}</p>\n\t\t\t\t\t\t<span class="ficon-printer printIcon" @click="doPrintInvoice"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div v-if="invoice.OwnerLogo && invoice.OwnerLogo.Src" class="right">\n\t\t\t\t\t\t<figure><img :src="invoice.OwnerLogo.Src | thumb(\'w400\', invoice.OwnerLogo.Source)"></figure>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="infoWrapper">\n\t\t\t\t\t<div class="left">\n\t\t\t\t\t\t<h2>{{trans.FromWord}}</h2>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="invoice.OwnerCompanyName">{{invoice.OwnerCompanyName}}</p>\n\t\t\t\t\t\t\t<p v-if="invoice.OwnerOrganisationNumber">{{invoice.OwnerOrganisationNumber}}</p>\n\t\t\t\t\t\t\t<p><span v-if="invoice.OwnerPhone">{{invoice.OwnerPhone}} / </span> <span v-if="invoice.OwnerEmail">{{invoice.OwnerEmail}}</span></p>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="invoice.OwnerStreet">{{invoice.OwnerStreet}}</p>\n\t\t\t\t\t\t\t<p><span v-if="invoice.OwnerZip">{{invoice.OwnerZip}}, </span><span v-if="invoice.OwnerCity">{{invoice.OwnerCity}}</span></p>\n\t\t\t\t\t\t\t<p><span v-if="invoice.OwnerState">{{invoice.OwnerState}}, </span><span v-if="invoice.OwnerCountry">{{invoice.OwnerCountry}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article v-if="invoice.OwnerAdditionalInfo">\n\t\t\t\t\t\t\t<p v-html="invoice.OwnerAdditionalInfo"></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="right">\n\t\t\t\t\t\t<h2>{{trans.ToWord}}</h2>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="invoice.CustomerName">{{invoice.CustomerName}}</p>\n\t\t\t\t\t\t\t<p v-if="invoice.CustomerOrganisationNumber">{{invoice.CustomerOrganisationNumber}}</p>\n\t\t\t\t\t\t\t<p><span v-if="invoice.CustomerPhone">{{invoice.CustomerPhone}} / </span><span v-if="invoice.CustomerEmail">{{invoice.CustomerEmail}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="invoice.CustomerStreet">{{invoice.CustomerStreet}}</p>\n\t\t\t\t\t\t\t<p><span v-if="invoice.CustomerCity">{{invoice.CustomerCity}}, </span><span v-if="invoice.CustomerZip">{{invoice.CustomerZip}}</span></p>\n\t\t\t\t\t\t\t<p><span v-if="invoice.CustomerState">{{invoice.CustomerState}}, </span><span v-if="invoice.CustomerCountry">{{invoice.CustomerCountry}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article v-if="invoice.CustomerAdditionalInfo">\n\t\t\t\t\t\t\t<p v-html="invoice.CustomerAdditionalInfo"></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="productsWrapper">\n\t\t\t\t\t<div class="productHead">\n\t\t\t\t\t\t<span class="emptyTitleHead"></span>\n\t\t\t\t\t\t<span class="unitPriceHead"><strong>{{ trans.Price }}</strong>/{{trans.Unit}}</span>\n\t\t\t\t\t\t<span class="discountHead"><strong>{{ trans.Discount }}</strong>/{{trans.Unit}}</span>\n\t\t\t\t\t\t<span class="quantityHead"><strong>{{ trans.Quantity }}</strong></span>\n\t\t\t\t\t\t<span class="netPriceHead"><strong>{{ trans.NetPrice }}</strong></span>\n\t\t\t\t\t\t<span class="vatHead"><strong>{{ trans.VAT }}</strong></span>\n\t\t\t\t\t\t<span class="totalPriceHead"><strong>{{ trans.Price }}</strong></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="productsList">\n\t\t\t\t\t\t<article class="product" v-for="product in invoice.Products" :key="product.Guid" :id="product.Guid">\n\t\t\t\t\t\t\t<label class="titleWrapper">\n\t\t\t\t\t\t\t\t<span class="title">{{ product.Title }}</span>\n\t\t\t\t\t\t\t\t<span class="variantTitle">{{ product.VariationTitle }}</span>\n\t\t\t\t\t\t\t\t<span v-html="product.Description"></span>\n\t\t\t\t\t\t\t\t<span class="id"><strong>Id:</strong> {{ product.Id }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="unitPrice">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Price }}</strong>/{{trans.Unit}}: </span>\n\t\t\t\t\t\t\t\t<span>{{ product.Price }} {{ invoice.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="discount">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Discount }}</strong>/{{trans.Unit}}: </span>\n\t\t\t\t\t\t\t\t<span>-{{ product.Discount }} {{ invoice.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="quantity">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Quantity }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ product.Quantity }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="netPrice">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.NetPrice }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ (product.Price - product.Discount) * product.Quantity }} {{ invoice.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="vat">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.VAT }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ product.VAT }} %</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="totalPrice">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Price }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ (product.Price - product.Discount) * product.Quantity * (1 + (product.VAT / 100)) }} {{ invoice.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="totalWrapper">\n\t\t\t\t\t\t<div class="netPriceWrapper">\n\t\t\t\t\t\t\t<p>{{trans.NetPrice}}</p>\n\t\t\t\t\t\t\t<p>{{netPrice}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="vatWrapper">\n\t\t\t\t\t\t\t<p>{{trans.VAT}}</p>\n\t\t\t\t\t\t\t<p>{{vat}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="totalPriceWrapper">\n\t\t\t\t\t\t\t<p>{{trans.Total}}</p>\n\t\t\t\t\t\t\t<p>{{totalPrice}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="paymentWrapper">\n\t\t\t\t\t\t<h2>{{trans.Payment}}</h2>\n\t\t\t\t\t\t<div class="paymentInstructionsWrapper">\n\t\t\t\t\t\t\t<div class="paymentInstructions left">\n\t\t\t\t\t\t\t\t<span><strong>{{trans.PaymentTerms}}</strong>: {{invoice.Timeframe}} {{trans.Days}}</span>\n\t\t\t\t\t\t\t\t<span v-html="invoice.PaymentInstructions"></span>\n\t\t\t\t\t\t\t</div>\n\x3c!--\t\t\t\t\t\t\t<div v-if="!printInvoice && invoice.InvoiceStatus == 1 && (invoice.EnableStripe || invoice.EnablePayPal)" class="paymentOptions right">--\x3e\n\x3c!--\t\t\t\t\t\t\t\t<h2>{{trans.PayNow}}</h2>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t<div v-if="invoice.EnableStripe" class="paymentOption" v-bind:class="{selected : paymentMethod === \'Stripe\' }" v-on:click="paymentMethod = \'Stripe\'">--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t<div class="fakeCheckBox" ><span class="ficon-check checkIcon"></span></div>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t<span class="paymentOptionTitle">--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t\t<span>{{ trans.WithCard }}</span>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t\t<span class="ficon-credit-card"></span>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t</span>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t</div>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t<div v-if="invoice.EnablePayPal" class="paymentOption" v-bind:class="{selected : paymentMethod === \'PayPal\' }" v-on:click="paymentMethod = \'PayPal\'">--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t<div class="fakeCheckBox"><span class="ficon-check checkIcon"></span></div>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t<span class="paymentOptionTitle">--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t\t<span>{{ trans.WithPayPal }}</span>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t\t<span class="ficon-paypal"></span>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t\t</span>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t</div>--\x3e\n\x3c!--\t\t\t\t\t\t\t\t<div class="Button" v-on:click="openPaymentWindow"><span>{{ trans.PayNow }}</span></div>--\x3e\n\x3c!--\t\t\t\t\t\t\t</div>--\x3e\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\t\t\n\t'
    }),
    quotePage = Vue.component("quote-page", {
        data: function() {
            return {
                siteState: site.state,
                trans: translations.state,
                quote: {},
                paymentMethod: "",
                printQuote: !1,
                siteUrl: site.state.Url,
                quoteUrl: "",
                quoteAcceptConfirmation: !1,
                acceptedBy: "",
                confirmedBy: ""
            }
        },
        methods: {
            async fetchQuote() {
                this.$route.params && this.$route.params.guid ? (this.quote = await quoteStore.actions.initAndGetQuoteFront(this.$route.params.guid), this.quote || this.$router.push({
                    path: "/404"
                })) : this.$router.push({
                    path: "/404"
                })
            },
            doPrintQuote() {
                if (site.state.Url && 2 === site.state.IsPublished) {
                    let t = window.open("https://" + this.siteState._wwwPrefix + this.quoteUrl + "?toprint=1", "_blank", "height=1200,width=1200");
                    t.focus(), t.print()
                } else frontApp.alert("You need to publish your site to view it in print mode.")
            },
            submitAcceptQuote() {
                this.quoteAcceptConfirmation ? this.acceptedBy ? this.confirmedBy && utils.miscFront.validateEmail(this.confirmedBy) ? frontApi.acceptQuote(this.quote.Guid, this.acceptedBy, this.confirmedBy).then(t => {
                    frontApp.alert("Confrimation email has been sent to " + this.confirmedBy + ". Check your inbox to confirm the quote."), this.$router.push({
                        path: "/quote/" + this.quote.Guid
                    })
                }) : frontApp.alert("You need to enter a valid email to continue.") : frontApp.alert("You need to enter your name to continue.") : frontApp.alert("You need to accept the quote to continue.")
            },
            acceptQuote(t, e, n, i) {
                t && e && n && i && this.quote.Guid === t ? this.quote.QuoteStatus > 1 ? frontApp.alert("This quote has already been accepted.") : i < Math.floor(Date.now() / 1e3) - 86400 ? frontApp.alert("This confirmation link has expired. Please request a new one.") : frontApi.acceptQuoteValidate(t, e, n, i).then(t => {
                    "ok" == t ? frontApp.alert("Quote accepted.") : frontApp.alert("Something went wrong. Please try again.")
                }) : frontApp.alert("Something went wrong. Please try again.")
            }
        },
        computed: {
            netPrice() {
                let t = 0;
                if (this.quote && this.quote.Products && this.quote.Products.length > 0) {
                    for (let e = 0; e < this.quote.Products.length; e++) t += (this.quote.Products[e].Price - this.quote.Products[e].Discount) * this.quote.Products[e].Quantity;
                    return t + " " + this.quote.Currency
                }
            },
            vat() {
                let t = 0;
                if (this.quote && this.quote.Products && this.quote.Products.length > 0) {
                    for (let e = 0; e < this.quote.Products.length; e++) t += (this.quote.Products[e].Price - this.quote.Products[e].Discount) * this.quote.Products[e].Quantity * (this.quote.Products[e].VAT / 100);
                    return t + " " + this.quote.Currency
                }
            },
            totalPrice() {
                let t = 0;
                if (this.quote && this.quote.Products && this.quote.Products.length > 0) {
                    for (let e = 0; e < this.quote.Products.length; e++) t += (this.quote.Products[e].Price - this.quote.Products[e].Discount) * this.quote.Products[e].Quantity * (1 + this.quote.Products[e].VAT / 100);
                    return t + " " + this.quote.Currency
                }
            },
            quoteWarning() {
                return this.quote && !this.quote.QuoteStatus ? this.trans.QuoteEditMode : this.quote && 2 == this.quote.QuoteStatus ? this.trans.QuoteAlreadyAccepted : this.quote && this.quote.QuoteStatus >= 3 ? this.trans.QuoteIsCanceled : ""
            }
        },
        watch: {
            $route: "fetchQuote"
        },
        created: async function() {
            await this.fetchQuote(), this.$route.query ? this.$route.query && 1 == this.$route.query.toprint ? (this.$emit("hidemenu", !0), this.$emit("hidefooter", !0), this.printQuote = !0) : this.quote && this.$route.query && this.$route.query.hash && this.$route.query.email && this.$route.query.timestamp && this.acceptQuote(this.$route.params.guid, this.$route.query.hash, this.$route.query.email, this.$route.query.timestamp) : (this.$emit("hidemenu", !1), this.$emit("hidefooter", !1)), this.siteUrl ? this.quoteUrl = this.siteUrl + "/quote/" + this.quote.Guid : this.quoteUrl = ""
        },
        template: '\n\t\t<div class="quotePage Quote pbEdit" v-bind:class="{\'print\' : printQuote}" v-bind:id="quote.Guid" data-type="Quote">\n\t\t\t<div v-if="quote.QuoteStatus != 1" class="editWarning"><h3>{{quoteWarning}}</h3></div>\n\t\t\t<div class="quoteWrapper">\n\t\t\t\t<div class="infoWrapper marginBottom">\n\t\t\t\t\t<div class="left">\n\t\t\t\t\t\t<h1>{{trans.Quote}}</h1>\n\t\t\t\t\t\t<p>{{quote.QuoteDate}}</p>\n\t\t\t\t\t\t<p>Id: {{quote.Guid}}</p>\n\t\t\t\t\t\t<span class="ficon-printer printIcon" @click="doPrintQuote"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div v-if="quote.OwnerLogo && quote.OwnerLogo.Src" class="right">\n\t\t\t\t\t\t<figure><img :src="quote.OwnerLogo.Src | thumb(\'w400\', quote.OwnerLogo.Source)"></figure>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="infoWrapper">\n\t\t\t\t\t<div class="left">\n\t\t\t\t\t\t<h2>{{trans.FromWord}}</h2>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="quote.OwnerCompanyName">{{quote.OwnerCompanyName}}</p>\n\t\t\t\t\t\t\t<p v-if="quote.OwnerOrganisationNumber">{{quote.OwnerOrganisationNumber}}</p>\n\t\t\t\t\t\t\t<p><span v-if="quote.OwnerPhone">{{quote.OwnerPhone}} / </span> <span v-if="quote.OwnerEmail">{{quote.OwnerEmail}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="quote.OwnerStreet">{{quote.OwnerStreet}}</p>\n\t\t\t\t\t\t\t<p><span v-if="quote.OwnerZip">{{quote.OwnerZip}}, </span><span v-if="quote.OwnerCity">{{quote.OwnerCity}}</span></p>\n\t\t\t\t\t\t\t<p><span v-if="quote.OwnerState">{{quote.OwnerState}}, </span><span v-if="quote.OwnerCountry">{{quote.OwnerCountry}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article v-if="quote.OwnerAdditionalInfo">\n\t\t\t\t\t\t\t<p v-html="quote.OwnerAdditionalInfo"></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="right">\n\t\t\t\t\t\t<h2>{{trans.ToWord}}</h2>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="quote.CustomerName">{{quote.CustomerName}}</p>\n\t\t\t\t\t\t\t<p v-if="quote.CustomerOrganisationNumber">{{quote.CustomerOrganisationNumber}}</p>\n\t\t\t\t\t\t\t<p><span v-if="quote.CustomerPhone">{{quote.CustomerPhone}} / </span><span v-if="quote.CustomerEmail">{{quote.CustomerEmail}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article>\n\t\t\t\t\t\t\t<p v-if="quote.CustomerStreet">{{quote.CustomerStreet}}</p>\n\t\t\t\t\t\t\t<p><span v-if="quote.CustomerCity">{{quote.CustomerCity}}, </span><span v-if="quote.CustomerZip">{{quote.CustomerZip}}</span></p>\n\t\t\t\t\t\t\t<p><span v-if="quote.CustomerState">{{quote.CustomerState}}, </span><span v-if="quote.CustomerCountry">{{quote.CustomerCountry}}</span></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t\t<article v-if="quote.CustomerAdditionalInfo">\n\t\t\t\t\t\t\t<p v-html="quote.CustomerAdditionalInfo"></p>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="descriptionWrapper">\n\t\t\t\t\t<div v-if="quote.Description" class="bottom">\n\t\t\t\t\t\t<p v-html="quote.Description"></p>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="productsWrapper">\n\t\t\t\t\t<div class="productHead">\n\t\t\t\t\t\t<span class="emptyTitleHead"></span>\n\t\t\t\t\t\t<span class="unitPriceHead"><strong>{{ trans.Price }}</strong>/{{trans.Unit}}</span>\n\t\t\t\t\t\t<span class="discountHead"><strong>{{ trans.Discount }}</strong>/{{trans.Unit}}</span>\n\t\t\t\t\t\t<span class="quantityHead"><strong>{{ trans.Quantity }}</strong></span>\n\t\t\t\t\t\t<span class="netPriceHead"><strong>{{ trans.NetPrice }}</strong></span>\n\t\t\t\t\t\t<span class="vatHead"><strong>{{ trans.VAT }}</strong></span>\n\t\t\t\t\t\t<span class="totalPriceHead"><strong>{{ trans.Price }}</strong></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="productsList">\n\t\t\t\t\t\t<article class="product" v-for="product in quote.Products" :key="product.Guid" :id="product.Guid">\n\t\t\t\t\t\t\t<label class="titleWrapper">\n\t\t\t\t\t\t\t\t<span class="title">{{ product.Title }}</span>\n\t\t\t\t\t\t\t\t<span class="variantTitle">{{ product.VariationTitle }}</span>\n\t\t\t\t\t\t\t\t<span v-html="product.Description"></span>\n\t\t\t\t\t\t\t\t<span class="id"><strong>Id:</strong> {{ product.Id }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="unitPrice">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Price }}</strong>/{{trans.Unit}}: </span>\n\t\t\t\t\t\t\t\t<span>{{ product.Price }} {{ quote.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="discount">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Discount }}</strong>/{{trans.Unit}}: </span>\n\t\t\t\t\t\t\t\t<span>-{{ product.Discount }} {{ quote.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="quantity">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Quantity }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ product.Quantity }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="netPrice">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.NetPrice }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ (product.Price - product.Discount) * product.Quantity }} {{ quote.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="vat">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.VAT }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ product.VAT }} %</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label class="totalPrice">\n\t\t\t\t\t\t\t\t<span class="unitPriceHead mobile"><strong>{{ trans.Price }}:</strong> </span>\n\t\t\t\t\t\t\t\t<span>{{ (product.Price - product.Discount) * product.Quantity * (1 + (product.VAT / 100)) }} {{ quote.Currency }}</span>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</article>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="totalWrapper">\n\t\t\t\t\t\t<div class="netPriceWrapper">\n\t\t\t\t\t\t\t<p>{{trans.NetPrice}}</p>\n\t\t\t\t\t\t\t<p>{{netPrice}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="vatWrapper">\n\t\t\t\t\t\t\t<p>{{trans.VAT}}</p>\n\t\t\t\t\t\t\t<p>{{vat}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="totalPriceWrapper">\n\t\t\t\t\t\t\t<p>{{trans.Total}}</p>\n\t\t\t\t\t\t\t<p>{{totalPrice}}</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="paymentWrapper">\n\t\t\t\t\t\t<div class="paymentInstructionsWrapper">\n\t\t\t\t\t\t\t<div class="paymentInstructions">\n\t\t\t\t\t\t\t\t<h2>{{trans.Payment}}</h2>\n\t\t\t\t\t\t\t\t<span><strong>{{trans.PaymentTerms}}</strong>: {{quote.Timeframe}} {{trans.Days}}</span>\n\t\t\t\t\t\t\t\t<p v-html="quote.PaymentInstructions"></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="termsAndConditions">\n\t\t\t\t\t\t\t\t<h2>{{trans.TermsAndConditions}}</h2>\n\t\t\t\t\t\t\t\t<p v-html="quote.TermsAndConditions"></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div v-if="quote.QuoteStatus == 1 && !printQuote" class="acceptQuoteWrapper">\n\t\t\t\t\t\t\t<h2>{{trans.Accept}}</h2>\n\t\t\t\t\t\t\t<div class="acceptQuote">\n\t\t\t\t\t\t\t\t<div class="formWrapper">\n\t\t\t\t\t\t\t\t\t<div class="inputW">\n\t\t\t\t\t\t\t\t\t\t<input placeholder=" " type="text" v-model="acceptedBy">\n\t\t\t\t\t\t\t\t\t\t<label>{{ trans.YourName }}</label>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="inputW">\n\t\t\t\t\t\t\t\t\t\t<input placeholder=" " type="email" v-model="confirmedBy">\n\t\t\t\t\t\t\t\t\t\t<label>{{ trans.YourEmail }}</label>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="quoteAcceptConfirmation" v-bind:class="{selected : quoteAcceptConfirmation == true }" v-on:click="quoteAcceptConfirmation = true">\n\t\t\t\t\t\t\t\t\t\t<div class="fakeCheckBox" ><span class="ficon-check checkIcon"></span></div>\n\t\t\t\t\t\t\t\t\t\t<span class="quoteAcceptConfirmationTitle">\n\t\t\t\t\t\t\t\t\t\t\t<span>{{ trans.IAcceptQuote }}</span>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="Button" v-on:click="submitAcceptQuote"><span>{{ trans.Submit }}</span></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\t\t\n\t'
    });
var resource;
Vue.component("global-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.GlobalStyleSheet
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.GlobalStyleSheet)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("global-styles-mobile", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.GlobalStyleSheetMobile
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.GlobalStyleSheetMobile)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("child-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.ChildClassesStyleSheet
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.ChildClassesStyleSheet)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("mobile-css-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.MobileStyleSheet
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.MobileStyleSheet)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("customcss-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.CustomCss
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.CustomCss)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("link-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                console.log("link styles updated"), this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.GlobalLinksStyleSheet
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.GlobalLinksStyleSheet)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("child-link-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.innerHTML = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.ChildLinksStyleSheet
        },
        created: function() {
            this.style = document.createElement("style"), this.style.type = "text/css", this.style.appendChild(document.createTextNode(site.state.ChildLinksStyleSheet)), document.head.appendChild(this.style)
        },
        render: function() {}
    }), Vue.component("google-fonts-styles", {
        data: function() {
            return {
                style: null
            }
        },
        watch: {
            localStyleSheet(t) {
                this.style.href = t
            }
        },
        computed: {
            localStyleSheet: () => site.state.GoogleFontsHref
        },
        created: function() {
            this.style = document.createElement("link"), this.style.type = "text/css", this.style.rel = "stylesheet", this.style.href = site.state.GoogleFontsHref, document.head.appendChild(this.style)
        },
        render: function() {}
    }), (resource = resource || {}).countries = [{
        Name: "Afghanistan",
        Code: "AF"
    }, {
        Name: "Åland Islands",
        Code: "AX"
    }, {
        Name: "Albania",
        Code: "AL"
    }, {
        Name: "Algeria",
        Code: "DZ"
    }, {
        Name: "American Samoa",
        Code: "AS"
    }, {
        Name: "Andorra",
        Code: "AD"
    }, {
        Name: "Angola",
        Code: "AO"
    }, {
        Name: "Anguilla",
        Code: "AI"
    }, {
        Name: "Antarctica",
        Code: "AQ"
    }, {
        Name: "Antigua and Barbuda",
        Code: "AG"
    }, {
        Name: "Argentina",
        Code: "AR"
    }, {
        Name: "Armenia",
        Code: "AM"
    }, {
        Name: "Aruba",
        Code: "AW"
    }, {
        Name: "Australia",
        Code: "AU"
    }, {
        Name: "Austria",
        Code: "AT"
    }, {
        Name: "Azerbaijan",
        Code: "AZ"
    }, {
        Name: "Bahamas",
        Code: "BS"
    }, {
        Name: "Bahrain",
        Code: "BH"
    }, {
        Name: "Bangladesh",
        Code: "BD"
    }, {
        Name: "Barbados",
        Code: "BB"
    }, {
        Name: "Belarus",
        Code: "BY"
    }, {
        Name: "Belgium",
        Code: "BE"
    }, {
        Name: "Belize",
        Code: "BZ"
    }, {
        Name: "Benin",
        Code: "BJ"
    }, {
        Name: "Bermuda",
        Code: "BM"
    }, {
        Name: "Bhutan",
        Code: "BT"
    }, {
        Name: "Bolivia",
        Code: "BO"
    }, {
        Name: "Bosnia and Herzegovina",
        Code: "BA"
    }, {
        Name: "Botswana",
        Code: "BW"
    }, {
        Name: "Bouvet Island",
        Code: "BV"
    }, {
        Name: "Brazil",
        Code: "BR"
    }, {
        Name: "British Indian Ocean Territory",
        Code: "IO"
    }, {
        Name: "Brunei Darussalam",
        Code: "BN"
    }, {
        Name: "Bulgaria",
        Code: "BG"
    }, {
        Name: "Burkina Faso",
        Code: "BF"
    }, {
        Name: "Burundi",
        Code: "BI"
    }, {
        Name: "Cambodia",
        Code: "KH"
    }, {
        Name: "Cameroon",
        Code: "CM"
    }, {
        Name: "Canada",
        Code: "CA"
    }, {
        Name: "Cape Verde",
        Code: "CV"
    }, {
        Name: "Cayman Islands",
        Code: "KY"
    }, {
        Name: "Central African Republic",
        Code: "CF"
    }, {
        Name: "Chad",
        Code: "TD"
    }, {
        Name: "Chile",
        Code: "CL"
    }, {
        Name: "China",
        Code: "CN"
    }, {
        Name: "Christmas Island",
        Code: "CX"
    }, {
        Name: "Cocos (Keeling) Islands",
        Code: "CC"
    }, {
        Name: "Colombia",
        Code: "CO"
    }, {
        Name: "Comoros",
        Code: "KM"
    }, {
        Name: "Congo",
        Code: "CG"
    }, {
        Name: "Congo, The Democratic Republic of the",
        Code: "CD"
    }, {
        Name: "Cook Islands",
        Code: "CK"
    }, {
        Name: "Costa Rica",
        Code: "CR"
    }, {
        Name: "Cote D'Ivoire",
        Code: "CI"
    }, {
        Name: "Croatia",
        Code: "HR"
    }, {
        Name: "Cuba",
        Code: "CU"
    }, {
        Name: "Cyprus",
        Code: "CY"
    }, {
        Name: "Czech Republic",
        Code: "CZ"
    }, {
        Name: "Denmark",
        Code: "DK"
    }, {
        Name: "Djibouti",
        Code: "DJ"
    }, {
        Name: "Dominica",
        Code: "DM"
    }, {
        Name: "Dominican Republic",
        Code: "DO"
    }, {
        Name: "Ecuador",
        Code: "EC"
    }, {
        Name: "Egypt",
        Code: "EG"
    }, {
        Name: "El Salvador",
        Code: "SV"
    }, {
        Name: "Equatorial Guinea",
        Code: "GQ"
    }, {
        Name: "Eritrea",
        Code: "ER"
    }, {
        Name: "Estonia",
        Code: "EE"
    }, {
        Name: "Ethiopia",
        Code: "ET"
    }, {
        Name: "Falkland Islands (Malvinas)",
        Code: "FK"
    }, {
        Name: "Faroe Islands",
        Code: "FO"
    }, {
        Name: "Fiji",
        Code: "FJ"
    }, {
        Name: "Finland",
        Code: "FI"
    }, {
        Name: "France",
        Code: "FR"
    }, {
        Name: "French Guiana",
        Code: "GF"
    }, {
        Name: "French Polynesia",
        Code: "PF"
    }, {
        Name: "French Southern Territories",
        Code: "TF"
    }, {
        Name: "Gabon",
        Code: "GA"
    }, {
        Name: "Gambia",
        Code: "GM"
    }, {
        Name: "Georgia",
        Code: "GE"
    }, {
        Name: "Germany",
        Code: "DE"
    }, {
        Name: "Ghana",
        Code: "GH"
    }, {
        Name: "Gibraltar",
        Code: "GI"
    }, {
        Name: "Greece",
        Code: "GR"
    }, {
        Name: "Greenland",
        Code: "GL"
    }, {
        Name: "Grenada",
        Code: "GD"
    }, {
        Name: "Guadeloupe",
        Code: "GP"
    }, {
        Name: "Guam",
        Code: "GU"
    }, {
        Name: "Guatemala",
        Code: "GT"
    }, {
        Name: "Guernsey",
        Code: "GG"
    }, {
        Name: "Guinea",
        Code: "GN"
    }, {
        Name: "Guinea-Bissau",
        Code: "GW"
    }, {
        Name: "Guyana",
        Code: "GY"
    }, {
        Name: "Haiti",
        Code: "HT"
    }, {
        Name: "Heard Island and Mcdonald Islands",
        Code: "HM"
    }, {
        Name: "Holy See (Vatican City State)",
        Code: "VA"
    }, {
        Name: "Honduras",
        Code: "HN"
    }, {
        Name: "Hong Kong",
        Code: "HK"
    }, {
        Name: "Hungary",
        Code: "HU"
    }, {
        Name: "Iceland",
        Code: "IS"
    }, {
        Name: "India",
        Code: "IN"
    }, {
        Name: "Indonesia",
        Code: "ID"
    }, {
        Name: "Iran, Islamic Republic Of",
        Code: "IR"
    }, {
        Name: "Iraq",
        Code: "IQ"
    }, {
        Name: "Ireland",
        Code: "IE"
    }, {
        Name: "Isle of Man",
        Code: "IM"
    }, {
        Name: "Israel",
        Code: "IL"
    }, {
        Name: "Italy",
        Code: "IT"
    }, {
        Name: "Jamaica",
        Code: "JM"
    }, {
        Name: "Japan",
        Code: "JP"
    }, {
        Name: "Jersey",
        Code: "JE"
    }, {
        Name: "Jordan",
        Code: "JO"
    }, {
        Name: "Kazakhstan",
        Code: "KZ"
    }, {
        Name: "Kenya",
        Code: "KE"
    }, {
        Name: "Kiribati",
        Code: "KI"
    }, {
        Name: "Korea, Democratic People'S Republic of",
        Code: "KP"
    }, {
        Name: "Korea, Republic of",
        Code: "KR"
    }, {
        Name: "Kuwait",
        Code: "KW"
    }, {
        Name: "Kyrgyzstan",
        Code: "KG"
    }, {
        Name: "Lao People'S Democratic Republic",
        Code: "LA"
    }, {
        Name: "Latvia",
        Code: "LV"
    }, {
        Name: "Lebanon",
        Code: "LB"
    }, {
        Name: "Lesotho",
        Code: "LS"
    }, {
        Name: "Liberia",
        Code: "LR"
    }, {
        Name: "Libyan Arab Jamahiriya",
        Code: "LY"
    }, {
        Name: "Liechtenstein",
        Code: "LI"
    }, {
        Name: "Lithuania",
        Code: "LT"
    }, {
        Name: "Luxembourg",
        Code: "LU"
    }, {
        Name: "Macao",
        Code: "MO"
    }, {
        Name: "Macedonia, The Former Yugoslav Republic of",
        Code: "MK"
    }, {
        Name: "Madagascar",
        Code: "MG"
    }, {
        Name: "Malawi",
        Code: "MW"
    }, {
        Name: "Malaysia",
        Code: "MY"
    }, {
        Name: "Maldives",
        Code: "MV"
    }, {
        Name: "Mali",
        Code: "ML"
    }, {
        Name: "Malta",
        Code: "MT"
    }, {
        Name: "Marshall Islands",
        Code: "MH"
    }, {
        Name: "Martinique",
        Code: "MQ"
    }, {
        Name: "Mauritania",
        Code: "MR"
    }, {
        Name: "Mauritius",
        Code: "MU"
    }, {
        Name: "Mayotte",
        Code: "YT"
    }, {
        Name: "Mexico",
        Code: "MX"
    }, {
        Name: "Micronesia, Federated States of",
        Code: "FM"
    }, {
        Name: "Moldova, Republic of",
        Code: "MD"
    }, {
        Name: "Monaco",
        Code: "MC"
    }, {
        Name: "Mongolia",
        Code: "MN"
    }, {
        Name: "Montserrat",
        Code: "MS"
    }, {
        Name: "Morocco",
        Code: "MA"
    }, {
        Name: "Mozambique",
        Code: "MZ"
    }, {
        Name: "Myanmar",
        Code: "MM"
    }, {
        Name: "Namibia",
        Code: "NA"
    }, {
        Name: "Nauru",
        Code: "NR"
    }, {
        Name: "Nepal",
        Code: "NP"
    }, {
        Name: "Netherlands",
        Code: "NL"
    }, {
        Name: "Netherlands Antilles",
        Code: "AN"
    }, {
        Name: "New Caledonia",
        Code: "NC"
    }, {
        Name: "New Zealand",
        Code: "NZ"
    }, {
        Name: "Nicaragua",
        Code: "NI"
    }, {
        Name: "Niger",
        Code: "NE"
    }, {
        Name: "Nigeria",
        Code: "NG"
    }, {
        Name: "Niue",
        Code: "NU"
    }, {
        Name: "Norfolk Island",
        Code: "NF"
    }, {
        Name: "Northern Mariana Islands",
        Code: "MP"
    }, {
        Name: "Norway",
        Code: "NO"
    }, {
        Name: "Oman",
        Code: "OM"
    }, {
        Name: "Pakistan",
        Code: "PK"
    }, {
        Name: "Palau",
        Code: "PW"
    }, {
        Name: "Palestinian Territory, Occupied",
        Code: "PS"
    }, {
        Name: "Panama",
        Code: "PA"
    }, {
        Name: "Papua New Guinea",
        Code: "PG"
    }, {
        Name: "Paraguay",
        Code: "PY"
    }, {
        Name: "Peru",
        Code: "PE"
    }, {
        Name: "Philippines",
        Code: "PH"
    }, {
        Name: "Pitcairn",
        Code: "PN"
    }, {
        Name: "Poland",
        Code: "PL"
    }, {
        Name: "Portugal",
        Code: "PT"
    }, {
        Name: "Puerto Rico",
        Code: "PR"
    }, {
        Name: "Qatar",
        Code: "QA"
    }, {
        Name: "Reunion",
        Code: "RE"
    }, {
        Name: "Romania",
        Code: "RO"
    }, {
        Name: "Russian Federation",
        Code: "RU"
    }, {
        Name: "RWANDA",
        Code: "RW"
    }, {
        Name: "Saint Helena",
        Code: "SH"
    }, {
        Name: "Saint Kitts and Nevis",
        Code: "KN"
    }, {
        Name: "Saint Lucia",
        Code: "LC"
    }, {
        Name: "Saint Pierre and Miquelon",
        Code: "PM"
    }, {
        Name: "Saint Vincent and the Grenadines",
        Code: "VC"
    }, {
        Name: "Samoa",
        Code: "WS"
    }, {
        Name: "San Marino",
        Code: "SM"
    }, {
        Name: "Sao Tome and Principe",
        Code: "ST"
    }, {
        Name: "Saudi Arabia",
        Code: "SA"
    }, {
        Name: "Senegal",
        Code: "SN"
    }, {
        Name: "Serbia and Montenegro",
        Code: "CS"
    }, {
        Name: "Seychelles",
        Code: "SC"
    }, {
        Name: "Sierra Leone",
        Code: "SL"
    }, {
        Name: "Singapore",
        Code: "SG"
    }, {
        Name: "Slovakia",
        Code: "SK"
    }, {
        Name: "Slovenia",
        Code: "SI"
    }, {
        Name: "Solomon Islands",
        Code: "SB"
    }, {
        Name: "Somalia",
        Code: "SO"
    }, {
        Name: "South Africa",
        Code: "ZA"
    }, {
        Name: "South Georgia and the South Sandwich Islands",
        Code: "GS"
    }, {
        Name: "Spain",
        Code: "ES"
    }, {
        Name: "Sri Lanka",
        Code: "LK"
    }, {
        Name: "Sudan",
        Code: "SD"
    }, {
        Name: "Suriname",
        Code: "SR"
    }, {
        Name: "Svalbard and Jan Mayen",
        Code: "SJ"
    }, {
        Name: "Swaziland",
        Code: "SZ"
    }, {
        Name: "Sweden",
        Code: "SE"
    }, {
        Name: "Switzerland",
        Code: "CH"
    }, {
        Name: "Syrian Arab Republic",
        Code: "SY"
    }, {
        Name: "Taiwan",
        Code: "TW"
    }, {
        Name: "Tajikistan",
        Code: "TJ"
    }, {
        Name: "Tanzania, United Republic of",
        Code: "TZ"
    }, {
        Name: "Thailand",
        Code: "TH"
    }, {
        Name: "Timor-Leste",
        Code: "TL"
    }, {
        Name: "Togo",
        Code: "TG"
    }, {
        Name: "Tokelau",
        Code: "TK"
    }, {
        Name: "Tonga",
        Code: "TO"
    }, {
        Name: "Trinidad and Tobago",
        Code: "TT"
    }, {
        Name: "Tunisia",
        Code: "TN"
    }, {
        Name: "Turkey",
        Code: "TR"
    }, {
        Name: "Turkmenistan",
        Code: "TM"
    }, {
        Name: "Turks and Caicos Islands",
        Code: "TC"
    }, {
        Name: "Tuvalu",
        Code: "TV"
    }, {
        Name: "Uganda",
        Code: "UG"
    }, {
        Name: "Ukraine",
        Code: "UA"
    }, {
        Name: "United Arab Emirates",
        Code: "AE"
    }, {
        Name: "United Kingdom",
        Code: "GB"
    }, {
        Name: "United States",
        Code: "US"
    }, {
        Name: "United States Minor Outlying Islands",
        Code: "UM"
    }, {
        Name: "Uruguay",
        Code: "UY"
    }, {
        Name: "Uzbekistan",
        Code: "UZ"
    }, {
        Name: "Vanuatu",
        Code: "VU"
    }, {
        Name: "Venezuela",
        Code: "VE"
    }, {
        Name: "Viet Nam",
        Code: "VN"
    }, {
        Name: "Virgin Islands, British",
        Code: "VG"
    }, {
        Name: "Virgin Islands, U.S.",
        Code: "VI"
    }, {
        Name: "Wallis and Futuna",
        Code: "WF"
    }, {
        Name: "Western Sahara",
        Code: "EH"
    }, {
        Name: "Yemen",
        Code: "YE"
    }, {
        Name: "Zambia",
        Code: "ZM"
    }, {
        Name: "Zimbabwe",
        Code: "ZW"
    }], (resource = resource || {}).usSates = [{
        Name: "Alabama",
        Code: "AL"
    }, {
        Name: "Alaska",
        Code: "AK"
    }, {
        Name: "American Samoa",
        Code: "AS"
    }, {
        Name: "Arizona",
        Code: "AZ"
    }, {
        Name: "Arkansas",
        Code: "AR"
    }, {
        Name: "California",
        Code: "CA"
    }, {
        Name: "Colorado",
        Code: "CO"
    }, {
        Name: "Connecticut",
        Code: "CT"
    }, {
        Name: "Delaware",
        Code: "DE"
    }, {
        Name: "District Of Columbia",
        Code: "DC"
    }, {
        Name: "Federated States Of Micronesia",
        Code: "FM"
    }, {
        Name: "Florida",
        Code: "FL"
    }, {
        Name: "Georgia",
        Code: "GA"
    }, {
        Name: "Guam",
        Code: "GU"
    }, {
        Name: "Hawaii",
        Code: "HI"
    }, {
        Name: "Idaho",
        Code: "ID"
    }, {
        Name: "Illinois",
        Code: "IL"
    }, {
        Name: "Indiana",
        Code: "IN"
    }, {
        Name: "Iowa",
        Code: "IA"
    }, {
        Name: "Kansas",
        Code: "KS"
    }, {
        Name: "Kentucky",
        Code: "KY"
    }, {
        Name: "Louisiana",
        Code: "LA"
    }, {
        Name: "Maine",
        Code: "ME"
    }, {
        Name: "Marshall Islands",
        Code: "MH"
    }, {
        Name: "Maryland",
        Code: "MD"
    }, {
        Name: "Massachusetts",
        Code: "MA"
    }, {
        Name: "Michigan",
        Code: "MI"
    }, {
        Name: "Minnesota",
        Code: "MN"
    }, {
        Name: "Mississippi",
        Code: "MS"
    }, {
        Name: "Missouri",
        Code: "MO"
    }, {
        Name: "Montana",
        Code: "MT"
    }, {
        Name: "Nebraska",
        Code: "NE"
    }, {
        Name: "Nevada",
        Code: "NV"
    }, {
        Name: "New Hampshire",
        Code: "NH"
    }, {
        Name: "New Jersey",
        Code: "NJ"
    }, {
        Name: "New Mexico",
        Code: "NM"
    }, {
        Name: "New York",
        Code: "NY"
    }, {
        Name: "North Carolina",
        Code: "NC"
    }, {
        Name: "North Dakota",
        Code: "ND"
    }, {
        Name: "Northern Mariana Islands",
        Code: "MP"
    }, {
        Name: "Ohio",
        Code: "OH"
    }, {
        Name: "Oklahoma",
        Code: "OK"
    }, {
        Name: "Oregon",
        Code: "OR"
    }, {
        Name: "Palau",
        Code: "PW"
    }, {
        Name: "Pennsylvania",
        Code: "PA"
    }, {
        Name: "Puerto Rico",
        Code: "PR"
    }, {
        Name: "Rhode Island",
        Code: "RI"
    }, {
        Name: "South Carolina",
        Code: "SC"
    }, {
        Name: "South Dakota",
        Code: "SD"
    }, {
        Name: "Tennessee",
        Code: "TN"
    }, {
        Name: "Texas",
        Code: "TX"
    }, {
        Name: "Utah",
        Code: "UT"
    }, {
        Name: "Vermont",
        Code: "VT"
    }, {
        Name: "Virgin Islands",
        Code: "VI"
    }, {
        Name: "Virginia",
        Code: "VA"
    }, {
        Name: "Washington",
        Code: "WA"
    }, {
        Name: "West Virginia",
        Code: "WV"
    }, {
        Name: "Wisconsin",
        Code: "WI"
    }, {
        Name: "Wyoming",
        Code: "WY"
    }],
    function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.VueLazyload = e()
    }(this, function() {
        "use strict";

        function t(t) {
            t = t || {};
            var i = arguments.length,
                o = 0;
            if (1 === i) return t;
            for (; ++o < i;) {
                var s = arguments[o];
                u(t) && (t = s), n(s) && e(t, s)
            }
            return t
        }

        function e(e, o) {
            for (var s in p(e, o), o)
                if ("__proto__" !== s && i(o, s)) {
                    var r = o[s];
                    n(r) ? ("undefined" === h(e[s]) && "function" === h(r) && (e[s] = r), e[s] = t(e[s] || {}, r)) : e[s] = r
                } return e
        }

        function n(t) {
            return "object" === h(t) || "function" === h(t)
        }

        function i(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }

        function o(t, e) {
            if (t.length) {
                var n = t.indexOf(e);
                return n > -1 ? t.splice(n, 1) : void 0
            }
        }

        function s(t, e) {
            if ("IMG" === t.tagName && t.getAttribute("data-srcset")) {
                var n = t.getAttribute("data-srcset"),
                    i = [],
                    o = t.parentNode.offsetWidth * e,
                    s = void 0,
                    r = void 0,
                    a = void 0;
                (n = n.trim().split(",")).map(function(t) {
                    t = t.trim(), -1 === (s = t.lastIndexOf(" ")) ? (r = t, a = 999998) : (r = t.substr(0, s), a = parseInt(t.substr(s + 1, t.length - s - 2), 10)), i.push([a, r])
                }), i.sort(function(t, e) {
                    if (t[0] < e[0]) return -1;
                    if (t[0] > e[0]) return 1;
                    if (t[0] === e[0]) {
                        if (-1 !== e[1].indexOf(".webp", e[1].length - 5)) return 1;
                        if (-1 !== t[1].indexOf(".webp", t[1].length - 5)) return -1
                    }
                    return 0
                });
                for (var l = "", c = void 0, d = i.length, u = 0; u < d; u++)
                    if ((c = i[u])[0] >= o) {
                        l = c[1];
                        break
                    } return l
            }
        }

        function r(t, e) {
            for (var n = void 0, i = 0, o = t.length; i < o; i++)
                if (e(t[i])) {
                    n = t[i];
                    break
                } return n
        }

        function a() {}
        var l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            },
            c = function(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            },
            d = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }(),
            u = function(t) {
                return null == t || "function" != typeof t && "object" !== (void 0 === t ? "undefined" : l(t))
            },
            p = function(t, e) {
                if (null === t || void 0 === t) throw new TypeError("expected first argument to be an object.");
                if (void 0 === e || "undefined" == typeof Symbol) return t;
                if ("function" != typeof Object.getOwnPropertySymbols) return t;
                for (var n = Object.prototype.propertyIsEnumerable, i = Object(t), o = arguments.length, s = 0; ++s < o;)
                    for (var r = Object(arguments[s]), a = Object.getOwnPropertySymbols(r), l = 0; l < a.length; l++) {
                        var c = a[l];
                        n.call(r, c) && (i[c] = r[c])
                    }
                return i
            },
            m = Object.prototype.toString,
            h = function(t) {
                var e = void 0 === t ? "undefined" : l(t);
                return "undefined" === e ? "undefined" : null === t ? "null" : !0 === t || !1 === t || t instanceof Boolean ? "boolean" : "string" === e || t instanceof String ? "string" : "number" === e || t instanceof Number ? "number" : "function" === e || t instanceof Function ? void 0 !== t.constructor.name && "Generator" === t.constructor.name.slice(0, 9) ? "generatorfunction" : "function" : void 0 !== Array.isArray && Array.isArray(t) ? "array" : t instanceof RegExp ? "regexp" : t instanceof Date ? "date" : "[object RegExp]" === (e = m.call(t)) ? "regexp" : "[object Date]" === e ? "date" : "[object Arguments]" === e ? "arguments" : "[object Error]" === e ? "error" : "[object Promise]" === e ? "promise" : function(t) {
                    return t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
                }(t) ? "buffer" : "[object Set]" === e ? "set" : "[object WeakSet]" === e ? "weakset" : "[object Map]" === e ? "map" : "[object WeakMap]" === e ? "weakmap" : "[object Symbol]" === e ? "symbol" : "[object Map Iterator]" === e ? "mapiterator" : "[object Set Iterator]" === e ? "setiterator" : "[object String Iterator]" === e ? "stringiterator" : "[object Array Iterator]" === e ? "arrayiterator" : "[object Int8Array]" === e ? "int8array" : "[object Uint8Array]" === e ? "uint8array" : "[object Uint8ClampedArray]" === e ? "uint8clampedarray" : "[object Int16Array]" === e ? "int16array" : "[object Uint16Array]" === e ? "uint16array" : "[object Int32Array]" === e ? "int32array" : "[object Uint32Array]" === e ? "uint32array" : "[object Float32Array]" === e ? "float32array" : "[object Float64Array]" === e ? "float64array" : "object"
            },
            v = t,
            f = "undefined" != typeof window,
            g = f && "IntersectionObserver" in window,
            b = {
                event: "event",
                observer: "observer"
            },
            y = function() {
                function t(t, e) {
                    e = e || {
                        bubbles: !1,
                        cancelable: !1,
                        detail: void 0
                    };
                    var n = document.createEvent("CustomEvent");
                    return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n
                }
                if (f) return "function" == typeof window.CustomEvent ? window.CustomEvent : (t.prototype = window.Event.prototype, t)
            }(),
            C = function() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
                return f && window.devicePixelRatio || t
            },
            S = function() {
                if (f) {
                    var t = !1;
                    try {
                        var e = Object.defineProperty({}, "passive", {
                            get: function() {
                                t = !0
                            }
                        });
                        window.addEventListener("test", null, e)
                    } catch (t) {}
                    return t
                }
            }(),
            w = {
                on: function(t, e, n) {
                    var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    S ? t.addEventListener(e, n, {
                        capture: i,
                        passive: !0
                    }) : t.addEventListener(e, n, i)
                },
                off: function(t, e, n) {
                    var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                    t.removeEventListener(e, n, i)
                }
            },
            k = function(t, e, n) {
                var i = new Image;
                i.src = t.src, i.onload = function() {
                    e({
                        naturalHeight: i.naturalHeight,
                        naturalWidth: i.naturalWidth,
                        src: i.src
                    })
                }, i.onerror = function(t) {
                    n(t)
                }
            },
            x = function(t, e) {
                return "undefined" != typeof getComputedStyle ? getComputedStyle(t, null).getPropertyValue(e) : t.style[e]
            },
            T = function(t) {
                return x(t, "overflow") + x(t, "overflow-y") + x(t, "overflow-x")
            },
            P = {},
            I = function() {
                function t(e) {
                    var n = e.el,
                        i = e.src,
                        o = e.error,
                        s = e.loading,
                        r = e.bindType,
                        a = e.$parent,
                        l = e.options,
                        d = e.elRenderer;
                    c(this, t), this.el = n, this.src = i, this.error = o, this.loading = s, this.bindType = r, this.attempt = 0, this.naturalHeight = 0, this.naturalWidth = 0, this.options = l, this.rect = null, this.$parent = a, this.elRenderer = d, this.performanceData = {
                        init: Date.now(),
                        loadStart: 0,
                        loadEnd: 0
                    }, this.filter(), this.initState(), this.render("loading", !1)
                }
                return d(t, [{
                    key: "initState",
                    value: function() {
                        "dataset" in this.el ? this.el.dataset.src = this.src : this.el.setAttribute("data-src", this.src), this.state = {
                            error: !1,
                            loaded: !1,
                            rendered: !1
                        }
                    }
                }, {
                    key: "record",
                    value: function(t) {
                        this.performanceData[t] = Date.now()
                    }
                }, {
                    key: "update",
                    value: function(t) {
                        var e = t.src,
                            n = t.loading,
                            i = t.error,
                            o = this.src;
                        this.src = e, this.loading = n, this.error = i, this.filter(), o !== this.src && (this.attempt = 0, this.initState())
                    }
                }, {
                    key: "getRect",
                    value: function() {
                        this.rect = this.el.getBoundingClientRect()
                    }
                }, {
                    key: "checkInView",
                    value: function() {
                        return this.getRect(), this.rect.top < window.innerHeight * this.options.preLoad && this.rect.bottom > this.options.preLoadTop && this.rect.left < window.innerWidth * this.options.preLoad && this.rect.right > 0
                    }
                }, {
                    key: "filter",
                    value: function() {
                        var t = this;
                        (function(t) {
                            if (!(t instanceof Object)) return [];
                            if (Object.keys) return Object.keys(t);
                            var e = [];
                            for (var n in t) t.hasOwnProperty(n) && e.push(n);
                            return e
                        })(this.options.filter).map(function(e) {
                            t.options.filter[e](t, t.options)
                        })
                    }
                }, {
                    key: "renderLoading",
                    value: function(t) {
                        var e = this;
                        k({
                            src: this.loading
                        }, function(n) {
                            e.render("loading", !1), t()
                        }, function() {
                            t(), e.options.silent || console.warn("VueLazyload log: load failed with loading image(" + e.loading + ")")
                        })
                    }
                }, {
                    key: "load",
                    value: function() {
                        var t = this,
                            e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a;
                        return this.attempt > this.options.attempt - 1 && this.state.error ? (this.options.silent || console.log("VueLazyload log: " + this.src + " tried too more than " + this.options.attempt + " times"), void e()) : this.state.loaded || P[this.src] ? (this.state.loaded = !0, e(), this.render("loaded", !0)) : void this.renderLoading(function() {
                            t.attempt++, t.record("loadStart"), k({
                                src: t.src
                            }, function(n) {
                                t.naturalHeight = n.naturalHeight, t.naturalWidth = n.naturalWidth, t.state.loaded = !0, t.state.error = !1, t.record("loadEnd"), t.render("loaded", !1), P[t.src] = 1, e()
                            }, function(e) {
                                !t.options.silent && console.error(e), t.state.error = !0, t.state.loaded = !1, t.render("error", !1)
                            })
                        })
                    }
                }, {
                    key: "render",
                    value: function(t, e) {
                        this.elRenderer(this, t, e)
                    }
                }, {
                    key: "performance",
                    value: function() {
                        var t = "loading",
                            e = 0;
                        return this.state.loaded && (t = "loaded", e = (this.performanceData.loadEnd - this.performanceData.loadStart) / 1e3), this.state.error && (t = "error"), {
                            src: this.src,
                            state: t,
                            time: e
                        }
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.el = null, this.src = null, this.error = null, this.loading = null, this.bindType = null, this.attempt = 0
                    }
                }]), t
            }(),
            E = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            A = ["scroll", "wheel", "mousewheel", "resize", "animationend", "transitionend", "touchmove"],
            F = {
                rootMargin: "0px",
                threshold: 0
            },
            L = function(t) {
                return function() {
                    function e(t) {
                        var n = t.preLoad,
                            i = t.error,
                            o = t.throttleWait,
                            s = t.preLoadTop,
                            r = t.dispatchEvent,
                            a = t.loading,
                            l = t.attempt,
                            d = t.silent,
                            u = void 0 === d || d,
                            p = t.scale,
                            m = t.listenEvents,
                            h = (t.hasbind, t.filter),
                            v = t.adapter,
                            g = t.observer,
                            y = t.observerOptions;
                        c(this, e), this.version = "1.2.6", this.mode = b.event, this.ListenerQueue = [], this.TargetIndex = 0, this.TargetQueue = [], this.options = {
                            silent: u,
                            dispatchEvent: !!r,
                            throttleWait: o || 200,
                            preLoad: n || 1.3,
                            preLoadTop: s || 0,
                            error: i || E,
                            loading: a || E,
                            attempt: l || 3,
                            scale: p || C(p),
                            ListenEvents: m || A,
                            hasbind: !1,
                            supportWebp: function() {
                                if (!f) return !1;
                                var t = !0,
                                    e = document;
                                try {
                                    var n = e.createElement("object");
                                    n.type = "image/webp", n.style.visibility = "hidden", n.innerHTML = "!", e.body.appendChild(n), t = !n.offsetWidth, e.body.removeChild(n)
                                } catch (e) {
                                    t = !1
                                }
                                return t
                            }(),
                            filter: h || {},
                            adapter: v || {},
                            observer: !!g,
                            observerOptions: y || F
                        }, this._initEvent(), this.lazyLoadHandler = function(t, e) {
                            var n = null,
                                i = 0;
                            return function() {
                                if (!n) {
                                    var o = this,
                                        s = arguments,
                                        r = function() {
                                            i = Date.now(), n = !1, t.apply(o, s)
                                        };
                                    Date.now() - i >= e ? r() : n = setTimeout(r, e)
                                }
                            }
                        }(this._lazyLoadHandler.bind(this), this.options.throttleWait), this.setMode(this.options.observer ? b.observer : b.event)
                    }
                    return d(e, [{
                        key: "config",
                        value: function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            v(this.options, t)
                        }
                    }, {
                        key: "performance",
                        value: function() {
                            var t = [];
                            return this.ListenerQueue.map(function(e) {
                                t.push(e.performance())
                            }), t
                        }
                    }, {
                        key: "addLazyBox",
                        value: function(t) {
                            this.ListenerQueue.push(t), f && (this._addListenerTarget(window), this._observer && this._observer.observe(t.el), t.$el && t.$el.parentNode && this._addListenerTarget(t.$el.parentNode))
                        }
                    }, {
                        key: "add",
                        value: function(e, n, i) {
                            var o = this;
                            if (function(t, e) {
                                    for (var n = !1, i = 0, o = t.length; i < o; i++)
                                        if (e(t[i])) {
                                            n = !0;
                                            break
                                        } return n
                                }(this.ListenerQueue, function(t) {
                                    return t.el === e
                                })) return this.update(e, n), t.nextTick(this.lazyLoadHandler);
                            var r = this._valueFormatter(n.value),
                                a = r.src,
                                l = r.loading,
                                c = r.error;
                            t.nextTick(function() {
                                a = s(e, o.options.scale) || a, o._observer && o._observer.observe(e);
                                var r = Object.keys(n.modifiers)[0],
                                    d = void 0;
                                r && (d = (d = i.context.$refs[r]) ? d.$el || d : document.getElementById(r)), d || (d = function(t) {
                                    if (f) {
                                        if (!(t instanceof HTMLElement)) return window;
                                        for (var e = t; e && e !== document.body && e !== document.documentElement && e.parentNode;) {
                                            if (/(scroll|auto)/.test(T(e))) return e;
                                            e = e.parentNode
                                        }
                                        return window
                                    }
                                }(e));
                                var u = new I({
                                    bindType: n.arg,
                                    $parent: d,
                                    el: e,
                                    loading: l,
                                    error: c,
                                    src: a,
                                    elRenderer: o._elRenderer.bind(o),
                                    options: o.options
                                });
                                o.ListenerQueue.push(u), f && (o._addListenerTarget(window), o._addListenerTarget(d)), o.lazyLoadHandler(), t.nextTick(function() {
                                    return o.lazyLoadHandler()
                                })
                            })
                        }
                    }, {
                        key: "update",
                        value: function(e, n) {
                            var i = this,
                                o = this._valueFormatter(n.value),
                                a = o.src,
                                l = o.loading,
                                c = o.error;
                            a = s(e, this.options.scale) || a;
                            var d = r(this.ListenerQueue, function(t) {
                                return t.el === e
                            });
                            d && d.update({
                                src: a,
                                loading: l,
                                error: c
                            }), this._observer && (this._observer.unobserve(e), this._observer.observe(e)), this.lazyLoadHandler(), t.nextTick(function() {
                                return i.lazyLoadHandler()
                            })
                        }
                    }, {
                        key: "remove",
                        value: function(t) {
                            if (t) {
                                this._observer && this._observer.unobserve(t);
                                var e = r(this.ListenerQueue, function(e) {
                                    return e.el === t
                                });
                                e && (this._removeListenerTarget(e.$parent), this._removeListenerTarget(window), o(this.ListenerQueue, e) && e.destroy())
                            }
                        }
                    }, {
                        key: "removeComponent",
                        value: function(t) {
                            t && (o(this.ListenerQueue, t), this._observer && this._observer.unobserve(t.el), t.$parent && t.$el.parentNode && this._removeListenerTarget(t.$el.parentNode), this._removeListenerTarget(window))
                        }
                    }, {
                        key: "setMode",
                        value: function(t) {
                            var e = this;
                            g || t !== b.observer || (t = b.event), this.mode = t, t === b.event ? (this._observer && (this.ListenerQueue.forEach(function(t) {
                                e._observer.unobserve(t.el)
                            }), this._observer = null), this.TargetQueue.forEach(function(t) {
                                e._initListen(t.el, !0)
                            })) : (this.TargetQueue.forEach(function(t) {
                                e._initListen(t.el, !1)
                            }), this._initIntersectionObserver())
                        }
                    }, {
                        key: "_addListenerTarget",
                        value: function(t) {
                            if (t) {
                                var e = r(this.TargetQueue, function(e) {
                                    return e.el === t
                                });
                                return e ? e.childrenCount++ : (e = {
                                    el: t,
                                    id: ++this.TargetIndex,
                                    childrenCount: 1,
                                    listened: !0
                                }, this.mode === b.event && this._initListen(e.el, !0), this.TargetQueue.push(e)), this.TargetIndex
                            }
                        }
                    }, {
                        key: "_removeListenerTarget",
                        value: function(t) {
                            var e = this;
                            this.TargetQueue.forEach(function(n, i) {
                                n.el === t && (--n.childrenCount || (e._initListen(n.el, !1), e.TargetQueue.splice(i, 1), n = null))
                            })
                        }
                    }, {
                        key: "_initListen",
                        value: function(t, e) {
                            var n = this;
                            this.options.ListenEvents.forEach(function(i) {
                                return w[e ? "on" : "off"](t, i, n.lazyLoadHandler)
                            })
                        }
                    }, {
                        key: "_initEvent",
                        value: function() {
                            var t = this;
                            this.Event = {
                                listeners: {
                                    loading: [],
                                    loaded: [],
                                    error: []
                                }
                            }, this.$on = function(e, n) {
                                t.Event.listeners[e] || (t.Event.listeners[e] = []), t.Event.listeners[e].push(n)
                            }, this.$once = function(e, n) {
                                var i = t;
                                t.$on(e, function t() {
                                    i.$off(e, t), n.apply(i, arguments)
                                })
                            }, this.$off = function(e, n) {
                                if (n) o(t.Event.listeners[e], n);
                                else {
                                    if (!t.Event.listeners[e]) return;
                                    t.Event.listeners[e].length = 0
                                }
                            }, this.$emit = function(e, n, i) {
                                t.Event.listeners[e] && t.Event.listeners[e].forEach(function(t) {
                                    return t(n, i)
                                })
                            }
                        }
                    }, {
                        key: "_lazyLoadHandler",
                        value: function() {
                            var t = this,
                                e = [];
                            this.ListenerQueue.forEach(function(t, n) {
                                if (!t.state.error && t.state.loaded) return e.push(t);
                                t.checkInView() && t.load()
                            }), e.forEach(function(e) {
                                return o(t.ListenerQueue, e)
                            })
                        }
                    }, {
                        key: "_initIntersectionObserver",
                        value: function() {
                            var t = this;
                            g && (this._observer = new IntersectionObserver(this._observerHandler.bind(this), this.options.observerOptions), this.ListenerQueue.length && this.ListenerQueue.forEach(function(e) {
                                t._observer.observe(e.el)
                            }))
                        }
                    }, {
                        key: "_observerHandler",
                        value: function(t, e) {
                            var n = this;
                            t.forEach(function(t) {
                                t.isIntersecting && n.ListenerQueue.forEach(function(e) {
                                    if (e.el === t.target) {
                                        if (e.state.loaded) return n._observer.unobserve(e.el);
                                        e.load()
                                    }
                                })
                            })
                        }
                    }, {
                        key: "_elRenderer",
                        value: function(t, e, n) {
                            if (t.el) {
                                var i = t.el,
                                    o = t.bindType,
                                    s = void 0;
                                switch (e) {
                                    case "loading":
                                        s = t.loading;
                                        break;
                                    case "error":
                                        s = t.error;
                                        break;
                                    default:
                                        s = t.src
                                }
                                if (o ? i.style[o] = 'url("' + s + '")' : i.getAttribute("src") !== s && i.setAttribute("src", s), i.setAttribute("lazy", e), this.$emit(e, t, n), this.options.adapter[e] && this.options.adapter[e](t, this.options), this.options.dispatchEvent) {
                                    var r = new y(e, {
                                        detail: t
                                    });
                                    i.dispatchEvent(r)
                                }
                            }
                        }
                    }, {
                        key: "_valueFormatter",
                        value: function(t) {
                            var e = t,
                                n = this.options.loading,
                                i = this.options.error;
                            return function(t) {
                                return null !== t && "object" === (void 0 === t ? "undefined" : l(t))
                            }(t) && (t.src || this.options.silent || console.error("Vue Lazyload warning: miss src with " + t), e = t.src, n = t.loading || this.options.loading, i = t.error || this.options.error), {
                                src: e,
                                loading: n,
                                error: i
                            }
                        }
                    }]), e
                }()
            },
            G = function() {
                function t(e) {
                    var n = e.lazy;
                    c(this, t), this.lazy = n, n.lazyContainerMananger = this, this._queue = []
                }
                return d(t, [{
                    key: "bind",
                    value: function(t, e, n) {
                        var i = new O({
                            el: t,
                            binding: e,
                            vnode: n,
                            lazy: this.lazy
                        });
                        this._queue.push(i)
                    }
                }, {
                    key: "update",
                    value: function(t, e, n) {
                        var i = r(this._queue, function(e) {
                            return e.el === t
                        });
                        i && i.update({
                            el: t,
                            binding: e,
                            vnode: n
                        })
                    }
                }, {
                    key: "unbind",
                    value: function(t, e, n) {
                        var i = r(this._queue, function(e) {
                            return e.el === t
                        });
                        i && (i.clear(), o(this._queue, i))
                    }
                }]), t
            }(),
            N = {
                selector: "img"
            },
            O = function() {
                function t(e) {
                    var n = e.el,
                        i = e.binding,
                        o = e.vnode,
                        s = e.lazy;
                    c(this, t), this.el = null, this.vnode = o, this.binding = i, this.options = {}, this.lazy = s, this._queue = [], this.update({
                        el: n,
                        binding: i
                    })
                }
                return d(t, [{
                    key: "update",
                    value: function(t) {
                        var e = this,
                            n = t.el,
                            i = t.binding;
                        this.el = n, this.options = v({}, N, i.value), this.getImgs().forEach(function(t) {
                            e.lazy.add(t, v({}, e.binding, {
                                value: {
                                    src: "dataset" in t ? t.dataset.src : t.getAttribute("data-src"),
                                    error: "dataset" in t ? t.dataset.error : t.getAttribute("data-error"),
                                    loading: "dataset" in t ? t.dataset.loading : t.getAttribute("data-loading")
                                }
                            }), e.vnode)
                        })
                    }
                }, {
                    key: "getImgs",
                    value: function() {
                        return function(t) {
                            for (var e = t.length, n = [], i = 0; i < e; i++) n.push(t[i]);
                            return n
                        }(this.el.querySelectorAll(this.options.selector))
                    }
                }, {
                    key: "clear",
                    value: function() {
                        var t = this;
                        this.getImgs().forEach(function(e) {
                            return t.lazy.remove(e)
                        }), this.vnode = null, this.binding = null, this.lazy = null
                    }
                }]), t
            }();
        return {
            install: function(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                    n = new(L(t))(e),
                    i = new G({
                        lazy: n
                    }),
                    o = "2" === t.version.split(".")[0];
                t.prototype.$Lazyload = n, e.lazyComponent && t.component("lazy-component", function(t) {
                    return {
                        props: {
                            tag: {
                                type: String,
                                default: "div"
                            }
                        },
                        render: function(t) {
                            return !1 === this.show ? t(this.tag) : t(this.tag, null, this.$slots.default)
                        },
                        data: function() {
                            return {
                                el: null,
                                state: {
                                    loaded: !1
                                },
                                rect: {},
                                show: !1
                            }
                        },
                        mounted: function() {
                            this.el = this.$el, t.addLazyBox(this), t.lazyLoadHandler()
                        },
                        beforeDestroy: function() {
                            t.removeComponent(this)
                        },
                        methods: {
                            getRect: function() {
                                this.rect = this.$el.getBoundingClientRect()
                            },
                            checkInView: function() {
                                return this.getRect(), f && this.rect.top < window.innerHeight * t.options.preLoad && this.rect.bottom > 0 && this.rect.left < window.innerWidth * t.options.preLoad && this.rect.right > 0
                            },
                            load: function() {
                                this.show = !0, this.state.loaded = !0, this.$emit("show", this)
                            }
                        }
                    }
                }(n)), e.lazyImage && t.component("lazy-image", function(t) {
                    return {
                        props: {
                            src: [String, Object],
                            tag: {
                                type: String,
                                default: "img"
                            }
                        },
                        render: function(t) {
                            return t(this.tag, {
                                attrs: {
                                    src: this.renderSrc
                                }
                            }, this.$slots.default)
                        },
                        data: function() {
                            return {
                                el: null,
                                options: {
                                    src: "",
                                    error: "",
                                    loading: "",
                                    attempt: t.options.attempt
                                },
                                state: {
                                    loaded: !1,
                                    error: !1,
                                    attempt: 0
                                },
                                rect: {},
                                renderSrc: ""
                            }
                        },
                        watch: {
                            src: function() {
                                this.init(), t.addLazyBox(this), t.lazyLoadHandler()
                            }
                        },
                        created: function() {
                            this.init(), this.renderSrc = this.options.loading
                        },
                        mounted: function() {
                            this.el = this.$el, t.addLazyBox(this), t.lazyLoadHandler()
                        },
                        beforeDestroy: function() {
                            t.removeComponent(this)
                        },
                        methods: {
                            init: function() {
                                var e = t._valueFormatter(this.src),
                                    n = e.src,
                                    i = e.loading,
                                    o = e.error;
                                this.state.loaded = !1, this.options.src = n, this.options.error = o, this.options.loading = i, this.renderSrc = this.options.loading
                            },
                            getRect: function() {
                                this.rect = this.$el.getBoundingClientRect()
                            },
                            checkInView: function() {
                                return this.getRect(), f && this.rect.top < window.innerHeight * t.options.preLoad && this.rect.bottom > 0 && this.rect.left < window.innerWidth * t.options.preLoad && this.rect.right > 0
                            },
                            load: function() {
                                var e = this,
                                    n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a;
                                if (this.state.attempt > this.options.attempt - 1 && this.state.error) return t.options.silent || console.log("VueLazyload log: " + this.options.src + " tried too more than " + this.options.attempt + " times"), void n();
                                var i = this.options.src;
                                k({
                                    src: i
                                }, function(t) {
                                    var n = t.src;
                                    e.renderSrc = n, e.state.loaded = !0
                                }, function(t) {
                                    e.state.attempt++, e.renderSrc = e.options.error, e.state.error = !0
                                })
                            }
                        }
                    }
                }(n)), o ? (t.directive("lazy", {
                    bind: n.add.bind(n),
                    update: n.update.bind(n),
                    componentUpdated: n.lazyLoadHandler.bind(n),
                    unbind: n.remove.bind(n)
                }), t.directive("lazy-container", {
                    bind: i.bind.bind(i),
                    update: i.update.bind(i),
                    unbind: i.unbind.bind(i)
                })) : (t.directive("lazy", {
                    bind: n.lazyLoadHandler.bind(n),
                    update: function(t, e) {
                        v(this.vm.$refs, this.vm.$els), n.add(this.el, {
                            modifiers: this.modifiers || {},
                            arg: this.arg,
                            value: t,
                            oldValue: e
                        }, {
                            context: this.vm
                        })
                    },
                    unbind: function() {
                        n.remove(this.el)
                    }
                }), t.directive("lazy-container", {
                    update: function(t, e) {
                        i.update(this.el, {
                            modifiers: this.modifiers || {},
                            arg: this.arg,
                            value: t,
                            oldValue: e
                        }, {
                            context: this.vm
                        })
                    },
                    unbind: function() {
                        i.unbind(this.el)
                    }
                }))
            }
        }
    });
const frontApi = {
    submitForm: (t, e, n) => new Promise(i => {
        axios.post("/pb4/frontapi/formapi/submitform", {
            pageUrl: t,
            formData: e,
            recaptchaToken: n
        }).then(function(t) {
            i(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    pwdPageLogin: (t, e, n) => new Promise(i => {
        axios.post("/pb4/frontapi/pwdpagefrontapi/dologin", {
            url: t,
            name: n,
            password: e
        }).then(function(t) {
            i(t.data)
        }).catch(function(t) {
            frontApp.alert(t.response.data.error)
        })
    }),
    pwdPageLogout: (t, e, n) => new Promise(e => {
        axios.post("/pb4/frontapi/pwdpagefrontapi/dologout", {
            url: t
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            frontApp.alert(t.response.data.error)
        })
    }),
    getPwdPage: t => new Promise(e => {
        axios.post("/pb4/frontapi/pwdpagefrontapi/getpwdpage", {
            url: t
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    addNewBlogPostComment: (t, e) => new Promise(n => {
        axios.post("/pb4/frontapi/blogapi/addnewcomment", {
            comment: t,
            recaptchaToken: e
        }).then(function(t) {
            n(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    postToggleLike: (t, e) => new Promise(n => {
        axios.post("/pb4/frontapi/blogapi/togglelike", {
            PostGuid: t,
            Value: e,
            SiteId: site.state.Id
        }).then(function(t) {
            n(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    checkoutCompleteInvoice: (t, e, n, i, o, s, r, a, l, c, d) => new Promise(u => {
        axios.post("/pb4/frontapi/checkoutapi/completeinvoice", {
            customer: t,
            nrOfItems: e,
            products: n,
            subtotalAfterDiscount: i,
            shippingCost: o,
            taxPercent: s,
            taxCost: r,
            totalPrice: a,
            currency: l,
            shippingNeedsVat: c,
            discounts: d
        }).then(function(t) {
            u(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    checkoutOnLocation: (t, e, n, i, o, s, r, a, l, c, d) => new Promise(u => {
        axios.post("/pb4/frontapi/checkoutapi/completeonlocation", {
            customer: t,
            nrOfItems: e,
            products: n,
            subtotalAfterDiscount: i,
            shippingCost: o,
            taxPercent: s,
            taxCost: r,
            totalPrice: a,
            currency: l,
            shippingNeedsVat: c,
            discounts: d
        }).then(function(t) {
            u(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    checkoutPreCreditCard: (t, e, n, i, o, s, r, a, l, c, d) => new Promise(u => {
        axios.post("/pb4/frontapi/checkoutapi/precreditcard", {
            customer: t,
            nrOfItems: e,
            products: n,
            subtotalAfterDiscount: i,
            shippingCost: o,
            taxPercent: s,
            taxCost: r,
            totalPrice: a,
            currency: l,
            shippingNeedsVat: c,
            discounts: d
        }).then(function(t) {
            u(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    getCountryCode: () => new Promise(t => {
        axios.post("/pb4/frontapi/miscfrontapi/getcountrycode").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    getDigitalAsset: (t, e, n) => new Promise(i => {
        axios.post("/pb4/frontapi/digitalassetfrontapi/getasset", {
            guid: t,
            time: e,
            hash: n
        }).then(function(t) {
            i(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    getAllScheduleServices: () => new Promise((t, e) => {
        axios.post("/pb4/frontapi/schedulingfrontapi/getallservices").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            e(t)
        })
    }),
    getAllPersonnels: () => new Promise((t, e) => {
        axios.post("/pb4/frontapi/schedulingfrontapi/getallpersonnels").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            e(t)
        })
    }),
    getAllPersonnelWorkingHours: () => new Promise((t, e) => {
        axios.post("/pb4/frontapi/schedulingfrontapi/getallpersonnelworkinghours").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            e(t)
        })
    }),
    getSchedulingPersonnelByGuid: t => new Promise((e, n) => {
        axios.get("/pb4/frontapi/schedulingfrontapi/getpersonnelbyguid", {
            params: {
                guid: t
            }
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            n(t)
        })
    }),
    getSchedulingServiceByGuid: t => new Promise((e, n) => {
        axios.get("/pb4/frontapi/schedulingfrontapi/getservicebyguid", {
            params: {
                guid: t
            }
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            n(t)
        })
    }),
    getWorkingHoursByGuidsForDateRange: ({
        personnelGuid: t,
        startDate: e,
        endDate: n
    }) => new Promise((i, o) => {
        axios.get("/pb4/frontapi/schedulingfrontapi/getworkinghoursbyguidsfordaterange", {
            params: {
                personnelGuid: t,
                startDate: e,
                endDate: n
            }
        }).then(function(t) {
            i(t.data)
        }).catch(function(t) {
            o(t)
        })
    }),
    getBookedTimeslotsFromNow: () => new Promise(t => {
        axios.post("/pb4/frontapi/schedulingfrontapi/getallbookedtimeslotsfromnow").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    submitEmailAddress: (t, e, n, i) => new Promise(o => {
        axios.post("/pb4/frontapi/subscribeapi/submitaddress", {
            pageUrl: t,
            name: e,
            email: n,
            recaptchaToken: i
        }).then(function(t) {
            o(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    getBookings: () => new Promise(t => {
        axios.post("/pb4/frontapi/bookingfrontapi/getbookings").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    getBooking: t => new Promise(e => {
        axios.post("/pb4/frontapi/bookingfrontapi/getbooking", {
            guid: t
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    async getInvoice(t) {
        try {
            return (await axios.post("/pb4/frontapi/invoicefrontapi/getinvoice", {
                guid: t
            })).data
        } catch (t) {
            console.log(t)
        }
    },
    getBooking: t => new Promise(e => {
        axios.post("/pb4/frontapi/bookingfrontapi/getbooking", {
            guid: t
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    fetchAllQrCodes: () => new Promise(t => {
        axios.get("/pb4/frontapi/qrcodesfrontapi/getallqrcodes").then(function(e) {
            t(e.data)
        }).catch(function(t) {
            adminApi._handleError(t)
        })
    }),
    getQrCode: t => new Promise(e => {
        axios.post("/pb4/frontapi/qrcodesfrontapi/getone", {
            guid: t
        }).then(function(t) {
            e(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    async getQuote(t) {
        try {
            return (await axios.post("/pb4/frontapi/quotefrontapi/getquote", {
                guid: t
            })).data
        } catch (t) {
            console.log(t)
        }
    },
    acceptQuote: (t, e, n) => new Promise(i => {
        axios.post("/pb4/frontapi/quotefrontapi/acceptquote", {
            guid: t,
            acceptedBy: e,
            confirmedBy: n
        }).then(function(t) {
            i(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    }),
    acceptQuoteValidate: (t, e, n, i) => new Promise(o => {
        axios.post("/pb4/frontapi/quotefrontapi/acceptquotevalidate", {
            guid: t,
            hash: e,
            confirmedBy: n,
            timestamp: i
        }).then(function(t) {
            o(t.data)
        }).catch(function(t) {
            console.log(t)
        })
    })
};
let pbRoutes = [{
        path: "/pwd/:url",
        component: pwdSectionPage
    }, {
        path: "/download/:guid/:time/:hash",
        component: digitalAssetPage
    }, {
        path: "/quote/:guid",
        component: quotePage
    }, {
        path: "/invoice/:guid",
        component: invoicePage
    }, {
        path: "/404",
        component: fourOFourPage
    }, {
        path: "/qrcode/:guid",
        component: qrCodePage
    }, {
        path: "*",
        component: sectionPage
    }],
    blogUrl = site.state.BlogSettings.Url ? site.state.BlogSettings.Url : "blog";
pbRoutes.unshift({
    path: "/" + blogUrl + "/:url",
    component: blogPostPage
});
let storeUrl = site.state.StoreSettings.Url ? site.state.StoreSettings.Url : "store";
pbRoutes.unshift({
    path: "/" + storeUrl + "/:url",
    component: productPage
});
const router = new VueRouter({
    mode: window.pb.isAdmin ? "" : "history",
    routes: pbRoutes,
    scrollBehavior: (t, e, n) => n || !(t.query.hasOwnProperty("category") || t.query.hasOwnProperty("search") || t.query.hasOwnProperty("sort")) && (!t.query.hasOwnProperty("s") && !e.query.hasOwnProperty("s") && (window.pb.isAdmin ? void(document.getElementById("frontApp").scrollTop = 0) : {
        x: 0,
        y: 0
    }))
});
router.beforeEach((t, e, n) => {
    let i, o = site.state.Title ? site.state.Title : "",
        s = site.state.SeoDescription ? site.state.SeoDescription : o,
        r = site.state.SeoKeywords ? site.state.SeoKeywords : "",
        a = "website",
        l = site.state.SeoLangId ? site.state.SeoLangId : "en",
        c = site.state.SiteIcon ? site.state.SiteIcon : "/pb4/_output/admin/_img/misc/favicon.ico",
        d = "",
        u = o,
        p = s;
    if (i = "https://" + site.state._wwwPrefix + site.state.Url + t.path, t.path.includes("/" + blogUrl + "/")) {
        let e = !(!t.params || !t.params.url) && t.params.url;
        if (e) {
            let t = posts.actions.getCurrentPost(e);
            t && (u = t.Title + " - " + o, p = t.SeoDescription ? t.SeoDescription : s, d = utils.jsonLd.post(t, i, o), a = "article", pages.state.current.page = {}, pwdPages.state.current.page = {}, products.state.current.product = {})
        }
    } else if (t.path.includes("/" + storeUrl + "/")) {
        let e = !(!t.params || !t.params.url) && t.params.url;
        if (e) {
            let t = products.actions.getCurrentProduct(e);
            t && (u = t.Title + " - " + o, p = t.SeoDescription ? t.SeoDescription : s, d = utils.jsonLd.product(t, i, o, site.state.StoreSettings), a = "product", pages.state.current.page = {}, pwdPages.state.current.page = {}, posts.state.current.post = {})
        }
    } else if (t.path.includes("/pwd/")) products.state.current.product = {}, posts.state.current.post = {}, pages.state.current.page = {}, u = "pwd - " + o;
    else {
        let e = pages.actions.getCurrentPage(t.path);
        e && (u = e.SeoTitle ? e.SeoTitle : e.Title + " - " + o, p = e.SeoDescription ? e.SeoDescription : s, d = utils.jsonLd.page(e, i, o), products.state.current.product = {}, posts.state.current.post = {}, pwdPages.state.current.page = {}), "/" === t.path ? window.isOnStart = !0 : window.isOnStart = !1
    }
    document.title = u, document.getElementById("htmlID").setAttribute("lang", l), document.getElementById("seoDesc").setAttribute("content", p), document.getElementById("seoKeywords").setAttribute("content", r), document.getElementById("seoOgTitle").setAttribute("content", u), document.getElementById("seoOgSiteName").setAttribute("content", o), document.getElementById("seoSiteIcon").setAttribute("href", c), document.getElementById("seoOgDesc").setAttribute("content", p), document.getElementById("seoOgType").setAttribute("content", a), document.getElementById("seoOgUrl").setAttribute("content", i), document.getElementById("seoTwitterTitle").setAttribute("content", u), document.getElementById("seoTwitterDescription").setAttribute("content", p), document.getElementById("jsonLd").text = d, n()
}), Vue.use(VueLazyload), Vue.prototype.$stripeClientPayKey = "pk_live_ImtNzwZl5f4fgZYTkYoeRt2B", Vue.prototype.$clientAccountId = site.state && site.state.StoreSettings && site.state.StoreSettings.Payment && site.state.StoreSettings.Payment.StripeId ? site.state.StoreSettings.Payment.StripeId : "";
const hiddenMenu = Vue.observable({
    randomNr: 0
});
Object.defineProperty(Vue.prototype, "$hiddenMenu", {
    get: () => hiddenMenu.randomNr,
    set(t) {
        hiddenMenu.randomNr = t
    }
});
const frontApp = new Vue({
    router: router,
    data: {
        checkoutState: checkoutStore.state,
        schedulingState: schedulingStore.state.front,
        hideMenu: !1,
        hideFooter: !1,
        siteState: site.state,
        frontAlertData: {
            show: !1,
            message: ""
        },
        frontConfirmData: {
            show: !1,
            message: "",
            callback: null
        },
        bookingPopUpStore: bookingPopUpStore.state
    },
    methods: {
        alert: function(t) {
            this.frontAlertData.message = t, this.frontAlertData.show = !0
        },
        confirm: function(t, e) {
            this.frontConfirmData.message = t, this.frontConfirmData.show = !0, this.frontConfirmData.confirm = e
        },
        doHideMenu: function(t) {
            this.hideMenu = t
        },
        doHideFooter: function(t) {
            this.hideFooter = t
        }
    }
}).$mount("#frontApp");
let BillingDetails = {
        Name: "",
        Address: {
            Line1: "",
            Line2: "",
            City: "",
            CountryCode: "",
            PostCode: "",
            State: ""
        },
        Email: "",
        Phone: ""
    },
    PaymentDetails = {
        Amount: "",
        Currency: "",
        OrderId: "",
        SiteId: ""
    };
class Billing {
    constructor(t) {
        this.billing = t
    }
    isEmpty() {
        return !(this.billing.Name && this.billing.Address.Line1 && this.billing.Address.City && this.billing.Address.CountryCode && this.billing.Email)
    }
    toObject() {
        return Object.freeze({
            Name: this.billing.Name,
            Address: Object.freeze({
                Line1: this.billing.Address.Line1,
                Line2: this.billing.Address.Line2,
                City: this.billing.Address.City,
                CountryCode: this.billing.Address.CountryCode,
                PostCode: this.billing.Address.PostCode,
                State: this.billing.Address.State
            }),
            Email: this.billing.Email,
            Phone: this.billing.Phone
        })
    }
    static getStripeBillingDetails(t) {
        return {
            billing_details: Object.freeze({
                name: t.Name,
                address: Object.freeze({
                    line1: t.Address.Line1 ? t.Address.Line1 : null,
                    line2: t.Address.Line2 ? t.Address.Line2 : null,
                    city: t.Address.City ? t.Address.City : null,
                    country: t.Address.CountryCode ? t.Address.CountryCode : null,
                    postal_code: t.Address.PostCode ? t.Address.PostCode.toString() : null,
                    state: t.Address.State ? t.Address.State : null
                }),
                email: t.Email ? t.Email : null,
                phone: t.Phone ? t.Phone : null
            })
        }
    }
}
class Payment {
    constructor(t) {
        this.payment = t
    }
    isEmpty() {
        return !(this.payment.Amount && this.payment.Currency && this.payment.OrderId && this.payment.SiteId)
    }
    toObject() {
        return Object.freeze({
            Amount: this.payment.Amount,
            Currency: this.payment.Currency,
            OrderId: this.payment.OrderId,
            SiteId: this.payment.SiteId
        })
    }
}
let stripeClientDataLayer = null,
    stripeClientOptions = null,
    localPostDataClient = null;
const googleApplePayAllowedCountryCodes = ["AE", "AT", "AU", "BE", "BG", "BR", "CA", "CH", "CI", "CR", "CY", "CZ", "DE", "DK", "DO", "EE", "ES", "FI", "FR", "GB", "GI", "GR", "GT", "HK", "HR", "HU", "ID", "IE", "IN", "IT", "JP", "LI", "LT", "LU", "LV", "MT", "MX", "MY", "NL", "NO", "NZ", "PE", "PH", "PL", "PT", "RO", "SE", "SG", "SI", "SK", "SN", "TH", "TT", "US", "UY"];
Vue.component("stripe-client-payment", {
    props: {
        apiUrl: {
            type: String,
            required: !0
        },
        billingDetails: {
            type: Billing,
            required: !0,
            validator: t => "" !== t && !t.isEmpty()
        },
        callback: {
            type: Function,
            required: !0
        },
        paymentDetails: {
            type: Payment,
            required: !0,
            validator: t => "" !== t && !t.isEmpty()
        },
        buttonText: {
            type: String,
            required: !0
        }
    },
    data: function() {
        return {
            amountAndCurrency: "",
            isStripeLoaded: !1,
            isSubmitted: !1,
            isMounted: !1,
            walletButton: void 0
        }
    },
    computed: {
        elements() {
            return this.$stripeClient.elements()
        },
        card() {
            return this.elements.create("cardNumber", {
                style: this.elementStyles
            })
        },
        exp() {
            return this.elements.create("cardExpiry", {
                style: this.elementStyles
            })
        },
        cvc() {
            return this.elements.create("cardCvc", {
                style: this.elementStyles
            })
        },
        form: () => document.getElementById("stripe-payment-form"),
        elementStyles() {
            let t, e, n = "#000000",
                i = "'HelveticaNeue,'Helvetica Neue',Helvetica,Arial,sans-serif'",
                o = "#A8A9AD";
            return (t = document.querySelector(".stripeClientPaymentWindow")) && (e = getComputedStyle(t)) && (n = e.color, o = e.color, i = e.fontFamily), {
                base: {
                    color: n,
                    fontWeight: 300,
                    fontFamily: i,
                    fontSize: "13px",
                    fontSmoothing: "antialiased",
                    "::placeholder": {
                        color: o
                    }
                },
                invalid: {
                    color: "#E8274B",
                    iconColor: "#E8274B",
                    ":focus": {
                        color: "#E8274B"
                    },
                    "::placeholder": {
                        color: "#E8274B"
                    }
                }
            }
        },
        getUUID4() {
            let t = [];
            for (let e = 0; e < 256; e++) t[e] = (e < 16 ? "0" : "") + e.toString(16);
            let e = 4294967295 * Math.random() | 0,
                n = 4294967295 * Math.random() | 0,
                i = 4294967295 * Math.random() | 0,
                o = 4294967295 * Math.random() | 0;
            return t[255 & e] + t[e >> 8 & 255] + t[e >> 16 & 255] + t[e >> 24 & 255] + "-" + t[255 & n] + t[n >> 8 & 255] + "-" + t[n >> 16 & 15 | 64] + t[n >> 24 & 255] + "-" + t[63 & i | 128] + t[i >> 8 & 255] + "-" + t[i >> 16 & 255] + t[i >> 24 & 255] + t[255 & o] + t[o >> 8 & 255] + t[o >> 16 & 255] + t[o >> 24 & 255]
        }
    },
    methods: {
        initStripeElements() {
            let t = t => {
                let e = t;
                t ? (t.response ? (e = t.response).data && (e = e.data).response && (e = e.response) : t.data && (e = t.data).response && (e = e.response), e.statusText && (e.message = e.statusText)) : e = "Something went wrong", e.code && e.message && "account_invalid" === e.code && (e.message = "The provided key does not have access to provided account or that account does not exist. Application access may have been revoked."), this.callbackToParent(null, e)
            };
            if (this.$stripeClient)
                if (this.$stripeClient && this.$stripeClientPayKey && this.$clientAccountId) {
                    this.card.mount("#card-number"), this.exp.mount("#card-expiry"), this.cvc.mount("#card-cvc");
                    const e = this.amountAndCurrency;
                    let n = (t, n = !1) => {
                            this.isSubmitted = t, this.form.stripePaymentButton.disabled = t, t ? (this.$emit("stripepaymentloading", t), n && this.$emit("stripepaymentloading", !1)) : this.$emit("stripepaymentloading", !1), n && this.$emit("stripepaymentloading", !1);
                            let i = n ? ", Payment Complete" : ", Processing...";
                            this.amountAndCurrency = !1 === t ? e : e + i
                        },
                        i = async (e, i) => {
                            let o = e;
                            o.$emit("stripepaymentloading", !0), n(!0, !1);
                            let s = function(e) {
                                    i && i.complete("fail"), n(!1, !1), e && t(e)
                                },
                                r = function() {
                                    i && i.complete("success"), n(!0, !0)
                                };
                            (stripeClientOptions = Billing.getStripeBillingDetails(stripeClientDataLayer.billing)).metadata = Object.freeze({
                                order_id: stripeClientDataLayer.payment.OrderId,
                                site_id: stripeClientDataLayer.payment.SiteId,
                                account_id: o.$clientAccountId,
                                email: stripeClientOptions.billing_details.email,
                                amount: stripeClientDataLayer.payment.Amount,
                                currency: stripeClientDataLayer.payment.Currency.toLocaleLowerCase()
                            });
                            try {
                                let t = "",
                                    e = void 0;
                                if (i && i.paymentMethod && (e = i.paymentMethod), e && e.id && "" !== e.id) t = e.id, stripeClientOptions.is_wallet_pay = !0;
                                else {
                                    const {
                                        paymentMethod: e,
                                        error: n
                                    } = await o.$stripeClient.createPaymentMethod("card", o.card, stripeClientOptions);
                                    if (n) return stripeClientOptions = null, void s(n);
                                    t = e.id
                                }
                                "" !== t && await (async () => {
                                    try {
                                        const {
                                            data: e,
                                            error: n
                                        } = await axios.post(o.apiUrl, {
                                            payment_method: t,
                                            options: JSON.stringify(stripeClientOptions),
                                            confirm: "false"
                                        });
                                        if (n || e.status && 200 !== e.status) s(n);
                                        else {
                                            let t = e;
                                            if (void 0 !== t.response && void 0 !== t.response.payment_intent_client_secret && !0 === t.response.requires_action && void 0 !== t.response.payload) {
                                                const {
                                                    paymentIntent: n,
                                                    error: i
                                                } = await o.$stripeClient.handleCardAction(e.response.payment_intent_client_secret);
                                                i || e.status && 200 !== e.status ? s(i) : await (async () => {
                                                    try {
                                                        const {
                                                            data: e,
                                                            error: i
                                                        } = await axios.post(o.apiUrl, {
                                                            payload: t.response.payload,
                                                            payment_intent: n.id,
                                                            confirm: "true"
                                                        });
                                                        i ? s(i) : (o.callbackToParent(e, null), r())
                                                    } catch (t) {
                                                        s(t)
                                                    }
                                                })()
                                            } else o.callbackToParent(e, null), r()
                                        }
                                    } catch (t) {
                                        s(t)
                                    }
                                })()
                            } catch (t) {
                                s(t)
                            }
                        }, o = t => {
                            let e = t;
                            if (stripeClientDataLayer && stripeClientDataLayer.billing && stripeClientDataLayer.billing.Address && "" !== stripeClientDataLayer.billing.Address.CountryCode && stripeClientDataLayer.payment && stripeClientDataLayer.payment.Amount > 0 && "" !== stripeClientDataLayer.payment.Currency) {
                                let t = stripeClientDataLayer.billing.Address.CountryCode.toUpperCase();
                                if (!googleApplePayAllowedCountryCodes.includes(t)) return;
                                let n = t => ({
                                        label: "Pay (" + stripeClientDataLayer.payment.OrderId + ")",
                                        amount: Number(parseFloat(100 * stripeClientDataLayer.payment.Amount).toFixed(0))
                                    }),
                                    o = e.$stripeClient.paymentRequest({
                                        country: t,
                                        currency: stripeClientDataLayer.payment.Currency.toLocaleLowerCase(),
                                        total: n(stripeClientDataLayer.payment.Amount),
                                        requestPayerName: !0,
                                        requestPayerEmail: !0,
                                        disableWallets: ["link"]
                                    });
                                e.walletButton = e.elements.create("paymentRequestButton", {
                                    paymentRequest: o,
                                    style: {
                                        paymentRequestButton: {
                                            type: "default",
                                            theme: "dark",
                                            height: "40px"
                                        }
                                    }
                                });
                                const s = function() {
                                    let t = document.getElementById("payment-request-button");
                                    t && (t.style.display = "none")
                                };
                                (async () => {
                                    const t = await o.canMakePayment();
                                    if (t) {
                                        if (!t.applePay && !t.googlePay) return void s();
                                        let n = document.getElementById("mobilePaymentOptions");
                                        setTimeout(function() {
                                            document.getElementById("payment-request-button") && n && (e.walletButton.mount("#payment-request-button"), n.style.display = "block", o.on("paymentmethod", async t => {
                                                await i(e, t)
                                            }))
                                        }, 50)
                                    } else s()
                                })()
                            }
                        };
                    this.form.addEventListener("submit", async t => {
                        this.isMounted = !0, this.isSubmitted || await i(this)
                    }), this.isSubmitted || o(this)
                } else t({
                    error: {
                        response: {
                            message: "Incomplete account settings or could not load stripe. Please try again."
                        }
                    }
                })
        },
        callbackToParent(t, e) {
            this.callback ? this.callback(t, e) : console.log(t, e)
        }
    },
    created() {
        stripeClientDataLayer = {}, stripeClientDataLayer = {
            billing: this.billingDetails.toObject(),
            payment: this.paymentDetails.toObject()
        }, this.amountAndCurrency = stripeClientDataLayer.payment.Amount + " " + stripeClientDataLayer.payment.Currency.toUpperCase()
    },
    beforeMount() {
        let t = () => {
            if (window.Stripe) this.$stripeClient = Stripe(this.$stripeClientPayKey, {
                stripeAccount: this.$clientAccountId
            });
            else {
                let t = document.querySelector("#stripe-js");
                t && t.addEventListener("load", () => {
                    this.$stripeClient = Stripe(this.$stripeClientPayKey, {
                        stripeAccount: this.$clientAccountId
                    })
                })
            }
            return null !== this.$stripeClient
        };
        if (this.$stripeClient = null, window.Stripe) this.isStripeLoaded = t();
        else {
            let e = 0,
                n = 10;
            const i = setInterval(() => {
                e++, t() ? (this.isStripeLoaded = !0, clearInterval(i)) : e >= n && clearInterval(i)
            }, 1)
        }
    },
    mounted: function() {
        this.isStripeLoaded && this.initStripeElements()
    },
    updated: function() {
        this.isStripeLoaded && !this.isMounted && this.initStripeElements()
    },
    beforeDestroy: function() {
        BillingDetails = null, PaymentDetails = null, stripeClientDataLayer = null, stripeClientOptions = null, localPostDataClient = null, this.card.unmount(), this.card.destroy(), this.exp.unmount(), this.exp.destroy(), this.cvc.unmount(), this.cvc.destroy(), this.form.removeEventListener("submit", () => {}), this.form.remove()
    },
    template: '<div class="stripeClientPaymentWindow">             <div class="stripe-payment-form" :id="this.getUUID4">                 <form @submit.prevent id="stripe-payment-form" v-if="isStripeLoaded">                     <div class="popWhiteBox">                        <div class="row"> \t\t\t\t\t\t    <div class="field card-number">\t\t\t\t\t\t\t\t<span class="infoHead">Card Number</span>\t\t\t\t\t\t\t\t<div id="card-number" class="stripe-input"></div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t</div>                         <div class="row twoInputs">\t\t\t\t\t\t\t<div class="field card-expiry">\t\t\t\t\t\t\t\t<span class="infoHead">Expiry Date</span>\t\t\t\t\t\t\t\t<div id="card-expiry" class="stripe-input"></div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t\t<div class="field card-cvc">\t\t\t\t\t\t\t\t<span class="infoHead">CVC</span>\t\t\t\t\t\t\t\t<div id="card-cvc" class="stripe-input"></div> \t\t\t\t\t\t\t</div> \t\t\t\t\t\t</div> \t\t\t\t\t\t<div class="buttonRow buttonRowWrap">                             <button id="payment-button" name="stripePaymentButton" class="Button buttonWrap inheritButtonStyle" type="submit">{{buttonText}} ({{amountAndCurrency}})</button>                         </div> \t\t\t\t\t\t<div class="row icons">\t\t\t\t\t\t\t<span class="icon ficon-credit-card"></span>\t\t\t\t\t\t\t<span class="icon ficon-visa-card"></span>\t\t\t\t\t\t\t<span class="icon ficon-master-card"></span>\t\t\t\t\t\t</div> \t                    <div class="row stripeExp">The Payment is secured by Stripe.</div>                     </div>                 </form>                 <div id="mobilePaymentOptions" class="mobilePaymentOptions">                    <div class="headerMobile">Or choose to pay with mobile</div>                    <div id="payment-request-button">\x3c!-- A Stripe Element will be inserted here. --\x3e</div>                </div>                <div id="stripe-pre-loading" v-if="!isStripeLoaded"><div class="loadingStripe"></div><span>Loading.....</span></div>             </div>        </div>'
});
let PayPalBillingDetails = {
        Name: "",
        Address: {
            Line1: "",
            City: "",
            PostCode: "",
            State: ""
        },
        Email: ""
    },
    PayPalPaymentDetails = {
        Amount: "",
        Currency: "",
        OrderId: "",
        SiteId: "",
        Tax: "",
        ShippingCost: "",
        ShopName: "",
        PayPalEmail: ""
    };
class PayPalBilling {
    constructor(t) {
        this.billing = t
    }
    isEmpty() {
        return !(this.billing.Name && this.billing.Address.Line1 && this.billing.Address.City && this.billing.Email)
    }
    toObject() {
        return Object.freeze({
            Name: this.billing.Name,
            Address: Object.freeze({
                Line1: this.billing.Address.Line1,
                City: this.billing.Address.City,
                PostCode: this.billing.Address.PostCode,
                State: this.billing.Address.State
            }),
            Email: this.billing.Email
        })
    }
    static getPayPalBillingDetails(t) {
        return {
            billing_details: Object.freeze({
                name: t.Name,
                address: Object.freeze({
                    line1: t.Address.Line1 ? t.Address.Line1 : null,
                    city: t.Address.City ? t.Address.City : null,
                    postal_code: t.Address.PostCode ? t.Address.PostCode.toString() : null,
                    state: t.Address.State ? t.Address.State : null
                }),
                email: t.Email ? t.Email : null
            })
        }
    }
}
class PayPalPayment {
    constructor(t) {
        this.payment = t
    }
    isEmpty() {
        return !(this.payment.Amount && this.payment.Currency && this.payment.OrderId && this.payment.SiteId && this.payment.ShopName && this.payment.PayPalEmail)
    }
    toObject() {
        return Object.freeze({
            Amount: this.payment.Amount,
            Currency: this.payment.Currency.toUpperCase(),
            OrderId: this.payment.OrderId,
            SiteId: this.payment.SiteId,
            Tax: this.payment.Tax,
            ShippingCost: this.payment.ShippingCost,
            ShopName: this.payment.ShopName,
            PayPalEmail: this.payment.PayPalEmail
        })
    }
}
Vue.component("paypal-client-payment", {
        props: {
            isLive: {
                type: String,
                required: !0
            },
            apiUrl: {
                type: String,
                required: !0
            },
            billingDetails: {
                type: PayPalBilling,
                required: !0,
                validator: t => "" !== t && !t.isEmpty()
            },
            paymentDetails: {
                type: PayPalPayment,
                required: !0,
                validator: t => "" !== t && !t.isEmpty()
            },
            callback: {
                type: Function,
                required: !0
            }
        },
        data: function() {
            return {
                canPay: !1,
                trans: translations.state,
                amountAndCurrency: ""
            }
        },
        computed: {
            getUrl: () => "https://www.paypal.com/cgi-bin/webscr",
            getNotifyUrl() {
                return "https://www.portfoliobox.net" + this.apiUrl + "/" + this.paymentDetails.payment.OrderId + "/" + this.paymentDetails.payment.SiteId
            },
            getCancelPageUrl: () => window.location.href,
            getReturnPageUrl: () => window.location.href + "?paypal=paid",
            getUUID4() {
                for (var t = [], e = 0; e < 256; e++) t[e] = (e < 16 ? "0" : "") + e.toString(16);
                var n = 4294967295 * Math.random() | 0,
                    i = 4294967295 * Math.random() | 0,
                    o = 4294967295 * Math.random() | 0,
                    s = 4294967295 * Math.random() | 0;
                return t[255 & n] + t[n >> 8 & 255] + t[n >> 16 & 255] + t[n >> 24 & 255] + "-" + t[255 & i] + t[i >> 8 & 255] + "-" + t[i >> 16 & 15 | 64] + t[i >> 24 & 255] + "-" + t[63 & o | 128] + t[o >> 8 & 255] + "-" + t[o >> 16 & 255] + t[o >> 24 & 255] + t[255 & s] + t[s >> 8 & 255] + t[s >> 16 & 255] + t[s >> 24 & 255]
            },
            paymentData() {
                return {
                    billing: this.billingDetails.toObject(),
                    payment: this.paymentDetails.toObject()
                }
            }
        },
        methods: {},
        created() {
            let t = function(t) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(t).toLowerCase())
            };
            if (!this.paymentData.billing.Name || "" === this.paymentData.billing.Name.trim()) return this.callback(null, {
                message: "Missing Billing Name"
            }), !1;
            if (!this.paymentData.billing.Address.Line1 || "" === this.paymentData.billing.Address.Line1.trim()) return this.callback(null, {
                message: "Missing Address"
            }), !1;
            if (!this.paymentData.billing.Address.City || "" === this.paymentData.billing.Address.City.trim()) return this.callback(null, {
                message: "Missing City"
            }), !1;
            if (!this.paymentData.billing.Address.PostCode || "" === this.paymentData.billing.Address.PostCode.trim()) return this.callback(null, {
                message: "Missing Post Code"
            }), !1;
            if (!this.paymentData.billing.Email || "" === this.paymentData.billing.Email.trim()) return this.callback(null, {
                message: "Missing Buyer Email"
            }), !1;
            if (!t(this.paymentData.billing.Email.trim())) return this.callback(null, {
                message: "Invalid Buyer Email"
            }), !1;
            if (this.paymentData.payment.Amount < 1) return this.callback(null, {
                message: "Invalid Price, the price is less than 1"
            }), !1;
            if (!this.paymentData.payment.Currency || "" === this.paymentData.payment.Currency.trim()) return this.callback(null, {
                message: "Missing Currency"
            }), !1;
            if (!this.paymentData.payment.OrderId || "" === this.paymentData.payment.OrderId.trim()) return this.callback(null, {
                message: "Missing Order"
            }), !1;
            if (!this.paymentData.payment.SiteId || "" === this.paymentData.payment.SiteId.trim()) return this.callback(null, {
                message: "Missing Site"
            }), !1;
            if (!this.paymentData.payment.ShopName || "" === this.paymentData.payment.ShopName.trim()) return this.callback(null, {
                message: "Missing Site URL"
            }), !1;
            if (!this.paymentData.payment.PayPalEmail || "" === this.paymentData.payment.PayPalEmail.trim()) return this.callback(null, {
                message: "Missing PayPal Email"
            }), !1;
            if (!t(this.paymentData.payment.PayPalEmail.trim())) return this.callback(null, {
                message: "Invalid PayPal Email"
            }), !1;
            this.canPay = !0;
            let e = this.paymentData.payment.Amount;
            this.amountAndCurrency = e + " " + this.paymentData.payment.Currency
        },
        beforeMount() {},
        mounted: function() {},
        updated: function() {},
        beforeDestroy: function() {
            PayPalBillingDetails = null, PayPalPaymentDetails = null, this.form && (this.form.removeEventListener("submit", () => {}), this.form.remove())
        },
        template: '<div class="paypalClientPaymentWindow">             <div class="paypal-payment-form" :id="this.getUUID4">                 <form id="paypal-payment-form" :action="this.getUrl" method="post" v-if="canPay">                     \x3c!-- Identify your business so that you can collect the payments. --\x3e                    <input type="hidden" name="business" :value="this.paymentData.payment.PayPalEmail">                    \x3c!-- Specify a Buy Now button. --\x3e                    <input type="hidden" name="cmd" value="_xclick">                    \x3c!-- Specify details about the item that buyers will purchase. --\x3e                    <input type="hidden" name="item_name" :value="this.paymentData.payment.ShopName">                    \x3c!-- Specify details about product. --\x3e                    <input type="hidden" name="amount" :value="this.paymentData.payment.Amount">                    <input type="hidden" name="currency_code" :value="this.paymentData.payment.Currency">                    <input type="hidden" name="invoice" :value="this.paymentData.payment.OrderId">                    <input type="hidden" name="item_number" :value="this.paymentData.payment.OrderId">                    <input type="hidden" name="custom" :value="this.paymentData.payment.SiteId">                    \x3c!--<input type="hidden" name="tax" :value="this.paymentData.payment.Tax">--\x3e                    \x3c!--<input type="hidden" name="shipping" :value="this.paymentData.payment.ShippingCost">--\x3e                    \x3c!--    Do not prompt for an address.--\x3e                    <input type="hidden" name="no_shipping" value="1">                    <input type="hidden" name="email" :value="this.paymentData.billing.Email">                    \x3c!--    The buyer\'s browser is redirected to the return URL by using the POST method, and all payment variables are included--\x3e                    <input type="hidden" name="rm" value="2">                    \x3c!-- Call backs. --\x3e                    <input type="hidden" name="notify_url" :value="this.getNotifyUrl">                    <input type="hidden" name="return" :value="this.getReturnPageUrl">                    <input type="hidden" name="cancel_return" :value="this.getCancelPageUrl">                    \x3c!-- Display the payment button. --\x3e                    <button id="payment-button" class="Button buttonWrap inheritButtonStyle" type="submit">{{trans.OpenPayPal}} ({{amountAndCurrency}})</button>                </form>                 <div class="row icons">                    <span class="icon ficon-paypal"></span>                    <span class="icon ficon-credit-card"></span>                    <span class="icon ficon-visa-card"></span>                    <span class="icon ficon-master-card"></span>                </div>                 <div class="row stripeExp">The Payment is secured by PayPal.</div>             </div>        </div>'
    }),
    function(t, e) {
        "use strict";
        "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
            if (!t.document) throw new Error("jQuery requires a window with a document");
            return e(t)
        } : e(t)
    }("undefined" != typeof window ? window : this, function(t, e) {
        "use strict";
        var n = [],
            i = t.document,
            o = Object.getPrototypeOf,
            s = n.slice,
            r = n.concat,
            a = n.push,
            l = n.indexOf,
            c = {},
            d = c.toString,
            u = c.hasOwnProperty,
            p = u.toString,
            m = p.call(Object),
            h = {},
            v = function(t) {
                return "function" == typeof t && "number" != typeof t.nodeType
            },
            f = function(t) {
                return null != t && t === t.window
            },
            g = {
                type: !0,
                src: !0,
                noModule: !0
            };

        function b(t, e, n) {
            var o, s = (e = e || i).createElement("script");
            if (s.text = t, n)
                for (o in g) n[o] && (s[o] = n[o]);
            e.head.appendChild(s).parentNode.removeChild(s)
        }

        function y(t) {
            return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? c[d.call(t)] || "object" : typeof t
        }
        var C = function(t, e) {
                return new C.fn.init(t, e)
            },
            S = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

        function w(t) {
            var e = !!t && "length" in t && t.length,
                n = y(t);
            return !v(t) && !f(t) && ("array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
        }
        C.fn = C.prototype = {
            jquery: "3.3.1",
            constructor: C,
            length: 0,
            toArray: function() {
                return s.call(this)
            },
            get: function(t) {
                return null == t ? s.call(this) : t < 0 ? this[t + this.length] : this[t]
            },
            pushStack: function(t) {
                var e = C.merge(this.constructor(), t);
                return e.prevObject = this, e
            },
            each: function(t) {
                return C.each(this, t)
            },
            map: function(t) {
                return this.pushStack(C.map(this, function(e, n) {
                    return t.call(e, n, e)
                }))
            },
            slice: function() {
                return this.pushStack(s.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(t) {
                var e = this.length,
                    n = +t + (t < 0 ? e : 0);
                return this.pushStack(n >= 0 && n < e ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: a,
            sort: n.sort,
            splice: n.splice
        }, C.extend = C.fn.extend = function() {
            var t, e, n, i, o, s, r = arguments[0] || {},
                a = 1,
                l = arguments.length,
                c = !1;
            for ("boolean" == typeof r && (c = r, r = arguments[a] || {}, a++), "object" == typeof r || v(r) || (r = {}), a === l && (r = this, a--); a < l; a++)
                if (null != (t = arguments[a]))
                    for (e in t) n = r[e], r !== (i = t[e]) && (c && i && (C.isPlainObject(i) || (o = Array.isArray(i))) ? (o ? (o = !1, s = n && Array.isArray(n) ? n : []) : s = n && C.isPlainObject(n) ? n : {}, r[e] = C.extend(c, s, i)) : void 0 !== i && (r[e] = i));
            return r
        }, C.extend({
            expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(t) {
                throw new Error(t)
            },
            noop: function() {},
            isPlainObject: function(t) {
                var e, n;
                return !(!t || "[object Object]" !== d.call(t) || (e = o(t)) && ("function" != typeof(n = u.call(e, "constructor") && e.constructor) || p.call(n) !== m))
            },
            isEmptyObject: function(t) {
                var e;
                for (e in t) return !1;
                return !0
            },
            globalEval: function(t) {
                b(t)
            },
            each: function(t, e) {
                var n, i = 0;
                if (w(t))
                    for (n = t.length; i < n && !1 !== e.call(t[i], i, t[i]); i++);
                else
                    for (i in t)
                        if (!1 === e.call(t[i], i, t[i])) break;
                return t
            },
            trim: function(t) {
                return null == t ? "" : (t + "").replace(S, "")
            },
            makeArray: function(t, e) {
                var n = e || [];
                return null != t && (w(Object(t)) ? C.merge(n, "string" == typeof t ? [t] : t) : a.call(n, t)), n
            },
            inArray: function(t, e, n) {
                return null == e ? -1 : l.call(e, t, n)
            },
            merge: function(t, e) {
                for (var n = +e.length, i = 0, o = t.length; i < n; i++) t[o++] = e[i];
                return t.length = o, t
            },
            grep: function(t, e, n) {
                for (var i = [], o = 0, s = t.length, r = !n; o < s; o++) !e(t[o], o) !== r && i.push(t[o]);
                return i
            },
            map: function(t, e, n) {
                var i, o, s = 0,
                    a = [];
                if (w(t))
                    for (i = t.length; s < i; s++) null != (o = e(t[s], s, n)) && a.push(o);
                else
                    for (s in t) null != (o = e(t[s], s, n)) && a.push(o);
                return r.apply([], a)
            },
            guid: 1,
            support: h
        }), "function" == typeof Symbol && (C.fn[Symbol.iterator] = n[Symbol.iterator]), C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
            c["[object " + e + "]"] = e.toLowerCase()
        });
        var k = function(t) {
            var e, n, i, o, s, r, a, l, c, d, u, p, m, h, v, f, g, b, y, C = "sizzle" + 1 * new Date,
                S = t.document,
                w = 0,
                k = 0,
                x = rt(),
                T = rt(),
                P = rt(),
                I = function(t, e) {
                    return t === e && (u = !0), 0
                },
                E = {}.hasOwnProperty,
                A = [],
                F = A.pop,
                L = A.push,
                G = A.push,
                N = A.slice,
                O = function(t, e) {
                    for (var n = 0, i = t.length; n < i; n++)
                        if (t[n] === e) return n;
                    return -1
                },
                D = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                _ = "[\\x20\\t\\r\\n\\f]",
                B = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
                V = "\\[" + _ + "*(" + B + ")(?:" + _ + "*([*^$|!~]?=)" + _ + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + B + "))|)" + _ + "*\\]",
                $ = ":(" + B + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + V + ")*)|.*)\\)|)",
                M = new RegExp(_ + "+", "g"),
                W = new RegExp("^" + _ + "+|((?:^|[^\\\\])(?:\\\\.)*)" + _ + "+$", "g"),
                R = new RegExp("^" + _ + "*," + _ + "*"),
                j = new RegExp("^" + _ + "*([>+~]|" + _ + ")" + _ + "*"),
                q = new RegExp("=" + _ + "*([^\\]'\"]*?)" + _ + "*\\]", "g"),
                H = new RegExp($),
                U = new RegExp("^" + B + "$"),
                z = {
                    ID: new RegExp("^#(" + B + ")"),
                    CLASS: new RegExp("^\\.(" + B + ")"),
                    TAG: new RegExp("^(" + B + "|[*])"),
                    ATTR: new RegExp("^" + V),
                    PSEUDO: new RegExp("^" + $),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + _ + "*(even|odd|(([+-]|)(\\d*)n|)" + _ + "*(?:([+-]|)" + _ + "*(\\d+)|))" + _ + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + D + ")$", "i"),
                    needsContext: new RegExp("^" + _ + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + _ + "*((?:-\\d)?\\d*)" + _ + "*\\)|)(?=[^-]|$)", "i")
                },
                Q = /^(?:input|select|textarea|button)$/i,
                K = /^h\d$/i,
                Y = /^[^{]+\{\s*\[native \w/,
                X = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                Z = /[+~]/,
                J = new RegExp("\\\\([\\da-f]{1,6}" + _ + "?|(" + _ + ")|.)", "ig"),
                tt = function(t, e, n) {
                    var i = "0x" + e - 65536;
                    return i != i || n ? e : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                },
                et = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                nt = function(t, e) {
                    return e ? "\0" === t ? "�" : t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " " : "\\" + t
                },
                it = function() {
                    p()
                },
                ot = bt(function(t) {
                    return !0 === t.disabled && ("form" in t || "label" in t)
                }, {
                    dir: "parentNode",
                    next: "legend"
                });
            try {
                G.apply(A = N.call(S.childNodes), S.childNodes), A[S.childNodes.length].nodeType
            } catch (t) {
                G = {
                    apply: A.length ? function(t, e) {
                        L.apply(t, N.call(e))
                    } : function(t, e) {
                        for (var n = t.length, i = 0; t[n++] = e[i++];);
                        t.length = n - 1
                    }
                }
            }

            function st(t, e, i, o) {
                var s, a, c, d, u, h, g, b = e && e.ownerDocument,
                    w = e ? e.nodeType : 9;
                if (i = i || [], "string" != typeof t || !t || 1 !== w && 9 !== w && 11 !== w) return i;
                if (!o && ((e ? e.ownerDocument || e : S) !== m && p(e), e = e || m, v)) {
                    if (11 !== w && (u = X.exec(t)))
                        if (s = u[1]) {
                            if (9 === w) {
                                if (!(c = e.getElementById(s))) return i;
                                if (c.id === s) return i.push(c), i
                            } else if (b && (c = b.getElementById(s)) && y(e, c) && c.id === s) return i.push(c), i
                        } else {
                            if (u[2]) return G.apply(i, e.getElementsByTagName(t)), i;
                            if ((s = u[3]) && n.getElementsByClassName && e.getElementsByClassName) return G.apply(i, e.getElementsByClassName(s)), i
                        } if (n.qsa && !P[t + " "] && (!f || !f.test(t))) {
                        if (1 !== w) b = e, g = t;
                        else if ("object" !== e.nodeName.toLowerCase()) {
                            for ((d = e.getAttribute("id")) ? d = d.replace(et, nt) : e.setAttribute("id", d = C), a = (h = r(t)).length; a--;) h[a] = "#" + d + " " + gt(h[a]);
                            g = h.join(","), b = Z.test(t) && vt(e.parentNode) || e
                        }
                        if (g) try {
                            return G.apply(i, b.querySelectorAll(g)), i
                        } catch (t) {} finally {
                            d === C && e.removeAttribute("id")
                        }
                    }
                }
                return l(t.replace(W, "$1"), e, i, o)
            }

            function rt() {
                var t = [];
                return function e(n, o) {
                    return t.push(n + " ") > i.cacheLength && delete e[t.shift()], e[n + " "] = o
                }
            }

            function at(t) {
                return t[C] = !0, t
            }

            function lt(t) {
                var e = m.createElement("fieldset");
                try {
                    return !!t(e)
                } catch (t) {
                    return !1
                } finally {
                    e.parentNode && e.parentNode.removeChild(e), e = null
                }
            }

            function ct(t, e) {
                for (var n = t.split("|"), o = n.length; o--;) i.attrHandle[n[o]] = e
            }

            function dt(t, e) {
                var n = e && t,
                    i = n && 1 === t.nodeType && 1 === e.nodeType && t.sourceIndex - e.sourceIndex;
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === e) return -1;
                return t ? 1 : -1
            }

            function ut(t) {
                return function(e) {
                    return "input" === e.nodeName.toLowerCase() && e.type === t
                }
            }

            function pt(t) {
                return function(e) {
                    var n = e.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && e.type === t
                }
            }

            function mt(t) {
                return function(e) {
                    return "form" in e ? e.parentNode && !1 === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ot(e) === t : e.disabled === t : "label" in e && e.disabled === t
                }
            }

            function ht(t) {
                return at(function(e) {
                    return e = +e, at(function(n, i) {
                        for (var o, s = t([], n.length, e), r = s.length; r--;) n[o = s[r]] && (n[o] = !(i[o] = n[o]))
                    })
                })
            }

            function vt(t) {
                return t && void 0 !== t.getElementsByTagName && t
            }
            for (e in n = st.support = {}, s = st.isXML = function(t) {
                    var e = t && (t.ownerDocument || t).documentElement;
                    return !!e && "HTML" !== e.nodeName
                }, p = st.setDocument = function(t) {
                    var e, o, r = t ? t.ownerDocument || t : S;
                    return r !== m && 9 === r.nodeType && r.documentElement ? (h = (m = r).documentElement, v = !s(m), S !== m && (o = m.defaultView) && o.top !== o && (o.addEventListener ? o.addEventListener("unload", it, !1) : o.attachEvent && o.attachEvent("onunload", it)), n.attributes = lt(function(t) {
                        return t.className = "i", !t.getAttribute("className")
                    }), n.getElementsByTagName = lt(function(t) {
                        return t.appendChild(m.createComment("")), !t.getElementsByTagName("*").length
                    }), n.getElementsByClassName = Y.test(m.getElementsByClassName), n.getById = lt(function(t) {
                        return h.appendChild(t).id = C, !m.getElementsByName || !m.getElementsByName(C).length
                    }), n.getById ? (i.filter.ID = function(t) {
                        var e = t.replace(J, tt);
                        return function(t) {
                            return t.getAttribute("id") === e
                        }
                    }, i.find.ID = function(t, e) {
                        if (void 0 !== e.getElementById && v) {
                            var n = e.getElementById(t);
                            return n ? [n] : []
                        }
                    }) : (i.filter.ID = function(t) {
                        var e = t.replace(J, tt);
                        return function(t) {
                            var n = void 0 !== t.getAttributeNode && t.getAttributeNode("id");
                            return n && n.value === e
                        }
                    }, i.find.ID = function(t, e) {
                        if (void 0 !== e.getElementById && v) {
                            var n, i, o, s = e.getElementById(t);
                            if (s) {
                                if ((n = s.getAttributeNode("id")) && n.value === t) return [s];
                                for (o = e.getElementsByName(t), i = 0; s = o[i++];)
                                    if ((n = s.getAttributeNode("id")) && n.value === t) return [s]
                            }
                            return []
                        }
                    }), i.find.TAG = n.getElementsByTagName ? function(t, e) {
                        return void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t) : n.qsa ? e.querySelectorAll(t) : void 0
                    } : function(t, e) {
                        var n, i = [],
                            o = 0,
                            s = e.getElementsByTagName(t);
                        if ("*" === t) {
                            for (; n = s[o++];) 1 === n.nodeType && i.push(n);
                            return i
                        }
                        return s
                    }, i.find.CLASS = n.getElementsByClassName && function(t, e) {
                        if (void 0 !== e.getElementsByClassName && v) return e.getElementsByClassName(t)
                    }, g = [], f = [], (n.qsa = Y.test(m.querySelectorAll)) && (lt(function(t) {
                        h.appendChild(t).innerHTML = "<a id='" + C + "'></a><select id='" + C + "-\r\\' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && f.push("[*^$]=" + _ + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || f.push("\\[" + _ + "*(?:value|" + D + ")"), t.querySelectorAll("[id~=" + C + "-]").length || f.push("~="), t.querySelectorAll(":checked").length || f.push(":checked"), t.querySelectorAll("a#" + C + "+*").length || f.push(".#.+[+~]")
                    }), lt(function(t) {
                        t.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                        var e = m.createElement("input");
                        e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && f.push("name" + _ + "*[*^$|!~]?="), 2 !== t.querySelectorAll(":enabled").length && f.push(":enabled", ":disabled"), h.appendChild(t).disabled = !0, 2 !== t.querySelectorAll(":disabled").length && f.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), f.push(",.*:")
                    })), (n.matchesSelector = Y.test(b = h.matches || h.webkitMatchesSelector || h.mozMatchesSelector || h.oMatchesSelector || h.msMatchesSelector)) && lt(function(t) {
                        n.disconnectedMatch = b.call(t, "*"), b.call(t, "[s!='']:x"), g.push("!=", $)
                    }), f = f.length && new RegExp(f.join("|")), g = g.length && new RegExp(g.join("|")), e = Y.test(h.compareDocumentPosition), y = e || Y.test(h.contains) ? function(t, e) {
                        var n = 9 === t.nodeType ? t.documentElement : t,
                            i = e && e.parentNode;
                        return t === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(i)))
                    } : function(t, e) {
                        if (e)
                            for (; e = e.parentNode;)
                                if (e === t) return !0;
                        return !1
                    }, I = e ? function(t, e) {
                        if (t === e) return u = !0, 0;
                        var i = !t.compareDocumentPosition - !e.compareDocumentPosition;
                        return i || (1 & (i = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1) || !n.sortDetached && e.compareDocumentPosition(t) === i ? t === m || t.ownerDocument === S && y(S, t) ? -1 : e === m || e.ownerDocument === S && y(S, e) ? 1 : d ? O(d, t) - O(d, e) : 0 : 4 & i ? -1 : 1)
                    } : function(t, e) {
                        if (t === e) return u = !0, 0;
                        var n, i = 0,
                            o = t.parentNode,
                            s = e.parentNode,
                            r = [t],
                            a = [e];
                        if (!o || !s) return t === m ? -1 : e === m ? 1 : o ? -1 : s ? 1 : d ? O(d, t) - O(d, e) : 0;
                        if (o === s) return dt(t, e);
                        for (n = t; n = n.parentNode;) r.unshift(n);
                        for (n = e; n = n.parentNode;) a.unshift(n);
                        for (; r[i] === a[i];) i++;
                        return i ? dt(r[i], a[i]) : r[i] === S ? -1 : a[i] === S ? 1 : 0
                    }, m) : m
                }, st.matches = function(t, e) {
                    return st(t, null, null, e)
                }, st.matchesSelector = function(t, e) {
                    if ((t.ownerDocument || t) !== m && p(t), e = e.replace(q, "='$1']"), n.matchesSelector && v && !P[e + " "] && (!g || !g.test(e)) && (!f || !f.test(e))) try {
                        var i = b.call(t, e);
                        if (i || n.disconnectedMatch || t.document && 11 !== t.document.nodeType) return i
                    } catch (t) {}
                    return st(e, m, null, [t]).length > 0
                }, st.contains = function(t, e) {
                    return (t.ownerDocument || t) !== m && p(t), y(t, e)
                }, st.attr = function(t, e) {
                    (t.ownerDocument || t) !== m && p(t);
                    var o = i.attrHandle[e.toLowerCase()],
                        s = o && E.call(i.attrHandle, e.toLowerCase()) ? o(t, e, !v) : void 0;
                    return void 0 !== s ? s : n.attributes || !v ? t.getAttribute(e) : (s = t.getAttributeNode(e)) && s.specified ? s.value : null
                }, st.escape = function(t) {
                    return (t + "").replace(et, nt)
                }, st.error = function(t) {
                    throw new Error("Syntax error, unrecognized expression: " + t)
                }, st.uniqueSort = function(t) {
                    var e, i = [],
                        o = 0,
                        s = 0;
                    if (u = !n.detectDuplicates, d = !n.sortStable && t.slice(0), t.sort(I), u) {
                        for (; e = t[s++];) e === t[s] && (o = i.push(s));
                        for (; o--;) t.splice(i[o], 1)
                    }
                    return d = null, t
                }, o = st.getText = function(t) {
                    var e, n = "",
                        i = 0,
                        s = t.nodeType;
                    if (s) {
                        if (1 === s || 9 === s || 11 === s) {
                            if ("string" == typeof t.textContent) return t.textContent;
                            for (t = t.firstChild; t; t = t.nextSibling) n += o(t)
                        } else if (3 === s || 4 === s) return t.nodeValue
                    } else
                        for (; e = t[i++];) n += o(e);
                    return n
                }, (i = st.selectors = {
                    cacheLength: 50,
                    createPseudo: at,
                    match: z,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(t) {
                            return t[1] = t[1].replace(J, tt), t[3] = (t[3] || t[4] || t[5] || "").replace(J, tt), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                        },
                        CHILD: function(t) {
                            return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || st.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && st.error(t[0]), t
                        },
                        PSEUDO: function(t) {
                            var e, n = !t[6] && t[2];
                            return z.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : n && H.test(n) && (e = r(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(t) {
                            var e = t.replace(J, tt).toLowerCase();
                            return "*" === t ? function() {
                                return !0
                            } : function(t) {
                                return t.nodeName && t.nodeName.toLowerCase() === e
                            }
                        },
                        CLASS: function(t) {
                            var e = x[t + " "];
                            return e || (e = new RegExp("(^|" + _ + ")" + t + "(" + _ + "|$)")) && x(t, function(t) {
                                return e.test("string" == typeof t.className && t.className || void 0 !== t.getAttribute && t.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(t, e, n) {
                            return function(i) {
                                var o = st.attr(i, t);
                                return null == o ? "!=" === e : !e || (o += "", "=" === e ? o === n : "!=" === e ? o !== n : "^=" === e ? n && 0 === o.indexOf(n) : "*=" === e ? n && o.indexOf(n) > -1 : "$=" === e ? n && o.slice(-n.length) === n : "~=" === e ? (" " + o.replace(M, " ") + " ").indexOf(n) > -1 : "|=" === e && (o === n || o.slice(0, n.length + 1) === n + "-"))
                            }
                        },
                        CHILD: function(t, e, n, i, o) {
                            var s = "nth" !== t.slice(0, 3),
                                r = "last" !== t.slice(-4),
                                a = "of-type" === e;
                            return 1 === i && 0 === o ? function(t) {
                                return !!t.parentNode
                            } : function(e, n, l) {
                                var c, d, u, p, m, h, v = s !== r ? "nextSibling" : "previousSibling",
                                    f = e.parentNode,
                                    g = a && e.nodeName.toLowerCase(),
                                    b = !l && !a,
                                    y = !1;
                                if (f) {
                                    if (s) {
                                        for (; v;) {
                                            for (p = e; p = p[v];)
                                                if (a ? p.nodeName.toLowerCase() === g : 1 === p.nodeType) return !1;
                                            h = v = "only" === t && !h && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (h = [r ? f.firstChild : f.lastChild], r && b) {
                                        for (y = (m = (c = (d = (u = (p = f)[C] || (p[C] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[t] || [])[0] === w && c[1]) && c[2], p = m && f.childNodes[m]; p = ++m && p && p[v] || (y = m = 0) || h.pop();)
                                            if (1 === p.nodeType && ++y && p === e) {
                                                d[t] = [w, m, y];
                                                break
                                            }
                                    } else if (b && (y = m = (c = (d = (u = (p = e)[C] || (p[C] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[t] || [])[0] === w && c[1]), !1 === y)
                                        for (;
                                            (p = ++m && p && p[v] || (y = m = 0) || h.pop()) && ((a ? p.nodeName.toLowerCase() !== g : 1 !== p.nodeType) || !++y || (b && ((d = (u = p[C] || (p[C] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[t] = [w, y]), p !== e)););
                                    return (y -= o) === i || y % i == 0 && y / i >= 0
                                }
                            }
                        },
                        PSEUDO: function(t, e) {
                            var n, o = i.pseudos[t] || i.setFilters[t.toLowerCase()] || st.error("unsupported pseudo: " + t);
                            return o[C] ? o(e) : o.length > 1 ? (n = [t, t, "", e], i.setFilters.hasOwnProperty(t.toLowerCase()) ? at(function(t, n) {
                                for (var i, s = o(t, e), r = s.length; r--;) t[i = O(t, s[r])] = !(n[i] = s[r])
                            }) : function(t) {
                                return o(t, 0, n)
                            }) : o
                        }
                    },
                    pseudos: {
                        not: at(function(t) {
                            var e = [],
                                n = [],
                                i = a(t.replace(W, "$1"));
                            return i[C] ? at(function(t, e, n, o) {
                                for (var s, r = i(t, null, o, []), a = t.length; a--;)(s = r[a]) && (t[a] = !(e[a] = s))
                            }) : function(t, o, s) {
                                return e[0] = t, i(e, null, s, n), e[0] = null, !n.pop()
                            }
                        }),
                        has: at(function(t) {
                            return function(e) {
                                return st(t, e).length > 0
                            }
                        }),
                        contains: at(function(t) {
                            return t = t.replace(J, tt),
                                function(e) {
                                    return (e.textContent || e.innerText || o(e)).indexOf(t) > -1
                                }
                        }),
                        lang: at(function(t) {
                            return U.test(t || "") || st.error("unsupported lang: " + t), t = t.replace(J, tt).toLowerCase(),
                                function(e) {
                                    var n;
                                    do {
                                        if (n = v ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (n = n.toLowerCase()) === t || 0 === n.indexOf(t + "-")
                                    } while ((e = e.parentNode) && 1 === e.nodeType);
                                    return !1
                                }
                        }),
                        target: function(e) {
                            var n = t.location && t.location.hash;
                            return n && n.slice(1) === e.id
                        },
                        root: function(t) {
                            return t === h
                        },
                        focus: function(t) {
                            return t === m.activeElement && (!m.hasFocus || m.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                        },
                        enabled: mt(!1),
                        disabled: mt(!0),
                        checked: function(t) {
                            var e = t.nodeName.toLowerCase();
                            return "input" === e && !!t.checked || "option" === e && !!t.selected
                        },
                        selected: function(t) {
                            return t.parentNode && t.parentNode.selectedIndex, !0 === t.selected
                        },
                        empty: function(t) {
                            for (t = t.firstChild; t; t = t.nextSibling)
                                if (t.nodeType < 6) return !1;
                            return !0
                        },
                        parent: function(t) {
                            return !i.pseudos.empty(t)
                        },
                        header: function(t) {
                            return K.test(t.nodeName)
                        },
                        input: function(t) {
                            return Q.test(t.nodeName)
                        },
                        button: function(t) {
                            var e = t.nodeName.toLowerCase();
                            return "input" === e && "button" === t.type || "button" === e
                        },
                        text: function(t) {
                            var e;
                            return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
                        },
                        first: ht(function() {
                            return [0]
                        }),
                        last: ht(function(t, e) {
                            return [e - 1]
                        }),
                        eq: ht(function(t, e, n) {
                            return [n < 0 ? n + e : n]
                        }),
                        even: ht(function(t, e) {
                            for (var n = 0; n < e; n += 2) t.push(n);
                            return t
                        }),
                        odd: ht(function(t, e) {
                            for (var n = 1; n < e; n += 2) t.push(n);
                            return t
                        }),
                        lt: ht(function(t, e, n) {
                            for (var i = n < 0 ? n + e : n; --i >= 0;) t.push(i);
                            return t
                        }),
                        gt: ht(function(t, e, n) {
                            for (var i = n < 0 ? n + e : n; ++i < e;) t.push(i);
                            return t
                        })
                    }
                }).pseudos.nth = i.pseudos.eq, {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) i.pseudos[e] = ut(e);
            for (e in {
                    submit: !0,
                    reset: !0
                }) i.pseudos[e] = pt(e);

            function ft() {}

            function gt(t) {
                for (var e = 0, n = t.length, i = ""; e < n; e++) i += t[e].value;
                return i
            }

            function bt(t, e, n) {
                var i = e.dir,
                    o = e.next,
                    s = o || i,
                    r = n && "parentNode" === s,
                    a = k++;
                return e.first ? function(e, n, o) {
                    for (; e = e[i];)
                        if (1 === e.nodeType || r) return t(e, n, o);
                    return !1
                } : function(e, n, l) {
                    var c, d, u, p = [w, a];
                    if (l) {
                        for (; e = e[i];)
                            if ((1 === e.nodeType || r) && t(e, n, l)) return !0
                    } else
                        for (; e = e[i];)
                            if (1 === e.nodeType || r)
                                if (d = (u = e[C] || (e[C] = {}))[e.uniqueID] || (u[e.uniqueID] = {}), o && o === e.nodeName.toLowerCase()) e = e[i] || e;
                                else {
                                    if ((c = d[s]) && c[0] === w && c[1] === a) return p[2] = c[2];
                                    if (d[s] = p, p[2] = t(e, n, l)) return !0
                                } return !1
                }
            }

            function yt(t) {
                return t.length > 1 ? function(e, n, i) {
                    for (var o = t.length; o--;)
                        if (!t[o](e, n, i)) return !1;
                    return !0
                } : t[0]
            }

            function Ct(t, e, n, i, o) {
                for (var s, r = [], a = 0, l = t.length, c = null != e; a < l; a++)(s = t[a]) && (n && !n(s, i, o) || (r.push(s), c && e.push(a)));
                return r
            }

            function St(t, e, n, i, o, s) {
                return i && !i[C] && (i = St(i)), o && !o[C] && (o = St(o, s)), at(function(s, r, a, l) {
                    var c, d, u, p = [],
                        m = [],
                        h = r.length,
                        v = s || function(t, e, n) {
                            for (var i = 0, o = e.length; i < o; i++) st(t, e[i], n);
                            return n
                        }(e || "*", a.nodeType ? [a] : a, []),
                        f = !t || !s && e ? v : Ct(v, p, t, a, l),
                        g = n ? o || (s ? t : h || i) ? [] : r : f;
                    if (n && n(f, g, a, l), i)
                        for (c = Ct(g, m), i(c, [], a, l), d = c.length; d--;)(u = c[d]) && (g[m[d]] = !(f[m[d]] = u));
                    if (s) {
                        if (o || t) {
                            if (o) {
                                for (c = [], d = g.length; d--;)(u = g[d]) && c.push(f[d] = u);
                                o(null, g = [], c, l)
                            }
                            for (d = g.length; d--;)(u = g[d]) && (c = o ? O(s, u) : p[d]) > -1 && (s[c] = !(r[c] = u))
                        }
                    } else g = Ct(g === r ? g.splice(h, g.length) : g), o ? o(null, r, g, l) : G.apply(r, g)
                })
            }

            function wt(t) {
                for (var e, n, o, s = t.length, r = i.relative[t[0].type], a = r || i.relative[" "], l = r ? 1 : 0, d = bt(function(t) {
                        return t === e
                    }, a, !0), u = bt(function(t) {
                        return O(e, t) > -1
                    }, a, !0), p = [function(t, n, i) {
                        var o = !r && (i || n !== c) || ((e = n).nodeType ? d(t, n, i) : u(t, n, i));
                        return e = null, o
                    }]; l < s; l++)
                    if (n = i.relative[t[l].type]) p = [bt(yt(p), n)];
                    else {
                        if ((n = i.filter[t[l].type].apply(null, t[l].matches))[C]) {
                            for (o = ++l; o < s && !i.relative[t[o].type]; o++);
                            return St(l > 1 && yt(p), l > 1 && gt(t.slice(0, l - 1).concat({
                                value: " " === t[l - 2].type ? "*" : ""
                            })).replace(W, "$1"), n, l < o && wt(t.slice(l, o)), o < s && wt(t = t.slice(o)), o < s && gt(t))
                        }
                        p.push(n)
                    } return yt(p)
            }

            function kt(t, e) {
                var n = e.length > 0,
                    o = t.length > 0,
                    s = function(s, r, a, l, d) {
                        var u, h, f, g = 0,
                            b = "0",
                            y = s && [],
                            C = [],
                            S = c,
                            k = s || o && i.find.TAG("*", d),
                            x = w += null == S ? 1 : Math.random() || .1,
                            T = k.length;
                        for (d && (c = r === m || r || d); b !== T && null != (u = k[b]); b++) {
                            if (o && u) {
                                for (h = 0, r || u.ownerDocument === m || (p(u), a = !v); f = t[h++];)
                                    if (f(u, r || m, a)) {
                                        l.push(u);
                                        break
                                    } d && (w = x)
                            }
                            n && ((u = !f && u) && g--, s && y.push(u))
                        }
                        if (g += b, n && b !== g) {
                            for (h = 0; f = e[h++];) f(y, C, r, a);
                            if (s) {
                                if (g > 0)
                                    for (; b--;) y[b] || C[b] || (C[b] = F.call(l));
                                C = Ct(C)
                            }
                            G.apply(l, C), d && !s && C.length > 0 && g + e.length > 1 && st.uniqueSort(l)
                        }
                        return d && (w = x, c = S), y
                    };
                return n ? at(s) : s
            }
            return ft.prototype = i.filters = i.pseudos, i.setFilters = new ft, r = st.tokenize = function(t, e) {
                var n, o, s, r, a, l, c, d = T[t + " "];
                if (d) return e ? 0 : d.slice(0);
                for (a = t, l = [], c = i.preFilter; a;) {
                    for (r in n && !(o = R.exec(a)) || (o && (a = a.slice(o[0].length) || a), l.push(s = [])), n = !1, (o = j.exec(a)) && (n = o.shift(), s.push({
                            value: n,
                            type: o[0].replace(W, " ")
                        }), a = a.slice(n.length)), i.filter) !(o = z[r].exec(a)) || c[r] && !(o = c[r](o)) || (n = o.shift(), s.push({
                        value: n,
                        type: r,
                        matches: o
                    }), a = a.slice(n.length));
                    if (!n) break
                }
                return e ? a.length : a ? st.error(t) : T(t, l).slice(0)
            }, a = st.compile = function(t, e) {
                var n, i = [],
                    o = [],
                    s = P[t + " "];
                if (!s) {
                    for (e || (e = r(t)), n = e.length; n--;)(s = wt(e[n]))[C] ? i.push(s) : o.push(s);
                    (s = P(t, kt(o, i))).selector = t
                }
                return s
            }, l = st.select = function(t, e, n, o) {
                var s, l, c, d, u, p = "function" == typeof t && t,
                    m = !o && r(t = p.selector || t);
                if (n = n || [], 1 === m.length) {
                    if ((l = m[0] = m[0].slice(0)).length > 2 && "ID" === (c = l[0]).type && 9 === e.nodeType && v && i.relative[l[1].type]) {
                        if (!(e = (i.find.ID(c.matches[0].replace(J, tt), e) || [])[0])) return n;
                        p && (e = e.parentNode), t = t.slice(l.shift().value.length)
                    }
                    for (s = z.needsContext.test(t) ? 0 : l.length; s-- && (c = l[s], !i.relative[d = c.type]);)
                        if ((u = i.find[d]) && (o = u(c.matches[0].replace(J, tt), Z.test(l[0].type) && vt(e.parentNode) || e))) {
                            if (l.splice(s, 1), !(t = o.length && gt(l))) return G.apply(n, o), n;
                            break
                        }
                }
                return (p || a(t, m))(o, e, !v, n, !e || Z.test(t) && vt(e.parentNode) || e), n
            }, n.sortStable = C.split("").sort(I).join("") === C, n.detectDuplicates = !!u, p(), n.sortDetached = lt(function(t) {
                return 1 & t.compareDocumentPosition(m.createElement("fieldset"))
            }), lt(function(t) {
                return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
            }) || ct("type|href|height|width", function(t, e, n) {
                if (!n) return t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
            }), n.attributes && lt(function(t) {
                return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
            }) || ct("value", function(t, e, n) {
                if (!n && "input" === t.nodeName.toLowerCase()) return t.defaultValue
            }), lt(function(t) {
                return null == t.getAttribute("disabled")
            }) || ct(D, function(t, e, n) {
                var i;
                if (!n) return !0 === t[e] ? e.toLowerCase() : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
            }), st
        }(t);
        C.find = k, C.expr = k.selectors, C.expr[":"] = C.expr.pseudos, C.uniqueSort = C.unique = k.uniqueSort, C.text = k.getText, C.isXMLDoc = k.isXML, C.contains = k.contains, C.escapeSelector = k.escape;
        var x = function(t, e, n) {
                for (var i = [], o = void 0 !== n;
                    (t = t[e]) && 9 !== t.nodeType;)
                    if (1 === t.nodeType) {
                        if (o && C(t).is(n)) break;
                        i.push(t)
                    } return i
            },
            T = function(t, e) {
                for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
                return n
            },
            P = C.expr.match.needsContext;

        function I(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
        }
        var E = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

        function A(t, e, n) {
            return v(e) ? C.grep(t, function(t, i) {
                return !!e.call(t, i, t) !== n
            }) : e.nodeType ? C.grep(t, function(t) {
                return t === e !== n
            }) : "string" != typeof e ? C.grep(t, function(t) {
                return l.call(e, t) > -1 !== n
            }) : C.filter(e, t, n)
        }
        C.filter = function(t, e, n) {
            var i = e[0];
            return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === i.nodeType ? C.find.matchesSelector(i, t) ? [i] : [] : C.find.matches(t, C.grep(e, function(t) {
                return 1 === t.nodeType
            }))
        }, C.fn.extend({
            find: function(t) {
                var e, n, i = this.length,
                    o = this;
                if ("string" != typeof t) return this.pushStack(C(t).filter(function() {
                    for (e = 0; e < i; e++)
                        if (C.contains(o[e], this)) return !0
                }));
                for (n = this.pushStack([]), e = 0; e < i; e++) C.find(t, o[e], n);
                return i > 1 ? C.uniqueSort(n) : n
            },
            filter: function(t) {
                return this.pushStack(A(this, t || [], !1))
            },
            not: function(t) {
                return this.pushStack(A(this, t || [], !0))
            },
            is: function(t) {
                return !!A(this, "string" == typeof t && P.test(t) ? C(t) : t || [], !1).length
            }
        });
        var F, L = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
        (C.fn.init = function(t, e, n) {
            var o, s;
            if (!t) return this;
            if (n = n || F, "string" == typeof t) {
                if (!(o = "<" === t[0] && ">" === t[t.length - 1] && t.length >= 3 ? [null, t, null] : L.exec(t)) || !o[1] && e) return !e || e.jquery ? (e || n).find(t) : this.constructor(e).find(t);
                if (o[1]) {
                    if (e = e instanceof C ? e[0] : e, C.merge(this, C.parseHTML(o[1], e && e.nodeType ? e.ownerDocument || e : i, !0)), E.test(o[1]) && C.isPlainObject(e))
                        for (o in e) v(this[o]) ? this[o](e[o]) : this.attr(o, e[o]);
                    return this
                }
                return (s = i.getElementById(o[2])) && (this[0] = s, this.length = 1), this
            }
            return t.nodeType ? (this[0] = t, this.length = 1, this) : v(t) ? void 0 !== n.ready ? n.ready(t) : t(C) : C.makeArray(t, this)
        }).prototype = C.fn, F = C(i);
        var G = /^(?:parents|prev(?:Until|All))/,
            N = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };

        function O(t, e) {
            for (;
                (t = t[e]) && 1 !== t.nodeType;);
            return t
        }
        C.fn.extend({
            has: function(t) {
                var e = C(t, this),
                    n = e.length;
                return this.filter(function() {
                    for (var t = 0; t < n; t++)
                        if (C.contains(this, e[t])) return !0
                })
            },
            closest: function(t, e) {
                var n, i = 0,
                    o = this.length,
                    s = [],
                    r = "string" != typeof t && C(t);
                if (!P.test(t))
                    for (; i < o; i++)
                        for (n = this[i]; n && n !== e; n = n.parentNode)
                            if (n.nodeType < 11 && (r ? r.index(n) > -1 : 1 === n.nodeType && C.find.matchesSelector(n, t))) {
                                s.push(n);
                                break
                            } return this.pushStack(s.length > 1 ? C.uniqueSort(s) : s)
            },
            index: function(t) {
                return t ? "string" == typeof t ? l.call(C(t), this[0]) : l.call(this, t.jquery ? t[0] : t) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(t, e) {
                return this.pushStack(C.uniqueSort(C.merge(this.get(), C(t, e))))
            },
            addBack: function(t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }
        }), C.each({
            parent: function(t) {
                var e = t.parentNode;
                return e && 11 !== e.nodeType ? e : null
            },
            parents: function(t) {
                return x(t, "parentNode")
            },
            parentsUntil: function(t, e, n) {
                return x(t, "parentNode", n)
            },
            next: function(t) {
                return O(t, "nextSibling")
            },
            prev: function(t) {
                return O(t, "previousSibling")
            },
            nextAll: function(t) {
                return x(t, "nextSibling")
            },
            prevAll: function(t) {
                return x(t, "previousSibling")
            },
            nextUntil: function(t, e, n) {
                return x(t, "nextSibling", n)
            },
            prevUntil: function(t, e, n) {
                return x(t, "previousSibling", n)
            },
            siblings: function(t) {
                return T((t.parentNode || {}).firstChild, t)
            },
            children: function(t) {
                return T(t.firstChild)
            },
            contents: function(t) {
                return I(t, "iframe") ? t.contentDocument : (I(t, "template") && (t = t.content || t), C.merge([], t.childNodes))
            }
        }, function(t, e) {
            C.fn[t] = function(n, i) {
                var o = C.map(this, e, n);
                return "Until" !== t.slice(-5) && (i = n), i && "string" == typeof i && (o = C.filter(i, o)), this.length > 1 && (N[t] || C.uniqueSort(o), G.test(t) && o.reverse()), this.pushStack(o)
            }
        });
        var D = /[^\x20\t\r\n\f]+/g;

        function _(t) {
            return t
        }

        function B(t) {
            throw t
        }

        function V(t, e, n, i) {
            var o;
            try {
                t && v(o = t.promise) ? o.call(t).done(e).fail(n) : t && v(o = t.then) ? o.call(t, e, n) : e.apply(void 0, [t].slice(i))
            } catch (t) {
                n.apply(void 0, [t])
            }
        }
        C.Callbacks = function(t) {
            t = "string" == typeof t ? function(t) {
                var e = {};
                return C.each(t.match(D) || [], function(t, n) {
                    e[n] = !0
                }), e
            }(t) : C.extend({}, t);
            var e, n, i, o, s = [],
                r = [],
                a = -1,
                l = function() {
                    for (o = o || t.once, i = e = !0; r.length; a = -1)
                        for (n = r.shift(); ++a < s.length;) !1 === s[a].apply(n[0], n[1]) && t.stopOnFalse && (a = s.length, n = !1);
                    t.memory || (n = !1), e = !1, o && (s = n ? [] : "")
                },
                c = {
                    add: function() {
                        return s && (n && !e && (a = s.length - 1, r.push(n)), function e(n) {
                            C.each(n, function(n, i) {
                                v(i) ? t.unique && c.has(i) || s.push(i) : i && i.length && "string" !== y(i) && e(i)
                            })
                        }(arguments), n && !e && l()), this
                    },
                    remove: function() {
                        return C.each(arguments, function(t, e) {
                            for (var n;
                                (n = C.inArray(e, s, n)) > -1;) s.splice(n, 1), n <= a && a--
                        }), this
                    },
                    has: function(t) {
                        return t ? C.inArray(t, s) > -1 : s.length > 0
                    },
                    empty: function() {
                        return s && (s = []), this
                    },
                    disable: function() {
                        return o = r = [], s = n = "", this
                    },
                    disabled: function() {
                        return !s
                    },
                    lock: function() {
                        return o = r = [], n || e || (s = n = ""), this
                    },
                    locked: function() {
                        return !!o
                    },
                    fireWith: function(t, n) {
                        return o || (n = [t, (n = n || []).slice ? n.slice() : n], r.push(n), e || l()), this
                    },
                    fire: function() {
                        return c.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!i
                    }
                };
            return c
        }, C.extend({
            Deferred: function(e) {
                var n = [
                        ["notify", "progress", C.Callbacks("memory"), C.Callbacks("memory"), 2],
                        ["resolve", "done", C.Callbacks("once memory"), C.Callbacks("once memory"), 0, "resolved"],
                        ["reject", "fail", C.Callbacks("once memory"), C.Callbacks("once memory"), 1, "rejected"]
                    ],
                    i = "pending",
                    o = {
                        state: function() {
                            return i
                        },
                        always: function() {
                            return s.done(arguments).fail(arguments), this
                        },
                        catch: function(t) {
                            return o.then(null, t)
                        },
                        pipe: function() {
                            var t = arguments;
                            return C.Deferred(function(e) {
                                C.each(n, function(n, i) {
                                    var o = v(t[i[4]]) && t[i[4]];
                                    s[i[1]](function() {
                                        var t = o && o.apply(this, arguments);
                                        t && v(t.promise) ? t.promise().progress(e.notify).done(e.resolve).fail(e.reject) : e[i[0] + "With"](this, o ? [t] : arguments)
                                    })
                                }), t = null
                            }).promise()
                        },
                        then: function(e, i, o) {
                            var s = 0;

                            function r(e, n, i, o) {
                                return function() {
                                    var a = this,
                                        l = arguments,
                                        c = function() {
                                            var t, c;
                                            if (!(e < s)) {
                                                if ((t = i.apply(a, l)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                                c = t && ("object" == typeof t || "function" == typeof t) && t.then, v(c) ? o ? c.call(t, r(s, n, _, o), r(s, n, B, o)) : (s++, c.call(t, r(s, n, _, o), r(s, n, B, o), r(s, n, _, n.notifyWith))) : (i !== _ && (a = void 0, l = [t]), (o || n.resolveWith)(a, l))
                                            }
                                        },
                                        d = o ? c : function() {
                                            try {
                                                c()
                                            } catch (t) {
                                                C.Deferred.exceptionHook && C.Deferred.exceptionHook(t, d.stackTrace), e + 1 >= s && (i !== B && (a = void 0, l = [t]), n.rejectWith(a, l))
                                            }
                                        };
                                    e ? d() : (C.Deferred.getStackHook && (d.stackTrace = C.Deferred.getStackHook()), t.setTimeout(d))
                                }
                            }
                            return C.Deferred(function(t) {
                                n[0][3].add(r(0, t, v(o) ? o : _, t.notifyWith)), n[1][3].add(r(0, t, v(e) ? e : _)), n[2][3].add(r(0, t, v(i) ? i : B))
                            }).promise()
                        },
                        promise: function(t) {
                            return null != t ? C.extend(t, o) : o
                        }
                    },
                    s = {};
                return C.each(n, function(t, e) {
                    var r = e[2],
                        a = e[5];
                    o[e[1]] = r.add, a && r.add(function() {
                        i = a
                    }, n[3 - t][2].disable, n[3 - t][3].disable, n[0][2].lock, n[0][3].lock), r.add(e[3].fire), s[e[0]] = function() {
                        return s[e[0] + "With"](this === s ? void 0 : this, arguments), this
                    }, s[e[0] + "With"] = r.fireWith
                }), o.promise(s), e && e.call(s, s), s
            },
            when: function(t) {
                var e = arguments.length,
                    n = e,
                    i = Array(n),
                    o = s.call(arguments),
                    r = C.Deferred(),
                    a = function(t) {
                        return function(n) {
                            i[t] = this, o[t] = arguments.length > 1 ? s.call(arguments) : n, --e || r.resolveWith(i, o)
                        }
                    };
                if (e <= 1 && (V(t, r.done(a(n)).resolve, r.reject, !e), "pending" === r.state() || v(o[n] && o[n].then))) return r.then();
                for (; n--;) V(o[n], a(n), r.reject);
                return r.promise()
            }
        });
        var $ = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        C.Deferred.exceptionHook = function(e, n) {
            t.console && t.console.warn && e && $.test(e.name) && t.console.warn("jQuery.Deferred exception: " + e.message, e.stack, n)
        }, C.readyException = function(e) {
            t.setTimeout(function() {
                throw e
            })
        };
        var M = C.Deferred();

        function W() {
            i.removeEventListener("DOMContentLoaded", W), t.removeEventListener("load", W), C.ready()
        }
        C.fn.ready = function(t) {
            return M.then(t).catch(function(t) {
                C.readyException(t)
            }), this
        }, C.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(t) {
                (!0 === t ? --C.readyWait : C.isReady) || (C.isReady = !0, !0 !== t && --C.readyWait > 0 || M.resolveWith(i, [C]))
            }
        }), C.ready.then = M.then, "complete" === i.readyState || "loading" !== i.readyState && !i.documentElement.doScroll ? t.setTimeout(C.ready) : (i.addEventListener("DOMContentLoaded", W), t.addEventListener("load", W));
        var R = function(t, e, n, i, o, s, r) {
                var a = 0,
                    l = t.length,
                    c = null == n;
                if ("object" === y(n))
                    for (a in o = !0, n) R(t, e, a, n[a], !0, s, r);
                else if (void 0 !== i && (o = !0, v(i) || (r = !0), c && (r ? (e.call(t, i), e = null) : (c = e, e = function(t, e, n) {
                        return c.call(C(t), n)
                    })), e))
                    for (; a < l; a++) e(t[a], n, r ? i : i.call(t[a], a, e(t[a], n)));
                return o ? t : c ? e.call(t) : l ? e(t[0], n) : s
            },
            j = /^-ms-/,
            q = /-([a-z])/g;

        function H(t, e) {
            return e.toUpperCase()
        }

        function U(t) {
            return t.replace(j, "ms-").replace(q, H)
        }
        var z = function(t) {
            return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType
        };

        function Q() {
            this.expando = C.expando + Q.uid++
        }
        Q.uid = 1, Q.prototype = {
            cache: function(t) {
                var e = t[this.expando];
                return e || (e = {}, z(t) && (t.nodeType ? t[this.expando] = e : Object.defineProperty(t, this.expando, {
                    value: e,
                    configurable: !0
                }))), e
            },
            set: function(t, e, n) {
                var i, o = this.cache(t);
                if ("string" == typeof e) o[U(e)] = n;
                else
                    for (i in e) o[U(i)] = e[i];
                return o
            },
            get: function(t, e) {
                return void 0 === e ? this.cache(t) : t[this.expando] && t[this.expando][U(e)]
            },
            access: function(t, e, n) {
                return void 0 === e || e && "string" == typeof e && void 0 === n ? this.get(t, e) : (this.set(t, e, n), void 0 !== n ? n : e)
            },
            remove: function(t, e) {
                var n, i = t[this.expando];
                if (void 0 !== i) {
                    if (void 0 !== e) {
                        n = (e = Array.isArray(e) ? e.map(U) : (e = U(e)) in i ? [e] : e.match(D) || []).length;
                        for (; n--;) delete i[e[n]]
                    }(void 0 === e || C.isEmptyObject(i)) && (t.nodeType ? t[this.expando] = void 0 : delete t[this.expando])
                }
            },
            hasData: function(t) {
                var e = t[this.expando];
                return void 0 !== e && !C.isEmptyObject(e)
            }
        };
        var K = new Q,
            Y = new Q,
            X = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Z = /[A-Z]/g;

        function J(t, e, n) {
            var i;
            if (void 0 === n && 1 === t.nodeType)
                if (i = "data-" + e.replace(Z, "-$&").toLowerCase(), "string" == typeof(n = t.getAttribute(i))) {
                    try {
                        n = function(t) {
                            return "true" === t || "false" !== t && ("null" === t ? null : t === +t + "" ? +t : X.test(t) ? JSON.parse(t) : t)
                        }(n)
                    } catch (t) {}
                    Y.set(t, e, n)
                } else n = void 0;
            return n
        }
        C.extend({
            hasData: function(t) {
                return Y.hasData(t) || K.hasData(t)
            },
            data: function(t, e, n) {
                return Y.access(t, e, n)
            },
            removeData: function(t, e) {
                Y.remove(t, e)
            },
            _data: function(t, e, n) {
                return K.access(t, e, n)
            },
            _removeData: function(t, e) {
                K.remove(t, e)
            }
        }), C.fn.extend({
            data: function(t, e) {
                var n, i, o, s = this[0],
                    r = s && s.attributes;
                if (void 0 === t) {
                    if (this.length && (o = Y.get(s), 1 === s.nodeType && !K.get(s, "hasDataAttrs"))) {
                        for (n = r.length; n--;) r[n] && 0 === (i = r[n].name).indexOf("data-") && (i = U(i.slice(5)), J(s, i, o[i]));
                        K.set(s, "hasDataAttrs", !0)
                    }
                    return o
                }
                return "object" == typeof t ? this.each(function() {
                    Y.set(this, t)
                }) : R(this, function(e) {
                    var n;
                    if (s && void 0 === e) {
                        if (void 0 !== (n = Y.get(s, t))) return n;
                        if (void 0 !== (n = J(s, t))) return n
                    } else this.each(function() {
                        Y.set(this, t, e)
                    })
                }, null, e, arguments.length > 1, null, !0)
            },
            removeData: function(t) {
                return this.each(function() {
                    Y.remove(this, t)
                })
            }
        }), C.extend({
            queue: function(t, e, n) {
                var i;
                if (t) return e = (e || "fx") + "queue", i = K.get(t, e), n && (!i || Array.isArray(n) ? i = K.access(t, e, C.makeArray(n)) : i.push(n)), i || []
            },
            dequeue: function(t, e) {
                e = e || "fx";
                var n = C.queue(t, e),
                    i = n.length,
                    o = n.shift(),
                    s = C._queueHooks(t, e);
                "inprogress" === o && (o = n.shift(), i--), o && ("fx" === e && n.unshift("inprogress"), delete s.stop, o.call(t, function() {
                    C.dequeue(t, e)
                }, s)), !i && s && s.empty.fire()
            },
            _queueHooks: function(t, e) {
                var n = e + "queueHooks";
                return K.get(t, n) || K.access(t, n, {
                    empty: C.Callbacks("once memory").add(function() {
                        K.remove(t, [e + "queue", n])
                    })
                })
            }
        }), C.fn.extend({
            queue: function(t, e) {
                var n = 2;
                return "string" != typeof t && (e = t, t = "fx", n--), arguments.length < n ? C.queue(this[0], t) : void 0 === e ? this : this.each(function() {
                    var n = C.queue(this, t, e);
                    C._queueHooks(this, t), "fx" === t && "inprogress" !== n[0] && C.dequeue(this, t)
                })
            },
            dequeue: function(t) {
                return this.each(function() {
                    C.dequeue(this, t)
                })
            },
            clearQueue: function(t) {
                return this.queue(t || "fx", [])
            },
            promise: function(t, e) {
                var n, i = 1,
                    o = C.Deferred(),
                    s = this,
                    r = this.length,
                    a = function() {
                        --i || o.resolveWith(s, [s])
                    };
                for ("string" != typeof t && (e = t, t = void 0), t = t || "fx"; r--;)(n = K.get(s[r], t + "queueHooks")) && n.empty && (i++, n.empty.add(a));
                return a(), o.promise(e)
            }
        });
        var tt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            et = new RegExp("^(?:([+-])=|)(" + tt + ")([a-z%]*)$", "i"),
            nt = ["Top", "Right", "Bottom", "Left"],
            it = function(t, e) {
                return "none" === (t = e || t).style.display || "" === t.style.display && C.contains(t.ownerDocument, t) && "none" === C.css(t, "display")
            },
            ot = function(t, e, n, i) {
                var o, s, r = {};
                for (s in e) r[s] = t.style[s], t.style[s] = e[s];
                for (s in o = n.apply(t, i || []), e) t.style[s] = r[s];
                return o
            };

        function st(t, e, n, i) {
            var o, s, r = 20,
                a = i ? function() {
                    return i.cur()
                } : function() {
                    return C.css(t, e, "")
                },
                l = a(),
                c = n && n[3] || (C.cssNumber[e] ? "" : "px"),
                d = (C.cssNumber[e] || "px" !== c && +l) && et.exec(C.css(t, e));
            if (d && d[3] !== c) {
                for (l /= 2, c = c || d[3], d = +l || 1; r--;) C.style(t, e, d + c), (1 - s) * (1 - (s = a() / l || .5)) <= 0 && (r = 0), d /= s;
                d *= 2, C.style(t, e, d + c), n = n || []
            }
            return n && (d = +d || +l || 0, o = n[1] ? d + (n[1] + 1) * n[2] : +n[2], i && (i.unit = c, i.start = d, i.end = o)), o
        }
        var rt = {};

        function at(t) {
            var e, n = t.ownerDocument,
                i = t.nodeName,
                o = rt[i];
            return o || (e = n.body.appendChild(n.createElement(i)), o = C.css(e, "display"), e.parentNode.removeChild(e), "none" === o && (o = "block"), rt[i] = o, o)
        }

        function lt(t, e) {
            for (var n, i, o = [], s = 0, r = t.length; s < r; s++)(i = t[s]).style && (n = i.style.display, e ? ("none" === n && (o[s] = K.get(i, "display") || null, o[s] || (i.style.display = "")), "" === i.style.display && it(i) && (o[s] = at(i))) : "none" !== n && (o[s] = "none", K.set(i, "display", n)));
            for (s = 0; s < r; s++) null != o[s] && (t[s].style.display = o[s]);
            return t
        }
        C.fn.extend({
            show: function() {
                return lt(this, !0)
            },
            hide: function() {
                return lt(this)
            },
            toggle: function(t) {
                return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
                    it(this) ? C(this).show() : C(this).hide()
                })
            }
        });
        var ct = /^(?:checkbox|radio)$/i,
            dt = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
            ut = /^$|^module$|\/(?:java|ecma)script/i,
            pt = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };

        function mt(t, e) {
            var n;
            return n = void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e || "*") : void 0 !== t.querySelectorAll ? t.querySelectorAll(e || "*") : [], void 0 === e || e && I(t, e) ? C.merge([t], n) : n
        }

        function ht(t, e) {
            for (var n = 0, i = t.length; n < i; n++) K.set(t[n], "globalEval", !e || K.get(e[n], "globalEval"))
        }
        pt.optgroup = pt.option, pt.tbody = pt.tfoot = pt.colgroup = pt.caption = pt.thead, pt.th = pt.td;
        var vt = /<|&#?\w+;/;

        function ft(t, e, n, i, o) {
            for (var s, r, a, l, c, d, u = e.createDocumentFragment(), p = [], m = 0, h = t.length; m < h; m++)
                if ((s = t[m]) || 0 === s)
                    if ("object" === y(s)) C.merge(p, s.nodeType ? [s] : s);
                    else if (vt.test(s)) {
                for (r = r || u.appendChild(e.createElement("div")), a = (dt.exec(s) || ["", ""])[1].toLowerCase(), l = pt[a] || pt._default, r.innerHTML = l[1] + C.htmlPrefilter(s) + l[2], d = l[0]; d--;) r = r.lastChild;
                C.merge(p, r.childNodes), (r = u.firstChild).textContent = ""
            } else p.push(e.createTextNode(s));
            for (u.textContent = "", m = 0; s = p[m++];)
                if (i && C.inArray(s, i) > -1) o && o.push(s);
                else if (c = C.contains(s.ownerDocument, s), r = mt(u.appendChild(s), "script"), c && ht(r), n)
                for (d = 0; s = r[d++];) ut.test(s.type || "") && n.push(s);
            return u
        }! function() {
            var t = i.createDocumentFragment().appendChild(i.createElement("div")),
                e = i.createElement("input");
            e.setAttribute("type", "radio"), e.setAttribute("checked", "checked"), e.setAttribute("name", "t"), t.appendChild(e), h.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", h.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
        }();
        var gt = i.documentElement,
            bt = /^key/,
            yt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Ct = /^([^.]*)(?:\.(.+)|)/;

        function St() {
            return !0
        }

        function wt() {
            return !1
        }

        function kt() {
            try {
                return i.activeElement
            } catch (t) {}
        }

        function xt(t, e, n, i, o, s) {
            var r, a;
            if ("object" == typeof e) {
                for (a in "string" != typeof n && (i = i || n, n = void 0), e) xt(t, a, n, i, e[a], s);
                return t
            }
            if (null == i && null == o ? (o = n, i = n = void 0) : null == o && ("string" == typeof n ? (o = i, i = void 0) : (o = i, i = n, n = void 0)), !1 === o) o = wt;
            else if (!o) return t;
            return 1 === s && (r = o, (o = function(t) {
                return C().off(t), r.apply(this, arguments)
            }).guid = r.guid || (r.guid = C.guid++)), t.each(function() {
                C.event.add(this, e, o, i, n)
            })
        }
        C.event = {
            global: {},
            add: function(t, e, n, i, o) {
                var s, r, a, l, c, d, u, p, m, h, v, f = K.get(t);
                if (f)
                    for (n.handler && (n = (s = n).handler, o = s.selector), o && C.find.matchesSelector(gt, o), n.guid || (n.guid = C.guid++), (l = f.events) || (l = f.events = {}), (r = f.handle) || (r = f.handle = function(e) {
                            return void 0 !== C && C.event.triggered !== e.type ? C.event.dispatch.apply(t, arguments) : void 0
                        }), c = (e = (e || "").match(D) || [""]).length; c--;) m = v = (a = Ct.exec(e[c]) || [])[1], h = (a[2] || "").split(".").sort(), m && (u = C.event.special[m] || {}, m = (o ? u.delegateType : u.bindType) || m, u = C.event.special[m] || {}, d = C.extend({
                        type: m,
                        origType: v,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && C.expr.match.needsContext.test(o),
                        namespace: h.join(".")
                    }, s), (p = l[m]) || ((p = l[m] = []).delegateCount = 0, u.setup && !1 !== u.setup.call(t, i, h, r) || t.addEventListener && t.addEventListener(m, r)), u.add && (u.add.call(t, d), d.handler.guid || (d.handler.guid = n.guid)), o ? p.splice(p.delegateCount++, 0, d) : p.push(d), C.event.global[m] = !0)
            },
            remove: function(t, e, n, i, o) {
                var s, r, a, l, c, d, u, p, m, h, v, f = K.hasData(t) && K.get(t);
                if (f && (l = f.events)) {
                    for (c = (e = (e || "").match(D) || [""]).length; c--;)
                        if (m = v = (a = Ct.exec(e[c]) || [])[1], h = (a[2] || "").split(".").sort(), m) {
                            for (u = C.event.special[m] || {}, p = l[m = (i ? u.delegateType : u.bindType) || m] || [], a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), r = s = p.length; s--;) d = p[s], !o && v !== d.origType || n && n.guid !== d.guid || a && !a.test(d.namespace) || i && i !== d.selector && ("**" !== i || !d.selector) || (p.splice(s, 1), d.selector && p.delegateCount--, u.remove && u.remove.call(t, d));
                            r && !p.length && (u.teardown && !1 !== u.teardown.call(t, h, f.handle) || C.removeEvent(t, m, f.handle), delete l[m])
                        } else
                            for (m in l) C.event.remove(t, m + e[c], n, i, !0);
                    C.isEmptyObject(l) && K.remove(t, "handle events")
                }
            },
            dispatch: function(t) {
                var e, n, i, o, s, r, a = C.event.fix(t),
                    l = new Array(arguments.length),
                    c = (K.get(this, "events") || {})[a.type] || [],
                    d = C.event.special[a.type] || {};
                for (l[0] = a, e = 1; e < arguments.length; e++) l[e] = arguments[e];
                if (a.delegateTarget = this, !d.preDispatch || !1 !== d.preDispatch.call(this, a)) {
                    for (r = C.event.handlers.call(this, a, c), e = 0;
                        (o = r[e++]) && !a.isPropagationStopped();)
                        for (a.currentTarget = o.elem, n = 0;
                            (s = o.handlers[n++]) && !a.isImmediatePropagationStopped();) a.rnamespace && !a.rnamespace.test(s.namespace) || (a.handleObj = s, a.data = s.data, void 0 !== (i = ((C.event.special[s.origType] || {}).handle || s.handler).apply(o.elem, l)) && !1 === (a.result = i) && (a.preventDefault(), a.stopPropagation()));
                    return d.postDispatch && d.postDispatch.call(this, a), a.result
                }
            },
            handlers: function(t, e) {
                var n, i, o, s, r, a = [],
                    l = e.delegateCount,
                    c = t.target;
                if (l && c.nodeType && !("click" === t.type && t.button >= 1))
                    for (; c !== this; c = c.parentNode || this)
                        if (1 === c.nodeType && ("click" !== t.type || !0 !== c.disabled)) {
                            for (s = [], r = {}, n = 0; n < l; n++) void 0 === r[o = (i = e[n]).selector + " "] && (r[o] = i.needsContext ? C(o, this).index(c) > -1 : C.find(o, this, null, [c]).length), r[o] && s.push(i);
                            s.length && a.push({
                                elem: c,
                                handlers: s
                            })
                        } return c = this, l < e.length && a.push({
                    elem: c,
                    handlers: e.slice(l)
                }), a
            },
            addProp: function(t, e) {
                Object.defineProperty(C.Event.prototype, t, {
                    enumerable: !0,
                    configurable: !0,
                    get: v(e) ? function() {
                        if (this.originalEvent) return e(this.originalEvent)
                    } : function() {
                        if (this.originalEvent) return this.originalEvent[t]
                    },
                    set: function(e) {
                        Object.defineProperty(this, t, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: e
                        })
                    }
                })
            },
            fix: function(t) {
                return t[C.expando] ? t : new C.Event(t)
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== kt() && this.focus) return this.focus(), !1
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === kt() && this.blur) return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if ("checkbox" === this.type && this.click && I(this, "input")) return this.click(), !1
                    },
                    _default: function(t) {
                        return I(t.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(t) {
                        void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
                    }
                }
            }
        }, C.removeEvent = function(t, e, n) {
            t.removeEventListener && t.removeEventListener(e, n)
        }, C.Event = function(t, e) {
            if (!(this instanceof C.Event)) return new C.Event(t, e);
            t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && !1 === t.returnValue ? St : wt, this.target = t.target && 3 === t.target.nodeType ? t.target.parentNode : t.target, this.currentTarget = t.currentTarget, this.relatedTarget = t.relatedTarget) : this.type = t, e && C.extend(this, e), this.timeStamp = t && t.timeStamp || Date.now(), this[C.expando] = !0
        }, C.Event.prototype = {
            constructor: C.Event,
            isDefaultPrevented: wt,
            isPropagationStopped: wt,
            isImmediatePropagationStopped: wt,
            isSimulated: !1,
            preventDefault: function() {
                var t = this.originalEvent;
                this.isDefaultPrevented = St, t && !this.isSimulated && t.preventDefault()
            },
            stopPropagation: function() {
                var t = this.originalEvent;
                this.isPropagationStopped = St, t && !this.isSimulated && t.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var t = this.originalEvent;
                this.isImmediatePropagationStopped = St, t && !this.isSimulated && t.stopImmediatePropagation(), this.stopPropagation()
            }
        }, C.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(t) {
                var e = t.button;
                return null == t.which && bt.test(t.type) ? null != t.charCode ? t.charCode : t.keyCode : !t.which && void 0 !== e && yt.test(t.type) ? 1 & e ? 1 : 2 & e ? 3 : 4 & e ? 2 : 0 : t.which
            }
        }, C.event.addProp), C.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(t, e) {
            C.event.special[t] = {
                delegateType: e,
                bindType: e,
                handle: function(t) {
                    var n, i = t.relatedTarget,
                        o = t.handleObj;
                    return i && (i === this || C.contains(this, i)) || (t.type = o.origType, n = o.handler.apply(this, arguments), t.type = e), n
                }
            }
        }), C.fn.extend({
            on: function(t, e, n, i) {
                return xt(this, t, e, n, i)
            },
            one: function(t, e, n, i) {
                return xt(this, t, e, n, i, 1)
            },
            off: function(t, e, n) {
                var i, o;
                if (t && t.preventDefault && t.handleObj) return i = t.handleObj, C(t.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if ("object" == typeof t) {
                    for (o in t) this.off(o, e, t[o]);
                    return this
                }
                return !1 !== e && "function" != typeof e || (n = e, e = void 0), !1 === n && (n = wt), this.each(function() {
                    C.event.remove(this, t, n, e)
                })
            }
        });
        var Tt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
            Pt = /<script|<style|<link/i,
            It = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Et = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

        function At(t, e) {
            return I(t, "table") && I(11 !== e.nodeType ? e : e.firstChild, "tr") && C(t).children("tbody")[0] || t
        }

        function Ft(t) {
            return t.type = (null !== t.getAttribute("type")) + "/" + t.type, t
        }

        function Lt(t) {
            return "true/" === (t.type || "").slice(0, 5) ? t.type = t.type.slice(5) : t.removeAttribute("type"), t
        }

        function Gt(t, e) {
            var n, i, o, s, r, a, l, c;
            if (1 === e.nodeType) {
                if (K.hasData(t) && (s = K.access(t), r = K.set(e, s), c = s.events))
                    for (o in delete r.handle, r.events = {}, c)
                        for (n = 0, i = c[o].length; n < i; n++) C.event.add(e, o, c[o][n]);
                Y.hasData(t) && (a = Y.access(t), l = C.extend({}, a), Y.set(e, l))
            }
        }

        function Nt(t, e) {
            var n = e.nodeName.toLowerCase();
            "input" === n && ct.test(t.type) ? e.checked = t.checked : "input" !== n && "textarea" !== n || (e.defaultValue = t.defaultValue)
        }

        function Ot(t, e, n, i) {
            e = r.apply([], e);
            var o, s, a, l, c, d, u = 0,
                p = t.length,
                m = p - 1,
                f = e[0],
                g = v(f);
            if (g || p > 1 && "string" == typeof f && !h.checkClone && It.test(f)) return t.each(function(o) {
                var s = t.eq(o);
                g && (e[0] = f.call(this, o, s.html())), Ot(s, e, n, i)
            });
            if (p && (s = (o = ft(e, t[0].ownerDocument, !1, t, i)).firstChild, 1 === o.childNodes.length && (o = s), s || i)) {
                for (l = (a = C.map(mt(o, "script"), Ft)).length; u < p; u++) c = o, u !== m && (c = C.clone(c, !0, !0), l && C.merge(a, mt(c, "script"))), n.call(t[u], c, u);
                if (l)
                    for (d = a[a.length - 1].ownerDocument, C.map(a, Lt), u = 0; u < l; u++) c = a[u], ut.test(c.type || "") && !K.access(c, "globalEval") && C.contains(d, c) && (c.src && "module" !== (c.type || "").toLowerCase() ? C._evalUrl && C._evalUrl(c.src) : b(c.textContent.replace(Et, ""), d, c))
            }
            return t
        }

        function Dt(t, e, n) {
            for (var i, o = e ? C.filter(e, t) : t, s = 0; null != (i = o[s]); s++) n || 1 !== i.nodeType || C.cleanData(mt(i)), i.parentNode && (n && C.contains(i.ownerDocument, i) && ht(mt(i, "script")), i.parentNode.removeChild(i));
            return t
        }
        C.extend({
            htmlPrefilter: function(t) {
                return t.replace(Tt, "<$1></$2>")
            },
            clone: function(t, e, n) {
                var i, o, s, r, a = t.cloneNode(!0),
                    l = C.contains(t.ownerDocument, t);
                if (!(h.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || C.isXMLDoc(t)))
                    for (r = mt(a), i = 0, o = (s = mt(t)).length; i < o; i++) Nt(s[i], r[i]);
                if (e)
                    if (n)
                        for (s = s || mt(t), r = r || mt(a), i = 0, o = s.length; i < o; i++) Gt(s[i], r[i]);
                    else Gt(t, a);
                return (r = mt(a, "script")).length > 0 && ht(r, !l && mt(t, "script")), a
            },
            cleanData: function(t) {
                for (var e, n, i, o = C.event.special, s = 0; void 0 !== (n = t[s]); s++)
                    if (z(n)) {
                        if (e = n[K.expando]) {
                            if (e.events)
                                for (i in e.events) o[i] ? C.event.remove(n, i) : C.removeEvent(n, i, e.handle);
                            n[K.expando] = void 0
                        }
                        n[Y.expando] && (n[Y.expando] = void 0)
                    }
            }
        }), C.fn.extend({
            detach: function(t) {
                return Dt(this, t, !0)
            },
            remove: function(t) {
                return Dt(this, t)
            },
            text: function(t) {
                return R(this, function(t) {
                    return void 0 === t ? C.text(this) : this.empty().each(function() {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = t)
                    })
                }, null, t, arguments.length)
            },
            append: function() {
                return Ot(this, arguments, function(t) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || At(this, t).appendChild(t)
                })
            },
            prepend: function() {
                return Ot(this, arguments, function(t) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var e = At(this, t);
                        e.insertBefore(t, e.firstChild)
                    }
                })
            },
            before: function() {
                return Ot(this, arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this)
                })
            },
            after: function() {
                return Ot(this, arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
                })
            },
            empty: function() {
                for (var t, e = 0; null != (t = this[e]); e++) 1 === t.nodeType && (C.cleanData(mt(t, !1)), t.textContent = "");
                return this
            },
            clone: function(t, e) {
                return t = null != t && t, e = null == e ? t : e, this.map(function() {
                    return C.clone(this, t, e)
                })
            },
            html: function(t) {
                return R(this, function(t) {
                    var e = this[0] || {},
                        n = 0,
                        i = this.length;
                    if (void 0 === t && 1 === e.nodeType) return e.innerHTML;
                    if ("string" == typeof t && !Pt.test(t) && !pt[(dt.exec(t) || ["", ""])[1].toLowerCase()]) {
                        t = C.htmlPrefilter(t);
                        try {
                            for (; n < i; n++) 1 === (e = this[n] || {}).nodeType && (C.cleanData(mt(e, !1)), e.innerHTML = t);
                            e = 0
                        } catch (t) {}
                    }
                    e && this.empty().append(t)
                }, null, t, arguments.length)
            },
            replaceWith: function() {
                var t = [];
                return Ot(this, arguments, function(e) {
                    var n = this.parentNode;
                    C.inArray(this, t) < 0 && (C.cleanData(mt(this)), n && n.replaceChild(e, this))
                }, t)
            }
        }), C.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(t, e) {
            C.fn[t] = function(t) {
                for (var n, i = [], o = C(t), s = o.length - 1, r = 0; r <= s; r++) n = r === s ? this : this.clone(!0), C(o[r])[e](n), a.apply(i, n.get());
                return this.pushStack(i)
            }
        });
        var _t = new RegExp("^(" + tt + ")(?!px)[a-z%]+$", "i"),
            Bt = function(e) {
                var n = e.ownerDocument.defaultView;
                return n && n.opener || (n = t), n.getComputedStyle(e)
            },
            Vt = new RegExp(nt.join("|"), "i");

        function $t(t, e, n) {
            var i, o, s, r, a = t.style;
            return (n = n || Bt(t)) && ("" !== (r = n.getPropertyValue(e) || n[e]) || C.contains(t.ownerDocument, t) || (r = C.style(t, e)), !h.pixelBoxStyles() && _t.test(r) && Vt.test(e) && (i = a.width, o = a.minWidth, s = a.maxWidth, a.minWidth = a.maxWidth = a.width = r, r = n.width, a.width = i, a.minWidth = o, a.maxWidth = s)), void 0 !== r ? r + "" : r
        }

        function Mt(t, e) {
            return {
                get: function() {
                    if (!t()) return (this.get = e).apply(this, arguments);
                    delete this.get
                }
            }
        }! function() {
            function e() {
                if (d) {
                    c.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", d.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", gt.appendChild(c).appendChild(d);
                    var e = t.getComputedStyle(d);
                    o = "1%" !== e.top, l = 12 === n(e.marginLeft), d.style.right = "60%", a = 36 === n(e.right), s = 36 === n(e.width), d.style.position = "absolute", r = 36 === d.offsetWidth || "absolute", gt.removeChild(c), d = null
                }
            }

            function n(t) {
                return Math.round(parseFloat(t))
            }
            var o, s, r, a, l, c = i.createElement("div"),
                d = i.createElement("div");
            d.style && (d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", h.clearCloneStyle = "content-box" === d.style.backgroundClip, C.extend(h, {
                boxSizingReliable: function() {
                    return e(), s
                },
                pixelBoxStyles: function() {
                    return e(), a
                },
                pixelPosition: function() {
                    return e(), o
                },
                reliableMarginLeft: function() {
                    return e(), l
                },
                scrollboxSize: function() {
                    return e(), r
                }
            }))
        }();
        var Wt = /^(none|table(?!-c[ea]).+)/,
            Rt = /^--/,
            jt = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            qt = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            Ht = ["Webkit", "Moz", "ms"],
            Ut = i.createElement("div").style;

        function zt(t) {
            var e = C.cssProps[t];
            return e || (e = C.cssProps[t] = function(t) {
                if (t in Ut) return t;
                for (var e = t[0].toUpperCase() + t.slice(1), n = Ht.length; n--;)
                    if ((t = Ht[n] + e) in Ut) return t
            }(t) || t), e
        }

        function Qt(t, e, n) {
            var i = et.exec(e);
            return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : e
        }

        function Kt(t, e, n, i, o, s) {
            var r = "width" === e ? 1 : 0,
                a = 0,
                l = 0;
            if (n === (i ? "border" : "content")) return 0;
            for (; r < 4; r += 2) "margin" === n && (l += C.css(t, n + nt[r], !0, o)), i ? ("content" === n && (l -= C.css(t, "padding" + nt[r], !0, o)), "margin" !== n && (l -= C.css(t, "border" + nt[r] + "Width", !0, o))) : (l += C.css(t, "padding" + nt[r], !0, o), "padding" !== n ? l += C.css(t, "border" + nt[r] + "Width", !0, o) : a += C.css(t, "border" + nt[r] + "Width", !0, o));
            return !i && s >= 0 && (l += Math.max(0, Math.ceil(t["offset" + e[0].toUpperCase() + e.slice(1)] - s - l - a - .5))), l
        }

        function Yt(t, e, n) {
            var i = Bt(t),
                o = $t(t, e, i),
                s = "border-box" === C.css(t, "boxSizing", !1, i),
                r = s;
            if (_t.test(o)) {
                if (!n) return o;
                o = "auto"
            }
            return r = r && (h.boxSizingReliable() || o === t.style[e]), ("auto" === o || !parseFloat(o) && "inline" === C.css(t, "display", !1, i)) && (o = t["offset" + e[0].toUpperCase() + e.slice(1)], r = !0), (o = parseFloat(o) || 0) + Kt(t, e, n || (s ? "border" : "content"), r, i, o) + "px"
        }

        function Xt(t, e, n, i, o) {
            return new Xt.prototype.init(t, e, n, i, o)
        }
        C.extend({
            cssHooks: {
                opacity: {
                    get: function(t, e) {
                        if (e) {
                            var n = $t(t, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {},
            style: function(t, e, n, i) {
                if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                    var o, s, r, a = U(e),
                        l = Rt.test(e),
                        c = t.style;
                    if (l || (e = zt(a)), r = C.cssHooks[e] || C.cssHooks[a], void 0 === n) return r && "get" in r && void 0 !== (o = r.get(t, !1, i)) ? o : c[e];
                    "string" == (s = typeof n) && (o = et.exec(n)) && o[1] && (n = st(t, e, o), s = "number"), null != n && n == n && ("number" === s && (n += o && o[3] || (C.cssNumber[a] ? "" : "px")), h.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (c[e] = "inherit"), r && "set" in r && void 0 === (n = r.set(t, n, i)) || (l ? c.setProperty(e, n) : c[e] = n))
                }
            },
            css: function(t, e, n, i) {
                var o, s, r, a = U(e);
                return Rt.test(e) || (e = zt(a)), (r = C.cssHooks[e] || C.cssHooks[a]) && "get" in r && (o = r.get(t, !0, n)), void 0 === o && (o = $t(t, e, i)), "normal" === o && e in qt && (o = qt[e]), "" === n || n ? (s = parseFloat(o), !0 === n || isFinite(s) ? s || 0 : o) : o
            }
        }), C.each(["height", "width"], function(t, e) {
            C.cssHooks[e] = {
                get: function(t, n, i) {
                    if (n) return !Wt.test(C.css(t, "display")) || t.getClientRects().length && t.getBoundingClientRect().width ? Yt(t, e, i) : ot(t, jt, function() {
                        return Yt(t, e, i)
                    })
                },
                set: function(t, n, i) {
                    var o, s = Bt(t),
                        r = "border-box" === C.css(t, "boxSizing", !1, s),
                        a = i && Kt(t, e, i, r, s);
                    return r && h.scrollboxSize() === s.position && (a -= Math.ceil(t["offset" + e[0].toUpperCase() + e.slice(1)] - parseFloat(s[e]) - Kt(t, e, "border", !1, s) - .5)), a && (o = et.exec(n)) && "px" !== (o[3] || "px") && (t.style[e] = n, n = C.css(t, e)), Qt(0, n, a)
                }
            }
        }), C.cssHooks.marginLeft = Mt(h.reliableMarginLeft, function(t, e) {
            if (e) return (parseFloat($t(t, "marginLeft")) || t.getBoundingClientRect().left - ot(t, {
                marginLeft: 0
            }, function() {
                return t.getBoundingClientRect().left
            })) + "px"
        }), C.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(t, e) {
            C.cssHooks[t + e] = {
                expand: function(n) {
                    for (var i = 0, o = {}, s = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) o[t + nt[i] + e] = s[i] || s[i - 2] || s[0];
                    return o
                }
            }, "margin" !== t && (C.cssHooks[t + e].set = Qt)
        }), C.fn.extend({
            css: function(t, e) {
                return R(this, function(t, e, n) {
                    var i, o, s = {},
                        r = 0;
                    if (Array.isArray(e)) {
                        for (i = Bt(t), o = e.length; r < o; r++) s[e[r]] = C.css(t, e[r], !1, i);
                        return s
                    }
                    return void 0 !== n ? C.style(t, e, n) : C.css(t, e)
                }, t, e, arguments.length > 1)
            }
        }), C.Tween = Xt, Xt.prototype = {
            constructor: Xt,
            init: function(t, e, n, i, o, s) {
                this.elem = t, this.prop = n, this.easing = o || C.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = i, this.unit = s || (C.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var t = Xt.propHooks[this.prop];
                return t && t.get ? t.get(this) : Xt.propHooks._default.get(this)
            },
            run: function(t) {
                var e, n = Xt.propHooks[this.prop];
                return this.options.duration ? this.pos = e = C.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Xt.propHooks._default.set(this), this
            }
        }, Xt.prototype.init.prototype = Xt.prototype, Xt.propHooks = {
            _default: {
                get: function(t) {
                    var e;
                    return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = C.css(t.elem, t.prop, "")) && "auto" !== e ? e : 0
                },
                set: function(t) {
                    C.fx.step[t.prop] ? C.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[C.cssProps[t.prop]] && !C.cssHooks[t.prop] ? t.elem[t.prop] = t.now : C.style(t.elem, t.prop, t.now + t.unit)
                }
            }
        }, Xt.propHooks.scrollTop = Xt.propHooks.scrollLeft = {
            set: function(t) {
                t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
            }
        }, C.easing = {
            linear: function(t) {
                return t
            },
            swing: function(t) {
                return .5 - Math.cos(t * Math.PI) / 2
            },
            _default: "swing"
        }, C.fx = Xt.prototype.init, C.fx.step = {};
        var Zt, Jt, te = /^(?:toggle|show|hide)$/,
            ee = /queueHooks$/;

        function ne() {
            Jt && (!1 === i.hidden && t.requestAnimationFrame ? t.requestAnimationFrame(ne) : t.setTimeout(ne, C.fx.interval), C.fx.tick())
        }

        function ie() {
            return t.setTimeout(function() {
                Zt = void 0
            }), Zt = Date.now()
        }

        function oe(t, e) {
            var n, i = 0,
                o = {
                    height: t
                };
            for (e = e ? 1 : 0; i < 4; i += 2 - e) o["margin" + (n = nt[i])] = o["padding" + n] = t;
            return e && (o.opacity = o.width = t), o
        }

        function se(t, e, n) {
            for (var i, o = (re.tweeners[e] || []).concat(re.tweeners["*"]), s = 0, r = o.length; s < r; s++)
                if (i = o[s].call(n, e, t)) return i
        }

        function re(t, e, n) {
            var i, o, s = 0,
                r = re.prefilters.length,
                a = C.Deferred().always(function() {
                    delete l.elem
                }),
                l = function() {
                    if (o) return !1;
                    for (var e = Zt || ie(), n = Math.max(0, c.startTime + c.duration - e), i = 1 - (n / c.duration || 0), s = 0, r = c.tweens.length; s < r; s++) c.tweens[s].run(i);
                    return a.notifyWith(t, [c, i, n]), i < 1 && r ? n : (r || a.notifyWith(t, [c, 1, 0]), a.resolveWith(t, [c]), !1)
                },
                c = a.promise({
                    elem: t,
                    props: C.extend({}, e),
                    opts: C.extend(!0, {
                        specialEasing: {},
                        easing: C.easing._default
                    }, n),
                    originalProperties: e,
                    originalOptions: n,
                    startTime: Zt || ie(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(e, n) {
                        var i = C.Tween(t, c.opts, e, n, c.opts.specialEasing[e] || c.opts.easing);
                        return c.tweens.push(i), i
                    },
                    stop: function(e) {
                        var n = 0,
                            i = e ? c.tweens.length : 0;
                        if (o) return this;
                        for (o = !0; n < i; n++) c.tweens[n].run(1);
                        return e ? (a.notifyWith(t, [c, 1, 0]), a.resolveWith(t, [c, e])) : a.rejectWith(t, [c, e]), this
                    }
                }),
                d = c.props;
            for (function(t, e) {
                    var n, i, o, s, r;
                    for (n in t)
                        if (o = e[i = U(n)], s = t[n], Array.isArray(s) && (o = s[1], s = t[n] = s[0]), n !== i && (t[i] = s, delete t[n]), (r = C.cssHooks[i]) && "expand" in r)
                            for (n in s = r.expand(s), delete t[i], s) n in t || (t[n] = s[n], e[n] = o);
                        else e[i] = o
                }(d, c.opts.specialEasing); s < r; s++)
                if (i = re.prefilters[s].call(c, t, d, c.opts)) return v(i.stop) && (C._queueHooks(c.elem, c.opts.queue).stop = i.stop.bind(i)), i;
            return C.map(d, se, c), v(c.opts.start) && c.opts.start.call(t, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), C.fx.timer(C.extend(l, {
                elem: t,
                anim: c,
                queue: c.opts.queue
            })), c
        }
        C.Animation = C.extend(re, {
                tweeners: {
                    "*": [function(t, e) {
                        var n = this.createTween(t, e);
                        return st(n.elem, t, et.exec(e), n), n
                    }]
                },
                tweener: function(t, e) {
                    v(t) ? (e = t, t = ["*"]) : t = t.match(D);
                    for (var n, i = 0, o = t.length; i < o; i++) n = t[i], re.tweeners[n] = re.tweeners[n] || [], re.tweeners[n].unshift(e)
                },
                prefilters: [function(t, e, n) {
                    var i, o, s, r, a, l, c, d, u = "width" in e || "height" in e,
                        p = this,
                        m = {},
                        h = t.style,
                        v = t.nodeType && it(t),
                        f = K.get(t, "fxshow");
                    for (i in n.queue || (null == (r = C._queueHooks(t, "fx")).unqueued && (r.unqueued = 0, a = r.empty.fire, r.empty.fire = function() {
                            r.unqueued || a()
                        }), r.unqueued++, p.always(function() {
                            p.always(function() {
                                r.unqueued--, C.queue(t, "fx").length || r.empty.fire()
                            })
                        })), e)
                        if (o = e[i], te.test(o)) {
                            if (delete e[i], s = s || "toggle" === o, o === (v ? "hide" : "show")) {
                                if ("show" !== o || !f || void 0 === f[i]) continue;
                                v = !0
                            }
                            m[i] = f && f[i] || C.style(t, i)
                        } if ((l = !C.isEmptyObject(e)) || !C.isEmptyObject(m))
                        for (i in u && 1 === t.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (c = f && f.display) && (c = K.get(t, "display")), "none" === (d = C.css(t, "display")) && (c ? d = c : (lt([t], !0), c = t.style.display || c, d = C.css(t, "display"), lt([t]))), ("inline" === d || "inline-block" === d && null != c) && "none" === C.css(t, "float") && (l || (p.done(function() {
                                h.display = c
                            }), null == c && (d = h.display, c = "none" === d ? "" : d)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function() {
                                h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                            })), l = !1, m) l || (f ? "hidden" in f && (v = f.hidden) : f = K.access(t, "fxshow", {
                            display: c
                        }), s && (f.hidden = !v), v && lt([t], !0), p.done(function() {
                            for (i in v || lt([t]), K.remove(t, "fxshow"), m) C.style(t, i, m[i])
                        })), l = se(v ? f[i] : 0, i, p), i in f || (f[i] = l.start, v && (l.end = l.start, l.start = 0))
                }],
                prefilter: function(t, e) {
                    e ? re.prefilters.unshift(t) : re.prefilters.push(t)
                }
            }), C.speed = function(t, e, n) {
                var i = t && "object" == typeof t ? C.extend({}, t) : {
                    complete: n || !n && e || v(t) && t,
                    duration: t,
                    easing: n && e || e && !v(e) && e
                };
                return C.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in C.fx.speeds ? i.duration = C.fx.speeds[i.duration] : i.duration = C.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                    v(i.old) && i.old.call(this), i.queue && C.dequeue(this, i.queue)
                }, i
            }, C.fn.extend({
                fadeTo: function(t, e, n, i) {
                    return this.filter(it).css("opacity", 0).show().end().animate({
                        opacity: e
                    }, t, n, i)
                },
                animate: function(t, e, n, i) {
                    var o = C.isEmptyObject(t),
                        s = C.speed(e, n, i),
                        r = function() {
                            var e = re(this, C.extend({}, t), s);
                            (o || K.get(this, "finish")) && e.stop(!0)
                        };
                    return r.finish = r, o || !1 === s.queue ? this.each(r) : this.queue(s.queue, r)
                },
                stop: function(t, e, n) {
                    var i = function(t) {
                        var e = t.stop;
                        delete t.stop, e(n)
                    };
                    return "string" != typeof t && (n = e, e = t, t = void 0), e && !1 !== t && this.queue(t || "fx", []), this.each(function() {
                        var e = !0,
                            o = null != t && t + "queueHooks",
                            s = C.timers,
                            r = K.get(this);
                        if (o) r[o] && r[o].stop && i(r[o]);
                        else
                            for (o in r) r[o] && r[o].stop && ee.test(o) && i(r[o]);
                        for (o = s.length; o--;) s[o].elem !== this || null != t && s[o].queue !== t || (s[o].anim.stop(n), e = !1, s.splice(o, 1));
                        !e && n || C.dequeue(this, t)
                    })
                },
                finish: function(t) {
                    return !1 !== t && (t = t || "fx"), this.each(function() {
                        var e, n = K.get(this),
                            i = n[t + "queue"],
                            o = n[t + "queueHooks"],
                            s = C.timers,
                            r = i ? i.length : 0;
                        for (n.finish = !0, C.queue(this, t, []), o && o.stop && o.stop.call(this, !0), e = s.length; e--;) s[e].elem === this && s[e].queue === t && (s[e].anim.stop(!0), s.splice(e, 1));
                        for (e = 0; e < r; e++) i[e] && i[e].finish && i[e].finish.call(this);
                        delete n.finish
                    })
                }
            }), C.each(["toggle", "show", "hide"], function(t, e) {
                var n = C.fn[e];
                C.fn[e] = function(t, i, o) {
                    return null == t || "boolean" == typeof t ? n.apply(this, arguments) : this.animate(oe(e, !0), t, i, o)
                }
            }), C.each({
                slideDown: oe("show"),
                slideUp: oe("hide"),
                slideToggle: oe("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(t, e) {
                C.fn[t] = function(t, n, i) {
                    return this.animate(e, t, n, i)
                }
            }), C.timers = [], C.fx.tick = function() {
                var t, e = 0,
                    n = C.timers;
                for (Zt = Date.now(); e < n.length; e++)(t = n[e])() || n[e] !== t || n.splice(e--, 1);
                n.length || C.fx.stop(), Zt = void 0
            }, C.fx.timer = function(t) {
                C.timers.push(t), C.fx.start()
            }, C.fx.interval = 13, C.fx.start = function() {
                Jt || (Jt = !0, ne())
            }, C.fx.stop = function() {
                Jt = null
            }, C.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, C.fn.delay = function(e, n) {
                return e = C.fx && C.fx.speeds[e] || e, n = n || "fx", this.queue(n, function(n, i) {
                    var o = t.setTimeout(n, e);
                    i.stop = function() {
                        t.clearTimeout(o)
                    }
                })
            },
            function() {
                var t = i.createElement("input"),
                    e = i.createElement("select").appendChild(i.createElement("option"));
                t.type = "checkbox", h.checkOn = "" !== t.value, h.optSelected = e.selected, (t = i.createElement("input")).value = "t", t.type = "radio", h.radioValue = "t" === t.value
            }();
        var ae, le = C.expr.attrHandle;
        C.fn.extend({
            attr: function(t, e) {
                return R(this, C.attr, t, e, arguments.length > 1)
            },
            removeAttr: function(t) {
                return this.each(function() {
                    C.removeAttr(this, t)
                })
            }
        }), C.extend({
            attr: function(t, e, n) {
                var i, o, s = t.nodeType;
                if (3 !== s && 8 !== s && 2 !== s) return void 0 === t.getAttribute ? C.prop(t, e, n) : (1 === s && C.isXMLDoc(t) || (o = C.attrHooks[e.toLowerCase()] || (C.expr.match.bool.test(e) ? ae : void 0)), void 0 !== n ? null === n ? void C.removeAttr(t, e) : o && "set" in o && void 0 !== (i = o.set(t, n, e)) ? i : (t.setAttribute(e, n + ""), n) : o && "get" in o && null !== (i = o.get(t, e)) ? i : null == (i = C.find.attr(t, e)) ? void 0 : i)
            },
            attrHooks: {
                type: {
                    set: function(t, e) {
                        if (!h.radioValue && "radio" === e && I(t, "input")) {
                            var n = t.value;
                            return t.setAttribute("type", e), n && (t.value = n), e
                        }
                    }
                }
            },
            removeAttr: function(t, e) {
                var n, i = 0,
                    o = e && e.match(D);
                if (o && 1 === t.nodeType)
                    for (; n = o[i++];) t.removeAttribute(n)
            }
        }), ae = {
            set: function(t, e, n) {
                return !1 === e ? C.removeAttr(t, n) : t.setAttribute(n, n), n
            }
        }, C.each(C.expr.match.bool.source.match(/\w+/g), function(t, e) {
            var n = le[e] || C.find.attr;
            le[e] = function(t, e, i) {
                var o, s, r = e.toLowerCase();
                return i || (s = le[r], le[r] = o, o = null != n(t, e, i) ? r : null, le[r] = s), o
            }
        });
        var ce = /^(?:input|select|textarea|button)$/i,
            de = /^(?:a|area)$/i;

        function ue(t) {
            return (t.match(D) || []).join(" ")
        }

        function pe(t) {
            return t.getAttribute && t.getAttribute("class") || ""
        }

        function me(t) {
            return Array.isArray(t) ? t : "string" == typeof t && t.match(D) || []
        }
        C.fn.extend({
            prop: function(t, e) {
                return R(this, C.prop, t, e, arguments.length > 1)
            },
            removeProp: function(t) {
                return this.each(function() {
                    delete this[C.propFix[t] || t]
                })
            }
        }), C.extend({
            prop: function(t, e, n) {
                var i, o, s = t.nodeType;
                if (3 !== s && 8 !== s && 2 !== s) return 1 === s && C.isXMLDoc(t) || (e = C.propFix[e] || e, o = C.propHooks[e]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(t, n, e)) ? i : t[e] = n : o && "get" in o && null !== (i = o.get(t, e)) ? i : t[e]
            },
            propHooks: {
                tabIndex: {
                    get: function(t) {
                        var e = C.find.attr(t, "tabindex");
                        return e ? parseInt(e, 10) : ce.test(t.nodeName) || de.test(t.nodeName) && t.href ? 0 : -1
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }), h.optSelected || (C.propHooks.selected = {
            get: function(t) {
                var e = t.parentNode;
                return e && e.parentNode && e.parentNode.selectedIndex, null
            },
            set: function(t) {
                var e = t.parentNode;
                e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
            }
        }), C.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            C.propFix[this.toLowerCase()] = this
        }), C.fn.extend({
            addClass: function(t) {
                var e, n, i, o, s, r, a, l = 0;
                if (v(t)) return this.each(function(e) {
                    C(this).addClass(t.call(this, e, pe(this)))
                });
                if ((e = me(t)).length)
                    for (; n = this[l++];)
                        if (o = pe(n), i = 1 === n.nodeType && " " + ue(o) + " ") {
                            for (r = 0; s = e[r++];) i.indexOf(" " + s + " ") < 0 && (i += s + " ");
                            o !== (a = ue(i)) && n.setAttribute("class", a)
                        } return this
            },
            removeClass: function(t) {
                var e, n, i, o, s, r, a, l = 0;
                if (v(t)) return this.each(function(e) {
                    C(this).removeClass(t.call(this, e, pe(this)))
                });
                if (!arguments.length) return this.attr("class", "");
                if ((e = me(t)).length)
                    for (; n = this[l++];)
                        if (o = pe(n), i = 1 === n.nodeType && " " + ue(o) + " ") {
                            for (r = 0; s = e[r++];)
                                for (; i.indexOf(" " + s + " ") > -1;) i = i.replace(" " + s + " ", " ");
                            o !== (a = ue(i)) && n.setAttribute("class", a)
                        } return this
            },
            toggleClass: function(t, e) {
                var n = typeof t,
                    i = "string" === n || Array.isArray(t);
                return "boolean" == typeof e && i ? e ? this.addClass(t) : this.removeClass(t) : v(t) ? this.each(function(n) {
                    C(this).toggleClass(t.call(this, n, pe(this), e), e)
                }) : this.each(function() {
                    var e, o, s, r;
                    if (i)
                        for (o = 0, s = C(this), r = me(t); e = r[o++];) s.hasClass(e) ? s.removeClass(e) : s.addClass(e);
                    else void 0 !== t && "boolean" !== n || ((e = pe(this)) && K.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || !1 === t ? "" : K.get(this, "__className__") || ""))
                })
            },
            hasClass: function(t) {
                var e, n, i = 0;
                for (e = " " + t + " "; n = this[i++];)
                    if (1 === n.nodeType && (" " + ue(pe(n)) + " ").indexOf(e) > -1) return !0;
                return !1
            }
        });
        var he = /\r/g;
        C.fn.extend({
            val: function(t) {
                var e, n, i, o = this[0];
                return arguments.length ? (i = v(t), this.each(function(n) {
                    var o;
                    1 === this.nodeType && (null == (o = i ? t.call(this, n, C(this).val()) : t) ? o = "" : "number" == typeof o ? o += "" : Array.isArray(o) && (o = C.map(o, function(t) {
                        return null == t ? "" : t + ""
                    })), (e = C.valHooks[this.type] || C.valHooks[this.nodeName.toLowerCase()]) && "set" in e && void 0 !== e.set(this, o, "value") || (this.value = o))
                })) : o ? (e = C.valHooks[o.type] || C.valHooks[o.nodeName.toLowerCase()]) && "get" in e && void 0 !== (n = e.get(o, "value")) ? n : "string" == typeof(n = o.value) ? n.replace(he, "") : null == n ? "" : n : void 0
            }
        }), C.extend({
            valHooks: {
                option: {
                    get: function(t) {
                        var e = C.find.attr(t, "value");
                        return null != e ? e : ue(C.text(t))
                    }
                },
                select: {
                    get: function(t) {
                        var e, n, i, o = t.options,
                            s = t.selectedIndex,
                            r = "select-one" === t.type,
                            a = r ? null : [],
                            l = r ? s + 1 : o.length;
                        for (i = s < 0 ? l : r ? s : 0; i < l; i++)
                            if (((n = o[i]).selected || i === s) && !n.disabled && (!n.parentNode.disabled || !I(n.parentNode, "optgroup"))) {
                                if (e = C(n).val(), r) return e;
                                a.push(e)
                            } return a
                    },
                    set: function(t, e) {
                        for (var n, i, o = t.options, s = C.makeArray(e), r = o.length; r--;)((i = o[r]).selected = C.inArray(C.valHooks.option.get(i), s) > -1) && (n = !0);
                        return n || (t.selectedIndex = -1), s
                    }
                }
            }
        }), C.each(["radio", "checkbox"], function() {
            C.valHooks[this] = {
                set: function(t, e) {
                    if (Array.isArray(e)) return t.checked = C.inArray(C(t).val(), e) > -1
                }
            }, h.checkOn || (C.valHooks[this].get = function(t) {
                return null === t.getAttribute("value") ? "on" : t.value
            })
        }), h.focusin = "onfocusin" in t;
        var ve = /^(?:focusinfocus|focusoutblur)$/,
            fe = function(t) {
                t.stopPropagation()
            };
        C.extend(C.event, {
            trigger: function(e, n, o, s) {
                var r, a, l, c, d, p, m, h, g = [o || i],
                    b = u.call(e, "type") ? e.type : e,
                    y = u.call(e, "namespace") ? e.namespace.split(".") : [];
                if (a = h = l = o = o || i, 3 !== o.nodeType && 8 !== o.nodeType && !ve.test(b + C.event.triggered) && (b.indexOf(".") > -1 && (b = (y = b.split(".")).shift(), y.sort()), d = b.indexOf(":") < 0 && "on" + b, (e = e[C.expando] ? e : new C.Event(b, "object" == typeof e && e)).isTrigger = s ? 2 : 3, e.namespace = y.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + y.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = o), n = null == n ? [e] : C.makeArray(n, [e]), m = C.event.special[b] || {}, s || !m.trigger || !1 !== m.trigger.apply(o, n))) {
                    if (!s && !m.noBubble && !f(o)) {
                        for (c = m.delegateType || b, ve.test(c + b) || (a = a.parentNode); a; a = a.parentNode) g.push(a), l = a;
                        l === (o.ownerDocument || i) && g.push(l.defaultView || l.parentWindow || t)
                    }
                    for (r = 0;
                        (a = g[r++]) && !e.isPropagationStopped();) h = a, e.type = r > 1 ? c : m.bindType || b, (p = (K.get(a, "events") || {})[e.type] && K.get(a, "handle")) && p.apply(a, n), (p = d && a[d]) && p.apply && z(a) && (e.result = p.apply(a, n), !1 === e.result && e.preventDefault());
                    return e.type = b, s || e.isDefaultPrevented() || m._default && !1 !== m._default.apply(g.pop(), n) || !z(o) || d && v(o[b]) && !f(o) && ((l = o[d]) && (o[d] = null), C.event.triggered = b, e.isPropagationStopped() && h.addEventListener(b, fe), o[b](), e.isPropagationStopped() && h.removeEventListener(b, fe), C.event.triggered = void 0, l && (o[d] = l)), e.result
                }
            },
            simulate: function(t, e, n) {
                var i = C.extend(new C.Event, n, {
                    type: t,
                    isSimulated: !0
                });
                C.event.trigger(i, null, e)
            }
        }), C.fn.extend({
            trigger: function(t, e) {
                return this.each(function() {
                    C.event.trigger(t, e, this)
                })
            },
            triggerHandler: function(t, e) {
                var n = this[0];
                if (n) return C.event.trigger(t, e, n, !0)
            }
        }), h.focusin || C.each({
            focus: "focusin",
            blur: "focusout"
        }, function(t, e) {
            var n = function(t) {
                C.event.simulate(e, t.target, C.event.fix(t))
            };
            C.event.special[e] = {
                setup: function() {
                    var i = this.ownerDocument || this,
                        o = K.access(i, e);
                    o || i.addEventListener(t, n, !0), K.access(i, e, (o || 0) + 1)
                },
                teardown: function() {
                    var i = this.ownerDocument || this,
                        o = K.access(i, e) - 1;
                    o ? K.access(i, e, o) : (i.removeEventListener(t, n, !0), K.remove(i, e))
                }
            }
        });
        var ge = t.location,
            be = Date.now(),
            ye = /\?/;
        C.parseXML = function(e) {
            var n;
            if (!e || "string" != typeof e) return null;
            try {
                n = (new t.DOMParser).parseFromString(e, "text/xml")
            } catch (t) {
                n = void 0
            }
            return n && !n.getElementsByTagName("parsererror").length || C.error("Invalid XML: " + e), n
        };
        var Ce = /\[\]$/,
            Se = /\r?\n/g,
            we = /^(?:submit|button|image|reset|file)$/i,
            ke = /^(?:input|select|textarea|keygen)/i;

        function xe(t, e, n, i) {
            var o;
            if (Array.isArray(e)) C.each(e, function(e, o) {
                n || Ce.test(t) ? i(t, o) : xe(t + "[" + ("object" == typeof o && null != o ? e : "") + "]", o, n, i)
            });
            else if (n || "object" !== y(e)) i(t, e);
            else
                for (o in e) xe(t + "[" + o + "]", e[o], n, i)
        }
        C.param = function(t, e) {
            var n, i = [],
                o = function(t, e) {
                    var n = v(e) ? e() : e;
                    i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(null == n ? "" : n)
                };
            if (Array.isArray(t) || t.jquery && !C.isPlainObject(t)) C.each(t, function() {
                o(this.name, this.value)
            });
            else
                for (n in t) xe(n, t[n], e, o);
            return i.join("&")
        }, C.fn.extend({
            serialize: function() {
                return C.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var t = C.prop(this, "elements");
                    return t ? C.makeArray(t) : this
                }).filter(function() {
                    var t = this.type;
                    return this.name && !C(this).is(":disabled") && ke.test(this.nodeName) && !we.test(t) && (this.checked || !ct.test(t))
                }).map(function(t, e) {
                    var n = C(this).val();
                    return null == n ? null : Array.isArray(n) ? C.map(n, function(t) {
                        return {
                            name: e.name,
                            value: t.replace(Se, "\r\n")
                        }
                    }) : {
                        name: e.name,
                        value: n.replace(Se, "\r\n")
                    }
                }).get()
            }
        });
        var Te = /%20/g,
            Pe = /#.*$/,
            Ie = /([?&])_=[^&]*/,
            Ee = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            Ae = /^(?:GET|HEAD)$/,
            Fe = /^\/\//,
            Le = {},
            Ge = {},
            Ne = "*/".concat("*"),
            Oe = i.createElement("a");

        function De(t) {
            return function(e, n) {
                "string" != typeof e && (n = e, e = "*");
                var i, o = 0,
                    s = e.toLowerCase().match(D) || [];
                if (v(n))
                    for (; i = s[o++];) "+" === i[0] ? (i = i.slice(1) || "*", (t[i] = t[i] || []).unshift(n)) : (t[i] = t[i] || []).push(n)
            }
        }

        function _e(t, e, n, i) {
            var o = {},
                s = t === Ge;

            function r(a) {
                var l;
                return o[a] = !0, C.each(t[a] || [], function(t, a) {
                    var c = a(e, n, i);
                    return "string" != typeof c || s || o[c] ? s ? !(l = c) : void 0 : (e.dataTypes.unshift(c), r(c), !1)
                }), l
            }
            return r(e.dataTypes[0]) || !o["*"] && r("*")
        }

        function Be(t, e) {
            var n, i, o = C.ajaxSettings.flatOptions || {};
            for (n in e) void 0 !== e[n] && ((o[n] ? t : i || (i = {}))[n] = e[n]);
            return i && C.extend(!0, t, i), t
        }
        Oe.href = ge.href, C.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: ge.href,
                type: "GET",
                isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ge.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Ne,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": C.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(t, e) {
                return e ? Be(Be(t, C.ajaxSettings), e) : Be(C.ajaxSettings, t)
            },
            ajaxPrefilter: De(Le),
            ajaxTransport: De(Ge),
            ajax: function(e, n) {
                "object" == typeof e && (n = e, e = void 0), n = n || {};
                var o, s, r, a, l, c, d, u, p, m, h = C.ajaxSetup({}, n),
                    v = h.context || h,
                    f = h.context && (v.nodeType || v.jquery) ? C(v) : C.event,
                    g = C.Deferred(),
                    b = C.Callbacks("once memory"),
                    y = h.statusCode || {},
                    S = {},
                    w = {},
                    k = "canceled",
                    x = {
                        readyState: 0,
                        getResponseHeader: function(t) {
                            var e;
                            if (d) {
                                if (!a)
                                    for (a = {}; e = Ee.exec(r);) a[e[1].toLowerCase()] = e[2];
                                e = a[t.toLowerCase()]
                            }
                            return null == e ? null : e
                        },
                        getAllResponseHeaders: function() {
                            return d ? r : null
                        },
                        setRequestHeader: function(t, e) {
                            return null == d && (t = w[t.toLowerCase()] = w[t.toLowerCase()] || t, S[t] = e), this
                        },
                        overrideMimeType: function(t) {
                            return null == d && (h.mimeType = t), this
                        },
                        statusCode: function(t) {
                            var e;
                            if (t)
                                if (d) x.always(t[x.status]);
                                else
                                    for (e in t) y[e] = [y[e], t[e]];
                            return this
                        },
                        abort: function(t) {
                            var e = t || k;
                            return o && o.abort(e), T(0, e), this
                        }
                    };
                if (g.promise(x), h.url = ((e || h.url || ge.href) + "").replace(Fe, ge.protocol + "//"), h.type = n.method || n.type || h.method || h.type, h.dataTypes = (h.dataType || "*").toLowerCase().match(D) || [""], null == h.crossDomain) {
                    c = i.createElement("a");
                    try {
                        c.href = h.url, c.href = c.href, h.crossDomain = Oe.protocol + "//" + Oe.host != c.protocol + "//" + c.host
                    } catch (t) {
                        h.crossDomain = !0
                    }
                }
                if (h.data && h.processData && "string" != typeof h.data && (h.data = C.param(h.data, h.traditional)), _e(Le, h, n, x), d) return x;
                for (p in (u = C.event && h.global) && 0 == C.active++ && C.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !Ae.test(h.type), s = h.url.replace(Pe, ""), h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(Te, "+")) : (m = h.url.slice(s.length), h.data && (h.processData || "string" == typeof h.data) && (s += (ye.test(s) ? "&" : "?") + h.data, delete h.data), !1 === h.cache && (s = s.replace(Ie, "$1"), m = (ye.test(s) ? "&" : "?") + "_=" + be++ + m), h.url = s + m), h.ifModified && (C.lastModified[s] && x.setRequestHeader("If-Modified-Since", C.lastModified[s]), C.etag[s] && x.setRequestHeader("If-None-Match", C.etag[s])), (h.data && h.hasContent && !1 !== h.contentType || n.contentType) && x.setRequestHeader("Content-Type", h.contentType), x.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Ne + "; q=0.01" : "") : h.accepts["*"]), h.headers) x.setRequestHeader(p, h.headers[p]);
                if (h.beforeSend && (!1 === h.beforeSend.call(v, x, h) || d)) return x.abort();
                if (k = "abort", b.add(h.complete), x.done(h.success), x.fail(h.error), o = _e(Ge, h, n, x)) {
                    if (x.readyState = 1, u && f.trigger("ajaxSend", [x, h]), d) return x;
                    h.async && h.timeout > 0 && (l = t.setTimeout(function() {
                        x.abort("timeout")
                    }, h.timeout));
                    try {
                        d = !1, o.send(S, T)
                    } catch (t) {
                        if (d) throw t;
                        T(-1, t)
                    }
                } else T(-1, "No Transport");

                function T(e, n, i, a) {
                    var c, p, m, S, w, k = n;
                    d || (d = !0, l && t.clearTimeout(l), o = void 0, r = a || "", x.readyState = e > 0 ? 4 : 0, c = e >= 200 && e < 300 || 304 === e, i && (S = function(t, e, n) {
                        for (var i, o, s, r, a = t.contents, l = t.dataTypes;
                            "*" === l[0];) l.shift(), void 0 === i && (i = t.mimeType || e.getResponseHeader("Content-Type"));
                        if (i)
                            for (o in a)
                                if (a[o] && a[o].test(i)) {
                                    l.unshift(o);
                                    break
                                } if (l[0] in n) s = l[0];
                        else {
                            for (o in n) {
                                if (!l[0] || t.converters[o + " " + l[0]]) {
                                    s = o;
                                    break
                                }
                                r || (r = o)
                            }
                            s = s || r
                        }
                        if (s) return s !== l[0] && l.unshift(s), n[s]
                    }(h, x, i)), S = function(t, e, n, i) {
                        var o, s, r, a, l, c = {},
                            d = t.dataTypes.slice();
                        if (d[1])
                            for (r in t.converters) c[r.toLowerCase()] = t.converters[r];
                        for (s = d.shift(); s;)
                            if (t.responseFields[s] && (n[t.responseFields[s]] = e), !l && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)), l = s, s = d.shift())
                                if ("*" === s) s = l;
                                else if ("*" !== l && l !== s) {
                            if (!(r = c[l + " " + s] || c["* " + s]))
                                for (o in c)
                                    if ((a = o.split(" "))[1] === s && (r = c[l + " " + a[0]] || c["* " + a[0]])) {
                                        !0 === r ? r = c[o] : !0 !== c[o] && (s = a[0], d.unshift(a[1]));
                                        break
                                    } if (!0 !== r)
                                if (r && t.throws) e = r(e);
                                else try {
                                    e = r(e)
                                } catch (t) {
                                    return {
                                        state: "parsererror",
                                        error: r ? t : "No conversion from " + l + " to " + s
                                    }
                                }
                        }
                        return {
                            state: "success",
                            data: e
                        }
                    }(h, S, x, c), c ? (h.ifModified && ((w = x.getResponseHeader("Last-Modified")) && (C.lastModified[s] = w), (w = x.getResponseHeader("etag")) && (C.etag[s] = w)), 204 === e || "HEAD" === h.type ? k = "nocontent" : 304 === e ? k = "notmodified" : (k = S.state, p = S.data, c = !(m = S.error))) : (m = k, !e && k || (k = "error", e < 0 && (e = 0))), x.status = e, x.statusText = (n || k) + "", c ? g.resolveWith(v, [p, k, x]) : g.rejectWith(v, [x, k, m]), x.statusCode(y), y = void 0, u && f.trigger(c ? "ajaxSuccess" : "ajaxError", [x, h, c ? p : m]), b.fireWith(v, [x, k]), u && (f.trigger("ajaxComplete", [x, h]), --C.active || C.event.trigger("ajaxStop")))
                }
                return x
            },
            getJSON: function(t, e, n) {
                return C.get(t, e, n, "json")
            },
            getScript: function(t, e) {
                return C.get(t, void 0, e, "script")
            }
        }), C.each(["get", "post"], function(t, e) {
            C[e] = function(t, n, i, o) {
                return v(n) && (o = o || i, i = n, n = void 0), C.ajax(C.extend({
                    url: t,
                    type: e,
                    dataType: o,
                    data: n,
                    success: i
                }, C.isPlainObject(t) && t))
            }
        }), C._evalUrl = function(t) {
            return C.ajax({
                url: t,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            })
        }, C.fn.extend({
            wrapAll: function(t) {
                var e;
                return this[0] && (v(t) && (t = t.call(this[0])), e = C(t, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                    for (var t = this; t.firstElementChild;) t = t.firstElementChild;
                    return t
                }).append(this)), this
            },
            wrapInner: function(t) {
                return v(t) ? this.each(function(e) {
                    C(this).wrapInner(t.call(this, e))
                }) : this.each(function() {
                    var e = C(this),
                        n = e.contents();
                    n.length ? n.wrapAll(t) : e.append(t)
                })
            },
            wrap: function(t) {
                var e = v(t);
                return this.each(function(n) {
                    C(this).wrapAll(e ? t.call(this, n) : t)
                })
            },
            unwrap: function(t) {
                return this.parent(t).not("body").each(function() {
                    C(this).replaceWith(this.childNodes)
                }), this
            }
        }), C.expr.pseudos.hidden = function(t) {
            return !C.expr.pseudos.visible(t)
        }, C.expr.pseudos.visible = function(t) {
            return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length)
        }, C.ajaxSettings.xhr = function() {
            try {
                return new t.XMLHttpRequest
            } catch (t) {}
        };
        var Ve = {
                0: 200,
                1223: 204
            },
            $e = C.ajaxSettings.xhr();
        h.cors = !!$e && "withCredentials" in $e, h.ajax = $e = !!$e, C.ajaxTransport(function(e) {
            var n, i;
            if (h.cors || $e && !e.crossDomain) return {
                send: function(o, s) {
                    var r, a = e.xhr();
                    if (a.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                        for (r in e.xhrFields) a[r] = e.xhrFields[r];
                    for (r in e.mimeType && a.overrideMimeType && a.overrideMimeType(e.mimeType), e.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest"), o) a.setRequestHeader(r, o[r]);
                    n = function(t) {
                        return function() {
                            n && (n = i = a.onload = a.onerror = a.onabort = a.ontimeout = a.onreadystatechange = null, "abort" === t ? a.abort() : "error" === t ? "number" != typeof a.status ? s(0, "error") : s(a.status, a.statusText) : s(Ve[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                                binary: a.response
                            } : {
                                text: a.responseText
                            }, a.getAllResponseHeaders()))
                        }
                    }, a.onload = n(), i = a.onerror = a.ontimeout = n("error"), void 0 !== a.onabort ? a.onabort = i : a.onreadystatechange = function() {
                        4 === a.readyState && t.setTimeout(function() {
                            n && i()
                        })
                    }, n = n("abort");
                    try {
                        a.send(e.hasContent && e.data || null)
                    } catch (t) {
                        if (n) throw t
                    }
                },
                abort: function() {
                    n && n()
                }
            }
        }), C.ajaxPrefilter(function(t) {
            t.crossDomain && (t.contents.script = !1)
        }), C.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(t) {
                    return C.globalEval(t), t
                }
            }
        }), C.ajaxPrefilter("script", function(t) {
            void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET")
        }), C.ajaxTransport("script", function(t) {
            var e, n;
            if (t.crossDomain) return {
                send: function(o, s) {
                    e = C("<script>").prop({
                        charset: t.scriptCharset,
                        src: t.url
                    }).on("load error", n = function(t) {
                        e.remove(), n = null, t && s("error" === t.type ? 404 : 200, t.type)
                    }), i.head.appendChild(e[0])
                },
                abort: function() {
                    n && n()
                }
            }
        });
        var Me = [],
            We = /(=)\?(?=&|$)|\?\?/;
        C.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var t = Me.pop() || C.expando + "_" + be++;
                return this[t] = !0, t
            }
        }), C.ajaxPrefilter("json jsonp", function(e, n, i) {
            var o, s, r, a = !1 !== e.jsonp && (We.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && We.test(e.data) && "data");
            if (a || "jsonp" === e.dataTypes[0]) return o = e.jsonpCallback = v(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(We, "$1" + o) : !1 !== e.jsonp && (e.url += (ye.test(e.url) ? "&" : "?") + e.jsonp + "=" + o), e.converters["script json"] = function() {
                return r || C.error(o + " was not called"), r[0]
            }, e.dataTypes[0] = "json", s = t[o], t[o] = function() {
                r = arguments
            }, i.always(function() {
                void 0 === s ? C(t).removeProp(o) : t[o] = s, e[o] && (e.jsonpCallback = n.jsonpCallback, Me.push(o)), r && v(s) && s(r[0]), r = s = void 0
            }), "script"
        }), h.createHTMLDocument = function() {
            var t = i.implementation.createHTMLDocument("").body;
            return t.innerHTML = "<form></form><form></form>", 2 === t.childNodes.length
        }(), C.parseHTML = function(t, e, n) {
            return "string" != typeof t ? [] : ("boolean" == typeof e && (n = e, e = !1), e || (h.createHTMLDocument ? ((o = (e = i.implementation.createHTMLDocument("")).createElement("base")).href = i.location.href, e.head.appendChild(o)) : e = i), s = E.exec(t), r = !n && [], s ? [e.createElement(s[1])] : (s = ft([t], e, r), r && r.length && C(r).remove(), C.merge([], s.childNodes)));
            var o, s, r
        }, C.fn.load = function(t, e, n) {
            var i, o, s, r = this,
                a = t.indexOf(" ");
            return a > -1 && (i = ue(t.slice(a)), t = t.slice(0, a)), v(e) ? (n = e, e = void 0) : e && "object" == typeof e && (o = "POST"), r.length > 0 && C.ajax({
                url: t,
                type: o || "GET",
                dataType: "html",
                data: e
            }).done(function(t) {
                s = arguments, r.html(i ? C("<div>").append(C.parseHTML(t)).find(i) : t)
            }).always(n && function(t, e) {
                r.each(function() {
                    n.apply(this, s || [t.responseText, e, t])
                })
            }), this
        }, C.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
            C.fn[e] = function(t) {
                return this.on(e, t)
            }
        }), C.expr.pseudos.animated = function(t) {
            return C.grep(C.timers, function(e) {
                return t === e.elem
            }).length
        }, C.offset = {
            setOffset: function(t, e, n) {
                var i, o, s, r, a, l, c = C.css(t, "position"),
                    d = C(t),
                    u = {};
                "static" === c && (t.style.position = "relative"), a = d.offset(), s = C.css(t, "top"), l = C.css(t, "left"), ("absolute" === c || "fixed" === c) && (s + l).indexOf("auto") > -1 ? (r = (i = d.position()).top, o = i.left) : (r = parseFloat(s) || 0, o = parseFloat(l) || 0), v(e) && (e = e.call(t, n, C.extend({}, a))), null != e.top && (u.top = e.top - a.top + r), null != e.left && (u.left = e.left - a.left + o), "using" in e ? e.using.call(t, u) : d.css(u)
            }
        }, C.fn.extend({
            offset: function(t) {
                if (arguments.length) return void 0 === t ? this : this.each(function(e) {
                    C.offset.setOffset(this, t, e)
                });
                var e, n, i = this[0];
                return i ? i.getClientRects().length ? (e = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
                    top: e.top + n.pageYOffset,
                    left: e.left + n.pageXOffset
                }) : {
                    top: 0,
                    left: 0
                } : void 0
            },
            position: function() {
                if (this[0]) {
                    var t, e, n, i = this[0],
                        o = {
                            top: 0,
                            left: 0
                        };
                    if ("fixed" === C.css(i, "position")) e = i.getBoundingClientRect();
                    else {
                        for (e = this.offset(), n = i.ownerDocument, t = i.offsetParent || n.documentElement; t && (t === n.body || t === n.documentElement) && "static" === C.css(t, "position");) t = t.parentNode;
                        t && t !== i && 1 === t.nodeType && ((o = C(t).offset()).top += C.css(t, "borderTopWidth", !0), o.left += C.css(t, "borderLeftWidth", !0))
                    }
                    return {
                        top: e.top - o.top - C.css(i, "marginTop", !0),
                        left: e.left - o.left - C.css(i, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var t = this.offsetParent; t && "static" === C.css(t, "position");) t = t.offsetParent;
                    return t || gt
                })
            }
        }), C.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, e) {
            var n = "pageYOffset" === e;
            C.fn[t] = function(i) {
                return R(this, function(t, i, o) {
                    var s;
                    if (f(t) ? s = t : 9 === t.nodeType && (s = t.defaultView), void 0 === o) return s ? s[e] : t[i];
                    s ? s.scrollTo(n ? s.pageXOffset : o, n ? o : s.pageYOffset) : t[i] = o
                }, t, i, arguments.length)
            }
        }), C.each(["top", "left"], function(t, e) {
            C.cssHooks[e] = Mt(h.pixelPosition, function(t, n) {
                if (n) return n = $t(t, e), _t.test(n) ? C(t).position()[e] + "px" : n
            })
        }), C.each({
            Height: "height",
            Width: "width"
        }, function(t, e) {
            C.each({
                padding: "inner" + t,
                content: e,
                "": "outer" + t
            }, function(n, i) {
                C.fn[i] = function(o, s) {
                    var r = arguments.length && (n || "boolean" != typeof o),
                        a = n || (!0 === o || !0 === s ? "margin" : "border");
                    return R(this, function(e, n, o) {
                        var s;
                        return f(e) ? 0 === i.indexOf("outer") ? e["inner" + t] : e.document.documentElement["client" + t] : 9 === e.nodeType ? (s = e.documentElement, Math.max(e.body["scroll" + t], s["scroll" + t], e.body["offset" + t], s["offset" + t], s["client" + t])) : void 0 === o ? C.css(e, n, a) : C.style(e, n, o, a)
                    }, e, r ? o : void 0, r)
                }
            })
        }), C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(t, e) {
            C.fn[e] = function(t, n) {
                return arguments.length > 0 ? this.on(e, null, t, n) : this.trigger(e)
            }
        }), C.fn.extend({
            hover: function(t, e) {
                return this.mouseenter(t).mouseleave(e || t)
            }
        }), C.fn.extend({
            bind: function(t, e, n) {
                return this.on(t, null, e, n)
            },
            unbind: function(t, e) {
                return this.off(t, null, e)
            },
            delegate: function(t, e, n, i) {
                return this.on(e, t, n, i)
            },
            undelegate: function(t, e, n) {
                return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
            }
        }), C.proxy = function(t, e) {
            var n, i, o;
            if ("string" == typeof e && (n = t[e], e = t, t = n), v(t)) return i = s.call(arguments, 2), (o = function() {
                return t.apply(e || this, i.concat(s.call(arguments)))
            }).guid = t.guid = t.guid || C.guid++, o
        }, C.holdReady = function(t) {
            t ? C.readyWait++ : C.ready(!0)
        }, C.isArray = Array.isArray, C.parseJSON = JSON.parse, C.nodeName = I, C.isFunction = v, C.isWindow = f, C.camelCase = U, C.type = y, C.now = Date.now, C.isNumeric = function(t) {
            var e = C.type(t);
            return ("number" === e || "string" === e) && !isNaN(t - parseFloat(t))
        }, "function" == typeof define && define.amd && define("jquery", [], function() {
            return C
        });
        var Re = t.jQuery,
            je = t.$;
        return C.noConflict = function(e) {
            return t.$ === C && (t.$ = je), e && t.jQuery === C && (t.jQuery = Re), C
        }, e || (t.jQuery = t.$ = C), C
    });