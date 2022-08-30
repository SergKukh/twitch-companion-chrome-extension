import axios from 'axios';
import { IStream } from '../models/IStream';
import { IUser } from "../models/IUser";
import { getAccessToken, getClientId } from '../utils/headers';

interface getLiveStreamsResponse {
    streams: IStream[]
    pagination: string
}

interface getTopStreamsResponse {
    streams: IStream[]
    pagination: string
}

export async function fetchUsers(id: string[], access_token: string): Promise<IUser[]> {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': getClientId()
            },
            params: {
                id
            }
        });
        const data = response.data.data;
        const users: IUser[] = data.map(value => ({
            username: value.display_name,
            userId: value.id,
            profileImage: value.profile_image_url
        }));
        return users;
    } catch (error) {
        return [];
    }
}

export async function fetchUser(): Promise<IUser> {
    const access_token = await getAccessToken();
    const users = await fetchUsers([], access_token);
    if (users.length) {
        users[0].access_token = access_token;
        return users[0];
    };
    return {} as IUser;
}

export async function fetchLiveStreams(user: IUser, pagination: string): Promise<getLiveStreamsResponse> {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/streams/followed', {
            headers: {
                'Authorization': `Bearer ${user.access_token}`,
                'Client-Id': getClientId()
            },
            params: {
                'user_id': user.userId,
                'after': pagination
            }
        });
        return { streams: response.data.data, pagination: response.data?.pagination?.cursor || '' };
    } catch (error) {
        return { streams: [] as IStream[], pagination: '' };
    }
}

export async function fetchTopStreams(pagination: string): Promise<getTopStreamsResponse> {
    try {
        const access_token = await getAccessToken();
        const response = await axios.get('https://api.twitch.tv/helix/streams', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': getClientId()
            },
            params: {
                after: pagination
            }
        });
        return { streams: response.data.data, pagination: response.data?.pagination?.cursor || '' };
    } catch (error) {
        return { streams: [], pagination: '' };
    }
}