var ScrollOut = function() {
    "use strict"

    function w() {}
    var E, t = [],
        S = []

    function y() {
        S.slice().forEach(function(e) { return e() })
        var e = t
        t = [], e.forEach(function(e) { return e.f.apply(0, e.a) }), E = S.length ? requestAnimationFrame(y) : 0
    }

    function D(e) {
        return e = e || w,
            function() { e.apply(0, arguments) }
    }

    function L(e, t, n) { return e < t ? t : n < e ? n : e }

    function b(e) { return (0 < e) - (e < 0) }
    var n = {}

    function A(e) { return n[e] || (n[e] = e.replace(/([A-Z])/g, r)) }

    function r(e) { return "-" + e[0].toLowerCase() }
    var H = window,
        O = document.documentElement

    function P(e, t) { return e && 0 != e.length ? e.nodeName ? [e] : [].slice.call(e[0].nodeName ? e : (t || O).querySelectorAll(e)) : [] }
    var x = D(function(e, t) { for (var n in t) e.setAttribute("data-" + A(n), t[n]) }),
        W = "scroll",
        N = "resize",
        T = "addEventListener",
        $ = "removeEventListener",
        _ = 0
    return function(v) {
        var o, i, c, l, h, d, t, s = D((v = v || {}).onChange),
            f = D(v.onHidden),
            u = D(v.onShown),
            a = v.cssProps ? (o = v.cssProps, D(function(e, t) {
                for (var n in t)(1 == o || o[n]) && e.style.setProperty("--" + A(n), (r = t[n], Math.round(1e4 * r) / 1e4))
                var r
            })) : w,
            e = v.scrollingElement,
            n = e ? P(e)[0] : H,
            p = e ? P(e)[0] : O,
            r = ++_,
            g = function(e, t, n) { return e[t + r] != (e[t + r] = JSON.stringify(n)) },
            m = function() { l = !0 },
            X = function() {
                var u = p.clientWidth,
                    a = p.clientHeight,
                    e = b(-h + (h = p.scrollLeft || H.pageXOffset)),
                    t = b(-d + (d = p.scrollTop || H.pageYOffset)),
                    n = p.scrollLeft / (p.scrollWidth - u || 1),
                    r = p.scrollTop / (p.scrollHeight - a || 1)
                i = { scrollDirX: e, scrollDirY: t, scrollPercentX: n, scrollPercentY: r }, l && (l = !1, c = P(v.targets || "[data-scroll]", P(v.scope || p)[0]).map(function(e) { return { $: e, ctx: {} } })), c.forEach(function(e) {
                    var t = e.$,
                        n = t.offsetLeft,
                        r = t.offsetTop,
                        o = t.clientWidth,
                        i = t.clientHeight,
                        c = (L(n + o, h, h + u) - L(n, h, h + u)) / o,
                        l = (L(r + i, d, d + a) - L(r, d, d + a)) / i,
                        s = L((h - (o / 2 + n - u / 2)) / (u / 2), -1, 1),
                        f = L((d - (i / 2 + r - a / 2)) / (a / 2), -1, 1)
                    e.ctx = { elementHeight: i, elementWidth: o, intersectX: 1 == c ? 0 : b(n - h), intersectY: 1 == l ? 0 : b(r - d), offsetX: n, offsetY: r, viewportX: s, viewportY: f, visibleX: c, visibleY: l, visible: +(v.offset ? v.offset <= d : (v.threshold || 0) < c * l) }
                })
            },
            Y = (t = function() {
                if (c) {
                    g(p, "_S", i) && (x(p, { scrollDirX: i.scrollDirX, scrollDirY: i.scrollDirY }), a(p, i))
                    for (var e = c.length - 1; - 1 < e; e--) {
                        var t = c[e],
                            n = t.$,
                            r = t.ctx,
                            o = r.visible
                        g(n, "_SO", r) && a(n, r), g(n, "_SV", o) && (x(n, { scroll: o ? "in" : "out" }), s(n, r, p), (o ? u : f)(n, r, p)), o && v.once && c.splice(e, 1)
                    }
                }
            }, S.push(t), E || y(), function() {!(S = S.filter(function(e) { return e != t })).length && E && cancelAnimationFrame(E) })
        return m(), X(), H[T](N, m), n[T](W, X), { index: m, update: X, teardown: function() { Y(), H[$](N, m), n[$](W, X) } }
    }
}()