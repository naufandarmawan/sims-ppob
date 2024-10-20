"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProfile(data.data);
      } else {
        console.error(data.message);
        if (response.status === 401) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !profile) return;

    try {
      const response = await fetch(
        "https://take-home-test-api.nutech-integrasi.com/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: profile.first_name,
            last_name: profile.last_name,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProfile(data.data);
        setIsEditing(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleUpdateProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      try {
        const response = await fetch(
          "https://take-home-test-api.nutech-integrasi.com/profile/image",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        const data = await response.json();
        if (response.ok) {
          setProfile(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to update profile picture:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-80 py-8">
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            profile?.profile_image ===
              "https://minio.nutech-integrasi.com/take-home-test/null" ||
            !profile?.profile_image
              ? "/Profile Photo.png"
              : profile?.profile_image
          }
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full mb-4"
          onClick={() => document.getElementById("profilePicture")?.click()}
        />
        <input
          type="file"
          id="profilePicture"
          hidden
          onChange={handleUpdateProfilePicture}
          accept="image/jpeg,image/png"
        />
        <h2 className="text-2xl font-bold">
          {profile.first_name} {profile.last_name}
        </h2>
      </div>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full p-2 border rounded"
            disabled
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block mb-1">
            Nama Depan
          </label>
          <input
            id="firstName"
            type="text"
            value={profile.first_name}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
            className="w-full p-2 border rounded"
            disabled={isEditing === false}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1">
            Nama Belakang
          </label>
          <input
            id="lastName"
            type="text"
            value={profile.last_name}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
            className="w-full p-2 border rounded"
            disabled={isEditing === false}
          />
        </div>
        {!isEditing && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className=" bg-gray-300 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
        {isEditing && (
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Batalkan
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
