import type { CustomError } from '@/ts/errorClass';
import { CircleX } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { useNavigate } from '@tanstack/react-router';

type ErrorProps = {
  error: CustomError;
};

const Error = ({ error }: ErrorProps) => {
  const navigate = useNavigate();
  const errorMessage = error.message || 'An error occurred';
  const status = error.status || 500;

  return (
    <section className="flex h-full w-full items-center justify-center">
      <Card>
        <CardHeader className="bg-primary/100">
          <CircleX className="h-16 w-16 rounded-full border-2 border-white bg-red-500 text-white" />
          <CardTitle className="text-center">Error</CardTitle>
        </CardHeader>

        <CardDescription className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-secondary">Error Status Code: {status}</p>
            <p className="text-secondary">Error Message: {errorMessage}</p>
          </div>

          <CardTitle className="text-center text-black">Please try again later</CardTitle>

          <Button onClick={() => navigate({ to: '/' })}>Goto Home Page</Button>
        </CardDescription>
      </Card>
    </section>
  );
};

export default Error;
