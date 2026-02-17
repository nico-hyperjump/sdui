import "dotenv/config";
import { createSduiPrismaClient } from "./client";
import { buildDemoBrandScreens } from "./demo-brand-screens";
import { hashApiKey } from "./utils";

/**
 * Seeds the SDUI database with polished, demo-ready data for all three
 * brands. Designed to look great during stakeholder presentations.
 *
 * Includes:
 * - 3 brand themes with curated color palettes
 * - 6 feature flags with realistic rollout configs
 * - 12 SDUI screens (home + plans per brand, segment-specific homes)
 * - A/B tests for hero banner variants
 * - Sample analytics events to populate dashboards
 * - API keys and admin user
 */
async function main() {
  const db = createSduiPrismaClient();

  // Clear all tables in dependency order
  await db.abTestVariant.deleteMany();
  await db.abTest.deleteMany();
  await db.analyticsEvent.deleteMany();
  await db.screen.deleteMany();
  await db.featureFlag.deleteMany();
  await db.theme.deleteMany();
  await db.apiKey.deleteMany();
  await db.adminUser.deleteMany();

  console.log("  Cleared existing data.");

  // ---------------------------------------------------------------------------
  // Themes — curated palettes per brand identity
  // ---------------------------------------------------------------------------
  await db.theme.createMany({
    data: [
      {
        brand: "brand_a",
        colors: JSON.stringify({
          primary: "#0A1F44",
          secondary: "#F0EFEB",
          accent: "#D4A843",
          background: "#FFFFFF",
          text: "#1A1A2E",
        }),
        typography: JSON.stringify({
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        }),
        assets: JSON.stringify({
          logo: "https://placehold.co/200x60/0A1F44/D4A843?text=XL+Premium",
          appIcon: "https://placehold.co/512x512/0A1F44/D4A843?text=XL",
        }),
      },
      {
        brand: "brand_b",
        colors: JSON.stringify({
          primary: "#6C2BD9",
          secondary: "#F3EAFF",
          accent: "#00D26A",
          background: "#FFFFFF",
          text: "#1B1340",
        }),
        typography: JSON.stringify({
          fontFamily: "Poppins",
          headingWeight: "800",
          bodyWeight: "400",
        }),
        assets: JSON.stringify({
          logo: "https://placehold.co/200x60/6C2BD9/00D26A?text=XL+Go",
          appIcon: "https://placehold.co/512x512/6C2BD9/00D26A?text=Go",
        }),
      },
      {
        brand: "brand_c",
        colors: JSON.stringify({
          primary: "#E8522F",
          secondary: "#FFF5F0",
          accent: "#2EC4B6",
          background: "#FFFFFF",
          text: "#2D2D2D",
        }),
        typography: JSON.stringify({
          fontFamily: "Nunito",
          headingWeight: "700",
          bodyWeight: "400",
        }),
        assets: JSON.stringify({
          logo: "https://placehold.co/200x60/E8522F/FFFFFF?text=XL+Smart",
          appIcon: "https://placehold.co/512x512/E8522F/FFFFFF?text=Smart",
        }),
      },
      {
        brand: "brand_demo",
        colors: JSON.stringify({
          primary: "#1B2838",
          secondary: "#E8EDF2",
          accent: "#FF6B6B",
          background: "#FFFFFF",
          text: "#1B2838",
        }),
        typography: JSON.stringify({
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        }),
        assets: JSON.stringify({
          logo: "https://placehold.co/200x60/1B2838/FF6B6B?text=Showcase",
          appIcon: "https://placehold.co/512x512/1B2838/FF6B6B?text=Demo",
        }),
      },
    ],
  });
  console.log("  Seeded 4 themes.");

  // ---------------------------------------------------------------------------
  // Feature Flags
  // ---------------------------------------------------------------------------
  await db.featureFlag.createMany({
    data: [
      {
        key: "esim_support",
        description: "Enable eSIM activation and management",
        brandA: true,
        brandB: false,
        brandC: false,
        rolloutPercentage: 100,
      },
      {
        key: "chat_support",
        description: "Enable in-app live chat with support agents",
        brandA: true,
        brandB: true,
        brandC: true,
        rolloutPercentage: 100,
      },
      {
        key: "biometric_login",
        description: "Enable Face ID / fingerprint authentication",
        brandA: true,
        brandB: true,
        brandC: false,
        rolloutPercentage: 75,
      },
      {
        key: "dark_mode",
        description: "Enable dark mode theme toggle",
        brandA: true,
        brandB: true,
        brandC: true,
        rolloutPercentage: 100,
      },
      {
        key: "rewards_program",
        description: "Enable loyalty rewards and points system",
        brandA: true,
        brandB: true,
        brandC: false,
        rolloutPercentage: 100,
      },
      {
        key: "data_gifting",
        description: "Allow users to gift data to other users",
        brandA: false,
        brandB: true,
        brandC: true,
        rolloutPercentage: 50,
      },
    ],
  });
  console.log("  Seeded 6 feature flags.");

  // ---------------------------------------------------------------------------
  // Helper — stable placeholder images via picsum.photos
  // ---------------------------------------------------------------------------
  const img = (seed: string, w: number, h: number) =>
    `https://picsum.photos/seed/${seed}/${w}/${h}`;

  // ---------------------------------------------------------------------------
  // SCREENS
  // ---------------------------------------------------------------------------
  const screens = [
    // =========================================================================
    //  HOME — Brand A (XL Premium · navy/gold · enterprise)
    //  Uses data sources: account (user info) + marketing (dynamic offers)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_a",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 3 } },
      ]),
      components: JSON.stringify([
        // — Personalised greeting from account-source ————————————————————
        {
          id: "a_greeting",
          type: "text",
          props: {
            content: "Welcome back, {{account.name}}",
            variant: "heading",
          },
        },
        { id: "a_s0", type: "spacer", props: { height: 4 } },
        // — Account summary card from account-source —————————————————————
        {
          id: "a_account_card",
          type: "card",
          children: [
            {
              id: "a_plan_text",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
              },
            },
            { id: "a_card_s1", type: "spacer", props: { height: 4 } },
            {
              id: "a_data_text",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
            { id: "a_card_s2", type: "spacer", props: { height: 4 } },
            {
              id: "a_balance_text",
              type: "text",
              props: {
                content: "Balance: {{account.currency}} {{account.balance}}",
              },
            },
          ],
        },
        { id: "a_s1", type: "spacer", props: { height: 16 } },
        // — Hero banner (static) ————————————————————————————————————————
        {
          id: "a_hero",
          type: "hero_banner",
          props: {
            title: "Indonesia's #1 5G Network",
            subtitle:
              "Now live in 200+ cities — experience ultra-fast connectivity",
            imageUri: img("premium5g", 800, 400),
          },
          action: { type: "navigate", screen: "plans" },
          analytics: { impression: "hero_viewed", click: "hero_cta" },
        },
        { id: "a_s2", type: "spacer", props: { height: 8 } },
        {
          id: "a_hero_btn",
          type: "button",
          props: { label: "Explore 5G Plans" },
          action: { type: "show_overlay", overlayId: "a_5g_details" },
        },
        { id: "a_s3", type: "spacer", props: { height: 24 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "a_actions_lbl",
          type: "text",
          props: { content: "Quick Actions", variant: "heading" },
        },
        { id: "a_s4", type: "spacer", props: { height: 8 } },
        {
          id: "a_actions",
          type: "action_grid",
          children: [
            {
              id: "a_act_usage",
              type: "action_card",
              props: { title: "My Usage" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "a_act_bill",
              type: "action_card",
              props: { title: "Pay Bill" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "a_act_esim",
              type: "action_card",
              props: { title: "eSIM Setup" },
              action: { type: "navigate", screen: "settings" },
            },
            {
              id: "a_act_support",
              type: "action_card",
              props: { title: "24/7 Support" },
              action: { type: "navigate", screen: "settings" },
            },
          ],
        },
        { id: "a_s5", type: "spacer", props: { height: 24 } },
        // — Dynamic offers from marketing-source (repeat) ———————————————
        {
          id: "a_promo_lbl",
          type: "text",
          props: { content: "Recommended for You", variant: "heading" },
        },
        { id: "a_s6", type: "spacer", props: { height: 8 } },
        {
          id: "a_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
          analytics: {
            impression: "offer_viewed",
            click: "offer_tap",
          },
        },
        { id: "a_s7", type: "spacer", props: { height: 24 } },
        // — Latest updates (static) ————————————————————————————————————
        {
          id: "a_news_lbl",
          type: "text",
          props: { content: "Latest Updates", variant: "heading" },
        },
        { id: "a_s8", type: "spacer", props: { height: 8 } },
        {
          id: "a_news1",
          type: "list_item",
          props: {
            title: "5G expansion to Surabaya & Bandung",
            subtitle: "15 new towers activated this week",
          },
        },
        {
          id: "a_news2",
          type: "list_item",
          props: {
            title: "Earn 2x loyalty points this month",
            subtitle: "Limited time offer — valid through March 31",
          },
        },
        {
          id: "a_news3",
          type: "list_item",
          props: {
            title: "Scheduled maintenance",
            subtitle: "Feb 22, 2:00 AM — 4:00 AM WIB · Minimal impact expected",
          },
        },
        { id: "a_s9", type: "spacer", props: { height: 16 } },
        {
          id: "a_help_link",
          type: "link",
          props: { label: "Need help? Visit our support center →" },
          action: { type: "navigate", screen: "settings" },
        },
        { id: "a_s10", type: "spacer", props: { height: 24 } },
      ]),
      // -- Overlays: showcase on_load + manual trigger ----------------------
      overlays: JSON.stringify([
        {
          id: "a_welcome_offer",
          style: "bottom_sheet",
          dismissible: true,
          trigger: { type: "on_load" },
          dismissAfterMs: 8000,
          components: [
            {
              id: "a_ov_welcome_title",
              type: "text",
              props: { content: "Limited-Time Offer", variant: "heading" },
            },
            { id: "a_ov_ws1", type: "spacer", props: { height: 8 } },
            {
              id: "a_ov_welcome_desc",
              type: "text",
              props: {
                content:
                  "Upgrade to Business Elite today and get 3 months of international roaming FREE. Offer ends March 31.",
              },
            },
            { id: "a_ov_ws2", type: "spacer", props: { height: 12 } },
            {
              id: "a_ov_welcome_btn",
              type: "button",
              props: { label: "View Upgrade Plans" },
              action: { type: "navigate", screen: "plans" },
            },
            { id: "a_ov_ws3", type: "spacer", props: { height: 8 } },
            {
              id: "a_ov_welcome_dismiss",
              type: "link",
              props: { label: "Maybe later" },
              action: { type: "dismiss_overlay" },
            },
          ],
        },
        {
          id: "a_5g_details",
          style: "modal",
          dismissible: true,
          trigger: { type: "manual" },
          components: [
            {
              id: "a_ov_5g_title",
              type: "text",
              props: { content: "5G Network Coverage", variant: "heading" },
            },
            { id: "a_ov_5s1", type: "spacer", props: { height: 8 } },
            {
              id: "a_ov_5g_desc",
              type: "text",
              props: {
                content:
                  "Our 5G network is now live in 200+ cities across Indonesia including Jakarta, Surabaya, Bandung, Medan, and Makassar. Experience download speeds up to 1 Gbps.",
              },
            },
            { id: "a_ov_5s2", type: "spacer", props: { height: 12 } },
            {
              id: "a_ov_5g_plans_btn",
              type: "button",
              props: { label: "See 5G Plans" },
              action: { type: "navigate", screen: "plans" },
            },
            { id: "a_ov_5s3", type: "spacer", props: { height: 8 } },
            {
              id: "a_ov_5g_close",
              type: "link",
              props: { label: "Close" },
              action: { type: "dismiss_overlay", overlayId: "a_5g_details" },
            },
          ],
        },
      ]),
    },

    // =========================================================================
    //  HOME — Brand A — Postpaid segment
    //  Uses data sources: account (usage summary) + marketing (upgrade offers)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_a",
      segment: "postpaid",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 2 } },
      ]),
      components: JSON.stringify([
        {
          id: "a_post_hero",
          type: "hero_banner",
          props: {
            title: "Your Enterprise Dashboard",
            subtitle: "Manage your team's connectivity in one place",
            imageUri: img("corporateoffice", 800, 400),
          },
          analytics: { impression: "hero_postpaid_viewed" },
        },
        { id: "a_post_s1", type: "spacer", props: { height: 8 } },
        {
          id: "a_post_btn",
          type: "button",
          props: { label: "View Team Usage" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "a_post_s2", type: "spacer", props: { height: 24 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "a_post_actions_lbl",
          type: "text",
          props: { content: "Quick Actions", variant: "heading" },
        },
        { id: "a_post_s3", type: "spacer", props: { height: 8 } },
        {
          id: "a_post_actions",
          type: "action_grid",
          children: [
            {
              id: "a_post_act_bill",
              type: "action_card",
              props: { title: "Pay Bill" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "a_post_act_usage",
              type: "action_card",
              props: { title: "Team Usage" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "a_post_act_add",
              type: "action_card",
              props: { title: "Add Lines" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "a_post_act_esim",
              type: "action_card",
              props: { title: "eSIM Mgmt" },
              action: { type: "navigate", screen: "settings" },
            },
          ],
        },
        { id: "a_post_s4", type: "spacer", props: { height: 24 } },
        // — Account summary from account-source ——————————————————————————
        {
          id: "a_post_summary_lbl",
          type: "text",
          props: { content: "This Month's Summary", variant: "heading" },
        },
        { id: "a_post_s5", type: "spacer", props: { height: 8 } },
        {
          id: "a_post_card",
          type: "card",
          children: [
            {
              id: "a_post_plan_lbl",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
                variant: "heading",
              },
            },
            { id: "a_post_card_s1", type: "spacer", props: { height: 8 } },
            {
              id: "a_post_data_lbl",
              type: "text",
              props: {
                content:
                  "Data Used: {{account.dataUsedGb}} GB of {{account.dataLimitGb}} GB",
              },
            },
            { id: "a_post_card_s2", type: "spacer", props: { height: 8 } },
            {
              id: "a_post_bill_lbl",
              type: "text",
              props: {
                content: "Balance: {{account.currency}} {{account.balance}}",
              },
            },
          ],
        },
        { id: "a_post_s6", type: "spacer", props: { height: 24 } },
        // — Dynamic upgrade offers from marketing-source (repeat) ————————
        {
          id: "a_post_upgrade_lbl",
          type: "text",
          props: { content: "Upgrade Opportunities", variant: "heading" },
        },
        { id: "a_post_s7", type: "spacer", props: { height: 8 } },
        {
          id: "a_post_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "a_post_s8", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  HOME — Brand A — Prepaid segment
    //  Uses data sources: account (balance info) + marketing (top-up deals)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_a",
      segment: "prepaid",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 2 } },
      ]),
      components: JSON.stringify([
        {
          id: "a_pre_hero",
          type: "hero_banner",
          props: {
            title: "Top Up & Stay Connected",
            subtitle: "Premium quality, pay as you go",
            imageUri: img("premiumcity", 800, 400),
          },
          action: { type: "navigate", screen: "account" },
          analytics: { impression: "hero_prepaid_viewed" },
        },
        { id: "a_pre_s1", type: "spacer", props: { height: 8 } },
        {
          id: "a_pre_btn",
          type: "button",
          props: { label: "Top Up Now" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "a_pre_s2", type: "spacer", props: { height: 24 } },
        // — Dynamic balance from account-source ——————————————————————————
        {
          id: "a_pre_balance_lbl",
          type: "text",
          props: { content: "Your Balance", variant: "heading" },
        },
        { id: "a_pre_s3", type: "spacer", props: { height: 8 } },
        {
          id: "a_pre_balance_card",
          type: "card",
          children: [
            {
              id: "a_pre_bal_text",
              type: "text",
              props: {
                content: "{{account.currency}} {{account.balance}}",
                variant: "heading",
              },
            },
            { id: "a_pre_bal_s1", type: "spacer", props: { height: 4 } },
            {
              id: "a_pre_plan_text",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
              },
            },
            { id: "a_pre_bal_s2", type: "spacer", props: { height: 4 } },
            {
              id: "a_pre_data_text",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
          ],
        },
        { id: "a_pre_s4", type: "spacer", props: { height: 24 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "a_pre_actions_lbl",
          type: "text",
          props: { content: "Quick Actions", variant: "heading" },
        },
        { id: "a_pre_s5", type: "spacer", props: { height: 8 } },
        {
          id: "a_pre_actions",
          type: "action_grid",
          children: [
            {
              id: "a_pre_act_topup",
              type: "action_card",
              props: { title: "Top Up" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "a_pre_act_data",
              type: "action_card",
              props: { title: "Buy Data" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "a_pre_act_history",
              type: "action_card",
              props: { title: "History" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "a_pre_act_convert",
              type: "action_card",
              props: { title: "Go Postpaid" },
              action: { type: "navigate", screen: "plans" },
            },
          ],
        },
        { id: "a_pre_s6", type: "spacer", props: { height: 24 } },
        // — Dynamic top-up deals from marketing-source (repeat) ——————————
        {
          id: "a_pre_offers_lbl",
          type: "text",
          props: { content: "Top Up Deals", variant: "heading" },
        },
        { id: "a_pre_s7", type: "spacer", props: { height: 8 } },
        {
          id: "a_pre_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "a_pre_s8", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  HOME — Brand B (XL Go · purple/green · youth)
    //  Uses data sources: account (user greeting) + marketing (hot deals)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_b",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 3 } },
      ]),
      components: JSON.stringify([
        // — Personalised greeting from account-source ————————————————————
        {
          id: "b_greeting",
          type: "text",
          props: {
            content: "Hey {{account.name}}! 👋",
            variant: "heading",
          },
        },
        { id: "b_s0", type: "spacer", props: { height: 4 } },
        {
          id: "b_account_summary",
          type: "text",
          props: {
            content:
              "{{account.planName}} · {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
          },
        },
        { id: "b_s0b", type: "spacer", props: { height: 16 } },
        // — Hero banner (static) ————————————————————————————————————————
        {
          id: "b_hero",
          type: "hero_banner",
          props: {
            title: "Unlimited Social & Streaming",
            subtitle: "Scroll, stream, and share — zero limits 🎉",
            imageUri: img("youthsocial", 800, 400),
          },
          action: { type: "navigate", screen: "plans" },
          analytics: { impression: "hero_viewed", click: "hero_cta" },
        },
        { id: "b_s1", type: "spacer", props: { height: 8 } },
        {
          id: "b_hero_btn",
          type: "button",
          props: { label: "Get Unlimited Now" },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "b_s2", type: "spacer", props: { height: 20 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "b_actions",
          type: "action_grid",
          children: [
            {
              id: "b_act_topup",
              type: "action_card",
              props: { title: "Top Up" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "b_act_data",
              type: "action_card",
              props: { title: "My Data" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "b_act_rewards",
              type: "action_card",
              props: { title: "Rewards" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "b_act_invite",
              type: "action_card",
              props: { title: "Invite & Earn" },
              action: { type: "navigate", screen: "settings" },
            },
          ],
        },
        { id: "b_s3", type: "spacer", props: { height: 24 } },
        // — Dynamic hot deals from marketing-source (repeat) ————————————
        {
          id: "b_deals_lbl",
          type: "text",
          props: { content: "Hot Deals 🔥", variant: "heading" },
        },
        { id: "b_s4", type: "spacer", props: { height: 8 } },
        {
          id: "b_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
          analytics: {
            impression: "deal_viewed",
            click: "deal_tap",
          },
        },
        { id: "b_s5", type: "spacer", props: { height: 24 } },
        // — Trending (static) ——————————————————————————————————————————
        {
          id: "b_trending_lbl",
          type: "text",
          props: { content: "Trending Now ✨", variant: "heading" },
        },
        { id: "b_s6", type: "spacer", props: { height: 8 } },
        {
          id: "b_trend1",
          type: "list_item",
          props: {
            title: "TikTok data-free streaming",
            subtitle: "Now included with all Go plans — no extra charge",
          },
        },
        {
          id: "b_trend2",
          type: "list_item",
          props: {
            title: "Refer a friend, get 5 GB free",
            subtitle: "No limit on referrals — share and earn",
          },
        },
        {
          id: "b_trend3",
          type: "list_item",
          props: {
            title: "Discord Nitro included with Go Gamer",
            subtitle: "Free for 3 months with any gaming plan",
          },
        },
        {
          id: "b_trend4",
          type: "list_item",
          props: {
            title: "Free data this weekend",
            subtitle: "Unlimited data Saturday & Sunday — auto-activated",
          },
        },
        { id: "b_s7", type: "spacer", props: { height: 16 } },
        {
          id: "b_invite_link",
          type: "link",
          props: { label: "Share XL Go with friends and earn rewards →" },
          action: { type: "navigate", screen: "settings" },
        },
        { id: "b_s8", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  HOME — Brand B — Prepaid segment
    //  Uses data sources: account (balance info) + marketing (top-up deals)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_b",
      segment: "prepaid",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 2 } },
      ]),
      components: JSON.stringify([
        {
          id: "b_pre_hero",
          type: "hero_banner",
          props: {
            title: "Stay Online, Stay Connected",
            subtitle: "Top up once, scroll all month",
            imageUri: img("youngphone", 800, 400),
          },
          action: { type: "navigate", screen: "plans" },
          analytics: { impression: "hero_prepaid_viewed" },
        },
        { id: "b_pre_s1", type: "spacer", props: { height: 8 } },
        {
          id: "b_pre_btn",
          type: "button",
          props: { label: "Top Up Now" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "b_pre_s2", type: "spacer", props: { height: 20 } },
        // — Dynamic balance from account-source ——————————————————————————
        {
          id: "b_pre_balance_lbl",
          type: "text",
          props: { content: "Your Balance", variant: "heading" },
        },
        { id: "b_pre_s3", type: "spacer", props: { height: 8 } },
        {
          id: "b_pre_card",
          type: "card",
          children: [
            {
              id: "b_pre_bal",
              type: "text",
              props: {
                content: "{{account.currency}} {{account.balance}}",
                variant: "heading",
              },
            },
            { id: "b_pre_card_s1", type: "spacer", props: { height: 4 } },
            {
              id: "b_pre_plan",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
              },
            },
            { id: "b_pre_card_s2", type: "spacer", props: { height: 4 } },
            {
              id: "b_pre_data",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
          ],
        },
        { id: "b_pre_s4", type: "spacer", props: { height: 20 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "b_pre_actions",
          type: "action_grid",
          children: [
            {
              id: "b_pre_act_topup",
              type: "action_card",
              props: { title: "Top Up" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "b_pre_act_data",
              type: "action_card",
              props: { title: "Buy Data" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "b_pre_act_gift",
              type: "action_card",
              props: { title: "Gift Data" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "b_pre_act_rewards",
              type: "action_card",
              props: { title: "Rewards" },
              action: { type: "navigate", screen: "account" },
            },
          ],
        },
        { id: "b_pre_s5", type: "spacer", props: { height: 24 } },
        // — Dynamic top-up deals from marketing-source (repeat) ——————————
        {
          id: "b_pre_deals_lbl",
          type: "text",
          props: { content: "Top Up Deals", variant: "heading" },
        },
        { id: "b_pre_s6", type: "spacer", props: { height: 8 } },
        {
          id: "b_pre_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "b_pre_s7", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  HOME — Brand C (XL Smart · orange/teal · family value)
    //  Uses data sources: account (family info) + marketing (family offers)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_c",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 3 } },
      ]),
      components: JSON.stringify([
        // — Personalised greeting from account-source ————————————————————
        {
          id: "c_greeting",
          type: "text",
          props: {
            content: "Hi {{account.name}}, here's your family plan",
            variant: "heading",
          },
        },
        { id: "c_s0", type: "spacer", props: { height: 4 } },
        {
          id: "c_account_summary",
          type: "card",
          children: [
            {
              id: "c_plan_text",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
              },
            },
            { id: "c_card_s1", type: "spacer", props: { height: 4 } },
            {
              id: "c_data_text",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
            { id: "c_card_s2", type: "spacer", props: { height: 4 } },
            {
              id: "c_balance_text",
              type: "text",
              props: {
                content: "Balance: {{account.currency}} {{account.balance}}",
              },
            },
          ],
        },
        { id: "c_s0b", type: "spacer", props: { height: 16 } },
        // — Hero banner (static) ————————————————————————————————————————
        {
          id: "c_hero",
          type: "hero_banner",
          props: {
            title: "More for Your Family",
            subtitle: "Share data across all your lines and save up to 40%",
            imageUri: img("happyfamily", 800, 400),
          },
          action: { type: "navigate", screen: "plans" },
          analytics: { impression: "hero_viewed", click: "hero_cta" },
        },
        { id: "c_s1", type: "spacer", props: { height: 8 } },
        {
          id: "c_hero_btn",
          type: "button",
          props: { label: "View Family Plans" },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "c_s2", type: "spacer", props: { height: 20 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "c_actions",
          type: "action_grid",
          children: [
            {
              id: "c_act_usage",
              type: "action_card",
              props: { title: "Usage" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "c_act_family",
              type: "action_card",
              props: { title: "Family" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "c_act_recharge",
              type: "action_card",
              props: { title: "Recharge" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "c_act_help",
              type: "action_card",
              props: { title: "Help Center" },
              action: { type: "navigate", screen: "settings" },
            },
          ],
        },
        { id: "c_s3", type: "spacer", props: { height: 24 } },
        // — Dynamic offers from marketing-source (repeat) ———————————————
        {
          id: "c_offers_lbl",
          type: "text",
          props: { content: "Special Offers", variant: "heading" },
        },
        { id: "c_s4", type: "spacer", props: { height: 8 } },
        {
          id: "c_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
          analytics: {
            impression: "offer_viewed",
            click: "offer_tap",
          },
        },
        { id: "c_s5", type: "spacer", props: { height: 24 } },
        // — Tips & Updates (static) —————————————————————————————————————
        {
          id: "c_tips_lbl",
          type: "text",
          props: { content: "Tips & Updates", variant: "heading" },
        },
        { id: "c_s6", type: "spacer", props: { height: 8 } },
        {
          id: "c_tip1",
          type: "list_item",
          props: {
            title: "Auto-pay discount available",
            subtitle: "Save $5/mo when you enable auto-pay in Account",
          },
        },
        {
          id: "c_tip2",
          type: "list_item",
          props: {
            title: "Wi-Fi calling now supported",
            subtitle: "Enable in Settings for better indoor coverage",
          },
        },
        {
          id: "c_tip3",
          type: "list_item",
          props: {
            title: "Add a family member for just $10/mo",
            subtitle: "Share your data with up to 4 lines",
          },
        },
        { id: "c_s7", type: "spacer", props: { height: 16 } },
        {
          id: "c_help_link",
          type: "link",
          props: { label: "Need help managing your family plan? →" },
          action: { type: "navigate", screen: "settings" },
        },
        { id: "c_s8", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  HOME — Brand C — Prepaid segment
    //  Uses data sources: account (balance) + marketing (recharge deals)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_c",
      segment: "prepaid",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 2 } },
      ]),
      components: JSON.stringify([
        {
          id: "c_pre_hero",
          type: "hero_banner",
          props: {
            title: "Affordable Data for Everyone",
            subtitle: "Top up and stay connected — no contracts, no surprises",
            imageUri: img("affordablephone", 800, 400),
          },
          action: { type: "navigate", screen: "plans" },
          analytics: { impression: "hero_prepaid_viewed" },
        },
        { id: "c_pre_s1", type: "spacer", props: { height: 8 } },
        {
          id: "c_pre_btn",
          type: "button",
          props: { label: "Recharge Now" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "c_pre_s2", type: "spacer", props: { height: 20 } },
        // — Dynamic balance from account-source ——————————————————————————
        {
          id: "c_pre_balance_lbl",
          type: "text",
          props: { content: "Your Balance", variant: "heading" },
        },
        { id: "c_pre_s3", type: "spacer", props: { height: 8 } },
        {
          id: "c_pre_card",
          type: "card",
          children: [
            {
              id: "c_pre_bal",
              type: "text",
              props: {
                content: "{{account.currency}} {{account.balance}}",
                variant: "heading",
              },
            },
            { id: "c_pre_card_s1", type: "spacer", props: { height: 4 } },
            {
              id: "c_pre_plan",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
              },
            },
            { id: "c_pre_card_s2", type: "spacer", props: { height: 4 } },
            {
              id: "c_pre_data",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
          ],
        },
        { id: "c_pre_s4", type: "spacer", props: { height: 20 } },
        // — Quick actions (static) ——————————————————————————————————————
        {
          id: "c_pre_actions",
          type: "action_grid",
          children: [
            {
              id: "c_pre_act_recharge",
              type: "action_card",
              props: { title: "Recharge" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "c_pre_act_data",
              type: "action_card",
              props: { title: "Buy Data" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "c_pre_act_family",
              type: "action_card",
              props: { title: "Add Family" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "c_pre_act_help",
              type: "action_card",
              props: { title: "Help" },
              action: { type: "navigate", screen: "settings" },
            },
          ],
        },
        { id: "c_pre_s5", type: "spacer", props: { height: 24 } },
        // — Dynamic recharge deals from marketing-source (repeat) ————————
        {
          id: "c_pre_deals_lbl",
          type: "text",
          props: { content: "Recharge Deals", variant: "heading" },
        },
        { id: "c_pre_s6", type: "spacer", props: { height: 8 } },
        {
          id: "c_pre_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "c_pre_s7", type: "spacer", props: { height: 16 } },
        {
          id: "c_pre_upgrade_link",
          type: "link",
          props: { label: "Want to save more? Switch to a Family Plan →" },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "c_pre_s9", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  PLANS — Brand A (Premium · enterprise)
    // =========================================================================
    {
      screenId: "plans",
      brand: "brand_a",
      published: true,
      components: JSON.stringify([
        {
          id: "a_plans_title",
          type: "text",
          props: { content: "Premium Plans", variant: "heading" },
        },
        {
          id: "a_plans_sub",
          type: "text",
          props: { content: "Enterprise-grade connectivity for professionals" },
        },
        { id: "a_p_s1", type: "spacer", props: { height: 16 } },
        {
          id: "a_plan1",
          type: "product_card",
          props: {
            title: "Business Starter",
            price: "$59/mo",
            imageUri: img("bizstarter", 400, 180),
            badge: "Entry",
          },
        },
        { id: "a_p_s2", type: "spacer", props: { height: 4 } },
        {
          id: "a_plan1_info",
          type: "text",
          props: {
            content:
              "25 GB data • Unlimited calls • Business voicemail • 5G access",
          },
        },
        { id: "a_p_s3", type: "spacer", props: { height: 4 } },
        {
          id: "a_plan1_btn",
          type: "button",
          props: { label: "Choose Business Starter" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "a_p_s4", type: "spacer", props: { height: 16 } },
        { id: "a_p_div1", type: "divider" },
        { id: "a_p_s5", type: "spacer", props: { height: 16 } },
        {
          id: "a_plan2",
          type: "product_card",
          props: {
            title: "Business Elite",
            price: "$99/mo",
            imageUri: img("bizelite", 400, 180),
            badge: "Most Popular",
          },
        },
        { id: "a_p_s6", type: "spacer", props: { height: 4 } },
        {
          id: "a_plan2_info",
          type: "text",
          props: {
            content:
              "100 GB data • Unlimited calls • Premium support • 20 GB hotspot • Priority 5G",
          },
        },
        { id: "a_p_s7", type: "spacer", props: { height: 4 } },
        {
          id: "a_plan2_btn",
          type: "button",
          props: { label: "Choose Business Elite" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "a_p_s8", type: "spacer", props: { height: 16 } },
        { id: "a_p_div2", type: "divider" },
        { id: "a_p_s9", type: "spacer", props: { height: 16 } },
        {
          id: "a_plan3",
          type: "product_card",
          props: {
            title: "Enterprise Unlimited",
            price: "$149/mo",
            imageUri: img("enterprise", 400, 180),
            badge: "Best",
          },
        },
        { id: "a_p_s10", type: "spacer", props: { height: 4 } },
        {
          id: "a_plan3_info",
          type: "text",
          props: {
            content:
              "Unlimited data • Priority 5G • Global roaming in 80+ countries • Dedicated account manager",
          },
        },
        { id: "a_p_s11", type: "spacer", props: { height: 4 } },
        {
          id: "a_plan3_btn",
          type: "button",
          props: { label: "Choose Enterprise Unlimited" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "a_p_s12", type: "spacer", props: { height: 28 } },
        {
          id: "a_addons_lbl",
          type: "text",
          props: { content: "Add-ons", variant: "heading" },
        },
        { id: "a_p_s13", type: "spacer", props: { height: 8 } },
        {
          id: "a_addon1",
          type: "list_item",
          props: {
            title: "International Roaming",
            subtitle: "$25/mo — Data & calls in 80+ countries",
          },
        },
        {
          id: "a_addon2",
          type: "list_item",
          props: {
            title: "Cloud Storage",
            subtitle: "$10/mo — 1 TB secure business storage",
          },
        },
        {
          id: "a_addon3",
          type: "list_item",
          props: {
            title: "Device Protection",
            subtitle: "$15/mo — Accidental damage & theft coverage",
          },
        },
        {
          id: "a_addon4",
          type: "list_item",
          props: {
            title: "eSIM Management",
            subtitle: "Free — Activate and manage your eSIM from the app",
          },
        },
        { id: "a_p_s14", type: "spacer", props: { height: 16 } },
        {
          id: "a_plans_help",
          type: "link",
          props: { label: "Not sure which plan is right? Talk to our team →" },
          action: { type: "navigate", screen: "settings" },
        },
        { id: "a_p_s15", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  PLANS — Brand B (Go · youth)
    // =========================================================================
    {
      screenId: "plans",
      brand: "brand_b",
      published: true,
      components: JSON.stringify([
        {
          id: "b_plans_title",
          type: "text",
          props: { content: "Go Plans", variant: "heading" },
        },
        {
          id: "b_plans_sub",
          type: "text",
          props: {
            content: "Built for how you connect — social, gaming, streaming",
          },
        },
        { id: "b_p_s1", type: "spacer", props: { height: 16 } },
        {
          id: "b_plan1",
          type: "product_card",
          props: {
            title: "Go Social",
            price: "$19/mo",
            imageUri: img("gosocial", 400, 180),
            badge: "Starter",
          },
        },
        { id: "b_p_s2", type: "spacer", props: { height: 4 } },
        {
          id: "b_plan1_info",
          type: "text",
          props: {
            content:
              "10 GB data • Free WhatsApp, Instagram & TikTok • 100 min calls",
          },
        },
        { id: "b_p_s3", type: "spacer", props: { height: 4 } },
        {
          id: "b_plan1_btn",
          type: "button",
          props: { label: "Choose Go Social" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "b_p_s4", type: "spacer", props: { height: 16 } },
        { id: "b_p_div1", type: "divider" },
        { id: "b_p_s5", type: "spacer", props: { height: 16 } },
        {
          id: "b_plan2",
          type: "product_card",
          props: {
            title: "Go Unlimited",
            price: "$29/mo",
            imageUri: img("gounlimited", 400, 180),
            badge: "Best for Streaming",
          },
        },
        { id: "b_p_s6", type: "spacer", props: { height: 4 } },
        {
          id: "b_plan2_info",
          type: "text",
          props: {
            content:
              "Unlimited social & streaming • 30 GB hotspot • HD video • Unlimited calls",
          },
        },
        { id: "b_p_s7", type: "spacer", props: { height: 4 } },
        {
          id: "b_plan2_btn",
          type: "button",
          props: { label: "Choose Go Unlimited" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "b_p_s8", type: "spacer", props: { height: 16 } },
        { id: "b_p_div2", type: "divider" },
        { id: "b_p_s9", type: "spacer", props: { height: 16 } },
        {
          id: "b_plan3",
          type: "product_card",
          props: {
            title: "Go Gamer",
            price: "$39/mo",
            imageUri: img("gogamer", 400, 180),
            badge: "Pro",
          },
        },
        { id: "b_p_s10", type: "spacer", props: { height: 4 } },
        {
          id: "b_plan3_info",
          type: "text",
          props: {
            content:
              "50 GB priority data • Low-latency gaming mode • Free Discord Nitro • Unlimited social",
          },
        },
        { id: "b_p_s11", type: "spacer", props: { height: 4 } },
        {
          id: "b_plan3_btn",
          type: "button",
          props: { label: "Choose Go Gamer" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "b_p_s12", type: "spacer", props: { height: 28 } },
        {
          id: "b_boosters_lbl",
          type: "text",
          props: { content: "Boosters", variant: "heading" },
        },
        { id: "b_p_s13", type: "spacer", props: { height: 8 } },
        {
          id: "b_boost1",
          type: "list_item",
          props: {
            title: "Extra 10 GB Data",
            subtitle: "$8 one-time — Use anytime within 30 days",
          },
        },
        {
          id: "b_boost2",
          type: "list_item",
          props: {
            title: "Spotify Premium",
            subtitle: "$5/mo — Ad-free music streaming included",
          },
        },
        {
          id: "b_boost3",
          type: "list_item",
          props: {
            title: "International Calls",
            subtitle: "$10/mo — Unlimited calls to 30 countries",
          },
        },
        {
          id: "b_boost4",
          type: "list_item",
          props: {
            title: "Gaming VPN",
            subtitle: "$3/mo — Optimized routing for lower ping",
          },
        },
        { id: "b_p_s14", type: "spacer", props: { height: 16 } },
        {
          id: "b_plans_invite",
          type: "link",
          props: { label: "Invite friends and both get 5 GB free →" },
          action: { type: "navigate", screen: "settings" },
        },
        { id: "b_p_s15", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  PLANS — Brand C (Smart · family value)
    // =========================================================================
    {
      screenId: "plans",
      brand: "brand_c",
      published: true,
      components: JSON.stringify([
        {
          id: "c_plans_title",
          type: "text",
          props: { content: "Smart Plans", variant: "heading" },
        },
        {
          id: "c_plans_sub",
          type: "text",
          props: {
            content: "Affordable plans for the whole family — no hidden fees",
          },
        },
        { id: "c_p_s1", type: "spacer", props: { height: 16 } },
        {
          id: "c_plan1",
          type: "product_card",
          props: {
            title: "Smart Saver",
            price: "$15/mo",
            imageUri: img("saver", 400, 180),
            badge: "Budget",
          },
        },
        { id: "c_p_s2", type: "spacer", props: { height: 4 } },
        {
          id: "c_plan1_info",
          type: "text",
          props: {
            content:
              "5 GB data • Unlimited calls & SMS • Wi-Fi calling • Free number ID",
          },
        },
        { id: "c_p_s3", type: "spacer", props: { height: 4 } },
        {
          id: "c_plan1_btn",
          type: "button",
          props: { label: "Choose Smart Saver" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "c_p_s4", type: "spacer", props: { height: 16 } },
        { id: "c_p_div1", type: "divider" },
        { id: "c_p_s5", type: "spacer", props: { height: 16 } },
        {
          id: "c_plan2",
          type: "product_card",
          props: {
            title: "Family Share",
            price: "$49/mo",
            imageUri: img("familyshare", 400, 180),
            badge: "Best Value",
          },
        },
        { id: "c_p_s6", type: "spacer", props: { height: 4 } },
        {
          id: "c_plan2_info",
          type: "text",
          props: {
            content:
              "30 GB shared data • Up to 4 lines • Unlimited calls • Parental controls included",
          },
        },
        { id: "c_p_s7", type: "spacer", props: { height: 4 } },
        {
          id: "c_plan2_btn",
          type: "button",
          props: { label: "Choose Family Share" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "c_p_s8", type: "spacer", props: { height: 16 } },
        { id: "c_p_div2", type: "divider" },
        { id: "c_p_s9", type: "spacer", props: { height: 16 } },
        {
          id: "c_plan3",
          type: "product_card",
          props: {
            title: "Smart Unlimited",
            price: "$35/mo",
            imageUri: img("smartunlimited", 400, 180),
            badge: "Popular",
          },
        },
        { id: "c_p_s10", type: "spacer", props: { height: 4 } },
        {
          id: "c_plan3_info",
          type: "text",
          props: {
            content:
              "Unlimited data (20 GB high-speed) • Calls & SMS • 5 GB hotspot • Free Netflix Basic",
          },
        },
        { id: "c_p_s11", type: "spacer", props: { height: 4 } },
        {
          id: "c_plan3_btn",
          type: "button",
          props: { label: "Choose Smart Unlimited" },
          action: { type: "navigate", screen: "account" },
        },
        { id: "c_p_s12", type: "spacer", props: { height: 28 } },
        {
          id: "c_addons_lbl",
          type: "text",
          props: { content: "Add-ons", variant: "heading" },
        },
        { id: "c_p_s13", type: "spacer", props: { height: 8 } },
        {
          id: "c_addon1",
          type: "list_item",
          props: {
            title: "Extra Line",
            subtitle: "$10/mo — Add another family member to your plan",
          },
        },
        {
          id: "c_addon2",
          type: "list_item",
          props: {
            title: "Data Top-up 5 GB",
            subtitle: "$5 one-time — Expires in 30 days",
          },
        },
        {
          id: "c_addon3",
          type: "list_item",
          props: {
            title: "Parental Controls",
            subtitle: "$3/mo — Content filtering & screen time limits",
          },
        },
        {
          id: "c_addon4",
          type: "list_item",
          props: {
            title: "International Calls",
            subtitle: "$8/mo — Unlimited calls to 20 countries",
          },
        },
        { id: "c_p_s14", type: "spacer", props: { height: 16 } },
        {
          id: "c_plans_help",
          type: "link",
          props: { label: "Compare plans side by side →" },
          action: { type: "navigate", screen: "settings" },
        },
        { id: "c_p_s15", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  ACCOUNT — Brand A (XL Premium · navy/gold · enterprise)
    //  Uses data sources: account (user profile, plan, usage, balance)
    // =========================================================================
    {
      screenId: "account",
      brand: "brand_a",
      published: true,
      dataSources: JSON.stringify([{ id: "account", provider: "account" }]),
      components: JSON.stringify([
        // — Profile section ———————————————————————————————————————————————
        {
          id: "a_acc_profile_lbl",
          type: "text",
          props: { content: "Profile", variant: "heading" },
        },
        { id: "a_acc_s1", type: "spacer", props: { height: 8 } },
        {
          id: "a_acc_profile_card",
          type: "card",
          children: [
            {
              id: "a_acc_name_lbl",
              type: "text",
              props: { content: "Name" },
            },
            {
              id: "a_acc_name",
              type: "text",
              props: { content: "{{account.name}}", variant: "heading" },
            },
            { id: "a_acc_cs1", type: "spacer", props: { height: 8 } },
            {
              id: "a_acc_phone_lbl",
              type: "text",
              props: { content: "Phone" },
            },
            {
              id: "a_acc_phone",
              type: "text",
              props: { content: "{{account.phoneNumber}}", variant: "heading" },
            },
          ],
        },
        { id: "a_acc_s2", type: "spacer", props: { height: 24 } },
        // — Plan section ——————————————————————————————————————————————————
        {
          id: "a_acc_plan_lbl",
          type: "text",
          props: { content: "Plan", variant: "heading" },
        },
        { id: "a_acc_s3", type: "spacer", props: { height: 8 } },
        {
          id: "a_acc_plan_card",
          type: "card",
          children: [
            {
              id: "a_acc_plan_name",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
                variant: "heading",
              },
            },
            { id: "a_acc_cs2", type: "spacer", props: { height: 4 } },
            {
              id: "a_acc_balance",
              type: "text",
              props: {
                content: "Balance: {{account.currency}} {{account.balance}}",
              },
            },
          ],
        },
        { id: "a_acc_s4", type: "spacer", props: { height: 24 } },
        // — Usage section —————————————————————————————————————————————————
        {
          id: "a_acc_usage_lbl",
          type: "text",
          props: { content: "Usage", variant: "heading" },
        },
        { id: "a_acc_s5", type: "spacer", props: { height: 8 } },
        {
          id: "a_acc_usage_card",
          type: "card",
          children: [
            {
              id: "a_acc_data_usage",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
          ],
        },
        { id: "a_acc_s6", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  ACCOUNT — Brand B (XL Go · purple/green · youth)
    //  Uses data sources: account (user profile, plan, usage, balance)
    // =========================================================================
    {
      screenId: "account",
      brand: "brand_b",
      published: true,
      dataSources: JSON.stringify([{ id: "account", provider: "account" }]),
      components: JSON.stringify([
        // — Profile section ———————————————————————————————————————————————
        {
          id: "b_acc_profile_lbl",
          type: "text",
          props: { content: "Your Profile", variant: "heading" },
        },
        { id: "b_acc_s1", type: "spacer", props: { height: 8 } },
        {
          id: "b_acc_profile_card",
          type: "card",
          children: [
            {
              id: "b_acc_name_lbl",
              type: "text",
              props: { content: "Name" },
            },
            {
              id: "b_acc_name",
              type: "text",
              props: { content: "{{account.name}}", variant: "heading" },
            },
            { id: "b_acc_cs1", type: "spacer", props: { height: 8 } },
            {
              id: "b_acc_phone_lbl",
              type: "text",
              props: { content: "Phone" },
            },
            {
              id: "b_acc_phone",
              type: "text",
              props: { content: "{{account.phoneNumber}}", variant: "heading" },
            },
          ],
        },
        { id: "b_acc_s2", type: "spacer", props: { height: 24 } },
        // — Plan section ——————————————————————————————————————————————————
        {
          id: "b_acc_plan_lbl",
          type: "text",
          props: { content: "Your Plan", variant: "heading" },
        },
        { id: "b_acc_s3", type: "spacer", props: { height: 8 } },
        {
          id: "b_acc_plan_card",
          type: "card",
          children: [
            {
              id: "b_acc_plan_name",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
                variant: "heading",
              },
            },
            { id: "b_acc_cs2", type: "spacer", props: { height: 4 } },
            {
              id: "b_acc_balance",
              type: "text",
              props: {
                content: "Balance: {{account.currency}} {{account.balance}}",
              },
            },
          ],
        },
        { id: "b_acc_s4", type: "spacer", props: { height: 24 } },
        // — Usage section —————————————————————————————————————————————————
        {
          id: "b_acc_usage_lbl",
          type: "text",
          props: { content: "Data Usage", variant: "heading" },
        },
        { id: "b_acc_s5", type: "spacer", props: { height: 8 } },
        {
          id: "b_acc_usage_card",
          type: "card",
          children: [
            {
              id: "b_acc_data_usage",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
          ],
        },
        { id: "b_acc_s6", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  ACCOUNT — Brand C (XL Smart · orange/teal · family value)
    //  Uses data sources: account (user profile, plan, usage, balance)
    // =========================================================================
    {
      screenId: "account",
      brand: "brand_c",
      published: true,
      dataSources: JSON.stringify([{ id: "account", provider: "account" }]),
      components: JSON.stringify([
        // — Profile section ———————————————————————————————————————————————
        {
          id: "c_acc_profile_lbl",
          type: "text",
          props: { content: "Family Profile", variant: "heading" },
        },
        { id: "c_acc_s1", type: "spacer", props: { height: 8 } },
        {
          id: "c_acc_profile_card",
          type: "card",
          children: [
            {
              id: "c_acc_name_lbl",
              type: "text",
              props: { content: "Name" },
            },
            {
              id: "c_acc_name",
              type: "text",
              props: { content: "{{account.name}}", variant: "heading" },
            },
            { id: "c_acc_cs1", type: "spacer", props: { height: 8 } },
            {
              id: "c_acc_phone_lbl",
              type: "text",
              props: { content: "Phone" },
            },
            {
              id: "c_acc_phone",
              type: "text",
              props: { content: "{{account.phoneNumber}}", variant: "heading" },
            },
          ],
        },
        { id: "c_acc_s2", type: "spacer", props: { height: 24 } },
        // — Plan section ——————————————————————————————————————————————————
        {
          id: "c_acc_plan_lbl",
          type: "text",
          props: { content: "Family Plan", variant: "heading" },
        },
        { id: "c_acc_s3", type: "spacer", props: { height: 8 } },
        {
          id: "c_acc_plan_card",
          type: "card",
          children: [
            {
              id: "c_acc_plan_name",
              type: "text",
              props: {
                content: "{{account.planName}} · {{account.planType}}",
                variant: "heading",
              },
            },
            { id: "c_acc_cs2", type: "spacer", props: { height: 4 } },
            {
              id: "c_acc_balance",
              type: "text",
              props: {
                content: "Balance: {{account.currency}} {{account.balance}}",
              },
            },
          ],
        },
        { id: "c_acc_s4", type: "spacer", props: { height: 24 } },
        // — Usage section —————————————————————————————————————————————————
        {
          id: "c_acc_usage_lbl",
          type: "text",
          props: { content: "Usage", variant: "heading" },
        },
        { id: "c_acc_s5", type: "spacer", props: { height: 8 } },
        {
          id: "c_acc_usage_card",
          type: "card",
          children: [
            {
              id: "c_acc_data_usage",
              type: "text",
              props: {
                content:
                  "Data: {{account.dataUsedGb}} GB used of {{account.dataLimitGb}} GB",
              },
            },
          ],
        },
        { id: "c_acc_s6", type: "spacer", props: { height: 24 } },
      ]),
    },

    // Demo brand screens are generated by buildDemoBrandScreens()
    ...buildDemoBrandScreens(img),
  ];

  await db.screen.createMany({ data: screens });
  console.log(
    `  Seeded ${screens.length} screens (3 brands × home/plans/account + segment variants + demo showcase).`,
  );

  // ---------------------------------------------------------------------------
  // A/B Tests — two experiments to showcase testing capability
  // ---------------------------------------------------------------------------

  // Brand B — Hero variant test
  const abTestB = await db.abTest.create({
    data: {
      name: "Brand B Home Hero Variant",
      screenId: "home",
      brand: "brand_b",
      active: true,
      variants: {
        create: [
          {
            name: "Control — Social Focus",
            percentage: 50,
            components: JSON.stringify([
              {
                id: "ab_hero_social",
                type: "hero_banner",
                props: {
                  title: "Unlimited Social Media",
                  subtitle: "Stream, share & scroll without limits",
                  imageUri: img("socialcontrol", 800, 400),
                },
                action: { type: "navigate", screen: "plans" },
              },
              { id: "ab_s1", type: "spacer", props: { height: 8 } },
              {
                id: "ab_btn_social",
                type: "button",
                props: { label: "Get Social Pass" },
                action: { type: "navigate", screen: "plans" },
              },
              { id: "ab_s2", type: "spacer", props: { height: 16 } },
              {
                id: "ab_deal_social",
                type: "product_card",
                props: {
                  title: "Go Social",
                  price: "$19/mo",
                  imageUri: img("socialpack", 400, 200),
                  badge: "Starter",
                },
                action: { type: "navigate", screen: "plans" },
              },
            ]),
          },
          {
            name: "Variant — Gaming Focus",
            percentage: 50,
            components: JSON.stringify([
              {
                id: "ab_hero_gaming",
                type: "hero_banner",
                props: {
                  title: "Level Up Your Game",
                  subtitle: "Low-latency gaming with priority 5G",
                  imageUri: img("gaminghero", 800, 400),
                },
                action: { type: "navigate", screen: "plans" },
              },
              { id: "ab_g_s1", type: "spacer", props: { height: 8 } },
              {
                id: "ab_btn_gaming",
                type: "button",
                props: { label: "Get Go Gamer" },
                action: { type: "navigate", screen: "plans" },
              },
              { id: "ab_g_s2", type: "spacer", props: { height: 16 } },
              {
                id: "ab_deal_gaming",
                type: "product_card",
                props: {
                  title: "Go Gamer",
                  price: "$39/mo",
                  imageUri: img("gamerbundle", 400, 200),
                  badge: "Pro",
                },
                action: { type: "navigate", screen: "plans" },
              },
            ]),
          },
        ],
      },
    },
  });
  console.log(`  Seeded A/B test: ${abTestB.name}`);

  // Brand C — Promotion style test
  const abTestC = await db.abTest.create({
    data: {
      name: "Brand C Home Offer Layout",
      screenId: "home",
      brand: "brand_c",
      active: true,
      variants: {
        create: [
          {
            name: "Control — Card Layout",
            percentage: 50,
            components: JSON.stringify([
              {
                id: "ab_c_hero",
                type: "hero_banner",
                props: {
                  title: "More for Your Family",
                  subtitle:
                    "Share data across all your lines and save up to 40%",
                  imageUri: img("familycontrol", 800, 400),
                },
                action: { type: "navigate", screen: "plans" },
              },
              { id: "ab_c_s1", type: "spacer", props: { height: 8 } },
              {
                id: "ab_c_offer",
                type: "product_card",
                props: {
                  title: "Family Share 30 GB",
                  price: "$49/mo for 4 lines",
                  imageUri: img("familydeal", 400, 200),
                  badge: "Best Value",
                },
                action: { type: "navigate", screen: "plans" },
              },
            ]),
          },
          {
            name: "Variant — Banner + List Layout",
            percentage: 50,
            components: JSON.stringify([
              {
                id: "ab_c_hero_v",
                type: "hero_banner",
                props: {
                  title: "Save Big with Family Plans",
                  subtitle: "Up to 40% off when you add 3+ lines",
                  imageUri: img("familysavings", 800, 400),
                },
                action: { type: "navigate", screen: "plans" },
              },
              { id: "ab_c_v_s1", type: "spacer", props: { height: 12 } },
              {
                id: "ab_c_v_item1",
                type: "list_item",
                props: {
                  title: "2 Lines — $39/mo",
                  subtitle: "20 GB shared data · Unlimited calls",
                },
              },
              {
                id: "ab_c_v_item2",
                type: "list_item",
                props: {
                  title: "4 Lines — $49/mo",
                  subtitle: "30 GB shared data · Unlimited calls · Best value",
                },
              },
              {
                id: "ab_c_v_item3",
                type: "list_item",
                props: {
                  title: "6 Lines — $59/mo",
                  subtitle: "50 GB shared data · Unlimited everything",
                },
              },
              { id: "ab_c_v_s2", type: "spacer", props: { height: 8 } },
              {
                id: "ab_c_v_btn",
                type: "button",
                props: { label: "Build Your Family Plan" },
                action: { type: "navigate", screen: "plans" },
              },
            ]),
          },
        ],
      },
    },
  });
  console.log(`  Seeded A/B test: ${abTestC.name}`);

  // ---------------------------------------------------------------------------
  // Analytics Events — sample data to populate dashboards
  // ---------------------------------------------------------------------------
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

  const analyticsEvents = [
    // Brand A — recent activity
    {
      eventType: "screen_view",
      brand: "brand_a",
      screenId: "home",
      userId: "user_001",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "hero_viewed",
      brand: "brand_a",
      screenId: "home",
      userId: "user_001",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "hero_cta",
      brand: "brand_a",
      screenId: "home",
      userId: "user_001",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "screen_view",
      brand: "brand_a",
      screenId: "plans",
      userId: "user_001",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "screen_view",
      brand: "brand_a",
      screenId: "home",
      userId: "user_002",
      payload: null,
      createdAt: hoursAgo(2),
    },
    {
      eventType: "promo_elite_viewed",
      brand: "brand_a",
      screenId: "home",
      userId: "user_002",
      payload: null,
      createdAt: hoursAgo(2),
    },
    {
      eventType: "promo_elite_tap",
      brand: "brand_a",
      screenId: "home",
      userId: "user_002",
      payload: null,
      createdAt: hoursAgo(2),
    },
    {
      eventType: "screen_view",
      brand: "brand_a",
      screenId: "home",
      userId: "user_003",
      payload: null,
      createdAt: hoursAgo(3),
    },
    {
      eventType: "screen_view",
      brand: "brand_a",
      screenId: "plans",
      userId: "user_003",
      payload: null,
      createdAt: hoursAgo(4),
    },

    // Brand B — high engagement
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "home",
      userId: "user_101",
      payload: null,
      createdAt: hoursAgo(0.5),
    },
    {
      eventType: "hero_viewed",
      brand: "brand_b",
      screenId: "home",
      userId: "user_101",
      payload: null,
      createdAt: hoursAgo(0.5),
    },
    {
      eventType: "hero_cta",
      brand: "brand_b",
      screenId: "home",
      userId: "user_101",
      payload: null,
      createdAt: hoursAgo(0.5),
    },
    {
      eventType: "deal_gamer_viewed",
      brand: "brand_b",
      screenId: "home",
      userId: "user_101",
      payload: null,
      createdAt: hoursAgo(0.5),
    },
    {
      eventType: "deal_gamer_tap",
      brand: "brand_b",
      screenId: "home",
      userId: "user_101",
      payload: null,
      createdAt: hoursAgo(0.5),
    },
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "plans",
      userId: "user_101",
      payload: null,
      createdAt: hoursAgo(0.5),
    },
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "home",
      userId: "user_102",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "home",
      userId: "user_103",
      payload: null,
      createdAt: hoursAgo(2),
    },
    {
      eventType: "hero_viewed",
      brand: "brand_b",
      screenId: "home",
      userId: "user_103",
      payload: null,
      createdAt: hoursAgo(2),
    },
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "plans",
      userId: "user_103",
      payload: null,
      createdAt: hoursAgo(3),
    },
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "home",
      userId: "user_104",
      payload: null,
      createdAt: hoursAgo(5),
    },
    {
      eventType: "screen_view",
      brand: "brand_b",
      screenId: "home",
      userId: "user_105",
      payload: null,
      createdAt: hoursAgo(6),
    },

    // Brand C — steady usage
    {
      eventType: "screen_view",
      brand: "brand_c",
      screenId: "home",
      userId: "user_201",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "hero_viewed",
      brand: "brand_c",
      screenId: "home",
      userId: "user_201",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "offer_family_viewed",
      brand: "brand_c",
      screenId: "home",
      userId: "user_201",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "offer_family_tap",
      brand: "brand_c",
      screenId: "home",
      userId: "user_201",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "screen_view",
      brand: "brand_c",
      screenId: "plans",
      userId: "user_201",
      payload: null,
      createdAt: hoursAgo(1),
    },
    {
      eventType: "screen_view",
      brand: "brand_c",
      screenId: "home",
      userId: "user_202",
      payload: null,
      createdAt: hoursAgo(3),
    },
    {
      eventType: "screen_view",
      brand: "brand_c",
      screenId: "home",
      userId: "user_203",
      payload: null,
      createdAt: hoursAgo(4),
    },
    {
      eventType: "hero_prepaid_viewed",
      brand: "brand_c",
      screenId: "home",
      userId: "user_204",
      payload: null,
      createdAt: hoursAgo(5),
    },
    {
      eventType: "screen_view",
      brand: "brand_c",
      screenId: "plans",
      userId: "user_204",
      payload: null,
      createdAt: hoursAgo(5),
    },
  ];

  await db.analyticsEvent.createMany({ data: analyticsEvents });
  console.log(`  Seeded ${analyticsEvents.length} analytics events.`);

  // ---------------------------------------------------------------------------
  // API Keys
  // ---------------------------------------------------------------------------
  await db.apiKey.createMany({
    data: [
      {
        label: "XL Premium — Mobile App",
        brand: "brand_a",
        key: hashApiKey("sk_brand_a_demo_key"),
      },
      {
        label: "XL Go — Mobile App",
        brand: "brand_b",
        key: hashApiKey("sk_brand_b_demo_key"),
      },
      {
        label: "XL Smart — Mobile App",
        brand: "brand_c",
        key: hashApiKey("sk_brand_c_demo_key"),
      },
      {
        label: "Showcase — Demo App",
        brand: "brand_demo",
        key: hashApiKey("sk_brand_demo_key"),
      },
      {
        label: "All Brands — Dev Key",
        brand: null,
        key: hashApiKey("sk_all_brands_dev_key"),
      },
    ],
  });
  console.log("  Seeded 5 API keys.");

  // ---------------------------------------------------------------------------
  // Admin User (password: admin123)
  // ---------------------------------------------------------------------------
  await db.adminUser.create({
    data: {
      email: "admin@telco-poc.com",
      passwordHash:
        "$2b$10$K4GiZq5NQfOTQp6G5FJyxuVbVjRYkGMZ7CcKBpXqJFGA1yPMHkWgO",
    },
  });
  console.log("  Seeded admin user: admin@telco-poc.com");

  console.log("\nSeed complete!");
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
