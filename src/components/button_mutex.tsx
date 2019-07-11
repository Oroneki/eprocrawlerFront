import * as React from "react";
import { useState } from "react";

export const ButtonMutex = (props: { portServer: string }) => {

    const [isLocked, setIsLocked] = useState(false)

    const endPoint = () => {
        fetch(`http://localhost:${props.portServer}/toggle_lock`)
            .then(res => res.json())
            .then(f => {
                console.log('BUTTON LOCK RES:', f);
                setIsLocked(!isLocked);
            })
            .catch(e => console.error('ERROR ', e))
    }

    return (
        <button onClick={endPoint} className="button mutex" style={{ width: '280px' }}>
            Toggle Mutex {isLocked ? "(paused)" : ""}
        </button>
    )
}