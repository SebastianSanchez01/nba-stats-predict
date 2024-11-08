/* eslint-disable react/react-in-jsx-scope */
import Header from "../components/Header";

export default function NotFound() {
    return (
        <main className="container">
            <Header />
            <h1 className="text-4xl font-bold text-center mt-24 mb-12">Player Or Team Not Found</h1>
            <p className="text-center">Sorry, we couldn&apos;t find a player or team matching your search. Please search again.</p>
        </main>
    );
}
