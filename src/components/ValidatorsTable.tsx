import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
  XCircleIcon,
  X,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import copy from "clipboard-copy";
import OperatorInfovalidator from "./validatorpopup"; // Adjust according to your modal component

export default function ValidatorsTable() {
  const [validators, setValidators] = useState<
    {
      public_key: string;
      owner_address: string;
      cluster: string;
      status: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedValidator, setSelectedValidator] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchValidators(currentPage);
  }, [currentPage]);

  const fetchValidators = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/get-data-validators?page=${page}&perPage=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch validators");
      }
      const data = await response.json();
      setValidators(data.validators);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const openModal = (validator: any) => {
    setSelectedValidator(validator);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedValidator(null);
    setIsModalOpen(false);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return validators.slice(startIndex, endIndex);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded-md ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
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

  const paginatedValidators = getPaginatedData();

  return (
    <div className="bg-[rgba(249,250,251,0.1)] w-[700px] h-[730px] ml-[0px] text-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Validators</h2>
      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                  Public Key
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                  Owner
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                  Cluster
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {validators.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-3 px-4 text-center text-gray-400"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                validators.map((validator, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-gray-800"
                  >
                    <td
                      className="py-3 px-4 text-sm cursor-pointer hover:underline"
                      onClick={() => openModal(validator)}
                    >
                      {validator.public_key.slice(0, 10)}...
                      {validator.public_key.slice(-4)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-900 text-blue-300 py-1 px-2 rounded-full cursor-default">
                          {validator.owner_address.slice(0, 6)}...
                          {validator.owner_address.slice(-4)}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(validator.owner_address, "owner", index)
                          }
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
                    <td className="py-3 px-4 text-sm">
                      {validator.cluster.slice(0, 6)}...
                      {validator.cluster.slice(-4)}
                    </td>
                    <td className="py-3 px-4">
                      {validator.status === "Active" ? (
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

      {
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          {/* <div className="flex-grow flex justify-center">
            {renderPageNumbers()}
          </div> */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      }

{isModalOpen && selectedValidator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <OperatorInfovalidator
              publicKey={selectedValidator.public_key}
              cluster={selectedValidator.cluster}
              status={selectedValidator.status}
              owner={selectedValidator.owner_address}
              operators={selectedValidator.operators}
            />
          </div>
        </div>
      )}
    </div>
  );
}
