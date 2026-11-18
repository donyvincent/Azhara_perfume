/* Azhara Scent Bot — standalone chatbot (no API key, no backend).
   Reads products from assets/bot-products.json. Later this can point to /api/products. */
(function () {
  "use strict";
  var DATA_URL = "assets/bot-products.json";
  var IMG = "assets/img/";
  var WA = "https://wa.me/919082408306";
  var P = [];

  var FAM = {
    "citrus-fresh": ["fresh", "citrus", "clean", "light", "zesty", "lemon", "bergamot", "morning", "summer", "crisp"],
    "aqua": ["aqua", "aquatic", "ocean", "sea", "marine", "water", "breezy", "beach", "cool"],
    "floral": ["floral", "flower", "flowers", "flowery", "rose", "jasmine", "romantic", "feminine", "soft", "pretty"],
    "woody-oud": ["woody", "wood", "oud", "sandalwood", "cedar", "smoky", "earthy", "dark", "masculine"],
    "amber-oriental": ["amber", "oriental", "warm", "spicy", "spice", "luxury", "luxurious", "opulent", "rich", "evening", "cozy", "cosy"],
    "gourmand": ["sweet", "vanilla", "gourmand", "caramel", "chocolate", "dessert", "tonka", "honey", "sugary"],
    "fruity": ["fruity", "fruit", "berry", "peach", "apple", "pear", "juicy"],
    "musky": ["musk", "musky", "powdery", "skin", "sensual"],
    "aromatic": ["aromatic", "herbal", "lavender", "herb", "green", "sage", "mint", "calm", "relaxing", "spa"]
  };
  var ROOMS = { bedroom: ["bedroom", "sleep", "night"], living: ["living", "lounge", "hall", "guests", "party"], office: ["office", "work", "study", "desk"], bathroom: ["bathroom", "washroom", "toilet"], kitchen: ["kitchen", "dining"], car: ["car"] };
  var STOP = { i: 1, a: 1, an: 1, the: 1, me: 1, my: 1, for: 1, and: 1, or: 1, to: 1, of: 1, like: 1, love: 1, want: 1, something: 1, smell: 1, smells: 1, scent: 1, scents: 1, perfume: 1, perfumes: 1, oil: 1, oils: 1, fragrance: 1, show: 1, suggest: 1, recommend: 1, please: 1, is: 1, it: 1, that: 1, with: 1, in: 1, can: 1, you: 1, do: 1, have: 1, any: 1, what: 1, which: 1, good: 1, best: 1, home: 1, room: 1, but: 1, not: 1, too: 1, very: 1, some: 1, one: 1, similar: 1, inspired: 1, by: 1 };

  /* ---------- styles ---------- */
  var css = "" +
    ".azb-fab{position:fixed;left:18px;bottom:18px;z-index:140;display:flex;align-items:center;gap:10px;padding:12px 18px 12px 14px;border:0;border-radius:99px;background:var(--dark,#15110D);color:#F5F4F1;font:500 14px/1 var(--sans,Jost,sans-serif);letter-spacing:.04em;cursor:pointer;box-shadow:0 10px 30px rgba(14,12,10,.28);transition:transform .35s cubic-bezier(.22,.9,.25,1),bottom .35s,opacity .3s}" +
    ".azb-fab:hover{transform:translateY(-2px)}.azb-fab svg{width:22px;height:22px}" +
    ".azb-fab.lift{bottom:86px}.azb-fab.hide{opacity:0;pointer-events:none;transform:scale(.9)}" +
    ".azb-dot{width:8px;height:8px;border-radius:50%;background:var(--champ,#C9AF86);box-shadow:0 0 0 0 rgba(201,175,134,.7);animation:azbp 2s infinite}@keyframes azbp{70%{box-shadow:0 0 0 10px rgba(201,175,134,0)}100%{box-shadow:0 0 0 0 rgba(201,175,134,0)}}" +
    ".azb-win{position:fixed;left:18px;bottom:18px;z-index:145;width:min(400px,calc(100vw - 24px));height:min(620px,calc(100vh - 36px));display:flex;flex-direction:column;background:var(--paper,#F5F4F1);color:var(--ink,#0E0C0A);border-radius:var(--r2,22px);box-shadow:0 30px 80px rgba(14,12,10,.32);overflow:hidden;font-family:var(--sans,Jost,sans-serif);opacity:0;visibility:hidden;transform:translateY(16px) scale(.98);transform-origin:bottom left;transition:all .4s cubic-bezier(.22,.9,.25,1)}" +
    ".azb-win.open{opacity:1;visibility:visible;transform:none}" +
    ".azb-hd{display:flex;align-items:center;gap:12px;padding:16px 16px 14px 20px;background:var(--dark,#15110D);color:#F1EBE2}" +
    ".azb-hd b{display:block;font:500 19px/1.1 var(--serif,'Bodoni Moda',serif)}.azb-hd small{font-size:12px;opacity:.65;letter-spacing:.04em}" +
    ".azb-x{margin-left:auto;width:34px;height:34px;border-radius:50%;border:1px solid rgba(241,235,226,.25);background:transparent;color:inherit;font-size:18px;cursor:pointer}" +
    ".azb-log{flex:1;overflow-y:auto;padding:18px 16px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}" +
    ".azb-m{flex-shrink:0;max-width:86%;padding:10px 14px;border-radius:18px;font-size:14.5px;line-height:1.45;white-space:pre-line;animation:azbin .35s ease}@keyframes azbin{from{opacity:0;transform:translateY(6px)}}" +
    ".azb-bot{align-self:flex-start;background:#fff;border:1px solid var(--line,rgba(14,12,10,.12));border-bottom-left-radius:6px}" +
    ".azb-me{align-self:flex-end;background:var(--ink2,#2C2620);color:#F5F4F1;border-bottom-right-radius:6px}" +
    ".azb-m a{color:var(--copper,#9D5A34)}" +
    ".azb-typing{display:flex;gap:4px;padding:14px}.azb-typing i{width:6px;height:6px;border-radius:50%;background:var(--taupe,#8F8675);animation:azbt 1s infinite}.azb-typing i:nth-child(2){animation-delay:.15s}.azb-typing i:nth-child(3){animation-delay:.3s}@keyframes azbt{50%{opacity:.25;transform:translateY(-3px)}}" +
    ".azb-cards{flex-shrink:0;display:flex;gap:10px;overflow-x:auto;padding:2px 2px 8px;scroll-snap-type:x mandatory;animation:azbin .35s ease}" +
    ".azb-card{flex:0 0 168px;scroll-snap-align:start;background:#fff;border:1px solid var(--line,rgba(14,12,10,.12));border-radius:16px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column}" +
    ".azb-card img{width:100%;aspect-ratio:1;object-fit:cover;background:var(--tile,#E2E0DA)}" +
    ".azb-card div{padding:10px 12px 12px;display:flex;flex-direction:column;gap:3px}" +
    ".azb-card b{font:500 16px/1.15 var(--serif,'Bodoni Moda',serif)}.azb-card em{font-style:normal;font-size:11.5px;color:var(--mute,#78716A);line-height:1.3}" +
    ".azb-card span{font-size:13px;margin-top:4px;display:flex;justify-content:space-between;align-items:center}.azb-card span u{text-decoration:none;color:var(--copper,#9D5A34);font-size:12px;letter-spacing:.05em}" +
    ".azb-chips{flex-shrink:0;display:flex;flex-wrap:wrap;gap:6px;animation:azbin .35s ease}" +
    ".azb-chip{border:1px solid var(--ink,#0E0C0A);background:transparent;color:var(--ink,#0E0C0A);border-radius:99px;padding:7px 13px;font:400 13px/1 var(--sans,Jost,sans-serif);cursor:pointer;transition:all .2s}" +
    ".azb-chip:hover{background:var(--ink,#0E0C0A);color:#F5F4F1}" +
    ".azb-in{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line,rgba(14,12,10,.12));background:var(--paper,#F5F4F1)}" +
    ".azb-in input{flex:1;min-width:0;border:1px solid var(--line,rgba(14,12,10,.12));background:#fff;border-radius:99px;padding:11px 16px;font:400 15px var(--sans,Jost,sans-serif);color:var(--ink,#0E0C0A);outline:none}" +
    ".azb-in input:focus{border-color:var(--copper,#9D5A34)}" +
    ".azb-in button{width:44px;height:44px;flex:0 0 44px;border-radius:50%;border:0;background:var(--copper,#9D5A34);color:#fff;cursor:pointer;font-size:18px}" +
    "@media (max-width:520px){.azb-win{left:8px;bottom:8px;width:calc(100vw - 16px);height:calc(100vh - 16px);height:calc(100dvh - 16px)}.azb-fab{left:12px;bottom:12px}.azb-fab .azb-t{display:none}.azb-fab{padding:14px}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- DOM ---------- */
  var fab = el("button", "azb-fab", '<span class="azb-dot"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3h6M10 3v3.2a5 5 0 0 0-3 4.6V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8.2a5 5 0 0 0-3-4.6V3"/><path d="M7 13h10"/></svg><span class="azb-t">Scent Bot</span>');
  fab.setAttribute("aria-label", "Open the Azhara Scent Bot chat");
  var win = el("div", "azb-win");
  win.setAttribute("role", "dialog"); win.setAttribute("aria-label", "Azhara Scent Bot");
  win.innerHTML = '<div class="azb-hd"><div><b>Scent Bot</b><small>Find your Azhara fragrance</small></div><button class="azb-x" aria-label="Close chat">&times;</button></div><div class="azb-log" aria-live="polite"></div><form class="azb-in"><input type="text" placeholder="Try “like Dior Sauvage” or “fresh for office”" aria-label="Message"><button type="submit" aria-label="Send">&#10148;</button></form>';
  var log = win.querySelector(".azb-log"), form = win.querySelector("form"), input = form.querySelector("input");
  function mount() { document.body.appendChild(fab); document.body.appendChild(win); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  var started = false;
  fab.onclick = function () { win.classList.add("open"); fab.classList.add("hide"); if (!started) { started = true; greet(); } setTimeout(function () { input.focus(); }, 350); };
  win.querySelector(".azb-x").onclick = close;
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && win.classList.contains("open")) close(); });
  function close() { win.classList.remove("open"); fab.classList.remove("hide"); }
  function syncLift() { fab.classList.toggle("lift", /^#product-/.test(location.hash)); }
  window.addEventListener("hashchange", syncLift); syncLift();

  form.onsubmit = function (e) { e.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ""; user(t); think(function () { reply(t); }); };

  fetch(DATA_URL).then(function (r) { return r.json(); }).then(function (d) { P = d; }).catch(function () { P = []; });

  /* ---------- helpers ---------- */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function bot(html) { var m = el("div", "azb-m azb-bot", html); log.appendChild(m); scroll(); }
  function user(t) { log.appendChild(el("div", "azb-m azb-me", esc(t))); scroll(); }
  function think(fn) { var t = el("div", "azb-m azb-bot azb-typing", "<i></i><i></i><i></i>"); log.appendChild(t); scroll(); setTimeout(function () { t.remove(); fn(); }, 550 + Math.random() * 400); }
  function chips(list) {
    var c = el("div", "azb-chips");
    list.forEach(function (x) {
      var b = el("button", "azb-chip", esc(x[0])); b.type = "button";
      b.onclick = function () { c.remove(); user(x[0]); think(function () { x[1](); }); };
      c.appendChild(b);
    });
    log.appendChild(c); scroll();
  }
  function rupee(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function cards(list) {
    var c = el("div", "azb-cards");
    list.forEach(function (p) {
      var a = el("a", "azb-card");
      a.href = "#product-" + p.h;
      a.innerHTML = '<img loading="lazy" src="' + IMG + esc(p.img) + '" alt="' + esc(p.n) + '"><div><b>' + esc(p.n) + "</b>" +
        (p.insp ? "<em>Inspired by " + esc(p.insp) + "</em>" : p.fam ? "<em>" + esc(p.fam) + "</em>" : "<em>" + esc(catName(p.cat)) + "</em>") +
        "<span>" + (isFinite(p.p) ? "from " + rupee(p.p) : "") + "<u>VIEW →</u></span></div>";
      a.onclick = function () { if (window.innerWidth < 720) setTimeout(close, 150); };
      c.appendChild(a);
    });
    log.appendChild(c); scroll();
  }
  function catName(c) { return { oil: "Fragrance oil", diffuser: "Diffuser", candle: "Eternal candle", kit: "Tester kit", essential: "Essential oil" }[c] || "Product"; }
  function oils() { return P.filter(function (p) { return p.cat === "oil"; }); }
  function words(t) { return t.toLowerCase().replace(/[^a-z0-9À-ɏ'&\s-]/g, " ").split(/\s+/).filter(Boolean); }
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  /* ---------- conversation ---------- */
  function menu() {
    chips([
      ["Find my scent", quiz],
      ["Like a designer perfume", designer],
      ["Help me pick a diffuser", diffuserHelp],
      ["Gift ideas", gifts],
      ["Delivery & returns", function () { faq("delivery"); }],
      ["Talk to a person", human]
    ]);
  }
  function greet() {
    bot("Hello, I’m the Azhara Scent Bot.\nI can find your perfect home fragrance, match a designer perfume you love, or help you pick a diffuser.");
    menu();
  }
  function more() { setTimeout(function () { chips([["Something else", function () { bot("What else can I help with?"); menu(); }], ["Talk to a person", human]]); }, 300); }

  /* quiz */
  var q = {};
  function quiz() {
    q = {};
    bot("Lovely. Three quick questions.\n<b>1/3</b> — Which mood should your home have?");
    chips([
      ["Fresh & clean", function () { q.f = ["citrus-fresh", "aqua", "aromatic"]; quiz2(); }],
      ["Soft & floral", function () { q.f = ["floral", "fruity", "musky"]; quiz2(); }],
      ["Warm & sweet", function () { q.f = ["gourmand", "amber-oriental"]; quiz2(); }],
      ["Dark & woody", function () { q.f = ["woody-oud", "amber-oriental"]; quiz2(); }]
    ]);
  }
  function quiz2() {
    bot("<b>2/3</b> — Where will you use it most?");
    chips([["Living room", function () { q.r = "living"; quiz3(); }], ["Bedroom", function () { q.r = "bedroom"; quiz3(); }], ["Office / study", function () { q.r = "office"; quiz3(); }], ["Bathroom", function () { q.r = "bathroom"; quiz3(); }]]);
  }
  function quiz3() {
    bot("<b>3/3</b> — How strong do you like it?");
    chips([["Light & subtle", function () { q.s = "light"; quizEnd(); }], ["Bold & long-lasting", function () { q.s = "bold"; quizEnd(); }]]);
  }
  function quizEnd() {
    var boldF = { "woody-oud": 1, "amber-oriental": 1, gourmand: 1 };
    var res = oils().map(function (p) {
      var s = 0;
      p.fams.forEach(function (f) { var i = q.f.indexOf(f); if (i > -1) s += i === 0 ? 4 : 3; });
      if (roomHit(p, q.r)) s += 2;
      var bold = p.fams.some(function (f) { return boldF[f]; });
      s += (q.s === "bold") === bold ? 1.5 : 0;
      if (p.r) s += p.r[0] / 10;
      return [p, s];
    }).filter(function (x) { return x[1] > 3; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 4).map(function (x) { return x[0]; });
    if (!res.length) res = oils().slice(0, 4);
    bot("Here is what I’d pick for you. Tap any to see notes and sizes:");
    cards(res);
    setTimeout(function () { bot("Not sure yet? A <b>tester kit</b> (5×2 mL, from ₹699) lets you try five bestsellers first."); chips([["Show tester kits", function () { cards(P.filter(function (p) { return p.cat === "kit"; })); more(); }], ["Start over", quiz], ["Something else", function () { bot("What else can I help with?"); menu(); }]]); }, 500);
  }
  function roomHit(p, r) { if (!r) return false; var b = p.best.toLowerCase(); return (ROOMS[r] || [r]).some(function (w) { return b.indexOf(w) > -1; }); }

  function designer() {
    bot("Type the name of a perfume or brand you love — for example <i>Sauvage</i>, <i>Baccarat Rouge</i>, <i>Coco Mademoiselle</i>, <i>Oud Wood</i> or <i>Creed Aventus</i> — and I’ll find its Azhara match.");
    input.focus();
  }
  function diffuserHelp() {
    bot("Azhara has two kinds:\n• <b>Waterless (cold-air)</b> — pure oil, stronger scent, covers bigger rooms. Best for living rooms, lobbies and offices.\n• <b>Ultrasonic</b> — water + a few drops of oil, a soft mist that also humidifies. Best for bedrooms.\nEvery diffuser comes with a <b>free fragrance oil</b>.");
    chips([
      ["Show waterless", function () { cards(P.filter(function (p) { return p.cat === "diffuser" && /waterless/i.test(p.n + " " + (p.sub || "")); }).sort(byPrice)); more(); }],
      ["Show ultrasonic", function () { cards(P.filter(function (p) { return p.cat === "diffuser" && !/waterless/i.test(p.n + " " + (p.sub || "")); }).sort(byPrice)); more(); }],
      ["Under ₹5,000", function () { cards(P.filter(function (p) { return p.cat === "diffuser" && p.p < 5000; }).sort(byPrice)); more(); }]
    ]);
  }
  function byPrice(a, b) { return a.p - b.p; }
  function gifts() {
    bot("Gifts people love:\n• <b>Tester kits</b> — five bestsellers to explore\n• <b>Eternal Candles</b> — a refillable candle you never throw away\n• <b>A diffuser</b> — comes with a free oil, so it’s ready to use");
    var g = P.filter(function (p) { return p.cat === "kit" || p.cat === "candle"; }).concat(P.filter(function (p) { return p.cat === "diffuser" && p.p < 4000; }));
    cards(g.slice(0, 7));
    bot('For weddings, corporate gifting or a custom signature scent, see our <a href="#custom-fragrance">custom fragrance studio</a>.');
    more();
  }
  function human() {
    bot('You can reach the Azhara team directly:\n• WhatsApp / call: <a href="' + WA + '" target="_blank" rel="noopener">+91 90824 08306</a>\n• Email: <a href="mailto:nidhi@azhara.in">nidhi@azhara.in</a>\nMonday to Saturday (closed Sunday).');
    more();
  }
  var FAQ = {
    delivery: "We ship within India. Orders are processed in 1–3 business days and delivered in 3–7 business days (remote areas up to 14). You get a Delhivery tracking link once it ships.\n<b>Free shipping</b> above ₹2,000 and <b>cash on delivery</b> is available.",
    returns: "Refunds are given if a product arrives damaged or incomplete, or if you receive the wrong order — contact us within 3 days of delivery with a photo and your order number. Custom kits can’t be cancelled once confirmed.",
    skin: "The fragrance oils are made for diffusers, humidifiers and reeds — <b>not</b> for applying on skin.",
    copy: "Each Azhara blend is an original composition inspired by a reference perfume, reinterpreted for the home. Azhara is not affiliated with the referenced houses.",
    business: 'Azhara scents hotels, restaurants, offices and retail spaces with commercial waterless diffusers. Get a free scent plan on the <a href="#business-scenting">business scenting</a> page.',
    custom: 'Want a signature scent for your brand, home or wedding? Start a brief in the <a href="#custom-fragrance">custom fragrance studio</a>.'
  };
  function faq(k) { bot(FAQ[k]); if (k === "delivery") bot(FAQ.returns); more(); }

  /* free text */
  function reply(text) {
    if (!P.length) { bot("I’m still loading the collection — please try again in a moment."); return; }
    var t = norm(text), w = words(t);
    var has = function (re) { return re.test(t); };

    if (has(/^(hi|hello|hey|hii+|namaste|good (morning|evening|afternoon))\b/) && w.length <= 3) { bot("Hello! How can I help you today?"); menu(); return; }
    if (has(/\b(thank|thanks|thx|ty)\b/)) { bot("My pleasure. Enjoy your Azhara home ✨"); more(); return; }
    if (has(/\b(ship|shipping|deliver|delivery|courier|track|cod|cash on)\b/)) { faq("delivery"); return; }
    if (has(/\b(return|refund|cancel|damaged|broken|wrong order)\b/)) { bot(FAQ.returns); more(); return; }
    if (has(/\b(skin|body|wear|apply on)\b/)) { bot(FAQ.skin); more(); return; }
    if (has(/\b(copy|copies|original|fake|duplicate|dupe|clone)\b/)) { bot(FAQ.copy); more(); return; }
    if (has(/\b(hotel|restaurant|business|commercial|corporate|lobby|showroom|gym|salon)\b/)) { bot(FAQ.business); more(); return; }
    if (has(/\b(custom|signature|personali[sz]ed|wedding|bespoke)\b/)) { bot(FAQ.custom); more(); return; }
    if (has(/\b(contact|whatsapp|phone|call|email|human|person|agent|support)\b/)) { human(); return; }
    if (has(/\b(gift|gifting|present|birthday|anniversary)\b/)) { gifts(); return; }
    if (has(/\b(quiz|find my|help me (choose|pick)|not sure|confused)\b/)) { quiz(); return; }
    if (has(/\b(waterless|ultrasonic|humidifier|which diffuser|difference)\b/)) { diffuserHelp(); return; }
    if (has(/\b(candle|candles)\b/)) { bot("Our Eternal Candles are refillable metal oil candles — the candle you never throw away:"); cards(P.filter(function (p) { return p.cat === "candle"; })); more(); return; }
    if (has(/\b(tester|sample|trial|kit)\b/)) { bot("Try before you commit — five bestsellers in 2 mL each:"); cards(P.filter(function (p) { return p.cat === "kit"; })); more(); return; }
    if (has(/\b(essential)\b/)) { cards(P.filter(function (p) { return p.cat === "essential"; })); more(); return; }

    var budget = null, m = t.match(/(under|below|less than|within|upto|up to|max|<)\s*(rs\.?|inr|₹)?\s*([0-9][0-9,]*)(k)?/);
    if (m) { budget = parseInt(m[3].replace(/,/g, ""), 10) * (m[4] ? 1000 : 1); }
    var wantDiffuser = has(/\b(diffuser|diffusers|machine|device)\b/);

    if (wantDiffuser) {
      var d = P.filter(function (p) { return p.cat === "diffuser" && (!budget || p.p <= budget); }).sort(byPrice);
      if (!d.length) { bot("I couldn’t find a diffuser in that budget. Our most affordable starts at " + rupee(Math.min.apply(null, P.filter(function (p) { return p.cat === "diffuser"; }).map(function (p) { return p.p; }))) + "."); more(); return; }
      bot(budget ? "Diffusers within " + rupee(budget) + ":" : "Here are our diffusers:"); cards(d.slice(0, 8));
      bot("Every diffuser comes with a free fragrance oil."); more(); return;
    }

    var res = search(t, w, budget);
    if (res.list.length) {
      bot(res.msg); cards(res.list.slice(0, 6)); more(); return;
    }
    if (budget) { var b = oils().filter(function (p) { return p.p <= budget; }).sort(function (a, c) { return (c.r ? c.r[0] : 0) - (a.r ? a.r[0] : 0); }); if (b.length) { bot("Fragrance oils within " + rupee(budget) + ":"); cards(b.slice(0, 6)); more(); return; } }

    bot("Hmm, I didn’t quite catch that. You can ask things like:\n• <i>Something like Bleu de Chanel</i>\n• <i>Fresh scent for my office under ₹1000</i>\n• <i>Which diffuser for a big living room?</i>\n• <i>Do you deliver to Kochi?</i>");
    menu();
  }

  function search(t, w, budget) {
    var pool = P.filter(function (p) { return !budget || p.p <= budget; });
    var keys = w.filter(function (x) { return !STOP[x] && x.length > 2; });

    // 1. direct product name or designer reference
    var named = pool.filter(function (p) { var n = norm(p.n); return keys.some(function (k) { return n.split(/[\s-]+/).indexOf(k) > -1; }); });
    var insp = pool.map(function (p) {
      if (!p.insp) return [p, 0];
      var iw = norm(p.insp).split(/[\s&'-]+/).filter(function (x) { return x.length > 2; });
      var hits = keys.filter(function (k) { return iw.indexOf(k) > -1; }).length;
      return [p, hits / Math.max(1, Math.min(iw.length, keys.length))];
    }).filter(function (x) { return x[1] > 0; }).sort(function (a, b) { return b[1] - a[1]; });
    if (insp.length) {
      var top = insp[0][1], list = insp.filter(function (x) { return x[1] >= top * 0.99; }).map(function (x) { return x[0]; });
      if (list.length <= 3) {
        var first = list[0];
        var sim = similar(first, pool, list);
        return { list: list.concat(sim), msg: (list.length === 1 ? "Your Azhara match is <b>" + esc(first.n) + "</b> — inspired by " + esc(first.insp) + ".\nNotes: " + esc(first.notes.slice(0, 6).join(", ")) + "." : "Here are the Azhara matches:") + (sim.length ? "\nYou may also like the ones after it." : "") };
      }
      return { list: list, msg: "Azhara blends from that house:" };
    }
    if (named.length) return { list: named, msg: named.length === 1 ? esc(named[0].sum || named[0].n) : "Here you go:" };

    // 2. family / notes / room scoring
    var fams = []; Object.keys(FAM).forEach(function (f) { if (FAM[f].some(function (k) { return w.indexOf(k) > -1; })) fams.push(f); });
    var room = null; Object.keys(ROOMS).forEach(function (r) { if (ROOMS[r].some(function (k) { return w.indexOf(k) > -1; })) room = r; });
    var noteKeys = keys;
    var scored = pool.filter(function (p) { return p.cat === "oil"; }).map(function (p) {
      var s = 0;
      p.fams.forEach(function (f) { if (fams.indexOf(f) > -1) s += 3; });
      var nl = p.notes.map(norm).join(" | ");
      noteKeys.forEach(function (k) { if (nl.indexOf(k) > -1) s += 2.5; });
      if (room && roomHit(p, room)) s += 1.5;
      if (/\b(men|man|male|masculine|him|husband)\b/.test(t) && /(homme|bleu|sauvage|aventus|eros|y eau|million|male|most wanted|black|acqua)/i.test(p.insp)) s += 2;
      if (/\b(women|woman|female|feminine|her|wife)\b/.test(t) && /(flora|bloom|coco|j'adore|si|bright|libre|interdit|black opium|belle|bombshell|beautiful)/i.test(p.insp)) s += 2;
      if (p.r) s += p.r[0] / 20;
      return [p, s];
    }).filter(function (x) { return x[1] >= 1.5; }).sort(function (a, b) { return b[1] - a[1]; }).map(function (x) { return x[0]; });
    if (scored.length) {
      var desc = fams.length ? fams.map(function (f) { return f.split("-")[0]; }).join(" & ") : "";
      return { list: scored, msg: "Here are my picks" + (desc ? " for something " + esc(desc) : "") + (room ? " for your " + room : "") + (budget ? " within " + rupee(budget) : "") + ":" };
    }
    return { list: [], msg: "" };
  }
  function similar(p, pool, exclude) {
    return pool.filter(function (x) { return x.cat === "oil" && exclude.indexOf(x) < 0; }).map(function (x) {
      var s = x.fams.filter(function (f) { return p.fams.indexOf(f) > -1; }).length * 2 + x.notes.filter(function (n) { return p.notes.indexOf(n) > -1; }).length;
      return [x, s];
    }).filter(function (x) { return x[1] >= 3; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 3).map(function (x) { return x[0]; });
  }
})();
