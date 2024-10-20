"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Service {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}

interface Banner {
  banner_name: string;
  banner_image: string;
  description: string;
}

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const router = useRouter();

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

        const [profileRes, balanceRes, servicesRes, bannersRes] =
          await Promise.all([
            fetch(`https://take-home-test-api.nutech-integrasi.com/profile`, {
              headers,
            }),
            fetch(`https://take-home-test-api.nutech-integrasi.com/balance`, {
              headers,
            }),
            fetch(`https://take-home-test-api.nutech-integrasi.com/services`, {
              headers,
            }),
            fetch(`https://take-home-test-api.nutech-integrasi.com/banner`, {
              headers,
            }),
          ]);

        const [profileData, balanceData, servicesData, bannersData] =
          await Promise.all([
            profileRes.json(),
            balanceRes.json(),
            servicesRes.json(),
            bannersRes.json(),
          ]);

        if (profileRes.ok && balanceRes.ok && servicesRes.ok && bannersRes.ok) {
          setProfile(profileData.data);
          setBalance(balanceData.data.balance);
          setServices(servicesData.data);
          setBanners(bannersData.data);
        } else {
          console.error("Failed to fetch data");
          if (
            profileRes.status === 401 ||
            balanceRes.status === 401 ||
            servicesRes.status === 401
          ) {
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
    <div className="container mx-auto px-4 py-8 flex flex-col gap-16">
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

      <div className="flex justify-between gap-4">
        {services.map((service) => (
          <Link
            href={`/payment/${service.service_code}`}
            key={service.service_code}
            className="w-[64px]"
          >
            <img
              src={service.service_icon}
              alt={service.service_name}
              width={64}
              height={64}
              className="mx-auto"
            />
            <p className="mt-2 w-[64px] text-[10px] text-center">
              {service.service_name}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Temukan promo menarik</h2>
        <div className="flex overflow-x-auto space-x-4">
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner.banner_image}
              alt={banner.banner_name}
              className="rounded-lg w-[320px] h-[160px]"
            />
            // {/* <p className="mt-2">{banner.description}</p> */}
          ))}
        </div>
      </div>
    </div>
  );
}
