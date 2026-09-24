import { describe, expect, it } from 'vitest';
import { proposalInputSchema, reviewInputSchema } from './schema.js';

const base = {
  title: 'Open path to shore',
  summary: 'A signed walking path reaches the beach.',
  description: 'A marked path runs from the street to the shoreline.',
  jurisdiction: 'Example jurisdiction',
  accessStatus: 'allowed',
};

describe('proposal geometry', () => {
  it.each([
    ['point', { type: 'Point', coordinates: [19.2, 42.1] }],
    [
      'route',
      {
        type: 'LineString',
        coordinates: [
          [19.2, 42.1],
          [19.3, 42.2],
        ],
      },
    ],
    [
      'area',
      {
        type: 'Polygon',
        coordinates: [
          [
            [19.2, 42.1],
            [19.3, 42.1],
            [19.3, 42.2],
            [19.2, 42.1],
          ],
        ],
      },
    ],
  ])('accepts %s', (kind, geometry) => {
    expect(proposalInputSchema.safeParse({ ...base, kind, geometry }).success).toBe(true);
  });
  it('rejects a mismatched kind and open polygon', () => {
    expect(
      proposalInputSchema.safeParse({
        ...base,
        kind: 'area',
        geometry: { type: 'Point', coordinates: [19, 42] },
      }).success,
    ).toBe(false);
    expect(
      proposalInputSchema.safeParse({
        ...base,
        kind: 'area',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [19, 42],
              [20, 42],
              [20, 43],
              [21, 44],
            ],
          ],
        },
      }).success,
    ).toBe(false);
  });
  it('accepts a proposal without a source, but requires an evidence level on approval', () => {
    expect(
      proposalInputSchema.safeParse({
        ...base,
        kind: 'point',
        geometry: { type: 'Point', coordinates: [19, 42] },
      }).success,
    ).toBe(true);
    expect(
      reviewInputSchema.safeParse({
        action: 'approve',
        explanation: 'Checked against submitted details.',
      }).success,
    ).toBe(false);
  });
});
