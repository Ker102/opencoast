import { useEffect, useState } from 'react';
import { ArrowLeft, Check, MapPinned } from 'lucide-react';
import type { Geometry, RecordFeature } from '@opencoast/shared';
import { getRouteCandidates, saveRouteLinks, type RouteCandidate } from './api';

export default function RouteManager({
  area,
  onBack,
  onFocus,
  onSaved,
}: {
  area: RecordFeature;
  onBack: () => void;
  onFocus: (geometry: Geometry) => void;
  onSaved: () => void;
}) {
  const [candidates, setCandidates] = useState<RouteCandidate[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [originalIds, setOriginalIds] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const areaId = area.properties.id;
  useEffect(() => {
    let live = true;
    getRouteCandidates(areaId)
      .then(({ routes }) => {
        if (!live) return;
        const ids = routes.filter((route) => route.selected).map((route) => route.id);
        setCandidates(routes);
        setSelectedIds(ids);
        setOriginalIds(ids);
      })
      .catch((cause) => {
        if (live) setError(cause instanceof Error ? cause.message : 'Could not load routes');
      });
    return () => {
      live = false;
    };
  }, [areaId]);
  const changed = [...selectedIds].sort().join(',') !== [...originalIds].sort().join(',');
  const save = async () => {
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      await saveRouteLinks(areaId, selectedIds, reason);
      setOriginalIds(selectedIds);
      setReason('');
      setSaved(true);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save route links');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="moderation route-manager">
      <button className="text-button back-link" onClick={onBack}>
        <ArrowLeft size={18} /> Back to map
      </button>
      <div className="eyebrow">Moderator desk</div>
      <h2>Manage approach routes</h2>
      <p className="place-label">
        <MapPinned size={17} /> {area.properties.title} · {area.properties.jurisdiction}
      </p>
      <div className="notice">
        Select only separately reviewed routes that actually approach this area. A link never
        changes the area's use rights. Only a current document-backed allowed or conditional route
        can mark its land approach as verified.
      </div>
      <div className="detail-block">
        <h3>Reviewed routes nearby</h3>
        {candidates === null && !error && <p>Loading routes…</p>}
        {candidates?.length === 0 && (
          <p>No reviewed route within 2 km. Publish a separate route record before linking it.</p>
        )}
        {candidates?.map((candidate) => (
          <div className="route-choice" key={candidate.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(candidate.id)}
                onChange={(event) =>
                  setSelectedIds((ids) =>
                    event.target.checked
                      ? [...ids, candidate.id]
                      : ids.filter((id) => id !== candidate.id),
                  )
                }
              />
              <span>
                <strong>{candidate.title}</strong>
                <small>
                  {candidate.accessStatus} ·{' '}
                  {candidate.evidenceLevel === 'document_backed'
                    ? 'Document backed'
                    : 'No official source verified'}{' '}
                  · {candidate.distanceMeters} m away
                </small>
              </span>
            </label>
            <button className="text-button" onClick={() => onFocus(candidate.geometry)}>
              Show on map
            </button>
          </div>
        ))}
      </div>
      <label>
        Reason for changing links
        <textarea
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Explain the geometry and evidence checked"
        />
      </label>
      <button
        className="primary-button full-width"
        disabled={busy || !changed || reason.trim().length < 10}
        onClick={save}
      >
        {busy ? 'Saving…' : 'Save reviewed route links'}
      </button>
      {saved && (
        <div className="notice success" role="status">
          <Check size={18} /> Route links saved with an audit reason.
        </div>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
