import React, { useState, useRef, useEffect } from "react";
import Layout from "@theme/Layout";
import { JSX } from "react";
import Translate from "@docusaurus/Translate";
import TeamGrid from "../components/TeamGrid";
import { TEAM_MEMBERS } from "../data/teamData";
import Link from "@docusaurus/Link";

export default function AboutUs(): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Layout title="About Us" description="About our Team">
      <section
        className="bg-white relative min-h-screen flex items-center"
        style={{
          marginTop: "calc(var(--ifm-navbar-height) * -1)",
          paddingTop: "var(--ifm-navbar-height)",
        }}
      >
        <div className="container mx-auto px-6 h-full flex items-center">
          <div className="w-full">
            <div className="flex justify-between items-end mb-16">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extralight text-gray-700 leading-none tracking-tight">
                <span
                  className="block transition-all duration-700 ease-out"
                  style={{
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                  }}
                >
                  About Us_
                </span>
                <span
                  className="block transition-all duration-700 ease-out"
                  style={{
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: "150ms",
                  }}
                >
                  Company
                </span>
              </h1>
              <span
                className="text-gray-400 text-sm transition-all duration-700 ease-out"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transitionDelay: "300ms",
                }}
              >
                AI Software Technology
              </span>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-center">
              <div className="flex flex-col justify-center items-start">
                <div className="space-y-8">
                  <div>
                    <span className="text-gray-700 text-3xl md:text-4xl font-light">
                      60.0K+
                    </span>
                    <span className="text-gray-400 text-xs uppercase block mt-1">
                      Connectivity
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700 text-3xl md:text-4xl font-light">
                      88.0K+
                    </span>
                    <span className="text-gray-400 text-xs uppercase block mt-1">
                      Performance
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-80 h-80 bg-[var(--ifm-color-primary)]" />
              </div>

              <div className="flex flex-col justify-center gap-8">
                <div className="bg-gray-200 p-6">
                  <h3 className="text-gray-700 text-base font-medium mb-2">
                    Lorem Ipsum Dolor
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Consectetur adipiscing elit sed do eiusmod tempor incididunt.
                  </p>
                </div>
                <div className="bg-gray-200 p-6">
                  <h3 className="text-gray-700 text-base font-medium mb-2">
                    Sed Ut Perspiciatis
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Unde omnis iste natus error sit voluptatem accusantium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full" style={{ margin: 0, padding: 0 }}>
        <div className="relative w-full bg-black" style={{ height: "35vw", maxHeight: "60vh", margin: 0, padding: 0 }}>
          {isPlaying && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            />
          )}

          {!isPlaying && (
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer bg-black"
            >
              <div
                className="flex items-center justify-center transition-transform hover:scale-110 w-20 h-20 rounded-full"
                style={{ border: "1px solid white" }}
              >
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  className="ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight text-gray-700 leading-tight">
                <span className="block">Our Vision_</span>
                <span className="block">Revolutionizing the</span>
                <span className="block">Perspective of AI</span>
              </h2>
              <p className="text-gray-500 text-sm max-w-xs text-right">
                Networking Technology Refers To The
                <br />
                Various Tool, Devices, And Protocols
              </p>
            </div>

            <div className="bg-gray-200 p-8">
              <div className="grid grid-cols-[2fr_3fr] gap-12">
                <div className="bg-black w-full aspect-square" />

                <div className="flex flex-col justify-center">
                  <h3 className="text-gray-700 text-xl md:text-2xl font-medium mb-4">
                    Lorem Ipsum Dolor
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                    enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>

                  <div className="flex gap-12">
                    <div>
                      <span className="text-gray-700 text-2xl md:text-3xl font-light">
                        60.0K+
                      </span>
                      <span className="text-gray-500 text-xs uppercase block mt-1">
                        Connectivity
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-700 text-2xl md:text-3xl font-light">
                        88.0K+
                      </span>
                      <span className="text-gray-500 text-xs uppercase block mt-1">
                        Performance
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-0 md:pt-2 pb-24 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-gray-600 text-3xl md:text-4xl font-normal text-left mb-12">
              Who we are
            </h2>
            <TeamGrid members={TEAM_MEMBERS} />
          </div>
        </div>
      </section>

      <section className="bg-[var(--ifm-color-primary)] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-700 text-sm md:text-base font-medium uppercase mb-4 tracking-widest">
              Join our Team
            </p>
            <h2 className="text-gray-800 text-2xl md:text-3xl font-medium mb-8">
              You share our vision? Lets work on it, together!
            </h2>
            <Link
              to="/careers"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
              style={{ borderRadius: 0 }}
            >
              Career
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
