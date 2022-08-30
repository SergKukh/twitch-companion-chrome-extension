import { useEffect, useRef, useState } from 'react';
import { fetchTopStreams } from '../api/twitch';
import { IStream } from '../models/IStream';
import '../styles/TopStreams.css';
import LiveStreamItem from './LiveStreamItem';

const TopStreams = () => {
    const [streams, setStreams] = useState([] as IStream[]);
    const pagination = useRef('');
    const observeElement = useRef(null);
    const observer = useRef<IntersectionObserver>();

    const connectObserverPagination = () => {
        if (observer.current) observer.current.disconnect();
        const callback = function (entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
            if (entries[0].isIntersecting) {
                fetchStreams();
            }
        };
        observer.current = new IntersectionObserver(callback);
        if (observeElement.current) {
            observer.current.observe(observeElement.current);
        }
    }

    const fetchStreams = async () => {
        const response = await fetchTopStreams(pagination.current);
        pagination.current = response.pagination;
        setStreams(prev => [...prev, ...response.streams]);
        connectObserverPagination();
    }

    useEffect(() => {
        fetchStreams();
        return () => { if (observer.current) observer.current.disconnect(); }
    }, []);

    return (
        <div className='pageContainer topStreamsContainer scroll'>
            {
                streams.map(stream =>
                    <LiveStreamItem key={stream.id} stream={stream} followed={false} />)
            }
            <div style={{ height: '3px', width: '100%' }} ref={observeElement}></div>
        </div>
    );
};

export default TopStreams;