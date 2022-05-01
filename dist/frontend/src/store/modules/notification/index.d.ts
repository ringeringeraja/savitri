import { Module, CommonState } from 'frontend/store/module';
export declare const initialState: {
    messages: {
        local: never[];
        domain: never[];
    };
};
export declare class NotificationModule extends Module<{}, {}> {
    constructor();
    getters(): {
        unread: (state: any) => any[];
        localLast: (state: any) => number;
        domainLast: (state: any) => number;
    };
    actions(this: NotificationModule): {
        ping: (...args: any) => any;
        notify: any;
    };
    mutations(this: NotificationModule): {
        NOTIFICATION_PING: (state: CommonState & {
            messages: {
                local: [];
                domain: [];
            };
        }, { result }: MutationProps) => void;
    };
}
