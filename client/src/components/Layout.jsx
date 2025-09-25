import Navbar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;