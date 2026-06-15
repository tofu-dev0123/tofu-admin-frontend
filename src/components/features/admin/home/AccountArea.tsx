import React from 'react';

interface AccountAreaProps {
  value: string;
}

function AccountArea({ value }: AccountAreaProps) {
  return (
    <div className="w-full px-4 mb-4 flex items-center">
      <p className="w-full lg:text-lg text-md px-2">{value}</p>
    </div>
  );
}

export default AccountArea;
