"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export default function Payment() {
  const { serviceCode } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchServiceDetails();

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
  }, [serviceCode, router]);

  const fetchServiceDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        const selectedService = data.data.find(
          (s: Service) => s.service_code === serviceCode
        );
        if (selectedService) {
          setService(selectedService);
        } else {
          console.error("Service not found");
          router.push("/");
        }
      } else {
        console.error(data.message);
        if (response.status === 401) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch service details:", error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !service) return;

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ service_code: service.service_code }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Transaksi berhasil");
        router.push("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("An error occurred during payment.");
    }
  };

  if (!service) return <div>Loading...</div>;

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
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="block text-xl">
              Pembayaran
            </label>
            <div className="flex items-center mb-6">
              <img
                src={service.service_icon}
                alt={service.service_name}
                width={32}
                height={32}
                className="mr-4"
              />
              <h1 className="text-xl font-semibold">{service.service_name}</h1>
            </div>
          </div>
          <div className="">
            <div className="flex items-center mb-6">
              <p className="text-xl">
                Biaya: Rp {service.service_tariff.toLocaleString()}
              </p>
            </div>
            <form onSubmit={handlePayment}>
              <button
                type="submit"
                className="w-full bg-red-500 text-white px-4 py-2 rounded"
              >
                Bayar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
