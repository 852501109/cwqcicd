import http, { Response } from '@/utils/http';
export interface params {
  name: string;
  phone: string;
  pickPlace: string;
  returnPlace: string;
  plateNum: string;
  images: string[];
}

export default {
  async getRelationshipWithOwner() {
    return await http.get('/frame/plate/vehicleRegister/getRelationshipWithOwner.do');
  },
  async getPlateReturnList() {
    return await http.get('/frame/plate/plateReturn/getPlateReturnList');
  },
  async registerOwner(params: params) {
    return await http.post('/frame/plate/vehicleRegister/registerOwner', params);
  },
};
