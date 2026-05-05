"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  talentType: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function TalentPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Handle Login
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setSuccess("Successfully logged in! Redirecting...");
        setTimeout(() => router.push("/talent-portal/dashboard"), 1000);
      } else {
        // Handle Signup
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        
        // Save additional user info to Firestore
        await setDoc(doc(db, "talents", user.uid), {
          email: data.email,
          fullName: data.fullName,
          talentType: data.talentType,
          createdAt: new Date(),
        });
        
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/talent-portal/dashboard"), 1500);
      }
      reset();
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
          {isLogin ? "Sign in to your account" : "Join the Talent Portal"}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Or{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              reset();
              setError("");
              setSuccess("");
            }}
            className="font-medium text-bmki-purple hover:text-bmki-gold transition-colors dark:text-bmki-gold dark:hover:text-white"
          >
            {isLogin ? "create a new account" : "sign in to your existing account"}
          </button>
        </p>
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-neutral-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-neutral-800">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("fullName")}
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bmki-purple focus:border-bmki-purple sm:text-sm dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Talent Type
                  </label>
                  <div className="mt-1">
                    <select
                      {...register("talentType")}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-bmki-purple focus:border-bmki-purple sm:text-sm dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="">Select your talent...</option>
                      <option value="music">Music / Artist</option>
                      <option value="dance">Dance / Choreography</option>
                      <option value="fashion">Fashion / Modeling</option>
                      <option value="comedy">Comedy</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register("email")}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bmki-purple focus:border-bmki-purple sm:text-sm dark:bg-neutral-800 dark:text-white"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register("password")}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-bmki-purple focus:border-bmki-purple sm:text-sm dark:bg-neutral-800 dark:text-white"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/30">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/30">
                <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bmki-purple hover:bg-bmki-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bmki-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
