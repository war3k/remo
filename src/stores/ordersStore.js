// @flow
import { action, configure, flow, observable } from 'mobx';
import ordersService from '../services/ordersService';

configure({ enforceActions: 'observed' });

class OrdersStore {
  // STORE
  @observable pending: boolean = false;

  @observable packageTypes: any[];

  @observable recyclingItems: any[];

  @observable orderNumber: string;

  @observable email: string;

  @action
  addOrder = flow(function*(apiValues) {
    this.pending = true;
    const result = yield ordersService.addOrder(apiValues);
    this.pending = false;
    if (result.error) {
      return { error: true };
    }
    this.orderNumber = result.order.orderNumber;
    this.email = result.order.reporter.email;
    return result;
  });

  @action
  addFiles = flow(function*(files, uuid) {
    this.pending = true;
    const result = yield ordersService.addFiles(files, uuid);
    this.pending = false;
    if (result.error) {
      return false;
    }
    return true;
  });

  @action
  getPackageTypes = flow(function*(search) {
    const result = yield ordersService.getPackageTypes(search);
    if (result.error) {
      return false;
    }
    this.packageTypes = result.packageTypes;
    return true;
  });

  @action
  getRecyclingItems = flow(function*(search) {
    const result = yield ordersService.getRecyclingItems(search);
    if (result.error) {
      return false;
    }
    this.recyclingItems = result.recyclingItems;
    return true;
  });

  @action
  getGusInformationAction = flow(function*(nip) {
    this.pending = true;
    const result = yield ordersService.getGusInformation(nip);
    this.pending = false;
    if (result.error) {
      return false;
    }
    return result.res;
  });

  @action
  getTokenStatus = flow(function*(token) {
    const result = yield ordersService.getTokenStatus(token);
    return !result.error;
  });
}

export default new OrdersStore();
