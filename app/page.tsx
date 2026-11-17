import { Benefits } from "@/components/home/Benefits";
import { CresceRoutine } from "@/components/home/CresceRoutine";
import { DayNightRoutine } from "@/components/home/DayNightRoutine";
import { Hero } from "@/components/home/Hero";
import { hero } from "@/data/home";
import { NeedCards } from "@/components/home/NeedCards";
import { Showcase } from "@/components/home/Showcase";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero withImage={hero.image} />
      <NeedCards />
      <Showcase />
      <Benefits />
      <CresceRoutine />
      <Testimonials />
      <DayNightRoutine />
    </>
  );
}
