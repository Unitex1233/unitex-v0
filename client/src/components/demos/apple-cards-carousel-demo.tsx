import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function AppleCardsCarouselDemo() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <div className="w-full h-full py-4">
            <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-[var(--color-text)] font-sans mb-4">
                Discover Progress
            </h2>
            <Carousel items={cards} />
        </div>
    );
}

const DummyContent = () => {
    return (
        <>
            {[...new Array(3).fill(1)].map((_, index) => {
                return (
                    <div
                        key={"dummy-content" + index}
                        className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
                    >
                        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                            <span className="font-bold text-neutral-700 dark:text-neutral-200">
                                Building in public is the new standard.
                            </span>{" "}
                            Share your daily wins, track your progress, and connect with other builders who are also on the journey.
                        </p>
                    </div>
                );
            })}
        </>
    );
};

const data = [
    {
        category: "Featured",
        title: "The Solopreneur Journey",
        src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop",
        content: <DummyContent />,
    },
    {
        category: "Trending",
        title: "AI Tools for Builders",
        src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop",
        content: <DummyContent />,
    },
    {
        category: "Community",
        title: "Join the #OpenSource Movement",
        src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop",
        content: <DummyContent />,
    },
    {
        category: "Productivity",
        title: "Mastering Deep Work",
        src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop",
        content: <DummyContent />,
    },
];
