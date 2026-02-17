import { describe, it, expect, vi, afterEach } from "vitest";
import { createThemesRoutes } from "./themes";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

type ThemeRow = {
  id: string;
  brand: string;
  colors: string;
  typography: string;
  assets: string;
};

function makeThemeRow(overrides: Partial<ThemeRow> = {}): ThemeRow {
  return {
    id: "uuid-1",
    brand: "brand_a",
    colors: JSON.stringify({
      primary: "#003366",
      secondary: "#FFD700",
      accent: "#0066CC",
      background: "#FFFFFF",
      text: "#333333",
    }),
    typography: JSON.stringify({
      fontFamily: "Inter",
      headingWeight: "700",
      bodyWeight: "400",
    }),
    assets: JSON.stringify({
      logo: "https://example.com/logo.png",
      appIcon: "https://example.com/icon.png",
    }),
    ...overrides,
  };
}

function createMockDb() {
  return {
    theme: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  };
}

// ---------------------------------------------------------------------------
// GET /themes
// ---------------------------------------------------------------------------

describe("GET /themes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a record keyed by brand with parsed JSON fields", async () => {
    // Setup
    const db = createMockDb();
    const rowA = makeThemeRow({ brand: "brand_a" });
    const rowB = makeThemeRow({
      id: "uuid-2",
      brand: "brand_b",
      colors: JSON.stringify({
        primary: "#FF0000",
        secondary: "#00FF00",
        accent: "#0000FF",
        background: "#FFF",
        text: "#000",
      }),
    });
    db.theme.findMany.mockResolvedValue([rowA, rowB]);

    const app = createThemesRoutes(db as never);

    // Act
    const res = await app.request("/");
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body).toEqual({
      brand_a: {
        colors: {
          primary: "#003366",
          secondary: "#FFD700",
          accent: "#0066CC",
          background: "#FFFFFF",
          text: "#333333",
        },
        typography: {
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        },
        assets: {
          logo: "https://example.com/logo.png",
          appIcon: "https://example.com/icon.png",
        },
      },
      brand_b: {
        colors: {
          primary: "#FF0000",
          secondary: "#00FF00",
          accent: "#0000FF",
          background: "#FFF",
          text: "#000",
        },
        typography: {
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        },
        assets: {
          logo: "https://example.com/logo.png",
          appIcon: "https://example.com/icon.png",
        },
      },
    });
  });

  it("returns an empty object when no themes exist", async () => {
    // Setup
    const db = createMockDb();
    db.theme.findMany.mockResolvedValue([]);

    const app = createThemesRoutes(db as never);

    // Act
    const res = await app.request("/");
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// GET /themes/:brand
// ---------------------------------------------------------------------------

describe("GET /themes/:brand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a single theme with parsed JSON fields", async () => {
    // Setup
    const db = createMockDb();
    const row = makeThemeRow();
    db.theme.findUnique.mockResolvedValue(row);

    const app = createThemesRoutes(db as never);

    // Act
    const res = await app.request("/brand_a");
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body).toEqual({
      id: "uuid-1",
      brand: "brand_a",
      colors: {
        primary: "#003366",
        secondary: "#FFD700",
        accent: "#0066CC",
        background: "#FFFFFF",
        text: "#333333",
      },
      typography: {
        fontFamily: "Inter",
        headingWeight: "700",
        bodyWeight: "400",
      },
      assets: {
        logo: "https://example.com/logo.png",
        appIcon: "https://example.com/icon.png",
      },
    });
  });

  it("returns 404 when the brand has no theme", async () => {
    // Setup
    const db = createMockDb();
    db.theme.findUnique.mockResolvedValue(null);

    const app = createThemesRoutes(db as never);

    // Act
    const res = await app.request("/brand_x");

    // Assert
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PUT /themes/:brand
// ---------------------------------------------------------------------------

describe("PUT /themes/:brand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("upserts a theme and returns parsed JSON fields", async () => {
    // Setup
    const db = createMockDb();
    const upserted = makeThemeRow();
    db.theme.upsert.mockResolvedValue(upserted);

    const app = createThemesRoutes(db as never);

    // Act
    const res = await app.request("/brand_a", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: {
          primary: "#003366",
          secondary: "#FFD700",
          accent: "#0066CC",
          background: "#FFFFFF",
          text: "#333333",
        },
        typography: {
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        },
        assets: { logo: "https://example.com/logo.png" },
      }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.brand).toBe("brand_a");
    expect(body.colors).toEqual({
      primary: "#003366",
      secondary: "#FFD700",
      accent: "#0066CC",
      background: "#FFFFFF",
      text: "#333333",
    });
    expect(db.theme.upsert).toHaveBeenCalledWith({
      where: { brand: "brand_a" },
      create: expect.objectContaining({ brand: "brand_a" }),
      update: expect.objectContaining({
        colors: JSON.stringify({
          primary: "#003366",
          secondary: "#FFD700",
          accent: "#0066CC",
          background: "#FFFFFF",
          text: "#333333",
        }),
      }),
    });
  });
});

// ---------------------------------------------------------------------------
// PATCH /themes/:brand
// ---------------------------------------------------------------------------

describe("PATCH /themes/:brand", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("upserts a theme via PATCH and returns parsed JSON fields", async () => {
    // Setup
    const db = createMockDb();
    const upserted = makeThemeRow();
    db.theme.upsert.mockResolvedValue(upserted);

    const app = createThemesRoutes(db as never);

    // Act
    const res = await app.request("/brand_a", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        colors: {
          primary: "#003366",
          secondary: "#FFD700",
          accent: "#0066CC",
          background: "#FFFFFF",
          text: "#333333",
        },
        typography: {
          fontFamily: "Inter",
          headingWeight: "700",
          bodyWeight: "400",
        },
        assets: { logo: "https://example.com/logo.png" },
      }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.brand).toBe("brand_a");
    expect(body.colors).toEqual({
      primary: "#003366",
      secondary: "#FFD700",
      accent: "#0066CC",
      background: "#FFFFFF",
      text: "#333333",
    });
  });
});
