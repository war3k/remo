import REST from '../constants/rest';
import API_ALL_PUBLIC from './apiAllPublicService';
import API_PUBLIC from './apiPublicService';
import { parseForm } from '../utils/parseForm';

const mapOrderData = orderData =>
  orderData.map(item => ({
    recyclingItem: {
      uuid: item.recyclingItem.uuid,
      name: item.recyclingItem.name,
      unit: item.recyclingItem.unit,
      value: item.recyclingItem.value
    },
    packageTypes: item.packageTypes.map(pack => {
      const packObject = {
        name: pack.name,
        value: pack.value,
        unit: pack.unit
      };
      if (pack.uuid !== 'other') {
        packObject.uuid = pack.uuid;
      }
      return packObject;
    })
  }));

export default class OrdersService {
  static async addOrder(values) {
    const path = '/public/orders';
    const { orderData, ...body } = values;

    if (body.customerCompanyBranch) {
      body.customerCompanyBranch = body.customerCompanyBranch;
      body.customerCompanyBranch.mainBranch = false;
    }
    delete body.selectedBranch;
    delete body.customerCompanyBranch.sameAsCompany;
    delete body.bdoIsRequired;
    delete body.copyName;
    delete body.tmpBdo;

    const apiBody = parseForm(body);

    apiBody.orderData = mapOrderData(orderData);

    const options = {
      method: REST.POST,
      body: apiBody
    };
    return API_PUBLIC.fetch(path, options);
  }

  static async addFiles(files, uuid) {
    const options = files.map(file => ({
      method: REST.POST,
      path: `/public/orders/${uuid}/files`,
      body: {
        name: file.name,
        type: file.type,
        data: file.data
      }
    }));
    return API_ALL_PUBLIC.fetch(options);
  }

  static async getPackageTypes(search) {
    let path = '/public/package?limit=1000';
    if (search) {
      path += `&name=${search}`;
    }
    const options = {
      method: REST.GET
    };
    return API_PUBLIC.fetch(path, options);
  }

  static async getRecyclingItems(search) {
    let path = '/public/recycling?limit=1000';
    if (search) {
      path += `&search=${search}`;
    }
    const options = {
      method: REST.GET
    };
    return API_PUBLIC.fetch(path, options);
  }

  static async getGusInformation(values) {
    const path = '/public/gus_search';
    const options = {
      method: REST.POST,
      body: {
        nip: values
      }
    };
    return API_PUBLIC.fetch(path, options);
  }

  static async getTokenStatus(token) {
    const path = `/public/orders/${token}`;
    const options = {
      method: REST.GET
    };
    return API_PUBLIC.fetch(path, options);
  }
}
