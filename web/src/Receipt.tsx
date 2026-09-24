import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, FileUp, LockKeyhole } from 'lucide-react';
import { getReceipt, replyToModerator, uploadEvidence, type Receipt as ReceiptData } from './api';

export default function Receipt({
  id,
  token,
  onBack,
}: {
  id: string;
  token: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [consent, setConsent] = useState(false);
  const [reply, setReply] = useState('');
  const [copied, setCopied] = useState(false);
  const refresh = () =>
    getReceipt(id, token)
      .then(setData)
      .catch((e) => setError(e.message));
  useEffect(() => {
    refresh();
  }, [id, token]);
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const upload = async () => {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    try {
      for (const file of Array.from(files)) await uploadEvidence(id, token, file, consent);
      setFiles(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };
  const sendReply = async () => {
    setBusy(true);
    setError('');
    try {
      await replyToModerator(id, token, reply);
      setReply('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send reply');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="receipt-panel" aria-label="Private submission receipt">
      <button className="text-button back-link" onClick={onBack}>
        <ArrowLeft size={18} /> Back to map
      </button>
      <div className="receipt-icon">
        <Check size={28} />
      </div>
      <div className="eyebrow">Private submission receipt</div>
      <h2>{data?.title ?? 'Your contribution'}</h2>
      <p className="lead">
        {data?.status === 'approved'
          ? 'Published after review'
          : data?.status === 'rejected'
            ? 'Not published'
            : data?.status === 'clarification'
              ? 'Moderator needs more detail'
              : 'Waiting for a moderator'}
      </p>
      <div className="notice">
        <LockKeyhole size={19} />
        Anyone with this link can see your submission. Save it privately; we cannot recover it for
        anonymous contributors.
      </div>
      <button className="secondary-button full-width" onClick={copy}>
        <Copy size={17} />
        {copied ? 'Copied' : 'Copy private receipt link'}
      </button>
      {data && (
        <>
          <dl className="dates">
            <div>
              <dt>Submitted</dt>
              <dd>{new Date(data.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt>Last changed</dt>
              <dd>{new Date(data.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
          <p>{data.summary}</p>
          {data.reviewMessage && (
            <div className="detail-block">
              <h3>Moderator note</h3>
              <p>{data.reviewMessage}</p>
            </div>
          )}
          {data.messages.length > 0 && (
            <div className="detail-block">
              <h3>Conversation</h3>
              {data.messages.map((item, index) => (
                <p className="message" key={index}>
                  <strong>{item.sender === 'moderator' ? 'Moderator' : 'You'}:</strong>{' '}
                  {item.message}
                </p>
              ))}
            </div>
          )}
          {data.status === 'clarification' && (
            <div className="detail-block">
              <label>
                Your reply
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  placeholder="Add the details requested by the moderator"
                />
              </label>
              <button
                className="primary-button"
                onClick={sendReply}
                disabled={busy || reply.trim().length < 5}
              >
                Send reply
              </button>
            </div>
          )}
          {['pending', 'clarification'].includes(data.status) && (
            <div className="detail-block">
              <h3>Add supporting files</h3>
              <p>JPEG, PNG, WebP, or PDF; up to 10 MB each. Originals are private to moderators.</p>
              <label className="file-input">
                <FileUp size={18} /> Choose files
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </label>
              {files?.length ? (
                <p>
                  {files.length} file{files.length === 1 ? '' : 's'} selected
                </p>
              ) : null}
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I permit a moderator to publish a checked, metadata-stripped image copy. Raw files
                stay private.
              </label>
              <button className="primary-button" onClick={upload} disabled={busy || !files?.length}>
                {busy ? 'Uploading…' : 'Upload evidence'}
              </button>
            </div>
          )}
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
