import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, History, Info, MapPinned } from 'lucide-react';
import type { RecordFeature } from '@opencoast/shared';
import { API_URL, getAreaRoutes, getHistory, getPublicEvidence } from './api';

const statusLabels: Record<string, string> = {
  allowed: 'Access allowed',
  conditional: 'Conditional access',
  restricted: 'Restricted access',
  disputed: 'Access disputed',
  unknown: 'Status unknown',
};
const date = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value))
    : 'Not yet reviewed against sources';

export default function RecordDetail({
  feature,
  onClose,
  onSuggest,
  onFocusRoute,
  onManageRoutes,
}: {
  feature: RecordFeature;
  onClose: () => void;
  onSuggest: () => void;
  onFocusRoute: (route: RecordFeature) => void;
  onManageRoutes: () => void;
}) {
  const p = feature.properties;
  const [history, setHistory] = useState<Array<{ revision: number; editedAt: string }>>([]);
  const [evidence, setEvidence] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [routes, setRoutes] = useState<RecordFeature[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => {
    let live = true;
    setRoutes([]);
    getHistory(p.id)
      .then((data) => {
        if (live) setHistory(data.revisions);
      })
      .catch(() => {});
    getPublicEvidence(p.id)
      .then((data) => {
        if (live) setEvidence(data.evidence);
      })
      .catch(() => {});
    if (p.kind === 'area')
      getAreaRoutes(p.id)
        .then((data) => {
          if (live) setRoutes(data.routes);
        })
        .catch(() => {});
    return () => {
      live = false;
    };
  }, [p.id]);
  return (
    <section className="record-detail" aria-label={`Access information for ${p.title}`}>
      <button className="text-button back-link" onClick={onClose}>
        <ArrowLeft size={18} /> Back to map
      </button>
      <div className="eyebrow">Reviewed coastal information</div>
      <h2>{p.title}</h2>
      <p className="place-label">
        <MapPinned size={17} />
        {p.jurisdiction}
        {p.localCategory ? ` · ${p.localCategory}` : ''}
      </p>
      <div className="badges">
        <span className={`status status-${p.accessStatus}`}>{statusLabels[p.accessStatus]}</span>
        <span
          className={`evidence-label ${p.evidenceLevel === 'community_reviewed' ? 'unverified' : ''}`}
        >
          {p.evidenceLevel === 'document_backed'
            ? 'Document backed'
            : 'No official source verified'}
        </span>
      </div>
      <p className="lead">{p.summary}</p>
      <p>{p.description}</p>
      {p.allowedActivities.length > 0 && (
        <div className="detail-block">
          <h3>Activities mentioned</h3>
          <p>{p.allowedActivities.join(' · ')}</p>
        </div>
      )}
      {p.conditions && (
        <div className="detail-block">
          <h3>Conditions and limits</h3>
          <p>{p.conditions}</p>
        </div>
      )}
      {p.kind === 'area' && (
        <>
          <div className="notice">
            <Info size={18} />
            {p.landRouteStatus === 'verified'
              ? 'A document-backed approach route is linked. Check its separate route record for conditions.'
              : routes.length
                ? 'Land route not verified. Linked route information exists, but no current document-backed allowed or conditional approach has been verified.'
                : 'Land route not verified. This area record does not establish a route from land.'}
          </div>
          <div className="detail-block">
            <h3>Approach routes</h3>
            {routes.length ? (
              <ul className="linked-routes">
                {routes.map((route) => (
                  <li key={route.properties.id}>
                    <button className="linked-route" onClick={() => onFocusRoute(route)}>
                      <strong>{route.properties.title}</strong>
                      <small>
                        {statusLabels[route.properties.accessStatus]} ·{' '}
                        {route.properties.evidenceLevel === 'document_backed'
                          ? 'Document backed'
                          : 'No official source verified'}
                      </small>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No separately reviewed approach route is linked to this area.</p>
            )}
            <button className="text-button" onClick={onManageRoutes}>
              Manage approach routes (moderators)
            </button>
          </div>
        </>
      )}
      {p.geometryPrecision === 'approximate' && (
        <div className="notice">
          <Info size={18} />
          Boundary drawn approximately; check the source for exact legal limits.
        </div>
      )}
      <div className="detail-block">
        <h3>Sources</h3>
        {p.sources.length ? (
          <ul className="source-list">
            {p.sources.map((source, index) => (
              <li key={`${source.url}-${index}`}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                  <ExternalLink size={14} />
                </a>
                <small>{source.kind === 'official' ? 'Official source' : 'Other source'}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No official source was provided. Read the review note before relying on this claim.</p>
        )}
      </div>
      <div className="detail-block">
        <h3>Review note</h3>
        <p>{p.moderatorExplanation}</p>
      </div>
      {evidence.length > 0 && (
        <div className="detail-block">
          <h3>Public evidence</h3>
          <div className="evidence-grid">
            {evidence.map((item) => (
              <a
                key={item.id}
                href={`${API_URL}${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={`${API_URL}${item.url}`} alt={item.name} />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      <dl className="dates">
        <div>
          <dt>Last edited</dt>
          <dd>{date(p.lastEditedAt)}</dd>
        </div>
        <div>
          <dt>Last reviewed against sources</dt>
          <dd>{date(p.lastReviewedAt)}</dd>
        </div>
      </dl>
      <button
        className="text-button history-toggle"
        onClick={() => setShowHistory(!showHistory)}
        aria-expanded={showHistory}
      >
        <History size={17} /> Revision history ({history.length})
      </button>
      {showHistory && (
        <ol className="history-list">
          {history.map((item) => (
            <li key={item.revision}>
              Revision {item.revision} · {date(item.editedAt)}
            </li>
          ))}
        </ol>
      )}
      <button className="secondary-button full-width" onClick={onSuggest}>
        Suggest a correction
      </button>
    </section>
  );
}
