import React, { useState, useEffect } from 'react';
import { requestPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';
import * as Permissions from 'expo-permissions';

export default (shouldTrack, callback) => {
    const [err, setErr] = useState(null);

    useEffect(() => {
        let subscriber;

        const startWatching = async () => {
            try{
                const location = await Permissions.askAsync(Permissions.LOCATION)
                if (location.status !== 'granted') {
                    setErr('error')
                }
                subscriber = await watchPositionAsync(
                    {
                        accuracy: Accuracy.BestForNavigation,
                        timeInterval: 1000,
                        distanceInterval: 10
                    },
                    callback
                );
            } catch(err) {
                setErr(err);
            }
        };

        if(shouldTrack) {
            startWatching();
        } else {
            if(subscriber){
                subscriber.remove();
            }
            subscriber = null;
        }

        return () => {
            if(subscriber){
                subscriber.remove();
            }
        };
    }, [shouldTrack, callback]);

    return [err];
};