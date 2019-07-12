export interface IUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    group?: string;
    real_name?: string;
    greeted: boolean;
}

export interface IMessage {
    text: string;
    video: any;
    document: any;
    voice: any;
    photo: any;
    video_note: any;
    reply_to_message: IMessage;
    message_id: number;
    from: IUser;
    chat: {
        id: number;
        title: string;
        type: string;
    };
    forward_from?: {
        id: number;
        is_bot: boolean;
    };
}
