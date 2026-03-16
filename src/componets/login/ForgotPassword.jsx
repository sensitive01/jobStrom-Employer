import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../public/assets/images/logo-dark.png";
import sideImage from "../../../public/assets/images/auth/sign-in.png";
import {
  employerForgotPassword,
  employerVerifyOTP,
  employerChangePassword,
  employerResendOTP,
} from "../../api/service/employerService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Countdown timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      toast.warning("OTP expired. Please request a new one.");
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerActive, timer]);

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your registered email"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { toast.error("Please enter a valid email address"); return; }

    setLoading(true);
    try {
      const response = await employerForgotPassword(email);
      if (response.status === 200 || response.data?.success) {
        toast.success("OTP has been sent!");
        setStep(2);
        setTimer(120);
        setIsTimerActive(true);
        setOtp("");
      } else {
        toast.error(response.data?.message || response.response?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) { toast.error("Please enter the OTP"); return; }
    if (otp.length !== 6) { toast.error("OTP must be 6 digits"); return; }

    setLoading(true);
    try {
      const response = await employerVerifyOTP(email, otp);
      if (response.status === 200 || response.data?.success) {
        toast.success("OTP verified successfully!");
        setIsTimerActive(false);
        setStep(3);
      } else {
        toast.error(response.data?.message || response.response?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) { toast.info("Please wait for the timer to expire before resending"); return; }

    setLoading(true);
    try {
      const response = await employerResendOTP(email);
      if (response.status === 200 || response.data?.success) {
        toast.success("OTP has been resent!");
        setTimer(120);
        setIsTimerActive(true);
        setOtp("");
      } else {
        toast.error(response.data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Error resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { toast.error("Please fill in all fields"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const response = await employerChangePassword(email, newPassword);
      if (response.status === 200 || response.data?.success) {
        toast.success("Password reset successfully! You can now login.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(response.data?.message || response.response?.data?.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side */}
            <div className="bg-white p-8 md:p-12 flex flex-col items-center justify-center">
              <div className="mb-8 w-full text-center">
                <img src={logoImage} alt="JobsStorm Logo" className="h-16 mx-auto object-contain" />
              </div>
              <div className="w-full max-w-md">
                <img src={sideImage} alt="Illustration" className="w-full h-auto" />
              </div>
            </div>

            {/* Right Side */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 md:p-12 flex items-center">
              <div className="w-full">

                {/* ===== STEP 1: Email ===== */}
                {step === 1 && (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                      <p className="text-purple-100">Reset your password with JobsStorm.</p>
                    </div>
                    <form onSubmit={handleSendOTP} className="space-y-5">
                      <div className="bg-yellow-100 text-yellow-800 text-sm text-center p-3 rounded-lg font-medium">
                        Enter your Email and OTP will be sent to you!
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Username/Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter username or email"
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                      <div className="text-center text-sm text-white">
                        Remembered It?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/")}
                          className="font-semibold underline hover:text-purple-200"
                        >
                          Go to Login
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* ===== STEP 2: OTP Verification ===== */}
                {step === 2 && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-bold text-white mb-2">Verify OTP</h2>
                      <p className="text-purple-100 text-sm">
                        Enter the 6-digit OTP sent to {email}
                      </p>
                    </div>
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      {/* Timer box - only here, not repeated in button */}
                      <div className="bg-blue-100 text-blue-800 text-center py-3 px-4 rounded-lg font-medium text-sm">
                        Time remaining: <strong>{formatTimer()}</strong>
                        {timer === 0 && (
                          <div className="text-red-600 text-sm mt-1 font-semibold">OTP expired!</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={handleOtpChange}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          disabled={loading || timer === 0}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 text-center text-lg tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || timer === 0 || otp.length !== 6}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-40 transition-all"
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>

                      {/* Resend - NO timer shown here, only in box above */}
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading || timer > 0}
                        className="w-full border border-white/40 text-white py-2.5 rounded-lg font-medium hover:bg-white/10 disabled:opacity-40 transition-all text-sm"
                      >
                        Resend OTP
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => { setStep(1); setOtp(""); setTimer(120); setIsTimerActive(false); }}
                          disabled={loading}
                          className="text-white text-sm underline hover:text-purple-200"
                        >
                          Change Email Address
                        </button>
                      </div>

                      <div className="text-center text-sm text-white">
                        Remembered It?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/")}
                          className="font-semibold underline hover:text-purple-200"
                        >
                          Go to Login
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* ===== STEP 3: New Password ===== */}
                {step === 3 && (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2">New Password</h2>
                      <p className="text-purple-100">Create a strong new password for your account.</p>
                    </div>
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            disabled={loading}
                            className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-sm"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            disabled={loading}
                            className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-sm"
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
                    </form>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
