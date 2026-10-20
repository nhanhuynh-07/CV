// Hook tái sử dụng để fetch dữ liệu từ API
import { useState, useEffect, useCallback } from 'react';

export function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Component loading spinner
export function LoadingSpinner({ text = 'Đang tải...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '0.75rem', flexDirection: 'column' }}>
      <div style={{
        width: 36, height: 36, border: '3px solid var(--color-gray-200)',
        borderTop: '3px solid var(--color-primary)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)' }}>{text}</span>
    </div>
  );
}

// Component hiển thị lỗi
export function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
      <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{message || 'Có lỗi xảy ra'}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>Thử lại</button>
      )}
    </div>
  );
}

// Component empty state
export function EmptyState({ icon = '📭', title = 'Không có dữ liệu', subtitle, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h4 style={{ color: 'var(--color-gray-600)', marginBottom: '0.25rem' }}>{title}</h4>
      {subtitle && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', marginBottom: '1rem' }}>{subtitle}</p>}
      {action}
    </div>
  );
}
