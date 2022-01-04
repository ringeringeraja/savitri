import { Module, CommonState, MutationProps, PZ_API_URL_2 } from 'frontend/store/module'

export class NotificationModule extends Module<{}, {}> {
  constructor() {
    super('notification', {}, {}, PZ_API_URL_2)
  }

  actions(this: NotificationModule) {
    return {
      ping: this._actionHelper('ping', 'NOTIFICATION_PING'),
    }
  }

  mutations(this: NotificationModule) {
    return {
      NOTIFICATION_PING: (state: CommonState, { result }: MutationProps) => {
        console.log(result)
      }
    }
  }
}