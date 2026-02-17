import { describe, it, expect, vi, afterEach } from "vitest";
import { createScreensRoutes, generateCopyScreenId } from "./screens";

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function makeScreenRow(overrides: Partial<ScreenRow> = {}): ScreenRow {
  return {
    id: "uuid-1",
    screenId: "home",
    brand: "brand_a",
    segment: null,
    components: '[{"id":"c1","type":"text"}]',
    overlays: null,
    dataSources: null,
    version: 1,
    published: true,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

type ScreenRow = {
  id: string;
  screenId: string;
  brand: string;
  segment: string | null;
  components: string;
  overlays: string | null;
  dataSources: string | null;
  version: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function createMockDb() {
  return {
    screen: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };
}

// ---------------------------------------------------------------------------
// generateCopyScreenId
// ---------------------------------------------------------------------------

describe("generateCopyScreenId", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns '<id>-copy' when no collision exists", () => {
    // Act
    const result = generateCopyScreenId("home", ["home", "settings"]);

    // Assert
    expect(result).toBe("home-copy");
  });

  it("returns '<id>-copy-2' when '-copy' already exists", () => {
    // Act
    const result = generateCopyScreenId("home", ["home", "home-copy"]);

    // Assert
    expect(result).toBe("home-copy-2");
  });

  it("returns '<id>-copy-3' when both '-copy' and '-copy-2' exist", () => {
    // Act
    const result = generateCopyScreenId("home", [
      "home",
      "home-copy",
      "home-copy-2",
    ]);

    // Assert
    expect(result).toBe("home-copy-3");
  });

  it("works with a Set input", () => {
    // Act
    const result = generateCopyScreenId("home", new Set(["home", "home-copy"]));

    // Assert
    expect(result).toBe("home-copy-2");
  });

  it("works with an empty list", () => {
    // Act
    const result = generateCopyScreenId("home", []);

    // Assert
    expect(result).toBe("home-copy");
  });
});

// ---------------------------------------------------------------------------
// POST /screens — create with overlays
// ---------------------------------------------------------------------------

describe("POST / (create screen with overlays)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("persists overlays when provided in create payload", async () => {
    // Setup
    const db = createMockDb();
    const overlaysJson = JSON.stringify([
      {
        id: "ov1",
        style: "modal",
        dismissible: true,
        trigger: { type: "manual" },
        components: [],
      },
    ]);
    const created = makeScreenRow({
      id: "uuid-new",
      overlays: overlaysJson,
    });
    db.screen.create.mockResolvedValue(created);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        screenId: "home",
        brand: "brand_a",
        components: "[]",
        overlays: overlaysJson,
      }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.overlays).toBe(overlaysJson);
    expect(db.screen.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        overlays: overlaysJson,
      }),
    });
  });

  it("sets overlays to null when not provided", async () => {
    // Setup
    const db = createMockDb();
    const created = makeScreenRow({ id: "uuid-new", overlays: null });
    db.screen.create.mockResolvedValue(created);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        screenId: "home",
        brand: "brand_a",
        components: "[]",
      }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.overlays).toBeNull();
    expect(db.screen.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        overlays: null,
      }),
    });
  });
});

// ---------------------------------------------------------------------------
// PATCH /screens/:id — update overlays
// ---------------------------------------------------------------------------

describe("PATCH /:id (update overlays)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates overlays when provided in patch payload", async () => {
    // Setup
    const db = createMockDb();
    const existing = makeScreenRow();
    db.screen.findUnique.mockResolvedValue(existing);
    const overlaysJson = JSON.stringify([
      {
        id: "ov1",
        style: "bottom_sheet",
        dismissible: false,
        trigger: { type: "on_load" },
        components: [],
      },
    ]);
    const updated = makeScreenRow({ overlays: overlaysJson });
    db.screen.update.mockResolvedValue(updated);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ overlays: overlaysJson }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.overlays).toBe(overlaysJson);
    expect(db.screen.update).toHaveBeenCalledWith({
      where: { id: "uuid-1" },
      data: expect.objectContaining({
        overlays: overlaysJson,
      }),
    });
  });

  it("clears overlays when null is sent", async () => {
    // Setup
    const db = createMockDb();
    const existing = makeScreenRow({
      overlays:
        '[{"id":"ov1","style":"modal","dismissible":true,"trigger":{"type":"manual"},"components":[]}]',
    });
    db.screen.findUnique.mockResolvedValue(existing);
    const updated = makeScreenRow({ overlays: null });
    db.screen.update.mockResolvedValue(updated);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ overlays: null }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.overlays).toBeNull();
    expect(db.screen.update).toHaveBeenCalledWith({
      where: { id: "uuid-1" },
      data: expect.objectContaining({
        overlays: null,
      }),
    });
  });

  it("does not touch overlays when field is omitted from payload", async () => {
    // Setup
    const db = createMockDb();
    const existing = makeScreenRow({ overlays: '[{"id":"ov1"}]' });
    db.screen.findUnique.mockResolvedValue(existing);
    db.screen.update.mockResolvedValue(existing);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: false }),
    });

    // Assert
    expect(res.status).toBe(200);
    const updateData = db.screen.update.mock.calls[0]![0] as {
      data: Record<string, unknown>;
    };
    expect(updateData.data).not.toHaveProperty("overlays");
  });
});

// ---------------------------------------------------------------------------
// GET /screens/:id — returns overlays
// ---------------------------------------------------------------------------

describe("GET /:id (includes overlays)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns overlays in the screen record", async () => {
    // Setup
    const db = createMockDb();
    const overlaysJson = '[{"id":"ov1","style":"modal"}]';
    const row = makeScreenRow({ overlays: overlaysJson });
    db.screen.findUnique.mockResolvedValue(row);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1");
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.overlays).toBe(overlaysJson);
  });

  it("returns null overlays when screen has no overlays", async () => {
    // Setup
    const db = createMockDb();
    const row = makeScreenRow({ overlays: null });
    db.screen.findUnique.mockResolvedValue(row);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1");
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.overlays).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// POST /screens/:id/duplicate
// ---------------------------------------------------------------------------

describe("POST /:id/duplicate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("duplicates a screen with '-copy' suffix as a draft", async () => {
    // Setup
    const db = createMockDb();
    const original = makeScreenRow();
    db.screen.findUnique.mockResolvedValue(original);
    db.screen.findMany.mockResolvedValue([{ screenId: "home" }]);
    const created = makeScreenRow({
      id: "uuid-new",
      screenId: "home-copy",
      published: false,
    });
    db.screen.create.mockResolvedValue(created);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/duplicate", { method: "POST" });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.screenId).toBe("home-copy");
    expect(body.published).toBe(false);
    expect(db.screen.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        screenId: "home-copy",
        brand: "brand_a",
        published: false,
      }),
    });
  });

  it("increments suffix when '-copy' already exists", async () => {
    // Setup
    const db = createMockDb();
    const original = makeScreenRow();
    db.screen.findUnique.mockResolvedValue(original);
    db.screen.findMany.mockResolvedValue([
      { screenId: "home" },
      { screenId: "home-copy" },
    ]);
    const created = makeScreenRow({
      id: "uuid-new",
      screenId: "home-copy-2",
      published: false,
    });
    db.screen.create.mockResolvedValue(created);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/duplicate", { method: "POST" });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.screenId).toBe("home-copy-2");
  });

  it("returns 404 when the source screen does not exist", async () => {
    // Setup
    const db = createMockDb();
    db.screen.findUnique.mockResolvedValue(null);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/nonexistent/duplicate", { method: "POST" });

    // Assert
    expect(res.status).toBe(404);
    expect(db.screen.create).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// POST /screens/:id/copy-to-brands
// ---------------------------------------------------------------------------

describe("POST /:id/copy-to-brands", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies a screen to multiple brands with original screenId when no conflict", async () => {
    // Setup
    const db = createMockDb();
    const original = makeScreenRow({ brand: "brand_a" });
    db.screen.findUnique.mockResolvedValue(original);
    db.screen.findMany.mockResolvedValue([]);

    let callIdx = 0;
    db.screen.create.mockImplementation(() => {
      callIdx++;
      const brand = callIdx === 1 ? "brand_b" : "brand_c";
      return Promise.resolve(
        makeScreenRow({
          id: `uuid-${callIdx}`,
          brand,
          published: false,
        }),
      );
    });

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands: ["brand_b", "brand_c"] }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.created).toHaveLength(2);
    expect(body.skipped).toHaveLength(0);
    expect(body.created[0].brand).toBe("brand_b");
    expect(body.created[1].brand).toBe("brand_c");
    expect(body.created[0].published).toBe(false);
    expect(db.screen.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ screenId: "home" }),
      }),
    );
  });

  it("auto-suffixes screenId when the name conflicts in the target brand", async () => {
    // Setup
    const db = createMockDb();
    const original = makeScreenRow({ brand: "brand_a" });
    db.screen.findUnique.mockResolvedValue(original);
    db.screen.findMany.mockResolvedValue([{ screenId: "home" }]);
    db.screen.create.mockResolvedValue(
      makeScreenRow({
        id: "uuid-new",
        screenId: "home-copy",
        brand: "brand_b",
        published: false,
      }),
    );

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands: ["brand_b"] }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.created).toHaveLength(1);
    expect(body.created[0].screenId).toBe("home-copy");
    expect(body.created[0].brand).toBe("brand_b");
    expect(db.screen.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        screenId: "home-copy",
        brand: "brand_b",
      }),
    });
  });

  it("increments suffix when '-copy' also exists in target brand", async () => {
    // Setup
    const db = createMockDb();
    const original = makeScreenRow({ brand: "brand_a" });
    db.screen.findUnique.mockResolvedValue(original);
    db.screen.findMany.mockResolvedValue([
      { screenId: "home" },
      { screenId: "home-copy" },
    ]);
    db.screen.create.mockResolvedValue(
      makeScreenRow({
        id: "uuid-new",
        screenId: "home-copy-2",
        brand: "brand_b",
        published: false,
      }),
    );

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands: ["brand_b"] }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.created[0].screenId).toBe("home-copy-2");
    expect(db.screen.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ screenId: "home-copy-2" }),
    });
  });

  it("skips the source brand with reason 'same_as_source'", async () => {
    // Setup
    const db = createMockDb();
    const original = makeScreenRow({ brand: "brand_a" });
    db.screen.findUnique.mockResolvedValue(original);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands: ["brand_a"] }),
    });
    const body = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(body.created).toHaveLength(0);
    expect(body.skipped).toEqual([
      { brand: "brand_a", reason: "same_as_source" },
    ]);
    expect(db.screen.findMany).not.toHaveBeenCalled();
  });

  it("returns 400 for an empty brands array", async () => {
    // Setup
    const db = createMockDb();
    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands: [] }),
    });

    // Assert
    expect(res.status).toBe(400);
    expect(db.screen.findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 when the source screen does not exist", async () => {
    // Setup
    const db = createMockDb();
    db.screen.findUnique.mockResolvedValue(null);

    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brands: ["brand_b"] }),
    });

    // Assert
    expect(res.status).toBe(404);
    expect(db.screen.create).not.toHaveBeenCalled();
  });

  it("returns 400 when body is missing", async () => {
    // Setup
    const db = createMockDb();
    const app = createScreensRoutes(db as never);

    // Act
    const res = await app.request("/uuid-1/copy-to-brands", {
      method: "POST",
    });

    // Assert
    expect(res.status).toBe(400);
  });
});
