import './App.css';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;
