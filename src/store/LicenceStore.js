import { action, computed, observable, observe, runInAction } from "mobx";
import requester from "../common/requester";
import appStore from "./AppStore";
// import constants from "../common/constants";
import adminStore from "./AdminStore";
// import moment from "moment";

class LicenceStore {
  // @observable licence = {status: constants.LICENCE_STATUS_NOT_STARTED};
  @observable licenseData = null;

  @observable licences = [];
  @observable statuses = [];
  @observable activities = [];

  @observable orgData = null;

  @observable banks = [];

  @observable currencies = [];

  @observable accounts = [];
  @observable account = {};

  @observable attachments = [];

  @observable readOnly = true;
  @observable inn = "";
  @observable isOwner = false;

  constructor() {
    // observe(this, 'inn', change => {
    //   if (!change.newValue) {
    //     this.init();
    //   }
    // });
  }

  @action
  setLicence(licence) {
    this.licenseData = licence;
  }

  @action
  init() {
    // this.licence = {status: constants.LICENCE_STATUS_NOT_STARTED};
    this.licenseData = null;
    this.orgData = null;
    this.account = {};
    this.accounts = [];
    this.attachments = [];
    this.licences = null;
    this.readOnly = true;
    this.isOwner = false;
  }

  @action
  setReadOnly(readOnly) {
    this.readOnly = readOnly || false;
  }

  async checkInn(tin) {
    if (tin.length === 14) {
      let [info, lics] = await Promise.all([
        adminStore.getCompanyInfo(tin),
        this.getLicensesByTin(tin),
      ]);

      runInAction(() => {
        this.orgData = info;
        this.licences = lics;
      });

      /*requester.post('licence/tin/search', {inn: inn}).then(response => {
        this.orgData = {
          ...response.data,
          foreignPart: response.data.foreignPart ? 'Да' : 'Нет',
          ownership: parseInt(response.data.ownership) === 1 ? "Частная" : "Государственная",
        };

        this.licences = response.licences;
        this.setLicence({
          ...this.licence,
          ...response.data,
          foreignPart: response.data.foreignPart ? 'Да' : 'Нет',
          ownership: parseInt(response.data.ownership) === 1 ? "Частная" : "Государственная",
        })
      })*/
    } else {
      appStore.setAlert("warn", "wrong inn");
    }
  }

  async getLicensesByTin(tin) {
    let data = await requester.get(`licence/tin`, { tin });
    if (data instanceof Array) {
      for (let l of data) {
        if (l.status) {
          l.status_name = l.status.name;
        }
      }
    }
    return data;
  }

  async getLicense(id) {
    let license = await requester.get(`licence/${id}`);
    if (typeof license.status == "object") {
      license.status_name = license.status.name;
      license.status = license.status.id;
    }

    this.licenseData = license;
    return license;
  }

  async checkOwner() {
    this.isOwner = false;

    if (!licenceStore.licenseData?.id || !appStore.user) return;

    if (appStore.isAdmin) return;

    let { id } = licenceStore.licenseData;

    this.isOwner = await requester.get(`checkOwner/${id}`);
  }

  async getLicensesFilter(param) {
    try {
      let data = await requester.get("licence/find", param);

      for (let license of data) {
        if (typeof license.status == "object") {
          license.status_name = license.status.name;
          license.status = license.status.id;
        }
      }

      return data;
    } catch (e) {
      console.warn(e);
    }
  }

  async applicationStart() {
    console.log("app start");
    let { licenseData } = this;

    if (!licenseData) return;

    licenseData = await requester.post(`licence/save`, licenseData);

    if (typeof licenseData.status == "object") {
      licenseData.status_name = licenseData.status.name;
      licenseData.status = licenseData.status.id;
    }

    this.setLicence(licenseData);

    // this.licence
    // debugger
    // this.setLicence({...this.licence, status: 1});

    // requester.post('licence/save_org_info', {data: this.licence}).then(r => {
    //   this.setLicence(r.licence);
    // })
  }

  @action
  tinSave() {
    requester.post("licence/tin/save", { data: this.orgData }).then((r) => {
      this.setLicence(r.licence);
    });
  }

  async getBanks() {
    this.banks = await adminStore.getBanks();
  }

  async getCurrencies() {
    this.currencies = await adminStore.getCurrencies();
  }

  @action
  setActivity(activity_id) {
    if (!this.licenseData || !this.activities) return;

    let activity = this.activities.find((a) => a.id == activity_id);
    this.licenseData.activity = activity;
  }

  saveLicenseActivity() {
    // debugger
    let licenceId = this.licenseData.id;
    let activityId = this.licenseData.activity?.id;

    return requester.put(`licence/activity/${licenceId}/${activityId}`);
  }

  // @action
  // setActivityId(activity_id) {
  //   this.licence.activity_id = activity_id;
  // }

  @action
  setAccountBank(bank) {
    if (!this.account) {
      this.account = {};
    }
    this.account.bank = bank;
    this.account.bank_id = bank.id;
  }

  @action
  setAccountCurrency(currency) {
    if (!this.account) {
      this.account = {};
    }
    this.account.currency = currency;
    this.account.currency_id = currency.id;
  }

  async getAccountList() {
    if (!this.licenseData.id) return;

    try {
      // TODO: back will return array
      let res = await requester.get(`licence_account/${this.licenseData.id}`);
      this.accounts = [];
      if (typeof res == "object") {
        this.accounts.push(res);
      }
    } catch (e) {
      console.warn(e);
      // debugger
    }
    // debugger
    this.account = {};

    // requester.post('/licence/accounts', {'licence_id': this.licence.id}).then(r => {
    //   this.accounts = r.accounts || [];
    //   this.account = {};
    // })
  }

  @computed
  get canAddAccount() {
    return (
      !!this.account &&
      this.account.bank &&
      this.account.accountNumber &&
      this.account.bic &&
      this.account.name &&
      this.account.currency
    );
  }

  @action
  setAccount(account) {
    this.account = account;
  }

  async saveAccount() {
    if (!this.licenseData || !this.licenseData.id || !this.account) return;

    let { accountNumber, name, bic } = this.account;

    let response = await requester.post("licence_account/save", {
      accountNumber,
      name,
      bic,
      bankId: this.account.bank?.id,
      currencyId: this.account.currency?.id,
      licenceId: this.licenseData.id,
    });

    this.account = {};
    this.accounts = [response];
  }

  @action
  removeAccount(account) {
    requester
      .post("/licence/account/delete", { account_id: account.id })
      .then((response) => {
        this.accounts = response.accounts;
        this.account = {};
      });
  }

  async uploadFile(file, docId) {
    // /api/attachment/saveDocument
    // /api/attachment/saveLicenceDocument
    // file
    // licenceId
    // activityId
    // docId
    // name

    if (!this.licenseData) return;

    let licenceId = this.licenseData.id;

    let fd = new FormData();
    fd.set("licenceId", licenceId);
    fd.set("docId", docId);
    fd.set("file", file);

    if (docId && adminStore.activityDocs) {
      let docName = adminStore.activityDocs.find((d) => d.id == docId)?.name;
      fd.set("name", docName);
    }

    let res = await requester.post("attachment/saveLicenceDocument", fd);
    console.log("upl res", res);
    // await this.getAttachments();
  }

  @action
  async fileUpload(fileData) {
    return requester.post("/licence/upload", fileData);
  }

  async getAttachments() {
    if (!this.licenseData || !this.licenseData.id) return;

    let licenceId = this.licenseData.id;
    let [atts, files] = await Promise.all([
      requester.get(`licence_attachment/list/${licenceId}`),
      requester.get(`attachment/list/${licenceId}`),
    ]);

    if (atts instanceof Array) {
      for (let att of atts) {
        let fileId = att.attachmentId;
        let file = files.find((f) => f.id == fileId);
        att.file = file;
      }
    }
    console.log("att", atts);
    this.attachments = atts;

    /*requester.get('licence_attachments').then(r => {
      r
      // debugger
      this.setLicence(r.licence);
      this.attachments = r.files;
    });*/
    /*requester.post('/licence/attachments', {licence_id: this.licence.id}).then(r => {
      this.setLicence(r.licence);
      this.attachments = r.files;
    });*/
  }

  deleteAttachment(id) {
    return requester.delete(`attachment/delete/${id}`, { id });
  }

  saveLicense({ seriesLicense, numberLicense }) {
    if (!this.licenseData) return;

    let data = {
      id: this.licenseData.id,
      activityId: this.licenseData.activity?.id,
      licenseTerrit: this.licenseData.licenseTerrit,
      licenseTerm: this.licenseData.licenseTerm,
      licenseRegNumb: this.licenseData.licenseRegNumb,
      seriesLicense,
      numberLicense,
      licenseOrderNumb: this.licenseData.licenseOrderNumb,

      licenseIssueDate: this.licenseData.licenseIssueDate,
      dateTerminatLicense: this.licenseData.dateTerminatLicense,
      dateOrderIssueLicense: this.licenseData.dateOrderIssueLicense,
    };

    /*{
      "id": 0,
      "licenseTerrit": "string",
      "licenseIssueDate": "2022-01-12",
      "licenseTerm": "string",
      "dateTerminatLicense": "2022-01-12",
      "licenseRegNumb": "string",
      "licenseOrderNumb": "string",
      "dateOrderIssueLicense": "2022-01-12",
      "seriesLicense": "string",
      "numberLicense": "string"
    }*/

    return requester.put("licence/update", data);
  }

  async submitLicense() {
    if (!(this.licenseData && this.licenseData.status === 1)) return;

    let licenseId = this.licenseData.id;
    let res = await requester.put(`licence/submit/${licenseId}`);
    appStore.setAlert(
      "success",
      "Ваше заявление успешно отправлено на рассмотрение"
    );
    return res;
  }

  applicate() {
    if (!this.licenseData || !this.licenseData.id) return;
    requester
      .post("licence/applicate", { licence: this.licenseData })
      .then((r) => {
        this.setLicence(r.licence);
        appStore.setAlert(
          "success",
          "Ваше заявление успешно отправлено на рассмотрение"
        );
      });
  }

  async getLicences(params) {
    // debugger
    await Promise.all([this.getStatuses(), this.getActivities()]);

    let r = await requester.get("licence/list", params);

    const data = r.content.sort((a, b) => a.id - b.id);

    data.forEach((lic) => {
      lic.activity_name = this.activities.find(
        (s) => s.id === lic.activity_id
      )?.name;
      lic.status_name = this.statuses.find((s) => s.id === lic.status_id)?.name;
    });

    this.licences = data;
    return r;
  }

  async getAllLicences(params) {
    // debugger
    await Promise.all([this.getStatuses(), this.getActivities()]);

    let r = await requester.get("allLicence/list", params);

    const data = r.sort((a, b) => a.id - b.id);

    data.forEach((lic) => {
      lic.activity_name = this.activities.find(
        (s) => s.id === lic.activity_id
      )?.name;
      lic.status_name = this.statuses.find((s) => s.id === lic.status_id)?.name;
    });

    this.licences = data;
  }

  async getStatuses() {
    if (!this.statuses || this.statuses.length === 0) {
      this.statuses = await requester.get("licence_status/list");
    }
  }

  async getActivities() {
    if (!this.activities || this.activities.length === 0) {
      let activities = await adminStore.getActivities();
      this.activities = activities;
    }
  }

  deactivateLicense() {
    requester
      .post("licence/deactivate_license", { licence: this.licenseData })
      .then((r) => {
        this.setLicence(r.licence);
        appStore.setAlert("success", "Данная Лицензия отныне деактивирована");
      });
  }

  suspendLicense(data) {
    return requester.put('licence/suspended', data)
  }

  getAllOrganizations() {
    return requester.get('licence/allOrganizationsInfoWithoutDup')
  }
}

const licenceStore = new LicenceStore();

export default licenceStore;
