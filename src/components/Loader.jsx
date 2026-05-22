const Loader = ({ message = 'Loading...', variant = 'page' }) => (
  <div className={`loader loader-${variant}`} role="status" aria-live="polite">
    <span className="loader-spinner" aria-hidden="true"></span>
    <span>{message}</span>
  </div>
);

export const ButtonLoader = ({ label }) => (
  <span className="button-loader">
    <span className="button-spinner" aria-hidden="true"></span>
    <span>{label}</span>
  </span>
);

export const LoadingOverlay = ({ message = 'Working...' }) => (
  <div className="loading-overlay" role="status" aria-live="polite">
    <Loader message={message} variant="panel" />
  </div>
);

export default Loader;
