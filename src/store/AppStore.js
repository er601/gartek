import {action, computed, observable, reaction} from "mobx";
import i18n from "../translate/i18n";
import storage from "./LocalStorage";
import requester from "../common/requester";
import {notification} from 'antd'

let busy_counter = observable.box(0);

class AppStore {
  token;

  @observable language = 'ru';
  @observable user;
  @observable loading = false;

  @computed
  get isBusy() {
    return busy_counter.get() > 0;
  }

  @computed
  get isAdmin() {
    return ['ROLE_ADMIN', 'ROLE_MAIN_ADMIN'].includes(this.user?.role)
  }

  @computed
  get isUser() {
    return this.user?.role === 'ROLE_USER'
  }

  @action
  setBusy(incr) {
    let count = busy_counter.get();
    if (!incr) {
      count = count > 0 ? count - 1 : 0;
    } else {
      count = count + 1;
    }
    busy_counter.set(count);
  }

  @action
  setToken(token) {
    this.token = token;
    if (token) {
      storage.save("token", token);
    } else {
      storage.remove("token");
    }
  }

  @action
  setUser(user) {
    this.user = user;
    if (user) {
      storage.save("user", user);
    } else {
      storage.remove("user");
    }
  }




  loadToken() {
    if (this.token) return this.token;

    const token = storage.get("token");
    this.token = token;
    return token;
  }

  @action
  logout() {
    this.token = null;
    this.user = null;
    storage.clear();
    this.clearAlert();
    // requester.post('logout', null, true);
  }

  async login(email, password) {
    this.loading = true;

    try {
      const response = await requester.post('auth/signin', {email, password});

      if (response) {
        this.setToken(response.accessToken);
        // const user = await this.userByEmail(email);
        const user = await this.loadCurrentUser();

        this.setUser(user);
        return user
      }
    } catch (e) {
      throw e;

    } finally {
      this.loading = false;
    }
  }

  // admin
  async loadCurrentUser() {
    const user = await requester.get(`user/me`);
    // if (user)
    //   user.role = 'ROLE_ADMIN';
    return user;
  }

  async autoLogin() {
    this.loadToken();
    if (this.token) {
      const user = await this.loadCurrentUser();
      this.setUser(user);
    }
  }

  // async userAuth(email, password) {
  //   const response = await requester.get('user_auth');
  //   debugger
  //   return response;
  // }
  //
  // async adminAuth(email, password) {
  //   const response = await requester.get('admin_auth');
  //   debugger
  //   return response;
  // }
  //
  // userByEmail(email) {
  //   return requester.get(`users/${email}`);
  // }
  // @action
  // async register(data) {
  //   const response = await requester.post('register', data);
  //   this.setToken(response.token);
  //   this.setUser(response.user);
  // }

  clearAlert() {
    notification.close()
  }

  // https://ant.design/components/notification/
  // success, error, info, warning, warn
  setAlert(level, message, options) {
    notification[level]({message, ...options});
  }

  @action
  async loadUser() {
    this.user = storage.get('user');

    if (this.token) {
      try {
        const r = await requester.post('user_info');
        const user = r.user;
        this.setUser(user);
      } catch (e) {
      }
    }
  }

  async changePassword(passwords) {
    return requester.post('change_password', passwords);
  }

  async getQuestions() {
    return requester.get('frequentQuestion');
  }

  async getNews() {
    return requester.get('news/publisher/all');
  }
  async getNewsById(id) {
    return requester.get('publisher/' + id);
  }

  async getInstructionById(id) {
    return requester.get('instruction/' + id);
  }
  async getInstructions() {
    return requester.get('instructions');
  }


  getNotification() {

    return requester.get('notification/list')

  }



  getUrl() {
    return 'http://is.regultek.gov.kg/api/';
  }






}




const appStore = new AppStore();
reaction(
  () => appStore.language,
  language => {
    i18n.changeLanguage(language);
    storage.save("language", language);
  }
);
export default appStore;
