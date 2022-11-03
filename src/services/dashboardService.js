import REST from '../constants/rest';
import API from './apiService';

const API_BASE = '/client';

export default class DashboardService {
  static async getOrders(page, rowsPerPage, sort, sortOrder, search) {
    let path;
    if (page && rowsPerPage) {
      path = `/orders?page=${page}&limit=${rowsPerPage}&sort=${sort}&order=${sortOrder}&search=${search}`;
    } else {
      path = '/orders';
    }
    const options = {
      method: REST.GET
    };
    return API.fetch(API_BASE + path, options);
  }

  static async getOrderById(id) {
    const path = `/orders/${id}`;
    const options = {
      method: REST.GET
    };
    return API.fetch(API_BASE + path, options);
  }
}
