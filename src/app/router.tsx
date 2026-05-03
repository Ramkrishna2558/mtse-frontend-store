import { Routes, Route } from 'react-router-dom';
import { Storefront } from '../features/storefront/Storefront';
import { CustomerLogin } from '../features/auth/CustomerLogin';

function NotFoundPage() {
  return (
    <div style={{ padding: '5rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
