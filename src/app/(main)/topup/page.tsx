"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const predefinedAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export default function TopUp() {
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/topup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ top_up_amount: parseInt(amount) }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(
          `Top up successful! New balance: Rp ${data.data.balance.toLocaleString()}`
        );
        router.push("/");
      } else {
        if (response.status === 401) {
          alert("Token tidak valid atau kadaluwarsa. Silakan login kembali.");
          router.push("/login");
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error("Top up failed:", error);
      alert("An error occurred during top up.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileRes, balanceRes] = await Promise.all([
          fetch(`https://take-home-test-api.nutech-integrasi.com/profile`, {
            headers,
          }),
          fetch(`https://take-home-test-api.nutech-integrasi.com/balance`, {
            headers,
          }),
        ]);

        const [profileData, balanceData] = await Promise.all([
          profileRes.json(),
          balanceRes.json(),
        ]);

        if (profileRes.ok && balanceRes.ok) {
          setProfile(profileData.data);
          setBalance(balanceData.data.balance);
        } else {
          console.error("Failed to fetch data");
          if (profileRes.status === 401 || balanceRes.status === 401) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between gap-4">
          <div className="w-full flex flex-col gap-4 justify-center">
            <img
              src={profile?.profile_image === "https://minio.nutech-integrasi.com/take-home-test/null" || !profile?.profile_image ? "/Profile Photo.png" : profile?.profile_image}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full mr-4"
            />
            <div>
              <p className="text-xl">Selamat datang,</p>
              <p className="text-3xl font-bold">
                {profile?.first_name} {profile?.last_name}
              </p>
            </div>
          </div>
          <div className="w-full bg-red-500 text-white p-4 rounded-lg flex flex-col gap-4 justify-center">
            <p className="text-sm">Saldo anda</p>
            <p className="text-2xl font-bold">Rp {balance.toLocaleString()}</p>
            <p className="text-sm">Lihat saldo</p>
          </div>
        </div>

        <form onSubmit={handleTopUp} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-xl">
              Silahkan masukan
            </label>
            <h1 className="text-3xl font-bold">Nominal Top Up</h1>
          </div>
          <div className="flex gap-4">
            <div className="w-full flex flex-col gap-4">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
                className="w-full p-2 border rounded"
                placeholder="Masukkan nominal Top Up"
              />
              <button
                type="submit"
                className="w-full bg-red-500 text-white p-2 rounded"
                disabled={parseInt(amount) < 1}
              >
                Top Up
              </button>
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              {predefinedAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => setAmount(presetAmount.toString())}
                  className="bg-gray-200 p-2 rounded"
                >
                  Rp {presetAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
