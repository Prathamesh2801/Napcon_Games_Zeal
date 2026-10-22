import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canPlace, shuffle } from './utils.js'

test('canPlace: right slot only, free slot only, strict order respected', () => {
  const slotOrder = ['1', '2', '3']
  const t2 = { id: 'b', slot: '2' }
  const distractor = { id: 'x', slot: null }

  assert.equal(canPlace(t2, '2', { placed: {}, slotOrder, strictOrder: false }), true)
  assert.equal(canPlace(t2, '3', { placed: {}, slotOrder, strictOrder: false }), false)
  assert.equal(canPlace(t2, '2', { placed: { 2: {} }, slotOrder, strictOrder: false }), false)
  assert.equal(canPlace(t2, '2', { placed: {}, slotOrder, strictOrder: true }), false)
  assert.equal(canPlace(t2, '2', { placed: { 1: {} }, slotOrder, strictOrder: true }), true)
  assert.equal(canPlace(distractor, '1', { placed: {}, slotOrder, strictOrder: false }), false)

  const twin = { id: 'y', slot: ['1', '3'] }
  assert.equal(canPlace(twin, '3', { placed: {}, slotOrder, strictOrder: false }), true)
  assert.equal(canPlace(twin, '2', { placed: {}, slotOrder, strictOrder: false }), false)
  assert.equal(canPlace(twin, '1', { placed: { 1: {} }, slotOrder, strictOrder: false }), false)
})

test('shuffle keeps every item', () => {
  assert.deepEqual([...shuffle([1, 2, 3, 4])].sort(), [1, 2, 3, 4])
})
