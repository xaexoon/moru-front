import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const evtFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login Success:", data);
        // 성공 처리
      } else {
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("서버와의 연결에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome back
        </h2>
        <p className="text-center text-gray-800 mb-8">Sign in to continue</p>

        <form onSubmit={evtFormSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">Or sign in with</p>
      </div>
    </div>
  );
}

export default Login;
