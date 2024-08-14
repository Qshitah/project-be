import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import AddCommande from './components/AddCommande';
import AllCommandes from './components/AllCommandes';
import CommandeDetail from './components/CommandeDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllCommandes />} />
        <Route path="/addOrder" element={<AddCommande />} />
        <Route path="/order/:id" element={<CommandeDetail />} />
      </Routes>
    </Router>
  );
}
