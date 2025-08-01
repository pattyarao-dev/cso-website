"use client";
import Image from "next/image";
import "./homepage-styles.css";
import useFetchData from "@/hooks/useFetchData";
import { Loader } from "@mantine/core";
import AnnouncementHomeCarousel from "@/components/AnnouncementHomeCarousel";

const Homepage = () => {
  // data fetching
  const { data: announcements, loading: announcementsLoading } = useFetchData(
    "/api/announcements/five",
  );

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Top 5 Announcements
  // const recentAnnouncements = announcements?.slice(0, 3);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <section className="section-layout gradient-background flex-col gap-6">
        <Image
          src="/cso-logo-green.png"
          width={300}
          height={300}
          alt="CSO Logo"
        />
        <button
          className="bg-primary text-secondary inner-box-shadow px-6 py-4 rounded-full"
          onClick={() => scrollToSection("title-section")}
        >
          <p className="text-xl font-semibold uppercase">Explore cso</p>
        </button>
      </section>

      <section
        id="title-section"
        className="section-layout gradient-background-light relative"
      >
        <div className="z-10 w-full md:w-1/2 p-10 md:p-2 flex flex-col justify-center gap-6">
          <p className="scroll-in-animation w-full text-base md:text-xl uppercase font-bold gradient-text">
            Council of Student Organizations
          </p>
          <h1 className="scroll-in-animation uppercase text-4xl md:text-6xl font-bold text-shadow">
            Always for the passion for service
          </h1>
          <hr className="scroll-in-animation w-full border-4 border-primary" />
          <p className="scroll-in-animation w-full text-sm md:text-lg uppercase from-bg gradient-text font-lexend font-bold tracking-wider text-shadow">
            48 organizations. 9 executive teams. 1 cso
          </p>
        </div>
      </section>

      <section className="w-full min-h-screen p-10 flex flex-col items-center justify-center gradient-background-light gap-8 md:gap-16">
        <h1 className="mt-16 text-3xl md:text-5xl uppercase gradient-text font-bold">
          announcements
        </h1>

        {/* TODO: implement announcement carousel.
              - needs to be 3 announcement previews
              - should be a slider (1 announcement preview at a time)
          */}
        {/* <div className="w-full flex flex-col gap-4 items-center">
          <div className="w-full md:w-[70%] flex flex-col items-center justify-center">
            {announcementsLoading ? (
              <Loader color="green" type="bars" size={"xl"} />
            ) : (
              <AnnouncementHomeCarousel announcements={announcements} />
            )}
          </div>
        </div> */}
      </section>
    </main>
  );
};

export default Homepage;
