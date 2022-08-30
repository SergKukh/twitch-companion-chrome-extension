import { FC, MouseEvent, useEffect, useState } from 'react';
import { IStream } from '../models/IStream';
import '../styles/LiveStreamItem.css';
import Pin from './icons/PIn';
import Unpin from './icons/Unpin';

interface LiveStreamItemProps {
    stream: IStream,
    followed: boolean,
    isFavorite?: boolean,
    setFavUser?: (isFav: boolean, streamerId: string) => void
}

const LiveStreamItem: FC<LiveStreamItemProps> = ({ stream, followed, isFavorite, setFavUser }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        let secs = Math.floor((Date.now() - Date.parse(stream.started_at)) / 1000);
        setTime(getFormattedDate(secs));
        setInterval(() => {
            secs += 1;
            setTime(getFormattedDate(secs));
        }, 1000);
    }, []);

    const getFormattedDate = (secs: number): string => {
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs - (hrs * 3600)) / 60);
        const seconds = secs - (hrs * 3600) - (mins * 60)
        return `${hrs}:${mins.toString().length < 2 ? '0' + mins : mins}:${seconds.toString().length < 2 ? '0' + seconds : seconds}`
    }

    const getSizedThumbnailUrl = (url: string): string => {
        const width = 100;
        url = url.replace('{width}', `${width}`);
        url = url.replace('{height}', `${Math.round(width / 1.77)}`);
        return url;
    }

    const getFormattedViewerCount = (viewerCount: number): string => {
        return viewerCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const streamClickHandler = () => {
        chrome.tabs.create({
            url: `https://twitch.tv/${stream.user_login}`
        })
    }

    const pinClickHandler = (event: MouseEvent) => {
        event.stopPropagation();
        setFavUser(!isFavorite, stream.user_id);
    }

    return (
        <div className='liveStreamItemContainer' onClick={streamClickHandler}>
            <div className='liveStreamItemContainer__image'>
                <img src={getSizedThumbnailUrl(stream.thumbnail_url)} alt={stream.thumbnail_url} />
                <div className='liveStreamItemContainer__image_time'>
                    {time}
                </div>
                {followed && <div className='liveStreamItemContainer__image_pin' onClick={pinClickHandler}>
                    {
                        !isFavorite
                            ?
                            <Pin />
                            :
                            <Unpin />
                    }
                </div>}
            </div>
            <div className='liveStreamItemContainer__info'>
                <div className='liveStreamItemContainer__info_top streamInfoLine'>
                    <div className='username'>
                        {stream.user_name}
                    </div>
                    <div className='livecount'>
                        {getFormattedViewerCount(stream.viewer_count)}
                    </div>
                </div>
                <div className='liveStreamItemContainer__info_middle streamInfoLine'>
                    {stream.game_name}
                </div>
                <div className='liveStreamItemContainer__info_bottom streamInfoLine'>
                    {stream.title}
                </div>
            </div>
        </div>
    );
};

export default LiveStreamItem;