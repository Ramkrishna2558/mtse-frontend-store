import { AppProviders } from './AppProviders';
import { AppRouter } from './router';
import { Header } from '../components/layout/Header';
import { CartDrawer } from '../components/layout/CartDrawer';

export function App() {
  return (
    <AppProviders>
      <Header />
      <CartDrawer />
      <main className="pt-32">
        <AppRouter />
      </main>
    </AppProviders>
  );
}
