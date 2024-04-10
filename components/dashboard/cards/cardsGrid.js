'use client';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";

export default function DasboardCards() {
  return (
    <>
      <section className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Simple expenses table
            </Typography>
            <Typography>
              Review your day to day expenses in a simple way
            </Typography>
          </CardBody>
          <CardFooter className="border-t border-blue-gray-50 p-4">
            <Link href="/dashboard/simple-table">
              <Button>Start</Button>
            </Link>
          </CardFooter>
        </Card>

      </section>
    </>
  );
}