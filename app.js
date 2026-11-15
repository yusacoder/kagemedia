
function renderAccounts(data) {
  const list = document.querySelector(".account-list");
  const empty = document.querySelector(".empty-state");

  if (!list || !empty) return;

  const platformFromUrl = (url) => {
    const value = String(url || "").toLowerCase();

    if (value.includes("instagram.com")) return "Instagram";
    if (value.includes("tiktok.com")) return "TikTok";
    if (value.includes("youtube.com") || value.includes("youtu.be")) return "YouTube";
    if (value.includes("discord")) return "Discord";
    if (value.includes("telegram") || value.includes("t.me")) return "Telegram";
    if (value.includes("x.com") || value.includes("twitter.com")) return "X";

    return "Website";
  };

  const iconForPlatform = (platform) => {
    const value = String(platform || "").toLowerCase();

    if (value.includes("instagram")) return "instagram";
    if (value.includes("tiktok")) return "tiktok";
    if (value.includes("youtube")) return "youtube";
    if (value.includes("discord")) return "discord";
    if (value.includes("telegram")) return "telegram";
    if (value === "x") return "x";
    if (value.includes("website")) return "website";

    return "link";
  };

  const accounts = (Array.isArray(data.accounts) ? data.accounts : [])
    .filter(account =>
      account &&
      account.enabled !== false &&
      typeof account.url === "string" &&
      /^https?:\/\//i.test(account.url)
    )
    .sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999));

  list.replaceChildren();
  empty.hidden = accounts.length > 0;
  empty.textContent = data.emptyAccountsText || "Bağlantılar yakında burada olacak.";

  accounts.forEach(account => {
    let platform = String(account.platform || "").trim();
    let username = String(account.username || "").trim();

    if (platform.startsWith("@")) {
      [platform, username] = [username, platform];
    }

    if (!platform || platform.startsWith("@") || platform.length > 24) {
      platform = platformFromUrl(account.url);
    }

    if (!username.startsWith("@")) {
      username = username ? `@${username}` : "";
    }

    const iconName = iconForPlatform(platform);

    const card = document.createElement("a");
    card.className = "account-card";
    card.href = account.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    const icon = document.createElement("span");
    icon.className = "account-icon";
    icon.innerHTML = svgIcon(iconName);

    const details = document.createElement("span");
    details.className = "account-details";

    const title = document.createElement("span");
    title.className = "account-platform";
    title.textContent = platform;

    if (account.verified) {
      const verified = document.createElement("span");
      verified.className = "account-verified";
      verified.innerHTML = svgIcon("check");
      title.appendChild(verified);
    }

    const subtitle = document.createElement("span");
    subtitle.className = "account-subtitle";
    subtitle.textContent = username;
    subtitle.hidden = !username;

    details.append(title, subtitle);

    const arrow = document.createElement("span");
    arrow.className = "account-arrow";
    arrow.innerHTML = svgIcon("arrow");

    card.append(icon, details, arrow);
    list.appendChild(card);
  });
}
