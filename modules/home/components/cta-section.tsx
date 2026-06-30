import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 bg-linear-to-r from-amber-600 to-amber-300 dark:from-amber-600 dark:to-indigo-600 rounded-md">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to start your coding journey?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of developers who are improving their skills every day
        </p>
        <Button
          size="lg"
          className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
        >
          Get Started for Free
        </Button>
      </div>
    </section>
  );
}
