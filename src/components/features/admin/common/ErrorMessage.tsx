import { AlertCircle } from 'lucide-react';

function ErrorMessage({ errorMessage }: { errorMessage: string[] }) {
  return (
    <>
      <div className="flex flex-col mx-6 my-4 bg-white rounded-md p-2 gap-2">
        {errorMessage.map((message) => (
          <div key={message} className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <p className="text-red-600">{message}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default ErrorMessage;
