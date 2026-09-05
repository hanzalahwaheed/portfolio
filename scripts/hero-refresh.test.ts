import assert from "node:assert/strict"
import test from "node:test"
import { runInNewContext } from "node:vm"
import { heroInitScript } from "@/lib/hero-themes"

function renderDocument(
  storage: { getItem: () => string | null; setItem: (key: string, value: string) => void },
) {
  const attributes = new Map<string, string>()
  runInNewContext(heroInitScript, {
    localStorage: storage,
    document: { documentElement: { setAttribute: (key: string, value: string) => attributes.set(key, value) } },
  })
  return attributes.get("data-hero")
}

test("each new document selects the next hero before hydration", () => {
  let next: string | null = null
  const storage = {
    getItem: () => next,
    setItem: (_key: string, value: string) => {
      next = value
    },
  }
  assert.deepEqual(
    Array.from({ length: 4 }, () => renderDocument(storage)),
    ["0", "1", "2", "0"],
  )
})

test("invalid stored values fall back to the first hero", () => {
  for (const value of ["-1", "NaN", "Infinity", "1.5", "9007199254740992", "garbage"]) {
    assert.equal(renderDocument({ getItem: () => value, setItem: () => {} }), "0")
  }
})

test("unavailable storage cannot prevent rendering", () => {
  assert.equal(
    renderDocument({
      getItem: () => {
        throw new Error("blocked")
      },
      setItem: () => {},
    }),
    "0",
  )
  assert.equal(
    renderDocument({
      getItem: () => "2",
      setItem: () => {
        throw new Error("read only")
      },
    }),
    "2",
  )
})

test("stored indices wrap around the available backgrounds", () => {
  assert.equal(renderDocument({ getItem: () => "5", setItem: () => {} }), "2")
})
