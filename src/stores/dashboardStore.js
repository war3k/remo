// @flow
import { observable, action, flow, configure } from 'mobx';
import moment from 'moment';
import dashboardService from '../services/dashboardService';
import i18n from '../config/i18n';

configure({ enforceActions: 'observed' });

class DashboardStore {
  // STORE
  @observable orders: any;

  @observable order: any;

  @observable ordersTotalCount: number;

  // ACTIONS
  @action
  getOrdersAction = flow(function*(page, rowsPerPage, sort, sortOrder, search) {
    if (search === null || search.length < 3) {
      search = '';
    }
    this.pending = true;
    const result = yield dashboardService.getOrders(
      page + 1,
      rowsPerPage,
      sort,
      sortOrder,
      search
    );
    if (result.error) {
      this.pending = false;
      return false;
    }
    this.orders = result.orders.map(item => [
      moment(item.createdDate).format('YYYY-MM-DD LT'),
      item.customerCompanyName,
      item.customerCompanyBranch.name || 'Inny',
      [
        item.customerCompanyBranch.street,
        ', ',
        item.customerCompanyBranch.postalCode,
        ' ',
        item.customerCompanyBranch.city
      ],
      item.orderNumber,
      (item.suggestedDate && moment(item.suggestedDate).format('YYYY-MM-DD')) ||
        i18n.t(`LIST.NO_DATE_RECEIPT`),
      i18n.t(`STATUSES.${item.status.toUpperCase()}`),
      item.uuid
    ]);
    this.ordersTotalCount = result.totalCount;
    this.pending = false;
    return true;
  });

  @action
  getOrderById = flow(function*(id) {
    this.pending = true;
    const result = yield dashboardService.getOrderById(id);
    if (result.error) {
      this.pending = false;
      return false;
    }
    this.order = result.order;
    this.pending = false;
    return true;
  });
}

export default new DashboardStore();
