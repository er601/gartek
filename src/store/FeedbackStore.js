import {observable} from "mobx";
import requester from "../common/requester";



class FeedbackStore {

@observable feedback=[]


  postFeedback(data) {

  return requester.post("create/feedBack", data);

  }

}
const feedbackStore = new FeedbackStore();

export default feedbackStore;
