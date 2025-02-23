
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import WorkflowProfile from './pages/WorkflowProfile';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workflow/:id" element={<WorkflowProfile />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
