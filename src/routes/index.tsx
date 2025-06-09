import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ImportPage } from '../components/ImportPage';

export const Route = createFileRoute('/')({
  component: ImportPage,
});