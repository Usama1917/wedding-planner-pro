import React from 'react';
import { Hero } from '../components/Hero';
import { Couple } from '../components/Couple';
import { Message } from '../components/Message';
import { Countdown } from '../components/Countdown';
import { EventDetails } from '../components/EventDetails';
import { Gallery } from '../components/Gallery';
import { RSVP } from '../components/RSVP';
import { Footer } from '../components/Footer';
import { FloatingControls } from '../components/FloatingControls';
import { Ring3D } from '../components/Ring3D/Ring3D';
import { useLenis } from '../hooks/use-lenis';

export default function Home() {
  useLenis();

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <FloatingControls />
      <Ring3D />
      
      <div className="relative z-10">
        <Hero />
        <Couple />
        <Message />
        <Countdown />
        <EventDetails />
        <Gallery />
        <RSVP />
        <Footer />
      </div>
    </main>
  );
}
