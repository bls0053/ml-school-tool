import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

// Import your components (pages)
import Schools from '@/pages/Schools';
import { ThemeProvider } from "@/components/generic-components/theme-provider"

const App: React.FC = () => {
  return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <div>
        {/* <nav>
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
        </nav> */}

        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Schools />}/>
          <Route path="/schools" element={<Schools />} />
        </Routes>
      </div>
    </Router>
  </ThemeProvider>
  );
}

export default App;