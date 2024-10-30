/* eslint-disable react/react-in-jsx-scope */

import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <header className="flex gap-4 justify-between py-4">
        <div className="items-center flex gap-8">
          <Link href={"/"} className="font-bold text-xl">
            <span className="text-blue-600">NBA</span>
            <span className="text-red-600">Wise</span>
          </Link>
          <nav className="flex gap-6">
            <Link href={"/"}>nav1</Link>
            <Link href={"/"}>nav2</Link>
            <Link href={"/"}>nav3</Link>
          </nav>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href={"/"}>Sign in</Link>
          <Link href={"/"} className="rounded-full bg-blue-600 text-white py-2 px-4">Get Started</Link>
        </nav>
      </header>
    </main>
  );
}
