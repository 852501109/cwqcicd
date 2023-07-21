import http from '@/utils/http';
export interface plateReturnParams {
  name: string;
  phone: string;
  pickPlace: string;
  returnPlace: string;
  plateNum: string;
  images: string[];
}
export interface registerOwnerParams {
  registerName: string;
  registerPhone: string;
  ownerName: string;
  ownerPhone: string;
  plateNum: string;
  engineNumTail: string;
  relationshipWithOwner: string;
}
export default {
  async getRelationshipWithOwner() {
    return await http.get('/frame/plate/vehicleRegister/getRelationshipWithOwner.do');
  },
  async getPlateReturnList() {
    return await http.get('/frame/plate/plateReturn/getPlateReturnList');
  },
  async registerOwner(params: registerOwnerParams) {
    return await http.post('/frame/plate/vehicleRegister/registerOwner', params);
  },
  async plateReturn(params: plateReturnParams) {
    return await http.post('/frame/plate/plateReturn/plateReturn', params);
  },
};
