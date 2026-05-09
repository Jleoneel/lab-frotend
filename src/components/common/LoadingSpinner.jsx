export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div
          className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}
        />
        <p className="text-sm" style={{ color: '#666666' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
