"use client";

import { useState } from "react";
import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Spotlight from "@/components/Spotlight";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeHeader />
      <Hero />
      <Features />
      <Spotlight />
      <AboutUs />
      <Footer />
      <ChatBubble />
    </main>
  );
}
