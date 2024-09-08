"use client";

import { useState, useEffect } from "react"
import {
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
  XCircleIcon,
  X,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import copy from "clipboard-copy"
import OperatorInfo from "./OperatorInfo"

export default function DataTable() {
  const [operators, setOperators] = useState<
    { logo: string; name: string; owner_address: string; validators: number; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [hoveredOperator, setHoveredOperator] = useState<{ logo: string; name: string } | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    console.log(`Current page: ${currentPage}`);
    fetchOperators(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleEscape = (event: any) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const fetchOperators = async (page: number) => {
    try {
      console.log(`Fetching operators for page: ${page}`);
      const response = await fetch(`/api/get-data-operators?page=${page}&perPage=${itemsPerPage}`);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch operators");
      }
      
      const data = await response.json();
      console.log("Fetched data:", data);

      const formattedData = data.operators.map((operator: any) => ({
        name: operator.name,
        owner_address: operator.owner_address,
        validators: operator.validators_count,
        status: operator.status === "Active" ? "Active" : "Inactive",
        logo: operator.logo,
        location: operator.location,
        eth1_node_client: operator.eth1_node_client,
        eth2_node_client: operator.eth2_node_client,
        mev_relays: operator.mev_relays,
        website_url: operator.website_url,
        twitter_url: operator.twitter_url,
        linkedin_url: operator.linkedin_url,
        public_key: operator.public_key,
        descrption: operator.descrption,
        performance: operator.performance,
        fee: operator.fee,
      }));

      console.log("Formatted data console:", formattedData);
      console.log("Formatted data name:", formattedData[0].name);
      const isLastPage = formattedData.length < itemsPerPage;
      setOperators(formattedData);
      setLoading(false);
      setIsLastPage(isLastPage);
      console.log(`Is last page: ${isLastPage}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching operators:", err.message);
    }
  };
  const handleCopy = (text: string, field: string, index: number) => {
    copy(text);
    setCopiedStates((prevCopiedStates) => ({
      ...prevCopiedStates,
      [`${field}-${index}`]: true,
    }));
  
    setTimeout(() => {
      setCopiedStates((prevCopiedStates) => ({
        ...prevCopiedStates,
        [`${field}-${index}`]: false,
      }));
    }, 2000);
  };
  
  const closeModal = () => {
    setSelectedOperator(null);
    setIsModalOpen(false);
  };

  const openModal = (operator: any) => {
    setSelectedOperator(operator);
    setIsModalOpen(true);
  };

  const goToPage = (page: number) => {
    if (page < 1 || (page > currentPage && isLastPage)) return;
    
    console.log(`Navigating to page: ${page}`);
    setCurrentPage(page);
    setLoading(true);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return operators.slice(startIndex, endIndex);
  };

  const TableSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded mb-4"></div>
      {[...Array(itemsPerPage)].map((_, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  const paginatedOperators = getPaginatedData();

  return (
    <div className="bg-[rgba(249,250,251,0.1)] w-[700px] h-[730px] ml-[30px] text-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Operators</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Owner</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Validators</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {operators.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 px-4 text-center text-gray-400">No data available</td>
                </tr>
              ) : (
                operators.map((operator, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center space-x-2 relative">
                        <img
                          src={operator.logo || "/icons/logo.png"}
                          alt={`${operator.name} logo`}
                          className="w-6 h-6 rounded-full"
                        />
                        <span
                          onMouseEnter={() => setHoveredOperator(operator)}
                          onMouseLeave={() => setHoveredOperator(null)}
                          onClick={() => openModal(operator)}
                          className="cursor-pointer hover:underline"
                        >
                          {operator.name.slice(0, 6)}...{operator.name.slice(-4)}
                        </span>
                        {hoveredOperator === operator && (
                          <div
                            className="absolute left-0 top-full mt-1 p-2 bg-gray-700 text-white rounded shadow-lg z-10 transition-opacity duration-300"
                            style={{ minWidth: "200px" }}
                          >
                            {operator.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-900 text-blue-300 py-1 px-2 rounded-full">
                          {operator.owner_address.slice(0, 6)}...{operator.owner_address.slice(-4)}
                        </span>
                        <button
                          onClick={() => handleCopy(operator.owner_address, "owner", index)}
                          className="text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          {copiedStates[`owner-${index}`] ? (
                            <CheckIcon className="w-4 h-4" />
                          ) : (
                            <CopyIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{operator.validators}</td>
                    <td className="py-3 px-4">
                      {operator.status === "Active" ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={isLastPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {isModalOpen && selectedOperator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
            }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <OperatorInfo {...selectedOperator} />
          </div>
        </div>
      )}
    </div>
  );
}
