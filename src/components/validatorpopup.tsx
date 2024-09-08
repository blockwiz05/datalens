import React, { useState } from 'react';

type Operator = {
  name: string;
  id: number;
  percentage: number;
  performance: {
    '24h': number;
  };
  status: string;
};

type ValidatorProps = {
  publicKey?: string;
  cluster?: string;
  status?: string;
  owner?: string;
  balance?: string;
  operators?: Operator[];
};

function formatPerformance(value: number) {
  return typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : '0.00';
}

const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute mt-3 ml-8 z-50 px-2 py-1 text-xs font-medium text-white bg-gray-700 rounded-md shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          {/* <div className="absolute  w-2 h-2 bg-gray-700 rotate-45 -top-3 left-1/2 transform -translate-x-1/2"></div> */}
        </div>
      )}
    </div>
  );
};

export default function OperatorInfovalidator({
  publicKey = '',
  cluster = '',
  status = '',
  owner = '',
  balance = '',
  operators = [],
}: ValidatorProps) {
  const truncateKey = (key: string) => {
    if (key.length > 10) {
      return `${key.slice(0, 6)}...${key.slice(-4)}`;
    }
    return key;
  };

  const getDotColor = (status: string) => {
    return status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg w-full p-6" >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Validator</h2>
      </div>
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <span className="font-medium text-gray-400">Public Key</span>
          <span className="col-span-3 break-words">{publicKey}</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <span className="font-medium text-gray-400">Cluster</span>
          <span className="col-span-3 break-words">{cluster}</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <span className="font-medium text-gray-400">Status</span>
          <span className="col-span-3">
            <span
              className={`px-2 py-1 rounded text-sm ${status.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-600'}`}
            >
              {status}
            </span>
            {status.toLowerCase() === 'active' && (
              <span className="ml-2 text-sm text-gray-400">
                , the validator performed at least one successful duty in the last two epochs
              </span>
            )}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <span className="font-medium text-gray-400">Owner</span>
          <span className="col-span-3 break-words">{owner}</span>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4">Operators</h3>
        <div className="grid grid-cols-4 gap-4">
          {operators.map((operator) => (
            <div key={operator.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Tooltip content={operator.status}>
                      <div className={`w-3 h-3 rounded-full ${getDotColor(operator.status)} mr-2 cursor-help`}></div>
                    </Tooltip>
                    <span className="text-xs text-gray-400">ID: {operator.id}</span>
                  </div>
                </div>
                <h4 className="text-sm mb-2 truncate">{operator.name}</h4>
                <Tooltip content="Performance 24H">
                  <p className="text-2xl font-bold cursor-help">{formatPerformance(operator.performance['24h'])}%</p>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}