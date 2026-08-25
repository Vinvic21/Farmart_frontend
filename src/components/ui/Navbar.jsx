
const Navbar = ({ user }) => {
  const isFarmer = user?.role === 'farmer';
  const isBuyer = user?.role === 'buyer';

  return (
    <nav>
      <div>
        <a href="/">Farmart</a>
      </div>

      <div>
        <a href="/">Home</a>

        {!user && (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}

        {isFarmer && (
          <>
            <a href="/dashboard">Dashboard</a>
            <a href="/products">My Products</a>
            <a href="/orders">Orders</a>
          </>
        )}

        {isBuyer && (
          <>
            <a href="/marketplace">Marketplace</a>
            <a href="/orders">My Orders</a>
          </>
        )}

        {user && (
          <>
            <a href="/profile">Profile</a>
            <button type="button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
