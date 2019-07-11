import * as React from "react";
import { useState } from "react";
import { JanelinhaEvent } from "../app_functions/WSEventInfo_interfaces";
import { JanelinhaEventInfo } from "../app_functions/wsevents";
import css from './janelinha_event.module.css';

export const JanelinhaEventsLog = (props: any) => {

    const [events, setEvents] = useState<JanelinhaEvent[]>([])

    React.useEffect(() => {
        const action = (e) => {
            console.log(e.detail)
            setEvents((state) => [...state, e.detail])
        }
        window.addEventListener(JanelinhaEventInfo.tipo, action)
        return () => window.removeEventListener(JanelinhaEventInfo.tipo, action)
    })

    return (
        <section className="container">

            {events.map((e: JanelinhaEvent) =>

                <div key={`${e.processoImpuro}${e.fase}${e.janId}`} className={css.event}>
                    <span className="spanbase janid">
                        {e.janId}
                    </span>
                    <span className="spanbase proc">
                        {e.processoImpuro}
                    </span>
                    <span className="spanbase janid">
                        {e.fase}
                    </span>
                    <span className="spanbase janid">
                        {e.descricao}
                    </span>
                </div>
            )}


        </section>
    )
}