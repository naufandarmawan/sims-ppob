"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link className="flex items-center gap-2" href="/">
            <img
              src="/logo.png"
              alt="SIMS PPOB Logo"
            />
            <p className="text-xl font-semibold">SIMS PPOB</p>
          </Link>
          <div className="flex space-x-16 font-medium">
            <NavItem href="/topup" label="Top Up" currentPath={pathname} />
            <NavItem
              href="/transaction"
              label="Transaction"
              currentPath={pathname}
            />
            <NavItem href="/profile" label="Akun" currentPath={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, label, currentPath }) => {
  const isActive = currentPath === href;
  return (
    <Link href={href}>
      <span
        className={`${
          isActive ? "text-red-500 font-bold" : "text-gray-600"
        } hover:text-red-500`}
      >
        {label}
      </span>
    </Link>
  );
};

export default Navbar;
