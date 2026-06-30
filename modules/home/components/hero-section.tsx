import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Play, Star } from "lucide-react";
import { stats } from "@/app/(root)/data";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Badge */}
        <Badge
          variant="secondary"
          className="mb-8 bg-[var(--amber-bg)] text-[var(--amber-text)] border-[var(--amber-border)] hover:bg-[var(--amber-bg-hover)]"
        >
          <Star className="w-4 h-4 mr-2" />
          Join 10,000+ developers already coding
        </Badge>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-tight mb-8">
          Master{" "}
          <span className="relative inline-block">
            <span className="px-6 py-3 bg-[var(--amber-fill)] text-[var(--text-on-accent)] rounded-2xl transform -rotate-1 inline-block shadow-lg">
              Problem
            </span>
          </span>{" "}
          Solving
          <br />
          with{" "}
          <span className="relative inline-block">
            <span className="px-6 py-3 bg-[var(--indigo-fill)] text-[var(--text-on-accent)] rounded-2xl transform rotate-1 inline-block shadow-lg">
              Code
            </span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-3xl mx-auto mb-12 leading-relaxed">
          Challenge yourself with thousands of coding problems, compete with
          developers worldwide, and accelerate your programming journey with
          real-time feedback and expert solutions.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-[var(--amber-fill)] hover:bg-[var(--amber-text-emphasis)] text-[var(--text-on-accent)] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Coding Now
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-[var(--indigo-border)] text-[var(--indigo-text-emphasis)] hover:bg-[var(--indigo-bg)]"
          >
            Browse Problems
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                {stat.number}
              </div>
              <div className="text-[var(--text-muted)] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
