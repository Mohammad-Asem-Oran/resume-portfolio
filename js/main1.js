var utils;
(utils = utils || {}).cookies = {
    get: function(t) {
        let e = document.cookie.match(new RegExp("(?:^|; )" + t.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
        return e ? decodeURIComponent(e[1]) : void 0
    }
}, (utils = utils || {}).arrayHelper = {
    findIndex: function(t, e, i) {
        if (!t || !Array.isArray(t)) return 0;
        for (var n = 0; n < t.length; n += 1)
            if (t[n][e] === i) return n;
        return -1
    },
    replaceElement: function(t, e, i) {
        let n = t.indexOf(e);
        n > -1 && (t[n] = i)
    },
    deleteElement: function(t, e) {
        let i = t.indexOf(e);
        i > -1 && t.splice(i, 1)
    },
    deleteWithIndex: function(t, e) {
        t.splice(e, 1)
    },
    deleteWithProp: function(t, e, i) {
        let n = utils.arrayHelper.findIndex(t, e, i);
        return -1 !== n && (utils.arrayHelper.deleteWithIndex(t, n), !0)
    },
    deleteWithGuid: function(t, e) {
        let i = utils.arrayHelper.findIndex(t, "Guid", e); - 1 !== i && utils.arrayHelper.deleteWithIndex(t, i)
    },
    findItem: function(t, e, i) {
        return t.find(t => t[e] === i)
    },
    findItemBy2Prop: function(t, e, i, n, o) {
        return t.find(t => t[e] === i && t[n] === o)
    },
    filterItems: function(t, e, i) {
        return t.filter(t => t[e] === i)
    },
    filterItemsBy2Prop: function(t, e, i, n, o) {
        return t.filter(t => t[e] === i && t[n] === o)
    },
    findItemByGuid: function(t, e) {
        return utils.arrayHelper.findItem(t, "Guid", e)
    },
    findItemsWithProp: function(t, e) {
        return $.grep(t, function(t) {
            return t[e]
        })
    },
    mergeArrays: function(t, e) {
        return [...t, ...e]
    }
}, utils.objectHelper = {
    findItemByGuid: function(t, e) {
        for (let i in t)
            if (t[i].Guid === e) return t[i];
        return !1
    },
    findItem: function(t, e, i) {
        for (let n in t)
            if (t[n][e] === i) return t[n];
        return !1
    },
    findIndex: function(t, e, i) {
        for (let n in t)
            if (t[n][e] === i) return n;
        return !1
    }
}, (utils = utils || {}).miscFront = {
    generateGuid: function() {
        let t = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            i = e.charAt(Math.floor(Math.random() * e.length + 1));
        for (let e = 15; e > 0; --e) i += t[Math.floor(Math.random() * t.length)];
        return i
    },
    pxToVw: function(t) {
        let e = utils.environment.wWidth();
        return Math.round(t / e * 100 * 1e4) / 1e4
    },
    isElementInViewport(t) {
        let e = t.getBoundingClientRect();
        return e.top >= 0 && e.left >= 0 && e.bottom <= (window.innerHeight || document.documentElement.clientHeight) && e.right <= (window.innerWidth || document.documentElement.clientWidth)
    },
    isPbDomain: t => -1 !== t.indexOf(".portfoliobox.net") || (-1 !== t.indexOf(".portfoliobox.io") || (-1 !== t.indexOf(".pb.photography") || (-1 !== t.indexOf(".pb.design") || (-1 !== t.indexOf(".pb.style") || (-1 !== t.indexOf(".pb.studio") || (-1 !== t.indexOf(".pb.online") || -1 !== t.indexOf(".pb.store"))))))),
    preloadImg(t) {
        window.preloadedImg = window.preloadedImg || {}, window.preloadedImg[t] || (window.preloadedImg[t] = new Image, window.preloadedImg[t].src = t)
    },
    trackViewPoint: function(t) {
        let e = {
                root: null,
                rootMargin: window.pb.isAdmin ? "12% 8% 5% 8%" : "0px 0px 0px 0px",
                threshold: [0]
            },
            i = new IntersectionObserver(function(t) {
                t.forEach(t => {
                    t.isIntersecting ? t.target.classList.add("inViewPoint") : t.isVisible || t.target.classList.remove("inViewPoint")
                })
            }, e),
            n = document.querySelectorAll(t);
        for (let t of n) i.observe(t)
    },
    validateEmail: t => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(t).toLowerCase()),
    mathRound2: t => utils.miscFront.roundDigits(t, 2),
    mathRound1: t => utils.miscFront.roundDigits(t, 1),
    roundDigits(t, e) {
        let i = 10 ** e;
        return (Math.round(t * i) / i).toFixed(e)
    },
    mathRound0: t => Math.round(t),
    roundForCurrency(t, e) {
        if (!t) return t;
        if (e) {
            let i = utils.objectHelper.findItem(resource.frontCurrencies, "abbreviation", e);
            if (i && "undefined" !== i.decimalPlaces) {
                let e = i.decimalPlaces;
                return 0 === e ? Math.round(t) : (t = utils.miscFront.roundDigits(t, e), utils.miscFront.roundGood(t))
            }
            return utils.miscFront.roundGood(t)
        }
        return utils.miscFront.roundGood(t)
    },
    roundGood: t => utils.miscFront.countDecimals(t) > 0 ? t > 1e3 ? utils.miscFront.mathRound0(t) : t > 10 ? utils.miscFront.mathRound1(t) : utils.miscFront.mathRound2(t) : t,
    countDecimals: t => t % 1 != 0 ? t.toString().split(".")[1].length : 0,
    mathFloor2: t => Math.floor(100 * t) / 100,
    adjustThumbForScreen: (t, e) => (utils.environment.widthConst < 400 ? "w1000" === t && (t = "w400") : utils.environment.widthConst < 600 ? t && "h800" !== t && "h400" !== t || (t = "w1000") : utils.environment.widthConst < 1e3 ? t ? "h800" === t || "h400" === t ? t = "w1000" : "w400" === t && (t = "w1000") : t = "w1000" : utils.environment.widthConst > 1200 && e && e > 3 ? "w400" === t ? t = "w1000" : "h400" === t && (t = "h800") : utils.environment.widthConst > 2100 && e && 3 == e && ("w400" === t ? t = "w1000" : "h400" === t && (t = "h800")), t),
    shareLink: {
        facebook: function(t) {
            return "https://www.facebook.com/sharer/sharer.php?u=" + t
        },
        twitter: function(t, e) {
            return "https://www.twitter.com/share?text=" + e + "&url=" + t + "&hashtags=creativity,visuals,website,portfoliobox"
        },
        linkedIn: function(t) {
            return "https://www.linkedin.com/shareArticle?mini=true&url=" + t + "&title=" + site.state.Title + "&summary=Checkout my website!"
        },
        pinterest: function(t, e) {
            return "https://www.pinterest.com/pin/create/button/?url=" + t + "&description=" + site.state.Title + "&media=" + e
        }
    },
    renderCaptchaAndGetToken: function(t) {
        return new Promise(function(t, e) {
            var i = grecaptcha.render("recaptchaHolder", {
                sitekey: "6LfffzgUAAAAAJiFD4FTqkSqn1AeJanRwl6EuLyT",
                size: "invisible",
                badge: "bottomright",
                callback: function(e) {
                    t(e)
                }
            });
            grecaptcha.execute(i);
            var n = 1,
                o = function() {
                    setTimeout(function() {
                        var t = document.getElementsByTagName("iframe");
                        if (t && t.length > 0)
                            for (var e = 0; e < t.length; e++) {
                                var i = t[e];
                                if (i.src.indexOf("www.recaptcha.net/recaptcha/api2/bframe") > -1) {
                                    if (i.title.indexOf("recaptcha") > -1) {
                                        var s = i.parentElement;
                                        if (s) {
                                            var r = s.previousSibling;
                                            r && (r.style["pointer-events"] = "none")
                                        }
                                    }
                                    return !0
                                }
                            }
                        return ++n < 20 && o(), !1
                    }, 300)
                };
            o()
        })
    },
    addBrowserClassToBody: function() {
        let t = utils.environment.getBrowser();
        t && t.name && document.body.classList.add("b" + t.name), t && t.name && t.version && document.body.classList.add("b" + t.name + "-" + t.version)
    },
    makeIFrame: function(t, e, i, n, o, s, r) {
        return t += "?enablejsapi=1", "1" == n && (t += "&title=0&byline=0&portrait=0&sidedock=0&controls=0&modestbranding=1&autohide=1&showinfo=0"), "1" == o && (t += "&autoplay=1"), "1" == s && (t += "&background=1"), r || (r = "iframe-video"), '<iframe id="' + r + '" width="' + e + '" height="' + i + '" src="' + t + '" frameborder="0" allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    },
    isProductSoldOut: function(t, e) {
        let i, n = !1;
        return 1 === t.Inventory.DoTrack && checkoutStore.state.cart.products.length > 0 && (e ? (i = utils.arrayHelper.findItem(checkoutStore.state.cart.products, "VariantGuid", e.Guid)) && i.Quantity >= e.Inventory && (n = !0) : (i = utils.arrayHelper.findItemByGuid(checkoutStore.state.cart.products, t.Guid)) && i.Quantity >= t.Inventory.Inventory && (n = !0)), !!n
    },
    isBookingSoldOut: function(t, e) {
        let i, n = !1;
        return checkoutStore.state.cart.products.length > 0 && (e ? (i = utils.arrayHelper.findItem(checkoutStore.state.cart.products, "VariantGuid", e.Guid)) && i.Quantity >= e.Seats - e.BookedSeats && (n = !0) : (i = utils.arrayHelper.findItemByGuid(checkoutStore.state.cart.products, t.Guid)) && i.Quantity >= t.Seats - t.BookedSeats && (n = !0)), !!n
    },
    isHostInReferrerIsExternal: function() {
        if (document.referrer) {
            let t = document.referrer.split("/");
            if (t[2] && "portfoliobox.net" !== t[2] && t[2] !== site.state.Url) return !0
        }
        return !1
    },
    getCountryCode: function() {},
    convertToRGBA: function(t, e = .2) {
        if (t.startsWith("#")) {
            return `rgba(${parseInt(t.slice(1,3),16)}, ${parseInt(t.slice(3,5),16)}, ${parseInt(t.slice(5,7),16)}, ${e})`
        }
        if (t.startsWith("rgb")) {
            let i = t.replace("rgb", "rgba");
            if (i.includes("rgba")) {
                let t = i.match(/[\d.]+/g);
                t[3] = e.toString(), i = `rgba(${t.join(", ")})`
            } else i = i.replace(")", `, ${e})`);
            return i
        }
    }
}, (utils = utils || {}).jsonLd = {
    product: function(t, e, i, n) {
        let o = t.TextContent.replace(/<\/?[^>]+(>|$)/g, ""),
            s = [];
        t.Items && t.Items.length > 0 && t.Items.forEach(function(t) {
            s.push(t.Content.Src)
        });
        let r = {
            "@context": "https://schema.org/",
            "@type": "Product",
            name: t.Title ? t.Title : "",
            image: s,
            description: o,
            sku: t.Guid,
            offers: {
                "@type": "Offer",
                url: e,
                priceCurrency: n.Currency,
                price: t.Price,
                availability: "https://schema.org/InStock",
                seller: {
                    "@type": "Organization",
                    name: i
                },
                brand: {
                    "@type": "Brand",
                    name: i
                }
            }
        };
        return JSON.stringify(r)
    },
    post: function(t, e, i) {
        let n = t.TextContent.replace(/<\/?[^>]+(>|$)/g, ""),
            o = t.TextContent.substring(0, 255),
            s = [];
        t.Items && t.Items.length > 0 && t.Items.forEach(function(t) {
            s.push(t.Content.Src)
        });
        let r = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: t.Title,
            image: s,
            publisher: i,
            url: e,
            datePublished: t.PostDate,
            dateCreated: t.PostDate,
            description: o,
            articleBody: n,
            author: {
                "@type": "Person",
                name: i
            }
        };
        return JSON.stringify(r)
    },
    page: function(t, e) {
        let i = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.SeoTitle ? t.SeoTitle : t.Title,
            description: t.SeoDescription ? t.SeoDescription : "",
            url: e
        };
        return JSON.stringify(i)
    },
    blogOrStore: function(t, e, i) {
        let n = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t,
            description: e,
            url: i
        };
        return JSON.stringify(n)
    }
}, (utils = utils || {}).environment = {
    widthConst: 0,
    wHeight: function() {
        let t = window,
            e = document,
            i = e.documentElement,
            n = e.getElementsByTagName("body")[0];
        return t.innerHeight || i.clientHeight || n.clientHeight
    },
    wWidth: function() {
        let t = window,
            e = document,
            i = e.documentElement,
            n = e.getElementsByTagName("body")[0];
        return t.innerWidth || i.clientWidth || n.clientWidth
    },
    isTouch: function() {
        return "ontouchstart" in document.documentElement
    },
    _browser: {
        name: "",
        version: ""
    },
    getBrowser: function() {
        if (utils.environment._browser.name) return utils.environment._browser;
        var t, e = navigator.userAgent,
            i = e.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        return /trident/i.test(i[1]) ? {
            name: "IE",
            version: (t = /\brv[ :]+(\d+)/g.exec(e) || [])[1] || ""
        } : "Chrome" === i[1] && null != (t = e.match(/\bOPR|Edge\/(\d+)/)) ? {
            name: "Opera",
            version: t[1]
        } : (i = i[2] ? [i[1], i[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (t = e.match(/version\/(\d+)/i)) && i.splice(1, 1, t[1]), utils.environment._browser = {
            name: i[0],
            version: i[1]
        }, utils.environment._browser)
    },
    _localDateFormat: null,
    getLocalFormattedDate: function(t) {
        const e = t.split(" ")[0],
            [i, n, o] = e.split("-");
        return `${o} ${["January","February","March","April","May","June","July","August","September","October","November","December"][parseInt(n)-1]}, ${i}`
    }
}, utils.environment.widthConst = utils.environment.wWidth(), (utils = utils || {}).templates = {
    sameRatioScript: function(t, e, i) {
        let n;
        n = t.$refs.items.$el ? t.$refs.items.$el : t.$refs.items;
        let o, s = utils.miscFront.pxToVw(n.clientWidth),
            r = function(t) {
                let e;
                return t.Settings || t.Settings["item-size"] ? e = "1" === t.Settings["item-size"] ? 6 : "2" === t.Settings["item-size"] ? 5 : "3" === t.Settings["item-size"] ? 4 : "4" === t.Settings["item-size"] ? 3 : "5" === t.Settings["item-size"] ? 2 : 4 : 4
            }(i),
            a = function(t) {
                return t.Settings && void 0 !== t.Settings["item-margin"] && null !== t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(i),
            l = (s - (r - 1) * a) / (r * e);
        o = i.Content && Array.isArray(i.Content) ? i.Content : document.getElementById(i.Guid).getElementsByClassName("Item");
        for (let t of o) {
            let e;
            e = t.Guid ? t.Guid : t.dataset.id;
            let i = document.getElementById("imgWrapper-" + e);
            i && (i.style.height = l + "vw")
        }
        n.style.gridGap = a + "vw", n.style.gridTemplateColumns = "repeat(" + r + ", 1fr)"
    },
    boxesScript: function(t, e) {
        let i = function(t) {
                let e;
                return t.Settings || t.Settings["item-size"] ? e = "1" === t.Settings["item-size"] ? 6 : "2" === t.Settings["item-size"] ? 5 : "3" === t.Settings["item-size"] ? 4 : "4" === t.Settings["item-size"] ? 3 : "5" === t.Settings["item-size"] ? 2 : 4 : 4
            }(e),
            n = function(t) {
                return t.Settings && void 0 !== t.Settings["item-margin"] && null !== t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(e),
            o = t.$refs.items;
        o.style.gridGap = n + "vw", o.style.gridTemplateColumns = "repeat(" + i + ", 1fr)", o.style.setProperty("--nr-of-columns", i)
    },
    carouselScript: function(t, e) {
        let i = function(t) {
            let e;
            return t.Settings || t.Settings["item-size"] ? e = "1" === t.Settings["item-size"] ? 1 : "2" === t.Settings["item-size"] ? 2 : "3" === t.Settings["item-size"] ? 3 : "4" === t.Settings["item-size"] ? 4 : "5" === t.Settings["item-size"] ? 5 : 4 : 4
        }(e);
        t.$refs.items.style.setProperty("--size", i)
    },
    sameRatioStoreScript: function(t, e) {
        let i = utils.miscFront.pxToVw(t.$refs.items.clientWidth),
            n = function(t) {
                let e;
                return t || t["item-size"] ? e = "1" === t["item-size"] ? 6 : "2" === t["item-size"] ? 5 : "3" === t["item-size"] ? 4 : "4" === t["item-size"] ? 3 : "5" === t["item-size"] ? 2 : 4 : 4
            }(t.store.Settings),
            o = (s = t.store.Settings) || s["item-margin"] ? parseFloat(s["item-margin"]) : 1;
        var s;
        let r = (i - (n - 1) * o) / (n * e);
        for (let e of t.products) {
            let t = e.Guid;
            document.getElementById("imgWrapper-" + t) && (document.getElementById("imgWrapper-" + t).style.height = r + "vw")
        }
        let a = t.$refs.items;
        a.style.gridGap = o + "vw", a.style.gridTemplateColumns = "repeat(" + n + ", 1fr)"
    },
    threeOneScript: function(t, e = 1) {
        let i = t.section.ElementsFixed.Items1,
            n = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
            }(i);
        t.$refs.items.$el.style.width = n + "%";
        let o, s = Math.floor(10 * utils.miscFront.pxToVw(t.$refs.items.$el.clientWidth)) / 10,
            r = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(i),
            a = [];
        o = i.Content && Array.isArray(i.Content) ? i.Content : document.getElementById(i.Guid).getElementsByClassName("Item");
        let l, u, c = 0;
        for (let t of o) {
            let n;
            if (n = t.Content ? t.Content.Width ? t.Content.Width / t.Content.Height : 1 : t.getAttribute("iwidth") / t.getAttribute("iheight"), (c + e) % 4 != 0) {
                if ((c + 3 + e) % 4 == 0 && (l = {
                        height: 20,
                        items: []
                    }), l.items.push({
                        Guid: t.Guid ? t.Guid : t.dataset.id
                    }), a.push(l), (c + 1 + e) % 4 == 0) {
                    let t, e, a = o[c - 1],
                        d = o[c - 2];
                    i.Content && Array.isArray(i.Content) ? (t = a.Content.Width ? a.Content.Width / a.Content.Height : 1, e = d.Content.Width ? d.Content.Width / d.Content.Height : 1) : (t = a.getAttribute("iwidth") / a.getAttribute("iheight"), e = d.getAttribute("iwidth") / d.getAttribute("iheight")), u = (s - 2 * r) / (n + t + e), l.height = u
                }
            } else(l = {
                height: s / n,
                items: []
            }).items.push({
                Guid: t.Guid ? t.Guid : t.dataset.id
            }), a.push(l);
            c++
        }
        a.forEach(function(t, e) {
            t.items.forEach(function(e, i) {
                let n = document.getElementById("item-" + e.Guid);
                document.getElementById("imgWrapper-" + e.Guid).style.height = t.height + "vw", n.style.marginBottom = r + "vw"
            })
        })
    },
    twoOneScript: function(t, e = 1) {
        let i = t.section.ElementsFixed.Items1,
            n = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
            }(i);
        t.$refs.items.$el.style.width = n + "%";
        let o, s = Math.floor(10 * utils.miscFront.pxToVw(t.$refs.items.$el.clientWidth)) / 10,
            r = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(i),
            a = [];
        o = i.Content && Array.isArray(i.Content) ? i.Content : document.getElementById(i.Guid).getElementsByClassName("Item");
        let l, u, c = 0;
        for (let t of o) {
            let n;
            if (n = t.Content ? t.Content.Width ? t.Content.Width / t.Content.Height : 1 : t.getAttribute("iwidth") / t.getAttribute("iheight"), (c + e) % 3 != 0) {
                if ((c + 2 + e) % 3 == 0 && (l = {
                        height: 30,
                        items: []
                    }), l.items.push({
                        Guid: t.Guid ? t.Guid : t.dataset.id,
                        Ratio: n
                    }), a.push(l), (c + 2 + e) % 3 != 0) {
                    let t, e = o[c - 1];
                    t = i.Content && Array.isArray(i.Content) ? e.Content.Width ? e.Content.Width / e.Content.Height : 1 : e.getAttribute("iwidth") / e.getAttribute("iheight"), u = (s - r) / (n + t), l.height = u
                }
            } else(l = {
                height: s / n,
                items: []
            }).items.push({
                Guid: t.Guid ? t.Guid : t.dataset.id
            }), a.push(l);
            c++
        }
        a.forEach(function(t, e) {
            t.items.forEach(function(e, i) {
                let n = document.getElementById("item-" + e.Guid),
                    o = document.getElementById("imgWrapper-" + e.Guid),
                    s = n.querySelector(".aFigcaption");
                const a = e.Ratio ? t.height * e.Ratio + "vw" : "100%";
                o.style.height = t.height + "vw", o.style.width = a, n.style.marginBottom = r + "vw", s && (s.style.width = a)
            })
        })
    },
    verticalAndLists: function(t) {
        let e = t.section.ElementsFixed.Items1,
            i = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(e),
            n = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
            }(e),
            o = document.getElementById(e.Guid);
        o.style.width = n + "%", o.style.gridGap = 2 * i + "vw", o.style.setProperty("--size-width", n)
    },
    dynamicGrid: function(t, e) {
        let i, n = t.$refs.items.$el,
            o = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 6 : "2" === t.Settings["item-size"] ? 5 : "3" === t.Settings["item-size"] ? 4 : "4" === t.Settings["item-size"] ? 3 : "5" === t.Settings["item-size"] ? 2 : 4
            }(e),
            s = function(t) {
                return t.Settings && t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(e),
            r = function(t, e, i) {
                return (utils.miscFront.pxToVw(t.clientWidth) - (e - 1) * i) / e
            }(n, o, s),
            a = function(t) {
                let e = {};
                for (let i = 0; i < t; i++) e[i] || (e[i] = {
                    top: 0
                });
                return e
            }(o),
            l = function(t) {
                return t.Settings["figcap-position"].includes("bottom") ? 6 : 0
            }(e),
            u = 0,
            c = 0;
        i = e.Content && Array.isArray(e.Content) ? e.Content : document.getElementById(e.Guid).getElementsByClassName("Item");
        for (let t of i) {
            let e, i;
            t.Content ? (e = t.Guid, i = t.Content.Width / t.Content.Height, i = t.Content.Width ? t.Content.Width / t.Content.Height : 1) : (e = t.dataset.id, i = t.getAttribute("iwidth") / t.getAttribute("iheight"));
            let n = utils.miscFront.mathFloor2(r / i);
            for (let t = o; t > 0; t--) a[t - 1].top <= c && (c = a[t - 1].top, u = t - 1);
            let d = 0;
            0 !== a[u].top && (d = a[u].top + s + l);
            let m = u * (r + s),
                g = document.getElementById("item-" + e),
                h = document.getElementById("imgWrapper-" + e);
            h && (h.style.height = n + "vw", h.style.width = r + "vw", g.style.top = d + "vw", g.style.left = m + "vw", g.style.marginBottom = s + "vw"), a[u].top = d + n, c = a[u].top
        }! function() {
            let t = 0;
            for (let e = 0; e < o; e++) a[e].top > t && (t = a[e].top);
            let i = t;
            e.Settings["figcap-position"].includes("bottom") && (i = t + 6), n.style.height = i + "vw"
        }()
    },
    horizontalScript: function(t) {
        let e, i = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
            }(t),
            n = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(t);
        e = t.Content && Array.isArray(t.Content) ? t.Content : document.getElementById(t.Guid).getElementsByClassName("Item");
        for (let t of e) {
            let e;
            e = t.Content ? t.Guid : t.dataset.id, document.getElementById("img-" + e).style.height = i + "vh", document.getElementById("item-" + e).style.marginRight = n + "vw"
        }
    },
    verticalScript: function(t, e) {
        let i, n = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(e),
            o = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 45 : "2" === t.Settings["item-size"] ? 60 : "3" === t.Settings["item-size"] ? 70 : "4" === t.Settings["item-size"] ? 83 : "5" === t.Settings["item-size"] ? 100 : 70
            }(e),
            s = document.getElementById(e.Guid);
        s.style.width = o + "%", i = e.Content && Array.isArray(e.Content) ? e.Content : s.getElementsByClassName("Item");
        for (let t of i) {
            let e;
            e = t.Content ? t.Guid : t.dataset.id, document.getElementById("item-" + e).style.marginBottom = 2 * n + "vw"
        }
    },
    productSideBySide: function(t, e) {
        let i = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(e),
            n = function(t) {
                let e;
                return e = "1" === t.Settings["item-size"] ? 30 : "2" === t.Settings["item-size"] ? 40 : "3" === t.Settings["item-size"] ? 50 : "4" === t.Settings["item-size"] ? 60 : "5" === t.Settings["item-size"] ? 70 : 50
            }(e),
            o = document.getElementById("sideBySideImageWrapper");
        document.getElementById(e.Guid).style.width = n + 30 + "%", o.style.width = n + "%", o.style.marginRight = 2 * i + "%"
    },
    evenRows: function(t, e) {
        let i = document.getElementById(e.Guid);
        i.style.width = "100%";
        let n, o = Math.floor(1 * utils.miscFront.pxToVw(i.clientWidth)) / 1,
            s = function(t) {
                let e;
                return t.Settings || t.Settings["item-size"] ? e = "1" === t.Settings["item-size"] ? 10 : "2" === t.Settings["item-size"] ? 13 : "3" === t.Settings["item-size"] ? 15 : "4" === t.Settings["item-size"] ? 20 : "5" === t.Settings["item-size"] ? 25 : 15 : 15
            }(e),
            r = function(t) {
                return t.Settings || t.Settings["item-margin"] ? parseFloat(t.Settings["item-margin"]) : 1
            }(e),
            a = 0,
            l = [],
            u = {
                newHeight: 0,
                items: []
            },
            c = 0,
            d = 0,
            m = 0,
            g = 0,
            h = 0;
        n = e.Content && Array.isArray(e.Content) ? e.Content : document.getElementById(e.Guid).getElementsByClassName("Item");
        for (let t of n) {
            let e;
            t.Content ? (e = t.Guid, c = t.Content.Width ? t.Content.Width / t.Content.Height : 1) : (e = t.dataset.id, c = t.getAttribute("iwidth") / t.getAttribute("iheight")), a += m = s * c, 0 !== g && (h += r), a + h >= o && (l.push(u), u = {
                newHeight: 0,
                items: []
            }, a = m, d = 0, g = 0, h = 0), d = (a + h) / s, u.newHeight = Math.floor(o / d * 10) / 10, u.items.push({
                Guid: e
            }), g++
        }
        u.items.length > 0 && l.push(u);
        let p = null,
            f = null;
        l.forEach(function(t, e) {
            t.items.forEach(function(i, n) {
                p = document.getElementById("item-" + i.Guid), f = document.getElementById("imgWrapper-" + i.Guid);
                p.style.marginBottom = 0, p.style.marginLeft = 0, p.style.marginRight = 0;
                e !== l.length - 1 ? (f.style.height = t.newHeight + "vw", p.style.marginBottom = r + "vw") : f.style.height = s + "vw", 0 !== n && (p.style.marginLeft = r + "vw")
            })
        }), i.style.width = "100%", 0 === r ? i.style.justifyContent = "flex-start" : (i.style.justifyContent = "space-between", p.style.marginRight = "auto")
    },
};
let pages = {
        state: {
            current: {
                url: "",
                page: {},
                showLightbox: !1
            },
            startPage: null,
            pages: []
        },
        actions: {
            getStartPage() {
                if (pages.state.startPage) return pages.state.startPage;
                {
                    let t = utils.arrayHelper.findItem(pages.state.pages, "IsStartPage", 1);
                    return pages.state.startPage = t
                }
            },
            getCurrentPage(t) {
                if (t === pages.state.current.url && pages.state.current.page.Guid) return pages.state.current.page;
                {
                    let e;
                    return !!(e = "/" === t ? pages.actions.getStartPage() : utils.arrayHelper.findItem(pages.state.pages, "Url", t)) && (pages.state.current.page = e)
                }
            },
            setNewStartPage(t) {
                pages.state.startPage = t
            },
            isUrlAvailable: t => !utils.arrayHelper.findItem(pages.state.pages, "Url", t),
            getNewAvailableUrlBasedOnUrl(t) {
                let e = 2,
                    i = "";
                for (;;) {
                    if (i = t + e, pages.actions.isUrlAvailable(i)) {
                        t = i;
                        break
                    }
                    e++
                }
                return t
            },
            init: {
                serverPages: function(t) {
                    pages.state.pages = t
                }
            }
        }
    },
    pwdPages = {
        state: {
            current: {
                url: "",
                page: {},
                showLightbox: !1
            },
            startPage: null,
            pages: []
        },
        actions: {
            getCurrentPage(t, e) {
                if (pwdPages.state.current.page && t === pwdPages.state.current.page.Url) e(pwdPages.state.current.page);
                else {
                    let i;
                    (i = utils.arrayHelper.findItem(pwdPages.state.pages, "Url", t)) ? (pwdPages.state.current.page = i, e(i)) : window.pb.isAdmin ? e(!1) : frontApi.getPwdPage(t).then(t => {
                        "no-page" === t ? e("no-page") : "not-logged-in" === t ? e("not-logged-in") : (pwdPages.state.current.page = t, pwdPages.state.pages.push(t), e(t))
                    })
                }
            },
            isUrlAvailable: t => !utils.arrayHelper.findItem(pwdPages.state.pages, "Url", t),
            getNewAvailableUrlBasedOnUrl(t) {
                let e = 2,
                    i = "";
                for (;;) {
                    if (i = t + e, pwdPages.actions.isUrlAvailable(i)) {
                        t = i;
                        break
                    }
                    e++
                }
                return t
            },
            init: {
                serverPages: function(t) {
                    pwdPages.state.pages = t
                }
            }
        }
    },
    checkoutStore = {
        state: {
            cart: {
                products: [],
                nrInCart: 0
            },
            lastAddedProduct: {},
            showCheckout: !1,
            showAddedToCart: !1,
            straitToCheckout: !1
        },
        actions: {
            init: function() {
                checkoutStore.actions._fetchLocalStorage()
            },
            addToCart: function(t, e) {
                let i;
                if ((i = e ? utils.arrayHelper.findItemBy2Prop(checkoutStore.state.cart.products, "VariantGuid", e.Guid, "Guid", t.Guid) : utils.arrayHelper.findItemByGuid(checkoutStore.state.cart.products, t.Guid)) && !e) i.Quantity++, checkoutStore.state.lastAddedProduct = i;
                else if (e && i && e.Guid === i.VariantGuid) i.Quantity++, checkoutStore.state.lastAddedProduct = i;
                else {
                    let i;
                    i = "asset" === t.ProductType || "scheduling" === t.ProductType ? t : {
                        ProductType: "product",
                        Guid: t.Guid,
                        AssetGuid: t.AssetGuid,
                        CartGuid: t.Guid,
                        Title: t.Title,
                        Url: t.Url,
                        Src: t.Items && t.Items.length > 0 ? t.Items[0].Content.Src : "",
                        Price: utils.miscFront.mathRound2(t.Price),
                        ExcludeTax: t.ExcludeTax,
                        Weight: t.Shipping && t.Shipping.IsPhysical ? t.Shipping.Weight : 0,
                        IsPhysical: t.Shipping.IsPhysical,
                        Quantity: 1,
                        TrackInventory: t.Inventory.DoTrack,
                        Inventory: t.Inventory.Inventory
                    }, e && (i.CartGuid = t.Guid + e.Guid, i.VariantGuid = e.Guid, i.VariantTitle = e.Title, i.IsPhysical = t.Shipping.IsPhysical, i.Weight = t.Shipping && t.Shipping.IsPhysical ? e.Weight : 0, i.Price = utils.miscFront.mathRound2(e.Price), i.Inventory = e.Inventory), t.Discount && (i.Price = utils.miscFront.mathRound2(i.Price * (1 - t.Discount / 100)), i.Discount = t.Discount), checkoutStore.state.cart.products.push(i), checkoutStore.state.cart.nrInCart++, checkoutStore.state.lastAddedProduct = i, site.state.GoogleAnalyticsId && !window.pb.isAdmin && gtag("event", "add_to_cart", {
                        currency: site.state.StoreSettings.Currency,
                        value: i.Price,
                        items: [{
                            item_id: i.Guid,
                            item_name: i.Title,
                            price: i.Price,
                            quantity: 1
                        }]
                    }), site.state.PixelEventManagerId && !window.pb.isAdmin && fbq("track", "AddToCart", {
                        currency: site.state.StoreSettings.Currency,
                        value: i.Price,
                        content_ids: [i.Guid],
                        content_name: i.Title,
                        contents: [{
                            id: i.Guid,
                            quantity: 1,
                            item_price: i.Price
                        }]
                    })
                }
                checkoutStore.actions._updateLocalStorage()
            },
            addBookingToCart: function(t, e) {
                let i;
                if ((i = e ? utils.arrayHelper.findItemBy2Prop(checkoutStore.state.cart.products, "VariantGuid", e.Guid, "Guid", t.Guid) : utils.arrayHelper.findItemByGuid(checkoutStore.state.cart.products, t.Guid)) && !e) i.Quantity++, checkoutStore.state.lastAddedProduct = i;
                else if (e && i && e.Guid === i.VariantGuid) i.Quantity++, checkoutStore.state.lastAddedProduct = i;
                else {
                    let i;
                    i = {
                        ProductType: "booking",
                        Guid: t.Guid,
                        BookingGuid: t.Guid,
                        CartGuid: t.Guid,
                        Title: t.Title,
                        Src: t.Items ? t.Items.Src : "",
                        Price: utils.miscFront.mathRound2(t.Price),
                        ExcludeTax: t.ExcludeTax,
                        Quantity: 1,
                        Seats: t.Seats,
                        BookedSeats: t.BookedSeats
                    }, e && (i.CartGuid = t.Guid + e.Guid, i.VariantGuid = e.Guid, i.VariantTitle = e.Title, i.Price = utils.miscFront.mathRound2(e.Price), i.Quantity = 1, i.Seats = e.Seats, i.BookedSeats = e.BookedSeats), checkoutStore.state.cart.products.push(i), checkoutStore.state.cart.nrInCart++, checkoutStore.state.lastAddedProduct = i, site.state.GoogleAnalyticsId && !window.pb.isAdmin && gtag("event", "add_to_cart", {
                        currency: site.state.StoreSettings.Currency,
                        value: i.Price,
                        items: [{
                            item_id: i.Guid,
                            item_name: i.Title,
                            price: i.Price,
                            quantity: 1
                        }]
                    }), site.state.PixelEventManagerId && !window.pb.isAdmin && fbq("track", "AddToCart", {
                        currency: site.state.StoreSettings.Currency,
                        value: i.Price,
                        content_ids: [i.Guid],
                        content_name: i.Title,
                        contents: [{
                            id: i.Guid,
                            quantity: 1,
                            item_price: i.Price
                        }]
                    })
                }
                checkoutStore.actions._updateLocalStorage()
            },
            removeProduct: function(t) {
                utils.arrayHelper.deleteWithProp(checkoutStore.state.cart.products, "CartGuid", t.CartGuid), checkoutStore.state.cart.nrInCart--, checkoutStore.actions._updateLocalStorage()
            },
            updateQuantity: function() {
                checkoutStore.actions._updateLocalStorage()
            },
            clearCart: function() {
                localStorage.setItem("cart", null), localStorage.removeItem("cart"), checkoutStore.state.cart = {
                    products: [],
                    nrInCart: 0
                }
            },
            _updateLocalStorage: function() {
                localStorage.setItem("cart", JSON.stringify(checkoutStore.state.cart))
            },
            _fetchLocalStorage: function() {
                let t = localStorage.getItem("cart");
                t && (checkoutStore.state.cart = JSON.parse(t))
            },
            _deleteLocalStorage: function() {
                localStorage.removeItem("cart")
            }
        }
    },
    bookingPopUpStore = {
        state: {
            checkoutStore: checkoutStore,
            showBookingPopup: !1,
            booking: null,
            straitToCheckout: !1
        },
        actions: {
            showBookingPopup: function(t, e) {
                bookingPopUpStore.state.booking = t, bookingPopUpStore.state.straitToCheckout = e, bookingPopUpStore.state.showBookingPopup = !0
            }
        }
    },
    site = {
        state: {},
        actions: {
            _elementsToCss: function(t, e, i, n) {
                let o = "";
                e || (e = "");
                let s = ".";
                !0 === i && (s = "");
                let r = "";
                !0 === n && (r = "!important");
                for (let i in t) {
                    o += e + s + i + "{";
                    let n = t[i];
                    for (let t in n) o += t + ":" + n[t] + r + ";";
                    o += "} "
                }
                return o
            },
            classesToText() {
                let t = site.actions._elementsToCss(site.state.GlobalClasses);
                site.state.GlobalClasses.Page && site.state.GlobalClasses.Page["background-color"] && ("rgba(0,0,0,0)" === site.state.GlobalClasses.Page["background-color"] && (t += ".Page {background-color:#ffffff;}"), t += "body { background-color : " + site.state.GlobalClasses.Page["background-color"] + "}");
                site.state.GlobalLinks.Button && site.state.GlobalLinks.Button["a:hover"] && (site.state.GlobalLinks.Button["a:hover"].color && (t += ".Button:hover {border-color:" + site.state.GlobalLinks.Button["a:hover"].color + ";}", t += ".Button span:hover {color:" + site.state.GlobalLinks.Button["a:hover"].color + ";}"), site.state.GlobalLinks.Button["a:hover"]["background-color"] && (t += ".Button span:hover {background-color:" + site.state.GlobalLinks.Button["a:hover"]["background-color"] + ";}")), site.state.GlobalClasses.Button && site.state.GlobalClasses.Button["padding-top"] && (t += ".Button a,.Button span {padding-top:" + site.state.GlobalClasses.Button["padding-top"] + "; padding-bottom:" + site.state.GlobalClasses.Button["padding-top"] + ";}"), site.state.GlobalClasses.Button && site.state.GlobalClasses.Button["padding-left"] && (t += ".Button a,.Button span {padding-left:" + site.state.GlobalClasses.Button["padding-left"] + "; padding-right:" + site.state.GlobalClasses.Button["padding-left"] + ";}"), site.state.GlobalLinks.CaptionButton && site.state.GlobalLinks.CaptionButton["a:hover"] && (site.state.GlobalLinks.CaptionButton["a:hover"].color && (t += ".CaptionButton:hover {border-color:" + site.state.GlobalLinks.CaptionButton["a:hover"].color + ";}", t += ".CaptionButton span:hover {color:" + site.state.GlobalLinks.CaptionButton["a:hover"].color + ";}"), site.state.GlobalLinks.CaptionButton["a:hover"]["background-color"] && (t += ".CaptionButton span:hover {background-color:" + site.state.GlobalLinks.CaptionButton["a:hover"]["background-color"] + ";}")), site.state.GlobalClasses.CaptionButton && site.state.GlobalClasses.CaptionButton["padding-top"] && (t += ".CaptionButton a,.CaptionButton span {padding-top:" + site.state.GlobalClasses.CaptionButton["padding-top"] + "; padding-bottom:" + site.state.GlobalClasses.CaptionButton["padding-top"] + ";}"), site.state.GlobalClasses.CaptionButton && site.state.GlobalClasses.CaptionButton["padding-left"] && (t += ".CaptionButton a,.CaptionButton span {padding-left:" + site.state.GlobalClasses.CaptionButton["padding-left"] + "; padding-right:" + site.state.GlobalClasses.CaptionButton["padding-left"] + ";}");
                site.state.GlobalStyleSheet = t
            },
            childClassesToText() {
                let t = "";
                for (let e in site.state.ChildClasses) {
                    let i = "#" + e + " ",
                        n = site.state.ChildClasses[e];
                    t += site.actions._elementsToCss(n, i)
                }
                site.state.ChildClassesStyleSheet = t
            },
            mobileStylesToText() {
                let t = "";
                site.state.MobileStyles && (t = "@media only screen and (max-width: 1000px) {", t += site.actions._elementsToCss(site.state.MobileStyles, "#", !0, !0), t += "}", site.state.MobileStyleSheet = t)
            },
            mobileClassesToText() {
                let t = site.state.MobileClasses,
                    e = "";
                t && t.Classes && (e = "@media only screen and (max-width: 1000px) {", e += site.actions._elementsToCss(t.Classes, "", !1, !0), e += "}"), site.state.GlobalStyleSheetMobile = e
            },
            globalLinksToText() {
                let t = "";
                for (let e in site.state.GlobalLinks) {
                    let i = "." + e + " ",
                        n = site.state.GlobalLinks[e],
                        o = !0;
                    if (t += site.actions._elementsToCss(n, i, o), "MainMenuLinks" === e) {
                        let e = {};
                        for (let t in n) {
                            e[t.replace("a:hover", "span.hasLink:hover")] = n[t]
                        }
                        t += site.actions._elementsToCss(e, i, o);
                        let {
                            color: s
                        } = n["a:hover"], r = {
                            "a:hover": {
                                fill: s
                            }
                        };
                        t += site.actions._elementsToCss(r, i, o);
                        let a = {
                            ".iconLinksWrapper:hover > a, .iconLinksWrapper:hover > path": {
                                color: s,
                                fill: s
                            }
                        };
                        t += site.actions._elementsToCss(a, i, !0)
                    }
                    "LongText" === e && (i = ".GeneralList ", t += site.actions._elementsToCss(n, i, o), i = ".CalendarList ", t += site.actions._elementsToCss(n, i, o), i = ".CaptionText ", t += site.actions._elementsToCss(n, i, o))
                }
                site.state.GlobalLinksStyleSheet = t
            },
            childLinksToText() {
                let t = "";
                for (let e in site.state.ChildLinks) {
                    let i, n = "#" + e + " ",
                        o = site.state.ChildLinks[e],
                        s = {};
                    for (let t in o) {
                        s[t.replace("a:hover", "span.hasLink:hover")] = o[t]
                    }
                    if (i = o && o["a:hover"] && o["a:hover"].color ? o["a:hover"].color : "#666666", "MAINMENULINKS" === e) {
                        let e = {
                            ".iconLinksWrapper:hover > a, .iconLinksWrapper:hover > path": {
                                color: i,
                                fill: i
                            }
                        };
                        t += site.actions._elementsToCss(e, n, !0)
                    }
                    let r = {
                        "a:hover": {
                            fill: i
                        }
                    };
                    t += site.actions._elementsToCss(s, n, !0);
                    let a = !0;
                    t += site.actions._elementsToCss(o, n, a), t += site.actions._elementsToCss(r, n, a)
                }
                site.state.ChildLinksStyleSheet = t
            },
            googleFontsToHref() {
                if (!site.state.GoogleFonts || site.state.GoogleFonts.length < 1) site.state.GoogleFontsHref = "";
                else {
                    let t = "https://fonts.googleapis.com/css?family=";
                    for (let e in site.state.GoogleFonts) {
                        t += site.state.GoogleFonts[e].title.replace(" ", "+") + ":300,400,700|"
                    }
                    t = t.substring(0, t.length - 1), site.state.GoogleFontsHref = t
                }
            },
            changeMenu(t) {
                site.state.MainMenu.View = t.View, site.state.MainMenu.ViewId = t.LangId, site.state.MainMenu.MenuType = t.MenuType, site.state.MainMenu.Settings = t.Settings, Site.Update("MainMenu", site.state.MainMenu)
            },
            addFontToGoogleFontString: function(t, e) {
                if (t.family === e) return;
                site.state.GoogleFonts && !Array.isArray(site.state.GoogleFonts) && (site.state.GoogleFonts = Object.values(site.state.GoogleFonts));
                (function(t) {
                    if (t && site.state.GoogleFonts && site.state.GoogleFonts.length > 0) {
                        let e = utils.arrayHelper.findItem(site.state.GoogleFonts, "family", t);
                        e && (e.occurrences < 2 ? utils.arrayHelper.deleteWithProp(site.state.GoogleFonts, "family", t) : e.occurrences = e.occurrences - 1)
                    }
                })(e),
                function(t) {
                    if ("google" === t.type)
                        if (!site.state.GoogleFonts || site.state.GoogleFonts.length < 1) site.state.GoogleFonts = [{
                            family: t.family,
                            title: t.title,
                            occurrences: 1,
                            type: "google"
                        }];
                        else {
                            let e = utils.arrayHelper.findItem(site.state.GoogleFonts, "family", t.family);
                            e ? e.occurrences = e.occurrences + 1 : site.state.GoogleFonts.push({
                                family: t.family,
                                title: t.title,
                                occurrences: 1,
                                type: "google"
                            })
                        }
                }(t);
                Site.Update("GoogleFonts", site.state.GoogleFonts)
            },
            removeFontFromGoogle: function(t) {
                if (t && site.state.GoogleFonts && site.state.GoogleFonts.length > 0) {
                    let e = utils.arrayHelper.findItem(site.state.GoogleFonts, "family", t);
                    e && (e.occurrences < 2 ? utils.arrayHelper.deleteWithProp(site.state.GoogleFonts, "family", t) : e.occurrences = e.occurrences - 1, Site.Update("GoogleFonts", site.state.GoogleFonts))
                }
            },
            init: {
                site: function(t) {
                    site.state = t, site.actions.googleFontsToHref(), site.actions.classesToText(), site.actions.mobileClassesToText(), site.actions.childClassesToText(), site.actions.globalLinksToText(), site.actions.childLinksToText(), site.actions.mobileStylesToText(), site.state._wwwPrefix = "", site.state.Url && (!0 === utils.miscFront.isPbDomain(site.state.Url) || (site.state._wwwPrefix = "www.")), site.state._showMusicPlayer = !1, site.state._musicPlayerTrack = {}
                }
            }
        }
    },
    posts = {
        state: {
            posts: [],
            current: {
                url: "",
                post: {}
            }
        },
        actions: {
            init: function(t) {
                posts.state.posts = t
            },
            isUrlAvailable: t => !utils.arrayHelper.findItem(posts.state.posts, "Url", t),
            getNewAvailableUrlBasedOnUrl(t) {
                let e = 2,
                    i = "";
                for (;;) {
                    if (i = t + e, posts.actions.isUrlAvailable(i)) {
                        t = i;
                        break
                    }
                    e++
                }
                return t
            },
            getCurrentPost(t) {
                if (t === posts.state.current.url && posts.state.current.post.Guid) return posts.state.current.post;
                {
                    let e;
                    return !!(e = utils.arrayHelper.findItem(posts.state.posts, "Url", t)) && (posts.state.current.url = t, posts.state.current.post = e)
                }
            }
        }
    },
    postComment = {
        state: {
            currentPost: null,
            isShown: !1
        },
        actions: {
            openCommentPopup: function(t) {
                postComment.state.currentPost = t, postComment.state.isShown = !0
            },
            closeCommentPopup: function() {
                postComment.state.currentPost = null, postComment.state.isShown = !1
            }
        }
    },
    products = {
        state: {
            products: [],
            current: {
                url: "",
                product: {},
                showLightbox: !1
            }
        },
        actions: {
            init: function(t) {
                products.state.products = t
            },
            isUrlAvailable: t => !utils.arrayHelper.findItem(products.state.products, "Url", t),
            reloadProducts: () => new Promise(t => {
                axios.post("/pb4/adminapi/productapi/reload").then(function(e) {
                    products.actions.init(e.data), t(e.data)
                }).catch(function(t) {
                    adminApi._handleError(t)
                })
            }),
            getNewAvailableUrlBasedOnUrl(t) {
                let e = 2,
                    i = "";
                for (;;) {
                    if (i = t + e, products.actions.isUrlAvailable(i)) {
                        t = i;
                        break
                    }
                    e++
                }
                return t
            },
            getCurrentProduct(t) {
                if (t === products.state.current.url && products.state.current.product.Guid) return products.state.current.product;
                {
                    let e;
                    return !!(e = utils.arrayHelper.findItem(products.state.products, "Url", t)) && (products.state.current.url = t, products.state.current.product = e)
                }
            }
        }
    },
    productCategories = {
        state: [],
        actions: {
            init: function(t) {
                productCategories.state = t
            }
        }
    },
    blogCategories = {
        state: [],
        actions: {
            init: function(t) {
                blogCategories.state = t
            }
        }
    },
    translations = {
        state: [],
        _englishState: {
            YourComment: "Your Comment",
            YourMessage: "Your Message",
            YourName: "Your Name",
            YourEmail: "Your Email",
            YourAddress: "Your Address",
            YourZip: "Your Zip",
            YourCity: "Your City",
            YourCountry: "Your Country",
            YourState: "Your State",
            YourPhone: "Your Phone Number",
            WillNotBePublic: "Will not be public",
            Comment: "Comment",
            Submit: "Submit",
            AreYouSure: "Are you sure that you want to submit?",
            NoFieldsCanBeEmpty: "No fields can be empty",
            AllFieldsAreEmpty: "All fields are empty",
            MandatoryFieldsAreEmpty: "Some mandatory fields are empty",
            Welcome: "Welcome",
            Password: "Password",
            Login: "Login",
            ThankYou: "Thank You!",
            Home: "Home",
            Categories: "Categories",
            Search: "Search",
            TheAll: "All",
            SortBy: "Sort By",
            Latest: "Latest",
            Price: "Price",
            Title: "Title",
            AddToCart: "Add to Cart",
            SoldOut: "Sold Out",
            SoldOutMessage: "This product is out of stock.",
            PleaseSelectOneVariant: "Please select one of the variants.",
            ItemAddedToCart: "The item was added to the cart.",
            CheckoutThis: "Check this out:",
            Off: "Off",
            ChooseAVariant: "Choose a Variant",
            Ok: "Ok",
            AreYouSureRemoveFromCart: "Are you sure that you want to remove this product from the cart?",
            EmailNotValid: "The email address is not valid. Enter another email address.",
            ShippingAddress: "Shipping Address",
            ShipToThisAddress: "Ship to this Address",
            ShipToAnotherAddress: "Ship to another Address",
            Name: "Name",
            Address: "Address",
            Zip: "Zip",
            City: "City",
            Country: "Country",
            State: "State",
            Phone: "Phone",
            NeedToAcceptTerms: "You need to accept the terms and agreement.",
            DiscountCodeWasNotValid: "Sorry! The Discount Code was not valid",
            DiscountApplied: "We have applied your discount",
            Subtotal: "Subtotal",
            YourCart: "Your Cart",
            DiscountCode: "Discount Code",
            ProceedToCheckout: "Proceed to Checkout",
            ExcludedFromTax: "Excluded from VAT",
            Total: "Total",
            IAcceptTerms: "I accept the Terms and Privacy Policy",
            Confirm: "Confirm",
            Payment: "Payment",
            CompleteOrder: "Complete Order",
            HowWouldYouLikeToPay: "How would you like to pay?",
            WithPayPal: "With PayPal",
            WithCard: "With Card",
            ThankYouForMakingOrder: "Thank you for making this order! I will be in contact with you shortly.",
            ReturnPolicy: "Return Policy",
            TermsAndPrivacy: "Terms and Privacy",
            Done: "Done",
            No: "No",
            Yes: "Yes",
            Taxes: "VAT",
            Shipping: "Shipping",
            CheapestItemFree: "Cheapest Item Free",
            FixedAmount: "Fixed Amount",
            FreeShipping: "Free Shipping",
            CompletePayment: "Complete Payment",
            CheckoutNotAvailable: "Checkout is not available for",
            ChooseAnotherCountry: "To complete the order choose another country",
            ReadMore: "Read More",
            OpenPayPal: "Open PayPal",
            ThankYouForYourOrder: "Thank you for your order",
            Invoice: "Invoice",
            Receipt: "Receipt",
            PayWithin: "Pay within:",
            Days: "Days",
            PaidWith: "Paid with:",
            WithInvoice: "With Invoice",
            PayNow: "Pay Now",
            Checkout: "Checkout",
            PayWithCard: "Pay with Card",
            PayWithPayPal: "Pay with PayPal",
            PayWithPayPalExp: "Open PayPal to complete the order.",
            Customer: "Customer",
            OrderConfirmation: "Order Confirmation",
            SubscribeToNews: "Subscribe to News",
            GoToCheckout: "Go to Checkout",
            ContinueShopping: "Continue Shopping",
            Allow: "Allow",
            AllowNecessary: "Allow Necessary",
            LeaveWebsite: "Leave Website",
            WrongPassword: "Wrong Password",
            Discount: "Discount",
            AcceptByClick: "By submitting this order I accept:",
            Download: "Download",
            ThisFileIsNotAvailable: "This file not available:",
            FileInSeparateEmail: "The file is sent in a separate email",
            WhenInvoiceIsPaid: "when invoice is paid",
            FilesBoughtInOrder: "Files bought in order",
            FilesBoughtInOrderExp: "Here are the files that you bought. The files are accessible until:",
            AConfirmationEmailWasSent: "A confirmation email was sent to you. Click the link in the email to complete the subscription.",
            ClickToConfirm: "Click the link below to confirm your subscription",
            ThisAddressIsAlreadySubscribed: "This address is already subscribed.",
            Hello: "Hello",
            SubscriptionConfirmed: "Subscription confirmed! Thank you for subscribing :-)",
            EmailAlreadySubscribed: "This email is already confirmed. Thank you!",
            PleaseContactUsToCheckInventory: "Please contact us to check the inventory of this product.",
            CustomerSelfPickup: "I will pick up the order myself",
            CheckoutSelfPickup: "Self Pickup",
            SelectAlternative: "Select Alternative",
            BookNow: "Book Now",
            BookedOutMessage: "No additional free seats available",
            SchedulingNoTimeslotAvailable: "There are no timeslots available for this date.",
            SchedulingServiceHeading: "Which service are you interested in?",
            SchedulingPersonnelHeading: "Who would you like to meet?",
            SchedulingCalendarHeading: "Pick an available date",
            Minutes: "minutes",
            Monday: "Mon",
            Tuesday: "Tue",
            Wednesday: "Wed",
            Thursday: "Thu",
            Friday: "Fri",
            Saturday: "Sat",
            Sunday: "Sun",
            PayOnLocation: "Pay On Location",
            InvoiceEditMode: "This invoice is in edit mode and can not be paid.",
            InvoiceAlreadyPaid: "This invoice has already been paid.",
            InvoiceIsCanceled: "This invoice has been canceled.",
            FromWord: "From",
            ToWord: "To",
            Unit: "unit",
            VAT: "VAT",
            Quantity: "Quantity",
            NetPrice: "Netprice",
            PaymentTerms: "Payment terms",
            TermsAndConditions: "Terms and Conditions",
            Accept: "Accept",
            IAcceptQuote: "I hereby accept this quote.",
            QuoteEditMode: "This quote is in edit mode and can not be accepted.",
            QuoteAlreadyAccepted: "This quote has already been accepted.",
            QuoteIsCanceled: "This quote has been canceled."
        },
        actions: {
            init: function(t) {
                translations.state = Object.assign(translations._englishState, t)
            }
        }
    },
    bookingStore = {
        state: {
            bookings: [],
            wasFetched: !1
        },
        actions: {
            initAndGetBookings: async function() {
                return new Promise(t => {
                    bookingStore.state.wasFetched ? t(bookingStore.state.bookings) : frontApi.getBookings(this).then(e => {
                        bookingStore.state.wasFetched = !0, bookingStore.state.bookings = e, t(e)
                    })
                })
            }
        }
    },
    schedulingStore = {
        state: {
            items: {
                services: [],
                personnels: [],
                workinghours: [],
                bookedtimeslots: []
            },
            front: {
                selectedService: null,
                selectedPersonnel: null,
                selectedDate: null,
                selectedTime: null,
                skip: {
                    services: !1,
                    personnel: !1,
                    all: !1
                },
                activeWindow: 0,
                element: null,
                showPopup: !1
            },
            currentService: null,
            currentPersonnel: null,
            cleaned: !1,
            initilized: !1
        },
        actions: {
            init: async function() {
                if (!schedulingStore.state.initilized) try {
                    const [t, e, i] = await Promise.all([frontApi.getAllScheduleServices(), frontApi.getAllPersonnels(), frontApi.getAllPersonnelWorkingHours()]);
                    schedulingStore.state.items.services = t, schedulingStore.state.items.personnels = e, schedulingStore.state.items.workinghours = i, schedulingStore.state.initilized = !0
                } catch (t) {
                    console.error(t)
                }
            },
            fetchOneService: async function(t) {
                return frontApi.getSchedulingServiceByGuid(t)
            },
            fetchOnePersonnel: async function(t) {
                return frontApi.getSchedulingPersonnelByGuid(t)
            },
            fetchWorkingHoursForDateRange: async function(t, e) {
                return frontApi.getWorkingHoursByGuidsForDateRange({
                    personnelGuid: schedulingStore.state.front.selectedPersonnel.Guid,
                    startDate: t,
                    endDate: e
                })
            },
            fetchBookedTimeslots: async function() {
                return frontApi.getBookedTimeslotsFromNow()
            },
            getPersonnelPrice: function(t, e = null) {
                if (e) {
                    const i = t,
                        n = e.AttachedPersonnel.find(t => t.PersonnelGuid === i.Guid);
                    return n && 0 !== n.Price ? n.Price : e.Price
                }
                const i = schedulingStore.state.front.selectedService.AttachedPersonnel.find(e => e.PersonnelGuid === t.Guid);
                return i && 0 !== i.Price ? i.Price : schedulingStore.state.front.selectedService.Price
            },
            cleanOldRecords: async function() {
                schedulingStore.state.cleaned || (this.workinghours = await adminApi.cleanOlderPersonnelWorkingHours(), schedulingStore.state.items.services.forEach(t => {
                    t && t.AttachedPersonnel && t.AttachedPersonnel.forEach(async ({
                        PersonnelGuid: e
                    }) => {
                        if (-1 === schedulingStore.state.items.personnels.findIndex(t => t.Guid === e)) {
                            const i = e;
                            t.AttachedPersonnel.find((e, n) => {
                                e.PersonnelGuid === i && (t.AttachedPersonnel.splice(n, 1), ScheduleService.Update(t, "AttachedPersonnel"))
                            })
                        }
                    })
                }), schedulingStore.state.cleaned = !0)
            },
            resetFrontState: function() {
                for (let t in schedulingStore.state.front.skip) schedulingStore.state.front.skip.hasOwnProperty(t) && (schedulingStore.state.front.skip[t] = !1);
                schedulingStore.state.front.selectedService = null, schedulingStore.state.front.selectedPersonnel = null, schedulingStore.state.front.selectedDate = null, schedulingStore.state.front.selectedTime = null, schedulingStore.state.front.activeWindow = 0, schedulingStore.state.front.element = null, schedulingStore.state.front.showPopup = !1
            }
        }
    },
    qrCodesStore = {
        state: {
            items: {
                qrcodes: []
            },
            currentQrCode: null,
            initilized: !1
        },
        actions: {
            init: async function() {
                if (!qrCodesStore.state.initilized) try {
                    const t = await frontApi.fetchAllQrCodes();
                    qrCodesStore.state.items.qrcodes = t, qrCodesStore.state.initilized = !0
                } catch (t) {
                    console.error(t)
                }
            },
            fetchQrCode: async function(t) {
                try {
                    let e;
                    if (!(e = window.pb.isAdmin ? await this.fetchAdminQrCode(t) : await this.fetchNonAdminQrCode(t))) throw new Error("QrCode not found");
                    return e
                } catch (t) {
                    console.error(t)
                }
            },
            fetchAdminQrCode: async function(t) {
                return await qrCodesStore.actions.init(), qrCodesStore.state.items.qrcodes.find(e => e.Guid === t)
            },
            fetchNonAdminQrCode: function(t) {
                return frontApi.getQrCode(t)
            },
            loadScript(t) {
                if (document.getElementById("qrcodejs-script")) t();
                else {
                    let e = document.createElement("script");
                    e.src = "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js", e.id = "qrcodejs-script", e.onload = (() => {
                        t()
                    }), e.onerror = (() => {
                        console.error('Error loading script: "QR Code"')
                    }), document.body.appendChild(e)
                }
            }
        }
    },
    invoiceStore = {
        state: {
            invoices: [],
            wasFetched: !1
        },
        actions: {
            initAndGetInvoices: async function() {
                if (invoiceStore.state.wasFetched) return invoiceStore.state.invoices;
                {
                    const t = await adminApi.getInvoices(this);
                    return invoiceStore.state.wasFetched = !0, invoiceStore.state.invoices = t, t
                }
            },
            initAndGetInvoiceFront: async function(t) {
                if (invoiceStore.state.wasFetched) return invoiceStore.state.invoices.find(e => e.Guid === t);
                {
                    let e;
                    if (window.pb.isAdmin) {
                        if (invoiceStore.invoices = await invoiceStore.actions.initAndGetInvoices(), e = invoiceStore.invoices.find(e => e.Guid === t), invoiceStore.state.wasFetched = !0, e) return e;
                        throw new Error("Invoice not found")
                    }
                    if (e = await frontApi.getInvoice(t)) return invoiceStore.state.invoices.push(e), invoiceStore.state.wasFetched = !0, e;
                    throw new Error(e)
                }
            }
        }
    },
    quoteStore = {
        state: {
            quotes: [],
            wasFetched: !1
        },
        actions: {
            initAndGetQuotes: async function() {
                if (quoteStore.state.wasFetched) return quoteStore.state.quotes;
                {
                    const t = await adminApi.getQuotes(this);
                    return quoteStore.state.wasFetched = !0, quoteStore.state.quotes = t, t
                }
            },
            initAndGetQuoteFront: async function(t) {
                if (quoteStore.state.wasFetched) return quoteStore.state.quotes.find(e => e.Guid === t);
                {
                    let e;
                    if (window.pb.isAdmin) {
                        if (quoteStore.quotes = await quoteStore.actions.initAndGetQuotes(), e = quoteStore.quotes.find(e => e.Guid === t), quoteStore.state.wasFetched = !0, e) return e;
                        throw new Error("Quote not found")
                    }
                    if (e = await frontApi.getQuote(t)) return quoteStore.state.quotes.push(e), quoteStore.state.wasFetched = !0, e;
                    throw new Error(e)
                }
            }
        }
    };