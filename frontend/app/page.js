import { Button } from "@/components/ui/button";
import styles from "./page.module.css";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className="text-3xl font-bold text-red-500">Hello Tailwind!</h1>
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link href={"/sign-in"} className="text-blue-500 hover:text-blue-700">
          <Button >
            Sign In
          </Button >
        </Link>

        <Link href={"/dashboard"} className="text-blue-500 hover:text-blue-700">
          <Button variant="primary" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Go to Dashboard
          </Button >
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mt-8">User Profile</h2>
      <p className="text-gray-700 mt-2">Manage your profile settings and
        preferences.</p>
      <Button variant="destructive">Destructive</Button>

      <UserButton />
    </div>
  );
}
