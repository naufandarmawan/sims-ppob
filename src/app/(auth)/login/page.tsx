"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/features/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      router.push("/");
    } else if (login.rejected.match(result)) {
      alert(result.payload);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       "https://take-home-test-api.nutech-integrasi.com/login",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, password }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       localStorage.setItem("token", data.data.token);
  //       router.push("/");
  //     } else {
  //       alert(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     alert("An error occurred during login.");
  //   }
  // };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-2/3 flex flex-col items-center gap-8">
          <Link className="flex items-center gap-2" href="/">
            <img src="/logo.png" alt="SIMS PPOB Logo" />
            <p className="text-xl font-semibold">SIMS PPOB</p>
          </Link>
          <h1 className="w-full text-3xl font-semibold text-center">
            Masuk atau buat akun untuk memulai
          </h1>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masukan email anda"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="masukan password anda"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded"
            >
              Masuk
            </button>
          </form>
          <p className="mt-4 text-center">
            belum punya akun? registrasi{" "}
            <Link href="/register" className="text-red-500">
              di sini
            </Link>
          </p>
        </div>
      </div>
      <div
        className="w-1/2 bg-red-500 flex items-center justify-center"
        style={{
          backgroundImage: "url('/Illustrasi Login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
