"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { register } from "@/redux/features/authSlice";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      register({ email, password, first_name: firstName, last_name: lastName })
    );
    if (register.fulfilled.match(result)) {
      alert(result.payload);
      router.push("/login");
    } else if (register.rejected.match(result)) {
      alert(result.payload);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       "https://take-home-test-api.nutech-integrasi.com/registration",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email,
  //           password,
  //           first_name: firstName,
  //           last_name: lastName,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (response.ok) {
  //       alert(data.message);
  //       router.push("/login");
  //     } else {
  //       alert(data.message);
  //     }
  //   } catch (error) {
  //     console.error("Registration failed:", error);
  //     alert("An error occurred during registration.");
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
            Lengkapi data untuk membuat akun
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
              <label htmlFor="firstName" className="block mb-1">
                Nama Depan
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="nama depan"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1">
                Nama Belakang
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="nama belakang"
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
                placeholder="buat password"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded"
            >
              Registrasi
            </button>
          </form>
          <p className="mt-4 text-center">
            sudah punya akun? login{" "}
            <Link href="/login" className="text-red-500">
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
