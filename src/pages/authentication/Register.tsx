import React, { useEffect, useState } from "react";
import { supabase as authService } from "../../services/supabaseService";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import NotificationCard from "../../components/NotificationCard";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validatePassword = (password: string) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*]/;

    return {
      minLength: minLength.test(password),
      upperCase: upperCase.test(password),
      number: number.test(password),
      specialChar: specialChar.test(password),
    };
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const validation = validatePassword(password);
    const isValid = Object.values(validation).every(Boolean);
    if (!isValid) {
      setNotification({
        message:
          "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character!",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await authService.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      setNotification({ message: "Error: " + error.message, type: "error" });
      setIsSubmitting(false);
      return;
    }
    if (data) {
      setNotification({
        message: "User created successfully!",
        type: "success",
        // TODO: VERIFY EMAIL
      });
      setEmail("");
      setPassword("");
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
  };

  const passwordValidation = validatePassword(password);

  return (
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Create an Account
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ul className="text-sm mt-2 space-y-1 text-gray-600">
                <li
                  className={
                    passwordValidation.minLength
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  • At least 8 characters
                </li>
                <li
                  className={
                    passwordValidation.upperCase
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  • 1 uppercase letter
                </li>
                <li
                  className={
                    passwordValidation.number
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  • 1 number
                </li>
                <li
                  className={
                    passwordValidation.specialChar
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  • 1 special character (!@#$%^&*)
                </li>
              </ul>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
