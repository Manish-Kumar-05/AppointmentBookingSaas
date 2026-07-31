import { Button } from "@/components/ui/button";
import Link from "next/link";

const landingPage = () => {
  return (
    <div>
      <Link href={"/auth/register"}>
        <Button>Register</Button>
      </Link>
    </div>
  );
};

export default landingPage;
