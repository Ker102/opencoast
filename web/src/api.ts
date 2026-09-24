import type {
  Geometry,
  ProposalInput,
  RecordCollection,
  RecordFeature,
  ReviewInput,
} from '@opencoast/shared';

export const API_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '/api' : 'http://localhost:4000');

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', ...init });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
  return body as T;
}

export function getRecords(bbox: string, signal?: AbortSignal) {
  return json<RecordCollection>(`/records?bbox=${encodeURIComponent(bbox)}`, { signal });
}
export function getHistory(id: string) {
  return json<{ revisions: Array<{ revision: number; editedAt: string; feature: RecordFeature }> }>(
    `/records/${id}/history`,
  );
}
export function getPublicEvidence(id: string) {
  return json<{ evidence: Array<{ id: string; name: string; url: string }> }>(
    `/records/${id}/evidence`,
  );
}
export function submitProposal(proposal: ProposalInput) {
  return json<{ id: string; receiptToken: string }>('/proposals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proposal),
  });
}
export interface Receipt {
  id: string;
  status: string;
  kind: ProposalInput['kind'];
  geometry: Geometry;
  title: string;
  summary: string;
  description: string;
  reviewMessage: string | null;
  createdAt: string;
  updatedAt: string;
  messages: Array<{ sender: string; message: string; createdAt: string }>;
}
export function getReceipt(id: string, token: string) {
  return json<Receipt>(`/proposals/${id}/receipt`, { headers: { 'x-receipt-token': token } });
}
export function replyToModerator(id: string, token: string, message: string) {
  return json<{ ok: boolean }>(`/proposals/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-receipt-token': token },
    body: JSON.stringify({ message }),
  });
}
export async function uploadEvidence(
  id: string,
  token: string,
  file: File,
  publishConsent: boolean,
) {
  const form = new FormData();
  form.append('file', file);
  return json<{ id: string; name: string }>(
    `/proposals/${id}/evidence?publishConsent=${publishConsent}`,
    { method: 'POST', headers: { 'x-receipt-token': token }, body: form },
  );
}
export interface ModerationProposal extends ProposalInput {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reviewMessage: string | null;
  messages: Array<{ sender: string; message: string; createdAt: string }>;
  evidence: Array<{
    id: string;
    name: string;
    contentType: string;
    byteSize: number;
    publishConsent: boolean;
  }>;
  nearbyRecords: Array<{
    id: string;
    title: string;
    kind: string;
    accessStatus: string;
    distanceMeters: number;
    geometry: Geometry;
  }>;
  nearbyProposals: Array<{ id: string; title: string; status: string; distanceMeters: number }>;
}
export function moderatorMe() {
  return json<{ moderator: boolean }>('/moderation/me');
}
export function moderatorLogin(email: string, password: string) {
  return json<{ ok: boolean }>('/moderation/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}
export function moderatorLogout() {
  return json<{ ok: boolean }>('/moderation/logout', { method: 'POST' });
}
export function moderationQueue() {
  return json<{ proposals: ModerationProposal[] }>('/moderation/proposals');
}
export function moderationProposal(id: string) {
  return json<ModerationProposal>(`/moderation/proposals/${id}`);
}
export function submitReview(id: string, review: ReviewInput) {
  return json<{ status: string; recordId?: string }>(`/moderation/proposals/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
}
export function saveModeratorEdit(id: string, proposal: ProposalInput, reason: string) {
  return json<{ ok: boolean }>(`/moderation/proposals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposal, reason }),
  });
}
