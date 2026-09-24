import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CornerUpLeft,
  Info,
  MapPin,
  Route,
  Shapes,
  X,
} from 'lucide-react';
import {
  proposalInputSchema,
  type Geometry,
  type ProposalInput,
  type Source,
} from '@opencoast/shared';
import type { TerraDraw } from 'terra-draw';
import { submitProposal } from './api';

type Kind = ProposalInput['kind'];
const kindCopy: { kind: Kind; label: string; help: string; icon: typeof Shapes }[] = [
  {
    kind: 'area',
    label: 'Area',
    help: 'A part of beach, foreshore, or coastal land',
    icon: Shapes,
  },
  { kind: 'route', label: 'Route', help: 'A path to the shore or along it', icon: Route },
  { kind: 'point', label: 'Point', help: 'An entrance, gate, sign, or precise spot', icon: MapPin },
];
const blank = {
  title: '',
  summary: '',
  description: '',
  jurisdiction: '',
  localCategory: '',
  accessStatus: 'unknown' as const,
  allowedActivities: [],
  conditions: '',
  landRouteStatus: 'not_verified' as const,
  sources: [],
};

export default function Contribution({
  geometry,
  onKind,
  onClearGeometry,
  onClose,
  draw,
  targetRecordId,
  initialKind = 'area',
  onSubmitted,
}: {
  geometry: Geometry | null;
  onKind: (kind: Kind | null) => void;
  onClearGeometry: () => void;
  onClose: () => void;
  draw: TerraDraw | null;
  targetRecordId?: string;
  initialKind?: Kind;
  onSubmitted: (id: string, token: string) => void;
}) {
  const [kind, setKind] = useState<Kind>(initialKind);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...blank, title: '', summary: '', description: '' });
  const [sources, setSources] = useState<Source[]>([{ title: '', url: '', kind: 'official' }]);
  const [activities, setActivities] = useState('');
  const [observedAt, setObservedAt] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof form, value: string) =>
    setForm((prior) => ({ ...prior, [key]: value }));
  const setSource = (index: number, key: keyof Source, value: string) =>
    setSources((prior) =>
      prior.map((source, i) => (i === index ? { ...source, [key]: value } : source)),
    );
  const selectKind = (value: Kind) => {
    if (value !== kind) {
      draw?.clear();
      onClearGeometry();
    }
    setKind(value);
    onKind(value);
    setError('');
  };
  const input = (): ProposalInput => ({
    ...form,
    kind,
    geometry: geometry!,
    ...(targetRecordId ? { targetRecordId } : {}),
    allowedActivities: activities
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean),
    sources: sources
      .filter((source) => source.url.trim())
      .map((source) => ({
        title: source.title.trim() || source.url.trim(),
        url: source.url.trim(),
        kind: source.kind,
      })),
    ...(observedAt ? { observedAt } : {}),
  });
  const validate = () => {
    const result = proposalInputSchema.safeParse(input());
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check the form');
      return null;
    }
    setError('');
    return result.data;
  };
  const nextFromDraw = () => {
    if (!geometry) {
      setError(`Finish drawing your ${kind} on the map first.`);
      return;
    }
    setError('');
    onKind(null);
    setStep(2);
  };
  const nextFromDetails = () => {
    if (validate()) setStep(3);
  };
  const submit = async () => {
    const proposal = validate();
    if (!proposal) return;
    setBusy(true);
    setError('');
    try {
      const response = await submitProposal(proposal);
      onSubmitted(response.id, response.receiptToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit your information');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="contribution" aria-label="Add coastal information">
      <button
        className="icon-button close-button"
        onClick={onClose}
        aria-label="Close contribution"
      >
        <X size={20} />
      </button>
      <div className="eyebrow">Contribute to OpenCoast</div>
      <h2>{targetRecordId ? 'Suggest a correction' : 'Add coastal information'}</h2>
      <div className="step-indicator" aria-label={`Step ${step} of 3`}>
        <span className={step >= 1 ? 'active' : ''} />
        <span className={step >= 2 ? 'active' : ''} />
        <span className={step >= 3 ? 'active' : ''} />
      </div>
      {step === 1 && (
        <>
          <div className="step-title">
            <span>01 / Draw</span>
            <h3>Where does this apply?</h3>
          </div>
          <p>
            Choose a shape, then tap or click the map. Finish the shape and drag its points to
            adjust it.
          </p>
          <div className="kind-picker">
            {kindCopy.map(({ kind: value, label, help, icon: Icon }) => (
              <button
                key={value}
                className={`kind-card ${kind === value ? 'selected' : ''}`}
                onClick={() => selectKind(value)}
              >
                <Icon size={21} />
                <span>
                  <strong>{label}</strong>
                  <small>{help}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="draw-actions">
            <button className="secondary-button" onClick={() => draw?.undo()}>
              <CornerUpLeft size={17} /> Undo
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                draw?.clear();
                onClearGeometry();
                setError('');
                onKind(kind);
                draw?.setMode(
                  kind === 'area' ? 'polygon' : kind === 'route' ? 'linestring' : 'point',
                );
              }}
            >
              Start again
            </button>
          </div>
          {geometry && (
            <div className="notice success">
              <Check size={17} />
              Shape ready. You can adjust its points before continuing.
            </div>
          )}
          <div className="notice">
            <Info size={17} />
            Your hand-drawn outline is approximate until supported by an official map.
          </div>
          <button className="primary-button full-width" onClick={nextFromDraw}>
            Continue <ArrowRight size={18} />
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <div className="step-title">
            <span>02 / Explain</span>
            <h3>What should people know?</h3>
          </div>
          <label>
            Place or feature name
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. path beside the harbour"
              maxLength={160}
            />
          </label>
          <label>
            Short access summary
            <input
              value={form.summary}
              onChange={(e) => set('summary', e.target.value)}
              placeholder="Explain the access claim in one sentence"
              maxLength={500}
            />
          </label>
          <label>
            Details and context
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={5}
              placeholder="Describe the legal basis, what happens on the ground, and anything people should check."
              maxLength={10000}
            />
          </label>
          <label>
            Jurisdiction
            <input
              value={form.jurisdiction}
              onChange={(e) => set('jurisdiction', e.target.value)}
              placeholder="Country, region, or municipality"
              maxLength={160}
            />
          </label>
          <label>
            Local category, if known
            <input
              value={form.localCategory}
              onChange={(e) => set('localCategory', e.target.value)}
              placeholder="e.g. leased bathing area"
              maxLength={120}
            />
          </label>
          <label>
            Access status
            <select value={form.accessStatus} onChange={(e) => set('accessStatus', e.target.value)}>
              <option value="unknown">Unknown</option>
              <option value="allowed">Allowed</option>
              <option value="conditional">Conditional</option>
              <option value="restricted">Restricted</option>
              <option value="disputed">Disputed</option>
            </select>
          </label>
          <label>
            Activities mentioned, separated by commas
            <input
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              placeholder="Walking, swimming, sitting"
            />
          </label>
          <label>
            Conditions and limits
            <textarea
              value={form.conditions}
              onChange={(e) => set('conditions', e.target.value)}
              rows={3}
              placeholder="Hours, fees, concession boundaries, seasonal rules…"
            />
          </label>
          {kind === 'area' && (
            <div className="notice">
              <Info size={17} />A beach record does not establish a route from land. Add a separate
              route record to document a path.
            </div>
          )}
          <div className="form-divider" />
          <h4>
            Supporting source <span>strongly encouraged, optional</span>
          </h4>
          {sources.map((source, index) => (
            <div className="source-input-group" key={index}>
              <div className="source-heading">
                <strong>Source {index + 1}</strong>
                {sources.length > 1 && (
                  <button
                    className="text-button"
                    onClick={() => setSources((prior) => prior.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                )}
              </div>
              <label>
                Document or page title
                <input
                  value={source.title}
                  onChange={(e) => setSource(index, 'title', e.target.value)}
                  placeholder="Name of law, plan, atlas, or report"
                />
              </label>
              <label>
                Source link
                <input
                  type="url"
                  value={source.url}
                  onChange={(e) => setSource(index, 'url', e.target.value)}
                  placeholder="https://…"
                />
              </label>
              {source.url && (
                <label>
                  Source type
                  <select
                    value={source.kind}
                    onChange={(e) => setSource(index, 'kind', e.target.value)}
                  >
                    <option value="official">Official document or authority</option>
                    <option value="other">Other source</option>
                  </select>
                </label>
              )}
            </div>
          ))}
          {sources.length < 20 && (
            <button
              className="text-button"
              onClick={() =>
                setSources((prior) => [...prior, { title: '', url: '', kind: 'official' }])
              }
            >
              + Add another source
            </button>
          )}
          <label>
            Date observed, if relevant
            <input type="date" value={observedAt} onChange={(e) => setObservedAt(e.target.value)} />
          </label>
          <div className="button-row">
            <button
              className="secondary-button"
              onClick={() => {
                setStep(1);
                onKind(kind);
              }}
            >
              <ArrowLeft size={17} /> Back
            </button>
            <button className="primary-button" onClick={nextFromDetails}>
              Review <ArrowRight size={17} />
            </button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div className="step-title">
            <span>03 / Review</span>
            <h3>Check your submission</h3>
          </div>
          <p className="review-title">{form.title}</p>
          <p>{form.summary}</p>
          <dl className="review-summary">
            <div>
              <dt>Shape</dt>
              <dd>{kind}</dd>
            </div>
            <div>
              <dt>Jurisdiction</dt>
              <dd>{form.jurisdiction}</dd>
            </div>
            <div>
              <dt>Access claim</dt>
              <dd>{form.accessStatus}</dd>
            </div>
            <div>
              <dt>Sources</dt>
              <dd>
                {sources.filter((source) => source.url.trim()).length || 'No source links yet'}
              </dd>
            </div>
          </dl>
          <div className="notice">
            <Info size={17} />
            Your submission stays private until a moderator reviews it. It may be edited for clarity
            with an audit trail.
          </div>
          <p className="privacy-note">
            You can attach private evidence after submitting. Photos need your consent and moderator
            inspection before any public copy is shown. No account is required.
          </p>
          <div className="button-row">
            <button className="secondary-button" onClick={() => setStep(2)}>
              <ArrowLeft size={17} /> Back
            </button>
            <button className="primary-button" onClick={submit} disabled={busy}>
              {busy ? 'Submitting…' : 'Send for review'} <ArrowRight size={17} />
            </button>
          </div>
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
