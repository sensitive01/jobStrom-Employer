import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../public/assets/images/logo-dark.png";
import sideImage from "../../../public/assets/images/auth/sign-in.png";
import { loginEmployer } from "../../api/service/employerService";

const EmployerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await loginEmployer(
        formData.username,
        formData.password
      );

      if (response.status === 200) {
        toast.success("Login successful!");

        if (response?.status === 200) {
          localStorage.setItem("token", response?.data.token);
          localStorage.setItem("userId", response?.data.user?._id);
        }

        // Reset form
        setFormData({
          username: "",
          password: "",
          rememberMe: false,
        });

        // Redirect to dashboard or home page
        setTimeout(() => {
          navigate("/employer/dashboard");
        }, 1000);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Logo and Illustration */}
            <div className="bg-white p-8 md:p-12 flex flex-col items-center justify-center">
              <div className="mb-8 w-full text-center">
                <img
                  src={logoImage}
                  alt="JobsStorm Logo"
                  className="h-16 mx-auto object-contain"
                />
              </div>

              <div className="w-full max-w-md">
                <img
                  src={sideImage}
                  alt="Login illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 md:p-12 flex items-center">
              <div className="w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Welcome Back !
                  </h2>
                  <p className="text-purple-100">
                    Sign in to continue to JobsStorm.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="usernameInput"
                      className="block text-white text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="usernameInput"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="passwordInput"
                      className="block text-white text-sm font-medium mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="passwordInput"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={loading}
                        className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="flexCheckDefault"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-600 focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <label
                        htmlFor="flexCheckDefault"
                        className="ml-2 text-sm text-white cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="/candidate-reset-password"
                      className="text-sm text-white hover:text-purple-100 transition-colors"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-white text-sm">
                    Don't have an account?{" "}
                    <a
                      href="/employer-signup"
                      className="font-semibold text-white underline hover:text-purple-100 transition-colors"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
