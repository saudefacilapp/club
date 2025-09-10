import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

const banners = [
  {
    id: 1,
    title: "Saúde e Bem-estar",
    image: "/src/assets/health-library-hero.jpg",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: 2,
    title: "Primeiros Socorros",
    image: "/src/assets/primeiros-socorros-cover.jpg",
    gradient: "from-red-500 to-rose-600"
  },
  {
    id: 3,
    title: "Receitas Saudáveis",
    image: "/src/assets/receitas-saudaveis-cover.jpg",
    gradient: "from-orange-500 to-amber-600"
  },
  {
    id: 4,
    title: "Colorir Animais",
    image: "/src/assets/colorir-animais-cover.jpg",
    gradient: "from-purple-500 to-violet-600"
  }
];

export const BannerCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    // Auto-scroll functionality
    const scrollNext = () => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    };

    const interval = setInterval(scrollNext, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full mb-8">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="relative h-48 group">
                  {/* Background gradient as fallback */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} opacity-80`} />
                  
                  {/* Image overlay */}
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Hide image if it fails to load, show gradient instead
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold text-center px-4">
                      {banner.title}
                    </h3>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};