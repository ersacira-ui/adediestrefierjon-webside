
/* ADE DI ESTREFI ERJON - Cookie Consent & Analytics */

(function () {
  "use strict";

  const GA_ID = "G-1X8QG2JYHF";
  const CONSENT_KEY = "ade_cookie_consent_v1";
  const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;

  let analyticsLoaded = false;
  let currentConsent = null;

  window["ga-disable-" + GA_ID] = true;

  function readConsent() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(CONSENT_KEY)
      );

      if (
        saved &&
        typeof saved.analytics === "boolean" &&
        Date.now() < saved.expires
      ) {
        return saved;
      }

      localStorage.removeItem(CONSENT_KEY);
    } catch (error) {}

    return null;
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;

    analyticsLoaded = true;
    window["ga-disable-" + GA_ID] = false;

    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    window.gtag("js", new Date());

    window.gtag("config", GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
      cookie_update: false
    });

    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      GA_ID;

    document.head.appendChild(script);
  }

  function removeAnalyticsCookies() {
    const domains = [
      "",
      location.hostname,
      "." + location.hostname,
      "adediestrefierjon.it",
      ".adediestrefierjon.it"
    ];

    document.cookie.split(";").forEach(function (cookie) {
      const name = cookie.split("=")[0].trim();

      if (name === "_ga" || name.startsWith("_ga_")) {
        domains.forEach(function (domain) {
          document.cookie =
            name +
            "=; Max-Age=0; path=/;" +
            (domain ? " domain=" + domain + ";" : "");
        });
      }
    });
  }

  function saveConsent(analytics) {
    const wasLoaded = analyticsLoaded;

    currentConsent = {
      analytics: analytics,
      timestamp: Date.now(),
      expires: Date.now() + CONSENT_DURATION
    };

    let persisted = false;

    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify(currentConsent)
      );

      persisted = true;
    } catch (error) {}

    if (analytics) {
      loadAnalytics();
    } else {
      window["ga-disable-" + GA_ID] = true;

      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied"
        });
      }

      removeAnalyticsCookies();
    }

    document.getElementById(
      "ade-cookie-banner"
    ).hidden = true;

    if (!analytics && wasLoaded && persisted) {
      location.reload();
    }
  }

  function openPreferences() {
    document.getElementById(
      "ade-cookie-banner"
    ).hidden = false;

    document.getElementById(
      "ade-cookie-preferences"
    ).hidden = false;

    document.getElementById(
      "ade-cookie-analytics"
    ).checked = Boolean(
      currentConsent && currentConsent.analytics
    );

    document.getElementById(
      "ade-cookie-analytics"
    ).focus();
  }

  function createBanner() {
    const banner = document.createElement("section");

    banner.id = "ade-cookie-banner";
    banner.hidden = true;

    banner.setAttribute("role", "region");
    banner.setAttribute(
      "aria-labelledby",
      "ade-cookie-title"
    );

    banner.innerHTML = `
      <h2 id="ade-cookie-title">
        Preferenze sui cookie
      </h2>

      <p>
        Utilizziamo strumenti tecnici necessari
        al funzionamento del sito e, previo consenso,
        cookie analitici per analizzare il traffico
        e migliorare i nostri servizi.
      </p>

      <div class="ade-cookie-links">
        <a href="/privacy-policy.html">
          Privacy Policy
        </a>

        <a href="/cookie-policy.html">
          Cookie Policy
        </a>
      </div>

      <div class="ade-cookie-buttons">

        <button type="button" id="ade-cookie-reject">
          Rifiuta tutti
        </button>

        <button type="button" id="ade-cookie-customize">
          Personalizza
        </button>

        <button type="button" id="ade-cookie-accept">
          Accetta tutti
        </button>

      </div>

      <div id="ade-cookie-preferences" hidden>

        <label class="ade-cookie-option">
          <span>Cookie tecnici (necessari)</span>
          <input type="checkbox" checked disabled>
        </label>

        <label class="ade-cookie-option">
          <span>Cookie analitici (Google Analytics)</span>
          <input type="checkbox" id="ade-cookie-analytics">
        </label>

        <button type="button" id="ade-cookie-save">
          Salva preferenze
        </button>

      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById(
      "ade-cookie-accept"
    ).addEventListener("click", function () {
      saveConsent(true);
    });

    document.getElementById(
      "ade-cookie-reject"
    ).addEventListener("click", function () {
      saveConsent(false);
    });

    document.getElementById(
      "ade-cookie-customize"
    ).addEventListener("click", openPreferences);

    document.getElementById(
      "ade-cookie-save"
    ).addEventListener("click", function () {
      saveConsent(
        document.getElementById(
          "ade-cookie-analytics"
        ).checked
      );
    });
  }

  function createFooterLinks() {
    let footer = document.querySelector("footer");

    if (!footer) {
      footer = document.createElement("footer");
      document.body.appendChild(footer);
    }

    const links = document.createElement("div");

    links.style.cssText =
      "display:flex;justify-content:center;" +
      "align-items:center;flex-wrap:wrap;" +
      "gap:15px;padding:12px;font-size:13px;";

    links.innerHTML = `
      <a href="/privacy-policy.html"
         style="color:inherit">
        Privacy Policy
      </a>

      <a href="/cookie-policy.html"
         style="color:inherit">
        Cookie Policy
      </a>

      <button type="button"
              class="ade-cookie-settings-link">
        Preferenze cookie
      </button>
    `;

    footer.appendChild(links);

    links.querySelector("button").addEventListener(
      "click",
      openPreferences
    );

    const settingsButton =
      document.getElementById("cookie-settings");

    if (settingsButton) {
      settingsButton.hidden = false;

      settingsButton.addEventListener(
        "click",
        openPreferences
      );
    }
  }

  function init() {
    currentConsent = readConsent();

    createBanner();
    createFooterLinks();

    if (!currentConsent) {
      removeAnalyticsCookies();

      document.getElementById(
        "ade-cookie-banner"
      ).hidden = false;

    } else if (currentConsent.analytics) {
      loadAnalytics();

    } else {
      removeAnalyticsCookies();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
