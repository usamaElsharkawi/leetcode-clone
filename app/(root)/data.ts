// Static module-level data — evaluated once at import, not on every RSC request.

export const features = [
  {
    id: "feature-code",
    icon: "code" as const,
    title: "Interactive Coding",
    description:
      "Practice with real-world coding challenges and get instant feedback on your solutions.",
  },
  {
    id: "feature-trophy",
    icon: "trophy" as const,
    title: "Track Progress",
    description:
      "Monitor your improvement with detailed analytics and achievement systems.",
  },
  {
    id: "feature-users",
    icon: "users" as const,
    title: "Global Community",
    description:
      "Learn from thousands of developers worldwide and share your knowledge.",
  },
  {
    id: "feature-zap",
    icon: "zap" as const,
    title: "Real-time Feedback",
    description:
      "Get instant feedback on your solutions with detailed explanations.",
  },
] as const;

export type FeatureIcon = (typeof features)[number]["icon"];

export const stats = [
  { id: "stat-solved", number: "50K+", label: "Problems Solved" },
  { id: "stat-devs", number: "10K+", label: "Active Developers" },
  { id: "stat-langs", number: "25+", label: "Programming Languages" },
  { id: "stat-rate", number: "98%", label: "Success Rate" },
] as const;

export const problemCategories = [
  {
    id: "cat-easy",
    level: "Beginner",
    title: "Easy Problems",
    description:
      "Perfect for getting started with basic programming concepts and syntax.",
    count: "500+ Problems",
    color: "amber" as const,
  },
  {
    id: "cat-medium",
    level: "Intermediate",
    title: "Medium Problems",
    description:
      "Challenge yourself with data structures and algorithm problems.",
    count: "800+ Problems",
    color: "indigo" as const,
  },
  {
    id: "cat-hard",
    level: "Advanced",
    title: "Hard Problems",
    description:
      "Master complex algorithms and compete in programming contests.",
    count: "300+ Problems",
    color: "rose" as const,
  },
] as const;

export type CategoryColor = (typeof problemCategories)[number]["color"];
