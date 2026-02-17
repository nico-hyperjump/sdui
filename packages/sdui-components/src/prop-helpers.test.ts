import { describe, it, expect } from "vitest";
import { propStr, propNum, propBool, propArr } from "./prop-helpers";

describe("propStr", () => {
  it("returns string value when key exists", () => {
    // Act
    const result = propStr({ name: "hello" }, "name");

    // Assert
    expect(result).toBe("hello");
  });

  it("returns empty string when key is missing", () => {
    // Act
    const result = propStr({}, "name");

    // Assert
    expect(result).toBe("");
  });

  it("returns empty string when value is not a string", () => {
    // Act
    const result = propStr({ name: 123 }, "name");

    // Assert
    expect(result).toBe("");
  });

  it("returns empty string when props is undefined", () => {
    // Act
    const result = propStr(undefined, "name");

    // Assert
    expect(result).toBe("");
  });
});

describe("propNum", () => {
  it("returns numeric value when key exists", () => {
    // Act
    const result = propNum({ count: 42 }, "count");

    // Assert
    expect(result).toBe(42);
  });

  it("returns 0 when key is missing", () => {
    // Act
    const result = propNum({}, "count");

    // Assert
    expect(result).toBe(0);
  });

  it("returns 0 when value is not a number", () => {
    // Act
    const result = propNum({ count: "abc" }, "count");

    // Assert
    expect(result).toBe(0);
  });

  it("returns 0 when props is undefined", () => {
    // Act
    const result = propNum(undefined, "count");

    // Assert
    expect(result).toBe(0);
  });
});

describe("propBool", () => {
  it("returns true when value is true", () => {
    // Act
    const result = propBool({ active: true }, "active");

    // Assert
    expect(result).toBe(true);
  });

  it("returns false when value is false", () => {
    // Act
    const result = propBool({ active: false }, "active");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when key is missing", () => {
    // Act
    const result = propBool({}, "active");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when value is not a boolean", () => {
    // Act
    const result = propBool({ active: "yes" }, "active");

    // Assert
    expect(result).toBe(false);
  });

  it("returns false when props is undefined", () => {
    // Act
    const result = propBool(undefined, "active");

    // Assert
    expect(result).toBe(false);
  });
});

describe("propArr", () => {
  it("returns array when value is an array", () => {
    // Act
    const result = propArr({ items: [1, 2, 3] }, "items");

    // Assert
    expect(result).toEqual([1, 2, 3]);
  });

  it("returns empty array when key is missing", () => {
    // Act
    const result = propArr({}, "items");

    // Assert
    expect(result).toEqual([]);
  });

  it("returns empty array when value is not an array", () => {
    // Act
    const result = propArr({ items: "not-array" }, "items");

    // Assert
    expect(result).toEqual([]);
  });

  it("returns empty array when props is undefined", () => {
    // Act
    const result = propArr(undefined, "items");

    // Assert
    expect(result).toEqual([]);
  });
});
