import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  initiateProductImageAnalysis, 
  checkProductImageAnalysisJob 
} from '@/app/api/ai/actions';

export function useAIAssist() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobResult, setJobResult] = useState(null);
  
  // Ref to track if a job is already in progress
  const isJobInProgressRef = useRef(false);

  // Initiate AI product content generation
  const generateProductContent = async (images, userInput = '') => {
    // Prevent multiple simultaneous job initiations
    if (isJobInProgressRef.current) {
      return null;
    }

    setIsGenerating(true);
    setError(null);
    
    // Only reset job result if no job is in progress
    if (!isJobInProgressRef.current) {
      setJobResult(null);
    }

    try {
      // Generate a unique job ID
      const newJobId = uuidv4();
      
      // Mark job as in progress
      isJobInProgressRef.current = true;

      // Initiate the job without waiting, passing the user input
      const initiationResult = await initiateProductImageAnalysis(images, newJobId, userInput);
      
      if (!initiationResult.success) {
        throw new Error(initiationResult.error || 'Failed to initiate image analysis');
      }

      // Set the job ID to trigger polling
      setJobId(newJobId);

      return newJobId;
    } catch (error) {
      setError(error.message);
      setIsGenerating(false);
      isJobInProgressRef.current = false;
      throw error;
    }
  };

  // Method to manually check job status
  const checkJobStatus = useCallback(async (currentJobId) => {
    if (!currentJobId) return null;

    try {
      const result = await checkProductImageAnalysisJob(currentJobId);

      switch (result.status) {
        case 'completed':
          setJobResult(result.data);
          setIsGenerating(false);
          setJobId(null);
          isJobInProgressRef.current = false;
          return result.data;
        case 'pending':
          return null;
        case 'error':
          throw new Error(result.error || 'Job processing failed');
        default:
          throw new Error('Unknown job status');
      }
    } catch (error) {
      setError(error.message);
      setIsGenerating(false);
      setJobId(null);
      isJobInProgressRef.current = false;
      return null;
    }
  }, []);

  // Poll for job status
  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;
    let intervalId;

    const pollJobStatus = async () => {
      const result = await checkJobStatus(jobId);
      
      if (isMounted && result) {
        // Result is available, stop polling
        clearInterval(intervalId);
      }
    };

    // Initial poll immediately
    pollJobStatus();

    // Set up interval polling
    intervalId = setInterval(pollJobStatus, 5000); // Poll every 5 seconds

    // Cleanup interval on unmount or job completion
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [jobId, checkJobStatus]);

  // Method to manually retrieve job result
  const getJobResult = () => {
    return jobResult;
  };

  // Method to reset the hook state
  const reset = () => {
    setIsGenerating(false);
    setError(null);
    setJobId(null);
    setJobResult(null);
    isJobInProgressRef.current = false;
  };

  return {
    generateProductContent,
    getJobResult,
    checkJobStatus,
    reset,
    isGenerating,
    error,
    jobId,
    jobResult
  };
}
