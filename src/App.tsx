import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Schools from '@/pages/Schools';
import { ThemeProvider } from "@/components/generic-components/theme-provider"

const App: React.FC = () => {
  return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Schools />}/>
        </Routes>
      </div>
    </Router>
  </ThemeProvider>
  );
}

export default App;