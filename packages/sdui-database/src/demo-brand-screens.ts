/**
 * Demo brand screen definitions for the component showcase.
 *
 * Exports the three SDUI screens (home, plans, account) for `brand_demo`.
 * Together they cover all 53 SDUI component types.
 *
 * Extracted into a standalone module so the seed script can consume it
 * and unit tests can verify full component-type coverage.
 */

/** Signature for an image-URL generator (matches the seed helper). */
type ImgFn = (seed: string, w: number, h: number) => string;

interface ScreenSeedRow {
  screenId: string;
  brand: string;
  segment?: string;
  published: boolean;
  dataSources?: string;
  components: string;
  overlays?: string;
}

/**
 * Returns the three demo-brand screen rows ready for Prisma `createMany`.
 *
 * @param img - Stable placeholder-image URL builder (e.g. picsum helper).
 * @returns Array of screen seed rows for `brand_demo`.
 */
export function buildDemoBrandScreens(img: ImgFn): ScreenSeedRow[] {
  return [
    // =========================================================================
    //  HOME — Layout + Content + Interactive + Composite (18 types)
    // =========================================================================
    {
      screenId: "home",
      brand: "brand_demo",
      published: true,
      dataSources: JSON.stringify([
        { id: "account", provider: "account" },
        { id: "offers", provider: "marketing", params: { limit: 3 } },
      ]),
      components: JSON.stringify([
        // — Greeting (text, spacer) ———————————————————————————————————————
        {
          id: "d_greeting",
          type: "text",
          props: { content: "Welcome, {{account.name}}", variant: "heading" },
        },
        { id: "d_s0", type: "spacer", props: { height: 4 } },
        {
          id: "d_plan_info",
          type: "text",
          props: { content: "{{account.planName}} · {{account.planType}}" },
        },
        { id: "d_s1", type: "spacer", props: { height: 16 } },

        // — Account summary (card, row, icon, divider) ————————————————————
        {
          id: "d_summary_card",
          type: "card",
          children: [
            {
              id: "d_summary_row1",
              type: "row",
              props: { gap: 8 },
              children: [
                {
                  id: "d_summary_icon",
                  type: "icon",
                  props: { name: "signal", size: 20 },
                },
                {
                  id: "d_summary_data",
                  type: "text",
                  props: {
                    content:
                      "Data: {{account.dataUsedGb}} GB / {{account.dataLimitGb}} GB",
                  },
                },
              ],
            },
            { id: "d_summary_div", type: "divider" },
            {
              id: "d_summary_row2",
              type: "row",
              props: { gap: 8 },
              children: [
                {
                  id: "d_summary_icon2",
                  type: "icon",
                  props: { name: "wallet", size: 20 },
                },
                {
                  id: "d_summary_balance",
                  type: "text",
                  props: {
                    content:
                      "Balance: {{account.currency}} {{account.balance}}",
                  },
                },
              ],
            },
          ],
        },
        { id: "d_s2", type: "spacer", props: { height: 16 } },

        // — Hero banner + button ——————————————————————————————————————————
        {
          id: "d_hero",
          type: "hero_banner",
          props: {
            title: "Component Showcase",
            subtitle: "All 53 SDUI components — powered by live data",
            imageUri: img("showcasehero", 800, 400),
          },
          action: { type: "navigate", screen: "plans" },
          analytics: {
            impression: "demo_hero_viewed",
            click: "demo_hero_cta",
          },
        },
        { id: "d_s3", type: "spacer", props: { height: 8 } },
        {
          id: "d_hero_btn",
          type: "button",
          props: { label: "See All Components" },
          action: { type: "show_overlay", overlayId: "d_modal_info" },
        },
        { id: "d_s4", type: "spacer", props: { height: 24 } },

        // — Quick actions (action_grid, action_card) ——————————————————————
        {
          id: "d_actions_lbl",
          type: "text",
          props: { content: "Quick Actions", variant: "heading" },
        },
        { id: "d_s5", type: "spacer", props: { height: 8 } },
        {
          id: "d_actions",
          type: "action_grid",
          children: [
            {
              id: "d_act_plans",
              type: "action_card",
              props: { title: "Browse Plans" },
              action: { type: "navigate", screen: "plans" },
            },
            {
              id: "d_act_account",
              type: "action_card",
              props: { title: "My Account" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "d_act_topup",
              type: "action_card",
              props: { title: "Top Up" },
              action: { type: "navigate", screen: "account" },
            },
            {
              id: "d_act_support",
              type: "action_card",
              props: { title: "Support" },
              action: { type: "navigate", screen: "settings" },
            },
          ],
        },
        { id: "d_s6", type: "spacer", props: { height: 24 } },

        // — Layout demo (stack, column) ———————————————————————————————————
        {
          id: "d_layout_lbl",
          type: "text",
          props: { content: "Layout Components", variant: "heading" },
        },
        { id: "d_s7", type: "spacer", props: { height: 8 } },
        {
          id: "d_stack_demo",
          type: "stack",
          props: { gap: 8 },
          children: [
            {
              id: "d_stack_t1",
              type: "text",
              props: { content: "Stack item 1" },
            },
            {
              id: "d_stack_t2",
              type: "text",
              props: { content: "Stack item 2" },
            },
          ],
        },
        { id: "d_s7b", type: "spacer", props: { height: 8 } },
        {
          id: "d_column_demo",
          type: "column",
          props: { gap: 8 },
          children: [
            {
              id: "d_col_t1",
              type: "text",
              props: { content: "Column item A" },
            },
            {
              id: "d_col_t2",
              type: "text",
              props: { content: "Column item B" },
            },
          ],
        },
        { id: "d_s8", type: "spacer", props: { height: 24 } },

        // — Image ——————————————————————————————————————————————————————————
        {
          id: "d_media_lbl",
          type: "text",
          props: { content: "Image Component", variant: "heading" },
        },
        { id: "d_s9", type: "spacer", props: { height: 8 } },
        {
          id: "d_image_demo",
          type: "image",
          props: { uri: img("showcaseimg", 400, 200), width: 400, height: 200 },
        },
        { id: "d_s10", type: "spacer", props: { height: 24 } },

        // — Dynamic offers (product_card repeat, link) ————————————————————
        {
          id: "d_offers_lbl",
          type: "text",
          props: {
            content: "Dynamic Offers (from Marketing Source)",
            variant: "heading",
          },
        },
        { id: "d_s11", type: "spacer", props: { height: 8 } },
        {
          id: "d_offer_tmpl",
          type: "product_card",
          repeat: { source: "offers", as: "offer" },
          props: {
            title: "{{offer.title}}",
            price: "{{offer.price}}",
            badge: "{{offer.badge}}",
          },
          action: { type: "navigate", screen: "plans" },
          analytics: {
            impression: "demo_offer_viewed",
            click: "demo_offer_tap",
          },
        },
        { id: "d_s12", type: "spacer", props: { height: 8 } },
        {
          id: "d_offers_link",
          type: "link",
          props: { label: "View all offers →" },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "d_s13", type: "spacer", props: { height: 24 } },

        // — List items —————————————————————————————————————————————————————
        {
          id: "d_list_lbl",
          type: "text",
          props: { content: "List Items", variant: "heading" },
        },
        { id: "d_s14", type: "spacer", props: { height: 8 } },
        {
          id: "d_list1",
          type: "list_item",
          props: {
            title: "5G expansion to 200+ cities",
            subtitle: "Experience ultra-fast connectivity nationwide",
          },
        },
        {
          id: "d_list2",
          type: "list_item",
          props: {
            title: "Earn double loyalty points",
            subtitle: "Limited time — valid through March 31",
          },
        },
        { id: "d_s15", type: "spacer", props: { height: 24 } },

        // — Scroll view ———————————————————————————————————————————————————
        {
          id: "d_scroll_lbl",
          type: "text",
          props: { content: "Scroll View Container", variant: "heading" },
        },
        { id: "d_s16", type: "spacer", props: { height: 8 } },
        {
          id: "d_scroll_demo",
          type: "scroll_view",
          children: [
            {
              id: "d_scroll_t1",
              type: "text",
              props: { content: "Scrollable content item 1" },
            },
            {
              id: "d_scroll_t2",
              type: "text",
              props: { content: "Scrollable content item 2" },
            },
            {
              id: "d_scroll_t3",
              type: "text",
              props: { content: "Scrollable content item 3" },
            },
          ],
        },
        { id: "d_s17", type: "spacer", props: { height: 24 } },

        // — Web view ——————————————————————————————————————————————————————
        {
          id: "d_webview_lbl",
          type: "text",
          props: { content: "Web View Embed", variant: "heading" },
        },
        { id: "d_s18", type: "spacer", props: { height: 8 } },
        {
          id: "d_webview_demo",
          type: "web_view",
          props: { url: "https://expo.dev", height: 120 },
        },
        { id: "d_s19", type: "spacer", props: { height: 24 } },
      ]),
      overlays: JSON.stringify([
        {
          id: "d_welcome_overlay",
          style: "bottom_sheet",
          dismissible: true,
          trigger: { type: "on_load" },
          dismissAfterMs: 8000,
          components: [
            {
              id: "d_ov_title",
              type: "text",
              props: {
                content: "Welcome to the Showcase!",
                variant: "heading",
              },
            },
            { id: "d_ov_s1", type: "spacer", props: { height: 8 } },
            {
              id: "d_ov_desc",
              type: "text",
              props: {
                content:
                  "This demo brand showcases all 53 SDUI components across Home, Plans, and Account tabs. Browse each tab to see every component in action.",
              },
            },
            { id: "d_ov_s2", type: "spacer", props: { height: 12 } },
            {
              id: "d_ov_dismiss_btn",
              type: "button",
              props: { label: "Got it!" },
              action: { type: "dismiss_overlay" },
            },
          ],
        },
        {
          id: "d_modal_info",
          style: "modal",
          dismissible: true,
          trigger: { type: "manual" },
          components: [
            {
              id: "d_ov_modal_title",
              type: "text",
              props: { content: "53 Components", variant: "heading" },
            },
            { id: "d_ov_ms1", type: "spacer", props: { height: 8 } },
            {
              id: "d_ov_modal_desc",
              type: "text",
              props: {
                content:
                  "Home — Layout, Content, Interactive, Composite (18 types)\nPlans — Foundation & Engagement (18 types)\nAccount — Forms, Advanced & Specialized (17 types)",
              },
            },
            { id: "d_ov_ms2", type: "spacer", props: { height: 12 } },
            {
              id: "d_ov_modal_close",
              type: "link",
              props: { label: "Close" },
              action: {
                type: "dismiss_overlay",
                overlayId: "d_modal_info",
              },
            },
          ],
        },
      ]),
    },

    // =========================================================================
    //  PLANS — Foundation + Engagement (18 types)
    // =========================================================================
    {
      screenId: "plans",
      brand: "brand_demo",
      published: true,
      dataSources: JSON.stringify([
        { id: "offers", provider: "marketing", params: { limit: 3 } },
      ]),
      components: JSON.stringify([
        // — section_header —————————————————————————————————————————————————
        {
          id: "d_p_header",
          type: "section_header",
          props: {
            title: "Plans & Features",
            subtitle: "Foundation & Engagement components",
            actionLabel: "See all",
          },
          action: { type: "navigate", screen: "home" },
        },
        { id: "d_p_s1", type: "spacer", props: { height: 8 } },

        // — search_bar —————————————————————————————————————————————————————
        {
          id: "d_p_search",
          type: "search_bar",
          props: { placeholder: "Search plans..." },
        },
        { id: "d_p_s2", type: "spacer", props: { height: 16 } },

        // — story_circle ———————————————————————————————————————————————————
        {
          id: "d_p_stories_lbl",
          type: "text",
          props: { content: "Stories", variant: "heading" },
        },
        { id: "d_p_s3", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_story1",
          type: "story_circle",
          props: {
            label: "5G Launch",
            imageUri: img("story1", 100, 100),
            seen: false,
          },
        },
        {
          id: "d_p_story2",
          type: "story_circle",
          props: {
            label: "Promo",
            imageUri: img("story2", 100, 100),
            seen: true,
          },
        },
        {
          id: "d_p_story3",
          type: "story_circle",
          props: {
            label: "Tips",
            imageUri: img("story3", 100, 100),
            seen: false,
          },
        },
        { id: "d_p_s4", type: "spacer", props: { height: 16 } },

        // — carousel ———————————————————————————————————————————————————————
        {
          id: "d_p_carousel_lbl",
          type: "text",
          props: { content: "Featured Plans", variant: "heading" },
        },
        { id: "d_p_s5", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_carousel",
          type: "carousel",
          props: {
            autoPlay: true,
            interval: 4000,
            showIndicators: true,
            loop: true,
          },
          children: [
            {
              id: "d_p_slide1",
              type: "hero_banner",
              props: {
                title: "Unlimited Social",
                subtitle: "Stream & share without limits",
                imageUri: img("slide1demo", 800, 400),
              },
            },
            {
              id: "d_p_slide2",
              type: "hero_banner",
              props: {
                title: "Family Share 30GB",
                subtitle: "Up to 4 lines — best value",
                imageUri: img("slide2demo", 800, 400),
              },
            },
            {
              id: "d_p_slide3",
              type: "hero_banner",
              props: {
                title: "Go Gamer Pro",
                subtitle: "Low-latency gaming with 5G",
                imageUri: img("slide3demo", 800, 400),
              },
            },
          ],
        },
        { id: "d_p_s6", type: "spacer", props: { height: 16 } },

        // — chip ———————————————————————————————————————————————————————————
        {
          id: "d_p_chip_lbl",
          type: "text",
          props: { content: "Filter by Category", variant: "heading" },
        },
        { id: "d_p_s7", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_chip1",
          type: "chip",
          props: { label: "Prepaid", selected: true },
        },
        {
          id: "d_p_chip2",
          type: "chip",
          props: { label: "Postpaid", selected: false },
        },
        {
          id: "d_p_chip3",
          type: "chip",
          props: { label: "Business", selected: false },
        },
        { id: "d_p_s8", type: "spacer", props: { height: 16 } },

        // — avatar —————————————————————————————————————————————————————————
        {
          id: "d_p_avatar_lbl",
          type: "text",
          props: { content: "Your Profile", variant: "heading" },
        },
        { id: "d_p_s9", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_avatar",
          type: "avatar",
          props: {
            imageUri: img("avatar1", 80, 80),
            initials: "AP",
            size: 56,
          },
        },
        { id: "d_p_s10", type: "spacer", props: { height: 16 } },

        // — tab_bar ————————————————————————————————————————————————————————
        {
          id: "d_p_tabbar_lbl",
          type: "text",
          props: { content: "Plan Categories", variant: "heading" },
        },
        { id: "d_p_s11", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_tabbar",
          type: "tab_bar",
          props: {
            tabs: [
              { label: "All Plans", active: true },
              { label: "Prepaid", active: false },
              { label: "Postpaid", active: false },
            ],
          },
        },
        { id: "d_p_s12", type: "spacer", props: { height: 16 } },

        // — rating —————————————————————————————————————————————————————————
        {
          id: "d_p_rating_lbl",
          type: "text",
          props: { content: "Customer Rating", variant: "heading" },
        },
        { id: "d_p_s13", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_rating",
          type: "rating",
          props: { value: 4, max: 5 },
        },
        { id: "d_p_s14", type: "spacer", props: { height: 16 } },

        // — progress_bar ———————————————————————————————————————————————————
        {
          id: "d_p_progress_lbl",
          type: "text",
          props: { content: "Data Usage", variant: "heading" },
        },
        { id: "d_p_s15", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_progress",
          type: "progress_bar",
          props: { value: 65, max: 100, label: "65% used" },
        },
        { id: "d_p_s16", type: "spacer", props: { height: 16 } },

        // — countdown_timer ————————————————————————————————————————————————
        {
          id: "d_p_countdown_lbl",
          type: "text",
          props: { content: "Flash Sale Ends In", variant: "heading" },
        },
        { id: "d_p_s17", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_countdown",
          type: "countdown_timer",
          props: {
            targetDate: new Date(Date.now() + 86_400_000 * 3).toISOString(),
            label: "Sale ends",
          },
        },
        { id: "d_p_s18", type: "spacer", props: { height: 16 } },

        // — banner —————————————————————————————————————————————————————————
        {
          id: "d_p_banner",
          type: "banner",
          props: {
            message: "New 5G coverage now available in your area!",
            variant: "info",
            dismissible: true,
          },
        },
        { id: "d_p_s19", type: "spacer", props: { height: 16 } },

        // — accordion ——————————————————————————————————————————————————————
        {
          id: "d_p_faq_lbl",
          type: "text",
          props: { content: "FAQ", variant: "heading" },
        },
        { id: "d_p_s20", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_accordion1",
          type: "accordion",
          props: { title: "How do I switch plans?" },
          children: [
            {
              id: "d_p_acc1_body",
              type: "text",
              props: {
                content:
                  "Go to Plans tab and select your new plan. Changes take effect immediately.",
              },
            },
          ],
        },
        {
          id: "d_p_accordion2",
          type: "accordion",
          props: { title: "Can I keep my number?" },
          children: [
            {
              id: "d_p_acc2_body",
              type: "text",
              props: {
                content:
                  "Yes! Number portability is supported for all plan changes.",
              },
            },
          ],
        },
        { id: "d_p_s21", type: "spacer", props: { height: 16 } },

        // — video_player ———————————————————————————————————————————————————
        {
          id: "d_p_video_lbl",
          type: "text",
          props: { content: "Promo Video", variant: "heading" },
        },
        { id: "d_p_s22", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_video",
          type: "video_player",
          props: {
            posterUri: img("videoposter", 800, 400),
            videoUrl: "https://example.com/promo.mp4",
          },
        },
        { id: "d_p_s23", type: "spacer", props: { height: 16 } },

        // — text_input, toggle, dropdown ———————————————————————————————————
        {
          id: "d_p_form_lbl",
          type: "text",
          props: { content: "Form Components", variant: "heading" },
        },
        { id: "d_p_s24", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_text_input",
          type: "text_input",
          props: {
            label: "Phone Number",
            placeholder: "+62...",
            inputType: "phone",
          },
        },
        { id: "d_p_s25", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_toggle",
          type: "toggle",
          props: { label: "Enable auto-renewal", value: true },
        },
        { id: "d_p_s26", type: "spacer", props: { height: 8 } },
        {
          id: "d_p_dropdown",
          type: "dropdown",
          props: {
            label: "Select Plan Type",
            options: ["Prepaid", "Postpaid", "Business"],
            selectedIndex: 0,
          },
        },
        { id: "d_p_s27", type: "spacer", props: { height: 16 } },

        // — empty_state ————————————————————————————————————————————————————
        {
          id: "d_p_empty",
          type: "empty_state",
          props: {
            title: "No Results Found",
            subtitle: "Try adjusting your search or filters",
            imageUri: img("emptystate", 200, 200),
          },
        },
        { id: "d_p_s28", type: "spacer", props: { height: 16 } },

        // — bottom_sheet ———————————————————————————————————————————————————
        {
          id: "d_p_bottomsheet",
          type: "bottom_sheet",
          props: { title: "Plan Details" },
          children: [
            {
              id: "d_p_bs_text",
              type: "text",
              props: {
                content:
                  "This is a bottom sheet component with nested content.",
              },
            },
          ],
        },
        { id: "d_p_s29", type: "spacer", props: { height: 24 } },
      ]),
    },

    // =========================================================================
    //  ACCOUNT — Forms + Advanced + Specialized (17 types)
    // =========================================================================
    {
      screenId: "account",
      brand: "brand_demo",
      published: true,
      dataSources: JSON.stringify([{ id: "account", provider: "account" }]),
      components: JSON.stringify([
        // — step_indicator ——————————————————————————————————————————————————
        {
          id: "d_a_step_lbl",
          type: "text",
          props: { content: "Account Setup Progress", variant: "heading" },
        },
        { id: "d_a_s1", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_step_indicator",
          type: "step_indicator",
          props: {
            steps: ["Profile", "Plan", "Payment", "Confirm"],
            currentStep: 2,
          },
        },
        { id: "d_a_s2", type: "spacer", props: { height: 24 } },

        // — checkbox, radio_group, slider, date_picker, stepper ————————————
        {
          id: "d_a_form_lbl",
          type: "text",
          props: { content: "Form Components", variant: "heading" },
        },
        { id: "d_a_s3", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_checkbox",
          type: "checkbox",
          props: {
            label: "I agree to the terms and conditions",
            checked: false,
          },
        },
        { id: "d_a_s4", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_radio",
          type: "radio_group",
          props: {
            label: "Payment Method",
            options: [
              { label: "Credit Card", value: "cc" },
              { label: "Bank Transfer", value: "bank" },
              { label: "E-Wallet", value: "wallet" },
            ],
            selectedValue: "cc",
          },
        },
        { id: "d_a_s5", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_slider",
          type: "slider",
          props: { label: "Data Limit (GB)", min: 1, max: 100, value: 50 },
        },
        { id: "d_a_s6", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_date_picker",
          type: "date_picker",
          props: { label: "Activation Date", value: "2026-03-01" },
        },
        { id: "d_a_s7", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_stepper",
          type: "stepper",
          props: { label: "Number of Lines", value: 2, min: 1, max: 10 },
        },
        { id: "d_a_s8", type: "spacer", props: { height: 24 } },

        // — swipeable_row ——————————————————————————————————————————————————
        {
          id: "d_a_swipe_lbl",
          type: "text",
          props: { content: "Swipeable Actions", variant: "heading" },
        },
        { id: "d_a_s9", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_swipeable1",
          type: "swipeable_row",
          props: {
            actions: [
              { label: "Delete", color: "#FF3B30" },
              { label: "Archive", color: "#007AFF" },
            ],
          },
          children: [
            {
              id: "d_a_swipe_content",
              type: "list_item",
              props: {
                title: "Invoice #1234",
                subtitle: "Swipe left for actions",
              },
            },
          ],
        },
        { id: "d_a_s10", type: "spacer", props: { height: 24 } },

        // — chart ——————————————————————————————————————————————————————————
        {
          id: "d_a_chart_lbl",
          type: "text",
          props: { content: "Monthly Data Usage", variant: "heading" },
        },
        { id: "d_a_s11", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_chart",
          type: "chart",
          props: {
            type: "bar",
            data: [
              { label: "Jan", value: 12 },
              { label: "Feb", value: 19 },
              { label: "Mar", value: 8 },
              { label: "Apr", value: 15 },
              { label: "May", value: 22 },
              { label: "Jun", value: 17 },
            ],
          },
        },
        { id: "d_a_s12", type: "spacer", props: { height: 24 } },

        // — comparison_table ———————————————————————————————————————————————
        {
          id: "d_a_compare_lbl",
          type: "text",
          props: { content: "Plan Comparison", variant: "heading" },
        },
        { id: "d_a_s13", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_comparison",
          type: "comparison_table",
          props: {
            headers: ["Feature", "Basic", "Pro"],
            rows: [
              ["Data", "10 GB", "50 GB"],
              ["Calls", "100 min", "Unlimited"],
              ["5G", "No", "Yes"],
              ["Price", "$15/mo", "$39/mo"],
            ],
          },
        },
        { id: "d_a_s14", type: "spacer", props: { height: 24 } },

        // — qr_code ————————————————————————————————————————————————————————
        {
          id: "d_a_qr_lbl",
          type: "text",
          props: { content: "Share via QR Code", variant: "heading" },
        },
        { id: "d_a_s15", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_qr",
          type: "qr_code",
          props: {
            value: "https://xl-modula.example.com/referral/demo",
            size: 160,
          },
        },
        { id: "d_a_s16", type: "spacer", props: { height: 24 } },

        // — map_view ———————————————————————————————————————————————————————
        {
          id: "d_a_map_lbl",
          type: "text",
          props: { content: "Nearest Store", variant: "heading" },
        },
        { id: "d_a_s17", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_map",
          type: "map_view",
          props: {
            latitude: -6.2088,
            longitude: 106.8456,
            zoom: 14,
            label: "XL Center Jakarta",
          },
        },
        { id: "d_a_s18", type: "spacer", props: { height: 24 } },

        // — lottie_animation ———————————————————————————————————————————————
        {
          id: "d_a_lottie_lbl",
          type: "text",
          props: { content: "Animation", variant: "heading" },
        },
        { id: "d_a_s19", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_lottie",
          type: "lottie_animation",
          props: {
            source:
              "https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json",
            autoPlay: true,
            loop: true,
            width: 200,
            height: 200,
          },
        },
        { id: "d_a_s20", type: "spacer", props: { height: 24 } },

        // — media_gallery ——————————————————————————————————————————————————
        {
          id: "d_a_gallery_lbl",
          type: "text",
          props: { content: "Media Gallery", variant: "heading" },
        },
        { id: "d_a_s21", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_gallery",
          type: "media_gallery",
          props: {
            items: [
              { uri: img("gallery1", 300, 300), type: "image" },
              { uri: img("gallery2", 300, 300), type: "image" },
              { uri: img("gallery3", 300, 300), type: "image" },
              { uri: img("gallery4", 300, 300), type: "image" },
            ],
          },
        },
        { id: "d_a_s22", type: "spacer", props: { height: 24 } },

        // — social_proof ———————————————————————————————————————————————————
        {
          id: "d_a_social_lbl",
          type: "text",
          props: { content: "Trusted by Millions", variant: "heading" },
        },
        { id: "d_a_s23", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_social_proof",
          type: "social_proof",
          props: {
            icon: "people",
            text: "2.4 million users switched to this plan last month",
          },
        },
        { id: "d_a_s24", type: "spacer", props: { height: 24 } },

        // — skeleton_loader ————————————————————————————————————————————————
        {
          id: "d_a_skeleton_lbl",
          type: "text",
          props: { content: "Loading States", variant: "heading" },
        },
        { id: "d_a_s25", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_skeleton",
          type: "skeleton_loader",
          props: { variant: "card", lines: 3 },
        },
        { id: "d_a_s26", type: "spacer", props: { height: 24 } },

        // — pull_to_refresh ————————————————————————————————————————————————
        {
          id: "d_a_ptr_lbl",
          type: "text",
          props: { content: "Pull to Refresh", variant: "heading" },
        },
        { id: "d_a_s27", type: "spacer", props: { height: 8 } },
        {
          id: "d_a_pull_to_refresh",
          type: "pull_to_refresh",
          children: [
            {
              id: "d_a_ptr_content",
              type: "text",
              props: { content: "Pull down to refresh this content" },
            },
          ],
        },
        { id: "d_a_s28", type: "spacer", props: { height: 24 } },

        // — floating_action_button —————————————————————————————————————————
        {
          id: "d_a_fab",
          type: "floating_action_button",
          props: { icon: "add", label: "New", position: "bottom-right" },
          action: { type: "navigate", screen: "plans" },
        },
        { id: "d_a_s29", type: "spacer", props: { height: 24 } },
      ]),
    },
  ];
}
