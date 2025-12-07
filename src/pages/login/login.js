import { useState } from "react";
import { useLogin } from "../../hooks/useApi";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, isError, error } = useLogin();

  const evtFormSubmit = (e) => {
    e.preventDefault();

    const requestData = { username: username, password: password };
    console.log("Request Data: ", requestData);

    login(requestData, {
      onSuccess: (response) => {
        console.log("Login Success");
        console.log("Response Status: ", response.status);
        console.log("Response Data: ", response.data);

        const token = response.data.data.accessToken;
        localStorage.setItem("accessToken", token)

        console.log("Login Token: ",token)
      },
      onError: (err) => {
        console.log("Login Failed");
        console.log("Error Message: ", err.message);
        console.log("Error Code: ", err.code);
        console.log("Resopnse Status: ", err.response?.status);
        console.log("Response Data: ", err.response?.data);
        
        console.log("Object Error:", err);
      },
    });
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
          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error?.response?.data?.message || "로그인 실패하였습니다. 로그인 정보를 확인해주세요"}
            </div>
          )}

          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-blue-300"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "로그인 중..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">Or sign in with</p>
      </div>
    </div>
  );
}

export default Login;