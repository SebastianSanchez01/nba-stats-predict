/* eslint-disable react/react-in-jsx-scope */

import Header from "../componenets/Header";


export default function NotFound() {
    return (
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold">Player Not Found</h1>
            <p>Sorry, we couldn&apos;t find a player matching your search.</p>
        </main>
    );
}
