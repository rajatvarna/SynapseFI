import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to SynapseFI</CardTitle>
          <CardDescription>The future of financial insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Our new UI is powered by Shadcn/UI for a sleek and modern
            experience. Explore the features below.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Learn More</Button>
          <Button>Get Started</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
