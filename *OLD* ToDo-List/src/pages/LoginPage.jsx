function LoginPage() {
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/todo";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <button className="btn btn-primary w-full" onClick={handleLogin}>
          Login with DaisyUI
        </button>
      </div>
    </div>
  );
}
