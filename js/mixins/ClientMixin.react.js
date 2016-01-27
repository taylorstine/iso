import {isClient} from '../util'
export default {
  componentWillMount: function() {
    if (isClient) {
      this.componentWillMountOnClient && this.componentWillMountOnClient();
    }
  }
};