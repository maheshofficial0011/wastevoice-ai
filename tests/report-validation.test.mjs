import assert from "node:assert/strict"
import test from "node:test"

import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  validateFile,
  validateReportDetails,
} from "../src/lib/reportValidation.ts"

const file = (type, size) => ({ type, size })

test("FORM-01 accepts supported image under 10 MB", () => {
  assert.equal(validateFile(file("image/png", 1024)), null)
})

test("FORM-02 rejects unsupported image type", () => {
  assert.match(validateFile(file("image/gif", 1024)), /JPG, PNG or WebP/)
  assert.equal(ACCEPTED_TYPES.length, 3)
})

test("FORM-03 rejects image larger than 10 MB", () => {
  assert.match(validateFile(file("image/jpeg", MAX_FILE_SIZE + 1)), /10 MB/)
})

test("FORM-04 rejects missing location", () => {
  assert.match(
    validateReportDetails({
      location: "   ",
      description: "Plastic waste near the path.",
      additionalInfo: "",
    }),
    /waste location/i,
  )
})

test("FORM-05 rejects overly short location", () => {
  assert.match(
    validateReportDetails({
      location: "ab",
      description: "Plastic waste near the path.",
      additionalInfo: "",
    }),
    /specific location/i,
  )
})

test("FORM-06 rejects short description", () => {
  assert.match(
    validateReportDetails({
      location: "Campus Park",
      description: "Too short.",
      additionalInfo: "",
    }),
    /more detail/i,
  )
})

test("FORM-07 rejects additional information over 1000 characters", () => {
  assert.match(
    validateReportDetails({
      location: "Campus Park",
      description: "Plastic waste near the walking path.",
      additionalInfo: "x".repeat(1001),
    }),
    /1000 characters/i,
  )
})

test("FORM-08 accepts valid bounded report details", () => {
  assert.equal(
    validateReportDetails({
      location: "Campus Park near the walking path",
      description: "Plastic bottles and wrappers are collected beside the walking path.",
      additionalInfo: "Near the east entrance.",
    }),
    null,
  )
})
