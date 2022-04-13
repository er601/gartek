import {action, observable} from "mobx";
import requester from "../common/requester";

const statuses = {
  '0': 'Новые',
  '1': 'Действующие',
  '2': 'Прекращенные',
  '3': 'Аннулированные',
  '4': 'Отклоненные',
  '5': 'Приостановленные',
  '6': 'На рассмотрение',
};

class AdminStore {

  @observable licenses = [];

  @observable activityDocs = [];



  getFeedback() {
    return requester.get("getAll/feedBacks")
  }

  getFeedbackId(id){
    return requester.get("read/feedBackSeen/" + id)
  }

  deleteFeedback(id) {
    return requester.delete("delete/feedBack/" + id)
  }
  postSendEmailFeedback(id, data){
    return requester.post(`feedback/SendEmailFeedBack/${id}`, data)
  }




  getActivities() {
    return requester.get('activity/list');
  }

  getBanks() {
    return requester.get('bank/list')
  }

  getCurrencies() {
    return requester.get('currency/list')
  }

  getLicenseStatuses() {
    return requester.get('licence_status/list')
  }

  async declineLicence(id, declineText) {
    return requester.put('licence/decline/' + id, declineText);
  }

  async approveLicence(id) {
    return requester.put('licence/approve/' + id);
  }



  saveBank(item) {
    return requester.post('bank/save', item)
  }

  saveCurrency(item) {
    return requester.post('currency/save', item)
  }

  saveActivity(activityType) {
    return requester.post('activity/save', activityType)
  }

  saveLicenseStatus(item) {
    return requester.post('licence_status/save', item)
  }

  deleteLicenseStatus(id) {
    return requester.delete(`licence_status/delete/${id}`)
  }

  deleteCurrency(id) {
    return requester.delete(`currency/delete/${id}`)
  }

  deleteBank(id) {
    return requester.delete(`bank/delete/${id}`)
  }

  async getDocs() {
    return requester.get('doc/list');
  }

  async saveDoc(docType) {
    return requester.post('doc/save', docType);
  }

  async getActivityDocs() {
    let res = await requester.get('doc/list');
    console.log('docs', res)
    this.activityDocs = res;
    /*let param = {};
    if (activityId) {
      param.activity_id = activityId
    }
    requester.get('activity/list', param).then(r => {
      this.activityDocs = r || []
    });*/
  }

  saveActivityDocs(id, docIds) {
    return requester.post(`activityDoc/save/${id}`, docIds)
  }

  @action
  getLicences() {
    requester.post('licence/list').then(r => this.licenses = r || []);
  }
  putDeclineLicense(id){
    return requester.put(`/api/licence/decline/${id}`, {id})

  }
  putUpdateLicense(id){
    return requester.put(`/api/licence/update/${id}`, {id})
  }


  @action
  async getUsers() {
    return requester.get('user/list');
  }

  async saveUser(user){
    return requester.post('save_user', {user});
  }
  async createUser(user) {
    return requester.post('auth/signup', user);
  }

  async changeUser(user) {
    return requester.post('auth/update', user);
  }

  async createLog(action) {
    await requester.post('admin/save/logs', action);
  }
  async getLogs(params) {
    return await requester.get('admin/logs', params);
  }



   async getUsersOrg() {
    return requester.get("organization/heads")

  }





  // async adminSignIn(params) {
  //   // let params = {
  //   //   "email": "test@gartek.kg",
  //   //   "password": "12345"
  //   // }
  //
  //   return requester.post('auth/signin', params)
  // }

  async getCompanyInfo(tin) {
    let info = await requester.get(`organization/${tin}`);
    /*if (info?.founders && !info.founders.length) {
      info.founders.push({
        "fullName": "string",
        "citizenship": "string",
        "tin": "string"
      })
    }*/

    return info[0];

    return {
      "subject": [
        {
          "fullNameGl": "string",
          "shortNameGl": "string",
          "fullNameOl": "string",
          "shortNameOl": "string",
          "foreignPart": true,
          "registrCode": "string",
          "statSubCode": "string",
          "tin": "string",
          "region": "string",
          "district": "string",
          "city": "string",
          "village": "string",
          "microdistrict": "string",
          "street": "string",
          "house": "string",
          "room": "string",
          "phones": "string",
          "email1": "string",
          "email2": "string",
          "orderDate": "2021-10-28T07:09:42.464Z",
          "firstOrderDate": "string",
          "category": 0,
          "ownership": 0,
          "chief": "string",
          "chiefTin": "string",
          "baseBus": "string",
          "baseBusCode": "string",
          "indFounders": 0,
          "jurFounders": 0,
          "totalFounders": 0,
          "description": "string",
          "founders": [
            {
              "fullName": "string",
              "citizenship": "string",
              "tin": "string"
            }
          ]
        }
      ]
    }
  }

  async putQuestions(data) {
    return requester.put('frequentQuestion', data);
  }
  async deleteQuestions(id) {
    return requester.delete('frequentQuestion/' + id);
  }
  async postQuestions(data) {
    return requester.post('frequentQuestion', data);
  }

  async postNews(data) {
    return requester.post('publisher/postNews', data);
  }

  async deleteNews(id) {
    return requester.delete('publisher/deleteNews/' + id);
  }

  async postInstruction(data) {
    return requester.post('instruction', data);
  }
  async putInstruction(data) {
    return requester.put('instruction', data);
  }
  async deleteInstruction(id) {
    return requester.delete('instruction', {id});
  }


  async deleteNotification(id){
    return  requester.delete(`notification/delete/${id}`)
  }

  async editNotification(data){
    return  requester.put("notification/update",data)

  }



  async getNotificationById(id){
    return requester.get(`notification/${id}`)

  }


  async postNotification(data){
    return requester.post(`notification/save`,data)
  }

}

const adminStore = new AdminStore();

export default adminStore;
