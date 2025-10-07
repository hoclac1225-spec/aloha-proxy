import { AppProvider } from '@shopify/polaris';
import enTranslations from ('~/locales/en.json');

export default function App() {
  return (
    <AppProvider i18n={enTranslations}>
      {/* App content */}
    </AppProvider>
  );
}

