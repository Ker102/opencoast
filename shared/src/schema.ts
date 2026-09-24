import { z } from 'zod';

const longitude = z.number().finite().min(-180).max(180);
const latitude = z.number().finite().min(-90).max(90);
const position = z.tuple([longitude, latitude]);
const distinct = (points: [number, number][]) => new Set(points.map((p) => p.join(','))).size;

export const pointGeometry = z.object({ type: z.literal('Point'), coordinates: position });
export const lineGeometry = z
  .object({ type: z.literal('LineString'), coordinates: z.array(position).min(2).max(500) })
  .refine((g) => distinct(g.coordinates) >= 2, 'A route needs two distinct points');
export const polygonGeometry = z
  .object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(position).min(4).max(500)).min(1).max(1),
  })
  .refine((g) => {
    const ring = g.coordinates[0];
    return (
      distinct(ring) >= 3 &&
      ring[0][0] === ring[ring.length - 1][0] &&
      ring[0][1] === ring[ring.length - 1][1]
    );
  }, 'An area needs a closed ring with three distinct points');
export const geometrySchema = z.union([pointGeometry, lineGeometry, polygonGeometry]);
export const geometryKindSchema = z.enum(['area', 'route', 'point']);
export const accessStatusSchema = z.enum([
  'allowed',
  'conditional',
  'restricted',
  'disputed',
  'unknown',
]);
export const evidenceLevelSchema = z.enum(['document_backed', 'community_reviewed']);
export const landRouteStatusSchema = z.enum(['verified', 'not_verified', 'not_applicable']);
export const sourceSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z
    .url()
    .refine(
      (url) => ['http:', 'https:'].includes(new URL(url).protocol),
      'Only HTTP(S) links are accepted',
    ),
  kind: z.enum(['official', 'other']),
});

export const proposalInputSchema = z
  .object({
    targetRecordId: z.uuid().optional(),
    kind: geometryKindSchema,
    geometry: geometrySchema,
    title: z.string().trim().min(3).max(160),
    summary: z.string().trim().min(10).max(500),
    description: z.string().trim().min(10).max(10000),
    jurisdiction: z.string().trim().min(2).max(160),
    localCategory: z.string().trim().max(120).default(''),
    accessStatus: accessStatusSchema,
    allowedActivities: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
    conditions: z.string().trim().max(3000).default(''),
    landRouteStatus: landRouteStatusSchema.default('not_verified'),
    sources: z.array(sourceSchema).max(20).default([]),
    observedAt: z.iso.date().optional(),
  })
  .superRefine((value, context) => {
    const type = { area: 'Polygon', route: 'LineString', point: 'Point' }[value.kind];
    if (value.geometry.type !== type)
      context.addIssue({
        code: 'custom',
        path: ['geometry'],
        message: `${value.kind} needs ${type} geometry`,
      });
    if (value.kind === 'area' && value.landRouteStatus === 'verified')
      context.addIssue({
        code: 'custom',
        path: ['landRouteStatus'],
        message:
          'A verified route must be linked to a separate reviewed route record; this is not available yet',
      });
  });

export const reviewInputSchema = z
  .object({
    action: z.enum(['approve', 'reject', 'clarification']),
    explanation: z.string().trim().min(10).max(3000),
    evidenceLevel: evidenceLevelSchema.optional(),
    reviewedSources: z.boolean().default(false),
    publishEvidenceIds: z.array(z.uuid()).max(10).default([]),
  })
  .superRefine((value, context) => {
    if (value.action === 'approve' && !value.evidenceLevel)
      context.addIssue({
        code: 'custom',
        path: ['evidenceLevel'],
        message: 'Evidence level is required for approval',
      });
  });

export const routeLinkInputSchema = z
  .object({
    routeIds: z.array(z.uuid()).max(20),
    reason: z.string().trim().min(10).max(1000),
  })
  .superRefine((value, context) => {
    if (new Set(value.routeIds).size !== value.routeIds.length)
      context.addIssue({
        code: 'custom',
        path: ['routeIds'],
        message: 'Select each route only once',
      });
  });

export type Geometry = z.infer<typeof geometrySchema>;
export type ProposalInput = z.infer<typeof proposalInputSchema>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type RouteLinkInput = z.infer<typeof routeLinkInputSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type AccessStatus = z.infer<typeof accessStatusSchema>;
export type EvidenceLevel = z.infer<typeof evidenceLevelSchema>;

export interface PublicRecord extends ProposalInput {
  id: string;
  revision: number;
  linkedRouteIds: string[];
  evidenceLevel: EvidenceLevel;
  moderatorExplanation: string;
  lastEditedAt: string;
  lastReviewedAt: string | null;
  geometryPrecision: 'approximate' | 'surveyed';
}

export interface RecordFeature {
  type: 'Feature';
  geometry: Geometry;
  properties: Omit<PublicRecord, 'geometry'>;
}
export interface RecordCollection {
  type: 'FeatureCollection';
  features: RecordFeature[];
}
