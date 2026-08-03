import api from './axios';
import type { DashboardStats, RevenueChartData } from '../types';

export const getDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data as DashboardStats;
};

export const getRevenueChart = async () => {
  const { data } = await api.get('/dashboard/revenue-chart');
  return data as RevenueChartData[];
};
