export function Alert({ type = 'info', title, message, onClose }) {
  const icons = {
    success: '✓',
    danger: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`alert alert-${type}`}>
      <span className="text-lg font-bold">{icons[type]}</span>
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold leading-none hover:text-gray-700">
          ×
        </button>
      )}
    </div>
  );
}