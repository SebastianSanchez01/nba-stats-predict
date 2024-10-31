/* eslint-disable react/react-in-jsx-scope */
import Link from "next/link";
import { FaBasketballBall } from "react-icons/fa";

export default function Header() {
    return (
        <header className="flex items-center p-3">
            <div className="flex items-center gap-16">
                <Link href={"/"} className="font-bold text-xl flex gap-0.5 items-center text-orange-600">
                    <FaBasketballBall size={20} />
                    <span className="text-blue-600">NBA</span>
                    <span className="text-red-600">Wise</span>
                </Link>
            </div>
            <div className="flex-grow flex justify-center">
                <input type="text" placeholder="Search players and teams..." className="rounded-full text-center border border-black p-2 w-72 ml-24" />
            </div>
            <nav className="flex gap-6 items-center">
                <Link href={"/"}>Sign in</Link>
                <Link href={"/"} className="rounded-full bg-blue-600 text-white py-2 px-4">Get Started</Link>
            </nav>
        </header>
    );
}
