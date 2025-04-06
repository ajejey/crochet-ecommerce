'use client';

import { useState, useEffect } from 'react';
import { getLogs, resolveLog } from './actions';
import { formatDate, formatDateTime } from '@/utils/format';
import { XIcon } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    resolved: '',
    dateRange: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const result = await getLogs({
        filters: {
          level: filters.level || undefined,
          category: filters.category || undefined,
          resolved: filters.resolved === '' ? undefined : filters.resolved === 'true',
          dateRange: filters.dateRange
        },
        pagination: {
          page: pagination.page,
          limit: pagination.limit
        }
      });

      if (result.success) {
        setLogs(result.logs);
        setPagination({
          ...pagination,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems
        });
      } else {
        console.error('Error fetching logs:', result.message);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (logId) => {
    try {
      const result = await resolveLog(logId, 'Admin', 'Resolved from admin dashboard');
      if (result.success) {
        // Update the log in the local state
        setLogs(logs.map(log => 
          log._id === logId ? { ...log, resolved: true, resolvedAt: new Date() } : log
        ));
      }
    } catch (error) {
      console.error('Error resolving log:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-rose-100 text-rose-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'payment': return 'bg-green-100 text-green-800';
      case 'order': return 'bg-purple-100 text-purple-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'inventory': return 'bg-yellow-100 text-yellow-800';
      case 'user': return 'bg-indigo-100 text-indigo-800';
      case 'email': return 'bg-pink-100 text-pink-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">System Logs</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
              <option value="">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
              <option value="">All Categories</option>
              <option value="payment">Payment</option>
              <option value="order">Order</option>
              <option value="shipping">Shipping</option>
              <option value="inventory">Inventory</option>
              <option value="user">User</option>
              <option value="email">Email</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="resolved"
              value={filters.resolved}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
              <option value="">All Status</option>
              <option value="false">Unresolved</option>
              <option value="true">Resolved</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No logs found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Context
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelBadgeClass(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadgeClass(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.orderId && <div><span className="font-medium">Order:</span> {log.orderId}</div>}
                      {log.userId && <div><span className="font-medium">User:</span> {log.userId}</div>}
                      {log.sellerId && <div><span className="font-medium">Seller:</span> {log.sellerId}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.resolved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Resolved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Unresolved
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {!log.resolved && (
                        <button
                          onClick={() => handleResolve(log._id)}
                          className="text-rose-600 hover:text-rose-900"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowModal(true);
                        }}
                        className="ml-3 text-blue-600 hover:text-blue-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  
                  {/* Page numbers - simplified for brevity */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Log Details Modal */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setShowModal(false)}
              aria-hidden="true"
            ></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Log Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Log ID</h4>
                      <p className="text-sm text-gray-900">{selectedLog._id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                      <p className="text-sm text-gray-900">{formatDateTime(selectedLog.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Level</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeClass(selectedLog.level)}`}>
                        {selectedLog.level.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(selectedLog.category)}`}>
                        {selectedLog.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      {selectedLog.resolved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Unresolved
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Message</h4>
                    <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">{selectedLog.message}</p>
                  </div>
                  
                  {/* Context Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Context</h4>
                    <div className="mt-1 bg-gray-50 p-2 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {selectedLog.userId && (
                          <div>
                            <span className="text-xs text-gray-500">User ID:</span>
                            <p className="text-sm text-gray-900 truncate">{selectedLog.userId}</p>
                          </div>
                        )}
                        {selectedLog.orderId && (
                          <div>
                            <span className="text-xs text-gray-500">Order ID:</span>
                            <p className="text-sm text-gray-900 truncate">{selectedLog.orderId}</p>
                          </div>
                        )}
                        {selectedLog.sellerId && (
                          <div>
                            <span className="text-xs text-gray-500">Seller ID:</span>
                            <p className="text-sm text-gray-900 truncate">{selectedLog.sellerId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Details - JSON viewer */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Details</h4>
                    <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                  
                  {/* Resolution Information */}
                  {selectedLog.resolved && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-500">Resolution</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <span className="text-xs text-gray-500">Resolved At:</span>
                          <p className="text-sm text-gray-900">{formatDateTime(selectedLog.resolvedAt)}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Resolved By:</span>
                          <p className="text-sm text-gray-900">{selectedLog.resolvedBy || 'Unknown'}</p>
                        </div>
                      </div>
                      {selectedLog.resolvedNotes && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Resolution Notes:</span>
                          <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">{selectedLog.resolvedNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {!selectedLog.resolved && (
                  <button
                    type="button"
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleResolve(selectedLog._id);
                      setShowModal(false);
                    }}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
