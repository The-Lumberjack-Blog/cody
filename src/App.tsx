
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import WorkflowProfile from './pages/WorkflowProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/workflow/:id" element={<WorkflowProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
