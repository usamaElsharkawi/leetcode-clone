import { Code2, Trophy, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "@/app/(root)/data";
import type { FeatureIcon, CategoryColor } from "@/app/(root)/data";

const iconMap: Record<FeatureIcon, LucideIcon> = {
  code: Code2,
  trophy: Trophy,
  users: Users,
  zap: Zap,
};

const iconClasses: Record<CategoryColor, string> = {
  amber: "bg-[var(--amber-bg)] text-[var(--amber-text-emphasis)]",
  indigo: "bg-[var(--indigo-bg)] text-[var(--indigo-text-emphasis)]",
  rose:  "bg-[var(--rose-bg)] text-[var(--rose-text-emphasis)]",
};

// Alternating color cycle for the 4 feature cards
const colorCycle: CategoryColor[] = ["amber", "indigo", "amber", "indigo"];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[var(--surface-subtle)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Everything you need to{" "}
            <span className="text-[var(--amber-text-emphasis)]">excel</span>
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
            Our platform provides comprehensive tools and resources to help
            you become a better programmer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const colorScheme = colorCycle[index];
            const Icon = iconMap[feature.icon];
            return (
              <Card
                key={feature.id}
                className="hover:shadow-lg transition-shadow duration-200 border-[var(--border-default)]"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 ${iconClasses[colorScheme]} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-[var(--text-primary)]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--text-muted)]">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
