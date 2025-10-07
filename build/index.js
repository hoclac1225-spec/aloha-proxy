var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x, {
  get: (a, b) => (typeof require < "u" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require < "u")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.jsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = renderToString(
    /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url })
  );
  return responseHeaders.set("Content-Type", "text/html"), new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  default: () => App
});
import "react";
import { Outlet } from "react-router-dom";

// app/utils/AppProviderFix.jsx
import "react";
import AppBridgePkg from "@shopify/app-bridge-react";
import { AppProvider } from "@shopify/polaris";

// app/locales/en.json
var en_default = {
  Polaris: {
    ActionMenu: {
      Actions: {
        moreActions: "More actions"
      },
      RollupActions: {
        rollupButton: "View actions"
      }
    },
    ActionList: {
      SearchField: {
        clearButtonLabel: "Clear",
        search: "Search",
        placeholder: "Search actions"
      }
    },
    Avatar: {
      label: "Avatar",
      labelWithInitials: "Avatar with initials {initials}"
    },
    Autocomplete: {
      spinnerAccessibilityLabel: "Loading",
      ellipsis: "{content}\u2026"
    },
    Badge: {
      PROGRESS_LABELS: {
        incomplete: "Incomplete",
        partiallyComplete: "Partially complete",
        complete: "Complete"
      },
      TONE_LABELS: {
        info: "Info",
        success: "Success",
        warning: "Warning",
        critical: "Critical",
        attention: "Attention",
        new: "New",
        readOnly: "Read-only",
        enabled: "Enabled"
      },
      progressAndTone: "{toneLabel} {progressLabel}"
    },
    Banner: {
      dismissButton: "Dismiss notification"
    },
    Button: {
      spinnerAccessibilityLabel: "Loading"
    },
    Common: {
      checkbox: "checkbox",
      undo: "Undo",
      cancel: "Cancel",
      clear: "Clear",
      close: "Close",
      submit: "Submit",
      more: "More"
    },
    ContextualSaveBar: {
      save: "Save",
      discard: "Discard"
    },
    DataTable: {
      sortAccessibilityLabel: "sort {direction} by",
      navAccessibilityLabel: "Scroll table {direction} one column",
      totalsRowHeading: "Totals",
      totalRowHeading: "Total"
    },
    DatePicker: {
      previousMonth: "Show previous month, {previousMonthName} {showPreviousYear}",
      nextMonth: "Show next month, {nextMonth} {nextYear}",
      today: "Today ",
      start: "Start of range",
      end: "End of range",
      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December"
      },
      days: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      },
      daysAbbreviated: {
        monday: "Mo",
        tuesday: "Tu",
        wednesday: "We",
        thursday: "Th",
        friday: "Fr",
        saturday: "Sa",
        sunday: "Su"
      }
    },
    DiscardConfirmationModal: {
      title: "Discard all unsaved changes",
      message: "If you discard changes, you\u2019ll delete any edits you made since you last saved.",
      primaryAction: "Discard changes",
      secondaryAction: "Continue editing"
    },
    DropZone: {
      single: {
        overlayTextFile: "Drop file to upload",
        overlayTextImage: "Drop image to upload",
        overlayTextVideo: "Drop video to upload",
        actionTitleFile: "Add file",
        actionTitleImage: "Add image",
        actionTitleVideo: "Add video",
        actionHintFile: "or drop file to upload",
        actionHintImage: "or drop image to upload",
        actionHintVideo: "or drop video to upload",
        labelFile: "Upload file",
        labelImage: "Upload image",
        labelVideo: "Upload video"
      },
      allowMultiple: {
        overlayTextFile: "Drop files to upload",
        overlayTextImage: "Drop images to upload",
        overlayTextVideo: "Drop videos to upload",
        actionTitleFile: "Add files",
        actionTitleImage: "Add images",
        actionTitleVideo: "Add videos",
        actionHintFile: "or drop files to upload",
        actionHintImage: "or drop images to upload",
        actionHintVideo: "or drop videos to upload",
        labelFile: "Upload files",
        labelImage: "Upload images",
        labelVideo: "Upload videos"
      },
      errorOverlayTextFile: "File type is not valid",
      errorOverlayTextImage: "Image type is not valid",
      errorOverlayTextVideo: "Video type is not valid"
    },
    EmptySearchResult: {
      altText: "Empty search results"
    },
    Frame: {
      skipToContent: "Skip to content",
      navigationLabel: "Navigation",
      Navigation: {
        closeMobileNavigationLabel: "Close navigation"
      }
    },
    FullscreenBar: {
      back: "Back",
      accessibilityLabel: "Exit fullscreen mode"
    },
    Filters: {
      moreFilters: "More filters",
      moreFiltersWithCount: "More filters ({count})",
      filter: "Filter {resourceName}",
      noFiltersApplied: "No filters applied",
      cancel: "Cancel",
      done: "Done",
      clearAllFilters: "Clear all filters",
      clear: "Clear",
      clearLabel: "Clear {filterName}",
      addFilter: "Add filter",
      clearFilters: "Clear all",
      searchInView: "in:{viewName}"
    },
    FilterPill: {
      clear: "Clear",
      unsavedChanges: "Unsaved changes - {label}"
    },
    IndexFilters: {
      searchFilterTooltip: "Search and filter",
      searchFilterTooltipWithShortcut: "Search and filter (F)",
      searchFilterAccessibilityLabel: "Search and filter results",
      sort: "Sort your results",
      addView: "Add a new view",
      newView: "Custom search",
      SortButton: {
        ariaLabel: "Sort the results",
        tooltip: "Sort",
        title: "Sort by",
        sorting: {
          asc: "Ascending",
          desc: "Descending",
          az: "A-Z",
          za: "Z-A"
        }
      },
      EditColumnsButton: {
        tooltip: "Edit columns",
        accessibilityLabel: "Customize table column order and visibility"
      },
      UpdateButtons: {
        cancel: "Cancel",
        update: "Update",
        save: "Save",
        saveAs: "Save as",
        modal: {
          title: "Save view as",
          label: "Name",
          sameName: "A view with this name already exists. Please choose a different name.",
          save: "Save",
          cancel: "Cancel"
        }
      }
    },
    IndexProvider: {
      defaultItemSingular: "Item",
      defaultItemPlural: "Items",
      allItemsSelected: "All {itemsLength}+ {resourceNamePlural} are selected",
      selected: "{selectedItemsCount} selected",
      a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
      a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
      a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
      a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}"
    },
    IndexTable: {
      emptySearchTitle: "No {resourceNamePlural} found",
      emptySearchDescription: "Try changing the filters or search term",
      onboardingBadgeText: "New",
      resourceLoadingAccessibilityLabel: "Loading {resourceNamePlural}\u2026",
      selectAllLabel: "Select all {resourceNamePlural}",
      selected: "{selectedItemsCount} selected",
      undo: "Undo",
      selectAllItems: "Select all {itemsLength}+ {resourceNamePlural}",
      selectItem: "Select {resourceName}",
      selectButtonText: "Select",
      sortAccessibilityLabel: "sort {direction} by"
    },
    Loading: {
      label: "Page loading bar"
    },
    Modal: {
      iFrameTitle: "body markup",
      modalWarning: "These required properties are missing from Modal: {missingProps}"
    },
    Page: {
      Header: {
        rollupActionsLabel: "View actions for {title}",
        pageReadyAccessibilityLabel: "{title}. This page is ready"
      }
    },
    Pagination: {
      previous: "Previous",
      next: "Next",
      pagination: "Pagination"
    },
    ProgressBar: {
      negativeWarningMessage: "Values passed to the progress prop shouldn\u2019t be negative. Resetting {progress} to 0.",
      exceedWarningMessage: "Values passed to the progress prop shouldn\u2019t exceed 100. Setting {progress} to 100."
    },
    ResourceList: {
      sortingLabel: "Sort by",
      defaultItemSingular: "item",
      defaultItemPlural: "items",
      showing: "Showing {itemsCount} {resource}",
      showingTotalCount: "Showing {itemsCount} of {totalItemsCount} {resource}",
      loading: "Loading {resource}",
      selected: "{selectedItemsCount} selected",
      allItemsSelected: "All {itemsLength}+ {resourceNamePlural} in your store are selected",
      allFilteredItemsSelected: "All {itemsLength}+ {resourceNamePlural} in this filter are selected",
      selectAllItems: "Select all {itemsLength}+ {resourceNamePlural} in your store",
      selectAllFilteredItems: "Select all {itemsLength}+ {resourceNamePlural} in this filter",
      emptySearchResultTitle: "No {resourceNamePlural} found",
      emptySearchResultDescription: "Try changing the filters or search term",
      selectButtonText: "Select",
      a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
      a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
      a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
      a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}",
      Item: {
        actionsDropdownLabel: "Actions for {accessibilityLabel}",
        actionsDropdown: "Actions dropdown",
        viewItem: "View details for {itemName}"
      },
      BulkActions: {
        actionsActivatorLabel: "Actions",
        moreActionsActivatorLabel: "More actions"
      }
    },
    SkeletonPage: {
      loadingLabel: "Page loading"
    },
    Tabs: {
      newViewAccessibilityLabel: "Create new view",
      newViewTooltip: "Create view",
      toggleTabsLabel: "More views",
      Tab: {
        rename: "Rename view",
        duplicate: "Duplicate view",
        edit: "Edit view",
        editColumns: "Edit columns",
        delete: "Delete view",
        copy: "Copy of {name}",
        deleteModal: {
          title: "Delete view?",
          description: "This can\u2019t be undone. {viewName} view will no longer be available in your admin.",
          cancel: "Cancel",
          delete: "Delete view"
        }
      },
      RenameModal: {
        title: "Rename view",
        label: "Name",
        cancel: "Cancel",
        create: "Save",
        errors: {
          sameName: "A view with this name already exists. Please choose a different name."
        }
      },
      DuplicateModal: {
        title: "Duplicate view",
        label: "Name",
        cancel: "Cancel",
        create: "Create view",
        errors: {
          sameName: "A view with this name already exists. Please choose a different name."
        }
      },
      CreateViewModal: {
        title: "Create new view",
        label: "Name",
        cancel: "Cancel",
        create: "Create view",
        errors: {
          sameName: "A view with this name already exists. Please choose a different name."
        }
      }
    },
    Tag: {
      ariaLabel: "Remove {children}"
    },
    TextField: {
      characterCount: "{count} characters",
      characterCountWithMaxLength: "{count} of {limit} characters used"
    },
    TooltipOverlay: {
      accessibilityLabel: "Tooltip: {label}"
    },
    TopBar: {
      toggleMenuLabel: "Toggle menu",
      SearchField: {
        clearButtonLabel: "Clear",
        search: "Search"
      }
    },
    MediaCard: {
      dismissButton: "Dismiss",
      popoverButton: "Actions"
    },
    VideoThumbnail: {
      playButtonA11yLabel: {
        default: "Play video",
        defaultWithDuration: "Play video of length {duration}",
        duration: {
          hours: {
            other: {
              only: "{hourCount} hours",
              andMinutes: "{hourCount} hours and {minuteCount} minutes",
              andMinute: "{hourCount} hours and {minuteCount} minute",
              minutesAndSeconds: "{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds",
              minutesAndSecond: "{hourCount} hours, {minuteCount} minutes, and {secondCount} second",
              minuteAndSeconds: "{hourCount} hours, {minuteCount} minute, and {secondCount} seconds",
              minuteAndSecond: "{hourCount} hours, {minuteCount} minute, and {secondCount} second",
              andSeconds: "{hourCount} hours and {secondCount} seconds",
              andSecond: "{hourCount} hours and {secondCount} second"
            },
            one: {
              only: "{hourCount} hour",
              andMinutes: "{hourCount} hour and {minuteCount} minutes",
              andMinute: "{hourCount} hour and {minuteCount} minute",
              minutesAndSeconds: "{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds",
              minutesAndSecond: "{hourCount} hour, {minuteCount} minutes, and {secondCount} second",
              minuteAndSeconds: "{hourCount} hour, {minuteCount} minute, and {secondCount} seconds",
              minuteAndSecond: "{hourCount} hour, {minuteCount} minute, and {secondCount} second",
              andSeconds: "{hourCount} hour and {secondCount} seconds",
              andSecond: "{hourCount} hour and {secondCount} second"
            }
          },
          minutes: {
            other: {
              only: "{minuteCount} minutes",
              andSeconds: "{minuteCount} minutes and {secondCount} seconds",
              andSecond: "{minuteCount} minutes and {secondCount} second"
            },
            one: {
              only: "{minuteCount} minute",
              andSeconds: "{minuteCount} minute and {secondCount} seconds",
              andSecond: "{minuteCount} minute and {secondCount} second"
            }
          },
          seconds: {
            other: "{secondCount} seconds",
            one: "{secondCount} second"
          }
        }
      }
    }
  }
};

// app/utils/polarisTranslations.js
var enTranslations = en_default;

// app/utils/AppProviderFix.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
var AppBridge = AppBridgePkg?.default || AppBridgePkg || {}, AppBridgeProvider = AppBridge.Provider || AppBridge.AppBridgeProvider || null;
function AppProviderFix({ children }) {
  let config = {
    apiKey: import.meta?.env?.VITE_SHOPIFY_API_KEY || process.env.SHOPIFY_API_KEY || "dummy-key",
    shopOrigin: import.meta?.env?.VITE_SHOPIFY_SHOP || process.env.SHOPIFY_SHOP || "dummy.myshopify.com",
    forceRedirect: !0
  };
  return AppBridgeProvider ? /* @__PURE__ */ jsx2(AppBridgeProvider, { config, children: /* @__PURE__ */ jsx2(AppProvider, { i18n: enTranslations, children }) }) : (console.warn("\u26A0\uFE0F AppBridgeProvider not found, falling back to Polaris only."), /* @__PURE__ */ jsx2(AppProvider, { i18n: enTranslations, children }));
}

// app/root.jsx
import { jsx as jsx3 } from "react/jsx-runtime";
function App() {
  return /* @__PURE__ */ jsx3(AppProviderFix, { children: /* @__PURE__ */ jsx3(Outlet, {}) });
}

// app/routes/webhooks.app.scopes_update.jsx
var webhooks_app_scopes_update_exports = {};
__export(webhooks_app_scopes_update_exports, {
  action: () => action,
  loader: () => loader
});

// app/shopify.server.js
import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp
} from "@shopify/shopify-app-remix/server";

// app/db.server.js
import { PrismaClient } from "@prisma/client";
var globalForPrisma = globalThis, prisma = globalForPrisma.__prismaClient ?? new PrismaClient({
  log: ["error"]
});
var db_server_default = prisma;

// app/shopify.server.js
async function createSessionStorage() {
  try {
    let { PrismaSessionStorage } = await import("@shopify/shopify-app-session-storage-prisma");
    if (typeof db_server_default.session > "u")
      throw new Error("prisma.session is undefined");
    let storage = new PrismaSessionStorage(db_server_default);
    return console.log("[shopify.server] Using PrismaSessionStorage"), storage;
  } catch (err) {
    console.warn(
      "[shopify.server] PrismaSessionStorage unavailable or prisma.session missing \u2014 falling back to in-memory session storage (dev only).",
      err && (err.message || err.toString())
    );
    class MemorySessionStorage {
      constructor() {
        this.map = /* @__PURE__ */ new Map();
      }
      // storeSession(session) -> session
      async storeSession(session) {
        if (!session || !session.id)
          throw new Error("Invalid session object");
        return this.map.set(session.id, session), session;
      }
      // loadSession(id) -> session | null
      async loadSession(id) {
        return this.map.get(id) ?? null;
      }
      // deleteSession(id) -> boolean
      async deleteSession(id) {
        return this.map.delete(id);
      }
      // findSessionsByShop(shop) -> session[]
      async findSessionsByShop(shop) {
        let out = [];
        for (let s of this.map.values())
          s && s.shop === shop && out.push(s);
        return out;
      }
    }
    return new MemorySessionStorage();
  }
}
var _sessionStoragePromise = createSessionStorage(), resolvedSessionStorage = null;
_sessionStoragePromise.then((s) => {
  resolvedSessionStorage = s;
}).catch((e) => {
  console.error("[shopify.server] session storage init error:", e && e.message);
});
function getSessionStorageSyncFallback() {
  if (resolvedSessionStorage)
    return resolvedSessionStorage;
  console.warn("[shopify.server] session storage not yet initialized \u2014 using transient in-memory fallback");
  let map = /* @__PURE__ */ new Map();
  return {
    storeSession: async (s) => (map.set(s.id, s), s),
    loadSession: async (id) => map.get(id) ?? null,
    deleteSession: async (id) => map.delete(id),
    findSessionsByShop: async (shop) => Array.from(map.values()).filter((s) => s?.shop === shop)
  };
}
var sessionStorageForConfig = getSessionStorageSyncFallback(), shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: sessionStorageForConfig,
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: !0,
    removeRest: !0
  },
  ...process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}
});
var apiVersion = ApiVersion.January25, addDocumentResponseHeaders = shopify.addDocumentResponseHeaders, authenticate = shopify.authenticate, unauthenticated = shopify.unauthenticated, login = shopify.login, registerWebhooks = shopify.registerWebhooks;

// app/routes/webhooks.app.scopes_update.jsx
var action = async ({ request }) => {
  try {
    let { shop, session, topic } = await authenticate.webhook(request);
    return console.log(`? Received ${topic} webhook for ${shop}`), session && (await db_server_default.session.updateMany({
      where: { shop },
      data: { updatedAt: /* @__PURE__ */ new Date() }
    }), console.log(`?? Updated session(s) for shop: ${shop}`)), new Response(null, { status: 200 });
  } catch (err) {
    return console.error("? /webhooks/app/scopes_update error:", err), new Response("Error processing webhook", { status: 500 });
  }
}, loader = async () => (console.log("?? GET /webhooks/app/scopes_update called"), new Response("Webhook endpoint ready", { status: 200 }));

// app/routes/webhooks.app.uninstalled.jsx
var webhooks_app_uninstalled_exports = {};
__export(webhooks_app_uninstalled_exports, {
  action: () => action2,
  loader: () => loader2
});
var action2 = async ({ request }) => {
  try {
    let { shop, session, topic } = await authenticate.webhook(request);
    return console.log(`? Received ${topic} webhook for ${shop}`), session && (await db_server_default.session.deleteMany({ where: { shop } }), console.log(`?? Deleted session(s) for shop: ${shop}`)), new Response(null, { status: 200 });
  } catch (err) {
    return console.error("? /webhooks/app/uninstalled error:", err), new Response("Error processing webhook", { status: 500 });
  }
}, loader2 = async () => (console.log("?? GET /webhooks/app/uninstalled called"), new Response("Webhook endpoint ready", { status: 200 }));

// app/routes/_index_disabled_folder/route.jsx
var route_exports = {};
__export(route_exports, {
  default: () => Index,
  loader: () => loader3
});
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var authenticate2, login2;
try {
  ({ authenticate: authenticate2, login: login2 } = __require("../shopify.server"));
} catch {
  authenticate2 = {
    // admin(request) phÃ¡ÂºÂ£i trÃ¡ÂºÂ£ { isAuthenticated: boolean } nÃ¡ÂºÂ¿u cÃƒÂ³
    admin: async () => ({ isAuthenticated: !1 })
  }, login2 = null;
}
var loader3 = async ({ request }) => {
  try {
    let { isAuthenticated } = await authenticate2.admin(request);
    if (!isAuthenticated) {
      let shop = new URL(request.url).searchParams.get("shop");
      return shop ? redirect(`/auth?shop=${shop}`) : json({ ok: !0, showForm: Boolean(login2) });
    }
    return json({ ok: !0, installed: !0, showForm: !1 });
  } catch {
    let shop = new URL(request.url).searchParams.get("shop");
    return shop ? redirect(`/auth?shop=${shop}`) : json({ ok: !0, showForm: Boolean(login2) });
  }
};
function Index() {
  let { showForm } = useLoaderData();
  return /* @__PURE__ */ jsx4("div", { style: { padding: 24 }, children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx4("h1", { style: { fontSize: 24, marginBottom: 8 }, children: "Aloha \xC3\xA2\xE2\u201A\xAC\xE2\u20AC\x9D Welcome" }),
    /* @__PURE__ */ jsx4("p", { style: { marginBottom: 16 }, children: "\xC3\u201E\xC2\x90\xC3\u0192\xC2\xA2y l\xC3\u0192\xC2\xA0 trang index t\xC3\xA1\xC2\xBA\xC2\xA1m cho app. D\xC3\u0192\xC2\xB9ng form d\xC3\u2020\xC2\xB0\xC3\xA1\xC2\xBB\xE2\u20AC\xBAi \xC3\u201E\xE2\u20AC\u02DC\xC3\xA1\xC2\xBB\xC6\u2019 b\xC3\xA1\xC2\xBA\xC2\xAFt \xC3\u201E\xE2\u20AC\u02DC\xC3\xA1\xC2\xBA\xC2\xA7u flow c\xC3\u0192\xC2\xA0i app (OAuth)." }),
    showForm && /* @__PURE__ */ jsxs(Form, { method: "post", action: "/auth/login", style: { marginBottom: 24 }, children: [
      /* @__PURE__ */ jsxs("label", { style: { display: "block", marginBottom: 8 }, children: [
        /* @__PURE__ */ jsx4("div", { children: "Shop domain" }),
        /* @__PURE__ */ jsx4(
          "input",
          {
            name: "shop",
            type: "text",
            placeholder: "e.g: aloha-pwa-dev.myshopify.com",
            style: { padding: 8, width: 360, marginTop: 6 }
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, color: "#666" }, children: [
          "Nh\xC3\xA1\xC2\xBA\xC2\xADp domain d\xC3\xA1\xC2\xBA\xC2\xA1ng ",
          /* @__PURE__ */ jsx4("code", { children: "your-shop.myshopify.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsx4("button", { type: "submit", style: { padding: "8px 12px" }, children: "Log in / Install" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx4("strong", { children: "Feature:" }),
        " Quick install flow & app proxy testing."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx4("strong", { children: "Note:" }),
        " N\xC3\xA1\xC2\xBA\xC2\xBFu b\xC3\xA1\xC2\xBA\xC2\xA1n c\xC3\u0192\xC2\xB3 shopify.server, loader s\xC3\xA1\xC2\xBA\xC2\xBD d\xC3\u0192\xC2\xB9ng authenticate.admin(request)."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx4("strong", { children: "Dev tip:" }),
        " N\xC3\xA1\xC2\xBA\xC2\xBFu g\xC3\xA1\xC2\xBA\xC2\xB7p l\xC3\xA1\xC2\xBB\xE2\u20AC\u201Di route duplicate, ch\xC3\xA1\xC2\xBB\xE2\u20AC\xB0 gi\xC3\xA1\xC2\xBB\xC2\xAF m\xC3\xA1\xC2\xBB\xE2\u201E\xA2t file `_index`."
      ] })
    ] })
  ] }) });
}

// app/routes/app._index.disabled.jsx
var app_index_disabled_exports = {};
__export(app_index_disabled_exports, {
  action: () => action3,
  default: () => Index2,
  loader: () => loader4
});
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import * as polaris from "@shopify/polaris";
import AppBridgePkg2 from "@shopify/app-bridge-react";
import { Fragment, jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var AppBridge2 = AppBridgePkg2 && (AppBridgePkg2.default || AppBridgePkg2) || {}, { TitleBar, useAppBridge } = AppBridge2, {
  Page: PolarisPage,
  Card,
  Button,
  Box,
  List,
  Layout,
  Text,
  Link,
  // possible stack/container names
  VerticalStack,
  LegacyStack,
  BlockStack: PolarisBlockStack,
  InlineStack: PolarisInlineStack,
  Inline
} = polaris || {}, Page = PolarisPage || (({ children }) => /* @__PURE__ */ jsx5("div", { children })), BlockStack = PolarisBlockStack || VerticalStack || LegacyStack || (({ children }) => /* @__PURE__ */ jsx5("div", { children })), InlineStack = PolarisInlineStack || Inline || (({ children }) => /* @__PURE__ */ jsx5("div", { style: { display: "inline-block" }, children })), LayoutComponent = Layout || (({ children }) => /* @__PURE__ */ jsx5("div", { children })), CardComponent = Card || (({ children }) => /* @__PURE__ */ jsx5("div", { children })), TextComponent = Text || (({ children, as: As = "div", variant }) => /* @__PURE__ */ jsx5(As, { children })), LinkComponent = Link || (({ children }) => /* @__PURE__ */ jsx5("a", { children })), BoxComponent = Box || (({ children, style }) => /* @__PURE__ */ jsx5("div", { style, children })), ListComponent = List || (({ children }) => /* @__PURE__ */ jsx5("ul", { children })), ButtonComponent = Button || (({ children, ...props }) => /* @__PURE__ */ jsx5("button", { ...props, children })), loader4 = async ({ request }) => (await authenticate.admin(request), null), action3 = async ({ request }) => {
  let { admin } = await authenticate.admin(request), color = ["Red", "Orange", "Yellow", "Green"][Math.floor(Math.random() * 4)], responseJson = await (await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`
        }
      }
    }
  )).json(), product = responseJson.data.productCreate.product, variantId = product.variants.edges[0].node.id, variantResponseJson = await (await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }]
      }
    }
  )).json();
  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants
  };
};
function Index2() {
  let fetcher = useFetcher(), shopify2 = useAppBridge(), isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST", productId = fetcher.data?.product?.id?.replace?.("gid://shopify/Product/", "");
  useEffect(() => {
    productId && shopify2?.toast?.show && shopify2.toast.show("Product created");
  }, [productId, shopify2]);
  let generateProduct = () => fetcher.submit({}, { method: "POST" });
  return /* @__PURE__ */ jsxs2(Page, { children: [
    /* @__PURE__ */ jsx5(TitleBar, { title: "Remix app template", children: /* @__PURE__ */ jsx5(ButtonComponent, { variant: "primary", onClick: generateProduct, children: "Generate a product" }) }),
    /* @__PURE__ */ jsx5(BlockStack, { gap: "500", children: /* @__PURE__ */ jsxs2(LayoutComponent, { children: [
      /* @__PURE__ */ jsx5(LayoutComponent.Section, { children: /* @__PURE__ */ jsx5(CardComponent, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "500", children: [
        /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx5(TextComponent, { as: "h2", variant: "headingMd", children: "Congrats on creating a new Shopify app \u{1F389}" }),
          /* @__PURE__ */ jsxs2(TextComponent, { variant: "bodyMd", as: "p", children: [
            "This embedded app template uses",
            " ",
            /* @__PURE__ */ jsx5(
              LinkComponent,
              {
                url: "https://shopify.dev/docs/apps/tools/app-bridge",
                target: "_blank",
                removeUnderline: !0,
                children: "App Bridge"
              }
            ),
            " ",
            "interface examples like an",
            " ",
            /* @__PURE__ */ jsx5(LinkComponent, { url: "/app/additional", removeUnderline: !0, children: "additional page in the app nav" }),
            ", as well as an",
            " ",
            /* @__PURE__ */ jsx5(
              LinkComponent,
              {
                url: "https://shopify.dev/docs/api/admin-graphql",
                target: "_blank",
                removeUnderline: !0,
                children: "Admin GraphQL"
              }
            ),
            " ",
            "mutation demo, to provide a starting point for app development."
          ] })
        ] }),
        /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx5(TextComponent, { as: "h3", variant: "headingMd", children: "Get started with products" }),
          /* @__PURE__ */ jsx5(TextComponent, { as: "p", variant: "bodyMd", children: "Generate a product with GraphQL and get the JSON output for that product." })
        ] }),
        /* @__PURE__ */ jsxs2(InlineStack, { gap: "300", children: [
          /* @__PURE__ */ jsx5(ButtonComponent, { loading: isLoading, onClick: generateProduct, children: "Generate a product" }),
          fetcher.data?.product && /* @__PURE__ */ jsx5(
            ButtonComponent,
            {
              url: `shopify:admin/products/${productId}`,
              target: "_blank",
              variant: "plain",
              children: "View product"
            }
          )
        ] }),
        fetcher.data?.product && /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsx5(TextComponent, { as: "h3", variant: "headingMd", children: "productCreate mutation" }),
          /* @__PURE__ */ jsx5(
            BoxComponent,
            {
              padding: "400",
              background: "bg-surface-active",
              borderWidth: "025",
              borderRadius: "200",
              borderColor: "border",
              overflowX: "scroll",
              children: /* @__PURE__ */ jsx5("pre", { style: { margin: 0 }, children: /* @__PURE__ */ jsx5("code", { children: JSON.stringify(fetcher.data.product, null, 2) }) })
            }
          ),
          /* @__PURE__ */ jsx5(TextComponent, { as: "h3", variant: "headingMd", children: "productVariantsBulkUpdate mutation" }),
          /* @__PURE__ */ jsx5(
            BoxComponent,
            {
              padding: "400",
              background: "bg-surface-active",
              borderWidth: "025",
              borderRadius: "200",
              borderColor: "border",
              overflowX: "scroll",
              children: /* @__PURE__ */ jsx5("pre", { style: { margin: 0 }, children: /* @__PURE__ */ jsx5("code", { children: JSON.stringify(fetcher.data.variant, null, 2) }) })
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx5(LayoutComponent.Section, { variant: "oneThird", children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "500", children: [
        /* @__PURE__ */ jsx5(CardComponent, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx5(TextComponent, { as: "h2", variant: "headingMd", children: "App template specs" }),
          /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", children: [
              /* @__PURE__ */ jsx5(TextComponent, { as: "span", variant: "bodyMd", children: "Framework" }),
              /* @__PURE__ */ jsx5(LinkComponent, { url: "https://remix.run", target: "_blank", removeUnderline: !0, children: "Remix" })
            ] }),
            /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", children: [
              /* @__PURE__ */ jsx5(TextComponent, { as: "span", variant: "bodyMd", children: "Database" }),
              /* @__PURE__ */ jsx5(LinkComponent, { url: "https://www.prisma.io/", target: "_blank", removeUnderline: !0, children: "Prisma" })
            ] }),
            /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", children: [
              /* @__PURE__ */ jsx5(TextComponent, { as: "span", variant: "bodyMd", children: "Interface" }),
              /* @__PURE__ */ jsxs2("span", { children: [
                /* @__PURE__ */ jsx5(LinkComponent, { url: "https://polaris.shopify.com", target: "_blank", removeUnderline: !0, children: "Polaris" }),
                ", ",
                /* @__PURE__ */ jsx5(
                  LinkComponent,
                  {
                    url: "https://shopify.dev/docs/apps/tools/app-bridge",
                    target: "_blank",
                    removeUnderline: !0,
                    children: "App Bridge"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", children: [
              /* @__PURE__ */ jsx5(TextComponent, { as: "span", variant: "bodyMd", children: "API" }),
              /* @__PURE__ */ jsx5(
                LinkComponent,
                {
                  url: "https://shopify.dev/docs/api/admin-graphql",
                  target: "_blank",
                  removeUnderline: !0,
                  children: "GraphQL API"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx5(CardComponent, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx5(TextComponent, { as: "h2", variant: "headingMd", children: "Next steps" }),
          /* @__PURE__ */ jsxs2(ListComponent, { children: [
            /* @__PURE__ */ jsxs2(ListComponent.Item, { children: [
              "Build an",
              " ",
              /* @__PURE__ */ jsx5(
                LinkComponent,
                {
                  url: "https://shopify.dev/docs/apps/getting-started/build-app-example",
                  target: "_blank",
                  removeUnderline: !0,
                  children: "example app"
                }
              ),
              " ",
              "to get started"
            ] }),
            /* @__PURE__ */ jsxs2(ListComponent.Item, { children: [
              "Explore Shopify\u2019s API with",
              " ",
              /* @__PURE__ */ jsx5(
                LinkComponent,
                {
                  url: "https://shopify.dev/docs/apps/tools/graphiql-admin-api",
                  target: "_blank",
                  removeUnderline: !0,
                  children: "GraphiQL"
                }
              )
            ] })
          ] })
        ] }) })
      ] }) })
    ] }) })
  ] });
}

// app/routes/apps.aloha.hello.jsx
var apps_aloha_hello_exports = {};
__export(apps_aloha_hello_exports, {
  loader: () => loader5
});
import { json as json2 } from "@remix-run/node";
async function loader5() {
  return json2({ message: "Proxy connected th\xC3\u0192\xC6\u2019\xC3\u201A\xC2\xA0nh c\xC3\u0192\xC6\u2019\xC3\u201A\xC2\xB4ng \xC3\u0192\xC2\xB0\xC3\u2026\xC2\xB8\xC3\u2026\xC2\xA1\xC3\xA2\xE2\u20AC\u0161\xC2\xAC" });
}

// app/routes/app.additional.jsx
var app_additional_exports = {};
__export(app_additional_exports, {
  default: () => AdditionalPage
});
import {
  Box as Box2,
  Card as Card2,
  Layout as Layout2,
  Link as Link2,
  List as List2,
  Page as Page2,
  Text as Text2,
  LegacyStack as BlockStack2
} from "@shopify/polaris";
import AppBridgePkg3 from "@shopify/app-bridge-react";
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var AppBridge3 = AppBridgePkg3 && (AppBridgePkg3.default || AppBridgePkg3) || {}, { TitleBar: TitleBar2, useAppBridge: useAppBridge2 } = AppBridge3;
function AdditionalPage() {
  return /* @__PURE__ */ jsxs3(Page2, { children: [
    /* @__PURE__ */ jsx6(TitleBar2, { title: "Additional page" }),
    /* @__PURE__ */ jsxs3(Layout2, { children: [
      /* @__PURE__ */ jsx6(Layout2.Section, { children: /* @__PURE__ */ jsx6(Card2, { children: /* @__PURE__ */ jsxs3(BlockStack2, { gap: "3rem", children: [
        /* @__PURE__ */ jsxs3(Text2, { as: "p", variant: "bodyMd", children: [
          "The app template comes with an additional page which demonstrates how to create multiple pages within app navigation using",
          " ",
          /* @__PURE__ */ jsx6(
            Link2,
            {
              url: "https://shopify.dev/docs/apps/tools/app-bridge",
              target: "_blank",
              removeUnderline: !0,
              children: "App Bridge"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsxs3(Text2, { as: "p", variant: "bodyMd", children: [
          "To create your own page and have it show up in the app navigation, add a page inside ",
          /* @__PURE__ */ jsx6(Code, { children: "app/routes" }),
          ", and a link to it in the ",
          /* @__PURE__ */ jsx6(Code, { children: "<NavMenu>" }),
          " component found in ",
          /* @__PURE__ */ jsx6(Code, { children: "app/routes/app.jsx" }),
          "."
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx6(Layout2.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx6(Card2, { children: /* @__PURE__ */ jsxs3(BlockStack2, { gap: "2rem", children: [
        /* @__PURE__ */ jsx6(Text2, { as: "h2", variant: "headingMd", children: "Resources" }),
        /* @__PURE__ */ jsx6(List2, { children: /* @__PURE__ */ jsx6(List2.Item, { children: /* @__PURE__ */ jsx6(
          Link2,
          {
            url: "https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav",
            target: "_blank",
            removeUnderline: !0,
            children: "App nav best practices"
          }
        ) }) })
      ] }) }) })
    ] })
  ] });
}
function Code({ children }) {
  return /* @__PURE__ */ jsx6(
    Box2,
    {
      as: "span",
      padding: "0.25rem",
      paddingInlineStart: "1rem",
      paddingInlineEnd: "1rem",
      background: "bg-surface-active",
      borderWidth: "0.25rem",
      borderColor: "border",
      borderRadius: "1rem",
      children: /* @__PURE__ */ jsx6("code", { children })
    }
  );
}

// app/routes/api.onboard.jsx
var api_onboard_exports = {};
__export(api_onboard_exports, {
  action: () => action4,
  loader: () => loader6
});
import { json as json3 } from "@remix-run/node";

// app/lib/prisma.server.js
import { PrismaClient as PrismaClient2 } from "@prisma/client";
var prisma2;
global.prisma ? prisma2 = global.prisma : prisma2 = new PrismaClient2();

// app/routes/api.onboard.jsx
var action4 = async ({ request }) => {
  try {
    let contentType = request.headers.get("content-type") || "", body;
    if (contentType.includes("application/json"))
      body = await request.json();
    else {
      let text = await request.text();
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        return json3({ ok: !1, error: "Invalid JSON body" }, { status: 400 });
      }
    }
    if (!body || typeof body != "object")
      return json3({ ok: !1, error: "Invalid request body" }, { status: 400 });
    let { email, name, phone, payload } = body;
    if (!email || typeof email != "string")
      return json3({ ok: !1, error: "Missing required field: email" }, { status: 400 });
    let safePayload = payload ?? {}, created = await prisma2.onboard.create({
      data: {
        email,
        name: name ?? null,
        phone: phone ?? null,
        payload: safePayload
      }
    });
    return json3({ ok: !0, data: created }, { status: 201 });
  } catch (err) {
    return console.error("api.onboard error:", err), json3(
      {
        ok: !1,
        error: err && err.message || String(err)
      },
      { status: 500 }
    );
  }
}, loader6 = async () => json3({ ok: !1, error: "GET not allowed" }, { status: 405 });

// app/routes/auth.$.jsx
var auth_exports = {};
__export(auth_exports, {
  loader: () => loader7
});
var loader7 = async ({ request }) => (await authenticate.admin(request), null);

// app/routes/hello.jsx
var hello_exports = {};
__export(hello_exports, {
  loader: () => loader8
});
import { json as json4 } from "@remix-run/node";
async function loader8() {
  return json4({ message: "Proxy connected th\xC3\u0192\xC6\u2019\xC3\u201A\xC2\xA0nh c\xC3\u0192\xC6\u2019\xC3\u201A\xC2\xB4ng \xC3\u0192\xC2\xB0\xC3\u2026\xC2\xB8\xC3\u2026\xC2\xA1\xC3\xA2\xE2\u20AC\u0161\xC2\xAC (via /hello)" });
}

// app/routes/index.jsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index3
});
import "react";
import { jsx as jsx7 } from "react/jsx-runtime";
function Index3() {
  return /* @__PURE__ */ jsx7(AppProviderFix, { children: /* @__PURE__ */ jsx7("div", { children: "Hello Shopify/Remix" }) });
}

// app/routes/auth/index.jsx
var auth_exports2 = {};
__export(auth_exports2, {
  loader: () => loader9
});
import { redirect as redirect2 } from "@remix-run/node";
var SCOPES = ["read_products", "write_products"].join(","), loader9 = async ({ request }) => {
  let shop = new URL(request.url).searchParams.get("shop");
  if (!shop)
    throw console.warn("[auth] Missing shop param"), new Response("Missing shop", { status: 400 });
  let clientId = process.env.SHOPIFY_API_KEY, appUrl = process.env.SHOPIFY_APP_URL;
  if (!clientId || !appUrl)
    throw console.error("[auth] Missing SHOPIFY_API_KEY or SHOPIFY_APP_URL env vars"), new Response("Server misconfigured", { status: 500 });
  let state = Math.random().toString(36).substring(2, 12), params = new URLSearchParams({
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: `${appUrl.replace(/\/+$/, "")}/auth/callback`,
    state
  }), redirectUrl = `https://${encodeURIComponent(shop)}/admin/oauth/authorize?${params.toString()}`;
  return console.log("[auth] Redirecting to:", redirectUrl), redirect2(redirectUrl);
};

// app/routes/App.js
var App_exports = {};
import "react";
import AppBridgePkg4 from "@shopify/app-bridge-react";
import ReactDOM from "react-dom/client";
import { AppProvider as AppProvider2 } from "@shopify/polaris";

// app/routes/APP.tsx
var APP_exports = {};
__export(APP_exports, {
  default: () => APP_default
});
import { Routes, Route } from "react-router-dom";

// app/routes/pages/Home.jsx
import "react";
import { jsx as jsx8 } from "react/jsx-runtime";
function Home() {
  return /* @__PURE__ */ jsx8("h1", { children: "Trang ch?" });
}

// app/routes/pages/About.jsx
import "react";
import { jsx as jsx9 } from "react/jsx-runtime";
function About() {
  return /* @__PURE__ */ jsx9("h1", { children: "Gi?i thi?u" });
}

// app/routes/APP.tsx
import { jsx as jsx10, jsxs as jsxs4 } from "react/jsx-runtime";
function App2() {
  return /* @__PURE__ */ jsxs4(Routes, { children: [
    /* @__PURE__ */ jsx10(Route, { path: "/", element: /* @__PURE__ */ jsx10(Home, {}) }),
    /* @__PURE__ */ jsx10(Route, { path: "/about", element: /* @__PURE__ */ jsx10(About, {}) })
  ] });
}
var APP_default = App2;

// app/routes/App.js
import { jsx as jsx11 } from "react/jsx-runtime";
var AppBridge4 = AppBridgePkg4 && (AppBridgePkg4.default || AppBridgePkg4) || {}, AppBridgeProvider2 = AppBridge4.Provider || AppBridge4.AppBridgeProvider || null, appBridgeConfig = {
  apiKey: process.env.SHOPIFY_API_KEY || "YOUR_SHOPIFY_API_KEY",
  host: typeof window < "u" ? new URL(window.location.href).searchParams.get("host") : void 0,
  forceRedirect: !0
};
typeof document < "u" && ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx11(AppBridgeProvider2, { config: appBridgeConfig, children: /* @__PURE__ */ jsx11(AppProvider2, { children: /* @__PURE__ */ jsx11(APP_default, {}) }) })
);

// app/routes/app.jsx
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
import "react";
import { Routes as Routes2, Route as Route2 } from "react-router-dom";
import { jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
function App3() {
  return /* @__PURE__ */ jsxs5(Routes2, { children: [
    /* @__PURE__ */ jsx12(Route2, { path: "/", element: /* @__PURE__ */ jsx12(Home, {}) }),
    /* @__PURE__ */ jsx12(Route2, { path: "/about", element: /* @__PURE__ */ jsx12(About, {}) })
  ] });
}
var app_default = App3;

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-AQOCU4AD.js", imports: ["/build/_shared/chunk-MM6RIWIG.js", "/build/_shared/chunk-GYVT37HV.js", "/build/_shared/chunk-GG4UNW5U.js", "/build/_shared/chunk-T36URGAI.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-RG27LYFS.js", imports: ["/build/_shared/chunk-4HSYEZMB.js", "/build/_shared/chunk-7RE53EFL.js", "/build/_shared/chunk-TMBLX4WT.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/APP": { id: "routes/APP", parentId: "root", path: "APP", index: void 0, caseSensitive: void 0, module: "/build/routes/APP-ZCVGM7AW.js", imports: ["/build/_shared/chunk-SUXPERPJ.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/App": { id: "routes/App", parentId: "root", path: "App", index: void 0, caseSensitive: void 0, module: "/build/routes/App-V2D3BGIK.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index_disabled_folder": { id: "routes/_index_disabled_folder", parentId: "root", path: void 0, index: void 0, caseSensitive: void 0, module: "/build/routes/_index_disabled_folder-WKOZEHS6.js", imports: ["/build/_shared/chunk-APMKZHLR.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.onboard": { id: "routes/api.onboard", parentId: "root", path: "api/onboard", index: void 0, caseSensitive: void 0, module: "/build/routes/api.onboard-QMWISNKO.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app": { id: "routes/app", parentId: "root", path: "app", index: void 0, caseSensitive: void 0, module: "/build/routes/app-EHUM5LGC.js", imports: ["/build/_shared/chunk-SUXPERPJ.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app._index.disabled": { id: "routes/app._index.disabled", parentId: "routes/app", path: "disabled", index: void 0, caseSensitive: void 0, module: "/build/routes/app._index.disabled-FM4WWNUJ.js", imports: ["/build/_shared/chunk-APMKZHLR.js", "/build/_shared/chunk-TMBLX4WT.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.additional": { id: "routes/app.additional", parentId: "routes/app", path: "additional", index: void 0, caseSensitive: void 0, module: "/build/routes/app.additional-TYN54HLC.js", imports: ["/build/_shared/chunk-TMBLX4WT.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/apps.aloha.hello": { id: "routes/apps.aloha.hello", parentId: "root", path: "apps/aloha/hello", index: void 0, caseSensitive: void 0, module: "/build/routes/apps.aloha.hello-4P5U6DWX.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-I6R4U6NZ.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.$": { id: "routes/auth.$", parentId: "routes/auth", path: "*", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.$-VAPOWZNP.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/hello": { id: "routes/hello", parentId: "root", path: "hello", index: void 0, caseSensitive: void 0, module: "/build/routes/hello-5EJML3C5.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: "index", index: void 0, caseSensitive: void 0, module: "/build/routes/index-M7LQ3YR2.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks.app.scopes_update": { id: "routes/webhooks.app.scopes_update", parentId: "root", path: "webhooks/app/scopes_update", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks.app.scopes_update-5K5S4UAG.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks.app.uninstalled": { id: "routes/webhooks.app.uninstalled", parentId: "root", path: "webhooks/app/uninstalled", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks.app.uninstalled-LGE7I4KN.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "55643fa4", hmr: void 0, url: "/build/manifest-55643FA4.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/webhooks.app.scopes_update": {
    id: "routes/webhooks.app.scopes_update",
    parentId: "root",
    path: "webhooks/app/scopes_update",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_app_scopes_update_exports
  },
  "routes/webhooks.app.uninstalled": {
    id: "routes/webhooks.app.uninstalled",
    parentId: "root",
    path: "webhooks/app/uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_app_uninstalled_exports
  },
  "routes/_index_disabled_folder": {
    id: "routes/_index_disabled_folder",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route_exports
  },
  "routes/app._index.disabled": {
    id: "routes/app._index.disabled",
    parentId: "routes/app",
    path: "disabled",
    index: void 0,
    caseSensitive: void 0,
    module: app_index_disabled_exports
  },
  "routes/apps.aloha.hello": {
    id: "routes/apps.aloha.hello",
    parentId: "root",
    path: "apps/aloha/hello",
    index: void 0,
    caseSensitive: void 0,
    module: apps_aloha_hello_exports
  },
  "routes/app.additional": {
    id: "routes/app.additional",
    parentId: "routes/app",
    path: "additional",
    index: void 0,
    caseSensitive: void 0,
    module: app_additional_exports
  },
  "routes/api.onboard": {
    id: "routes/api.onboard",
    parentId: "root",
    path: "api/onboard",
    index: void 0,
    caseSensitive: void 0,
    module: api_onboard_exports
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "routes/auth",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/hello": {
    id: "routes/hello",
    parentId: "root",
    path: "hello",
    index: void 0,
    caseSensitive: void 0,
    module: hello_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: "index",
    index: void 0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports2
  },
  "routes/App": {
    id: "routes/App",
    parentId: "root",
    path: "App",
    index: void 0,
    caseSensitive: void 0,
    module: App_exports
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  },
  "routes/APP": {
    id: "routes/APP",
    parentId: "root",
    path: "APP",
    index: void 0,
    caseSensitive: void 0,
    module: APP_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
