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

  return (
    <Card className="m-4 mx-auto flex w-[90%] max-w-[700px] flex-col items-center justify-center p-4">
      <CardHeader className="flex flex-col items-center justify-center">
        <CircleX color="#FF0000" size={40} />
        <CardTitle className="text-center">Error</CardTitle>

        <CardDescription className="text-center">
          <p>Error Status Code: {error.status}</p>
          <p>Error Message: {errorMessage}</p>
        </CardDescription>
      </CardHeader>

      <CardTitle className="text-center">Please try again later</CardTitle>

      <Button onClick={() => navigate({ to: '/' })}>Goto Home Page</Button>
    </Card>
  );
};

export default Error;
