import { useEffect, useRef, useState } from 'react';
import { IStream } from '../models/IStream';
import { IUser } from '../models/IUser';
import '../styles/LiveStreams.css';
import { addFavUser, getFavUsers, getUser, removeFavUser } from '../utils/user';
import { fetchLiveStreams } from '../api/twitch';
import LiveStreamItem from './LiveStreamItem';

const LiveStreams = () => {
    const [liveStreams, setLiveStreams] = useState([] as IStream[]);
    const [favLiveStreams, setFavLiveStreams] = useState([] as IStream[]);
    const favStreams = useRef([]);
    const streams = useRef([] as IStream[]);
    const pagination = useRef('');
    const user = useRef({} as IUser);

    const sortStreams = () => {
        console.log(favStreams.current)
        setLiveStreams(streams.current.filter(stream => !favStreams.current.includes(stream.user_id)));
        setFavLiveStreams(streams.current.filter(stream => favStreams.current.includes(stream.user_id)));
    }

    const fetchFavUsers = async () => {
        await fetchCurrentUser();
        favStreams.current = await getFavUsers(user.current.userId);
    }

    const fetchCurrentUser = async () => {
        if (!user.current.userId) {
            user.current = await getUser();
        }
    }

    const startFetchingStreams = async () => {
        await fetchFavUsers();
        streams.current = [];
        await fetchStreams(user.current);
        chrome.action.setBadgeText({ text: streams.current.length.toString() });
        sortStreams();
    }

    const fetchStreams = async (user: IUser) => {
        const data = await fetchLiveStreams(user, pagination.current);
        pagination.current = data.pagination;
        streams.current = [...streams.current, ...data.streams];
        if (pagination.current) {
            await fetchStreams(user);
        }
    }

    const setFavUser = async (isFav: boolean, streamerId: string) => {
        if (isFav) {
            favStreams.current = await addFavUser(user.current.userId, streamerId);
        } else {
            favStreams.current = await removeFavUser(user.current.userId, streamerId);
        }
        sortStreams();
    }

    useEffect(() => {
        startFetchingStreams();
    }, []);

    return (
        <div className="pageContainer liveStreamsContainer scroll">
            {
                favLiveStreams.map(stream =>
                    <LiveStreamItem key={stream.id} stream={stream} followed={true} isFavorite={true} setFavUser={setFavUser} />)
            }
            {(favLiveStreams.length && liveStreams.length) ? <div className='liveStreamsContainer__divider' /> : <></>}
            {
                liveStreams.map(stream =>
                    <LiveStreamItem key={stream.id} stream={stream} followed={true} isFavorite={false} setFavUser={setFavUser} />)
            }
        </div>
    );
};

export default LiveStreams;