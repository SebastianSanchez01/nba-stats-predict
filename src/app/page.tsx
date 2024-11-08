/* eslint-disable react/react-in-jsx-scope */
"use client";

import Header from "./components/Header";

export default function Home() {
  return (
    <main className="container">
      <Header />
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-12 mt-24">Betting Made Easy</h1>
        <p> NBA Stats Predictor is a tool for basketball enthusiasts, analysts, and fantasy sports players to project player and team performances in upcoming games. Using historical data and advanced algorithms, it predicts key statistics like points, rebounds, assists, and overall game outcomes, helping users make informed decisions and gain deeper insights into game trends and potential player impacts.</p>
      </section>
    </main>
  );
}
