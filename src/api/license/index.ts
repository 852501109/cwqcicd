import http from '@/utils/http';

export default {
  async getRelationshipWithOwner() {
    return await http.get('/frame/plate/vehicleRegister/getRelationshipWithOwner.do');
  },
};
