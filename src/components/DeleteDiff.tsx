import * as React from "react";

import { useContext } from "react";
import Context from "../context";

export const DeleteDiff = (props: { deleteFiles: any }) => {
    const context = useContext(Context)
    const [show, setShow] = React.useState<Boolean>(false)
    const diff2 = new Set(
        [...context.downloaded].filter(x => !new Set(context.processosList).has(x)));
    console.log('%c    difs      -> ', 'background-color: deeppurple', diff2)

    const pld = [...diff2].join(',')
    const deleteFiles = () => {
        console.log('deleting... ', diff2.size, ' files')
        console.log('', pld)
        props.deleteFiles(pld)
            .then(res => {
                console.log(res)
                setShow(false)
            })
            .catch(e => console.error(e))
    }

    return diff2.size > 1 ? (
        <div>
            <button onClick={() => setShow(!show)} className="button is-small is-fullwidth">
                {show ? 'close' : 'DELETE DIFF'}
            </button>
            {show && <span>{pld}</span>}
            {show && <button onClick={deleteFiles} className="button is-small is-danger is-fullwidth">
                CONFIRMA DELETE ?
            </button>}
        </div>
    ) : null
}