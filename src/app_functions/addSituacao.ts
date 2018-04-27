import App from '../App';

export const addSituacao = (self: App) => (ev) => {
  console.log('addSitucao', ev);
  if (!(ev.nativeEvent.keyCode === 13 || ev.nativeEvent.keyCode === 27)) {
    return;
  }
  if (ev.nativeEvent.keyCode === 27) {
    self.setState(
      { showInput: false },
      self.focaNaDivPricincipal
    );
  }
  let novo = (self.input as HTMLInputElement).value.toUpperCase();
  self.setState(
    (s) => {
      let destinosNovos: string[] = s.destinos;
      if (!(s.destinos.find((dst) => dst === novo))) {
        destinosNovos = destinosNovos.concat(novo);
      }
      // self.colecao[s.selecionado].focus();
      return {
        ...s,
        situacao:
          {
            ...s.situacao,
            [s.selecionado]: novo
          },
        showInput: false,
        destinos: destinosNovos,
      };
    },
    self.focaNaDivPricincipal
  );
};