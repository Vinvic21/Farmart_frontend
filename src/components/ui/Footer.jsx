export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-10 py-6 text-center">
      <p className="font-display font-bold text-farmart-green-deep">Farmart</p>
      <p className="text-sm text-gray-400 mt-1">© {new Date().getFullYear()} Farmart. Livestock Marketplace KE</p>
    </footer>
  );
}