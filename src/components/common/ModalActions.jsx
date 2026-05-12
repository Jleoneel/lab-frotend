export default function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel = 'Guardar',
  loadingLabel = 'Guardando...',
  loading = false,
  disabled = false,
  icon: Icon,
}) {
  const isDisabled = loading || disabled;

  return (
    <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={{ color: '#666666' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isDisabled}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#009933' }}
        onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.backgroundColor = '#00802b'; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#009933'; }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            {Icon && <Icon className="w-4 h-4" />}
            {confirmLabel}
          </>
        )}
      </button>
    </div>
  );
}
