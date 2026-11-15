const defaults = {
  site: { name: "KAGE MEDIA", title: "KAGE MEDIA | Resmi Profil", description: "KAGE MEDIA resmi profil ve bağlantıları.", year: new Date().getFullYear(), locale: "tr" },
  branding: { logo: "影", logoSubtitle: "KAGE MEDIA", favicon: "assets/favicon.svg" },
  profile: { name: "KAGE MEDIA", username: "", avatar: "", avatarFallback: "K", verified: false, description: "" },
  background: { image: "", blur: 0, darkness: 70, saturation: 0, zoom: 1, positionX: 50, positionY: 50, fixed: true },
  theme: { background: "#080808", surface: "#111111", text: "#FFFFFF", muted: "#A0A0A0", accent: "#D5C6A0", border: "rgba(255,255,255,.12)" },
  navigation: { home: "Ana Sayfa", accounts: "Hesaplar", accountsEyebrow: "BAĞLANTILAR", accountsTitle: "Bizi takip edin", accountsDescription: "KAGE MEDIA dünyasına ait tüm bağlantılar tek bir yerde." },
  home: { discoverText: "Tüm bağlantıları keşfetmek için Hesaplar sayfasını ziyaret edin.", discoverLabel: "Hesapları görüntüle" },
  accounts: [], emptyAccountsText: "Bağlantılar yakında burada olacak.", footer: { copyright: "© {year} KAGE MEDIA. Tüm hakları saklıdır.", poweredBy: "Powered by", poweredByName: "www.eternalproduction.net", poweredByUrl: "https://www.eternalproduction.net" }
};

const merge = (base, value) => {
  if (Array.isArray(base)) return Array.isArray(value) ? value : base;
  if (base && typeof base === "object") {
    const supplied = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(supplied)])].map((key) => [key, key in base ? merge(base[key], supplied[key]) : supplied[key]]));
  }
  return value === undefined || value === null ? base : value;
};
const setText = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value ?? ""; };
const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
const safeUrl = (value) => { if (typeof value !== "string" || !value.trim()) return ""; try { const url = new URL(value, location.href); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } };

const iconShapes = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r=".7" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14 3v11.1a4.2 4.2 0 1 1-3.5-4.1M14 3c.5 3.1 2.2 4.9 5 5.2"/>',
  youtube: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/>',
  discord: '<path d="M7 7.5a14 14 0 0 1 10 0l1.5 9a13 13 0 0 1-3.7 1.7l-.9-1.5a10 10 0 0 0 2.1-.9M7.9 15.8a10 10 0 0 0 2.1.9l-.9 1.5A13 13 0 0 1 5.4 16.5l1.5-9"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>',
  x: '<path d="M4 4h4.6L20 20h-4.6L4 4Zm0 16 6-7m4-5 6-4"/>',
  telegram: '<path d="m21 4-4 16-5-5-3 3 .5-5.5L21 4ZM9.5 13.5 21 4"/>',
  website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V10Z"/>',
  accounts: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>'
};
function svgIcon(name, className = "") {
  const shape = iconShapes[name] || iconShapes.link;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape}</svg>`;
}

function renderAccounts(data) {
  const list = document.querySelector(".account-list");
  const empty = document.querySelector(".empty-state");
  const accounts = (Array.isArray(data.accounts) ? data.accounts : [])
    .filter((account) => account && account.enabled !== false && safeUrl(account.url))
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  list.replaceChildren();
  empty.hidden = accounts.length > 0;
  empty.textContent = data.emptyAccountsText;
  for (const account of accounts) {
    // Also tolerate older data.json files where platform and username were reversed.
    let platform = String(account.platform || "Bağlantı").trim();
    let username = String(account.username || "").trim();
    const knownPlatforms = ["instagram", "tiktok", "youtube", "discord", "telegram", "x", "website"];
    if (platform.startsWith("@") && knownPlatforms.includes(username.toLowerCase())) {
      [platform, username] = [username, platform];
    }
    const iconName = String(account.icon || account.id || "link").toLowerCase();
    const link = document.createElement("a");
    link.className = "account-card";
    link.href = safeUrl(account.url);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${platform}${username ? `, ${username}` : ""}`);
    const icon = document.createElement("span"); icon.className = "account-icon"; icon.innerHTML = svgIcon(iconName);
    const details = document.createElement("span"); details.className = "account-details";
    const title = document.createElement("span"); title.className = "account-platform"; title.textContent = platform;
    if (account.verified) { const badge = document.createElement("span"); badge.className = "account-verified"; badge.innerHTML = svgIcon("check"); badge.setAttribute("aria-label", "Doğrulanmış"); title.append(badge); }
    const subtitle = document.createElement("span"); subtitle.className = "account-subtitle"; subtitle.textContent = username || String(account.description || "").trim();
    if (!subtitle.textContent) subtitle.hidden = true;
    details.append(title, subtitle);
    link.append(icon, details, svgIcon("arrow", "account-arrow"));
    list.append(link);
  }
}

async function init() {
  let raw;
  try { const response = await fetch(new URL("data.json", import.meta.url), { cache: "no-store" }); if (!response.ok) throw new Error("data.json unavailable"); raw = await response.json(); }
  catch (error) { console.error("KAGE MEDIA settings could not be loaded; using safe defaults.", error); raw = {}; }
  const data = merge(defaults, raw);
  document.documentElement.lang = data.site.locale || "tr";
  document.title = data.site.title || data.site.name;
  document.querySelector('meta[name="description"]').content = data.site.description;
  document.querySelector('meta[property="og:title"]').content = data.site.title;
  document.querySelector('meta[property="og:description"]').content = data.site.description;
  document.querySelector('meta[property="og:image"]').content = safeUrl(data.profile.avatar) || safeUrl(data.background.image);
  const faviconUrl = new URL(data.branding.favicon || "assets/favicon.svg", import.meta.url).href;
  document.querySelector('link[rel="icon"]').href = safeUrl(faviconUrl) || new URL("assets/favicon.svg", import.meta.url).href;

  for (const [key, value] of Object.entries(data.theme)) document.documentElement.style.setProperty(`--${key}`, value);
  const bg = data.background;
  const backdrop = document.querySelector(".backdrop");
  backdrop.style.setProperty("--bg-image", safeUrl(bg.image) ? `url("${safeUrl(bg.image)}")` : "none");
  backdrop.style.setProperty("--bg-blur", `${clamp(bg.blur, 0, 30, 0)}px`);
  backdrop.style.setProperty("--bg-saturation", `${clamp(bg.saturation, 0, 200, 100)}%`);
  backdrop.style.setProperty("--bg-zoom", clamp(bg.zoom, 1, 1.5, 1));
  backdrop.style.setProperty("--bg-x", `${clamp(bg.positionX, 0, 100, 50)}%`);
  backdrop.style.setProperty("--bg-y", `${clamp(bg.positionY, 0, 100, 50)}%`);
  backdrop.style.position = bg.fixed ? "fixed" : "absolute";
  document.querySelector(".shade").style.setProperty("--shade", clamp(bg.darkness, 0, 95, 70) / 100);

  document.querySelector(".wordmark-symbol").textContent = data.branding.logo;
  document.querySelector(".wordmark-caption").textContent = data.branding.logoSubtitle;
  setText(".profile-username", data.profile.username);
  setText(".profile-name", data.profile.name);
  setText(".profile-description", data.profile.description);
  setText(".discover-copy", data.home.discoverText);
  document.querySelector(".verified-mark").hidden = !data.profile.verified;
  const avatar = document.querySelector(".avatar");
  document.querySelector(".avatar-fallback").textContent = data.profile.avatarFallback || data.profile.name?.slice(0, 1) || "K";
  const avatarUrl = safeUrl(data.profile.avatar);
  avatar.src = avatarUrl;
  avatar.hidden = !avatarUrl;
  avatar.addEventListener("error", () => { avatar.hidden = true; }, { once: true });
  setText(".nav-home", data.navigation.home);
  setText(".nav-accounts", data.navigation.accounts);
  document.querySelector(".home-icon").innerHTML = svgIcon("home");
  document.querySelector(".accounts-icon").innerHTML = svgIcon("accounts");
  document.querySelector(".arrow-icon").innerHTML = svgIcon("arrow");
  setText(".accounts-kicker", data.navigation.accountsEyebrow);
  setText(".accounts-title", data.navigation.accountsTitle);
  setText(".accounts-description", data.navigation.accountsDescription);
  const homeUrl = new URL("./", import.meta.url).href;
  const accountsUrl = new URL("hesaplar/", import.meta.url).href;
  document.querySelector(".home-route").href = homeUrl;
  document.querySelectorAll(".accounts-route").forEach((link) => { link.href = accountsUrl; });
  document.querySelector(".wordmark-symbol").closest("a").setAttribute("aria-label", data.navigation.home);
  document.querySelector(".discover-link").setAttribute("aria-label", data.home.discoverLabel);
  const year = String(data.site.year || new Date().getFullYear());
  setText(".copyright", String(data.footer.copyright).replaceAll("{year}", year));
  setText(".powered-label", data.footer.poweredBy);
  const poweredBy = document.querySelector(".powered-by"); poweredBy.textContent = data.footer.poweredByName;
  const poweredByUrl = safeUrl(data.footer.poweredByUrl);
  if (poweredByUrl) poweredBy.href = poweredByUrl; else poweredBy.removeAttribute("href");
  poweredBy.hidden = !data.footer.poweredByName;
  document.querySelector(".powered-label").hidden = !data.footer.poweredBy;
  renderAccounts(data);
  const accountsPath = new URL("hesaplar/", import.meta.url).pathname.replace(/\/+$/, "");
  showView(location.pathname.replace(/\/+$/, "") === accountsPath ? "accounts" : "home");
}

function showView(name) {
  const safeName = name === "accounts" ? "accounts" : "home";
  document.querySelectorAll(".view").forEach((view) => {
    const active = view.dataset.view === safeName;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  document.querySelectorAll(".nav-item").forEach((link) => {
    const active = link.classList.contains(safeName === "accounts" ? "accounts-route" : "home-route");
    link.classList.toggle("is-selected", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
}
init();
