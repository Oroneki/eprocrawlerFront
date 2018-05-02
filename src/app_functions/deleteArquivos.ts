
import { postData } from './postData';

export const deleteArquivos = (thiscomponent, url: string) => async (data: string) => {
    console.log('post', url, 'data->', data);
    let jeisum = await postData(url, data) as {certo: string[], errado: string[]} | null;
    if (!jeisum) {
        return null;
    }
    const {certo, errado} = jeisum;
    certo.forEach(
        proc => thiscomponent.state.manejar('deletou', proc)
    );
    errado.forEach(
        proc => thiscomponent.state.manejar('falhou', proc)
    );
    return jeisum;
};
