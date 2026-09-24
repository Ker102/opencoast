import { useEffect, useState } from 'react';
import { ArrowLeft, Check, ExternalLink, LockKeyhole, RefreshCw } from 'lucide-react';
import type { Geometry, ProposalInput, RecordFeature, ReviewInput } from '@opencoast/shared';
import RouteManager from './RouteManager';
import {
  API_URL,
  moderationProposal,
  moderationQueue,
  moderatorLogin,
  moderatorLogout,
  moderatorMe,
  saveModeratorEdit,
  submitReview,
  type ModerationProposal,
} from './api';

export default function Moderation({
  onBack,
  onFocus,
  onPublished,
  routeArea,
}: {
  onBack: () => void;
  onFocus: (geometry: Geometry) => void;
  onPublished: () => void;
  routeArea: RecordFeature | null;
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [queue, setQueue] = useState<ModerationProposal[]>([]);
  const [selected, setSelected] = useState<ModerationProposal | null>(null);
  const [edited, setEdited] = useState<ModerationProposal | null>(null);
  const [editReason, setEditReason] = useState('');
  const [action, setAction] = useState<ReviewInput['action']>('approve');
  const [explanation, setExplanation] = useState('');
  const [evidenceLevel, setEvidenceLevel] =
    useState<NonNullable<ReviewInput['evidenceLevel']>>('community_reviewed');
  const [reviewedSources, setReviewedSources] = useState(false);
  const [publishIds, setPublishIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const loadQueue = () =>
    moderationQueue()
      .then((data) => setQueue(data.proposals))
      .catch((e) => setError(e.message));
  useEffect(() => {
    moderatorMe()
      .then(({ moderator }) => {
        setSignedIn(moderator);
        if (moderator) loadQueue();
      })
      .catch(() => setSignedIn(false));
  }, []);
  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await moderatorLogin(email, password);
      setSignedIn(true);
      setPassword('');
      await loadQueue();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };
  const open = async (id: string) => {
    setError('');
    try {
      const proposal = await moderationProposal(id);
      setSelected(proposal);
      setEdited(proposal);
      setPublishIds([]);
      setExplanation('');
      setEditReason('');
      setAction('approve');
      setReviewedSources(false);
      onFocus(proposal.geometry);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open proposal');
    }
  };
  const saveEdit = async () => {
    if (!selected || !edited) return;
    setBusy(true);
    setError('');
    try {
      const proposal: ProposalInput = {
        kind: edited.kind,
        geometry: edited.geometry,
        title: edited.title,
        summary: edited.summary,
        description: edited.description,
        jurisdiction: edited.jurisdiction,
        localCategory: edited.localCategory,
        accessStatus: edited.accessStatus,
        allowedActivities: edited.allowedActivities,
        conditions: edited.conditions,
        landRouteStatus: edited.landRouteStatus,
        sources: edited.sources,
        ...(edited.observedAt ? { observedAt: edited.observedAt } : {}),
        ...(edited.targetRecordId ? { targetRecordId: edited.targetRecordId } : {}),
      };
      await saveModeratorEdit(selected.id, proposal, editReason);
      await open(selected.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save edit');
    } finally {
      setBusy(false);
    }
  };
  const review = async () => {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      await submitReview(selected.id, {
        action,
        explanation,
        evidenceLevel: action === 'approve' ? evidenceLevel : undefined,
        reviewedSources,
        publishEvidenceIds: action === 'approve' ? publishIds : [],
      });
      setSelected(null);
      setEdited(null);
      await loadQueue();
      onPublished();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not complete review');
    } finally {
      setBusy(false);
    }
  };
  if (signedIn === null)
    return (
      <section className="moderation">
        <p>Checking moderator session…</p>
      </section>
    );
  if (!signedIn)
    return (
      <section className="moderation">
        <button className="text-button back-link" onClick={onBack}>
          <ArrowLeft size={18} /> Back to map
        </button>
        <div className="eyebrow">Moderator desk</div>
        <h2>Review sign in</h2>
        <p>Only invited moderators can publish access claims.</p>
        <form onSubmit={signIn}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button className="primary-button full-width" disabled={busy}>
            <LockKeyhole size={17} />
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>
    );
  if (routeArea)
    return (
      <RouteManager area={routeArea} onBack={onBack} onFocus={onFocus} onSaved={onPublished} />
    );
  return (
    <section className="moderation">
      <button
        className="text-button back-link"
        onClick={
          selected
            ? () => {
                setSelected(null);
                setEdited(null);
              }
            : onBack
        }
      >
        <ArrowLeft size={18} />
        {selected ? 'Review queue' : 'Back to map'}
      </button>
      <div className="eyebrow">Moderator desk</div>
      <h2>{selected ? 'Review submission' : 'Review queue'}</h2>
      {!selected ? (
        <>
          <p>
            {queue.length} proposal{queue.length === 1 ? '' : 's'} awaiting a decision
          </p>
          <button className="text-button" onClick={loadQueue}>
            <RefreshCw size={16} /> Refresh
          </button>
          <div className="queue-list">
            {queue.map((proposal) => (
              <button key={proposal.id} className="queue-item" onClick={() => open(proposal.id)}>
                <strong>{proposal.title}</strong>
                <span>
                  {proposal.jurisdiction} · {proposal.kind}
                </span>
                <small>
                  {new Date(proposal.createdAt).toLocaleDateString()} · {proposal.status}
                </small>
              </button>
            ))}
            {queue.length === 0 && (
              <div className="empty-queue">
                <Check size={24} />
                <p>Nothing is waiting for review.</p>
              </div>
            )}
          </div>
          <button
            className="text-button"
            onClick={async () => {
              await moderatorLogout();
              setSignedIn(false);
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <div className="notice">
            <LockKeyhole size={18} />
            This proposal and its raw files are private until approval. Check location, sources,
            wording, and consent carefully.
          </div>
          <p className="place-label">
            {selected.jurisdiction} · {selected.kind} · {selected.status}
          </p>
          <div className="detail-block">
            <h3>Contributor description</h3>
            <p>{selected.description}</p>
          </div>
          {selected.sources.length > 0 ? (
            <div className="detail-block">
              <h3>Submitted sources</h3>
              {selected.sources.map((source, index) => (
                <p key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.title} <ExternalLink size={14} />
                  </a>
                  <br />
                  <small>{source.kind}</small>
                </p>
              ))}
            </div>
          ) : (
            <div className="notice">
              No source link supplied. Approval must be labeled “No official source verified”.
            </div>
          )}
          {selected.messages.length > 0 && (
            <div className="detail-block">
              <h3>Conversation</h3>
              {selected.messages.map((m, index) => (
                <p key={index}>
                  <strong>{m.sender}:</strong> {m.message}
                </p>
              ))}
            </div>
          )}
          <div className="detail-block">
            <h3>Nearby records and proposals</h3>
            {selected.nearbyRecords.length === 0 && selected.nearbyProposals.length === 0 ? (
              <p>
                No nearby item was found within 2 km. Still inspect the map for overlapping or
                related claims.
              </p>
            ) : (
              <>
                {selected.nearbyRecords.map((record) => (
                  <button
                    className="nearby-item"
                    key={record.id}
                    onClick={() => onFocus(record.geometry)}
                  >
                    <strong>{record.title}</strong>
                    <small>
                      Published {record.kind} · {record.accessStatus} · {record.distanceMeters} m
                      away
                    </small>
                  </button>
                ))}
                {selected.nearbyProposals.map((proposal) => (
                  <button
                    className="nearby-item"
                    key={proposal.id}
                    onClick={() => open(proposal.id)}
                  >
                    <strong>{proposal.title}</strong>
                    <small>
                      {proposal.status} proposal · {proposal.distanceMeters} m away
                    </small>
                  </button>
                ))}
              </>
            )}
          </div>
          {selected.evidence.length > 0 && (
            <div className="detail-block">
              <h3>Private evidence</h3>
              {selected.evidence.map((file) => (
                <label key={file.id} className="evidence-choice">
                  <input
                    type="checkbox"
                    checked={publishIds.includes(file.id)}
                    disabled={!file.publishConsent || !file.contentType.startsWith('image/')}
                    onChange={(e) =>
                      setPublishIds((ids) =>
                        e.target.checked ? [...ids, file.id] : ids.filter((id) => id !== file.id),
                      )
                    }
                  />
                  <span>
                    <a
                      href={`${API_URL}/moderation/proposals/${selected.id}/evidence/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.name} <ExternalLink size={14} />
                    </a>
                    <small>
                      {file.contentType} · {Math.round(file.byteSize / 1024)} KB ·{' '}
                      {file.publishConsent ? 'Contributor permitted a public copy' : 'Private only'}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="form-divider" />
          <h3>Edit for clarity</h3>
          <p>Every change requires a reason and is kept in the audit trail.</p>
          <label>
            Title
            <input
              value={edited?.title ?? ''}
              onChange={(e) => setEdited((p) => (p ? { ...p, title: e.target.value } : p))}
            />
          </label>
          <label>
            Summary
            <textarea
              rows={3}
              value={edited?.summary ?? ''}
              onChange={(e) => setEdited((p) => (p ? { ...p, summary: e.target.value } : p))}
            />
          </label>
          <label>
            Description
            <textarea
              rows={5}
              value={edited?.description ?? ''}
              onChange={(e) => setEdited((p) => (p ? { ...p, description: e.target.value } : p))}
            />
          </label>
          <label>
            Conditions
            <textarea
              rows={3}
              value={edited?.conditions ?? ''}
              onChange={(e) => setEdited((p) => (p ? { ...p, conditions: e.target.value } : p))}
            />
          </label>
          <label>
            Reason for edit
            <input
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder="Explain what changed and why"
            />
          </label>
          <button
            className="secondary-button full-width"
            disabled={busy || editReason.trim().length < 10}
            onClick={saveEdit}
          >
            Save edited wording
          </button>
          <div className="form-divider" />
          <h3>Decision</h3>
          <label>
            Action
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as ReviewInput['action'])}
            >
              <option value="approve">Approve and publish</option>
              <option value="clarification">Ask for clarification</option>
              <option value="reject">Reject</option>
            </select>
          </label>
          {action === 'approve' && (
            <>
              <label>
                Evidence label
                <select
                  value={evidenceLevel}
                  onChange={(e) =>
                    setEvidenceLevel(e.target.value as NonNullable<ReviewInput['evidenceLevel']>)
                  }
                >
                  <option value="community_reviewed">
                    Community reviewed, no official source verified
                  </option>
                  <option value="document_backed">Document backed</option>
                </select>
              </label>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={reviewedSources}
                  onChange={(e) => setReviewedSources(e.target.checked)}
                />
                I checked the source links against this claim and geometry.
              </label>
              {publishIds.length > 0 && (
                <div className="notice">
                  Inspect selected images for faces, personal details, and publishing rights before
                  approving.
                </div>
              )}
            </>
          )}
          <label>
            Decision explanation
            <textarea
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the reasoning, limits, and what sources were checked"
            />
          </label>
          <button
            className="primary-button full-width"
            disabled={busy || explanation.trim().length < 10}
            onClick={review}
          >
            {busy
              ? 'Saving…'
              : action === 'approve'
                ? 'Approve and publish'
                : action === 'reject'
                  ? 'Reject proposal'
                  : 'Request clarification'}
          </button>
        </>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
