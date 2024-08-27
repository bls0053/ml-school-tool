import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

// Import your components (pages)
import Schools from '@/pages/Schools';
import Page2 from '@/pages/Page2';
import Page3 from '@/pages/Page3';
import Home from '@/pages/Home';

import { ThemeProvider } from "@/components/generic-components/theme-provider"

const App: React.FC = () => {
  return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/schools">School Tool</Link>
            </li>
            <li>
              <Link to="/about">Page2</Link>
            </li>
            <li>
              <Link to="/contact">Page3</Link>
            </li>
          </ul>
        </nav>

        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/schools" element={<Schools />} />
          <Route path="/Page2" element={<Page2 />} />
          <Route path="/Page3" element={<Page3 />} />
        </Routes>
      </div>
    </Router>
  </ThemeProvider>
  );
}

export default App;