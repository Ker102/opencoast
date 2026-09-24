import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CodeXml,
  Compass,
  Info,
  Layers3,
  MapPin,
  Menu,
  Plus,
  Search,
  Shapes,
  X,
} from 'lucide-react';
import type { TerraDraw } from 'terra-draw';
import type { Geometry, ProposalInput, RecordCollection, RecordFeature } from '@opencoast/shared';
import MapView from './MapView';
import RecordDetail from './RecordDetail';
import Contribution from './Contribution';
import Receipt from './Receipt';
import Moderation from './Moderation';
import { getRecords } from './api';

const empty: RecordCollection = { type: 'FeatureCollection', features: [] };
type Mode = 'map' | 'contribute' | 'receipt' | 'moderation';
const routeFromLocation = (): Mode =>
  window.location.pathname.startsWith('/receipt/')
    ? 'receipt'
    : window.location.pathname.startsWith('/moderation')
      ? 'moderation'
      : 'map';
const statusColors = [
  ['Allowed', '#147c6d'],
  ['Conditional', '#d48f28'],
  ['Restricted', '#ad514f'],
  ['Disputed', '#8062a3'],
  ['Unknown', '#687d83'],
];

export default function App() {
  const [mode, setMode] = useState<Mode>(routeFromLocation);
  const [records, setRecords] = useState<RecordCollection>(empty);
  const [selected, setSelected] = useState<RecordFeature | null>(null);
  const [drawingKind, setDrawingKind] = useState<ProposalInput['kind'] | null>(null);
  const [draftGeometry, setDraftGeometry] = useState<Geometry | null>(null);
  const [focusGeometry, setFocusGeometry] = useState<Geometry | null>(null);
  const [targetRecord, setTargetRecord] = useState<RecordFeature | null>(null);
  const [routeArea, setRouteArea] = useState<RecordFeature | null>(null);
  const [draw, setDraw] = useState<TerraDraw | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; token: string } | null>(() => {
    const id = window.location.pathname.split('/')[2];
    return id ? { id, token: window.location.hash.slice(1) } : null;
  });
  const [mapError, setMapError] = useState('');
  const [coordinateInput, setCoordinateInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastBbox = useRef<string>('');
  const sidebarContent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    sidebarContent.current?.scrollTo({ top: 0 });
  }, [selected?.properties.id]);
  useEffect(() => {
    const handler = () => {
      setMode(routeFromLocation());
      const id = window.location.pathname.split('/')[2];
      setReceipt(id ? { id, token: window.location.hash.slice(1) } : null);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);
  const navigate = (path: string, next: Mode) => {
    window.history.pushState({}, '', path);
    setMode(next);
    setMobileMenu(false);
  };
  const refresh = useCallback((bbox: string, signal?: AbortSignal) => {
    lastBbox.current = bbox;
    getRecords(bbox, signal)
      .then((data) => {
        if (!signal?.aborted) {
          setRecords(data);
          setMapError('');
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError')
          setMapError('Access records could not load. Please try again.');
      });
  }, []);
  const onViewport = useCallback(
    (bbox: string, signal: AbortSignal) => refresh(bbox, signal),
    [refresh],
  );
  const onSelectRecord = useCallback(
    (id: string) => {
      const feature = records.features.find((f) => f.properties.id === id);
      if (feature) {
        setSelected(feature);
        setMobileMenu(true);
      }
    },
    [records],
  );
  const startContribution = (feature?: RecordFeature) => {
    setTargetRecord(feature ?? null);
    setDraftGeometry(null);
    setDrawingKind(feature?.properties.kind ?? 'area');
    setSelected(null);
    navigate('/contribute', 'contribute');
  };
  const closeContribution = () => {
    setDrawingKind(null);
    setDraftGeometry(null);
    navigate('/', 'map');
  };
  const onSubmitted = (id: string, token: string) => {
    setDrawingKind(null);
    setReceipt({ id, token });
    navigate(`/receipt/${id}#${token}`, 'receipt');
  };
  const backToMap = () => {
    setFocusGeometry(null);
    setSelected(null);
    setRouteArea(null);
    navigate('/', 'map');
  };
  const goToCoordinates = (event: React.FormEvent) => {
    event.preventDefault();
    const parts = coordinateInput.split(/[ ,]+/).map(Number);
    if (
      parts.length !== 2 ||
      parts.some((n) => !Number.isFinite(n)) ||
      Math.abs(parts[0]) > 90 ||
      Math.abs(parts[1]) > 180
    ) {
      setSearchError('Enter latitude, longitude, for example 42.2, 18.9');
      return;
    }
    setSearchError('');
    setFocusGeometry({ type: 'Point', coordinates: [parts[1], parts[0]] });
  };
  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${mobileMenu ? 'mobile-open' : ''} ${mode !== 'map' ? 'active-panel' : ''}`}
      >
        <header className="brand-header">
          <button className="brand-button" onClick={backToMap} aria-label="OpenCoast home">
            <span className="wordmark">
              OPEN<span>COAST</span>
            </span>
            <span className="brand-subtitle">People · Places · A more open coast</span>
          </button>
          <button
            className="mobile-menu-button"
            aria-label={mobileMenu ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </header>
        {mode === 'map' && (
          <div
            className={`sidebar-content ${selected ? 'has-selection' : ''}`}
            ref={sidebarContent}
          >
            <form className="search-box" onSubmit={goToCoordinates}>
              <Search size={20} />
              <input
                aria-label="Go to coordinates"
                value={coordinateInput}
                onChange={(e) => setCoordinateInput(e.target.value)}
                placeholder="Go to latitude, longitude"
              />
              <button aria-label="Go to coordinates" type="submit">
                <ArrowRight size={18} />
              </button>
            </form>
            {searchError && (
              <p className="form-error" role="alert">
                {searchError}
              </p>
            )}
            <div className="intro">
              <div className="eyebrow">A map for everyone</div>
              <h1>Know your coast.</h1>
              <p>
                Explore reviewed coastal access information, understand local conditions, and help
                improve the map.
              </p>
            </div>
            <div className="legend">
              <h2>On the map</h2>
              <div className="legend-row">
                <span className="legend-area" />
                <span>
                  <strong>Access area</strong>
                  <small>Beach, foreshore, or coastal land</small>
                </span>
              </div>
              <div className="legend-row">
                <span className="legend-route" />
                <span>
                  <strong>Route to shore</strong>
                  <small>Path, entrance route, or coastal way</small>
                </span>
              </div>
              <div className="legend-row">
                <MapPin size={24} className="legend-point" />
                <span>
                  <strong>Access point</strong>
                  <small>Entrance, gate, sign, or key location</small>
                </span>
              </div>
              <div className="status-key">
                {statusColors.map(([label, color]) => (
                  <span key={label}>
                    <i style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <p className="legend-note">
                <span className="dotted-key" /> Dotted line or double ring: no official source
                verified
              </p>
            </div>
            <div className="sidebar-divider" />
            {selected ? (
              <RecordDetail
                feature={selected}
                onClose={() => {
                  setSelected(null);
                  setMobileMenu(false);
                }}
                onSuggest={() => startContribution(selected)}
                onFocusRoute={(route) => {
                  setSelected(route);
                  setFocusGeometry(route.geometry);
                  setMobileMenu(true);
                }}
                onManageRoutes={() => {
                  setRouteArea(selected);
                  setSelected(null);
                  navigate('/moderation', 'moderation');
                }}
              />
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Layers3 size={24} />
                </div>
                <div className="eyebrow">Current view</div>
                <h2>
                  {records.features.length
                    ? 'Select a marked place'
                    : 'No reviewed access information yet'}
                </h2>
                <p>
                  {records.features.length
                    ? 'Choose an area, route, or point on the map to read its sources and conditions.'
                    : 'This means no local claim has passed review here. It does not mean access is forbidden.'}
                </p>
                {records.features.length > 0 && (
                  <ul className="record-list">
                    {records.features.slice(0, 12).map((feature) => (
                      <li key={feature.properties.id}>
                        <button
                          onClick={() => {
                            setSelected(feature);
                            setFocusGeometry(feature.geometry);
                          }}
                        >
                          <span>{feature.properties.title}</span>
                          <small>
                            {feature.properties.accessStatus} · {feature.properties.jurisdiction}
                          </small>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {mapError && (
              <p className="form-error" role="alert">
                {mapError}
              </p>
            )}
            <button className="primary-button add-button" onClick={() => startContribution()}>
              <Plus size={23} /> Add information
            </button>
            <div className="sidebar-footer">
              <button
                className="text-button"
                onClick={() => {
                  setRouteArea(null);
                  navigate('/moderation', 'moderation');
                }}
              >
                Moderator desk
              </button>
              <a
                href="https://github.com/Ker102/opencoast"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CodeXml size={16} /> Source code
              </a>
            </div>
          </div>
        )}
        {mode === 'contribute' && (
          <Contribution
            key={targetRecord?.properties.id ?? 'new'}
            geometry={draftGeometry}
            onKind={setDrawingKind}
            onClearGeometry={() => setDraftGeometry(null)}
            onClose={closeContribution}
            draw={draw}
            targetRecordId={targetRecord?.properties.id}
            initialKind={targetRecord?.properties.kind}
            onSubmitted={onSubmitted}
          />
        )}
        {mode === 'receipt' && receipt && (
          <Receipt id={receipt.id} token={receipt.token} onBack={backToMap} />
        )}
        {mode === 'moderation' && (
          <Moderation
            onBack={backToMap}
            onFocus={setFocusGeometry}
            routeArea={routeArea}
            onPublished={() => {
              if (lastBbox.current) refresh(lastBbox.current);
            }}
          />
        )}
      </aside>
      <main className="map-main">
        <div className="map-topbar">
          <span>
            <Compass size={18} /> A coast for everyone
          </span>
          <span className="map-topbar-right">
            <span className="live-dot" /> Global map · reviewed records only
          </span>
        </div>
        <MapView
          records={records}
          drawingKind={drawingKind}
          focusGeometry={focusGeometry}
          previewGeometry={mode === 'moderation' ? focusGeometry : null}
          onViewport={onViewport}
          onSelectRecord={onSelectRecord}
          onGeometry={setDraftGeometry}
          onDrawReady={setDraw}
        />
        {mode === 'map' && (
          <div className="map-explainer">
            <Info size={17} /> Unmarked areas have no reviewed information yet.
          </div>
        )}
        {mode === 'contribute' && (
          <div className="drawing-badge">
            <Shapes size={17} />{' '}
            {drawingKind
              ? `Drawing ${drawingKind}`
              : draftGeometry
                ? 'Shape ready for review'
                : 'Add details in the panel'}
          </div>
        )}
        {mode === 'map' && (
          <button className="mobile-add primary-button" onClick={() => startContribution()}>
            <Plus size={20} /> Add information
          </button>
        )}
      </main>
    </div>
  );
}
