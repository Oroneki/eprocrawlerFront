import App from '../App';

export const handleWebsocket = (self: App) => (tipo: string, payload: string) => {
    if (!self.ws) {
        self.ws = new WebSocket(`ws://localhost:${self.props.portServer}/ws`);
        self.ws.onopen = function(e: MessageEvent) {
            console.log('Connexão com o Websocket Ativa: ', e);
        };
        self.ws.onclose = function(e: CloseEvent) {
            console.log('Connexão com o Websocket FECHADA: ', e);
        };
        self.ws.onerror = function(e: Event) {
            console.error('Websocket ERROR: ', e);
        };
        self.ws.onmessage = handleWebsocketMessages;
    }
    self.ws.send(
        JSON.stringify({
            tipo,
            payload,
        })
    );
};

function handleWebsocketMessages(e: MessageEvent) {
    console.log('Websocket Msg: ', e);
    const obj = JSON.parse(e.data);
    switch (obj.tipo) {
        case 'sida_resp':
            console.log('SIDA EVENT');
            console.log(obj.payload.split('\n'));
            break;    
        default:
            break;
    }
}