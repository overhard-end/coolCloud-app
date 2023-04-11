import { Alert } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

export const DownloadAlert = () => {
  const selector = useSelector;
  const isDownload = selector((state) => state.uploadReducer.download);

  return isDownload ? <Alert severity="info">Preparing file for download...</Alert> : '';
};
