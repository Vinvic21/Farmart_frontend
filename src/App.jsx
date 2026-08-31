import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;