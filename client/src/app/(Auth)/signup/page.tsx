"use client";
import { useEffect, useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import axios from "axios";
import { useRouter } from "next/navigation";
import OAuth from "@/components/OAuth";
import userAuthStore from "@/store/userStore";
import { signUpSchema } from "@/utils/schema";

interface signupData {
  fullName: string;
  email: string;
  password: string;
}
const SignUpPage = () => {
  const router = useRouter();
  const [signupData, setSignupData] = useState<signupData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const { setUser, isAuthenticated } = userAuthStore((state) => state);
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

  // Simple function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing again
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      // Basic Zod validation - this is the simplified part
      const validation = signUpSchema.parse(signupData);
      console.log(validation);

      // If validation passes (no error thrown), proceed with submission
      setIsPending(true);
      console.log("Submitting signup data:", signupData);

      // Send data to your API
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        signupData,
        {
          withCredentials: true,
        }
      );
      console.log("signup response", response);
      // Handle successful signup
      if (response.status === 201 && !response.data.newUser.isOnboard) {
        setUser(response.data.user, true);
        router.replace("/onboard");
        
      }
    } catch (error: any) {
      // Handle Zod validation errors
      setErrors(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      // data-theme="coffee"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Chatlingo
            </span>
          </div>

          {/* GENERAL ERROR MESSAGE */}
          {errors.general && (
            <div className="alert alert-error mb-4">
              <span>{errors.general}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join ChatLingo and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* FULLNAME */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      className={`input input-bordered w-full ${
                        errors.fullName ? "input-error" : ""
                      }`}
                      value={signupData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.fullName && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.fullName}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@gmail.com"
                      className={`input input-bordered w-full ${
                        errors.email ? "input-error" : ""
                      }`}
                      value={signupData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.email}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="********"
                      className={`input input-bordered w-full ${
                        errors.password ? "input-error" : ""
                      }`}
                      value={signupData.password}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.password && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.password}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline">
                          privacy policy
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
            <div className="divider">OR</div>
            <OAuth />
            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <Image
                src="/images/language.png"
                alt="Language connection illustration"
                className="w-full h-full"
                width={500}
                height={500}
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
