import { Routes, Route } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Store Home</h1>
      <p>Welcome to the MTSE Storefront</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
