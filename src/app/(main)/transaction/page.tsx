"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Transaction {
  invoice_number: string;
  transaction_type: string;
  description: string;
  total_amount: number;
  created_on: string;
}

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchTransactions();

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
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTransactions((prev) => [...prev, ...data.data.records]);
        setOffset((prev) => prev + limit);
        setHasMore(data.data.records.length === limit);
      } else if (response.status === 401) {
        alert("Token tidak valid atau kadaluwarsa. Silakan login kembali.");
        router.push("/login");
      } else {
        alert(
          data.message || "Terjadi kesalahan saat mengambil data transaksi."
        );
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      alert("Terjadi kesalahan saat mengambil data transaksi.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between gap-4">
          <div className="w-full flex flex-col gap-4 justify-center">
            <img
              src={
                profile?.profile_image ===
                  "https://minio.nutech-integrasi.com/take-home-test/null" ||
                !profile?.profile_image
                  ? "/Profile Photo.png"
                  : profile?.profile_image
              }
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

        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Semua Transaksi</h1>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.invoice_number}
                className="border-gray-100 border rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p
                      className={`font-bold ${
                        transaction.transaction_type === "TOPUP"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.transaction_type === "TOPUP" ? "+" : "-"} Rp{" "}
                      {transaction.total_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_on).toLocaleString()}
                    </p>
                  </div>
                  <p>{transaction.description}</p>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={fetchTransactions}
              className="mt-4 text-red-500 px-4 py-2 rounded font-medium text-lg"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
