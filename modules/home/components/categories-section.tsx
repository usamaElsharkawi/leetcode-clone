import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { problemCategories } from "@/app/(root)/data";
import type { CategoryColor } from "@/app/(root)/data";

const cardClasses: Record<CategoryColor, string> = {
  amber:
    "bg-[var(--cat-card-bg)] border-[var(--amber-border)] hover:border-[var(--amber-border-hover)]",
  indigo:
    "bg-[var(--cat-card-bg)] border-[var(--indigo-border)] hover:border-[var(--indigo-border-hover)]",
  rose:
    "bg-[var(--cat-card-bg)] border-[var(--rose-border)] hover:border-[var(--rose-border-hover)]",
};

const badgeClasses: Record<CategoryColor, string> = {
  amber:  "bg-[var(--amber-fill)] text-white",
  indigo: "bg-[var(--indigo-fill)] text-white",
  rose:   "bg-[var(--rose-fill)] text-white",
};

const countClasses: Record<CategoryColor, string> = {
  amber:  "text-[var(--amber-text-emphasis)]",
  indigo: "text-[var(--indigo-text-emphasis)]",
  rose:   "text-[var(--rose-text-emphasis)]",
};

export function CategoriesSection() {
  return (
    <section id="problems" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Choose your{" "}
            <span className="text-[var(--indigo-text-emphasis)]">challenge</span>
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
            From beginner-friendly puzzles to advanced algorithmic challenges
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problemCategories.map((category) => (
            <Card
              key={category.id}
              className={`border-2 hover:shadow-lg transition-all duration-200 ${cardClasses[category.color]}`}
            >
              <CardHeader>
                <Badge className={`w-fit ${badgeClasses[category.color]}`}>
                  {category.level}
                </Badge>
                <CardTitle className="text-[var(--cat-card-text)]">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-[var(--cat-card-text-muted)]">
                  {category.description}
                </CardDescription>
                <div className={`font-semibold ${countClasses[category.color]}`}>
                  {category.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
